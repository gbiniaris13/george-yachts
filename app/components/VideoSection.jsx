"use client";

// Chapter 01 (Boss-spec hero rebuild, 2026-05-08) - full rewrite.
//
// Replaces the multi-line "GEORGE YACHTS / EXCLUSIVELY GREEK WATERS /
// BROKERAGE HOUSE LLC / Boutique Luxury Yacht Charter / seasonal /
// fleet-snapshot pill / dual CTAs + whisper hint / Scroll text /
// chevron / desktop category nav" hero - too much above-the-fold
// reading for a UHNW visitor - with a Burgess/Fraser-tier minimal
// hero: video, 6-word headline, 1-line subline, 2 restrained CTAs,
// a chevron scroll cue. Nothing else.
//
// Layout per Boss spec:
//   • Full-viewport (100vh / 100dvh on mobile)
//   • Video background, autoplay/muted/loop/playsinline
//   • Overlay gradient: rgba(13,27,42,0.45) top → rgba(13,27,42,0.75) bottom
//   • Headline 6 words, Cormorant-tier display (Fraunces via Phase 28
//     mapping) Light, 64 px desktop / 40 px mobile, tracking -0.02em
//   • Subline 1 line, Switzer Light 300, 16 px, tracking 0.04em
//   • Two CTAs centered with 16 px gap. Primary = gold border + gold
//     text + transparent bg. Secondary = no border + white text +
//     underline-on-hover only.
//   • Animated chevron icon (20 px white 0.5 opacity, gentle 2 s pulse)
//     pinned bottom-center; replaces the "Scroll" text + line.
//
// Content removed in this rewrite:
//   - GEORGE YACHTS letter-by-letter reveal + .gy-pearl-white wordmark
//   - "EXCLUSIVELY GREEK WATERS" eyebrow
//   - "BROKERAGE HOUSE LLC" gold descriptor
//   - "Boutique Luxury Yacht Charter · Est. U.S.A. · Operating from Athens"
//   - Seasonal italic line
//   - "Take the 60-second quiz / or browse all N yachts" whisper
//   - "Scroll" text + breathing vertical line
//   - Desktop category nav strip ("Sailing Monohulls / Sailing Catamarans /…")
//
// Brand identity now lives in the nav logo + the embedded Forbes top
// bar (which Chapter 01 also makes non-dismissible).
//
// Video swap: Boss-tightened 6-clip cinematic loop. New 4th clip
// added at slot 2 (snorkeler swimming forward toward the camera -
// 5607894), motorboat-wake clip dropped, and per-clip durations
// re-balanced for a snappier 37.4 s loop.
//
// Final order:
//   1. 8303143  - golden-hour motor yacht aerial   (4 s, trimmed)
//   2. 5607894  - snorkeler swims toward camera    (10.4 s, full) ★ NEW
//   3. 14545703 - superyacht rocky-shore anchorage (4 s, trimmed)
//   4. 854344   - snorkeler on sandy bottom        (4 s, trimmed)
//   5. 4612166  - freediver over seagrass meadow   (10 s, trimmed)
//   6. 8824586  - yacht hull splashing waves       (5 s, trimmed)
//
// Total 37.4 s loop (down from 63.7 s). The fresh 5607894 clip
// becomes the long-form moment after a snappy 4 s opening; the rest
// of the loop punches through three quick transitions and a 10 s
// freediving beat before closing on the splash. Speed normalised
// to 1920×1080 30 fps via ffmpeg concat filter - every clip plays
// at the same apparent real-time pace. Encoded:
//   • WebM VP9  1000 kbps 2-pass → 4.5 MB (Chrome / Firefox / Edge)
//   • MP4  H.264 1500 kbps 2-pass → 6.9 MB (Safari fallback)
// preload="auto" so the browser starts buffering immediately.

import React, { useEffect, useRef, useState } from "react";

const HERO_VIDEO_BASE = "/videos/hero-loop";

