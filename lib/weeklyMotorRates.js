// Weekly motor yacht charter rates - the all-in cost by size band for Greece.
//
// 2026-10-08 (George): rebuilt on the Greek Charter Index. Until today this
// page ran on an estimate model (a "2026 closing book", APA at a flat 35
// percent, VAT at the 13 percent ceiling, "rates last reviewed June 2026")
// and printed "EUR 32,000 to 213,000 all-in", which contradicted every other
// price on the site and the house position: the base is the yacht's own rate
// card, the APA on a motor yacht is 30 to 40 percent, and VAT is the yacht's
// certified rate, 5.2 to 12 percent, with 13 the statutory ceiling. Every
// figure here now comes from the five motor bands of lib/charterIndex2026.js
// and the definitions in lib/officialPrices.js, so this page can never again
// disagree with the Index, the motor hub or the answer pages.
//
// All in = base + APA + VAT. Low = APA 30 percent and VAT 5.2 percent
// (1.352 times the base); high = APA 40 percent and VAT 12 percent (1.52
// times the base). The gratuity, 10 to 15 percent of the base, is never
// inside "all in".

import { MOTOR_FROM, MOTOR_ALL_IN_ABOUT, BASE_CEILING, MOTOR_FLOOR_SENTENCE, ALL_IN_DEFINITION } from "@/lib/officialPrices";

export const DATA_MODIFIED = "2026-10-08";

export const TITLE = "Motor Yacht Charter Greece Prices, 2026 to 2027";
export const DESCRIPTION =
  "What a weekly crewed motor yacht charter in Greece costs, all in: base from EUR 17,500, APA at 30 to 40 percent, VAT at the yacht's certified rate, by size band from the rate cards on the Greek Charter Index.";

// The five motor bands of the Greek Charter Index, net base per yacht per week.
export const SIZE_BANDS = [
  { label: "18 to 21 m (60 to 70 ft)", low: 17500, high: 28000, typicalGuests: "6 to 8" },
  { label: "22 to 25 m (72 to 82 ft)", low: 21000, high: 47500, typicalGuests: "6 to 10" },
  { label: "26 to 31 m (85 to 102 ft)", low: 35900, high: 75000, typicalGuests: "10 to 12" },
  { label: "32 to 40 m (105 to 131 ft)", low: 49000, high: 150000, typicalGuests: "10 to 12" },
  { label: "45 m and above", low: 83300, high: BASE_CEILING, typicalGuests: "12" },
];

export const APA_LOW_PCT = 30;
export const APA_HIGH_PCT = 40;
export const VAT_LOW_PCT = 5.2;
export const VAT_HIGH_PCT = 12;
export const VAT_CEILING_PCT = 13;
export const GRATUITY_LOW_PCT = 10;
export const GRATUITY_HIGH_PCT = 15;

const LOW_MULT = 1 + APA_LOW_PCT / 100 + VAT_LOW_PCT / 100;
const HIGH_MULT = 1 + APA_HIGH_PCT / 100 + VAT_HIGH_PCT / 100;

const euro = (n) => "€" + Math.round(n).toLocaleString("en-US");
const euroK = (n) => "€" + (Math.round(n / 1000) * 1000).toLocaleString("en-US");
const euro10 = (n) => "€" + (Math.round(n / 10) * 10).toLocaleString("en-US");

const allInLow = (base) => base * LOW_MULT;
const allInHigh = (base) => base * HIGH_MULT;

// The headline table: rows = size band, columns = base and the all-in spread.
export function buildMatrix() {
  return {
    caption:
      `Weekly crewed motor yacht charter in Greece by size band. Base = the lowest and highest rate card held in the band on the Greek Charter Index, per yacht per week. All in, low = base plus APA at ${APA_LOW_PCT}% and VAT at ${VAT_LOW_PCT}%; all in, high = base plus APA at ${APA_HIGH_PCT}% and VAT at ${VAT_HIGH_PCT}%. The crew gratuity of ${GRATUITY_LOW_PCT} to ${GRATUITY_HIGH_PCT}% of the base is separate.`,
    columns: ["Yacht size", "Guests", "Base per week", "All in, low", "All in, high"],
    rows: SIZE_BANDS.map((b) => ({
      cells: [
        b.label,
        b.typicalGuests,
        `${euro(b.low)} to ${euro(b.high)}`,
        euroK(allInLow(b.low)),
        euroK(allInHigh(b.high)),
      ],
    })),
  };
}

