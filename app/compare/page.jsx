// /compare — yacht-vs-yacht side-by-side comparison.
//
// Why this page exists:
//   1. AI traffic magnet. Queries like "Genny vs La Pellegrina yacht
//      charter" or "best 5-cabin catamaran charter Greece" land here.
//      ChatGPT/Perplexity love comparison tables — they cite them
//      verbatim because the structure is unambiguous.
//   2. Mid-funnel conversion. Visitors who already know which yachts
//      they're considering get a clean side-by-side instead of
//      flipping between yacht detail pages.
//   3. Rich result eligibility. Emits ItemList + multiple Product
//      schemas so Google can render carousel-style results in SERP.
//
// URL: /compare?yachts=slug1,slug2,slug3 (2-4 yachts).
//   /compare with no params shows curated featured comparisons +
//   instructions to start a comparison from any yacht detail page.

import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const revalidate = 3600;

const MAX_YACHTS = 4;

const FEATURED_COMPARISONS = [
  {
    title: "Premium Catamarans (Cyclades-ready, 8+ guests)",
    slugs: ["genny", "altaia"],
    description: "The two most-requested 80-foot+ catamarans for Cyclades family charters in 2026.",
  },
  {
    title: "Flagship Motor Yachts",
    slugs: ["la-pellegrina", "filotimo"],
    description: "When a guest count of 10+ and full crew matter more than budget — head-to-head on space, range, and toys.",
  },
  {
    title: "Sailing Yacht vs Catamaran (Saronic Gulf)",
    slugs: ["genny", "filotimo"],
    description: "The honest sailing-yacht-or-catamaran question for first-time charterers in the Saronic and Argo-Saronic.",
  },
];

function parseSlugs(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_YACHTS);
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const slugs = parseSlugs(params?.yachts);
  if (slugs.length === 0) {
    return {
      title: "Compare Yachts for Charter in Greece",
      description:
        "Side-by-side comparison of luxury yachts available for charter in Greek waters. Specs, weekly rates, regions, and capacity — built by working brokers at George Yachts.",
      alternates: { canonical: "https://georgeyachts.com/compare" },
    };
  }
  const yachts = await sanityClient.fetch(
    `*[_type == "yacht" && slug.current in $slugs]{ name, subtitle }`,
    { slugs },
  );
  const names = yachts.map((y) => y.name).join(" vs ");
  const titleNames = names || "Yachts";
  return {
    title: `${titleNames} — Side-by-Side Charter Comparison`,
    description: `Honest specs and weekly-rate comparison of ${titleNames} for crewed charter in Greek waters. Built by IYBA-member brokers at George Yachts.`,
    alternates: {
      canonical: `https://georgeyachts.com/compare?yachts=${slugs.join(",")}`,
    },
    openGraph: {
      title: `${titleNames} — Charter Comparison`,
      description: `Side-by-side charter comparison by IYBA brokers. ${titleNames}.`,
      url: `https://georgeyachts.com/compare?yachts=${slugs.join(",")}`,
      type: "website",
    },
  };
}

