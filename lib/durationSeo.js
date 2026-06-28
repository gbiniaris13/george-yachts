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
    framing: "Long-weekend charter - Friday departure, Sunday or Monday return.",
    paceBody:
      "**A 3-day charter is the long-weekend format**. You board on a Friday afternoon, sail or motor to one or two anchorages over Saturday, return for Sunday or Monday morning disembarkation. The pace is intentionally compact: one or two destinations, not a full island loop. Best suited for charterers who want a memorable weekend rather than a full week's exploration. " +
      "The yacht typically anchors for 2 nights at locations the captain chooses based on weather and your priorities. Day 2 is the central day of the charter: a swim morning, lunch at anchor, a tender excursion to a beach or village, dinner aboard or ashore. The format rewards yachts in the 20-30 metre range - small enough to feel intimate over a short trip, large enough to deliver real luxury.",
    bestForExtra: ["Long weekends (Friday-Monday or similar)", "Birthday or anniversary milestone events", "Quick decompression weeks for executives"],
    durationMin: 3,
  },
  "7-day": {
    durationName: "7 Days",
    eyebrow: "7-day Charter",
    framing: "The standard Greek yacht charter format. Saturday-to-Saturday turnover.",
    paceBody:
      "**A 7-day charter is the standard Greek format** and the duration most yachts in the Greek charter market are priced around. You board Saturday afternoon (after the previous charter disembarks) and disembark the following Saturday morning. The week breaks down naturally: 4-5 days at anchor or short transits, 1-2 marina nights for village evenings, 1 day reserved for weather flexibility or unplanned discoveries. " +
      "The pace allows real exploration. A typical Greek charter week covers 100-180 nautical miles total, with daily transits of 30-60 nm. The captain plans the route based on your preferences; most weeks include 3-5 island stops. By day 4 the yacht starts to feel like home, by day 6 you're not ready for the week to end.",
    bestForExtra: ["First-time charterers wanting the standard experience", "Couples and families settling into the yacht rhythm", "Charterers wanting variety across multiple islands"],
    durationMin: 7,
  },
  "10-day": {
    durationName: "10 Days",
    eyebrow: "10-day Charter",
    framing: "Extended charter - more islands, longer pauses, deeper rhythm.",
    paceBody:
      "**A 10-day charter is the format for serious island exploration**. You gain 3 extra days beyond a standard week, which transforms the trip: the captain can include more remote islands, the pace can slow down at favourite anchorages, and the week starts to feel less like a trip and more like a season. Many of our repeat clients have shifted from 7-day to 10-day charters once they tried both. " +
      "A 10-day charter typically covers 200-280 nm and 5-8 island stops. You can extend a Cycladic loop to include Folegandros and Sifnos, or add the Sporades to an Aegean week, or combine the Ionian with the Saronic Gulf. The chef has time to plan more elaborate dinners. The crew settles into your preferences. The longer format also delivers better per-day economics on most yachts.",
    bestForExtra: ["Repeat charterers stepping up from 7-day", "Families with adult children combining schedules", "Charters covering multiple island groups (Cyclades + Ionian, etc.)"],
    durationMin: 10,
  },
  "14-day": {
    durationName: "14 Days",
    eyebrow: "14-day Charter",
    framing: "Two-week charter - the format for charters that become trips.",
    paceBody:
      "**A 14-day charter is what UHNW repeat clients book** when they've outgrown the 7-day format. Two full weeks aboard a single yacht transforms the experience from 'yacht trip' to 'temporary home'. The crew has time to learn your preferences deeply. The chef can plan a full week of varied menus and start fresh on the second week. The route can cover meaningfully more geography. " +
      "Practical advantages: yacht owners often offer **5-10% discount on the second week** of multi-week charters. Crew gratuity convention is similar to a 7-day week (one gratuity covers both weeks), making the per-day tip economics favourable. The yacht can travel further - Cyclades + Crete + Peloponnese loops become possible. Charters above 14 days are rarer but follow similar discount and routing patterns.",
    bestForExtra: ["UHNW repeat clients wanting deeper time aboard", "Multi-island routes that need real time (Cyclades + Crete, Athens + Sporades + Dodecanese)", "Family reunions and milestone trips combining multiple sub-groups"],
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
    "14-day": "Days 1-2 Santorini. Days 3-5 Cyclades south (Folegandros, Sikinos, Ios, Anafi). Days 6-9 central Cyclades (Naxos, Paros, Antiparos, Mykonos, Delos). Days 10-12 Crete (Heraklion + Chania north coast). Days 13-14 return via Milos to Santorini.",
  },
  athens: {
    "3-day": "Day 1: Alimos board, sail to Aegina for lunch, overnight at Poros. Day 2: Hydra exploration, sunset at anchorage, dinner aboard. Day 3: Morning cruise to Spetses or back to Alimos, disembark.",
    "7-day": "Day 1: Athens to Kea. Day 2 Kythnos. Days 3-4 Sifnos + Serifos. Day 5 Hydra (Saronic loop). Day 6 Poros. Day 7 return to Alimos.",
    "10-day": "Day 1: Athens to Kea. Days 2-3 Cyclades (Sifnos, Serifos, Milos). Day 4 Folegandros. Day 5 Santorini. Day 6 Ios. Day 7 Naxos. Day 8 Mykonos + Delos. Day 9 Kythnos. Day 10 return to Alimos.",
    "14-day": "Days 1-2 Saronic (Hydra, Spetses). Days 3-5 central Cyclades. Days 6-8 southern Cyclades + Santorini. Days 9-11 Sporades (Skiathos, Skopelos, Alonissos). Days 12-13 return via Kea. Day 14 disembark Alimos.",
  },
  lefkada: {
    "3-day": "Day 1: Lefkada Marina board, short sail to Meganisi (Spartochori). Day 2: Ithaca (Kioni harbour for evening). Day 3: Return via Meganisi to Lefkada, disembark.",
    "7-day": "Day 1 Lefkada to Meganisi. Days 2-3 Ithaca (Kioni + Vathy). Day 4 Kefalonia (Fiskardo). Days 5-6 Paxos + Antipaxos. Day 7 return to Lefkada.",
    "10-day": "Day 1 Lefkada to Meganisi. Days 2-3 Ithaca. Day 4 Kefalonia (Fiskardo). Day 5 Zakynthos (Navagio dawn). Day 6 Kefalonia south. Days 7-8 Paxos + Antipaxos. Day 9 Corfu. Day 10 return to Lefkada.",
    "14-day": "Days 1-2 Lefkada + Meganisi. Days 3-4 Ithaca. Day 5 Kefalonia. Days 6-7 Zakynthos. Days 8-9 Paxos + Antipaxos. Days 10-11 Corfu. Day 12 Sivota / Albanian Riviera. Days 13-14 return to Lefkada.",
  },
  corfu: {
    "3-day": "Day 1 Corfu town board, sail south to Paxos (Lakka). Day 2 Paxos + Antipaxos swim. Day 3 return to Corfu via west coast, disembark.",
    "7-day": "Day 1 Corfu to Paxos. Days 2-3 Paxos + Antipaxos. Day 4 Lefkada/Meganisi. Days 5-6 Ithaca + Kefalonia. Day 7 return north to Corfu.",
    "10-day": "Day 1 Corfu to Paxos. Days 2-3 Paxos + Antipaxos. Day 4-5 Lefkada + Meganisi. Days 6-7 Ithaca + Kefalonia. Day 8 Sivota. Day 9 northern Ionian (Othonoi). Day 10 return to Corfu.",
    "14-day": "Days 1-2 Corfu town + Albanian Riviera. Days 3-4 Paxos + Antipaxos. Days 5-6 Lefkada + Meganisi. Days 7-8 Ithaca + Kefalonia. Day 9-10 Zakynthos. Days 11-12 return via Lefkada + Paxos. Days 13-14 Corfu west coast + disembark.",
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
    "14-day": "Days 1-2 Naxos. Days 3-4 Small Cyclades. Days 5-6 Amorgos. Days 7-8 Astypalaia + southern Dodecanese reach. Days 9-10 Santorini + Folegandros. Days 11-12 Paros + Mykonos. Days 13-14 return to Naxos.",
  },
  hydra: {
    "3-day": "Day 1 Hydra harbour board, evening in chora. Day 2 Dokos + Spetses swim/lunch, return Hydra. Day 3 morning swim, disembark.",
    "7-day": "Days 1-2 Hydra. Day 3 Spetses. Day 4 Poros. Day 5 Aegina. Day 6 Cyclades reach (Kythnos). Day 7 return to Hydra.",
    "10-day": "Days 1-2 Hydra. Days 3-4 Spetses + Monemvasia. Day 5 Poros. Day 6 Aegina. Days 7-8 Cyclades (Kythnos + Serifos). Day 9 return via Poros. Day 10 disembark Hydra.",
    "14-day": "Days 1-3 Saronic (Hydra, Spetses, Poros, Aegina). Days 4-5 Peloponnese east coast (Monemvasia, Nafplio). Days 6-9 Cyclades reach (Kythnos, Sifnos, Milos). Days 10-11 Folegandros + Santorini. Days 12-13 return via Cyclades. Day 14 Hydra disembark.",
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

function buildPage(destinationSlug, durationKey) {
  const dest = DESTINATIONS.find((d) => d.slug === destinationSlug);
  const tpl = TEMPLATES[durationKey];
  const itinerary = ITINERARIES[destinationSlug]?.[durationKey] || "";

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
    seoTitle: `${tpl.durationName} Yacht Charter ${dest.name} 2026`,
    seoDescription: `${tpl.durationName} crewed yacht charter from ${dest.name}, ${dest.region}. Departure ${dest.departurePort}. Itinerary, pricing, and yacht selection.`,
    canonical: `https://georgeyachts.com/${slug}`,
    touristType: ["Yacht charterers", `${dest.region} visitors`],

    whyTitle: `${tpl.durationName} from ${dest.name} - what's realistic`,
    whyBody:
      tpl.paceBody +
      ` ` +
      `**Departure from ${dest.departurePort}.** Best paired with yacht selection that matches the duration: longer trips suit larger yachts with separate crew zones; 3-day weekends suit 20-30 metre motor yachts or large catamarans.`,

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
      `Book ${dest.name}-departure charters 4-9 months ahead for peak summer. Boarding directly from ${dest.departurePort} saves Athens positioning leg.`,
      `${tpl.durationName} charters work best with a clear priority list - what 2-3 things matter most. The captain optimises around them.`,
      `Crew gratuity convention 10-18% of base rate paid in cash at end. Same convention regardless of charter duration.`,
      `Multi-week ${tpl.durationMin >= 10 ? "(10+ days)" : ""} charters often qualify for owner discounts on the second week.`,
      `Ask the captain at day-one briefing about the itinerary's flexibility - Greek weather changes; the route adapts.`,
    ],

    faq: [
      { q: `How much does a ${tpl.durationName.toLowerCase()} yacht charter from ${dest.name} cost?`, a: `Base rates scale by yacht size. For ${tpl.durationName.toLowerCase()} the typical range starts around €${tpl.durationMin <= 3 ? "10" : tpl.durationMin <= 7 ? "25" : tpl.durationMin <= 10 ? "40" : "55"}K (smaller yachts) and runs to €${tpl.durationMin <= 3 ? "50" : tpl.durationMin <= 7 ? "140" : tpl.durationMin <= 10 ? "200" : "300"}K+ (30+ metre yachts), plus APA (25-30%) and Greek VAT (12-24%).` },
      { q: `Why ${tpl.durationName.toLowerCase()} instead of the standard week?`, a: tpl.durationMin === 3 ? "Long-weekend charters suit milestone events (birthdays, anniversaries) or executive decompression trips. The format trades depth for memorability." : tpl.durationMin === 7 ? "The 7-day format is the standard Greek charter duration and most yachts are priced around it. Gives real island variety without becoming an extended trip." : tpl.durationMin === 10 ? "Extra 3 days transform the trip. More islands, deeper rhythm, the yacht starts to feel like home by day 6." : "Two-week charters allow the captain and chef to deliver an experience that 7-day charters can't match. Repeat clients increasingly choose 14 days." },
      { q: `Can we customize the itinerary?`, a: `Yes. The sample itinerary above is one common pattern. The captain plans the actual route based on weather, your preferences, and any specific destinations you want included. Brief us at booking.` },
      { q: `What if the weather changes?`, a: `Captains plan with weather flexibility. ${tpl.durationMin >= 7 ? "Multi-day charters typically have 1-2 weather-buffer days built into the route." : "Even on short charters, the captain may adjust the planned itinerary to avoid weather and find the best anchorages."} The boat stays in protected anchorages if conditions require.` },
      { q: `Should we board ${dest.name} directly or repositioning yacht from Athens?`, a: `For ${tpl.durationMin <= 7 ? "shorter charters, direct boarding from " + dest.departurePort + " saves a full day vs Athens positioning. We typically reposition yachts for free during peak summer if you want a specific yacht that bases elsewhere." : "longer charters, repositioning fees may apply if you want a specific yacht. Ask at booking."}` },
    ],

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
