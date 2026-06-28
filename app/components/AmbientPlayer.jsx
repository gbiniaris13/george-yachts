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

// Phase 27e (Forbes-launch eve, 2026-05-05) — MP3 fallback chain.
// Boss complained 7+ times that the synth ambient sounds like wind
// not ocean. Solution that doesn't require ripping out the synth: at
// click time, FIRST try to play a real CC0 ocean recording from
// /public/audio/ocean.mp3 (HTML5 <audio>, looped). If the file doesn't
// exist or fails to decode, fall back to the existing Web Audio synth.
// George just drops a CC0 ocean.mp3 into /public/audio/ and the site
// auto-upgrades on next deploy. Three free CC0 sources documented in
// /public/audio/README.md.
const OCEAN_MP3 = "/audio/ocean.mp3";
const TRY_MP3_TIMEOUT_MS = 1500;

async function tryMp3(audioRef, masterGainRef) {
  try {
    if (!audioRef.current) {
      audioRef.current = new Audio(OCEAN_MP3);
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.crossOrigin = "anonymous";
    }
    const a = audioRef.current;
    a.volume = 0;
    // Wait for the file to be decodable. If 404 / decode error, throw.
    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("mp3 timeout")), TRY_MP3_TIMEOUT_MS);
      const onCanPlay = () => { clearTimeout(t); a.removeEventListener("canplay", onCanPlay); resolve(); };
      const onError = (e) => { clearTimeout(t); a.removeEventListener("error", onError); reject(e); };
      a.addEventListener("canplay", onCanPlay, { once: true });
      a.addEventListener("error", onError, { once: true });
      // load() is required to actually fetch the file
      try { a.load(); } catch {}
    });
    await a.play();
    // Fade gain in
    const target = TARGET_VOLUME * 0.7;
    const fadeMs = FADE_MS;
    const startTs = performance.now();
    const fade = () => {
      const t = Math.min(1, (performance.now() - startTs) / fadeMs);
      a.volume = target * t;
      if (t < 1) requestAnimationFrame(fade);
    };
    fade();
    masterGainRef.current = { source: "mp3", node: a };
    return true;
  } catch {
    // Any failure (404, network, decode) → caller falls back to synth
    return false;
  }
}

function teardownMp3(audioRef) {
  const a = audioRef.current;
  if (!a) return;
  try {
    // Fade out then pause
    const startVol = a.volume;
    const startTs = performance.now();
    const fade = () => {
      const t = Math.min(1, (performance.now() - startTs) / FADE_MS);
      a.volume = startVol * (1 - t);
      if (t < 1) requestAnimationFrame(fade);
      else { try { a.pause(); a.currentTime = 0; } catch {} }
    };
    fade();
  } catch {}
}

export default function AmbientPlayer() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const cleanupRef = useRef([]);
  // Phase 27e — separate ref for the HTML5 <audio> element fallback.
  const audioRef = useRef(null);

  // Tear down the graph (called on mute click + on unmount).
  const teardown = () => {
    // Pause MP3 first if it was playing
    teardownMp3(audioRef);
    cleanupRef.current.forEach((fn) => { try { fn(); } catch {} });
    cleanupRef.current = [];
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch {}
      ctxRef.current = null;
      masterGainRef.current = null;
    }
  };

  // Build helper — try MP3 first, fall back to synth.
  // Returns boolean. Async because MP3 attempt awaits canplay.
  const buildAndPlay = async () => {
    if (suppressed) return false;
    const mp3ok = await tryMp3(audioRef, masterGainRef);
    if (mp3ok) return true;
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
  const onToggle = async () => {
    if (playing) {
      // Mute: fade out, teardown, mark session-muted.
      // Phase 27e — masterGainRef may be a synth gain node OR a wrapper
      // { source: 'mp3', node: HTMLAudioElement } when MP3 is active.
      // teardown() handles both via teardownMp3 + ctx close.
      if (
        masterGainRef.current &&
        masterGainRef.current.gain && // synth gain node has .gain
        ctxRef.current
      ) {
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
      // Phase 27i (2026-05-07) — broadcast mute change so the SFX
      // layer (SoundFx.jsx) silences in lockstep with the ambient
      // pill. Single user-facing mute toggle, every sound on the
      // site obeys it.
      try { window.dispatchEvent(new CustomEvent("gy:ambient-mute-changed")); } catch {}
    } else {
      // Unmute: try MP3 first, fall back to synth (this click counts
      // as the user gesture for both paths).
      const ok = await buildAndPlay();
      if (ok) {
        try { sessionStorage.removeItem(SESSION_MUTE_KEY); } catch {}
        setPlaying(true);
        try { window.dispatchEvent(new CustomEvent("gy:ambient-mute-changed")); } catch {}
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
  // εκεί που έχουμε τις σημαίες". The pill became a 32×32 icon-only
  // square. Three tiny equaliser bars indicate state (gold pulsing
  // when playing, dim ivory when off).
  //
  // Phase 27i (2026-05-07) — Boss flagged that the pill was overlapping
  // the wishlist/heart icon by ~18 px horizontally and 32 px vertically
  // (top-right was already crowded with search + currency + flag +
  // Instagram + LinkedIn + heart). Moved to BOTTOM-LEFT so it lives
  // alone and never collides with anything. Same 32×32 size, same
  // gold equaliser bars, same single-tap mute toggle.
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
        // Bottom-left, well clear of the right-side floating column
        // (G / SPEAK / WhatsApp) and the top-right nav icon strip.
        bottom: 24,
        left: 24,
        zIndex: 60,
        width: 32,
        height: 32,
        padding: 0,
        background: "transparent",
        border: `1px solid ${
          playing
            ? "rgba(201,168,76,0.55)"
            : hovered
            ? "rgba(201,168,76,0.4)"
            : "rgba(248, 245, 240,0.06)"
        }`,
        color: playing
          ? "#C9A84C"
          : hovered
          ? "rgba(201,168,76,0.85)"
          : "rgba(201,168,76,0.45)",
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
        /* Phase 27d - keep the icon visible on mobile too (since it's
           tiny now). It sits in the top-right corner, same band as
           the nav search icon, so it doesn't interfere with content. */
      `}</style>
    </button>
  );
}
