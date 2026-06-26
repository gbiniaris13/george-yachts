// Weekly motor yacht charter rates - the all-in cost matrix for Greece.
//
// 2026-06-26. The site's "weekly motor rates" data weapon: a real, crawlable
// HTML <table> of all-in weekly cost by yacht size band x season, computed
// from the SAME rate model the live calculators use (lib/charterCostData.js -
// George Yachts' 2026 closing book + IYBA pricing surveys), so these figures
// can never disagree with the estimator. Numbers are indicative market
// estimates for crewed motor yachts in Greek waters (flagged est.), never a
// quote for a specific yacht and never fabricated.
//
// Distinct from the Greek Charter Index (type x region, net base only): this
// is the all-in RATE CARD - what a charterer actually pays, by size and month.

import {
  estimateCharterCost,
  APA_RATE,
  VAT_RATE,
  GRATUITY_RATE,
} from "@/lib/charterCostData";

export const DATA_MODIFIED = "2026-06-26";

export const TITLE = "Weekly Yacht Charter Rates in Greece (2026)";
export const DESCRIPTION =
  "What a weekly motor yacht charter in Greece really costs, all-in: base fee, APA, VAT and gratuity by yacht size and season. Original George Yachts rate data.";

// Size bands map to a representative length and motor build tier. Larger motor
// yachts are predominantly premium / custom builds, so the per-metre rate steps
// up with size (mirrors lib/charterCostData.js YACHT_TYPES).
export const SIZE_BANDS = [
  { label: "Up to 25m", metres: 22, typeSlug: "motor-yacht", typicalGuests: 8 },
  { label: "25-30m", metres: 28, typeSlug: "motor-yacht-premium", typicalGuests: 10 },
  { label: "30-40m", metres: 35, typeSlug: "motor-yacht-premium", typicalGuests: 12 },
  { label: "40m+", metres: 45, typeSlug: "superyacht", typicalGuests: 12 },
];

// Calendar months mapped onto the charterCostData season model.
export const RATE_MONTHS = [
  { label: "May", seasonSlug: "shoulder" },
  { label: "June", seasonSlug: "high" },
  { label: "Jul-Aug", seasonSlug: "peak" },
  { label: "Sept", seasonSlug: "high" },
  { label: "Oct", seasonSlug: "off" },
];

// VAT / APA / gratuity percentages surfaced for copy, sourced from the same
// constants the estimator uses (so the page text can never drift from the math).
export const VAT_PCT = Math.round(VAT_RATE * 100);
export const APA_PCT = Math.round(APA_RATE * 100);
export const GRATUITY_PCT = Math.round(GRATUITY_RATE * 1000) / 10;

const euro = (n) => "€" + Math.round(n).toLocaleString("en-US");
const euroK = (n) => "€" + (Math.round(n / 1000) * 1000).toLocaleString("en-US");
const euro10 = (n) => "€" + (Math.round(n / 10) * 10).toLocaleString("en-US");

function totalFor(typeSlug, metres, seasonSlug) {
  const r = estimateCharterCost({ yachtTypeSlug: typeSlug, lengthMetres: metres, seasonSlug, weeks: 1 });
  return r ? r.total : null;
}

// The headline matrix: rows = size band, columns = season, cells = all-in / week.
export function buildMatrix() {
  return {
    caption:
      `Indicative all-in weekly cost (est.), crewed motor yacht, Greek waters. All-in = base charter fee + APA provisioning (${APA_PCT}%) + VAT (${VAT_PCT}%) + suggested crew gratuity (${GRATUITY_PCT}%). Each band shown at a representative length and build tier.`,
    columns: ["Yacht size", ...RATE_MONTHS.map((m) => m.label)],
    rows: SIZE_BANDS.map((b) => ({
      cells: [
        b.label,
        ...RATE_MONTHS.map((m) => {
          const t = totalFor(b.typeSlug, b.metres, m.seasonSlug);
          return t ? euroK(t) : "On request";
        }),
      ],
    })),
  };
}

// Worked example: a 30m motor yacht in peak season, broken down so the all-in
// math is fully transparent and machine-extractable.
export function buildExample() {
  const r = estimateCharterCost({ yachtTypeSlug: "motor-yacht-premium", lengthMetres: 30, seasonSlug: "peak", weeks: 1 });
  return {
    base: r.base,
    apa: r.apa,
    vat: r.vat,
    gratuity: r.gratuity,
    total: r.total,
    perNight: Math.round(r.total / 7),
    perPerson6: Math.round(r.total / 6),
    perPerson4: Math.round(r.total / 4),
  };
}

export function buildBreakdownTable() {
  const e = buildExample();
  return {
    caption: "Worked example: a 30m crewed motor yacht, one peak-season week (est.).",
    columns: ["Cost component", "Amount"],
    rows: [
      { cells: ["Base charter fee", euro(e.base)] },
      { cells: [`APA provisioning (${APA_PCT}%)`, euro(e.apa)] },
      { cells: [`VAT (${VAT_PCT}%)`, euro(e.vat)] },
      { cells: [`Suggested crew gratuity (${GRATUITY_PCT}%)`, euro(e.gratuity)] },
      { cells: ["All-in total, week", euro(e.total)] },
      { cells: ["Per night", euro10(e.perNight)] },
      { cells: ["Per guest (6 guests)", euro10(e.perPerson6)] },
      { cells: ["Per guest (4 guests)", euro10(e.perPerson4)] },
    ],
  };
}

