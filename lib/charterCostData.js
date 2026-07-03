// Charter Cost Estimator data tables.
// 2026-05-11 (Phase 7 Round 9). Linkable-asset tool that gives
// charterers an honest all-in cost estimate before they call a
// broker. Built from George's 2026 closing book + IYBA pricing
// surveys — these are real market rates, not made-up numbers.
//
// Base rates are €/metre/week for PEAK season (mid-July through
// end-August). Multiply by length, then by season multiplier.
// Output is base; APA, VAT, and gratuity are added separately.

export const YACHT_TYPES = [
  {
    slug: "motor-yacht",
    label: "Motor yacht",
    perMetrePerWeek: 1800,
    description: "Mid-range motor yachts (Princess, Azimut, Ferretti, Sunseeker).",
  },
  {
    slug: "motor-yacht-premium",
    label: "Motor yacht (premium)",
    perMetrePerWeek: 2400,
    description: "Premium motor yachts (Heesen, Benetti, Custom Line, Pershing).",
  },
  {
    slug: "sailing-yacht",
    label: "Sailing yacht",
    perMetrePerWeek: 900,
    description: "Crewed sailing yachts (Beneteau, Jeanneau, Hanse, Bavaria).",
  },
  {
    slug: "sailing-yacht-luxury",
    label: "Sailing yacht (luxury)",
    perMetrePerWeek: 1500,
    description: "Luxury sailing yachts (Oyster, Nautor's Swan, Wally).",
  },
  {
    slug: "catamaran",
    label: "Catamaran",
    perMetrePerWeek: 1400,
    description: "Cruising catamarans (Lagoon, Fountaine Pajot, Bali, Leopard).",
  },
  {
    slug: "power-catamaran",
    label: "Power catamaran",
    perMetrePerWeek: 1700,
    description: "Power catamarans (Lagoon Sixty 7, Aquila, Sunreef Power).",
  },
  {
    slug: "gulet",
    label: "Gulet",
    perMetrePerWeek: 1200,
    description: "Traditional Turkish-style wooden gulets (typically 25-40m).",
  },
  {
    slug: "superyacht",
    label: "Superyacht (40m+)",
    perMetrePerWeek: 3200,
    description: "Large superyachts 40-70m (Feadship, Lürssen, Benetti Vivace).",
  },
];

// Season multipliers — applied to peak base rate. Reflects how
// charter rates actually move across the Greek summer calendar.
export const SEASONS = [
  {
    slug: "peak",
    label: "Peak (15 Jul - 31 Aug)",
    multiplier: 1.0,
    description: "Mid-July through end-August. Highest demand, highest rates.",
  },
  {
    slug: "high",
    label: "High (15 Jun - 14 Jul, 1-15 Sep)",
    multiplier: 0.85,
    description: "Just-before and just-after peak. Same weather, 15% lower rates.",
  },
  {
    slug: "shoulder",
    label: "Shoulder (May, 1-14 Jun, 16-30 Sep)",
    multiplier: 0.7,
    description: "Excellent value. Water warm enough, anchorages quieter.",
  },
  {
    slug: "off",
    label: "Off-peak (Apr, Oct)",
    multiplier: 0.55,
    description: "Cooler water, unpredictable weather, materially lower rates.",
  },
];

// Yacht length bands — to surface realistic group-size guidance.
export const LENGTH_BANDS = [
  { metres: 12, label: "12m (small sailing/cat)", typicalGuests: 6 },
  { metres: 15, label: "15m", typicalGuests: 6 },
  { metres: 18, label: "18m", typicalGuests: 8 },
  { metres: 22, label: "22m", typicalGuests: 8 },
  { metres: 26, label: "26m", typicalGuests: 10 },
  { metres: 30, label: "30m", typicalGuests: 10 },
  { metres: 35, label: "35m", typicalGuests: 12 },
  { metres: 40, label: "40m (superyacht)", typicalGuests: 12 },
  { metres: 50, label: "50m (superyacht)", typicalGuests: 12 },
  { metres: 60, label: "60m+ (superyacht)", typicalGuests: 12 },
];

// Constants for the all-in calculation.
export const APA_RATE = 0.33; // 30-35% standard, 33% midpoint
// 2026-07-03 — VAT_RATE stays at the statutory 13% CEILING so estimates
// never understate. Real 2026 rate sheets invoice weekly charters at
// 5.2/6.5/7.8/12% by the yacht's certification (verified against George's
// own Helm proposals); UI copy says "estimated at the ceiling".
// Older note (2026-06-28): 13% statutory (Law 5073/2023 + AADE Circular
// E.2006/2026): the reduced rate on commercial crewed charters over 48
// hours, which every weekly charter is. Short charters (<48h), static
// charters, and bareboat (no crew) are taxed at 24%. The old "effective
// 12% for time outside EU waters" regime was abolished from Jan 2020, so
// 13% is the correct flat default for a weekly charter. Aligns this model
// with /tools/charter-cost-calculator and /weekly-yacht-charter-rates-greece.
export const VAT_RATE = 0.13;
export const GRATUITY_RATE = 0.175; // 15-20% standard, 17.5% midpoint

export function estimateCharterCost({ yachtTypeSlug, lengthMetres, seasonSlug, weeks = 1 }) {
  const type = YACHT_TYPES.find((t) => t.slug === yachtTypeSlug);
  const season = SEASONS.find((s) => s.slug === seasonSlug);
  if (!type || !season || !lengthMetres) return null;

  const base = Math.round(type.perMetrePerWeek * lengthMetres * season.multiplier) * weeks;
  const apa = Math.round(base * APA_RATE);
  const vat = Math.round(base * VAT_RATE);
  const gratuity = Math.round(base * GRATUITY_RATE);
  const total = base + apa + vat + gratuity;

  return {
    base,
    apa,
    vat,
    gratuity,
    total,
    perDayTotal: Math.round(total / (weeks * 7)),
    yachtType: type,
    season,
    lengthMetres,
    weeks,
  };
}
