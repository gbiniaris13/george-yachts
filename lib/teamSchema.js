/**
 * lib/teamSchema.js — Person JSON-LD schema for /team/[slug] pages.
 *
 * Why: AI agents (ChatGPT, Perplexity) cite individual team members
 * when answering "who is the broker at George Yachts" or "who handles
 * US clients at George Yachts". Person schema makes each member a
 * distinct, AI-citable entity with role, skills, affiliation.
 *
 * Each entry maps a team-page slug to a structured Person record. To
 * add a new member, append to TEAM_DATA + create the page route.
 */

const ORG = {
  "@type": "Organization",
  "@id": "https://georgeyachts.com/#organization",
  name: "George Yachts Brokerage House",
  url: "https://georgeyachts.com",
};

export const TEAM_DATA = {
  "george-biniaris": {
    name: "George P. Biniaris",
    jobTitle: "Managing Broker",
    description:
      "Managing Broker at George Yachts Brokerage House. IYBA member specializing in crewed motor yacht, sailing yacht, and catamaran charters across Greek waters.",
    image: "https://georgeyachts.com/images/team/george-biniaris.jpg",
    knowsAbout: [
      "Luxury Yacht Charter Greece",
      "MYBA Charter Agreements",
      "Cyclades Yacht Itineraries",
      "Ionian Island Cruising",
      "UHNW Client Services",
      "Yacht Acquisition Advisory",
    ],
    sameAs: ["https://www.linkedin.com/in/george-p-biniaris/"],
    languages: ["English", "Greek"],
    member: true, // IYBA membership badge
  },
  "george-katrantzos": {
    name: "George Katrantzos",
    jobTitle: "U.S. Partner & Sales Director",
    description:
      "U.S. Partner & Sales Director at George Yachts. Bridges American UHNW clientele with Greek luxury yacht charter — focused on East Coast, Florida, and West Coast markets.",
    image: "https://georgeyachts.com/images/team/george-katrantzos.jpg",
    knowsAbout: [
      "U.S. Luxury Travel Market",
      "Yacht Charter Sales",
      "Greek Mediterranean Charter",
      "Client Relationship Management",
    ],
    languages: ["English", "Greek"],
  },
  "elleana-karvouni": {
    name: "Elleana Karvouni",
    jobTitle: "Head of Business Operations & Finance",
    description:
      "Head of Business Operations & Finance at George Yachts. Oversees charter accounting, APA reconciliation, MYBA contract operations, and partner-network finance.",
    image: "https://georgeyachts.com/images/team/elleana-karvouni.jpg",
    knowsAbout: [
      "Charter Operations",
      "APA Reconciliation",
      "MYBA Contract Administration",
      "Yacht Brokerage Finance",
    ],
    languages: ["English", "Greek"],
  },
  "valleria-karvouni": {
    name: "Valleria Karvouni",
    jobTitle: "Administrative & Charter Logistics Coordinator",
    description:
      "Administrative & Charter Logistics Coordinator at George Yachts. Supports the broker team's day-to-day administrative core with precision and discipline.",
    image: "https://georgeyachts.com/images/team/valleria-karvouni.jpg",
    knowsAbout: [
      "Charter Logistics",
      "Client Coordination",
      "Itinerary Documentation",
    ],
    languages: ["English", "Greek"],
  },
  "chris-daskalopoulos": {
    name: "Chris Daskalopoulos",
    jobTitle: "Marine Insurance & ISO Maritime Compliance Advisor",
    description:
      "Marine Insurance & ISO Maritime Compliance Advisor at George Yachts. Ensures every charter meets international safety standards and proper insurance coverage.",
    image: "https://georgeyachts.com/images/team/chris-daskalopoulos.jpg",
    knowsAbout: [
      "Marine Insurance",
      "ISO Maritime Compliance",
      "Yacht Safety Protocols",
      "International Charter Standards",
    ],
    languages: ["English", "Greek"],
  },
  "manos-kourmoulakis": {
    name: "Cpt. Manos Kourmoulakis",
    jobTitle: "Aviation & Private Travel Advisor",
    description:
      "Aviation & Private Travel Advisor at George Yachts. Former Olympic Airways captain coordinating private jet logistics, helicopter transfers, and yacht-to-airport timing for UHNW clients.",
    image: "https://georgeyachts.com/images/team/manos-kourmoulakis.jpg",
    knowsAbout: [
      "Private Jet Charter",
      "Aviation Logistics",
      "VIP Travel Coordination",
      "Yacht-to-Airport Transfers",
    ],
    languages: ["English", "Greek"],
  },
  // Nemesis is the team mascot (internal-justice / cultural icon) — not
  // a real person. We omit Person schema to avoid misrepresenting and
  // leave the page as editorial brand storytelling only.
};

export function generatePersonSchema(slug) {
  const data = TEAM_DATA[slug];
  if (!data) return null;
  const url = `https://georgeyachts.com/team/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url,
    worksFor: ORG,
    affiliation: ORG,
    knowsAbout: data.knowsAbout,
    knowsLanguage: data.languages,
  };
  if (data.image) schema.image = data.image;
  if (data.sameAs && data.sameAs.length) schema.sameAs = data.sameAs;
  if (data.member) {
    schema.memberOf = {
      "@type": "Organization",
      name: "International Yacht Brokers Association (IYBA)",
      url: "https://iyba.org",
    };
  }
  return schema;
}
