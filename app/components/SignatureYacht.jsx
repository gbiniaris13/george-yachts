"use client";

// Move #3 — Signature Yacht feature slot.
//
// Full-viewport editorial feature sitting between the video hero
// and the split-screen fleet showcase. Highlights ONE real yacht
// from the Sanity fleet with:
//   • Parallax hero image (scrolls slower than the page)
//   • Ken Burns zoom (scale 1 → 1.08) as the section passes through
//   • Gold "FEATURED THIS WEEK" eyebrow
//   • Yacht name in Cormorant Garamond, 72px
//   • Spec strip (length · guests · cabins · builder)
//   • "George's Inside Info" paragraph — italic serif, ivory/75
//   • Deep link to the yacht's own page
//
// The featured yacht rotates weekly (ISO week-of-year % pool.length)
// with an offset from the Explorer panel's rotation so the page
// doesn't feel like it's all swapping at the same Monday beat.
//
// If no eligible yacht is available (empty pool), the component
// returns null — the surrounding sections flow normally.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function SignatureEmpty() {
  return null;
}

export default function SignatureYacht({ yacht }) {
  const sectionRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!sectionRef.current) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        // Normalize: 0 when section top is at viewport bottom,
        // 1 when section bottom is at viewport top. -1..1 outside.
        const progress = Math.max(-1, Math.min(1, (vh - rect.top - rect.height / 2) / (vh + rect.height / 2)));
        // Move image opposite-ish to scroll (slower than page).
        setParallaxY(progress * -40);
        // Gentle Ken Burns from 1 → 1.08.
        setScale(1 + 0.08 * Math.max(0, (progress + 1) / 2));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!yacht || !yacht.heroImage) return <SignatureEmpty />;

  const specs = [
    yacht.length,
    yacht.sleeps ? `${yacht.sleeps} Guests` : null,
    yacht.cabins ? `${yacht.cabins} Cabins` : null,
    yacht.builder,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const yachtHref = yacht.slug ? `/yachts/${yacht.slug}` : null;
  const insider = (yacht.georgeInsiderTip || "").trim();
  const insiderTrim = insider.length > 320 ? insider.slice(0, 317).trimEnd() + "…" : insider;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden"
      aria-label={`Signature yacht: ${yacht.name}`}
    >
      {/* Hero image layer — zooms gently with scroll (Ken Burns) and
          translates slower than the page (parallax). Oversized so the
          translate never reveals an edge.

          Height: the previous 100dvh/900px cap left a lot of dark
          dead space above/below the content on tall viewports (the
          corner-bracket frame made it feel like an empty picture
          frame). Tightened to 80dvh with an 760px cap so the image
          stays dramatic but the black gaps shrink. */}
      <div
        className="relative w-full"
        style={{ height: "min(80dvh, 760px)", minHeight: "560px" }}
      >
        <div
          className="absolute inset-x-0 -top-[10%] -bottom-[10%] bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${yacht.heroImage})`,
            transform: `translate3d(0, ${parallaxY}px, 0) scale(${scale})`,
            transition: "transform 150ms linear",
          }}
        />

        {/* Gradient overlays — ensure text readability top & bottom,
            keep the image alive in the middle. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" />

        {/* Top label — FEATURED THIS WEEK. Pushed below the fixed
            nav zone (72px scrolled-state) plus a bit more breathing. */}
        <div
          className="absolute top-6 md:top-8 left-0 right-0 text-center z-10"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <span
            className="inline-block text-[#DAA520] border border-[#DAA520]/40 px-6 py-2"
            style={{
              fontSize: "9px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          >
            Featured This Week
          </span>
        </div>

        {/* Bottom-anchored content block — pb tightened so the text
            lifts closer to the image bottom, closing the dark gap. */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-10 md:pb-14 text-center">
          <div className="max-w-[880px] mx-auto">
            {/* Yacht name */}
            <h2
              className="text-white mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 200,
                letterSpacing: "0.06em",
                lineHeight: 1.02,
              }}
            >
              {yacht.name}
            </h2>

            {/* Subtitle — builder model line */}
            {yacht.subtitle && (
              <p
                className="text-white/50 italic mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                }}
              >
                {yacht.subtitle}
              </p>
            )}

            {/* Specs line */}
            {specs && (
              <p
                className="text-[#DAA520]/85 mb-10"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "clamp(10px, 1.2vw, 12px)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {specs}
              </p>
            )}

            {/* Inside info — the differentiator */}
            {insiderTrim && (
              <div className="max-w-[720px] mx-auto mb-12">
                <p
                  className="text-[#DAA520]/60 mb-4"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  George's Inside Info
                </p>
                <p
                  className="text-white/75 italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(16px, 1.8vw, 22px)",
                    lineHeight: 1.55,
                  }}
                >
                  &ldquo;{insiderTrim}&rdquo;
                </p>
              </div>
            )}

            {/* CTA */}
            {yachtHref && (
              <Link
                href={yachtHref}
                className="group inline-flex items-center gap-3 pb-2 border-b border-[#DAA520]/50 hover:border-[#DAA520] text-[#DAA520] transition-colors duration-500"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                <span>View This Yacht</span>
                <svg
                  width="20"
                  height="10"
                  viewBox="0 0 22 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-500 group-hover:translate-x-2"
                >
                  <line x1="0" y1="5" x2="20" y2="5" />
                  <polyline points="15 1 21 5 15 9" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Gold corner-brackets — subtle frame cue, editorial feel */}
        <span
          aria-hidden="true"
          className="absolute top-6 left-6 md:top-10 md:left-10 w-8 h-8 md:w-12 md:h-12 border-t border-l border-[#DAA520]/40 pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute top-6 right-6 md:top-10 md:right-10 w-8 h-8 md:w-12 md:h-12 border-t border-r border-[#DAA520]/40 pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-8 h-8 md:w-12 md:h-12 border-b border-l border-[#DAA520]/40 pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-8 h-8 md:w-12 md:h-12 border-b border-r border-[#DAA520]/40 pointer-events-none"
        />
      </div>
    </section>
  );
}
