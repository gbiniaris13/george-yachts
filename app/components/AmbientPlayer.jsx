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

  // Phase 27d (Forbes-launch eve, 2026-05-05) — Boss directive:
  // "κρύψε τελείως το εικονίδιο ή κάνε το μικρό κάπου πάνω δεξιά
  // εκεί που έχουμε τις σημαίες, εκεί που τα νομίσματα". Sound
  // functionality stays — only the visible affordance shrinks. The
  // pill becomes a 32×32 icon-only square that lives in the same
  // top-right band as the currency / language / social icons. Three
  // tiny equaliser bars indicate state (gold pulsing when playing,
  // dim ivory when off). No text label.
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Mute Greek summer ambient sound" : "Play Greek summer ambient sound"}
      aria-pressed={playing}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={playing ? "Mute" : "Listen"}
      className="gy-ambient-pill"
      style={{
        position: "fixed",
        // Sit in the top-right band aligned with the nav-header icon
        // row. --gy-top-offset accounts for the Forbes ribbon (36/32px).
        top: "calc(var(--gy-top-offset, 0px) + 38px)",
        right: 18,
        zIndex: 60,
        width: 32,
        height: 32,
        padding: 0,
        background: "transparent",
        border: `1px solid ${
          playing
            ? "rgba(218,165,32,0.55)"
            : hovered
            ? "rgba(218,165,32,0.4)"
            : "rgba(255,255,255,0.06)"
        }`,
        color: playing
          ? "#DAA520"
          : hovered
          ? "rgba(218,165,32,0.85)"
          : "rgba(218,165,32,0.45)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex", gap: 2, alignItems: "flex-end" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: 2,
              height: 11,
              background: "currentColor",
              borderRadius: 1,
              opacity: playing ? 0.9 : 0.45,
              transformOrigin: "bottom",
              animation: playing ? `gy-eq-bar ${0.7 + i * 0.18}s ease-in-out infinite` : "none",
              animationDelay: playing ? `${i * 0.12}s` : undefined,
            }}
          />
        ))}
      </span>
      <style jsx global>{`
        @keyframes gy-eq-bar {
          0%, 100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1.0);  }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-pressed="true"] [aria-hidden="true"] span { animation: none !important; }
        }
        /* Phase 27d — keep the icon visible on mobile too (since it's
           tiny now). It sits in the top-right corner, same band as
           the nav search icon, so it doesn't interfere with content. */
      `}</style>
    </button>
  );
}
