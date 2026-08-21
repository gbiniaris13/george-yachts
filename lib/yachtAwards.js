/**
 * Awards, and the rules that keep them true.
 *
 * ── Why a code file and not Sanity ───────────────────────────────────────
 *
 * An award is a claim about somebody else's boat, made on a broker's site,
 * and the failure mode is not a typo, it is a claim nobody can source. A CMS
 * field invites a plausible sentence typed from memory. A file with a
 * `source` on every line, checked by scripts/checkAwardClaims.mjs, does not.
 *
 * ── 2026-08-21: the rebuild, and why the first version was thin ──────────
 *
 * George read the first version of the homepage band and asked one question:
 * where is PI 2, have you got them all. The answer was no, and the reason is
 * worth writing down because it would have repeated.
 *
 * The first pass sourced awards from the central agents' own yacht pages.
 * Those pages are marketing copy. They are written when a yacht is listed and
 * updated when somebody remembers, so they lag the shows by a season or two
 * and they describe rather than record: "multiple Awards at the boat show
 * EMMYS" is what PI 2's page says, which names no placing and no year and
 * therefore cannot render under rule 1 below.
 *
 * The shows publish their own results. emmys.gr posts winners, the Greek
 * maritime press reports each edition in full, and the show's attending-yacht
 * list gives every hull's model and length. Reading those instead took the
 * registry from six yachts and thirteen placings to eleven and twenty-five,
 * and three of the new ones (APHAEA, SAMARA, SAHANA) had never appeared in
 * the earlier sweep at all.
 *
 * Every hull below was matched against the EMMYS attending list by model AND
 * length before its award was written down, because a yacht show result gives
 * a name and nothing else. The list is what proves that the ELLY that placed
 * second in 2026 is our Fountaine Pajot Power 67 and not the Lagoon 51 of the
 * same name: ELLY II was not at the show at all.
 *
 * ── Vessel awards and crew awards are different things ───────────────────
 *
 * A chef's award belongs to the chef. It sails when they sail. So crew awards
 * carry the year prominently and the site never implies the crew that won is
 * the crew aboard. A vessel award, a prize won by the hull, has no expiry.
 *
 * ── The rules ────────────────────────────────────────────────────────────
 *
 * 1. Award name, organiser AND year, or it does not render. "award-winning"
 *    with nothing after it is the exact shape that turned out to mean the
 *    BUILDER on ChristAl MiO and Majesty of Greece.
 * 2. Every entry carries where it was read and when.
 * 3. NEVER_CLAIM below is load-bearing, and the guard fails the build if any
 *    of those slugs acquires a builder-derived entry.
 * 4. One page is not a check. The same hull carries different text on
 *    different agents, and the agents disagree with the show's own results.
 */

/**
 * The two shows, for the explainer. Figures are the most recent edition and
 * each carries its own source, because "roughly a hundred yachts" is the kind
 * of sentence that gets rounded up every time it is retyped.
 */
export const SHOWS = {
  EMMYS: {
    full: "East Med Multihull & Yacht Charter Show",
    place: "Poros",
    edition: "22nd, May 2026",
    yachts: 94,
    brokers: 300,
    countries: 25,
    tradeOnly: true,
    source: "maritimes.gr report on the 22nd EMMYS, and emmys.gr",
    checked: "2026-08-21",
  },
  MEDYS: {
    full: "Mediterranean Yacht Show",
    place: "Nafplion",
    edition: "11th, May 2026",
    yachts: 79,
    tradeOnly: true,
    source: "yachtcharterfleet.com, MEDYS 2026",
    checked: "2026-08-21",
  },
};

/**
 * What the category names mean. This is the single most useful thing the page
 * can tell a reader, because "3rd Place Diamond" is meaningless until you know
 * Diamond is a price bracket and the yacht was judged against its own kind.
 */
