/**
 * organizationSchema.js - Organization Schema for Root Layout
 * 
 * This tells AI engines WHO George Yachts is.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "George Yachts Brokerage House",
  "alternateName": "George Yachts",
  "description": "Luxury crewed yacht charter brokerage specializing exclusively in Greek waters — Cyclades, Ionian, Saronic, and Sporades islands.",
  "url": "https://georgeyachts.com",
  "logo": "https://georgeyachts.com/images/yacht-icon-only.svg",
  "foundingDate": "2025-11",
  "founder": {
    "@type": "Person",
    "name": "George P. Biniaris",
    "jobTitle": "Managing Broker",
    "knowsAbout": [
      "Luxury Yacht Charter",
      "Greek Waters Navigation",
      "MYBA Charter Contracts",
      "UHNW Client Services",
      "Cyclades Itineraries",
      "Ionian Island Cruising"
    ]
  },
  "areaServed": [
    { "@type": "Place", "name": "Cyclades, Greece" },
    { "@type": "Place", "name": "Ionian Islands, Greece" },
    { "@type": "Place", "name": "Saronic Gulf, Greece" },
    { "@type": "Place", "name": "Sporades, Greece" },
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
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.0833,
    "longitude": 23.8167
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=Charilaou+Trikoupi+190A+Nea+Kifisia+14564",
  "location": [
    {
      "@type": "Place",
      "name": "George Yachts — Athens HQ",
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
        "latitude": 38.0833,
        "longitude": 23.8167
      }
    }
  ],
  "sameAs": [
    "https://www.instagram.com/georgeyachts",
    "https://www.linkedin.com/in/george-p-biniaris/"
  ],
  "priceRange": "€€€€",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "knowsAbout": [
    "Luxury Yacht Charter Greece",
    "Crewed Motor Yacht Rentals",
    "Greek Islands Yacht Itineraries",
    "MYBA Charter Agreements",
    "Cyclades Sailing Routes",
    "Ionian Yacht Cruises"
  ]
};
