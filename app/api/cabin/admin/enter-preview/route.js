// app/api/cabin/admin/enter-preview/route.js
// =============================================================
// 2026-05-21 — Admin preview landing handler.
//
// Why a route handler (GET) instead of a page:
//   Server components in Next.js 15 can only READ cookies, never
//   write them. The cookie-setting MUST happen in a route handler
//   or a server action. Browser navigation to this URL triggers
//   a GET; we set both cookies on the response and 302 to /cabin.
//
// Flow:
//   CRM "Preview as customer" button
//     → POST /api/cabins/<id>/preview-session (CRM proxy)
//     → POST /api/cabin/admin/start-preview   (public site, mints token)
//     → window.open(<this URL with token>, "_blank")
//     → GET  /api/cabin/admin/enter-preview?token=…
//     → Set-Cookie gy_cabin_session + gy_cabin_preview
//     → 302 /cabin (the cabin shell renders the preview banner)
//
// On any failure we return a small standalone HTML page so the
// admin sees a clear error instead of being silently bounced to
// /cabin/login (which would be confusing — admins are NOT
// supposed to log into cabin sessions).
// =============================================================

import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import {
  SESSION_COOKIE,
  PREVIEW_COOKIE,
  sessionCookieOptions,
  previewCookieOptions,
} from "@/lib/cabin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorHtml(message) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow, noarchive" />
  <title>Cabin · preview unavailable</title>
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center;
      justify-content:center; padding:32px; background:#F8F5F0;
      color:#0D1B2A; font-family:system-ui, -apple-system, sans-serif; }
    .card { max-width:480px; text-align:center; }
    .eyebrow { font-size:10px; letter-spacing:2.5px; text-transform:uppercase;
      color:#9CA3AF; margin-bottom:12px; }
    h1 { font-family:Georgia, serif; font-size:24px; font-weight:400;
      margin:0 0 12px 0; }
    p { font-size:14px; line-height:1.6; color:#374151; margin:0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">Admin preview</div>
    <h1>Preview unavailable</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}

function errorResponse(message, status = 400) {
  return new NextResponse(errorHtml(message), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
    },
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return errorResponse("Missing preview token.");
  }

  // Validate the token by looking up the session blob in KV.
  // If it's missing or expired we render an error page rather
  // than blindly setting cookies that would resolve to nothing.
  let raw;
  try {
    raw = await kvGet(`cabin:session:${token}`);
  } catch {
    return errorResponse(
      "We couldn't reach the session store. Please try again in a moment.",
      503,
    );
  }
  if (!raw) {
    return errorResponse(
      "This preview link has expired or already been used. Open the cabin in the CRM and click Preview as customer again.",
      410,
    );
  }

  let session;
  try {
    session = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return errorResponse("This preview link is malformed.", 400);
  }
  if (!session?.preview_mode || (session.expires ?? 0) < Date.now()) {
    return errorResponse("This preview link is no longer valid.", 410);
  }

  // All clear. Set both cookies and 302 to /cabin. Note: the
  // origin matters — using new URL("/cabin", req.url) instead
  // of a raw relative string makes the redirect absolute and
  // robust against any reverse-proxy layer.
  const dest = new URL("/cabin", req.url);
  const res = NextResponse.redirect(dest, { status: 302 });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  res.cookies.set(PREVIEW_COOKIE, "1", previewCookieOptions());
  return res;
}
