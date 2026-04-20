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
  let privateRange = { low: 13000, high: 180000 };
  let explorerRange = { low: 420, high: 1800 };
  let budgetYachts = [];
  let privateHeroImage = null;
  let explorerHeroImage = null;
  let privateCount = 0;
  let explorerCount = 0;

  try {
    const [count, privateYachts, explorerYachts, allYachts, privateHero, explorerHero] = await Promise.all([
      sanityClient.fetch(`count(*[_type == "yacht"])`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["private", "both"]]{ weeklyRatePrice }`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["explorer", "both"]]{ weeklyRatePrice, sleeps }`),
      sanityClient.fetch(`*[_type == "yacht"] | order(weeklyRatePrice asc) { name, "slug": slug.current, weeklyRatePrice, sleeps, builder, length, subtitle }`),
      // Move #2 — pick one representative hero image per fleet for the split-screen showcase.
      // We order by name for stability (same image per deploy) and ask for the first image
      // of whichever yacht has one. Null fallback handled client-side.
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["private", "both"] && count(images) > 0] | order(name asc) [0] { "url": images[0].asset->url }`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["explorer", "both"] && count(images) > 0] | order(name asc) [0] { "url": images[0].asset->url }`),
    ]);
    yachtCount = count;
    privateHeroImage = privateHero?.url ?? null;
    explorerHeroImage = explorerHero?.url ?? null;
    privateCount = privateYachts.length;
    explorerCount = explorerYachts.length;

    const extractPrice = (str) => {
      const m = String(str || '').match(/[\d,]+/);
      return m ? parseInt(m[0].replace(/,/g, '')) : 0;
    };

    const privatePrices = privateYachts.map(y => extractPrice(y.weeklyRatePrice)).filter(p => p > 0);
    if (privatePrices.length) {
      privateRange = { low: Math.min(...privatePrices), high: Math.max(...privatePrices) };
    }

    const explorerPP = explorerYachts.map(y => {
      const base = extractPrice(y.weeklyRatePrice);
      if (base === 0) return 0;
      const guests = parseInt(y.sleeps) || 8;
      return Math.round(base / guests);
    }).filter(Boolean);
    if (explorerPP.length) {
      explorerRange = { low: Math.min(...explorerPP), high: Math.max(...explorerPP) };
    }

    budgetYachts = allYachts
      .map(y => {
        const price = extractPrice(y.weeklyRatePrice);
        if (price === 0) return null;
        return { name: y.name, slug: y.slug, price, guests: parseInt(y.sleeps) || 8, type: y.subtitle || y.builder || '', length: y.length || '' };
      })
      .filter(Boolean)
      .sort((a, b) => a.price - b.price);
  } catch {}

  return (
    <>
      <head>
        <link rel="preload" href="/images/hero-poster.jpg" as="image" fetchPriority="high" />
      </head>
      <WebSiteSchema />
      <HomeClient
        yachtCount={yachtCount}
        privateRange={privateRange}
        explorerRange={explorerRange}
        budgetYachts={budgetYachts}
        privateHeroImage={privateHeroImage}
        explorerHeroImage={explorerHeroImage}
        privateCount={privateCount}
        explorerCount={explorerCount}
      />
    </>
  );
}
