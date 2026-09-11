// Comparison landing page data (8 high-commercial-value comparison
// pages). 2026-05-11 Phase 7 SEO strategy doc execution.
//
// Each comparison page targets a high-intent UHNW search ("greece vs
// croatia yacht charter", "motor vs sailing yacht greece") and gives
// a genuinely-useful side-by-side breakdown. These pages convert at
// 5 to 10x the rate of general info content because the visitor is
// already in decision mode.

import { FLEET_COUNT } from "./fleetCount.js";

export const COMPARISONS = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greece-vs-croatia-yacht-charter",
    urlPath: "/greece-vs-croatia-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs Croatia Yacht Charter",
    tagline: "Two Mediterranean classics. Different temperaments. Here is how they actually compare.",
    seoTitle: "Greece vs Croatia Yacht Charter",
    seoDescription: "Greece or Croatia for a crewed yacht week: passages, wind, anchorages, VAT and the published Greek rate bands, compared by a house that writes only Greek weeks.",
    canonical: "https://georgeyachts.com/greece-vs-croatia-yacht-charter",
    touristType: ["UHNW charterers", "Couples", "Families"],

    // 2026-09-11: rewritten from sources this house holds. The May text quoted
    // Croatian VAT, rate gaps and fleet ages nobody had measured, and sold
    // the Dodecanese and Greek-Turkish itineraries this house does not write.
    quickAnswer: {
      question: "Greece or Croatia for a crewed yacht charter?",
      answer:
        "Greece is the bigger sea: three cruising grounds within a week of Athens, the Cyclades, the Saronic and the Ionian, with more anchorages to spread across in August and a crewed fleet priced per yacht per week from EUR 10,900 on the Greek Charter Index. Croatia is the shorter passage: a dense coastal chain where the yacht anchors by lunch, a very large bareboat market and a reduced VAT rate on charter. The first-time charterer often starts in Croatia or the Greek Saronic; the charterer who wants the week to keep changing comes to the Cyclades. This house writes only Greek weeks.",
    },
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000 net base, power catamarans 14,000 to 90,000, motor yachts 17,500 to 235,000, per yacht per week before VAT and APA",
      "Passages on the house table: Alimos to Aegina 18 nautical miles, to Hydra 35, to Mykonos 90; Mykonos to Paros 30, Paros to Santorini 60; Corfu to Paxos 35",
      "Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent",
      "Eighty-eight crewed yachts on the list, 42 catamarans and 46 motor yachts, boarding at Athens, Lefkada or Corfu; 61 carry a walkthrough video on their page",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" },

    whyTitle: "Two Mediterranean destinations, different temperaments",
    whyBody:
      "Greece and Croatia are the two big-name charter grounds of the Mediterranean after the Côte d'Azur. Both run a season from May to October, both have working charter fleets, both will give you a memorable week. **They are not the same trip**, and the choice matters more than most charterers realise. " +
      "**Greece is the bigger, more varied ground**. This house works three of its cruising grounds, each with its own wind, anchorages and character: the Cyclades for the white villages, the long views and the Meltemi; the Ionian for sheltered green water and short legs between Corfu, Paxos, Lefkada and Ithaca; the Saronic for the classics within an afternoon of Athens, Aegina 18 nautical miles from Alimos and Hydra 35. " +
      "**Croatia is more concentrated**. A long coast and a dense island chain in protected water, with short day-sails between anchorages and walled medieval towns as the visual signature. It is the easier week to run and the gentler introduction to chartering. " +
      "**On price, the Greek side is published and the Croatian side is not ours to publish**. On the Greek Charter Index 2026 a crewed sailing catamaran runs from EUR 10,900 a week net base at 14 metres to 90,000 at 24, a power catamaran 14,000 to 90,000, a motor yacht from 17,500 at 20 metres to 150,000 at 39, each figure the lowest and highest on a rate card this house holds. Croatia is usually the cheaper week at the same length; ask the operator for the gross total with tax and provisioning and set it against a Greek proposal that already itemises those lines. " +
      "**The decision usually comes down to mood**. For the Cyclades and the energy of Mykonos, Greece. For walled-town romance and sheltered family sailing, Croatia or the Greek Ionian. For a first crewed week with the shortest passages, Croatia or the five-night Saronic week from Athens. We brief honestly on both, and book only the Greek one.",

    bestFor: [
      "First-time charterers deciding where to start",
      "Repeat charterers who have done Croatia and want a different sea",
      "Families weighing Cycladic passages against sheltered Ionian legs",
      "Charterers who want the Greek rate bands and the tax line in front of them before choosing",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How the comparison breaks down",
    whenBody:
      "**Season**: Greece May to October, with late September and October the connoisseur weeks; Croatia May to September. " +
      "**Weekly rate**: the Greek bands are published per yacht per week on the Index 2026; the Croatian figure is the operator's to quote, and it is usually lower at the same length. " +
      "**APA**: Greece 20 to 30 per cent of base under sail and on catamarans, 30 to 40 per cent on motor yachts, reconciled at cost with the balance returned. " +
      "**VAT**: Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent. Croatia applies a reduced rate to yacht charter. " +
      "**Wind**: the Meltemi in the Cyclades at 15 to 25 knots for days at a stretch in July and August; the Ionian and the Saronic gentle; Croatian summers generally settled. " +
      "**Passages**: Cyclades 25 to 60 nautical miles on the house table, Saronic 12 to 35, Ionian 20 to 50; Croatia short hops. " +
      "**Anchorages**: Greek bays taken at anchor with alternatives within a morning's sail of every famous one; Croatian bays sheltered and, in August, shared. " +
      "**Provisioning**: the Greek chef re-provisions island by island; Croatia largely from the departure port. " +
      "**Bareboat**: not offered by this house; Croatia is one of the largest bareboat markets in Europe. " +
      "**Culture**: Delos, Athens and Hydra against walled Dalmatian towns; different centuries, equally rich.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If you have never chartered, Croatia or the Greek Saronic is the easier first week: short passages, sheltered water, a gentle learning curve.",
      "If you have chartered before, the Cyclades give you more variety and a stronger sense of place, and the Meltemi is the captain's problem, not yours.",
      "August is busy on every popular Mediterranean coast. The Greek answer is geography: when Mykonos is full, Rhenia and Kalafati are a few miles away.",
      "This house does not write cross-border or Croatian weeks. If Croatia is the right answer for you, we will say so.",
    ],

    faq: [
      {
        q: "Is Greece or Croatia cheaper for yacht charter?",
        a: "At the same length of yacht, Croatia is usually the cheaper week. The Greek side is published: crewed catamarans from EUR 10,900 and motor yachts from 17,500 a week net base on the Greek Charter Index 2026, before VAT at the yacht's certified rate and APA of 20 to 40 per cent. We do not publish Croatian figures we cannot source; compare gross totals."
      },
      {
        q: "Which has better weather for yacht charter?",
        a: "Croatian summers are generally settled. The Greek Cyclades carry the Meltemi from late June to early September, 15 to 25 knots for days at a stretch, which sailors enjoy and families route around; the Ionian and the Saronic are calm. June and September in the Cyclades are mostly free of it."
      },
      {
        q: "Are Greek or Croatian charter yachts better quality?",
        a: "Both markets have serious crewed yachts. On this house's list are 88, 42 catamarans and 46 motor yachts up to 64 metres, and 61 of them carry a walkthrough video on their page so you can judge for yourself."
      },
      {
        q: "Can we charter from Greece to Croatia or the other way?",
        a: "Not through this house. Our weeks begin and end in Greek waters, at Athens, Lefkada or Corfu. Two separate charters in different years is the practical answer."
      },
      {
        q: "Which has better food?",
        a: "Aboard, Greece, because the chef provisions island by island as the yacht moves. Ashore, both eat very well; Croatia's wine and olive oil are a genuine strength."
      },
    ],

    ctaTitle: "Charter in Greece for 2027?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ───────────────────────────────────────────────────────────── (2026-06-29)
  {
    slug: "greece-vs-spain-yacht-charter",
    urlPath: "/greece-vs-spain-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs Spain Yacht Charter",
    tagline: "The Aegean islands and the Balearics. Two summer worlds, very different in cost and character.",
    seoTitle: "Greece vs Spain Yacht Charter",
    seoDescription: "Greece or the Balearics for a crewed yacht week: VAT, berths, cruising ground and the published Greek rate bands, compared by a house writing only Greek weeks.",
    canonical: "https://georgeyachts.com/greece-vs-spain-yacht-charter",
    touristType: ["UHNW charterers", "Couples", "Families"],

    // 2026-09-11: foreign tax stated as structure, Greek figures from the Index.
    quickAnswer: {
      question: "Greece or Spain for a crewed yacht charter?",
      answer:
        "Spain means the Balearics: Mallorca, Menorca, Ibiza and Formentera, a compact cluster with short hops, the Mediterranean's superyacht hub at Palma, and the glamour of Ibiza. Greece is the larger and more varied ground, three cruising grounds from one country, with a charter VAT rate that is a property of the yacht and written into the contract, and crewed weekly rates published by band on the Greek Charter Index from EUR 10,900. For nightlife and short glamorous hops, the Balearics. For variety, anchorage choice and a settled tax line, Greece, which is the only sea this house writes.",
    },
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000 net base, motor yachts 17,500 to 235,000, per yacht per week before VAT and APA",
      "Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent; Spain applies its standard rate to charter with no reduced charter rate",
      "Greek anchorages are taken at anchor or on buoys and do not need a berth booked a year ahead",
      "Three grounds this house works: the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" },

    whyTitle: "Two summer destinations, very different economics",
    whyBody:
      "Greece and Spain are both first-rank Mediterranean charter grounds, but they are not the same trip and the cost difference is larger than most charterers expect. " +
      "**Spain means the Balearics**: Mallorca, Menorca, Ibiza and Formentera, a compact four-island cluster with short hops between anchorages. Palma de Mallorca is the Mediterranean's superyacht hub and refit capital, so large-yacht inventory is deep. The signature is glamour: Ibiza's club scene, Formentera's turquoise sandbars, and some of the busiest and most sought-after August berths in the Mediterranean. " +
      "**Greece is the larger, more varied ground**: this house works three of its cruising grounds, the Cyclades, the Saronic and the Ionian, with far more anchorage choice over a week and a depth of culture, Delos, Athens, Hydra, Corfu, that the Balearics cannot match. " +
      "**The tax difference is structural**. Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling, and the rate is stated in the contract before you sign. Spain applies its standard VAT rate to charter with no reduced charter rate. We do not advise on Spanish tax; ask the operator for the gross figure. " +
      "**The decision comes down to what the week is for**. For nightlife, glamour and short glamorous hops, the Balearics. For variety, culture, anchorage choice and a settled tax line, Greece. We brief honestly on both and book only the Greek one.",

    bestFor: [
      "Charterers weighing glamour against variety",
      "Anyone who wants the tax line settled before signing",
      "Repeat charterers alternating Mediterranean destinations",
      "Groups deciding between Ibiza-style nightlife and a fuller island week",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How the comparison breaks down",
    whenBody:
      "**Charter season**: both roughly May to October. " +
      "**VAT on charter**: Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent; Spain standard rate, no reduced charter rate. " +
      "**Cruising ground**: Greece three grounds from one country, with alternatives within a morning's sail of every famous bay; the Balearics compact, four islands, short hops. " +
      "**Berths**: Balearic August berths are among the most sought-after in the Mediterranean and are booked well ahead; Greek yachts take the famous harbours at anchor or on buoys and tender in. " +
      "**Fleet**: Palma is the place to find and refit very large motor yachts; this house's list runs to 50 metres in LA PELLEGRINA 1 and 64 in ELYSIUM, with 88 crewed yachts in all. " +
      "**Wind**: the Meltemi in the Cyclades at 15 to 25 knots in July and August; the Ionian and the Saronic calm; Balearic summers generally calmer. " +
      "**Crowds**: Ibiza and Formentera in August are intensely busy; Greece spreads across far more anchorages. " +
      "**Culture**: Greece materially deeper; the Balearics lean lifestyle and beach.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "The tax line is the first thing to compare. In Greece it is a property of the yacht and it is in the contract; in Spain it is the standard rate. Ask for gross figures on both sides.",
      "Palma is the place to find and refit a specific very large motor yacht. Above 64 metres we say so and help you look elsewhere.",
      "You cannot sensibly combine both in one charter; they are well over 700 nautical miles apart. Pick one per trip.",
      "For a first glamorous long weekend, Ibiza and Formentera are hard to beat. For a full week with range, Greece gives more, and the five-night Saronic week from Athens is the shortest programme this house writes.",
    ],

    faq: [
      {
        q: "Is Greece or Spain cheaper for yacht charter?",
        a: "Greece is usually the lower all-in, and the clearest reason is tax: Greek crewed charters are invoiced at the yacht's certified rate of 5.2 to 12 per cent, stated in the contract, while Spain applies its standard VAT rate with no reduced charter rate. The Greek weekly bands are published on the Greek Charter Index 2026; we do not publish Spanish rates we cannot source."
      },
      {
        q: "Which has better nightlife, Greece or Spain?",
        a: "Both are strong. Ibiza has the deepest club scene in the Mediterranean; Mykonos is its closest Greek equivalent. For pure nightlife the Balearics edge it; for nightlife plus a varied island week, Greece."
      },
      {
        q: "Can we charter one yacht across both Greece and Spain?",
        a: "Not practically, and not through this house. The two grounds are well over 700 nautical miles apart; a single charter spanning both means days of open-water transit. Charter one per trip."
      },
      {
        q: "Which has better anchorages?",
        a: "Greece offers more variety and more open anchorages across three grounds, with depth, holding and shelter for each on the house anchorage guides. The Balearic calas are beautiful and sheltered but fewer and very crowded in peak season."
      },
    ],

    ctaTitle: "Charter in Greece for 2027?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ───────────────────────────────────────────────────────────── (2026-06-29)
  {
    slug: "mykonos-vs-santorini-yacht-charter",
    urlPath: "/mykonos-vs-santorini-yacht-charter",
    eyebrow: "Cyclades Comparison",
    h1: "Mykonos vs Santorini Yacht Charter",
    tagline: "The two Cyclades names everyone knows. One is a base, the other is a stop, and that difference shapes the whole week.",
    quickAnswer: {
      question: "Mykonos or Santorini for a yacht charter week?",
      answer:
        "Mykonos as the base, Santorini as the final stop. Mykonos has real anchorages, Ornos, Psarou, Panormos, Elia, Kalo Livadi, so the yacht picks a lee for the Meltemi and stays two or three nights; Santorini is a flooded caldera too deep to anchor, served by Ammoudi's mooring buoys under Oia or Vlychada marina on the south coast. The two islands are 80 nautical miles apart on the house table, so the week runs north to south with the wind behind you and breaks the passage at Paros, Naxos or Ios.",
    },
    keyFacts: [
      "Mykonos to Santorini 80 nm on the house table; from Athens (Alimos) Mykonos is 90 nm and Santorini 130",
      "Mykonos anchorages: Ornos 8 to 12 m over sand, sheltered from N and NW; Panormos, Elia and Kalo Livadi give the other lees",
      "Santorini: conventional anchoring is not practical in the caldera; Ammoudi mooring buoys book a week or two ahead in peak, Vlychada marina is the alternative",
      "The leg breaks at Paros, Naxos or Ios: Mykonos to Paros 30 nm, Naxos to Santorini 55, Ios to Santorini 25",
      "Delos and Rhenia sit beside Mykonos: the archaeological island and an uninhabited swim stop in one day",
      "Rates from the Greek Charter Index 2026, one price per yacht per week with crew; July and August book 6 to 12 months ahead",
    ],
    evidence: { label: "Anchorage depths, shelter and buoys from the Greek anchorages database", href: "/greek-anchorages-database" },
    // 2026-08-06 (job 8) — the US queries landing here are route queries,
    // "yacht charter mykonos to santorini" and its reverse, 29 impressions at
    // position 12.3 with no clicks. They are not asking which island is
    // better, they are asking whether the two go together in one week. This
    // page's own thesis answers exactly that (one is a base, the other a
    // stop), so the title now says so. "Mykonos vs Santorini Yacht Charter"
    // is kept intact at the front. This page is also now the single canonical
    // for the pair; see the note in articleSeo.js.
    seoTitle: "Mykonos vs Santorini Yacht Charter: Which Base, and Doing Both",
    seoDescription: "Mykonos to Santorini on one charter week: which island is your base, which is the stop, and how the anchorages, the caldera and the logistics actually work.",
    canonical: "https://georgeyachts.com/mykonos-vs-santorini-yacht-charter",
    touristType: ["UHNW charterers", "Couples", "Families"],

    whyTitle: "One is a base, the other is a stop",
    whyBody:
      "Mykonos and Santorini are the two Cyclades names first-time charterers know, and the single most useful thing a broker can tell you is that they play completely different roles in a charter week. " +
      "**Mykonos works as a base**. It has genuine, usable anchorages, Ornos, Super Paradise, Panormos, Elia, Kalo Livadi, so you can pick a lee depending on the Meltemi and stay put. It has the beach clubs and the nightlife, a vibrant chora, and it is the natural gateway to Delos (the archaeological island) and Rhenia (an uninhabited swim stop next door). You can comfortably spend two or three nights here. " +
      "**Santorini is a stop, not a base**. The island is a flooded volcanic caldera, which means the water is extraordinarily deep, often too deep to anchor conventionally, and there are very few protected bays. Yachts use the limited caldera mooring buoys or the marina at Vlychada on the south coast, and tender logistics are awkward because the town sits on top of steep cliffs (Ammoudi and the old port below Fira). What Santorini delivers is the view, and the best way to experience it is to arrive by sea at sunset, when the caldera reveals itself in stages. " +
      "**So the honest plan is**: base your week around Mykonos and the central Cyclades, and visit Santorini for one or two nights as the dramatic centrepiece, ideally approaching it under way rather than trying to live there.",

    bestFor: [
      "First-time Cyclades charterers deciding where to spend nights",
      "Couples wanting the Santorini caldera without the logistics headache",
      "Groups balancing Mykonos nightlife with Santorini romance",
      "Charterers planning a realistic Cyclades week, not two postcards",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How they compare for a charter",
    whenBody:
      "**As a base**: Mykonos yes (real anchorages); Santorini no (deep water, few protected bays). " +
      "**Anchoring**: Mykonos has multiple lee-side options for the Meltemi; Santorini relies on limited caldera mooring buoys or Vlychada marina. " +
      "**The signature**: Santorini's caldera and Oia sunset are unmatched and best seen from the water; Mykonos is about beaches, beach clubs, and energy. " +
      "**Day trips**: Mykonos opens Delos (archaeology) and Rhenia (swim); Santorini is more a destination in itself than a hub. " +
      "**Nightlife**: Mykonos is one of the Mediterranean's nightlife capitals; Santorini is quieter and more romantic. " +
      "**Meltemi**: both are exposed in July-August, but Mykonos gives you more sheltered choices to move between. " +
      "**Logistics**: Mykonos is straightforward by tender; Santorini's cliffs and limited moorings reward planning and an early booking.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Do not plan to anchor and live off Santorini. Treat it as a one or two night stop and book a caldera mooring or Vlychada berth well ahead.",
      "Arrive at Santorini by sea in the late afternoon. The caldera approach at golden hour is the moment the photographs never capture.",
      "Base nights around Mykonos, Paros, or Naxos where the anchorages are usable, then make Santorini the centrepiece, not the home.",
      "In strong Meltemi weeks, Mykonos lee anchorages give you options Santorini simply does not have.",
      "A classic Cyclades week pairs both: Mykonos and Delos early, the central Cyclades in the middle, Santorini as the finale.",
    ],

    faq: [
      {
        q: "Can you anchor a yacht in Santorini?",
        a: "Only in a limited way. The caldera is a flooded volcano with very deep water and few protected bays, so conventional anchoring is difficult. Yachts use the limited caldera mooring buoys or the marina at Vlychada on the south coast. Santorini is best treated as a one or two night stop, not an anchoring base."
      },
      {
        q: "Is Mykonos or Santorini better for a yacht charter week?",
        a: "Mykonos as a base, Santorini as a stop. Mykonos has usable anchorages, nightlife, and day trips to Delos and Rhenia, so you can spend several nights there. Santorini delivers the caldera view but is hard to anchor at, so visit it for one or two nights, ideally arriving by sea."
      },
      {
        q: "Which has better nightlife?",
        a: "Mykonos, clearly. It is one of the Mediterranean's nightlife capitals, with beach clubs and a vibrant chora. Santorini is quieter and leans romantic, sunset dinners and the caldera rather than clubs."
      },
      {
        q: "Should we visit both in one charter?",
        a: "Yes, and most Cyclades weeks do. The natural rhythm is Mykonos and Delos early, the central Cyclades (Paros, Naxos, the lesser Cyclades) in the middle, and Santorini as the finale, approached under way at sunset."
      },
      // 2026-08-11 - "yacht charter mykonos to santorini" (57 impressions at
      // 11.2) and "yacht charter santorini to mykonos" (39 at 11.2) together
      // carry 96 impressions on this page with zero clicks, and neither phrase
      // appeared on it once. The page answers the comparison; the searcher is
      // asking about the passage. Same page, same answer, the words they type.
      {
        q: "Is a yacht charter Mykonos to Santorini worth doing in one week?",
        a: "Yes, and it is the single most requested leg in the Cyclades. The two islands sit 80 nautical miles apart on the house distance table, a full day under power and too long for one day under sail, so the sensible version breaks the passage at Paros, Naxos or Ios rather than running it in one push. Going south you have the Meltemi behind you, which is why we build the week Mykonos first and Santorini later rather than the reverse."
      },
      {
        q: "Can you charter a yacht Santorini to Mykonos instead?",
        a: "You can, and in July and August you will feel the difference. A yacht charter Santorini to Mykonos runs into the Meltemi rather than with it, so the same distance takes longer and is less comfortable, particularly for anyone prone to seasickness. If your flights dictate that direction, we plan longer sea days in the morning when the wind is lightest and we choose a heavier yacht. If your dates are flexible, fly into Santorini and sail north early in the season, or reverse the whole week."
      },
    ],

    ctaTitle: "Plan your Cyclades week",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "greece-vs-french-riviera-yacht-charter",
    urlPath: "/greece-vs-french-riviera-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs French Riviera Yacht Charter",
    tagline: "The Aegean and the Côte d'Azur. Two very different ways to spend a week at sea.",
    seoTitle: "Greece vs French Riviera Yacht Charter",
    seoDescription: "Greece or the French Riviera for a crewed yacht week: cost, anchorages and the published Greek rate bands, compared by a house writing only Greek weeks.",
    canonical: "https://georgeyachts.com/greece-vs-french-riviera-yacht-charter",
    touristType: ["UHNW charterers", "Repeat charterers"],

    // 2026-09-11: the May text priced a 35 metre yacht on both coasts from
    // nowhere and counted Michelin stars; the Greek band is now the Index's.
    quickAnswer: {
      question: "Greece or the French Riviera for a crewed yacht charter?",
      answer:
        "The Riviera is the social charter: one short, celebrated coast, the largest concentration of big yachts in the Mediterranean, the Monaco calendar and the restaurants ashore. Greece is the landscape charter: three cruising grounds within a week of Athens, room at anchor in August, a chef who provisions island by island, and a crewed fleet whose weekly rates are published by band on the Greek Charter Index. A charterer who wants the scene chooses the Riviera. A charterer who wants the sea chooses Greece, the only sea this house writes.",
    },
    keyFacts: [
      "Greek motor yachts on the Index 2026: EUR 59,900 to 150,000 a week net base at 35 to 40 metres, 83,300 to 140,000 at 45 to 48, 162,500 to 235,000 above 50 metres",
      "Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent; the Riviera charges standard-rate VAT with reductions tied to time outside EU waters",
      "Sixteen yachts above 35 metres on this house's list, all based in Athens; the largest LA PELLEGRINA 1 at 50 metres and ELYSIUM at 64",
      "Alimos to Hydra 35 nautical miles, Alimos to Mykonos 90, on the house table",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" },

    whyTitle: "Two icons of Mediterranean yachting",
    whyBody:
      "The **French Riviera** is the cradle of modern yachting, where the format was invented and where the yacht shows are held. The infrastructure is unmatched, the glamour unrelenting, and it is the most expensive charter coast in the Mediterranean. " +
      "**Greece** is the older sea. The islands are sharper, the water clearer, the food simpler, and the crewed fleet is now the same builders and the same refits you would find in Antibes: 88 yachts on this house's list, 61 with a walkthrough video on their page. " +
      "**The deepest difference is pace**. A Riviera week is a social tour, Monaco to Saint-Tropez by way of the restaurants. A Greek week is a quieter arc: dawn at anchor off Folegandros, a swim before breakfast, dinner on the aft deck in a bay with three other boats. Both are luxury. Different luxury. " +
      "**On price, we publish what we hold**. On the Greek Charter Index 2026 a 35 to 40 metre crewed motor yacht lists at EUR 59,900 to 150,000 a week net base, a 45 to 48 metre at 83,300 to 140,000, and the two yachts above 50 metres at 162,500 to 235,000, before APA of 30 to 40 per cent and Greek VAT at the yacht's certified rate. The Riviera is the more expensive coast; we do not publish a Riviera figure we cannot source.",

    bestFor: [
      "Charterers comparing the two coasts feature by feature",
      "Riviera charterers considering a Greek season",
      "Families who want room at anchor and sand-bottomed bays",
      "Anyone who wants the yacht's weekly rate and tax line in front of them before choosing",
    ],

    yachtFilter: null,

    whenTitle: "Side-by-side breakdown",
    whenBody:
      "**Glamour and social scene**: the Riviera, outright. Greece gives you cinematic anchorages and quieter prestige. " +
      "**Cost**: the Greek bands are published per yacht per week on the Index 2026; the Riviera is the most expensive charter coast in the Mediterranean. " +
      "**VAT**: Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent. The Riviera charges standard-rate VAT with reductions tied to time outside EU waters; ask for the gross figure. " +
      "**Anchorage**: the Riviera is a short coast with berths as the night stop and shared anchorages in season; Greece is island anchorages with alternatives a few miles from every famous bay. " +
      "**Restaurants**: the Riviera's tables ashore are its strongest argument; the Greek week eats aboard, provisioned island by island, with serious tables in Athens, Mykonos and Santorini for the nights you want them. " +
      "**Wind**: the Mistral on the Riviera, occasional; the Meltemi in the Cyclades in July and August, with the Ionian and the Saronic calm. " +
      "**Very large yachts**: above 70 metres the Riviera has the depth; this house's list runs to 50 and 64 metres.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If being seen matters, the Riviera in August is irreplaceable. If you actually want quiet, Greece.",
      "Charterers who want both do two separate weeks in the same year; the passage between the two is well over a thousand nautical miles and this house writes only the Greek one.",
      "The same budget buys more yacht and more nights at anchor in Greece. The Riviera premium buys the scene; decide whether that is what you are paying for.",
      "Crew gratuity convention is the same, 10 to 15 per cent of the base, at your discretion.",
    ],

    faq: [
      {
        q: "Is the French Riviera always more expensive than Greece?",
        a: "It is the most expensive charter coast in the Mediterranean, and Greece is generally the lower bill for the same yacht and dates. The Greek side is published: a 35 to 40 metre crewed motor yacht at EUR 59,900 to 150,000 a week net base on the Greek Charter Index 2026, before APA of 30 to 40 per cent and VAT at the yacht's certified rate. We do not publish Riviera figures we cannot source."
      },
      {
        q: "Which has better restaurants accessible from a yacht?",
        a: "Ashore, the Riviera, by a margin. Aboard, Greece, because the chef provisions island by island. Decide which of the two dinners you are chartering for."
      },
      {
        q: "Where is the better sailing?",
        a: "Greece. The Meltemi gives the Cyclades real wind in July and August, the Ionian gives gentle sailing between Corfu, Paxos, Lefkada and Ithaca, and this house's list has 27 crewed sailing catamarans and six crewed sailing yachts for it. The Riviera is best for short coastal motor-yacht hops."
      },
      {
        q: "What about the social scene?",
        a: "The Riviera in late July and August is the epicentre of yacht social life. Mykonos approaches that energy in August; the rest of Greek water is decidedly more private, and the quiet anchorage is a few miles away when you have had enough."
      },
      {
        q: "Can we combine the Riviera and Greece?",
        a: "In two separate charters, yes. This house writes the Greek one, from Athens, Lefkada or Corfu; the Riviera week is not ours to arrange."
      },
    ],

    ctaTitle: "Charter Greek waters for 2027?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "greece-vs-turkey-yacht-charter",
    urlPath: "/greece-vs-turkey-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs Turkey Yacht Charter",
    tagline: "Same sea, different shores. The comparison for a charterer choosing between them.",
    seoTitle: "Greece vs Turkey Yacht Charter | Comparison",
    seoDescription: "Greece or Turkey for a crewed yacht week: contract, VAT, gulets, coastline and the published Greek rate bands, compared by a house that writes only Greek weeks.",
    canonical: "https://georgeyachts.com/greece-vs-turkey-yacht-charter",
    touristType: ["Repeat charterers", "UHNW families"],

    // 2026-09-11: the May text sold Greek-Turkish cross-charters from the
    // Dodecanese "we handle the logistics" and priced a 35 metre yacht on both
    // shores from nowhere. This house writes no cross-border weeks.
    quickAnswer: {
      question: "Greece or Turkey for a crewed yacht charter?",
      answer:
        "Greece and Turkey share the Aegean and little else in how a charter is sold. Greece is the EU market: MYBA-standard contracts, the yacht's VAT rate written into the agreement, and a crewed fleet of modern motor yachts and catamarans priced per yacht per week on the Greek Charter Index from EUR 10,900. Turkey is the gulet coast: the traditional wooden charter yacht at scale, a lower cost base and the Lycian shore's remoteness, outside the EU's regulatory frame. For a modern crewed yacht under European terms, Greece. For a gulet week at a lower price, Turkey. This house writes only the first.",
    },
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000, power catamarans 14,000 to 90,000, motor yachts 17,500 to 235,000, net base per yacht per week",
      "Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent; Turkey is outside the EU and applies its own standard VAT",
      "Contract: MYBA-standard terms with base fee, certified VAT rate, APA of 20 to 40 per cent and the customary 10 to 15 per cent gratuity itemised before signing",
      "Grounds: the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu; no cross-border weeks and no gulets on the list",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" },

    whyTitle: "The two shores of the Aegean",
    whyBody:
      "Greece and Turkey share the **Aegean Sea** and split its shores, and from the water the coasts can look alike. The charter products do not. " +
      "**Greek waters are the EU market**. The contract is the MYBA form, the brokerage practice is IYBA and MYBA standard, EU shipping rules and data protection apply, and Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2 to 12 per cent, with 13 per cent the ceiling, stated in the contract before you sign. The fleet is modern motor yachts and crewed catamarans: 88 on this house's list, 61 with a walkthrough video on their page. " +
      "**Turkish waters are the gulet market**: the wooden charter yacht built for the purpose on the Bodrum and Marmaris coast, at a lower cost base, outside the EU, with local contract forms alongside the MYBA form. It is usually the cheaper week and we say so; we hold no Turkish rate cards and publish no Turkish figure. " +
      "**What this house does**: weekly, fully crewed charters in the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu. We do not carry gulets, the Greek Charter Index has no gulet band, and we do not write cross-border weeks. If Turkey is the right answer for you, we will say so.",

    bestFor: [
      "Charterers who want a modern, stabilised motor yacht or a crewed catamaran with a full galley",
      "Family offices that want the MYBA form and an EU jurisdiction",
      "Repeat Greek charterers curious about the other shore, told honestly what it is",
      "Anyone weighing a gulet week against a crewed catamaran week",
    ],

    yachtFilter: null,

    whenTitle: "How the comparison breaks down",
    whenBody:
      "**Season**: both roughly May to October. " +
      "**Weekly rate**: the Greek bands are published per yacht per week on the Index 2026; Turkey is usually the cheaper week and the figure is the operator's to quote. " +
      "**VAT**: Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent. Turkey is outside the EU and applies its own standard rate; confirm the gross figure with the operator. " +
      "**Contract**: MYBA-standard in Greece, every line itemised before signing; MYBA and local forms both in use in Turkey. " +
      "**Fleet**: modern crewed motor yachts and catamarans in Greece, 46 and 42 on this list; the gulet at scale in Turkey. " +
      "**Anchorages**: the Greek Cyclades open and dramatic, the Ionian sheltered and green; the Turkish Lycian coast pine-lined, mountainous and quiet by default. " +
      "**Culture ashore**: Delos, Athens and Hydra against Ephesus and the Lycian ruins; both world class. " +
      "**Cross-border**: exists in the trade on yachts whose flag allows it; not written by this house.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "For a gulet week, Turkey has the fleet, the yards and the price. The comparable crewed Greek week is a sailing catamaran of 20 to 22 metres at EUR 31,500 to 43,500 net base, or a crewed sailing yacht of 24 to 31 metres at 24,000 to 55,000, with a full galley and a table that stays set.",
      "If the brief is quieter and cheaper than Mykonos, the Greek answer is Kythnos, Serifos, Sifnos, Folegandros or the inner Ionian, and the captain will route for it if asked.",
      "A charterer who wants both coasts takes two separate weeks. The Turkish one is not ours to arrange.",
      "Ask any non-EU quote whether the figure is gross or net of tax before comparing it with a Greek proposal, which itemises the line.",
    ],

    faq: [
      {
        q: "Is Turkey cheaper than Greece for yacht charter?",
        a: "Usually yes, most clearly on gulets, because the cost base ashore is lower and the fleet is built locally for charter. The Greek side is published: crewed catamarans from EUR 10,900 and motor yachts from 17,500 a week net base on the Greek Charter Index 2026, before VAT at the yacht's certified rate and APA of 20 to 40 per cent. We do not publish a Turkish figure we cannot source."
      },
      {
        q: "Can we charter a yacht that crosses Greece and Turkey?",
        a: "Not through this house. Our weeks begin and end in Greek waters, in the Cyclades, the Saronic and the Ionian. Cross-border charters exist in the trade on yachts whose flag and paperwork allow it; a charterer who wants both coasts takes two separate weeks."
      },
      {
        q: "Is the Turkish charter market regulated like the Greek one?",
        a: "No. Greek charter operates under the MYBA form and EU rules, with the VAT rate stated in the contract. Turkey is outside the EU and runs its own maritime and tax regime, with local contract forms alongside the MYBA form. We do not advise on Turkish contracts."
      },
      {
        q: "Which has better anchorages?",
        a: "Both excellent, and different. The Greek Cyclades have the open-water drama, Mykonos, the Santorini caldera, Folegandros; the Greek Ionian and the Turkish Lycian coast share the sheltered, pine-lined character. The house anchorage guides cover the Greek bays with depth, holding and shelter."
      },
      {
        q: "Does George Yachts charter gulets?",
        a: "No. The Greek Charter Index has no gulet band and this house quotes gulets on request only. For the slow, wide-decked week the crewed sailing catamarans on the list are the Greek equivalent."
      },
    ],

    ctaTitle: "Charter in Greek waters for 2027?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "cyclades-vs-ionian-yacht-charter",
    urlPath: "/cyclades-vs-ionian-yacht-charter",
    eyebrow: "Greek Charter Comparison",
    h1: "Cyclades vs Ionian Yacht Charter",
    tagline: "Two Greek island groups. Different winds, different vibes, different yachts. Choose well.",
    seoTitle: "Cyclades vs Ionian Yacht Charter | Comparison",
    seoDescription: "Cyclades vs Ionian Greek islands for yacht charter: wind, weather, anchorages, recommended yacht types, itineraries. Which fits your charter.",
    canonical: "https://georgeyachts.com/cyclades-vs-ionian-yacht-charter",
    touristType: ["First-time Greek charterers", "Repeat charterers"],

    whyTitle: "Two Greek island groups, two distinct trip personalities",
    whyBody:
      "Most first-time Greek charterers think 'Greek islands' means **Mykonos and Santorini** (the Cyclades). Greek charter veterans usually point them toward the **Ionian** first. The choice between island groups shapes the entire week. " +
      "**The Cyclades** are the iconic Greek-island postcard: dry, sun-bleached cliffs, white-and-blue villages, Meltemi-driven sailing, and the brightest light in the Mediterranean. The mood is cinematic and a little dramatic. Mykonos and Santorini are the headliners, with Paros, Naxos, Antiparos, Folegandros, Sifnos, and Milos filling the supporting cast. " +
      "**The Ionian** is the opposite: green, sheltered, with the calmest charter water in Greek territory. Venetian architecture (Corfu town, Kefalonia's Argostoli), olive groves, soft afternoon winds, anchorages where the boat doesn't budge all night. Lefkada and Corfu are the headliners; Kefalonia, Ithaca, Paxos, and Zakynthos complete the spread. " +
      "**The wind is the deepest difference.** The Cyclades have the Meltemi: a reliable 15-25 knot beam reach from late June through August. Sailors love it. Families and first-time charterers sometimes find it more dramatic than they expected. The Ionian rarely sees above 15 knots in summer; days end with calm anchorages and easy sailing.",

    bestFor: [
      "First-time Greek charterers debating where to start",
      "Families with young children (Ionian usually wins)",
      "Sailing enthusiasts wanting reliable wind (Cyclades wins)",
      "Photography and content production (Cyclades light is harder to beat)",
    ],

    yachtFilter: null,

    whenTitle: "Side-by-side breakdown",
    whenBody:
      "**Visual signature**: Cyclades dry/dramatic/Aegean-blue; Ionian green/sheltered/jade-water. " +
      "**Wind**: Cyclades Meltemi 15-25kt summer; Ionian gentle 8-14kt afternoon thermal. " +
      "**Day-passage**: Cyclades 30-80 nm between islands; Ionian 10-40 nm. " +
      "**Anchorage style**: Cyclades open roadsteads (Mykonos, Santorini caldera, Paros); Ionian sheltered tree-lined bays. " +
      "**Best for**: Cyclades for sailing, photography, Mykonos energy; Ionian for families, gentle pace, post-honeymoon weeks. " +
      "**Marina quality**: Cyclades Mykonos premium, others mixed; Ionian Lefkada, Corfu marinas excellent. " +
      "**Cuisine**: Cyclades seafood-led, mezze culture; Ionian Venetian-Italian influence, more meat. " +
      "**Anchorage roll**: Cyclades meaningful summer swell at unsheltered anchorages; Ionian almost always flat. " +
      "**Best yacht type**: Cyclades motor yachts and performance catamarans handle Meltemi best; Ionian classic sailing yachts and family catamarans thrive. " +
      "**Crowd density (peak August)**: Cyclades busy at marquee anchorages (Mykonos, Paros); Ionian consistently quieter.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "First-time Greek charterers default to Mykonos/Santorini. Most repeat clients prefer the Ionian by year 3.",
      "Both island groups support 7-night charters comfortably. The Cyclades can extend to 10-14 days with more variety; the Ionian is best as 7-10.",
      "If you want both: Athens-Cyclades-Ionian is logistically hard (the boat has to round the southern Peloponnese). Two separate charters work better.",
      "Children under 10 are usually happier in the Ionian. Heel under sail is gentler, anchorages are flatter, swim-from-yacht is safer.",
      "Charter photographers who shoot magazine work choose Cyclades for the light. Wedding photographers split.",
    ],

    faq: [
      {
        q: "Which is better for a first-time Greek charter?",
        a: "The Ionian, in most cases. Shorter passages, gentler wind, flatter anchorages, easier learning curve. The Cyclades are spectacular but the Meltemi can be intense for first-time charterers in July-August. For first-time charters in May-June or September, both work equally well."
      },
      {
        q: "Where is the Meltemi worst?",
        a: "Central Cyclades (Mykonos, Paros, Naxos, Ios) see the strongest summer Meltemi (25-30 knots typical, 35+ in peak weeks). The Ionian is mostly sheltered from the Meltemi entirely. The Saronic (close to Athens) is between the two - moderate exposure."
      },
      {
        q: "Which has better restaurants?",
        a: "Both excellent. Mykonos and Santorini have the densest fine-dining; Ionian (Corfu, Kefalonia, Lefkada) has excellent Venetian-influenced cuisine but less concentration. Ferment restaurants on Lefkada and the new fine-dining wave in Corfu town close some of the gap."
      },
      {
        q: "Are there fewer crowds in the Ionian?",
        a: "Yes, by a meaningful margin. Mykonos and Santorini in August can feel like resort destinations from a sea. Ionian anchorages stay quiet even in peak August. For privacy-focused charters, Ionian is usually the better fit."
      },
      {
        q: "Can a single charter combine Cyclades and Ionian?",
        a: "Logistically difficult: the Cyclades and the Ionian are a passage of several days apart, around the Peloponnese. Most guests pick one for a charter and return for the other, and this house books each as its own week from Athens or from Lefkada and Corfu."
      },
    ],

    ctaTitle: "Plan your Greek charter for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-vs-sailing-yacht-charter-greece",
    urlPath: "/motor-vs-sailing-yacht-charter-greece",
    eyebrow: "Yacht Type Comparison",
    h1: "Motor vs Sailing Yacht Charter Greece",
    tagline: "Speed and stability, or rhythm and wind. The choice that shapes your entire week.",
    seoTitle: "Motor vs Sailing Yacht Charter Greece",
    seoDescription: "Motor vs sailing yacht charter in Greek waters: speed, cost, comfort, sailing experience. Which yacht type fits your Greek charter.",
    canonical: "https://georgeyachts.com/motor-vs-sailing-yacht-charter-greece",
    touristType: ["First-time charterers", "Yacht buyers", "Repeat clients"],

    whyTitle: "Two yacht types, two different charter weeks",
    whyBody:
      "Most charterers focus on yacht size when choosing. The bigger question is **yacht type**. A 25-metre motor yacht and a 25-metre sailing yacht in the same week, in the same waters, give two very different experiences. " +
      "**A motor yacht delivers comfort and pace.** Air-conditioned interiors. Stabilisers that neutralise anchor-side roll. 18-22 knot cruise speeds that let you sleep in two destinations in a day. The format suits guests who value the boat as a luxury hotel that moves. " +
      "**A sailing yacht delivers rhythm and romance.** The day is structured by wind and weather rather than itinerary speed. Anchorages are quieter. Fuel costs are 50 to 60% lower. The rhythm of cutting the engine and reaching across the Aegean under sail is the experience charterers remember for years. " +
      "**Greek waters favour both formats differently by season**. July-August in the Cyclades calls for motor yacht comfort during peak Meltemi (or for experienced sailors who want serious wind for sail-handling). May-June and September across all Greek island groups suit sailing perfectly. The Ionian suits sailing year-round; the open Cyclades in the Meltemi months are where motor yachts shine. " +
      "**Cost-wise, sailing yachts are 30 to 45% cheaper** for equivalent length. A 50-foot sailing yacht with a captain and cook for a couple's week runs €18-28K base; the equivalent 50-foot motor yacht runs €30-50K. The gap narrows above 30 metres where both formats need crews of 5+.",

    bestFor: [
      "First-time charterers debating yacht type",
      "Repeat clients comparing across yacht categories",
      "Couples and families weighing pace vs comfort",
      "Sailing enthusiasts vs comfort-focused families",
    ],

    yachtFilter: null,

    whenTitle: "Decision matrix",
    whenBody:
      "**Choose a motor yacht if**: itinerary covers 2+ island groups in one week, charter is in peak July-August, group includes guests with mobility issues, charter prioritises hotel-style comfort over experience of sailing, budget supports 30 to 45% higher rate. " +
      "**Choose a sailing yacht if**: charter is in May-June or September, group includes anyone curious to experience real sailing, charter prioritises slower pace and quieter anchorages, fuel cost matters to APA budget, charter is in the Ionian or sheltered Saronic. " +
      "**Choose a catamaran if**: family with children under 10, large group (8+) wanting maximum deck space, charter prioritises shallow-draft anchorage access, group includes guests sensitive to motion-sickness. Catamarans split the difference between motor and sailing types - see our catamaran charter page.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "First-time charterers default to motor. Most repeat clients try sailing in year 2 or 3 and either fall in love or confirm motor as their preference.",
      "Sailing yachts feel half-the-size when heeled. A 60-foot motor yacht and 60-foot sailing yacht have very different living-space feels.",
      "Charters in May, June, and September gain the most from sailing - calmer Meltemi, gentler reaching, longer daylight for relaxed sailing days.",
      "If you've never sailed and want to try: a 50-60 foot sailing yacht for a week in the Ionian is the gentlest introduction. We've placed first-time-sailor clients there for 5+ years.",
      "Multi-week charters often combine: week 1 sailing in the Ionian, week 2 motor yacht to the Cyclades. Best of both formats.",
    ],

    faq: [
      {
        q: "Are sailing yachts really cheaper than motor yachts?",
        a: "Yes, typically 30 to 45% cheaper on the base rate for equivalent length. The gap is widest below 25 metres (where sailing crews are smaller) and narrows above 30 metres (where both formats need similar crew counts). APA is also lower on sailing yachts due to fuel savings."
      },
      {
        q: "Is a sailing yacht hard to charter for non-sailors?",
        a: "No. The captain and crew handle everything. Guests are welcome to help (winching, helming, raising the main is a guest favourite) but no experience is required. The trade-off is pace: a sailing week has slower passages than a motor yacht week."
      },
      {
        q: "What about catamarans - are they sailing or motor?",
        a: "Both formats exist. Sailing catamarans (Lagoon, Sunreef, Fountaine Pajot, Bali) are wind-powered. Power catamarans (Sunreef Power, Aquila) have twin engines. See our catamaran charter page for the full breakdown."
      },
      {
        q: "Do motor yachts use a lot of fuel?",
        a: "Yes. APA on motor yachts typically runs 30 to 40% of base rate (vs 20 to 30% on sailing). For a EUR 100,000 base-rate motor yacht in July, expect EUR 30,000 to 40,000 APA, of which fuel is the largest single line item. We brief clients on APA budget at booking."
      },
      {
        q: "Which holds value better for repeat charters?",
        a: "Motor yachts depreciate faster as a class but rotate inventory faster as well, so the available fleet stays modern. Sailing yachts hold value longer and the fleet includes 20-year-old classics in excellent maintenance. Both are stable as charter assets."
      },
    ],

    ctaTitle: "Find your yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-vs-monohull-yacht-charter-greece",
    urlPath: "/catamaran-vs-monohull-yacht-charter-greece",
    eyebrow: "Yacht Type Comparison",
    h1: "Catamaran vs Monohull Yacht Charter Greece",
    tagline: "Two hulls or one. The decision that shapes deck space, stability, and the entire week's character.",
    seoTitle: "Catamaran vs Monohull Yacht Charter Greece",
    seoDescription: "Catamaran vs monohull yacht charter: stability, deck space, sailing performance, cost. Which yacht hull type fits your Greek charter this season.",
    canonical: "https://georgeyachts.com/catamaran-vs-monohull-yacht-charter-greece",
    touristType: ["First-time charterers", "Families", "Sailing enthusiasts"],

    whyTitle: "Two hulls or one, and why it matters more than you'd think",
    whyBody:
      "After yacht type (motor vs sailing), the next biggest decision is **hull configuration**. A catamaran (two hulls connected by a bridge deck) and a monohull (single hull, the traditional yacht format) charter very differently in Greek waters. " +
      "**Catamarans win on space and stability.** A 60-foot catamaran has roughly 40% more usable deck area than a 60-foot monohull and almost zero heel under sail. For families, large groups, and guests sensitive to motion, catamarans are the natural choice. The shallow draft (1.2-1.5 metres typical) also opens anchorages that monohulls cannot reach. " +
      "**Monohulls win on sailing feel and value.** A monohull is more responsive under sail, points higher into wind, and is the format experienced sailors prefer. Per-foot pricing is generally 10 to 15% lower on monohulls of equivalent length, and the master cabin layouts (forward, on the centreline) are typically more generous. " +
      "**The choice usually comes down to who's on board**. Families with children under 12, multi-couple groups, and anyone planning a lot of cocktail-party deck time choose catamarans. Couples with sailing experience, racing-pedigree fans, and budget-conscious charters often choose monohulls. We brief honestly on both.",

    bestFor: [
      "First-time charterers debating hull format",
      "Families with children weighing stability concerns",
      "Multi-generational groups planning trip together",
      "Sailing-experienced charterers comparing options",
    ],

    yachtFilter: null,

    whenTitle: "Side-by-side breakdown",
    whenBody:
      "**Deck space (60-foot)**: Catamaran roughly 200 sqm usable; monohull 110-130 sqm. " +
      "**Heel under sail**: Catamaran 0-5 degrees; monohull 12-25 degrees in moderate wind. " +
      "**Anchor-side roll**: Catamaran near-zero; monohull noticeable in open anchorages with swell. " +
      "**Draft**: Catamaran 1.2-1.5m typical; monohull 2.0-2.8m. " +
      "**Master cabin layout**: Monohulls typically have larger, centreline master cabins; catamarans have smaller cabins distributed across both hulls. " +
      "**Upwind performance under sail**: Monohulls significantly better, point higher into wind. " +
      "**Downwind performance**: Both good; catamarans often faster in moderate wind, monohulls steadier in heavy. " +
      "**Marina fees**: Catamarans charged 1.5x length to account for beam. " +
      "**Charter rate per length**: Monohulls 10-15% cheaper per foot. " +
      "**Crew count needed**: Comparable across formats. " +
      "**Best for families with children under 12**: Catamaran wins comfortably. " +
      "**Best for sailing-purist couples**: Monohull wins.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Heel angles disorient young children. If you have kids under 10, catamarans are the right answer almost always.",
      "Monohulls feel more 'yacht-like' to experienced sailors. The catamaran format takes some adjusting for traditionalists.",
      "Catamarans handle the Meltemi at anchor far better than monohulls. The wide stance kills the roll.",
      "On a charter under 50 feet, monohulls are usually more economic. Above 70 feet, catamarans regain the value due to space.",
      "Master cabin matters for honeymoons. The catamaran master is typically split across both hulls; monohull masters are forward, on the centreline. Look at layouts before booking.",
    ],

    faq: [
      {
        q: "Are catamarans always more expensive than monohulls?",
        a: "Yes, typically 15 to 25% more per equivalent week. The trade-off is significantly more deck space, no heel, and shallow draft. For first-time charterers and families, the premium usually justifies itself. For experienced monohull sailors, monohulls remain the choice."
      },
      {
        q: "Can a catamaran really sail well?",
        a: "Yes, in beam and broad reaches especially. Catamarans are slower upwind than monohulls of equivalent length but often faster downwind in moderate wind. The Sunreef and Outremer custom builds rival monohull performance; production catamarans (Lagoon, Bali, Fountaine Pajot) prioritise comfort over racing pace."
      },
      {
        q: "Are catamarans safe in rough Greek waters?",
        a: "Yes. Catamarans handle the Meltemi 30 to 35 knot gusts with less drama than monohulls. They reef earlier than monohulls and have a higher stability threshold. Capsize risk is theoretical at extreme conditions far beyond charter parameters; in practical charter operations, both formats are equally safe."
      },
      {
        q: "Do catamarans have lower cabin quality than monohulls?",
        a: "Cabin layout differs. Catamaran cabins are smaller individually but more numerous (typically 4 to 6 vs 2 to 4 on equivalent monohulls). Master cabins on monohulls are usually larger and more impressive; catamaran masters are functional rather than statement. Choose by priority: more cabins or grander master."
      },
      {
        q: "Are catamarans easier to dock?",
        a: "Generally yes. Twin engines give very tight manoeuvrability. The trade-off is marina fees are 1.5x length to account for beam, and some smaller marinas have limited catamaran berths."
      },
    ],

    ctaTitle: "Find your yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "crewed-vs-bareboat-yacht-charter-greece",
    urlPath: "/crewed-vs-bareboat-yacht-charter-greece",
    eyebrow: "Charter Type Comparison",
    h1: "Crewed vs Bareboat Yacht Charter Greece",
    tagline: "Hire the boat, or hire the boat and the people who run it. The difference matters more than you'd think.",
    seoTitle: "Crewed vs Bareboat Yacht Charter Greece",
    seoDescription: "Crewed vs bareboat yacht charter in Greek waters: cost, requirements, experience needed, what's included. Which fits your Greek charter.",
    canonical: "https://georgeyachts.com/crewed-vs-bareboat-yacht-charter-greece",
    touristType: ["Yacht charterers", "Sailing enthusiasts", "First-time charterers"],

    whyTitle: "Two charter formats for two different charterers",
    whyBody:
      "**Bareboat charter** means you charter just the boat. You and your party are the crew. You handle navigation, sailing, anchoring, cooking, cleaning, fuelling, and all logistics. The captain of the trip is whoever in your party has the appropriate qualification (typically RYA Day Skipper or Yachtmaster in EU waters). " +
      "**Crewed charter** means you charter the boat with a full crew. At minimum a captain. Usually also a chef, hostess, and sometimes additional deckhands. The crew handles everything; you bring suitcases and preferences. " +
      "**Bareboat is cheaper** (a bareboat sailing yacht in Greece is a fraction of a crewed week on the bareboat operators' rate cards, which this house does not broker; a crewed 12 to 16 metre sailing catamaran on the Greek Charter Index runs EUR 10,900 to 22,000 a week net base, a crewed 24 to 31 metre sailing yacht 24,000 to 55,000). The difference is the crew and the service. Bareboat suits experienced sailors and budget-conscious charterers. Crewed suits charterers who want the boat as a hotel rather than a hands-on activity. " +
      "**Bareboat requires qualifications**. Greek and EU regulations require at least one onboard sailor with valid charter-skipper certification (RYA Day Skipper or equivalent ICC). For yachts over 24 metres, additional commercial endorsements apply. Crewed charters require nothing from guests beyond signing the contract. " +
      `**In Greek waters specifically**, both markets are mature and there are established operators for each. This house does not work in the first one: we write crewed weeks only, and if a bareboat week is what fits your party we will tell you so rather than move you onto a boat that does not. Crewed is the whole of what we do, currently ${FLEET_COUNT} yachts placed personally in Greek waters, every one of them with her crew aboard.`,

    // 2026-08-21 (section 5). Two of these read as a sales list for a
    // product this house does not write, on a page that ranks for people
    // deciding between the two. They now describe who each format suits
    // without any of them being an offer from us.
    bestFor: [
      "Charterers who want the yacht run for them, by her own crew (crewed)",
      "First-time charterers with no sailing experience at all (crewed)",
      "Families and groups who want a chef aboard rather than a galley rota (crewed)",
      "Anything above 50 feet, where running her yourself stops being a holiday (crewed)",
      "Qualified sailors who want the boat and nothing else (bareboat, and not from us)",
    ],

    yachtFilter: null,

    whenTitle: "Side-by-side breakdown",
    whenBody:
      "**Weekly base rate (50-foot sailing yacht)**: Bareboat €4-7K; Crewed €18-28K. " +
      "**Crew**: Bareboat - none, you are the crew; Crewed - typically captain, chef, hostess (3 people minimum). " +
      "**Skipper qualification**: Bareboat requires RYA Day Skipper or equivalent ICC; Crewed requires nothing from guests. " +
      "**Provisioning**: Bareboat - you shop and cook; Crewed - chef shops, cooks, cleans. " +
      "**Fuel and dockage**: Bareboat - you pay separately at each stop; Crewed - covered in APA. " +
      "**Yacht size available**: Bareboat - typically 35 to 55 feet (some 60+); Crewed - 45 to 90+ feet, with most charter market 60-110 feet. " +
      "**Itinerary flexibility**: Bareboat - total guest control, no captain to consult; Crewed - captain advises but follows guest preference. " +
      "**Insurance**: Bareboat - guest assumes more risk; Crewed - captain on the contract reduces guest liability. " +
      "**Suitable for**: Bareboat - sailing-experienced groups, families with sailing parents; Crewed - first-time charterers, UHNW families, large groups.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If you can't sail, charter crewed. Bareboat without experience is dangerous and the bareboat fleet operators will not charter to you.",
      "RYA Day Skipper is the most common qualification. Greek charter operators usually accept it directly; ICC (International Certificate of Competence) is the EU standard.",
      "Bareboat in the Ionian is the gentlest learning ground in Greek waters. Sheltered, easy passages, good marina infrastructure.",
      "Crewed yachts above 30 metres include a chief stewardess who runs hospitality service. Below that, the hostess or captain's partner often doubles up.",
      "The cost difference between bareboat and crewed is real: a 7-night crewed charter for a family of 4 typically costs 4-5x the bareboat equivalent. Decide by what you actually want from the week.",
    ],

    faq: [
      {
        q: "What qualifications do I need to bareboat charter?",
        a: "Greek waters require RYA Day Skipper, ICC (International Certificate of Competence), or equivalent certification. For yachts above 24 metres, commercial endorsement is also needed. Bareboat operators will verify your certification before charter. Without certification, you cannot bareboat in Greek waters."
      },
      {
        q: "Is bareboat really cheaper than crewed?",
        a: "Yes, by a wide margin: a bareboat week on the operators' rate cards is a fraction of a crewed one, where a 12 to 16 metre crewed catamaran starts at EUR 10,900 a week net base on the Greek Charter Index. The trade-off is that you do all the work: sailing, navigation, cooking, cleaning, anchoring, paperwork."
      },
      {
        q: "What if we want the boat with just a captain and nothing else?",
        a: "Yes. Some bareboat operators provide a captain for hire (€800-1200/week) without the full crew. You still handle cooking, provisioning, and other logistics. This is the cheapest path for guests who lack qualification but want bareboat-level cost otherwise. We can coordinate."
      },
      {
        q: "Which is safer?",
        a: "Both are safe with the right setup. Crewed charters are safer for inexperienced guests since the captain handles everything. Bareboat is safe for qualified sailors but assumes more direct responsibility. Insurance differs significantly; crewed contracts shift more risk to the operator."
      },
      {
        q: "Can I bareboat a yacht above 50 feet?",
        a: "Yes, but the qualification requirements get stricter (RYA Yachtmaster Coastal or higher), insurance is more limited, and the boats are physically harder to handle short-handed. Most bareboat sailors above 50 feet hire at least a paid crew member for help. Above 60 feet, bareboat is rare; crewed is standard."
      },
    ],

    ctaTitle: "Charter crewed for 2027?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "athens-vs-mykonos-vs-lefkada-yacht-charter-departure",
    urlPath: "/athens-vs-mykonos-vs-lefkada-yacht-charter-departure",
    eyebrow: "Departure Port Comparison",
    h1: "Athens vs Mykonos vs Lefkada: Where to Start Your Greek Charter",
    tagline: "Three departure ports, three different first days. The choice shapes what's possible in your week.",
    quickAnswer: {
      question: "Athens, Mykonos or Lefkada: where should a Greek yacht charter start?",
      answer:
        "Athens for most weeks: the main international airport, the marinas where most of the yachts this house represents are based, and the Saronic islands 18 to 50 nautical miles away for a first night out of the city. Mykonos when the party is already on the island and wants the Cyclades from day one; the yacht is positioned there for a fee quoted per yacht. Lefkada for the Ionian: sheltered water, Ithaca 20 miles and Kefalonia 25 on the house table, the gentlest week for families. On the Greek Charter Index 2026 peak weeks book 6 to 12 months ahead from any of the three.",
    },
    keyFacts: [
      "From Athens (Alimos) on the house table: Aegina 18 nm, Poros 25, Hydra 35, Kea 35, Kythnos 45, Mykonos 90; from Lavrio, Mykonos is 75",
      "From Lefkada: Ithaca 20 nm, Kefalonia 25, Paxos 50, Corfu 80, on water sheltered from the Meltemi",
      "From Mykonos: Paros 30 nm, Naxos 30, Santorini 80; the Cyclades week runs north to south with the wind behind you",
      "Airports: Athens is the country's main international gateway; Mykonos has direct seasonal flights from May to October; Lefkada is served by Preveza, about 30 minutes by road",
      "Most of the yachts this house represents base in Athens; a Mykonos or Lefkada start is a positioning arranged per yacht, quoted with the rate",
      "Lead time on the Greek Charter Index 2026: 6 to 12 months for July and August; May, June, September and early October list 15 to 25% below peak",
    ],
    evidence: { label: "Lead times and shoulder pricing from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
    seoTitle: "Athens vs Mykonos vs Lefkada Charter Departure",
    seoDescription: "Athens, Mykonos, or Lefkada as your yacht charter departure port? Comparison of access, itineraries, marina quality, and what each starting point unlocks.",
    canonical: "https://georgeyachts.com/athens-vs-mykonos-vs-lefkada-yacht-charter-departure",
    touristType: ["First-time Greek charterers", "Repeat charterers"],

    whyTitle: "The departure port is a bigger decision than it seems",
    whyBody:
      "Most first-time Greek charterers ask about boat, dates, and itinerary. They don't ask about **departure port**. But the port you start from defines the first 12 hours of the trip, the energy of day one, the air-travel logistics, and which islands you can realistically reach in a week. Three departure ports dominate Greek charter: **Athens (Alimos and Lavrio marinas), Mykonos, and Lefkada**. " +
      "**Athens (Alimos marina, 25 minutes from the airport; Lavrio, 60 minutes)** is the operational hub. The largest yacht fleet in Greek waters is based here. Itineraries from Athens flow into the **Saronic** (Hydra, Spetses, Poros), the **central Cyclades** (Kea, Kythnos, Sifnos), or longer eastward arcs to Naxos and Mykonos. Easiest air access (Athens International Airport is the country's largest), best marina infrastructure, but day one of the charter is often spent transitioning out of the city. " +
      "**Mykonos (Mykonos new port)** is the high-glamour departure. Most charterers who start from Mykonos come from a few days at the hotels first. Itineraries flow into the **central and southern Cyclades** (Paros, Naxos, Antiparos, Folegandros, Milos, Sifnos) and can extend south to Santorini for the full Cycladic loop. Excellent direct international flights into Mykonos airport in season (May-October). Marina is smaller and busier than Athens but the location unlocks the most iconic Greek charter week. " +
      "**Lefkada (Lefkada marina, 4 hours from Athens by road or 30 minutes from Preveza airport)** is the Ionian gateway. Itineraries from Lefkada flow into the **Ionian islands** (Kefalonia, Ithaca, Meganisi, Paxos, Corfu). The marina is modern and one of the best in Greek waters. Air access is via Preveza or Athens-plus-drive. The Ionian itinerary is the gentlest, most-family-friendly week in Greek charter.",

    bestFor: [
      "First-time charterers planning their first Greek charter week",
      "Repeat clients comparing destination access",
      "Anyone weighing the air-travel + transfer logistics",
      "Families with young children (Lefkada-Ionian wins)",
      "Guests starting from a Mykonos hotel stay (Mykonos departure)",
    ],

    yachtFilter: null,

    whenTitle: "Three departure ports, three week-shapes",
    whenBody:
      "**Athens (Alimos)**: Best for - first-time charterers, larger groups using the city's full air access. Itinerary unlocks - the Saronic (the five-night week, Aegina 18 nautical miles, Hydra 35), the central Cyclades (the seven-night arc, Mykonos 90), the western Cyclades over ten nights. Marina infrastructure - best in Greece. Transfer time from international flight - about 25 minutes by taxi. " +
      "**Athens (Lavrio)**: Best for - the shortest first leg into the Cyclades, Kea and Kythnos on the first evening. Itinerary unlocks - the same Cyclades as Alimos, with Syros 55 nautical miles and Mykonos 75 from the marina. Transfer from airport - about 60 minutes. Marina is functional but less polished than Alimos. " +
      "**Mykonos**: Best for - Cyclades-focused charters where the party is already on the island. Boarding at Mykonos is a repositioning from the yacht's Athens base, quoted per yacht on the delivery line; most weeks board at Alimos and reach Mykonos on the second or third day. Itinerary unlocks - the full Cycladic loop and the southern Cyclades (Santorini, Milos). Direct international flights into Mykonos airport May to October. " +
      "**Lefkada**: Best for - Ionian charters, family weeks with young children. Itinerary unlocks - Lefkada to Corfu one way over the week, Lefkada to Ithaca 20 nautical miles and Kefalonia 25 in the first days, Zakynthos in the second half, Paxos for the gentlest Ionian week. Air access is Preveza airport (30 minutes) or Athens by road.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Mykonos departure plus a Cyclades arc back to Athens is the magazine-cover Greek charter week. Worth the slightly more complex logistics.",
      "First-time charterers from the US or Asia: book Athens departure. The flight logistics into the country's main airport are simpler.",
      "If your family wants gentle sailing and quiet anchorages, Lefkada is the answer. Don't be talked into Mykonos energy on a family week.",
      "Athens-departure charters often start with day one transiting out to the Saronic. Brief us if this matters; we can build a Mykonos-departure that skips the transit.",
      "Lavrio is underrated. Less crowded marina, the shortest first leg to Kea and Kythnos, but a longer airport transfer. Worth knowing about for repeat clients.",
    ],

    faq: [
      {
        q: "What's the easiest departure port for international guests?",
        a: "Athens (Alimos), by far. Athens International Airport is the country's main gateway, with the widest choice of direct flights, and the marina is about 25 minutes away by road. Most charterers fly in the same day and board the same evening."
      },
      {
        q: "Can we charter a yacht to deliver to a different port for departure?",
        a: "Yes, and a delivery fee applies, quoted per yacht by the owner for the distance and the crew days involved. Most yachts are based at fixed ports, Athens or Lefkada usually, and positioning to Mykonos or Santorini for departure adds that cost. We coordinate it; it is common for repeat clients."
      },
      {
        q: "Is Mykonos departure available year-round?",
        a: "Charter operations from Mykonos run May to October. Outside this window, yachts winter elsewhere and Mykonos-departure becomes uneconomic. For November-April departures, Athens or Lefkada are the options."
      },
      {
        q: "Where do most of the fleet's yachts actually live?",
        a: "Most of the yachts this house represents base in Athens, at the marinas of the Athens Riviera and at Lavrio; a smaller number live in Lefkada for the Ionian season. Mykonos is a seasonal position rather than a home port. When you pick a non-Athens departure, the yacht is typically positioned there for your dates or for a run of weeks in the season."
      },
      {
        q: "Can a charter end at a different port from where it started?",
        a: "Yes, one-way charters are possible. The one-way fee is quoted per yacht and route by the owner and covers bringing the yacht back to base. Common one-way patterns: Athens to Mykonos, Lefkada to Corfu, Athens to Lefkada through the Corinth Canal. We coordinate the routing."
      },
    ],

    ctaTitle: "Plan your departure for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },
];

export function getComparisonBySlug(slug) {
  return COMPARISONS.find((c) => c.slug === slug) || null;
}
