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

// 2026-08-06 — THE BIG BUMP, and the reason it matters more than usual.
//
// Search Console's URL Inspection API was run against all 475 sitemap URLs
// today. Google last DOWNLOADED this sitemap on 10 June, and last crawled the
// catamaran pillar page on 3 July. Sixty-two URLs are still "unknown to
// Google" and thirteen are "crawled, currently not indexed". Crawl demand on
// this site is low, so the freshness signal is one of the few levers we have,
// and a stale lastmod actively tells Google not to bother.
//
// Today's work rewrote titles, descriptions and on-page copy across almost
// every programmatic family (cannibalisation fixes on the crewed and catamaran
// clusters, the US striking-distance CTR pass, and the snippet-hygiene sweep
// that rebuilt every island, article and journal description). If these dates
// stayed at May, the sitemap would announce "nothing has changed since spring"
// for precisely the pages we just fixed, and none of it would be re-crawled.
//
// Every date below is honest: the family's content genuinely changed today.
// Families NOT touched today keep their old dates on purpose.
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
  // 2026-08-06: the weekly rate card gained the all-in range in its title,
  // and the crewed hub gained the "three crewed formats" section plus a
  // masthead-clearance fix on its hero.
  // 2026-08-07: /about-us and /how-it-works, roughly 4,000 words each, had no
  // structured question on them at all, so an engine asked "which broker should
  // I use in Greece" could lift nothing from either. Both gained a visible
  // question block with matching FAQPage schema, the founder's Person entity
  // gained his actual credentials (skipper's licence, powerboat licence, IYBA),
  // the homepage FAQ gained the which-broker answer, and the fleet hub gained
  // the same in its own words.
  STATIC: "2026-08-07",
  // 2026-08-06 — the fleet's code-level refresh date. Sanity's _updatedAt
  // covers content edits; this covers template and component changes that
  // Sanity knows nothing about. app/sitemap.js takes whichever is later.
  FLEET: "2026-08-06",
  // Programmatic SEO families - bump when the corresponding
  // lib/*Seo.js data file gets new entries or refreshed copy.
  // 2026-06-10: GSC-driven FAQ additions (Sifnos motor-yacht FAQ).
  // 2026-06-25: glossary titles + meta descriptions tightened.
  // 2026-08-06: all 26 island descriptions rebuilt (they were raw
  // mid-word slices of prose, nine of them printing literal markdown).
  ISLANDS: "2026-08-06",
  // 2026-08-06: motor-yacht page took the "crewed motor yacht" head term
  // (title, h1, crew-per-length deep dive, exact-match FAQ) and a false
  // €600,000 figure was corrected to the real fleet range; the crewed
  // catamaran page stopped competing for motor queries.
  YACHT_TYPES: "2026-08-06",
  // 2026-08-06: the season pivot. Every call to action and fleet heading in
  // these three families still said "for 2026" in August of that year, on the
  // exact pages a guest planning a full week would now be booking for 2027:
  // motor and catamaran by island, family, honeymoon, wedding, large group.
  // 72 headings moved to 2027. Statements of fact that reference 2026 (fleet
  // counts, availability as of a date, booking lead times) were left alone.
  USE_CASES: "2026-08-06",
  LONG_TAIL: "2026-08-06",
  // 2026-08-06: Mykonos vs Santorini retitled for the route intent and made
  // the single canonical of a duplicate pair.
  COMPARISONS: "2026-08-06",
  // 2026-08-06: brokers page now answers "broker or direct to owner" in the
  // title and description, the query that was drawing 56 US impressions.
  LINKABLE: "2026-08-06",
  // 2026-08-06: same 2027 pivot as USE_CASES/LONG_TAIL, plus every page in
  // this family gained a real heading outline (whyTitle, whenTitle and
  // insiderTitle were <p> and are now <h2> in SeoLanding). These 28 pages had
  // four headings each, three of them template furniture, which is why Google
  // has never fetched most of them.
  COMBOS: "2026-08-06",
  // 2026-06-10: pricing-guide FAQs for "motor yacht charter greece
  // prices" + "athens yacht charter cost" (GSC positions 12.8/16.5).
  // 2026-08-06: APA page rewritten at the snippet level; it was the worst
  // converting page on the site at 0.26% from position 10.4.
  ARTICLES: "2026-08-06",
  // 2026-08-06: all 40 duration pages gained the cost band in title and
  // description, and the "from Athens, Athens" snippet bug was fixed.
  DURATION: "2026-08-06",
  // 2026-08-06: 12-passenger rule and day-charter retitled (the latter was
  // ranking on weekly price queries because its range carried no unit).
  GLOSSARY: "2026-08-06",
  // 2026-08-06 — bumped with the sitewide footer rollout. These pages did
  // not change in wording, they changed in shape: each one went from roughly
  // 40 internal links to roughly 145, plus the legal links they never had.
  DEST_COMPARISONS: "2026-08-06",
  // 2026-08-06 — bumped with the sitewide footer rollout. These pages did
  // not change in wording, they changed in shape: each one went from roughly
  // 40 internal links to roughly 145, plus the legal links they never had.
  ANCHORAGES: "2026-08-06",
  // 2026-06-10: Dodecanese motor-yacht FAQ + stabilizing-fins FAQ.
  // 2026-08-06: Cyclades crewed catamaran retitled to lead with the week
  // and the crew; Saronic stopped advertising 4-night formats first.
  // 2026-08-07: the family catamaran page now answers which broker a family
  // should use, argued from the hospitality decade rather than from the hull.
  BOTTOM_FUNNEL: "2026-08-07",
  // 2026-08-06: "Sailing vs Power" left the best-catamarans title so the
  // power-catamaran page can own its own term.
  // 2026-08-07: a ranking is only worth reading if the ranker gains nothing
  // from the order. That is true here and was stated nowhere on the page.
  BEST_YACHTS: "2026-08-07",
  // 2026-08-06: every article and journal-hub description regenerated;
  // 35 of 46 used to end mid-sentence, and em dashes were reaching Google
  // in the snippets of the two highest-impression pages on the site.
  JOURNAL: "2026-08-06",
  // Hubs that aggregate other content - bump weekly-ish.
  HUBS: "2026-08-06",
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
