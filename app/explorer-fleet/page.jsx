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

function ExplorerFleetSchema({ yachts }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Explorer Fleet Yacht Charter",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House", url: "https://georgeyachts.com" },
    areaServed: { "@type": "Place", name: "Greek Waters" },
    description: "Group yacht charters in Greece from €1,200 per person. The smart way to see the islands.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "1200",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "1200", priceCurrency: "EUR", unitText: "per person" },
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

  const displayYachts = yachts;

  return (
    <>
      <ExplorerFleetSchema yachts={displayYachts} />
      <ExplorerFleetClient yachts={displayYachts} />
    </>
  );
}
