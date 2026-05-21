// middleware.js
// =============================================================
// Edge middleware — soft auth gate for The Cabin + hard 404 gate
// for /admin/* and /api/admin/*.
//
// THE CABIN (/cabin, /api/cabin)
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
// ADMIN (/admin, /api/admin)  — added 2026-05-18 (security/admin-auth-gate)
//
// Before this change, /admin/kpis, /admin/ai-monitoring,
// /admin/haro-process all returned HTTP 200 to unauthenticated
// visitors. The page bodies were inert (key-paste form or
// "Unauthorised" chrome — no real KPI / monitoring data leaked
// because each page + each /api/admin/* route does its own
// server-side env-secret check). But:
//
//   1. The page chrome was crawlable. robots.js disallows /admin
//      for User-Agent: *, but the explicit Allow: / rules for
//      GPTBot / ClaudeBot / PerplexityBot etc. override the
//      wildcard disallow per RFC 9309. So AI bots were crawling
//      /admin/ai-monitoring etc. and could ingest the dashboard
//      titles into their indices.
//
//   2. "Looks like" surface for scrapers — anyone who landed on
//      /admin/kpis saw the form and knew there was a key to crack.
//
// The fix: when a request hits /admin/* or /api/admin/* without
// valid auth, return 404 (not 401, not a redirect — make the path
// look non-existent). Valid auth means any one of:
//   (a) `gy_admin_session` cookie present whose value matches one
//       of the known admin secrets (KPI_ADMIN_KEY, CRON_SECRET,
//       ADMIN_SECRET, CABIN_ADMIN_SECRET).
//   (b) `?token=<secret>` or `?key=<secret>` in the URL.
//   (c) `Authorization: Bearer <secret>` header.
//
// On a successful auth via (b) or (c), middleware sets the cookie
// so subsequent same-browser visits work without the URL param.
//
// This is defence-in-depth: the page handlers + the API handlers
// continue to check their own secrets too. We don't change them.
//
// This middleware runs ONLY for paths matching the matcher
// config at the bottom, so non-cabin / non-admin pages of the
// marketing site are completely unaffected.
// =============================================================

import { NextResponse } from "next/server";

const CABIN_COOKIE = "gy_cabin_session";
const ADMIN_COOKIE = "gy_admin_session";

// Cache the admin-secrets at module init. These come from process.env
// and never change for the lifetime of an edge worker.
function adminSecrets() {
  return [
    process.env.KPI_ADMIN_KEY,
    process.env.CRON_SECRET,
    process.env.ADMIN_SECRET,
    process.env.CABIN_ADMIN_SECRET,
  ].filter(Boolean);
}

// 2026-05-21 — Newsletter-scoped secrets.
//
// The CRM (command.georgeyachts.com) talks to a small set of
// `/api/admin/newsletter-*` endpoints using NEWSLETTER_PROXY_SECRET
// as the shared key. The route handlers themselves accept that
// secret (and the legacy NEWSLETTER_UNSUB_SECRET) — but until now
// the middleware ran first and 404'd anything that didn't match
// the master admin-secrets list, so the route handlers never got
// the request.
//
// This list is scoped: these secrets ONLY unlock the newsletter
// admin routes, never the powerful /admin/kpis, /admin/haro-process
// or AI-monitoring routes (those still require a master admin
// secret). Defence-in-depth is preserved.
function newsletterSecrets() {
  return [
    process.env.NEWSLETTER_PROXY_SECRET,
    process.env.NEWSLETTER_UNSUB_SECRET,
  ].filter(Boolean);
}

function isNewsletterAdminPath(pathname) {
  return pathname.startsWith("/api/admin/newsletter-");
}

