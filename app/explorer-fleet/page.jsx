import { sanityClient } from "@/lib/sanity";
import ExplorerFleetClient from "./ExplorerFleetClient";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import Footer from "@/app/components/Footer";

export const revalidate = 3600;

export async function generateMetadata() {
  let low = 11500, high = 27500;
  try {
    // The week, not the week divided by the berths. See the long note further
    // down this file for why the per-person figure came off the site.
    const yachts = await sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["explorer", "both"]]{ weeklyRatePrice }`);
    const wk = yachts.map(y => { const m = String(y.weeklyRatePrice || '').match(/[\d,]+/); return m ? parseInt(m[0].replace(/,/g, '')) : 0; }).filter(Boolean);
    if (wk.length) { low = Math.min(...wk); high = Math.max(...wk); }
  } catch {}
  return {
    // The title said "Skippered Yacht Charter", which is the arrangement this
    // house does not write. It is a weekly crewed charter or it is nothing.
    // 2026-08-30 re-cut. Role: the BROWSE page of the catamaran cluster,
    // ranked cheapest to priciest. The head term "catamaran charter greece"
    // (590/mo, KD 0-14, DataForSEO 30/8) belongs to the pillar at
    // /catamaran-charter-greece; this title leads with the FLEET role so
    // the two never fight - the cannibalisation law.
    title: `Catamaran Fleet Greece: Sailing & Power Cats by Price`,
    description: `Every crewed catamaran in the house, sailing and power together, from €${low.toLocaleString()} to €${high.toLocaleString()} per yacht per week, all-in guidance from George. Ranked cheapest to flagship.`,
    alternates: { canonical: "https://georgeyachts.com/explorer-fleet" },
    openGraph: {
      type: "website",
      title: "Catamaran Fleet | George Yachts",
      description: `Sailing and power catamarans, fully crewed, from €${low.toLocaleString()} to €${high.toLocaleString()} per yacht per week.`,
      url: "https://georgeyachts.com/explorer-fleet",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
      siteName: "George Yachts Brokerage House",
      locale: "en_US",
    },
  };
}

const QUERY = `*[_type == "yacht" && fleetTier in ["explorer", "both"]] | order(weeklyRatePrice asc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

const FALLBACK_QUERY = `*[_type == "yacht"] | order(weeklyRatePrice asc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

function ExplorerFleetSchema({ lowestWeekly }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Catamaran Fleet Yacht Charter",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House", url: "https://georgeyachts.com" },
    areaServed: { "@type": "Place", name: "Greek Waters" },
    description: `Fully crewed sailing and power catamaran charters in Greek waters from €${lowestWeekly} per yacht per week.`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(lowestWeekly),
      priceSpecification: { "@type": "UnitPriceSpecification", price: String(lowestWeekly), priceCurrency: "EUR", unitText: "per yacht per week" },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function ExplorerFleetPage() {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(QUERY);
    if (!yachts.length) yachts = await sanityClient.fetch(FALLBACK_QUERY);
  } catch (e) {
    console.error("Failed to fetch sailing fleet:", e);
    try { yachts = await sanityClient.fetch(FALLBACK_QUERY); } catch {}
  }

  // Extract first number from price string (handles "€21,000 - €28,000" ranges)
  const extractPrice = (yacht) => {
    const match = String(yacht.weeklyRatePrice || '').match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  };

  // 2026-08-21 (section 5). What stood here divided the week by the number of
  // berths, after grossing it up by 27, 32 or 42 percent depending on whether
  // the crew line mentioned a skipper, and published the result as a
  // per-person price. Two things were wrong with it.
  //
  // The number was not a price. Nobody buys a berth: the yacht goes as one
  // yacht, and six people on an eight berth boat pay the eight berth week.
  // And the multipliers were an estimate of VAT and APA dressed as a fact,
  // on a site whose whole argument is that those are itemised in writing
  // rather than guessed at.
  //
  // It also read the crew field for the word "skipper", which is the
  // arrangement George has taken off the site entirely.
  //
  // The week is now simply the week.
  // 2026-08-21 (section 9). A EUR 29,000 ceiling used to sit here, from when
  // this was the Explorer tier and the tier meant "the cheaper half". It is
  // the Catamaran Fleet now, cut by sail against power, and it runs to EUR
  // 65,000: the ceiling was quietly hiding nineteen of its thirty-three
  // yachts, ABOVE & BEYOND among them, which is the most decorated boat in
  // the house.
  const displayYachts = yachts.slice().sort((a, b) => extractPrice(a) - extractPrice(b));

  const weeklyPrices = displayYachts.map(extractPrice).filter(p => p > 0);
  const displayLowest  = weeklyPrices.length ? Math.min(...weeklyPrices) : 11500;
  const displayHighest = weeklyPrices.length ? Math.max(...weeklyPrices) : 27500;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Catamaran Fleet", url: "https://georgeyachts.com/explorer-fleet" },
        ]}
      />
      <ExplorerFleetSchema lowestWeekly={displayLowest} />
      <ExplorerFleetClient yachts={displayYachts} lowestWeekly={displayLowest} highestWeekly={displayHighest} />
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
