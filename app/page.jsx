import React from "react";
import HomeClient from "./HomeClient";
import { sanityClient } from "@/lib/sanity";

// Re-render at most once an hour. The homepage uses weekly-rotating
// photography on the Explorer fleet panel; at the week-boundary the
// next hourly revalidation picks up the new yacht automatically.
// No manual work required from George.
export const revalidate = 3600;

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
  let signatureYacht = null;

  try {
    const [count, privateYachts, explorerYachts, allYachts, privateHero, explorerHero, signaturePool] = await Promise.all([
      sanityClient.fetch(`count(*[_type == "yacht"])`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["private", "both"]]{ weeklyRatePrice }`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["explorer", "both"]]{ weeklyRatePrice, sleeps }`),
      sanityClient.fetch(`*[_type == "yacht"] | order(weeklyRatePrice asc) { name, "slug": slug.current, weeklyRatePrice, sleeps, builder, length, subtitle }`),
      // Move #2 — photography strategy (George 2026-04-20):
      //   Private  → PINNED to M/Y LA PELLEGRINA 1 (50m Couach flagship,
      //             €180K–€235K/week). The flagship = brand signature; a
      //             rotation here would dilute the "this is what Private
      //             means" anchor. Fallback chain if the record changes.
      //   Explorer → AUTO-ROTATES weekly. We pull every Explorer yacht
      //             that has at least one image, and below we pick by
      //             ISO week number so the hero refreshes every Monday
      //             without any manual work.
      sanityClient.fetch(`coalesce(
        *[_type == "yacht" && name match "*PELLEGRINA*" && count(images) > 0][0],
        *[_type == "yacht" && fleetTier in ["private", "both"] && count(images) > 0] | order(name asc) [0]
      ) { "url": images[0].asset->url }`),
      sanityClient.fetch(`*[_type == "yacht" && fleetTier in ["explorer", "both"] && count(images) > 0] | order(name asc) { "url": images[0].asset->url, name }`),
      // Move #3 — Signature Yacht pool. Only yachts with a meaningful
      // insider tip (>100 chars) AND at least 3 images qualify — those
      // are the ones with enough story to anchor a full-viewport
      // feature slot. Pick rotates weekly (see below).
      sanityClient.fetch(`*[_type == "yacht"
        && defined(georgeInsiderTip)
        && length(georgeInsiderTip) > 100
        && count(images) >= 3
      ]{
        _id, name, subtitle, "slug": slug.current,
        length, sleeps, cabins, builder, yearBuiltRefit,
        cruisingRegion, weeklyRatePrice, georgeInsiderTip,
        "heroImage": images[0].asset->url,
        "detailImage": images[1].asset->url
      } | order(name asc)`),
    ]);
    yachtCount = count;
    privateHeroImage = privateHero?.url ?? null;

    // Weekly rotation for the Explorer hero image.
    // `explorerHero` is now an array of { url, name } — pick by ISO
    // week-of-year so the hero swaps deterministically every Monday.
    // Same yacht for every visitor inside the same week → stable SEO,
    // predictable experience, zero admin.
    const explorerList = Array.isArray(explorerHero) ? explorerHero.filter((x) => x && x.url) : [];
    const now = new Date();
    const jan1 = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const daysSince = Math.floor((now.getTime() - jan1.getTime()) / 86400000);
    const weekOfYear = Math.floor(daysSince / 7);

    if (explorerList.length > 0) {
      explorerHeroImage = explorerList[weekOfYear % explorerList.length].url;
    }

    // Signature Yacht — same weekly-rotation pattern (Move #3). We
    // shift the week index by a different prime offset from the
    // Explorer rotation so the two sections don't always swap in
    // lockstep. Different yacht every Monday.
    const signatureList = Array.isArray(signaturePool) ? signaturePool.filter((y) => y && y.heroImage) : [];
    if (signatureList.length > 0) {
      signatureYacht = signatureList[(weekOfYear + 3) % signatureList.length];
    }

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
        signatureYacht={signatureYacht}
      />
    </>
  );
}
