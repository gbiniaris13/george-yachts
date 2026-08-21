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
import { FADE_MS } from "@/lib/ambient-audio";

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
const AMBIENT_MP3 = "/audio/ambient-lounge.mp3";

// 2026-08-21 — "is this a device we should not spend 3 MB on before being
// asked". True for handhelds, where unmuted autoplay is refused outright by
// iOS and Android, and for anyone who has switched on Save-Data or is on 2g.
// On those visits the on-open attempt cannot succeed, but .load() inside it
// starts the download anyway, so the bytes are spent on a certainty of
// silence. The first-gesture path is untouched and still fetches the moment
// the visitor actually taps the pill.
function isFrugalClient() {
  if (typeof window === "undefined") return false;
  const nav = navigator || {};
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || ""))) {
    return true;
  }
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 1024px)").matches
  );
}

async function tryMp3(audioRef, masterGainRef) {
  try {
    if (!audioRef.current) {
      audioRef.current = new Audio(AMBIENT_MP3);
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.crossOrigin = "anonymous";
      // Kick off the fetch immediately so the track is already buffered
      // by the time playback is allowed (on-open or first gesture).
      try { audioRef.current.load(); } catch {}
    }
    const a = audioRef.current;
    a.volume = 0;
    // 2026-07-03 — George: the jazz track is the ONLY sound this site
    // makes. The old canplay wait had a 1.5s timeout that the MP3 lost
    // at page open (cold cache), which dropped visitors into the synth
    // waves. No gate, no timeout: play() itself waits for the browser
    // to buffer enough, and rejects on 404/decode/autoplay-block — in
    // which case we stay SILENT and the first-gesture path retries.
    await a.play();
    // Fade gain in. 0.2 is a deliberate "background music" level - present
    // enough to set a calm, classy mood without ever competing with the page
    // (the synth's TARGET_VOLUME was tuned for ambient noise, too low for an
    // actual music track).
    const target = 0.2;
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
    // Any failure (404, network, decode, autoplay policy) → SILENCE.
    // Never the synth. The first-gesture listener retries the MP3.
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
    }
    masterGainRef.current = null;
  };

  // Build helper — 2026-07-03, George's order after the waves regression:
  // the jazz MP3 is the ONLY audio path. The Web Audio synth fallback is
  // permanently disconnected (lib/ambient-audio.js stays, nothing calls
  // its graph builder from here). Jazz or silence.
  const buildAndPlay = async () => {
    if (suppressed) return false;
    return tryMp3(audioRef, masterGainRef);
  };

  // Phase 17d (2026-05-05) retired autoplay because (1) browser policy needs a
  // real gesture and (2) the synthesised soundscape sounded "από το διάστημα".
  // 2026-06-29 — both resolved: a real royalty-free track now lives at
  // /audio/ambient-lounge.mp3 (smooth jazz lounge, Pixabay content licence,
  // no attribution), and the first-gesture autostart effect below begins it on
  // the visitor's first real interaction (respecting session mute).
  // 2026-07-03 — the synth fallback is GONE from the playback paths: it was
  // reaching visitors' ears whenever the MP3 lost the old 1.5s canplay race
  // at page open. Jazz or silence, nothing else.

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

  // 2026-07-03 (George's SOS list) — attempt to start THE MOMENT the
  // site opens, mobile and desktop. Browser reality: unmuted autoplay
  // is only granted when the visitor has prior engagement with the
  // domain (Chrome's media-engagement index, Safari's per-site
  // setting) - there is no way around that policy. So: try instantly;
  // if the browser blocks it, the first-gesture effect below catches
  // the very first tap/click/key anywhere and the music begins then.
  // The mute pill always turns it off, and a session mute is honoured.
  // 2026-08-02 — the one addition to the proven player, fully isolated
  // from the gesture flow: Chrome will not FETCH an <audio> src before a
  // user-activation on low-engagement visits, so the first gesture used
  // to start a cold 3 MB download (seconds of silence). Plain fetch() is
  // not subject to that media gating - warm the HTTP cache at open, and
  // the first gesture plays from disk instantly. Nothing else changed
  // from the version George confirmed working.
  // 2026-08-19 (design pass, job 2) — the warm stays. It stops firing when
  // the <audio> element is already doing the job itself.
  //
  // Measured 19/8 on the live homepage: the 3,1 MB track was fetched TWICE.
  // The network log shows why, and it is not a duplicated call. The warm
  // asks for the whole file and gets 200 OK. The <audio> element asks with
  // a Range header and gets 206 Partial Content. Those are two different
  // requests for the same bytes, three milliseconds apart, and whether
  // Chrome lets the second one read the first one's cache entry depends on
  // whether the first is still in flight. When it is not, the element
  // downloads all 3 MB again.
  //
  // Three arms, same page, fresh URLs so nothing could borrow a cache entry:
  //   no warm at all          1 request,  3043 KB, playable in 15 ms
  //   warm, then the element  2 requests, 3043 KB, playable in 12 ms
  //   warm with Range         2 requests, 3043 KB, playable in 12 ms
  // The warm buys three milliseconds and costs a second request.
  //
  // But it is not dead weight, and this is the part that has to survive:
  // Chrome refuses to FETCH an <audio> src before a user-activation on an
  // origin the visitor has no history with. On those visits .load() does
  // nothing, the element never downloads, and the warm is the only reason
  // the first tap plays from disk instead of starting a cold 3 MB fetch.
  // That is exactly the case the warm was added for on 2026-08-02.
  //
  // So the two situations are mutually exclusive: when the element loads by
  // itself the warm is a duplicate, and when the warm matters the element is
  // not loading at all. Ask the element which world we are in before firing.
  // readyState >= 1 or anything in .buffered means it is already pulling the
  // file, so there is nothing to warm.
  //
  // The 1500 ms also does the second half of this job. The old call sat
  // inline at mount, so a 3 MB request competed with the paint on every
  // single visit. Now it starts after it, which is the point of taking it
  // off the critical path.
  //
  // NOT changed: the warm itself, the gesture set, and the player. That
  // combination is the version George confirmed working and it does not get
  // rewritten for tidiness.
  // 2026-08-21 — one more condition, for the same reason as the last one.
  //
  // The warm exists to make the FIRST gesture play instantly instead of
  // starting a cold 3 MB download. That argument holds on a desktop, where
  // media engagement means the track can begin at page open. It does not
  // hold on a phone: iOS and Android refuse unmuted autoplay outright, so
  // the audio cannot start until the visitor taps the pill, and if they
  // never tap it the 3 MB was spent on silence, over a metered connection.
  //
  // Lighthouse on mobile measured this: 9.07 MB of transfer on the homepage,
  // 3.04 MB of it this file, on a page whose LCP was 26.6s.
  //
  // If they DO tap, tryMp3() calls load() at that moment and the file
  // arrives then. Slightly later than warm, and only for someone who asked
  // for it. Save-Data and 2g are treated the same way on any device: a
  // visitor who has told the browser to economise has told us too.
  //
  // NOT changed, again: the warm itself, the gesture set, and the player.
  useEffect(() => {
    if (suppressed) return;
    if (isFrugalClient()) return;

    const t = setTimeout(() => {
      const a = audioRef.current;
      // networkState 2 is NETWORK_LOADING: the element is on the wire right
      // now. It is checked first and on purpose. readyState and .buffered
      // only go up once metadata has actually arrived, so on a slow
      // connection an element that is downloading perfectly well would still
      // look idle at this instant and earn itself a second 3 MB request,
      // which is the exact bug being removed. A blocked element never
      // reaches NETWORK_LOADING, so the warm still fires where it must.
      const busy =
        a &&
        (a.networkState === 2 ||
          a.readyState >= 1 ||
          (a.buffered && a.buffered.length > 0));
      if (busy) return;
      try { fetch(AMBIENT_MP3, { cache: "force-cache" }).catch(() => {}); } catch {}
    }, 1500);
    return () => clearTimeout(t);
  }, [suppressed]);

  useEffect(() => {
    if (suppressed) return;
    let muted = false;
    try { muted = sessionStorage.getItem(SESSION_MUTE_KEY) === "1"; } catch {}
    if (muted) return;
    // The on-open attempt is the one that calls .load() and therefore the one
    // that spends the 3 MB. On a handheld it is guaranteed to be refused, so
    // it does not run at all and the first tap does the work instead.
    if (isFrugalClient()) return;
    let cancelled = false;
    (async () => {
      const ok = await buildAndPlay().catch(() => false);
      if (!cancelled && ok) {
        setPlaying(true);
        try { window.dispatchEvent(new CustomEvent("gy:ambient-mute-changed")); } catch {}
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressed]);

  // First-gesture autostart (2026-06-29 — George wants the music to set the
  // mood, not hide behind a tap). Autoplay-with-sound still needs a real
  // gesture, so we begin on the visitor's first click / key / tap anywhere,
  // UNLESS they muted earlier this session, or the gesture is the mute pill
  // itself (onToggle owns that). The pill still turns it off at any time.
  useEffect(() => {
    if (suppressed) return;
    let muted = false;
    try { muted = sessionStorage.getItem(SESSION_MUTE_KEY) === "1"; } catch {}
    if (muted) return;
    let done = false;
    const remove = () => {
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
      window.removeEventListener("touchstart", start, true);
    };
    const start = async (e) => {
      if (done) return;
      // 2026-07-03 — the on-open attempt above may have already begun
      // playback; the first gesture must not restart the fade.
      if (masterGainRef.current) { done = true; remove(); return; }
      if (e && e.target && e.target.closest && e.target.closest("[data-gy-ambient-toggle]")) return;
      done = true;
      remove();
      const ok = await buildAndPlay();
      if (ok) {
        try { sessionStorage.removeItem(SESSION_MUTE_KEY); } catch {}
        setPlaying(true);
        try { window.dispatchEvent(new CustomEvent("gy:ambient-mute-changed")); } catch {}
      } else {
        done = false;
      }
    };
    window.addEventListener("pointerdown", start, true);
    window.addEventListener("keydown", start, true);
    window.addEventListener("touchstart", start, true);
    return remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressed]);

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
      data-gy-ambient-toggle
      onClick={onToggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
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
            ? "rgba(218, 161, 16,0.55)"
            : hovered
            ? "rgba(218, 161, 16,0.4)"
            : "rgba(248, 245, 240,0.06)"
        }`,
        color: playing
          ? "#DAA110"
          : hovered
          ? "rgba(218, 161, 16,0.85)"
          : "rgba(218, 161, 16,0.45)",
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
