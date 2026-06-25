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
      `}
    </Script>
  );
}