function HeroBackgroundVideo() {
  const ref = useRef(null);
  // Chapter 06 (mobile, 2026-05-08) - iOS fallback. If autoplay is
  // blocked (Low Power Mode, Safari aggressive media policies, etc.)
  // we surface the frame-1 poster as a static image and never end up
  // with an empty hero. The fallback also fires on any video-load
  // error so a dropped CDN connection or 404 doesn't blank out the
  // masthead.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play?.();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // Autoplay denied - fall back to the poster image.
        setFailed(true);
      });
    }
  }, []);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/images/posters/hero-loop-frame1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <video
      ref={ref}
      // 2026-05-08 (Chapter 01 follow-up) - poster matches frame 1
      // of the trio video so the swap is invisible. preload="auto"
      // so the browser starts downloading bytes immediately and the
      // visitor doesn't see the poster freeze for 1-2 s on slower
      // connections. See the matching change in the fleet page.
      poster="/images/posters/hero-loop-frame1.jpg"
      preload="auto"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      onError={() => setFailed(true)}
      data-cursor-magnetic="VIEW"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    >
      {/* WebM (smaller) → MP4 fallback. Browsers without WebM (older
          Safari) skip the first <source> and fall through to MP4. */}
      <source src={`${HERO_VIDEO_BASE}.webm`} type="video/webm" />
      <source src={`${HERO_VIDEO_BASE}.mp4`} type="video/mp4" />
    </video>
  );
}

