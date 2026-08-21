/**
 * The six question headings on a yacht page, built from that yacht's own data.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 *
 * Every one of the six question-H2s on all 72 yacht pages was the same
 * sentence with the yacht name dropped into it:
 *
 *   What Are the Specifications of M/Y LA PELLEGRINA 1?
 *   What Is the Weekly Charter Rate for M/Y LA PELLEGRINA 1?
 *   Who Is M/Y LA PELLEGRINA 1 Ideal For?
 *
 * Read as a search query, each one can only ever match somebody who already
 * typed the yacht's name. Nobody types "M/Y LA PELLEGRINA 1". So the six
 * headings that should be the page's way in were, between them, matching one
 * query per page: its own name.
 *
 * That is consistent with what the pages do: yacht pages carry the site's
 * best click-through by a wide margin, and almost no impressions to spend it
 * on. They are starved, not broken. The fix is not persuasion, it is giving
 * the headings something a person actually searches.
 *
 * ── What they are allowed to compete for ─────────────────────────────────
 *
 * Not the head terms. Nine category pages already own those
 * ("Catamaran Charter Greece", "Motor Yacht Charter Greece", and so on, see
 * lib/yachtTypeSeo.js). Pointing 72 detail pages at the same queries would
 * take traffic from our own landing pages, which is the mistake the crewed
 * cluster already made once.
 *
 * What a detail page can own, and a category page cannot, is the model.
 * `builder` in Sanity is not a manufacturer, it holds the model name:
 * "Sunreef 80", "Fountaine Pajot Alegria 67", "Lagoon 46", "Couach 164".
 * That is what somebody types after seeing a boat somewhere else, and 57 of
 * the 72 values are unique across the fleet.
 *
 * The other 15 share a model with at least one sister, the largest group
 * being six Alegria 67s. For those, the model alone would put six pages on
 * the same question, so `distinct()` adds the guest and cabin count, which
 * separates every one of them.
 *
 * ── Rules this file keeps ────────────────────────────────────────────────
 *
 * 1. Every word comes from a field. Nothing is inferred, rounded up, or
 *    described. If a field is missing the heading falls back to the original
 *    wording rather than guessing.
 * 2. The yacht name stays in two of the six. Errant Vagabond sits at
 *    position 1.6 and takes most of the clicks the fleet earns, on its own
 *    name; stripping the name from every heading would put that at risk for
 *    no gain. The h1 and the answer text carry it everywhere regardless.
 * 3. Questions stay questions, because answer engines quote Q/A shapes.
 *
 *    Correcting what an earlier draft of this comment asserted: these six
 *    are NOT in the page's FAQ schema. That schema carries exactly one
 *    question, built in app/yachts/[slug]/page.jsx, and it was name-only
 *    for the same reason these were. It now carries the model too, so the
 *    visible headings and the structured data say the same thing.
 *
 *    Putting all six into the schema would need six real answers lifted
 *    from the page body. That is a larger job and it has not been done.
 */

/** The searchable name of the boat: "Sunreef 80", "Lagoon 46", "Couach".
 *  Kept whole rather than shortened to the model number, because the full
 *  string is what people paste after seeing a yacht somewhere else. */
function model(yacht) {
  let b = (yacht?.builder || "").trim();
  if (!b) return null;
  // "Custom Built" is a category, not something anybody searches for.
  if (/^custom(\s|$)/i.test(b)) return null;

  // Most of the field holds a model: "Sunreef 80", "Lagoon 46", "Couach 164".
  // A few hold the yard instead, with its suffix: "Couach Yachts", "I-SEA
  // Yachts". Left alone those produce "charter a Couach Yachts", which is a
  // plural company name behind a singular article, and reads like a mistake
  // on the page that is supposed to look the most expensive.
  //
  // Only a TRAILING suffix is stripped. "Comar Yachts Comet 100" keeps every
  // word, because there the yard name is part of a longer model string.
  b = b.replace(/\s+yachts?$/i, "").trim();
  return b || null;
}

/** M/Y → motor yacht, S/CAT → sailing catamaran, and so on. Taken from the
 *  name prefix because that is the field the whole site already trusts for
 *  this (fleet filters, similar-yacht matching, the type landing pages). */
function craft(yacht) {
  const n = (yacht?.name || "").trim();
  if (/^S\/CAT/i.test(n)) return "sailing catamaran";
  if (/^P\/CAT/i.test(n)) return "power catamaran";
  if (/^S\/Y/i.test(n)) return "sailing yacht";
  if (/^M\/Y/i.test(n)) return "motor yacht";
  return "yacht";
}

/** "23.87 m / 80 ft" and "20,36 m / 67 ft" both appear in the data, and one
 *  yacht stores plain "19.00 m". Returns a whole number of metres or null;
 *  never rounds a value it could not read. */
function metres(yacht) {
  const raw = (yacht?.length || "").replace(",", ".");
  const m = raw.match(/(\d+(?:\.\d+)?)\s*m/i);
  if (!m) return null;
  const v = Math.round(parseFloat(m[1]));
  return Number.isFinite(v) && v > 0 ? v : null;
}

