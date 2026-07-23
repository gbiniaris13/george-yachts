/**
 * organizationSchema.js - Organization Schema for Root Layout
 * 
 * This tells AI engines WHO George Yachts is.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "TravelAgency"],
  // Phase 7 Round 20 (2026-05-12) — @id added so this Organization
  // is a stable entity referenced by all other Person/Service/Article
  // schemas across the site. Without @id every other schema's
  // worksFor / publisher reference creates an implicit new
  // Organization, fragmenting the entity graph.
  // Stage 2 fix: this @id MUST match the IRI every referencing schema uses
  // (Service/WebSite/Person/Article all reference the trailing-slash root
  // form "https://georgeyachts.com/#organization"). It previously used the
  // no-slash form, so nothing actually pointed at this node and the entity
  // graph fragmented. Unified to the slash form.
  "@id": "https://georgeyachts.com/#organization",
  "name": "George Yachts Brokerage House",
  "alternateName": "George Yachts",
  "slogan": "Smooth seas and sharp suits.",
  "description": "Luxury crewed yacht charter brokerage specializing exclusively in Greek waters - Cyclades, Ionian, and Saronic islands. MYBA-standard contracts, IYBA member.",
  "url": "https://georgeyachts.com",
  // 2026-07-23: Google's logo rich result wants a raster image >=112x112;
  // the SVG was being skipped. The 180x180 PNG G-mark qualifies.
  "logo": "https://georgeyachts.com/apple-icon.png",
  // George's correction 2026-07-22: the company was founded 6 Feb 2026
  // (Wikidata Q140412904 P571 updated the same day to match).
  "foundingDate": "2026-02-06",
  // NAICS industry code 561520 (Tour Operators) — formal industry
  // classification helps Google Knowledge Graph categorise.
  "naics": "561520",
  "founder": {
    "@type": "Person",
    // Phase 7 Round 20 — founder Person references the canonical
    // E-E-A-T author page Person record. AI engines now traverse
    // Organization → founder Person → /about/george-p-biniaris with
    // its full bibliography + workExample array.
    "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
    "name": "George P. Biniaris",
    "jobTitle": "Founder and Managing Broker",
    "url": "https://georgeyachts.com/about/george-p-biniaris",
    "knowsAbout": [
      "Luxury Yacht Charter",
      "Greek Waters Navigation",
      "MYBA Charter Contracts",
      "UHNW Client Services",
      "Cyclades Itineraries",
      "Ionian Island Cruising"
    ]
  },
  "employee": [
    {
      "@type": "Person",
      "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
      "name": "George P. Biniaris",
      "jobTitle": "Founder and Managing Broker"
    }
  ],
  // 2026-06-28 (GEO research Tier 1) — areaServed upgraded from bare
  // Place names to GeoShape bounding boxes. Categorical + geographic
  // specificity is the strongest predictor of AI-search visibility:
  // the model recommends the specialist for a region, not the
  // generalist. Each `box` is "minLat minLong maxLat maxLong" (SW then
  // NE corner) approximating the real extent of each Greek island
  // group — real geography, no invented figures.
  "areaServed": [
    { "@type": "Place", "name": "Cyclades, Greece", "geo": { "@type": "GeoShape", "box": "36.3 24.3 37.7 26.0" } },
    { "@type": "Place", "name": "Ionian Islands, Greece", "geo": { "@type": "GeoShape", "box": "37.6 19.8 39.8 21.2" } },
    { "@type": "Place", "name": "Saronic Gulf, Greece", "geo": { "@type": "GeoShape", "box": "37.2 22.9 38.0 23.6" } },
    { "@type": "Place", "name": "Sporades, Greece", "geo": { "@type": "GeoShape", "box": "38.9 23.2 39.5 24.2" } },
    { "@type": "Country", "name": "Greece" }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "International Yacht Brokers Association (IYBA)",
    "url": "https://iyba.org"
  },
  // 2026-06-10 George: UK number removed everywhere — it was a Sonetel
  // virtual line he cannot answer. A dead line is worse than no line.
  // GR = primary, US = the WhatsApp line for American clients.
  "telephone": ["+30 6970380999", "+1 7867988798"],
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+30-697-038-0999", "contactType": "sales", "areaServed": "GR" },
    { "@type": "ContactPoint", "telephone": "+1-786-798-8798", "contactType": "sales", "areaServed": "US" }
  ],
  // Operational HQ: Athens, Greece. This is the address Google's local
  // pack uses for "yacht charter Athens" / "yacht charter Greece"
  // queries — the previous value was the Wyoming registered-agent
  // address (legal entity only), which killed Greek local-SEO signal.
  // Legal entity is still disclosed via `legalName` below.
  // Operational HQ — real Athens address. This is what GBP + Google
  // local pack matches against. Coordinates approximated from
  // Charilaou Trikoupi 190A, Kifisia 14564 (verify via GBP geocode
  // on first claim).
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Charilaou Trikoupi 190A",
    "addressLocality": "Kifisia",
    "addressRegion": "Attica",
    "postalCode": "14564",
    "addressCountry": "GR"
  },
  "legalName": "George Yachts Brokerage House LLC",
  // 2026-06-10: aligned to the live Google Business Profile pin for
  // "GEORGE YACHTS BROKERAGE HOUSE LLC" (38.0876, 23.8084 — Charilaou
  // Trikoupi 190A, Kifisia 14564). Google cross-checks schema geo
  // against its own Maps pin, so these must match it exactly.
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.0876,
    "longitude": 23.8084
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=Charilaou+Trikoupi+190A+Kifisia+14564",
  "location": [
    {
      "@type": "Place",
      "name": "George Yachts - Athens HQ",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Charilaou Trikoupi 190A",
        "addressLocality": "Kifisia",
        "addressRegion": "Attica",
        "postalCode": "14564",
        "addressCountry": "GR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.0876,
        "longitude": 23.8084
      }
    }
  ],
  // Boss directive 2026-05-08 — sameAs strengthens the entity graph
  // for AI search systems. Each URL is an authoritative confirmation
  // that this Organization is the same entity referenced there.
  //
  // 2026-07-02 entity-hygiene audit (ASK A Section 4): sameAs now
  // holds ONLY profiles of THIS Organization. The personal LinkedIn
  // moved to the founder Person node (it identifies George, not the
  // company); iyba.org lives in memberOf (we are a member, not the
  // association); the Forbes article lives in subjectOf (coverage,
  // not an identity profile). Both facts are still asserted, in the
  // schema-correct fields, so engines stop conflating three entities.
  // Facebook page added (George is admin; Meta Verified).
  "sameAs": [
    "https://www.instagram.com/georgeyachts",
    "https://www.linkedin.com/company/georgeyachts/",
    "https://www.facebook.com/profile.php?id=61579547047989",
    // 2026-07-03 — company Wikidata entity created (Q140412904:
    // instance of business, official website, founder -> Q140078221,
    // inception Nov 2025). Wikidata feeds Google's Knowledge Graph
    // and LLM entity pipelines; this closes the loop entity-wise.
    "https://www.wikidata.org/wiki/Q140412904"
  ],
  "priceRange": "€€€€",
  // Brief B1 / Stage 2 - service-package catalogue so Google/Gemini and AI
  // engines read the two charter products as structured offerings. Prices
  // mirror lib/serviceSchema.js (Private = per yacht/week, Explorer = per
  // guest/week). No em dashes; hyphens only.
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Crewed Yacht Charter Services - Greek Waters",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private Fleet - full-crew crewed yacht charter",
          "serviceType": "Crewed yacht charter, full crew, per yacht per week"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "EUR",
          "minPrice": "15000",
          "maxPrice": "500000"
        },
        "areaServed": "GR"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Explorer Fleet - skippered yacht charter",
          "serviceType": "Skippered yacht charter, per guest per week"
        },
        "price": "420",
        "priceCurrency": "EUR",
        "areaServed": "GR"
      }
    ]
  },
  // aggregateRating: intentionally OMITTED until verified reviews exist.
  // Do NOT fabricate. When >=3 real reviews publish in Sanity, wire it
  // through lib/reviewsAggregate.js (the same gate serviceSchema uses).
  // Brief 4A: Mon-Fri 09:00-18:00 (business hours that match the
  // physical office). Weekend availability via WhatsApp/calls only -
  // not advertised as "open hours" to avoid Google reconciling
  // against a GBP that shows weekday-only hours.
  // 2026-06-10 George's call: declare 24/7 everywhere. A charter
  // broker answers around the clock (GR/GB/US phone lines across
  // timezones), and his other listings (Apple Business Connect etc.)
  // already say 24 hours — Google rewards cross-surface consistency.
  // Google's convention for always-open: opens 00:00, closes 23:59.
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }],
  // 2026-06-28 (GEO research Tier 1) — knowsAbout expanded to encode
  // the specialist niche explicitly, with the 2027 motor wedge front
  // and centre. These are true descriptions of the firm's expertise,
  // not claims. The narrower and more specific the topical entity set,
  // the more reliably AI models surface George Yachts for that exact
  // query cluster instead of a generalist competitor.
  "knowsAbout": [
    "Luxury crewed yacht charter in Greece",
    "Motor yacht charter Greece",
    "Weekly crewed charter rates in Greek waters",
    "Charter APA, VAT and gratuity in Greece",
    "Catamaran and sailing yacht charter Greece",
    "Cyclades yacht charter itineraries",
    "Ionian Islands yacht cruising",
    "Saronic Gulf yacht charter",
    "Sporades yacht charter",
    "Mykonos and Santorini yacht charter",
    "MYBA charter agreements",
    "IYBA yacht brokerage standards",
    "UHNW client services"
  ],
  // Tier 1.5 (Roberto Forbes integration brief — Addendum v2,
  // May 2026). The `subjectOf` field tells Google, ChatGPT,
  // Perplexity, Claude, Bing AI, and any future AI crawler:
  // "This Organization is the subject of this Forbes article."
  // For AI-search visibility this signal is more powerful than
  // any backlink (dofollow or nofollow) — confirmed by Boardroom
  // legal review on 4 May 2026 after the Forbes nofollow analysis.
  // Renders inside the homepage Organization JSON-LD that ships
  // server-side via app/layout.jsx → JsonLd → organizationSchema.
  "subjectOf": {
    "@type": "NewsArticle",
    "headline": "How The Wealthy Are Hedging For Instability",
    // 2026-06-25: schema.org/Google require `image` on every Article.
    // This node ships site-wide, so its single missing `image` was what
    // Ahrefs flagged as a structured-data validation error on ~477 of
    // 486 crawled URLs. One field here clears the whole site-wide count
    // and makes the NewsArticle a fully valid E-E-A-T credential that
    // Google/ChatGPT/Perplexity can parse. Uses our own branded OG image
    // (we can't reliably hotlink Forbes' asset).
    "image": "https://georgeyachts.com/opengraph-image",
    "url": "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
    "datePublished": "2026-05-01",
    "publisher": {
      "@type": "Organization",
      "name": "Forbes",
      "url": "https://www.forbes.com"
    },
    "author": {
      "@type": "Person",
      "name": "Jacques Ledbetter",
      "jobTitle": "Forbes Contributor"
    },
    "about": {
      "@type": "Organization",
      "name": "George Yachts Brokerage House",
      "url": "https://georgeyachts.com"
    }
  }
};

// 2026-07-23 (George: "12 Knots shows stars under their result, can we?") —
// AggregateRating + Review nodes attached to THIS node, because it is typed
// LocalBusiness: a supported review-snippet parent, unlike the Service node
// whose markup GSC flagged critical on 2026-06-30 and we retired 2026-07-08.
// Sourced from the on-site REVIEWS array only (real Google reviews George
// verified). Google treats first-party LocalBusiness ratings as self-serving
// and simply doesn't render stars; Bing/DuckDuckGo do render them, which is
// exactly where 12 Knots' 4.7/5 was showing. Authors are initials-only per
// George's 2026-06-29 privacy rule.
import { REVIEWS, initials, getOverallAggregateRating } from "@/lib/reviewsData";

const _agg = getOverallAggregateRating();
if (_agg) {
  organizationSchema.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": _agg.ratingValue,
    "reviewCount": _agg.reviewCount,
    "bestRating": "5",
    "worstRating": "1",
  };
  organizationSchema.review = REVIEWS.slice(0, 6).map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": initials(r.author) },
    "datePublished": r.date,
    "name": r.title,
    "reviewBody": r.body,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": String(r.rating),
      "bestRating": "5",
      "worstRating": "1",
    },
  }));
}
