// lib/charterIndex2026.js
//
// George Yachts Greek Charter Index - original market data, presented as
// George Yachts' own compiled intelligence. NO external sources or competitor
// names are referenced (Boss directive 2026-06-09).
//
// All prices are NET BASE charter fee, EUR per week, per yacht, excluding VAT
// and APA.
//
// 2026-08-15, the Q4 refresh, and the reason this one is a rewrite rather than
// a date bump. The table used to be yacht type by REGION, and every regional
// cell was marked "(est.)" because Greek operators quote one Greece-wide base
// rate per vessel: the same yacht repositions across the Cyclades, the Ionian
// and the Dodecanese on the same rate card. So the regional columns were four
// slightly different guesses at a number that does not vary by region, and the
// page said as much in its own methodology two screens further down.
//
// Checked against the live fleet this morning, they were also wrong in the
// direction that matters. The table claimed 35,000-100,000 for a 24-34m motor
// yacht, 100,000-350,000 for a 35-49m and 250,000-1m+ above 50m. The real book
// is 40,000-65,000, 60,000-120,000 and 162,500-235,000. It claimed a crewed
// catamaran floor of 15,000 when ours is 10,900, which is the figure the page's
// own meta description already quoted. Power catamarans, fifteen of the
// sixty-five yachts, did not appear at all.
//
// So the table is now yacht type by SIZE, and every cell in it is derived from
// the current rate cards of the yachts we represent, not extrapolated. The
// regional argument keeps its section, where it belongs, in prose.
//
// Fully crewed here means two or more crew. Seven boats between 11 and 20
// metres are skipper-led (crew field "Skipper available/mandatory" or a
// captain with an optional hostess) and are excluded from the crewed bands;
// they are stated separately, from EUR 4,200, rather than dropped.
//
// This is the page's default data source. A Sanity `dataReport` document with
// slug "greek-charter-index-2026" overrides it when published, so future
// quarterly refreshes can move to the Studio without a code change. Bump
// `dataModified` each refresh (drives schema dateModified + the visible date).

