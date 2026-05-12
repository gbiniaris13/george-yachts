// Hot Lead Alert — fires when a visitor views 3+ yacht pages in one session
// Sends urgent Telegram notification with yacht names and visitor country
//
// 2026-05-11 — Added validation + rate limiting. Previously the
// endpoint fired a Telegram alert on ANY POST including empty {}
// so anyone could trigger spurious 'HOT LEAD' notifications by
// curl-ing the endpoint. Now requires >=3 valid yacht slugs
// (matching the client-side threshold in VisitorBeacon.jsx) and
// caps real visitors at 3 alerts per IP per hour.

export const runtime = 'edge';

import { sendTelegram, getFlag, getCountryName, detectDevice, athensTime } from '@/lib/telegram';

// Edge in-memory rate buckets — instances reset frequently so this
// is defence-in-depth, not a guarantee. Combined with the >=3-yacht
// gate, it stops obvious abuse.
const buckets = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const b = buckets.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > b.resetAt) {
    b.count = 0;
    b.resetAt = now + WINDOW_MS;
  }
  b.count += 1;
  buckets.set(ip, b);
  return b.count > MAX_PER_WINDOW;
}

function isPlausibleSlug(s) {
  return typeof s === 'string' && /^[a-z0-9][a-z0-9-]{1,80}$/i.test(s);
}

export async function POST(request) {
  try {
    const country = request.headers.get('x-vercel-ip-country') || '??';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const ua = request.headers.get('user-agent') || '';
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

    let body = {};
    try { body = await request.json(); } catch {}

    const rawYachts = Array.isArray(body.yachts) ? body.yachts : [];
    const yachts = rawYachts.filter(isPlausibleSlug);
    // 2026-05-12 — JSON error responses to match the convention used
    // by inquiry/itinerary-save/proposal-generate. Was returning
    // plain-text 'Bad Request' / 'Rate limited' which broke JSON-
    // expecting clients.
    if (yachts.length < 3) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_input' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
        status: 429, headers: { 'Content-Type': 'application/json' },
      });
    }

    const flag = getFlag(country);
    const countryName = getCountryName(country);
    const device = detectDevice(ua);
    const time = athensTime();
    const cityStr = city ? ` — ${decodeURIComponent(city)}` : '';

    // Format yacht names nicely (remove slug format)
    const yachtNames = yachts.map(s =>
      s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    ).join(', ');

    const text = [
      `🔥 *HOT LEAD — George Yachts*`,
      ``,
      `${flag} *${countryName}*${cityStr}`,
      `${device}`,
      ``,
      `👀 Viewed *${yachts.length} yachts*:`,
      `${yachtNames}`,
      ``,
      `💡 _This visitor is seriously browsing. Consider reaching out!_`,
      `🕐 ${time} Athens time`,
    ].join('\n');

    await sendTelegram(text);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
