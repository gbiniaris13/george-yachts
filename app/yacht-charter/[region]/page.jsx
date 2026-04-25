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

      <main className="bg-black text-white min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-24">
          <header className="mb-12">
            <p className="text-[#DAA520] text-sm tracking-[0.3em] uppercase mb-4">
              Greek Waters · Region Guide
            </p>
            <h1 className="font-cormorant text-5xl md:text-6xl font-light leading-tight">
              {data.h1}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-3xl leading-relaxed">
              {data.intro}
            </p>
          </header>

          {/* Best for / Weather note */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="border border-white/10 rounded-lg p-6">
              <h2 className="font-cormorant text-2xl text-[#DAA520] mb-3">
                Best fit
              </h2>
              <p className="text-white/80 leading-relaxed text-sm">
                {data.bestFor}
              </p>
            </div>
            <div className="border border-white/10 rounded-lg p-6">
              <h2 className="font-cormorant text-2xl text-[#DAA520] mb-3">
                Weather note
              </h2>
              <p className="text-white/80 leading-relaxed text-sm">
                {data.weatherNote}
              </p>
            </div>
          </div>

          {/* Yachts in this region */}
          {yachts.length > 0 && (
            <section className="mb-16">
              <h2 className="font-cormorant text-3xl mb-6">
                Yachts available for {data.h1.replace("Yacht Charter — ", "")} charter
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {yachts.map((y) => (
                  <Link
                    key={y._id}
                    href={`/yachts/${y.slug}`}
                    className="block group border border-white/10 rounded-lg overflow-hidden hover:border-[#DAA520] transition"
                  >
                    {y.imageUrl && (
                      <div className="aspect-[4/3] relative bg-white/5">
                        <Image
                          src={y.imageUrl}
                          alt={`${y.name} yacht charter ${data.h1.replace("Yacht Charter — ", "")}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-cormorant text-xl text-white group-hover:text-[#DAA520] transition">
                        {y.name}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 mb-2">{y.subtitle}</p>
                      <div className="text-xs text-white/60 space-y-1">
                        {y.length && <div>{y.length}</div>}
                        {y.sleeps && <div>Sleeps {y.sleeps}{y.cabins ? ` · ${y.cabins} cabins` : ""}</div>}
                        {y.weeklyRatePrice && (
                          <div className="text-[#DAA520] font-semibold mt-2">
                            {y.weeklyRatePrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* High-intent query crosslink */}
          <section className="mb-16">
            <h2 className="font-cormorant text-3xl mb-6">Common questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.queries.map((q) => (
                <Link
                  key={q}
                  href="/inquiry"
                  className="border border-white/10 rounded-lg p-4 text-sm text-white/70 hover:border-[#DAA520] hover:text-[#DAA520] transition"
                >
                  {q} →
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/inquiry"
              className="text-center bg-[#DAA520] text-black font-semibold uppercase tracking-widest text-sm py-4 px-8 rounded hover:bg-[#C9A24D] transition"
            >
              Start an inquiry →
            </Link>
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center border border-[#DAA520] text-[#DAA520] font-semibold uppercase tracking-widest text-sm py-4 px-8 rounded hover:bg-[#DAA520]/10 transition"
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
