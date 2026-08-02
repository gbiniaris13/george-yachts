"use client";

// 2026-08-01 SD-3 (mobile speed, local batch). The Lighthouse mobile
// baseline put the homepage at LCP 40s / score 33: ~12 MB of ambient
// video (explorer-fleet-bg, filotimo-navagio, footer-sunset) all carried
// preload="auto" + autoPlay, so on a throttled connection they saturated
// the pipe before the hero ever painted. Every one of those sections
// sits below the fold, and the footer sits below the fold on every page
// of the site.
//
// This hook is the whole fix: report true once the element is within
// `rootMargin` of the viewport. The ambient videos keep their exact
// look (same poster, same autoplay loop, same overlay) - they simply do
// not download until the visitor is one scroll away. Nothing is removed
// and nothing changes visually, per the standing no-deletions rule.
//
// SSR-safe: starts false, observers attach after mount. Browsers
// without IntersectionObserver just load immediately (report true).

import { useEffect, useRef, useState } from "react";

export default function useNearViewport(rootMargin = "600px") {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [near, rootMargin]);

  return [ref, near];
}
