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
  "logo": "https://georgeyachts.com/images/logo.png",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "George P. Biniaris",
    "jobTitle": "Managing Broker & CEO",
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
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "30 N Gould St, STE R",
    "addressLocality": "Sheridan",
    "addressRegion": "WY",
    "postalCode": "82801",
    "addressCountry": "US"
  },
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
