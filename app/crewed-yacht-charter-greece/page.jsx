// /crewed-yacht-charter-greece — the exact-match head page for
// "crewed yacht charter greece" (ASK A Move 3a, 2026-07-02).
//
// Before this page existed the site sat at position 69 on the term
// with no URL targeting it in H1/title. Guide-plus-fleet format:
// editorial depth + the live Private Fleet (full crew), real Charter
// Index 2026 numbers, the 13% VAT wedge, per-person math, and the
// "weekly charter, Saturday to Saturday" intent as a section (GSC
// shows ~1 impression for that exact phrase, so it is a section
// here, never its own URL).
//
// GEO formatting rules applied (MEMO-1-geo-citations.md): visible
// HTML tables (not only JSON-LD), self-contained 120-180 word
// sections under descriptive headings, quotable first-person George
// lines, dated cost section. Every figure comes from
// lib/charterIndex2026.js, lib/fleetCount.js, lib/reviewsData.js or
// Sanity - nothing invented.

import React from "react";
import Link from "next/link";
import { FLEET_COUNT } from "@/lib/fleetCount";
import { sanityClient } from "@/lib/sanity";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";
import { REVIEWS, initials } from "@/lib/reviewsData";
import { extractPriceRange } from "@/lib/pricing";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import BrowseSeoCategories from "@/app/components/seo/BrowseSeoCategories";
import BriefGeorgeBanner from "@/app/components/BriefGeorgeBanner";
import ViewTransitionLink from "@/app/components/ViewTransitionLink";
import FirstAccessBand from "@/app/components/FirstAccessBand";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import LastUpdated from "@/app/components/seo/LastUpdated";
import { LAST_REFRESH } from "@/lib/contentFreshness";

export const revalidate = 3600;

const CANONICAL = "https://georgeyachts.com/crewed-yacht-charter-greece";

