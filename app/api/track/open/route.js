// Outreach email open-tracking pixel.
//
// Flow:
//   1. The Apps Script outreach bot embeds <img src=".../api/track/open?t=<id>">
//      at the bottom of every outbound email (Email 1 + both follow-ups).
//   2. When the recipient's client loads the image, this handler fires.
//   3. We push a small JSON record onto an Upstash KV list:
//        outreach:opens  ⇐  { id, ts, ua, ip }
//   4. The Apps Script cron `syncOpens()` pulls new entries every 30 min
//      from /api/track/opens and updates the Google Sheet + sends
//      Telegram notifications on first open per email.
//
// We always return a 1×1 transparent GIF so the email client stays happy
// — even when KV is unreachable. Nothing here should block the pixel
// response on a slow third party.

import { kvLpush } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 1×1 transparent GIF (43 bytes, base64). Inlined to avoid a filesystem
// hit on every open.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

const PIXEL_HEADERS = {
  "Content-Type": "image/gif",
  "Content-Length": String(PIXEL.byteLength),
  "Cache-Control":
    "private, no-store, no-cache, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  // Tell email client proxies not to hang on to the pixel.
  "Access-Control-Allow-Origin": "*",
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("t");
    if (id && id.length <= 64) {
      const payload = JSON.stringify({
        id,
        ts: Date.now(),
        ua:
          (request.headers.get("user-agent") || "").slice(0, 200) || null,
        country: request.headers.get("x-vercel-ip-country") || null,
      });
      // Fire-and-forget; the pixel response must not wait on KV.
      kvLpush("outreach:opens", payload).catch(() => {});
    }
  } catch {
    /* never block the pixel */
  }
  return new Response(PIXEL, { status: 200, headers: PIXEL_HEADERS });
}

// HEAD requests land here too when some spam filters preflight the
// tracking URL. Return the same headers so they see a clean 200.
export async function HEAD() {
  return new Response(null, { status: 200, headers: PIXEL_HEADERS });
}
