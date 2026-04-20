"use client";

// A4 — Ambient scroll parallax driver.
//
// A single rAF-throttled scroll listener publishes the current
// scroll position as a CSS custom property on <html>:
//
//   :root { --gy-scroll-y: <px>; --gy-scroll-vy: <px>; }
//
// - --gy-scroll-y : raw scroll depth in pixels
// - --gy-scroll-vy: same value divided by 100 — easier to multiply
//                   inside transform: translate3d(…) without maths
//
// Any component can now opt in to parallax motion without wiring
// its own scroll listener:
//
//   style={{ transform:
//     "translate3d(0, calc(var(--gy-scroll-vy, 0) * -8px), 0)" }}
//
// One listener, zero layout thrashing. Gets disabled cleanly if
// the user prefers reduced motion.
//
// Mounted once from layout.jsx. No DOM output.

import { useEffect } from "react";

export default function AmbientScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion globally.
    const mql = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    );
    if (mql?.matches) {
      document.documentElement.style.setProperty("--gy-scroll-y", "0");
      document.documentElement.style.setProperty("--gy-scroll-vy", "0");
      return;
    }

    let ticking = false;

    const update = () => {
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty("--gy-scroll-y", `${y}`);
      document.documentElement.style.setProperty(
        "--gy-scroll-vy",
        `${(y / 100).toFixed(2)}`
      );
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
