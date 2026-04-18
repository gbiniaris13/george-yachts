"use client";

/**
 * EnhancedAnalytics — additive tracking layer.
 *
 * Adds to existing GA4:
 * - Scroll depth tracking (25/50/75/100%)
 * - Outbound link clicks
 * - Form interactions (focus, submit attempt)
 * - Conversion events: WhatsApp, Calendly, PDF downloads
 *
 * Does NOT replace or modify existing gtag config.
 * Opt-in via data-track="..." attributes.
 */

import { useEffect } from "react";

export default function EnhancedAnalytics() {
  useEffect(() => {
    // Guard against SSR + missing gtag
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      // Wait for gtag to load (lazyOnload strategy)
      const waitForGtag = setInterval(() => {
        if (typeof window.gtag === "function") {
          clearInterval(waitForGtag);
          initTracking();
        }
      }, 500);
      setTimeout(() => clearInterval(waitForGtag), 10000);
      return;
    }
    initTracking();

    function initTracking() {
      // ── Scroll depth tracking ──────────────────────────────────
      const thresholds = [25, 50, 75, 100];
      const fired = new Set();

      function onScroll() {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        const pct = Math.round((scrolled / total) * 100);

        for (const t of thresholds) {
          if (pct >= t && !fired.has(t)) {
            fired.add(t);
            window.gtag("event", "scroll_depth", {
              percent: t,
              page_path: window.location.pathname,
            });
          }
        }
      }

      let scrollTimer;
      function throttledScroll() {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
          onScroll();
          scrollTimer = null;
        }, 500);
      }
      window.addEventListener("scroll", throttledScroll, { passive: true });

      // ── Outbound link clicks ───────────────────────────────────
      function onLinkClick(e) {
        const link = e.target.closest("a");
        if (!link || !link.href) return;

        const isOutbound =
          link.hostname && link.hostname !== window.location.hostname;
        const isMailto = link.href.startsWith("mailto:");
        const isTel = link.href.startsWith("tel:");
        const isWhatsApp = link.href.includes("wa.me") || link.href.includes("whatsapp.com");
        const isCalendly = link.href.includes("calendly.com");
        const isPdf = link.href.toLowerCase().endsWith(".pdf");

        // Track outbound
        if (isOutbound) {
          window.gtag("event", "click_outbound", {
            link_url: link.href,
            link_text: (link.textContent || "").trim().slice(0, 80),
          });
        }

        // Specific conversion events
        if (isWhatsApp) {
          window.gtag("event", "contact_whatsapp", {
            page_path: window.location.pathname,
          });
        }
        if (isCalendly) {
          window.gtag("event", "book_consultation", {
            page_path: window.location.pathname,
          });
        }
        if (isMailto) {
          window.gtag("event", "contact_email", {});
        }
        if (isTel) {
          window.gtag("event", "contact_phone", {});
        }
        if (isPdf) {
          window.gtag("event", "download_pdf", {
            file_name: link.href.split("/").pop(),
          });
        }

        // data-track attribute for custom CTAs
        const trackName = link.getAttribute("data-track");
        if (trackName) {
          window.gtag("event", "cta_click", {
            cta_name: trackName,
            page_path: window.location.pathname,
          });
        }
      }
      document.addEventListener("click", onLinkClick);

      // ── Form interactions ──────────────────────────────────────
      let formFocusedFired = new Set();
      function onFormFocus(e) {
        const form = e.target.closest("form");
        if (!form || formFocusedFired.has(form)) return;
        formFocusedFired.add(form);

        const formName = form.getAttribute("name") ||
                         form.getAttribute("id") ||
                         form.closest("[data-form-name]")?.getAttribute("data-form-name") ||
                         "unnamed_form";

        window.gtag("event", "form_start", {
          form_name: formName,
          page_path: window.location.pathname,
        });
      }
      document.addEventListener("focusin", onFormFocus);

      function onFormSubmit(e) {
        const form = e.target;
        if (form.tagName !== "FORM") return;

        const formName = form.getAttribute("name") ||
                         form.getAttribute("id") ||
                         form.closest("[data-form-name]")?.getAttribute("data-form-name") ||
                         "unnamed_form";

        window.gtag("event", "form_submit", {
          form_name: formName,
          page_path: window.location.pathname,
        });
      }
      document.addEventListener("submit", onFormSubmit);

      // Cleanup (though this component lives for the page lifetime)
      return () => {
        window.removeEventListener("scroll", throttledScroll);
        document.removeEventListener("click", onLinkClick);
        document.removeEventListener("focusin", onFormFocus);
        document.removeEventListener("submit", onFormSubmit);
      };
    }
  }, []);

  return null;
}
