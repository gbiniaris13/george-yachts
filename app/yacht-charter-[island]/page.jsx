// G.1 (Roberto brief, May 2026) — Island-specific landing pages.
// Routes: /yacht-charter-mykonos, /yacht-charter-santorini, etc.
//
// Each page targets the high-intent UHNW search "[island] yacht
// charter" — far more specific than the generic "Greece yacht
// charter" head term. Pulls 5-8 matching yachts from Sanity by the
// island's yachtFilter, plus 2-3 sample itineraries from yachts
// that have D.7 sampleItinerary populated (so the same content
// surfaces here AND on yacht detail pages with no duplication).
//
// JSON-LD: Place + BreadcrumbList + FAQPage so AI search engines
// can cite specific facts about each island.

import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ISLANDS, getIslandBySlug } from "@/lib/islands";
import { sanityCardImg, sanityHeroImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import IslandPageTracker from "./IslandPageTracker";

export const revalidate = 3600;
// 2026-05-11 — diagnostic addition. Production build was rendering
// this route as ○ (static, no SSG params). Adding explicit
// dynamicParams flag plus dynamic="force-static" exports to verify
// behaviour. Also log the slugs at module init so build output
// shows whether ISLANDS is populated.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = ISLANDS.map((i) => ({ island: i.slug }));
  // eslint-disable-next-line no-console
  console.log("[generateStaticParams /yacht-charter-[island]]", params.length, "islands:", params.map(p => p.island).join(","));
  return params;
}

export async function generateMetadata({ params }) {
  const { island: islandSlug } = await params;
  const island = getIslandBySlug(islandSlug);
  if (!island) return { title: "Yacht Charter Greece | George Yachts" };
  return {
    title: `Yacht Charter ${island.name} | George Yachts`,
    description: island.whyVisit.slice(0, 158),
    openGraph: {
      title: `Yacht Charter ${island.name} | George Yachts`,
      description: island.whyVisit.slice(0, 158),
      type: "website",
      url: `https://georgeyachts.com/yacht-charter-${island.slug}`,
    },
    alternates: { canonical: `https://georgeyachts.com/yacht-charter-${island.slug}` },
  };
}

async function loadIslandData(island) {
  const yachtQuery = `*[_type == "yacht" && defined(slug.current) && (${island.yachtFilter})] | order(name asc)[0...8]{
    name, "slug": slug.current, length, sleeps,
    weeklyRatePrice, fleetTier, priceModel, subtitle,
    "image": images[0].asset->url
  }`;
  const itineraryQuery = `*[_type == "yacht" && slug.current in $slugs && defined(sampleItinerary.days)]{
    name, "slug": slug.current,
    sampleItinerary{
      totalDistance,
      days[]{ day, distance, from, to, narrative }
    }
  }`;
  const [yachts, itineraries] = await Promise.all([
    sanityClient.fetch(yachtQuery),
    sanityClient.fetch(itineraryQuery, { slugs: island.itineraryYachts || [] }),
  ]);
  return { yachts: yachts || [], itineraries: itineraries || [] };
}

const GOLD = "#C9A84C";

