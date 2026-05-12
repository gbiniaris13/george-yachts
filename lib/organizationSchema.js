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
  "@id": "https://georgeyachts.com#organization",
  "name": "George Yachts Brokerage House",
  "alternateName": "George Yachts",
  "slogan": "Smooth seas and sharp suits.",
  "description": "Luxury crewed yacht charter brokerage specializing exclusively in Greek waters - Cyclades, Ionian, and Saronic islands. MYBA-standard contracts, IYBA member.",
  "url": "https://georgeyachts.com",
  "logo": "https://georgeyachts.com/images/yacht-icon-only.svg",
  "foundingDate": "2025-11",
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
    "jobTitle": "Managing Broker",
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
      "jobTitle": "Managing Broker"
    }
  ],
  "areaServed": [
    { "@type": "Place", "name": "Cyclades, Greece" },
    { "@type": "Place", "name": "Ionian Islands, Greece" },
    { "@type": "Place", "name": "Saronic Gulf, Greece" },
    { "@type": "Country", "name": "Greece" }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "International Yacht Brokers Association (IYBA)",
    "url": "https://iyba.org"
  },
  "telephone": ["+30 6970380999", "+44 2037692707", "+1 7867988798"],
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+30-697-038-0999", "contactType": "sales", "areaServed": "GR" },
    { "@type": "ContactPoint", "telephone": "+44-203-769-2707", "contactType": "sales", "areaServed": "GB" },
    { "@type": "ContactPoint", "telephone": "+1-786-798-8798", "contactType": "sales", "areaServed": "US" }
  ],
  // Operational HQ: Athens, Greece. This is the address Google's local
  // pack uses for "yacht charter Athens" / "yacht charter Greece"
  // queries — the previous value was the Wyoming registered-agent
  // address (legal entity only), which killed Greek local-SEO signal.
  // Legal entity is still disclosed via `legalName` below.
  // Operational HQ — real Athens address. This is what GBP + Google
  // local pack matches against. Coordinates approximated from
  // Charilaou Trikoupi 190A, Nea Kifisia 14564 (verify via GBP geocode
  // on first claim).
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Charilaou Trikoupi 190A",
    "addressLocality": "Nea Kifisia",
    "addressRegion": "Attica",
    "postalCode": "14564",
    "addressCountry": "GR"
  },
  "legalName": "George Yachts Brokerage House LLC",
  // Brief 4A: precise coordinates for Charilaou Trikoupi 190A, Nea
  // Kifisia 14564. Updated from approx 38.0833/23.8167 to verified
  // 38.0742/23.8243.
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.0742,
    "longitude": 23.8243
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=Charilaou+Trikoupi+190A+Nea+Kifisia+14564",
  "location": [
    {
      "@type": "Place",
      "name": "George Yachts - Athens HQ",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Charilaou Trikoupi 190A",
        "addressLocality": "Nea Kifisia",
        "addressRegion": "Attica",
        "postalCode": "14564",
        "addressCountry": "GR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.0742,
        "longitude": 23.8243
      }
    }
  ],
  // Boss directive 2026-05-08 — sameAs strengthens the entity graph
  // for AI search systems. Each URL is an authoritative confirmation
  // that this Organization is the same entity referenced there.
  // Forbes article + IYBA membership are first-class signals.
  "sameAs": [
    "https://www.instagram.com/georgeyachts",
    "https://www.linkedin.com/in/george-p-biniaris/",
    "https://iyba.org",
    "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/"
  ],
  "priceRange": "€€€€",
  // Brief 4A: Mon-Fri 09:00-18:00 (business hours that match the
  // physical office). Weekend availability via WhatsApp/calls only -
  // not advertised as "open hours" to avoid Google reconciling
  // against a GBP that shows weekday-only hours.
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }],
  "knowsAbout": [
    "Luxury Yacht Charter Greece",
    "Crewed Motor Yacht Rentals",
    "Greek Islands Yacht Itineraries",
    "MYBA Charter Agreements",
    "Cyclades Sailing Routes",
    "Ionian Yacht Cruises"
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
