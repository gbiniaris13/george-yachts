// Glossary index page — Phase 7 Round 15 (2026-05-12).
//
// The hub for the 30-term yacht-charter glossary. Serves three
// audiences:
//   • Google: featured-snippet target for queries like "yacht charter
//     glossary", "yacht charter terms explained".
//   • LLMs (ChatGPT / Perplexity / Claude / Gemini): a single page
//     that catalogs all defined terms in DefinedTermSet schema —
//     gives AI engines a clean index to crawl when answering "what
//     is X in yacht charter" queries.
//   • Human UHNW buyers researching their first charter and wanting
//     to understand the vocabulary before contacting a broker.

import Link from "next/link";
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from "@/lib/glossarySeo";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: "Yacht Charter Glossary: 30 UHNW Terms Explained | George Yachts",
  description:
    "From APA to flybridge — every yacht charter term a luxury buyer needs to know, defined by George P. Biniaris. The definitive 2026 UHNW yacht charter glossary.",
  alternates: { canonical: "https://georgeyachts.com/glossary" },
  openGraph: {
    title: "Yacht Charter Glossary: 30 UHNW Terms Explained",
    description:
      "Every yacht charter term a luxury buyer needs to know, defined by George P. Biniaris. The definitive 2026 UHNW yacht charter glossary.",
    url: "https://georgeyachts.com/glossary",
    type: "website",
    images: [
      `/api/og?title=${encodeURIComponent("Yacht Charter Glossary")}&eyebrow=${encodeURIComponent("Reference")}`,
    ],
  },
};

function DefinedTermSetJsonLd() {
  // DefinedTermSet — tells search engines and LLMs that this URL is
  // a structured collection of definitions, with each term marked up
  // separately at /glossary/[slug] via DefinedTerm.
  const json = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://georgeyachts.com/glossary#set",
    name: "George Yachts Yacht Charter Glossary",
    description:
      "The definitive UHNW yacht charter glossary. 30 terms covering pricing, contracts, yacht types, operations, crew, and specifications. Maintained by George P. Biniaris, George Yachts Brokerage House.",
    url: "https://georgeyachts.com/glossary",
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `https://georgeyachts.com/glossary/${t.slug}#term`,
      name: t.term,
      alternateName: t.alsoKnownAs || [],
      description: t.shortDefinition,
      url: `https://georgeyachts.com/glossary/${t.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function GlossaryIndexPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Glossary", url: "https://georgeyachts.com/glossary" },
  ];

  // Group terms by category for the body, preserving the order of
  // GLOSSARY_CATEGORIES so pricing appears before specs etc.
  const byCategory = GLOSSARY_CATEGORIES.map((cat) => ({
    ...cat,
    terms: GLOSSARY_TERMS.filter((t) => t.category === cat.slug),
  })).filter((cat) => cat.terms.length > 0);

  return (
    <>
      <DefinedTermSetJsonLd />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 72px", textAlign: "center" }}>
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
              The Reference
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(48px, 8vw, 110px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              Yacht Charter Glossary
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.2vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: "0 auto",
                maxWidth: 660,
                lineHeight: 1.5,
              }}
            >
              Every term a UHNW yacht buyer needs to know — defined precisely, with real 2026 Greek-market numbers. Curated by George P. Biniaris.
            </p>
          </div>
        </header>

        {/* QUICK STATS BAR */}
        <section
          style={{
            background: "rgba(201,168,76,0.04)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 880,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 24,
              textAlign: "center",
            }}
          >
            <div>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 36, fontWeight: 300, color: GOLD, margin: 0 }}>
                {GLOSSARY_TERMS.length}
              </p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248, 245, 240, 0.65)", margin: "6px 0 0" }}>
                Defined terms
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 36, fontWeight: 300, color: GOLD, margin: 0 }}>
                {GLOSSARY_CATEGORIES.filter((c) => GLOSSARY_TERMS.some((t) => t.category === c.slug)).length}
              </p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248, 245, 240, 0.65)", margin: "6px 0 0" }}>
                Categories
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 36, fontWeight: 300, color: GOLD, margin: 0 }}>
                2026
              </p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248, 245, 240, 0.65)", margin: "6px 0 0" }}>
                Market data
              </p>
            </div>
          </div>
        </section>

        {/* INTRO COPY */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.82)",
                margin: "0 0 18px",
              }}
            >
              Yacht chartering has its own vocabulary — and at the price point George Yachts brokers operate in, a single misunderstood term can cost €30,000. APA is not a deposit. Gratuity is not in the charter fee. The 12-passenger rule has no exceptions. Most first-time charter buyers learn these distinctions the hard way.
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.82)",
                margin: 0,
              }}
            >
              This glossary is built so they don't have to. Every term carries a one-line definition, a full explanation, real Greek-market numbers, examples, and the questions buyers ask next. Click any term for the full entry.
            </p>
          </div>
        </section>

        {/* TERMS BY CATEGORY */}
        <section style={{ padding: "0 24px 96px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {byCategory.map((cat) => (
              <div key={cat.slug} style={{ marginBottom: 72 }}>
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
                  Section
                </p>
                <h2
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: 300,
                    color: CREAM,
                    margin: "0 0 32px",
                    lineHeight: 1.15,
                    borderBottom: "1px solid rgba(201,168,76,0.2)",
                    paddingBottom: 16,
                  }}
                >
                  {cat.label}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 16,
                  }}
                >
                  {cat.terms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/glossary/${t.slug}`}
                      style={{
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                        border: "1px solid rgba(248, 245, 240, 0.1)",
                        padding: "22px 24px",
                        background: "rgba(248, 245, 240, 0.02)",
                        transition: "all 0.3s ease",
                      }}
                      className="g1-glossary-card"
                    >
                      <p
                        style={{
                          fontFamily: "var(--gy-font-editorial)",
                          fontSize: 19,
                          fontWeight: 400,
                          color: CREAM,
                          margin: "0 0 10px",
                          lineHeight: 1.3,
                        }}
                      >
                        {t.term}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 13,
                          color: "rgba(248, 245, 240, 0.7)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {t.shortDefinition.length > 130
                          ? t.shortDefinition.slice(0, 128) + "…"
                          : t.shortDefinition}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            padding: "84px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 18px",
                lineHeight: 1.2,
              }}
            >
              Beyond the glossary
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
              When you're ready to charter, speak with George P. Biniaris directly. MYBA-standard contracts, Greek-flagged fleet, end-to-end brokerage from preference sheet to disembarkation.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/charter-yacht-greece"
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
                See the fleet
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
                Write to George
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
