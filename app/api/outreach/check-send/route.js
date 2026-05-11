// Cross-bot outreach dedup + delivery bookkeeping + business-hours
// safety net.
//
// WHY: George's Apps Script bot and Eleanna's Apps Script bot send in
// parallel. Without a shared memory, they both had no idea when the
// other had already contacted the same email — so a Dallas travel
// agency got TWO different pitches from two different "employees" of
// the same brokerage within days. Embarrassing.
//
// HOW: Every bot calls this endpoint BEFORE sending. We look up the
// email in a single shared Upstash KV set `outreach:all-sent`:
//   • if already registered → return 409 (bot skips)
//   • if new               → register it and return 200 (bot sends)
// Either way we log a delivery record to `outreach:deliveries` so the
// daily summary can report "sent today / cross-bot skipped / opens /
// bounces" with real numbers — replacing the per-bot counters that
// didn't know about each other.
//
// 2026-05-11 — Boss-flagged "emails arriving 4 AM recipient time"
// bug. Even though the bots have their own country-aware business-
// hours gate, we add a SERVER-SIDE safety net here so that even a
// misconfigured / older Apps Script can't accidentally send to a US
// recipient at Athens midnight. Bot may optionally send `country` in
// the request body — if present and the local time is outside the
// recipient-business-hours window, we refuse the send (HTTP 423) and
// do NOT register the email as sent. The bot's next-cycle retry then
// succeeds when the local window opens. If country is absent we keep
// the legacy behaviour (server treats it as "trust the bot") so old
// Apps Script versions don't break overnight.
//
// AUTH: bearer token (OUTREACH_SECRET). Same token the Apps Scripts
// already use to poll `/api/track/opens`.

import { kvSadd, kvGet, kvSet, kvLpush, kvSismember } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

// ─── Server-side business-hours safety net (2026-05-11) ────────────
//
// Mirror of the bots' country→timezone map. Kept INTENTIONALLY in
// sync with the .gs files. When a bot sends `country` in the body,
// we resolve to an IANA tz; if outside 10:30-15:30 local (or lunch
// 13-14, or weekend, or unknown country), we refuse the send and the
// bot retries next cycle. ALWAYS fail closed when country is unknown
// (returns null below) — Boss directive: "never guess timezone".

const COUNTRY_TZ_MAP = {
  // Europe
  greece: 'Europe/Athens', gr: 'Europe/Athens',
  uk: 'Europe/London', 'united kingdom': 'Europe/London', england: 'Europe/London', scotland: 'Europe/London', wales: 'Europe/London',
  france: 'Europe/Paris', fr: 'Europe/Paris',
  germany: 'Europe/Berlin', de: 'Europe/Berlin', deutschland: 'Europe/Berlin',
  italy: 'Europe/Rome', it: 'Europe/Rome', italia: 'Europe/Rome',
  spain: 'Europe/Madrid', es: 'Europe/Madrid',
  portugal: 'Europe/Lisbon', pt: 'Europe/Lisbon',
  netherlands: 'Europe/Amsterdam', nl: 'Europe/Amsterdam', holland: 'Europe/Amsterdam',
  belgium: 'Europe/Brussels', be: 'Europe/Brussels',
  switzerland: 'Europe/Zurich', ch: 'Europe/Zurich',
  austria: 'Europe/Vienna', at: 'Europe/Vienna',
  sweden: 'Europe/Stockholm', se: 'Europe/Stockholm',
  norway: 'Europe/Oslo', no: 'Europe/Oslo',
  denmark: 'Europe/Copenhagen', dk: 'Europe/Copenhagen',
  finland: 'Europe/Helsinki', fi: 'Europe/Helsinki',
  poland: 'Europe/Warsaw', pl: 'Europe/Warsaw',
  ireland: 'Europe/Dublin', ie: 'Europe/Dublin',
  croatia: 'Europe/Zagreb', hr: 'Europe/Zagreb',
  cyprus: 'Asia/Nicosia',
  monaco: 'Europe/Monaco',
  malta: 'Europe/Malta',
  turkey: 'Europe/Istanbul', tr: 'Europe/Istanbul',
  // Middle East
  uae: 'Asia/Dubai', 'united arab emirates': 'Asia/Dubai', dubai: 'Asia/Dubai',
  'saudi arabia': 'Asia/Riyadh',
  qatar: 'Asia/Qatar',
  israel: 'Asia/Jerusalem', il: 'Asia/Jerusalem',
  egypt: 'Africa/Cairo', eg: 'Africa/Cairo',
  // Americas
  usa: 'America/New_York', 'united states': 'America/New_York', us: 'America/New_York',
  'usa east': 'America/New_York', 'usa west': 'America/Los_Angeles',
  'new york': 'America/New_York', california: 'America/Los_Angeles',
  texas: 'America/Chicago', florida: 'America/New_York',
  canada: 'America/Toronto', ca: 'America/Toronto',
  mexico: 'America/Mexico_City', mx: 'America/Mexico_City',
  brazil: 'America/Sao_Paulo', br: 'America/Sao_Paulo',
  // Asia Pacific
  china: 'Asia/Shanghai', cn: 'Asia/Shanghai',
  japan: 'Asia/Tokyo', jp: 'Asia/Tokyo',
  singapore: 'Asia/Singapore', sg: 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong', hk: 'Asia/Hong_Kong',
  india: 'Asia/Kolkata', in: 'Asia/Kolkata',
  australia: 'Australia/Sydney', au: 'Australia/Sydney',
  'new zealand': 'Pacific/Auckland', nz: 'Pacific/Auckland',
  // Africa
  'south africa': 'Africa/Johannesburg', za: 'Africa/Johannesburg',
};

