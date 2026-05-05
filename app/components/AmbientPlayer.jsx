"use client";

// Phase 17 (luxury rebuild, 2026-05-05) — clean rewrite.
//
// Boss has had the icon-flips-but-no-sound bug across SEVEN attempts.
// Root cause is React 18 batching: setState defers the audio-graph
// build to a later commit phase, OUTSIDE the user-activation stack
// frame, leaving the AudioContext suspended.
//
// THIS REWRITE FIXES IT BY MOVING THE FULL BUILD INTO THE GESTURE
// HANDLER. No build code in any useEffect. The audio graph is created
// 100% synchronously during the first mousemove/click/scroll/touch.
//
// Layout: pill at bottom-left.
// Default state: ON for every visit. Mute is session-only.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { buildAmbientGraph, TARGET_VOLUME, FADE_MS } from "@/lib/ambient-audio";

const SESSION_MUTE_KEY = "gy_ambient_session_muted";
const LEGACY_KEY = "gy_ambient_pref";
const SUPPRESSED_PREFIXES = ["/admin", "/partner-portal", "/privacy/delete", "/api/"];

export default function AmbientPlayer() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const cleanupRef = useRef([]);

  // Tear down the graph (called on mute click + on unmount).
  const teardown = () => {
    cleanupRef.current.forEach((fn) => { try { fn(); } catch {} });
    cleanupRef.current = [];
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch {}
      ctxRef.current = null;
      masterGainRef.current = null;
    }
  };

  // Build helper — invoked from gesture and from button click.
  const buildAndPlay = () => {
    if (suppressed) return false;
    const ok = buildAmbientGraph({ ctxRef, masterGainRef, cleanupRef });
    return ok;
  };

  // Phase 17d (luxury rebuild, 2026-05-05) — autoplay path retired.
  //
  // Two compounding realities forced this:
  //   1. Browser autoplay policy: Chrome/Safari/Firefox require an
  //      ACTIVE click / tap / keydown gesture before audio can play.
  //      Mousemove + scroll + wheel do NOT satisfy the autoplay gate.
  //      No site on the planet autoplays audio on first visit.
  //   2. The Web-Audio-synthesised soundscape (regardless of how many
  //      passes I tuned it) doesn't read as real ocean — Boss's
  //      tester literally said "από το διάστημα" (sounds like outer
  //      space). Synthesis can't fake hydrophone-grade ocean.
  //
  // Plan when assets land: drop a real CC0 ocean recording into
  // /public/audio/, switch to HTML5 <audio src loop>, trigger play()
  // from the pill onClick. For now the pill stays as the explicit
  // opt-in. No pre-emptive listeners.

  // Cleanup on unmount.
  useEffect(() => {
    return () => teardown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle handler — manual button click.
  const onToggle = () => {
    if (playing) {
      // Mute: fade out, teardown, mark session-muted.
      if (masterGainRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime;
        try {
          masterGainRef.current.gain.cancelScheduledValues(now);
          masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
          masterGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_MS / 1000);
        } catch {}
        setTimeout(() => teardown(), FADE_MS + 50);
      } else {
        teardown();
      }
      try { sessionStorage.setItem(SESSION_MUTE_KEY, "1"); } catch {}
      setPlaying(false);
    } else {
      // Unmute: build graph (this click counts as a user gesture).
      const ok = buildAndPlay();
      if (ok) {
        try { sessionStorage.removeItem(SESSION_MUTE_KEY); } catch {}
        setPlaying(true);
      }
    }
    try {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "ambient_toggle", { state: playing ? "off" : "on" });
      }
    } catch {}
  };

  if (suppressed) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Mute Greek summer ambient sound" : "Play Greek summer ambient sound"}
      aria-pressed={playing}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={playing ? "Mute" : "Listen"}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 70,
        height: 30,
        padding: "0 14px",
        background: hovered ? "rgba(218,165,32,0.18)" : "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${playing || hovered ? "rgba(218,165,32,0.55)" : "rgba(218,165,32,0.22)"}`,
        color: playing || hovered ? "#DAA520" : "rgba(218,165,32,0.7)",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex", gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: 2,
              height: 10,
              background: "currentColor",
              borderRadius: 1,
              opacity: playing ? 0.85 : 0.35,
              transformOrigin: "bottom",
              animation: playing ? `gy-eq-bar ${0.7 + i * 0.18}s ease-in-out infinite` : "none",
              animationDelay: playing ? `${i * 0.12}s` : undefined,
            }}
          />
        ))}
      </span>
      <span>{playing ? "Greek Summer" : "Ambient Sound"}</span>
      <style jsx global>{`
        @keyframes gy-eq-bar {
          0%, 100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1.0);  }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-pressed="true"] [aria-hidden="true"] span { animation: none !important; }
        }
        @media (max-width: 700px) {
          button[aria-label*="ambient sound"] > span:last-of-type {
            display: none !important;
          }
        }
        /* Phase 27 (mobile audit) — the StickyFleetCTA full-width bar
           sits at bottom:0 on every non-fleet route and covers anything
           in the bottom-left below 76px. Cleaner to hide the ambient
           pill entirely on mobile (it's optional decoration; the FAB
           stack on the right is what visitors actually use). */
        @media (max-width: 700px) {
          button[aria-label*="ambient sound"] { display: none !important; }
        }
      `}</style>
    </button>
  );
}
