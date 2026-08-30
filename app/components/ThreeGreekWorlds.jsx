"use client";

// Chapter 07 (Boss-spec, 2026-05-08) — Three Greek Worlds.
//
// Replaces the old <RegionalYachtMap /> on the homepage with a
// 3-card editorial section pointing at the new destination pages.
// Boss directive — no yacht counts, no prices, no travel-guide
// listings of restaurants / hotels / sights. The brand message is
// "we know these waters; we put you on the right yacht".
//
// Layout:
//   • Section header (eyebrow + Cormorant headline) centered.
//   • 3 cards in a horizontal row on desktop (≥ md), vertical
//     stack on mobile. Card height 520 px desktop / 380 px on
//     tablets, 280 px on phones (Boss spec).
//   • Each card: full-bleed bg image + dark overlay
//     rgba(13, 27, 42, 0.40) → rgba(13, 27, 42, 0.60) on hover.
//   • CTA "Discover the X →" sits at the bottom of the card,
//     translates up 6 px on hover (subtle motion only).
//   • Footnote underneath: max-width 600 px, "Speak to George
//     directly" as the only link (gold #DAA110, underline-on-hover).

import Link from "next/link";
import { DESTINATIONS } from "@/lib/destinations";
import useNearViewport from "./useNearViewport";

function WorldCard({ slug, label, cardTitle, cardSubline, heroImage, showImage = true }) {
  return (
    <Link
      href={`/destinations/${slug}`}
      className="gy-world-card group relative block overflow-hidden"
      data-cursor-magnetic="DISCOVER"
    >
      {/* SD-3 (2026-08-01): these three region heroes total ~2.3 MB and
          the section sits below the fold - the CSS background loaded
          eagerly on every homepage visit and starved the hero. The URL
          now attaches when the section is a scroll away; the navy base
          colour covers the instant before. */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        style={{ backgroundImage: showImage ? `url(${heroImage})` : undefined, backgroundColor: "#0D1B2A" }}
        aria-hidden="true"
      />
      {/* Default overlay 0.40 → 0.60 on hover (Boss spec). */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: "rgba(13, 27, 42, 0.40)" }}
        aria-hidden="true"
      />
      <div
        className="gy-world-card__hover-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: "rgba(13, 27, 42, 0.20)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center px-8">
        {/* 2026-08-30, George: "μήπως το Κυκλάδες πρέπει να είναι πιο
            μεγάλο; και είναι μουσταρδί". The place-before-poetry rule,
            applied to its own section: the REGION is now the big line,
            set in the real gold-leaf ramp (never the flat hex - the
            mustard he caught), and the poetic title drops to a quiet
            subtitle beneath it. h3 carries the region name, which is
            also the better heading for search. */}
        <h3 className="gy-world-card__region gy-goldtext">{label.toUpperCase()}</h3>
        <p className="gy-world-card__title">{cardTitle}</p>
        <p className="gy-world-card__subline">{cardSubline}</p>
        <span className="gy-world-card__cta">
          Discover the {label} →
        </span>
      </div>
    </Link>
  );
}

export default function ThreeGreekWorlds() {
  const cards = ["cyclades", "ionian", "saronic"].map((slug) => DESTINATIONS[slug]);
  // SD-3: one observer for the whole section - all three card images
  // attach together when the visitor is a scroll away.
  const [nearRef, near] = useNearViewport("200px");

  return (
    <section
      ref={nearRef}
      className="gy-three-worlds relative w-full"
      aria-label="Three Greek Worlds - Cyclades, Ionian, Saronic"
      style={{ background: "#0D1B2A", padding: "clamp(40px, 5vw, 56px) 0 clamp(40px, 5vw, 56px)" }}
    >
      {/* Section header */}
      <div className="gy-three-worlds__header">
        <p className="gy-three-worlds__eyebrow">The Fleet · Where We Sail</p>
        <h2 className="gy-three-worlds__title">
          Three Greek Worlds. One House. Infinite Summer.
        </h2>
      </div>

      {/* Cards row */}
      <div className="gy-three-worlds__row">
        {cards.map((d) => (
          <WorldCard key={d.slug} {...d} showImage={near} />
        ))}
      </div>

      {/* Footnote */}
      <p className="gy-three-worlds__footnote">
        Specialising exclusively in the Cyclades, Ionian, and Saronic Gulf -
        with bespoke arrangements available throughout the broader
        Mediterranean, including Italy, Turkey, and beyond.{" "}
        <Link href="/#contact" className="gy-three-worlds__footnote-link">
          Speak to George directly
        </Link>{" "}
        for custom itineraries outside our core waters.
      </p>

      <style jsx global>{`
        .gy-three-worlds__header {
          max-width: 880px;
          margin: 0 auto 48px;
          padding: 0 24px;
          text-align: center;
        }
        .gy-three-worlds__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #DAA110;
          /* 2026-08-21 (section 2) - "0 auto" not "0 0". This eyebrow centres its
             own text, and the global 720px reading cap in globals.css then
             pinned the 720px box to the left of the section. The shorthand is
             where the fix belongs: a separate margin-inline: auto above this
             line was silently reset by it. */
          margin: 0 auto 18px;
        }
        .gy-three-worlds__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.15;
          letter-spacing: -0.005em;
          color: #F8F5F0;
          margin: 0;
        }
        .gy-three-worlds__row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 4px;
        }
        @media (max-width: 1024px) {
          .gy-three-worlds__row { grid-template-columns: 1fr 1fr; }
          .gy-three-worlds__row > a:nth-child(3) { grid-column: span 2; }
        }
        @media (max-width: 768px) {
          .gy-three-worlds__row { grid-template-columns: 1fr; gap: 6px; padding: 0 12px; }
          .gy-three-worlds__row > a:nth-child(3) { grid-column: auto; }
        }

        /* Cards */
        .gy-world-card {
          position: relative;
          height: 520px;
          color: #F8F5F0;
        }
        @media (max-width: 1024px) { .gy-world-card { height: 380px; } }
        /* Mobile (≤ 600 px) - Boss spec: 260 px height. CTA stays
           always visible (not hover-gated) and the whole card is
           wrapped in <Link> so any tap navigates. */
        @media (max-width: 600px)  { .gy-world-card { height: 260px; } }

        .gy-world-card__region {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: clamp(30px, 3.6vw, 44px);
          letter-spacing: 0.08em;
          line-height: 1.05;
          margin: 0 0 10px;
        }
        .gy-world-card__title {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.85);
          margin: 0 0 14px;
          text-shadow: 0 2px 12px rgba(13, 27, 42, 0.6);
        }
        .gy-world-card__subline {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(248,245,240,0.82);
          max-width: 32ch;
          margin: 0 0 28px;
        }
        .gy-world-card__cta {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #DAA110;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(218, 161, 16, 0.6);
          transform: translateY(0);
          transition: transform 320ms ease, border-color 320ms ease;
        }
        .gy-world-card:hover .gy-world-card__cta {
          transform: translateY(-6px);
          border-bottom-color: #DAA110;
        }

        /* Footnote */
        .gy-three-worlds__footnote {
          max-width: 600px;
          margin: 56px auto 0;
          padding: 0 24px;
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 12px;
          line-height: 1.7;
          color: rgba(248,245,240,0.6);
          text-align: center;
        }
        .gy-three-worlds__footnote-link {
          color: #DAA110;
          text-decoration: none;
          transition: text-decoration 200ms ease;
        }
        .gy-three-worlds__footnote-link:hover {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </section>
  );
}
