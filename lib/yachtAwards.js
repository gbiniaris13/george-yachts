/**
 * Awards, and the rules that keep them true.
 *
 * ── Why a code file and not Sanity ───────────────────────────────────────
 *
 * The intention was to write these onto the yacht records in Sanity. Two
 * things stop that being the right home today: the Sanity schema has no
 * awards field, and this repo has no write token, so it could not be done
 * from here even if it did.
 *
 * On reflection code is the better home anyway. An award is a claim about
 * somebody else's boat, made on a broker's site, and the failure mode is not
 * a typo, it is a claim nobody can source. A CMS field invites a plausible
 * sentence typed from memory. A file with a `source` on every line, checked
 * by scripts/checkAwardClaims.mjs, does not.
 *
 * ── Vessel awards and crew awards are different things ───────────────────
 *
 * This is the distinction the first draft of this work was missing, and it
 * came out of checking ALTEYA. Our record said her chef placed second best
 * chef in Bulgaria in 2021. The central agent's page today names a different
 * chef, Noris, described only as "an award-winning culinary talent".
 *
 * A chef's award belongs to the chef. It sails when they sail. Printing a
 * 2021 chef prize beside a yacht whose galley has changed hands is how a
 * broker ends up describing a boat that no longer exists, to a client who
 * booked it for that reason. So crew awards carry `chef` where the person is
 * named, and any entry whose crew has demonstrably turned over comes out
 * until it is re-confirmed. ALTEYA is out on exactly that ground.
 *
 * A vessel award, a design or category prize won by the hull, has no such
 * expiry.
 *
 * ── The rules ────────────────────────────────────────────────────────────
 *
 * 1. Award name, organiser AND year, or it does not render. Not a
 *    presentation preference: "award-winning" with nothing after it is the
 *    exact shape that turned out to mean the BUILDER on ChristAl MiO and
 *    Majesty of Greece. An entry that cannot name all three is not an award
 *    we can stand behind, so `renderable()` drops it.
 * 2. Every entry carries where it was read and when.
 * 3. NEVER_CLAIM below is load-bearing. Those yachts have award-shaped text
 *    on a central agent's page that is not an award for them. The guard
 *    script fails the build if any of them acquires an entry here.
 * 4. Verified 2026-08-18 across all three permitted central agents, and the
 *    lesson from that sweep is in the sources: the same hull carries
 *    different text on different agents, so one page is not a check.
 */

/**
 * Keyed by yacht slug.
 *
 * kind:      "vessel" for a prize the hull won, "crew" for one a person won
 * award:     what was won, as the organiser words it
 * organiser: who ran it
 * year:      when
 * chef:      the person, where the award is theirs and they are named
 * source:    where this was read
 * checked:   the date this was last confirmed against that source
 */
