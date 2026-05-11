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
  skiathos: "sporades",
  "crete-chania": "crete",
  athens: "attica",
};

function inferTags(urlPath) {
  // Extract the "shape" of a programmatic URL into tags. Cheap
  // string matching keeps this O(N) over the catalog and avoids
  // a per-page schema we'd have to keep in sync with every data
  // file.
  const slug = urlPath.replace(/^\//, "");
  const tags = { slug, urlPath };

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

  // Hand-added evergreen targets so the related widget can surface
  // them too — these don't live in any data array but are real
  // high-value pages.
  entries.push({ urlPath: "/sailing-distance-calculator", h1: "Sailing Distance Calculator", source: "tool", category: "tool" });
  entries.push({ urlPath: "/yacht-finder", h1: "Smart Match Quiz", source: "tool", category: "tool" });
  entries.push({ urlPath: "/cost-calculator", h1: "Charter Cost Calculator", source: "tool", category: "tool" });
  entries.push({ urlPath: "/itinerary-builder", h1: "Itinerary Builder", source: "tool", category: "tool" });
  entries.push({ urlPath: "/reviews", h1: "Reviews", source: "tool", category: "trust" });
  entries.push({ urlPath: "/2026-greek-charter-market-report", h1: "2026 Greek Charter Market Report", source: "report", category: "linkable-asset" });

  return entries;
}

const CATALOG = buildCatalog();

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
export function relatedFor(currentUrlPath, opts = {}) {
  const max = opts.max || 6;
  const current = inferTags(currentUrlPath);

  const scored = CATALOG
    .filter((e) => e.urlPath !== currentUrlPath)
    .map((e) => {
      let score = 0;
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
    default: return "Read more";
  }
}

// Test/diagnostic helper — used by the admin endpoint.
export function catalogSize() {
  return CATALOG.length;
}
