// Canonical author / E-E-A-T page for George P. Biniaris.
// Phase 7 Round 17 (2026-05-12).
//
// Why: Google's E-E-A-T (Experience, Expertise, Authoritativeness,
// Trustworthiness) framework is the deciding ranking factor for YMYL
// queries — and yacht chartering at €100k+/week is YMYL. AI engines
// (ChatGPT, Perplexity, Claude, Gemini) increasingly cite content
// with attributed authorship over anonymous content.
//
// This page is the canonical Person surface for George P. Biniaris:
// — Rich biographical narrative (800+ words)
// — Visible credentials (IYBA, Forbes feature, languages, years)
// — Full bibliography of articles/comparisons/glossary entries he
//   has authored (pulled programmatically from /lib data files)
// — Person JSON-LD with `author` array — every article points back
//   to this Person record as the byline
//
// Differs from /team/george-biniaris which exists for team browsing.
// This page is the byline source for every editorial piece on the
// site.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { ARTICLES } from "@/lib/articleSeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { GLOSSARY_TERMS } from "@/lib/glossarySeo";
import { SITE_UPDATED } from "@/lib/contentFreshness";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: "George P. Biniaris, Yacht Broker in Greece",
  description:
    "Full bio, credentials, and complete bibliography of George P. Biniaris, Founder and Managing Broker of George Yachts Brokerage House. IYBA member, Forbes-featured (May 2026), MYBA-standard practitioner.",
  alternates: {
    canonical: "https://georgeyachts.com/about/george-p-biniaris",
  },
  openGraph: {
    title: "George P. Biniaris - Founder and Managing Broker, George Yachts",
    description:
      "Bio and authored works of George P. Biniaris, Founder and Managing Broker at George Yachts. IYBA member, Forbes-featured, MYBA-standard practitioner.",
    url: "https://georgeyachts.com/about/george-p-biniaris",
    type: "profile",
    images: [
      `/api/og?title=${encodeURIComponent("George P. Biniaris")}&eyebrow=${encodeURIComponent("Founder and Managing Broker")}`,
    ],
  },
};

// ── The full bio. Written in the third person, factual, no
// invented credentials. Built from the data already present in
// /lib/teamSchema.js plus expansion of context already on the
// public site.
const BIO_PARAGRAPHS = [
  "George P. Biniaris is the Founder and Managing Broker of George Yachts Brokerage House LLC, a Greek-flagged luxury yacht charter brokerage operating from Kifisia, Athens, with U.S. registration in Wyoming. He has spent his professional career in Greek waters and is a current member of the International Yacht Brokers Association (IYBA), the worldwide standards body for yacht brokerage.",
  "His practice covers crewed motor yacht, sailing yacht, and catamaran chartering across the four principal Greek charter regions - the Cyclades (Mykonos, Santorini, Paros, Milos, Folegandros, and the lesser Cyclades), the Ionian (Corfu, Lefkada, Kefalonia, Ithaca, Paxos, Zakynthos), the Saronic Gulf (Hydra, Spetses, Poros), and the Dodecanese (Rhodes, Symi, Patmos, Kos). His client base is predominantly UHNW: international families and family offices from the United States, United Kingdom, Middle East, and Western Europe.",
  "Every charter contracted through George Yachts uses the MYBA Charter Agreement - the Mediterranean Yacht Brokers Association's standard form, in use across approximately 90% of luxury Mediterranean charters and the document recognised by London arbitration tribunals as the industry benchmark. APA (Advance Provisioning Allowance) is held in escrow under MYBA's standard custody framework. George's stated practice is to brief clients on the four cost buckets - base fee, APA, Greek VAT (13% reduced rate), and gratuity - at the first conversation, before any contract.",
  "In May 2026, George was featured in Forbes Magazine in Jacques Ledbetter's piece on UHNW asset diversification, \"How The Wealthy Are Hedging For Instability,\" in which yacht chartering was positioned alongside private equity and physical-asset hedging as a discretionary-spend category that families increasingly favour over fixed-asset purchases. The Forbes feature reflects George Yachts' positioning at the intersection of luxury brokerage and family-office advisory.",
  "George is the author of the editorial content published under his byline at georgeyachts.com - including the 2026 Greek Charter Market Report, the complete Greek yacht charter pricing guide for 2026, the destination comparison pieces benchmarking Greek charter against Croatia, the French Riviera, Italy, Turkey, and the Caribbean, and the 30-term UHNW Yacht Charter Glossary. Every editorial piece on the site carries his author byline and Person schema linking back to this canonical biography.",
  "He works in English and Greek. His office is in Kifisia, Attica, with charter operations dispatched primarily from Alimos Marina and Olympic Marine for Cyclades and Saronic-bound charters, and from Corfu for Ionian charters. He is reachable directly via the inquiry channel on georgeyachts.com, and conducts initial discovery conversations personally on every charter request.",
];

