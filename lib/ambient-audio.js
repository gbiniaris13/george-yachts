// Phase 17 (luxury rebuild, 2026-05-05) — extracted ambient audio
// graph builder so AmbientPlayer can call it SYNCHRONOUSLY from inside
// the gesture handler. This eliminates the React-state-batching timing
// issue that kept defeating prior fixes (the build was happening in a
// later commit phase, outside the user-activation window, leaving the
// AudioContext suspended).
//
// Usage: in the gesture listener, call buildAmbientGraph(refs). It
// creates the AudioContext, resumes it, builds the full Greek-summer
// soundscape (waves + seagulls + dolphins + voices + pad + bell), and
// returns true on success / false on failure.

export const TARGET_VOLUME = 0.35;
export const FADE_MS = 800;

export function buildAmbientGraph({ ctxRef, masterGainRef, cleanupRef }) {
  const Ctx = typeof window !== "undefined"
    ? (window.AudioContext || window.webkitAudioContext)
    : null;
  if (!Ctx) return false;

  // Reuse if context still alive, else create a new one INSIDE this
  // gesture stack frame.
  let ctx = ctxRef.current;
  if (!ctx || ctx.state === "closed") {
    ctx = new Ctx();
    ctxRef.current = ctx;
  }
  // Always try to resume — call must be inside user-activation context
  // for browsers to honour it.
  if (ctx.state === "suspended") {
    try { ctx.resume(); } catch {}
  }

  // Master bus — gain set to TARGET_VOLUME directly (no ramp) so audio
  // is audible the instant the context advances even one sample.
  const master = ctx.createGain();
  master.gain.value = TARGET_VOLUME;
  const masterLP = ctx.createBiquadFilter();
  masterLP.type = "lowpass";
  masterLP.frequency.value = 2800;
  masterLP.Q.value = 0.5;
  master.connect(masterLP).connect(ctx.destination);
  masterGainRef.current = master;

  // Pre-render a noise buffer used by every wave / voice / dolphin event.
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

  // ─── Wave events: sweet ASMR "klats" — see prior commits for tuning ───
  const waveScheduler = (sizeOverride) => {
    if (!ctxRef.current) return;
    const now = ctx.currentTime;
    const size = sizeOverride !== undefined
      ? sizeOverride
      : Math.random() < 0.02 ? 2 : Math.random() < 0.20 ? 1 : 0;
    const body = ctx.createBufferSource();
    body.buffer = noiseBuffer;
    const bodyLP = ctx.createBiquadFilter();
    bodyLP.type = "lowpass";
    bodyLP.frequency.value = size === 2 ? 380 : size === 1 ? 300 : 240;
    bodyLP.Q.value = 0.5;
    const bodyHP = ctx.createBiquadFilter();
    bodyHP.type = "highpass";
    bodyHP.frequency.value = 90;
    const bodyGain = ctx.createGain();
    const bodyPeak = size === 2 ? 0.30 : size === 1 ? 0.20 : 0.12;
    const bodyAttack = size === 2 ? 1.8 : size === 1 ? 1.3 : 0.85;
    const bodyDecay = size === 2 ? 3.2 : size === 1 ? 2.4 : 1.6;
    bodyGain.gain.setValueAtTime(0, now);
    bodyGain.gain.linearRampToValueAtTime(bodyPeak * 0.4, now + bodyAttack * 0.55);
    bodyGain.gain.linearRampToValueAtTime(bodyPeak, now + bodyAttack);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + bodyAttack + bodyDecay);
    const bodyPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (bodyPan) {
      bodyPan.pan.value = (Math.random() - 0.5) * (size === 2 ? 0.7 : 0.4);
      body.connect(bodyHP).connect(bodyLP).connect(bodyGain).connect(bodyPan).connect(master);
    } else {
      body.connect(bodyHP).connect(bodyLP).connect(bodyGain).connect(master);
    }
    body.start(now, Math.random() * (noiseBuffer.duration - bodyAttack - bodyDecay - 0.5));
    body.stop(now + bodyAttack + bodyDecay + 0.1);

    const foamDelay = size === 2 ? 0.7 : size === 1 ? 0.5 : 0.32;
    const foam = ctx.createBufferSource();
    foam.buffer = noiseBuffer;
    const foamBP = ctx.createBiquadFilter();
    foamBP.type = "bandpass";
    foamBP.frequency.value = size === 2 ? 1400 : 1700;
    foamBP.Q.value = 0.8;
    const foamGain = ctx.createGain();
    const foamPeak = size === 2 ? 0.12 : size === 1 ? 0.08 : 0.05;
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
    foam.start(foamStart, Math.random() * (noiseBuffer.duration - 3));
    foam.stop(foamStart + 2.6);
  };

  // First wave in 80ms — Boss directive: hear something IMMEDIATELY.
  const t1 = setTimeout(() => waveScheduler(1), 80);
  const t2 = setTimeout(() => waveScheduler(0), 1600);
  const t3 = setTimeout(() => waveScheduler(2), 4200);
  cleanupRef.current.push(() => clearTimeout(t1));
  cleanupRef.current.push(() => clearTimeout(t2));
  cleanupRef.current.push(() => clearTimeout(t3));

  let nextTimer = null;
  const waveScheduleNext = () => {
    const next = 2800 + Math.random() * 2400;
    nextTimer = setTimeout(() => {
      if (!ctxRef.current) return;
      waveScheduler();
      waveScheduleNext();
    }, next);
  };
  const t4 = setTimeout(waveScheduleNext, 6500);
  cleanupRef.current.push(() => clearTimeout(t4));
  cleanupRef.current.push(() => clearTimeout(nextTimer));

  // ─── Seagulls ───
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
  const tg1 = setTimeout(seagullScheduler, 2200);
  cleanupRef.current.push(() => clearTimeout(tg1));
  const seagullInterval = setInterval(() => {
    if (Math.random() < 0.7) seagullScheduler();
  }, 8000 + Math.random() * 7000);
  cleanupRef.current.push(() => clearInterval(seagullInterval));

  // ─── Dolphins ───
  const dolphinScheduler = () => {
    if (!ctxRef.current) return;
    const now = ctx.currentTime;
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
    wg.gain.linearRampToValueAtTime(0.05, now + 0.08);
    wg.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    whistle.connect(wg).connect(master);
    whistle.start(now);
    whistle.stop(now + 0.7);
  };
  const td1 = setTimeout(dolphinScheduler, 9000);
  cleanupRef.current.push(() => clearTimeout(td1));
  const dolphinInterval = setInterval(() => {
    if (Math.random() < 0.5) dolphinScheduler();
  }, 24000 + Math.random() * 18000);
  cleanupRef.current.push(() => clearInterval(dolphinInterval));

  // ─── Aspirational harmonic pad ───
  const padFreqs = [65.41, 98.00, 130.81, 196.00];
  const padGain = ctx.createGain();
  padGain.gain.value = 0.0;
  padGain.connect(master);
  padFreqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 4;
    const g = ctx.createGain();
    g.gain.value = 0.022 / (i * 0.5 + 1);
    osc.connect(g).connect(padGain);
    osc.start();
    cleanupRef.current.push(() => { try { osc.stop(); } catch {} });
  });
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

  return true;
}
