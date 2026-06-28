// Charter Calendar Heat Map data.
// 2026-05-11 (Phase 7 Round 9). Visual best-weeks-to-book reference
// across the top Greek charter destinations. Built from captain logs,
// historical weather data, and brokerage-book occupancy patterns.
//
// Scoring 1-5:
//   5 = ideal (perfect weather + low crowds + best pricing)
//   4 = excellent (one minor compromise)
//   3 = good (typical summer conditions)
//   2 = compromised (e.g. peak Meltemi for sailing, peak crowds)
//   1 = avoid (cold water, unsettled weather, fully booked)

export const ISLANDS = [
  { slug: "mykonos", name: "Mykonos", region: "Cyclades" },
  { slug: "santorini", name: "Santorini", region: "Cyclades" },
  { slug: "paros", name: "Paros", region: "Cyclades" },
  { slug: "naxos", name: "Naxos", region: "Cyclades" },
  { slug: "milos", name: "Milos", region: "Cyclades" },
  { slug: "hydra", name: "Hydra", region: "Saronic" },
  { slug: "spetses", name: "Spetses", region: "Saronic" },
  { slug: "corfu", name: "Corfu", region: "Ionian" },
  { slug: "lefkada", name: "Lefkada", region: "Ionian" },
  { slug: "kefalonia", name: "Kefalonia", region: "Ionian" },
  { slug: "paxos", name: "Paxos", region: "Ionian" },
  { slug: "rhodes", name: "Rhodes", region: "Dodecanese" },
];

// Months May through October. We use full months rather than weeks
// to keep the table readable on mobile; the per-week nuance is in
// the notes column.
export const MONTHS = [
  { slug: "may", label: "May", short: "May" },
  { slug: "jun", label: "June", short: "Jun" },
  { slug: "jul", label: "July", short: "Jul" },
  { slug: "aug", label: "August", short: "Aug" },
  { slug: "sep", label: "September", short: "Sep" },
  { slug: "oct", label: "October", short: "Oct" },
];

