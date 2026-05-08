"use client";

// Chapter 08 (Boss-spec, 2026-05-08) — George's Selection.
//
// Replaces the prior "Featured This Week" SignatureYacht slot with
// a 2-card editorial selection: one Private Fleet flagship
// (La Pellegrina 1) + one Explorer Fleet flagship (Errant Vagabond).
// Same brand voice as Three Greek Worlds — "two yachts, two
// experiences, one Greek summer". No featured-yacht-of-the-week
// rotation, no Sanity-driven autoplay; this is the broker's
// hand-picked pair.
//
// Sanity image refs supplied by Boss; URLs resolved via the asset
// CDN at the dimensions reported by the Sanity asset metadata
// (Pellegrina 1024×768 JPG, Errant Vagabond 1350×900 WEBP).
//
// Layout per spec:
//   • Section header centered: gold eyebrow + Cormorant headline.
//   • Desktop ≥ md: two cards side-by-side, equal width, gap 24 px,
//     max-width 1200 px, height 480 px.
//   • Mobile: vertical stack, gap 20 px, height 360 px each.
//   • Card hover: overlay +0.10 darker, CTA translates up 6 px.
//   • <375 px viewport: George's italic note auto-hides via media
//     query so the rest of the card stays composed.

import Link from "next/link";

const PELLEGRINA_IMG =
  "https://cdn.sanity.io/images/ecqr94ey/production/5a1d2f46e69d3e21c61aa3950deb11085e725b9d-1024x768.jpg";
const ERRANT_VAGABOND_IMG =
  "https://cdn.sanity.io/images/ecqr94ey/production/9ad672aad35ae37d1287527ab6ed2f07cc394dd5-1350x900.webp";

const SELECTION = [
  {
    slug: "la-pellegrina-1",
    label: "Collection I · Private Fleet",
    name: "M/Y La Pellegrina 1",
    specs: "50 m · 12 Guests · 5 Cabins",
    price: "From €180,000 / week",
    note: "The yacht I recommend when clients ask for the best.",
    image: PELLEGRINA_IMG,
    overlay: 0.50,
  },
  {
    slug: "errant-vagabond",
    label: "Collection II · Explorer Fleet",
    name: "S/CAT Errant Vagabond",
    specs: "15.35 m · 10 Guests · 5 Cabins",
    price: "From €11,500 / week",
    note: "The flybridge at sunset, anchored off Sifnos — that is what this yacht was built for.",
    image: ERRANT_VAGABOND_IMG,
    overlay: 0.45,
  },
];

function SelectionCard({ slug, label, name, specs, price, note, image, overlay }) {
  return (
    <Link
      href={`/yachts/${slug}`}
      className="gy-selection-card group relative block overflow-hidden"
      data-cursor="View"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${image})`, backgroundColor: "#0D1B2A" }}
      />
      {/* Default overlay per Boss spec; +0.10 on hover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: `rgba(13, 27, 42, ${overlay})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: "rgba(13, 27, 42, 0.10)" }}
      />

      {/* Top-left collection label */}
      <p className="gy-selection-card__label">{label.toUpperCase()}</p>

      {/* Content stack — anchored bottom-left for the editorial
          rhythm Boss flagged in the brief (yacht name first, specs
          + price beneath, italic note, CTA). */}
      <div className="gy-selection-card__body">
        <h3 className="gy-selection-card__name">{name}</h3>
        <p className="gy-selection-card__specs">{specs}</p>
        <p className="gy-selection-card__price">{price}</p>
        <p className="gy-selection-card__note">&ldquo;{note}&rdquo;</p>
        <span className="gy-selection-card__cta">View This Yacht →</span>
      </div>
    </Link>
  );
}

export default function GeorgesSelection() {
  return (
    <section
      className="gy-selection-section"
      aria-label="George's Selection — Private Fleet flagship + Explorer Fleet flagship"
      style={{ background: "#0D1B2A", padding: "96px 0 80px" }}
    >
      <div className="gy-selection-header">
        <p className="gy-selection-eyebrow">George&apos;s Selection</p>
        <h2 className="gy-selection-title">
          Two yachts. Two experiences. One Greek summer.
        </h2>
      </div>

      <div className="gy-selection-row">
        {SELECTION.map((s) => (
          <SelectionCard key={s.slug} {...s} />
        ))}
      </div>

      <p className="gy-selection-footnote">
        <Link href="/charter-yacht-greece" className="gy-selection-footnote-link">
          Browse the full fleet of 63 curated yachts →
        </Link>
      </p>

      <style jsx global>{`
        /* Section header */
        .gy-selection-header {
          max-width: 880px;
          margin: 0 auto 48px;
          padding: 0 24px;
          text-align: center;
        }
        .gy-selection-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A84C;
          margin: 0 0 18px;
        }
        .gy-selection-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-size: clamp(24px, 3.4vw, 36px);
          line-height: 1.2;
          letter-spacing: -0.005em;
          color: #F8F5F0;
          margin: 0;
        }

        /* Cards row */
        .gy-selection-row {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .gy-selection-row { grid-template-columns: 1fr; gap: 20px; }
        }

        /* Card */
        .gy-selection-card {
          position: relative;
          height: 480px;
          color: #F8F5F0;
        }
        /* Mobile (≤ 600 px) — Boss spec: 320 px height; collection
           label hidden (the card hierarchy already establishes
           Private vs Explorer); George's italic note hidden because
           it lives on the yacht page. Yacht name + specs + price +
           CTA stay. */
        @media (max-width: 600px) {
          .gy-selection-card { height: 320px; }
          .gy-selection-card__label { display: none !important; }
          .gy-selection-card__note { display: none !important; }
          .gy-selection-card__name { font-size: 28px !important; }
          .gy-selection-card__specs { font-size: 11px !important; }
        }
        @media (min-width: 601px) and (max-width: 768px) { .gy-selection-card { height: 360px; } }

        .gy-selection-card__label {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 2;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A84C;
          margin: 0;
        }

        .gy-selection-card__body {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gy-selection-card__name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-size: 32px;
          color: #F8F5F0;
          letter-spacing: 0.005em;
          line-height: 1.1;
          margin: 0;
          text-shadow: 0 4px 18px rgba(13, 27, 42, 0.55);
        }
        .gy-selection-card__specs {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.65);
          margin: 0;
        }
        .gy-selection-card__price {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: rgba(248, 245, 240, 0.75);
          margin: 0 0 6px;
        }
        .gy-selection-card__note {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.45;
          color: rgba(248, 245, 240, 0.80);
          margin: 0 0 6px;
          max-width: 36ch;
        }
        /* < 375 px — hide the italic note so the rest of the card
           stays composed (Boss spec). */
        @media (max-width: 374px) {
          .gy-selection-card__note { display: none; }
        }
        .gy-selection-card__cta {
          display: inline-block;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.6);
          align-self: flex-start;
          transform: translateY(0);
          transition: transform 320ms ease, border-color 320ms ease;
        }
        .gy-selection-card:hover .gy-selection-card__cta {
          transform: translateY(-6px);
          border-bottom-color: #C9A84C;
        }

        /* Footnote link below the cards */
        .gy-selection-footnote {
          margin: 40px auto 0;
          text-align: center;
          padding: 0 24px;
        }
        .gy-selection-footnote-link {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: rgba(248, 245, 240, 0.55);
          text-decoration: none;
          transition: color 260ms ease, text-decoration 260ms ease;
        }
        .gy-selection-footnote-link:hover {
          color: #C9A84C;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </section>
  );
}
