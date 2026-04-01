import React from "react";
import HomeClient from "./HomeClient";
import { sanityClient } from "@/lib/sanity";

export const metadata = {
  title: "George Yachts | Luxury Yacht Charter Greece | Boutique Brokerage",
  description:
    "George Yachts Brokerage House — boutique luxury yacht charter in Greek waters. 50+ curated yachts, IYBA member broker, 360° services. Cyclades, Ionian, Saronic, Sporades. Personal service from Athens.",
  alternates: {
    canonical: "https://georgeyachts.com",
  },
  openGraph: {
    title: "George Yachts | Luxury Yacht Charter Greece",
    description: "Boutique yacht brokerage specializing exclusively in Greek waters. 50+ curated yachts, personal broker relationship, 360° luxury services.",
    url: "https://georgeyachts.com",
    type: "website",
    siteName: "George Yachts Brokerage House",
  },
  twitter: {
    card: "summary_large_image",
    title: "George Yachts | Luxury Yacht Charter Greece",
    description: "Boutique yacht brokerage in Greek waters. Personal service, curated fleet, 360° luxury.",
  },
};

function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "George Yachts Brokerage House",
    url: "https://georgeyachts.com",
    description: "Boutique luxury yacht charter brokerage specializing exclusively in Greek waters. IYBA member.",
    publisher: {
      "@type": "Organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://georgeyachts.com/charter-yacht-greece?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function HomePage() {
  let yachtCount = 60;
  try {
    yachtCount = await sanityClient.fetch(`count(*[_type == "yacht"])`);
  } catch {}

  return (
    <>
      <WebSiteSchema />
      <HomeClient yachtCount={yachtCount} />
    </>
  );
}
