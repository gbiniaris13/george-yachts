import { sanityClient } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import PrivateFleetClient from "./PrivateFleetClient";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import Footer from "@/app/components/Footer";

export const revalidate = 3600;

export async function generateMetadata() {
  let low = 13000, high = 180000;
  try {
    const yachts = await sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["private", "both"]]{ weeklyRatePrice }`);
    const prices = yachts.map(y => { const m = String(y.weeklyRatePrice || '').match(/[\d,]+/); return m ? parseInt(m[0].replace(/,/g, '')) : 0; }).filter(Boolean);
    if (prices.length) { low = Math.min(...prices); high = Math.max(...prices); }
  } catch {}
  return {
    // 2026-08-30 re-cut. Role: the fleet/BROWSE page for motor yachts.
    // Target: "luxury motor yacht charter greece" (320/mo, KD 5,
    // DataForSEO 30/8) - unclaimed by any pillar; the head term "crewed
    // motor yacht charter greece" stays with /motor-yacht-charter-greece.
    title: "Motor Yacht Fleet: Luxury Motor Yacht Charter Greece",
    description: `Fully crewed luxury motor yachts in Greek waters, ranked cheapest to flagship - from €${low.toLocaleString()} to €${high.toLocaleString()} per yacht per week. Full crew, total discretion.`,
    alternates: { canonical: "https://georgeyachts.com/private-fleet" },
    openGraph: {
      type: "website",
      title: "Motor Yacht Fleet | George Yachts",
      description: `Your own world at sea. Full crew. Total discretion. From €${low.toLocaleString()} to €${high.toLocaleString()}/week.`,
      url: "https://georgeyachts.com/private-fleet",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
      siteName: "George Yachts Brokerage House",
      locale: "en_US",
    },
  };
}

const QUERY = `*[_type == "yacht" && fleetTier in ["private", "both"]] | order(weeklyRatePrice asc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

const FALLBACK_QUERY = `*[_type == "yacht"] | order(weeklyRatePrice asc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

function PrivateFleetSchema({ lowestPrice, highestPrice, count }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Motor Yacht Fleet Yacht Charter",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House", url: "https://georgeyachts.com" },
    areaServed: { "@type": "Place", name: "Greek Waters" },
    description: `Premium crewed yacht charters in Greek waters. From €${lowestPrice.toLocaleString()} to €${highestPrice.toLocaleString()} per week.`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(lowestPrice),
      highPrice: String(highestPrice),
      offerCount: count,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function PrivateFleetPage() {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(QUERY);
    if (!yachts.length) yachts = await sanityClient.fetch(FALLBACK_QUERY);
  } catch (e) {
    console.error("Failed to fetch private fleet:", e);
    try { yachts = await sanityClient.fetch(FALLBACK_QUERY); } catch {}
  }

  // Extract numeric price from price string (e.g. "€45,000" → 45000)
  const extractPrice = (yacht) => {
    const match = String(yacht.weeklyRatePrice || '').match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  };

  // 2026-08-30, George's re-cut spec: cheapest first, flagship last -
  // the ladder a browsing buyer climbs, same rule as the Catamaran
  // Fleet. (The old flagship-first ordering belonged to the "Private
  // Fleet" positioning that no longer exists.)
  const FLAGSHIP_NAMES = ["la pellegrina"];

  const isFlagship = (yacht) =>
    FLAGSHIP_NAMES.some((f) => (yacht.name || "").toLowerCase().includes(f));

  const flagships = [];
  // Unpriced hulls (Rate on application) sort to the TOP of the ladder's
  // end, not to position zero: a missing number means "ask", not "free".
  const rest = yachts
    .slice()
    .sort((a, b) => (extractPrice(a) || Infinity) - (extractPrice(b) || Infinity));
  const displayYachts = [...flagships, ...rest];

  // Dynamic price range — auto-updates as fleet grows
  const prices = displayYachts.map(extractPrice).filter(p => p > 0 && p < 999999);
  const lowestPrice  = prices.length ? Math.min(...prices) : 30000;
  const highestPrice = prices.length ? Math.max(...prices) : 235000;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Motor Yacht Fleet", url: "https://georgeyachts.com/private-fleet" },
        ]}
      />
      <PrivateFleetSchema lowestPrice={lowestPrice} highestPrice={highestPrice} count={displayYachts.length} />
      <PrivateFleetClient yachts={displayYachts} lowestPrice={lowestPrice} highestPrice={highestPrice} />
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
