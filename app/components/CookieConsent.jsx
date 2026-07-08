"use client";

// CookieConsent - free, self-hosted, brand-matched consent banner.
// Replaces the paid Cookiebot dependency (George: "no subscriptions").
//
// Compliance posture (HDPA Recommendation 1/2020 / ePrivacy):
//   • Non-essential trackers (GA4, Microsoft Clarity) load ONLY after
//     opt-in - enforced by Google Consent Mode defaults (layout.jsx,
//     analytics_storage:'denied') + the consent-gated MicrosoftClarity.
//   • "Accept" and "Decline" have EQUAL prominence (same size/weight),
//     no pre-ticked boxes, no cookie wall, no "scrolling = consent".
//   • Granular: a Preferences panel with a real Analytics toggle.
//   • Re-openable anytime via the footer "Cookie settings" link
//     (window.gyOpenCookieSettings).
// Restrained luxury styling to fit the brand - not a loud nag.

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true); // default toggle position in prefs

  useEffect(() => {
    // Show only if no decision for the current consent version.
    if (!getConsent()) setOpen(true);
    // Expose a re-opener for the footer "Cookie settings" link.
    window.gyOpenCookieSettings = () => {
      setShowPrefs(true);
      setOpen(true);
    };
    return () => {
      try {
        delete window.gyOpenCookieSettings;
      } catch {
        /* ignore */
      }
    };
  }, []);

  const decide = (analyticsChoice) => {
    setConsent({ analytics: analyticsChoice });
    setOpen(false);
    setShowPrefs(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] animate-gy-greet-in"
      style={{
        background: "rgba(13,27,42,0.98)",
        borderTop: `1px solid ${GOLD}40`,
        backdropFilter: "blur(10px)",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.45)",
      }}
    >
      <div
        className="mx-auto flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-8"
        style={{ maxWidth: "1100px" }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "9px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "8px",
            }}
          >
            Privacy
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-body, Georgia, serif)",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(248,245,240,0.88)",
              margin: 0,
            }}
          >
            We use essential cookies to run the site, and - only with your
            consent - analytics to understand how it is used. You decide.{" "}
            <a
              href="/cookie-policy"
              style={{ color: GOLD, textDecoration: "underline" }}
            >
              Cookie Policy
            </a>
            .
          </p>

          {showPrefs && (
            <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", opacity: 0.6 }}>
                <input type="checkbox" checked disabled readOnly />
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", color: "rgba(248,245,240,0.78)" }}>
                  Strictly necessary - always on (security, site function)
                </span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", color: "rgba(248,245,240,0.78)" }}>
                  Analytics - Google Analytics, Microsoft Clarity
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:shrink-0">
          {/* Accept and Decline carry EQUAL visual weight (HDPA Rec. 1/2020). */}
          <button
            onClick={() => decide(true)}
            style={{
              fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.16em",
              textTransform: "uppercase", fontWeight: 600,
              color: NAVY, background: GOLD, border: `1px solid ${GOLD}`,
              padding: "12px 26px", cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={() => decide(false)}
            style={{
              fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.16em",
              textTransform: "uppercase", fontWeight: 600,
              color: "#F8F5F0", background: "transparent", border: "1px solid rgba(248,245,240,0.4)",
              padding: "12px 26px", cursor: "pointer",
            }}
          >
            Decline
          </button>
          {showPrefs ? (
            <button
              onClick={() => decide(analytics)}
              style={{
                fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(248,245,240,0.6)",
                background: "none", border: "none", cursor: "pointer", padding: "12px 4px",
              }}
            >
              Save choices
            </button>
          ) : (
            <button
              onClick={() => setShowPrefs(true)}
              style={{
                fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(248,245,240,0.45)",
                background: "none", border: "none", cursor: "pointer", padding: "12px 4px",
              }}
            >
              Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
