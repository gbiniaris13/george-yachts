"use client";

// Phase 27i.12 (2026-05-07) — gold-tier scroll-to-top button.
//
// Floats bottom-right, hidden until the user has scrolled past
// 1.4× viewport-height. Click smooth-scrolls back to the top.
// Lenis-aware: if the global Lenis instance is exposed (it isn't
// directly, but native window.scrollTo gets intercepted by Lenis
// and runs through its smooth interpolation), we just call
// scrollTo(0) and it glides naturally.
//
// Brand fit: thin gold ring + ivory upward chevron, hover fills
// with a champagne radial. Same restraint as the rest of the new
// cinematic layer — visible only when needed, never noisy.
//
// Mobile / coarse pointer: still renders (mobile users benefit
// from this even more than desktop). prefers-reduced-motion: no
// transition.

import { useEffect, useState } from "react";

const REVEAL_AT_VIEWPORT_RATIO = 1.4;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * REVEAL_AT_VIEWPORT_RATIO);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    try {
      // Lenis intercepts native scrollTo; pass `behavior: "smooth"`
      // for the no-Lenis fallback path.
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className={`gy-scroll-to-top ${visible ? "is-visible" : ""}`}
      data-cursor="Top"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
        <path d="M12 18 V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M6 11 L12 5 L18 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
