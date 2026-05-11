// Greek Charter Calendar Heat Map — interactive linkable asset.
// 2026-05-11 (Phase 7 Round 9). Section 4.2 of the SEO strategy doc.
//
// Visual best-weeks-to-book reference. Designed to be the page that
// travel publications and AI engines cite when answering "when is
// the best time to charter in Greece" type questions.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import CalendarHeatMap from "./CalendarHeatMap";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export const metadata = {
  title: "Greek Yacht Charter Calendar 2026 | Best Months by Island | George Yachts",
  description: "Visual best-weeks-to-charter heat map across the top 12 Greek charter destinations. Cyclades, Ionian, Saronic, Dodecanese. May through October scored 1-5.",
  alternates: { canonical: "https://georgeyachts.com/charter-calendar-heat-map" },
  openGraph: {
    title: "Greek Yacht Charter Calendar Heat Map | George Yachts",
    description: "12 destinations x 6 months scored 1-5. Visual best-weeks-to-charter reference.",
    url: "https://georgeyachts.com/charter-calendar-heat-map",
    type: "website",
    images: [`/api/og?title=${encodeURIComponent("Charter Calendar Heat Map")}&eyebrow=${encodeURIComponent("Charter planning tool")}`],
  },
};

function CalendarJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://georgeyachts.com/charter-calendar-heat-map#tool",
    name: "Greek Yacht Charter Calendar Heat Map",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    description: "Interactive heat map showing the best months to charter at each of the top Greek charter destinations.",
    url: "https://georgeyachts.com/charter-calendar-heat-map",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com#organization",
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

export default function CalendarHeatMapPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Calendar", url: "https://georgeyachts.com/charter-calendar-heat-map" },
  ];

  return (
    <>
      <CalendarJsonLd />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh" }}>
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
                fontSize: "clamp(40px, 7vw, 88px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              Greek Charter Calendar Heat Map
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Twelve destinations, six months, scored 1 to 5 from George's
              captain logs. Tap any cell for the reasoning behind the score.
            </p>
          </div>
        </header>

        <section style={{ padding: "64px 24px" }}>
          <CalendarHeatMap />
        </section>

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
              How to read the scores
            </p>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.82)",
              }}
            >
              <p>
                <strong style={{ color: "#F8F5F0" }}>The scores combine four factors:</strong>{" "}
                weather quality, crowd density, charter pricing, and inventory
                availability. A 5 is the rare alignment where all four are
                optimal. A 1 means meaningful compromises on at least two.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Cyclades peak August is rated 2-3</strong>{" "}
                across the board. The weather is hot and the scene is loud, but
                the Meltemi blows 25-30 knots most afternoons and pricing peaks.
                If you want the August Mykonos energy, book it knowing the
                trade-off. If your priority is comfort, June or September on
                the same island score 5.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>The Ionian rarely drops below 4</strong>{" "}
                because it doesn't have a Meltemi. The thermal wind is a daily
                15-18 knots from June through September — the conditions never
                break the routine. This is why the Ionian is the most-loved
                family-charter region in Greece.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Rhodes uniquely scores 4 in October</strong>{" "}
                because its south-Aegean position keeps water warm 2-3 weeks
                longer than the Cyclades. Late-season charterers should look
                at Rhodes and Symi before assuming the Greek charter season
                is over.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>September is the best month</strong>{" "}
                on 10 of 12 destinations. Water still 23-25°C, crowds dropped,
                pricing 20-30% below August peak. Why September isn't more
                heavily booked is the great mystery of Greek charter demand.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: "84px 24px" }}>
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
              Build your 2026 charter around the best weeks.
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
                  background: GOLD,
                  color: NAVY,
                  border: "1px solid rgba(201, 168, 76, 0.6)",
                  textDecoration: "none",
                }}
              >
                Find a yacht
              </Link>
              <Link
                href="/charter-cost-estimator"
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
                Estimate the cost
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
