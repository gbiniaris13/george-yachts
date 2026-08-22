"use client";

// Move #2 - split-screen fleet showcase.
//
// Replaces the old 2-card boxy CTA strip with a full-viewport
// editorial diptych:
//   • Left panel:  Private Fleet (cinematic yacht hero image)
//   • Right panel: Sailing Fleet (cinematic yacht hero image)
//   • Hover a panel → the OTHER panel darkens to 40%, the active
//     panel zooms 1.05× and its overlay lifts from 55% to 25%.
//   • Subtle gold diagonal seam between the two panels on desktop.
//   • Mobile stacks vertically with a horizontal gold divider.
//
// Keeps the same URLs (/private-fleet, /explorer-fleet) so the
// behaviour downstream is identical - it's only the entrance
// experience that gets upgraded.

import { useEffect, useRef, useState } from "react";
import useNearViewport from "./useNearViewport";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

// Chapter 06.5 (2026-05-08) - looping video backgrounds for the
// FleetCTAs split-screen panels (Private + Explorer). Same iOS-
// safe pattern as the homepage hero - autoplay/muted/loop/
// playsInline plus an `onError` + `play().catch()` handler that
// falls back to the frame-1 poster image if iOS Low Power Mode
// (or any other policy) blocks autoplay. Pointer-events-none on
// the video element so the entire panel still works as one
// clickable Link.
function PanelBackgroundVideo({ videoBase, posterSrc }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  // SD-3 (2026-08-01): these fleet panels sit below the fold on the
  // homepage yet their 3.5 MB ambients preloaded eagerly and starved the
  // hero's bandwidth (mobile LCP 40s in the baseline). Sources now attach
  // when the panel is a scroll away; poster covers until then.
  const [nearRef, near] = useNearViewport("200px");

  useEffect(() => {
    if (!near) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.load();
    const p = v.play?.();
    if (p && typeof p.then === "function") {
      p.catch(() => setFailed(true));
    }
  }, [near]);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        style={{
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#0D1B2A",
        }}
      />
    );
  }

  return (
    <div ref={nearRef} className="absolute inset-0">
      {/* 2026-08-21 — the poster leaves the critical path too.
​
          SD-3 stopped these panels from preloading 3.5 MB of video, which
          was the big win. It could not stop the poster: a poster ATTRIBUTE
          is fetched as soon as the element is parsed, whatever preload says
          and whatever the video sources do. So four below-fold frames were
          still opening connections at 254-379 ms and taking 685 KB of a
          phone's first three seconds, in direct competition with the hero
          image that decides LCP.
​
          As a real <img loading="lazy"> the browser holds it until the
          panel is near the viewport, which is exactly when useNearViewport
          attaches the video anyway. Identical picture, same moment, off the
          critical path. */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        style={{ pointerEvents: "none" }}
      />
      <video
        ref={videoRef}
        preload="none"
        loop
        muted
        playsInline
        aria-hidden="true"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        style={{ pointerEvents: "none", backgroundColor: "#0D1B2A" }}
      >
        {near && <source src={`/videos/${videoBase}.webm`} type="video/webm" />}
        {near && <source src={`/videos/${videoBase}.mp4`} type="video/mp4" />}
      </video>
    </div>
  );
}

const fmtK = (n) => (n >= 1000 ? `€${Math.round(n / 1000)}K` : `€${n.toLocaleString('en-US')}`);

// Panel arrow icon, re-used in both panels.
function ArrowLine() {
  return (
    <svg
      width="22"
      height="10"
      viewBox="0 0 22 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="translate-y-[0.5px] transition-transform duration-500 group-hover:translate-x-2"
    >
      <line x1="0" y1="5" x2="20" y2="5" />
      <polyline points="15 1 21 5 15 9" />
    </svg>
  );
}

