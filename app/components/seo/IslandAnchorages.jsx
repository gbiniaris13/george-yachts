// Island anchorages spoke-page template — Phase 7 Round 21 (2026-05-12).
//
// Renders an anchorage-by-anchorage guide for a given island. Each
// anchorage is its own Place schema entity with GeoCoordinates — the
// page becomes a structured directory of anchorages, citable by AI
// engines when users ask "where to anchor in Mykonos" type queries.
//
// Topical-cluster effect: every anchorage page links back to the
// island root page (/yacht-charter-{island}) WHEN that page exists
// (only the 26 lib/islands.js islands have one - 2026-07-02 Ahrefs
// audit: the unconditional link 404'd on the other 23 guides), the
// region page (/destinations/{region}), and every other guide via
// the anchorage-library index. Internal authority flows toward the
// island root, deepening Google's perception that George Yachts is
// the topical authority on that island.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import { LAST_REFRESH } from "@/lib/contentFreshness";
import LastUpdated from "@/app/components/seo/LastUpdated";
import { getIslandBySlug } from "@/lib/islands";
import { ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesSeo";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

// Fallback surfaces for guides whose island has no root page. The
// three editorial region pages cover most; Sporades/Dodecanese/Crete
// guides fall back to the anchorage database hub.
const REGION_HUBS = {
  cyclades: { href: "/destinations/cyclades", label: "Cyclades charters" },
  ionian: { href: "/destinations/ionian", label: "Ionian charters" },
  saronic: { href: "/destinations/saronic", label: "Saronic charters" },
};

const REGION_ORDER = ["Cyclades", "Saronic", "Ionian", "Sporades", "Dodecanese", "Crete"];

function CollectionAndArticleJsonLd({ data }) {
  // The guide page itself is an Article. Each anchorage is a Place
  // with GeoCoordinates, collected as ItemList. The combination
  // gives AI engines both an editorial source AND a structured
  // anchorage directory to extract.
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://georgeyachts.com${data.urlPath}#article`,
    headline: data.h1,
    description: data.intro.slice(0, 280),
    url: `https://georgeyachts.com${data.urlPath}`,
    datePublished: "2026-05-12",
    dateModified: LAST_REFRESH.ANCHORAGES,
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
      "@type": "TouristDestination",
      name: `${data.islandName} yacht charter`,
    },
  };

  const anchorageList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `https://georgeyachts.com${data.urlPath}#anchorages`,
    name: `${data.islandName} yacht anchorages`,
    numberOfItems: data.anchorages.length,
    itemListElement: data.anchorages.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Place",
        name: a.name,
        description: a.notes,
        geo: a.coords
          ? {
              "@type": "GeoCoordinates",
              latitude: a.coords.lat,
              longitude: a.coords.lng,
            }
          : undefined,
        containedInPlace: {
          "@type": "Place",
          name: data.islandName,
          address: {
            "@type": "PostalAddress",
            addressCountry: "GR",
            addressRegion: data.region,
          },
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(anchorageList) }} />
    </>
  );
}

