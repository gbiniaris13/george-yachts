// Phase 5.3 — re-engagement click handler.
//
// User taps "Yes, keep sending" → browser loads this endpoint with
// HMAC-signed (email, sent_at) → we mark the reengagement record as
// clicked. The follow-up cron will never auto-unsubscribe a clicked
// record.
//
// Returns a brand-aligned HTML page so the click confirmation feels
// like the rest of the property, not a raw API response.

import { NextResponse } from "next/server";
import {
  verifyReengageToken,
  markReengagementClicked,
  getReengagementRecord,
} from "@/lib/newsletter/reengagement";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function htmlPage({ title, body, status = 200 }) {
  return new NextResponse(
    `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title} — George Yachts</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; background:#F8F5F0; color:#0D1B2A; margin:0; padding:48px 24px; }
  .card { max-width: 520px; margin: 0 auto; background:#fff; padding: 36px; border:1px solid #E5DFD3; }
  h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; letter-spacing: 0.04em; font-size: 28px; margin: 0 0 8px 0; }
  .gold { color:#C9A84C; font-size: 11px; text-transform: uppercase; letter-spacing: 0.32em; margin-bottom: 24px; }
  p { line-height: 1.7; }
</style></head>
<body><div class="card"><div class="gold">George Yachts · The Bridge</div><h1>${title}</h1>${body}</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("e") || "";
  const token = url.searchParams.get("t") || "";
  const sentAt = url.searchParams.get("s") || "";

  if (!email || !token || !sentAt) {
    return htmlPage({
      title: "Bad request",
      body: `<p>Missing parameters. This link should be opened from the re-engagement email.</p>`,
      status: 400,
    });
  }

  if (!verifyReengageToken(email, sentAt, token)) {
    return htmlPage({
      title: "Link expired or invalid",
      body: `<p>This re-engagement link could not be verified. If you'd like to stay on The Bridge, just reply to any of George's emails and we'll keep you on the list.</p>`,
      status: 401,
    });
  }

  const existing = await getReengagementRecord(email);
  if (!existing) {
    return htmlPage({
      title: "Already on the list",
      body: `<p>We don't have a re-engagement record for this address — you're already on the list, no action needed. Welcome aboard.</p>`,
    });
  }
  if (existing.completed) {
    return htmlPage({
      title: "Re-subscribed",
      body: `<p>This address was previously removed from the list. Hit reply to <a href="mailto:george@georgeyachts.com">george@georgeyachts.com</a> and we'll bring you back manually.</p>`,
    });
  }

  await markReengagementClicked(email);

  return htmlPage({
    title: "You're staying on",
    body: `<p>Thanks for the click. The Bridge will keep landing in your inbox every other Thursday from the Greek waters.</p>
<p>If you ever want to step off, the unsubscribe link at the bottom of every email is one click. No friction either direction.</p>
<p style="margin-top:32px;">— George</p>`,
  });
}
