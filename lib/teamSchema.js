/**
 * lib/teamSchema.js — Person JSON-LD schema for /team/[slug] pages.
 *
 * 2026-05-08 Phase 1 (E-E-A-T enrichment): every Person record now
 * exports the maximum signal surface AI engines + Google read for
 * author authority — knowsAbout, memberOf, alumniOf, hasCredential,
 * award, sameAs, knowsLanguage, hasOccupation, jobTitle, and the
 * Forbes feature reference for the Managing Broker.
 *
 * Why: AI agents (ChatGPT, Perplexity, Gemini) cite individual team
 * members when answering "who is the broker at George Yachts" or
 * "who handles US clients at George Yachts". Strong Person schema
 * makes each member a distinct, AI-citable entity, and the
 * authoritative cross-references (IYBA, Forbes, LinkedIn) signal
 * Trust to Google's E-E-A-T scoring.
 *
 * Each entry maps a team-page slug to a structured Person record.
 * Same schema also referenced from blog/[slug] articleSchema as
 * `author` (deep structured author for every editorial piece).
 */

const ORG = {
  "@type": "Organization",
  "@id": "https://georgeyachts.com/#organization",
  name: "George Yachts Brokerage House",
  url: "https://georgeyachts.com",
};

const IYBA = {
  "@type": "Organization",
  name: "International Yacht Brokers Association",
  alternateName: "IYBA",
  url: "https://iyba.org",
};

const FORBES_FEATURE = {
  "@type": "CreativeWork",
  name: "How The Wealthy Are Hedging For Instability",
  url: "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
  publisher: {
    "@type": "Organization",
    name: "Forbes",
    url: "https://www.forbes.com",
  },
  datePublished: "2026-05-01",
};

export const TEAM_DATA = {
  "george-biniaris": {
    name: "George P. Biniaris",
    jobTitle: "Founder and Managing Broker",
    description:
      "Founder and Managing Broker at George Yachts Brokerage House, U.S.-headquartered (Wyoming) and operated from Athens. Cycladic roots (Syros); licensed motor yacht skipper and former charter operations manager before founding the firm. IYBA member specializing in crewed motor yacht, sailing yacht, and catamaran charters across Greek waters. Featured in Forbes (May 2026).",
    image: "https://georgeyachts.com/images/george-syros-quay.jpg",
    knowsAbout: [
      "Luxury Yacht Charter Greece",
      "Crewed Motor Yacht Charter",
      "Sailing Yacht Charter",
      "Catamaran Charter",
      "MYBA Charter Agreements",
      "APA (Advance Provisioning Allowance)",
      "Cyclades Yacht Itineraries",
      "Ionian Island Cruising",
      "Saronic Gulf Itineraries",
      "UHNW Client Services",
      "Greek Waters Navigation",
    ],
    sameAs: [
      "https://www.linkedin.com/in/george-p-biniaris/",
      // Stage 2 (Task 3 / B2) - Wikidata person entity + Forbes feature.
      // Wikidata feeds Google Knowledge Graph and is ingested by LLMs.
      "https://www.wikidata.org/wiki/Q140078221",
      "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
      "https://www.instagram.com/georgeyachts",
      // Phase 7 Round 17 (2026-05-12) — canonical author/E-E-A-T page.
      // Cross-link so AI engines and Google understand /team/george-biniaris
      // and /about/george-p-biniaris are the same Person entity, with the
      // /about/ URL carrying the richer biography + bibliography.
      "https://georgeyachts.com/about/george-p-biniaris",
    ],
    languages: ["English", "Greek"],
    isMember: true, // IYBA
    founder: true,
    occupation: "Yacht Charter Broker",
    occupationCategory: "41-3091.00", // O*NET — Sales Representatives, Services
    forbesFeatured: true,
    subjectOf: FORBES_FEATURE,
    nationality: "GR",
    workLocation: {
      "@type": "Place",
      name: "Athens, Greece",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kifisia",
        addressRegion: "Attica",
        postalCode: "14564",
        addressCountry: "GR",
      },
    },
  },
  "george-katrantzos": {
    name: "George Katrantzos",
    jobTitle: "Advisor, U.S. Luxury Travel",
    description:
      "Independent advisor to George Yachts on the U.S. luxury travel market, based in New York.",
    image: "https://georgeyachts.com/images/team/george-katrantzos.jpg",
    knowsAbout: [
      "U.S. Luxury Travel Market",
      "Yacht Charter Sales",
      "Greek Mediterranean Charter",
      "Client Relationship Management",
      "UHNW Concierge Services",
      "Transatlantic Charter Coordination",
    ],
    languages: ["English", "Greek"],
    occupation: "Luxury Travel Advisor",
    workLocation: { "@type": "Place", name: "United States" },
  },
  "elleana-karvouni": {
    name: "Elleana Karvouni",
    jobTitle: "Advisor, Business Operations & Finance",
    description:
      "Independent advisor to George Yachts on business operations and finance.",
    image: "https://georgeyachts.com/images/team/elleana-karvouni.jpg",
    knowsAbout: [
      "Charter Operations",
      "APA Reconciliation",
      "MYBA Contract Administration",
      "Yacht Brokerage Finance",
      "Charter Accounting",
      "International Yacht Tax Frameworks",
    ],
    languages: ["English", "Greek"],
    occupation: "Business Operations Advisor",
    workLocation: { "@type": "Place", name: "Athens, Greece" },
  },
  "valleria-karvouni": {
    name: "Valleria Karvouni",
    jobTitle: "Advisor, Charter Logistics",
    description:
      "Independent advisor to George Yachts on charter logistics and documentation.",
    image: "https://georgeyachts.com/images/team/valleria-karvouni.jpg",
    knowsAbout: [
      "Charter Logistics",
      "Client Coordination",
      "Itinerary Documentation",
      "Yacht Charter Administration",
    ],
    languages: ["English", "Greek"],
    occupation: "Charter Logistics Advisor",
    workLocation: { "@type": "Place", name: "Athens, Greece" },
  },
  "chris-daskalopoulos": {
    name: "Chris Daskalopoulos",
    jobTitle: "Independent Advisor, Marine Insurance & ISO",
    description:
      "Independent advisor to George Yachts on marine insurance and ISO-based compliance questions, with Wattrate, an ISO, climate law and ESG advisory in Greece.",
    image: "https://georgeyachts.com/images/team/chris-daskalopoulos.jpg",
    knowsAbout: [
      "Marine Insurance",
      "ISO Maritime Compliance",
      "ISO Management Systems",
      "Maritime Risk Management",
    ],
    languages: ["English", "Greek"],
    occupation: "Marine Insurance Advisor",
    sameAs: ["https://wattrate.gr/"],
    workLocation: { "@type": "Place", name: "Athens, Greece" },
  },
  "manos-kourmoulakis": {
    name: "Cpt. Manos Kourmoulakis",
    jobTitle: "Advisor, Aviation & Private Travel",
    description:
      "Independent advisor to George Yachts on aviation and private travel, a former Olympic Airways captain.",
    image: "https://georgeyachts.com/images/team/manos-kourmoulakis.jpg",
    knowsAbout: [
      "Private Jet Charter",
      "Aviation Logistics",
      "VIP Travel Coordination",
      "Yacht-to-Airport Transfers",
      "Helicopter Charter",
      "Commercial Aviation Operations",
    ],
    languages: ["English", "Greek"],
    occupation: "Aviation Advisor",
    alumniOf: {
      "@type": "Organization",
      name: "Olympic Airways",
    },
    workLocation: { "@type": "Place", name: "Athens, Greece" },
  },
};

