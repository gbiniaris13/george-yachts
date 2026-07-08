// Sailing Distance Calculator — interactive linkable asset.
// 2026-05-11 (Phase 7 Round 5). Section 4.2 of the SEO strategy doc.
//
// Closes the last linkable-asset gap from Section 4.2. Interactive
// distance + passage-time + fuel-cost calculator across Greek-waters
// ports. Designed to be cited / linked by travel publications,
// sailing forums, and AI engines answering "how far is Mykonos from
// Athens by yacht" type questions.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import SailingDistanceCalculator from "./SailingDistanceCalculator";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export const metadata = {
  title: "Greek Islands Sailing Distance Calculator",
  description: "Interactive sailing distance calculator for Greek waters. Calculate passage time, distance, and fuel cost between 32+ ports. Motor, sailing, catamaran speeds.",
  alternates: { canonical: "https://georgeyachts.com/sailing-distance-calculator" },
  openGraph: {
    title: "Greek Islands Sailing Distance Calculator",
    description: "Interactive sailing distance calculator for Greek waters. Calculate passage time, distance, and fuel cost between 32+ ports.",
    url: "https://georgeyachts.com/sailing-distance-calculator",
    type: "website",
    images: [`/api/og?title=${encodeURIComponent("Greek Islands Sailing Distance Calculator")}&eyebrow=${encodeURIComponent("Charter planning tool")}`],
  },
};

function CalculatorJsonLd() {
  // SoftwareApplication / WebApplication schema for the tool itself,
  // which qualifies the page for rich-result eligibility on tool-type
  // queries.
  const json = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://georgeyachts.com/sailing-distance-calculator#tool",
    name: "Greek Islands Sailing Distance Calculator",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    description: "Interactive calculator for distance, passage time, and fuel cost between Greek-waters charter ports.",
    url: "https://georgeyachts.com/sailing-distance-calculator",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function SailingDistanceCalculatorPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Sailing Distance Calculator", url: "https://georgeyachts.com/sailing-distance-calculator" },
  ];

  return (
    <>
      <CalculatorJsonLd />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh" }}>
        {/* HERO */}
        <header
          style={{
            padding: "120px 24px 56px",
            borderBottom: "1px solid rgba(201, 168, 76, 0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 18px",
              }}
            >
              Charter planning tool
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 7vw, 90px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              Greek Islands Sailing Distance Calculator
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248,245,240,0.85)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Distance, passage time, and fuel-cost estimates between 32+ Greek
              charter ports. Built from our captain logs and the Imray Greek
              Waters Pilot.
            </p>
          </div>
        </header>

        {/* CALCULATOR */}
        <section style={{ padding: "64px 24px" }}>
          <SailingDistanceCalculator />
        </section>

        {/* CONTEXT */}
        <section
          style={{
            background: "rgba(201, 168, 76, 0.025)",
            borderTop: "1px solid rgba(201, 168, 76, 0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
              }}
            >
              How to read the numbers
            </p>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248,245,240,0.88)",
              }}
            >
              <p>
                <strong style={{ color: "#F8F5F0" }}>Distance in nautical miles.</strong>{" "}
                One nautical mile is 1.852 km, the standard maritime unit.
                Distances are direct sea routes (the way a captain would
                actually sail), rounded to the nearest 5 nm.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Passage time</strong> uses
                each yacht type's sustained cruise speed in moderate weather.
                Motor yachts cruise at 16-22 knots; sailing yachts at 6-9 knots
                depending on wind; catamarans at 8-12 knots under sail. Plan
                for 10-20% buffer time for departures, anchoring, and weather
                avoidance.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Fuel cost</strong> uses
                €1.95/L marine diesel (2026 Greek port average) and mid-range
                litres-per-hour figures for each yacht category. Real fuel cost
                varies by yacht-specific engine load, weather, and current
                cruise mode (eco vs cruise vs sport). The captain delivers a
                route-specific quote at booking.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Plan a 7-night charter</strong>{" "}
                so that no single day exceeds 60-80 nm under power or 40-60 nm
                under sail. Beyond those distances, the day becomes a transit
                rather than a charter day. Build the route around overnight
                anchorages 30-60 nm apart for the most relaxed pace.
              </p>
            </div>
          </div>
        </section>

        {/* COMMON ROUTES */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
                textAlign: "center",
              }}
            >
              Common Greek charter routes
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 36px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Reference distances
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              {[
                { route: "Athens → Mykonos", dist: "90 nm", time: "5h motor / 13h sail" },
                { route: "Athens → Santorini", dist: "130 nm", time: "7h motor / 19h sail" },
                { route: "Athens → Hydra", dist: "35 nm", time: "2h motor / 5h sail" },
                { route: "Mykonos → Santorini", dist: "80 nm", time: "4.5h motor / 11h sail" },
                { route: "Lefkada → Corfu", dist: "80 nm", time: "4.5h motor / 11h sail" },
                { route: "Lefkada → Paxos", dist: "50 nm", time: "3h motor / 7h sail" },
                { route: "Athens → Rhodes", dist: "270 nm", time: "15h motor / 39h sail" },
                { route: "Santorini → Crete (Heraklion)", dist: "65 nm", time: "3.5h motor / 9h sail" },
                { route: "Athens → Skiathos", dist: "145 nm", time: "8h motor / 21h sail" },
              ].map((r) => (
                <div
                  key={r.route}
                  style={{
                    border: "1px solid rgba(248, 245, 240, 0.1)",
                    padding: "20px 22px",
                    background: "rgba(248, 245, 240, 0.02)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 18,
                      fontWeight: 400,
                      color: "#F8F5F0",
                      margin: "0 0 10px",
                    }}
                  >
                    {r.route}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: GOLD,
                      fontWeight: 600,
                      margin: "0 0 4px",
                    }}
                  >
                    {r.dist}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 12,
                      color: "rgba(248,245,240,0.66)",
                      margin: 0,
                    }}
                  >
                    {r.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "rgba(201, 168, 76, 0.025)",
            borderTop: "1px solid rgba(201, 168, 76, 0.15)",
            padding: "84px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 32px",
                lineHeight: 1.2,
              }}
            >
              Plan your 2026 Greek charter route.
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/yacht-finder"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "14px 26px",
                  background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                  color: NAVY,
                  border: "1px solid rgba(201, 168, 76, 0.6)",
                  textDecoration: "none",
                }}
              >
                Find a yacht
              </Link>
              <Link
                href="/itinerary-builder"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "14px 26px",
                  background: "transparent",
                  color: "rgba(248, 245, 240, 0.85)",
                  border: "1px solid rgba(248, 245, 240, 0.3)",
                  textDecoration: "none",
                }}
              >
                Build a route
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
