// BestYachtsPage template - Phase 7 Round 35 (2026-05-12).
// Technical brief Priority 5B. Renders the 10 "Best yachts for X" pages.

import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { relatedFor } from "@/lib/seoInternalLinks";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import { LAST_REFRESH } from "@/lib/contentFreshness";
import LastUpdated from "@/app/components/seo/LastUpdated";
import Footer from "@/app/components/Footer";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

// "€180,000-260,000" -> { low: "180000", high: "260000" }; single figures
// return low only. Used to emit a valid AggregateOffer instead of the
// invalid `priceRange` key that Offer does not define (12 pages flagged in
// the Ahrefs crawl of 30/07/2026). Returns null when nothing parses, so a
// weekly string we cannot read simply drops the offer rather than guessing.
function parseWeeklyRange(weekly) {
  if (!weekly || typeof weekly !== "string") return null;
  const nums = weekly.replace(/[,\s]/g, "").match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  return { low: nums[0], high: nums.length > 1 ? nums[1] : null };
}


// 2026-08-06 — Search Console had all 27 Merchant-listing items on these
// pages failing twice over: "Missing field price (in offers)" and "Missing
// field image". The price is fixed below; the image needs the real photo,
// so we read it from Sanity for the rows that name an actual yacht.
//
// The rows split in two and the schema now respects the difference. Some
// name a real boat and link to her page: those are genuine Products and get
// her photograph, her rate and her URL. The rest describe a CLASS of yacht
// ("45-50m motor yacht with 6 cabins") with a price band. Those are not
// products at all, nobody can book "a 45-50m motor yacht", and giving them a
// stock photo to satisfy a validator would be dressing a category up as a
// boat. They stay in the list as plain entries, with no Product type and no
// invented image.
async function fetchYachtImages(rows) {
  const slugs = (rows || [])
    .map((y) => (y.href || "").match(/^\/yachts\/([a-z0-9-]+)$/)?.[1])
    .filter(Boolean);
  if (slugs.length === 0) return {};
  try {
    const docs = await sanityClient.fetch(
      `*[_type == "yacht" && slug.current in $slugs]{"s": slug.current, "img": images[0].asset->url}`,
      { slugs },
    );
    return Object.fromEntries((docs || []).filter((d) => d.img).map((d) => [d.s, d.img]));
  } catch (err) {
    // Sanity down at build time must never break the page; we ship without
    // the image rather than with a wrong one.
    console.error("BestYachtsPage image fetch failed:", err?.message);
    return {};
  }
}

function JsonLd({ data, images }) {
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
    itemListElement: (data.yachts || []).map((y, i) => {
      const range = parseWeeklyRange(y.weekly);
      const slug = (y.href || "").match(/^\/yachts\/([a-z0-9-]+)$/)?.[1];
      const img = slug ? (images || {})[slug] : null;
      // A class of yacht is not a Product: name it and move on.
      if (!img) {
        return { "@type": "ListItem", position: i + 1, name: y.spec };
      }
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: y.spec,
          description: y.why,
          image: img,
          url: `https://georgeyachts.com${y.href}`,
          brand: { "@type": "Brand", name: "George Yachts" },
          ...(range
            ? {
                offers: {
                  // Offer with an explicit `price`, not an AggregateOffer with
                  // a band: Google's Product rich result needs a price and a
                  // band alone gave it none. Same shape as the yacht pages,
                  // which do validate. `price` is the entry rate, honest as a
                  // "from", and the band rides in the priceSpecification.
                  "@type": "Offer",
                  priceCurrency: "EUR",
                  price: String(range.low),
                  availability: "https://schema.org/InStock",
                  url: `https://georgeyachts.com${y.href}`,
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: String(range.low),
                    priceCurrency: "EUR",
                    unitText: "per week",
                    minPrice: String(range.low),
                    ...(range.high ? { maxPrice: String(range.high) } : {}),
                  },
                },
              }
            : {}),
        },
      };
    }),
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".gy-qa-text"],
    },
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

export default async function BestYachtsPage({ pageData }) {
  const d = pageData;
  const images = await fetchYachtImages(d.yachts);
  // 2026-08-06 — these twelve pages were dead ends: they received internal
  // links and passed none, so they could not support the pillar they belong
  // to. /best-catamarans-greece-charter carries 1,861 impressions and was
  // doing nothing for the catamaran cluster it sits in. Same related-links
  // engine every other SEO template already uses.
  const related = relatedFor(d.urlPath, { max: 6 });
  return (
    <>
      <JsonLd data={d} images={images} />
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
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(16px, 2vw, 19px)", fontStyle: "italic", fontWeight: 300, color: "rgba(248,245,240,0.85)", margin: 0, lineHeight: 1.55 }}>
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
                      {/* 2026-07-02, rows may carry href when the "spec"
                          is a named fleet yacht; renders a link to the
                          yacht page so the list passes authority inward. */}
                      {y.href ? (
                        <Link href={y.href} style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 20, color: CREAM, fontWeight: 400, margin: 0, lineHeight: 1.3, textDecoration: "none", borderBottom: "1px solid rgba(201,168,76,0.45)", display: "inline" }}>
                          {y.spec}
                        </Link>
                      ) : (
                        <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 20, color: CREAM, fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
                          {y.spec}
                        </p>
                      )}
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
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.75, color: "rgba(248,245,240,0.88)", margin: "14px 0 0" }}>
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

        {related.length > 0 && (
          <section style={{ padding: "72px 24px", borderTop: "1px solid rgba(248,245,240,0.06)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                Continue exploring
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 3.4vw, 34px)", fontWeight: 300, color: CREAM, margin: "0 0 36px", textAlign: "center", lineHeight: 1.2 }}>
                Closely related to this page
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                {related.map((r) => (
                  <Link key={r.urlPath} href={r.urlPath} style={{ display: "block", textDecoration: "none", color: "inherit", border: "1px solid rgba(248,245,240,0.1)", padding: "18px 20px", background: "rgba(248,245,240,0.02)" }}>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 8px" }}>
                      {r.eyebrow}
                    </p>
                    <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, fontWeight: 400, color: CREAM, margin: 0, lineHeight: 1.3 }}>
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
      {/* 2026-08-06 (job 9), the footer was missing from this template.
          Measured across all 474 public pages: 77 rendered the sitewide
          footer, 397 rendered no <footer> element at all, because the six
          programmatic templates each ended at </article>. No comment in any
          of them explained it, so it was an omission rather than a decision.
          The cost was concrete: /yacht-charter-sifnos carried 43 internal
          links and no privacy link, against 172 on /crewed-yacht-charter-greece
          which had the footer. Same component as everywhere else, so nothing
          about the design changes. */}
      <Footer />
    </>
  );
}