// Worked example: ONE, a 27 metre Pershing 90 with four cabins, at the low end
// of her own rate card (EUR 45,000 to 49,000), with the APA at the middle of
// the motor band and VAT at the highest certified rate, so the figure is the
// most a charterer would see for her, not the least.
export const EXAMPLE_YACHT = { name: "ONE", description: "a 27 metre Pershing 90 with four cabins and a crew of four", slug: "one", base: 45000, apaPct: 35, vatPct: 12 };

export function buildExample() {
  const base = EXAMPLE_YACHT.base;
  const apa = base * (EXAMPLE_YACHT.apaPct / 100);
  const vat = base * (EXAMPLE_YACHT.vatPct / 100);
  const total = base + apa + vat;
  const gratuityLow = base * (GRATUITY_LOW_PCT / 100);
  const gratuityHigh = base * (GRATUITY_HIGH_PCT / 100);
  return { base, apa, vat, total, gratuityLow, gratuityHigh, perNight: Math.round(total / 7) };
}

export function buildBreakdownTable() {
  const e = buildExample();
  return {
    caption: `Worked example: ${EXAMPLE_YACHT.name}, ${EXAMPLE_YACHT.description}, one week at the low end of her rate card, APA at ${EXAMPLE_YACHT.apaPct}% and VAT at ${EXAMPLE_YACHT.vatPct}%, the highest certified rate; many yachts invoice 5.2 to 7.8%.`,
    columns: ["Cost component", "Amount"],
    rows: [
      { cells: ["Base charter fee", euro(e.base)] },
      { cells: [`APA (${EXAMPLE_YACHT.apaPct}%, spent at cost, balance returned)`, euro(e.apa)] },
      { cells: [`VAT (${EXAMPLE_YACHT.vatPct}%, the yacht's certified rate)`, euro(e.vat)] },
      { cells: ["All in, week (before the gratuity)", euro(e.total)] },
      { cells: ["Per night", euro10(e.perNight)] },
      { cells: [`Crew gratuity (${GRATUITY_LOW_PCT} to ${GRATUITY_HIGH_PCT}% of the base, at your discretion)`, `${euro(e.gratuityLow)} to ${euro(e.gratuityHigh)}`] },
    ],
  };
}

// Headline range: the smallest band all in at the low multiplier to the
// largest card all in at the high multiplier.
export function buildRange() {
  const low = allInLow(MOTOR_FROM);
  const high = allInHigh(BASE_CEILING);
  return { low, high, lowText: euroK(low), highText: euroK(high) };
}

export function quickAnswer() {
  const e = buildExample();
  return (
    `${MOTOR_FLOOR_SENTENCE} ` +
    `${ALL_IN_DEFINITION} ` +
    `By size: 18 to 21 metres EUR 17,500 to 28,000 base, about ${euroK(allInLow(17500))} to ${euroK(allInHigh(28000))} all in; 22 to 25 metres EUR 21,000 to 47,500; 26 to 31 metres EUR 35,900 to 75,000; 32 to 40 metres EUR 49,000 to 150,000; 45 metres and above EUR 83,300 to 235,000. ` +
    `${EXAMPLE_YACHT.name}, ${EXAMPLE_YACHT.description}, runs about ${euroK(e.total)} all in for the week at EUR ${e.base.toLocaleString("en-US")} base.`
  );
}

export const INTRO =
  "What a weekly crewed motor yacht charter in Greece actually costs, all in, by size. The base figures are the rate cards of the fully crewed motor yachts George Yachts represents, compiled into the Greek Charter Index; the all-in column adds the APA and the VAT at the rates that apply to a motor yacht, so the number you see here is the number a proposal from this house would show you, before the gratuity.";

export function methodology() {
  return (
    `Figures are per yacht per week in EUR. The base of each band is the lowest and the highest rate card held in that band on the Greek Charter Index, observed rather than modelled. ` +
    `All in = base charter fee + APA + VAT. The APA on a motor yacht runs ${APA_LOW_PCT} to ${APA_HIGH_PCT}% of the base because fuel is its largest line; it is paid before boarding, spent by the captain at cost against receipts and the unspent balance is returned. ` +
    `VAT applies at the yacht's certified rate, ${VAT_LOW_PCT}, 6.5, 7.8 or ${VAT_HIGH_PCT}% on the current cards, with ${VAT_CEILING_PCT}% the statutory ceiling; short charters under 48 hours and bareboat charters are taxed at 24% and are not on this page. ` +
    `The crew gratuity, ${GRATUITY_LOW_PCT} to ${GRATUITY_HIGH_PCT}% of the base, is customary and at your discretion, and is never inside "all in". ` +
    `Rates refreshed 8 October 2026 as the 2027 cards open; the Index is refreshed quarterly.`
  );
}