export default function IslandAnchorages({ guideData }) {
  const g = guideData;

  // Parent surface: the island root page when it exists, otherwise
  // the region page, otherwise the anchorage database. Never a 404.
  const hasIslandPage = Boolean(getIslandBySlug(g.slug));
  const regionHub = REGION_HUBS[(g.region || "").toLowerCase()];
  const parentHref = hasIslandPage
    ? `/yacht-charter-${g.slug}`
    : regionHub
      ? regionHub.href
      : "/greek-anchorages-database";
  const parentLabel = hasIslandPage
    ? `${g.islandName} charter`
    : regionHub
      ? regionHub.label
      : "All Greek anchorages";
  const parentCrumbName = hasIslandPage
    ? g.islandName
    : regionHub
      ? g.region
      : "Greek Anchorages";

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: parentCrumbName, url: `https://georgeyachts.com${parentHref}` },
    { name: "Anchorages", url: `https://georgeyachts.com${g.urlPath}` },
  ];

  return (
    <>
      <CollectionAndArticleJsonLd data={g} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 56px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <Link
              href={parentHref}
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
              ← {parentLabel}
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
              {g.eyebrow}  ·  {g.region}
            </p>
            <h1
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 7vw, 88px)",
                fontWeight: 300,
                margin: "0 0 22px",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              {g.h1}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(17px, 2vw, 21px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {g.tagline}
            </p>
            <LastUpdated date={LAST_REFRESH.ANCHORAGES} />
          </div>
        </header>

        {/* QUICK ANSWER - Phase 7 R27 (technical brief Priority 2B). */}
        <section style={{ padding: "32px 24px 0" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <QuickAnswerBlock
              question={`Where should I anchor a yacht around ${g.islandName}?`}
              answer={
                g.anchorages && g.anchorages.length > 0
                  ? `${g.islandName} has ${g.anchorages.length} meaningful yacht anchorages. The primary anchorages are ${g.anchorages
                      .slice(0, 3)
                      .map((a) => a.name)
                      .join(", ")} - each with different shelter, holding, and ashore access. ${g.captainAdvice ? g.captainAdvice.split(". ")[0] + "." : ""}`
                  : g.intro.split(". ").slice(0, 2).join(". ") + "."
              }
            />
          </div>
        </section>

        {/* INTRO */}
        <section style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 17,
                lineHeight: 1.78,
                color: "rgba(248, 245, 240, 0.85)",
              }}
              dangerouslySetInnerHTML={{
                __html: g.intro
                  .split(/\n\n|(?<=\.) (?=[A-Z])/)
                  .filter((p) => p.trim())
                  .map((p) => `<p style="margin: 0 0 18px;">${p.trim()}</p>`)
                  .join(""),
              }}
            />
          </div>
        </section>

        {/* ANCHORAGES — the directory */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
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
              The anchorages
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 38px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 8px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {g.anchorages.length} anchorages around {g.islandName}
            </h2>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 16,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.6)",
                margin: "0 0 48px",
                textAlign: "center",
              }}
            >
              {g.bestUseCase}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {g.anchorages.map((a) => (
                <div
                  key={a.name}
                  id={a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  // reveal-up (2026-07-02): the pre-existing zero-JS
                  // scroll-driven utility; each anchorage card settles
                  // into place as it enters the viewport.
                  className="reveal-up"
                  style={{
                    border: "1px solid rgba(201,168,76,0.2)",
                    padding: "28px 32px",
                    background: "rgba(248, 245, 240, 0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 24,
                      flexWrap: "wrap",
                      marginBottom: 18,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: "clamp(22px, 3vw, 28px)",
                        fontWeight: 400,
                        color: CREAM,
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {a.name}
                    </h3>
                    {a.coords && (
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: "rgba(248, 245, 240, 0.55)",
                          margin: 0,
                          fontVariant: "tabular-nums",
                        }}
                      >
                        {a.coords.lat.toFixed(3)}°N, {a.coords.lng.toFixed(3)}°E
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 14,
                      marginBottom: 18,
                      borderBottom: "1px solid rgba(248, 245, 240, 0.08)",
                      paddingBottom: 18,
                    }}
                  >
                    {[
                      { label: "Depth", value: a.depth },
                      { label: "Holding", value: a.holding },
                      { label: "Shelter", value: a.shelter },
                      { label: "Ashore", value: a.ashore },
                    ].filter((spec) => spec.value).map((spec) => (
                      <div key={spec.label}>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 8,
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                            color: GOLD,
                            fontWeight: 700,
                            margin: "0 0 6px",
                          }}
                        >
                          {spec.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 13,
                            lineHeight: 1.55,
                            color: "rgba(248, 245, 240, 0.82)",
                            margin: 0,
                          }}
                        >
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "rgba(248, 245, 240, 0.85)",
                      margin: "0 0 12px",
                    }}
                  >
                    {a.notes}
                  </p>
                  {a.bestFor && (
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 14,
                        fontStyle: "italic",
                        color: GOLD,
                        margin: 0,
                      }}
                    >
                      Best for: {a.bestFor}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEASONALITY */}
        {g.seasonality && (
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
                When to visit
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 17,
                  lineHeight: 1.78,
                  color: "rgba(248, 245, 240, 0.85)",
                  margin: 0,
                }}
              >
                {g.seasonality}
              </p>
            </div>
          </section>
        )}

        {/* CAPTAIN ADVICE */}
        {g.captainAdvice && (
          <section
            style={{
              background: "rgba(201,168,76,0.04)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              padding: "56px 24px",
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
                Captain's note
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 17,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  color: "rgba(248, 245, 240, 0.92)",
                  margin: 0,
                }}
              >
                {g.captainAdvice}
              </p>
            </div>
          </section>
        )}

        {/* RELATED PAGES */}
        {Array.isArray(g.relatedPages) && g.relatedPages.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                {g.relatedPages.map((p) => (
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

        {/* ANCHORAGE LIBRARY — 2026-07-02. Guides for islands without
            a /yacht-charter-{island} root page had zero server-rendered
            inbound links (Ahrefs: orphan pages). Every guide now links
            every other guide, so each one carries 40+ crawlable inbound
            routes and the series reads as one library. */}
        <section
          style={{
            borderTop: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
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
                margin: "0 0 10px",
                textAlign: "center",
              }}
            >
              The anchorage library
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 15,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.6)",
                margin: "0 0 8px",
                textAlign: "center",
              }}
            >
              Every island guide in the series - documented depth, holding and shelter.
            </p>
            {REGION_ORDER.map((region) => {
              const guides = ISLAND_ANCHORAGES.filter(
                (a) => a.region === region && a.slug !== g.slug
              );
              if (guides.length === 0) return null;
              return (
                <div key={region} style={{ marginTop: 26 }}>
                  <p
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 9,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.7)",
                      fontWeight: 600,
                      margin: "0 0 10px",
                    }}
                  >
                    {region}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                    {guides.map((a) => (
                      <Link
                        key={a.slug}
                        href={a.urlPath}
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 13,
                          letterSpacing: "0.08em",
                          color: "rgba(248, 245, 240, 0.75)",
                          textDecoration: "none",
                        }}
                      >
                        {a.islandName}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", marginTop: 40, display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/greek-anchorages-database"
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: GOLD,
                  textDecoration: "none",
                  paddingBottom: 3,
                  borderBottom: `1px solid ${GOLD}`,
                }}
              >
                The full anchorage database →
              </Link>
              {/* 2026-07-02 (ASK A Section 2, Phase 2) — shallow-draft bays
                  are catamaran water; the guides feed the catamaran page. */}
              <Link
                href="/catamaran-charter-greece"
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "rgba(248, 245, 240, 0.75)",
                  textDecoration: "none",
                  paddingBottom: 3,
                  borderBottom: "1px solid rgba(248, 245, 240, 0.3)",
                }}
              >
                Catamarans for shallow bays →
              </Link>
            </div>
          </div>
        </section>

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
              Charter {g.islandName}
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
              Speak with George P. Biniaris directly. MYBA-standard contracts, full Greek charter fleet.
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
                href={parentHref}
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
                {parentLabel} →
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
