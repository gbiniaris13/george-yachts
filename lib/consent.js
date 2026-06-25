// lib/consent.js
// ============================================================
// Free, self-hosted cookie-consent state — replaces the paid
// Cookiebot dependency. One small source of truth shared by the
// banner (app/components/CookieConsent.jsx), the analytics gates
// (MicrosoftClarity, Google Consent Mode in layout.jsx), and the
// footer "Cookie settings" re-opener.
//
// Storage: localStorage key `gy_cookie_consent` =
//   { analytics: boolean, version: number, ts: ISO-string }
// Versioned: bump CONSENT_VERSION to lawfully re-ask everyone when
// the tracker set materially changes.
//
// Only TWO categories matter operationally:
//   - necessary  (always on: Cloudflare, consent storage, reCAPTCHA
//                 security) — never gated.
//   - analytics  (consent-gated: Google Analytics 4 + Microsoft
//                 Clarity).
// ============================================================

export const CONSENT_KEY = "gy_cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "gy-consent-change";

// Returns the stored decision for the CURRENT version, or null if the
// visitor has not decided yet (or an older version → re-ask).
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function analyticsAllowed() {
  const c = getConsent();
  return !!(c && c.analytics);
}

// Persist a decision, mirror it into Google Consent Mode, and notify
// listeners (Clarity, the banner) in the same tick.
export function setConsent({ analytics }) {
  if (typeof window === "undefined") return;
  const record = {
    analytics: !!analytics,
    version: CONSENT_VERSION,
    ts: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* private mode — consent still applies for this session via the event */
  }
  // Google Consent Mode v2 update.
  try {
    if (typeof window.gtag === "function") {
      const v = analytics ? "granted" : "denied";
      window.gtag("consent", "update", {
        analytics_storage: v,
        ad_storage: v,
        ad_user_data: v,
        ad_personalization: v,
      });
    }
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  } catch {
    /* ignore */
  }
}