/**
 * The brackets, and a correction worth recording.
 *
 * The first version of this file put the EMMYS split at €4,999 / €5,000, on
 * the strength of one press report of the 2026 edition. Two other sources
 * disagree and agree with each other: the show guide gives "up to €8,999 a
 * day" and "€9,000 and above", and FX Yachting, who show yachts there, write
 * "Emerald (under €9k/day) and Diamond (over €9k/day)". Two against one, and
 * the two are the show's own guide and an exhibitor, so the figure here is
 * nine thousand and the page says "about" because the brackets have plainly
 * moved between editions: EMMYS ran a Platinum tier in 2022, MEDYS ran
 * Category A and Category A Platinum in 2024 and 2025 and Golden and Platinum
 * in 2026.
 *
 * A tier printed on the site must appear here, and the guard enforces it: a
 * bracket the page cannot explain is a word the reader cannot use.
 */
export const TIERS = {
  Emerald: "the EMMYS bracket below about €9,000 a day",
  Diamond: "the EMMYS bracket above it",
  Platinum: "the top bracket, run at both shows in different years",
  "Category A": "a MEDYS bracket; the show divides its fleet by yacht size",
  "Category A Platinum": "the MEDYS bracket for the larger yachts",
  Golden: "the MEDYS bracket introduced for the 2026 edition",
};

/**
 * Keyed by yacht slug.
 *
 * kind:        "vessel" for a prize the hull won, "crew" for one a person won
 * rank:        1, 2 or 3. The placing, never softened.
 * competition: which contest inside the show
 * tier:        the rate bracket the yacht was judged in, or null
 * award:       the full phrase, as the organiser words it
 * organiser:   EMMYS or MEDYS
 * year:        the edition
 * source:      where this was read
 * checked:     the date this was last confirmed against that source
 * hull:        how the hull was matched to ours, where a name alone was not enough
 */
