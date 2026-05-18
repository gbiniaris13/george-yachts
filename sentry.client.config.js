// sentry.client.config.js
// =============================================================
// Browser-side Sentry initialisation.
//
// 2026-05-18 — Wired but inert until NEXT_PUBLIC_SENTRY_DSN is
// set. Until then, every call to Sentry below short-circuits and
// the SDK does nothing — no network calls, no event capture,
// no console noise. Drop the DSN in Vercel env vars (Production,
// Preview, Development) and redeploy to turn it on.
//
// Free tier: 5,000 errors / month forever. No card on file
// required. If we ever cross 5k errors we have bigger problems
// than the Sentry bill.
//
// tracesSampleRate set to 0 (NOT 0.1 or 1.0) on purpose: we are
// using Sentry for ERROR tracking only, not performance tracing.
// Tracing eats the free-tier event budget fast and we already
// have build-time perf budgets + Lighthouse for that.
// =============================================================

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    // Keep performance tracing off (tracesSampleRate 0) so we
    // don't consume the 5k-events/mo budget on perf data.
    tracesSampleRate: 0,
    // Capture replays on errors only (also off by default;
    // documented here so it's obvious how to turn on later).
    replaysOnErrorSampleRate: 0,
    replaysSessionSampleRate: 0,
    // Tag every event with the env so Production / Preview /
    // Development errors don't get mixed up in the dashboard.
    environment:
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",
    // Ignore obvious noise from third-party scripts (Cookiebot,
    // GTM, Translate widget) — these are not our bugs.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed",
      // Network errors that are user-environment issues
      "Network request failed",
      "NetworkError",
      // Browser extension noise
      "Non-Error promise rejection captured",
    ],
    denyUrls: [
      // Browser extensions
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      // GTM / GA / Cookiebot (not our code, not our problem)
      /googletagmanager\.com/,
      /google-analytics\.com/,
      /cookiebot\.com/,
    ],
  });
}
