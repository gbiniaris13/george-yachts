// SEO <title> overrides for individual yacht pages.
//
// 2026-08-11. Search Console, 90 days: every one of the 59 yacht pages put
// together takes 85 impressions, and roughly 53 of those are a single hull.
// People do not browse a broker's fleet from Google. They arrive on a yacht
// page having seen the boat somewhere else and typed its name.
//
// That measurement is the whole point of this file. The obvious move was to
// put "Yacht Charter" into the title of all 59 pages, and it would have been
// wrong: it chases 36 impressions across the fleet while disturbing title
// lengths that were tuned twice already (2026-05-12 and 2026-07-11) to stop
// Google truncating the model name. A generator change for a one-hull problem
// is how carefully tuned things quietly regress.
//
// So: overrides, one per yacht, added only where Search Console shows a real
// name-search cluster. A yacht with no entry keeps the generated title.
//
// Budget: 44 characters, same as the blog titles. The root layout appends
// " | George Yachts" (16 chars), landing the rendered title at 60 or under.

export const YACHT_SEO_TITLES = {
  // LA PELLEGRINA is the only yacht in the fleet with a name-search cluster:
  // "la pellegrina yacht charter" (33 impressions at position 20.3), "la
  // pellegrina yacht" (11 at 20.3), "yacht la pellegrina" (4 at 27.2), plus
  // the bare name and "pellegrina yacht". Around 53 impressions, zero clicks,
  // nothing above position 20.
  //
  // The reason is not obscurity, it is the opposite. She is a well known 50
  // metre Couach and every listing site in the Mediterranean carries her, so
  // our page competes with fifty aggregators. Ours had one disadvantage none
  // of them had: the word "charter" appeared nowhere in the title, on a page
  // whose visitors are searching to charter her.
  //
  // At 180,000 to 235,000 euro a week, this is the most valuable single query
  // on the site by a wide margin.
  "la-pellegrina-1": "LA PELLEGRINA Yacht Charter: 50m Couach",
};

/** Title override for a yacht slug, or null to use the generated title. */
export function yachtSeoTitle(slug) {
  return YACHT_SEO_TITLES[slug] || null;
}
