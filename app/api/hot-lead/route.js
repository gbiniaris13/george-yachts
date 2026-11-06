// Hot lead ping from VisitorBeacon: a visitor opened 3+ yacht pages.
// Since 2026-11-06 the Telegram alert for this comes from /api/track only.
//
// 2026-05-11 — Added validation + rate limiting. Previously the
// endpoint fired a Telegram alert on ANY POST including empty {}
// so anyone could trigger spurious 'HOT LEAD' notifications by
// curl-ing the endpoint. Now requires >=3 valid yacht slugs
// (matching the client-side threshold in VisitorBeacon.jsx) and
// caps real visitors at 3 alerts per IP per hour.

export const runtime = 'edge';


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

    // 2026-11-06: this route no longer sends its own Telegram alert.
    // The same moment (third yacht opened) already raises the fuller
    // "HOT LEAD DETECTED" card from /api/track, with score, network,
    // source and trail, so George was getting two alerts for one person.
    // This one could not tell a person from a crawler either. The route
    // still validates and answers, so the page script is unchanged.
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
