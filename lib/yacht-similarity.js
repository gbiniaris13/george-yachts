/**
 * The four boats shown under a yacht, chosen the way a broker would choose
 * them.
 *
 * ── What was wrong with the old scoring ──────────────────────────────────
 *
 * Measured on 8 September against the live fleet, the block was suggesting
 * boats that had nothing to do with the one on screen:
 *
 *   SEA U            25 knot motor yacht, EUR 21,000
 *     first suggestion  WORLD'S END, a 9 knot sailing catamaran
 *   LA PELLEGRINA    22 knots, EUR 180,000
 *     third suggestion  NORTHWIND II at EUR 83,300, less than half
 *   ALEGRIA          EUR 10,900
 *     third suggestion  PI 2 at EUR 17,000, fifty six per cent more
 *   GENNY            10 knot sailing catamaran
 *     third and fourth  two 14 knot power catamarans
 *
 * Three faults produced all of that. The heaviest signal in the file was
 * fleetTier at sixty points, which is a commercial bucket no guest has ever
 * heard of. The hull type was read out of the subtitle string rather than
 * out of the category field that exists in Sanity, so it was frequently
 * blank and scored nothing. And price, the thing a person actually filters
 * on, was worth twenty points at most, less than a third of the tier.
 *
 * ── What decides it now ──────────────────────────────────────────────────
 *
 * George's instruction on 8 September was two words, power and price, and
 * they are the two heaviest terms here. Before any scoring there are two
 * gates, because some suggestions are not weak, they are wrong:
 *
 *   • The hull family has to match. A motor yacht is never answered with a
 *     sailing catamaran. Somebody looking at a twenty five knot planing
 *     hull is not one click away from wanting a boat that sails at nine.
 *   • The price has to be in the same conversation. Below three fifths of
 *     the one on screen, or above five thirds of it, and the boat is not an
 *     alternative, it is a different budget.
 *
 * What survives both gates is then ranked on how close it is: price first,
 * cruising speed second, then size, then how many it sleeps, and a small
 * nod to the same yard. Fewer than four may come back, and that is correct.
 * Three honest alternatives beat four with a stranger among them.
 */

/** The lower price band a suggestion has to clear, and the upper one. */
const PRICE_FLOOR = 0.6;
const PRICE_CEILING = 1 / PRICE_FLOOR;

/**
 * And the widened band, used only when the strict one leaves a yacht with
 * almost nothing to show.
 *
 * At the top of the fleet there are simply not many peers: LA PELLEGRINA at
 * a hundred and eighty thousand a week and twenty two knots has one match
 * inside the tight band. A row with one card in it reads as broken. So
 * price flexes on a second pass and the other two gates never do, because
 * a boat at a different price is an honest suggestion and a boat with the
 * wrong hull or half the speed is not.
 */
const PRICE_FLOOR_WIDE = 0.45;

/**
 * How far apart two cruising speeds may be.
 *
 * ELYSIUM at eleven knots was being offered beside LA PELLEGRINA at twenty
 * two, at almost the same money. Those are not alternatives. One is a
 * displacement week in the near islands and the other is Santorini by
 * lunchtime, which is exactly the distinction the sample itinerary directly
 * above this block now makes on every page.
 */
const SPEED_FLOOR = 0.55;

function priceNum(priceStr) {
  if (!priceStr) return 0;
  const m = String(priceStr).match(/[\d,]+/);
  if (!m) return 0;
  return parseInt(m[0].replace(/,/g, ""), 10);
}

