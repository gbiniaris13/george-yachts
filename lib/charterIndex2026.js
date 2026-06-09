// lib/charterIndex2026.js
//
// George Yachts Greek Charter Index 2026 - original market data, presented as
// George Yachts' own compiled intelligence. NO external sources or competitor
// names are referenced (Boss directive 2026-06-09): the figures are framed as
// our Index, compiled from MYBA / central-agency rate cards and our own
// booking + quotation data across the 2025-2026 seasons.
//
// All prices are NET BASE charter fee, EUR per week, excluding VAT (5.2-13%
// for Greek-licensed yachts) and APA (25-40%). "(est.)" marks figures
// extrapolated from fleet-wide ranges + regional positioning where direct
// crewed-rate-card data is thin (Greek operators quote one Greece-wide base
// rate per vessel; the same yacht repositions across regions).
//
// This is the page's default data source. A Sanity `dataReport` document with
// slug "greek-charter-index-2026" overrides it when published, so future
// quarterly refreshes can move to the Studio without a code change. Bump
// `dataModified` each refresh (drives schema dateModified + the visible date).

export const CHARTER_INDEX_2026 = {
  title: "George Yachts Greek Charter Index 2026",
  edition: "2026",
  dataModified: "2026-06-09",
  publishedAt: "2026-06-09",

  intro:
    "Original George Yachts market data on crewed yacht charter in Greek waters for 2026. A crewed sailing catamaran for up to 12 guests runs roughly EUR 15,000 to 40,000 per week net base in peak season; crewed motor yachts of 24 to 34m around EUR 30,000 to 100,000; 35 to 49m about EUR 100,000 to 350,000; and 50m-plus superyachts from EUR 250,000 to over one million. The Cyclades command the top of each band, the Ionian and Saronic are the best value, and the Dodecanese is the thinnest crewed market.",

  summaryTable: {
    caption:
      "Indicative weekly net base charter fee by yacht type and region (EUR, excluding VAT and APA), 2026 peak season.",
    columns: ["Yacht type", "Cyclades", "Ionian", "Saronic", "Dodecanese"],
    rows: [
      { cells: ["Sailing catamaran (12 guests)", "20,000-40,000 (est.)", "15,000-30,000 (est.)", "15,000-28,000 (est.)", "18,000-35,000 (est.)"] },
      { cells: ["Motor yacht 24-34m", "35,000-100,000", "30,000-80,000 (est.)", "30,000-85,000 (est.)", "46,000+ (est.)"] },
      { cells: ["Motor yacht 35-49m", "100,000-350,000", "90,000-300,000 (est.)", "90,000-300,000 (est.)", "100,000+ (est.)"] },
      { cells: ["Superyacht 50m+", "250,000-1m+", "185,000-1m+", "250,000-1m+ (est.)", "from 46,000 to 1m+"] },
      { cells: ["Gulet (crewed, 6-12 guests)", "9,500-44,500", "9,500-44,500", "9,500-44,500", "9,500-44,500"] },
      { cells: ["Sailing monohull (crewed)", "from 11,000", "from 11,000", "from 11,000", "from 11,000"] },
    ],
  },

  statCallouts: [
    { value: "EUR 15,000-40,000", label: "weekly net base for a crewed sailing catamaran (12 guests), 2026 peak season" },
    { value: "~30%", label: "of Mediterranean summer charter bookings are in Greek waters, the single most popular charter destination" },
    { value: "6-12 months", label: "typical booking lead time for peak July to August weeks; premium 40m-plus yachts a year or more ahead" },
    { value: "Mykonos & Santorini", label: "lead 2026 demand, with Milos the fastest-rising island" },
  ],

  sections: [
    {
      heading: "Prices by region: what actually drives the difference",
      body:
        "A crewed yacht's base rate attaches to the vessel, not the region. The Cyclades sit at the top of each band because demand and the Meltemi wind favour larger, faster, more powerful yachts. The Ionian and the Saronic Gulf are the best value: calmer seas, proximity to Athens (little or no repositioning cost) and ideal conditions for catamarans. The Dodecanese is the thinnest crewed market, so most yachts are repositioned from Athens at added cost, which lifts entry pricing and thins availability.",
      table: null,
    },
    {
      heading: "Booking lead time by season",
      body:
        "Peak weeks book first, and the best yachts go a year out. If your dates are fixed to school-holiday August, treat any available premium yacht as a same-week decision.",
      table: {
        columns: ["Season", "Recommended lead time"],
        rows: [
          { cells: ["July to August (peak)", "6 to 12 months; premium 40m+ yachts a year or more ahead"] },
          { cells: ["June to early July", "4 to 6 months for most vessels"] },
          { cells: ["May, late September to October (shoulder)", "3 to 4 months; 15 to 25% below peak pricing"] },
        ],
      },
    },
    {
      heading: "Most in-demand islands, 2026",
      body:
        "Demand is broadening from the two icons into a confident second tier, and the Ionian is the structurally rising cruising ground for 2026.",
      table: {
        columns: ["Rank", "Island", "Why it is in demand"],
        rows: [
          { cells: ["1", "Mykonos (Cyclades)", "Beach clubs, nightlife, the A-list draw"] },
          { cells: ["2", "Santorini (Cyclades)", "Caldera and sunset icon"] },
          { cells: ["3", "Milos (Cyclades)", "Fastest-rising; Kleftiko and Sarakiniko, a superyacht favourite"] },
          { cells: ["4", "Paros (Cyclades)", "The sophisticated alternative to Mykonos, rising with younger UHNW clients"] },
          { cells: ["5", "Hydra (Saronic)", "Car-free, artistic, easy from Athens"] },
          { cells: ["6", "Corfu and Lefkada (Ionian)", "Sheltered from the Meltemi, growing among families"] },
          { cells: ["7", "Symi (Dodecanese)", "Neoclassical harbour, quieter luxury"] },
          { cells: ["8", "Patmos (Dodecanese)", "Cultural and spiritual draw"] },
        ],
      },
    },
    {
      heading: "Budgeting all-in: APA, VAT, fuel and TEPAI",
      body:
        "The base fee is the start, not the total. Budget APA (Advance Provisioning Allowance) at 25 to 35% of the base for sailing yachts and catamarans, and 30 to 40% for motor yachts, where fuel weighs heavier. Greek VAT runs 5.2 to 13% for Greek-licensed yachts, and a 10 to 20% gratuity is customary. Greece's TEPAI cruising tax applies monthly by yacht length; budget it at the current official tariff. Marine diesel ran elevated through 2026, so estimate APA on current local diesel prices rather than last year's average. A EUR 20,000 base catamaran week realistically lands around EUR 28,000 to 32,000 all-in before gratuity.",
      table: null,
    },
    {
      heading: "Why 2026 demand is rising",
      body:
        "The global ultra-high-net-worth population keeps growing, and wealth migration is favouring Southern Europe, with the Athenian Riviera and the Greek islands among the destinations of choice, feeding Greek summers. Greece's e-Charter Permission now lets non-EU-flagged yachts over 35m charter up to 28 days a year, widening the large-yacht pool. Across the season, Greece accounts for roughly 30% of Mediterranean summer charter bookings, the single most popular charter destination.",
      table: null,
    },
  ],

  methodology:
    "Figures are indicative net base charter fees (EUR per week, excluding VAT and APA), compiled by George Yachts from standard MYBA and central-agency rate cards together with our own booking and quotation data across the 2025 and 2026 seasons. Greek crewed operators typically quote a single Greece-wide base rate per vessel, so regional figures reflect fleet availability and repositioning cost; where crewed supply is thin (notably the Dodecanese) the regional bands are estimates, marked (est.). Updated for the 2026 season; refreshed quarterly.",

  faqItems: [
    {
      question: "How much does a crewed catamaran charter in Greece cost in 2026?",
      answer:
        "A crewed sailing catamaran for up to 12 guests runs roughly EUR 15,000 to 40,000 per week as a net base fee in peak season, before VAT and APA. The Cyclades sit at the top of that band; the Ionian and Saronic Gulf are the best value.",
    },
    {
      question: "How far in advance should I book a yacht charter in Greece for August?",
      answer:
        "For July and August, book six to twelve months ahead. Premium 40-metre-plus motor yachts and the best crewed catamarans are often confirmed a full year or more in advance. May, June and September typically need only three to four months and run 15 to 25% below peak pricing.",
    },
    {
      question: "Which Greek islands are most in demand for 2026?",
      answer:
        "Mykonos and Santorini continue to lead, with Milos the fastest-rising. Paros, Hydra, the Ionian (Corfu and Lefkada), Symi and Patmos round out the most-requested cruising grounds for the 2026 season.",
    },
    {
      question: "What is APA and how much should I budget on top of the charter fee?",
      answer:
        "APA, the Advance Provisioning Allowance, covers fuel, food, dockage and consumables. It is paid before boarding and reconciled at the end of the charter. Budget 25 to 35% of the base fee for sailing yachts and catamarans, and 30 to 40% for motor yachts. Greek VAT (5.2 to 13% for Greek-licensed yachts) and a customary 10 to 20% gratuity are additional.",
    },
    {
      question: "Which Greek region is the best value for a crewed charter?",
      answer:
        "The Ionian (Corfu and Lefkada) and the Saronic Gulf offer the best value: calmer seas, proximity to Athens with little or no repositioning cost, and ideal conditions for catamarans. The Cyclades command the highest rates.",
    },
    {
      question: "What does a Greek yacht charter cost all-in?",
      answer:
        "Add APA, VAT and gratuity to the net base fee. A EUR 20,000 base catamaran week realistically lands around EUR 28,000 to 32,000 all-in before gratuity. Budget APA on current local diesel prices, which were elevated through 2026.",
    },
  ],
};
