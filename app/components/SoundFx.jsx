"use client";

// Phase 27i.3 (2026-05-07) — cinematic sound FX layer.
//
// Web-Audio-synthesised bell chimes + section-reveal tones. Zero
// external audio files (no bundle bloat), all sounds are sine-wave
// stacks with envelope shaping. Sounds are quiet (peak ~0.18 of
// full amplitude) so they read as "barely audible cue" instead of
// "Slack notification".
//
// Triggers (all listen at the document level, no per-element wiring):
//   • mouseenter on [data-sound-hover] OR a/.button.premium  →  soft chime
//   • click on [data-sound-click] OR primary CTAs            →  warmer bell
//   • IntersectionObserver on [data-sound-reveal]            →  deep tone
//
// Mute state: shares the existing AmbientPlayer key
// (`gy_ambient_session_muted`) so the user's one mute toggle covers
// every sound on the site. `gy:ambient-mute-changed` custom event
// fires from AmbientPlayer when toggled — we listen for it.

import { useEffect, useRef } from "react";

const MUTE_KEY = "gy_ambient_session_muted";

// Pre-tuned for "expensive lobby" feel: bright but not piercing,
// gold-leaf chime tonality.
const PRESETS = {
  // Light hover — single soft sine bell with one harmonic.
  hover: {
    freqs: [1318.5, 2637], // E6 + E7
    gains: [0.10, 0.04],
    attack: 0.005,
    decay: 0.25,
    type: "sine",
  },
  // Click — fuller bell, three-stack.
  click: {
    freqs: [880, 1760, 2640], // A5 + A6 + E7
    gains: [0.14, 0.06, 0.03],
    attack: 0.004,
    decay: 0.5,
    type: "sine",
  },
  // Section reveal — deep, foundational. Matches the navy-of-night
  // tone of the homepage. Short, just one note.
  reveal: {
    freqs: [220, 440], // A3 + A4
    gains: [0.08, 0.04],
    attack: 0.04,
    decay: 1.4,
    type: "sine",
  },
};

function isMuted() {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function SoundFx() {
  const ctxRef = useRef(null);
  const armedRef = useRef(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    mutedRef.current = isMuted();

    function getCtx() {
      if (ctxRef.current) return ctxRef.current;
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctxRef.current = new C();
      return ctxRef.current;
    }

    function play(preset) {
      if (mutedRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      // Browser autoplay: AudioContext starts suspended until a user
      // gesture. Resume on every play (cheap when already running).
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const { freqs, gains, attack, decay, type } = preset;
      const t = ctx.currentTime;

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        // Gold-leaf bell envelope: sharp attack, exponential decay.
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(gains[i], t + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + attack + decay + 0.05);
      });
    }

    // Arm only after first user gesture (browser autoplay policy).
    function arm() {
      armedRef.current = true;
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    }
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });

    // Hover handler — gated to whitelisted selectors so we don't
    // chime on every <div> the cursor crosses.
    const HOVER_SEL = '[data-sound-hover], a[href^="https://calendly.com"], a[href^="https://wa.me"], button.gy-premium-cta';
    function onMouseOver(e) {
      if (!armedRef.current) return;
      const target = e.target?.closest?.(HOVER_SEL);
      if (!target || target.dataset.soundFxArmed) return;
      // 600ms cooldown per element so a wiggling cursor doesn't trill.
      target.dataset.soundFxArmed = "1";
      setTimeout(() => delete target.dataset.soundFxArmed, 600);
      play(PRESETS.hover);
    }
    document.addEventListener("mouseover", onMouseOver, true);

    // Click handler — fires the warmer bell on premium CTAs.
    const CLICK_SEL = '[data-sound-click], a.gy-premium-cta, button.gy-premium-cta';
    function onClick(e) {
      if (!armedRef.current) return;
      if (!e.target?.closest?.(CLICK_SEL)) return;
      play(PRESETS.click);
    }
    document.addEventListener("click", onClick, true);

    // Section reveal observer — fires the deep tone once per
    // [data-sound-reveal] section as it enters the viewport.
    const observed = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        if (!armedRef.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (observed.has(entry.target)) continue;
          observed.add(entry.target);
          play(PRESETS.reveal);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0.4 },
    );
    document.querySelectorAll("[data-sound-reveal]").forEach((el) => io.observe(el));

    // Listen for the existing AmbientPlayer's mute toggle so a
    // single click on the equaliser pill silences SFX too.
    function onMuteChange() {
      mutedRef.current = isMuted();
    }
    window.addEventListener("gy:ambient-mute-changed", onMuteChange);
    window.addEventListener("storage", onMuteChange);

    return () => {
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("gy:ambient-mute-changed", onMuteChange);
      window.removeEventListener("storage", onMuteChange);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      io.disconnect();
      try { ctxRef.current?.close?.(); } catch {}
      ctxRef.current = null;
    };
  }, []);

  return null;
}
