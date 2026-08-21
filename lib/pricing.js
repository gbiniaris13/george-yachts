// Section 0.7 (Roberto brief, May 2026) — Pricing display policy.
//
// Mixing Private Fleet (per yacht / week) and Sailing Fleet (per
// person / week) on the same screen without explicit unit badges
// produces UHNW visual chaos: "€420" next to "€235,000" reads like
// a 500x contradiction even though both are valid prices for very
// different products. Brand-critical.
//
// SOURCE OF TRUTH:
//   • Each yacht doc in Sanity SHOULD have `priceModel` set to
//     `"per_yacht_week"` (default for Private Fleet) or
//     `"per_person_week"` (default for Sailing Fleet).
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
  // Kept so that a stale Sanity value cannot render `undefined` on a card,
  // and deliberately carrying the same text as the line above: there is one
  // price model on this site and a record that still says otherwise is a
  // record that has not been edited yet, not a second product.
  per_person_week: "Per Yacht · Per Week",
});

/**
 * Resolve the price model for a yacht doc.
 *
 * ── 2026-08-21 (section 5): there is now only one ──────────────────────
 *
 * George: "όλες οι τιμές στο site είναι per week, όχι per person".
 *
 * This function used to trust a `priceModel` field in Sanity and fall back
 * to inferring per-person for anything in the Explorer tier. Ten yacht
 * records still carry `per_person_week`, and they will keep carrying it
 * until somebody edits them in the Studio, so the field is deliberately no
 * longer read. One line here is worth more than ten Studio edits nobody can
 * enforce, and it cannot drift back.
 *
 * The important part, checked before this was written: the figure stored on
 * those ten records is the WEEKLY RATE FOR THE YACHT, not a per-person one.
 * The per-person numbers the site used to print were computed at render
 * time by dividing that figure by the number of berths. So dropping the
 * model does not misprice anything; it stops a division that should never
 * have been shown. A berth is not a thing anybody can buy: the yacht goes
 * as one yacht, and six people on an eight berth boat pay the eight berth
 * week.
 *
 * PRICE_MODEL.PER_PERSON_WEEK is kept in the enum so that nothing importing
 * it breaks, and so scripts/checkPricingCopy.mjs has something to test
 * against. It is never returned.
 */
export function priceModel(yacht) {
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
 * Extract the full {low, high} numeric EUR spread from a free-text weekly
 * rate like "€56,000 - €79,000 | plus expenses VAT & APA" -> {56000, 79000},
 * or "From €20,500 | plus VAT" -> {20500, 20500}. Only counts numbers
 * >= 1000 so trailing "VAT & APA" noise is ignored. Returns
 * {low: null, high: null} when nothing parseable.
 *
 * Single source for BOTH the per-yacht Offer (yachts/[slug]) and the
 * fleet-level AggregateOffer (charter-yacht-greece) so they agree.
 */
export function extractPriceRange(str) {
  if (!str || typeof str !== "string") return { low: null, high: null };
  const matches = str.match(/[\d][\d.,]*/g);
  if (!matches) return { low: null, high: null };
  const nums = matches
    .map((m) => parseInt(m.replace(/[.,]/g, ""), 10))
    .filter((n) => Number.isFinite(n) && n >= 1000);
  if (!nums.length) return { low: null, high: null };
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/**
 * Sort comparator for the global "All Fleet" view. Brand rule:
 * Private Fleet shows first (sorted by price descending — flagship
 * leads), then Sailing Fleet (sorted by price ascending — entry
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
    ? "border border-[#DAA110]/30 hover:border-[#DAA110]/70"
    : "border border-white/15 hover:border-white/40";
}

/**
 * Schema.org `offers` for one yacht, built from her real published rate.
 *
 * 2026-08-06 — Ahrefs flagged both fleet pages with "Missing required
 * review or aggregateRating or offers property for Product", so every
 * Product in those ItemLists now carries one.
 *
 * SHAPE, and why this exact one. The obvious answer is AggregateOffer
 * with lowPrice/highPrice, and that is what our /best-*-yachts pages
 * already emit. Search Console proves it is not enough: those pages hold
 * 27 items failing on "Either price or priceSpecification.price should be
 * specified (in offers)". Google's Product rich result wants a `price`,
 * and a band alone does not give it one. The yacht pages, which ARE
 * valid, use an Offer with price plus a UnitPriceSpecification carrying
 * the min and max. That is the shape copied here: `price` is the entry
 * rate, honest as a "from", and the full band travels alongside it.
 *
 * Rates are quoted before VAT and APA, hence valueAddedTaxIncluded false.
 *
 * Returns null when the yacht has no parseable rate; the caller should
 * then leave the Product out rather than invent a number for it.
 */
export function yachtOfferSchema(yacht, url) {
  const { low, high } = extractPriceRange(yacht?.weeklyRatePrice);
  if (!low) return null;
  return {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: String(low),
    availability: "https://schema.org/InStock",
    valueAddedTaxIncluded: false,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(low),
      priceCurrency: "EUR",
      unitText: "per week",
      referenceQuantity: { "@type": "QuantitativeValue", value: 7, unitCode: "DAY" },
      minPrice: String(low),
      ...(high && high !== low ? { maxPrice: String(high) } : {}),
    },
    ...(url ? { url } : {}),
  };
}
