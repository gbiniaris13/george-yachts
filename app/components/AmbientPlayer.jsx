"use client";

// Phase 2 / F4 (Boss luxury rebuild brief, 2026-05-05) —
// Ambient Greek-summer soundscape.
//
// Boss decision: waves + seagulls + cicadas. NO bouzouki (clichéd).
//
// Implementation: synthesised entirely in the Web Audio API. Zero
// audio file requests, zero licensing concerns, zero CDN dependency.
// The mix evolves slowly so visitors who turn it on don't hear a
// loop — every play session sounds slightly different.
//
// UX:
//   • Mute by default. Tiny gold pill in the top-right of viewport
//     (next to language switcher). Click to play, click to mute.
//   • localStorage remembers preference for next visit.
//   • Suppressed on /admin, /partner-portal, /privacy, /api routes.
//   • Single render even on route changes — uses fixed positioning.
//   • Fades volume in/out so toggling doesn't pop.
//
// Layered synthesis:
//   1. Wave bed   — pink-ish noise → low-pass 380 Hz → slow swell LFO
//   2. Seagull    — triangle wave bursts with pitch sweep, ~once / 18s
//   3. Cicada     — band-passed square at ~5kHz, rhythmic gate
//
// All three layers feed a master gain that ramps to 0 when muted.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "gy_ambient_pref";
const SUPPRESSED_PREFIXES = [
  "/admin",
  "/partner-portal",
  "/privacy/delete",
  "/api/",
];

const TARGET_VOLUME = 0.085; // soft — never invasive
const FADE_MS = 1400;