export const YACHT_AWARDS = {
  "above-beyond": [
    {
      kind: "crew", rank: 1, competition: "Tablescaping", tier: "Diamond",
      award: "1st Place Diamond, Tablescaping",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Sailing Catamaran 23.99 m, Sunreef 80. Ours is a Sunreef 80.",
    },
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Diamond",
      award: "1st Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners, and fxyachting.com/above-and-beyond",
      checked: "2026-08-21",
    },
    {
      kind: "crew", rank: 2, competition: "Chef Competition", tier: "Diamond",
      award: "2nd Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2024,
      source: "ritzyyachts.com MEDYS and EMMYS 2024 winners",
      checked: "2026-08-21",
    },
    {
      kind: "crew", rank: 1, competition: "Tablescaping", tier: "Diamond",
      award: "1st Place Diamond, Tablescaping",
      organiser: "EMMYS", year: 2024,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew", rank: 2, competition: "CYBA Designer Water", tier: null,
      award: "2nd Place, CYBA Designer Water",
      organiser: "EMMYS", year: 2024,
      source: "fyly.gr/yacht/above-beyond",
      checked: "2026-08-20",
    },
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Diamond",
      award: "1st Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2023,
      source: "emmys.gr/chef-competition-winners, the show's own results page",
      checked: "2026-08-21",
    },
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Platinum",
      award: "1st Place Platinum, Chef Competition",
      organiser: "MEDYS", year: 2022,
      source: "fyly.gr/yacht/above-beyond and fxyachting.com/above-and-beyond",
      checked: "2026-08-21",
    },
  ],

  alena: [
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Diamond",
      award: "1st Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Power Catamaran 19.49 m, Fountaine Pajot Power 67. Ours is a Power 67.",
    },
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Diamond",
      award: "3rd Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2024,
      source: "ritzyyachts.com MEDYS and EMMYS 2024 winners, and fxyachting.com/alena",
      checked: "2026-08-21",
    },
  ],

  "crazy-horse": [
    {
      kind: "crew", rank: 1, competition: "Best Crew", tier: null,
      award: "Winner, Best Crew",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS, and fxyachting.com/crazy-horse",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Power Catamaran 23.80 m, Lagoon 78. Ours is a Lagoon 78 at 23.8 m.",
    },
    {
      kind: "crew", rank: 3, competition: "CYBA Designer Water", tier: "Diamond",
      award: "3rd Place Diamond, CYBA Designer Water",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
    },
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Emerald",
      award: "3rd Place Emerald, Chef Competition",
      organiser: "EMMYS", year: 2024,
      source: "fxyachting.com/crazy-horse",
      checked: "2026-08-20",
    },
  ],

  // ELLY, not ELLY II. Two hulls in the fleet carry the name and our note said
  // only "P/CAT ELLY". The EMMYS attending list settles it: the ELLY entered
  // is a Fountaine Pajot Power 67, which is ours, and ELLY II is not on the
  // list at all.
  elly: [
    {
      kind: "crew", rank: 2, competition: "CYBA Designer Water", tier: "Diamond",
      award: "2nd Place Diamond, CYBA Designer Water",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Power Catamaran 19.49 m, Fountaine Pajot Power 67. ELLY II absent from the list.",
    },
    {
      kind: "crew", rank: 1, competition: "CYBA Designer Water", tier: "Diamond",
      award: "1st Place Diamond, CYBA Designer Water",
      organiser: "EMMYS", year: 2024,
      source: "fxyachting.com/elly and fyly.gr/yacht/elly",
      checked: "2026-08-20",
    },
  ],

  // The hull George had to settle and then research settled anyway. The 2026
  // CYBA Designer Water first place, Diamond, went to a "Crystal Mio". We
  // carry the name twice and both hulls appear on the show's attending list,
  // so the name alone proved nothing. FX Yachting's own published lineup for
  // EMMYS 2026 names exactly one: CHRISTAL MIO, Power Catamaran, Fountaine
  // Pajot Power 67, 19.49 m. That is this hull, and the 80 is not in it.
  //
  // The builder claim on her agent page is still a builder claim and still
  // sits in NEVER_CLAIM. A yacht can carry both: a prize her crew won, and a
  // sentence about her shipyard that is not hers.
  "christal-mio": [
    {
      kind: "crew", rank: 1, competition: "CYBA Designer Water", tier: "Diamond",
      award: "1st Place Diamond, CYBA Designer Water",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr results of the 22nd EMMYS, hull identified against fxyachting.com's published EMMYS 2026 lineup",
      checked: "2026-08-21",
      hull: "FX Yachting's EMMYS 2026 lineup lists one CHRISTAL MIO: Power Catamaran, Fountaine Pajot Power 67, 19.49 m. ChristAl MiO 80 is not in that lineup.",
    },
  ],

  aphaea: [
    {
      kind: "crew", rank: 2, competition: "Chef Competition", tier: "Diamond",
      award: "2nd Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Sailing Catamaran 19.49 m. Ours is a Fountaine Pajot Alegria 67, the same platform.",
    },
  ],

  samara: [
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Diamond",
      award: "3rd Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Power Catamaran 23.99 m. Ours is a custom power catamaran at 24.38 m.",
    },
  ],

  sahana: [
    {
      kind: "crew", rank: 1, competition: "Tablescaping", tier: "Emerald",
      award: "1st Place Emerald, Tablescaping",
      organiser: "EMMYS", year: 2026,
      source: "maritimes.gr, results of the 22nd EMMYS",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Sailing Catamaran 16.2 m. Ours is a Bali 5.4 at 16.20 m, and the crew member named in the result is on both agents' crew lists for this hull.",
    },
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Emerald",
      award: "1st Place Emerald, Chef Competition",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners",
      checked: "2026-08-21",
    },
  ],

  "ad-astra": [
    {
      kind: "crew", rank: 1, competition: "Tablescaping", tier: "Diamond",
      award: "1st Place Diamond, Tablescaping",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners",
      checked: "2026-08-21",
      hull: "EMMYS attending list: Sailing Catamaran 23.99 m, Fountaine Pajot Thira 80. Ours is a Thira 80.",
    },
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Diamond",
      award: "3rd Place Diamond, Chef Competition",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners",
      checked: "2026-08-21",
    },
  ],

  // The yacht George asked after by name. Her own agent's page says only
  // "multiple Awards at the boat show EMMYS", which names nothing and could
  // never have rendered. The show's 2025 results name her twice.
  "pi-2": [
    {
      kind: "crew", rank: 1, competition: "Tablescaping", tier: "Emerald",
      award: "1st Place Emerald, Tablescaping",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners",
      checked: "2026-08-21",
    },
    {
      kind: "crew", rank: 2, competition: "Chef Competition", tier: "Emerald",
      award: "2nd Place Emerald, Chef Competition",
      organiser: "EMMYS", year: 2025,
      source: "ritzyyachts.com EMMYS and MEDYS 2025 winners",
      checked: "2026-08-21",
    },
  ],

  // ── MEDYS, and how the hulls were finally pinned ──────────────────────
  //
  // George could not confirm these and was right not to guess: three of the
  // four names are carried by more than one boat. The Mediterranean Yacht
  // Show publishes an attending register going back to 2014 with the builder
  // and the LOA of every hull in every edition, and that register settles all
  // four against our own Sanity records.
  //
  // MELITI is the clearest case for why this mattered. Two yachts of that
  // name have attended: a Lagoon at 17.07 m, last present in 2023, and a
  // Garcia at 26.32 m present from 2023 to 2026. Ours is the Garcia 86 at
  // 26.32 m, and the 2024 and 2025 results are years in which only the Garcia
  // was there. Had the register not existed, this award would have stayed off
  // the page.
  "meliti-sy": [
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Category A",
      award: "1st Place, Category A, Chefs' Competition",
      organiser: "MEDYS", year: 2025,
      source: "mediterraneanyachtshow.gr, the show's own Chefs' Competition page for 2025",
      checked: "2026-08-21",
      hull: "MEDYS attending register: MELITI, Garcia, 26.32 m, present 2023 to 2026. Ours is a Garcia 86 at 26.32 m. A second, unrelated MELITI (Lagoon, 17.07 m) last attended in 2023.",
    },
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Category A",
      award: "3rd Place, Category A, Chefs' Competition",
      organiser: "MEDYS", year: 2024,
      source: "ritzyyachts.com report of the MEDYS 2024 results",
      checked: "2026-08-21",
    },
  ],

  azul: [
    {
      kind: "crew", rank: 2, competition: "Chef Competition", tier: "Category A",
      award: "2nd Place, Category A, Chefs' Competition",
      organiser: "MEDYS", year: 2025,
      source: "mediterraneanyachtshow.gr, the show's own Chefs' Competition page for 2025",
      checked: "2026-08-21",
      hull: "MEDYS attending register: AZUL, Lagoon, 16.56 m, 2024 and 2025. Ours is a Lagoon 55 at 16.56 m, and it is the only AZUL in the register.",
    },
  ],

  nova: [
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: "Category A",
      award: "1st Place, Chefs' Competition",
      organiser: "MEDYS", year: 2024,
      source: "mediterraneanyachtshow.gr, the show's own Chefs' Competition page for 2024",
      checked: "2026-08-21",
      hull: "MEDYS attending register: NOVA, Lagoon, 18.9 m, in the 2024 edition. Ours is a Lagoon 620 at 18.90 m. An unrelated NOVA (Baglietto, 35.2 m) attended only in 2025.",
    },
    {
      kind: "crew", rank: 1, competition: "Chef Competition", tier: null,
      award: "1st Prize, Chefs' Competition",
      organiser: "MEDYS", year: 2015,
      source: "mediterraneanyachtshow.gr, the show's own Chefs' Competition page for 2015",
      checked: "2026-08-21",
      hull: "The Lagoon NOVA at 18.9 m attended the 2015 edition; the Baglietto of the same name did not appear until 2025.",
    },
  ],

  sameli: [
    {
      kind: "crew", rank: 3, competition: "Chef Competition", tier: "Category A Platinum",
      award: "3rd Place, Category A Platinum, Chefs' Competition",
      organiser: "MEDYS", year: 2024,
      source: "ritzyyachts.com report of the MEDYS 2024 results",
      checked: "2026-08-21",
      hull: "MEDYS attending register: SAMELI, Balance / Two Oceans Marine, 22.75 m, 2024 to 2026, and 23 m in 2023. Ours is a Balance / Two Oceans Marine at 23.00 m. Only one SAMELI in the register.",
    },
  ],

  kimata: [
    {
      kind: "crew", rank: 3, competition: "CYBA Designer Water", tier: "Diamond",
      award: "3rd Place Diamond, CYBA Designer Water",
      organiser: "EMMYS", year: 2024,
      source: "fxyachting.com/kimata and fyly.gr/yacht/kimata",
      checked: "2026-08-20",
    },
  ],

  // Serenissima, not Serenissima III. Both are Alegria 67s and both are on the
  // attending list, so the name alone does not settle it; these two entries
  // rest on FYLY naming this hull, and they are the weakest sourcing in the
  // file. Flagged for George rather than quietly dropped.
  serenissima: [
    {
      kind: "crew", rank: 1, competition: "Best Dish", tier: null,
      award: "1st Prize, Best Dish",
      organiser: "EMMYS", year: 2024,
      source: "fyly.gr/yacht/serenissima",
      checked: "2026-08-18",
    },
    {
      kind: "crew", rank: 3, competition: "Best Dish", tier: null,
      award: "3rd Prize, Gournopoula Taco",
      organiser: "EMMYS", year: 2023,
      source: "fyly.gr/yacht/serenissima",
      checked: "2026-08-18",
    },
  ],
};

