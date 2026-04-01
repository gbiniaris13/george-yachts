import { sanityClient } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import PrivateFleetClient from "./PrivateFleetClient";

export const revalidate = 3600;

export const metadata = {
  title: "Private Fleet | Luxury Yacht Charter Greece | George Yachts",
  description: "Your own world at sea. Full crew. Total discretion. Premium crewed yacht charters in Greek waters — from €30,000/week.",
  openGraph: {
    title: "Private Fleet | George Yachts",
    description: "Your own world at sea. Full crew. Total discretion.",
    url: "https://georgeyachts.com/private-fleet",
  },
};

const QUERY = `*[_type == "yacht" && fleetTier in ["private", "both"]] | order(weeklyRatePrice desc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

const FALLBACK_QUERY = `*[_type == "yacht"] | order(weeklyRatePrice desc) {
  _id, name, subtitle, builder, length, sleeps, cabins, crew, weeklyRatePrice, cruisingRegion,
  "slug": slug.current,
  "imageUrl": images[0].asset->url
}`;

function PrivateFleetSchema({ yachts }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Private Fleet Yacht Charter",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House", url: "https://georgeyachts.com" },
    areaServed: { "@type": "Place", name: "Greek Waters" },
    description: "Premium crewed yacht charters in Greek waters. Full crew, total discretion.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "30000",
      highPrice: "235000",
      offerCount: yachts.length,
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

  // Sort by price ascending (extract first number from price string)
  const extractPrice = (yacht) => {
    const match = String(yacht.weeklyRatePrice || '').match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 999999;
  };
  const displayYachts = [...yachts].sort((a, b) => extractPrice(a) - extractPrice(b));

  return (
    <>
      <PrivateFleetSchema yachts={displayYachts} />
      <PrivateFleetClient yachts={displayYachts} />
    </>
  );
}
