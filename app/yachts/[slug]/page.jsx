import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import YachtPageContent from './YachtPageContent';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
import SimilarYachts from './SimilarYachts';
import { similarYachts } from '@/lib/yacht-similarity';
import './yacht-page.css';

// ISR - revalidate every hour
export const revalidate = 3600;

// Generate static paths for all yachts with slugs
export async function generateStaticParams() {
  // 2026-05-12 — Sanity outage resilience. If the catalog fetch
  // fails at build time, return [] so the build doesn't crash;
  // pages are rendered dynamically as visitors hit them.
  try {
    const yachts = await sanityClient.fetch(`*[_type == "yacht" && defined(slug.current)]{
      "slug": slug.current
    }`);
    return yachts.map((yacht) => ({ slug: yacht.slug }));
  } catch (err) {
    console.error("yachts/[slug] generateStaticParams fetch failed:", err);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let yacht;
  try {
    yacht = await sanityClient.fetch(
      `*[_type == "yacht" && slug.current == $slug][0]{
        name, subtitle, length, sleeps, weeklyRatePrice, cruisingRegion,
        "imageUrl": images[0].asset->url
      }`,
      { slug }
    );
  } catch (err) {
    console.error(`yachts/[slug] generateMetadata fetch failed for ${slug}:`, err);
    yacht = null;
  }

  if (!yacht) return { title: 'Yacht Not Found' };

  // 2026-05-12 — shortened to fit Google's SERP rendering threshold.
  // Layout template appends ' | George Yachts'. The Sanity subtitle
  // field often contains a full marketing tagline after a ' | ' (e.g.
  // 'FOUNTAINE PAJOT POWER 67 | BRAND NEW 2025 BUILD'). For meta we
  // only want the builder/model part — split on first ' | ' and use
  // the leading segment. Verified on 8 sample yachts: rendered title
  // ~45-58 chars (was 76-108).
  const shortSubtitle = (yacht.subtitle || '').split('|')[0].trim();
  const title = shortSubtitle ? `${yacht.name} | ${shortSubtitle}` : yacht.name;
  const description = `Charter ${yacht.name}: ${yacht.length} ${shortSubtitle}, sleeps ${yacht.sleeps}. Crewed yacht charter in Greek waters. ${yacht.weeklyRatePrice}`;
  const canonical = `https://georgeyachts.com/yachts/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: yacht.imageUrl ? [{ url: yacht.imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Extract the lowest numeric EUR value from a free-text price string
// like "From €150,000/week" or "€150,000 — €220,000" → 150000. Used to
// populate schema.org Offer.price so Google can render rich results
// with a starting price. Returns null when no number is parseable.
function extractLowPrice(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const matches = raw.match(/[\d][\d.,]*/g);
  if (!matches) return null;
  const nums = matches
    .map(m => Number(m.replace(/[.,]/g, '')))
    .filter(n => Number.isFinite(n) && n >= 1000);
  return nums.length ? Math.min(...nums) : null;
}

// Product Schema for GEO — Complete
function YachtSchema({ yacht, imageUrl, slug }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    // Phase 7 Round 20 (2026-05-12) — @id per yacht so each yacht is a
    // stable, distinct Product entity in the knowledge graph. AI engines
    // can now reference a specific yacht's Product entity without
    // conflating it with the Organization's umbrella Service.
    '@id': `https://georgeyachts.com/yachts/${slug}#product`,
    name: yacht.name,
    description: `Luxury ${yacht.subtitle || ''} yacht available for charter in Greek waters. ${yacht.length}, accommodating ${yacht.sleeps} guests.`,
    brand: {
      '@type': 'Brand',
      name: yacht.builder || 'Luxury Yacht',
    },
    category: 'Luxury Motor Yacht Charter',
    image: imageUrl,
    url: `https://georgeyachts.com/yachts/${slug}`,
    offers: (() => {
      const low = extractLowPrice(yacht.weeklyRatePrice);
      const base = {
        '@type': 'Offer',
        // Phase 7 Round 20 — Offer @id linked to the parent Product
        // for entity-graph consistency.
        '@id': `https://georgeyachts.com/yachts/${slug}#offer`,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `https://georgeyachts.com/yachts/${slug}`,
        areaServed: {
          '@type': 'Place',
          name: yacht.cruisingRegion || 'Greece',
        },
        // Phase 7 Round 20 — seller now references the canonical
        // Organization @id rather than inline-redefining. This means
        // every yacht Offer ties back to the same Organization entity
        // referenced by Service schema, Article author publisher, etc.
        seller: {
          '@type': 'Organization',
          '@id': 'https://georgeyachts.com#organization',
          name: 'George Yachts Brokerage House',
          url: 'https://georgeyachts.com',
        },
      };
      if (low) {
        base.price = String(low);
        base.priceSpecification = {
          '@type': 'UnitPriceSpecification',
          price: String(low),
          priceCurrency: 'EUR',
          unitText: 'week',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 7,
            unitCode: 'DAY',
          },
        };
      }
      return base;
    })(),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Length', value: yacht.length },
      { '@type': 'PropertyValue', name: 'Guests', value: yacht.sleeps },
      { '@type': 'PropertyValue', name: 'Cabins', value: yacht.cabins },
      { '@type': 'PropertyValue', name: 'Crew', value: yacht.crew },
      { '@type': 'PropertyValue', name: 'Builder', value: yacht.builder },
      { '@type': 'PropertyValue', name: 'Max Speed', value: yacht.maxSpeed },
      { '@type': 'PropertyValue', name: 'Cruise Speed', value: yacht.cruiseSpeed },
    ].filter(prop => prop.value),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function YachtPage({ params }) {
  const { slug } = await params;

  // 2026-05-12 — Sanity outage resilience. A Sanity hiccup during
  // page render would otherwise crash with HTTP 500. Wrap in
  // try/catch and treat a fetch error as 'yacht not found' so we
  // route through notFound() → the cinematic 404 instead of a
  // user-facing crash. Sanity outages are rare but real.
  let yacht;
  try {
    yacht = await sanityClient.fetch(
    `*[_type == "yacht" && slug.current == $slug][0]{
      _id,
      name,
      subtitle,
      description,
      georgeInsiderTip,
      length,
      yearBuiltRefit,
      builder,
      sleeps,
      cabins,
      crew,
      maxSpeed,
      cruiseSpeed,
      cruisingRegion,
      weeklyRatePrice,
      features,
      toys,
      idealFor,
      "slug": slug.current,
      // 0.7 (Roberto brief) — fleetTier + priceModel power the
      // unit badge logic in PriceBlock + sticky CTA. Both are
      // optional in Sanity; the front-end falls back to
      // fleetTier-based inference when priceModel is missing,
      // and to "per_yacht_week" if neither is set.
      fleetTier,
      priceModel,
      // D.7 (Roberto brief) — sample 7-day itinerary surfaces a concrete
      // route on the yacht detail page. Optional; the front-end skips
      // the section entirely when days array is empty or unset.
      sampleItinerary{
        totalDistance,
        days[]{ day, distance, from, to, narrative }
      },
      // D.6 (Roberto brief) — optional Matterport 3D tour embed URL.
      // Front-end shows the section + iframe only when set; click-to-load
      // so the heavy Matterport bundle never ships unless the visitor
      // explicitly opts in.
      matterportEmbedUrl,
      // D.5 (Roberto brief) — interactive deck plans. Tabbed view per
      // deck; each plan has an illustration image and hotspot pins (x/y
      // % coords) that open a modal with the cabin photo + name. Optional;
      // when array is empty the front-end skips the section.
      deckPlans[]{
        deck,
        "imageUrl": image.asset->url,
        hotspots[]{
          x, y, cabinName,
          "photoUrl": photo.asset->url
        }
      },
      // D.5 auto-fallback (Boss directive 2026-05-05): structured
      // deck plans aren't populated yet, but layout / "plan" images
      // are scattered in the regular gallery on many yachts (alt
      // text "layout plan", "Deck Layout", etc). Surface those as a
      // simpler "Deck layout" section so visitors get something
      // useful even before Boss seeds the rich deckPlans field.
      "layoutImages": images[
        alt match "*layout*" ||
        alt match "*Layout*" ||
        alt match "*plan*" ||
        alt match "*Plan*"
      ]{
        "url": asset->url,
        alt
      },
      // D.8 (Roberto brief) — typed crew roster with photos. Optional;
      // skipped when empty. Legacy free-text "crew" field stays as the
      // count display in yacht-specs, this drives the rich row.
      crewProfiles[]{
        role,
        oneLineBio,
        "photoUrl": photoOptional.asset->url
      },
      "images": images[]{
        "url": asset->url,
        "alt": alt
      }
    }`,
      { slug }
    );
  } catch (err) {
    console.error(`yacht/[slug] fetch error for ${slug}:`, err);
    yacht = null;
  }

  if (!yacht) {
    notFound();
  }

  // E4 — pull a compact projection of the whole fleet so we can score
  // similarity at render time and suggest 4 related yachts. Runs once
  // per ISR window (3600s). No runtime cost per visit.
  const fleet = await sanityClient
    .fetch(
      `*[_type == "yacht" && defined(slug.current) && slug.current != $slug]{
        _id, name, subtitle, builder, length, sleeps, cabins,
        weeklyRatePrice, cruisingRegion, fleetTier,
        "slug": slug.current,
        "imageUrl": images[0].asset->url
      }`,
      { slug }
    )
    .catch(() => []);

  const similar = similarYachts(yacht, fleet, 4);

  const heroImage = yacht.images?.[0];

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
    { name: yacht.name, url: `https://georgeyachts.com/yachts/${slug}` },
  ];

  // Brief 2B (2026-05-12): Quick Answer FAQPage schema for each
  // yacht detail page. AI engines (Perplexity, ChatGPT, Claude)
  // extract Q/A pairs for citation. Derived from yacht specs.
  const quickAnswerQ = `What is the ${yacht.name} yacht and what does a charter cost?`;
  const quickAnswerA = `The ${yacht.name} is a ${yacht.length || ""} ${yacht.subtitle ? yacht.subtitle.split("|")[0].trim() : "luxury"} yacht available for crewed charter in ${yacht.cruisingRegion || "Greek waters"}, sleeping ${yacht.sleeps || "up to 12"} guests across ${yacht.cabins || "multiple"} cabins. ${yacht.weeklyRatePrice ? `Weekly base charter rate: ${yacht.weeklyRatePrice}. ` : ""}Add 30% APA, 13% Greek VAT, and 10-15% crew gratuity for the fully loaded cost. MYBA-standard contract.`;
  const quickAnswerJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: quickAnswerQ,
        acceptedAnswer: {
          "@type": "Answer",
          text: quickAnswerA,
          author: {
            "@type": "Person",
            "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
            name: "George P. Biniaris",
          },
        },
      },
    ],
  };

  return (
    <>
      <YachtSchema yacht={yacht} imageUrl={heroImage?.url} slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quickAnswerJsonLd) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <YachtPageContent
        yacht={{
          name: yacht.name,
          subtitle: yacht.subtitle,
          georgeInsiderTip: yacht.georgeInsiderTip,
          length: yacht.length,
          yearBuiltRefit: yacht.yearBuiltRefit,
          builder: yacht.builder,
          sleeps: yacht.sleeps,
          cabins: yacht.cabins,
          crew: yacht.crew,
          maxSpeed: yacht.maxSpeed,
          cruiseSpeed: yacht.cruiseSpeed,
          weeklyRatePrice: yacht.weeklyRatePrice,
          features: yacht.features,
          toys: yacht.toys,
          idealFor: yacht.idealFor,
          sampleItinerary: yacht.sampleItinerary,
          crewProfiles: yacht.crewProfiles,
          matterportEmbedUrl: yacht.matterportEmbedUrl,
          deckPlans: yacht.deckPlans,
          layoutImages: yacht.layoutImages,
          images: yacht.images,
        }}
        heroImage={heroImage}
        description={yacht.description}
      />
      <SimilarYachts items={similar} />
    </>
  );
}
