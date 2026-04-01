import { sanityClient } from "@/lib/sanity";
import ExplorerFleetClient from "./ExplorerFleetClient";

export const revalidate = 3600;

export const metadata = {
  title: "Explorer Fleet | Yacht Charter Greece from €1,200/person | George Yachts",
  description: "More islands. More adventure. The smart way to see Greece. Group yacht charters from €1,200 per person per week.",
  openGraph: {
    title: "Explorer Fleet | George Yachts",
    description: "More islands. More adventure. The smart way to see Greece.",
    url: "https://georgeyachts.com/explorer-fleet",
  },
};

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

function ExplorerFleetSchema({ lowestPerPerson }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Explorer Fleet Yacht Charter",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House", url: "https://georgeyachts.com" },
    areaServed: { "@type": "Place", name: "Greek Waters" },
    description: `Group yacht charters in Greece from €${lowestPerPerson} per person. The smart way to see the islands.`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(lowestPerPerson),
      priceSpecification: { "@type": "UnitPriceSpecification", price: String(lowestPerPerson), priceCurrency: "EUR", unitText: "per person" },
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
    console.error("Failed to fetch explorer fleet:", e);
    try { yachts = await sanityClient.fetch(FALLBACK_QUERY); } catch {}
  }

  // Extract first number from price string (handles "€21,000 - €28,000" ranges)
  const extractPrice = (yacht) => {
    const match = String(yacht.weeklyRatePrice || '').match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  };

  // Calculate all-in per-person price (VAT + APA + skipper where applicable)
  // Mirrors the logic in ExplorerFleetClient.jsx
  const calcPerPerson = (yacht) => {
    const basePrice = extractPrice(yacht);
    if (basePrice === 0) return 0; // "Contact for rates" → keep
    const rawLower = String(yacht.weeklyRatePrice || '').toLowerCase();
    const crewLower = String(yacht.crew || '').toLowerCase();
    const guests = parseInt(yacht.sleeps) || 8;
    let total;
    if (rawLower.includes('plus skipper') || rawLower.includes('skipper')) {
      total = Math.round(basePrice * 1.32) + 1400;
    } else if (crewLower.includes('optional')) {
      total = Math.round(basePrice * 1.27);
    } else {
      total = Math.round(basePrice * 1.42);
    }
    return Math.round(total / guests);
  };

  const displayYachts = yachts
    .filter(y => {
      const charterPrice = extractPrice(y);
      if (charterPrice > 29000) return false; // hard cap: no yacht >€29k/week in Explorer
      const pp = calcPerPerson(y);
      return pp === 0 || pp <= 2500; // 0 = "Contact for rates" → keep; else cap at €2,500/person
    })
    .sort((a, b) => extractPrice(a) - extractPrice(b));

  // Per-person price range (same formula as card display: base ÷ guests)
  const perPersonPrices = displayYachts
    .map(y => {
      const base = extractPrice(y);
      if (base === 0) return null;
      const guests = parseInt(y.sleeps) || 8;
      return Math.round(base / guests);
    })
    .filter(Boolean);

  const displayLowest  = perPersonPrices.length ? Math.min(...perPersonPrices) : 420;
  const displayHighest = perPersonPrices.length ? Math.max(...perPersonPrices) : 1800;

  return (
    <>
      <ExplorerFleetSchema lowestPerPerson={displayLowest} />
      <ExplorerFleetClient yachts={displayYachts} lowestPerPerson={displayLowest} highestPerPerson={displayHighest} />
    </>
  );
}
