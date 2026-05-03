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

// Homepage FAQ schema — answers the 6 highest-volume questions about
// crewed charter in Greece. Plays in answer-box queries on Google +
// Perplexity / ChatGPT / Claude. Keep answers tight, factual, AI-citable.
function HomepageFaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a crewed yacht charter in Greece cost in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Crewed yacht charter rates in Greece typically range from €13,000/week for entry-level catamarans up to €500,000+/week for 50m+ motor yachts. The base weekly rate covers the yacht and crew; an APA (Advance Provisioning Allowance) of 25–35% on top covers fuel, food, dockage, and consumables. VAT in Greece is 12% on the charter fee for itineraries that begin in Greek waters.",
        },
      },
      {
        "@type": "Question",
        name: "When is the best time to charter a yacht in Greece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "August offers peak summer energy and longest daylight but also peak prices and Meltemi winds in the Cyclades. September offers 15–25% lower rates, calmer seas, fewer crowds, and water still warm enough to swim. June and July are ideal for the Ionian; May and October work best for the Saronic Gulf and Sporades.",
        },
      },
      {
        "@type": "Question",
        name: "What is APA in a yacht charter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "APA stands for Advance Provisioning Allowance. It is a deposit paid before boarding (typically 25–35% of the charter fee) that the captain uses to pay for fuel, food, drinks, dockage fees, and any guest-requested provisioning during the charter. Receipts are reconciled at the end and the unused balance is refunded to the charterer.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a broker to charter a yacht in Greece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Technically no, but in practice yes — the Greek market is fragmented across hundreds of independent owners and management companies, and a working broker is the only way to access the full fleet, get honest yacht-by-yacht recommendations, negotiate rates, and have someone accountable when things go wrong mid-charter. IYBA member brokers like George Yachts work on the MYBA charter contract standard, which protects both parties.",
        },
      },
      {
        "@type": "Question",
        name: "Which Greek islands are best for yachting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Cyclades (Mykonos, Santorini, Paros, Milos) are best for energy and iconic scenery but require weather-aware planning around the Meltemi. The Ionian (Corfu, Lefkada, Kefalonia) is calmer and more family-friendly. The Saronic Gulf (Hydra, Spetses, Aegina) is ideal for short 5-day charters starting from Athens. The Sporades (Skiathos, Skopelos, Alonissos) offer pine-forested anchorages and a quieter atmosphere.",
        },
      },
      {
        "@type": "Question",
        name: "How far in advance should I book a yacht charter in Greece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For peak August on the most-requested yachts, 6–9 months ahead — by March of the same year you should be confirming. For shoulder months (June, September), 3–4 months is usually fine. Last-minute charters are possible (sometimes at lower rates) but limit you to whatever yacht remains available rather than the right yacht for your group.",
        },
      },
    ],
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

  let filotimoImage = null;

  // Roberto 2026-05-02 — Trending Yachts carousel data. Filled
  // inside the try below from `trendingPool`. Defaulted here so
  // the JSX render is unconditional even if Sanity errors.
  let trendingYachts = [];

  try {
    const [count, privateYachts, explorerYachts, allYachts, privateHero, explorerHero, signaturePool, filotimoEditorial, trendingPool] = await Promise.all([
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
      // Move #4 — editorial image for the Filotimo spread. Pull the
      // 6th image (index 5) of whichever yacht has the deepest image
      // library — later shots tend to be anchor / golden-hour / deck
      // lifestyle rather than formal hero exteriors, which matches
      // the contemplative register of the Filotimo section.
      sanityClient.fetch(`*[_type == "yacht" && count(images) >= 6]
        | order(count(images) desc) [0] {
          "url": images[5].asset->url
        }`),
      // Roberto 2026-05-02 — Trending Yachts carousel pool. Pulls
      // every yacht with at least one image, ordered by name. The
      // client picks 6 to display, rotated weekly so the carousel
      // refreshes without manual work.
      sanityClient.fetch(`*[_type == "yacht" && count(images) > 0]{
        name, "slug": slug.current, weeklyRatePrice, sleeps, length,
        "image": images[0].asset->url
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

    filotimoImage = filotimoEditorial?.url ?? null;

    // Trending Yachts carousel + 2 InlineYachtStrip spotlights —
    // pick 8 yachts (carousel uses [0..5], spotlights use [6] and
    // [7]), rotated weekly so visitors who come back see different
    // cards without us doing anything manual. Uses the same week-
    // of-year offset trick as SignatureYacht to keep rotations
    // spread out.
    if (Array.isArray(trendingPool) && trendingPool.length > 0) {
      const N = Math.min(8, trendingPool.length);
      const start = (weekOfYear * 2) % trendingPool.length;
      for (let k = 0; k < N; k++) {
        trendingYachts.push(trendingPool[(start + k) % trendingPool.length]);
      }
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
      {/* <head> inside a page.jsx is ignored by the App Router — preload
          hints need to live in root layout or be emitted via the
          Metadata API. The previous attempted preload was dead code.
          If hero-poster.jpg ever becomes LCP again, add via
          `metadata.other` or a Next `<link>` emitted via `generateMetadata`. */}
      <WebSiteSchema />
      <HomepageFaqSchema />
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
        filotimoImage={filotimoImage}
        trendingYachts={trendingYachts}
      />
    </>
  );
}
