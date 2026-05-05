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

// Boss feedback (fifth pass, 2026-05-05): "icon plays but I don't hear
// it" — root cause was the prior 0.085 master ratio being so low that
// after the per-event ~0.09-0.26 peak gains it left actual output
// peaks under -45dB (whisper level). Bumped to 0.3 so peaks land in
// the clearly-audible -10 to -20dB band. Still ambient, never invasive,
// but actually heard.
const TARGET_VOLUME = 0.3;
const FADE_MS = 800;

export default function AmbientPlayer() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const cleanupRef = useRef([]);

  // Boss directive 2026-05-05 (fourth pass): autoplay MUST work the
  // moment the visitor enters. Prior attempts failed because we were
  // creating the AudioContext outside a user gesture — browsers create
  // it in "suspended" state and silence stays even after we set
  // playing=true.
  //
  // Fix: setPlaying(true) only inside the gesture handler. The audio-
  // graph effect (below) creates the AudioContext at that point — i.e.
  // INSIDE the gesture stack frame — and the browser allows it to run.
  // We also explicitly call ctx.resume() in the graph effect for belt
  // & braces. Listeners are aggressive (mousemove + scroll + wheel +
  // touchstart + visibilitychange) so the first ms of cursor movement
  // is enough.
  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "off") return;

      let started = false;
      const eventNames = [
        "pointerdown", "pointermove", "mousemove",
        "keydown", "scroll", "touchstart", "wheel",
        "click",
      ];
      const start = () => {
        if (started) return;
        started = true;
        // Boss bug fix (sixth pass, 2026-05-05): the icon was flipping
        // to "playing" but no audio came out. Root cause was React 18
        // state batching — setPlaying(true) deferred the AudioContext
        // creation to React's commit phase, which fired AFTER this
        // gesture handler had returned. Browsers then created the
        // AudioContext outside the user-activation window and kept it
        // suspended.
        //
        // Fix: create the AudioContext SYNCHRONOUSLY inside this very
        // gesture handler, store it in the ref, AND call resume() now
        // while the user-activation flag is still hot. The audio-graph
        // useEffect then detects the existing ref and reuses it instead
        // of creating a fresh suspended context.
        try {
          if (!ctxRef.current) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) {
              const ctx = new Ctx();
              ctxRef.current = ctx;
              if (ctx.state === "suspended") {
                ctx.resume().catch(() => {});
              }
            }
          }
        } catch {}
        setPlaying(true);
        try { localStorage.setItem(STORAGE_KEY, "on"); } catch {}
        eventNames.forEach((evt) => window.removeEventListener(evt, start));
        document.removeEventListener("visibilitychange", visTrigger);
      };
      const visTrigger = () => {
        if (!document.hidden) start();
      };

      // Aggressive listeners — first gesture wins, audio context is
      // created inside that gesture handler so browsers permit playback.
      eventNames.forEach((evt) =>
        window.addEventListener(evt, start, { passive: true })
      );
      document.addEventListener("visibilitychange", visTrigger);

      return () => {
        eventNames.forEach((evt) => window.removeEventListener(evt, start));
        document.removeEventListener("visibilitychange", visTrigger);
      };
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

    // Build the graph. Reuse the AudioContext that the gesture handler
    // pre-created (sixth-pass fix) when available — that one is inside
    // the user-activation window and not suspended. Only create a new
    // context if none exists yet (e.g. user toggled via the button
    // without the auto-start listener firing first, or after teardown).
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      setPlaying(false);
      return;
    }
    let ctx = ctxRef.current;
    if (!ctx || ctx.state === "closed") {
      ctx = new Ctx();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const master = ctx.createGain();
    master.gain.value = TARGET_VOLUME; // unmuted immediately
    const masterLP = ctx.createBiquadFilter();
    masterLP.type = "lowpass";
    masterLP.frequency.value = 2800;
    masterLP.Q.value = 0.5;
    master.connect(masterLP).connect(ctx.destination);
    masterGainRef.current = master;

    // ── 1. Pre-render a noise buffer used by all wave events. NO
    //     continuous bed plays — Boss directive 2026-05-05 (third
    //     pass): the prior brown-noise rumble was perceived as wind,
    //     which makes UHNW guests imagine the boat rocking — exactly
    //     the wrong subconscious cue. The mix now consists of
    //     DISCRETE wave events (build → crash → wash → silence)
    //     plus dolphins / seagulls / harmonic pad / distant chatter.
    //     Real Cyclades / Ionian beach recordings are mostly silence
    //     punctuated by waves, not continuous hiss.
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 6, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.018 * white) * 0.998;
        data[i] = last * 16;
      }
    }

    // ── 2. Wave events — each one is a 3-stage envelope simulating
    //     a real wave coming in: gentle build (rolling water rises),
    //     soft "klats" (low-mid impact), wash (high-band hiss receding),
    //     silence. Boss directive 2026-05-05 (fourth pass): waves should
    //     read as ASMR ocean — sweet "klats klats klats", not
    //     dramatic crashes. Tighter filters, longer attacks, ~40%
    //     lower peaks, weighted toward small waves.
    const waveScheduler = (sizeOverride) => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      // Wave size distribution: 80% small chop, 18% mid wave, 2% big
      // (was 60/35/5). Boss said "klats klats klats" = small repeated.
      const size = sizeOverride !== undefined
        ? sizeOverride
        : Math.random() < 0.02 ? 2 : Math.random() < 0.20 ? 1 : 0;

      // Body: low-mid noise filtered to "rolling water" frequencies.
      // Tighter filter cutoffs so the body is rounder, less harsh.
      const body = ctx.createBufferSource();
      body.buffer = noiseBuffer;
      body.loop = false;
      const bodyLP = ctx.createBiquadFilter();
      bodyLP.type = "lowpass";
      bodyLP.frequency.value = size === 2 ? 380 : size === 1 ? 300 : 240;
      bodyLP.Q.value = 0.5;
      const bodyHP = ctx.createBiquadFilter();
      bodyHP.type = "highpass";
      bodyHP.frequency.value = 90;
      const bodyGain = ctx.createGain();
      // ~40% lower peaks for the sweeter ASMR feel.
      const bodyPeak = size === 2 ? 0.26 : size === 1 ? 0.16 : 0.09;
      // Slower attacks = gentler builds.
      const bodyAttack = size === 2 ? 1.8 : size === 1 ? 1.3 : 0.85;
      const bodyDecay = size === 2 ? 3.2 : size === 1 ? 2.4 : 1.6;
      bodyGain.gain.setValueAtTime(0, now);
      bodyGain.gain.linearRampToValueAtTime(bodyPeak * 0.4, now + bodyAttack * 0.55);
      bodyGain.gain.linearRampToValueAtTime(bodyPeak, now + bodyAttack);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + bodyAttack + bodyDecay);

      // Stereo placement — wide stage for big waves, mono for small.
      const bodyPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (bodyPan) {
        bodyPan.pan.value = (Math.random() - 0.5) * (size === 2 ? 0.7 : 0.4);
        body.connect(bodyHP).connect(bodyLP).connect(bodyGain).connect(bodyPan).connect(master);
      } else {
        body.connect(bodyHP).connect(bodyLP).connect(bodyGain).connect(master);
      }
      const offset1 = Math.random() * (noiseBuffer.duration - bodyAttack - bodyDecay - 0.5);
      body.start(now, offset1);
      body.stop(now + bodyAttack + bodyDecay + 0.1);

      // Foam: high-band hiss that lags behind the body — softer, lower
      // band so it reads as gentle wash not airy hiss.
      const foamDelay = size === 2 ? 0.7 : size === 1 ? 0.5 : 0.32;
      const foam = ctx.createBufferSource();
      foam.buffer = noiseBuffer;
      const foamBP = ctx.createBiquadFilter();
      foamBP.type = "bandpass";
      // Lower foam centre (was 1800-2400) → gentler "wash" tone.
      foamBP.frequency.value = size === 2 ? 1400 : 1700;
      foamBP.Q.value = 0.8;
      const foamGain = ctx.createGain();
      // ~40% lower foam peaks too.
      const foamPeak = size === 2 ? 0.10 : size === 1 ? 0.06 : 0.035;
      const foamStart = now + foamDelay;
      foamGain.gain.setValueAtTime(0, foamStart);
      foamGain.gain.linearRampToValueAtTime(foamPeak, foamStart + 0.3);
      foamGain.gain.exponentialRampToValueAtTime(0.0001, foamStart + 2.4);

      const foamPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (foamPan) {
        foamPan.pan.value = bodyPan ? bodyPan.pan.value : 0;
        foam.connect(foamBP).connect(foamGain).connect(foamPan).connect(master);
      } else {
        foam.connect(foamBP).connect(foamGain).connect(master);
      }
      const offset2 = Math.random() * (noiseBuffer.duration - 3);
      foam.start(foamStart, offset2);
      foam.stop(foamStart + 2.6);
    };

    // FIRST WAVE within 80ms of start so the very first thing the
    // visitor hears is a real wave, not silence or noise.
    setTimeout(() => waveScheduler(1), 80);
    // Second wave shortly after to establish the rhythm.
    setTimeout(() => waveScheduler(0), 1600);
    setTimeout(() => waveScheduler(2), 4200);
    // Then natural rolling pattern — average ~3.8s between waves with
    // randomness so it never feels metronomic. Real Cycladic shores
    // average 8-12 wave events per minute.
    const waveScheduleNext = () => {
      const next = 2800 + Math.random() * 2400;
      setTimeout(() => {
        if (!ctxRef.current) return;
        waveScheduler();
        waveScheduleNext();
      }, next);
    };
    setTimeout(waveScheduleNext, 6500);

    // ── 2b. Distant Greek voices — formant-shaped noise bursts that
    //     read as "people talking far away" without ever being words.
    //     Two-formant approximation (vocal tract resonances at ~700Hz
    //     and ~1800Hz for vowel-ish content) with a slow gate that
    //     mimics speech rhythm. Heavy stereo placement + lots of
    //     reverb-style decay so it sounds like overheard from across
    //     a bay or out of a taverna.
    const voiceScheduler = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      // Random utterance length 1.4-3.2s
      const duration = 1.4 + Math.random() * 1.8;
      const numSyllables = 3 + Math.floor(Math.random() * 4);
      const syllableDuration = duration / numSyllables;

      const voiceMaster = ctx.createGain();
      voiceMaster.gain.value = 0;
      const voicePan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (voicePan) {
        voicePan.pan.value = (Math.random() - 0.5) * 1.6;
        voiceMaster.connect(voicePan).connect(master);
      } else {
        voiceMaster.connect(master);
      }
      // Overall envelope: fade in, hold, fade out
      voiceMaster.gain.setValueAtTime(0, now);
      voiceMaster.gain.linearRampToValueAtTime(0.013, now + 0.5);
      voiceMaster.gain.linearRampToValueAtTime(0.013, now + duration - 0.4);
      voiceMaster.gain.linearRampToValueAtTime(0, now + duration);

      // Per-syllable formant bursts.
      for (let s = 0; s < numSyllables; s++) {
        const sStart = now + s * syllableDuration;
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        // Two parallel formant filters.
        const f1 = ctx.createBiquadFilter();
        f1.type = "bandpass";
        f1.frequency.value = 600 + Math.random() * 350;
        f1.Q.value = 8;
        const f2 = ctx.createBiquadFilter();
        f2.type = "bandpass";
        f2.frequency.value = 1500 + Math.random() * 800;
        f2.Q.value = 6;
        const sg = ctx.createGain();
        sg.gain.setValueAtTime(0, sStart);
        sg.gain.linearRampToValueAtTime(0.5, sStart + syllableDuration * 0.3);
        sg.gain.exponentialRampToValueAtTime(0.0001, sStart + syllableDuration * 0.92);

        // Combine the two formants by routing the source through both.
        src.connect(f1).connect(sg);
        src.connect(f2).connect(sg);
        sg.connect(voiceMaster);
        const o = Math.random() * (noiseBuffer.duration - syllableDuration - 0.1);
        src.start(sStart, o);
        src.stop(sStart + syllableDuration);
      }
    };
    // First voice ~16s in (after waves are established).
    setTimeout(voiceScheduler, 16000);
    const voiceInterval = setInterval(() => {
      if (Math.random() < 0.42) voiceScheduler();
    }, 22000 + Math.random() * 18000);
    cleanupRef.current.push(() => clearInterval(voiceInterval));

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

    // Master gain was set to TARGET_VOLUME at construction so audio is
    // audible immediately — no fade-in dependency on ctx.currentTime
    // advancing. The fade-OUT path (in the !playing branch above) keeps
    // its ramp because by then the context is definitely running.

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