const num = (v) => {
  const n = parseInt(String(v ?? "").trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * "a Sunreef 80" but "an I-SEA Yachts", "an Aquila 54", "an Oyster 62".
 *
 * Sound, not spelling, because these are model names: "an I-SEA" is right
 * even though I is a consonant letter, and "a Y8" is right even though Y
 * starts the word, because it is said "why-eight". The letters that get
 * read out individually and start with a vowel sound are A, E, F, H, I, L,
 * M, N, O, R, S and X.
 */
function article(word) {
  const w = (word || "").trim();
  if (!w) return "a";
  // A single letter, or a letter followed by a digit or hyphen, is spoken as
  // a letter: "I-SEA", "Y8", "X5".
  if (/^[A-Za-z]([\d-]|$)/.test(w)) {
    return /^[AEFHILMNORSX]/i.test(w) ? "an" : "a";
  }
  return /^[aeiou]/i.test(w) ? "an" : "a";
}

/**
 * The yacht as a search phrase, with its article: "a Sunreef 80",
 * "an I-SEA motor yacht", "a Lagoon sailing catamaran".
 *
 * A model carrying a number stands on its own. A bare yard name does not,
 * because "charter a Couach" leaves the reader waiting for the noun, so the
 * craft type supplies it. Both forms are still what somebody types, which is
 * the whole point of leading with the model rather than the boat's own name.
 *
 * Exported because app/yachts/[slug]/page.jsx needs the identical phrase for
 * the FAQ schema question. Two copies of this rule would drift apart, and
 * the visible heading disagreeing with the structured data is worse than
 * either one being wrong on its own.
 *
 * @returns {string|null} null when there is no usable model.
 */
export function yachtSubject(yacht) {
  const mdl = model(yacht);
  if (!mdl) return null;
  const named = /\d/.test(mdl) ? mdl : `${mdl} ${craft(yacht)}`;
  return `${article(named)} ${named}`;
}

/**
 * @returns {{specs,pricing,gallery,features,toys,ideal}} headings, each a
 * complete question ending in "?", or null where the data does not support
 * one, in which case the caller keeps the wording it has.
 */
export function yachtQuestions(yacht) {
  const name = (yacht?.name || "").trim();
  const mdl = model(yacht);
  const type = craft(yacht);
  const m = metres(yacht);
  const guests = num(yacht?.sleeps);
  const cabins = num(yacht?.cabins);

  // Size phrase used where the model is missing: "a 24 m sailing catamaran".
  const sized = m ? `a ${m} m ${type}` : `a ${type}`;

  const subject = yachtSubject(yacht) || sized;

  return {
    // Carries both the name and the model. This is the block most often
    // lifted for a name query, and the specs table under it is the answer,
    // so it is the one heading that should hold every handle at once.
    specs:
      name && mdl
        ? `What are the full specifications of ${name}, ${subject}?`
        : null,

    // The money question, and the one with the most demand behind it by a
    // long way. Led by the model so it can match "sunreef 80 charter price".
    //
    // The guest count is not padding. Six of these yachts are Alegria 67s and
    // five are Power 67s, so the model alone put six pages on one question.
    // They differ in who they sleep, that difference is real, and "alegria 67
    // for 10 guests" is a shape people type. With it the six-way collision
    // breaks apart; without it we would be asking six of our own pages to
    // fight each other for one query.
    pricing: mdl
      ? guests
        ? `How much does it cost to charter ${subject} for ${guests} guests in Greece for a week?`
        : `How much does it cost to charter ${subject} in Greece for a week?`
      : m
        ? guests
          ? `How much does it cost to charter ${sized} for ${guests} guests in Greece for a week?`
          : `How much does it cost to charter ${sized} in Greece for a week?`
        : null,

    gallery: mdl
      ? `What does ${subject} look like inside and out?`
      : null,

    // Keeps the name: what is aboard is specific to the boat, not the model,
    // and a promise made against a model would be a promise for her sisters
    // too.
    features: name ? `What is on board ${name}?` : null,

    toys: mdl
      ? `What water toys come with ${subject} in Greece?`
      : `What water toys come with ${sized} in Greece?`,

    // The configuration question, and the one the first draft got wrong.
    //
    // Written as "Which Greek charter sailing catamaran suits 10 guests in 5
    // cabins?" it produced only 19 distinct headings across 72 pages, with
    // sixteen of them identical: there are simply that many 10-guest,
    // 5-cabin sailing catamarans in the fleet. That is worse cannibalisation
    // than the name-stuffed heading it replaces, so the model leads here too
    // and the configuration follows it. Collisions drop to the true sisters.
    ideal:
      mdl && guests && cabins
        ? `Does ${subject} suit ${guests} guests in ${cabins} cabins?`
        : mdl && guests
          ? `Does ${subject} suit ${guests} guests?`
          : guests && cabins && m
            ? `Does ${sized} suit ${guests} guests in ${cabins} cabins?`
            : null,

  };
}

export default yachtQuestions;
