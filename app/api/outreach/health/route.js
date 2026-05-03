// Outreach deliverability circuit-breaker.
//
// Both Apps Script bots call this at the top of sendOutreach every
// hour. We compute the rolling 24h bounce rate and a few other
// guard-rails. When any guard trips we set the KV flag
// `outreach:paused` and return { paused: true, reason }. The bots
// interpret `paused` as "write 'skip_paused' in the status column
// and don't call GmailApp.sendEmail until a human unpauses".
//
// Philosophy: prefer false positives. A silent half-hour of no-send
// because we bounced too much is cheaper than burning the domain's
// reputation. George can unpause manually with a single DELETE to
// /api/outreach/unpause (not wired yet; he can kvDel the key via
// the dashboard console if needed).
//
// Thresholds are conservative first-pass defaults:
//   • >5% bounce rate over last 24h (min 20 sends)  → pause
//   • >80 emails in last 1h across both bots        → pause
//   • >200 emails in last 24h across both bots      → pause

import { kvGet, kvSet, kvLrange } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const BOUNCE_RATE_LIMIT = 0.05;
const MIN_SENDS_FOR_BOUNCE_RATE = 20;
const MAX_SENDS_PER_HOUR = 80;
const MAX_SENDS_PER_DAY = 200;

function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

export async function GET(request) {
  // ROBERTO 2026-05-03 — EMERGENCY PAUSE.
  // George flagged that the IG account has been actioned by Meta and
  // the outreach email bots may also be on shaky ground. Hard-pause
  // BOTH outreach scripts (eleanna + george) until manually cleared.
  // Restore: delete this block + redeploy.
  return new Response(
    JSON.stringify({
      paused: true,
      reason: 'emergency_manual_2026-05-03',
      message:
        'Manually paused by Roberto on 2026-05-03 after IG account ' +
        'flagged by Meta. Restore by deleting the emergency block in ' +
        'app/api/outreach/health/route.js and redeploying.',
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );

  // eslint-disable-next-line no-unreachable
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected =
    process.env.OUTREACH_SECRET || process.env.CRON_SECRET;
  if (!expected || token !== expected) return unauthorized();

  // If a human has pre-paused, skip all computation and say so.
  const manualPause = await kvGet('outreach:paused');
  if (manualPause) {
    return new Response(
      JSON.stringify({
        paused: true,
        reason: 'manual',
        message: String(manualPause).slice(0, 200),
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  }

  const now = Date.now();
  const recent = (await kvLrange('outreach:deliveries', 0, 999)) || [];
  const events = recent
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter(Boolean);

  const sentsLastHour = events.filter(
    (r) => r.status === 'sent' && now - r.ts < HOUR
  ).length;
  const sentsLastDay = events.filter(
    (r) => r.status === 'sent' && now - r.ts < DAY
  ).length;
  // Bounces come from Apps Script's checkBounces via registerBounce
  // (added alongside this endpoint). They live in the same stream.
  const bouncesLastDay = events.filter(
    (r) => r.status === 'bounced' && now - r.ts < DAY
  ).length;
  const bounceRate =
    sentsLastDay >= MIN_SENDS_FOR_BOUNCE_RATE
      ? bouncesLastDay / sentsLastDay
      : 0;

  let paused = false;
  let reason = null;
  if (bounceRate > BOUNCE_RATE_LIMIT) {
    paused = true;
    reason = `bounce_rate_${(bounceRate * 100).toFixed(1)}pct`;
  } else if (sentsLastHour > MAX_SENDS_PER_HOUR) {
    paused = true;
    reason = `sends_per_hour_${sentsLastHour}`;
  } else if (sentsLastDay > MAX_SENDS_PER_DAY) {
    paused = true;
    reason = `sends_per_day_${sentsLastDay}`;
  }

  if (paused) {
    // Persist the auto-pause flag so even bots that don't re-check
    // health in the same request stay quiet. Expire it after 3h so
    // we recover automatically if it was a transient spike.
    await kvSet('outreach:paused', `auto:${reason}`, 3 * 60 * 60);
  }

  return new Response(
    JSON.stringify({
      paused,
      reason,
      stats: {
        sentsLastHour,
        sentsLastDay,
        bouncesLastDay,
        bounceRate: Number(bounceRate.toFixed(4)),
      },
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    }
  );
}
