// Called by Apps Script `checkBounces()` when Gmail finds a
// mailer-daemon bounce for a prospect we already contacted. We add
// the address to `outreach:bounced` (shared across both bots) and
// drop a delivery event so the dashboard + health endpoints pick
// it up.
//
// Idempotent: calling twice does not increment a counter.

import { kvSadd, kvLpush } from '@/lib/kv';

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
  try { body = await request.json(); } catch {}
  const email = String(body.email || '').toLowerCase().trim();
  const bot = String(body.bot || 'unknown').slice(0, 16);

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'invalid email' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const added = await kvSadd('outreach:bounced', email);
  if (added === 1) {
    kvLpush(
      'outreach:deliveries',
      JSON.stringify({ email, bot, status: 'bounced', ts: Date.now() })
    ).catch(() => {});
  }

  return new Response(
    JSON.stringify({ ok: true, first: added === 1 }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