export default function AmbientPlayer() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const cleanupRef = useRef([]);

  // Boss directive 2026-05-05: ambient sound should default to ON for
  // new visitors. They can mute if they want — but the Greek summer
  // soundscape is the first impression, not a hidden feature. Browser
  // autoplay policy still requires a user gesture, so we wait for the
  // first pointerdown / keydown / scroll / touchstart anywhere on the
  // page and start the audio graph then.
  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Treat null (first visit) AND "on" the same way — both should
      // attempt autoplay on first gesture. Only "off" (user explicitly
      // muted) skips the listener.
      if (saved === "off") return;
      const start = () => {
        setPlaying(true);
        if (saved === null) {
          // First visit — write "on" so subsequent navigations remember.
          try { localStorage.setItem(STORAGE_KEY, "on"); } catch {}
        }
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
        window.removeEventListener("scroll", start);
        window.removeEventListener("touchstart", start);
      };
      window.addEventListener("pointerdown", start, { once: true, passive: true });
      window.addEventListener("keydown", start, { once: true, passive: true });
      window.addEventListener("scroll", start, { once: true, passive: true });
      window.addEventListener("touchstart", start, { once: true, passive: true });
    } catch {}
  }, [suppressed]);

  // Drive the audio graph based on `playing`.
  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;

    const teardown = () => {
      cleanupRef.current.forEach((fn) => { try { fn(); } catch {} });
      cleanupRef.current = [];
    };

    if (!playing) {
      // Fade out then stop.
      if (masterGainRef.current && ctxRef.current) {
        const now = ctxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_MS / 1000);
        const t = setTimeout(() => {
          teardown();
          if (ctxRef.current) {
            try { ctxRef.current.close(); } catch {}
            ctxRef.current = null;
            masterGainRef.current = null;
          }
        }, FADE_MS + 60);
        return () => clearTimeout(t);
      }
      return;
    }

    // Build the graph.
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      setPlaying(false);
      return;
    }
    const ctx = new Ctx();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // ── 1. Deep ocean rumble — brown-noise bed, heavily low-passed.
    // Boss feedback (2026-05-05): the prior pink-noise version sounded
    // like wind, which makes UHNW guests imagine bad weather. Brown
    // noise (Brownian / random-walk integration) has a -6dB/oct slope
    // vs pink's -3dB/oct, so the spectrum is dominated by the deep
    // bass that real ocean rumble carries.
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 6, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise: random walk with leakage.
        last = (last + 0.018 * white) * 0.998;
        data[i] = last * 16;
      }
    }
    const oceanSrc = ctx.createBufferSource();
    oceanSrc.buffer = noiseBuffer;
    oceanSrc.loop = true;

    const oceanLP = ctx.createBiquadFilter();
    oceanLP.type = "lowpass";
    oceanLP.frequency.value = 220; // tight cut so no airy hiss
    oceanLP.Q.value = 0.5;

    const oceanGain = ctx.createGain();
    oceanGain.gain.value = 0.45;
    oceanSrc.connect(oceanLP).connect(oceanGain).connect(master);
    oceanSrc.start();
    cleanupRef.current.push(() => { try { oceanSrc.stop(); } catch {} });

    // ── 2. Wave crashes — separate noise source, mid-band filter,
    //     fired in shaped envelopes every 4-7 seconds. This is what
    //     makes the bed sound like *waves* instead of *static*.
    const crashScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      // Pull a chunk of the existing noise buffer
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = false;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 600 + Math.random() * 400; // mid-band "wash"
      bp.Q.value = 0.8;

      const lp2 = ctx.createBiquadFilter();
      lp2.type = "lowpass";
      lp2.frequency.value = 1500;

      const g = ctx.createGain();
      const peak = 0.18 + Math.random() * 0.12;
      // Wave envelope: gentle build (~0.6s), peak crash, slow tail (~3.5s)
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak * 0.5, now + 0.55);
      g.gain.linearRampToValueAtTime(peak, now + 0.85);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

      src.connect(bp).connect(lp2).connect(g).connect(master);
      const offset = Math.random() * (noiseBuffer.duration - 5);
      src.start(now, offset);
      src.stop(now + 4.5);
    };
    // First crash kicks in immediately so the visitor hears a wave
    // within the first second — Boss directive: "first 3 seconds".
    setTimeout(crashScheduler, 250);
    setTimeout(crashScheduler, 1800);
    const crashInterval = setInterval(crashScheduler, 4500 + Math.random() * 2500);
    cleanupRef.current.push(() => clearInterval(crashInterval));

    // ── 3. Slow ocean breath — sub-audible bass swell that rides
    //     under the crashes giving the mix "lungs". 0.06 Hz period.
    const breathOsc = ctx.createOscillator();
    breathOsc.type = "sine";
    breathOsc.frequency.value = 0.07;
    const breathAmp = ctx.createGain();
    breathAmp.gain.value = 0.12;
    breathOsc.connect(breathAmp).connect(oceanGain.gain);
    breathOsc.start();
    cleanupRef.current.push(() => { try { breathOsc.stop(); } catch {} });

    // ── 4. Seagulls — pitch-sweeping triangle bursts. More frequent
    //     than the prior version (every 8-15s) so the ear has more
    //     "place markers" telling it: this is the Greek coast, not
    //     a beach machine.
    const seagullScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900 + Math.random() * 600, now);
      osc.frequency.exponentialRampToValueAtTime(420 + Math.random() * 200, now + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05, now + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1500;
      osc.connect(bp).connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 0.6);
    };
    setTimeout(seagullScheduler, 2200);
    const seagullInterval = setInterval(() => {
      if (Math.random() < 0.7) seagullScheduler();
    }, 8000 + Math.random() * 7000);
    cleanupRef.current.push(() => clearInterval(seagullInterval));

    // ── 5. Dolphin whistles & clicks — sparse, magical, Mediterranean.
    //     Boss directive 2026-05-05 (second pass): "delphinia ... kati
    //     elliniko edition alla oxi laiko ... gia ploysious". Dolphins
    //     are the Mediterranean equivalent of nightingales — heard
    //     rarely but unforgettably from a yacht deck.
    const dolphinScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      // Whistle: a curved high-frequency sine sweep, ~0.5s.
      const whistle = ctx.createOscillator();
      whistle.type = "sine";
      const startF = 2400 + Math.random() * 1800;
      const peakF = startF + 1400 + Math.random() * 1200;
      const endF = startF - 200;
      whistle.frequency.setValueAtTime(startF, now);
      whistle.frequency.exponentialRampToValueAtTime(peakF, now + 0.22);
      whistle.frequency.exponentialRampToValueAtTime(endF, now + 0.55);
      const wg = ctx.createGain();
      wg.gain.setValueAtTime(0, now);
      wg.gain.linearRampToValueAtTime(0.04, now + 0.08);
      wg.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      whistle.connect(wg).connect(master);
      whistle.start(now);
      whistle.stop(now + 0.7);

      // Optional click pair — short rapid pulses ~200ms after the whistle.
      if (Math.random() < 0.55) {
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
          const t = now + 0.65 + i * 0.06;
          const click = ctx.createOscillator();
          click.type = "square";
          click.frequency.value = 6400 + Math.random() * 800;
          const cg = ctx.createGain();
          cg.gain.setValueAtTime(0, t);
          cg.gain.linearRampToValueAtTime(0.018, t + 0.005);
          cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
          const cbp = ctx.createBiquadFilter();
          cbp.type = "highpass";
          cbp.frequency.value = 4000;
          click.connect(cbp).connect(cg).connect(master);
          click.start(t);
          click.stop(t + 0.06);
        }
      }
    };
    // First dolphin call lands ~9s in — magical "this place is alive".
    setTimeout(dolphinScheduler, 9000);
    const dolphinInterval = setInterval(() => {
      if (Math.random() < 0.5) dolphinScheduler();
    }, 24000 + Math.random() * 18000); // every 24-42s, ~50% fire rate
    cleanupRef.current.push(() => clearInterval(dolphinInterval));

    // ── 6. Aspirational harmonic pad — three sustained pure-sine
    //     intervals (root + perfect fifth + octave) at C2/G2/C3 with
    //     extremely soft mix. This is what gives the soundscape its
    //     "movie soundtrack" emotional warmth without sounding folk.
    //     Slow LFO swells the pad in and out so it never feels static.
    const padFreqs = [65.41, 98.00, 130.81, 196.00]; // C2, G2, C3, G3
    const padGain = ctx.createGain();
    padGain.gain.value = 0.0;
    padGain.connect(master);
    padFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      // Slight detune per voice for richness.
      osc.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = 0.022 / (i * 0.5 + 1);
      osc.connect(g).connect(padGain);
      osc.start();
      cleanupRef.current.push(() => { try { osc.stop(); } catch {} });
    });
    // Pad LFO — 0.05Hz so the pad breathes over ~20s.
    const padLFO = ctx.createOscillator();
    padLFO.type = "sine";
    padLFO.frequency.value = 0.045;
    const padLFOAmp = ctx.createGain();
    padLFOAmp.gain.value = 0.5;
    const padBaseDC = ctx.createConstantSource();
    padBaseDC.offset.value = 0.6;
    padBaseDC.start();
    padLFO.connect(padLFOAmp);
    padBaseDC.connect(padGain.gain);
    padLFOAmp.connect(padGain.gain);
    padLFO.start();
    cleanupRef.current.push(() => { try { padLFO.stop(); } catch {} });
    cleanupRef.current.push(() => { try { padBaseDC.stop(); } catch {} });

    // ── 7. Distant temple bell — very rare antiquity touch.
    //     Plucked harmonic stack with long decay. Fires every 90-150s
    //     so it's noticed once, never habituated to.
    const bellScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      const fundamentals = [392, 587]; // G4 + D5 — clean fifth, antique
      fundamentals.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.025 / (i + 1), now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 4.7);
      });
    };
    setTimeout(bellScheduler, 30000);
    const bellInterval = setInterval(() => {
      if (Math.random() < 0.6) bellScheduler();
    }, 90000 + Math.random() * 60000);
    cleanupRef.current.push(() => clearInterval(bellInterval));

    // Fade IN master gain
    const fadeStart = ctx.currentTime;
    master.gain.setValueAtTime(0, fadeStart);
    master.gain.linearRampToValueAtTime(TARGET_VOLUME, fadeStart + FADE_MS / 1000);

    return teardown;
  }, [playing, suppressed]);

  // Toggle handler
  const onToggle = () => {
    setPlaying((v) => {
      const next = !v;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {}
      try {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "ambient_toggle", { state: next ? "on" : "off" });
        }
      } catch {}
      return next;
    });
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
        // Boss bug fix (2026-05-05 second pass): the top-right area is
        // already crowded by the language switcher, currency switcher,
        // search and hamburger icons. Move the ambient pill to the
        // BOTTOM-LEFT, where nothing else lives, so it's discoverable
        // without crashing into existing nav.
        bottom: 24,
        left: 24,
        zIndex: 70,
        height: 30,
        padding: "0 14px",
        background: hovered
          ? "rgba(218,165,32,0.18)"
          : "rgba(0,0,0,0.6)",
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
        {/* Mini equalizer bars — animated only when playing */}
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
          /* Phones: keep the pill visible (now bottom-left, no clutter
             at the top anymore). Compact the label to just the icon
             to keep the footprint tiny. */
          button[aria-label*="ambient sound"] > span:last-of-type {
            display: none !important;
          }
        }
      `}</style>
    </button>
  );
}
