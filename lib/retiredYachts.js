/**
 * Yachts withdrawn from every public surface.
 *
 * ── Why this file, and why it is not a Sanity delete ─────────────────────
 *
 * George, 2026-08-21, named seven yachts to come off the site. Every one of
 * them carries the same tell in her crew field: "Skipper available", "Skipper
 * mandatory", or a captain with the cook marked optional. That is a bareboat
 * boat with a professional bolted on, and this house writes crewed weeks.
 *
 * They are not deleted from Sanity, and deliberately so. This repo holds no
 * write token, a deletion is not reversible from here, and the records carry
 * photography and copy that took work. Withdrawing them from the public
 * surfaces achieves what was asked without destroying anything.
 *
 * ── How the withdrawal actually happens ──────────────────────────────────
 *
 * Forty-three files in this codebase run a query against `_type == "yacht"`.
 * Patching them one at a time would have missed some on the day and would
 * have missed the forty-fourth the moment anybody wrote it. So the exclusion
 * is applied in lib/sanity.js, in the same wrapper that already normalises
 * long dashes on everything Sanity returns: the GROQ string is rewritten on
 * its way out, so a retired yacht cannot come back through a query nobody
 * remembered to update. Counts are covered too, because the filter lands
 * inside count() along with everything else.
 *
 * Their URLs are not left to 404. next.config.mjs sends each one to the fleet
 * page with a permanent redirect, which is the difference between retiring a
 * page and losing whatever links and rankings it had.
 */
export const RETIRED_YACHTS = {
  "alia": 'Excess 11, crew field reads "Skipper available".',
  "angelika": 'Fountaine Pajot Isla 40, crew field reads "Skipper available".',
  "helidoni": 'Lagoon 46, "Captain/Skipper (optional Cook/Hostess)".',
  "madicon": 'Lagoon 450 Fly, crew field reads "Skipper mandatory".',
  "my-angel": 'Fountaine Pajot MY4.S, crew field reads "Skipper available".',
  "odyssey": 'Nautitech 46, "Captain/Skipper, Cook/Hostess".',
  "perseids": 'Bali Catspace, crew field reads "Skipper available".',

  // 2026-09-08, George: seven motor yachts come off the site as the motor
  // fleet is renewed. Not a bareboat tell like the seven above; the house
  // is simply carrying different hulls from today. Same treatment: nothing
  // is deleted, the URLs 301 to the fleet page, and the three articles that
  // carried STAR LINK or VISTA among their related yachts were repointed at
  // hulls in the same price band first, so no reader meets an empty card.
  "n-ice": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "lidia": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "estia-poseidon": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "irenes": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "red-rose": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "star-link": "Withdrawn 2026-09-08 with the motor fleet renewal.",
  "vista": "Withdrawn 2026-09-08 with the motor fleet renewal.",

  // 2026-09-14, George: yachts based outside Greece leave the site. All
  // three work out of Turkey (Bodrum or Marmaris) and cross into Greek
  // waters only for the week.
  "ottawa": "Withdrawn 2026-09-14: based outside Greece.",
  "ariela": "Withdrawn 2026-09-14: based outside Greece.",
  "shero": "Withdrawn 2026-09-14: based outside Greece.",

  // 2026-09-14, George: no catamaran whose rate card sits entirely below
  // EUR 17,000 a week.
  "my-star": "Withdrawn 2026-09-14: catamaran rate card below EUR 17,000.",
  "errant-vagabond": "Withdrawn 2026-09-14: catamaran rate card below EUR 17,000.",
  "alegria": "Withdrawn 2026-09-14: catamaran rate card below EUR 17,000.",
  // The same day George took the line further: any catamaran whose card
  // starts below EUR 17,000 leaves too. The house is moving up-market.
  "endless-beauty": "Withdrawn 2026-09-14: catamaran rate card starts below EUR 17,000.",
  "tamiro": "Withdrawn 2026-09-14: catamaran rate card starts below EUR 17,000.",
  "moya": "Withdrawn 2026-09-14: catamaran rate card starts below EUR 17,000.",
  // 2026-09-17, George, after the Ahrefs crawl found her page orphaned: a
  // 20 metre sailing monohull offered with a skipper and an optional hostess
  // from EUR 13,000, which is neither fully crewed nor above the floor.
  "shooting-star": "Withdrawn 2026-09-17: skipper-led monohull below the crewed floor.",
};

export const RETIRED_YACHT_SLUGS = Object.keys(RETIRED_YACHTS);

/** Where a retired yacht's URL should land. The fleet, not a dead end. */
export const RETIRED_YACHT_DESTINATION = "/charter-yacht-greece";

const LIST = RETIRED_YACHT_SLUGS.map((s) => JSON.stringify(s)).join(",");

/**
 * Rewrite a GROQ query so every yacht filter in it excludes the retired set.
 *
 * Matches `_type == "yacht"` with or without spaces, and `_type in [...]`
 * lists that include "yacht". Leaves a query that mentions no yacht type
 * exactly as it was, so this is a no-op for posts, settings and everything
 * else that goes through the same client.
 */
export function excludeRetiredYachts(query) {
  if (typeof query !== "string" || RETIRED_YACHT_SLUGS.length === 0) return query;
  if (!/_type\s*(==|in)\s*[["]/.test(query) || !/yacht/i.test(query)) return query;

  const clause = ` && !(slug.current in [${LIST}])`;

  return query
    // *[_type == "yacht" ...]
    .replace(/_type\s*==\s*"yacht"/g, (m) => m + clause)
    // *[_type in ["post", "yacht"] ...] — the exclusion is harmless for the
    // other types in the list, because their slugs are not in it.
    .replace(/_type\s+in\s+\[[^\]]*"yacht"[^\]]*\]/g, (m) => m + clause);
}
