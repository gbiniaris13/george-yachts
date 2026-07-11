// Phase 27 (Forbes-launch eve, 2026-05-05) — Service + WebSite schema
// for #1 ranking on "yacht charter Greece" + AI-search citations.
//
// Service schema tells Google / Perplexity / ChatGPT / Claude / Gemini
// EXACTLY what we sell, where, and how — with structured pricing,
// service-area, and provider link-back. AI engines preferentially
// cite Service-typed entities for transactional intent ("book a yacht
// charter in Greece").
//
// WebSite schema with potentialAction:SearchAction unlocks the Google
// SERP sitelinks search box (the second-line search input under the
// brand result) — proven CTR boost for branded queries.

import { SITE_UPDATED } from "./contentFreshness";
import { FLEET_COUNT } from "@/lib/fleetCount";

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  // 2026-05-11 — added @id so Google distinguishes this umbrella
  // Service from per-page Service schemas (motor-yacht-charter-greece,
  // sailing-yacht-charter-greece, etc.) which carry their own @id.
  // Without @id Google merges them and the page-specific service
  // facts get lost in the umbrella description.
  "@id": "https://georgeyachts.com/#service",
  "name": "Luxury Yacht Charter in Greek Waters",
  "alternateName": [
    "Yacht Charter Greece",
    "Crewed Yacht Charter Greek Islands",
    "Motor Yacht Charter Greece",
    "Sailing Yacht Charter Greece",
    "Catamaran Charter Greece",
    "Superyacht Charter Greece",
  ],
  "serviceType": "Yacht Charter",
  "category": "Luxury Travel",
  "url": "https://georgeyachts.com",
  "description":
    `Personally-vetted crewed yacht charters across the Greek islands - Cyclades, Ionian, Saronic. ${FLEET_COUNT} yachts curated from a working broker in Athens. MYBA-standard contracts, full APA + VAT transparency, reply within 24 hours.`,
  "provider": {
    "@type": "Organization",
    "@id": "https://georgeyachts.com/#organization",
    "name": "George Yachts Brokerage House",
    "url": "https://georgeyachts.com",
  },
  "areaServed": [
    { "@type": "Place", "name": "Cyclades, Greece" },
    { "@type": "Place", "name": "Mykonos, Greece" },
    { "@type": "Place", "name": "Santorini, Greece" },
    { "@type": "Place", "name": "Paros, Greece" },
    { "@type": "Place", "name": "Ionian Islands, Greece" },
    { "@type": "Place", "name": "Corfu, Greece" },
    { "@type": "Place", "name": "Lefkada, Greece" },
    { "@type": "Place", "name": "Saronic Gulf, Greece" },
    { "@type": "Place", "name": "Hydra, Greece" },
    { "@type": "Country", "name": "Greece" },
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Ultra-high-net-worth families and individuals",
    "geographicArea": { "@type": "Country", "name": "Worldwide" },
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Explorer Fleet - Skippered Charter",
      "description":
        "Sailing yachts and catamarans with skipper. Per-person pricing, 8-12 guests typical.",
      "priceCurrency": "EUR",
      "price": "420",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "420",
        "priceCurrency": "EUR",
        "unitText": "per guest",
        "referenceQuantity": { "@type": "QuantitativeValue", "value": 1, "unitText": "week" },
      },
      "availability": "https://schema.org/InStock",
      "areaServed": "GR",
      "url": "https://georgeyachts.com/explorer-fleet",
    },
    {
      "@type": "Offer",
      "name": "Private Fleet - Full-Crew Charter",
      "description":
        "Motor yachts, sailing yachts, catamarans with full professional crew (captain, chef, stewardess, deckhands).",
      "priceCurrency": "EUR",
      // priceRange is NOT a valid schema.org property on Offer (it belongs to
      // LocalBusiness). Validators flagged it on every page because this graph
      // is sitewide; the min/max PriceSpecification below carries the range.
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": "15000",
        "maxPrice": "500000",
        "priceCurrency": "EUR",
        "valueAddedTaxIncluded": false,
      },
      "availability": "https://schema.org/InStock",
      "areaServed": "GR",
      "url": "https://georgeyachts.com/private-fleet",
    },
  ],
  "termsOfService": "https://georgeyachts.com/terms-of-service",
  "isRelatedTo": [
    { "@type": "Service", "name": "Yacht Itinerary Planning Greece", "url": "https://georgeyachts.com/yacht-itineraries-greece" },
    { "@type": "Service", "name": "Private Jet Charter Greece", "url": "https://georgeyachts.com/private-jet-charter" },
    { "@type": "Service", "name": "VIP Transfers Greece", "url": "https://georgeyachts.com/vip-transfers-greece" },
    { "@type": "Service", "name": "Luxury Villa Rental Greece", "url": "https://georgeyachts.com/luxury-villas-greece" },
  ],
};

// Phase 27e (Forbes-launch eve, 2026-05-05) — AggregateRating-aware
// builder. When 3+ real reviews exist in Sanity (review documents
// with publishedOnSite:true + rating 1-5), this returns the Service
// schema WITH AggregateRating attached → 5-star stars in Google SERP.
// When reviews don't exist yet (current state), returns the static
// schema unchanged. Faking stars is a Google penalty trigger so the
// gate is strict.
export async function getServiceSchemaWithReviews() {
  // Lazy import so the static export above remains usable in any
  // contexts that don't have Sanity available (build-time, edge).
  const { fetchReviewAggregate, aggregateRatingForSchema, fetchReviewsForSchema } = await import(
    "@/lib/reviewsAggregate"
  );
  // 2026-07-08 — review/aggregateRating attachment RETIRED. GSC flagged
  // the site's review markup critical on 2026-06-30: Service is not a
  // supported review-snippet parent and self-serving review markup (our
  // own clients' reviews of us, on our own site) is ignored by Google
  // anyway. The reviews stay visible on /reviews and the homepage band;
  // valid star markup remains possible per-yacht (Product) only.
  // The rolling priceValidUntil freshness is kept.
  const _now = new Date();
  let _seasonEnd = new Date(_now.getFullYear(), 9, 31);
  if (_now > _seasonEnd) _seasonEnd = new Date(_now.getFullYear() + 1, 9, 31);
  const validThrough = _seasonEnd.toISOString().slice(0, 10);
  const offersWithValidity = serviceSchema.offers.map((o) => ({ ...o, priceValidUntil: validThrough }));
  return { ...serviceSchema, offers: offersWithValidity };
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://georgeyachts.com/#website",
  // Stage 2 freshness: WebSite is a CreativeWork, so dateModified is a
  // valid site-wide recency signal. Single source: lib/contentFreshness.js.
  "dateModified": SITE_UPDATED,
  "name": "George Yachts",
  "alternateName": "George Yachts Brokerage House",
  "url": "https://georgeyachts.com",
  "publisher": {
    "@type": "Organization",
    "@id": "https://georgeyachts.com/#organization",
  },
  // 2026-07-11 — the site serves English only (multi-language versions were
  // retired); declaring 5 languages to Google was untrue. George's call.
  "inLanguage": "en",
  // Sitelinks search box — Google SERP renders a search input
  // under the brand result when this is present.
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate":
        "https://georgeyachts.com/charter-yacht-greece?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};
