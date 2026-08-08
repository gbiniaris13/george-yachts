/**
 * APA, the one place the numbers live.
 *
 * 2026-08-08. A sweep counted six different APA ranges across the site:
 * 30-35%, 25-35%, 25-30%, 25-40%, 30-40%. My first read was that this was an
 * inconsistency to be flattened into one number. George corrected that, and he
 * was right: the variation is real, and it is roughly 20% to 40% depending on
 * the yacht and the charter. He also set the standing rule that figures like
 * this come from MYBA and from international bodies, not from our own memory.
 *
 * What the research established (see SOURCES below):
 *
 *   1. THE MYBA CHARTER AGREEMENT DOES NOT PRESCRIBE A PERCENTAGE. It fixes
 *      the mechanism: an Advance Provisioning Allowance is paid to the yacht,
 *      held and spent by the captain against receipts, and the unused balance
 *      returns to the charterer. The amount itself is agreed between the
 *      parties and written into the contract for that charter.
 *
 *   2. THE PERCENTAGE TRACKS FUEL BURN. Sailing yachts and catamarans sit at
 *      the lower end, motor yachts at the upper, because fuel is the single
 *      largest variable line in the account.
 *
 *   3. ITINERARY AND GUEST PREFERENCE MOVE IT TOO. A week at anchor in the
 *      Ionian and a week of marina berths across the Cyclades do not carry
 *      the same float, on the same yacht.
 *
 * This is a better answer than any single number, and it is the answer a real
 * broker gives. Quote the RULE first and the band second, never a bare figure
 * presented as "the standard rate", which is what the APA pillar used to say.
 */

export const APA = {
  // The honest full span across yacht types. Never narrow this without a source.
  minPct: 20,
  maxPct: 40,

  // By yacht type, which is the only reason the number moves predictably.
  byType: {
    sailing: { low: 20, high: 30, why: "Least fuel of any format; the account is mostly provisioning and berths." },
    catamaran: { low: 25, high: 35, why: "More space and more guests than a monohull of the same length, so provisioning rises before fuel does." },
    motor: { low: 30, high: 40, why: "Fuel dominates. A 30m motor yacht can burn EUR 10,000 to 15,000 of diesel in a week." },
  },

  // The sentence to reach for when a page needs one line rather than a table.
  rule:
    "The MYBA contract sets how the APA works, not what it costs: the amount is agreed between the parties and written into your contract. In practice it runs from about 20% of the base on a sailing yacht to about 40% on a motor yacht, because the number tracks fuel burn more than anything else, and a week of marina berths carries a larger float than a week at anchor.",

  // What the float is actually spent on, in the order it usually lands.
  covers: [
    "Fuel for the yacht and her tender",
    "Provisioning: food, soft drinks, wine and spirits to your brief",
    "Berthing and port fees at every stop away from the base marina",
    "Harbour dues, agent fees and any cruising permits along the route",
    "Laundry, ice, water and the running supplies of the week",
  ],

  // What it is NOT, which is where most misunderstandings live.
  excludes: [
    "The crew gratuity, which is separate, customary at 10 to 15% and calculated on the base fee alone",
    "Greek VAT on the charter fee, charged at the yacht's certified rate",
    "Anything you arrange ashore yourself: restaurants, guides, private transfers, hotels",
  ],

  // 2026-08-08 research. Kept in code so the next person can check rather than
  // trust. MYBA's own site publishes the agreement to members; the ranges below
  // are the market convention reported consistently across the industry.
  SOURCES: [
    "MYBA, the Worldwide Yachting Association: myba-association.com (the MYBA Charter Agreement fixes the APA mechanism, not a percentage)",
    "Advance provisioning allowance, Wikipedia: en.wikipedia.org/wiki/Advance_provisioning_allowance",
    "Industry convention as reported across charter brokers, 2026: sailing yachts and catamarans at the lower end, motor yachts 30 to 40%",
  ],
};

/** One line, correct, for any page that needs to state the rule quickly. */
export function apaRule() {
  return APA.rule;
}

/** The band for a given yacht type, phrased for prose. */
export function apaBand(type) {
  const t = APA.byType[type];
  if (!t) return `${APA.minPct} to ${APA.maxPct}%`;
  return `${t.low} to ${t.high}%`;
}