// Headers we want on every /admin response — even authenticated ones
// — so a search engine or AI crawler that somehow lands on the page
// (despite robots.txt) is told not to index. Belt + suspenders with
// the per-page `robots: { index: false }` metadata.
const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function isCabinPublic(pathname) {
  const CABIN_PUBLIC_PATHS = [
    "/cabin/login",
    "/cabin/manifest.webmanifest",
  ];
  const CABIN_PUBLIC_PREFIXES = [
    "/cabin/icons/",
    "/cabin/share/",
    "/api/cabin/auth/",
    "/api/cabin/admin/",
  ];
  if (CABIN_PUBLIC_PATHS.includes(pathname)) return true;
  return CABIN_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAdminPath(pathname) {
  return pathname.startsWith("/admin/") ||
         pathname.startsWith("/api/admin/") ||
         pathname === "/admin" ||
         pathname === "/api/admin";
}

function hasValidAdminAuth(req) {
  const masterSecrets = adminSecrets();
  // 2026-05-21 — Newsletter routes additionally accept the
  // newsletter-scoped secrets (NEWSLETTER_PROXY_SECRET /
  // NEWSLETTER_UNSUB_SECRET). All other /api/admin/* and /admin/*
  // paths continue to require a master admin secret.
  const isNewsletter = isNewsletterAdminPath(req.nextUrl.pathname);
  const acceptedSecrets = isNewsletter
    ? [...masterSecrets, ...newsletterSecrets()]
    : masterSecrets;

  if (acceptedSecrets.length === 0) {
    // Fail-closed: if no secrets are configured, NOTHING is allowed
    // through. Better than silent open-access.
    return false;
  }

  // Cookie — value is the secret itself (httpOnly, secure).
  // Only honour the cookie when it matches a MASTER secret —
  // newsletter secrets are server-to-server only and should never
  // become a long-lived browser cookie that unlocks the admin gate.
  const cookieValue = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookieValue && masterSecrets.includes(cookieValue)) return true;

  // Query string — ?token= (used by /admin/haro-process,
  // /admin/ai-monitoring, most /api/admin/* routes) or ?key=
  // (used by /admin/kpis and /api/admin/kpis).
  const url = req.nextUrl;
  const fromToken = url.searchParams.get("token");
  if (fromToken && acceptedSecrets.includes(fromToken)) return true;
  const fromKey = url.searchParams.get("key");
  if (fromKey && acceptedSecrets.includes(fromKey)) return true;

  // Authorization: Bearer — used by server-to-server callers
  // (gy-command CRM, Vercel cron jobs).
  const authz = req.headers.get("authorization") || "";
  if (authz.startsWith("Bearer ")) {
    const t = authz.slice(7).trim();
    if (t && acceptedSecrets.includes(t)) return true;
  }

  return false;
}

function notFoundResponse() {
  // Plain 404, looking exactly like a missing route to a scraper.
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      ...NOINDEX_HEADERS,
    },
  });
}

function handleAdmin(req) {
  if (!hasValidAdminAuth(req)) return notFoundResponse();

  const res = NextResponse.next();

  // If they came in via query token / key, persist as cookie so
  // subsequent visits work without the URL param. The cookie value
  // IS the secret — httpOnly + secure so it's never readable by JS.
  //
  // 2026-05-21 — only persist MASTER admin secrets as a cookie.
  // Newsletter-scoped secrets (used by server-to-server CRM calls)
  // are never echoed back as a browser cookie that would unlock the
  // admin gate on subsequent visits.
  const url = req.nextUrl;
  const fromQuery =
    url.searchParams.get("token") || url.searchParams.get("key");
  if (fromQuery && adminSecrets().includes(fromQuery)) {
    res.cookies.set({
      name: ADMIN_COOKIE,
      value: fromQuery,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 3600, // 30 days
    });
  }

  // Always stamp noindex on every admin response.
  for (const [k, v] of Object.entries(NOINDEX_HEADERS)) {
    res.headers.set(k, v);
  }

  return res;
}

function handleCabin(req) {
  const { pathname } = req.nextUrl;

  // Public routes pass through
  if (isCabinPublic(pathname)) {
    return NextResponse.next();
  }

  // Everything else under /cabin or /api/cabin requires a session cookie
  const hasCookie = req.cookies.has(CABIN_COOKIE);
  if (hasCookie) {
    // Slide the cookie's Max-Age every visit so guests stay signed in
    // for a year-from-last-visit, not a year-from-first-magic-link.
    // We can't validate the session here (KV lookup would slow Edge)
    // — readSessionFromCookies() inside the page does that.
    const res = NextResponse.next();
    const existing = req.cookies.get(CABIN_COOKIE);
    if (existing?.value) {
      res.cookies.set({
        name: CABIN_COOKIE,
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

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (isAdminPath(pathname)) return handleAdmin(req);
  return handleCabin(req);
}

export const config = {
  matcher: [
    "/cabin/:path*",
    "/api/cabin/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin",
    "/api/admin/:path*",
  ],
};
