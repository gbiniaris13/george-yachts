// Greek Charter Index 2026 - Stage 2 (Task 6 / Research A1).
//
// The highest-leverage GEO asset: an original-data page (rates by yacht
// type/region, booking lead time, most-requested islands, fuel/APA, TEPAI)
// with a summary TABLE in the first 30%, quotable stat callouts, Dataset +
// FAQPage JSON-LD, and dateModified. Princeton/GT KDD 2024: statistics
// +41% AI-citation visibility; original data is what third parties cite.
//
// Content is editor-owned: it renders from the Sanity `dataReport` document
// with slug "greek-charter-index-2026". Until George publishes that doc the
// page shows a clearly-marked DRAFT scaffold AND is noindex - no fabricated
// figures ever reach Google or AI engines. Build the type + numbers in the
// Studio (Data Report), then this page goes live and indexable.

import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LastUpdated from "@/app/components/seo/LastUpdated";

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

// Clearly-marked DRAFT placeholder - shows the intended structure (the
// research A1 fields) with empty cells. NO fabricated numbers; the page is
// noindex while this is in use. George replaces it by publishing the Sanity
// Data Report document.
const PLACEHOLDER = {
  title: "George Yachts Greek Charter Index 2026",
  edition: "2026 (draft)",
  intro:
    "Original George Yachts data on crewed yacht charter in Greek waters: indicative weekly rates by yacht type and region, booking lead times, most-requested islands, fuel and APA trends, and TEPAI cruising-tax costs. Figures populate from the Data Report in the Studio.",
  summaryTable: {
    caption: "Indicative weekly charter rates by yacht type and region (EUR, ex VAT and APA)",
    columns: ["Yacht type", "Cyclades", "Ionian", "Saronic", "Dodecanese"],
    rows: [
      { cells: ["Sailing catamaran (12 guests)", "TBD", "TBD", "TBD", "TBD"] },
      { cells: ["Motor yacht (24-34m)", "TBD", "TBD", "TBD", "TBD"] },
      { cells: ["Motor yacht (35-49m)", "TBD", "TBD", "TBD", "TBD"] },
      { cells: ["Superyacht (50m+)", "TBD", "TBD", "TBD", "TBD"] },
    ],
  },
  statCallouts: [
    { value: "TBD", label: "median weekly catamaran rate, Cyclades, 2026" },
    { value: "TBD", label: "average booking lead time for peak August" },
    { value: "TBD", label: "most-requested island for the 2026 season" },
  ],
  sections: [
    { heading: "Booking lead time", body: "Populates from the Data Report in Sanity.", table: null },
    { heading: "Most-requested islands", body: "Populates from the Data Report in Sanity.", table: null },
    { heading: "Fuel and APA trends", body: "Populates from the Data Report in Sanity.", table: null },
    { heading: "TEPAI cruising-tax cost table", body: "Populates from the Data Report in Sanity.", table: null },
  ],
  methodology:
    "Methodology populates from the Data Report in Sanity (sample size, period, sources).",
  faqItems: [],
};

export async function generateMetadata() {
  const report = await getReport();
  const isDraft = !report;
  const r = report || PLACEHOLDER;
  return {
    title: `${r.title} | Original Charter Data`,
    description:
      (r.intro || "Original George Yachts data on Greek crewed yacht charter rates and trends.").slice(0, 158),
    alternates: { canonical: URL },
    // Draft (no published Data Report yet) stays out of the index so no
    // placeholder figures get crawled or cited.
    ...(isDraft ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: r.title,
      description: (r.intro || "").slice(0, 158),
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
  const real = await getReport();
  const isDraft = !real;
  const report = real || PLACEHOLDER;
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
        <header style={{ padding: "120px 24px 48px", borderBottom: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              Original data {report.edition ? `· ${report.edition}` : ""} · George Yachts
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
          <Link href="/inquiry" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
            Brief George directly
          </Link>
        </section>
      </article>
    </>
  );
}