/**
 * Held back on purpose, with the reason. Not a to-do list: each of these is a
 * claim that failed a check, and the note is what would have to change.
 */
export const WITHHELD = {
  "above-beyond-tablescaping-2025":
    "CONTESTED. fyly.gr/yacht/above-beyond records a 1st Place Diamond in " +
    "Tablescaping at EMMYS 2025. The show reporting for that edition gives " +
    "the Diamond tablescaping result to AD ASTRA. Both cannot be right and " +
    "the site prints neither version of a contested year. Needs George or " +
    "the show's own 2025 page.",
  alteya:
    "Chef Noris is described as placing second as Bulgaria's best chef in " +
    "2021 and first for a pasta dish. The earlier note here said the chef " +
    "had changed and the award belonged to somebody gone; re-reading the " +
    "page, the accolades are Noris's own and he is the current chef. That " +
    "correction does not unblock it: no organiser is named for either " +
    "placing and the pasta prize has no year.",
  alegria:
    "A crew member is credited with winning 'the 2019 European Championship'. " +
    "Of what is not stated, and no organiser is named.",
  "worlds-end":
    "Recorded as a chef win at the Antigua Charter Show with no year and no " +
    "category. Two of the three are missing, so it cannot render.",
  "pareaki-ii":
    "Checked against Sanity, all 30 fleet brochures, the Istion page, web " +
    "search and George's own mail. Nothing anywhere. It may be true and " +
    "simply unwritten; it needs written confirmation from FYLY or Istion.",
};