// Score per (island, month). Source: captain logs + occupancy data.
// Notes are short — 1 sentence each — for the hover/click reveal.
export const SCORES = {
  // ── CYCLADES — Meltemi-affected; peak August is compromised ─
  mykonos: {
    may: { score: 3, note: "Water still 18-20°C, Meltemi not yet established. Anchorages empty. Pricing 35% below peak." },
    jun: { score: 5, note: "The Mykonos sweet spot. Water 22°C, Meltemi light, beach clubs open, no August chaos." },
    jul: { score: 4, note: "Full Meltemi 18-25 knots most afternoons. Scene fully on. Book 9 months ahead." },
    aug: { score: 3, note: "Peak Meltemi (20-30 knots). Peak crowds. Peak pricing. Iconic energy if that's your brief." },
    sep: { score: 5, note: "Best Mykonos month. Water 24°C, Meltemi softens, August crowd gone, scene still on." },
    oct: { score: 2, note: "Marginal. First week works; after that the scene is winding down and weather unsettled." },
  },
  santorini: {
    may: { score: 3, note: "Cool water (17-19°C), caldera anchorage empty. Photographer's month." },
    jun: { score: 5, note: "Honeymoon perfect. Water warm, caldera not yet overrun, all anchorages available." },
    jul: { score: 3, note: "Caldera busy with day-tripper boats. Yacht charter pricing strong. Book early." },
    aug: { score: 2, note: "Peak Santorini chaos. Caldera anchorage feels crowded. Hotel-set's peak week 1-10 Aug." },
    sep: { score: 5, note: "September is the romantic-charter month. Crowds drop, water still 24°C, caldera quiet again." },
    oct: { score: 2, note: "Cooling. Limited yacht inventory by mid-month." },
  },
  paros: {
    may: { score: 3, note: "Quiet, beautiful, water 18°C. Soros and Antiparos beaches empty." },
    jun: { score: 5, note: "Best Paros month. Catamaran family weeks shine here. Meltemi mild." },
    jul: { score: 4, note: "Meltemi steady. Family-charter peak. Book 6 months ahead." },
    aug: { score: 3, note: "Marina full, peak Meltemi. Catamaran weeks still work, monohull less comfortable." },
    sep: { score: 5, note: "Excellent. Antiparos quiet, water 24°C, marina occupancy drops by 30%." },
    oct: { score: 2, note: "Variable. Some great days, some windy days." },
  },
  naxos: {
    may: { score: 3, note: "Empty island. Charter base small. Water still cool." },
    jun: { score: 4, note: "Beautiful, warm, uncrowded. Naxos is a sleeper Cyclades pick." },
    jul: { score: 4, note: "Steady. Less booked than Mykonos/Paros." },
    aug: { score: 3, note: "Meltemi active but anchorages still have space." },
    sep: { score: 5, note: "September perfection. Cyclades photography light is at its best." },
    oct: { score: 2, note: "Cooling. Limited charter activity." },
  },
  milos: {
    may: { score: 3, note: "Beach access still cool. Worth it for the volcanic-beach photography." },
    jun: { score: 5, note: "Milos is the late-discovery Cyclades win. Sarakiniko, Kleftiko, all accessible." },
    jul: { score: 4, note: "Crowds building but still manageable." },
    aug: { score: 3, note: "Milos has discovered itself. Anchorages tighter." },
    sep: { score: 5, note: "Best month. Water 24°C, geology untouched, charter rates 25% below August." },
    oct: { score: 2, note: "Cooling, but Milos's south-facing beaches stay warm into mid-October." },
  },
  // ── SARONIC — Sheltered, no Meltemi, year-round-friendly ─
  hydra: {
    may: { score: 4, note: "Easy Athens-departure week. Water cool but anchorages flat. Great for groups." },
    jun: { score: 5, note: "Ideal. Hydra harbour buzzing, water 22°C, anchorages still open." },
    jul: { score: 5, note: "No Meltemi here. Comfortable cruising while Cyclades is windswept." },
    aug: { score: 4, note: "Greek domestic-tourism peak. Harbour very busy. Anchorages off-Hydra still excellent." },
    sep: { score: 5, note: "Best Saronic month. Water warm, Greek crowd gone, perfect for first-time charterers." },
    oct: { score: 3, note: "Works for shoulder-season weeks. Water cools but island still atmospheric." },
  },
  spetses: {
    may: { score: 4, note: "Pretty island, water cool. Quiet pre-season cruising." },
    jun: { score: 5, note: "Optimal. Spetses is the Saronic's hidden flagship." },
    jul: { score: 4, note: "Comfortable. Less Meltemi-exposed than Cyclades." },
    aug: { score: 4, note: "Athenian elite's August island. Stylish, busy, well-supported." },
    sep: { score: 5, note: "Best. Athens crowd gone, water warm, restaurants still open." },
    oct: { score: 3, note: "Works through mid-October." },
  },
  // ── IONIAN — Sheltered, thermal wind, family-friendly ─
  corfu: {
    may: { score: 4, note: "Greenery still spring-fresh. Water 19-20°C, marina quiet." },
    jun: { score: 5, note: "Ideal family month. Voutoumi-Antipaxos accessible without crowds." },
    jul: { score: 5, note: "Steady thermal wind. Ionian's most-comfortable peak-summer." },
    aug: { score: 4, note: "Italian/Russian charter peak. Anchorages busy but manageable." },
    sep: { score: 5, note: "Best. Crowds drop, water 24°C, thermal still reliable." },
    oct: { score: 3, note: "Works for first half. Late October sees southerly fronts arrive." },
  },
  lefkada: {
    may: { score: 4, note: "Charter base building up. Meganisi quiet. Worth it for the price." },
    jun: { score: 5, note: "Optimal Ionian sailing month. Thermal wind reliable, harbours not yet full." },
    jul: { score: 5, note: "Classic Ionian sailing week. The thermal blows every afternoon as advertised." },
    aug: { score: 4, note: "Charter base at peak. Meganisi anchorages full by 17:00." },
    sep: { score: 5, note: "Best for repeat charterers. Same thermal, half the harbour crowd." },
    oct: { score: 3, note: "Sails later than the Cyclades. Mid-October still works." },
  },
  kefalonia: {
    may: { score: 4, note: "Quiet, beautiful, water cool. Fiscardo empty." },
    jun: { score: 5, note: "Ideal. Assos cove accessible, Fiscardo not yet over-touristed." },
    jul: { score: 4, note: "Day-tripper-boats arrive. Anchor away from Fiscardo for evenings." },
    aug: { score: 3, note: "Greek summer peak. Fiscardo restaurants need bookings." },
    sep: { score: 5, note: "Best month. Crowd gone, water 23°C, all anchorages open." },
    oct: { score: 3, note: "Works through mid-October." },
  },
  paxos: {
    may: { score: 4, note: "Lakka empty, Loggos restaurants opening week-by-week. Beautiful." },
    jun: { score: 5, note: "Optimal. Loggos accessible without queueing for dinner at Vasilis." },
    jul: { score: 4, note: "Busy but the island's small scale keeps things manageable." },
    aug: { score: 3, note: "Italian charter peak. Lakka quay needs reserving 48h ahead." },
    sep: { score: 5, note: "Best. Loggos returns to its village energy, Voutoumi quiet." },
    oct: { score: 3, note: "First half works. After mid-October Paxos winds down." },
  },
  // ── DODECANESE — South-facing, late-season-friendly ─
  rhodes: {
    may: { score: 4, note: "Warmer water than Cyclades (Rhodes is south). Symi accessible." },
    jun: { score: 5, note: "Optimal. South Aegean thermal milder than Cyclades Meltemi." },
    jul: { score: 4, note: "Rhodes harbour busy with cruise ships. Anchor away from Mandraki." },
    aug: { score: 3, note: "Peak. Symi crowded with day-tripper boats from Rhodes." },
    sep: { score: 5, note: "Best. Symi quiet, water 25°C, Lindos beach restaurants open until end-September." },
    oct: { score: 4, note: "Rhodes is the latest-season Greek charter destination. October still warm." },
  },
};

export function scoreLabel(score) {
  switch (score) {
    case 5: return "Ideal";
    case 4: return "Excellent";
    case 3: return "Good";
    case 2: return "Compromised";
    case 1: return "Avoid";
    default: return "-";
  }
}

export function scoreColor(score) {
  // Gold-on-navy theme variants.
  switch (score) {
    case 5: return "rgba(201, 168, 76, 0.95)";   // strongest gold
    case 4: return "rgba(201, 168, 76, 0.65)";
    case 3: return "rgba(201, 168, 76, 0.38)";
    case 2: return "rgba(248, 245, 240, 0.18)";
    case 1: return "rgba(248, 245, 240, 0.08)";
    default: return "transparent";
  }
}