export default function VideoSection() {
  // Single fade-up reveal - kept minimal compared to the prior 8-stage
  // choreography. The whole hero settles in around 800 ms then breathes
  // with the chevron pulse and the looping video.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 240);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="gy-hero relative w-full overflow-hidden bg-black"
      aria-label="George Yachts - Greek waters charter"
      style={{ height: "100svh", marginTop: 0, paddingTop: 0 }}
    >
      {/* Video background */}
      <HeroBackgroundVideo />

      {/* Overlay gradient - Boss spec exactly: rgba(13,27,42,0.45) at
          the top settling to rgba(13,27,42,0.75) at the bottom. The
          deep-navy hue (13,27,42) is brand "Aegean midnight". */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.60) 50%, rgba(13,27,42,0.75) 100%)",
        }}
      />

      {/* Slow-cinema film grain - kept from the prior hero, ~5 % opacity
          via .gy-film-grain in globals.css. Reads only at the edges
          of the frame, never as visible noise. */}
      <div
        aria-hidden="true"
        className="gy-film-grain"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex h-full w-full items-center justify-center px-6 md:px-10 pt-6 md:pt-20"
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 800ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div
          className="flex w-full max-w-[1100px] flex-col items-center text-center"
          style={{ transform: revealed ? "translateY(0)" : "translateY(8px)", transition: "transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
        >
          {/* Eyebrow - the sacred-guest whisper above the headline
              (Boss pick 2026-07-21, "option B": the Philoxenia idea
              rides as a four-word crown so the headline stays fast).
              Small caps, gold, wide tracking - the site's standard
              eyebrow voice. */}
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "clamp(9px, 0.9vw, 11px)",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
              margin: "0 0 22px",
            }}
          >
            The Guest Is Sacred · Greek Waters Exclusively
          </p>

          {/* Headline - Boss-spec 2026-07-21 (chosen from a 30-option
              copy exploration): "A house, not a platform. We host you
              at sea." Positioning first (what we are / are not), then
              the promise, spoken to the reader. Replaces "Greek
              Waters. One Broker. Total Discretion." - George's call:
              "one broker" could read as small; "house" carries
              boutique + capability without the size signal. Font
              lands on the Phase 28 display tier (Fraunces Thin 100)
              via the .gy-hero-headline mapping in globals.css. */}
          {/* 2026-07-21 — RevealHeading (GSAP SplitText line rise)
              REVERTED to a plain h1, per the component's own revert
              note. Root cause, found while shipping the new copy:
              the reveal tween was being killed mid-flight (the
              `play` effect re-ran), leaving every line translated
              inside its overflow-clip mask - i.e. the LIVE hero
              headline rendered invisible. The demo never had
              George's sign-off; a headline that always shows beats
              a rise that sometimes hides it. The pearl-white finish
              is pure CSS and stays. */}
          <h1
            className="gy-hero-headline gy-pearl-white"
            style={{
              fontSize: "clamp(30px, 5.6vw, 76px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              margin: 0,
              textShadow: "0 12px 50px rgba(13, 27, 42, 0.55)",
            }}
          >
            {/* George 2026-07-22: each sentence on its OWN line, never
                broken mid-phrase ("A house, not a / platform. We / host
                you at sea" read as noise). Two block spans + balanced
                wrap; font clamp trimmed so each line fits one row on
                desktop. */}
            <span style={{ display: "block", textWrap: "balance" }}>
              A house, not a platform.
            </span>
            <span style={{ display: "block", textWrap: "balance" }}>
              We host you at sea.
            </span>
          </h1>

          {/* Subline - Boss-spec: 1 line, Switzer Light 300, 16 px,
              tracking 0.04em, ivory white at 70 % opacity. Lands on
              the Phase 28 UI tier via inline font-family. Hidden on
              ≤ 600 px (mobile) per Boss directive - at that width it
              wraps to 3+ lines and crowds the CTAs. */}
          <p
            className="gy-hero-subline"
            style={{
              marginTop: "32px",
              fontFamily: "var(--gy-font-ui)",
              fontWeight: 300,
              fontSize: "clamp(13px, 1.2vw, 16px)",
              letterSpacing: "0.04em",
              color: "rgba(248,245,240,0.78)",
              maxWidth: "62ch",
              textWrap: "balance",
            }}
          >
            No call centres, no handovers, no ticket numbers. A table set for you before you even land.
          </p>

          {/* CTA pair - primary (gold-bordered transparent) + secondary
              (text-only with underline on hover). 16 px gap on desktop,
              stacks on mobile full-width with 12 px gap and 52 px min
              height per Boss mobile spec. */}
          <div
            className="gy-hero-cta-row"
            style={{ marginTop: "44px" }}
          >
            <a
              href="/charter-yacht-greece"
              data-cursor="Browse"
              className="gy-hero-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 32px",
                fontFamily: "var(--gy-font-ui)",
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#C9A84C",
                background: "transparent",
                border: "1px solid #C9A84C",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 320ms ease, color 320ms ease, border-color 320ms ease",
              }}
            >
              Browse the Fleet
            </a>

            <a
              href="/inquiry"
              data-cursor="Brief"
              className="gy-hero-cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 18px",
                fontFamily: "var(--gy-font-ui)",
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "transparent",
                border: 0,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color 320ms ease",
              }}
            >
              Brief George
            </a>
          </div>
        </div>
      </div>

      {/* Chevron scroll cue - Boss spec: 20 px white at 50 % opacity,
          gentle 2 s pulse, absolute bottom center. Replaces the prior
          "Scroll" text + breathing vertical line. */}
      <div
        aria-hidden="true"
        className="gy-hero-chevron"
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: revealed ? 0.5 : 0,
          transition: "opacity 1.2s ease 1.4s",
          color: "#FFFFFF",
          zIndex: 20,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <style jsx global>{`
        /* Chapter 01 - hero CTA hover states + chevron pulse.
           Primary CTA on hover fills with gold and flips text to black.
           Secondary CTA on hover keeps the text white but reveals an
           underline (no border, just the underline cue Boss specified).
           Chevron pulses opacity 0.4 → 0.7 over 2 s. */
        .gy-hero-cta-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        /* Mobile (≤ 600 px) - full-width stacked CTAs, 52 px min
           height, 12 px gap, primary first per Boss spec. Subline
           hides because it wraps to 3+ lines at this width. Chevron
           also hides - swipe is the natural gesture. */
        @media (max-width: 600px) {
          .gy-hero-headline {
            font-size: 38px !important;
            letter-spacing: -0.01em !important;
          }
          .gy-hero-subline {
            display: none !important;
          }
          .gy-hero-cta-row {
            flex-direction: column;
            gap: 12px !important;
            width: 100%;
            max-width: 320px;
          }
          .gy-hero-cta-row > a {
            width: 100%;
            min-height: 52px;
            padding: 16px 24px !important;
          }
          .gy-hero-chevron {
            display: none !important;
          }
        }
        @media (max-width: 374px) {
          .gy-hero-headline {
            font-size: 32px !important;
          }
        }
        .gy-hero-cta-primary:hover {
          background: #C9A84C;
          color: #0D1B2A;
          border-color: #C9A84C;
        }
        .gy-hero-cta-secondary {
          position: relative;
        }
        .gy-hero-cta-secondary::after {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 12px;
          height: 1px;
          background: rgba(248, 245, 240, 0.85);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 360ms cubic-bezier(0.2, 0.85, 0.25, 1);
        }
        .gy-hero-cta-secondary:hover::after {
          transform: scaleX(1);
        }
        .gy-hero-chevron {
          animation: gy-hero-chevron-pulse 2s ease-in-out infinite;
        }
        @keyframes gy-hero-chevron-pulse {
          0%, 100% { transform: translate(-50%, 0); opacity: 0.4; }
          50%      { transform: translate(-50%, 4px); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-hero-chevron { animation: none !important; opacity: 0.5 !important; }
        }
      `}</style>
    </section>
  );
}
