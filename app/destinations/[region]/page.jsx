// Chapter 07 (Boss-spec, 2026-05-08) — destination detail page.
//
// Per-region page rendered for /destinations/cyclades, /ionian,
// /saronic. Sections (Boss spec):
//
//   1. Hero — full-width 70 vh, region label gold + Cormorant
//      destination title 56 px + tagline. Overlay rgba(13,27,42,0.50).
//   2. Editorial intro — 2–3 paragraphs in George's voice on why the
//      region is special FROM A CHARTER PERSPECTIVE. No travel-guide
//      copy, no restaurants/hotels/sights.
//   3. George's Insider Picks — 4–6 anchorages with one-line nautical
//      notes (depth, holding, wind protection, ideal yacht type).
//      Broker knowledge, not tourism.
//   4. CTA — full-width dark "Ready to explore the X?" + Browse +
//      Brief George buttons.
//
// Boss directives on what NOT to surface anywhere on these pages:
//   • Yacht counts per region
//   • Prices per region
//   • Restaurants / hotels / generic sightseeing copy

import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { DESTINATIONS, REGION_SLUGS, getDestination } from "@/lib/destinations";

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

  return (
    <>
      <article className="gy-destination-page" style={{ background: "#0D1B2A", color: "#F8F5F0" }}>
        {/* HERO */}
        <section
          className="gy-destination-hero"
          style={{
            position: "relative",
            width: "100%",
            height: "70vh",
            minHeight: 480,
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${d.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#0D1B2A",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13, 27, 42, 0.50)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                margin: "0 0 24px",
              }}
            >
              The Greek Waters · {d.label}
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(40px, 7vw, 84px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: "#F8F5F0",
                margin: "0 0 24px",
                textShadow: "0 8px 40px rgba(13, 27, 42, 0.55)",
                maxWidth: "16ch",
              }}
            >
              {d.cardTitle}
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(16px, 1.6vw, 20px)",
                color: "rgba(248, 245, 240, 0.85)",
                margin: 0,
                maxWidth: "48ch",
              }}
            >
              {d.pageTagline}
            </p>
          </div>
        </section>

        {/* EDITORIAL INTRO */}
        <section
          style={{
            padding: "100px 24px 80px",
            maxWidth: 760,
            margin: "0 auto",
          }}
        >
          {d.intro.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: 17,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240, 0.78)",
                margin: i === 0 ? "0 0 24px" : "0 0 24px",
              }}
            >
              {para}
            </p>
          ))}
        </section>

        {/* INSIDER PICKS */}
        <section style={{ background: "#142233", padding: "80px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                textAlign: "center",
                margin: "0 0 18px",
              }}
            >
              George's Insider Picks
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(28px, 3.6vw, 40px)",
                lineHeight: 1.15,
                color: "#F8F5F0",
                textAlign: "center",
                margin: "0 0 56px",
                maxWidth: "20ch",
                marginInline: "auto",
              }}
            >
              The anchorages we'd put you in.
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              {d.insiderPicks.map((pick) => (
                <li
                  key={pick.name}
                  style={{
                    paddingLeft: 18,
                    borderLeft: "1px solid rgba(201, 168, 76, 0.45)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: 22,
                      letterSpacing: 0,
                      color: "#F8F5F0",
                      margin: "0 0 8px",
                      lineHeight: 1.25,
                    }}
                  >
                    {pick.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "rgba(248, 245, 240, 0.72)",
                      margin: 0,
                    }}
                  >
                    {pick.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "#0D1B2A",
            padding: "100px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.15,
              color: "#F8F5F0",
              margin: "0 0 32px",
              maxWidth: "22ch",
              marginInline: "auto",
            }}
          >
            Ready to explore the {d.label}?
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <Link
              href="/charter-yacht-greece"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 32px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C9A84C",
                border: "1px solid #C9A84C",
                background: "transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              data-cursor="Browse"
            >
              Browse the Fleet →
            </Link>
            <Link
              href="/inquiry"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 18px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F8F5F0",
                background: "transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              data-cursor="Brief"
            >
              Brief George →
            </Link>
          </div>
        </section>
      </article>
      <Footer />
    </>
  );
}