export const YACHT_AWARDS = {
  "crazy-horse": [
    {
      kind: "crew",
      award: "Winner, Best Crew",
      organiser: "EMMYS Yacht Show",
      year: 2026,
      source: "fxyachting.com/crazy-horse",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "3rd Place Emerald, Chef Competition",
      organiser: "EMMYS",
      year: 2024,
      chef: "Konstantinos",
      source: "fxyachting.com/crazy-horse",
      checked: "2026-08-20",
    },
  ],

  "above-beyond": [
    {
      kind: "crew",
      award: "1st Place Platinum, Chef Competition",
      organiser: "MEDYS",
      year: 2022,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "1st Place Diamond, Chef Competition",
      organiser: "EMMYS",
      year: 2023,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "2nd Place Diamond, Chef Competition",
      organiser: "EMMYS",
      year: 2024,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "2nd Place, CYBA Designer Water",
      organiser: "EMMYS",
      year: 2024,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "1st Place Diamond, Tablescaping",
      organiser: "EMMYS",
      year: 2024,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew",
      award: "1st Place Diamond, Tablescaping",
      organiser: "EMMYS",
      year: 2025,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
  ],

  // ELLY, not ELLY II. There are two hulls in the fleet with that name and
  // our note said only "P/CAT ELLY", which is the same ambiguity that once
  // sent this work looking at the wrong boat entirely. Checked both:
  // fxyachting.com/elly carries the award, fxyachting.com/elly-ii carries
  // nothing, and fyly.gr/yacht/elly agrees with the first.
  elly: [
    {
      kind: "crew",
      award: "1st Place Diamond, CYBA Designer Water",
      organiser: "EMMYS",
      year: 2024,
      source: "fxyachting.com/elly and fyly.gr/yacht/elly",
      checked: "2026-08-20",
    },
  ],

  kimata: [
    {
      kind: "crew",
      award: "3rd Place Diamond, CYBA Designer Water",
      organiser: "EMMYS",
      year: 2024,
      source: "fxyachting.com/kimata and fyly.gr/yacht/kimata",
      checked: "2026-08-20",
    },
  ],

  alena: [
    {
      kind: "crew",
      award: "3rd Place Diamond, Chef Competition",
      organiser: "EMMYS",
      year: 2024,
      source: "fxyachting.com/alena and fyly.gr/yacht/alena",
      checked: "2026-08-20",
    },
  ],

  // Serenissima, not Serenissima III. Same two-sisters problem as ELLY.
  serenissima: [
    {
      kind: "crew",
      award: "1st Prize, Best Dish",
      organiser: "EMMYS",
      year: 2024,
      source: "fyly.gr/yacht/serenissima",
      checked: "2026-08-18",
    },
    {
      kind: "crew",
      award: "3rd Prize, Gournopoula Taco",
      organiser: "EMMYS",
      year: 2023,
      source: "fyly.gr/yacht/serenissima",
      checked: "2026-08-18",
    },
  ],
};

/**
 * Held back on purpose, with the reason. Not a to-do list: each of these is
 * a claim that failed a check, and the note is what would have to change.
 */
export const WITHHELD = {
  alteya:
    "Our note records a chef prize, second best chef in Bulgaria 2021. " +
    "fxyachting.com/alteya today names a different chef, Noris, and says " +
    "only 'an award-winning culinary talent'. A chef award follows the " +
    "chef. Needs the current chef's own award, named, dated and sourced.",
  "worlds-end":
    "Recorded as a chef win at the Antigua Charter Show with no year and " +
    "no category. Two of the three are missing, so it cannot render.",
  alina:
    "fxyachting.com/alina-80 gives Chef Panagiotis Koumoundouros, Winner " +
    "Greek MasterChef 2022. Both hulls are 80 ft and it was never confirmed " +
    "that the ALINA in our fleet is that boat.",
  "pareaki-ii":
    "Checked against Sanity, all 30 fleet brochures, the Istion page, web " +
    "search and George's own mail on 2026-08-18. Nothing anywhere. It may " +
    "be true and simply unwritten; it needs written confirmation from " +
    "FYLY or Istion before it goes near the site.",
};

/**
 * Award-shaped text that is NOT an award for these yachts. The guard script
 * fails if any of them turns up in YACHT_AWARDS.
 */
export const NEVER_CLAIM = {
  "christal-mio":
    "'award-winning' on the agent's page refers to Fountaine Pajot as a " +
    "builder, not to this hull.",
  "christal-mio-80":
    "Same as christal-mio: the builder is the award-winner, not the yacht.",
  "majesty-of-greece":
    "Same builder claim. Fountaine Pajot won, this yacht did not.",
};

const REQUIRED = ["award", "organiser", "year"];

/** An entry renders only if it can name what, who ran it, and when. */
export function renderable(entry) {
  return REQUIRED.every((k) => {
    const v = entry?.[k];
    return v !== undefined && v !== null && String(v).trim() !== "";
  });
}

/**
 * @returns {Array} the renderable awards for a slug, newest first. Empty for
 * every yacht that has none, which is most of them, and the section is not
 * drawn at all in that case.
 */
export function awardsFor(slug) {
  if (!slug || NEVER_CLAIM[slug]) return [];
  const list = YACHT_AWARDS[slug];
  if (!Array.isArray(list)) return [];
  return list.filter(renderable).slice().sort((a, b) => b.year - a.year);
}

/** One line for the schema and for meta text: "1st Place Diamond,
 *  CYBA Designer Water, EMMYS 2024". */
export function awardLine(entry) {
  return `${entry.award}, ${entry.organiser} ${entry.year}`;
}

export default YACHT_AWARDS;

/**
 * The one award to lead with, as a short phrase for a meta description.
 *
 * This is the highest-value line in the whole awards job, and it is worth
 * saying why. The section built into the yacht page cannot earn a click: by
 * the time anybody reads it they have already clicked. What earns the click
 * is the two lines Google prints, and on 2026-08-20 not one of the six
 * awarded yachts mentioned an award in either of them. Their descriptions
 * read as a spec dump identical in shape to the sixty-six that have won
 * nothing.
 *
 * Ranking, strongest first:
 *   1. A vessel award beats a crew award. The hull cannot leave.
 *   2. A first place beats a second beats a third.
 *   3. More recent beats older.
 *
 * The phrase keeps the actual placing. "3rd Place, EMMYS 2024" is a real
 * distinction and a searcher can tell it apart from a win; softening it into
 * "award-winning" is the exact move that turned out to mean the builder on
 * ChristAl MiO, and it is not one this house makes.
 *
 * @returns {string|null} e.g. "Best Crew, EMMYS 2026" — no full stop, the
 * caller punctuates.
 */
export function headlineAward(slug) {
  const list = awardsFor(slug);
  if (list.length === 0) return null;

  const place = (a) => {
    const m = /(\d)(?:st|nd|rd|th)\s+Place/i.exec(a.award);
    return m ? Number(m[1]) : /winner/i.test(a.award) ? 1 : 9;
  };

  const best = list.slice().sort((a, b) => {
    if ((a.kind === "vessel") !== (b.kind === "vessel")) return a.kind === "vessel" ? -1 : 1;
    if (place(a) !== place(b)) return place(a) - place(b);
    return b.year - a.year;
  })[0];

  // "Winner, Best Crew" reads better in a search result as "Best Crew", and
  // the placing words are already carried by the rest of the string.
  const label = best.award
    .replace(/^Winner,\s*/i, "")
    .replace(/\s*Diamond,|\s*Platinum,|\s*Emerald,/i, ",")
    .replace(/\s+/g, " ")
    .trim();

  return `${label}, ${best.organiser} ${best.year}`;
}

/**
 * The same award, cut to fit a search result.
 *
 * headlineAward() keeps the category, which is right on the page where there
 * is room to read it. A meta description has 158 characters in total and the
 * price has to survive, so the category is the part that goes: "1st Place,
 * CYBA Designer Water, EMMYS 2024" becomes "1st Place, EMMYS 2024".
 *
 * The placing is never dropped. A third place stays a third place.
 *
 * @returns {string|null} e.g. "1st Place, EMMYS 2024", around 21 characters.
 */
export function headlineAwardShort(slug) {
  const full = headlineAward(slug);
  if (!full) return null;
  const parts = full.split(",").map((s) => s.trim());
  const placing = parts[0];
  const tail = parts[parts.length - 1]; // "EMMYS 2024" / "EMMYS Yacht Show 2026"
  const org = tail.replace(/\s+Yacht Show\b/i, "");
  return `${placing}, ${org}`;
}