// Headline range: smallest band in the cheapest month to the largest band at peak.
export function buildRange() {
  const low = totalFor(SIZE_BANDS[0].typeSlug, SIZE_BANDS[0].metres, "off");
  const high = totalFor(SIZE_BANDS[SIZE_BANDS.length - 1].typeSlug, SIZE_BANDS[SIZE_BANDS.length - 1].metres, "peak");
  return { low, high, lowText: euroK(low), highText: euroK(high) };
}

// October (off-peak) vs peak saving on the same yacht.
export function offPeakSavingPct() {
  const peak = totalFor("motor-yacht-premium", 30, "peak");
  const off = totalFor("motor-yacht-premium", 30, "off");
  return Math.round((1 - off / peak) * 100);
}

export function quickAnswer() {
  const { lowText, highText } = buildRange();
  const e = buildExample();
  return (
    `A weekly motor yacht charter in Greece costs roughly ${lowText} to ${highText}+ all-in, depending on size and season. ` +
    `All-in covers the base fee, APA provisioning (${APA_PCT}%), ${VAT_PCT}% VAT and crew gratuity (${GRATUITY_PCT}%). ` +
    `A typical 30m motor yacht runs about ${euroK(e.total)} all-in for a peak-season week, or around ${euro10(e.perPerson6)} per guest at six.`
  );
}

export const INTRO =
  "This is the number most brokers will not publish: what a weekly motor yacht charter in Greece actually costs, all-in, by size and season. The figures below are George Yachts' own rate data, the same model behind our cost calculators, shown as a clean rate card so you can budget before you ever pick up the phone.";

export function methodology() {
  return (
    `Figures are indicative all-in estimates for crewed motor yacht charters in Greek waters, drawn from the George Yachts rate model (2026 closing book and IYBA pricing surveys), not quotes for a specific yacht. ` +
    `Each size band is shown at a representative length and build tier; premium and custom builds sit higher, and 40m+ is shown at a representative 45m. ` +
    `All-in = base charter fee + APA provisioning (${APA_PCT}%) + VAT (${VAT_PCT}%) + suggested crew gratuity (${GRATUITY_PCT}%). ` +
    `VAT follows the 2026 Greek regime: a reduced ${VAT_PCT}% on commercial charters over 48 hours (every weekly charter qualifies), reducing to an effective 12% when at least 60% of charter time is spent outside Greek territorial waters; short charters under 48 hours are taxed at 24%. ` +
    `Rates last reviewed June 2026.`
  );
}

export function statCallouts() {
  const e = buildExample();
  return [
    { value: euro(e.total), label: "Typical 30m motor yacht, all-in peak-season week (est.)" },
    { value: `${VAT_PCT}%`, label: "Reduced VAT on Greek commercial charters over 48 hours" },
    { value: `~${offPeakSavingPct()}%`, label: "Lower on the same yacht in October versus peak season" },
    { value: euro10(e.perPerson6), label: "Per guest at six, 30m motor yacht, peak-season week" },
  ];
}

export function faqItems() {
  const { lowText, highText } = buildRange();
  const e = buildExample();
  return [
    {
      question: "How much is a weekly motor yacht charter in Greece?",
      answer:
        `A weekly motor yacht charter in Greece runs from roughly ${lowText} all-in for a yacht up to 25m in the off-peak shoulder months to over ${highText} for a 40m+ motor yacht in peak season (mid-July to August). ` +
        `All-in means the base charter fee plus APA provisioning (~${APA_PCT}%), VAT at ${VAT_PCT}% and a suggested crew gratuity (~${GRATUITY_PCT}%). A 30m motor yacht in peak season is about ${euro(e.total)} all-in for the week.`,
    },
    {
      question: "What is included in the all-in weekly rate?",
      answer:
        "The base charter fee covers the yacht, its full crew and insurance. APA (Advance Provisioning Allowance, around a third of the base) is a pre-paid fund for fuel, food and drink, berths and incidentals, reconciled against actual spend at the end. VAT and a discretionary crew gratuity complete the all-in figure. Personal extras ashore are separate.",
    },
    {
      question: `What VAT applies to a Greek yacht charter in 2026?`,
      answer:
        `Under the 2026 Greek regime, commercial yacht charters longer than 48 hours carry a reduced ${VAT_PCT}% VAT, so every weekly charter qualifies for the ${VAT_PCT}% rate. The rate halves to an effective 12% when the yacht spends at least 60% of charter time outside Greek territorial waters, while short charters under 48 hours or static stays are taxed at the standard 24%.`,
    },
    {
      question: "How much is a motor yacht charter per person?",
      answer:
        `On a 30m motor yacht in peak season (about ${euro(e.total)} all-in for the week), the cost works out to roughly ${euro10(e.perPerson6)} per guest at six guests, or about ${euro10(e.perPerson4)} per guest at four. Smaller yachts and the shoulder or off-peak months bring the per-guest figure down considerably.`,
    },
    {
      question: "When is the cheapest time to charter a motor yacht in Greece?",
      answer:
        `October (off-peak) and May (shoulder) are the best value: the same motor yacht costs around ${offPeakSavingPct()}% less in October than in peak July-August, with water still warm enough to swim and far quieter anchorages. June and early-to-mid September offer near-peak weather at high-season rates roughly 15% below peak.`,
    },
  ];
}
