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
import RelatedPages from "@/app/components/seo/RelatedPages";
import Footer from "@/app/components/Footer";

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: "Greek Yacht Charter Cost Calculator",
  description:
    "Work out what a Greek crewed yacht charter really costs: real rate-card bands by yacht type, the certified VAT tier, APA, delivery and gratuity, per yacht per week. Free.",
  alternates: { canonical: "https://georgeyachts.com/tools/charter-cost-calculator" },
  openGraph: {
    title: "Greek Yacht Charter Cost Calculator",
    description:
      "Free interactive calculator. Base + VAT + APA + delivery + gratuity. By George Yachts.",
    url: "https://georgeyachts.com/tools/charter-cost-calculator",
    type: "website",
    images: [
      `/api/og?title=${encodeURIComponent("Charter Cost Calculator")}&eyebrow=${encodeURIComponent("Free tool")}`,
    ],
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
  },
};

// 2026-09-04 rebuild. Every answer below states only what the Greek
// Charter Index and the site's VAT, APA and gratuity pages already
// document. No flat 13%, no flag switch, no invented medians.
const FAQ = [
  {
    q: "Where do the calculator's numbers come from?",
    a: "From the Greek Charter Index, our own compilation of the current rate cards of the fully crewed yachts we represent, refreshed quarterly. Each band shows the lowest and highest weekly net base fee that appears on a rate card for that yacht type and size, per yacht, before VAT and APA. Nothing is a market average and nothing is estimated; if a figure is not on a rate card we hold, it is not here.",
  },
  {
    q: "Which Greek VAT rate applies to my charter?",
    a: "A weekly crewed charter in Greek waters is invoiced at 5.2, 6.5, 7.8 or 12% depending on the yacht's certification, with 13% the statutory ceiling. Charters under 48 hours and bareboat charters are taxed at 24% instead. The calculator lets you set the tier because the yacht decides it, not the charterer; your written quote names the exact certified rate before you sign.",
  },
  {
    q: "How much APA should I expect?",
    a: "On the yachts in the Index, APA runs 20 to 30% of the base fee for sailing yachts and catamarans and 30 to 40% for motor yachts, where fuel is the heaviest line. It covers fuel, food, wine, berths, port fees and consumables, is paid before boarding, is spent by the captain against receipts, and whatever is unspent is returned to you after the charter, usually within two weeks.",
  },
  {
    q: "What does delivery cost, and can it be avoided?",
    a: "Most of the crewed fleet is based in Athens, so a week that starts in Athens carries no delivery line. When the yacht must reposition to Mykonos, Corfu, Rhodes or Santorini, the convention is one seventh of the weekly fee per delivery day, and it is often negotiated down or waived when the yacht is heading that way anyway. The calculator shows the convention; the quote shows what we obtained.",
  },
  {
    q: "Why is the gratuity a range?",
    a: "Crew gratuity in Greek waters is customary, not contractual: 10 to 15% of the base fee, calculated on the base alone and never on APA or VAT, handed to the captain at the end of the week. The calculator brackets the total with the lower and higher figure so nothing on the last day surprises you.",
  },
  {
    q: "Does the price depend on how many guests we are?",
    a: "No. A crewed yacht is chartered as a whole, by the week, and the fee is the same whether four or ten guests are aboard within her licensed capacity. That is why nothing here is divided by the number of guests: the honest number is the yacht's week, and the guest count only helps us choose the right size band for you.",
  },
  {
    q: "Is there anything the total does not include?",
    a: "Greece's TEPAI cruising tax, billed by yacht length and month at the official tariff, and any personal extras such as shore excursions or a chef upgrade agreed separately. Everything else a Greek week costs, the base fee, VAT, APA, delivery and gratuity, is on the screen.",
  },
];

function WebApplicationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://georgeyachts.com/tools/charter-cost-calculator#tool",
    name: "Greek Yacht Charter Cost Calculator",
    description:
      "Interactive calculator for the all-in cost of a Greek crewed yacht charter: base fee bands from the Greek Charter Index rate cards, the yacht's certified VAT tier (5.2 to 12%, 13% ceiling), APA, delivery and the customary crew gratuity, per yacht per week.",
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
      "@id": "https://georgeyachts.com/#organization",
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
                color: "rgba(248,245,240,0.85)",
                margin: 0,
                lineHeight: 1.55,
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Real rate cards, not averages. Pick the yacht type and size, set the certified VAT tier and the APA, and read the week all-in: base fee, VAT, APA, delivery and the gratuity range, per yacht.
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
            background: "rgba(218, 161, 16, 0.025)",
            borderTop: `1px solid rgba(218, 161, 16, 0.15)`,
            borderBottom: `1px solid rgba(218, 161, 16, 0.15)`,
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
                  label: "Greek VAT, the certified tier (5.2 to 12%)",
                  body: "Invoiced on the base fee at the rate the yacht's certification allows: 5.2, 6.5, 7.8 or 12%, with 13% the statutory ceiling for a weekly crewed charter. Charters under 48 hours and bareboat pay the standard 24%. The yacht sets the tier; the quote names it.",
                },
                {
                  label: "APA (20 to 30% sail and catamaran, 30 to 40% motor)",
                  body: "The Advance Provisioning Allowance, a float held by the captain for fuel, food, wine, berths and port fees, spent against receipts and returned unspent after the charter. Fuel is why motor yachts sit at the top of the range.",
                },
                {
                  label: "Delivery (only away from Athens)",
                  body: "Charged when a yacht based in Athens repositions to Mykonos, Corfu, Rhodes or Santorini for your start. The convention is one seventh of the weekly fee per delivery day; it is often negotiated down and sometimes waived.",
                },
                {
                  label: "Crew gratuity (10 to 15% of the base)",
                  body: "Customary, not contractual, calculated on the base fee alone and handed to the captain at the end of the week. The calculator shows the total with both ends of the range.",
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
                      color: "rgba(248,245,240,0.85)",
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
                      color: "rgba(248,245,240,0.88)",
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
            background: "rgba(218, 161, 16, 0.025)",
            borderTop: `1px solid rgba(218, 161, 16, 0.15)`,
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
                color: "rgba(248,245,240,0.85)",
                margin: "0 0 28px",
              }}
            >
              George P. Biniaris handles every inquiry personally. Real availability, real pricing, MYBA-standard contracts. Reply within 24 hours.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/#contact"
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
        {/* 2026-08-06 (job 18), the cost cluster is the biggest commercial
            demand on this site and every query in it was being answered by
            three to five of our own pages at once. This page linked to exactly
            one of its six siblings because the COHORTS mechanism only ever
            rendered inside SeoLanding. */}
        <RelatedPages path="/tools/charter-cost-calculator" />
      </article>
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
