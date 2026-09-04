import { FLEET_COUNT } from "@/lib/fleetCount";
import { WHATSAPP_DOWN, WHATSAPP_NUMBER } from "@/lib/whatsappStatus";
// Greek Charter Index 2026 - Stage 2 (Task 6 / Research A1).
//
// The highest-leverage GEO asset: an original-data page (rates by yacht
// type/region, booking lead time, most-requested islands, fuel/APA, TEPAI)
// with a summary TABLE in the first 30%, quotable stat callouts, Dataset +
// FAQPage JSON-LD, and dateModified. Princeton/GT KDD 2024: statistics
// +41% AI-citation visibility; original data is what third parties cite.
//
// Data source: lib/charterIndex2026.js - George Yachts' own compiled market
// data (no external sources or competitors named, Boss directive 2026-06-09).
// A published Sanity `dataReport` doc (slug greek-charter-index-2026) OVERRIDES
// the JS default when present, so quarterly refreshes can move to the Studio
// with no code change. The page is always indexed (it always has real data).

import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LastUpdated from "@/app/components/seo/LastUpdated";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";
import RelatedPages from "@/app/components/seo/RelatedPages";
import Footer from "@/app/components/Footer";

export const revalidate = 3600;

const SLUG = "greek-charter-index-2026";
const URL = `https://georgeyachts.com/${SLUG}`;

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const GROQ = `*[_type == "dataReport" && slug.current == $slug][0]{
  title, "slug": slug.current, edition, publishedAt, dataModified, intro,
  summaryTable, statCallouts, sections, methodology, faqItems
}`;

async function getReport() {
  try {
    return await sanityClient.fetch(GROQ, { slug: SLUG });
  } catch {
    return null;
  }
}

// Default data is CHARTER_INDEX_2026 (imported above); a published Sanity
// dataReport doc overrides it.

export async function generateMetadata() {
  const report = (await getReport()) || CHARTER_INDEX_2026;
  return {
    // 2026-06-25: `absolute` — report.title already leads with the brand
    // ("George Yachts Greek Charter Index 2026"), so the descriptor tail +
    // the site-wide template suffix pushed this to 78 chars with brand twice.
    // 2026-08-06 — the SERP title is no longer the report's own title.
    // "George Yachts Greek Charter Index 2026" sat at position 6.0 on 755
    // impressions and earned a 0.13% click-through: it opens with our name,
    // which means nothing to someone who has not heard of us, and closes
    // with a year that has just ended. The page keeps its own heading; only
    // the line Google shows now leads with what the reader came for.
    title: { absolute: "Greek Charter Index: What a Week Actually Costs, by Yacht" },
    description:
      `Original rate data across the ${FLEET_COUNT} yachts I know first hand: what a week costs by type and size, from EUR 10,900 up, and when the 2027 rate cards open.`,
    alternates: { canonical: URL },
    openGraph: {
      title: report.title,
      description: (report.intro || "").slice(0, 158),
      url: URL,
      type: "article",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
      siteName: "George Yachts Brokerage House",
      locale: "en_US",
    },
  };
}

