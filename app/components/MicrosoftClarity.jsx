"use client";

/**
 * Microsoft Clarity — free heatmaps + session recordings.
 * Zero cost, unlimited sessions.
 *
 * 2026-06-25 — CONSENT-GATED. Clarity is an analytics/session-recording
 * tracker, so under GDPR/ePrivacy it must NOT load until the visitor
 * gives analytics consent. This injects the Clarity tag only once
 * `analyticsAllowed()` is true, and reacts live when the visitor accepts
 * via the cookie banner (gy-consent-change event). Replaces the old
 * always-on load that relied on the paid Cookiebot auto-blocker.
 *
 * To activate: set NEXT_PUBLIC_CLARITY_ID env var.
 *
 * 2026-08-11 - THE CONSENT SIGNAL, and why the dashboard stayed empty.
 *
 * Clarity went live on the site this morning against a project we control, the
 * tag loaded, window.clarity was a function, and hours later the dashboard was
 * still showing "Almost there, choose an installation method". Microsoft even
 * emailed to say they could not see traffic.
 *
 * The tag was not the problem. The missing piece was one line:
 *
 *   "Starting October 31, 2025, Clarity begins enforcing consent signal
 *    requirements for page visits originating from the European Economic
 *    Area, United Kingdom, and Switzerland."
 *
 * Loading the tag only after our own banner says yes is necessary but not
 * sufficient. Clarity has no way to know our banner exists. Without an explicit
 * consentv2 call it assumes no consent, and in no-consent mode it assigns a
 * unique id per page view, sets no cookies and stitches nothing into a session,
 * which is indistinguishable from a broken install. Every visitor we have is in
 * the EEA or arrives through it, so this hit us on every single session.
 *
 * ad_Storage is denied on purpose. We run no advertising storage of any kind,
 * and saying so is both true and the more privacy-preserving answer. Only
 * analytics_Storage is granted, and only ever after the visitor has accepted
 * analytics in our own banner, which is what gates this component rendering
 * at all.
 *
 * Docs: learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
 */

import { useEffect, useState } from "react";
import Script from "next/script";
import { analyticsAllowed, CONSENT_EVENT } from "@/lib/consent";

export default function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(analyticsAllowed());
    const onChange = () => setAllowed(analyticsAllowed());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!clarityId || !allowed) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
        window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
      `}
    </Script>
  );
}
