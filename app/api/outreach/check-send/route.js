// Cross-bot outreach dedup + delivery bookkeeping.
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
// 2026-06-05 — HIGH SEASON. The server-side business-hours safety net
// (added 2026-05-11) was REMOVED. Sending hours are now owned solely by
// the Apps Script bots (7 days/week, 09:00-18:00 recipient-local with
// Athens fallback for unknown countries). This endpoint now only does
// cross-bot dedup + unsubscribe/bounce hard-stops + telemetry. Hours
// can be tuned in the .gs files alone, with no Vercel redeploy.
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

  if (!emailRaw || !emailRaw.includes('@') || emailRaw.length > 200) {
    return new Response(
      JSON.stringify({ error: 'invalid email' }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  // ── Business-hours gate REMOVED 2026-06-05 (high season) ──────
  // Hours are enforced exclusively by the bots' client-side
  // checkBusinessHours_ (7/7, 09:00-18:00 local, Athens fallback).
  // The server no longer defers on time-of-day.

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
