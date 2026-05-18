// instrumentation.js
// =============================================================
// Next.js 15 instrumentation hook — Next calls this once per
// process boot to register OTEL / Sentry / etc. We use it to
// load the right sentry.*.config.js depending on the runtime.
//
// File is harmless if Sentry isn't installed or DSN isn't set;
// the individual config files no-op without the env var.
// =============================================================

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Required Sentry export for capturing request errors in
// Server Components and Server Actions. Falls back to a no-op
// if Sentry isn't initialised.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
