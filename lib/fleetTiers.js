/**
 * The two fleets, and why they are cut this way.
 *
 * ── The problem the old cut had ──────────────────────────────────────────
 *
 * Private and Explorer were split by price model and by whether a skipper
 * came with the boat. Section 5 removed the per-person rate and section 6
 * withdrew the seven bareboat hulls, so by 2026-08-21 the two tiers held 58
 * yachts and 7, and four of the Private ones sat inside Explorer's exact
 * length and price band. The names described a difference that had dissolved.
 *
 * ── The cut George chose ────────────────────────────────────────────────
 *
 * Sail against power. Measured across the 65 that remain:
 *
 *   Sailing Fleet   33 yachts   EUR 10,900 - 65,000    median 32,000
 *   Private Fleet   32 yachts   EUR 14,000 - 180,000   median 45,000
 *
 * Thirty-three against thirty-two, where it used to be 58 against 7. It is
 * also the only division a client understands without being told, and the
 * commercial weight lands correctly: of the sixteen yachts at EUR 60,000 and
 * above, ten are in the Private Fleet.
 *
 * "Explorer" went because in this trade it means a long-range motor vessel
 * built for expeditions. Over a fleet of sailing catamarans it told anyone
 * who knows the market the opposite of the truth, and the most decorated
 * yacht in the house, a Sunreef 80 with seven placings, sat inside it.
 *
 * ── How the cut is applied ──────────────────────────────────────────────
 *
 * Not by editing Sanity: this repo holds no write token, and 65 records would
 * have to be changed by hand. The tier is derived from the name prefix the
 * fleet already uses consistently, and lib/sanity.js rewrites every GROQ that
 * asks for the old field. Same chokepoint as the retired yachts, for the same
 * reason: forty-odd files query this and patching them one at a time would
 * miss the next one somebody writes.
 */

/*
 * ── The 2026-08-30 re-cut: catamarans against motor yachts ──────────────
 *
 * George's call, and the analytics agree with him: "catamaran" is the
 * single biggest demand cluster the site has (2,455 impressions in GSC),
 * both closed charters were catamarans, and the client who wants one had
 * to know the difference between sail and power drive before choosing a
 * door. Now there is ONE catamaran door holding all 42 hulls - sailing
 * and power together, exactly as the buyer thinks of them - and one motor
 * yacht door for the 17 M/Y.
 *
 * The six S/Y monohulls leave fleet BROWSING entirely (George, 30/8) but
 * their pages stay live: they hold Google impressions, and S/Y MELITI
 * holds a MEDYS 2025 first place that stays on the awards board. The
 * exclusion happens at the same chokepoint as everything else; queries
 * that must still see monohulls (the sitemap, a slug lookup) either carry
 * $slug or the explicit marker.
 *
 * Variable names kept (forty files import them): SAILING_PREFIXES now
 * means "the /explorer-fleet cut" = all catamarans; PRIVATE_PREFIXES
 * means "the /private-fleet cut" = motor yachts.
 */
export const SAILING_PREFIXES = ["S/CAT", "P/CAT"];
export const PRIVATE_PREFIXES = ["M/Y", "Cruise Ship"];
export const MONO_PREFIXES = ["S/Y"];

export const FLEET = {
  private: {
    // URL stays /private-fleet - it carries impressions and backlinks.
    slug: "private-fleet",
    label: "Motor Yacht Fleet",
    subtitle: "Fully Crewed Motor Yachts, 20 to 50 Metres",
    prefixes: PRIVATE_PREFIXES,
  },
  sailing: {
    // The URL stays /explorer-fleet. It carries impressions, and a rename
    // would cost ranking for a label change nobody outside sees. The name a
    // visitor reads and the string in the address bar do not have to match.
    slug: "explorer-fleet",
    label: "Catamaran Fleet",
    subtitle: "Sailing & Power Catamarans, Fully Crewed",
    prefixes: SAILING_PREFIXES,
  },
};

const groqPredicate = (prefixes) =>
  "(" + prefixes.map((p) => `string::startsWith(name, "${p}")`).join(" || ") + ")";

export const PRIVATE_GROQ = groqPredicate(PRIVATE_PREFIXES);
export const SAILING_GROQ = groqPredicate(SAILING_PREFIXES);
export const MONO_GROQ = groqPredicate(MONO_PREFIXES);

/** Which fleet a yacht belongs to, from its name. */
export function fleetOf(yacht) {
  const name = String(yacht?.name || "");
  if (MONO_PREFIXES.some((p) => name.startsWith(p))) return "mono";
  if (SAILING_PREFIXES.some((p) => name.startsWith(p))) return "sailing";
  if (PRIVATE_PREFIXES.some((p) => name.startsWith(p))) return "private";
  // Anything that does not announce itself goes to the Private Fleet, which
  // is where a motor vessel of unknown labelling belongs. ELYSIUM, the one
  // record without a standard prefix, is a 64 metre motor vessel.
  return "private";
}

export const isSailingFleet = (y) => fleetOf(y) === "sailing";
export const isPrivateFleet = (y) => fleetOf(y) === "private";
export const isMonohull = (y) => fleetOf(y) === "mono";

/*
 * Monohulls out of every LIST, alive on every PAGE (George, 30/8:
 * "κρύψιμο από στόλο, σελίδες ζωντανές"). A query that fetches yachts
 * without naming a slug is a listing - fleet grids, counts, form chips,
 * compare, related-yachts rails - and must not show an S/Y. A query that
 * carries $slug / slug.current == is a detail lookup and is left alone,
 * as is anything carrying the explicit marker below (the sitemap).
 */
export const INCLUDE_MONO_MARKER = "/* +mono */";

export function excludeMonohullsFromLists(query) {
  if (typeof query !== "string") return query;
  if (!query.includes('_type == "yacht"')) return query;
  // GROQ has no block comments - the marker is OUR annotation, not
  // Sanity's. Strip it before the query leaves the building, or the
  // whole fetch dies with a parse error (the 30/8 sitemap lesson).
  if (query.includes(INCLUDE_MONO_MARKER)) {
    return query.replaceAll(INCLUDE_MONO_MARKER, "");
  }
  if (query.includes("$slug") || query.includes("slug.current ==")) return query;
  return query.replaceAll('_type == "yacht"', `_type == "yacht" && !(${MONO_GROQ})`);
}

/** The old label, wherever a stale record or a cached string still carries it. */
export function fleetLabel(yacht) {
  return FLEET[fleetOf(yacht)].label;
}

/**
 * Rewrite a GROQ query so the retired `fleetTier` field is replaced by the
 * name-prefix rule. Matches the shapes the codebase actually uses:
 *
 *   fleetTier in ["private", "both"]     fleetTier in ["explorer", "both"]
 *   fleetTier == "explorer"              fleetTier == "private"
 *
 * A query that never mentions fleetTier comes back untouched.
 */
export function rewriteFleetTier(query) {
  if (typeof query !== "string" || !query.includes("fleetTier")) return query;
  return query
    .replace(/fleetTier\s+in\s+\[\s*["']private["']\s*(?:,\s*["']both["']\s*)?\]/g, PRIVATE_GROQ)
    .replace(/fleetTier\s+in\s+\[\s*["']explorer["']\s*(?:,\s*["']both["']\s*)?\]/g, SAILING_GROQ)
    .replace(/fleetTier\s*==\s*["']private["']/g, PRIVATE_GROQ)
    .replace(/fleetTier\s*==\s*["']explorer["']/g, SAILING_GROQ);
}
