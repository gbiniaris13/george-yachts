// Visitor ping: keeps the day counters in KV. Sends nothing to Telegram.
// Uses Vercel's free x-vercel-ip-country header for geo-detection
//
// 2026-05-12: added Telegram dedup (one alert per IP per 4 hours).
//
// 2026-11-06: the Telegram alert is gone from this route. George was
// getting two arrival messages for every visit: this one ("New Visitor")
// and the fuller card from /api/track. This one had no way to tell a
// person from a machine, so it also fired for every crawler: in the week
// before the change that was about a hundred messages a day, two thirds
// of them for Meta, Microsoft, Amazon and Google bots. The one arrival
// message now comes from /api/track, which knows the network, the device
// and the browser, and stays silent for machines.
//
// The counters stay: they cost nothing and other tools may read them.

export const runtime = 'edge';

import { kvIncr, kvHincrby, todayKey } from '@/lib/kv';

export async function POST(request) {
  try {
    const country = request.headers.get('x-vercel-ip-country') || '??';

    let body = {};
    try { body = await request.json(); } catch {}

    const page = body.page || '/';
    const referrer = body.referrer || 'Direct';
    const date = todayKey();

    await Promise.allSettled([
      kvIncr(`stats:${date}:visitors`),
      kvHincrby(`stats:${date}:countries`, country),
      kvHincrby(`stats:${date}:pages`, page),
      kvHincrby(`stats:${date}:sources`, referrer),
    ]);

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('OK', { status: 200 });
  }
}
