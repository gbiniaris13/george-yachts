// Section 0.7 (Roberto brief, May 2026) — Pricing display policy.
//
// Mixing Private Fleet (per yacht / week) and Explorer Fleet (per
// person / week) on the same screen without explicit unit badges
// produces UHNW visual chaos: "€420" next to "€235,000" reads like
// a 500x contradiction even though both are valid prices for very
// different products. Brand-critical.
//
// SOURCE OF TRUTH:
//   • Each yacht doc in Sanity SHOULD have `priceModel` set to
//     `"per_yacht_week"` (default for Private Fleet) or
//     `"per_person_week"` (default for Explorer Fleet).
//   • If `priceModel` is missing, we infer from `fleetTier`:
//       - "private" / "both" → per_yacht_week
//       - "explorer"         → per_person_week
//   • Front-end NEVER shows a price without a unit badge.
//
// Acceptance:
//   • `priceModel(yacht)` returns one of the two strings.
//   • `priceUnitBadge(yacht)` returns the badge text.
//   • `formatPrice(value, opts)` returns "€20,000 – €26,900" or
//     "From €4,900" depending on shape.

export const PRICE_MODEL = Object.freeze({
  PER_YACHT_WEEK: "per_yacht_week",
  PER_PERSON_WEEK: "per_person_week",
});

export const PRICE_UNIT_LABEL = Object.freeze({
  per_yacht_week: "Per Yacht · Per Week",
  per_person_week: "Per Person · Per Week",
});

/**
 * Resolve the price model for a yacht doc. Trusts the explicit
 * Sanity field if present; falls back to fleetTier-based inference.
 */
export function priceModel(yacht) {
  if (!yacht) return PRICE_MODEL.PER_YACHT_WEEK;
  const explicit = yacht.priceModel;
  if (
    explicit === PRICE_MODEL.PER_YACHT_WEEK ||
    explicit === PRICE_MODEL.PER_PERSON_WEEK
  ) {
    return explicit;
  }
  const tier = (yacht.fleetTier || "").toLowerCase();
  if (tier === "explorer") return PRICE_MODEL.PER_PERSON_WEEK;
  // "private", "both", "" all fall through to per-yacht — the safer
  // default since private yachts dominate inventory.
  return PRICE_MODEL.PER_YACHT_WEEK;
}

export function priceUnitBadge(yacht) {
  return PRICE_UNIT_LABEL[priceModel(yacht)];
}

export function isPerPerson(yacht) {
  return priceModel(yacht) === PRICE_MODEL.PER_PERSON_WEEK;
}

export function isPerYacht(yacht) {
  return priceModel(yacht) === PRICE_MODEL.PER_YACHT_WEEK;
}

/**
 * Extract a plain integer from messy price strings like
 * "€20,000 - €26,900" → 20000 (the lower bound, which is what we
 * sort on). Returns 0 when nothing parseable.
 */
export function extractLowPrice(str) {
  if (!str) return 0;
  const m = String(str).match(/[\d,.]+/);
  if (!m) return 0;
  return parseInt(m[0].replace(/[,.]/g, ""), 10) || 0;
}

/**
 * Sort comparator for the global "All Fleet" view. Brand rule:
 * Private Fleet shows first (sorted by price descending — flagship
 * leads), then Explorer Fleet (sorted by price ascending — entry
 * point first). The two tiers never alternate.
 */
export function sortAllFleet(a, b) {
  const aPP = isPerPerson(a);
  const bPP = isPerPerson(b);
  if (aPP !== bPP) return aPP ? 1 : -1; // per-yacht first
  // Within tier: per-yacht descending, per-person ascending.
  const aPrice = extractLowPrice(a.weeklyRatePrice);
  const bPrice = extractLowPrice(b.weeklyRatePrice);
  return aPP ? aPrice - bPrice : bPrice - aPrice;
}

/**
 * Render-ready unit badge color tokens — the visual hint that
 * complements the textual label. Per brief: per-yacht hover gold,
 * per-person hover white-30. Both use 1px borders so the difference
 * reads as deliberate, not accidental.
 */
export function priceCardBorderClass(yacht) {
  return isPerYacht(yacht)
    ? "border border-[#DAA520]/30 hover:border-[#DAA520]/70"
    : "border border-white/15 hover:border-white/40";
}