function tzForCountry(raw) {
  if (!raw) return null;
  const c = String(raw).toLowerCase().trim();
  if (COUNTRY_TZ_MAP[c]) return COUNTRY_TZ_MAP[c];
  // Fuzzy: same logic as the bot — first key that contains-or-is-contained.
  for (const k of Object.keys(COUNTRY_TZ_MAP)) {
    if (c.indexOf(k) !== -1 || k.indexOf(c) !== -1) return COUNTRY_TZ_MAP[k];
  }
  return null;
}

// Extract local hour/minute/weekday for a tz at "now". Intl is fast
// enough for one call per check-send; no library needed.
function localTimeAt(tz) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short', // Mon, Tue, ...
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = f.formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const dowMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return {
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
    dow: dowMap[get('weekday')] || 0,
  };
}

// Returns { ok, reason }. Mirrors the bot's checkBusinessHours_ logic.
// 2026-05-11 update: unknown country FALLS BACK to Athens business
// hours (Boss directive — send at sender's office time when we don't
// know the recipient's tz, instead of refusing the send forever).
function checkRecipientHours(country) {
  let tz = tzForCountry(country);
  if (!tz) tz = 'Europe/Athens'; // fallback
  const { hour, minute, dow } = localTimeAt(tz);

  // Sat/Sun/Mon — never.
  if (dow === 6 || dow === 7 || dow === 1) {
    return { ok: false, reason: 'weekend_or_monday' };
  }
  // Friday — morning only, 10:30-12:00.
  if (dow === 5) {
    if (hour < 10) return { ok: false, reason: 'too_early_friday' };
    if (hour === 10 && minute < 30) return { ok: false, reason: 'too_early_friday' };
    if (hour >= 12) return { ok: false, reason: 'too_late_friday' };
    return { ok: true, reason: 'ok_friday_morning' };
  }
  // Lunch — 13:00-14:00 local.
  if (hour >= 13 && hour < 14) return { ok: false, reason: 'lunch_hour' };
  // Tue-Thu — 10:30 to 15:30 local.
  if (hour < 10) return { ok: false, reason: 'too_early' };
  if (hour === 10 && minute < 30) return { ok: false, reason: 'too_early' };
  if (hour >= 16) return { ok: false, reason: 'too_late' };
  if (hour === 15 && minute >= 30) return { ok: false, reason: 'too_late' };
  return { ok: true, reason: 'ok' };
}