function FleetPanel({
  href,
  collectionLabel,
  name,
  subtitle,
  priceLine,
  descriptor,
  footer,
  image,
  gradientFallback,
  ctaLabel,
  // Chapter 06.5 (2026-05-08) - optional Boss-curated background
  // video. When `videoBase` is set we render <video> + overlay at
  // `overlayOpacity` per Boss spec (0.55 Private / 0.45 Explorer).
  // The image prop continues to work as a poster + fallback so any
  // panel without a video stays on the original Sanity-hero path.
  videoBase = null,
  posterSrc = null,
  overlayOpacity = 0.55,
}) {
  return (
    <Link
      href={href}
      className="group gy-fleet-panel relative block flex-1 min-h-[50dvh] md:min-h-[100dvh] overflow-hidden"
    >
      {/* Background - video if provided, else image, else gradient. */}
      {videoBase ? (
        <PanelBackgroundVideo videoBase={videoBase} posterSrc={posterSrc} />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          style={{
            backgroundImage: image
              ? `url(${image})`
              : gradientFallback,
            backgroundColor: "#0D1B2A",
          }}
        />
      )}

      {/* Dark overlay - Boss spec exact opacity per panel; lifts a touch
          on hover to reveal the video underneath. */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          backgroundColor: `rgba(13, 27, 42, ${overlayOpacity})`,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          // Hover lift: drop the overlay to ~20-25% so the video reads
          // brighter without losing text contrast.
          backgroundColor: `rgba(13, 27, 42, ${Math.max(0.20, overlayOpacity - 0.30)})`,
        }}
      />

      {/* Subtle vertical gold glow from bottom on hover (creates depth). */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(218, 161, 16,0.10), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[50dvh] md:min-h-[100dvh] flex flex-col items-center justify-center px-8 py-16 text-center">
        {/* Collection label */}
        <p
          className="text-[#DAA110]/80 text-[9px] mb-8"
          style={{
            fontFamily: "var(--gy-font-ui)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {collectionLabel}
        </p>

        {/* Name - Cormorant Garamond editorial */}
        <h2
          className="text-white mb-2"
          style={{
            fontFamily: "var(--gy-font-editorial)",
            // Mobile: min 32 (was 40) so "Sailing Fleet" fits on
            // 320px devices. maxWidth guards against edge-case long
            // builder names.
            fontSize: "clamp(32px, 6vw, 76px)",
            fontWeight: 200,
            letterSpacing: "0.06em",
            lineHeight: 1,
            maxWidth: "90%",
            wordBreak: "break-word",
          }}
        >
          {name}
        </h2>

        {/* 2026-08-21 (section 9) — the literal term under the brand name.
            George's idea and the right one: the name on top has to create
            desire, the line under it has to tell a visitor in three words
            what is actually in there, and it feeds the search engines and
            the assistants the vocabulary the brand name deliberately avoids. */}
        {subtitle && (
          <p
            className="text-white/45 mb-6"
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "clamp(9.5px, 1.05vw, 11px)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Price line */}
        <p
          className="text-[#DAA110] mb-5"
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "clamp(11px, 1.3vw, 13px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
            textShadow: "0 1px 10px rgba(13,27,42,0.7)",
          }}
        >
          {priceLine}
        </p>

        {/* Descriptor (italic serif, ivory/60) */}
        <p
          className="text-white/60 italic mb-12 max-w-xs"
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(14px, 1.5vw, 18px)",
            lineHeight: 1.5,
          }}
        >
          {descriptor}
        </p>

        {/* CTA - inline gold-on-hover with sliding arrow */}
        <span
          className="group inline-flex items-center gap-3 text-white/70 group-hover:text-[#DAA110] transition-colors duration-500 pb-1 border-b border-white/20 group-hover:border-[#DAA110]"
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>{ctaLabel}</span>
          <ArrowLine />
        </span>

        {/* Bottom-right footer (yacht count + length range) */}
        {footer && (
          <p
            className="absolute bottom-10 text-white/75"
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 400,
              textShadow: "0 1px 10px rgba(13,27,42,0.85), 0 1px 3px rgba(13,27,42,0.6)",
            }}
          >
            {footer}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function FleetCTAs({
  privateRange = { low: 13000, high: 180000 },
  explorerRange = { low: 11500, high: 27500 },
  privateHeroImage = null,
  explorerHeroImage = null,
  privateCount = 0,
  explorerCount = 0,
}) {
  // Future i18n strings live in the hook; for now the split-screen copy
  // uses English-first strings + i18n keys from the existing nav tree.
  useI18n();

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[100dvh] md:min-h-[100dvh]">
        <FleetPanel
          href="/private-fleet"
          collectionLabel="Collection I"
          name="Private Fleet"
          subtitle="Motor Yachts & Power Catamarans"
          priceLine={`From €${privateRange.low.toLocaleString('en-US')} to €${privateRange.high.toLocaleString('en-US')} / week`}
          descriptor="Full crew, total discretion. A private world at sea."
          footer={privateCount > 0 ? `${privateCount} Yachts · Motor Yachts & Power Cats` : null}
          image={privateHeroImage}
          gradientFallback="linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 100%)"
          ctaLabel="View the Fleet"
          // Chapter 06.5 - Boss-curated background video for this
          // panel. WebM 1.7 MB / MP4 2.5 MB / poster 155 KB
          // (1080×1920 → 720×1280, 30 fps, 2-pass, audio stripped).
          videoBase="private-fleet-bg"
          posterSrc="/images/posters/private-fleet-bg-frame1.jpg"
          overlayOpacity={0.55}
        />

        {/* Divider - diagonal gold seam on desktop, horizontal on mobile */}
        <div aria-hidden="true" className="gy-fleet-divider" />

        <FleetPanel
          href="/explorer-fleet"
          collectionLabel="Collection II"
          name="Sailing Fleet"
          subtitle="Sailing Catamarans & Sailing Yachts"
          priceLine={`From €${explorerRange.low.toLocaleString('en-US')} to €${explorerRange.high.toLocaleString('en-US')} / week`}
          descriptor="Under sail, and into the bays the engines cannot reach."
          footer={explorerCount > 0 ? `${explorerCount} Yachts · Sailing Cats & Monohulls` : null}
          image={explorerHeroImage}
          gradientFallback="linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 100%)"
          ctaLabel="View the Fleet"
          // Chapter 06.5 - Boss-curated Sailing Fleet background
          // video (underwater swimmer in red, 26 s loop -
          // captures the "snorkel / explore / lightly crewed"
          // adventure mood). WebM 3.4 MB / MP4 5.3 MB / poster
          // 126 KB. Overlay 0.45 per Boss spec - slightly more
          // luminous than Private (0.55) to keep the underwater
          // turquoise readable behind the copy without losing
          // text contrast.
          videoBase="explorer-fleet-bg"
          posterSrc="/images/posters/explorer-fleet-bg-frame1.jpg"
          overlayOpacity={0.45}
        />
      </div>

      {/* All Fleet bridge - George 2026-04-20:
          "Private Fleet και Sailing Fleet στο hero είναι πολύ μεγάλα -
          θέλω να μπει All Fleet ώστε να μπορούν να δουν όλο τον στόλο."
          A thin gold band under the two panels with a single link to
          the unified charter catalogue so nobody gets locked into one
          collection before seeing everything we have. */}
      <div
        className="relative flex items-center justify-center py-6 md:py-8"
        style={{
          background:
            "linear-gradient(to bottom, #0D1B2A 0%, #0D1B2A 100%)",
          borderTop: "1px solid rgba(218, 161, 16,0.35)",
          borderBottom: "1px solid rgba(218, 161, 16,0.15)",
        }}
      >
        <Link
          href="/charter-yacht-greece"
          className="group inline-flex items-center gap-4 px-6"
          data-cursor="Fleet"
        >
          <span
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "9px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,0.78)",
              fontWeight: 600,
            }}
          >
            Or
          </span>
          <span
            className="relative transition-colors duration-500 group-hover:text-[#DAA110]"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(18px, 2vw, 24px)",
              fontWeight: 300,
              color: "#F8F5F0",
              letterSpacing: "0.04em",
              borderBottom: "1px solid rgba(218, 161, 16,0.5)",
              paddingBottom: "3px",
            }}
          >
            Explore the Entire Fleet
          </span>
          <svg
            width="22"
            height="10"
            viewBox="0 0 22 10"
            fill="none"
            stroke="#DAA110"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-500 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <line x1="0" y1="5" x2="18" y2="5" />
            <polyline points="14 1 21 5 14 9" />
          </svg>
        </Link>
      </div>

      <style jsx global>{`
        /* Sibling darkening - hover one panel, the other dims.
           Works both directions thanks to :has(). */
        .gy-fleet-panel:hover ~ .gy-fleet-panel,
        .gy-fleet-panel:has(~ .gy-fleet-panel:hover) {
          opacity: 0.42;
          filter: brightness(0.72) saturate(0.85);
          transition: opacity 700ms ease, filter 700ms ease;
        }

        .gy-fleet-panel {
          transition: opacity 700ms ease, filter 700ms ease;
        }

        /* Divider - a hairline gold seam between the two panels.
           Horizontal on mobile, vertical on desktop. */
        .gy-fleet-divider {
          flex-shrink: 0;
          background: linear-gradient(
            to right,
            transparent,
            rgba(218, 161, 16, 0.35) 20%,
            rgba(218, 161, 16, 0.35) 80%,
            transparent
          );
          width: 100%;
          height: 1px;
        }
        @media (min-width: 768px) {
          .gy-fleet-divider {
            width: 1px;
            height: auto;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(218, 161, 16, 0.35) 15%,
              rgba(218, 161, 16, 0.35) 85%,
              transparent
            );
          }
        }

        /* Respect reduced-motion - no zoom, no overlay fade drama */
        @media (prefers-reduced-motion: reduce) {
          .gy-fleet-panel ~ .gy-fleet-panel,
          .gy-fleet-panel:has(~ .gy-fleet-panel:hover) {
            opacity: 1 !important;
            filter: none !important;
          }
          .gy-fleet-panel .group-hover\\:scale-\\[1\\.05\\]:hover,
          .gy-fleet-panel *:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
