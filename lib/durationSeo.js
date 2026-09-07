// Tier 4 duration-based landing pages. 2026-05-11 Phase 7 Round 5.
// Strategy doc Section 2.1 Tier 4 listed top 10 destinations × 5
// duration variants = 50 pages. We build 10 destinations × 4 most-
// commercial durations = 40 pages. "weekend" duration excluded
// since charter weekends are rare in Greek waters (most yachts
// require 4+ night minimum).
//
// Each entry is generated from a (destination, duration) tuple
// plus shared boilerplate that varies meaningfully by duration.
// Content is templated but the duration-specific itinerary outline
// gives each page its own substance.

import { parseItineraryProse } from "@/lib/touristTripSchema";

const TEMPLATES = {
  "3-day": {
    durationName: "3 Days",
    eyebrow: "3-day Charter",
    // 2026-09-07: this house writes weekly charters. The five-night Saronic
    // week is the shortest programme it places. The old template sold a
    // Friday-to-Monday weekend on ten pages; the pages keep their URLs and
    // titles (structure freeze to 18/9) and now tell the truth.
    framing: "Three days is how a Greek yacht week begins, not a charter this house sells on its own. The shortest programme we write is the five-night Saronic week from Athens.",
    paceBody:
      "**This house writes weekly charters, and the five-night Saronic week from Athens is the shortest programme we place.** A three-day search usually means one of two things, and both have an honest answer. If your dates are fixed and short, the five-night week from Alimos reaches Aegina (18 nautical miles), Poros (25) and Hydra (35) on the house distance table without a single long passage, priced per yacht as one charter with the crew included. If the question is what the first three days of a week look like from this port, the outline below is exactly that: the opening of a week, written so you can see how the itinerary builds. " +
      "The yachts that suit a compact programme are the crewed catamarans of 16 to 22 metres and the 20 to 30 metre motor yachts: on the Greek Charter Index 2026 a 16 to 19 metre sailing catamaran runs EUR 18,900 to 27,500 a week, a 20 to 22 metre EUR 31,500 to 43,500, a 22 to 24 metre motor yacht EUR 21,000 to 33,000, per yacht before VAT and APA. Five-night pricing is quoted by the owner from the weekly rate, never assumed.",
    bestForExtra: ["Fixed short dates, answered with the five-night Saronic week", "Birthday or anniversary milestones on a compact programme", "Seeing how a Greek yacht week opens before committing to one"],
    durationMin: 3,
  },
  "7-day": {
    durationName: "7 Days",
    eyebrow: "7-day Charter",
    framing: "The standard Greek yacht charter format. The market turns over on Saturdays; we are not bound to it and will start your week on any day.",
    paceBody:
      "**A 7-day charter is the standard Greek format** and the duration most yachts in the Greek charter market are priced around. The market convention is to board Saturday afternoon, after the previous charter disembarks, and disembark the following Saturday morning. That is a turnover habit rather than a rule: we place weeks starting on any day, which matters when your flights do not fall on a weekend. The week breaks down naturally: 4-5 days at anchor or short transits, 1-2 marina nights for village evenings, 1 day reserved for weather flexibility or unplanned discoveries. " +
      "The pace allows real exploration. A typical Greek charter week covers 100-180 nautical miles in total on the house distance table, with daily legs of 10 to 60 nm. The captain plans the route based on your preferences; most weeks include 3-5 island stops. By day 4 the yacht starts to feel like home, by day 6 you're not ready for the week to end.",
    bestForExtra: ["First-time charterers wanting the standard experience", "Couples and families settling into the yacht rhythm", "Charterers wanting variety across multiple islands"],
    durationMin: 7,
  },
  "10-day": {
    durationName: "10 Days",
    eyebrow: "10-day Charter",
    framing: "Extended charter - more islands, longer pauses, deeper rhythm.",
    paceBody:
      "**A 10-day charter is the format for serious island exploration**. You gain 3 extra days beyond a standard week, which transforms the trip: the captain can include more remote islands, the pace can slow down at favourite anchorages, and the week starts to feel less like a trip and more like a season. Many of our repeat clients have shifted from 7-day to 10-day charters once they tried both. " +
      "A 10-day charter typically covers 200-280 nm and 5-8 island stops. You can extend a Cycladic loop to include Folegandros, Sifnos and Milos, or add the western Cyclades to a Saronic week from Athens, or run the whole Ionian from Corfu to Zakynthos. The chef has time to plan more elaborate dinners. The crew settles into your preferences. The extra days are quoted by the owner from the weekly rate, per yacht.",
    bestForExtra: ["Repeat charterers stepping up from 7-day", "Families with adult children combining schedules", "Charters covering two island groups (Saronic + Cyclades, the full Ionian)"],
    durationMin: 10,
  },
  "14-day": {
    durationName: "14 Days",
    eyebrow: "14-day Charter",
    framing: "Two-week charter - the format for charters that become trips.",
    paceBody:
      "**A 14-day charter is what UHNW repeat clients book** when they've outgrown the 7-day format. Two full weeks aboard a single yacht transforms the experience from 'yacht trip' to 'temporary home'. The crew has time to learn your preferences deeply. The chef can plan a full week of varied menus and start fresh on the second week. The route can cover meaningfully more geography. " +
      "Practical advantages: **some owners price the second week below the first**; the figure is quoted per yacht, never assumed. Crew gratuity stays at 10 to 15% of the base rate, at your discretion, handed to the captain at the end of the charter. The yacht can travel further: a Saronic opening and the full Cyclades loop from Athens, or the whole Ionian from Corfu to Zakynthos, become possible. Charters above 14 days are rarer and follow the same routing logic.",
    bestForExtra: ["UHNW repeat clients wanting deeper time aboard", "Routes that need real time (Saronic + Cyclades from Athens, Corfu to Zakynthos)", "Family reunions and milestone trips combining multiple sub-groups"],
    durationMin: 14,
  },
};

