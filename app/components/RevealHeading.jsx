"use client";

// RevealHeading — GSAP masked line reveal (ASK B 2.2, demo build
// 2026-07-03, pending George's visual sign-off before the push).
//
// The serif headline rises once from behind an invisible baseline
// mask, line by line, and never loops. Guardrails per the ASK B
// reviewer:
//   - The server HTML ships the text FULLY VISIBLE (no pre-hidden
//     class). If GSAP fails to load, is blocked, or JS is off, the
//     headline simply stands there - zero LCP/no-JS risk. The cost
//     is one visible frame before the rise starts; that trade was
//     chosen deliberately over hiding H1s.
//   - prefers-reduced-motion renders static text, no animation.
//   - gsap + SplitText (free since the 2025 Webflow change; v3.15
//     bundles all plugins) load via dynamic import so the chunk
//     never blocks the route.
//   - Runs once per mount (done ref), transform-only animation.

import { useLayoutEffect, useRef } from "react";

export default function RevealHeading({
  as: Tag = "h1",
  children,
  className,
  style,
  delay = 0,
  play = true,
}) {
  const ref = useRef(null);
  const done = useRef(false);

  useLayoutEffect(() => {
    if (!play || done.current) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    done.current = true;

    let cancelled = false;
    let cleanup = null;
    Promise.all([import("gsap"), import("gsap/SplitText")])
      .then(([g, s]) => {
        if (cancelled) return;
        const gsap = g.gsap || g.default;
        const SplitText = s.SplitText || s.default;
        gsap.registerPlugin(SplitText);
        const split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "gy-reveal-line",
        });
        const tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay,
          onComplete: () => split.revert(),
        });
        cleanup = () => {
          tween.kill();
          split.revert();
        };
      })
      .catch(() => {
        /* GSAP unavailable: headline stays visible, no animation. */
      });

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [play, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
