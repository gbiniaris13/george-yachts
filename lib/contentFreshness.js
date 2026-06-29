// lib/contentFreshness.js
//
// Single source of truth for the "last meaningful content edit" date of
// each content family. Consumed by BOTH app/sitemap.js (the <lastmod>)
// AND the JSON-LD `dateModified` on each page's CreativeWork node, so the
// sitemap and the structured data can never disagree. A divergence between
// sitemap lastmod and schema dateModified is an inconsistent freshness
// signal that dilutes Google's recrawl confidence.
//
// HONEST FRESHNESS: bump a family's date ONLY when that family's content
// actually changes. Do NOT auto-stamp build time - a dateModified that
// flips on every deploy without a real content change is noise that Google
// and AI engines learn to distrust. Sanity-backed docs (yacht, post) use
// their real `_updatedAt` and are intentionally NOT listed here.
//
// Format: ISO 8601 date-only (YYYY-MM-DD).

export const LAST_REFRESH = {
  // Static marketing / tools / legal - these change rarely.
  // Bump when copy on those pages is edited.
  // 2026-06-10: footer contact block rewritten (US registration +
  // Athens office) and contact-page Hours copy changed to 24/7.
  // 2026-06-25: Privacy / Terms / Cookie pages rewritten (accurate
  // entity + processors, Greek governing law); footer "Cookie
  // Settings" link added — static/legal page content genuinely changed.
  // 2026-06-29: homepage + fleet pages materially changed (fleet now 59
  // after the Kavas retirement, hero stat count-up, reviews shown by
  // initials, floating-button + cursor refresh) — static lastmod advances.
  STATIC: "2026-06-29",
  // Programmatic SEO families - bump when the corresponding
  // lib/*Seo.js data file gets new entries or refreshed copy.
  // 2026-06-10: GSC-driven FAQ additions (Sifnos motor-yacht FAQ).
  // 2026-06-25: glossary titles + meta descriptions tightened.
  ISLANDS: "2026-06-10",
  YACHT_TYPES: "2026-05-11",
  USE_CASES: "2026-05-11",
  LONG_TAIL: "2026-05-11",
  COMPARISONS: "2026-05-11",
  LINKABLE: "2026-05-11",
  COMBOS: "2026-05-11",
  // 2026-06-10: pricing-guide FAQs for "motor yacht charter greece
  // prices" + "athens yacht charter cost" (GSC positions 12.8/16.5).
  ARTICLES: "2026-06-10",
  DURATION: "2026-05-11",
  GLOSSARY: "2026-05-12",
  DEST_COMPARISONS: "2026-05-12",
  ANCHORAGES: "2026-05-12",
  // 2026-06-10: Dodecanese motor-yacht FAQ + stabilizing-fins FAQ.
  BOTTOM_FUNNEL: "2026-06-10",
  BEST_YACHTS: "2026-05-12",
  JOURNAL: "2026-05-18",
  // Hubs that aggregate other content - bump weekly-ish.
  HUBS: "2026-05-18",
};

// Most-recent edit across all families. Used for site-wide CreativeWork
// nodes (WebSite, homepage WebPage / FAQPage). YYYY-MM-DD sorts
// lexicographically == chronologically.
export const SITE_UPDATED = Object.values(LAST_REFRESH).sort().at(-1);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Human-readable form for a visible "Last updated" line, e.g. "May 2026".
// Month-and-year only: precise enough to signal recency, vague enough that
// it does not look auto-generated per-day.
export function humanDate(iso) {
  if (!iso || typeof iso !== "string") return "";
  const [y, m] = iso.split("-");
  const mi = parseInt(m, 10) - 1;
  return MONTHS[mi] != null ? `${MONTHS[mi]} ${y}` : iso;
}
