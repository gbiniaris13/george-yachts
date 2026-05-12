// Market reports hub — Phase 7 Round 19 (2026-05-12).
//
// Single canonical surface listing every periodic market report
// George Yachts publishes. Schema: CollectionPage + ItemList so AI
// engines understand this is the index of George's recurring
// research output.
//
// Strategy: when a new report ships, it appears here automatically
// (pulled from /lib/marketReportsSeo.js). The annual 2026 market
// report is included as the foundational anchor.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: "Greek Yacht Charter Market Reports | George Yachts Research",
  description:
    "Quarterly and forecast research on the Greek yacht charter market — original data from George Yachts Brokerage House. Authored by George P. Biniaris.",
  alternates: { canonical: "https://georgeyachts.com/market-reports" },
  openGraph: {
    title: "Greek Yacht Charter Market Reports",
    description:
      "Quarterly and forecast research on the Greek yacht charter market. Original data, no marketing fluff.",
    url: "https://georgeyachts.com/market-reports",
    type: "website",
    images: [`/api/og?title=${encodeURIComponent("Market Reports")}&eyebrow=${encodeURIComponent("Research")}`],
  },
};

// The annual 2026 market report — anchored at the top as the
// foundational reference, with quarterly/forecast reports beneath.
const ANNUAL_REPORT = {
  slug: "2026-greek-charter-market-report",
  period: "Annual 2026",
  urlPath: "/2026-greek-charter-market-report",
  h1: "2026 Greek Charter Market Report",
  tagline: "The foundational annual report. Fleet, pricing, regional trends, and outlook for 2026.",
  publishedAt: "2026-01-15",
  reportType: "annual",
};

function CollectionPageJsonLd({ allReports }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://georgeyachts.com/market-reports#collection",
    name: "Greek Yacht Charter Market Reports",
    description:
      "Quarterly and forecast research on the Greek yacht charter market. Original data, authored by George P. Biniaris.",
    url: "https://georgeyachts.com/market-reports",
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allReports.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://georgeyachts.com${r.urlPath}`,
        name: r.h1,
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function MarketReportsHub() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Market Reports", url: "https://georgeyachts.com/market-reports" },
  ];

  // Combine annual + all periodic reports, newest first.
  const allReports = [ANNUAL_REPORT, ...MARKET_REPORTS].sort((a, b) =>
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  return (
    <>
      <CollectionPageJsonLd allReports={allReports} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 64px", textAlign: "center" }}>
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
              The research
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(46px, 8vw, 96px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              Market Reports
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.2vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: "0 auto",
                maxWidth: 640,
                lineHeight: 1.5,
              }}
            >
              Original quarterly and forecast research on the Greek yacht charter market. No marketing fluff — booking data, pricing trends, fleet movements.
            </p>
          </div>
        </header>

        {/* INTRO */}
        <section
          style={{
            background: "rgba(201,168,76,0.04)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "56px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.85)",
                margin: "0 0 18px",
              }}
            >
              We publish three or four market reports per year tracking the Greek yacht charter industry's structural changes: bookings, pricing, fleet additions, regional shifts, and forward-looking forecasts. The data comes from our internal contracted-charter ledger, IYBA broker-share feeds, and direct marina occupancy tracking at the primary charter bases.
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.85)",
                margin: 0,
              }}
            >
              All reports are authored by{" "}
              <Link
                href="/about/george-p-biniaris"
                style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}
              >
                George P. Biniaris
              </Link>
              {" "}and published under{" "}
              <Link
                href="/glossary/myba-contract"
                style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}
              >
                MYBA-standard
              </Link>
              {" "}charter conventions. Free to read, methodology disclosed in every report.
            </p>
          </div>
        </section>

        {/* REPORT LIST */}
        <section style={{ padding: "72px 24px 96px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {allReports.map((r) => {
                const publishedDate = new Date(r.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <Link
                    key={r.slug}
                    href={r.urlPath}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid rgba(248, 245, 240, 0.1)",
                      padding: "28px 32px",
                      background: "rgba(248, 245, 240, 0.02)",
                    }}
                    className="g1-report-card"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 24,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 9,
                          letterSpacing: "0.42em",
                          textTransform: "uppercase",
                          color: GOLD,
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {r.period}{" · "}
                        {r.reportType === "retrospective" && "Retrospective"}
                        {r.reportType === "snapshot" && "Snapshot"}
                        {r.reportType === "forecast" && "Forecast"}
                        {r.reportType === "annual" && "Annual"}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 11,
                          letterSpacing: "0.16em",
                          color: "rgba(248, 245, 240, 0.55)",
                          margin: 0,
                          textTransform: "uppercase",
                        }}
                      >
                        {publishedDate}
                      </p>
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: "clamp(22px, 3vw, 28px)",
                        fontWeight: 400,
                        color: CREAM,
                        margin: "0 0 12px",
                        lineHeight: 1.25,
                      }}
                    >
                      {r.h1}
                    </h2>
                    {r.tagline && (
                      <p
                        style={{
                          fontFamily: "var(--gy-font-editorial)",
                          fontSize: 16,
                          fontStyle: "italic",
                          color: "rgba(248, 245, 240, 0.78)",
                          margin: "0 0 16px",
                          lineHeight: 1.55,
                        }}
                      >
                        {r.tagline}
                      </p>
                    )}
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: GOLD,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      Read report →
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Inline Calendly - Phase 7 R23 (technical brief Priority 1B). */}
        <InlineCalendlySection
          heading="Want a market briefing for your specific charter?"
          subheading="Book a free 30-minute call with George to walk through the latest data, what it means for your dates, and where the 2026 opportunities are."
        />

        {/* CTA */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(26px, 3.8vw, 36px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 18px",
                lineHeight: 1.2,
              }}
            >
              Got questions about the data?
            </h2>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.65,
                color: "rgba(248, 245, 240, 0.78)",
                margin: "0 0 28px",
              }}
            >
              Methodology, source data, or how the numbers apply to your specific charter — speak with George directly.
            </p>
            <Link
              href="/inquiry"
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
                textDecoration: "none",
              }}
            >
              Write to George
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