const DESTINATIONS = [
  { slug: "mykonos", name: "Mykonos", region: "Cyclades", departurePort: "Mykonos chora" },
  { slug: "santorini", name: "Santorini", region: "Cyclades", departurePort: "Vlyhada Marina" },
  { slug: "athens", name: "Athens", region: "Athens", departurePort: "Alimos Marina" },
  { slug: "lefkada", name: "Lefkada", region: "Ionian", departurePort: "Lefkada Marina" },
  { slug: "corfu", name: "Corfu", region: "Ionian", departurePort: "Corfu (Gouvia)" },
  { slug: "paros", name: "Paros", region: "Cyclades", departurePort: "Parikia" },
  { slug: "naxos", name: "Naxos", region: "Cyclades", departurePort: "Naxos chora" },
  { slug: "hydra", name: "Hydra", region: "Saronic", departurePort: "Hydra harbour" },
  { slug: "skiathos", name: "Skiathos", region: "Sporades", departurePort: "Skiathos harbour" },
  { slug: "rhodes", name: "Rhodes", region: "Dodecanese", departurePort: "Mandraki harbour" },
];

// Destination-specific itinerary outlines per duration. Each describes
// what a charter of that length can realistically accomplish from
// that destination. Honest framing — we'd rather sell a 10-day than
// claim Mykonos in 3 days is the same experience as a full week.
const ITINERARIES = {
  mykonos: {
    "3-day": "Day 1: Board Mykonos, anchor Ornos for sunset, dinner ashore in the chora. Day 2: Delos at dawn, lunch at Rhenia, sunset at Ornos with chef-prepared dinner aboard. Day 3: Morning swim, light cruise back to Mykonos harbour, disembark.",
    "7-day": "Day 1: Mykonos board + Ornos anchorage. Day 2: Delos + Rhenia. Day 3-4: Paros (Naoussa) + Antiparos. Day 5: Folegandros cliffs. Day 6: Mykonos return via Tinos. Day 7: Final Ornos morning, disembark.",
    "10-day": "Days 1-2 Mykonos + Delos + Rhenia. Days 3-4 Paros + Antiparos. Day 5 Naxos. Day 6 Ios + Folegandros. Days 7-8 Santorini (caldera + Oia sunset). Day 9 Sifnos. Day 10 return to Mykonos.",
    "14-day": "Days 1-3 Mykonos + Delos + central Cyclades. Days 4-6 Paros + Naxos + Ios. Days 7-9 Santorini + Folegandros. Days 10-11 Milos + Sifnos. Days 12-13 Hydra + Spetses (Saronic detour). Day 14 return to Mykonos or Athens.",
  },
  santorini: {
    "3-day": "Day 1: Vlyhada Marina board, sail north to caldera anchorage, sunset below Oia, dinner aboard. Day 2: Caldera morning, swim at Nea Kameni, tender to Ammoudi Bay for lunch ashore, evening at anchor. Day 3: Morning sail south to Vlyhada, disembark.",
    "7-day": "Days 1-2 Santorini caldera. Days 3-4 Folegandros + Sikinos. Day 5 Ios. Day 6 Naxos + Small Cyclades. Day 7 return to Santorini.",
    "10-day": "Days 1-2 Santorini caldera. Days 3-4 Folegandros + Sikinos. Day 5 Ios + Anafi. Days 6-7 Naxos + Paros. Day 8 Antiparos. Day 9 Sifnos or Milos. Day 10 return to Santorini.",
    "14-day": "Days 1-2 Santorini. Days 3-5 Cyclades south (Folegandros, Sikinos, Ios, Anafi). Days 6-9 central Cyclades (Naxos, Paros, Antiparos, Mykonos, Delos). Days 10-12 western Cyclades (Sifnos, Kimolos, Milos). Days 13-14 return via Folegandros to Santorini.",
  },
  athens: {
    "3-day": "Day 1: Alimos board, sail to Aegina for lunch, overnight at Poros. Day 2: Hydra exploration, sunset at anchorage, dinner aboard. Day 3: Morning cruise to Spetses or back to Alimos, disembark.",
    "7-day": "Day 1: Athens to Kea. Day 2 Kythnos. Days 3-4 Sifnos + Serifos. Day 5 Hydra (Saronic loop). Day 6 Poros. Day 7 return to Alimos.",
    "10-day": "Day 1: Athens to Kea. Days 2-3 Cyclades (Sifnos, Serifos, Milos). Day 4 Folegandros. Day 5 Santorini. Day 6 Ios. Day 7 Naxos. Day 8 Mykonos + Delos. Day 9 Kythnos. Day 10 return to Alimos.",
    "14-day": "Days 1-2 Saronic (Hydra, Spetses). Days 3-5 central Cyclades (Kythnos, Syros, Mykonos, Delos). Days 6-8 southern Cyclades + Santorini. Days 9-11 western Cyclades (Milos, Sifnos, Serifos). Days 12-13 return via Kea. Day 14 disembark Alimos.",
  },
  lefkada: {
    "3-day": "Day 1: Lefkada Marina board, short sail to Meganisi (Spartochori). Day 2: Ithaca (Kioni harbour for evening). Day 3: Return via Meganisi to Lefkada, disembark.",
    "7-day": "Day 1 Lefkada to Meganisi. Days 2-3 Ithaca (Kioni + Vathy). Day 4 Kefalonia (Fiskardo). Days 5-6 Paxos + Antipaxos. Day 7 return to Lefkada.",
    "10-day": "Day 1 Lefkada to Meganisi. Days 2-3 Ithaca. Day 4 Kefalonia (Fiskardo). Day 5 Zakynthos (Navagio dawn). Day 6 Kefalonia south. Days 7-8 Paxos + Antipaxos. Day 9 Corfu. Day 10 return to Lefkada.",
    "14-day": "Days 1-2 Lefkada + Meganisi. Days 3-4 Ithaca. Day 5 Kefalonia. Days 6-7 Zakynthos. Days 8-9 Paxos + Antipaxos. Days 10-11 Corfu. Day 12 Sivota and Parga on the mainland coast. Days 13-14 return to Lefkada.",
  },
  corfu: {
    "3-day": "Day 1 Corfu town board, sail south to Paxos (Lakka). Day 2 Paxos + Antipaxos swim. Day 3 return to Corfu via west coast, disembark.",
    "7-day": "Day 1 Corfu to Paxos. Days 2-3 Paxos + Antipaxos. Day 4 Lefkada/Meganisi. Days 5-6 Ithaca + Kefalonia. Day 7 return north to Corfu.",
    "10-day": "Day 1 Corfu to Paxos. Days 2-3 Paxos + Antipaxos. Day 4-5 Lefkada + Meganisi. Days 6-7 Ithaca + Kefalonia. Day 8 Sivota. Day 9 northern Ionian (Othonoi). Day 10 return to Corfu.",
    "14-day": "Days 1-2 Corfu town + the north-east coast (Agni, Kalami). Days 3-4 Paxos + Antipaxos. Days 5-6 Lefkada + Meganisi. Days 7-8 Ithaca + Kefalonia. Day 9-10 Zakynthos. Days 11-12 return via Lefkada + Paxos. Days 13-14 Corfu west coast + disembark.",
  },
  paros: {
    "3-day": "Day 1 Parikia board, anchor Naoussa for dinner. Day 2 Antiparos + Despotiko swim, lunch ashore, evening Naoussa. Day 3 return to Parikia, disembark.",
    "7-day": "Day 1 Paros + Antiparos. Day 2 Naxos. Day 3 Mykonos + Delos. Day 4 Ios. Day 5 Sifnos. Day 6 return via Antiparos. Day 7 disembark.",
    "10-day": "Days 1-2 Paros + Antiparos. Day 3 Naxos. Days 4-5 Mykonos + Delos + Rhenia. Day 6 Folegandros. Day 7 Santorini. Day 8 Ios + Sikinos. Day 9 Sifnos. Day 10 return to Paros.",
    "14-day": "Days 1-2 Paros + Antiparos. Days 3-4 Naxos + Small Cyclades. Days 5-6 Mykonos + Delos. Days 7-8 Folegandros + Santorini. Days 9-10 Milos + Sifnos. Days 11-12 Serifos + Kythnos. Days 13-14 return to Paros.",
  },
  naxos: {
    "3-day": "Day 1 Naxos chora board, anchor Plaka beach for lunch. Day 2 Apollonas (north Naxos) + drive to Filoti for dinner. Day 3 return to Naxos chora, disembark.",
    "7-day": "Day 1 Naxos + beaches. Day 2 Small Cyclades (Koufonisia). Day 3 Mykonos + Delos. Day 4 Paros + Antiparos. Day 5 Ios. Day 6 Naxos return. Day 7 disembark.",
    "10-day": "Days 1-2 Naxos. Day 3 Small Cyclades. Days 4-5 Amorgos. Days 6-7 Ios + Folegandros. Day 8 Santorini. Day 9 Paros + Antiparos. Day 10 return to Naxos.",
    "14-day": "Days 1-2 Naxos. Days 3-4 Small Cyclades (Koufonisia, Schinoussa). Days 5-6 Amorgos. Days 7-8 Ios + Sikinos. Days 9-10 Santorini + Folegandros. Days 11-12 Paros + Mykonos. Days 13-14 return to Naxos.",
  },
  hydra: {
    "3-day": "Day 1 Hydra harbour board, evening in chora. Day 2 Dokos + Spetses swim/lunch, return Hydra. Day 3 morning swim, disembark.",
    "7-day": "Days 1-2 Hydra. Day 3 Spetses. Day 4 Poros. Day 5 Aegina. Day 6 Cyclades reach (Kythnos). Day 7 return to Hydra.",
    "10-day": "Days 1-2 Hydra. Days 3-4 Spetses + Dokos. Day 5 Poros. Day 6 Aegina. Days 7-8 Cyclades (Kythnos + Serifos). Day 9 return via Poros. Day 10 disembark Hydra.",
    "14-day": "Days 1-3 Saronic (Hydra, Spetses, Poros, Aegina). Days 4-5 Kea + Kythnos. Days 6-9 western Cyclades (Serifos, Sifnos, Milos). Days 10-11 Folegandros + Santorini. Days 12-13 return via Sifnos and Kythnos. Day 14 Hydra disembark.",
  },
  skiathos: {
    "3-day": "Day 1 Skiathos board, anchor Lalaria beach for the morning, evening chora. Day 2 Skopelos (Mamma Mia anchorages). Day 3 return to Skiathos, disembark.",
    "7-day": "Days 1-2 Skiathos + Lalaria. Days 3-4 Skopelos. Day 5 Alonissos + Marine Park. Day 6 Skantzoura. Day 7 return to Skiathos.",
    "10-day": "Days 1-2 Skiathos. Days 3-4 Skopelos. Days 5-6 Alonissos + Marine Park. Days 7-8 Skyros. Day 9 northern Aegean coastline. Day 10 return to Skiathos.",
    "14-day": "Days 1-2 Skiathos. Days 3-5 Skopelos + Alonissos. Days 6-7 Skyros. Days 8-10 Northern Aegean reach (Lemnos, Lesvos). Days 11-12 return to Sporades. Days 13-14 Skiathos disembark.",
  },
  rhodes: {
    "3-day": "Day 1 Mandraki board, sail to Symi (90 min), evening Symi harbour. Day 2 Symi + Panormitis. Day 3 return to Rhodes, disembark via Lindos anchorage.",
    "7-day": "Day 1 Rhodes to Symi. Days 2-3 Symi + Tilos. Day 4 Nisyros. Day 5 Kos. Day 6 Patmos. Day 7 return to Rhodes.",
    "10-day": "Day 1 Rhodes to Symi. Days 2-3 Symi + Tilos + Nisyros. Day 4 Kos. Day 5 Kalymnos. Day 6 Patmos. Day 7 Leros. Day 8 return via Kos. Days 9-10 Lindos + Rhodes.",
    "14-day": "Days 1-2 Rhodes + Lindos. Days 3-4 Symi + Tilos. Days 5-6 Nisyros + Kos. Days 7-8 Kalymnos + Patmos. Days 9-10 Cycladic reach (Astypalaia, Amorgos). Days 11-12 return to Dodecanese. Days 13-14 Rhodes disembark.",
  },
};

