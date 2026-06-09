// BestYachtsPage template - Phase 7 Round 35 (2026-05-12).
// Technical brief Priority 5B. Renders the 10 "Best yachts for X" pages.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import { LAST_REFRESH } from "@/lib/contentFreshness";
import LastUpdated from "@/app/components/seo/LastUpdated";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

function JsonLd({ data }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://georgeyachts.com${data.urlPath}#article`,
    headline: data.h1,
    description: data.quickAnswerA,
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: "2026-05-12",
    dateModified: LAST_REFRESH.BEST_YACHTS,
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
    },
  };
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `https://georgeyachts.com${data.urlPath}#yachts`,
    name: data.h1,
    itemListElement: (data.yachts || []).map((y, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: y.spec,
        description: y.why,
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          priceRange: y.weekly,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: data.quickAnswerQ,
        acceptedAnswer: { "@type": "Answer", text: data.quickAnswerA },
      },
      ...(data.faq || []).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
}

export default function BestYachtsPage({ pageData }) {
  const d = pageData;
  return (
    <>
      <JsonLd data={d} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com/" },
          { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
          { name: d.h1, url: `https://georgeyachts.com${d.urlPath}` },
        ]}
      />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        <header style={{ padding: "120px 24px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              {d.eyebrow}
            </p>
            <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300, margin: "0 0 22px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {d.h1}
            </h1>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(16px, 2vw, 19px)", fontStyle: "italic", fontWeight: 300, color: "rgba(248,245,240,0.78)", margin: 0, lineHeight: 1.55 }}>
              {d.tagline}
            </p>
            <LastUpdated date={LAST_REFRESH.BEST_YACHTS} />
          </div>
        </header>

        <section style={{ padding: "32px 24px 56px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock question={d.quickAnswerQ} answer={d.quickAnswerA} />
          </div>
        </section>

        {/* YACHT RECS LIST */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 14px", textAlign: "center" }}>
              The yacht specs
            </p>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(26px, 3.8vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 36px", textAlign: "center" }}>
              {(d.yachts || []).length} specs that match the brief
            </h2>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, counterReset: "yachts" }}>
              {(d.yachts || []).map((y, i) => (
                <li
                  key={i}
                  style={{
                    counterIncrement: "yachts",
                    padding: "24px 26px",
                    border: `1px solid ${GOLD}`,
                    background: "rgba(201,168,76,0.04)",
                    marginBottom: 14,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 8px" }}>
                        Option {i + 1}
                      </p>
                      <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 20, color: CREAM, fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
                        {y.spec}
                      </p>
                    </div>
                    <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 22, color: GOLD, fontWeight: 400, margin: 0, whiteSpace: "nowrap" }}>
                      {y.weekly}
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.85)", margin: 0 }}>
                    {y.why}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        {Array.isArray(d.faq) && d.faq.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                Frequently asked
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(26px, 3.6vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 32px", textAlign: "center" }}>
                About this charter type
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {d.faq.map((f, i) => (
                  <details key={i} style={{ border: "1px solid rgba(248,245,240,0.1)", padding: "16px 20px", background: "rgba(13,27,42,0.4)" }}>
                    <summary style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, color: CREAM, cursor: "pointer", listStyle: "none", fontWeight: 400 }}>
                      {f.q}
                    </summary>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.75, color: "rgba(248,245,240,0.82)", margin: "14px 0 0" }}>
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <InlineCalendlySection
          heading="Ready to choose a yacht?"
          subheading="Book a 30-minute call with George to walk through specific yachts in this category that match your dates."
        />
      </article>
    </>
  );
}
