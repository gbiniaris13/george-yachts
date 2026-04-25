/**
 * lib/analytics.js — thin client-side helper για GA4 custom events.
 *
 * GA4 measurement ID: G-CM483Z0JT5 (loaded lazyOnload στο app/layout.jsx).
 *
 * Usage examples:
 *   import { trackEvent, trackInquiry, trackCalendly, trackWhatsApp,
 *            trackPdfDownload, trackYachtView, trackCalculatorComplete } from "@/lib/analytics";
 *
 *   <a href="..." onClick={() => trackCalendly()}>Book a call</a>
 *
 * Why this exists:
 *   Until today the site only tracked page_view via `gtag('config', ...)`.
 *   That makes us blind to every meaningful conversion signal — we
 *   can see traffic but not what it does. These 5 events capture the
 *   funnel end-to-end so we can A/B test, measure CTR on yachts,
 *   and prove organic ROI.
 *
 *   Server-side fallback: window.gtag missing on early page load is
 *   handled silently — events queued by the gtag stub fire later.
 */

function safeGtag(...args) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    try {
      window.gtag(...args);
    } catch {
      /* Cookiebot can block gtag pre-consent — silent ignore */
    }
  }
}

// Generic — call with any event name + params object.
export function trackEvent(eventName, params = {}) {
  safeGtag("event", eventName, params);
}

// Inquiry form submission — fires after server confirms the inquiry
// hit Supabase. Use as the final step in /inquiry submission flow.
export function trackInquiry({
  yachtName = null,
  yachtSlug = null,
  charterRegion = null,
  partySize = null,
  budgetBand = null,
  source = "inquiry_form",
} = {}) {
  trackEvent("inquiry_submit", {
    yacht_name: yachtName,
    yacht_slug: yachtSlug,
    charter_region: charterRegion,
    party_size: partySize,
    budget_band: budgetBand,
    source,
  });
}

// Calendly click — anchor click on any "book a call" CTA.
export function trackCalendly(location = "unknown") {
  trackEvent("calendly_click", { click_location: location });
}

// WhatsApp click — floating button or any inline WhatsApp link.
export function trackWhatsApp(location = "floating_button") {
  trackEvent("whatsapp_click", { click_location: location });
}

// PDF download — Partnership deck, charter guides, yacht brochures.
export function trackPdfDownload(filename, kind = "pdf") {
  trackEvent("pdf_download", { file_name: filename, file_kind: kind });
}

// Yacht detail view — fires once per /yachts/[slug] mount with
// the yacht's identifying info. Use for "most-viewed yacht" reports.
export function trackYachtView({
  yachtName,
  yachtSlug,
  cruisingRegion = null,
  weeklyRatePrice = null,
  builder = null,
} = {}) {
  trackEvent("yacht_view", {
    yacht_name: yachtName,
    yacht_slug: yachtSlug,
    cruising_region: cruisingRegion,
    weekly_rate: weeklyRatePrice,
    builder,
  });
}

// Cost calculator completion (note: /cost-calculator is currently
// 301'd to /inquiry — keep the helper here so when calculator returns
// it just works).
export function trackCalculatorComplete({ totalEstimate, region, days }) {
  trackEvent("cost_calculator_complete", {
    total_estimate: totalEstimate,
    region,
    days,
  });
}

// Outbound link tracking — useful for partner directory clicks.
export function trackOutbound(url, kind = "outbound") {
  trackEvent("outbound_click", { destination: url, link_kind: kind });
}
