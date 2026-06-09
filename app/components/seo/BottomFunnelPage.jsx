// BottomFunnelPage template - Phase 7 Round 34 (2026-05-12).
// Technical brief Priority 5A. Powers 20 high-purchase-intent pages.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import { relatedFor } from "@/lib/seoInternalLinks";
import { LAST_REFRESH } from "@/lib/contentFreshness";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

function ArticleAndTouristTripJsonLd({ data }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://georgeyachts.com${data.urlPath}#article`,
    headline: data.h1,
    description: data.quickAnswerA,
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: "2026-05-12",
    dateModified: LAST_REFRESH.BOTTOM_FUNNEL,
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
  };

  const tripDays = Array.isArray(data.itinerary) ? data.itinerary : [];
  const touristTrip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `https://georgeyachts.com${data.urlPath}#trip`,
    name: data.h1,
    description: data.tagline,
    touristType: "Ultra-high-net-worth travellers",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tripDays.length,
      itemListElement: tripDays.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: d.title, description: d.body },
      })),
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "35000",
      highPrice: "1800000",
      offerCount: data.yachtRecs?.length || 1,
      seller: {
        "@type": "Organization",
        "@id": "https://georgeyachts.com/#organization",
        name: "George Yachts Brokerage House",
      },
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: data.quickAnswerQ,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.quickAnswerA,
          author: {
            "@type": "Person",
            "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
          },
        },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTrip) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
}

export default function BottomFunnelPage({ pageData }) {
  const d = pageData;
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
    { name: d.h1, url: `https://georgeyachts.com${d.urlPath}` },
  ];
  const related = relatedFor(d.urlPath, { max: 4 });

  return (
    <>
      <ArticleAndTouristTripJsonLd data={d} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 48px", textAlign: "center" }}>
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
              {d.eyebrow}
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {d.h1}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(16px, 2vw, 19px)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "rgba(248,245,240,0.78)",
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {d.tagline}
            </p>
          </div>
        </header>

        {/* QUICK ANSWER */}
        <section style={{ padding: "32px 24px 56px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock question={d.quickAnswerQ} answer={d.quickAnswerA} />
          </div>
        </section>

        {/* YACHT RECOMMENDATIONS */}
        {Array.isArray(d.yachtRecs) && d.yachtRecs.length > 0 && (
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
                  fontWeight: 700,
                  margin: "0 0 14px",
                  textAlign: "center",
                }}
              >
                Yachts for this brief
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(26px, 3.8vw, 36px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                  textAlign: "center",
                }}
              >
                Specs that match
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 18,
                }}
              >
                {d.yachtRecs.map((y, i) => (
                  <div
                    key={i}
                    style={{
                      border: `1px solid ${GOLD}`,
                      background: "rgba(201,168,76,0.04)",
                      padding: "22px 24px",
                    }}
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
                      {y.kind}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 12,
                        color: "rgba(248,245,240,0.65)",
                        margin: "0 0 6px",
                      }}
                    >
                      {y.cabins} · {y.crew}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 22,
                        fontWeight: 400,
                        color: GOLD,
                        margin: "0 0 10px",
                      }}
                    >
                      {y.weekly}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(248,245,240,0.78)",
                        margin: 0,
                      }}
                    >
                      {y.fitFor}
                    </p>
                  </div>
                ))}
              </div>
              {d.pricingNote && (
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 12,
                    color: "rgba(248,245,240,0.55)",
                    margin: "20px 0 0",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  {d.pricingNote}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ITINERARY */}
        {Array.isArray(d.itinerary) && d.itinerary.length > 0 && (
          <section style={{ padding: "84px 24px" }}>
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
                Sample itinerary
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(26px, 3.8vw, 36px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                }}
              >
                {d.itinerary.length}-day skeleton
              </h2>
              <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {d.itinerary.map((day, i) => (
                  <li
                    key={i}
                    style={{
                      borderBottom: i < d.itinerary.length - 1 ? "1px solid rgba(248,245,240,0.08)" : "none",
                      padding: "18px 0",
                      display: "flex",
                      gap: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 22,
                        fontWeight: 300,
                        color: GOLD,
                        minWidth: 60,
                        flexShrink: 0,
                      }}
                    >
                      Day {day.day}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "var(--gy-font-editorial)",
                          fontSize: 17,
                          fontWeight: 400,
                          color: CREAM,
                          margin: "0 0 6px",
                          lineHeight: 1.3,
                        }}
                      >
                        {day.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: "rgba(248,245,240,0.78)",
                          margin: 0,
                        }}
                      >
                        {day.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* WHY GEORGE YACHTS */}
        {Array.isArray(d.whyGeorgeYachts) && d.whyGeorgeYachts.length > 0 && (
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
                  margin: "0 0 14px",
                  textAlign: "center",
                }}
              >
                Why George Yachts
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(26px, 3.8vw, 36px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 32px",
                  textAlign: "center",
                }}
              >
                For this brief specifically
              </h2>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, counterReset: "why" }}>
                {d.whyGeorgeYachts.map((point, i) => (
                  <li
                    key={i}
                    style={{
                      paddingLeft: 50,
                      position: "relative",
                      marginBottom: 18,
                      counterIncrement: "why",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 36,
                        height: 36,
                        border: `1px solid ${GOLD}`,
                        color: GOLD,
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: "rgba(248,245,240,0.88)",
                        margin: 0,
                      }}
                    >
                      {point}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* FAQ */}
        {Array.isArray(d.faq) && d.faq.length > 0 && (
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
                About this charter type
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {d.faq.map((f, i) => (
                  <details
                    key={i}
                    style={{
                      border: "1px solid rgba(248,245,240,0.1)",
                      padding: "16px 20px",
                      background: "rgba(13,27,42,0.4)",
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
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        lineHeight: 1.75,
                        color: "rgba(248,245,240,0.82)",
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

        {/* INLINE CALENDLY */}
        <InlineCalendlySection
          heading="Ready to plan this charter?"
          subheading="Book a free 30-minute call with George to walk through availability, pricing, and the right yacht for your specific dates."
        />

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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 14,
                  marginTop: 24,
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
                      border: "1px solid rgba(248,245,240,0.1)",
                      padding: "18px 20px",
                      background: "rgba(248,245,240,0.02)",
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
                        fontSize: 16,
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
      </article>
    </>
  );
}
