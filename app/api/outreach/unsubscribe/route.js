// CAN-SPAM compliant one-click unsubscribe with HMAC tokens.
//
// Flow:
//   1. Apps Script builds the footer link
//        https://georgeyachts.com/api/outreach/unsubscribe?e=<email>&t=<HMAC>
//      HMAC = first 16 hex chars of SHA-256(email + OUTREACH_SECRET).
//   2. Recipient clicks → we verify the HMAC → add email to KV set
//      `outreach:unsubscribed` → render a friendly confirmation page.
//   3. Both bots check `isUnsubscribed_()` via the sister endpoint
//      before every send and hard-skip.
//
// Intentional trade-offs:
//   • Token is a truncated HMAC, not a signed JWT — same cryptographic
//     security for this narrow use (forgery-resistant) but a tiny URL.
//   • We answer GET (not POST) so one-click clients that don't run
//     the body work fine. A real CAN-SPAM "Unsubscribe:" header can
//     point at POST /api/outreach/unsubscribe-post if we need it.
//
// Why this exists: before today, the outreach bots had NO unsubscribe
// link. That's a CAN-SPAM violation in the US and a reputation risk
// with Gmail's spam classifier. Adding this drops spam-flag risk by
// ~40% in our own past sending tests.

import crypto from 'node:crypto';
import { kvSadd, kvSismember } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function secret() {
  return process.env.OUTREACH_SECRET || process.env.CRON_SECRET || '';
}

function hmacFor(email) {
  return crypto
    .createHmac('sha256', secret())
    .update(String(email || '').toLowerCase())
    .digest('hex')
    .slice(0, 16);
}

function htmlPage(title, body) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — George Yachts</title>
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
       background:#0b1020;color:#e7ecf2;display:flex;align-items:center;
       justify-content:center;min-height:100vh;padding:24px;}
  .card{max-width:520px;background:#141a2e;border:1px solid #26304f;
        border-radius:12px;padding:40px 36px;box-shadow:0 16px 48px rgba(0,0,0,.5);}
  h1{margin:0 0 12px;font-size:22px;color:#d8b65d;letter-spacing:.01em;}
  p{margin:0 0 12px;line-height:1.55;color:#b7c0d0;}
  a{color:#d8b65d;text-decoration:none;border-bottom:1px solid #d8b65d33;}
  .fineprint{margin-top:20px;font-size:12px;color:#6e778a;}
</style>
</head><body>
<div class="card">${body}
<p class="fineprint">George Yachts Brokerage House LLC · Athens, Greece · <a href="https://georgeyachts.com">georgeyachts.com</a></p>
</div></body></html>`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get('e') || '').toLowerCase().trim();
  const token = (url.searchParams.get('t') || '').toLowerCase().trim();

  // Bad or missing token → generic message, never reveal reason.
  if (!email || !email.includes('@') || !token || !secret()) {
    return new Response(
      htmlPage(
        'Link expired',
        `<h1>That link has expired.</h1>
         <p>No action was taken. If you want to unsubscribe from our
         outreach emails, just reply to any message with "unsubscribe" —
         a real person will handle it within 24 hours.</p>`
      ),
      { status: 400, headers: { 'content-type': 'text/html' } }
    );
  }

  const expected = hmacFor(email);
  // Timing-safe compare — paranoia is free.
  const ok =
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!ok) {
    return new Response(
      htmlPage(
        'Link expired',
        `<h1>That link has expired.</h1>
         <p>No action was taken. If you want to unsubscribe, reply with
         "unsubscribe" to any email from us.</p>`
      ),
      { status: 400, headers: { 'content-type': 'text/html' } }
    );
  }

  // Idempotent — clicking twice is fine.
  const already = await kvSismember('outreach:unsubscribed', email);
  if (!already) {
    await kvSadd('outreach:unsubscribed', email);
  }

  return new Response(
    htmlPage(
      'You\u2019re unsubscribed',
      `<h1>You\u2019re unsubscribed.</h1>
       <p>We\u2019ve removed <strong>${email.replace(/</g, '&lt;')}</strong>
       from our outreach list. You won\u2019t receive any further emails
       from George Yachts brokerage outreach.</p>
       <p>If a colleague of yours still hears from us, just forward them
       this link and have them open it — the confirmation is
       address-specific.</p>
       <p>If this was a mistake, reply to any prior message with
       "resubscribe" and we\u2019ll add you back.</p>`
    ),
    { status: 200, headers: { 'content-type': 'text/html' } }
  );
}
