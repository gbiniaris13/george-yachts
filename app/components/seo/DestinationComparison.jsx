// Destination comparison template — Phase 7 Round 16 (2026-05-12).
//
// Powers 5 head-to-head comparison pages targeting UHNW decision-phase
// queries. Built for AI-engine citation: structured comparison table
// LLMs can extract directly + FAQ schema + a clear short-answer block
// formatted to win Google's featured snippet on "Greece vs X" queries.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { relatedFor } from "@/lib/seoInternalLinks";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import QuizCtaCard from "@/app/components/QuizCtaCard";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";
const GREEN_TICK = "#7DB48B";
const NEUTRAL = "rgba(248, 245, 240, 0.55)";

function FaqJsonLd({ faq }) {
  if (!faq || faq.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function ArticleJsonLd({ data }) {
  // Article schema with comparesTo via about (entities being compared)
  // helps LLMs recognise the page as a comparison source.
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://georgeyachts.com${data.urlPath}#article`,
    headline: data.h1,
    description: data.shortAnswer,
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: "2026-05-12",
    dateModified: "2026-05-12",
    author: {
      "@type": "Person",
      "@id": "https://georgeyachts.com/team/george-biniaris#person",
      name: "George P. Biniaris",
      url: "https://georgeyachts.com/team/george-biniaris",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    about: [
      { "@type": "TouristDestination", name: "Greek yacht charter" },
      { "@type": "TouristDestination", name: `${data.competitorName} yacht charter` },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://georgeyachts.com${data.urlPath}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function EdgeBadge({ edge, competitorName }) {
  // Visual indicator for which destination has the edge on a given criterion.
  const labels = {
    greece: { text: "Greece", color: GOLD },
    competitor: { text: competitorName, color: "#7DB4D8" },
    tie: { text: "Tie", color: NEUTRAL },
  };
  const lbl = labels[edge] || labels.tie;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--gy-font-ui)",
        fontSize: 9,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: lbl.color,
        fontWeight: 700,
        padding: "4px 8px",
        border: `1px solid ${lbl.color}`,
        borderRadius: 2,
      }}
    >
      Edge: {lbl.text}
    </span>
  );
}

