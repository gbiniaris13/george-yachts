"use client";

// InlineCalendlySection - Phase 7 Round 23 (2026-05-12).
// Technical brief Priority 1B.
//
// Embedded Calendly widget for comparison pages, market reports,
// and the pricing guide. Surfaces directly above the footer with
// brief-specified copy: "Still have questions? Book a free 30-minute
// call with George."
//
// Implementation: dynamically loads the Calendly script on
// intersection so we don't penalise initial page payload. Falls
// back to a CTA button if Calendly fails to load (network blocked).

import { useEffect, useRef, useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const CALENDLY_URL = "https://calendly.com/george-georgeyachts/30min";

export default function InlineCalendlySection({
  heading = "Still have questions? Book a free 30-minute call with George.",
  subheading = "Direct conversation, no intermediaries. MYBA-standard contracts, full Greek charter fleet.",
}) {
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Intersection-based lazy load. Don't pay the Calendly script
  // tax (~80kb gzipped) until the section is within 200px of
  // viewport. Saves payload on visitors who never scroll this far.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Load Calendly script when section enters viewport.
  useEffect(() => {
    if (!shouldLoad) return;
    if (typeof window === "undefined") return;
    if (window.Calendly) {
      setScriptLoaded(true);
      return;
    }
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      // Fallback: just keep the CTA button, no embedded widget.
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }, [shouldLoad]);

  const trackClick = () => {
    try {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "inline_calendly_fallback_click", {});
      }
    } catch {}
  };

  return (
    <section
      ref={containerRef}
      style={{
        background: "rgba(201,168,76,0.04)",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "84px 24px",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
            margin: "0 0 18px",
          }}
        >
          30-minute discovery call
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(26px, 3.8vw, 38px)",
            fontWeight: 300,
            color: CREAM,
            margin: "0 0 14px",
            lineHeight: 1.2,
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 16,
            lineHeight: 1.65,
            color: "rgba(248, 245, 240, 0.78)",
            margin: "0 0 32px",
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {subheading}
        </p>

        {/* Calendly inline widget. Note the explicit data-url and
            minimum height; Calendly resizes dynamically once loaded.
            Style overrides via Calendly's brand-color URL params. */}
        <div
          className="calendly-inline-widget"
          data-url={`${CALENDLY_URL}?hide_event_type_details=0&hide_gdpr_banner=1&primary_color=c9a84c&text_color=0d1b2a&background_color=f8f5f0`}
          style={{
            minWidth: 320,
            height: 720,
            background: CREAM,
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        />

        {/* Fallback link in case Calendly fails to load. Sits
            beneath the widget and is always shown. Visible
            failure mode is always better than silent. */}
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 12,
            color: "rgba(248, 245, 240, 0.6)",
            margin: "20px 0 0",
            letterSpacing: "0.06em",
          }}
        >
          Widget not loading? Use the direct link:{" "}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick}
            style={{
              color: GOLD,
              textDecoration: "none",
              borderBottom: `1px solid ${GOLD}`,
            }}
          >
            calendly.com/george-georgeyachts/30min
          </a>
        </p>
      </div>
    </section>
  );
}