function DataTable({ table }) {
  if (!table || !Array.isArray(table.columns) || !table.columns.length) return null;
  return (
    <div style={{ overflowX: "auto", margin: "0 0 12px" }}>
      {table.caption && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 12,
            letterSpacing: "0.04em",
            color: "rgba(248,245,240,0.66)",
            margin: "0 0 12px",
          }}
        >
          {table.caption}
        </p>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--gy-font-ui)", fontSize: 14 }}>
        <thead>
          <tr>
            {table.columns.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${GOLD}`,
                  color: GOLD,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table.rows || []).map((row, ri) => (
            <tr key={ri}>
              {(row.cells || []).map((cell, ci) => (
                <td
                  key={ci}
                  // gy-tnum (2026-07-02, ASK B section 4.2): tabular
                  // lining figures so the rate columns align like a
                  // bank statement - this IS the citable data table.
                  className={ci === 0 ? undefined : "gy-tnum"}
                  style={{
                    textAlign: ci === 0 ? "left" : "right",
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(248,245,240,0.1)",
                    color: ci === 0 ? CREAM : "rgba(248,245,240,0.85)",
                    fontWeight: ci === 0 ? 500 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function GreekCharterIndexPage() {
  // Sanity dataReport doc overrides the JS default when published. Either way
  // there is always real data, so the page is never a draft (always indexed,
  // always emits Dataset + FAQPage). isDraft retained as false so the existing
  // schema/banner gates below resolve correctly.
  const report = (await getReport()) || CHARTER_INDEX_2026;
  const isDraft = false;
  const updated = report.dataModified || report.publishedAt || null;

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
    { name: report.title, url: URL },
  ];

  // Dataset + FAQPage JSON-LD only emit for a REAL published report, so no
  // placeholder/fabricated figures are ever described to crawlers.
  const datasetSchema = !isDraft
    ? {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "@id": `${URL}#dataset`,
        name: report.title,
        description:
          report.intro ||
          `Original George Yachts data on Greek crewed yacht charter rates and trends, ${report.edition || "2026"}.`,
        url: URL,
        ...(updated ? { dateModified: updated } : {}),
        ...(report.publishedAt ? { datePublished: report.publishedAt } : {}),
        isAccessibleForFree: true,
        creator: {
          "@type": "Organization",
          "@id": "https://georgeyachts.com/#organization",
          name: "George Yachts Brokerage House",
          url: "https://georgeyachts.com",
        },
        publisher: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
        ...(Array.isArray(report.statCallouts) && report.statCallouts.length
          ? { variableMeasured: report.statCallouts.map((s) => s.label).filter(Boolean) }
          : {}),
        ...(report.methodology ? { measurementTechnique: report.methodology } : {}),
        spatialCoverage: { "@type": "Place", name: "Greece (Cyclades, Ionian, Saronic, Dodecanese)" },
        // 2026-09-04 (plan item 8): the data as files, so the Dataset is a
        // dataset and not a description of one. Google Dataset Search and
        // the AI crawlers read `distribution`; journalists read the CSV.
        license: "https://creativecommons.org/licenses/by/4.0/",
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "text/csv",
            contentUrl: `${URL}/data.csv`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${URL}/data.json`,
          },
        ],
      }
    : null;

  const faqSchema =
    !isDraft && Array.isArray(report.faqItems) && report.faqItems.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          ...(updated ? { dateModified: updated } : {}),
          speakable: { "@type": "SpeakableSpecification", cssSelector: [".gy-qa-text"] },
          mainEntity: report.faqItems.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      {datasetSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        {/* 2026-08-15. The eyebrow sat at y196 and the fixed masthead's
            wordmark ends at y232, so "Original market data · 2026-2027" was
            printing underneath the logo. Same bug the crewed hub had: a
            `padding` shorthand inline beats .gy-hero-lead, so the other three
            sides are longhand and the top comes from the stylesheet. */}
        <header
          className="gy-hero-lead"
          style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 48, borderBottom: "1px solid rgba(218, 161, 16,0.15)", textAlign: "center" }}
        >
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              Original market data {report.edition ? `· ${report.edition}` : ""}
            </p>
            <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(40px, 6vw, 84px)", fontWeight: 300, margin: "0 0 18px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {report.title}
            </h1>
            {updated && <LastUpdated date={updated} />}
          </div>
        </header>

        {isDraft && (
          <div style={{ background: "rgba(218, 161, 16,0.1)", borderBottom: `1px solid ${GOLD}`, padding: "14px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: CREAM, margin: 0 }}>
              Draft preview. Figures populate from the Data Report (Charter Index) document in Sanity. This page is noindex until published.
            </p>
          </div>
        )}

        {/* INTRO + SUMMARY TABLE - first 30% (AI-extraction zone) */}
        <section style={{ padding: "48px 24px 24px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            {report.intro && (
              <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(17px, 2.1vw, 21px)", fontWeight: 300, lineHeight: 1.55, color: "rgba(248,245,240,0.9)", margin: "0 0 36px", maxWidth: 760 }}>
              {report.intro}
            </p>
            )}
            {report.summaryTable && <DataTable table={report.summaryTable} />}
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: "rgba(248,245,240,0.66)", margin: "8px 0 0", lineHeight: 1.6 }}>
              The data as files, free to cite with a link back:{" "}
              <a href={`/${SLUG}/data.csv`} style={{ color: GOLD }}>CSV</a>
              {" · "}
              <a href={`/${SLUG}/data.json`} style={{ color: GOLD }}>JSON</a>
              {" · "}
              <Link href="/tools/charter-cost-calculator" style={{ color: GOLD }}>run the numbers in the cost calculator</Link>
            </p>
          </div>
        </section>

        {/* STAT CALLOUTS */}
        {Array.isArray(report.statCallouts) && report.statCallouts.length > 0 && (
          <section style={{ padding: "24px 24px 48px" }}>
            <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {report.statCallouts.map((s, i) => (
                <div key={i} style={{ borderLeft: `2px solid ${GOLD}`, padding: "8px 0 8px 20px" }}>
                  <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 34, fontWeight: 300, color: GOLD, margin: "0 0 8px", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, lineHeight: 1.45, color: "rgba(248,245,240,0.82)", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DATA SECTIONS */}
        {Array.isArray(report.sections) && report.sections.length > 0 && (
          <section style={{ padding: "16px 24px 48px", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>
              {report.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 40 }}>
                  {sec.heading && <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: CREAM, margin: "0 0 14px" }}>{sec.heading}</h2>}
                  {sec.body && <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.7, color: "rgba(248,245,240,0.88)", margin: "0 0 14px", maxWidth: 760 }}>{sec.body}</p>}
                  {sec.table && <DataTable table={sec.table} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* METHODOLOGY */}
        {report.methodology && (
          <section style={{ padding: "32px 24px", background: "rgba(218, 161, 16,0.03)", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Methodology</p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: 0 }}>{report.methodology}</p>
            </div>
          </section>
        )}

        {/* RELATED - 2026-06-29. Close the internal-link loop: the index was a
            dead end (0 outbound links to the money pages). These feed crawl
            depth + topical clustering across the motor-charter cluster. */}
        <section style={{ padding: "40px 24px", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 16px" }}>Go deeper</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/weekly-yacht-charter-rates-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.25)", paddingBottom: 10 }}>Weekly charter rates, all-in: base, APA, VAT and gratuity by yacht size and season</Link>
              <Link href="/motor-yacht-charter-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.25)", paddingBottom: 10 }}>Motor yacht charter in Greece: the full 2027 guide</Link>
              <Link href="/charter-cost-estimator" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.25)", paddingBottom: 10 }}>Charter cost estimator</Link>
              <Link href="/glossary/greek-vat" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.25)", paddingBottom: 10 }}>Greek charter VAT, explained: 5.2 to 12% by certification</Link>
            </div>
          </div>
        </section>

        {/* CITE THIS - 2026-06-28. Original data is what third parties + AI
            engines cite, but only if attribution is trivial. A ready-made
            citation line turns the index into a citation magnet. */}
        <section style={{ padding: "32px 24px", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Cite this index</p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: 0 }}>
              George Yachts Brokerage House. (2026). <em>Greek Charter Index 2026-2027: weekly crewed charter rates by yacht type and size</em> (Autumn 2026 ed.). https://georgeyachts.com/greek-charter-index-2026
            </p>
          </div>
        </section>

        {/* FAQ */}
        {Array.isArray(report.faqItems) && report.faqItems.length > 0 && (
          <section style={{ padding: "56px 24px", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 28px" }}>Frequently asked questions</h2>
              {report.faqItems.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(248,245,240,0.1)", padding: "18px 0" }}>
                  <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, color: CREAM, margin: "0 0 8px" }}>{f.question}</p>
                  <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.65, color: "rgba(248,245,240,0.85)", margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ padding: "64px 24px", textAlign: "center", borderTop: "1px solid rgba(218, 161, 16,0.15)" }}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
              Brief George directly
            </Link>
            <a href={WHATSAPP_DOWN ? "/#contact" : `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=Hi%20George%2C%20I%20read%20the%20Greek%20Charter%20Index%202026%20and%20would%20like%20current%20rates%20for%20my%20dates.`} target={WHATSAPP_DOWN ? undefined : "_blank"} rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none" }}>
              {WHATSAPP_DOWN ? "Message George Directly" : "Message on WhatsApp"}
            </a>
          </div>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: "rgba(248,245,240,0.5)", margin: "22px 0 0" }}>
            A personal reply from George, usually within a few hours.
          </p>
        </section>
        {/* 2026-08-06 (job 18), the cost cluster is the biggest commercial
            demand on this site and every query in it was being answered by
            three to five of our own pages at once. This page linked to exactly
            one of its six siblings because the COHORTS mechanism only ever
            rendered inside SeoLanding. */}
        <RelatedPages path="/greek-charter-index-2026" />
      </article>
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
