// E4 — Similar yacht recommendations (algorithmic, no LLM).
//
// Given a "current" yacht and the full fleet, score every other yacht
// on how similar it is, then return the top N. Designed to surface
// rooms-to-upgrade (same builder, slightly bigger) and smart alternates
// (same fleet tier, similar price band) without an API call.
//
// Signals (weighted):
//   • Same fleetTier (private / explorer / both)      +60
//   • Same category (motor / sailing / catamaran)     +45
//   • Same builder                                    +35
//   • Length within ±20 %                              +25  (proportional)
//   • Guest capacity within ±2                         +15
//   • Price within ±30 %                              +20  (proportional)
//   • Shared cruising region words                     +10  (per match)
//
// A yacht never recommends itself. Ties broken by price (descending)
// so the nicer alternate shows first.

function priceNum(priceStr) {
  if (!priceStr) return 0;
  const m = String(priceStr).match(/[\d,]+/);
  if (!m) return 0;
  return parseInt(m[0].replace(/,/g, ""));
}

function lengthM(len) {
  if (!len) return 0;
  const m = String(len).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function guestsNum(g) {
  if (!g) return 0;
  const m = String(g).match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

function normaliseCategory(yacht) {
  if (!yacht) return "";
  const name = String(yacht.subtitle || yacht.name || "").toLowerCase();
  if (name.includes("catamaran")) return "catamaran";
  if (name.includes("sailing") || name.includes("sail")) return "sailing";
  if (name.includes("motor")) return "motor";
  return "";
}

function regionTokens(yacht) {
  if (!yacht?.cruisingRegion) return [];
  return String(yacht.cruisingRegion)
    .toLowerCase()
    .split(/[,\s·&]+/)
    .filter(Boolean);
}

export function scoreSimilarity(current, candidate) {
  if (!current || !candidate) return 0;
  if (current._id && candidate._id && current._id === candidate._id) return -1;
  if (
    current.slug &&
    candidate.slug &&
    current.slug === candidate.slug
  )
    return -1;

  let score = 0;

  if (
    current.fleetTier &&
    candidate.fleetTier &&
    (current.fleetTier === candidate.fleetTier ||
      current.fleetTier === "both" ||
      candidate.fleetTier === "both")
  ) {
    score += 60;
  }

  const catA = normaliseCategory(current);
  const catB = normaliseCategory(candidate);
  if (catA && catA === catB) score += 45;

  if (
    current.builder &&
    candidate.builder &&
    String(current.builder).toLowerCase() ===
      String(candidate.builder).toLowerCase()
  ) {
    score += 35;
  }

  const lenA = lengthM(current.length);
  const lenB = lengthM(candidate.length);
  if (lenA > 0 && lenB > 0) {
    const ratio = Math.min(lenA, lenB) / Math.max(lenA, lenB);
    if (ratio >= 0.8) score += Math.round(25 * ratio);
  }

  const gA = guestsNum(current.sleeps);
  const gB = guestsNum(candidate.sleeps);
  if (gA && gB && Math.abs(gA - gB) <= 2) score += 15;

  const pA = priceNum(current.weeklyRatePrice);
  const pB = priceNum(candidate.weeklyRatePrice);
  if (pA > 0 && pB > 0) {
    const ratio = Math.min(pA, pB) / Math.max(pA, pB);
    if (ratio >= 0.7) score += Math.round(20 * ratio);
  }

  const rA = new Set(regionTokens(current));
  const rB = regionTokens(candidate);
  const shared = rB.filter((t) => rA.has(t)).length;
  score += Math.min(shared, 3) * 10;

  return score;
}

export function similarYachts(current, fleet, n = 4) {
  if (!current || !Array.isArray(fleet)) return [];
  return fleet
    .map((y) => ({ yacht: y, score: scoreSimilarity(current, y) }))
    .filter((row) => row.score > 30) // must share at least a meaningful signal
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return priceNum(b.yacht.weeklyRatePrice) - priceNum(a.yacht.weeklyRatePrice);
    })
    .slice(0, n)
    .map((row) => row.yacht);
}
