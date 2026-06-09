// Market report template — Phase 7 Round 19 (2026-05-12).
//
// Powers the periodic quarterly/mid-year/forecast research reports
// at /q1-2026-... etc. Built for AI-citation: Article + Dataset
// JSON-LD so LLMs recognise these as structured data sources, not
// blog posts. Author byline via Person reference to canonical
// /about/george-p-biniaris page.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

function ArticleAndDatasetJsonLd({ data }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Report",
    "@id": `https://georgeyachts.com${data.urlPath}#report`,
    headline: data.h1,
    description: data.executiveSummary,
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: data.publishedAt,
    dateModified: data.publishedAt,
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
    about: {
      "@type": "Thing",
      name: "Greek yacht charter market",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://georgeyachts.com${data.urlPath}`,
    },
  };

  // Dataset schema for the report's structured findings — gives AI
  // engines a structured-data hook. Each report is treated as both
  // an editorial Report and a Dataset.
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `https://georgeyachts.com${data.urlPath}#dataset`,
    name: data.h1,
    description: data.executiveSummary,
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: data.publishedAt,
    creator: {
      "@type": "Person",
      "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
      name: "George P. Biniaris",
    },
    publisher: {
      "@type": "Organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    temporalCoverage: data.publishedAt,
    spatialCoverage: { "@type": "Place", name: "Greece" },
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  // FAQPage from the report's FAQ section.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (data.faq || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }} />
      {data.faq && data.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      )}
    </>
  );
}

function DataTable({ table }) {
  if (!table || !table.headers || !table.rows) return null;
  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 12,
        border: "1px solid rgba(201,168,76,0.2)",
        background: "rgba(248, 245, 240, 0.02)",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${table.headers.length}, minmax(120px, 1fr))`,
          gap: 12,
          padding: "12px 16px",
          background: "rgba(201,168,76,0.08)",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 700,
        }}
      >
        {table.headers.map((h, i) => (
          <div key={i}>{h}</div>
        ))}
      </div>
      {table.rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${table.headers.length}, minmax(120px, 1fr))`,
            gap: 12,
            padding: "14px 16px",
            borderBottom: ri < table.rows.length - 1 ? "1px solid rgba(248, 245, 240, 0.06)" : "none",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 13,
            color: "rgba(248, 245, 240, 0.85)",
            lineHeight: 1.5,
          }}
        >
          {row.map((cell, ci) => (
            <div
              key={ci}
              style={{
                fontWeight: ci === 0 ? 600 : 400,
                color: ci === 0 ? CREAM : "rgba(248, 245, 240, 0.85)",
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MarketReport({ reportData }) {
  const r = reportData;
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Market Reports", url: "https://georgeyachts.com/market-reports" },
    { name: r.h1, url: `https://georgeyachts.com${r.urlPath}` },
  ];

  const publishedDate = new Date(r.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <ArticleAndDatasetJsonLd data={r} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 56px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <Link
              href="/market-reports"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: `1px solid ${GOLD}`,
                paddingBottom: 2,
                marginBottom: 22,
                display: "inline-block",
              }}
            >
              ← All market reports
            </Link>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "22px 0 18px",
              }}
            >
              {r.eyebrow}  ·  {r.period}
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(38px, 6.5vw, 80px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              {r.h1}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(17px, 2vw, 21px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: "0 0 28px",
                lineHeight: 1.55,
              }}
            >
              {r.tagline}
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(248, 245, 240, 0.6)",
                margin: 0,
              }}
            >
              Published {publishedDate} ·{" "}
              <Link
                href="/about/george-p-biniaris"
                style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}
              >
                George P. Biniaris
              </Link>
            </p>
          </div>
        </header>

        {/* QUICK ANSWER - Phase 7 R27 (technical brief Priority 2B).
            Replaces "Executive summary" block with Q&A "answer unit"
            format. Question derived from report type + period; answer
            is the executive summary verbatim. */}
        <section style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock
              question={
                r.reportType === "forecast"
                  ? `What's the outlook for the Greek yacht charter market in ${r.period.toLowerCase().replace("peak ", "")}?`
                  : r.reportType === "retrospective"
                  ? `What happened in the Greek yacht charter market in ${r.period}?`
                  : `What's the state of the Greek yacht charter market right now (${r.period})?`
              }
              answer={r.executiveSummary}
            />
          </div>
        </section>

        {/* KEY FINDINGS */}
        {Array.isArray(r.keyFindings) && r.keyFindings.length > 0 && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
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
                  margin: "0 0 16px",
                }}
              >
                Key findings
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(26px, 3.8vw, 38px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                  lineHeight: 1.2,
                }}
              >
                Headline data points
              </h2>
              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  counterReset: "findings",
                }}
              >
                {r.keyFindings.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      paddingLeft: 48,
                      position: "relative",
                      marginBottom: 18,
                      counterIncrement: "findings",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 32,
                        height: 32,
                        borderRadius: 0,
                        border: `1px solid ${GOLD}`,
                        color: GOLD,
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 16,
                        fontWeight: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: "rgba(248, 245, 240, 0.88)",
                        display: "block",
                        paddingTop: 4,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: f.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${GOLD}">$1</strong>`),
                      }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* SECTIONS */}
        {Array.isArray(r.sections) && r.sections.length > 0 && (
          <section style={{ padding: "84px 24px" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              {r.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 56 }}>
                  <h2
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: "clamp(24px, 3.4vw, 32px)",
                      fontWeight: 300,
                      color: CREAM,
                      margin: "0 0 20px",
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {sec.title}
                  </h2>
                  <div
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 17,
                      lineHeight: 1.78,
                      color: "rgba(248, 245, 240, 0.85)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: sec.body
                        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>')
                        .split(/\n\n|(?<=\.) (?=[A-Z])/)
                        .filter((p) => p.trim())
                        .map((p) => `<p style="margin: 0 0 16px;">${p.trim()}</p>`)
                        .join(""),
                    }}
                  />
                  {sec.dataTable && <DataTable table={sec.dataTable} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* METHODOLOGY */}
        {r.methodology && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              padding: "56px 24px",
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
                  margin: "0 0 14px",
                }}
              >
                Methodology
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 14,
                  lineHeight: 1.78,
                  color: "rgba(248, 245, 240, 0.75)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {r.methodology}
              </p>
            </div>
          </section>
        )}

        {/* FAQ */}
        {Array.isArray(r.faq) && r.faq.length > 0 && (
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
                About this report
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {r.faq.map((f, i) => (
                  <details
                    key={i}
                    style={{
                      border: "1px solid rgba(248, 245, 240, 0.1)",
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
        )}

        {/* Inline Calendly - Phase 7 R23 (technical brief Priority 1B).
            Report readers reaching this point are decision-grade
            traffic. Book straight from the page. */}
        <InlineCalendlySection
          heading="Want these numbers translated for your specific charter?"
          subheading="Book a free 30-minute call with George to walk through what the data means for your dates, yacht size, and itinerary."
        />

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
              Speak with George
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
              Charter inquiries answered personally within 24 hours. MYBA-standard contracts, Greek-flagged fleet.
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
    </>
  );
}
