"use client";

// Phase 22 (luxury rebuild, 2026-05-05) — Hermès-style page-transition
// gold sweep. Every navigation between routes fires a 360ms gold ribbon
// that wipes left-to-right across the viewport. The destination page
// composes underneath the wipe and is revealed as the ribbon clears.
//
// This is the kind of detail UHNW visitors notice without realising —
// it's what makes "click navigation" read as "considered transition".
// Reference: Hermès, Bottega Veneta, Bulgari sites.
//
// Implementation:
//   • usePathname triggers on route change.
//   • A fixed-position overlay element animates a gold gradient from
//     translateX(-100%) → translateX(0) → translateX(100%) over 360ms.
//   • z-index 9000 — above everything except the GoldCurtain first-paint.
//   • Suppressed on initial mount (first pathname) so the GoldCurtain
//     stays the only entrance animation; we only sweep on subsequent
//     navigations.

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const SWEEP_MS = 360;

export default function RouteTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const isFirstPath = useRef(true);
  const lastPath = useRef(pathname);

  useEffect(() => {
    // Skip first mount — let GoldCurtain own the entrance.
    if (isFirstPath.current) {
      isFirstPath.current = false;
      lastPath.current = pathname;
      return;
    }
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    setActive(true);
    const t = setTimeout(() => setActive(false), SWEEP_MS + 40);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, transparent 25%, rgba(218,165,32,0.42) 48%, rgba(218,165,32,0.62) 50%, rgba(218,165,32,0.42) 52%, transparent 75%)",
          transform: "translateX(-100%)",
          animation: `gy-route-sweep ${SWEEP_MS}ms cubic-bezier(0.7, 0, 0.3, 1) forwards`,
        }}
      />
      <style jsx global>{`
        @keyframes gy-route-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0); }
          100% { transform: translateX(110%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden="true"] > [style*="gy-route-sweep"] { display: none; }
        }
      `}</style>
    </span>
  );
}
