// /yacht-charter/[region] — region-targeted SEO landing pages.
//
// Why these pages exist:
//   1. High-volume target queries: "yacht charter Cyclades",
//      "yacht charter Ionian", "yacht charter Saronic", etc. Each has
//      thousands of monthly searches and our charter-yacht-greece
//      umbrella page can't dominate all of them simultaneously.
//   2. AI grounding: ChatGPT/Perplexity asked "yacht charter Cyclades"
//      need to cite a specific authoritative regional page, not the
//      umbrella. These pages are written specifically for that prompt.
//   3. Internal linking: blog posts can deep-link to the region page
//      for "Cyclades" / "Ionian" mentions instead of all going to
//      /inquiry — better topical clustering signal for Google.
//
// 4 regions live: Cyclades, Ionian, Saronic, Sporades. To add more
// (Dodecanese, etc.), append to REGION_DATA + Sanity will start
// returning yachts that match cruisingRegion automatically.

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import Footer from "@/app/components/Footer";

export const revalidate = 3600;

const REGION_DATA = {
  cyclades: {
    title: "Yacht Charter Cyclades",
    h1: "Yacht Charter — Cyclades",
    metaTitle: "Yacht Charter Cyclades 2026 | Mykonos · Santorini · Paros",
    metaDescription:
      "Crewed yacht charter across the Cyclades — Mykonos, Santorini, Paros, Milos, Naxos. Real broker advice from George Yachts (IYBA member). 2026 rates, weather notes, itineraries.",
    intro:
      "The Cyclades — Mykonos, Santorini, Paros, Milos, Naxos, Ios, Folegandros, Antiparos — is the most photographed yacht charter region in the world. It is also the most weather-dependent: the Meltemi wind shapes every itinerary July through August. We charter here every week of the season and write the itineraries that account for the weather, not the brochure.",
    queries: [
      "yacht charter Cyclades",
      "Mykonos yacht charter",
      "Santorini yacht charter",
      "crewed catamaran Cyclades",
      "Paros yacht charter",
    ],
    bestFor:
      "First-time charterers wanting iconic scenery + UHNW guests requesting maximum privacy in coves like Antiparos and Despotiko. Best months: late May–June and September–early October (calmer winds, lower rates).",
    weatherNote:
      "The Meltemi (NW seasonal wind) blows strongest mid-July through end-August, occasionally Force 6–7. The right captain re-routes around it; the wrong captain locks you in port. We staff the right captains.",
    sanityRegionMatch: ["Cyclades", "Cyclades, Greece", "Greek Islands"],
  },
  ionian: {
    title: "Yacht Charter Ionian",
    h1: "Yacht Charter — Ionian Islands",
    metaTitle: "Yacht Charter Ionian Islands 2026 | Corfu · Lefkada · Kefalonia",
    metaDescription:
      "Crewed yacht charter in the Ionian — Corfu, Lefkada, Kefalonia, Zakynthos, Ithaca. Calm waters, family-friendly. George Yachts IYBA broker advice + 2026 rates.",
    intro:
      "The Ionian is the calm-waters Greek charter region. Corfu, Lefkada, Kefalonia, Zakynthos, Ithaca, Paxos — short hops, sheltered anchorages, family-friendly conditions. Where the Cyclades demand weather-aware planning, the Ionian forgives. The trade-off: less of the iconic white-and-blue Cycladic scenery, more pine-fringed coves and Italian-influenced architecture.",
    queries: [
      "yacht charter Ionian",
      "Corfu yacht charter",
      "Lefkada yacht charter",
      "Kefalonia yacht charter",
      "family yacht charter Greece",
    ],
    bestFor:
      "Families with young children, multi-generational groups, first-time charterers anxious about seasickness. Best months: late May–early October. Almost no Meltemi this side of mainland Greece.",
    weatherNote:
      "Localized afternoon thermals occasionally, but no equivalent of the Cycladic Meltemi. Most days flat-calm mornings, light afternoon breezes — ideal for sailing and water-sports days.",
    sanityRegionMatch: ["Ionian", "Ionian Islands", "Ionian, Greece"],
  },
  saronic: {
    title: "Yacht Charter Saronic Gulf",
    h1: "Yacht Charter — Saronic Gulf",
    metaTitle: "Yacht Charter Saronic Gulf 2026 | Hydra · Spetses · Aegina",
    metaDescription:
      "Crewed yacht charter in the Saronic Gulf — Hydra, Spetses, Aegina, Poros. The 5-day Greek charter that starts 45 minutes from Athens airport.",
    intro:
      "The Saronic Gulf — Hydra, Spetses, Aegina, Poros, Agistri — is the closest charter region to Athens, which makes it the smartest choice for short charters (3–5 nights) or guests with limited time. From Athens airport you can land at noon and be aboard by 1:30 PM. Hydra has no cars and no high-rises; Spetses keeps the same scale; Aegina serves the best fish in the Saronic.",
    queries: [
      "yacht charter Saronic",
      "Hydra yacht charter",
      "Spetses yacht charter",
      "Aegina yacht charter",
      "short yacht charter Athens",
    ],
    bestFor:
      "Time-constrained UHNW clients, Athens-arrival families, first-time charterers wanting a sample before committing to a 7+ day Cyclades trip. Best months: April–October — the Saronic season runs longer than the Cyclades.",
    weatherNote:
      "Sheltered enough for almost any conditions. Even when the Aegean Meltemi peaks, the Saronic stays sailable. Water temps are charter-friendly from May.",
    sanityRegionMatch: ["Saronic", "Saronic Gulf", "Saronic, Greece"],
  },
  sporades: {
    title: "Yacht Charter Sporades",
    h1: "Yacht Charter — Sporades",
    metaTitle: "Yacht Charter Sporades 2026 | Skiathos · Skopelos · Alonissos",
    metaDescription:
      "Crewed yacht charter in the Sporades — Skiathos, Skopelos, Alonissos, Skyros. Pine-fringed anchorages, the Mamma Mia! coastline. George Yachts IYBA broker advice.",
    intro:
      "The Sporades — Skiathos, Skopelos, Alonissos, Skyros — is the Greek charter region tourists know least and brokers love most. Pine-fringed anchorages, the Mediterranean's only marine national park (Alonissos), the Mamma Mia! coastline, and water clearer than the Cyclades. Embarkation is via Skiathos (small international airport) or Volos (mainland, ferry connection).",
    queries: [
      "yacht charter Sporades",
      "Skiathos yacht charter",
      "Skopelos yacht charter",
      "Alonissos yacht charter",
      "quiet yacht charter Greece",
    ],
    bestFor:
      "UHNW clients seeking total privacy, repeat charterers who have done the Cyclades + Ionian and want something different, environmentally conscious travelers (Alonissos marine park).",
    weatherNote:
      "Calmer than the Cyclades. The Sporades catches the tail end of north winds but in lighter form. Water visibility is the best of any Greek region — 30+ meters in summer.",
    sanityRegionMatch: ["Sporades", "Sporades, Greece"],
  },
};

