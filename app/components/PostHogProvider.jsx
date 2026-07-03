// app/components/PostHogProvider.jsx
// =============================================================
// PostHog product-analytics client — wired but inert until the
// NEXT_PUBLIC_POSTHOG_KEY env var is set in Vercel.
//
// 2026-05-18 — Free tier: 1,000,000 events / month forever.
// Card not required. PostHog cloud-EU host so visitor IPs stay
// in the EU for GDPR compliance.
//
// Initialisation runs once per browser session inside useEffect
// (so it's tree-shaken out of the server bundle). The init call
// short-circuits if the key isn't set, so dropping the env var
// pulls the plug instantly without redeploying.
//
// Default capture: automatic pageviews (capture_pageview: true),
// autocapture of clicks (autocapture: true). We can layer named
// events later (yacht_viewed, inquiry_started, etc.) via the
// `posthog.capture()` API once we know what funnels matter most.
//
// To wire named events, import `posthog-js` directly in client
// components and call `posthog.capture('event_name', { props })`.
// =============================================================

"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider({ children }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // No key → don't init. SDK stays inert.
    if (typeof window === "undefined") return; // Belt + suspenders.

    // 2026-07-02 (ASK B 2.4 guardrail) — Speculation Rules prerendering
    // executes the full page JS before the visitor ever clicks. Without
    // this gate every prerendered page fires a phantom pageview and
    // pollutes the exact analytics the SEO project is judged by. Init
    // waits until the page is actually shown (prerenderingchange).
    const start = () => initPosthog(key);
    if (document.prerendering) {
      document.addEventListener("prerenderingchange", start, { once: true });
      return () => document.removeEventListener("prerenderingchange", start);
    }
    start();
  }, []);

  return children;
}

function initPosthog(key) {
    posthog.init(key, {
      // EU host — visitor IPs and event data stay in the EU.
      // Free tier covers either host equally; we prefer EU for
      // GDPR + Cookiebot consent flow simplicity.
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      // Track page navigations automatically (App Router needs
      // pageview events triggered manually OR via capture_pageview
      // true with history hooks — true is fine for our use).
      capture_pageview: true,
      // Don't autocapture every click — too noisy for our funnel
      // analysis. We'll layer named events instead.
      autocapture: false,
      // Don't track session replays on the free tier — replay is
      // a separate quota and not free indefinitely.
      session_recording: { enabled: false },
      // Respect Do Not Track + Cookiebot consent. PostHog can be
      // disabled mid-session if a visitor revokes consent.
      respect_dnt: true,
      // Privacy: don't store IP addresses on PostHog's side at
      // all (their server still sees the request IP but won't
      // associate it with the event).
      ip: false,
      // Cookieless mode option is available later via
      // `persistence: 'memory'` if we want to skip Cookiebot
      // category entirely.
      loaded: (ph) => {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("[PostHog] initialised in", ph.config.api_host);
        }
      },
    });
}