/**
 * Award-shaped text that is NOT an award for these yachts. The guard script
 * fails if any of them turns up in YACHT_AWARDS.
 */
/**
 * Award-shaped text that is NOT an award for the yacht it sits beside. The
 * guard fails the build if one of these ever turns into a printed claim.
 *
 * 2026-08-21: these used to be keyed by slug, which quietly said "this yacht
 * can never have an award". ChristAl MiO broke that. Her agent's page calls
 * Fountaine Pajot an award-winning builder, which is still not hers, AND her
 * crew took a first place at the 2026 show, which is. Both are true at once,
 * so the key is now the claim and the slug is a field.
 */
export const NEVER_CLAIM = {
  "christal-mio-builder": {
    slug: "christal-mio",
    reason:
      "'award-winning' on the agent's page refers to Fountaine Pajot as a " +
      "builder, not to this hull. Her own 2026 placing is in YACHT_AWARDS.",
  },
  "christal-mio-80-builder": {
    slug: "christal-mio-80",
    reason: "Same builder claim. The shipyard won, this yacht did not.",
  },
  "majesty-of-greece-builder": {
    slug: "majesty-of-greece",
    reason: "Same builder claim. Fountaine Pajot won, this yacht did not.",
  },
  "pi-2-model": {
    slug: "pi-2",
    reason:
      "PI 2's page also calls the Fountaine Pajot Saba 50 'an award-winning " +
      "model' voted 'Best Boat' in class. That is the model, not this hull. " +
      "Her real placings came from the show, not from the brochure.",
  },
  "kimata-model": {
    slug: "kimata",
    reason:
      "Kimata's page credits the Alegria 67 with 'Best Multihull Sailing " +
      "Yacht in Asia' and 'Best Multihull of the Year'. Those are the model's.",
  },
};

