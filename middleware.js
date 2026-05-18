// middleware.js
// =============================================================
// Edge middleware — soft auth gate for The Cabin.
//
// Strategy: this middleware only checks whether a session cookie
// is *present*. The actual session validity (KV lookup) is done
// inside the page (server component) when it reads the session.
// This keeps the middleware fast (no KV calls) and the validation
// authoritative (re-checked on every page render).
//
// Behaviour:
//   /cabin              — must have cookie → else redirect to /cabin/login
//   /cabin/login        — pass through always
//   /cabin/auth/*       — pass through (handled by API routes)
//   /api/cabin/auth/*   — pass through (cookie set/cleared here)
//   /api/cabin/*        — must have cookie → else 401 (handled by routes)
//   /cabin/manifest.webmanifest, /cabin/icons/*  — public PWA assets
//
// This middleware runs ONLY for paths matching the matcher
// config at the bottom, so non-cabin pages of the marketing site
// are completely unaffected.
// =============================================================

import { NextResponse } from "next/server";

const SESSION_COOKIE = "gy_cabin_session";

const PUBLIC_PATHS = [
  "/cabin/login",
  "/cabin/manifest.webmanifest",
];

const PUBLIC_PREFIXES = [
  "/cabin/icons/",
  "/cabin/share/",           // tokenized read-only preference sheet
                              // for captains, chefs, owners — auth via
                              // the token in the URL, not the cookie
  "/api/cabin/auth/",        // request-link, verify, logout
  // Admin routes called server-to-server from gy-command. They
  // authenticate with the x-cabin-admin-secret header, not the
  // gy_cabin_session cookie. Without this whitelist, the cookie
  // gate above blocks them with "auth-required" before they reach
  // the route handler that would have accepted the secret.
  "/api/cabin/admin/",
];

function isPublic(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public routes pass through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Everything else under /cabin or /api/cabin requires a session cookie
  const hasCookie = req.cookies.has(SESSION_COOKIE);
  if (hasCookie) {
    // Slide the cookie's Max-Age every visit so guests stay signed in
    // for a year-from-last-visit, not a year-from-first-magic-link.
    // We can't validate the session here (KV lookup would slow Edge)
    // — readSessionFromCookies() inside the page does that.
    const res = NextResponse.next();
    const existing = req.cookies.get(SESSION_COOKIE);
    if (existing?.value) {
      res.cookies.set({
        name: SESSION_COOKIE,
        value: existing.value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 365 * 24 * 3600,
      });
    }
    return res;
  }

  // For API routes, return 401 JSON instead of redirecting
  if (pathname.startsWith("/api/cabin/")) {
    return new NextResponse(
      JSON.stringify({ ok: false, error: "auth-required" }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }

  // For page routes, redirect to login
  const url = req.nextUrl.clone();
  url.pathname = "/cabin/login";
  url.searchParams.set("e", "auth-required");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/cabin/:path*",
    "/api/cabin/:path*",
  ],
};