// 2026-08-06 (job 8, local until George's push) — the base-rate band per
// duration. It used to be inlined in the cost FAQ as four nested ternaries,
// which meant the title and the description could never quote a price without
// risking drift from the answer on the page. One source, three consumers.
// Figures unchanged from the FAQ that shipped before today.
// 2026-09-07: the four bands above were scaled guesses. The weekly band is now
// the Greek Charter Index 2026 itself, 14 metre crewed catamaran to the yachts
// above 50 metres; longer charters are quoted by the owner from the weekly
// rate, and the three-day pages answer with the five-night Saronic week.
const WEEKLY_INDEX = { low: "10,900", high: "235,000" };

// 2026-09-07 (plan #10): per-page depth for the duration pages that carry
// impressions. Merged over the generated page by slug.
const DEPTH = {
  "yacht-charter-paros-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Paros look like, and what does it cost?",
      answer:
        "Paros sits in the middle of the Cyclades, so a week from Parikia or Naoussa reaches every neighbour on a short leg: Antiparos 5 nautical miles, Naxos 12, Mykonos 30, Sifnos 35, Milos 50, Santorini 60 on the house distance table. The island has a lee for every wind, Naoussa open to the Meltemi, Parikia and the Despotiko channel sheltered from it. One price per yacht per week with crew, from the Greek Charter Index 2026: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500, a 26 to 31 metre motor yacht 40,000 to 65,000, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Paros on the house table: Antiparos 5 nm, Naxos 12, Mykonos 30, Sifnos 35, Milos 50, Santorini 60",
      "Anchorages from the Paros guide: Naoussa 8 to 15 m over sand, open to the Meltemi; the Despotiko channel 4 to 9 m over sand, one of the best northerly shelters in the southern Cyclades; Soros on Antiparos sheltered from every direction",
      "On the Greek Charter Index island ranking Paros is fourth, behind Mykonos, Santorini and Milos, and rising with younger clients",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 23 to 24 m 56,000 to 90,000; 26 to 31 m motor 40,000 to 65,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; June and September list 15 to 25% below peak",
      "A Paros start means the yacht is positioned from Athens (95 nm from Alimos); the positioning is quoted per yacht by the owner",
    ],
    evidence: { label: "Anchorage depths and shelter from the Paros anchorage guide", href: "/yacht-charter-paros-anchorages" },
  },
  "yacht-charter-hydra-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Hydra look like, and what does it cost?",
      answer:
        "Hydra is the car-free heart of the Saronic, and a week from here is the calmest sailing water near Athens: Poros 12 nautical miles, Spetses 25, Aegina 25 and Alimos 35 on the house distance table, with Dokos in between. The harbour is a stern-to mooring in a deep basin; the anchorages are Vlychos (8 to 15 m over sand and weed), Bisti (10 to 18 m over sand) and Mandraki (6 to 12 m), all sheltered from the north, and Plakes on Dokos, 6 to 12 m with shelter from every direction. One price per yacht per week with crew, from the Greek Charter Index 2026: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500, a 22 to 24 metre motor yacht 21,000 to 33,000, a 26 to 31 metre 40,000 to 65,000, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Hydra on the house table: Poros 12 nm, Spetses 25, Aegina 25, Athens (Alimos) 35; Alimos to Spetses 50",
      "Anchorages from the Hydra guide: Vlychos 8 to 15 m over sand and weed, Bisti 10 to 18 m over sand, Mandraki 6 to 12 m, Plakes on Dokos 6 to 12 m sheltered from every direction; the town harbour is stern-to in a 30 to 40 m basin",
      "The Saronic is sheltered from the Meltemi; a Hydra week is the one this house writes for first-time charterers and for the five-night programme, the shortest it places",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 22 to 24 m motor 21,000 to 33,000; 26 to 31 m motor 40,000 to 65,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; May, June, September and early October list 15 to 25% below peak",
      "A Hydra boarding means the yacht comes 35 nm from Athens the morning you arrive; most Saronic weeks board at Alimos and make Hydra the first or second night",
    ],
    evidence: { label: "Depths and shelter from the Hydra anchorage guide", href: "/yacht-charter-hydra-anchorages" },
  },
  "yacht-charter-santorini-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Santorini look like, and what does it cost?",
      answer:
        "A Santorini start turns the usual Cyclades week around: the yacht boards at Vlychada on the south coast (alongside in 5 to 8 m, for yachts up to 60 m), takes the caldera and Ammoudi's mooring buoys the first evening, then works north against the Meltemi's lee side, Folegandros 30 nautical miles, Ios 25, Naxos 55 on the house table, before turning back. Santorini is 130 nm from Athens, so the yacht is positioned from its Athens base at a fee quoted per yacht. One price per yacht per week with crew, from the Greek Charter Index 2026: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500, a 26 to 31 metre motor yacht 40,000 to 65,000, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Santorini on the house table: Ios 25 nm, Folegandros 30, Naxos 55, Paros 60, Milos 70, Mykonos 80, Athens (Alimos) 130",
      "From the Santorini guide: the caldera is 80 to 180 m deep at Ammoudi, mooring buoys only, booked a week or two ahead in peak; Vlychada marina alongside in 5 to 8 m; Akrotiri 6 to 15 m over sand by the Red Beach; Perissa 6 to 12 m",
      "The south coast is the Meltemi-shielded side of the island; the caldera buoy is for the evening, the swim stops are Akrotiri, White Beach and Perissa",
      "Santorini is second on the Index island ranking behind Mykonos, and the island most often named as where a week should end; a Santorini start is the reverse loop",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 23 to 24 m 56,000 to 90,000; 26 to 31 m motor 40,000 to 65,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; June and September list 15 to 25% below peak",
    ],
    evidence: { label: "Depths, buoys and shelter from the Santorini anchorage guide", href: "/yacht-charter-santorini-anchorages" },
  },
  "yacht-charter-lefkada-10-day": {
    quickAnswer: {
      question: "What does a ten-day yacht charter from Lefkada look like, and what does it cost?",
      answer:
        "Ten days from Lefkada Marina covers the whole inner Ionian without a single long passage: Meganisi the first night, Ithaca 20 nautical miles, Kefalonia 25, Paxos 50 and Corfu 80 on the house distance table, with Zakynthos 35 beyond Kefalonia for the extra days. The water is sheltered by the mainland and the islands, the wind an afternoon breeze that dies at sunset, and the anchorages are the safest in Greece: Vlicho Bay 5 to 7 m over mud with shelter from every direction, Sivota 5 to 10 m, Fiskardo 8 to 15 m. One price per yacht with crew, from the Greek Charter Index 2026 weekly rate: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500 a week, a 26 to 31 metre motor yacht 40,000 to 65,000, with the extra days quoted by the owner per yacht.",
    },
    keyFacts: [
      "Distances from Lefkada on the house table: Ithaca 20 nm, Kefalonia 25, Paxos 50, Corfu 80; Ithaca to Kefalonia 10, Kefalonia to Zakynthos 35, Corfu to Paxos 35",
      "From the Lefkada and Kefalonia guides: Vlicho Bay 5 to 7 m over mud, excellent holding, sheltered from every direction; Sivota 5 to 10 m over mud; Fiskardo 8 to 15 m, all-round shelter; Sami Bay 10 to 20 m",
      "The Ionian is sheltered from the Meltemi; the afternoon north-westerly builds late morning and dies at sunset, and the season sails into mid-October most years",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 23 to 24 m 56,000 to 90,000; 26 to 31 m motor 40,000 to 65,000 a week net base; extra days quoted per yacht",
      "Lead time on the Index: 6 to 12 months for July and August; June, September and early October list 15 to 25% below peak",
      "Lefkada Marina is reached from Preveza airport in about 30 minutes by road, or from Athens by road in about four hours",
    ],
    evidence: { label: "Depths, holding and shelter from the Lefkada anchorage guide", href: "/yacht-charter-lefkada-anchorages" },
  },
  "yacht-charter-mykonos-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Mykonos look like, and what does it cost?",
      answer:
        "Mykonos is first on the Greek Charter Index island ranking and the natural base of a Cyclades week: Delos and Rhenia 10 nautical miles off the harbour, Syros 25, Paros 30, Naxos 30 and Santorini 80 on the house distance table. The week runs north to south with the Meltemi behind it, anchoring in the south-coast lees, Ornos 6 to 12 m over sand, Psarou 8 to 15, Platis Gialos 6 to 10, with Kalafati on the east coast as the best shelter on the island. One price per yacht per week with crew, from the Index 2026: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500, a 26 to 31 metre motor yacht 40,000 to 65,000, before APA and Greek VAT at the certified rate. The yacht is positioned from its Athens base, 90 nm, at a fee quoted per yacht.",
    },
    keyFacts: [
      "Distances from Mykonos on the house table: Delos and Rhenia 10 nm, Syros 25, Paros 30, Naxos 30, Santorini 80; Athens (Alimos) 90, Lavrio 75",
      "Anchorages from the Mykonos guide: Ornos 6 to 12 m over sand, Psarou 8 to 15, Platis Gialos 6 to 10, Paranga 8 to 12, all sheltered from the north; Kalafati 6 to 10 m on the east coast, the best Meltemi shelter on the island",
      "The Meltemi blows from the north on July and August afternoons, 25 to 35 knots on a strong day; the week runs Mykonos first and Santorini last so the wind stays behind you",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 23 to 24 m 56,000 to 90,000; 26 to 31 m motor 40,000 to 65,000; 35 to 40 m 60,000 to 120,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; June and September list 15 to 25% below peak",
      "The yachts this house represents base in Athens; a Mykonos boarding at Ornos or the New Port follows a positioning quoted per yacht by the owner",
    ],
    evidence: { label: "Depths and shelter from the Mykonos anchorage guide", href: "/yacht-charter-mykonos-anchorages" },
  },
  "yacht-charter-lefkada-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Lefkada look like, and what does it cost?",
      answer:
        "The gentlest week in Greek waters: Meganisi the first night, Ithaca 20 nautical miles from Lefkada, Kefalonia 25 and Paxos 50 on the house distance table, on water sheltered by the mainland and the islands, with an afternoon breeze that dies at sunset. The anchorages are shallow and safe: Atheni on Meganisi 5 to 6 m over sand, Vathy on Ithaca 3.5 to 4 m off the town, Fiskardo 8 to 15 m with all-round shelter, Gaios on Paxos 6 to 8 m over mud. One price per yacht per week with crew, from the Greek Charter Index 2026: a 16 to 19 metre sailing catamaran EUR 18,900 to 27,500, a 20 to 22 metre 31,500 to 43,500, a 26 to 31 metre motor yacht 40,000 to 65,000, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Lefkada on the house table: Ithaca 20 nm, Kefalonia 25, Paxos 50, Corfu 80; Ithaca to Kefalonia 10",
      "From the Meganisi, Ithaca, Kefalonia and Paxos guides: Atheni 5 to 6 m over sand; Abelike 5 to 6 m; Vathy on Ithaca 3.5 to 4 m; Kioni sheltered from every wind but the rare ESE; Fiskardo 8 to 15 m, all-round shelter; Gaios 6 to 8 m over mud",
      "The Ionian is sheltered from the Meltemi; the north-westerly builds late morning and dies at sunset, and the season holds into mid-October most years",
      "Index 2026 bands: 16 to 19 m sailing catamaran EUR 18,900 to 27,500; 20 to 22 m 31,500 to 43,500; 24 to 31 m crewed sailing yacht 24,000 to 49,000; 26 to 31 m motor 40,000 to 65,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; June, September and early October list 15 to 25% below peak",
      "Lefkada Marina is about 30 minutes by road from Preveza airport; the five crewed sailing yachts this house represents all sail the Ionian",
    ],
    evidence: { label: "Depths, holding and shelter from the Lefkada anchorage guide", href: "/yacht-charter-lefkada-anchorages" },
  },
  "yacht-charter-corfu-10-day": {
    quickAnswer: {
      question: "What does a ten-day yacht charter from Corfu look like, and what does it cost?",
      answer:
        "Ten days from Corfu covers the whole Ionian chain and comes back: Paxos 35 nautical miles south on the house distance table, Lefkada and Meganisi 50 beyond, Ithaca 20 and Kefalonia 25 from Lefkada, then north again by the mainland coast at Sivota and the Diapontia islands. Corfu's own anchorages open and close the trip: Kassiopi 6 to 12 m over sand with shelter from every direction, Agni 5 to 10 m, Paleokastritsa 8 to 18 m under the west-coast cliffs. One price per yacht with crew, from the Greek Charter Index 2026 weekly rate: a 20 to 22 metre sailing catamaran EUR 31,500 to 43,500 a week, a 26 to 31 metre motor yacht 40,000 to 65,000, with the extra days quoted by the owner per yacht, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Corfu on the house table: Paxos 35 nm, Lefkada 80, Ithaca 95; Paxos to Lefkada 50, Lefkada to Ithaca 20, Ithaca to Kefalonia 10",
      "From the Corfu and Paxos guides: Kassiopi 6 to 12 m over sand, all-round shelter; Agni 5 to 10 m; Paleokastritsa 8 to 18 m; Erikoussa 6 to 12 m; Gaios 6 to 8 m over mud; Lakka sheltered from most directions except northerlies",
      "The Ionian is sheltered from the Meltemi; the afternoon north-westerly builds late morning and dies at sunset",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 23 to 24 m 56,000 to 90,000; 26 to 31 m motor 40,000 to 65,000 a week net base; extra days quoted per yacht",
      "July and August book 6 to 12 months ahead on the Index; June, September and early October list 15 to 25% below peak",
      "Corfu has its own international airport; boarding is at Gouvia, and ARIVA, a Fountaine Pajot Power 67 for ten guests, is the power catamaran this house represents from Corfu",
    ],
    evidence: { label: "Depths, holding and shelter from the Corfu anchorage guide", href: "/yacht-charter-corfu-anchorages" },
  },
  "yacht-charter-athens-7-day": {
    quickAnswer: {
      question: "What does a seven-day yacht charter from Athens look like, and what does it cost?",
      answer:
        "Athens is where most of the yachts this house represents are based, and the week from Alimos is the one it writes most: Kea 35 nautical miles on the house distance table, Kythnos 15 beyond, Sifnos 25 beyond that, then back through Hydra (35 from Alimos) and Poros (25). The anchorages are the safest in the Aegean: Vourkari on Kea inside one of the best natural harbours in the Mediterranean, Kolona on Kythnos 3 to 10 m over sand sheltered from both the Meltemi and southerlies, Vlychos on Hydra 8 to 15 m. One price per yacht per week with crew, from the Greek Charter Index 2026: a 16 to 19 metre sailing catamaran EUR 18,900 to 27,500, a 20 to 22 metre 31,500 to 43,500, a 22 to 24 metre motor yacht 21,000 to 33,000, a 26 to 31 metre 40,000 to 65,000, before APA and Greek VAT at the certified rate.",
    },
    keyFacts: [
      "Distances from Athens (Alimos) on the house table: Aegina 18 nm, Poros 25, Hydra 35, Kea 35, Kythnos 45, Spetses 50, Sifnos 80, Mykonos 90; Kea to Kythnos 15, Kythnos to Sifnos 25",
      "From the Kea, Kythnos and Hydra guides: Vourkari on Kea, deep, use 40 m of chain, inside one of the safest natural harbours in the Mediterranean; Kolona on Kythnos 3 to 10 m, sheltered from the Meltemi and from southerlies; Loutra the best Meltemi port on Kythnos; Vlychos on Hydra 8 to 15 m over sand and weed",
      "Athens was the cruising ground named most in the 68 enquiries this desk logged in the 2026 season, and every charter it won in that period boarded in Athens",
      "Index 2026 bands: 16 to 19 m sailing catamaran EUR 18,900 to 27,500; 20 to 22 m 31,500 to 43,500; 22 to 24 m motor 21,000 to 33,000; 26 to 31 m 40,000 to 65,000 a week net base",
      "July and August book 6 to 12 months ahead on the Index; May, June, September and early October list 15 to 25% below peak",
      "Athens International Airport is about 25 minutes from Alimos by road; boarding the day you land is the usual pattern, and the five-night Saronic week is the shortest programme this house writes",
    ],
    evidence: { label: "Depths and shelter from the Kythnos anchorage guide", href: "/yacht-charter-kythnos-anchorages" },
  },
  "yacht-charter-paros-3-day": {
    quickAnswer: {
      question: "Can you charter a yacht from Paros for three days?",
      answer:
        "Not from this house as a stand-alone charter: we write weekly programmes, and the shortest we place is the five-night Saronic week from Athens, Aegina 18 nautical miles, Poros 25 and Hydra 35 on the house table. What three days from Paros look like is the opening of a Cyclades week: Naoussa, the Antiparos channel and Despotiko, all within 5 to 12 miles of Parikia. One price per yacht with crew, from the Greek Charter Index 2026: a 16 to 19 metre sailing catamaran EUR 18,900 to 27,500 a week, a 22 to 24 metre motor yacht 21,000 to 33,000, with any shorter programme quoted by the owner from the weekly rate.",
    },
    keyFacts: [
      "This house writes weekly charters; the five-night Saronic week from Athens is the shortest programme it places",
      "Five-night Saronic legs on the house table: Alimos to Aegina 18 nm, Poros 25, Hydra 35, Spetses 50",
      "The first three days of a Paros week: Naoussa (8 to 15 m over sand), the Antiparos channel (5 nm), Despotiko (4 to 9 m over sand, sheltered in a northerly)",
      "Index 2026 bands: 16 to 19 m sailing catamaran EUR 18,900 to 27,500; 22 to 24 m motor 21,000 to 33,000 a week net base, per yacht",
      "Shorter programmes, where an owner accepts one, are quoted from the weekly rate for the whole yacht, never assumed",
      "June and September list 15 to 25% below peak on the Index; July and August book 6 to 12 months ahead",
    ],
    evidence: { label: "The five-night Saronic week, the shortest programme this house writes", href: "/destinations/saronic" },
  },
};