function ComparisonSchema({ yachts, slugs }) {
  if (!yachts || yachts.length === 0) return null;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Yacht Charter Comparison — ${yachts.map((y) => y.name).join(" vs ")}`,
    description: `Side-by-side specs comparison of ${yachts.length} luxury yachts available for charter in Greek waters.`,
    url: `https://georgeyachts.com/compare?yachts=${slugs.join(",")}`,
    numberOfItems: yachts.length,
    itemListElement: yachts.map((y, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://georgeyachts.com/yachts/${y.slug?.current || ""}`,
      name: y.name,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

const COMPARE_QUERY = `*[_type == "yacht" && slug.current in $slugs]{
  _id, name, subtitle, length, sleeps, cabins, crew, builder, yearBuiltRefit,
  cruisingRegion, weeklyRatePrice, maxSpeed, cruiseSpeed, features, toys,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

const SPEC_ROWS = [
  { key: "weeklyRatePrice", label: "Weekly rate" },
  { key: "length", label: "Length" },
  { key: "sleeps", label: "Sleeps" },
  { key: "cabins", label: "Cabins" },
  { key: "crew", label: "Crew" },
  { key: "builder", label: "Builder" },
  { key: "yearBuiltRefit", label: "Year / refit" },
  { key: "cruisingRegion", label: "Cruising region" },
  { key: "maxSpeed", label: "Max speed" },
  { key: "cruiseSpeed", label: "Cruise speed" },
];

function FeaturedComparisons() {
  return (
    <div className="space-y-6">
      <p className="text-white/70 max-w-2xl">
        Pick a yacht detail page and use the &ldquo;Compare&rdquo; option, or
        start with one of the broker-curated comparisons below. To compare any
        2-4 yachts directly, append slugs to the URL:
        <code className="ml-2 text-[#DAA520] text-sm">
          /compare?yachts=genny,altaia
        </code>
      </p>
      {FEATURED_COMPARISONS.map((c) => (
        <Link
          key={c.title}
          href={`/compare?yachts=${c.slugs.join(",")}`}
          className="block border border-white/10 rounded-lg p-6 hover:border-[#DAA520] transition"
        >
          <h2 className="font-cormorant text-2xl text-[#DAA520] mb-2">
            {c.title}
          </h2>
          <p className="text-white/70 text-sm">{c.description}</p>
          <span className="mt-3 inline-block text-xs text-[#DAA520] tracking-widest uppercase">
            View comparison →
          </span>
        </Link>
      ))}
    </div>
  );
}

export default async function ComparePage({ searchParams }) {
  const params = await searchParams;
  const slugs = parseSlugs(params?.yachts);

  const yachts = slugs.length
    ? await sanityClient.fetch(COMPARE_QUERY, { slugs })
    : [];

  // Preserve order from URL params (Sanity returns by id otherwise)
  const yachtsByOrder = slugs
    .map((s) => yachts.find((y) => y.slug === s))
    .filter(Boolean);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Compare", url: "https://georgeyachts.com/compare" },
        ]}
      />
      <ComparisonSchema yachts={yachtsByOrder} slugs={slugs} />

      <main className="bg-black text-white min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-24">
          <header className="mb-16">
            <p className="text-[#DAA520] text-sm tracking-[0.3em] uppercase mb-4">
              Side-by-side
            </p>
            <h1 className="font-cormorant text-5xl md:text-6xl font-light leading-tight">
              {yachtsByOrder.length > 0
                ? yachtsByOrder.map((y) => y.name).join(" vs ")
                : "Compare yachts head-to-head"}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              {yachtsByOrder.length > 0
                ? `Honest specs comparison built by working IYBA brokers — no marketing copy, just the numbers and notes that matter for ${yachtsByOrder.length === 2 ? "either" : "any"} charter in Greek waters.`
                : "Compare any 2-4 yachts in our curated fleet on weekly rate, capacity, region, builder, and toys. Start with one of the broker-curated comparisons below or build your own."}
            </p>
          </header>

          {yachtsByOrder.length === 0 ? (
            <FeaturedComparisons />
          ) : (
            <>
              {/* Header strip with images + names */}
              <div className="grid gap-6 mb-12" style={{ gridTemplateColumns: `200px repeat(${yachtsByOrder.length}, minmax(0, 1fr))` }}>
                <div />
                {yachtsByOrder.map((y) => (
                  <Link key={y._id} href={`/yachts/${y.slug}`} className="group">
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-white/5 mb-3">
                      {y.imageUrl ? (
                        <Image
                          src={y.imageUrl}
                          alt={`${y.name} — luxury yacht charter Greek waters`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      ) : null}
                    </div>
                    <h2 className="font-cormorant text-2xl text-white group-hover:text-[#DAA520] transition">
                      {y.name}
                    </h2>
                    <p className="text-xs text-white/50 mt-1">{y.subtitle}</p>
                  </Link>
                ))}
              </div>

              {/* Spec rows */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {SPEC_ROWS.map((row, idx) => (
                      <tr
                        key={row.key}
                        className={idx % 2 === 0 ? "bg-white/[0.02]" : ""}
                      >
                        <td className="p-4 text-sm text-white/50 uppercase tracking-wider w-[200px] align-top">
                          {row.label}
                        </td>
                        {yachtsByOrder.map((y) => (
                          <td
                            key={y._id}
                            className="p-4 text-white/90 align-top text-sm"
                          >
                            {y[row.key] || <span className="text-white/30">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CTA strip */}
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
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

              <p className="mt-8 text-xs text-white/40 text-center">
                Specs are accurate at the time of last yacht inspection.
                Weekly rates exclude APA (typically 25-35%) and 12% VAT on
                Greek-water itineraries. For final availability and rate
                confirmation, contact a working broker.
              </p>
            </>
          )}
        </section>
      </main>
    </>
  );
}
