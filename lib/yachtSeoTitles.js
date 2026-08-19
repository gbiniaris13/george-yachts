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

  // 2026-08-14 — the six yachts added to the fleet today, from the FX Yachting
  // and FYLY offers of 3, 5 and 14 August.
  //
  // These get overrides on arrival rather than after a quarter of watching,
  // because the generated title would have been "P/CAT ELLY | FOUNTAINE PAJOT
  // POWER 67" and there is nothing to wait and see about that. "P/CAT" is a
  // trade prefix; no charterer types it, no answer engine reads it aloud, and
  // it spends the first ten characters of a sixty-character budget saying
  // nothing. The pattern below leads with the hull name, because a yacht page
  // is found by someone who already knows the name, then states the intent
  // ("Yacht Charter"), then the one fact that separates this boat from the
  // three sisters we already list.
  //
  // Budget is 44 characters so the layout's " | George Yachts" survives.
  "elly": "ELLY Yacht Charter: 67ft Power Catamaran",
  "stephanie": "STEPHANIE Charter: Alegria 67, Silent Night",
  "aphaea": "APHAEA Yacht Charter: 10 Guests, 5 Cabins",
  "amarea": "AMAREA Yacht Charter: Lagoon Sixty 5",
  // Corfu, not Athens, is the whole reason this one is on the site: she is the
  // only Ionian base in the Power 67 group and the only 12 per cent VAT hull.
  "ariva": "ARIVA Yacht Charter: Corfu, 10 Guests",
  // Not yet launched. The year is the entire proposition, so it leads.
  "elly-ii": "ELLY II Charter: New Build for 2027",
  // 2026-08-18. Seven award-winning hulls joined the fleet. For most of them
  // the award is the search proposition, so it leads. LADY M is the only one
  // whose awards belong to the boat rather than to her crew.
  "lady-m": "LADY M: Award-Winning Lagoon 60, 2025",
  "meliti-sy": "MELITI: Garcia 86, the Only One Built",
  "nova": "NOVA Charter: Lagoon 620, Award Chef",
  "sameli": "SAMELI: Fast 23m Catamaran, 10 Guests",
  "pi-2": "PI 2 Charter: Saba 50, 10 Guests, Chef",
  "tiamo": "Ti AmO: Best Multihull 2021, Aquila 54",
  "high-jinks": "HIGH JINKS: Sanya 57 Under Sail",
};

/** Title override for a yacht slug, or null to use the generated title. */
export function yachtSeoTitle(slug) {
  return YACHT_SEO_TITLES[slug] || null;
}
