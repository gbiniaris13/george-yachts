// F.4 (Roberto brief, May 2026) — Topic-cluster landing page.
// Hard-coded cluster definitions in lib/journal-clusters.js; this
// route resolves a cluster slug, fetches its 3-5 articles + 3+
// matching yachts from Sanity, and renders the hub page.
//
// SEO: each cluster gets a dedicated <title> + meta description so
// "cyclades charters", "family yachting greece", etc rank as topical
// authority pages distinct from the article pages they link to.

import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { JOURNAL_CLUSTERS, getClusterBySlug } from "@/lib/journal-clusters";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";

export const revalidate = 3600;

export async function generateStaticParams() {
  return JOURNAL_CLUSTERS.map((c) => ({ cluster: c.slug }));
}

export async function generateMetadata({ params }) {
  const { cluster: clusterSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) return { title: "Topic | George Yachts" };
  return {
    title: `${cluster.title} | George Yachts Journal`,
    description: cluster.intro.slice(0, 158),
    openGraph: {
      title: `${cluster.title} | George Yachts`,
      description: cluster.intro.slice(0, 158),
      type: "website",
      url: `https://georgeyachts.com/journal/${cluster.slug}`,
    },
  };
}

async function loadClusterData(cluster) {
  const articleQuery = `*[_type == "post" && slug.current in $slugs]{
    title, excerpt, "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    publishedAt
  }`;
  const yachtQuery = `*[_type == "yacht" && defined(slug.current) && (${cluster.yachtFilter})] | order(name asc)[0...3]{
    name, "slug": slug.current, length, sleeps,
    weeklyRatePrice, fleetTier, priceModel,
    "image": images[0].asset->url
  }`;
  const [articles, yachts] = await Promise.all([
    sanityClient.fetch(articleQuery, { slugs: cluster.articles }),
    sanityClient.fetch(yachtQuery),
  ]);
  // Reorder articles to match cluster.articles order, drop any unpublished/missing
  const articleMap = new Map((articles || []).map((a) => [a.slug, a]));
  const orderedArticles = cluster.articles.map((s) => articleMap.get(s)).filter(Boolean);
  return { articles: orderedArticles, yachts: yachts || [] };
}

const GOLD = "#C9A84C";

export default async function ClusterPage({ params }) {
  const { cluster: clusterSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) notFound();

  const { articles, yachts } = await loadClusterData(cluster);

  return (
    <article style={{ background: "#0D1B2A", minHeight: "100vh" }}>
      {/* HEADER */}
      <header
        style={{
          background: "linear-gradient(180deg, #0D1B2A 0%, #000 100%)",
          padding: "120px 24px 64px",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 9,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 18px",
            }}
          >
            {cluster.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(56px, 10vw, 130px)",
              fontWeight: 300,
              color: "#F8F5F0",
              margin: "0 0 28px",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              textShadow: "0 6px 32px rgba(0,0,0,0.55)",
            }}
          >
            {cluster.title}
          </h1>
          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.78)",
              margin: 0,
            }}
          >
            {cluster.intro}
          </p>
        </div>
      </header>

      {/* ARTICLES */}
      {articles.length > 0 && (
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
                textAlign: "center",
              }}
            >
              The Reading List
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#fff",
                margin: "0 0 36px",
                textAlign: "center",
              }}
            >
              {articles.length} {articles.length === 1 ? "article" : "articles"} on {cluster.title.toLowerCase()}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/blog/${a.slug}`}
                    data-cursor="Read"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      height: "100%",
                      transition: "border-color 0.3s ease",
                    }}
                    className="f4-article-card"
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        background: a.imageUrl
                          ? `#0D1B2A url(${sanityCardImg(a.imageUrl, 720)}) center/cover no-repeat`
                          : "#0D1B2A",
                      }}
                      aria-hidden={!a.imageUrl}
                    />
                    <div style={{ padding: "18px 20px 22px" }}>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 20,
                          fontWeight: 400,
                          color: "#fff",
                          margin: "0 0 8px",
                          lineHeight: 1.3,
                        }}
                      >
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p
                          style={{
                            fontFamily: "'Lato', 'Montserrat', sans-serif",
                            fontSize: 13,
                            lineHeight: 1.55,
                            color: "rgba(255,255,255,0.65)",
                            margin: 0,
                          }}
                        >
                          {a.excerpt.length > 140 ? a.excerpt.slice(0, 140) + "…" : a.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* YACHTS */}
      {yachts.length > 0 && (
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
                textAlign: "center",
              }}
            >
              Yachts that fit this conversation
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#fff",
                margin: "0 0 36px",
                textAlign: "center",
              }}
            >
              Three yachts from the fleet
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {yachts.map((y) => (
                <Link
                  key={y.slug}
                  href={`/yachts/${y.slug}`}
                  data-cursor="View"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                  }}
                  className="f4-yacht-card"
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      background: y.image
                        ? `#0D1B2A url(${sanityCardImg(y.image, 600)}) center/cover no-repeat`
                        : "#0D1B2A",
                    }}
                    aria-hidden={!y.image}
                  />
                  <div style={{ padding: "16px 18px 20px" }}>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#fff",
                        margin: "0 0 4px",
                      }}
                    >
                      {y.name}
                    </p>
                    {(y.length || y.sleeps) && (
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: "rgba(255,255,255,0.65)",
                          margin: "0 0 8px",
                          textTransform: "uppercase",
                        }}
                      >
                        {[y.length, y.sleeps && `${y.sleeps} guests`].filter(Boolean).join("  ·  ")}
                      </p>
                    )}
                    {y.weeklyRatePrice && (
                      <div style={{ marginTop: 6 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: 8,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: isPerPerson(y) ? "rgba(255,255,255,0.65)" : GOLD,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {priceUnitBadge(y)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 12,
                            color: GOLD,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {y.weeklyRatePrice}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link
                href="/charter-yacht-greece"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: `1px solid ${GOLD}`,
                  paddingBottom: 2,
                }}
              >
                Or browse all yachts →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "84px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 300,
              color: "#fff",
              margin: "0 0 18px",
              lineHeight: 1.2,
            }}
          >
            {cluster.cta.headline}
          </h2>
          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.78)",
              margin: "0 0 32px",
            }}
          >
            {cluster.cta.sub}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/yacht-finder"
              style={{
                display: "inline-block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 26px",
                background: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                color: "#0D1B2A",
                border: "1px solid rgba(201,168,76,0.6)",
                textDecoration: "none",
              }}
            >
              Brief George — reply within 24h →
            </Link>
            <Link
              href="/inquiry"
              style={{
                display: "inline-block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "14px 26px",
                background: "transparent",
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}
            >
              Or write to George
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
