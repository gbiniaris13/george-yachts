"use client";

// E1 — Gold curtain first-visit opening animation.
//
// First impression piece. On first load per session, two vertical
// gold-edged black panels cover the viewport, then part down the
// middle to reveal the page underneath. Brief ΦΙΛΟΤΙΜΟ mark fades
// through the center, a gold hairline splits the seam, and the
// whole sequence resolves in ~1.9s.
//
// Guardrails:
//   - sessionStorage flag `gy_curtain_seen` → plays once per visit
//   - prefers-reduced-motion → we render nothing at all
//   - pointer-events: none after exit → zero UX tax
//   - hides overflow globally while it's mounted to prevent scroll
//     under the curtain
//
// The component mounts from layout.jsx at the top of <body> so it
// paints before the hero video kicks in.

import { useEffect, useState } from "react";

const STORAGE_KEY = "gy_curtain_seen";

export default function GoldCurtain() {
  const [phase, setPhase] = useState("pending"); // pending → open → done
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect OS-level reduced motion — skip entirely.
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduced) {
      setPhase("done");
      return;
    }

    // Only play on first visit of the session.
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) {
        setPhase("done");
        return;
      }
    } catch {
      /* private browsing — just play it */
    }

    setMounted(true);
    // Lock scroll while curtain is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Kick the "open" phase next frame so initial styles paint first.
    const raf = requestAnimationFrame(() => setPhase("open"));

    const tFinish = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = prev;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1900);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(tFinish);
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted || phase === "done") return null;

  const opening = phase === "open";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{
        opacity: opening ? 1 : 1, // handled by inner panels
      }}
    >
      {/* Left panel */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: "50%",
          background:
            "linear-gradient(90deg, #000 0%, #050505 80%, rgba(218,165,32,0.08) 100%)",
          borderRight: "1px solid rgba(218,165,32,0.35)",
          transform: opening ? "translateX(-100%)" : "translateX(0)",
          transition:
            "transform 1.25s cubic-bezier(0.76, 0, 0.24, 1) 0.55s",
          willChange: "transform",
        }}
      />

      {/* Right panel */}
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: "50%",
          background:
            "linear-gradient(270deg, #000 0%, #050505 80%, rgba(218,165,32,0.08) 100%)",
          borderLeft: "1px solid rgba(218,165,32,0.35)",
          transform: opening ? "translateX(100%)" : "translateX(0)",
          transition:
            "transform 1.25s cubic-bezier(0.76, 0, 0.24, 1) 0.55s",
          willChange: "transform",
        }}
      />

      {/* Center hairline — grows from 0 to full height, then fades */}
      <div
        className="absolute top-0 bottom-0 left-1/2"
        style={{
          width: "1px",
          marginLeft: "-0.5px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(218,165,32,0.85) 20%, rgba(218,165,32,0.85) 80%, transparent 100%)",
          transform: opening ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "50% 50%",
          transition: "transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)",
          opacity: opening ? 0 : 1,
          transitionProperty: "transform, opacity",
          transitionDuration: "0.55s, 0.4s",
          transitionDelay: "0s, 1.5s",
        }}
      />

      {/* Center mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            opacity: opening ? 0 : 1,
            transform: opening ? "translateY(-6px)" : "translateY(0)",
            transition:
              "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "8px",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#DAA520",
              marginBottom: "14px",
            }}
          >
            George Yachts
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4.5vw, 46px)",
              fontWeight: 200,
              letterSpacing: "0.12em",
              background:
                "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              lineHeight: 1,
            }}
          >
            ΦΙΛΟΤΙΜΟ
          </div>
          <div
            style={{
              width: "48px",
              height: "1px",
              margin: "18px auto 0",
              background:
                "linear-gradient(to right, transparent, rgba(218,165,32,0.65), transparent)",
              transform: opening ? "scaleX(0)" : "scaleX(1)",
              transition: "transform 0.5s ease 0.25s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
