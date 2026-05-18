// sentry.server.config.js
// =============================================================
// Server-side Sentry initialisation — runs inside Vercel
// serverless functions (Node.js runtime). Catches exceptions
// thrown in:
//   - app/api/*/route.js handlers (REST endpoints)
//   - server components during SSR / SSG
//   - middleware (gets its own config but most code overlaps)
//   - cron jobs
//
// Inert until SENTRY_DSN is set in Vercel env vars.
// =============================================================

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0,
    environment:
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",
  });
}