export default function DestinationComparison({ pageData }) {
  const data = pageData;
  const related = relatedFor(data.urlPath, { max: 6 });
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    {
      name: "Charter Yachts Greece",
      url: "https://georgeyachts.com/charter-yacht-greece",
    },
    { name: data.h1, url: `https://georgeyachts.com${data.urlPath}` },
  ];

  return (
    <>
      <ArticleJsonLd data={data} />
      <FaqJsonLd faq={data.faq} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
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
              {data.eyebrow}
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 7vw, 84px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              {data.h1}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(17px, 2.1vw, 21px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {data.tagline}
            </p>
          </div>
        </header>

        {/* QUICK ANSWER - Phase 7 R27 (technical brief Priority 2B).
            Replaces the previous "Short answer" block with the Q&A
            "answer unit" format optimised for AI extraction. */}
        <section style={{ padding: "56px 24px 32px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock
              question={`Greece or ${data.competitorName} for a 2026 yacht charter?`}
              answer={data.shortAnswer}
            />
          </div>
        </section>

        {/* INTRO BODY */}
        <section style={{ padding: "32px 24px 56px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 17,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.85)",
              }}
              dangerouslySetInnerHTML={{
                __html: data.introBody
                  .split(/\n\n|(?<=\.) (?=[A-Z])/)
                  .filter((p) => p.trim())
                  .map((p) => `<p style="margin: 0 0 18px;">${p.trim()}</p>`)
                  .join(""),
              }}
            />
          </div>
        </section>

        {/* COMPARISON TABLE */}
        {Array.isArray(data.comparisonTable) && data.comparisonTable.length > 0 && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              padding: "72px 24px",
            }}
          >
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
                Head-to-head
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 36px",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                Greece vs {data.competitorName}
              </h2>
              <div
                style={{
                  border: "1px solid rgba(201,168,76,0.2)",
                  background: "rgba(248, 245, 240, 0.02)",
                  overflow: "hidden",
                }}
              >
                {/* Table header — desktop only */}
                <div
                  className="g1-comparison-row g1-comparison-header"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(180px, 1.6fr) 1.2fr 1.2fr 140px",
                    gap: 16,
                    padding: "14px 20px",
                    background: "rgba(201,168,76,0.08)",
                    borderBottom: "1px solid rgba(201,168,76,0.2)",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 700,
                  }}
                >
                  <div>Criterion</div>
                  <div>Greece</div>
                  <div>{data.competitorName}</div>
                  <div>Edge</div>
                </div>
                {data.comparisonTable.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(180px, 1.6fr) 1.2fr 1.2fr 140px",
                      gap: 16,
                      padding: "18px 20px",
                      borderBottom:
                        i < data.comparisonTable.length - 1
                          ? "1px solid rgba(248, 245, 240, 0.06)"
                          : "none",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 15,
                        fontWeight: 400,
                        color: CREAM,
                        lineHeight: 1.35,
                      }}
                    >
                      {row.criterion}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        color:
                          row.edge === "greece"
                            ? CREAM
                            : "rgba(248, 245, 240, 0.78)",
                        lineHeight: 1.5,
                        fontWeight: row.edge === "greece" ? 600 : 400,
                      }}
                    >
                      {row.greece}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        color:
                          row.edge === "competitor"
                            ? CREAM
                            : "rgba(248, 245, 240, 0.78)",
                        lineHeight: 1.5,
                        fontWeight: row.edge === "competitor" ? 600 : 400,
                      }}
                    >
                      {row.competitor}
                    </div>
                    <div>
                      <EdgeBadge edge={row.edge} competitorName={data.competitorName} />
                    </div>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 12,
                  color: "rgba(248, 245, 240, 0.55)",
                  margin: "16px 0 0",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Data: George Yachts client analysis 2025–2026. "Edge" reflects typical UHNW priority, not absolute superiority.
              </p>
            </div>
          </section>
        )}

        {/* DEEP-DIVE SECTIONS */}
        {Array.isArray(data.sections) && data.sections.length > 0 && (
          <section style={{ padding: "84px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {data.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: 56 }}>
                  <h2
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: "clamp(24px, 3.4vw, 32px)",
                      fontWeight: 300,
                      color: CREAM,
                      margin: "0 0 18px",
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
                        .split(/\n\n|(?<=\.) (?=[A-Z])/)
                        .filter((p) => p.trim())
                        .map((p) => `<p style="margin: 0 0 16px;">${p.trim()}</p>`)
                        .join(""),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WHO CHOOSES WHICH */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "84px 24px",
          }}
        >
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
              Decision matrix
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 48px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Who chooses which
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
              }}
            >
              <div
                style={{
                  border: `1px solid ${GOLD}`,
                  padding: "32px 28px",
                  background: "rgba(201,168,76,0.04)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 700,
                    margin: "0 0 8px",
                  }}
                >
                  Choose Greece
                </p>
                <p
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 22,
                    fontWeight: 400,
                    color: CREAM,
                    margin: "0 0 22px",
                    lineHeight: 1.2,
                  }}
                >
                  if you are…
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {data.whoChoosesGreece.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "rgba(248, 245, 240, 0.85)",
                        paddingLeft: 22,
                        position: "relative",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          color: GOLD,
                          fontWeight: 700,
                        }}
                      >
                        +
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  border: "1px solid rgba(125, 180, 216, 0.6)",
                  padding: "32px 28px",
                  background: "rgba(125, 180, 216, 0.04)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "#7DB4D8",
                    fontWeight: 700,
                    margin: "0 0 8px",
                  }}
                >
                  Choose {data.competitorName}
                </p>
                <p
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 22,
                    fontWeight: 400,
                    color: CREAM,
                    margin: "0 0 22px",
                    lineHeight: 1.2,
                  }}
                >
                  if you are…
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {data.whoChoosesCompetitor.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "rgba(248, 245, 240, 0.85)",
                        paddingLeft: 22,
                        position: "relative",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          color: "#7DB4D8",
                          fontWeight: 700,
                        }}
                      >
                        +
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz CTA - Phase 7 R24 (technical brief Priority 1E).
            Surfaces the match quiz right between decision-matrix and
            verdict, when the reader is most actively comparing. */}
        <div style={{ padding: "0 24px" }}>
          <QuizCtaCard fromName="your Greek charter" />
        </div>

        {/* VERDICT */}
        <section style={{ padding: "84px 24px" }}>
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
                textAlign: "center",
              }}
            >
              The honest verdict
            </p>
            <div
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.3vw, 22px)",
                lineHeight: 1.6,
                fontWeight: 300,
                fontStyle: "italic",
                color: CREAM,
                textAlign: "center",
              }}
              dangerouslySetInnerHTML={{
                __html: data.verdict
                  .split(/\n\n|(?<=\.) (?=[A-Z])/)
                  .filter((p) => p.trim())
                  .map((p) => `<p style="margin: 0 0 18px;">${p.trim()}</p>`)
                  .join(""),
              }}
            />
          </div>
        </section>

        {/* FAQ */}
        {Array.isArray(data.faq) && data.faq.length > 0 && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              padding: "84px 24px",
            }}
          >
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
                Greece vs {data.competitorName}: common questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {data.faq.map((f, i) => (
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

        {/* RELATED PAGES */}
        {related.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
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
                Continue exploring
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(24px, 3.4vw, 34px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                Closely related to this page
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 14,
                }}
              >
                {related.map((r) => (
                  <Link
                    key={r.urlPath}
                    href={r.urlPath}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid rgba(248, 245, 240, 0.1)",
                      padding: "18px 20px",
                      background: "rgba(248, 245, 240, 0.02)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 9,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: GOLD,
                        fontWeight: 600,
                        margin: "0 0 8px",
                      }}
                    >
                      {r.eyebrow}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 17,
                        fontWeight: 400,
                        color: CREAM,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Inline Calendly - Phase 7 R23 (technical brief Priority 1B).
            Embedded discovery call widget before the final CTA, so
            decision-stage visitors can book without leaving the page. */}
        <InlineCalendlySection
          heading="Still comparing? Book a free 30-minute call with George."
          subheading={`Honest take on whether Greece or ${pageData.competitorName} fits your specific charter. MYBA-standard contracts.`}
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
              Ready to charter Greece?
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
              Speak with George P. Biniaris directly. MYBA-standard contracts, Greek-flagged fleet, end-to-end brokerage.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
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
