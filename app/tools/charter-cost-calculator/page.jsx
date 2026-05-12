// Charter Cost Calculator page - Phase 7 Round 26 (2026-05-12).
// Technical brief Priority 2A.
//
// Interactive linkable asset at /tools/charter-cost-calculator.
// Targets queries like "Greek yacht charter cost calculator" /
// "how much does a Greek yacht charter cost" / "APA calculator".
//
// Schema: WebApplication + FAQPage + BreadcrumbList + Article (it's
// a tool but also a citable reference page for the underlying cost
// model).

import Link from "next/link";
import CalculatorClient from "./CalculatorClient";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: "Greek Yacht Charter Cost Calculator 2026 | George Yachts",
  description:
    "Calculate the full cost of a Greek yacht charter - base fee + VAT 13% + APA + delivery + gratuity. Free tool by George Yachts, IYBA member, MYBA-standard contracts.",
  alternates: { canonical: "https://georgeyachts.com/tools/charter-cost-calculator" },
  openGraph: {
    title: "Greek Yacht Charter Cost Calculator 2026",
    description:
      "Free interactive calculator. Base + VAT + APA + delivery + gratuity. By George Yachts.",
    url: "https://georgeyachts.com/tools/charter-cost-calculator",
    type: "website",
    images: [
      `/api/og?title=${encodeURIComponent("Charter Cost Calculator")}&eyebrow=${encodeURIComponent("Free tool")}`,
    ],
  },
};

const FAQ = [
  {
    q: "What's included in the calculator's estimate?",
    a: "Base charter fee, Greek VAT (13% reduced rate for Greek-flagged yachts), APA (Advance Provisioning Allowance) at your selected percentage, delivery fee estimate from the Athens-based fleet, and crew gratuity range (10-15%). The total is shown as a range bracketing the gratuity since gratuity is customary, not contractual.",
  },
  {
    q: "Is the 13% VAT rate correct for all Greek charters?",
    a: "13% is the reduced Greek VAT rate that applies to charters consumed within Greek waters under Greek-flagged yachts departing Greek ports. Foreign-flagged yachts (Cayman, Malta, etc.) have variable VAT treatment depending on flag state and itinerary structuring. Charters that include time in non-Greek waters may have a proportional VAT adjustment - rare for typical 7-night Greek itineraries.",
  },
  {
    q: "How accurate is the APA percentage?",
    a: "APA percentages reflect industry-standard ranges. Motor yachts typically run 30%, sailing yachts 25%, performance planing-hull motor yachts 35%. Your captain reconciles APA at disembarkation - any unspent balance is refunded, any overspend is settled. The percentage you set here is the upfront cash you wire 14 days before embarkation.",
  },
  {
    q: "Why is delivery 'often negotiable'?",
    a: "Most luxury Greek yachts are based in Athens (Alimos / Olympic Marine). When the yacht needs to reposition for your start port, delivery can be billed at 1/7 of weekly rate per day, OR negotiated as a flat fee, OR waived entirely if the yacht is already in your start port for another reason. A skilled broker eliminates or halves delivery on most charters.",
  },
  {
    q: "Why is gratuity shown as a range?",
    a: "Greek-market 2026 median crew gratuity is 10-12% of the base charter fee. Below 7% signals dissatisfaction; above 18% reserved for exceptional service. The range reflects this band. Tipping is customary and goes directly to the crew in cash at disembarkation - not included in any invoice.",
  },
  {
    q: "Can I use this for foreign-flagged yacht estimates?",
    a: "Set 'Foreign-flagged' and the calculator will skip Greek VAT (the rate doesn't apply uniformly). The base fee + APA + delivery + gratuity calculations still work. For a precise foreign-flag quote, contact George directly - flag-state rules vary.",
  },
];

function WebApplicationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://georgeyachts.com/tools/charter-cost-calculator#tool",
    name: "Greek Yacht Charter Cost Calculator",
    description:
      "Interactive calculator estimating the full cost of a Greek yacht charter, including base fee, Greek VAT (13%), APA, delivery, and crew gratuity range.",
    url: "https://georgeyachts.com/tools/charter-cost-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
      name: "George P. Biniaris",
      url: "https://georgeyachts.com/about/george-p-biniaris",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

function FaqJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export default function ChartCostCalculatorPage() {
  return (
    <>
      <WebApplicationJsonLd />
      <FaqJsonLd />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com/" },
          { name: "Tools", url: "https://georgeyachts.com/tools" },
          {
            name: "Charter Cost Calculator",
            url: "https://georgeyachts.com/tools/charter-cost-calculator",
          },
        ]}
      />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 56px", textAlign: "center" }}>
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
              Free interactive tool
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 6.5vw, 80px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              Greek Yacht Charter Cost Calculator
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(17px, 2vw, 21px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: 0,
                lineHeight: 1.55,
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Real numbers. The 4 cost buckets every Greek charter has: base fee, Greek VAT, APA, delivery, plus the gratuity range. No quote required.
            </p>
          </div>
        </header>

        {/* CALCULATOR */}
        <section style={{ padding: "24px 24px 72px" }}>
          <CalculatorClient />
        </section>

        {/* COST MODEL EXPLAINED */}
        <section
          style={{
            background: "rgba(201, 168, 76, 0.025)",
            borderTop: `1px solid rgba(201, 168, 76, 0.15)`,
            borderBottom: `1px solid rgba(201, 168, 76, 0.15)`,
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
              The cost model
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 38px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 24px",
                lineHeight: 1.2,
              }}
            >
              How a Greek charter price actually breaks down
            </h2>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240, 0.85)",
                margin: "0 0 18px",
              }}
            >
              Every Greek yacht charter splits into four hard costs plus one customary cost. Understanding them is the difference between a clean quote and an unwelcome surprise at embarkation.
            </p>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                counterReset: "buckets",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {[
                {
                  label: "Base charter fee",
                  body: "The weekly hire of the yacht and its full crew. Includes salaries, insurance, normal maintenance, linens, standard amenities. Excludes everything below.",
                },
                {
                  label: "Greek VAT (13%)",
                  body: "Half the standard 24% Greek VAT, applied to the base fee for intra-Greek charters on Greek-flagged yachts. The most favourable Mediterranean rate after Croatia's 13%.",
                },
                {
                  label: "APA (25-35%)",
                  body: "Advance Provisioning Allowance. Working float held by the captain to cover fuel, food, drink, port fees, laundry. Receipted - any unspent balance is refunded at disembarkation.",
                },
                {
                  label: "Delivery fee (when applicable)",
                  body: "Charged when the yacht must reposition from its home base to your embarkation port. Often negotiable, sometimes waived. Estimated here at 1/7 of weekly rate per delivery day.",
                },
                {
                  label: "Crew gratuity (10-15%)",
                  body: "Cash tip paid to the crew at disembarkation. Customary, not contractual. Greek-market 2026 median 10-12% of base charter fee.",
                },
              ].map((b, i) => (
                <li
                  key={i}
                  style={{
                    counterIncrement: "buckets",
                    paddingLeft: 50,
                    position: "relative",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 2,
                      width: 36,
                      height: 36,
                      border: `1px solid ${GOLD}`,
                      color: GOLD,
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 18,
                      color: CREAM,
                      fontWeight: 400,
                      margin: "0 0 4px",
                      lineHeight: 1.3,
                    }}
                  >
                    {b.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 14,
                      color: "rgba(248, 245, 240, 0.78)",
                      margin: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    {b.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              Frequently asked
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(26px, 3.6vw, 36px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 32px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              About this calculator
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FAQ.map((f, i) => (
                <details
                  key={i}
                  style={{
                    border: `1px solid rgba(248, 245, 240, 0.1)`,
                    padding: "16px 20px",
                    background: "rgba(13, 27, 42, 0.4)",
                  }}
                >
                  <summary
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 17,
                      color: CREAM,
                      cursor: "pointer",
                      listStyle: "none",
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "rgba(248, 245, 240, 0.82)",
                      margin: "14px 0 0",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "rgba(201, 168, 76, 0.025)",
            borderTop: `1px solid rgba(201, 168, 76, 0.15)`,
            padding: "84px 24px",
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
              Ready for an exact quote?
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
              George P. Biniaris handles every inquiry personally. Real availability, real pricing, MYBA-standard contracts. Reply within 24 hours.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
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
              <Link
                href="/greek-yacht-charter-2026-complete-pricing-guide"
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
                  border: `1px solid rgba(248, 245, 240, 0.3)`,
                  textDecoration: "none",
                }}
              >
                Full pricing guide
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