export const CHARTER_INDEX_2026 = {
  title: "George Yachts Greek Charter Index 2026-2027",
  edition: "2026-2027",
  dataModified: "2026-08-15",
  publishedAt: "2026-06-09",

  intro:
    "Original George Yachts rate data on crewed yacht charter in Greek waters, refreshed for the autumn of 2026 as the 2027 rate cards open. Across the fifty-eight fully crewed yachts we represent, a sailing catamaran runs from EUR 10,900 a week net base at 14 metres to EUR 90,000 at 24 metres; a power catamaran from EUR 14,000 to EUR 90,000; a motor yacht from EUR 17,500 at 18 metres to EUR 120,000 at 40 metres; and the two yachts above 50 metres from EUR 162,500 to EUR 235,000. Every figure below is per yacht per week, before VAT and APA, and comes from a rate card we hold rather than from a market average.",

  summaryTable: {
    caption:
      "Weekly net base charter fee by yacht type and size (EUR, per yacht, excluding VAT and APA), from the current rate cards of the fifty-eight fully crewed yachts we represent. Autumn 2026, carrying into the 2027 season.",
    columns: ["Yacht type and size", "Guests", "Weekly net base (EUR)", "Yachts"],
    rows: [
      { cells: ["Sailing catamaran, 12 to 16m", "8 to 10", "10,900-22,000", "5"] },
      { cells: ["Sailing catamaran, 16 to 19m", "8 to 10", "18,900-27,500", "4"] },
      { cells: ["Sailing catamaran, 20 to 22m", "8 to 10", "31,500-43,500", "7"] },
      { cells: ["Sailing catamaran, 23 to 24m", "8 to 10", "56,000-90,000", "7"] },
      { cells: ["Power catamaran, 13 to 17m", "6 to 8", "14,000-28,000", "2"] },
      { cells: ["Power catamaran, 20 to 22m", "8 to 10", "34,000-69,000", "7"] },
      { cells: ["Power catamaran, 23 to 24m", "6 to 12", "49,000-90,000", "5"] },
      { cells: ["Motor yacht, 18 to 20m", "6 to 8", "17,500-22,900", "3"] },
      { cells: ["Motor yacht, 22 to 24m", "6 to 8", "21,000-33,000", "2"] },
      { cells: ["Motor yacht, 26 to 31m", "7 to 12", "40,000-65,000", "5"] },
      { cells: ["Motor yacht, 35 to 40m", "10 to 12", "60,000-120,000", "5"] },
      { cells: ["Superyacht, 50m and above", "12 to 49", "162,500-235,000", "2"] },
      { cells: ["Sailing monohull, 24 to 31m", "8", "24,000-49,000", "4"] },
    ],
  },

  statCallouts: [
    { value: "EUR 10,900", label: "the crewed floor: a 14 metre sailing catamaran for eight guests, per week net base" },
    { value: "58 yachts", label: "fully crewed boats whose current rate cards this index is built from, plus seven smaller crewed yachts from EUR 4,200" },
    { value: "Autumn 2026", label: "when owners settle the 2027 rate cards and the most requested July and August weeks begin to go" },
    { value: "6-12 months", label: "typical booking lead time for peak July to August weeks; premium 40m-plus yachts a year or more ahead" },
  ],

  sections: [
    {
      heading: "Why this table is by size and not by region",
      body:
        "A crewed yacht's base rate attaches to the vessel, not to the cruising ground. Greek operators quote one Greece-wide rate card per boat, and the same yacht repositions between the Cyclades, the Ionian, the Saronic and the Dodecanese on that single rate. Region still changes your charter, but it changes availability and repositioning rather than the number on the contract. The Cyclades carry the deepest demand and the Meltemi, which favours larger, faster, more powerful yachts, so the boats that end up there sit higher in the table. The Ionian and the Saronic Gulf are the best value in practice: calmer water, close to Athens, little or no repositioning cost, and ideal conditions for catamarans. The Dodecanese is the thinnest crewed market, so most yachts are repositioned from Athens at a cost that lands on the delivery line rather than on the weekly rate, and availability thins first there.",
      table: null,
    },
    {
      heading: "The 2027 early-bird window",
      body:
        "The 2027 Greek season effectively opens for business in the autumn of 2026, when owners settle next year's rate cards, and the first calendars open earlier still for repeat clients. The advantage of moving now is not primarily price: it is choice. The most requested yachts have their late July and August 2027 weeks spoken for months before the season, and the five and six cabin boats run out long before anything else does, because there are fewer of them than any brochure suggests. Where owners publish early-booking offers, those offers tend to reward commitment on exactly the weeks that would otherwise sell anyway. The figures in this table are the rates we are quoting now; 2027 cards land through the autumn and winter, and we requote when they do.",
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
      heading: "Most in-demand islands",
      body:
        "Demand has broadened from the two icons into a confident second tier, and the Ionian is the structurally rising cruising ground. This ranking is our own, from what clients ask for on this desk.",
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
        "The base fee is the start, not the total. APA, the Advance Provisioning Allowance, is set per charter rather than by any rule: on the yachts in this index it runs 20 to 30% of the base for sailing yachts and catamarans and 30 to 40% for motor yachts, where fuel weighs heaviest. Greek VAT on a weekly crewed charter is invoiced at 5.2, 6.5, 7.8 or 12% depending on the yacht's certification, with 13% the statutory ceiling; short charters under 48 hours and bareboat charters are taxed at 24% instead. A crew gratuity of 10 to 15% of the base is customary and is calculated on the base alone, never on APA or VAT. Greece's TEPAI cruising tax applies monthly by yacht length, at the current official tariff. Marine diesel stayed elevated through 2026, so estimate APA on current local diesel prices rather than last year's average. A EUR 20,000 base catamaran week lands around EUR 25,000 to 28,500 all-in before gratuity, and around EUR 27,000 to 31,500 with it.",
      table: null,
    },
    {
      heading: "Why demand is rising",
      body:
        "The global ultra-high-net-worth population keeps growing, and wealth migration is favouring Southern Europe, with the Athenian Riviera and the Greek islands among the destinations of choice, feeding Greek summers. Greece's e-Charter Permission now lets non-EU-flagged yachts over 35m charter up to 28 days a year, widening the large-yacht pool. Across the season, Greece accounts for roughly 30% of Mediterranean summer charter bookings, the single most popular charter destination.",
      table: null,
    },
  ],

  methodology:
    "Figures are net base charter fees (EUR per yacht per week, excluding VAT and APA), compiled by George Yachts from the current rate cards of the fifty-eight fully crewed yachts we represent, together with our own booking and quotation data across the 2025 and 2026 seasons. Each band states the lowest and highest figure that appears on a rate card in it, so the numbers are observed rather than modelled, and no cell is an estimate. Fully crewed means two or more crew; seven smaller crewed boats between 11 and 20 metres, from EUR 4,200 a week, are quoted separately and are not mixed into the crewed bands. Gulets, which we quote on request rather than carry, run roughly EUR 9,500 to 44,500 a week (est.), the one estimated figure on this page. Rates move with the season and with each yacht's calendar: this edition was refreshed in the autumn of 2026 as the 2027 cards opened, and it is refreshed quarterly.",

  faqItems: [
    {
      question: "How much does a crewed catamaran charter in Greece cost in 2027?",
      answer:
        "On the boats we represent, a fully crewed sailing catamaran runs from EUR 10,900 a week net base at 14 metres, EUR 18,900 to 27,500 at 16 to 19 metres, EUR 31,500 to 43,500 at 20 to 22 metres, and EUR 56,000 to 90,000 at 23 to 24 metres. Power catamarans run EUR 14,000 to 28,000 up to 17 metres, EUR 34,000 to 69,000 at 20 to 22 metres, and EUR 49,000 to 90,000 at 23 to 24 metres. All figures are per yacht per week before VAT and APA. The smaller crewed catamarans start lower, from EUR 4,200.",
    },
    {
      question: "When does early booking for the 2027 Greek charter season open?",
      answer:
        "Effectively in the autumn of 2026, once owners settle next season's rate cards, and the first calendars open earlier for repeat clients. The real advantage of booking early is not a discount, it is first choice: the most requested yachts have their late July and August 2027 weeks spoken for months before summer, and five and six cabin boats are the scarcest of all. Where owners publish early-booking offers, they tend to reward commitment on exactly those peak weeks.",
    },
    {
      question: "How far in advance should I book a yacht charter in Greece for August?",
      answer:
        "For July and August, book six to twelve months ahead. Premium 40-metre-plus motor yachts and the best crewed catamarans are often confirmed a full year or more in advance, which for August 2027 means deciding through the autumn and winter of 2026. May, June and September typically need only three to four months and run 15 to 25% below peak pricing.",
    },
    {
      question: "Which Greek islands are most in demand?",
      answer:
        "Mykonos and Santorini continue to lead, with Milos the fastest-rising. Paros, Hydra, the Ionian (Corfu and Lefkada), Symi and Patmos round out the most-requested cruising grounds on this desk.",
    },
    {
      question: "What is APA and how much should I budget on top of the charter fee?",
      answer:
        "APA, the Advance Provisioning Allowance, covers fuel, food, dockage and consumables. It is paid before boarding and reconciled at the end of the charter, and it is set per charter rather than by any fixed rule. On the yachts in this index it runs 20 to 30% of the base fee for sailing yachts and catamarans and 30 to 40% for motor yachts. Greek VAT is invoiced at 5.2 to 12% by certification, with 13% the statutory ceiling, and a customary 10 to 15% gratuity on the base is additional.",
    },
    {
      question: "Which Greek region is the best value for a crewed charter?",
      answer:
        "The Ionian (Corfu and Lefkada) and the Saronic Gulf offer the best value: calmer seas, proximity to Athens with little or no repositioning cost, and ideal conditions for catamarans. The rate card itself does not change by region, so the saving shows up in delivery cost and in what is still available rather than in the weekly fee.",
    },
    {
      question: "What does a Greek yacht charter cost all-in?",
      answer:
        "Add APA, VAT and gratuity to the net base fee. A EUR 20,000 base catamaran week lands around EUR 25,000 to 28,500 all-in before gratuity, and around EUR 27,000 to 31,500 once a 10 to 15% crew gratuity is added. Budget APA on current local diesel prices, which stayed elevated through 2026.",
    },
  ],
};