export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected =
    process.env.OUTREACH_SECRET || process.env.CRON_SECRET;
  if (!expected || token !== expected) return unauthorized();

  let body = {};
  try {
    body = await request.json();
  } catch {}
  const emailRaw = String(body.email || '').trim().toLowerCase();
  const bot = String(body.bot || 'unknown').slice(0, 16);
  const stage = String(body.stage || 'email1').slice(0, 16);
  const country = String(body.country || '').trim().slice(0, 64);

  if (!emailRaw || !emailRaw.includes('@') || emailRaw.length > 200) {
    return new Response(
      JSON.stringify({ error: 'invalid email' }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  // ── Server-side business-hours safety net (2026-05-11) ────────
  // If the bot sent us a country field, we cross-check the recipient
  // local time. Outside the window → refuse the send (HTTP 423) and
  // DO NOT register as sent — so the bot retries next cycle. Country
  // missing/empty (older bot version) → fall through to legacy
  // behaviour ("trust the bot") so we don't break overnight.
  if (country) {
    const window = checkRecipientHours(country);
    if (!window.ok) {
      // Telemetry — log the deferral so the daily summary sees it.
      kvLpush(
        'outreach:deliveries',
        JSON.stringify({
          email: emailRaw, bot, stage, country,
          status: 'skipped_outside_hours', reason: window.reason,
          ts: Date.now(),
        })
      ).catch(() => {});
      return new Response(
        JSON.stringify({
          duplicate: false,
          defer: true,
          reason: window.reason,
          message:
            'Outside recipient business hours (' + window.reason +
            '). Bot should skip and retry on next cycle. Email NOT registered as sent.',
        }),
        {
          status: 423, // 423 Locked — "the resource is locked, try later"
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }

  // Hard-stop: unsubscribed or bounced addresses are never contacted
  // again, regardless of which bot is asking.
  const unsub = await kvSismember('outreach:unsubscribed', emailRaw);
  if (unsub === 1) {
    kvLpush(
      'outreach:deliveries',
      JSON.stringify({
        email: emailRaw, bot, stage,
        status: 'skipped_unsubscribed', ts: Date.now(),
      })
    ).catch(() => {});
    return new Response(
      JSON.stringify({ duplicate: true, sentBy: 'unsubscribed' }),
      { status: 409, headers: { 'content-type': 'application/json' } }
    );
  }
  const bounced = await kvSismember('outreach:bounced', emailRaw);
  if (bounced === 1) {
    kvLpush(
      'outreach:deliveries',
      JSON.stringify({
        email: emailRaw, bot, stage,
        status: 'skipped_bounced', ts: Date.now(),
      })
    ).catch(() => {});
    return new Response(
      JSON.stringify({ duplicate: true, sentBy: 'bounced' }),
      { status: 409, headers: { 'content-type': 'application/json' } }
    );
  }

  // KV set: returns 1 if new, 0 if already there.
  const added = await kvSadd('outreach:all-sent', emailRaw);
  const isNew = added === 1;

  // Remember who claimed this address first (for telemetry + Telegram).
  if (isNew) {
    await kvSet(
      `outreach:owner:${emailRaw}`,
      JSON.stringify({ bot, stage, ts: Date.now() })
    );
  }
  const ownerRaw = await kvGet(`outreach:owner:${emailRaw}`);
  let owner = null;
  try {
    owner = ownerRaw ? JSON.parse(ownerRaw) : null;
  } catch {}

  // Log every call (send or skip) for the daily delivery report.
  kvLpush(
    'outreach:deliveries',
    JSON.stringify({
      email: emailRaw,
      bot,
      stage,
      status: isNew ? 'sent' : 'skipped_duplicate',
      owner: owner?.bot || null,
      ts: Date.now(),
    })
  ).catch(() => {});

  return new Response(
    JSON.stringify({
      duplicate: !isNew,
      sentBy: owner?.bot || null,
      sentAt: owner?.ts || null,
    }),
    {
      status: isNew ? 200 : 409,
      headers: { 'content-type': 'application/json' },
    }
  );
}
