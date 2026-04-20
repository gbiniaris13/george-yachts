// One-click unsubscribe endpoint for The George Yachts Journal.
//
// URL shape:   /api/newsletter/unsubscribe?e=<email>&t=<hmac-short>
//
// - Verifies the HMAC token against NEWSLETTER_UNSUB_SECRET (falls
//   back to CRON_SECRET so we never silently accept unsigned hits)
// - Removes the email from the KV subscriber set
// - Returns a minimal black-and-gold confirmation page
// - Also accepts POST for RFC 8058 one-click clients
//
// Idempotent — re-visiting the same link after a successful removal
// still shows "you are unsubscribed".

import { NextResponse } from "next/server";
import crypto from "crypto";
import { kvSrem } from "@/lib/kv";

export const dynamic = "force-dynamic";

const SUBSCRIBERS_SET = "newsletter:subscribers";
const SECRET =
  process.env.NEWSLETTER_UNSUB_SECRET ||
  process.env.CRON_SECRET ||
  "change-me";

function validToken(email, token) {
  if (!email || !token) return false;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 24);
  // constant-time compare
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token)
    );
  } catch {
    return false;
  }
}

function page({ title, body }) {
  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background:#000; color:#fff; font-family:Georgia, serif; min-height:100vh; display:flex; align-items:center; justify-content:center;">
  <div style="max-width:520px; margin:0 auto; padding:48px 32px; text-align:center; border:1px solid rgba(218,165,32,0.25);">
    <p style="margin:0 0 14px; font-family:'Montserrat',Arial,sans-serif; font-size:9px; letter-spacing:0.55em; text-transform:uppercase; color:#DAA520; font-weight:600;">
      George Yachts Journal
    </p>
    <h1 style="margin:0 0 18px; font-family:Georgia,serif; font-size:30px; font-weight:300; letter-spacing:0.01em; color:#fff;">
      ${title}
    </h1>
    <p style="margin:0 0 28px; font-family:Georgia,serif; font-size:16px; line-height:1.7; color:rgba(255,255,255,0.7); font-weight:300;">
      ${body}
    </p>
    <a href="https://georgeyachts.com" style="display:inline-block; padding:12px 26px; font-family:'Montserrat',Arial,sans-serif; font-size:10px; letter-spacing:0.28em; text-transform:uppercase; color:#DAA520; text-decoration:none; border:1px solid rgba(218,165,32,0.45);">
      Return to georgeyachts.com
    </a>
  </div>
</body></html>`;
}

async function handle(email, token) {
  if (!email || !token || !validToken(email, token)) {
    return new NextResponse(
      page({
        title: "Link expired",
        body:
          "This unsubscribe link is invalid or no longer valid. If you'd like to be removed, please reply to our last email with the word &ldquo;unsubscribe&rdquo; and we'll take care of it by hand.",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  await kvSrem(SUBSCRIBERS_SET, email.toLowerCase()).catch(() => {});

  return new NextResponse(
    page({
      title: "You are unsubscribed",
      body:
        "We've removed your address from The George Yachts Journal. We're sorry to see you go &mdash; fair winds, wherever they take you.",
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  return handle(searchParams.get("e"), searchParams.get("t"));
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  return handle(searchParams.get("e"), searchParams.get("t"));
}
