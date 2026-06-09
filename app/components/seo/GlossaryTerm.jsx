// Glossary term page template — Phase 7 Round 15 (2026-05-12).
//
// Built for /glossary/[slug]. Optimised for the three things glossary
// pages need to win at:
//   1. Featured snippets (the shortDefinition appears in a dedicated
//      hero block, formatted to win the Google snippet box for "what
//      is X" queries).
//   2. AI citations (DefinedTerm + FAQPage schema so LLMs identify
//      the page as a definition source).
//   3. Internal authority distribution (relatedTerms + relatedPages
//      grids keep crawlers inside the topical cluster).
//
// Visual treatment matches SeoLanding (navy + gold + editorial
// serif) so the glossary feels like part of the same publication.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { getGlossaryTermBySlug } from "@/lib/glossarySeo";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import { LAST_REFRESH } from "@/lib/contentFreshness";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

function DefinedTermJsonLd({ term }) {
  // schema.org/DefinedTerm — the canonical structured data for
  // glossary entries. LLMs (and Google's understanding layer) use
  // this to recognise the page as a definition source.
  const json = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `https://georgeyachts.com/glossary/${term.slug}#term`,
    name: term.term,
    alternateName: term.alsoKnownAs || [],
    description: term.shortDefinition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": "https://georgeyachts.com/glossary#set",
      name: "George Yachts Yacht Charter Glossary",
      url: "https://georgeyachts.com/glossary",
      dateModified: LAST_REFRESH.GLOSSARY,
    },
    url: `https://georgeyachts.com/glossary/${term.slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

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

export default function GlossaryTerm({ termData }) {
  const term = termData;
  const relatedTerms = (term.relatedTerms || [])
    .map((slug) => getGlossaryTermBySlug(slug))
    .filter(Boolean);

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Glossary", url: "https://georgeyachts.com/glossary" },
    { name: term.term, url: `https://georgeyachts.com/glossary/${term.slug}` },
  ];

  return (
    <>
      <DefinedTermJsonLd term={term} />
      <FaqJsonLd faq={term.faq} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO — featured-snippet target */}
        <header style={{ padding: "120px 24px 56px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <nav style={{ marginBottom: 24 }}>
              <Link
                href="/glossary"
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
                }}
              >
                ← Glossary
              </Link>
            </nav>
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
              Yacht Charter Glossary
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 6.5vw, 84px)",
                fontWeight: 300,
                margin: "0 0 28px",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              {term.term}
            </h1>
            {term.alsoKnownAs && term.alsoKnownAs.length > 0 && (
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 13,
                  color: "rgba(248, 245, 240, 0.6)",
                  margin: "0 0 32px",
                  letterSpacing: "0.04em",
                }}
              >
                Also known as: <span style={{ color: "rgba(248, 245, 240, 0.85)" }}>{term.alsoKnownAs.join(" · ")}</span>
              </p>
            )}

          </div>
        </header>

        {/* QUICK ANSWER - Phase 7 R27 (technical brief Priority 2B).
            Replaces "Definition" block with Q&A "answer unit" format.
            Question derived from term name; answer is the short
            definition verbatim. Attributed to George for E-E-A-T. */}
        <section style={{ padding: "32px 24px 0" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock
              question={`What is ${term.term} in yacht charter?`}
              answer={term.shortDefinition}
            />
          </div>
        </section>

        {/* LONG DEFINITION */}
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
                margin: "0 0 16px",
              }}
            >
              Full explanation
            </p>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 17,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.85)",
              }}
              dangerouslySetInnerHTML={{
                __html: term.longDefinition
                  .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>')
                  .split(/\n\n|(?<=\.) (?=[A-Z])/)
                  .filter((p) => p.trim())
                  .map((p) => `<p style="margin: 0 0 18px;">${p.trim()}</p>`)
                  .join(""),
              }}
            />
          </div>
        </section>

        {/* WHY IT MATTERS */}
        {term.whyItMatters && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              padding: "64px 24px",
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
                }}
              >
                Why it matters for UHNW charterers
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 19,
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: "rgba(248, 245, 240, 0.92)",
                  margin: 0,
                }}
              >
                {term.whyItMatters}
              </p>
            </div>
          </section>
        )}

        {/* EXAMPLES */}
        {Array.isArray(term.examples) && term.examples.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
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
                  textAlign: "center",
                }}
              >
                Worked examples
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
                {term.examples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid rgba(201,168,76,0.25)",
                      padding: "24px 26px",
                      background: "rgba(248, 245, 240, 0.02)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 17,
                        color: CREAM,
                        fontWeight: 400,
                        margin: "0 0 12px",
                        lineHeight: 1.35,
                      }}
                    >
                      {ex.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "rgba(248, 245, 240, 0.78)",
                        margin: 0,
                      }}
                    >
                      {ex.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {Array.isArray(term.faq) && term.faq.length > 0 && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              padding: "72px 24px",
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
                About {term.term.toLowerCase()}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {term.faq.map((f, i) => (
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

        {/* RELATED TERMS */}
        {relatedTerms.length > 0 && (
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
                Related terms
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(24px, 3.2vw, 32px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                Other definitions worth knowing
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                {relatedTerms.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid rgba(248, 245, 240, 0.1)",
                      padding: "20px 22px",
                      background: "rgba(248, 245, 240, 0.02)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 18,
                        fontWeight: 400,
                        color: CREAM,
                        margin: "0 0 8px",
                        lineHeight: 1.3,
                      }}
                    >
                      {r.term}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 13,
                        color: "rgba(248, 245, 240, 0.65)",
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {r.shortDefinition.length > 110 ? r.shortDefinition.slice(0, 108) + "…" : r.shortDefinition}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RELATED PAGES (internal authority distribution) */}
        {Array.isArray(term.relatedPages) && term.relatedPages.length > 0 && (
          <section style={{ padding: "0 24px 72px" }}>
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
                Continue reading
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                {term.relatedPages.map((p) => (
                  <Link
                    key={p.url}
                    href={p.url}
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 12,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: CREAM,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid rgba(201,168,76,0.4)",
                      padding: "12px 22px",
                    }}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(26px, 3.6vw, 36px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 14px",
                lineHeight: 1.2,
              }}
            >
              Ready to charter in Greece?
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
              George P. Biniaris and the George Yachts team broker yachts in Greek waters under MYBA-standard contracts. Speak with us directly.
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
