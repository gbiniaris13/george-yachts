// HubPage - Stage 2 (Extra Z). Reusable browsable index ("hub") for a
// programmatic content family (islands, yacht types, best-for-X, destination
// comparisons). Each family previously had only leaf pages reachable via the
// footer sitemap; a dedicated hub gives (1) a crawlable CollectionPage +
// ItemList entry point that concentrates internal PageRank, (2) a featured-
// snippet / AI-citation target for "list" queries, (3) a clean human browse.
//
// Thin route wrappers pass the family's items; this component renders the
// grid + JSON-LD + breadcrumb + freshness line, identically styled.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LastUpdated from "@/app/components/seo/LastUpdated";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export default function HubPage({
  eyebrow,
  h1,
  intro,
  items = [],
  breadcrumbs = [],
  lastUpdated,
  collectionUrl,
  ctaHref = "/inquiry",
  ctaLabel = "Brief George directly",
}) {
  const abs = (u) => (u && u.startsWith("http") ? u : `https://georgeyachts.com${u}`);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    name: h1,
    description: intro,
    url: collectionUrl,
    ...(lastUpdated ? { dateModified: lastUpdated } : {}),
    isPartOf: { "@type": "WebSite", "@id": "https://georgeyachts.com/#website" },
    publisher: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(it.url),
        name: it.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "120px 24px 48px", borderBottom: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              {eyebrow}
            </p>
            <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(40px, 6.5vw, 84px)", fontWeight: 300, margin: "0 0 18px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {h1}
            </h1>
            {intro && (
              <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(17px, 2.1vw, 20px)", fontWeight: 300, fontStyle: "italic", color: "rgba(248,245,240,0.85)", margin: "0 auto", maxWidth: 640, lineHeight: 1.55 }}>
                {intro}
              </p>
            )}
            {lastUpdated && <LastUpdated date={lastUpdated} />}
          </div>
        </header>

        {/* GRID */}
        <section style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {items.map((it) => (
              <Link
                key={it.url}
                href={it.url}
                style={{
                  display: "block",
                  border: "1px solid rgba(201,168,76,0.25)",
                  padding: "22px 24px",
                  background: "rgba(248,245,240,0.02)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {it.meta && (
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 8px" }}>
                    {it.meta}
                  </p>
                )}
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, fontWeight: 400, color: CREAM, margin: "0 0 6px", lineHeight: 1.3 }}>
                  {it.title}
                </p>
                {it.blurb && (
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, lineHeight: 1.5, color: "rgba(248,245,240,0.78)", margin: 0 }}>
                    {it.blurb}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "32px 24px 72px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <Link href={ctaHref} style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
            {ctaLabel}
          </Link>
        </section>
      </article>
    </>
  );
}