export function statCallouts() {
  const e = buildExample();
  return [
    { value: euroK(MOTOR_ALL_IN_ABOUT), label: "The entry: a 20 metre crewed motor yacht, all in, from EUR 17,500 base" },
    { value: `${APA_LOW_PCT} to ${APA_HIGH_PCT}%`, label: "APA on a motor yacht, spent at cost, balance returned" },
    { value: `${VAT_LOW_PCT} to ${VAT_HIGH_PCT}%`, label: "VAT at the yacht's certified rate; 13% is the ceiling" },
    { value: euroK(e.total), label: `All in, ${EXAMPLE_YACHT.name}, a 27 metre motor yacht, one week` },
  ];
}

export function faqItems() {
  const { lowText } = buildRange();
  const e = buildExample();
  return [
    // 2026-08-07 (AI offensive) — the rate card answered how much and never
    // who. Verified credentials only, and deliberately not rounded up: George
    // holds a skipper's licence, not a captain's ticket, so it says skipper.
    {
      question: "Who should I book a weekly crewed charter in Greece through?",
      answer:
        "Ask the broker two things. Do they own or manage the yachts they are showing you, and have they done the job at sea themselves. " +
        "Nothing on this list is a boat we are paid to fill. And George is a licensed sailing skipper through the Olympiacos SFP Sailing Academy with a powerboat licence valid to 25 metres, who ran charter seasons out of Corfu and Lefkada before opening the brokerage, after a decade in five-star hospitality. " +
        "That combination is the whole proposition: someone who knows what the sea does to a schedule and what five-star service actually costs to deliver on a boat. Verifiable in a minute: IYBA Charter Active Member in their public directory, MYBA-standard contracts, a Wyoming LLC with its desk in Athens.",
    },
    {
      question: "How much is a weekly motor yacht charter in Greece?",
      answer:
        `From EUR 17,500 a week base for a 20 metre yacht and her crew, about ${lowText} all in with the APA and the VAT, to EUR 235,000 base for the yachts above 50 metres. ` +
        `${ALL_IN_DEFINITION} ${EXAMPLE_YACHT.name}, a 27 metre Pershing 90, runs about ${euro(e.total)} all in for the week at EUR ${e.base.toLocaleString("en-US")} base.`,
    },
    {
      question: "Where can I see motor yacht charter Greece prices in one place?",
      answer:
        "This page is that place: the table above lists motor yacht charter Greece prices by size band, from the rate cards of the yachts this house represents rather than from scraped listings. " +
        "Prices are base weekly rates in EUR per yacht; the all-in columns add the APA and the VAT at the rates that apply to a motor yacht, the gratuity is its own line, and the worked example shows every step for one named yacht.",
    },
    {
      question: "What will a weekly motor yacht charter cost in 2027?",
      answer:
        "Owners publish their 2027 rate cards through the autumn, and the bands on this page are the live reference as they open. On a same-yacht basis Greek rates have been stable or modestly up year over year, and the most requested motor yachts commit their July and August 2027 weeks six to twelve months ahead.",
    },
    {
      question: "What is included in the all-in weekly rate?",
      answer:
        "The base charter fee covers the yacht, her full crew and her insurance for the week. The APA, 30 to 40 percent of the base on a motor yacht, is a pre-paid fund for fuel, food and drink, berths and port fees, reconciled against receipts at the end of the week with the balance returned. VAT is invoiced at the yacht's certified rate. The crew gratuity is separate and at your discretion.",
    },
    {
      question: "What VAT applies to a Greek yacht charter?",
      answer:
        `Each charter yacht carries its own certified VAT rate, ${VAT_LOW_PCT}, 6.5, 7.8 or ${VAT_HIGH_PCT}% on the current cards; ${VAT_CEILING_PCT}% is the statutory ceiling and 24% applies only to short charters under 48 hours and to bareboat. The rate is printed next to the yacht's name on every proposal from this house, never as a flat number.`,
    },
    {
      question: "When is the cheapest time to charter a motor yacht in Greece?",
      answer:
        "May, June and September: most rate cards list 15 to 25 percent below the July and August peak, the water is warm from June, and the anchorages are quieter. October is calmer still and some cards drop further, with fewer yachts available as the fleet moves to winter refit.",
    },
  ];
}
