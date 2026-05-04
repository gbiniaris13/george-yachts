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

export const revalidate = 3600;

export async function generateStaticParams() {
  return ISLANDS.map((i) => ({ island: i.slug }));
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

const GOLD = "#DAA520";

function PlaceJsonLd({ island }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${island.name}, ${island.region}, Greece`,
    description: island.whyVisit.slice(0, 300),
    url: `https://georgeyachts.com/yacht-charter-${island.slug}`,
    isAccessibleForFree: false,
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

      <article style={{ background: "#000", minHeight: "100vh" }}>
        {/* HERO */}
        <header
          style={{
            background: "linear-gradient(180deg, #0a0a0a 0%, #000 100%)",
            padding: "120px 24px 64px",
            borderBottom: "1px solid rgba(218,165,32,0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
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
              {island.region} · George Yachts
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 300,
                color: "#fff",
                margin: "0 0 16px",
                lineHeight: 1.1,
              }}
            >
              Yacht Charter {island.name}
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.78)",
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
                fontFamily: "'Montserrat', sans-serif",
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
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 17,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.82)",
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
              background: "rgba(218,165,32,0.025)",
              borderTop: "1px solid rgba(218,165,32,0.15)",
              borderBottom: "1px solid rgba(218,165,32,0.15)",
              padding: "72px 24px",
            }}
          >
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
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
                Yachts Ideal for {island.name}
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
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
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
                          ? `#0a0a0a url(${sanityCardImg(y.image, 600)}) center/cover no-repeat`
                          : "#0a0a0a",
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
            </div>
          </section>
        )}

        {/* SAMPLE ITINERARIES */}
        {itineraries.length > 0 && (
          <section style={{ padding: "72px 24px" }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>
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
                Sample Itineraries from {island.name}
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
                What a week could look like
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {itineraries.map((y) => (
                  <div
                    key={y.slug}
                    style={{
                      border: "1px solid rgba(218,165,32,0.18)",
                      padding: "28px 28px 24px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
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
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 22,
                        fontWeight: 400,
                        color: "#fff",
                        margin: "0 0 14px",
                      }}
                    >
                      {(y.sampleItinerary?.days || []).map((d) => d.to).filter(Boolean).slice(0, 3).join(" → ")} →&nbsp;…
                    </h3>
                    <ol style={{ margin: 0, padding: "0 0 0 20px", color: "rgba(255,255,255,0.78)", fontFamily: "'Lato', 'Montserrat', sans-serif", fontSize: 14, lineHeight: 1.7 }}>
                      {(y.sampleItinerary?.days || []).map((d, i) => (
                        <li key={i}>
                          <strong style={{ color: "#fff" }}>Day {d.day}</strong> · {d.distance ? `${d.distance} · ` : ""}{d.from} → {d.to}
                        </li>
                      ))}
                    </ol>
                    <p style={{ marginTop: 14 }}>
                      <Link
                        href={`/yachts/${y.slug}`}
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
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
            background: "rgba(218,165,32,0.025)",
            borderTop: "1px solid rgba(218,165,32,0.15)",
            borderBottom: "1px solid rgba(218,165,32,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
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
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 16,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.82)",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: island.seasonality.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>') }}
            />
          </div>
        </section>

        {/* INSIDER TIPS */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
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
                    fontFamily: "'Lato', 'Montserrat', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.82)",
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
            background: "rgba(218,165,32,0.025)",
            borderTop: "1px solid rgba(218,165,32,0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              Frequently Asked
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
              About chartering in {island.name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {island.faq.map((f, i) => (
                <details
                  key={i}
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "16px 20px",
                  }}
                >
                  <summary
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 18,
                      color: "#fff",
                      cursor: "pointer",
                      listStyle: "none",
                      fontWeight: 400,
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      fontFamily: "'Lato', 'Montserrat', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.78)",
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
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#fff",
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
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "14px 26px",
                  background: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                  color: "#0a1a2f",
                  border: "1px solid rgba(218,165,32,0.6)",
                  textDecoration: "none",
                }}
              >
                {island.cta}
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
    </>
  );
}