function buildPage(destinationSlug, durationKey) {
  const dest = DESTINATIONS.find((d) => d.slug === destinationSlug);
  const tpl = TEMPLATES[durationKey];
  const itinerary = ITINERARIES[destinationSlug]?.[durationKey] || "";
  const short = tpl.durationMin === 3;
  const week = tpl.durationMin === 7;

  // Athens is both the destination and the region, so the old
  // "from ${name}, ${region}" template rendered "from Athens, Athens" in the
  // Google snippet of all four Athens duration pages. Caught 2026-08-06 while
  // reading why /yacht-charter-athens-7-day takes no clicks.
  const place = dest.name === dest.region ? dest.name : `${dest.name}, ${dest.region}`;

  const slug = `yacht-charter-${destinationSlug}-${durationKey}`;
  const h1 = `${tpl.durationName} Yacht Charter ${dest.name}`;
  const tagline = tpl.framing;

  return {
    slug,
    urlPath: `/${slug}`,
    destinationSlug,
    durationKey,
    eyebrow: `${tpl.durationName} in ${dest.name}`,
    h1,
    tagline,
    // "athens yacht charter cost" is a US query worth 104 impressions over the
    // last 90 days, and Google was answering it with a generic cost blog at
    // position 18.5 rather than this page, which is the exact product: a
    // crewed week out of Alimos. The page already carried the cost answer in
    // its FAQ; nothing in the snippet said so, so nobody clicked to find it.
    // Cost now leads the title and the real band leads the description.
    seoTitle: `${tpl.durationName} Yacht Charter ${dest.name}: Cost and Itinerary`,
    // Kept under 160: the first draft of this line ran to 193 characters on
    // the longer destination names and tripped the Ahrefs cap on 47 pages.
    seoDescription: short
      ? `Three days from ${place}: this house writes weekly charters, the five-night Saronic week is the shortest. How a week from ${dest.departurePort} opens, and Index rates per yacht.`
      : week
        ? `${tpl.durationName} crewed yacht charter from ${place}: EUR ${WEEKLY_INDEX.low} to ${WEEKLY_INDEX.high} a week per yacht on the Index 2026 plus APA and VAT, departure ${dest.departurePort}, day-by-day itinerary.`
        : `${tpl.durationName} crewed yacht charter from ${place}: quoted per yacht from the weekly Index 2026 rate (EUR ${WEEKLY_INDEX.low} to ${WEEKLY_INDEX.high} a week) plus APA and VAT, departure ${dest.departurePort}, day-by-day itinerary.`,
    canonical: `https://georgeyachts.com/${slug}`,
    touristType: ["Yacht charterers", `${dest.region} visitors`],

    whyTitle: `${tpl.durationName} from ${dest.name} - what's realistic`,
    whyBody:
      tpl.paceBody +
      ` ` +
      `**Departure from ${dest.departurePort}.** Best paired with yacht selection that matches the duration: longer trips suit larger yachts with separate crew zones; the five-night Saronic week suits 16 to 22 metre crewed catamarans and 20 to 30 metre motor yachts.`,

    bestFor: tpl.bestForExtra.concat([
      `${dest.name}-departure charters`,
      `Charters built around ${dest.region} itineraries`,
    ]),

    yachtFilter: `_type == "yacht" && cruisingRegion match "*${dest.region}*"`,
    yachtsHeadline: `Yachts based near ${dest.name}`,
    featuredHeading: `${dest.region} fleet for ${tpl.durationName.toLowerCase()} charters`,

    whenTitle: `${tpl.durationName} sample itinerary from ${dest.name}`,
    whenBody: itinerary,
    // Structured day-by-day stops drive the TouristTrip JSON-LD in SeoLanding
    // (gated on this field), making the route machine-extractable for AI.
    itineraryStops: parseItineraryProse(itinerary),
    itineraryRegion: dest.region,

    insiderTitle: "Notes from George",
    insiderTips: [
      `Book ${dest.name}-departure charters 6 to 12 months ahead for July and August, the Greek Charter Index 2026 lead time. Boarding directly from ${dest.departurePort} saves the Athens positioning leg.`,
      `${tpl.durationName} charters work best with a clear priority list - what 2-3 things matter most. The captain optimises around them.`,
      `Crew gratuity convention 10-15% of base rate, at your discretion, handed to the captain at the end. Same convention regardless of charter duration.`,
      `${tpl.durationMin >= 10 ? "Some owners price the second week below the first; the figure is quoted per yacht, never assumed." : "One price per yacht for the whole charter, crew included, divided among the guests however you choose."}`,
      `Ask the captain at day-one briefing about the itinerary's flexibility - Greek weather changes; the route adapts.`,
    ],

    faq: [
      { q: `How much does a ${tpl.durationName.toLowerCase()} yacht charter from ${dest.name} cost?`, a: short
          ? `This house prices by the week, one price per yacht with the crew included. On the Greek Charter Index 2026 the weekly base runs from EUR ${WEEKLY_INDEX.low} for a 14 metre crewed catamaran to EUR ${WEEKLY_INDEX.high} for the yachts above 50 metres; a 16 to 19 metre sailing catamaran lists at EUR 18,900 to 27,500 and a 22 to 24 metre motor yacht at 21,000 to 33,000. The five-night Saronic week, the shortest programme we write, is quoted by the owner from that weekly rate. Add APA of 20 to 40% by yacht type, Greek VAT at the certified rate (5.2 to 12%) and a gratuity of 10 to 15% of base at your discretion.`
          : `One price per yacht per week with the crew included. On the Greek Charter Index 2026 the weekly base runs from EUR ${WEEKLY_INDEX.low} for a 14 metre crewed catamaran to EUR ${WEEKLY_INDEX.high} for the yachts above 50 metres: a 20 to 22 metre sailing catamaran lists at EUR 31,500 to 43,500, a 26 to 31 metre motor yacht at 40,000 to 65,000, a 35 to 40 metre at 60,000 to 120,000.${week ? "" : " The extra days are quoted by the owner from the weekly rate, per yacht."} Add APA of 20 to 40% by yacht type, Greek VAT at the certified rate (5.2 to 12%) and a gratuity of 10 to 15% of base at your discretion.` },
      { q: `Why ${tpl.durationName.toLowerCase()} instead of the standard week?`, a: tpl.durationMin === 3 ? "Because a three-day charter is not a programme this house sells on its own. The shortest we write is the five-night Saronic week from Athens; the three-day outline on this page shows how a week from this port opens." : tpl.durationMin === 7 ? "The 7-day format is the standard Greek charter duration and most yachts are priced around it. Gives real island variety without becoming an extended trip." : tpl.durationMin === 10 ? "Extra 3 days transform the trip. More islands, deeper rhythm, the yacht starts to feel like home by day 6." : "Two-week charters allow the captain and chef to deliver an experience that 7-day charters can't match. Repeat clients increasingly choose 14 days." },
      { q: `Can we customize the itinerary?`, a: `Yes. The sample itinerary above is one common pattern. The captain plans the actual route based on weather, your preferences, and any specific destinations you want included. Brief us at booking.` },
      { q: `What if the weather changes?`, a: `Captains plan with weather flexibility. ${tpl.durationMin >= 7 ? "Multi-day charters typically have 1-2 weather-buffer days built into the route." : "Even on the five-night week, the captain adjusts the planned itinerary to avoid weather and find the best anchorages."} The boat stays in protected anchorages if conditions require.` },
      { q: `Should we board ${dest.name} directly or reposition the yacht from Athens?`, a: `${tpl.durationMin <= 7 ? "For a week or less, direct boarding from " + dest.departurePort + " saves a full day against the Athens positioning leg. A yacht already in the area is the first we propose; positioning a specific yacht based elsewhere is quoted per yacht by the owner." : "For longer charters a positioning fee may apply if you want a specific yacht based elsewhere; it is quoted per yacht by the owner. Ask at booking."}` },
    ],

    ...(DEPTH[slug] || {}),

    ctaTitle: `Plan your ${tpl.durationName.toLowerCase()} ${dest.name} charter.`,
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: `/yacht-finder?region=${encodeURIComponent(dest.region)}`,
  };
}

export const DURATION_PAGES = (() => {
  const out = [];
  for (const dest of DESTINATIONS) {
    for (const dur of Object.keys(TEMPLATES)) {
      out.push(buildPage(dest.slug, dur));
    }
  }
  return out;
})();

export function getDurationBySlug(slug) {
  return DURATION_PAGES.find((p) => p.slug === slug) || null;
}
