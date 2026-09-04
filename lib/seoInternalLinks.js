// Internal-linking engine for the programmatic SEO universe.
// 2026-05-11 (Phase 7 Round 6). Section 1.6 of the SEO strategy doc.
//
// Why: internal linking is the No. 1 free lever after backlinks for
// both Google PageRank distribution and AI-engine topical-graph
// mapping. With 112 programmatic pages now live, a "see also" widget
// at the bottom of each one keeps users (and crawlers) moving across
// the cluster instead of bouncing.
//
// How: build one catalog of every programmatic URL with cheap tags
// (island, yachtType, useCase, duration, region, category) inferred
// from the data files. The relatedFor() function takes the current
// page's urlPath and returns 5-6 sibling URLs picked by tag overlap.
// Pure function. No network. Output is deterministic per input so
// pages stay stable across builds (good for caching + crawl
// consistency).

import { YACHT_TYPES } from "@/lib/yachtTypeSeo";
import { USE_CASES } from "@/lib/useCaseSeo";
import { LONG_TAIL_PAGES } from "@/lib/longTailSeo";
import { COMPARISONS } from "@/lib/comparisonSeo";
import { LINKABLE_ASSETS } from "@/lib/linkableAssetSeo";
import { COMBOS } from "@/lib/comboSeo";
import { ARTICLES } from "@/lib/articleSeo";
import { DURATION_PAGES } from "@/lib/durationSeo";
import { GLOSSARY_TERMS } from "@/lib/glossarySeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";
import { ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesSeo";
import { BOTTOM_FUNNEL_PAGES } from "@/lib/bottomFunnelSeo";
import { BEST_YACHTS_PAGES } from "@/lib/bestYachtsSeo";
import { JOURNAL_CLUSTERS } from "@/lib/journal-clusters";
import { ISLANDS } from "@/lib/islands";

// Known yacht-type tokens used inside combo slugs and yacht-type
// page slugs. Order matters when matching prefixes (longer first).
const YACHT_TYPE_TOKENS = [
  "motor-yacht",
  "sailing-yacht",
  "power-catamaran",
  "catamaran",
  "gulet",
  "superyacht",
];

// Known island slugs — kept in sync with next.config.mjs rewrite
// and /lib/islands.js. Used to infer the "island" tag from combo
// and duration slugs.
const ISLAND_SLUGS = [
  // 2026-05-12 — kept in sync with /lib/islands.js ISLANDS slugs
  // + next.config.mjs ISLAND_SLUGS_PATTERN rewrite.
  "ios",
  "antiparos",
  "tinos",
  "andros",
  "kos",
  "skopelos",
  "patmos",
  "mykonos",
  "santorini",
  "paros",
  "corfu",
  "hydra",
  "milos",
  "folegandros",
  "lefkada",
  "spetses",
  "kefalonia",
  "naxos",
  "rhodes",
  "skiathos",
  "zakynthos",
  "ithaca",
  "paxos",
  "symi",
  "crete-chania",
  "sifnos",
  "athens",
];

const REGION_BY_ISLAND = {
  mykonos: "cyclades",
  santorini: "cyclades",
  paros: "cyclades",
  naxos: "cyclades",
  milos: "cyclades",
  folegandros: "cyclades",
  sifnos: "cyclades",
  // Round 14 Cyclades additions
  ios: "cyclades",
  antiparos: "cyclades",
  tinos: "cyclades",
  andros: "cyclades",
  corfu: "ionian",
  lefkada: "ionian",
  kefalonia: "ionian",
  ithaca: "ionian",
  paxos: "ionian",
  zakynthos: "ionian",
  hydra: "saronic",
  spetses: "saronic",
  rhodes: "dodecanese",
  symi: "dodecanese",
  // Round 14 Dodecanese additions
  kos: "dodecanese",
  patmos: "dodecanese",
  skiathos: "sporades",
  // Round 14 Sporades addition
  skopelos: "sporades",
  "crete-chania": "crete",
  athens: "attica",
};

// 2026-07-30 — cohorts. The Ahrefs crawl found 20 sitemap pages sitting on a
// single inbound internal link: each had its one correct hub (the 2027 month
// pages hang off /yacht-charter-greece-2027, the market reports off
// /market-reports) but no lateral path to its own siblings. That is a dead end
// for a reader comparing June against September, and it starves those pages of
// internal PageRank.
//
// The existing tag scoring could never connect them: none of these slugs
// carries an island or a yacht type, so every affinity rule scored zero. A
// cohort is an explicit hand-declared set of siblings that belong together,
// scored above every inferred tag so a cohort member always surfaces its own
// family first.
const COHORTS = {
  // 2026-08-06 (job 6) — the first two GEOGRAPHIC cohorts, and the reason they
  // exist is the clearest finding of the day.
  //
  // /yacht-charter-dodecanese-rhodes carries 872 impressions and one click at
  // position 30.7. /yacht-charter-sporades-skiathos carries 1.007 and three
  // clicks at 23.8. Between them that is a fifth of all island-page
  // impressions on the site. Their queries are not island queries at all:
  // "dodecanese yacht charter" (336), "yacht charter sporades" (264), "yacht
  // charter sporades islands" (272). People are searching for the REGION.
  //
  // Both pages already answer that correctly in their h1. What sank them is
  // that every single related link they emitted pointed at duration variants
  // of one island: rhodes-7-day, rhodes-10-day, rhodes-14-day. Nothing about
  // Symi, Kos or Patmos, which are the islands that make the Dodecanese the
  // Dodecanese. Nothing about Skopelos or Alonnisos for the Sporades. There
  // was no geographic cohort in this file at all, so the inferred tag scoring
  // fell back to the only affinity it could see, the island slug, and built an
  // incestuous cluster around it.
  //
  // A region page whose entire outbound neighbourhood is one island reads as
  // an island page. These two cohorts say otherwise.
  dodecanese: [
    "/yacht-charter-dodecanese-rhodes",
    "/yacht-charter-rhodes",
    "/yacht-charter-symi",
    "/yacht-charter-kos",
    "/yacht-charter-patmos",
    "/motor-yacht-charter-rhodes",
    "/yacht-charter-rhodes-anchorages",
  ],
  sporades: [
    "/yacht-charter-sporades-skiathos",
    "/yacht-charter-skiathos",
    "/yacht-charter-skopelos",
    "/yacht-charter-skiathos-anchorages",
  ],
  // 2026-08-06 — widened. The five month/hub pages were talking only to each
  // other while the two pages that actually argue the 2027 case, the outlook
  // and the lead-time piece, sat outside the family. A reader deciding whether
  // to commit to 2027 needs the argument, not just the calendar.
  "season-2027": [
    "/yacht-charter-greece-2027",
    "/yacht-charter-greece-june-2027",
    "/yacht-charter-greece-july-2027",
    "/yacht-charter-greece-august-2027",
    "/yacht-charter-greece-september-2027",
    // NOT /greek-yacht-charter-2027-outlook: COHORT_BY_PATH is a flat map, so
    // a page belongs to exactly one cohort and the outlook already belongs to
    // "market-2026", where it genuinely sits as part of that series. Listing
    // it twice silently handed it to whichever cohort was declared last and
    // gained nothing. It stays a market report and is reached from the hub.
    "/blog/how-far-in-advance-book-greek-yacht-charter-2027",
  ],
  "market-2026": [
    "/market-reports",
    "/2026-greek-charter-market-report",
    "/2026-peak-season-forecast-greek-yacht-charter",
    "/q1-2026-greek-yacht-charter-market-retrospective",
    "/mid-year-2026-greek-yacht-charter-market-check",
    "/greek-yacht-charter-2027-outlook",
    "/greek-yacht-charter-pricing-index-2026",
  ],
  // 2026-08-06 — the catamaran cohort. Search Console showed 17 pages fighting
  // over the same catamaran queries: 97 queries, 2.466 impressions, 3 clicks.
  // On "catamaran charter greece" Google was surfacing /best-catamarans at
  // position 48 while /catamaran-charter-greece, the 2.542-word page whose
  // slug and H1 match the term exactly, sat unseen at position 5.3. The titles
  // have been separated so each page owns one intent; this cohort is the other
  // half of the fix, giving every satellite a lateral path to the pillar
  // instead of leaving them to compete with it in isolation.
  "catamaran": [
    "/catamaran-charter-greece",
    "/crewed-catamaran-charter-greece",
    "/best-catamarans-greece-charter",
    "/catamaran-charter-greece-family",
    "/sailing-catamaran-charter-greece",
    "/power-catamaran-charter-greece",
    "/crewed-catamaran-charter-cyclades",
    "/best-4-cabin-catamarans-greece",
    "/best-5-cabin-catamarans-greece",
    "/catamaran-vs-monohull-yacht-charter-greece",
  ],
  // 2026-08-06 — the motor-yacht cohort, declared for the same reason as the
  // catamaran one above and off the same Search Console read. We already own a
  // motor-yacht page per island, yet Google was answering "motor yacht rhodes"
  // with the generic /yacht-charter-rhodes at position 26.5 while
  // /motor-yacht-charter-rhodes sat idle. The island pages had no lateral path
  // to each other or to the pillar, so nothing told Google they were a family.
  "motor-yacht": [
    "/motor-yacht-charter-greece",
    "/weekly-motor-yacht-charter-greece",
    "/best-motor-yachts-greece-speed",
    "/motor-yacht-charter-athens",
    "/motor-yacht-charter-mykonos",
    "/motor-yacht-charter-santorini",
    "/motor-yacht-charter-rhodes",
    "/motor-yacht-charter-corfu",
    "/motor-yacht-charter-hydra",
    "/motor-yacht-charter-saronic-gulf",
  ],
  // 2026-08-06 — three more cohorts from the same Search Console read, each
  // one a set of pages that were competing instead of supporting.
  //
  // honeymoon: three pages answered the same query. /honeymoon-yacht-charter-
  // greece owns the term (its slug matches it exactly); the others now carry
  // the itinerary and the editorial angle.
  "honeymoon": [
    "/honeymoon-yacht-charter-greece",
    "/yacht-charter-greece-honeymoon",
    "/blog/honeymoon-yacht-charter-greece-2026-romantic-itinerary",
    "/best-yachts-greece-couples",
  ],
  // weekly-rates: the pages a charterer lands on when the question is simply
  // "what does a week cost". They were scattered across the site with no path
  // between them, which is why "yacht charter greece cost" was being answered
  // by a glossary entry.
  // 2026-08-06 (job 18) — widened after the full cost-cluster read. This is the
  // highest-demand commercial theme on the site by a distance: 127 queries and
  // 918 impressions for TWO clicks, against just 6 impressions for anything
  // containing "2027". Every cost query was being answered by three to five of
  // these pages at once. Titles have been separated so each owns one question
  // (general cost / per metre / weekly card / per day / calculator / budget
  // ceiling / index data); this cohort is the other half, giving each a lateral
  // path to the rest instead of leaving them to compete in isolation.
  "weekly-rates": [
    "/weekly-yacht-charter-rates-greece",
    "/weekly-motor-yacht-charter-greece",
    "/greek-charter-index-2026",
    "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",
    "/greek-yacht-charter-2026-complete-pricing-guide",
    "/yacht-charter-greece-under-100000",
    "/tools/charter-cost-calculator",
    "/glossary/day-charter",
    "/crewed-yacht-charter-greece",
  ],
  "journal-hubs": [
    "/blog",
    "/journal/choosing-a-yacht",
    "/journal/cyclades-charters",
    "/journal/saronic-charters",
    "/journal/family-yachting",
    "/journal/first-time-charterers",
    "/journal/yacht-charter-pricing",
  ],
};

const COHORT_BY_PATH = Object.fromEntries(
  Object.entries(COHORTS).flatMap(([name, paths]) => paths.map((p) => [p, name]))
);

function inferTags(urlPath) {
  // Extract the "shape" of a programmatic URL into tags. Cheap
  // string matching keeps this O(N) over the catalog and avoids
  // a per-page schema we'd have to keep in sync with every data
  // file.
  const slug = urlPath.replace(/^\//, "");
  const tags = { slug, urlPath };
  const cohort = COHORT_BY_PATH[urlPath];
  if (cohort) tags.cohort = cohort;

  for (const token of YACHT_TYPE_TOKENS) {
    if (slug.includes(token)) {
      tags.yachtType = token;
      break;
    }
  }

  for (const island of ISLAND_SLUGS) {
    // "athens" inside other slugs is fine — there's no other word
    // in our space that contains it. Same for the rest.
    const re = new RegExp(`(?:^|-)${island}(?:-|$)`);
    if (re.test(slug)) {
      tags.island = island;
      tags.region = REGION_BY_ISLAND[island];
      break;
    }
  }

  const durationMatch = slug.match(/-(\d{1,2})-day(?:$|-)/);
  if (durationMatch) tags.duration = parseInt(durationMatch[1], 10);

  if (slug.startsWith("yacht-charter-") && tags.island && !tags.duration) {
    tags.category = "island";
  } else if (tags.duration) {
    tags.category = "duration";
  } else if (slug.includes("-vs-")) {
    tags.category = "comparison";
  } else if (slug.includes("honeymoon") || slug.includes("family") || slug.includes("corporate") || slug.includes("anniversary") || slug.includes("bachelor") || slug.includes("wedding") || slug.includes("birthday") || slug.includes("milestone")) {
    tags.category = "use-case";
  } else if (slug.includes("blog/")) {
    tags.category = "blog";
  } else if (tags.yachtType && tags.island) {
    tags.category = "combo";
  } else if (tags.yachtType && !tags.island) {
    tags.category = "yacht-type";
  } else {
    tags.category = "article";
  }

  return tags;
}

// Build the catalog once at module init. The page-rendering layer
// imports this lazily so it's effectively static.
function buildCatalog() {
  const entries = [];
  for (const p of YACHT_TYPES) entries.push({ ...p, ...inferTags(p.urlPath), source: "yacht-type" });
  for (const p of USE_CASES) entries.push({ ...p, ...inferTags(p.urlPath), source: "use-case" });
  for (const p of LONG_TAIL_PAGES) entries.push({ ...p, ...inferTags(p.urlPath), source: "long-tail" });
  for (const p of COMPARISONS) entries.push({ ...p, ...inferTags(p.urlPath), source: "comparison" });
  for (const p of LINKABLE_ASSETS) entries.push({ ...p, ...inferTags(p.urlPath), source: "linkable-asset" });
  for (const p of COMBOS) entries.push({ ...p, ...inferTags(p.urlPath), source: "combo" });
  for (const p of ARTICLES) entries.push({ ...p, ...inferTags(p.urlPath), source: "article" });
  for (const p of DURATION_PAGES) entries.push({ ...p, ...inferTags(p.urlPath), source: "duration" });

  // 2026-08-06 (job 6) — the 26 island pages. They were never in this catalog:
  // lib/islands.js was not imported into this file at all.
  //
  // inferTags() has read island slugs since the day it was written, so a
  // reader standing ON /yacht-charter-rhodes always got sensible suggestions.
  // The gap ran the other way. The catalog is the candidate list, so the
  // related widget could never suggest an island page from anywhere.
  //
  // To be accurate about the size of this: the islands were not orphans. They
  // already held 1.064 inbound internal links from navigation and body copy.
  // Adding them here is worth +82 links across 63 pages, about 8% more. What
  // makes those 82 worth having is not the count but the placement: they are
  // the contextual, same-region links the engine picks, which is how the
  // Dodecanese page finally reaches Symi, Kos and Patmos.
  //
  // It surfaced while wiring the Dodecanese cohort, which correctly scored
  // those three at +8 and then found none of them to score.
  for (const i of ISLANDS) {
    const urlPath = `/yacht-charter-${i.slug}`;
    entries.push({
      ...inferTags(urlPath),
      urlPath,
      h1: `${i.name} Yacht Charter`,
      eyebrow: i.region,
      source: "island",
    });
  }

  // Hand-added evergreen targets so the related widget can surface
  // them too — these don't live in any data array but are real
  // high-value pages.
  entries.push({ urlPath: "/sailing-distance-calculator", h1: "Sailing Distance Calculator", source: "tool", category: "tool" });
  // 2026-09-04: /charter-cost-estimator now 301s to the calculator (one door for the cost question).
  entries.push({ urlPath: "/charter-calendar-heat-map", h1: "Charter Calendar Heat Map", source: "tool", category: "tool" });
  entries.push({ urlPath: "/yacht-finder", h1: "Smart Match Quiz", source: "tool", category: "tool" });
  entries.push({ urlPath: "/cost-calculator", h1: "Charter Cost Calculator", source: "tool", category: "tool" });
  // Phase 7 R26 (2026-05-12) - VAT/APA calculator at /tools path.
  entries.push({ urlPath: "/tools/charter-cost-calculator", h1: "Greek Yacht Charter Cost Calculator", source: "tool", category: "tool" });
  entries.push({ urlPath: "/itinerary-builder", h1: "Itinerary Builder", source: "tool", category: "tool" });
  entries.push({ urlPath: "/reviews", h1: "Reviews", source: "tool", category: "trust" });
  entries.push({ urlPath: "/2026-greek-charter-market-report", h1: "2026 Greek Charter Market Report", source: "report", category: "linkable-asset" });

  // 2026-06-26 — the weekly-motor wedge: the pillar + the all-in rate card.
  // Tagged motor-yacht so the related-pages engine surfaces them with strong
  // affinity across the whole motor + pricing cluster, flowing internal-link
  // authority UP to the two new money pages.
  // category "tool" gives the universal relevance boost so this hub clears the
  // top-6 cut on the dense motor cluster (eyebrow is set explicitly, so the
  // visible label stays "Weekly charter", not "Planning tool").
  entries.push({ urlPath: "/weekly-motor-yacht-charter-greece", h1: "Weekly Motor Yacht Charter Greece", eyebrow: "Weekly charter", yachtType: "motor-yacht", category: "tool", source: "pillar" });
  // 2026-07-22 — the 2027 doorway: day/last-minute intent lands on the
  // programmatic pages in July while the weekly 2027 buyers decide in
  // autumn. Category "tool" = universal boost so the hub clears the
  // top-6 cut everywhere (eyebrow set explicitly so it reads "2027
  // season", not "Planning tool").
  entries.push({ urlPath: "/yacht-charter-greece-2027", h1: "2027 Charter Calendar - Join the Priority List", eyebrow: "2027 season", category: "tool", source: "pillar" });
  entries.push({ urlPath: "/weekly-yacht-charter-rates-greece", h1: "Weekly Yacht Charter Rates", eyebrow: "Weekly rates", yachtType: "motor-yacht", category: "tool", source: "pricing" });

  // Phase 7 Round 15 (2026-05-12) — glossary hub + 30 definition pages.
  // Surface definitions in "Continue exploring" widgets across the
  // programmatic universe so users (and crawlers) can pivot from a
  // pricing page to /glossary/apa, from a yacht-type page to
  // /glossary/superyacht, etc. The glossary hub itself appears
  // alongside other linkable assets at the top.
  entries.push({ urlPath: "/glossary", h1: "Yacht Charter Glossary", source: "glossary", category: "linkable-asset" });
  // 2026-07-30 — the Journal cluster hubs were never in the catalog at all,
  // so nothing on the site could surface them and each one sat on exactly one
  // inbound link, from /blog. They are real editorial hubs grouping several
  // posts each, so they belong in the related widget like any other asset.
  for (const c of JOURNAL_CLUSTERS) {
    entries.push({
      urlPath: `/journal/${c.slug}`,
      h1: c.title,
      eyebrow: "Journal",
      source: "journal-cluster",
      category: "linkable-asset",
    });
  }
  // Phase 7 Round 17 — canonical E-E-A-T author surface for George.
  entries.push({ urlPath: "/about/george-p-biniaris", h1: "George P. Biniaris - Managing Broker", eyebrow: "Author", source: "about", category: "trust" });
  for (const t of GLOSSARY_TERMS) {
    entries.push({
      urlPath: `/glossary/${t.slug}`,
      h1: t.term,
      eyebrow: "Definition",
      source: "glossary",
      category: "glossary",
    });
  }

  // Phase 7 Round 16 (2026-05-12) — destination comparison pages.
  // Decision-phase commercial intent. Surface across the
  // programmatic universe so a buyer reading about Mykonos or
  // motor-yacht charter can pivot to "Greece vs Croatia" etc.
  for (const c of DESTINATION_COMPARISONS) {
    entries.push({
      urlPath: c.urlPath,
      h1: c.h1,
      eyebrow: "Comparison",
      source: "destination-comparison",
      category: "comparison",
    });
  }

  // Phase 7 Round 19 (2026-05-12) — quarterly market reports + hub.
  entries.push({ urlPath: "/market-reports", h1: "Market Reports", source: "market-reports", category: "linkable-asset" });
  for (const r of MARKET_REPORTS) {
    entries.push({
      urlPath: r.urlPath,
      h1: r.h1,
      eyebrow: "Research",
      source: "market-report",
      category: "linkable-asset",
    });
  }

  // Phase 7 Round 34 (2026-05-12) - bottom-funnel commercial pages.
  for (const p of BOTTOM_FUNNEL_PAGES) {
    entries.push({
      urlPath: p.urlPath,
      h1: p.h1,
      eyebrow: p.eyebrow,
      source: "bottom-funnel",
      category: "long-tail",
    });
  }

  // Phase 7 Round 35 (2026-05-12) - Best yachts for X series.
  for (const p of BEST_YACHTS_PAGES) {
    entries.push({
      urlPath: p.urlPath,
      h1: p.h1,
      eyebrow: p.eyebrow,
      source: "best-yachts",
      category: "long-tail",
    });
  }

  // Phase 7 Round 21 (2026-05-12) — island anchorage cluster spokes.
  // Each spoke inherits the island tag from its parent root page so
  // the related-pages engine surfaces both root and spoke for any
  // page tagged with the same island.
  for (const a of ISLAND_ANCHORAGES) {
    entries.push({
      urlPath: a.urlPath,
      h1: a.h1,
      eyebrow: "Anchorages",
      source: "island-anchorage",
      category: "destination",
    });
  }

  return entries;
}

// Stamp the cohort onto the finished catalog rather than onto each push:
// most entries above are built with explicit literals and never pass through
// inferTags, so tagging at the source would mean touching a dozen call sites
// and would silently miss any new one. One pass here cannot drift.
const CATALOG = buildCatalog().map((e) =>
  COHORT_BY_PATH[e.urlPath] ? { ...e, cohort: COHORT_BY_PATH[e.urlPath] } : e
);

function uniqByUrl(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (seen.has(it.urlPath)) continue;
    seen.add(it.urlPath);
    out.push(it);
  }
  return out;
}

// Deterministic shuffle seeded by the page's own URL — so a page
// at /motor-yacht-charter-mykonos always shows the same related
// links across requests, but different pages show different
// neighbours. Avoids the SSR/hydration mismatch you'd get with
// Math.random and keeps the link graph stable for crawlers.
function seededShuffle(arr, seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) | 0;
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = Math.abs(seed) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// The relatedness function. Returns up to `max` entries from the
// catalog scored by tag overlap with the current page. Same-island
// and same-yacht-type get the strongest weight because that's
// where users actually want to keep browsing ("I'm looking at
// motor yachts in Mykonos — show me sailing yachts in Mykonos OR
// motor yachts in Santorini" reads more naturally than random
// programmatic siblings).
// Deliberate hierarchy (2026-08-28). The engine's equal votes were the
// cannibalisation lesson of 22/8: identical link counts on every page
// mean no page ranks. These three commercial pillars carry a flat boost
// so they surface in far more "see also" widgets than their siblings:
// /sailing-yacht-charter-greece was invisible for its own 1,900/mo head
// term, the private page for its own name, and the luxury page is the
// brand-new mother of the luxury cluster. An unequal vote, on purpose.
const PRIORITY_BOOST = {
  "/sailing-yacht-charter-greece": 4,
  "/luxury-yacht-charter-greece": 4,
  "/private-yacht-charter-greece-2026": 3,
};

export function relatedFor(currentUrlPath, opts = {}) {
  const max = opts.max || 6;
  const current = inferTags(currentUrlPath);

  const scored = CATALOG
    .filter((e) => e.urlPath !== currentUrlPath)
    .map((e) => {
      let score = 0;
      // Same cohort = strongest affinity, above island. A reader on the
      // June 2027 page is comparing months, and a reader in the market-report
      // set is reading the series; their siblings are the most useful links
      // on the page and the reason the cohort was declared at all.
      if (current.cohort && e.cohort === current.cohort) score += 8;
      // Same island = strong affinity (people browsing a destination
      // want more of that destination).
      if (current.island && e.island === current.island) score += 5;
      // Same yacht type = strong affinity (decision around vessel
      // class is sticky during the funnel).
      if (current.yachtType && e.yachtType === current.yachtType) score += 4;
      // Same region = mild affinity.
      if (current.region && e.region === current.region && e.island !== current.island) score += 2;
      // Same duration bucket = mild affinity.
      if (current.duration && e.duration === current.duration) score += 2;
      // Cross-category boost — surface 1-2 of a DIFFERENT category
      // so users can pivot from "more of the same" to "the next
      // step" (combo → island root → duration → article).
      if (current.category !== e.category) score += 1;
      // Tools and trust pages are universally relevant (every page
      // benefits from a path to the yacht-finder).
      if (e.category === "tool") score += 2;
      // Slight penalty for blog posts on non-blog pages — we link
      // to articles via the auto-link engine on copy, not via the
      // widget.
      if (e.category === "blog" && current.category !== "blog") score -= 1;
      // Commercial pillar boost — see PRIORITY_BOOST above.
      if (PRIORITY_BOOST[e.urlPath]) score += PRIORITY_BOOST[e.urlPath];
      return { ...e, _score: score };
    })
    .filter((e) => e._score > 0);

  // Group by score, shuffle within groups for variety, then take
  // top N. This ensures users on similar pages don't all see the
  // same top 6 even when scores tie.
  scored.sort((a, b) => b._score - a._score);
  const top = uniqByUrl(scored).slice(0, max * 3);
  const shuffled = seededShuffle(top, currentUrlPath);
  // Keep score order roughly, but with intra-tier shuffle preserved
  // via stable sort.
  shuffled.sort((a, b) => b._score - a._score);
  return uniqByUrl(shuffled).slice(0, max).map(({ urlPath, h1, eyebrow, category }) => ({
    urlPath,
    title: h1 || urlPath,
    eyebrow: eyebrow || labelFor(category),
  }));
}

function labelFor(category) {
  switch (category) {
    case "yacht-type": return "Yacht type";
    case "use-case": return "Occasion";
    case "combo": return "Yacht + destination";
    case "duration": return "Itinerary length";
    case "comparison": return "Comparison";
    case "island": return "Destination";
    case "tool": return "Planning tool";
    case "trust": return "Reviews";
    case "linkable-asset": return "Reference";
    case "article": return "Guide";
    case "glossary": return "Definition";
    default: return "Read more";
  }
}

// Test/diagnostic helper — used by the admin endpoint.
export function catalogSize() {
  return CATALOG.length;
}
