// Shared SEO landing-page template.
//
// 2026-05-11 — Phase 7 (SEO/GEO strategy doc execution). Powers the
// 22 new programmatic landing pages built tonight: 8 yacht-type
// pages, 8 use-case pages, and 6 long-tail UHNW pages. Each child
// route is a thin wrapper that imports its data record and renders
// this template. The result keeps every page consistent in look,
// schema markup, and information architecture without duplicating
// JSX across 22 files.
//
// Data contract (pageData prop):
//   {
//     slug,                  string (used in canonical + breadcrumbs)
//     urlPath,               string ("/motor-yacht-charter-greece")
//     eyebrow,               string (small caps top of hero)
//     h1,                    string (page title)
//     tagline,               string (subtitle under h1)
//     whyTitle,              string (eyebrow of second section)
//     whyBody,               long string (200+ words why this yacht type / use case)
//     yachtFilter,           Sanity GROQ filter snippet OR null (skip fleet section)
//     yachtsHeadline,        string (eyebrow above the yacht grid)
//     featuredHeading,       string (h2 above yacht grid)
//     prosAndCons,           optional { pros: [], cons: [] } — yacht-type pages
//     bestFor,               optional [string] — bulleted list of ideal scenarios
//     whenTitle,             string ("When to charter")
//     whenBody,              string (seasonality / timing)
//     insiderTitle,          string ("George's insider notes")
//     insiderTips,           [string] (5-7 tips)
//     faq,                   [{q, a}] (5-8 questions)
//     rateTable,             optional { eyebrow, heading, intro, caption,
//                              columns: [], rows: [{cells: []}] } — visible
//                              HTML pricing table (GEO: engines extract
//                              tables from HTML, not JSON-LD). 2026-07-02.
//     deepDive,              optional [{ eyebrow, heading, body }] — extra
//                              long-form editorial sections. body supports
//                              **bold** and [text](/path) internal links.
//                              Renders nothing when absent. 2026-07-02.
//     ctaTitle,              string ("Ready to ...?")
//     ctaPrimary,            string ("Find a yacht")
//     ctaPrimaryHref,        string (default /yacht-finder)
//     breadcrumbParent,      optional { name, url } (Charter Fleet by default)
//     touristType,           [string] (TouristDestination touristType array)
//     seoTitle, seoDescription, canonical — used by parent page.jsx for <head>
//   }

import Link from "next/link";
import ReactDOM from "react-dom";
// 2026-07-02 (ASK B 2.1a) — fleet-match cards join the cover-open
// view transition, pairing yacht-cover-<slug> with the detail hero.
import ViewTransitionLink from "@/app/components/ViewTransitionLink";
import { sanityClient } from "@/lib/sanity";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { relatedFor } from "@/lib/seoInternalLinks";
import { GREEK_PAGES } from "@/lib/greekSeo";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import OutsideGroundsNote from "@/app/components/seo/OutsideGroundsNote";
import { SITE_UPDATED } from "@/lib/contentFreshness";
import LastUpdated from "@/app/components/seo/LastUpdated";
import { buildTouristTrip } from "@/lib/touristTripSchema";
import { WHATSAPP_DOWN, WHATSAPP_NUMBER } from "@/lib/whatsappStatus";
import Footer from "@/app/components/Footer";

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";

async function loadFleetMatches(yachtFilter) {
  if (!yachtFilter) return [];
  const q = `*[_type == "yacht" && defined(slug.current) && (${yachtFilter})] | order(weeklyRatePrice desc)[0...8]{
    name, "slug": slug.current, length, sleeps,
    weeklyRatePrice, fleetTier, priceModel, subtitle,
    "image": images[0].asset->url
  }`;
  try {
    const rows = await sanityClient.fetch(q);
    return rows || [];
  } catch {
    return [];
  }
}

