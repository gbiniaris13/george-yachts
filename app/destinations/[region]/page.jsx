// Chapter 07 + 09 (Boss-spec, 2026-05-08) — destination detail page.
//
// Per-region page rendered for /destinations/cyclades, /ionian,
// /saronic. Pulls all content from lib/destinations.js (single
// source of truth). Boss design spec applied exactly per Chapter
// 09 brief — typography, border-left 2 px on each insider pick,
// mobile breakpoints, CTA buttons + secondary link.
//
// Sections:
//   1. Hero          — full-width 70 vh, region label gold +
//                      Cormorant title 56 px desktop / 36 px mobile
//                      + tagline 15 px ivory @ 0.75 alpha. Overlay
//                      rgba(13, 27, 42, 0.50).
//   2. Editorial     — max 780 px centred, Montserrat Light 17 px,
//                      line-height 1.75, ivory @ 0.85 alpha.
//                      Mobile: 15 px, padding 0 1.5 rem.
//   3. Insider Picks — gold eyebrow + Cormorant Italic 22 px subline,
//                      then a list of picks. Each: border-left 2 px
//                      gold, padding-left 1.5 rem, margin-bottom
//                      2 rem. Pick name Montserrat Medium 13 px ALL
//                      CAPS 0.08em. Description Montserrat Light
//                      15 px desktop / 14 px mobile, line-height 1.7.
//   4. CTA           — full-width #0D1B2A, top border 1 px gold @
//                      0.25 alpha. Cormorant 38 px headline,
//                      primary "Browse the Fleet →" gold-bordered
//                      transparent button, secondary "Brief George →"
//                      Montserrat Light 13 px white with hover
//                      underline.
//
// Boss directives respected (NOT surfaced anywhere):
//   • No yacht counts per region.
//   • No prices per region.
//   • No restaurants / hotels / generic sightseeing copy.

import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { DESTINATIONS, REGION_SLUGS, getDestination } from "@/lib/destinations";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

// Boss Ch.1D — Quick Facts blocks for AI-search citation. ChatGPT,
// Perplexity, and Google AI Overviews preferentially cite plain-text
// structured fact lists; this content is what those engines pull
// when they answer "yacht charter cyclades best season" / "where to
// charter yacht greece" etc.
const QUICK_FACTS = {
  cyclades: {
    region: "Cyclades, Greece",
    bestSeason: "May–June, September–early October",
    duration: "7–10 days",
    departurePorts: "Athens (Lavrion / Alimos), Mykonos, Paros",
    yachtTypes: "Motor yachts, sailing catamarans, sailing yachts",
    weeklyRange: "€13,000 – €235,000",
    weatherNote:
      "Meltemi (NW) blows strongest mid-July through end-August; June and September are the calm-weather sweet spots.",
  },
  ionian: {
    region: "Ionian Islands, Greece",
    bestSeason: "Late May – early October",
    duration: "7 days",
    departurePorts: "Corfu, Lefkada, Athens repositioning",
    yachtTypes: "Sailing catamarans, sailing yachts, motor yachts",
    weeklyRange: "€11,500 – €180,000",
    weatherNote:
      "Sheltered waters, no Meltemi. Light afternoon thermals; the calmest sailing region in Greece.",
  },
  saronic: {
    region: "Saronic Gulf, Greece",
    bestSeason: "April – October (longest season of the three regions)",
    duration: "3–7 days",
    departurePorts: "Athens (Alimos / Flisvos / Vouliagmeni)",
    yachtTypes: "Motor yachts, catamarans, sailing yachts",
    weeklyRange: "€12,000 – €200,000",
    weatherNote:
      "Sheltered by the Peloponnese; sailable even when the Aegean Meltemi peaks.",
  },
};

function buildTouristDestinationSchema(d, facts) {
  const url = `https://georgeyachts.com/destinations/${d.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${d.label} — Yacht Charter`,
    description: `${d.cardSubline} ${d.pageTagline}`,
    url,
    image: d.heroImage
      ? `https://georgeyachts.com${d.heroImage}`
      : undefined,
    touristType: ["UHNW families", "couples", "groups", "private jet travellers"],
    geo: { "@type": "GeoCoordinates", addressCountry: "GR" },
    includesAttraction: (d.insiderPicks || []).slice(0, 6).map((p) => ({
      "@type": "TouristAttraction",
      name: p.name,
      description: p.note,
    })),
    additionalProperty: facts
      ? [
          { "@type": "PropertyValue", name: "Best season", value: facts.bestSeason },
          { "@type": "PropertyValue", name: "Typical charter duration", value: facts.duration },
          { "@type": "PropertyValue", name: "Departure ports", value: facts.departurePorts },
          { "@type": "PropertyValue", name: "Yacht types", value: facts.yachtTypes },
          { "@type": "PropertyValue", name: "Weekly charter range", value: facts.weeklyRange },
        ]
      : undefined,
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return REGION_SLUGS.map((region) => ({ region }));
}

