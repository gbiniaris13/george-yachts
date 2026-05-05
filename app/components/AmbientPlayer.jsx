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

  // Restore stored preference but DON'T autoplay — modern browsers
  // require a user gesture. We only show the "on" state if the visitor
  // explicitly turned it on before, which still requires another gesture
  // to actually start. We toggle on first interaction.
  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "on") {
        // Wait for any interaction to autoresume — autoplay policy.
        const start = () => {
          setPlaying(true);
          window.removeEventListener("pointerdown", start);
          window.removeEventListener("keydown", start);
        };
        window.addEventListener("pointerdown", start, { once: true });
        window.addEventListener("keydown", start, { once: true });
      }
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

    // ── 1. Wave bed (filtered pink-ish noise + slow swell)
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // Low-pass IIR for "pink-ish" noise (ocean reads as warm noise).
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 8;
      }
    }
    const waveSrc = ctx.createBufferSource();
    waveSrc.buffer = noiseBuffer;
    waveSrc.loop = true;

    const waveLP = ctx.createBiquadFilter();
    waveLP.type = "lowpass";
    waveLP.frequency.value = 420;
    waveLP.Q.value = 0.7;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.62;

    // Swell LFO modulating waveGain
    const swellLFO = ctx.createOscillator();
    swellLFO.type = "sine";
    swellLFO.frequency.value = 0.10; // 10s period
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.18;
    swellLFO.connect(swellDepth).connect(waveGain.gain);

    waveSrc.connect(waveLP).connect(waveGain).connect(master);
    waveSrc.start();
    swellLFO.start();
    cleanupRef.current.push(() => { try { waveSrc.stop(); } catch {} });
    cleanupRef.current.push(() => { try { swellLFO.stop(); } catch {} });

    // ── 2. Seagull — sparse pitch-sweeping triangle bursts
    const seagullScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900 + Math.random() * 600, now);
      osc.frequency.exponentialRampToValueAtTime(420 + Math.random() * 200, now + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.06, now + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1500;
      osc.connect(bp).connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 0.6);
    };
    // Trigger every 10–24 s
    const seagullInterval = setInterval(() => {
      if (Math.random() < 0.55) seagullScheduler();
    }, 12000 + Math.random() * 12000);
    cleanupRef.current.push(() => clearInterval(seagullInterval));
    setTimeout(seagullScheduler, 4500);

    // ── 3. Cicada — band-passed gated noise, very faint
    const cicadaSrc = ctx.createBufferSource();
    cicadaSrc.buffer = noiseBuffer;
    cicadaSrc.loop = true;
    const cicadaBP = ctx.createBiquadFilter();
    cicadaBP.type = "bandpass";
    cicadaBP.frequency.value = 5200;
    cicadaBP.Q.value = 14;
    const cicadaGain = ctx.createGain();
    cicadaGain.gain.value = 0.025;
    // Fast tremolo gate to fake the buzz cadence
    const cicadaLFO = ctx.createOscillator();
    cicadaLFO.type = "sine";
    cicadaLFO.frequency.value = 22; // 22 Hz tremolo
    const cicadaLFOAmp = ctx.createGain();
    cicadaLFOAmp.gain.value = 0.018;
    cicadaLFO.connect(cicadaLFOAmp).connect(cicadaGain.gain);

    cicadaSrc.connect(cicadaBP).connect(cicadaGain).connect(master);
    cicadaSrc.start();
    cicadaLFO.start();
    cleanupRef.current.push(() => { try { cicadaSrc.stop(); } catch {} });
    cleanupRef.current.push(() => { try { cicadaLFO.stop(); } catch {} });

    // Fade IN master gain
    const now = ctx.currentTime;
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(TARGET_VOLUME, now + FADE_MS / 1000);

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
        // Bug fix: Forbes top bar (36px desktop / 32px mobile) sits at
        // top:0 with z-index 80. Anchor below it via the --gy-top-offset
        // CSS var that body.gy-with-forbes-bar sets. Auto-collapses to
        // 12px when the bar is dismissed.
        top: "calc(var(--gy-top-offset, 0px) + 12px)",
        right: 124,
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
          /* Hide the ambient pill on phones — adds clutter; rebroadcast
             via NavDrawer settings later if Boss wants it surfaceable. */
          button[aria-label*="ambient sound"] {
            display: none !important;
          }
        }
      `}</style>
    </button>
  );
}
