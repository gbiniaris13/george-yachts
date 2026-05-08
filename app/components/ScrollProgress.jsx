"use client";

// Phase 27i.2 (2026-05-07) — scroll progress indicator.
//
// Thin gold line at the very top of the viewport that fills
// left-to-right as the user scrolls the document. Sits above the
// ForbesTopBar (z-index 90) so it's the first cinematic cue on
// every page. Uses pure DOM transform-X — no React state per scroll
// frame — so it stays at 60fps on every machine.
//
// Width is animated via scaleX(1) with transform-origin: left, so
// the GPU handles the redraw and the layout never thrashes.

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      bar.style.transform = `scaleX(${pct})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 90,
        pointerEvents: "none",
        background: "rgba(201, 168, 76, 0.08)",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.6) 0%, rgba(248, 245, 240,0.95) 50%, rgba(201,168,76,0.6) 100%)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          willChange: "transform",
          boxShadow: "0 0 8px rgba(201, 168, 76, 0.45)",
        }}
      />
    </div>
  );
}