/**
 * Distinctions that are real, sourced and dated, and are not yacht show
 * placings. They are kept apart so that "32 placings at the two shows" stays
 * exactly true, and so that nothing here inflates that count.
 *
 * George's decision on both, 2026-08-21.
 */
export const HONOURS = {
  "just-marie-2": [
    {
      kind: "crew",
      award: "First-Class Medal of Honour",
      organiser: "Minister of Merchant Marine, Greece",
      year: 2001,
      note:
        "Awarded to her captain for his part in the rescue of the passengers " +
        "of the Express Samina.",
      source: "fxyachting.com/just-marie-2",
      checked: "2026-08-21",
    },
  ],
  alina: [
    {
      kind: "crew",
      award: "Winner",
      organiser: "Greek MasterChef",
      year: 2022,
      note: "Won by the chef who cooks aboard.",
      source: "fxyachting.com/alina, which resolves to a single Fountaine Pajot Power 80, matching ours",
      checked: "2026-08-21",
    },
  ],
};

/**
 * Who shows each of these yachts, and why this list exists.
 *
 * George asked the only question that mattered before any of this could go
 * live: are they all from the three houses we are permitted to place, FX
 * Yachting, FYLY and Istion. "Δεν έχουμε permission να βάλουμε άλλα σκάφη."
 *
 * They are, and this records how that was established rather than asserted.
 * The EMMYS attending register prints the exhibiting agent beside every hull;
 * the MEDYS register carries the exhibiting company on every entry of every
 * edition back to 2014. Both were read on 2026-08-21.
 *
 * The guard fails the build if a yacht ever acquires an award without an
 * entry here, or with one outside the permitted three. That turns a question
 * somebody has to remember to ask into one the build asks by itself.
 */
export const PERMITTED_HOUSES = ["FX Yachting", "FYLY", "Istion Yachting"];

