import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import YachtPageContent from './YachtPageContent';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
import SimilarYachts from './SimilarYachts';
import { similarYachts } from '@/lib/yacht-similarity';
import { extractPriceRange } from '@/lib/pricing';
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

// Price parsing (low + high) lives in lib/pricing.js extractPriceRange so
// the per-yacht Offer here and the /charter-yacht-greece AggregateOffer
// parse the free-text weekly rate identically. Imported above.

// =============================================================
// Yacht schema — marine-specific (Product + Vehicle + Boat).
//
// 2026-05-18 — Phase 7 Round 36. Replaces the generic Product
// schema with a marine entity graph. Three @types stack:
//
//   • Product     — kept for backwards compat with rich-result
//                   parsers that already understand it (Offer,
//                   AggregateRating, etc.). Lets Google keep
//                   rendering the price + availability badges.
//   • Vehicle     — official schema.org type closest to a yacht.
//                   Surfaces specs Google's vehicle parsers under-
//                   stand (productionDate, vehicleEngine,
//                   vehicleConfiguration, fuelType, speed).
//   • Boat        — schema.org Vehicle extension actively used by
//                   marinas + brokerage listings. Recognised by
//                   Bing + Yandex + some AI search engines that
//                   were trained on marine listing markup.
//
// Parse year-only out of yearBuiltRefit ("2018 / refit 2024" →
// 2018) for productionDate. Builder maps cleanly to manufacturer.
// Length is preserved as the human string ("51 ft") in the Vehicle
// length field via QuantitativeValue when we can parse a number.
//
// Backwards compat — every property is gated on its source value
// being truthy. Yachts missing a field render the schema without
// it. No-op fallback ensures the page never crashes if Sanity
// returns a sparse document.
// =============================================================
function parseYear(raw) {
  if (!raw) return null;
  const m = String(raw).match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : null;
}