function lengthM(len) {
  if (!len) return 0;
  const m = String(len).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function guestsNum(g) {
  if (!g) return 0;
  const m = String(g).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

/**
 * Cruising speed out of the Studio's free text field, which has held
 * "22 knots", "9 to 10 knots" and "21.5 knots". A range takes its lower
 * figure, the same reading lib/itineraryPlanner.js uses, so the two files
 * cannot disagree about what a boat does.
 */
function knots(raw) {
  if (typeof raw === "number" && raw > 0) return raw;
  if (!raw) return 0;
  const nums = String(raw).match(/\d+(?:\.\d+)?/g);
  return nums ? Math.min(...nums.map(Number)) : 0;
}

/**
 * The hull family. The category field in Sanity is the answer whenever it
 * is there; the subtitle is only read when it is not, which on the current
 * fleet is never. Reading the subtitle first was the old bug.
 */
export function hullFamily(yacht) {
  if (!yacht) return "";
  const c = String(yacht.category || "").toLowerCase();
  if (c === "motor-yachts") return "motor";
  if (c === "power-catamarans") return "power-cat";
  if (c === "sailing-catamarans") return "sail-cat";
  if (c === "sailing-monohulls") return "sail-mono";

  const s = String(yacht.subtitle || yacht.name || "").toLowerCase();
  if (s.includes("catamaran") && (s.includes("power") || s.includes("motor"))) return "power-cat";
  if (s.includes("catamaran")) return "sail-cat";
  if (s.includes("sail")) return "sail-mono";
  if (s.includes("motor")) return "motor";
  return "";
}

/** A ratio in 0..1, squared, so near misses score well and far ones do not. */
function closeness(a, b) {
  if (!a || !b) return 0;
  const r = Math.min(a, b) / Math.max(a, b);
  return r * r;
}

export function scoreSimilarity(current, candidate, priceFloor = PRICE_FLOOR) {
  if (!current || !candidate) return -1;
  if (current._id && candidate._id && current._id === candidate._id) return -1;
  if (current.slug && candidate.slug && current.slug === candidate.slug) return -1;

  // ── Gate one: the same kind of boat ───────────────────────────────────
  const family = hullFamily(current);
  if (family && hullFamily(candidate) !== family) return -1;

  // ── Gate two: the same conversation about money ───────────────────────
  const pA = priceNum(current.weeklyRatePrice);
  const pB = priceNum(candidate.weeklyRatePrice);
  if (pA > 0 && pB > 0) {
    const r = pB / pA;
    if (r < priceFloor || r > 1 / priceFloor) return -1;
  }

  // ── Gate three: the same kind of week ─────────────────────────────────
  const kA = knots(current.cruiseSpeed);
  const kB = knots(candidate.cruiseSpeed);
  if (kA && kB && Math.min(kA, kB) / Math.max(kA, kB) < SPEED_FLOOR) return -1;

  let score = 0;

  // Price, the heaviest term, because it is the one a guest is holding in
  // their head while they look at the four thumbnails.
  if (pA > 0 && pB > 0) score += 45 * closeness(pA, pB);

  // Power. Two boats at the same money and half the speed are not
  // alternatives: one is a week in the Saronic and the other is a week in
  // the Cyclades, which is the whole argument of the sample itinerary
  // sitting directly above this block.
  if (kA && kB) score += 30 * closeness(kA, kB);

  const lA = lengthM(current.length);
  const lB = lengthM(candidate.length);
  if (lA && lB) score += 15 * closeness(lA, lB);

  const gA = guestsNum(current.sleeps);
  const gB = guestsNum(candidate.sleeps);
  if (gA && gB && Math.abs(gA - gB) <= 2) score += 8;

  if (
    current.builder &&
    candidate.builder &&
    String(current.builder).toLowerCase() === String(candidate.builder).toLowerCase()
  ) {
    score += 6;
  }

  // The two fleets are a house distinction, not a guest one, so it breaks
  // ties and nothing more. It used to be worth more than everything above.
  if (
    current.fleetTier &&
    candidate.fleetTier &&
    (current.fleetTier === candidate.fleetTier ||
      current.fleetTier === "both" ||
      candidate.fleetTier === "both")
  ) {
    score += 4;
  }

  return score;
}

function rank(current, fleet, floor, threshold) {
  return fleet
    .map((y) => ({ yacht: y, score: scoreSimilarity(current, y, floor) }))
    .filter((row) => row.score >= threshold)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return priceNum(b.yacht.weeklyRatePrice) - priceNum(a.yacht.weeklyRatePrice);
    });
}

export function similarYachts(current, fleet, n = 4) {
  if (!current || !Array.isArray(fleet)) return [];

  // Half the available points. A boat through all three gates that agrees
  // on nothing else is still the wrong thing to put in front of somebody.
  const strict = rank(current, fleet, PRICE_FLOOR, 52);
  if (strict.length >= 3) return strict.slice(0, n).map((r) => r.yacht);

  const wide = rank(current, fleet, PRICE_FLOOR_WIDE, 40);
  const out = [];
  const seen = new Set();
  for (const row of [...strict, ...wide]) {
    const key = row.yacht.slug || row.yacht._id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row.yacht);
    if (out.length >= n) break;
  }
  return out;
}
