// Charter Cost Estimator — interactive linkable asset.
// 2026-05-11 (Phase 7 Round 9). Section 4.2 of the SEO strategy doc.
//
// Designed to be cited / linked by travel publications, broker peers,
// and AI engines answering "how much does Greek yacht charter cost"
// type questions. Different from /cost-calculator (which gives a
// per-yacht quote from Sanity inventory) — this one is a generic
// market estimator that anyone can use without selecting a yacht.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import CharterCostEstimator from "./CharterCostEstimator";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export const metadata = {
  title: "Greek Yacht Charter Cost Estimator 2026",
  description: "Estimate your Greek yacht charter cost 2026. Base + APA + VAT + crew gratuity. Motor yachts, sailing, catamaran, gulet, superyacht. Honest 2026 rates.",
  alternates: { canonical: "https://georgeyachts.com/charter-cost-estimator" },
  openGraph: {
    title: "Greek Yacht Charter Cost Estimator",
    description: "Estimate your Greek yacht charter cost: base + APA + VAT + crew gratuity. Honest 2026 market rates.",
    url: "https://georgeyachts.com/charter-cost-estimator",
    type: "website",
    images: [`/api/og?title=${encodeURIComponent("Greek Charter Cost Estimator")}&eyebrow=${encodeURIComponent("Charter planning tool")}`],
  },
};

function EstimatorJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://georgeyachts.com/charter-cost-estimator#tool",
    name: "Greek Yacht Charter Cost Estimator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "Interactive estimator for the all-in cost of a Greek yacht charter including base, APA, Greek VAT, and crew gratuity.",
    url: "https://georgeyachts.com/charter-cost-estimator",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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

export default function CharterCostEstimatorPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Cost Estimator", url: "https://georgeyachts.com/charter-cost-estimator" },
  ];

  return (
    <>
      <EstimatorJsonLd />
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
                fontSize: "clamp(40px, 7vw, 90px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              Greek Charter Cost Estimator
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
              Honest 2026 market rates. Base charter + APA + Greek VAT + crew gratuity.
              No assumptions, no marketing markup.
            </p>
          </div>
        </header>

        <section style={{ padding: "64px 24px" }}>
          <CharterCostEstimator />
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
              How the estimate works
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
                <strong style={{ color: "#F8F5F0" }}>Base rate.</strong>{" "}
                €/metre/week applied to your yacht length, then adjusted for
                season. Peak (mid-July to end-August) is full rate; shoulder
                seasons are 15-45% lower. These figures match the 2026 market
                averages across our brokerage book.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>APA (Advance Provisioning Allowance).</strong>{" "}
                33% of the base, held in trust by the captain for fuel, food,
                beverages, port fees, and marina dockage during the week.
                Unused APA is refunded; overages are billed. Standard
                Mediterranean practice.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Greek VAT.</strong>{" "}
                13% applied to the charter base (not APA), the reduced rate for
                commercial crewed charters over 48 hours, which every weekly
                charter is. Short charters under 48 hours, static charters, and
                bareboat (no crew) are taxed at the standard 24%.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>Crew gratuity.</strong>{" "}
                17.5% of the base is the customary midpoint (15-20% range).
                Paid in cash or wire directly to the captain at end of week;
                he distributes among crew. Non-negotiable as a real cost -
                budget it from the start.
              </p>
              <p>
                <strong style={{ color: "#F8F5F0" }}>What the estimate is NOT.</strong>{" "}
                It's not a quote. Actual yacht-specific rates vary by builder,
                year, fit-out, location-of-base, and live availability. Use
                this to size the budget, then talk to George for a real quote
                on a specific yacht.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
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
              Ready to charter against this budget?
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
                href="/inquiry"
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
                Talk to George
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