export const PLACED_BY = {
  "above-beyond": "FX Yachting",
  "ad-astra": "FX Yachting",
  alena: "FX Yachting",
  aphaea: "FX Yachting",
  "christal-mio": "FX Yachting",
  "crazy-horse": "FX Yachting",
  elly: "FX Yachting",
  kimata: "FX Yachting",
  "pi-2": "FX Yachting",
  sahana: "FX Yachting",
  samara: "FX Yachting",
  serenissima: "FX Yachting",
  "just-marie-2": "FX Yachting",
  alina: "FX Yachting",
  // Istion showed all four of these at MEDYS in the years they placed.
  // SAMELI is the one worth a note: IYC exhibited her in 2023 and Istion has
  // done so since 2024. Her placing is 2024, so it is Istion's boat in the
  // year that matters. If we ever add a 2023 result for her, it does not
  // belong to us.
  "meliti-sy": "Istion Yachting",
  azul: "Istion Yachting",

  nova: "Istion Yachting",
  sameli: "Istion Yachting",
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
 * @returns {Array} the renderable awards for a slug, strongest first: a first
 * place before a second before a third, and inside a placing the most recent
 * first. The old sort was by year alone, which buried a win under a third
 * place from a later season.
 */
export function awardsFor(slug) {
  if (!slug) return [];
  const list = YACHT_AWARDS[slug];
  if (!Array.isArray(list)) return [];
  return list
    .filter(renderable)
    .slice()
    .sort((a, b) => (a.rank || 9) - (b.rank || 9) || b.year - a.year);
}

/** Newest first, for anywhere that wants a chronology rather than a ranking. */
export function awardsByYear(slug) {
  return awardsFor(slug).sort((a, b) => b.year - a.year || (a.rank || 9) - (b.rank || 9));
}

/**
 * Honours are complete only if they name the thing, who gave it and when,
 * exactly as awards are.
 */
export function honoursFor(slug) {
  const list = HONOURS[slug];
  if (!Array.isArray(list)) return [];
  return list.filter((e) => REQUIRED.every((k) => String(e?.[k] ?? "").trim() !== ""));
}

/** "1st", "2nd", "3rd", for the rank marker. */
export function rankLabel(entry) {
  return { 1: "1st", 2: "2nd", 3: "3rd" }[entry?.rank] || "";
}

/**
 * The line beside the rank marker: the contest, then the bracket it was
 * judged in. "Chef Competition · Diamond".
 */
export function awardTitle(entry) {
  if (!entry) return "";
  return entry.tier ? `${entry.competition}, ${entry.tier}` : entry.competition || entry.award;
}

/** One line for schema and meta text: "1st Place Diamond, Chef Competition, EMMYS 2026". */
export function awardLine(entry) {
  return `${entry.award}, ${entry.organiser} ${entry.year}`;
}

/**
 * The one award to lead with, as a short phrase for a meta description.
 *
 * This is the highest-value line in the whole awards job. The section on a
 * yacht page cannot earn a click: by the time anybody reads it they have
 * already clicked. What earns the click is the two lines Google prints.
 *
 * Ranking, strongest first: a vessel award beats a crew award because the
 * hull cannot leave; a first beats a second beats a third; recent beats old.
 *
 * The phrase keeps the actual placing. Softening a third into "award-winning"
 * is the exact move that turned out to mean the builder elsewhere.
 */
export function headlineAward(slug) {
  const list = awardsFor(slug);
  if (list.length === 0) return null;

  const best = list.slice().sort((a, b) => {
    if ((a.kind === "vessel") !== (b.kind === "vessel")) return a.kind === "vessel" ? -1 : 1;
    if ((a.rank || 9) !== (b.rank || 9)) return (a.rank || 9) - (b.rank || 9);
    return b.year - a.year;
  })[0];

  const label = best.award
    .replace(/^Winner,\s*/i, "")
    .replace(/\s*Diamond,|\s*Platinum,|\s*Emerald,/i, ",")
    .replace(/\s+/g, " ")
    .trim();

  return `${label}, ${best.organiser} ${best.year}`;
}

/**
 * The same award, cut to fit a search result. A meta description has 158
 * characters and the price has to survive, so the category is what goes.
 * The placing is never dropped.
 */
export function headlineAwardShort(slug) {
  const full = headlineAward(slug);
  if (!full) return null;
  const parts = full.split(",").map((s) => s.trim());
  const org = parts[parts.length - 1].replace(/\s+Yacht Show\b/i, "");
  return `${parts[0]}, ${org}`;
}

/** Totals for the section header, computed rather than typed. */
export function awardTotals() {
  const slugs = Object.keys(YACHT_AWARDS).filter((s) => awardsFor(s).length > 0);
  const all = slugs.flatMap((s) => awardsFor(s));
  return {
    yachts: slugs.length,
    placings: all.length,
    firsts: all.filter((a) => a.rank === 1).length,
    years: new Set(all.map((a) => a.year)).size,
    shows: new Set(all.map((a) => a.organiser)).size,
    competitions: new Set(all.map((a) => a.competition).filter(Boolean)).size,
  };
}

export default YACHT_AWARDS;
