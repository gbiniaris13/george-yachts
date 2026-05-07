"use client";

// Phase 27i.1 (2026-05-07) — Lenis smooth scroll.
//
// Replaces native scroll with interpolated scrolling so the page
// glides instead of snapping. Single GSAP-grade easing curve
// (cubic ease-out via Lenis defaults) — not "exaggerated parallax"
// or per-section sticky-pin flair. Just a continuous, even hand
// on the wheel.
//
// Mounted once at the root of the layout. Respects prefers-reduced-
// motion (Lenis exposes `smoothTouch`/`smoothWheel` options; we
// disable both for users who opted out).
//
// No interference with hash-anchor links, native focus scrolling,
// or any third-party scroll-listening (Lenis uses requestAnimation
// frame and emits a 'scroll' event compatible with everything).

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return; // honour the OS preference

    const lenis = new Lenis({
      // Base feel — slightly slower than default for "cinema dolly" reading.
      duration: 1.15,
      // Smooth on wheel + touch. iOS native momentum is already silky;
      // skip there to avoid double-handling.
      smoothWheel: true,
      smoothTouch: false,
      // Ease-out (default Lenis curve is fine — no custom easing).
      lerp: 0.08,
    });

    let raf = 0;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