export async function generateMetadata({ params }) {
  const { region } = await params;
  const d = getDestination(region);
  if (!d) return { title: "Destination — George Yachts" };
  const title = `${d.label} Yacht Charter — ${d.cardTitle} | George Yachts`;
  const description = `${d.cardSubline} ${d.pageTagline}`;
  const canonical = `https://georgeyachts.com/destinations/${d.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: d.heroImage ? [{ url: d.heroImage }] : [],
      type: "website",
    },
  };
}

export default async function DestinationPage({ params }) {
  const { region } = await params;
  const d = getDestination(region);
  if (!d) notFound();
  const facts = QUICK_FACTS[region];
  const schema = buildTouristDestinationSchema(d, facts);

  // 2026-05-11 audit fix — breadcrumbs were missing on /destinations/*
  // region pages. Google relies on BreadcrumbList JSON-LD to render
  // the breadcrumb path in SERP results instead of the raw URL.
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Destinations", url: "https://georgeyachts.com/#destinations" },
    { name: d.heading || d.region || region, url: `https://georgeyachts.com/destinations/${region}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <article className="gy-destination-page">
        {/* HERO */}
        <section className="gy-dest-hero">
          <div
            aria-hidden="true"
            className="gy-dest-hero__bg"
            style={{ backgroundImage: `url(${d.heroImage})` }}
          />
          <div aria-hidden="true" className="gy-dest-hero__overlay" />
          <div className="gy-dest-hero__content">
            <p className="gy-dest-hero__label">
              The Greek Waters · {d.label}
            </p>
            <h1 className="gy-dest-hero__title">{d.cardTitle}</h1>
            <p className="gy-dest-hero__tagline">{d.pageTagline}</p>
          </div>
        </section>

        {/* QUICK FACTS — Boss Ch.1D, AI-search citation block. Plain
            structured data that ChatGPT / Perplexity / Google AI
            Overviews preferentially pull when answering charter
            questions about this region. Visually restrained: small
            gold-divided rows, navy bg, no headings. */}
        {facts && (
          <section className="gy-dest-facts" aria-label="Quick facts">
            <dl className="gy-dest-facts__list">
              <div className="gy-dest-facts__row"><dt>Region</dt><dd>{facts.region}</dd></div>
              <div className="gy-dest-facts__row"><dt>Best season</dt><dd>{facts.bestSeason}</dd></div>
              <div className="gy-dest-facts__row"><dt>Typical charter duration</dt><dd>{facts.duration}</dd></div>
              <div className="gy-dest-facts__row"><dt>Departure ports</dt><dd>{facts.departurePorts}</dd></div>
              <div className="gy-dest-facts__row"><dt>Yacht types</dt><dd>{facts.yachtTypes}</dd></div>
              <div className="gy-dest-facts__row"><dt>Weekly charter range</dt><dd>{facts.weeklyRange}</dd></div>
              <div className="gy-dest-facts__row"><dt>Weather note</dt><dd>{facts.weatherNote}</dd></div>
              <div className="gy-dest-facts__row"><dt>Broker</dt><dd>George P. Biniaris, IYBA member</dd></div>
            </dl>
          </section>
        )}

        {/* EDITORIAL */}
        <section className="gy-dest-editorial">
          {d.intro.map((para, i) => (
            <p key={i} className="gy-dest-editorial__p">
              {para}
            </p>
          ))}
        </section>

        {/* INSIDER PICKS */}
        <section className="gy-dest-picks">
          <div className="gy-dest-picks__inner">
            {/* 2026-05-11 — was <p>, promoted to <h2> so the H1 → H3
                jump (page title → individual pick names) gets a
                proper H2 bridge. Visual class unchanged. */}
            <h2 className="gy-dest-picks__label">George&apos;s Insider Picks</h2>
            <p className="gy-dest-picks__subline">
              The anchorages we&apos;d put you in.
            </p>
            <ul className="gy-dest-picks__list">
              {d.insiderPicks.map((pick) => (
                <li key={pick.name} className="gy-dest-pick">
                  <h3 className="gy-dest-pick__name">{pick.name}</h3>
                  <p className="gy-dest-pick__desc">{pick.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="gy-dest-cta">
          <h2 className="gy-dest-cta__headline">
            Ready to explore the {d.label}?
          </h2>
          <div className="gy-dest-cta__row">
            <Link
              href="/charter-yacht-greece"
              className="gy-dest-cta__primary"
              data-cursor="Browse"
            >
              Browse the Fleet →
            </Link>
            <Link
              href="/inquiry"
              className="gy-dest-cta__secondary"
              data-cursor="Brief"
            >
              Brief George →
            </Link>
          </div>
        </section>
      </article>
      <Footer />

      <style>{`
        .gy-destination-page {
          background: #0D1B2A;
          color: #F8F5F0;
        }

        /* HERO */
        .gy-dest-hero {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 480px;
          overflow: hidden;
        }
        .gy-dest-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-color: #0D1B2A;
        }
        .gy-dest-hero__overlay {
          position: absolute;
          inset: 0;
          background: rgba(13, 27, 42, 0.50);
        }
        .gy-dest-hero__content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }
        .gy-dest-hero__label {
          font-family: var(--gy-font-ui);
          font-weight: 400;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C9A84C;
          margin: 0 0 24px;
        }
        .gy-dest-hero__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 56px;
          line-height: 1.05;
          letter-spacing: -0.015em;
          color: #F8F5F0;
          margin: 0 0 24px;
          text-shadow: 0 8px 40px rgba(13, 27, 42, 0.55);
        }
        .gy-dest-hero__tagline {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(248, 245, 240, 0.75);
          max-width: 48ch;
          margin: 0;
        }
        @media (max-width: 768px) {
          .gy-dest-hero__title { font-size: 36px; }
        }

        /* QUICK FACTS — narrow, calm, machine-readable. */
        .gy-dest-facts {
          max-width: 780px;
          margin: 0 auto;
          padding: 64px 24px 8px;
        }
        .gy-dest-facts__list {
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(201, 168, 76, 0.18);
        }
        .gy-dest-facts__row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(201, 168, 76, 0.10);
        }
        .gy-dest-facts__row dt {
          font-family: var(--gy-font-ui);
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.55);
          margin: 0;
        }
        .gy-dest-facts__row dd {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(248, 245, 240, 0.85);
          margin: 0;
        }
        @media (max-width: 600px) {
          .gy-dest-facts { padding: 48px 1.5rem 0; }
          .gy-dest-facts__row {
            grid-template-columns: 1fr;
            gap: 4px;
            padding: 12px 0;
          }
        }

        /* EDITORIAL */
        .gy-dest-editorial {
          max-width: 780px;
          margin: 0 auto;
          padding: 96px 24px 80px;
        }
        .gy-dest-editorial__p {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 17px;
          line-height: 1.75;
          color: rgba(248, 245, 240, 0.85);
          margin: 0 0 1.5rem;
        }
        .gy-dest-editorial__p:last-child { margin-bottom: 0; }
        @media (max-width: 768px) {
          .gy-dest-editorial { padding: 72px 1.5rem 56px; }
          .gy-dest-editorial__p { font-size: 15px; }
        }

        /* INSIDER PICKS */
        .gy-dest-picks {
          background: #142233;
          padding: 80px 24px;
        }
        .gy-dest-picks__inner {
          max-width: 880px;
          margin: 0 auto;
        }
        .gy-dest-picks__label {
          font-family: var(--gy-font-ui);
          font-weight: 400;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A84C;
          text-align: center;
          margin: 0 0 18px;
        }
        .gy-dest-picks__subline {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-weight: 300;
          font-size: 22px;
          line-height: 1.3;
          color: #F8F5F0;
          text-align: center;
          margin: 0 0 56px;
        }
        .gy-dest-picks__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .gy-dest-pick {
          border-left: 2px solid #C9A84C;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
        }
        .gy-dest-pick:last-child { margin-bottom: 0; }
        .gy-dest-pick__name {
          font-family: var(--gy-font-ui);
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #F8F5F0;
          margin: 0 0 12px;
          line-height: 1.3;
        }
        .gy-dest-pick__desc {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(248, 245, 240, 0.80);
          margin: 0;
        }
        @media (max-width: 768px) {
          .gy-dest-pick__desc { font-size: 14px; }
        }

        /* CTA */
        .gy-dest-cta {
          background: #0D1B2A;
          border-top: 1px solid rgba(201, 168, 76, 0.25);
          padding: 100px 24px;
          text-align: center;
        }
        .gy-dest-cta__headline {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 38px;
          line-height: 1.15;
          color: #F8F5F0;
          margin: 0 0 32px;
          max-width: 22ch;
          margin-inline: auto;
        }
        @media (max-width: 768px) {
          .gy-dest-cta__headline { font-size: 28px; }
        }
        .gy-dest-cta__row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          align-items: center;
        }
        .gy-dest-cta__primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          font-family: var(--gy-font-ui);
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid #C9A84C;
          background: transparent;
          text-decoration: none;
          white-space: nowrap;
          transition: background 280ms ease, color 280ms ease;
        }
        .gy-dest-cta__primary:hover {
          background: #C9A84C;
          color: #0D1B2A;
        }
        .gy-dest-cta__secondary {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: #F8F5F0;
          text-decoration: none;
          padding: 16px 18px;
          white-space: nowrap;
        }
        .gy-dest-cta__secondary:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (max-width: 768px) {
          .gy-dest-cta__row {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          .gy-dest-cta__primary,
          .gy-dest-cta__secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