const ALLOWED_REGIONS = Object.keys(REGION_DATA);

export async function generateStaticParams() {
  return ALLOWED_REGIONS.map((region) => ({ region }));
}

export async function generateMetadata({ params }) {
  const { region } = await params;
  const data = REGION_DATA[region];
  if (!data) return { title: "Region Not Found" };
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://georgeyachts.com/yacht-charter/${region}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://georgeyachts.com/yacht-charter/${region}`,
      type: "website",
    },
  };
}

const REGION_YACHTS_QUERY = `*[_type == "yacht" && cruisingRegion in $regionMatches] | order(weeklyRatePrice desc)[0...8]{
  _id, name, subtitle, length, sleeps, cabins, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

function ServiceSchema({ region, data, yachtCount }) {
  const url = `https://georgeyachts.com/yacht-charter/${region}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Crewed Yacht Charter",
    name: data.title,
    description: data.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House",
    },
    areaServed: {
      "@type": "Place",
      name: data.h1.replace("Yacht Charter — ", ""),
      address: { "@type": "PostalAddress", addressCountry: "GR" },
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: 13000,
      highPrice: 500000,
      offerCount: yachtCount,
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function RegionPage({ params }) {
  const { region } = await params;
  const data = REGION_DATA[region];
  if (!data) notFound();

  let yachts = [];
  try {
    yachts = await sanityClient.fetch(REGION_YACHTS_QUERY, {
      regionMatches: data.sanityRegionMatch,
    });
  } catch (e) {
    console.error("Region yachts fetch failed:", e);
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Yacht Charter Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
          {
            name: data.title,
            url: `https://georgeyachts.com/yacht-charter/${region}`,
          },
        ]}
      />
      <ServiceSchema region={region} data={data} yachtCount={yachts.length || 60} />

      {/*
        Phase 27g (Forbes-launch day, 2026-05-06) — Boss flagged
        "άσχημο, φτιάξ' το". Old layout used plain Cormorant + raw
        Tailwind cards with rounded corners. Rewritten to match the
        rest of the site's editorial language:
          • Cinzel uppercase + 24K champagne-gold .gy-luxe-enter h1
          • Gold rules (top + bottom) framing the masthead
          • Sharp-cornered cards with gold inset border (Aman/Bulgari)
          • Lato/Cormorant editorial body
          • Generous whitespace
          • Premium CTA pair (ghost + gold-fill) matching home hero
      */}
      <main className="bg-black text-white min-h-screen">
        {/* Hero band — full editorial masthead with gold rules */}
        <section
          style={{
            paddingTop: "clamp(120px, 14vw, 200px)",
            paddingBottom: "clamp(48px, 6vw, 80px)",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 60%), #0D1B2A",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "0 clamp(20px, 4vw, 56px)",
              textAlign: "center",
            }}
          >
            {/* Top gold rule */}
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: "clamp(120px, 30vw, 280px)",
                height: 1,
                margin: "0 auto 28px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)",
              }}
            />
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                margin: "0 0 22px",
                textShadow: "0 0 10px rgba(201,168,76,0.32)",
              }}
            >
              Greek Waters · Region Guide
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily:
                  "var(--font-cinzel), 'Cinzel', 'Trajan Pro', Georgia, serif",
                fontSize: "clamp(38px, 7vw, 92px)",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: 1.05,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 32px",
              }}
            >
              {data.h1}
            </h1>
            {/* Bottom gold rule */}
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: 60,
                height: 1,
                margin: "0 auto 32px",
                background: "rgba(201,168,76,0.55)",
              }}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.7vw, 22px)",
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.78)",
                fontWeight: 300,
                margin: "0 auto",
                maxWidth: "62ch",
              }}
            >
              {data.intro}
            </p>
          </div>
        </section>

        {/* Best fit / Weather — editorial pair */}
        <section
          style={{
            padding: "clamp(40px, 6vw, 72px) clamp(20px, 4vw, 56px)",
            background: "#0D1B2A",
            borderTop: "1px solid rgba(201,168,76,0.18)",
            borderBottom: "1px solid rgba(201,168,76,0.18)",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(20px, 3vw, 40px)",
            }}
          >
            {[
              { label: "Best fit", body: data.bestFor },
              { label: "Weather note", body: data.weatherNote },
            ].map((card) => (
              <article
                key={card.label}
                style={{
                  padding: "clamp(28px, 4vw, 44px)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,168,76,0.22)",
                  position: "relative",
                }}
              >
                {/* Gold inset accent — top-left corner mark */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    width: 22,
                    height: 22,
                    borderTop: "1px solid rgba(201,168,76,0.55)",
                    borderLeft: "1px solid rgba(201,168,76,0.55)",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                    fontWeight: 600,
                    margin: "0 0 18px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Lato', 'Montserrat', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "rgba(248,245,240,0.82)",
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Yachts in this region */}
        {yachts.length > 0 && (
          <section
            style={{
              padding: "clamp(56px, 8vw, 96px) clamp(20px, 4vw, 56px)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  fontWeight: 600,
                  margin: "0 0 14px",
                  textAlign: "center",
                }}
              >
                The fleet — {data.h1.replace("Yacht Charter — ", "")}
              </p>
              <h2
                style={{
                  fontFamily:
                    "var(--font-cinzel), 'Cinzel', 'Trajan Pro', Georgia, serif",
                  fontSize: "clamp(26px, 4vw, 42px)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  color: "#F8F5F0",
                  margin: "0 0 56px",
                }}
              >
                Selected yachts in these waters
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "clamp(18px, 2.5vw, 28px)",
                }}
              >
                {yachts.map((y) => (
                  <Link
                    key={y._id}
                    href={`/yachts/${y.slug}`}
                    className="group"
                    style={{
                      display: "block",
                      background: "#0D1B2A",
                      border: "1px solid rgba(255,255,255,0.06)",
                      textDecoration: "none",
                      transition:
                        "border-color 0.5s ease, transform 0.5s ease",
                    }}
                  >
                    {y.imageUrl && (
                      <div
                        style={{
                          aspectRatio: "4 / 3",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={y.imageUrl}
                          alt={`${y.name} yacht charter ${data.h1.replace("Yacht Charter — ", "")}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          style={{
                            objectFit: "cover",
                            transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                          }}
                          className="group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div style={{ padding: "20px 22px 22px" }}>
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 22,
                          fontWeight: 400,
                          color: "#F8F5F0",
                          margin: "0 0 6px",
                          letterSpacing: "0.005em",
                        }}
                      >
                        {y.name}
                      </h3>
                      {y.subtitle && (
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 9,
                            letterSpacing: "0.28em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.45)",
                            margin: "0 0 12px",
                            fontWeight: 500,
                          }}
                        >
                          {y.subtitle}
                        </p>
                      )}
                      <div
                        style={{
                          fontFamily: "'Lato', 'Montserrat', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.6)",
                          lineHeight: 1.7,
                        }}
                      >
                        {y.length && <div>{y.length}</div>}
                        {y.sleeps && (
                          <div>
                            Sleeps {y.sleeps}
                            {y.cabins ? ` · ${y.cabins} cabins` : ""}
                          </div>
                        )}
                        {y.weeklyRatePrice && (
                          <div
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 11,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "#C9A84C",
                              fontWeight: 600,
                              marginTop: 12,
                            }}
                          >
                            {y.weeklyRatePrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Common questions — editorial chips */}
        <section
          style={{
            padding: "clamp(40px, 6vw, 72px) clamp(20px, 4vw, 56px)",
            background: "#0D1B2A",
            borderTop: "1px solid rgba(201,168,76,0.18)",
          }}
        >
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily:
                  "var(--font-cinzel), 'Cinzel', 'Trajan Pro', Georgia, serif",
                fontSize: "clamp(24px, 3.4vw, 36px)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                color: "#F8F5F0",
                margin: "0 0 36px",
              }}
            >
              Common questions
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              {data.queries.map((q) => (
                <Link
                  key={q}
                  href="/inquiry"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "18px 22px",
                    background: "transparent",
                    border: "1px solid rgba(201,168,76,0.22)",
                    color: "rgba(248,245,240,0.82)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 17,
                    fontStyle: "italic",
                    textDecoration: "none",
                    transition: "border-color 0.4s ease, color 0.4s ease",
                  }}
                >
                  <span>{q}</span>
                  <span style={{ color: "#C9A84C", fontWeight: 600 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA pair — ghost + gold-fill, same as homepage hero */}
        <section
          style={{
            padding: "clamp(56px, 8vw, 96px) clamp(20px, 4vw, 56px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.4vw, 28px)",
              color: "rgba(248,245,240,0.78)",
              fontWeight: 300,
              margin: "0 auto 36px",
              maxWidth: "44ch",
            }}
          >
            Tell George what you have in mind. A reply within 24 hours.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/inquiry"
              className="gy-shimmer-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "18px 36px",
                minHeight: 52,
                background:
                  "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                color: "#0D1B2A",
                fontFamily:
                  "var(--font-cinzel), 'Cinzel', 'Trajan Pro', 'Montserrat', sans-serif",
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid rgba(201,168,76,0.7)",
                boxShadow:
                  "0 14px 35px -10px rgba(201,168,76,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              Brief George — reply within 24h →
            </Link>
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="gy-cta-ghost"
            >
              Book a 30-min call
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
