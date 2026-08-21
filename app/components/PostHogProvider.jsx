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

// 2026-08-19 (design pass, job 6) — this used to be a static
// `import posthog from "posthog-js"`, which put the whole SDK into a shared
// chunk that every page of the site downloaded: 184 KB on disk, 62 KB over
// the wire, measured on the live homepage on 19/8.
//
// It has never once run. NEXT_PUBLIC_POSTHOG_KEY is not set in Vercel, and
// the guard below returns before init, so the SDK sat inert in the bundle.
// Verified against production the same day, not inferred: zero network
// requests to posthog, window.posthog undefined, __loaded false.
//
// Nothing is removed. The import simply moved inside the branch that already
// decided whether PostHog runs. Set the key in Vercel and the SDK is fetched
// and initialised exactly as before, one request later. Leave the key unset
// and no visitor pays for a product we are not using.
//
// Worth saying plainly if the key is ever set: posthog is NOT in the
// Content Security Policy. eu.i.posthog.com would have to be added to
// connect-src first, or it would load and then be refused, which is the
// failure this codebase has now hit four times (Cookiebot, Clarity, GA4,
// reCAPTCHA).

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

async function initPosthog(key) {
    const { default: posthog } = await import("posthog-js");
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
