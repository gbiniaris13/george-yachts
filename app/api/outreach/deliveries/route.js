// Delivery report feed for the Apps Script daily summaries.
//
// Returns the list of delivery records pushed by
// /api/outreach/check-send since a given timestamp (millis). Both
// Apps Script bots poll this around 22:00 Athens so their Telegram
// summaries can show combined numbers ("sent / cross-bot skipped /
// opens / bounces") instead of bot-local counters that don't see
// each other.
//
// Auth: bearer OUTREACH_SECRET (same as /api/outreach/check-send and
// /api/track/opens).

import { kvLrange } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected =
    process.env.OUTREACH_SECRET || process.env.CRON_SECRET;
  if (!expected || token !== expected) return unauthorized();

  const url = new URL(request.url);
  const since = parseInt(url.searchParams.get('since') || '0', 10);

  // Pull the newest 2000 entries (plenty for a daily window).
  const raw = (await kvLrange('outreach:deliveries', 0, 1999)) || [];
  const all = raw
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const recent = since
    ? all.filter((r) => r.ts && r.ts >= since)
    : all;

  // Per-bot roll-up so the Apps Script doesn't have to re-aggregate.
  const byBot = {};
  for (const r of recent) {
    const k = r.bot || 'unknown';
    const b =
      byBot[k] || (byBot[k] = { sent: 0, skipped_duplicate: 0 });
    if (r.status === 'sent') b.sent += 1;
    else if (r.status === 'skipped_duplicate') b.skipped_duplicate += 1;
  }

  return new Response(
    JSON.stringify({
      count: recent.length,
      byBot,
      records: recent,
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
