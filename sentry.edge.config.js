// sentry.edge.config.js
// =============================================================
// Edge runtime Sentry init — runs inside middleware.js and any
// edge-runtime route handlers. Inert until SENTRY_DSN is set.
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