export function generatePersonSchema(slug) {
  const data = TEAM_DATA[slug];
  if (!data) return null;
  const url = `https://georgeyachts.com/team/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url,
    affiliation: ORG,
    knowsAbout: data.knowsAbout,
    knowsLanguage: data.languages,
  };
  // 13/10/2026 (George): only the Managing Broker works for the house;
  // everyone else is an independent advisor, affiliated, never employed.
  if (data.founder) schema.worksFor = ORG;
  if (data.image) schema.image = data.image;
  if (data.sameAs && data.sameAs.length) schema.sameAs = data.sameAs;
  if (data.isMember) schema.memberOf = IYBA;
  if (data.alumniOf) schema.alumniOf = data.alumniOf;
  if (data.occupation) {
    schema.hasOccupation = {
      "@type": "Occupation",
      name: data.occupation,
      ...(data.occupationCategory
        ? { occupationalCategory: data.occupationCategory }
        : {}),
    };
  }
  if (data.workLocation) schema.workLocation = data.workLocation;
  if (data.subjectOf) schema.subjectOf = data.subjectOf;
  if (data.nationality) {
    schema.nationality = { "@type": "Country", name: "Greece" };
  }
  // Boss directive 2026-05-08 — Forbes feature as award.
  // CreativeWork mention is a Google E-E-A-T signal of authoritative
  // recognition. Stronger than just `sameAs` to the article URL.
  if (data.forbesFeatured) {
    schema.award = ["Featured in Forbes - May 2026"];
  }
  return schema;
}

/**
 * Convenience: get the Managing Broker's Person schema for embedding
 * as `author` on every blog post. Centralises the structured author
 * so an update to George's bio surfaces everywhere automatically.
 */
export function getManagingBrokerPersonSchema() {
  return generatePersonSchema("george-biniaris");
}
