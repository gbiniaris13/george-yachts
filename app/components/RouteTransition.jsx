"use client";

// Phase 27b (Forbes-launch eve, 2026-05-05) — VELVET CURTAIN page
// transition. Replaces the previous Hermès gold-sweep ribbon with a
// pair of black velvet curtains that meet in the middle with a thin
// gold seam, hold briefly, then part outward to reveal the new page.
//
// Reference: real-world theatre velvet, Bulgari/Bottega launch reels.
// Why velvet over a flat sweep: the holding pause creates the
// "ceremonial reveal" UHNW visitors associate with old-money venues
// — galleries, opera houses, vintage hotels. A horizontal sweep
// reads as a click-through; a curtain reads as a presentation.
//
// Implementation:
//   • Two fixed half-screen panels (left + right) with a vertical
//     gold seam between them.
//   • Phase 1 (0–280ms): both panels slide IN from off-screen.
//   • Phase 2 (280–400ms): hold + faint vertical gold shimmer at seam.
//   • Phase 3 (400–760ms): both panels slide OUT to their respective
//     viewport edges, revealing the new page underneath.
//   • Skipped on initial mount (let GoldCurtain own the entrance).
//   • Skipped under prefers-reduced-motion.

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const PHASE_IN = 280;
const HOLD = 120;
const PHASE_OUT = 360;
const TOTAL = PHASE_IN + HOLD + PHASE_OUT; // 760ms

export default function RouteTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const isFirstPath = useRef(true);
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      lastPath.current = pathname;
      return;
    }
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    setActive(true);
    const t = setTimeout(() => setActive(false), TOTAL + 40);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  // Velvet panel — radial gradient from center-darker to edge-lighter
  // mimics the way real velvet catches light at folds. The diagonal
  // overlay adds the subtle vertical "fold lines" that give cloth its
  // identity (vs flat black paint).
  const velvetBg = `
    radial-gradient(ellipse at 50% 40%, #0D1B2A 0%, #0D1B2A 60%, #0D1B2A 100%),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 14px
    )
  `;

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
      {/* Left curtain */}
      <span
        className="gy-velvet-curtain gy-velvet-left"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "50%",
          background: velvetBg,
          transform: "translateX(-100%)",
          boxShadow: "inset -16px 0 32px rgba(0, 0, 0, 0.85)",
        }}
      />
      {/* Right curtain */}
      <span
        className="gy-velvet-curtain gy-velvet-right"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "50%",
          background: velvetBg,
          transform: "translateX(100%)",
          boxShadow: "inset 16px 0 32px rgba(0, 0, 0, 0.85)",
        }}
      />
      {/* Gold seam — appears at the meeting line */}
      <span
        className="gy-velvet-seam"
        style={{
          position: "absolute",
          top: "10%",
          bottom: "10%",
          left: "50%",
          width: "1px",
          transform: "translateX(-50%) scaleY(0)",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.85) 25%, #C9A84C 50%, rgba(201,168,76,0.85) 75%, transparent 100%)",
          boxShadow:
            "0 0 16px rgba(201,168,76,0.6), 0 0 32px rgba(201,168,76,0.3)",
        }}
      />
      <style jsx global>{`
        @keyframes gyVelvetIn {
          0%   { transform: translateX(var(--from)); }
          100% { transform: translateX(0); }
        }
        @keyframes gyVelvetOut {
          0%   { transform: translateX(0); }
          100% { transform: translateX(var(--to)); }
        }
        @keyframes gyVelvetSeam {
          0%   { transform: translateX(-50%) scaleY(0); opacity: 0; }
          25%  { transform: translateX(-50%) scaleY(1); opacity: 1; }
          75%  { transform: translateX(-50%) scaleY(1); opacity: 1; }
          100% { transform: translateX(-50%) scaleY(0); opacity: 0; }
        }
        .gy-velvet-left {
          --from: -100%;
          --to:   -110%;
          animation:
            gyVelvetIn  ${PHASE_IN}ms cubic-bezier(0.16, 1, 0.3, 1) forwards,
            gyVelvetOut ${PHASE_OUT}ms cubic-bezier(0.7, 0, 0.3, 1) ${PHASE_IN + HOLD}ms forwards;
        }
        .gy-velvet-right {
          --from: 100%;
          --to:   110%;
          animation:
            gyVelvetIn  ${PHASE_IN}ms cubic-bezier(0.16, 1, 0.3, 1) forwards,
            gyVelvetOut ${PHASE_OUT}ms cubic-bezier(0.7, 0, 0.3, 1) ${PHASE_IN + HOLD}ms forwards;
        }
        .gy-velvet-seam {
          animation: gyVelvetSeam ${TOTAL}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-velvet-curtain, .gy-velvet-seam { display: none; }
        }
      `}</style>
    </span>
  );
}
