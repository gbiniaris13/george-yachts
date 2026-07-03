// Weekly motor yacht charter Greece - the pillar/hub page content.
//
// 2026-06-26. The wedge page for the query "weekly motor yacht charter Greece".
// It does NOT re-target the head term "motor yacht charter Greece" (owned by
// /motor-yacht-charter-greece) - its angle is the WEEKLY / 7-night all-in unit,
// and it hubs the whole motor cluster (type page, speed page, city combos,
// Saronic, motor-vs-sail, 7-day routes, the rate card). Cost figures are
// imported from lib/weeklyMotorRates so they can never drift from the rate card.

import { buildRange, buildExample } from "@/lib/weeklyMotorRates";

export const SLUG = "weekly-motor-yacht-charter-greece";
export const DATE_PUBLISHED = "2026-06-26";
export const DATA_MODIFIED = "2026-06-26";

export const TITLE = "Weekly Motor Yacht Charter Greece";
export const DESCRIPTION =
  "A weekly (7-night) crewed motor yacht charter in Greece: real all-in cost by size and season, what is included, where to embark, and a sample 7-day route. George Yachts.";

const euro = (n) => "€" + Math.round(n).toLocaleString("en-US");
const euroK = (n) => "€" + (Math.round(n / 1000) * 1000).toLocaleString("en-US");

export function quickAnswer() {
  const { lowText, highText } = buildRange();
  const e = buildExample();
  return (
    "A weekly motor yacht charter in Greece is seven nights aboard a fully crewed motor yacht, the standard charter unit in Greek waters. " +
    `All-in cost runs roughly ${lowText} to ${highText}+ depending on size and season, covering the yacht, crew, APA provisioning, VAT at the statutory ceiling and a suggested gratuity. ` +
    `A typical 30m motor yacht is about ${euroK(e.total)} for the week. Most charters embark from Athens or Mykonos.`
  );
}

// Each section is a question-style H2 with a self-contained 40-60 word answer
// (the format AI Overviews and Perplexity extract from). Some carry extra body.
export function sections() {
  const { lowText, highText } = buildRange();
  const e = buildExample();
  return [
    {
      q: "What does a weekly motor yacht charter in Greece cost?",
      a:
        `A weekly motor yacht charter starts around ${lowText} all-in for a yacht up to 25m in the shoulder months and climbs past ${highText} for a 40m-plus yacht in peak season. ` +
        `A typical 30m motor yacht is about ${euroK(e.total)} all-in for the week, roughly ${euro(Math.round(e.perPerson6 / 10) * 10)} per guest at six. All-in covers base fee, APA, VAT at the statutory ceiling and gratuity.`,
      link: { href: "/weekly-yacht-charter-rates-greece", label: "See the full size-by-season rate card" },
    },
    {
      q: "What is included, and what is extra (APA, VAT, gratuity)?",
      a:
        "The base charter fee covers the yacht, its full professional crew and insurance. APA (Advance Provisioning Allowance, around a third of the base) is a pre-paid fund for fuel, food and drink, berths and incidentals, reconciled against actual spend at week's end. Greek VAT at the yacht's certified rate (most motor yachts invoice 6.5% or 12%; the estimates here use the statutory 13% ceiling) and a discretionary crew gratuity complete the all-in figure; personal spend ashore is separate.",
      link: { href: "/whats-included-in-greek-yacht-charter-complete-2026-guide", label: "What is included, in full" },
    },
    {
      q: "Why a motor yacht rather than a catamaran or sailing yacht in Greek waters?",
      a:
        "A motor yacht gives you speed and range to stay ahead of the summer meltemi and reach more islands in a week, the stability and generator power for full air-conditioning and water toys, and a schedule that does not depend on the wind. The trade-off is higher fuel and APA, which the rate card prices in honestly.",
      link: { href: "/motor-vs-sailing-yacht-charter-greece", label: "Motor versus sailing, compared" },
    },
    {
      q: "Where do you embark on a weekly motor yacht charter?",
      a:
        "Most weeks start from Athens (the Alimos and Lavrio marinas) for the Cyclades and Saronic, or from Mykonos for a flying start in the central Cyclades. The Ionian runs from Corfu or Lefkada, and the Dodecanese from Rhodes or Kos. Your embarkation port shapes the whole route, so it is the first decision to make.",
      link: { href: "/motor-yacht-charter-athens", label: "Embark from Athens" },
    },
    {
      q: "What does a sample 7-day motor yacht route look like?",
      a:
        "A classic Athens-to-Cyclades motor week balances marquee islands with quiet anchorages, using the yacht's speed to island-hop without long passages. A 30-knot-plus motor yacht covers the same ground a sailing yacht needs ten days for, leaving more time at anchor. One well-paced version runs as follows.",
      route: [
        { day: "Day 1", title: "Athens to Kea (Tzia)", body: "Board in the afternoon at Alimos or Lavrio, then a short hop to Kea for a calm first night and dinner at Vourkari." },
        { day: "Day 2", title: "Kea to Mykonos", body: "A fast morning passage to Mykonos. Afternoon in the old town, dinner aboard, optional night ashore." },
        { day: "Day 3", title: "Delos and Rhenia", body: "Morning at the archaeological island of Delos, then swimming and lunch in the turquoise bays of uninhabited Rhenia." },
        { day: "Day 4", title: "Paros and Antiparos", body: "Cruise south to Paros for Naoussa, then the Blue Lagoon off Antiparos for a swim stop." },
        { day: "Day 5", title: "Naxos", body: "The largest Cycladic island: mountain villages, long beaches, and the Portara at sunset." },
        { day: "Day 6", title: "Small Cyclades to Ios", body: "Anchor off Koufonisia or Schinoussa for the clearest water of the week, then on to Ios." },
        { day: "Day 7", title: "Return toward Athens", body: "An early passage back via Kythnos or Serifos, with a final lunch at anchor before disembarkation." },
      ],
      link: { href: "/yacht-itineraries-greece", label: "More Greek yacht itineraries" },
    },
    {
      q: "When should you book a weekly motor yacht for the 2027 season?",
      a:
        "The best motor yachts for summer 2027 are reserved from autumn through late winter, before the January-to-March booking wave. After a softer 2026 motor season, demand is expected to return in force, so the prime yachts and peak weeks will go early. Booking in the off-season also secures shoulder-month value.",
      link: { href: "/greek-charter-index-2026", label: "Greek Charter Index 2026" },
    },
  ];
}

export function faqItems() {
  // The question H2s double as the FAQPage entries (real Q&As, AI-extractable).
  return sections()
    .filter((s) => !s.route) // the sample-route section is narrative, not a clean Q&A
    .map((s) => ({ question: s.q, answer: s.a }));
}

// Hub links - the spoke cluster this pillar points down to.
export const HUB_LINKS = [
  { href: "/weekly-yacht-charter-rates-greece", label: "Weekly charter rate card", blurb: "All-in cost by size and season." },
  { href: "/motor-yacht-charter-greece", label: "Motor yacht charter Greece", blurb: "The fleet, builders and the full picture." },
  { href: "/best-motor-yachts-greece-speed", label: "Fastest motor yachts", blurb: "Planing-hull yachts for range and speed." },
  { href: "/motor-yacht-charter-mykonos", label: "Motor yacht charter Mykonos", blurb: "A central-Cyclades start." },
  { href: "/motor-yacht-charter-saronic-gulf", label: "Motor yacht charter Saronic Gulf", blurb: "Short hops near Athens: Hydra, Spetses." },
  { href: "/charter-cost-estimator", label: "Charter cost estimator", blurb: "Run your own all-in figure." },
];