function parseLengthMeters(raw) {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  // Try metres first ("15.6m", "15,6 m")
  const m = s.match(/([\d]+(?:[.,][\d]+)?)\s*m\b/);
  if (m) return Number(m[1].replace(",", "."));
  // Fall back to feet → convert to metres
  const ft = s.match(/([\d]+(?:[.,][\d]+)?)\s*(?:ft|feet|')/);
  if (ft) return Number((Number(ft[1].replace(",", ".")) * 0.3048).toFixed(2));
  return null;
}

function parseLengthFeet(raw) {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  const ft = s.match(/([\d]+(?:[.,][\d]+)?)\s*(?:ft|feet|')/);
  if (ft) return Number(ft[1].replace(",", "."));
  const m = s.match(/([\d]+(?:[.,][\d]+)?)\s*m\b/);
  if (m) return Number((Number(m[1].replace(",", ".")) * 3.28084).toFixed(1));
  return null;
}

function parseSpeedKnots(raw) {
  if (!raw) return null;
  const m = String(raw).match(/([\d]+(?:[.,][\d]+)?)\s*(?:kt|kts|knots?)/i);
  if (!m) return null;
  return Number(m[1].replace(",", "."));
}

function YachtSchema({ yacht, imageUrl, slug }) {
  const yearBuilt = parseYear(yacht.yearBuiltRefit);
  const lengthMeters = parseLengthMeters(yacht.length);
  const lengthFeet = parseLengthFeet(yacht.length);
  const cruiseSpeedKnots = parseSpeedKnots(yacht.cruiseSpeed);
  const maxSpeedKnots = parseSpeedKnots(yacht.maxSpeed);

  // Build the Vehicle / Boat / Product entity. The triple @type
  // is intentional — see comment block above.
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Vehicle'],
    additionalType: 'https://schema.org/Boat',
    '@id': `https://georgeyachts.com/yachts/${slug}#yacht`,
    name: yacht.name,
    description: `Luxury ${yacht.subtitle || ''} yacht available for crewed charter in Greek waters. ${yacht.length || ''}, accommodating ${yacht.sleeps || ''} guests.`.trim(),
    image: imageUrl,
    url: `https://georgeyachts.com/yachts/${slug}`,
    category: 'Luxury Crewed Yacht Charter',

    // Vehicle / Boat marine properties
    ...(yacht.builder && {
      manufacturer: {
        '@type': 'Organization',
        name: yacht.builder,
      },
      brand: {
        '@type': 'Brand',
        name: yacht.builder,
      },
    }),
    ...(yacht.subtitle && { vehicleConfiguration: yacht.subtitle.split('|')[0].trim() }),
    ...(yacht.cruisingRegion && { vehicleSpecialUsage: `Crewed charter, ${yacht.cruisingRegion}` }),
    bodyType: 'Yacht',
    fuelType: 'Diesel',  // virtually all charter yachts in our fleet
    ...(yearBuilt && {
      productionDate: yearBuilt,
      vehicleModelDate: yearBuilt,
      modelDate: yearBuilt,
    }),
    // Length — emit both QuantitativeValue forms so consumers that
    // expect metres or feet both pick it up cleanly.
    ...(lengthMeters && {
      length: {
        '@type': 'QuantitativeValue',
        value: lengthMeters,
        unitCode: 'MTR',
      },
    }),
    // Occupancy / cabins / crew via the official Vehicle properties.
    ...(yacht.sleeps && {
      vehicleSeatingCapacity: {
        '@type': 'QuantitativeValue',
        value: yacht.sleeps,
      },
      // Boat extension; some parsers honour this for marine listings.
      numberOfGuests: yacht.sleeps,
    }),
    ...(yacht.cabins && { numberOfRooms: yacht.cabins }),
    // Cruise + max speed as QuantitativeValue knots.
    ...(cruiseSpeedKnots && {
      speed: {
        '@type': 'QuantitativeValue',
        value: cruiseSpeedKnots,
        unitText: 'knots',
      },
    }),

    // Offer — unchanged from the previous Product schema so Google
    // keeps rendering the existing rich-result price badge. seller
    // and @id still ref the canonical Organization.
    offers: (() => {
      const { low, high } = extractPriceRange(yacht.weeklyRatePrice);
      const perPerson = yacht.priceModel === 'per_person_week';
      // validThrough rolls with the Greek charter-season booking horizon
      // (the season ends ~Oct 31). This page is ISR (revalidate 3600) so the
      // value recomputes hourly and can never fall into the past - which is
      // exactly what Google/AI want from Offer.validThrough + priceValidUntil.
      const _now = new Date();
      const _seasonEnd = new Date(_now.getFullYear(), 9, 31);
      const validThrough = (_now > _seasonEnd
        ? new Date(_now.getFullYear() + 1, 9, 31)
        : _seasonEnd
      ).toISOString().slice(0, 10);
      const base = {
        '@type': 'Offer',
        '@id': `https://georgeyachts.com/yachts/${slug}#offer`,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validThrough,
        url: `https://georgeyachts.com/yachts/${slug}`,
        areaServed: {
          '@type': 'Place',
          name: yacht.cruisingRegion || 'Greece',
        },
        seller: {
          '@type': 'Organization',
          '@id': 'https://georgeyachts.com/#organization',
          name: 'George Yachts Brokerage House',
          url: 'https://georgeyachts.com',
        },
      };
      // Graceful: only attach price data when a real number parsed from
      // the free-text weekly rate. "Price on request" yachts emit a valid
      // Offer (availability + seller) with NO fabricated price.
      if (low) {
        base.price = String(low);
        // priceValidUntil is the field Google reads to know when a price
        // badge expires; mirror the rolling season-end date above.
        base.priceValidUntil = validThrough;
        base.priceSpecification = {
          '@type': 'UnitPriceSpecification',
          price: String(low),
          priceCurrency: 'EUR',
          // priceModel-aware: whole-yacht vs per-guest weekly rate.
          unitText: perPerson ? 'per guest per week' : 'per week',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 7,
            unitCode: 'DAY',
          },
          // Most rates are a low-high spread; emit both so Google and AI
          // engines read the full weekly range, not just the "from" price.
          ...(high && high > low
            ? { minPrice: String(low), maxPrice: String(high) }
            : {}),
        };
      }
      return base;
    })(),

    // Review / AggregateRating: intentionally OMITTED - no verified guest
    // reviews exist yet and fabricating ratings is forbidden. READY HOOK:
    // when >=3 real reviews for this yacht are published in Sanity, attach
    //   aggregateRating: { '@type': 'AggregateRating', ratingValue,
    //     reviewCount, bestRating: 5, worstRating: 1 }
    //   review: [ { '@type': 'Review', author, reviewRating, reviewBody } ]
    // gated through lib/reviewsAggregate.js (same >=3 gate as serviceSchema).

    // additionalProperty retains the human-readable PropertyValue
    // rows for marine-specific fields that don't have a first-class
    // Vehicle property (beam, draft, etc. would go here when added
    // to the Sanity schema). Each row is gated on its value.
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Length (ft)', value: lengthFeet ? `${lengthFeet} ft` : yacht.length },
      { '@type': 'PropertyValue', name: 'Length (m)', value: lengthMeters ? `${lengthMeters} m` : null },
      { '@type': 'PropertyValue', name: 'Guests', value: yacht.sleeps },
      { '@type': 'PropertyValue', name: 'Cabins', value: yacht.cabins },
      { '@type': 'PropertyValue', name: 'Crew', value: yacht.crew },
      { '@type': 'PropertyValue', name: 'Builder', value: yacht.builder },
      { '@type': 'PropertyValue', name: 'Year built / refit', value: yacht.yearBuiltRefit },
      { '@type': 'PropertyValue', name: 'Max speed', value: maxSpeedKnots ? `${maxSpeedKnots} knots` : yacht.maxSpeed },
      { '@type': 'PropertyValue', name: 'Cruise speed', value: cruiseSpeedKnots ? `${cruiseSpeedKnots} knots` : yacht.cruiseSpeed },
      { '@type': 'PropertyValue', name: 'Cruising region', value: yacht.cruisingRegion },
    ].filter((prop) => prop.value),
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