const CREDENTIALS = [
  {
    label: "Founder and Managing Broker",
    detail: "George Yachts Brokerage House LLC (Greek operations + Wyoming U.S. entity)",
  },
  {
    label: "Member",
    detail: "International Yacht Brokers Association (IYBA) - global brokerage standards body",
  },
  {
    label: "Contract framework",
    detail: "MYBA Charter Agreement standard - used on every chartered yacht",
  },
  {
    label: "Press recognition",
    detail: "Featured in Forbes (May 2026) - Jacques Ledbetter's UHNW hedging piece",
  },
  {
    label: "Languages",
    detail: "English, Greek (native)",
  },
  {
    label: "Primary regions",
    detail: "Cyclades, Ionian, Saronic Gulf, Dodecanese, Sporades",
  },
  {
    label: "Charter specialisations",
    detail: "Crewed motor yachts, sailing yachts, catamarans, gulets (all sizes 24m-95m+)",
  },
  {
    label: "Office",
    detail: "Kifisia, Athens, Greece (charter dispatch: Alimos / Olympic Marine / Corfu)",
  },
];

// Build the bibliography programmatically — every piece of editorial
// content George is the byline author for. Pulled live from the data
// files so the list stays current as new pieces ship.
function getBibliography() {
  return [
    {
      group: "Annual reports",
      items: [
        {
          title: "2026 Greek Charter Market Report",
          url: "/2026-greek-charter-market-report",
          eyebrow: "Original research",
        },
      ],
    },
    {
      group: "Pricing & decision guides",
      items: [
        {
          title: "Complete 2026 Greek Yacht Charter Pricing Guide",
          url: "/greek-yacht-charter-2026-complete-pricing-guide",
          eyebrow: "Reference",
        },
        ...DESTINATION_COMPARISONS.map((c) => ({
          title: c.h1,
          url: c.urlPath,
          eyebrow: "Comparison",
        })),
      ],
    },
    {
      group: "GEO research articles",
      items: ARTICLES.slice(0, 15).map((a) => ({
        title: a.h1,
        url: a.urlPath,
        eyebrow: a.eyebrow || "Article",
      })),
    },
    {
      group: "Yacht Charter Glossary",
      items: [
        {
          title: "Yacht Charter Glossary - 30 UHNW terms defined",
          url: "/glossary",
          eyebrow: "Reference",
        },
      ],
    },
  ];
}