export const metadata = {
  title: `Crewed Yacht Charter Greece - 2026 Rates & Curated Fleet`,
  description:
    `Crewed yacht charter in Greece with a full professional crew: 2026 weekly rates by yacht type and region, the 13% VAT rule, per-person math, and George's curated Private Fleet. IYBA member, MYBA contracts.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Crewed Yacht Charter Greece | George Yachts",
    description:
      "Full-crew yacht charter in Greek waters: 2026 rates, the 13% VAT rule, and the curated Private Fleet. Personal broker service by George P. Biniaris.",
    url: CANONICAL,
    images: [
      `/api/og?title=${encodeURIComponent("Crewed Yacht Charter Greece")}&eyebrow=${encodeURIComponent("Full Crew · 2026")}`,
    ],
  },
};

// Private Fleet = the crewed side of the brokerage (full crew).
const CREWED_FLEET_QUERY = `*[_type == "yacht" && fleetTier in ["private", "both"]] | order(weeklyRatePrice desc) {
  _id,
  "slug": slug.current,
  name,
  length,
  sleeps,
  cabins,
  crew,
  weeklyRatePrice,
  cruisingRegion,
  "imageUrl": images[0].asset->url
}`;

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

// The FAQ copy lives in one place so the visible HTML and the
// FAQPage JSON-LD can never drift apart.
const FAQS = [
  {
    q: "How much does a crewed yacht charter in Greece cost in 2026?",
    a: "Per the George Yachts Greek Charter Index 2026: a crewed sailing catamaran for up to 12 guests runs roughly EUR 15,000 to 40,000 per week net base in peak season; crewed motor yachts of 24 to 34m around EUR 30,000 to 100,000; 35 to 49m about EUR 100,000 to 350,000; and 50m-plus superyachts from EUR 250,000 to over one million. Add 13% VAT for the standard weekly crewed charter and an APA of 25 to 40% for fuel, food and berthing.",
  },
  {
    q: "What is included in the base charter rate?",
    a: "The yacht and her full professional crew. Running costs of your week (fuel, provisioning, berthing fees) are paid from the APA, the Advance Provisioning Allowance, typically 25 to 40% of the base rate, settled transparently at the end of the charter. VAT is charged on top of the base rate.",
  },
  {
    q: "What VAT applies to a crewed charter in Greece in 2026?",
    a: "13% for the standard commercial crewed charter longer than 48 hours, which is exactly what a weekly charter is. Short, static or bareboat arrangements are taxed at 24%. Older rates you may still find online (12% or 6.5%) are obsolete.",
  },
  {
    q: "How far ahead should I book?",
    a: "Typical booking lead time for peak July to August weeks is 6 to 12 months, and premium 40m-plus yachts often commit a year or more ahead. If your dates are fixed to school-holiday August, treat any available premium yacht as a same-week decision.",
  },
  {
    q: "What does 'Saturday to Saturday' mean?",
    a: "The Greek weekly charter convention: you embark on Saturday, cruise for seven nights, and disembark the following Saturday morning. It is the rhythm the fleet, the marinas and the crews are built around, and because the charter runs well beyond 48 hours it qualifies for the 13% VAT rate rather than 24%.",
  },
  {
    q: "What is the difference between crewed, skippered and bareboat?",
    a: "A crewed yacht comes with a full professional crew: captain, chef and service, the floating-villa experience. A skippered yacht comes with a captain only, you live aboard more simply. Bareboat means you sail her yourself with your own license. George's Private Fleet is fully crewed; the Explorer Fleet is skippered.",
  },
  {
    q: "Can we charter with more than 12 guests?",
    a: "Greek commercial regulations cap most charter yachts at 12 guests under way. Larger groups are handled legally with the right vessel class or a multi-yacht arrangement. George has written a complete guide on how groups of 14 and more do it.",
  },
  {
    q: "Where do crewed charters start?",
    a: "Most of the crewed fleet is based around Athens, which is why the Saronic Gulf and the Ionian are the best-value starting waters: little or no repositioning cost. Embarkation from other islands is arranged with a repositioning fee that George quotes up front.",
  },
];

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function serviceSchema(yachts) {
  const ranges = yachts
    .map((y) => extractPriceRange(y.weeklyRatePrice))
    .filter((r) => r.low);
  const low = ranges.length ? Math.min(...ranges.map((r) => r.low)) : 13000;
  const high = ranges.length ? Math.max(...ranges.map((r) => r.high)) : 350000;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Crewed Yacht Charter Greece",
    serviceType: "Crewed Yacht Charter",
    description:
      "Fully crewed luxury yacht charter in Greek waters - captain, chef and service crew. Weekly Saturday-to-Saturday charters across the Cyclades, Ionian, Saronic Gulf, Sporades and Dodecanese, brokered personally by George P. Biniaris (IYBA member, MYBA-standard contracts).",
    provider: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Cyclades, Greece" },
      { "@type": "AdministrativeArea", name: "Ionian Islands, Greece" },
      { "@type": "AdministrativeArea", name: "Saronic Gulf, Greece" },
      { "@type": "AdministrativeArea", name: "Sporades, Greece" },
      { "@type": "AdministrativeArea", name: "Dodecanese, Greece" },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: low,
      highPrice: high,
      offerCount: yachts.length || FLEET_COUNT,
      availability: "https://schema.org/InStock",
    },
    url: CANONICAL,
  };
}

function fleetListSchema(yachts) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "George Yachts Private Fleet - crewed yachts in Greece",
    numberOfItems: yachts.length,
    itemListElement: yachts.slice(0, 12).map((y, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: y.name || y.slug,
        url: `https://georgeyachts.com/yachts/${y.slug}`,
        image: y.imageUrl,
        category: "Crewed Yacht Charter",
        brand: { "@type": "Brand", name: "George Yachts" },
      },
    })),
  };
}

const eyebrowStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  margin: "0 0 14px",
};

const h2Style = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: "clamp(26px, 3.5vw, 40px)",
  fontWeight: 300,
  color: CREAM,
  margin: "0 0 18px",
  lineHeight: 1.15,
};

const bodyStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(248, 245, 240, 0.85)",
  margin: "0 0 16px",
};

const thStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: `1px solid rgba(201,168,76,0.35)`,
  whiteSpace: "nowrap",
};

const tdStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 13.5,
  color: "rgba(248, 245, 240, 0.85)",
  padding: "11px 14px",
  borderBottom: "1px solid rgba(248,245,240,0.08)",
  verticalAlign: "top",
};

const goldLink = {
  color: GOLD,
  textDecoration: "none",
  borderBottom: `1px solid rgba(201,168,76,0.5)`,
};

export default async function CrewedCharterPage() {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(CREWED_FLEET_QUERY);
  } catch (error) {
    console.error("Failed to fetch crewed fleet:", error);
  }

  const featured = yachts.filter((y) => y.imageUrl).slice(0, 9);
  const crewedReviews = REVIEWS.slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: NAVY, color: CREAM, fontFamily: "var(--gy-font-ui)" }}>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Crewed Yacht Charter Greece", url: CANONICAL },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(yachts)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleetListSchema(yachts)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />

      {/* HERO - text-first editorial (fast LCP, no video on this page) */}
      <header style={{ padding: "140px 24px 64px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrowStyle}>Full Crew · Exclusively Greek Waters</p>
          <h1
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(40px, 6.5vw, 82px)",
              fontWeight: 300,
              margin: "0 0 22px",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            Crewed Yacht Charter in Greece
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
            }}
          >
            A yacht with her own captain, chef and crew, a week that moves with
            the light, and one broker who answers personally. This is the
            charter Greece does best, and the one George does exclusively.
          </p>
          <LastUpdated date={LAST_REFRESH.STATIC} />
        </div>
      </header>

      {/* QUICK ANSWER - the extractable cost answer */}
      <section style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <QuickAnswerBlock
            question="What is a crewed yacht charter in Greece, and what does it cost in 2026?"
            answer={`A crewed yacht charter means the yacht comes with a full professional crew: captain, chef and service. Per the George Yachts Greek Charter Index 2026, weekly net base rates run roughly EUR 15,000-40,000 for a crewed sailing catamaran (up to 12 guests), EUR 30,000-100,000 for 24-34m motor yachts, EUR 100,000-350,000 for 35-49m, and EUR 250,000 to over one million for 50m-plus superyachts. Add 13% VAT (the weekly crewed rate) and 25-40% APA. George Yachts curates ${FLEET_COUNT} yachts in Greek waters, split between the fully crewed Private Fleet and the skippered Explorer Fleet.`}
          />
        </div>
      </section>

      {/* WHAT IT IS - self-contained GEO section */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The Crewed Charter</p>
          <h2 style={h2Style}>The house that sails with you</h2>
          <p style={bodyStyle}>
            On a crewed charter the yacht arrives with her own people: a captain
            who has anchored in these bays his whole life, a chef provisioning
            from island markets, and a crew whose only brief is your week. You
            are a guest, never an operator. Within George&apos;s{" "}
            <Link href="/private-fleet" style={goldLink}>Private Fleet</Link>{" "}
            every yacht is fully crewed; the{" "}
            <Link href="/explorer-fleet" style={goldLink}>Explorer Fleet</Link>{" "}
            offers the lighter, skippered alternative.
          </p>
          <p style={bodyStyle}>
            George Yachts Brokerage House is a boutique brokerage working
            exclusively in Greek waters: an{" "}
            <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={goldLink}>IYBA member</a>,
            MYBA-standard contracts, featured in Forbes in May 2026. One broker,
            not a call centre: you speak with{" "}
            <Link href="/about-us" style={goldLink}>George P. Biniaris</Link>{" "}
            from the first message to the last morning of the charter.
          </p>
          <blockquote
            style={{
              margin: "32px 0 0",
              padding: "0 0 0 22px",
              borderLeft: `1px solid ${GOLD}`,
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 19,
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "rgba(248, 245, 240, 0.92)",
            }}
          >
            &ldquo;A crewed week in Greece is the only holiday I know where the
            house moves and the world stands still. My work is simple: match
            you to the one yacht, out of {FLEET_COUNT}, that will feel like
            yours by the second morning.&rdquo;
            <footer
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: GOLD,
                marginTop: 14,
                fontStyle: "normal",
              }}
            >
              George P. Biniaris, Founder and Managing Broker
            </footer>
          </blockquote>
        </div>
      </section>

      {/* COST 2026 - dated section, visible table from the Index */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Rates · {CHARTER_INDEX_2026.edition}</p>
          <h2 style={{ ...h2Style, textAlign: "center" }}>
            What a crewed week costs in 2026
          </h2>
          <p style={{ ...bodyStyle, maxWidth: 720, margin: "0 auto 36px", textAlign: "center" }}>
            The figures below are George&apos;s own compiled market data, the{" "}
            <Link href="/greek-charter-index-2026" style={goldLink}>
              Greek Charter Index 2026
            </Link>
            . All prices are net base charter fee per week in EUR, excluding
            VAT and APA. &ldquo;(est.)&rdquo; marks extrapolated figures.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <caption style={{ captionSide: "bottom", fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "rgba(248,245,240,0.5)", padding: "12px 0 0", textAlign: "left" }}>
                {CHARTER_INDEX_2026.summaryTable.caption}
              </caption>
              <thead>
                <tr>
                  {CHARTER_INDEX_2026.summaryTable.columns.map((c) => (
                    <th key={c} style={thStyle}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHARTER_INDEX_2026.summaryTable.rows.map((row, i) => (
                  <tr key={i}>
                    {row.cells.map((cell, j) => (
                      <td key={j} className="gy-tnum" style={{ ...tdStyle, whiteSpace: j === 0 ? "normal" : "nowrap" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...bodyStyle, maxWidth: 720, margin: "32px auto 0" }}>
            On top of the base rate come two things, both transparent:{" "}
            <strong style={{ color: CREAM, fontWeight: 600 }}>13% VAT</strong>{" "}
            for the standard weekly crewed charter (
            <Link href="/greek-yacht-charter-vat-explained-2026" style={goldLink}>
              the 2026 VAT rules explained
            </Link>
            , short or bareboat arrangements are 24%), and the{" "}
            <Link href="/advance-provisioning-allowance-apa-greek-yacht-charter-explained" style={goldLink}>
              APA
            </Link>{" "}
            of 25 to 40% covering fuel, provisioning and berthing.{" "}
            <Link href="/whats-included-in-greek-yacht-charter-complete-2026-guide" style={goldLink}>
              What is included, in full
            </Link>
            .
          </p>
          <p style={{ ...bodyStyle, maxWidth: 720, margin: "16px auto 0" }}>
            The per-person arithmetic is friendlier than the headline numbers
            suggest. A crewed sailing catamaran for up to 12 guests at EUR
            20,000 to 40,000 in Cyclades peak season works out to roughly EUR
            1,700 to 3,300 per person for the week, before VAT and APA. In the
            Ionian, at EUR 15,000 to 30,000 for the same 12 guests, roughly
            EUR 1,250 to 2,500. For motor yachts and superyachts the math
            depends on the vessel; George quotes it per person, in writing,
            before you commit.
          </p>
        </div>
      </section>

      {/* THE WEEKLY CHARTER - owns the "weekly charter greece" intent */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The Weekly Charter</p>
          <h2 style={h2Style}>Saturday to Saturday, the Greek rhythm</h2>
          <p style={bodyStyle}>
            The weekly charter is the natural unit of Greek yachting: embark
            Saturday, seven nights under way, disembark the following Saturday
            morning. The fleet, the marinas and the crews are all built around
            this rhythm, which is why a well-planned week feels effortless. It
            also matters fiscally: a commercial crewed charter longer than 48
            hours, which every weekly charter is, carries the 13% VAT rate
            rather than the 24% applied to short, static or bareboat
            arrangements.
          </p>
          <p style={bodyStyle}>
            Peak July and August weeks book 6 to 12 months ahead, and the
            premium 40m-plus yachts often commit a year or more out. Mykonos
            and Santorini lead 2026 demand, with Milos the fastest-rising
            island. If your dates are fixed, the honest advice is to decide
            early; if your dates are flexible, June and September buy calmer
            winds and better value for the same yacht.
          </p>
        </div>
      </section>

      {/* REGIONS */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Where</p>
          <h2 style={{ ...h2Style, textAlign: "center" }}>Three Greek worlds, one fleet</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(201,168,76,0.15)", marginTop: 36 }}>
            {[
              {
                name: "Cyclades",
                href: "/destinations/cyclades",
                text: "The marquee names: Mykonos, Santorini, Paros, Milos. Demand and the summer Meltemi favour larger, faster yachts, which is why the Cyclades sit at the top of every rate band.",
              },
              {
                name: "Ionian",
                href: "/destinations/ionian",
                text: "Green islands, calm seas, and the best value in Greek chartering: little or no repositioning cost from the fleet's Athens base, and ideal catamaran waters.",
              },
              {
                name: "Saronic",
                href: "/destinations/saronic",
                text: "Hydra, Spetses, Poros, an hour or two from Athens. The connoisseur's short-transfer charter, and the easiest embarkation logistics in the country.",
              },
            ].map((r) => (
              <Link
                key={r.name}
                href={r.href}
                style={{ background: NAVY, padding: "32px 28px", textDecoration: "none", display: "block" }}
              >
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 24, fontWeight: 300, color: CREAM, margin: "0 0 10px" }}>{r.name}</p>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.65, color: "rgba(248,245,240,0.72)", margin: "0 0 14px" }}>{r.text}</p>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD }}>
                  The {r.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PRIVATE FLEET STRIP - server-rendered links */}
      {featured.length >= 4 && (
        <section style={{ padding: "72px 24px" }} aria-label="The crewed Private Fleet">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ ...eyebrowStyle, textAlign: "center" }}>The Private Fleet</p>
            <h2 style={{ ...h2Style, textAlign: "center" }}>
              {yachts.length} crewed yachts, curated one by one
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 14,
                marginTop: 36,
              }}
            >
              {featured.map((y) => (
                <ViewTransitionLink
                  key={y.slug}
                  href={`/yachts/${y.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    background: "rgba(248,245,240,0.02)",
                    border: "1px solid rgba(248,245,240,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      background: y.imageUrl ? `${NAVY} url(${y.imageUrl}?w=520&auto=format) center/cover no-repeat` : NAVY,
                      viewTransitionName: `yacht-cover-${y.slug}`,
                    }}
                    aria-hidden={!y.imageUrl}
                  />
                  <div style={{ padding: "14px 16px 18px" }}>
                    <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, color: CREAM, margin: "0 0 6px", lineHeight: 1.2 }}>
                      {y.name}
                    </p>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11.5, letterSpacing: "0.06em", color: "rgba(248,245,240,0.6)", margin: 0 }}>
                      {[y.length, y.sleeps && `${y.sleeps} guests`, y.crew && `${y.crew} crew`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </ViewTransitionLink>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 36, display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/private-fleet" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, color: GOLD, textDecoration: "none", paddingBottom: 4, borderBottom: `1px solid ${GOLD}` }}>
                The Full Private Fleet →
              </Link>
              <Link href="/charter-yacht-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, color: "rgba(248,245,240,0.75)", textDecoration: "none", paddingBottom: 4, borderBottom: "1px solid rgba(248,245,240,0.3)" }}>
                Every Yacht We Charter →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CREWED VS THE ALTERNATIVES */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrowStyle}>Choosing Well</p>
          <h2 style={h2Style}>Crewed, skippered, or bareboat</h2>
          <p style={bodyStyle}>
            Crewed means captain, chef and service crew, the yacht as a
            floating villa. Skippered means a captain only, the{" "}
            <Link href="/explorer-fleet" style={goldLink}>Explorer Fleet</Link>{" "}
            way, lighter and closer to the water. Bareboat means you hold the
            license and sail her yourself, which George does not broker. If
            you are weighing the first two honestly, read{" "}
            <Link href="/crewed-vs-bareboat-yacht-charter-greece" style={goldLink}>
              the crewed vs bareboat guide
            </Link>{" "}
            or take five minutes with the{" "}
            <Link href="/yacht-finder" style={goldLink}>Smart Match Quiz</Link>.
            Groups larger than twelve have{" "}
            <Link href="/blog/12-passenger-rule-greek-yacht-charter-groups-of-14" style={goldLink}>
              their own playbook
            </Link>
            .
          </p>
        </div>
      </section>

      {/* REVIEWS - real, dated, initials only */}
      {crewedReviews.length > 0 && (
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ ...eyebrowStyle, textAlign: "center" }}>From the Guest Book</p>
            <h2 style={{ ...h2Style, textAlign: "center" }}>Weeks that were kept</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 36 }}>
              {crewedReviews.map((r) => (
                <figure key={r.id} style={{ margin: 0, border: "1px solid rgba(201,168,76,0.2)", padding: "28px 30px", background: "rgba(248,245,240,0.02)" }}>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.28em", color: GOLD, margin: "0 0 14px" }} aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                  </p>
                  <blockquote style={{ margin: 0, fontFamily: "var(--gy-font-editorial)", fontSize: 15.5, fontStyle: "italic", lineHeight: 1.65, color: "rgba(248,245,240,0.88)" }}>
                    &ldquo;{r.body.length > 300 ? r.body.slice(0, r.body.lastIndexOf(" ", 300)) + " ..." : r.body}&rdquo;
                  </blockquote>
                  <figcaption style={{ marginTop: 16, fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,245,240,0.6)" }}>
                    {initials(r.author)} · {new Date(r.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    {r.verified ? " · Verified charter" : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/reviews" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, color: GOLD, textDecoration: "none", paddingBottom: 4, borderBottom: `1px solid ${GOLD}` }}>
                All Charter Reviews →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* FAQ - visible HTML matching the FAQPage schema */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Questions, Answered Straight</p>
          <h2 style={{ ...h2Style, textAlign: "center" }}>Crewed charter FAQ, 2026</h2>
          <div style={{ marginTop: 36 }}>
            {FAQS.map((f) => (
              <details
                key={f.q}
                style={{
                  borderBottom: "1px solid rgba(248,245,240,0.1)",
                  padding: "18px 4px",
                }}
              >
                <summary
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 18,
                    fontWeight: 400,
                    color: CREAM,
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                >
                  {f.q}
                </summary>
                <p style={{ ...bodyStyle, margin: "14px 0 4px", fontSize: 15 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL CROSS-LINKS */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Go Deeper</p>
          <h2 style={{ ...h2Style, textAlign: "center", fontSize: "clamp(24px, 3vw, 34px)" }}>From The Journal</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "rgba(201,168,76,0.06)", marginTop: 32 }}>
            {[
              { title: "The First-Timer's Complete Guide to Crewed Yacht Charter in Greece", href: "/blog/the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece" },
              { title: "Greek Yacht Charter 2026: The Complete Pricing Guide", href: "/greek-yacht-charter-2026-complete-pricing-guide" },
              { title: "How to Choose a Yacht Charter Broker in Greece", href: "/blog/how-to-choose-yacht-charter-broker-greece-2026" },
            ].map((p) => (
              <Link key={p.href} href={p.href} style={{ background: NAVY, padding: "28px 24px", textDecoration: "none", display: "block" }}>
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, fontWeight: 400, color: CREAM, lineHeight: 1.4, margin: "0 0 12px" }}>{p.title}</p>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BriefGeorgeBanner />
      <FirstAccessBand />
      <BrowseSeoCategories />

      {/* TRUST STRIP */}
      <section style={{ padding: "56px 24px 84px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
        <p style={{ ...eyebrowStyle, marginBottom: 18 }}>Trusted Brokerage</p>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.14em", color: "rgba(248,245,240,0.7)", margin: "0 0 30px" }}>
          IYBA Member · MYBA-Standard Contracts · Featured in Forbes, May 2026 · Greek Waters Exclusively
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
            padding: "16px 32px",
            background: GOLD,
            color: NAVY,
            textDecoration: "none",
          }}
        >
          Write to George
        </Link>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.55)", marginTop: 18 }}>
          George replies personally within 24 hours.
        </p>
      </section>

      <Footer />
    </div>
  );
}