function FaqJsonLd({ faq, quickAnswer }) {
  // 2026-09-04 (plan item 13): the quick answer at the top of the page is
  // the one Q/A an engine should lift, so it leads the FAQPage entity,
  // attributed to the canonical author, instead of living only in HTML.
  const lead =
    quickAnswer && quickAnswer.question && quickAnswer.answer
      ? [
          {
            "@type": "Question",
            name: quickAnswer.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: quickAnswer.answer,
              author: {
                "@type": "Person",
                "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
                name: "George P. Biniaris",
              },
            },
          },
        ]
      : [];
  const rest = Array.isArray(faq) ? faq : [];
  if (lead.length === 0 && rest.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: SITE_UPDATED,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".gy-qa-text", ".gy-key-facts"],
    },
    mainEntity: [
      ...lead,
      ...rest.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function ServiceJsonLd({ pageData, yachts }) {
  // Service schema with offer aggregate from the matching fleet.
  // Falls back to a basic Service entry if no yacht filter is set.
  const offers = (yachts || []).slice(0, 5).map((y) => ({
    "@type": "Offer",
    name: y.name,
    url: `https://georgeyachts.com/yachts/${y.slug}`,
    priceCurrency: "EUR",
    price: y.weeklyRatePrice || undefined,
    availability: "https://schema.org/InStock",
  })).filter((o) => o.price);

  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://georgeyachts.com${pageData.urlPath}#service`,
    name: pageData.h1,
    description: pageData.whyBody.slice(0, 280),
    provider: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Greece",
      geo: { "@type": "GeoCoordinates", addressCountry: "GR" },
    },
    audience: {
      "@type": "Audience",
      audienceType: pageData.touristType || ["UHNW travellers"],
    },
    ...(offers.length > 0 ? { hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: pageData.featuredHeading,
      itemListElement: offers,
    }} : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default async function SeoLanding({ pageData }) {
  const yachts = await loadFleetMatches(pageData.yachtFilter);
  // SD-3.1 (2026-08-01) — the fleet cards paint as inline-style CSS
  // backgrounds, which the browser's preload scanner cannot see; on the
  // type pages one of these cards is the LCP element, discovered only
  // after layout (~1.7s observed), which Lighthouse's mobile simulation
  // punishes into a 26-29s LCP. Preloading the first two card images
  // from the server (React hoists these into <head>) makes them
  // discoverable from byte one. Zero visual change.
  for (const y of (yachts || []).slice(0, 2)) {
    if (y?.image) {
      ReactDOM.preload(sanityCardImg(y.image, 600), { as: "image", fetchPriority: "high" });
    }
  }
  // Greek pages cross-link each OTHER (2026-07-16 — Ahrefs flagged all 11 as
  // orphans: relatedFor only knows the English catalog, so the /el/ cluster
  // had zero incoming internal links). Cyclic window: each page links the
  // next 6, so every Greek page RECEIVES exactly 6 incoming links too.
  const isGreek = pageData.lang === "el";
  const related = isGreek
    ? (() => {
        const idx = GREEK_PAGES.findIndex((p) => p.urlPath === pageData.urlPath);
        return Array.from({ length: Math.min(6, GREEK_PAGES.length - 1) }, (_, k) => {
          const p = GREEK_PAGES[(idx + 1 + k) % GREEK_PAGES.length];
          return { urlPath: p.urlPath, eyebrow: p.eyebrow, title: p.h1 };
        });
      })()
    : relatedFor(pageData.urlPath, { max: 6 });

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    pageData.breadcrumbParent || {
      name: "Charter Yachts Greece",
      url: "https://georgeyachts.com/charter-yacht-greece",
    },
    {
      name: pageData.h1,
      url: `https://georgeyachts.com${pageData.urlPath}`,
    },
  ];

  return (
    <>
      <ServiceJsonLd pageData={pageData} yachts={yachts} />
      <FaqJsonLd faq={pageData.faq} quickAnswer={pageData.quickAnswer} />
      <BreadcrumbSchema items={breadcrumbs} />
      {/* TouristTrip - only on itinerary pages (gated on structured stops) so
          yacht-type / combo / comparison pages never emit a spurious trip. */}
      {Array.isArray(pageData.itineraryStops) && pageData.itineraryStops.length > 0 && (() => {
        const trip = buildTouristTrip({
          name: pageData.h1,
          description: pageData.seoDescription,
          url: `https://georgeyachts.com${pageData.urlPath || `/${pageData.slug}`}`,
          stops: pageData.itineraryStops,
          touristType: pageData.touristType,
          region: pageData.itineraryRegion,
        });
        return trip ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trip).replace(/</g, "\\u003c") }} />
        ) : null;
      })()}

      <article style={{ background: NAVY, minHeight: "100vh" }}>
        {/* QUICK ANSWER - Phase 7 R27 (technical brief Priority 2B).
            Renders only when pageData.quickAnswer is present, OR
            falls back to derived Q/A using h1 + seoDescription. */}
        {(() => {
          const qa = pageData.quickAnswer;
          let question;
          let answer;
          if (qa && qa.question && qa.answer) {
            question = qa.question;
            answer = qa.answer;
          } else if (pageData.seoDescription && pageData.h1) {
            question = `${pageData.h1}: what should I know?`;
            answer = pageData.seoDescription;
          }
          if (!question || !answer) return null;
          return (
            <section
              className="gy-qa-lead"
              style={{
                background: NAVY,
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: 0,
              }}
            >
              <div style={{ maxWidth: 980, margin: "0 auto" }}>
                <QuickAnswerBlock
                  question={question}
                  answer={answer}
                  keyFacts={qa && qa.question ? pageData.keyFacts : undefined}
                  evidence={qa && qa.question ? pageData.evidence : undefined}
                />
              </div>
            </section>
          );
        })()}

        {/* 2026-09-05: pages for grounds this house does not work say so. */}
        <section style={{ background: NAVY, padding: "0 24px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <OutsideGroundsNote path={pageData.urlPath} />
          </div>
        </section>

        {/* HERO */}
        <header
          style={{
            background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY} 100%)`,
            padding: "120px 24px 64px",
            borderBottom: "1px solid rgba(218, 161, 16,0.15)",
            textAlign: "center",
          }}
        >
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
              {pageData.eyebrow}
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(48px, 8vw, 110px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              {pageData.h1}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248,245,240,0.85)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {pageData.tagline}
            </p>
            <LastUpdated date={SITE_UPDATED} />
          </div>
        </header>

        {/* WHY THIS PAGE

            2026-08-06 (job 20, local until George's push), whyTitle, whenTitle
            and insiderTitle were all marked up as <p>. They are section
            headings and were styled like section headings, but a paragraph is
            what Google was reading. The consequence showed up in the URL
            Inspection sweep: /motor-yacht-charter-corfu renders 714 words under
            exactly four headings, three of which are template furniture
            ("About motor yacht charter corfu", "Closely related to this page",
            and the CTA), so it reads to a crawler as a thin doorway page. It
            has never been fetched by Google. Fifty-two commercial pages share
            this template and that fate.

            The three <p> elements below become <h2> with the SAME style object,
            so the page looks identical and finally has an outline. */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2
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
              {pageData.whyTitle}
            </h2>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 17,
                lineHeight: 1.78,
                color: "rgba(248,245,240,0.88)",
              }}
              dangerouslySetInnerHTML={{ __html: pageData.whyBody.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>') }}
            />
          </div>
        </section>

        {/* PROS / CONS, optional */}
        {pageData.prosAndCons && (
          <section style={{ padding: "24px 24px 64px" }}>
            <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div style={{ border: "1px solid rgba(218, 161, 16,0.25)", padding: "24px 26px" }}>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>
                  In its favour
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {pageData.prosAndCons.pros.map((p, i) => (
                    <li key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.88)", paddingLeft: 18, position: "relative", marginBottom: 6 }}>
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, color: GOLD }}>+</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ border: "1px solid rgba(248, 245, 240,0.15)", padding: "24px 26px" }}>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248,245,240,0.72)", fontWeight: 600, margin: "0 0 14px" }}>
                  Worth knowing
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {pageData.prosAndCons.cons.map((c, i) => (
                    <li key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248, 245, 240,0.72)", paddingLeft: 18, position: "relative", marginBottom: 6 }}>
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, color: "rgba(248,245,240,0.6)" }}>·</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* BEST FOR, optional bulleted list */}
        {Array.isArray(pageData.bestFor) && pageData.bestFor.length > 0 && (
          <section style={{ padding: "0 24px 64px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
                Best suited for
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                {pageData.bestFor.map((b, i) => (
                  <li key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.6, color: "rgba(248,245,240,0.88)", paddingLeft: 22, position: "relative" }}>
                    <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, color: GOLD, fontWeight: 700 }}>·</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FLEET MATCHES */}
        {yachts.length > 0 && (
          <section
            style={{
              background: "rgba(218, 161, 16,0.025)",
              borderTop: "1px solid rgba(218, 161, 16,0.15)",
              borderBottom: "1px solid rgba(218, 161, 16,0.15)",
              padding: "72px 24px",
            }}
          >
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                {pageData.yachtsHeadline}
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 36px", textAlign: "center" }}>
                {pageData.featuredHeading}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                {yachts.map((y) => (
                  <ViewTransitionLink
                    key={y.slug}
                    href={`/yachts/${y.slug}`}
                    data-cursor="View"
                    style={{ textDecoration: "none", color: "inherit", display: "block", background: "rgba(248, 245, 240,0.03)", border: "1px solid rgba(248, 245, 240,0.08)", overflow: "hidden", transition: "border-color 0.3s ease" }}
                    className="g1-yacht-card"
                  >
                    <div style={{ width: "100%", aspectRatio: "4 / 3", background: y.image ? `${NAVY} url(${sanityCardImg(y.image, 600)}) center/cover no-repeat` : NAVY, viewTransitionName: `yacht-cover-${y.slug}` }} aria-hidden={!y.image} />
                    <div style={{ padding: "16px 18px 20px" }}>
                      <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 20, fontWeight: 400, color: "#F8F5F0", margin: "0 0 4px" }}>{y.name}</p>
                      {(y.length || y.sleeps) && (
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.12em", color: "rgba(248,245,240,0.72)", margin: "0 0 8px", textTransform: "uppercase" }}>
                          {[y.length, y.sleeps && `${y.sleeps} guests`].filter(Boolean).join("  ·  ")}
                        </p>
                      )}
                      {y.weeklyRatePrice && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{ display: "block", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: isPerPerson(y) ? "rgba(248,245,240,0.72)" : GOLD, fontWeight: 600, marginBottom: 2 }}>
                            {priceUnitBadge(y)}
                          </span>
                          <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: "0.06em" }}>{y.weeklyRatePrice}</span>
                        </div>
                      )}
                    </div>
                  </ViewTransitionLink>
                ))}
              </div>
              <p style={{ textAlign: "center", marginTop: 28 }}>
                <Link href="/charter-yacht-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: 2 }}>
                  See the full fleet
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* RATE TABLE, optional visible pricing table (2026-07-02, GEO:
            engines extract facts from rendered HTML tables; JSON-LD alone
            showed no citation uplift in Ahrefs' 1,885-page experiment). */}
        {pageData.rateTable && Array.isArray(pageData.rateTable.rows) && pageData.rateTable.rows.length > 0 && (
          <section style={{ padding: "72px 24px 0" }}>
            <div className="reveal-up" style={{ maxWidth: 980, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                {pageData.rateTable.eyebrow || "Rates"}
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(26px, 3.6vw, 38px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 16px", textAlign: "center" }}>
                {pageData.rateTable.heading}
              </h2>
              {pageData.rateTable.intro && (
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: "0 auto 32px", maxWidth: 720, textAlign: "center" }}>
                  {pageData.rateTable.intro}
                </p>
              )}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  {pageData.rateTable.caption && (
                    <caption style={{ captionSide: "bottom", fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "rgba(248,245,240,0.5)", padding: "12px 0 0", textAlign: "left" }}>
                      {pageData.rateTable.caption}
                    </caption>
                  )}
                  <thead>
                    <tr>
                      {(pageData.rateTable.columns || []).map((c) => (
                        <th key={c} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, fontWeight: 600, textAlign: "left", padding: "12px 14px", borderBottom: "1px solid rgba(218, 161, 16,0.35)", whiteSpace: "nowrap" }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.rateTable.rows.map((row, i) => (
                      <tr key={i}>
                        {row.cells.map((cell, j) => (
                          <td key={j} className="gy-tnum" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13.5, color: "rgba(248, 245, 240,0.85)", padding: "11px 14px", borderBottom: "1px solid rgba(248,245,240,0.08)", verticalAlign: "top" }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIAL, optional verified client quote (2026-07-08).
            Real review words on the money page: E-E-A-T for Google,
            quotable first-hand proof for AI engines. Renders nothing
            when the field is absent, so the other ~40 pages are
            untouched. Quote text must be VERBATIM from the source
            review - never edited, never invented. */}
        {pageData.testimonial && (
          <section style={{ padding: "72px 24px 0" }} aria-label="Client review">
            <figure className="reveal-up" style={{ maxWidth: 720, margin: "0 auto", padding: "36px 32px", border: "1px solid rgba(218, 161, 16,0.25)", background: "rgba(218, 161, 16,0.04)" }}>
              <p aria-hidden="true" style={{ color: GOLD, fontSize: 15, letterSpacing: 3, margin: "0 0 14px" }}>★★★★★</p>
              <blockquote style={{ margin: 0, fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(17px, 2.2vw, 21px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.65, color: "rgba(248,245,240,0.92)" }}>
                {"\u201C"}{pageData.testimonial.quote}{"\u201D"}
              </blockquote>
              <figcaption style={{ marginTop: 18, fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.08em", color: "rgba(248,245,240,0.66)" }}>
                {pageData.testimonial.attribution}
                {" \u00B7 "}
                <a href="/reviews" style={{ color: GOLD, textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.4)" }}>
                  all reviews
                </a>
              </figcaption>
            </figure>
          </section>
        )}

        {/* DEEP DIVE, optional long-form editorial sections (2026-07-02).
            Lets head pages carry guide-depth content without touching the
            template contract of the other ~40 pages (renders nothing when
            the field is absent). body supports **bold** + [text](/path). */}
        {Array.isArray(pageData.deepDive) && pageData.deepDive.map((sec) => (
          <section key={sec.heading} style={{ padding: "72px 24px 0" }}>
            {/* reveal-up: the pre-existing scroll-driven utility
                (GLOBAL PREMIUM EFFECTS), zero JS, @supports-gated,
                reduced-motion aware. First applied 2026-07-02. */}
            <div className="reveal-up" style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 10px" }}>
                {sec.eyebrow || "The Guide"}
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 18px", lineHeight: 1.2 }}>
                {sec.heading}
              </h2>
              <div
                style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.78, color: "rgba(248,245,240,0.88)" }}
                dangerouslySetInnerHTML={{
                  __html: sec.body
                    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>')
                    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2" style="color:#DAA110;text-decoration:none;border-bottom:1px solid rgba(218, 161, 16,0.5)">$1</a>'),
                }}
              />
            </div>
          </section>
        ))}

        {/* WHEN */}
        {pageData.whenBody && (
          <section style={{ padding: "72px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>
                {pageData.whenTitle}
              </h2>
              <p
                style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.75, color: "rgba(248,245,240,0.88)", margin: 0 }}
                dangerouslySetInnerHTML={{ __html: pageData.whenBody.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>') }}
              />
            </div>
          </section>
        )}

        {/* LINK INDEX
            A page that promises "one guide per island" has to show them. The
            anchorage hub was pitched to the cruising press as 48 per-island
            guides while linking only the handful the related-pages engine
            happened to surface, and an editor wrote back that he could find
            one page. Groups render in the order given. */}
        {pageData.linkIndex && Array.isArray(pageData.linkIndex.groups) && pageData.linkIndex.groups.length > 0 && (
          <section style={{ padding: "0 24px 72px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "left" }}>
              <h2 style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>
                {pageData.linkIndex.title}
              </h2>
              {pageData.linkIndex.intro && (
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.75, color: "rgba(248,245,240,0.88)", margin: "0 0 34px", maxWidth: 720 }}>
                  {pageData.linkIndex.intro}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {pageData.linkIndex.groups.map((group) => (
                  <div key={group.label}>
                    <h3 style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248,245,240,0.55)", fontWeight: 600, margin: "0 0 14px" }}>
                      {group.label}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "10px 22px", justifyItems: "start" }}>
                      {/* marginInline below overrides the site-wide
                          `p, li, dd, blockquote { margin-inline: auto }`
                          rule, which centres each name in its grid cell. */}
                      {group.links.map((link) => (
                        <li key={link.href} style={{ marginInline: 0 }}>
                          <a
                            href={link.href}
                            style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.5, color: "rgba(248,245,240,0.88)", textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.28)", paddingBottom: 2 }}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* INSIDER TIPS */}
        {Array.isArray(pageData.insiderTips) && pageData.insiderTips.length > 0 && (
          <section style={{ background: "rgba(218, 161, 16,0.025)", borderTop: "1px solid rgba(218, 161, 16,0.15)", borderBottom: "1px solid rgba(218, 161, 16,0.15)", padding: "72px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
                {pageData.insiderTitle || "George's insider notes"}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {pageData.insiderTips.map((tip, i) => (
                  <li key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.65, color: "rgba(248,245,240,0.88)", paddingLeft: 22, position: "relative" }}>
                    <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, color: GOLD, fontWeight: 700 }}>{i + 1}.</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQ */}
        {Array.isArray(pageData.faq) && pageData.faq.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                Frequently asked
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 36px", textAlign: "center" }}>
                {/* 2026-08-06 (job 20), the fallback was `About ${h1.toLowerCase()}`,
                    which rendered as "About motor yacht charter corfu": lower-cased,
                    machine-flavoured, and on the thin combo pages it was one of only
                    three headings on the whole page. Keeps the term, loses the tell. */}
                {pageData.faqHeading || `Questions we get about ${pageData.h1}`}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* 2026-08-31 - Clarity dead-click fix (VAT page): gold
                    non-links looked clickable while these FAQ rows, which DO
                    open, looked static. The gold + is the missing
                    affordance; rotates to x when open (.gy-faq-details). */}
                {pageData.faq.map((f, i) => (
                  <details key={i} className="gy-faq-details" style={{ border: "1px solid rgba(248, 245, 240,0.1)", padding: "16px 20px" }}>
                    <summary style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, color: "#F8F5F0", cursor: "pointer", listStyle: "none", fontWeight: 400, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
                      <span>{f.q}</span>
                      <span className="gy-faq-plus" aria-hidden="true" style={{ color: "#DAA110", fontSize: 20, lineHeight: 1, flexShrink: 0, transition: "transform 0.25s ease", fontFamily: "var(--gy-font-ui)" }}>+</span>
                    </summary>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.85)", margin: "12px 0 0" }}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTINUE EXPLORING, Phase 7 Round 6 internal linking */}
        {related.length > 0 && (
          <section style={{ padding: "72px 24px", borderTop: "1px solid rgba(248, 245, 240,0.06)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
                {isGreek ? "Συνεχίστε την εξερεύνηση" : "Continue exploring"}
              </p>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 3.4vw, 34px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 36px", textAlign: "center", lineHeight: 1.2 }}>
                {isGreek ? "Σχετικές σελίδες" : "Closely related to this page"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                {related.map((r) => (
                  <Link
                    key={r.urlPath}
                    href={r.urlPath}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid rgba(248, 245, 240,0.1)",
                      padding: "18px 20px",
                      background: "rgba(248, 245, 240,0.02)",
                      transition: "border-color 0.3s ease",
                    }}
                  >
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 8px" }}>
                      {r.eyebrow}
                    </p>
                    <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, fontWeight: 400, color: "#F8F5F0", margin: 0, lineHeight: 1.3 }}>
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: "rgba(218, 161, 16,0.025)", borderTop: "1px solid rgba(218, 161, 16,0.15)", padding: "84px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 32px", lineHeight: 1.2 }}>
              {pageData.ctaTitle}
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={pageData.ctaPrimaryHref || "/yacht-finder"}
                style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: "linear-gradient(135deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)", color: NAVY, border: "1px solid rgba(218, 161, 16,0.6)", textDecoration: "none" }}
              >
                {pageData.ctaPrimary}
              </Link>
              <Link
                href="/#contact"
                style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", background: "transparent", color: "rgba(248, 245, 240,0.85)", border: "1px solid rgba(248, 245, 240,0.3)", textDecoration: "none" }}
              >
                Or write to George
              </Link>
              {/* 2026-07-03 TEMPORARY, WhatsApp under review; route
                  to /inquiry while WHATSAPP_DOWN (lib/whatsappStatus). */}
              <a
                href={WHATSAPP_DOWN ? "/#contact" : `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hi George, I am interested in ${pageData.h1 || "a Greek yacht charter"}. Could you share availability and rates?`)}`}
                {...(WHATSAPP_DOWN ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", background: "transparent", color: "#DAA110", border: "1px solid #DAA110", textDecoration: "none" }}
              >
                {WHATSAPP_DOWN ? "Message George Directly" : "Message on WhatsApp"}
              </a>
            </div>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: "rgba(248, 245, 240,0.5)", margin: "22px 0 0" }}>
              A personal reply from George, usually within a few hours.
            </p>
          </div>
        </section>
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