function PlaceJsonLd({ island }) {
  // Phase 5 (2026-05-08, Boss SEO/AI directive) — upgraded to
  // TouristDestination type so AI engines + Google read this as a
  // primary destination entity rather than a generic Place. Includes
  // sub-attractions derived from the curated insider tips so each
  // page exposes a structured tourist-attraction list — strongest
  // citation-friendly form for "things to do in X" queries.
  const subAttractions = (island.insiderTips || []).slice(0, 6).map((tip, i) => ({
    "@type": "TouristAttraction",
    position: i + 1,
    name: tip.split(/[—,.]/)[0].trim().slice(0, 80) || `${island.name} attraction ${i + 1}`,
    description: tip,
    geo: { "@type": "GeoCoordinates", addressCountry: "GR" },
  }));
  const url = `https://georgeyachts.com/yacht-charter-${island.slug}`;
  const json = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${url}#destination`,
    name: `${island.name}, ${island.region}, Greece`,
    alternateName: `Yacht Charter ${island.name}`,
    description: island.whyVisit.slice(0, 300),
    url,
    geo: { "@type": "GeoCoordinates", addressCountry: "GR" },
    touristType: ["UHNW families", "Couples", "Yacht charterers", "Luxury travellers"],
    isAccessibleForFree: false,
    ...(subAttractions.length > 0 ? { includesAttraction: subAttractions } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function FaqJsonLd({ island }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: island.faq.map((f) => ({
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

export default async function IslandPage({ params }) {
  const { island: islandSlug } = await params;
  const island = getIslandBySlug(islandSlug);
  if (!island) notFound();

  const { yachts, itineraries } = await loadIslandData(island);

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
    { name: `Yacht Charter ${island.name}`, url: `https://georgeyachts.com/yacht-charter-${island.slug}` },
  ];

  return (
    <>
      <PlaceJsonLd island={island} />
      <FaqJsonLd island={island} />
      <BreadcrumbSchema items={breadcrumbs} />
      <IslandPageTracker slug={island.slug} name={island.name} />

      <article style={{ background: "#0D1B2A", minHeight: "100vh" }}>
        {/* HERO */}
        <header
          style={{
            background: "linear-gradient(180deg, #0D1B2A 0%, #0D1B2A 100%)",
            padding: "120px 24px 64px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
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
              {island.region} · George Yachts
            </p>
            {/* Phase 27g (Forbes-launch day, 2026-05-06) — added the
                .gy-luxe-enter class so the per-island H1 gets the
                same ivory→champagne gold reveal as the homepage hero.
                Global CSS catch-all already converts Cormorant H1s
                to Cinzel uppercase, and .gy-luxe-enter handles the
                color-shift on top. Boss directive on the regional
                page applies equally to per-island pages. */}
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(56px, 10vw, 130px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
              }}
            >
              Yacht Charter {island.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240,0.78)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {island.tagline}
            </p>
          </div>
        </header>

        {/* WHY THIS ISLAND */}
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
              }}
            >
              Why {island.name}
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 17,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240,0.82)",
                margin: 0,
              }}
            >
              {island.whyVisit}
            </p>
          </div>
        </section>

        {/* BEST YACHTS */}
        {yachts.length > 0 && (
          <section
            style={{
              background: "rgba(201,168,76,0.025)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              padding: "72px 24px",
            }}
          >
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
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
                Yachts Ideal for {island.name}
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 300,
                  color: "#F8F5F0",
                  margin: "0 0 36px",
                  textAlign: "center",
                }}
              >
                {yachts.length} yacht{yachts.length === 1 ? "" : "s"} from the fleet
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
                      background: "rgba(248, 245, 240,0.03)",
                      border: "1px solid rgba(248, 245, 240,0.08)",
                      overflow: "hidden",
                      transition: "border-color 0.3s ease",
                    }}
                    className="g1-yacht-card"
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
                          fontFamily: "var(--gy-font-editorial)",
                          fontSize: 20,
                          fontWeight: 400,
                          color: "#F8F5F0",
                          margin: "0 0 4px",
                        }}
                      >
                        {y.name}
                      </p>
                      {(y.length || y.sleeps) && (
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 11,
                            letterSpacing: "0.12em",
                            color: "rgba(248, 245, 240,0.65)",
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
                              color: isPerPerson(y) ? "rgba(248, 245, 240,0.65)" : GOLD,
                              fontWeight: 600,
                              marginBottom: 2,
                            }}
                          >
                            {priceUnitBadge(y)}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--gy-font-ui)",
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
            </div>
          </section>
        )}

        {/* SAMPLE ITINERARIES */}
        {itineraries.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
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
                Sample Itineraries from {island.name}
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 300,
                  color: "#F8F5F0",
                  margin: "0 0 36px",
                  textAlign: "center",
                }}
              >
                What a week could look like
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {itineraries.map((y) => (
                  <div
                    key={y.slug}
                    style={{
                      border: "1px solid rgba(201,168,76,0.18)",
                      padding: "28px 28px 24px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 9,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: GOLD,
                        fontWeight: 600,
                        margin: "0 0 6px",
                      }}
                    >
                      Aboard {y.name} · {y.sampleItinerary?.totalDistance || ""}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 22,
                        fontWeight: 400,
                        color: "#F8F5F0",
                        margin: "0 0 14px",
                      }}
                    >
                      {(y.sampleItinerary?.days || []).map((d) => d.to).filter(Boolean).slice(0, 3).join(" → ")} →&nbsp;…
                    </h3>
                    <ol style={{ margin: 0, padding: "0 0 0 20px", color: "rgba(248, 245, 240,0.78)", fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7 }}>
                      {(y.sampleItinerary?.days || []).map((d, i) => (
                        <li key={i}>
                          <strong style={{ color: "#F8F5F0" }}>Day {d.day}</strong> · {d.distance ? `${d.distance} · ` : ""}{d.from} → {d.to}
                        </li>
                      ))}
                    </ol>
                    <p style={{ marginTop: 14 }}>
                      <Link
                        href={`/yachts/${y.slug}`}
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
                        Full {y.name} itinerary →
                      </Link>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WHEN TO VISIT */}
        <section
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
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
              }}
            >
              When to Visit {island.name}
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240,0.82)",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: island.seasonality.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8F5F0">$1</strong>') }}
            />
          </div>
        </section>

        {/* INSIDER TIPS */}
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
              }}
            >
              George&apos;s Insider Tips for {island.name}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {island.insiderTips.map((tip, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "rgba(248, 245, 240,0.82)",
                    paddingLeft: 22,
                    position: "relative",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ position: "absolute", left: 0, top: 0, color: GOLD, fontWeight: 700 }}
                  >
                    {i + 1}.
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
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
              Frequently Asked
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 36px",
                textAlign: "center",
              }}
            >
              About chartering in {island.name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {island.faq.map((f, i) => (
                <details
                  key={i}
                  style={{
                    border: "1px solid rgba(248, 245, 240,0.1)",
                    padding: "16px 20px",
                  }}
                >
                  <summary
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 18,
                      color: "#F8F5F0",
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
                      lineHeight: 1.7,
                      color: "rgba(248, 245, 240,0.78)",
                      margin: "12px 0 0",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 32px",
                lineHeight: 1.2,
              }}
            >
              Ready for {island.name}?
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/yacht-finder?region=${encodeURIComponent(island.region)}`}
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "14px 26px",
                  background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                  color: "#0D1B2A",
                  border: "1px solid rgba(201,168,76,0.6)",
                  textDecoration: "none",
                }}
              >
                {island.cta}
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
                  color: "rgba(248, 245, 240,0.85)",
                  border: "1px solid rgba(248, 245, 240,0.3)",
                  textDecoration: "none",
                }}
              >
                Or write to George
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
