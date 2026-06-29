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

export const revalidate = 3600;

const SLUG = "greek-charter-index-2026";
const URL = `https://georgeyachts.com/${SLUG}`;

const GOLD = "#C9A84C";
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
    title: { absolute: report.title },
    description:
      (report.intro || "Original George Yachts data on Greek crewed yacht charter rates and trends.").slice(0, 158),
    alternates: { canonical: URL },
    openGraph: {
      title: report.title,
      description: (report.intro || "").slice(0, 158),
      url: URL,
      type: "article",
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
            color: "rgba(248,245,240,0.6)",
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
        <header style={{ padding: "160px 24px 48px", borderBottom: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
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
          <div style={{ background: "rgba(201,168,76,0.1)", borderBottom: `1px solid ${GOLD}`, padding: "14px 24px", textAlign: "center" }}>
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
          </div>
        </section>

        {/* STAT CALLOUTS */}
        {Array.isArray(report.statCallouts) && report.statCallouts.length > 0 && (
          <section style={{ padding: "24px 24px 48px" }}>
            <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {report.statCallouts.map((s, i) => (
                <div key={i} style={{ borderLeft: `2px solid ${GOLD}`, padding: "8px 0 8px 20px" }}>
                  <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 34, fontWeight: 300, color: GOLD, margin: "0 0 8px", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, lineHeight: 1.45, color: "rgba(248,245,240,0.75)", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DATA SECTIONS */}
        {Array.isArray(report.sections) && report.sections.length > 0 && (
          <section style={{ padding: "16px 24px 48px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>
              {report.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 40 }}>
                  {sec.heading && <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: CREAM, margin: "0 0 14px" }}>{sec.heading}</h2>}
                  {sec.body && <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: "0 0 14px", maxWidth: 760 }}>{sec.body}</p>}
                  {sec.table && <DataTable table={sec.table} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* METHODOLOGY */}
        {report.methodology && (
          <section style={{ padding: "32px 24px", background: "rgba(201,168,76,0.03)", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Methodology</p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.75)", margin: 0 }}>{report.methodology}</p>
            </div>
          </section>
        )}

        {/* RELATED - 2026-06-29. Close the internal-link loop: the index was a
            dead end (0 outbound links to the money pages). These feed crawl
            depth + topical clustering across the motor-charter cluster. */}
        <section style={{ padding: "40px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 16px" }}>Go deeper</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/weekly-yacht-charter-rates-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 10 }}>Weekly charter rates, all-in: base, APA, 13% VAT and gratuity by yacht size and season</Link>
              <Link href="/motor-yacht-charter-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 10 }}>Motor yacht charter in Greece: the full 2026 guide</Link>
              <Link href="/charter-cost-estimator" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 10 }}>Charter cost estimator</Link>
              <Link href="/glossary/greek-vat" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.25)", paddingBottom: 10 }}>Greek charter VAT in 2026, explained</Link>
            </div>
          </div>
        </section>

        {/* CITE THIS - 2026-06-28. Original data is what third parties + AI
            engines cite, but only if attribution is trivial. A ready-made
            citation line turns the index into a citation magnet. */}
        <section style={{ padding: "32px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Cite this index</p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.75)", margin: 0 }}>
              George Yachts Brokerage House. (2026). <em>Greek Charter Index 2026: weekly crewed charter rates by yacht type and region</em>. https://georgeyachts.com/greek-charter-index-2026
            </p>
          </div>
        </section>

        {/* FAQ */}
        {Array.isArray(report.faqItems) && report.faqItems.length > 0 && (
          <section style={{ padding: "56px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 28px" }}>Frequently asked questions</h2>
              {report.faqItems.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(248,245,240,0.1)", padding: "18px 0" }}>
                  <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, color: CREAM, margin: "0 0 8px" }}>{f.question}</p>
                  <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.65, color: "rgba(248,245,240,0.78)", margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ padding: "64px 24px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inquiry" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
              Brief George directly
            </Link>
            <a href="https://wa.me/17867988798?text=Hi%20George%2C%20I%20read%20the%20Greek%20Charter%20Index%202026%20and%20would%20like%20current%20rates%20for%20my%20dates." target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none" }}>
              Message on WhatsApp
            </a>
          </div>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: "rgba(248,245,240,0.5)", margin: "22px 0 0" }}>
            A personal reply from George, usually within a few hours.
          </p>
        </section>
      </article>
    </>
  );
}