function PersonJsonLd() {
  const bibliography = getBibliography();
  const authoredItems = bibliography.flatMap((g) =>
    g.items.map((i) => ({
      "@type": "CreativeWork",
      headline: i.title,
      url: `https://georgeyachts.com${i.url}`,
      author: { "@id": "https://georgeyachts.com/about/george-p-biniaris#person" },
    }))
  );

  const json = {
    "@context": "https://schema.org",
    // 2026-06-28 (GEO research Tier 3) — wrap in a @graph so the page is
    // an explicit ProfilePage whose mainEntity is the founder Person.
    // Gives AI a named profile surface (Google's ProfilePage type) on top
    // of the existing Person E-E-A-T record, linked by @id.
    "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://georgeyachts.com/about/george-p-biniaris#profilepage",
      url: "https://georgeyachts.com/about/george-p-biniaris",
      name: "George P. Biniaris - Founder and Managing Broker",
      dateModified: SITE_UPDATED,
      mainEntity: { "@id": "https://georgeyachts.com/about/george-p-biniaris#person" },
    },
    {
    "@type": "Person",
    "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
    name: "George P. Biniaris",
    givenName: "George",
    additionalName: "P.",
    familyName: "Biniaris",
    jobTitle: "Founder and Managing Broker",
    description:
      "Founder and Managing Broker of George Yachts Brokerage House LLC. IYBA member, MYBA-standard practitioner, Forbes-featured (May 2026). Specialises in crewed luxury yacht charter across Greek waters for UHNW clientele.",
    url: "https://georgeyachts.com/about/george-p-biniaris",
    image: "https://georgeyachts.com/images/george.jpg",
    nationality: { "@type": "Country", name: "Greece" },
    knowsLanguage: ["English", "Greek"],
    knowsAbout: [
      "Luxury yacht charter Greece",
      "Crewed motor yacht charter",
      "Sailing yacht charter",
      "Catamaran charter",
      "MYBA Charter Agreements",
      "APA (Advance Provisioning Allowance)",
      "Greek charter VAT (13% reduced rate)",
      "Cyclades yacht itineraries",
      "Ionian Island cruising",
      "Saronic Gulf itineraries",
      "Dodecanese yacht charter",
      "UHNW client services",
      "Yacht acquisition advisory",
      "Greek waters navigation",
      "Charter yacht management",
      "Family office yacht charter",
      "Yacht charter market analysis",
    ],
    worksFor: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kifisia",
        addressRegion: "Attica",
        postalCode: "14564",
        addressCountry: "GR",
      },
    },
    memberOf: {
      "@type": "Organization",
      name: "International Yacht Brokers Association",
      alternateName: "IYBA",
      url: "https://iyba.org",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Yacht Charter Broker",
      occupationalCategory: "41-3091.00",
    },
    workLocation: {
      "@type": "Place",
      name: "Athens, Greece",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kifisia",
        addressRegion: "Attica",
        addressCountry: "GR",
      },
    },
    subjectOf: {
      "@type": "NewsArticle",
      headline: "How The Wealthy Are Hedging For Instability",
      url: "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
      publisher: {
        "@type": "Organization",
        name: "Forbes",
        url: "https://www.forbes.com",
      },
      datePublished: "2026-05-01",
    },
    award: ["Featured in Forbes - May 2026"],
    sameAs: [
      "https://www.linkedin.com/in/george-p-biniaris/",
      // Stage 2 (Task 3 / B2) - Wikidata person entity + Forbes feature.
      // Wikidata feeds Google Knowledge Graph and is ingested by LLMs;
      // the Forbes feature is a first-class authority confirmation.
      "https://www.wikidata.org/wiki/Q140078221",
      "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
      "https://www.instagram.com/georgeyachts",
      "https://georgeyachts.com/team/george-biniaris",
    ],
    // The bibliography — every editorial piece George is the byline
    // author of. AI engines pivot from a Person record to its
    // authored works when establishing credibility for a query.
    // This is the single largest E-E-A-T signal we can ship.
    workExample: authoredItems,
    },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function GeorgeBiniarisAuthorPage() {
  const bibliography = getBibliography();
  const totalAuthored = bibliography.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      <PersonJsonLd />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com/" },
          { name: "About", url: "https://georgeyachts.com/about-us" },
          { name: "George P. Biniaris", url: "https://georgeyachts.com/about/george-p-biniaris" },
        ]}
      />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header
          style={{
            padding: "120px 24px 72px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
              gap: 48,
              alignItems: "center",
            }}
            className="g1-author-hero"
          >
            <div>
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
                Founder and Managing Broker, George Yachts
              </p>
              <h1
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(46px, 7vw, 90px)",
                  fontWeight: 300,
                  margin: "0 0 22px",
                  lineHeight: 0.98,
                  letterSpacing: "-0.02em",
                }}
              >
                George P. Biniaris
              </h1>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(248, 245, 240, 0.78)",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                "Smooth seas and sharp suits." IYBA member, MYBA-standard practitioner, featured in Forbes (May 2026).
              </p>
            </div>
            <div
              style={{
                aspectRatio: "3 / 4",
                background: `${NAVY} url(/images/george.jpg) center/cover no-repeat`,
                border: "1px solid rgba(201,168,76,0.3)",
              }}
              aria-label="Portrait of George P. Biniaris"
            />
          </div>
        </header>

        {/* QUICK STATS */}
        <section
          style={{
            background: "rgba(201,168,76,0.04)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 24,
              textAlign: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 32,
                  fontWeight: 300,
                  color: GOLD,
                  margin: 0,
                }}
              >
                IYBA
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(248, 245, 240, 0.65)",
                  margin: "6px 0 0",
                }}
              >
                Member
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 32,
                  fontWeight: 300,
                  color: GOLD,
                  margin: 0,
                }}
              >
                MYBA
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(248, 245, 240, 0.65)",
                  margin: "6px 0 0",
                }}
              >
                Contract standard
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 32,
                  fontWeight: 300,
                  color: GOLD,
                  margin: 0,
                }}
              >
                Forbes
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(248, 245, 240, 0.65)",
                  margin: "6px 0 0",
                }}
              >
                May 2026
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 32,
                  fontWeight: 300,
                  color: GOLD,
                  margin: 0,
                }}
              >
                {totalAuthored}
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(248, 245, 240, 0.65)",
                  margin: "6px 0 0",
                }}
              >
                Authored works
              </p>
            </div>
          </div>
        </section>

        {/* BIO */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 22px",
              }}
            >
              Biography
            </p>
            {BIO_PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 17,
                  lineHeight: 1.78,
                  color: "rgba(248, 245, 240, 0.85)",
                  margin: "0 0 20px",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* CREDENTIALS */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              Credentials
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 38px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 40px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              On-the-record
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {CREDENTIALS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid rgba(201,168,76,0.25)",
                    padding: "22px 24px",
                    background: "rgba(248, 245, 240, 0.02)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 9,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: GOLD,
                      fontWeight: 700,
                      margin: "0 0 10px",
                    }}
                  >
                    {c.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "rgba(248, 245, 240, 0.85)",
                      margin: 0,
                    }}
                  >
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BIBLIOGRAPHY */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              Published work
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 16px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Authored works
            </h2>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 17,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.7)",
                margin: "0 auto 48px",
                textAlign: "center",
                maxWidth: 580,
                lineHeight: 1.55,
              }}
            >
              Every editorial piece on georgeyachts.com is written by George and carries his byline. The list below is generated programmatically from the site's content index.
            </p>

            {bibliography.map((group) => (
              <div key={group.group} style={{ marginBottom: 48 }}>
                <h3
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 22,
                    fontWeight: 400,
                    color: CREAM,
                    margin: "0 0 18px",
                    borderBottom: "1px solid rgba(201,168,76,0.2)",
                    paddingBottom: 10,
                  }}
                >
                  {group.group}{" "}
                  <span
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(248, 245, 240, 0.55)",
                      fontWeight: 600,
                      marginLeft: 8,
                    }}
                  >
                    {group.items.length}
                  </span>
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {group.items.map((it) => (
                    <li
                      key={it.url}
                      style={{
                        borderBottom: "1px solid rgba(248, 245, 240, 0.06)",
                        padding: "14px 0",
                      }}
                    >
                      <Link
                        href={it.url}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 24,
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--gy-font-editorial)",
                            fontSize: 17,
                            fontWeight: 400,
                            color: CREAM,
                            lineHeight: 1.35,
                            flex: 1,
                          }}
                        >
                          {it.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 9,
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                            color: GOLD,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {it.eyebrow} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
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
              Speak with George
            </p>
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
              First conversation, personally
            </h2>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.65,
                color: "rgba(248, 245, 240, 0.78)",
                margin: "0 0 30px",
              }}
            >
              Every charter request starts with a direct conversation with George - no intermediaries, no junior staff handoff. Inquiries are answered within 24 hours.
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
                href="/charter-yacht-greece"
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
                See the fleet
              </Link>
            </div>
          </div>
        </section>
      </article>

      <style>{`
        @media (max-width: 800px) {
          .g1-author-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
