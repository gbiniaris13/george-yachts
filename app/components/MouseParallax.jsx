"use client";

// Phase 26 (luxury rebuild, 2026-05-05) — C1 option B minimal version.
//
// Boss approved a Ken Burns + AI depth-map combo for the C1 cinematic
// reveal. Ken Burns is already in place site-wide on .gy-ken-burns
// containers (yacht hero, Greek waters hero, etc). The "AI depth-map"
// part of the combo is too heavy to ship pre-launch (depth detection +
// WebGL parallax = 100kb+ bundle, complex, risky).
//
// This is the pragmatic substitute: a CSS-only mouse-parallax that
// responds to cursor position over .gy-ken-burns elements, shifting
// the inner image up to ±10px from centre. Combined with the existing
// Ken Burns animation it reads as believable depth without the
// engineering cost.
//
// Skipped on touch (no cursor) and on prefers-reduced-motion.

import { useEffect } from "react";

const MAX_SHIFT_PX = 10;
const TRANSITION = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

export default function MouseParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const containers = document.querySelectorAll(".gy-ken-burns");
    if (containers.length === 0) return;

    const handlers = [];

    containers.forEach((el) => {
      const inner = el.querySelector("img, video, picture > img");
      if (!inner) return;
      // Compose with the existing Ken Burns animation by adding the
      // parallax shift via CSS variable, then read it inside a
      // wrapping translate3d. The Ken Burns @keyframes uses
      // translate3d directly though, so we layer here via outer
      // wrapper transform.
      const wrap = el; // operate on outer container for transform
      wrap.style.transition = TRANSITION;

      let raf = 0;
      const onMove = (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          wrap.style.setProperty(
            "--gy-parallax",
            `translate3d(${(x * MAX_SHIFT_PX * -1).toFixed(2)}px, ${(y * MAX_SHIFT_PX * -1).toFixed(2)}px, 0)`
          );
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        wrap.style.setProperty("--gy-parallax", "translate3d(0,0,0)");
      };

      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      handlers.push(() => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
        cancelAnimationFrame(raf);
      });
    });

    return () => handlers.forEach((fn) => fn());
  }, []);

  return null;
}
