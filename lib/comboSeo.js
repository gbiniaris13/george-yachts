// Tier 3 combo landing pages — yacht-type × destination intersections.
//
// 2026-09-07: fleet composition is imported from lib/fleetCount.js, the one
// place it is written, so no page here can drift from the served fleet.
import { FLEET_COUNT, CATAMARAN_COUNT, FLEET_COMPOSITION } from "@/lib/fleetCount";
//
// 2026-05-11 — Phase 7 Round 3 SEO execution. Strategy doc lists
// 400 possible combos (8 yacht-types × 50 destinations). At that
// scale most pages become thin template fill-ins, which Google
// penalises. Instead we hand-curate the combinations with the
// strongest commercial intent and write distinct content for each
// (28 as of 2026-06 — the COMBOS array below is the source of truth).
// Better a few dozen ranking-quality pages than 400 thin ones.

export const COMBOS = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-mykonos",
    urlPath: "/motor-yacht-charter-mykonos",
    eyebrow: "Motor yacht in Mykonos",
    h1: "Motor Yacht Charter Mykonos",
    tagline: "The Mykonos charter that survives August. Air-conditioned, stabilised, fast enough for Delos by dawn and Antiparos by dinner.",
    seoTitle: "Motor Yacht Charter Mykonos | Crewed Motor Yachts",
    seoDescription: "Crewed motor yacht charter from Mykonos. 18-50 metre motor yachts with chef, stabilisers, full toy fleet. From EUR 17,500 a week, Index 2026.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-mykonos",
    touristType: ["UHNW Mykonos visitors", "Couples", "Families"],

    quickAnswer: {
      question: "What does a motor yacht charter from Mykonos cost, and which yachts fit it?",
      answer:
        "One price per yacht per week with crew, from the Greek Charter Index 2026: a 22 to 24 metre motor yacht EUR 21,000 to 33,000, a 26 to 31 metre 40,000 to 65,000, a 35 to 40 metre 60,000 to 120,000, before APA of 30 to 40% and Greek VAT at the certified rate. The motor yachts this house represents base in Athens, 90 nautical miles from Mykonos on the house table, and are positioned for a Mykonos start at a fee quoted per yacht. The stabilised ones for a Meltemi week: STAR LINK, VISTA and SHERO under 28 metres, SUMMER FUN, PROJECT STEEL, PAREAKI II and ARIELA above 30.",
    },
    keyFacts: [
      "Distances from Mykonos on the house table: Delos and Rhenia 10 nm, Syros 25, Paros (Naoussa) 30, Naxos 30, Santorini 80; Athens (Alimos) 90",
      "Stabilised motor yachts we represent: STAR LINK (Falcon 90, EUR 40,000 to 45,000), VISTA (Princess 85, 55,000 to 59,000), SHERO (Ferretti 26 m, 60,000), SUMMER FUN (30.8 m, 45,000 to 65,000), PROJECT STEEL (34 m, 55,000 to 67,000), PAREAKI II (39 m, 98,000 to 115,000), ARIELA (39.6 m, 105,000 to 120,000), each rate from the yacht's own card",
      "Ten-guest motor yachts under 28 metres from the cards: IRENE'S (Maiora 86, EUR 35,000 to 44,000), RED ROSE (Aicon 85, 35,000 to 44,000), ESTIA ORION (Ferretti 880, 35,900 to 39,900), ONE (Pershing 90, 45,000 to 49,000)",
      "Anchorages from the Mykonos guide: Ornos 6 to 12 m over sand, Psarou 8 to 15, Platis Gialos 6 to 10, all sheltered from the north; Kalafati on the east coast is the best Meltemi shelter on the island",
      "Index 2026: July and August book 6 to 12 months ahead; June and September list 15 to 25% below peak; APA 30 to 40% of base on a motor yacht",
      "Mykonos is first on the Index island ranking, drawn from what clients ask this desk for; the week runs north to south, Mykonos first and Santorini last",
    ],
    evidence: { label: "Depths and shelter from the Mykonos anchorage guide", href: "/yacht-charter-mykonos-anchorages" },

    whyTitle: "Why motor yachts dominate Mykonos charters",
    whyBody:
      "Mykonos is **a motor-yacht destination first**. The combination of the **Meltemi** (a northerly of 15 to 25 knots on summer afternoons, more on a strong day), the inter-island passages (Mykonos to Santorini is 80 nautical miles on the house table), and the comfort expectations of the typical Mykonos charterer all point at the same yacht type. " +
      "A 30-metre motor yacht in Mykonos in August does what no sailing yacht can: anchors stabilised off Ornos at noon, runs the 30 nm to Naoussa on Paros for dinner, and comes back to a Mykonos lee without rolling the master cabin guests out of their beds. The pace matches the energy of the destination. " +
      "The motor yachts this house represents base in Athens. For a Mykonos start the yacht is positioned across the 90 nautical miles from Alimos ahead of your boarding, a fee quoted per yacht by the owner, and the week begins at Ornos or the New Port with dinner ashore rather than a day at sea. The alternative is to board in Athens and make Mykonos the first night: at 20 knots the passage is a morning.",

    bestFor: [
      "Mykonos-based weeks with multiple Cycladic destinations",
      "Charters that include Delos archaeological site day-trip",
      "August charters when Meltemi makes sailing yachts uncomfortable",
      "Repeat Mykonos visitors stepping up from hotel weeks",
      "UHNW principals arriving via Mykonos airport direct flights",
    ],

    yachtFilter: '_type == "yacht" && category == "motor-yachts" && !(retired == true)',
    yachtsHeadline: "Motor yachts for a Mykonos week",
    featuredHeading: "Mykonos-ready motor yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**Mykonos motor yacht weeks book 6 to 12 months ahead** for July and August, the Greek Charter Index 2026 lead time. **June and September** are the most-bookable shoulder weeks with rates 15 to 25% below peak on the Index, the Meltemi has softened, the chora is quieter, the beach clubs still operational. **May and October** are possible but the season is winding down; some boats reposition out by mid-October.",

    insiderTips: [
      "Anchor at Ornos rather than the New Port - quieter, cleaner water, tender to the chora.",
      "Two tenders on the boat matters more in Mykonos than anywhere else. One for guest transfers, one for the chef's market runs. The count is on each yacht's rate card.",
      "Delos is a morning: anchor at dawn, walk the site from opening, back to Ornos for lunch. The captain checks the season's opening hours the day before.",
      "Mykonos marina berths in peak season are among the most expensive in Greece and are paid from the APA. Anchor at Ornos instead unless boarding or disembarking.",
      "Naoussa on Paros for dinner is the yacht-set route: 30 nautical miles, a harbour of tavernas on the water, back to a Mykonos lee for the night.",
    ],

    faq: [
      { q: "How much does a motor yacht charter from Mykonos cost?", a: "On the Greek Charter Index 2026 a 22 to 24 metre motor yacht lists at EUR 21,000 to 33,000 a week net base, a 26 to 31 metre at 40,000 to 65,000, a 35 to 40 metre at 60,000 to 120,000 and the yachts above 50 metres at 162,500 to 235,000, before APA of 30 to 40% and Greek VAT at the certified rate." },
      { q: "Which yachts are based in Mykonos?", a: "None of the motor yachts this house represents lives in Mykonos; they base in Athens. For a Mykonos start the owner positions the yacht across the 90 nautical miles from Alimos ahead of your boarding, at a fee quoted per yacht, and you board at Ornos or the New Port." },
      { q: "Can we charter just for Mykonos August week?", a: "Yes. On the Greek Charter Index 2026 the August weeks book 6 to 12 months out, and the smaller motor yachts go first. August was the busiest month for new enquiries on this desk in 2026, 25 of the 68 logged since 30 May." },
      { q: "What's the most-popular Mykonos motor yacht week?", a: "The middle weeks of August, when the beach clubs are at full programme and the Meltemi is at its strongest, which is exactly when a stabilised motor yacht earns its rate. June and September deliver the same Mykonos experience at 15 to 25% below peak on the Index." },
    ],

    ctaTitle: "Find a motor yacht for Mykonos 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-santorini",
    urlPath: "/motor-yacht-charter-santorini",
    eyebrow: "Motor yacht in Santorini",
    h1: "Motor Yacht Charter Santorini",
    tagline: "The only way to see the Santorini caldera properly. Anchored, sunset side, no tour-bus crowd in the frame.",
    seoTitle: "Motor Yacht Charter Santorini",
    seoDescription: "Crewed motor yacht charter from Santorini. View the caldera from the water, day-trip to Folegandros, full Cycladic loop. From EUR 17,500 a week, Index 2026.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-santorini",
    touristType: ["Santorini-based UHNW", "Couples", "Honeymooners"],

    whyTitle: "Why a motor yacht is the right Santorini charter",
    whyBody:
      "Santorini gets photographed from balconies in Oia for fifteen minutes at sunset, with 200 people behind every camera. Charter guests see the same caldera **at anchor, from the water, for an entire evening, alone**. That's the whole reason to charter from Santorini. " +
      "Motor yachts win the Santorini brief because the caldera anchorage is **open to swell and deep** (40-60m sounding most places). Sailing yachts hold less well in the caldera. Motor yachts with stabilisers ride out the wraparound waves and let dinner happen on deck without choreography. " +
      "From Santorini, the **Southern Cyclades** open up: Folegandros at 30 nm, Ios at 25 nm, Sikinos and the Small Cyclades within day-sail. A 7-day Santorini-based charter is one of the strongest Cycladic loops we run. Two days in the caldera (sunset both nights), three days exploring south Cyclades, return to Santorini for disembarkation.",

    bestFor: [
      "Couples on honeymoon arriving via Santorini airport direct flights",
      "Charters built around 2-3 caldera nights",
      "Photographers and content creators (the caldera is the shot)",
      "Repeat Cycladic charterers wanting a south-end loop",
      "Anyone who's done the hotel-balcony Santorini and wants the yacht version",
    ],

    yachtFilter: '_type == "yacht" && category == "motor-yachts" && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Motor yachts for Santorini charters",
    featuredHeading: "Caldera-ready motor yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**June and September** are the cleanest Santorini motor yacht months: full caldera season, light cruise-ship density, comfortable temperatures. **July-August** is spectacular but the Vlyhada marina (Santorini's only protected port) is heavily booked; tender mooring at the caldera works but plan ahead. **October** is the most underrated month - sunsets stay extraordinary, water swimmable, marina availability genuine.",

    insiderTips: [
      "Vlyhada marina is the only protected port. Book months in advance for July-August.",
      "Anchor below Oia for sunset, not below the chora - the chora side has the cliff drop and the wind eddy.",
      "Drone shots over the caldera from the foredeck are the highest-shared photos from any Cycladic charter. Plan the timing.",
      "Folegandros (30 nm) is the natural next stop. Don't loop back to Santorini every night.",
      "Skip the Akrotiri archaeological site on hot days; do it from a different port on a cool day.",
    ],

    faq: [
      { q: "Can a yacht anchor in the Santorini caldera overnight?", a: "Yes, weather permitting. The caldera is open to the south and can get swell on certain wind days. Captains move to the lee of Oia or the eastern coast when conditions require. For a calm August week, expect 2-3 caldera anchorage nights." },
      { q: "How long does a Santorini-based charter typically run?", a: "Seven nights is the standard. The Cycladic loop from Santorini (Folegandros, Sikinos, Ios, Small Cyclades) takes 4-5 days, with 2-3 days at the caldera bookending. Extending to 10 days adds Astypalaia or Anafi." },
      { q: "Can we board a yacht directly in Santorini?", a: "Yes. Several motor yachts in this house base in or reposition to Santorini for high-season charters. Vlyhada Marina is the main boarding point." },
      { q: "How much does a Santorini motor yacht charter cost?", a: "On the Greek Charter Index 2026 a 22 to 24 metre motor yacht lists at EUR 21,000 to 33,000 a week net base, a 26 to 31 metre at EUR 40,000 to 65,000 and a 35 to 40 metre at EUR 60,000 to 120,000, plus APA of 30 to 40% and Greek VAT at the certified rate. A 26 to 31 metre week at EUR 50,000 base settles around EUR 77,000 all-in with APA at 30%, VAT at 12% and a 12% gratuity." },
    ],

    ctaTitle: "Charter a motor yacht for Santorini 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-mykonos",
    urlPath: "/catamaran-charter-mykonos",
    eyebrow: "Catamaran in Mykonos",
    h1: "Catamaran Charter Mykonos",
    tagline: "The Mykonos charter for families and friend groups. All the floor space, none of the Meltemi-roll.",
    seoTitle: "Catamaran Charter Mykonos",
    seoDescription: "Crewed catamaran charter from Mykonos. Sailing and power catamarans 50-80 feet, family-friendly, chef + hostess. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/catamaran-charter-mykonos",
    touristType: ["Families", "Friend groups", "Multi-couple charters"],

    // 2026-09-07 (plan #10, depth): 595 → ~1,500 words, 51 impressions at
    // position 15.7. Named catamarans from their own rate cards, the
    // verified Mykonos, Syros, Paros and Antiparos anchorage records, the
    // house distance table and the Index bands. The unsourced "25-40% below
    // a motor yacht", "70% of our family Mykonos charters", "18-22 knot
    // cruise" and the marina-berth and Rhenia-cove claims are gone.
    quickAnswer: {
      question: "Which catamaran should I charter for Mykonos?",
      answer: "One that carries the Meltemi: from Mykonos the passages to Syros and Paros are 25 to 30 nautical miles and the afternoon north wind is the fact of the summer, so the 20 metre and larger catamarans we represent do it comfortably. Named, from their own rate cards: ALTEYA, a Sunreef 70 Power at EUR 49,000 to 69,000 a week; Genny and Above & Beyond, Sunreef 80s at EUR 56,000 to 79,000; Ad Astra and Aloia, Fountaine Pajot Thira 80s at EUR 65,000 to 90,000; Kimata and Alexandra II, Alegria 67s at EUR 31,500 to 43,500. All per yacht per week before VAT and APA, one price for the whole party.",
    },
    keyFacts: [
      "Catamarans for Mykonos that carry the wind, from their own cards: Kimata EUR 31,500 to 42,500, Alexandra II EUR 33,500 to 43,500, ALTEYA EUR 49,000 to 69,000, Genny EUR 56,000 to 79,000, Above & Beyond EUR 56,000 to 77,000, Aloia EUR 65,000 to 85,000, Ad Astra EUR 65,000 to 90,000, ChristAl MiO 80 EUR 70,000 to 90,000.",
      "Mykonos anchorages from the verified guide: Ornos 6 to 12 metres over sand, excellent from the north; Psarou 8 to 15 metres for Nammos; Kalafati 6 to 10 metres on the east coast, the best Meltemi shelter on the island; Delos by tender in visiting hours.",
      "Legs from the house distance table: Mykonos to Syros 25 nautical miles, to Paros 30, to Naxos 30, to Santorini 80; Alimos to Mykonos 90. A Mykonos start adds the yacht's delivery on its own line.",
      "APA on a catamaran runs 20 to 30% of the base against 30 to 40% on a motor yacht; VAT 5.2 to 12% by certification; a customary 10 to 15% crew gratuity on the base.",
      `Of the ${FLEET_COUNT} yachts we represent, ${CATAMARAN_COUNT} are catamarans, ${FLEET_COMPOSITION.sailingCat} sailing and ${FLEET_COMPOSITION.powerCat} power; six guests was the most common party in the 68 enquiries this desk logged in the 2026 season, and the Cyclades were the grounds named most after Athens.`,
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026 and anchorage guides", href: "/greek-charter-index-2026" },
    whyTitle: "Why catamarans work for Mykonos",
    whyBody:
      "Mykonos in August is hot, busy, and exposed to the Meltemi. A catamaran answers all three. **A wide, level deck for the heat**, with more shaded living area than a monohull of the same length. **No heel and very little roll at anchor** when the afternoon wind blows into Ornos, which is why children sleep through it. **A shallow draft** that lies close to the sand at Kalafati and in the Antiparos channel where a deep keel anchors outside. " +
      "For **a family or a party of six to ten**, a 20 to 24 metre catamaran is the sweet spot: four to six cabins, the children safe on flat decks, and an APA of 20 to 30% of the base against 30 to 40% on a motor yacht, because two hulls burn a fraction of the diesel. " +
      "The catamarans we represent for Mykonos split between **sailing catamarans**, Genny, Above & Beyond, Ad Astra, Aloia, Kimata and Alexandra II, with the rhythm and the lower fuel line, and **power catamarans**, ALTEYA, ChristAl MiO 80, Crazy Horse and ALINA, at motor-yacht pace between islands. Either works for Mykonos; the choice is whether the party wants the sailing week or the fast transits to Paros and Milos. The bigger the hull, the better it carries the afternoon sea, which is why the 23 to 24 metre boats sit where they do on the Greek Charter Index.",

    bestFor: [
      "Multi-family Mykonos weeks (2-3 families on one boat)",
      "Friend groups of 6-10 wanting deck space",
      "Children-aboard charters needing flat platforms",
      "Charterers stepping up from a bareboat catamaran week",
      "Mykonos honeymoons with a budget-conscious framing",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-catamarans", "power-catamarans"] && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Catamarans for Mykonos",
    featuredHeading: "Mykonos-based catamarans for 2027",

    whenTitle: "When to book",
    whenBody: "On the Greek Charter Index the peak July and August weeks on the most requested catamarans commit six to twelve months ahead, and the five and six cabin boats go first because there are fewer of them. **June and September** are the catamaran months at Mykonos: warm water, a softer Meltemi, the beach clubs open, and rates 15 to 25% below peak on the same rate card with three to four months of lead time rather than a year. **July and August** are the wind, and the week below is built so that every night has a lee. **May and October** are the quiet shoulder, the anchorages empty.",

    rateTable: {
      eyebrow: "The catamarans, named",
      heading: "Crewed catamarans for a Mykonos week, from their own rate cards",
      intro: "Per yacht per week, net base before VAT and APA, as quoted on each yacht's listing on 7 September 2026. The 20 metre and larger hulls carry the Cyclades afternoon wind comfortably.",
      columns: ["Yacht", "Type and length", "Guests and cabins", "Weekly base (EUR)"],
      rows: [
        { cells: ["Kimata", "Fountaine Pajot Alegria 67, sailing, 20.4m", "8 in 4 cabins", "31,500 to 42,500"] },
        { cells: ["Alexandra II", "Fountaine Pajot Alegria 67, sailing, 20.4m", "8 in 4 cabins", "33,500 to 43,500"] },
        { cells: ["ALTEYA", "Sunreef 70 Power, 21.3m", "8 in 4 cabins", "49,000 to 69,000"] },
        { cells: ["Crazy Horse", "Lagoon 78, power, 23.8m", "10 in 5 cabins", "50,000 to 69,000"] },
        { cells: ["Above & Beyond", "Sunreef 80, sailing, 24m", "8 in 4 suites", "56,000 to 77,000"] },
        { cells: ["Genny", "Sunreef 80, sailing, 24m", "10 in 5 cabins", "56,000 to 79,000"] },
        { cells: ["Aloia", "Fountaine Pajot Thira 80, sailing, 24m", "10 in 5 cabins", "65,000 to 85,000"] },
        { cells: ["Ad Astra", "Fountaine Pajot Thira 80, sailing, 24m", "10 in 5 cabins", "65,000 to 90,000"] },
        { cells: ["ChristAl MiO 80", "Fountaine Pajot Thira 80, power, 24.4m", "12 in 6 cabins", "70,000 to 90,000"] },
      ],
      caption: "Add APA of 20 to 30% of the base, Greek VAT at 5.2 to 12% by the yacht's certification, and a customary 10 to 15% crew gratuity on the base. Source: the yachts' own listings and the Greek Charter Index 2026.",
    },

    deepDive: [
      {
        eyebrow: "The week",
        heading: "Seven nights from Mykonos on a catamaran, every night in a lee",
        body:
          "**Night one, Ornos:** board in the afternoon and anchor in 6 to 12 metres over sand with excellent shelter from the north, the tender dock a minute away. **Day two, Delos and Psarou:** Delos by tender in visiting hours, the catamaran lying off in 10 to 18 metres, then Psarou at 8 to 15 metres for Nammos and the beach service to the boat. **Day three, Syros, 25 miles:** west in the morning calm to Finikas, 3 to 6 metres over sand, the best Meltemi shelter on the island, Ermoupoli a taxi away. **Day four, Paros, 30 miles:** Naoussa, 8 to 15 metres, is the prettiest village in the Cyclades and open to the Meltemi, so on a windy day the boat lies at Parikia on the protected west side and the party drives ten minutes to dinner. **Day five, Antiparos:** five miles to the Despotiko channel, 4 to 9 metres over sand with excellent holding, one of the most protected anchorages in the southern Cyclades in a northerly, and Soros on the south coast, 6 to 12 metres, sheltered from every direction, the clearest water of the week. **Day six, Paros east coast:** Pisso Livadi, 6 to 10 metres, a fishing village with the fish at the harbour tavernas, Kolymbithres on the way for the swim among the boulders. **Night seven, Kalafati, 30 miles:** back to the east coast of Mykonos, 6 to 10 metres over sand, the best Meltemi shelter on the island and the least-visited bay, or Ornos for the town. Every passage is a morning, and the captain decides the evening before. The anchorages are from our own [Mykonos anchorage guide](/yacht-charter-mykonos-anchorages) and the [Paros guide](/yacht-charter-paros-anchorages).",
      },
    ],

    insiderTips: [
      "Ornos for the nights near town, 6 to 12 metres over sand and excellent from the north; Kalafati on the east coast when the Meltemi is up, the best shelter on the island and one taverna ashore.",
      "Delos before the ferries: the catamaran lies off in 10 to 18 metres and the tender runs the party to the site at opening; Rhenia's South Bay across the channel has excellent Meltemi shelter for the swim, day stop only.",
      "The passages are mornings: Syros 25 miles, Paros 30, done before the wind builds after midday. The captain decides the next anchorage the evening before, from the forecast, not from the brochure.",
      "A Mykonos start adds the yacht's delivery from Athens, 90 miles, on its own line; an Athens start with the first night at Kea saves it and reaches Mykonos on day two. Ask us which is cheaper for your dates before you book flights.",
      "The 23 to 24 metre boats, Genny, Ad Astra, Aloia, Above & Beyond and ChristAl MiO 80, carry the August afternoon sea best; Kimata and Alexandra II at 20 metres are the family boats for June and September.",
    ],

    faq: [
      { q: "How much does a catamaran charter from Mykonos cost?", a: "Per yacht per week before VAT and APA, from each yacht's own rate card: Kimata EUR 31,500 to 42,500, Alexandra II EUR 33,500 to 43,500, ALTEYA EUR 49,000 to 69,000, Crazy Horse EUR 50,000 to 69,000, Above & Beyond EUR 56,000 to 77,000, Genny EUR 56,000 to 79,000, Aloia EUR 65,000 to 85,000, Ad Astra EUR 65,000 to 90,000, ChristAl MiO 80 EUR 70,000 to 90,000. On the Greek Charter Index 2026 the crewed sailing catamaran bands run EUR 10,900 to 22,000 at 12 to 16 metres, 18,900 to 27,500 at 16 to 19, 31,500 to 43,500 at 20 to 22 and 56,000 to 90,000 at 23 to 24. Add APA of 20 to 30%, VAT at 5.2 to 12% by certification, and a customary 10 to 15% gratuity on the base." },
      { q: "Sailing or power catamaran for Mykonos?", a: "Sailing, Genny, Above & Beyond, Ad Astra, Aloia, Kimata or Alexandra II, for the rhythm and the lower fuel line: the week stays in the central Cyclades, Syros, Paros, Antiparos, and the passages are mornings under sail. Power, ALTEYA, ChristAl MiO 80, Crazy Horse or ALINA, for motor-yacht pace without the roll: Milos is 50 miles from Paros and Santorini 80 from Mykonos, and the power catamaran makes those mornings short. Both carry the same APA logic, 20 to 30% of the base." },
      { q: "Are catamarans good for families with kids in Mykonos?", a: "They are the hull we recommend for families in the Cyclades: no heel, very little roll at anchor, a level deck, a draft that lies close to the sand, and the week above built so that every night has a lee from the Meltemi. For children under ten in July and August we say plainly that the Ionian is calmer; for a family that wants Mykonos, a 20 metre and larger catamaran in June or September is the answer. One in six enquiries on this desk in 2026 came from a family." },
      { q: "Does the catamaran go into Mykonos marina?", a: "The week is anchored, not berthed: Ornos or Kalafati for the nights, the tender for the town. Boarding and disembarkation are arranged with the captain, at anchor by tender or alongside where a berth is available on the day; we do not promise marina nights we cannot guarantee, and the wide beam of a catamaran is exactly why." },
      { q: "How far ahead should I book a catamaran for Mykonos?", a: "Six to twelve months for July and August on the Greek Charter Index, and the five and six cabin catamarans go first. June and September hold availability closer in, 15 to 25% below peak on the same card. On this desk, 26 of the 57 dated enquiries received between 30 May and 6 September 2026 were already for 2027." },
      { q: "Can we start in Athens and reach Mykonos on a catamaran?", a: "Yes, and it is usually cheaper, because most of the catamarans we represent are based around Athens and a Mykonos start adds the delivery on its own line. Alimos to Mykonos is 90 nautical miles on the house table: on a catamaran that is Kea on the first night, 35 miles, Syros on the second, 40 more, and Mykonos on the morning of day three, 25 miles, each leg in the morning calm. Our Athens to Mykonos page does the arithmetic." },
    ],

    ctaTitle: "Charter a catamaran for Mykonos 2027.",
    ctaPrimary: "Find a catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-lefkada",
    urlPath: "/catamaran-charter-lefkada",
    eyebrow: "Catamaran in Lefkada",
    h1: "Catamaran Charter Lefkada",
    tagline: "Sheltered Ionian waters. Wide decks. Children on board. The gentlest Greek charter week in this house.",
    seoTitle: "Catamaran Charter Lefkada",
    seoDescription: "Crewed catamaran charter from Lefkada. The Ionian's family-friendliest week. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/catamaran-charter-lefkada",
    touristType: ["Families", "First-time charterers", "Couples"],

    whyTitle: "Why Lefkada is the catamaran capital of Greek charter",
    whyBody:
      "Lefkada Marina is **the most modern marina in Greek waters** and the natural departure port for any Ionian week. The Ionian's gentle thermal winds (8 to 14 knots in summer afternoons), the sheltered anchorages, and the short inter-island day-passages (Lefkada to Meganisi 5 nm, to Kefalonia 25 nm) all suit catamarans perfectly. " +
      "The Ionian is **the family-friendly Greek charter region**. No Meltemi. No long open-water passages. Anchorages are pine-fringed coves with shore access for swimming, lunch, and afternoon village walks. The Mamma Mia anchorages on Skopelos (yes, the church on the rock and the beach scenes from the film) are technically Sporades, not Ionian - but the Ionian's mood is similar: green, sheltered, lyrical. " +
      "Most of our Lefkada-based catamaran charters run the **Lefkada-Kefalonia-Ithaca-Paxos loop** over 7 nights. Wide decks for children, anchored swimming most afternoons, tender into a village evening dinner most nights. The Ionian is the charter veterans recommend to first-time charterers and is the format repeat clients keep coming back to.",

    bestFor: [
      "First-time crewed-charter families",
      "Multi-generational charters with grandparents and grandchildren",
      "Couples wanting a slow, contemplative Greek week",
      "Friends groups of 6-10 sharing the platform",
      "Sailing families with kids who haven't yet sailed",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-catamarans", "power-catamarans"] && !(retired == true)',
    yachtsHeadline: "Catamarans based in Lefkada",
    featuredHeading: "Lefkada-ready catamarans for 2027",

    whenTitle: "When to book",
    whenBody: "**May through October** is the Ionian charter season. **June, July, September** are the sweetest weeks - warm water, gentle wind, marinas at comfortable density. **August** is busier but never crowded by Cycladic standards. **Late September and October** are the under-the-radar shoulder months: water still 22°C, marinas half-empty, rates at the low end of each Index band.",

    insiderTips: [
      "Kioni on Ithaca for the evening anchorage - sheltered, restaurant-fringed, the most-photographed Ionian harbour.",
      "Paxos requires 6-week lead time for August peak. Lakka anchorage fills up early.",
      "Antipaxos (5 nm south of Paxos) has the best swimming beaches in the Mediterranean. Day trip from Paxos anchorage.",
      "Fiskardo on Kefalonia is the dinner village - book Tassia or Lagoudera ahead.",
      "Lefkada-Kefalonia is a 25 nm day under sail. Plan a leisurely morning departure, beach swim midday, arrive Fiskardo for sunset.",
    ],

    faq: [
      { q: "How much does a catamaran charter from Lefkada cost?", a: "On the Greek Charter Index 2026 a crewed sailing catamaran lists at EUR 10,900 to 22,000 a week net base at 12 to 16 metres, 18,900 to 27,500 at 16 to 19 and 31,500 to 43,500 at 20 to 22; a power catamaran at EUR 14,000 to 90,000 by length, before APA of 20 to 30% and Greek VAT at the certified rate (5.2 to 12%)." },
      { q: "Is the Ionian really suitable for first-time charterers?", a: "More than suitable - it's the recommended starting point. Sheltered water, short passages, calm anchorages, easy marina infrastructure. Most family charter weeks in Greek waters happen in the Ionian for these reasons." },
      { q: "Can children safely participate in a catamaran sailing week?", a: "Yes, with the right crew brief. Catamarans don't heel under sail, decks are flat and wide, anchorages are easy swim-from-boat. Crew on family-experienced boats know how to engage children with activities (knots, helm time, snorkelling) when conditions allow." },
      { q: "What's the Lefkada-to-Paxos itinerary?", a: "Day 1: Lefkada to Meganisi. Day 2: Meganisi to Ithaca (Kioni harbour). Day 3: Ithaca exploration. Day 4: Kefalonia (Fiskardo). Day 5-6: Kefalonia south to Zakynthos (Navagio dawn). Day 7: Return to Lefkada. About 150 nm total." },
    ],

    ctaTitle: "Plan your Lefkada catamaran week for 2027.",
    ctaPrimary: "Find a catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht-charter-cyclades",
    urlPath: "/sailing-yacht-charter-cyclades",
    eyebrow: "Sailing yacht in the Cyclades",
    h1: "Sailing Yacht Charter Cyclades",
    tagline: "The Meltemi is the experience. Reaching at 11 knots across the Aegean to Folegandros is what your guests will remember.",
    seoTitle: "Sailing Yacht Charter Cyclades | Meltemi Sailing",
    seoDescription: "Crewed sailing yacht charter in the Cyclades. Meltemi 15-25 knot wind, serious sailing. Mykonos, Paros, Naxos, Santorini. From EUR 24,000 a week, Index 2026.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-cyclades",
    touristType: ["Sailing enthusiasts", "Couples", "Repeat charterers"],

    quickAnswer: {
      question: "What is a crewed sailing yacht charter in the Cyclades, and what does it cost?",
      answer:
        "A week under sail on the Aegean's defining summer wind: from late June to mid-September the Meltemi blows from the north at 15 to 25 knots for days at a stretch, and the Cyclades week is a series of reaches between islands 25 to 60 nautical miles apart on the house table. One price per yacht per week with crew, from the Greek Charter Index 2026: a crewed sailing yacht of 24 to 31 metres EUR 24,000 to 49,000, a crewed sailing catamaran from 10,900 at 14 metres to 90,000 at 24, before APA of 20 to 30% and Greek VAT at the certified rate. The five sailing yachts this house represents: Huayra, Aizu, Nadamas, MELITI and Gigreca.",
    },
    keyFacts: [
      "The five crewed sailing yachts we represent: Huayra (Comet 100, 31 m, 8 guests, EUR 44,000 to 49,000), Aizu (Marine 99, 30 m, 33,000 to 39,000), Nadamas (Y8, 24 m, built 2022, 35,000 to 41,000), MELITI (Garcia 86, 26 m, 6 guests, 26,500), Gigreca (Admiral Sail Silent 76, 24 m, 24,000 to 29,900), each rate from its own card",
      "Sailing catamarans on the Index: EUR 18,900 to 27,500 at 16 to 19 metres, 31,500 to 43,500 at 20 to 22, 56,000 to 90,000 at 23 to 24, per yacht per week",
      "Legs from the house table: Mykonos to Syros 25 nm, Mykonos to Paros 30, Paros to Sifnos 35, Sifnos to Milos 25, Milos to Santorini 70, Paros to Santorini 60",
      "The Meltemi: a northerly of 15 to 25 knots from late June to mid-September, strongest in the afternoons through the central Cyclades; June and September blow gentler",
      "APA 20 to 30% of base under sail against 30 to 40% on a motor yacht, because the fuel bill is smaller; Greek VAT at the certified rate",
      "Lead time on the Index: 6 to 12 months for July and August; June and September list 15 to 25% below peak",
    ],
    evidence: { label: "The five sailing yachts, with rates, on the best-sailing-yachts page", href: "/best-sailing-yachts-greece" },

    whyTitle: "Why the Cyclades are Greece's premier sailing ground",
    whyBody:
      "The **Meltemi is the Aegean's defining summer wind**. From late June through mid-September, a steady 15 to 25 knots from the north pushes across the central Cyclades for days at a stretch. For sailors, this is the closest thing the Mediterranean has to a trade wind: a wind you can plan around, route into, and trust. " +
      "**Cycladic sailing weeks are reaching-heavy**. The islands sit 25 to 60 nautical miles apart on the house table, Mykonos to Paros 30, Paros to Sifnos 35, Paros to Santorini 60, so each leg is a morning or a full day on one tack with the wind on the beam. Huayra, the carbon Comet 100 at the top of the list, is built to reach at 17 knots under sail. The crossings that make motor yachts the practical choice for non-sailing families are the **whole point** of a sailing charter. " +
      "The sailing yachts this house represents run from **24 metres** (Gigreca, an Admiral Sail Silent 76 with captain, chef and stewardess for eight; Nadamas, a Y8 launched 2022; MELITI, a Garcia 86 for six with a crew of four) to **30 and 31 metres** (Aizu, a classic Marine 99 refitted 2023; Huayra, the Comet 100 refitted 2025), with the crewed sailing catamarans of 14 to 24 metres alongside them for families who want the wind without the heel. The choice depends on whether you want to drive the wheel or sip wine while the captain does.",

    bestFor: [
      "Sailing-experienced couples or families",
      "Charterers who've done a motor week and want the opposite pace",
      "August charters where Meltemi peaks - sailing weeks that handle wind",
      "Repeat clients alternating between sailing and motor",
      "Photography clients who want sailing-yacht-under-canvas shots",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-monohulls", "sailing-catamarans"] && !(retired == true)',
    yachtsHeadline: "Sailing yachts in the Cyclades",
    featuredHeading: "Cycladic sailing yachts for 2027",

    whenTitle: "When the Cyclades sail best",
    whenBody: "**Mid-July to mid-September** is the Meltemi peak - best sailing of the year, suitable for experienced charterers who want serious wind. **June and early July** offer gentler 10-18 knot sailing - the sweetest weeks for couples and families new to monohull sailing. **May and late September** can have variable wind; expect mix of sailing and motor-sailing days.",

    insiderTips: [
      "Brief us at booking on sailing experience level. Beginners do better in June; experienced sailors thrive in August Meltemi.",
      "Reaching across the central Aegean at 22 knots true is the photograph. Plan one such day if conditions allow.",
      "Sailing yachts handle Meltemi better than motor yachts in some respects - the boats sail in it rather than push through.",
      "Take the wheel on day three when you've got the boat's feel. The captain's brief turns into the highlight of the week.",
      "Sailing weeks often sleep in quieter anchorages than motor weeks. Less marina dockage, more remote bays.",
    ],

    faq: [
      { q: "Can non-sailors charter a sailing yacht?", a: "Yes. The crew handle everything; guests participate as much or as little as they want. Many of our sailing yacht clients are non-sailors who chose the format for the slower pace and lower fuel cost. The crew will brief on day one." },
      { q: "Is the Meltemi too strong for sailing?", a: "For experienced sailors, the 20-25 knot range is excellent sailing. For first-time charterers, 25+ knots can feel intense; we'd recommend a sailing catamaran (less heel) or a June/September charter for gentler conditions." },
      { q: "How much does a Cycladic sailing charter cost?", a: "On the Greek Charter Index 2026 a crewed sailing yacht of 24 to 31 metres lists at EUR 24,000 to 49,000 a week net base, and a crewed sailing catamaran at EUR 10,900 to 90,000 by length, before APA of 20 to 30% (lower than a motor yacht, because the fuel is) and VAT at the certified rate." },
      { q: "Will the sailing yacht actually sail or just motor between islands?", a: "Brief the captain on your sailing preference. In a Meltemi week most legs sail; the engine runs for calm dawns, weather avoidance and marina arrivals. Pure-sail weeks are possible with itinerary flexibility." },
    ],

    ctaTitle: "Charter a sailing yacht for Cyclades 2027.",
    ctaPrimary: "Find a sailing yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht-charter-ionian",
    urlPath: "/sailing-yacht-charter-ionian",
    eyebrow: "Sailing yacht in the Ionian",
    h1: "Sailing Yacht Charter Ionian",
    tagline: "The gentler Greek sailing region. Afternoon thermals, sheltered overnight anchorages, the route Odysseus took home.",
    seoTitle: "Sailing Yacht Charter Ionian",
    seoDescription: "Crewed sailing yacht charter in the Ionian. Corfu, Lefkada, Kefalonia, Paxos. Gentle thermal winds, sheltered. From EUR 24,000 a week, Index 2026.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-ionian",
    touristType: ["First-time charterers", "Families", "Couples"],

    whyTitle: "Why the Ionian is Greek charter's gentlest sailing region",
    whyBody:
      "The Ionian's summer wind pattern is the **opposite of the Cyclades' Meltemi**. Mornings are typically calm. Afternoons see a thermal breeze of 8-14 knots from the north or north-west. Evenings drop to glass. Day passages of 15-40 nm are normal. Multi-island routes are gentle and beginner-friendly. " +
      "For sailing-curious families and first-time charterers, the Ionian is **the right place to learn**. The crew can give a one-hour briefing on day one (sail handling, helm time, basics of trim) and within days the children are taking turns at the wheel in friendly conditions. Heeling is moderate (12-18 degrees in typical wind). Anchorages are sheltered enough that the boat doesn't move at night. " +
      "**The Lefkada-Corfu axis** is the classic Ionian sailing week. Start in Lefkada, work north via Meganisi, Kalamos, Kastos to Paxos, dip south to Kefalonia and Ithaca, return to Lefkada. About 200 nm over 7 days, mostly under sail in the afternoon thermals. We base 6 sailing yachts in Lefkada for the full season; one-way charters to Corfu are also possible.",

    bestFor: [
      "Sailing-curious families with kids 8-16",
      "Couples after honeymoon energy without monohull-heel drama",
      "First-time charterers who'd rather start gentle",
      "Couples who've done Mykonos and want the opposite week",
      "Ionian's quiet pace for repeat clients seeking decompression",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-monohulls", "sailing-catamarans"] && !(retired == true)',
    yachtsHeadline: "Sailing yachts in the Ionian",
    featuredHeading: "Ionian sailing yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**May to October** is the active Ionian sailing season. **June, July, September** are the sweetest - warm water (22-25°C), reliable afternoon thermals, anchorages at low density. **August** is busier with charter traffic but still much quieter than Cycladic equivalents. **October** is the secret: warm air, swimmable water, sailors-only density.",

    insiderTips: [
      "Day-sails of 4-6 hours are the Ionian standard. Don't plan to sail dawn-to-dusk; the wind doesn't support it.",
      "Anchor in Kioni (Ithaca) at least one night. The most-photographed Ionian harbour.",
      "Paxos's Lakka harbour and Antipaxos for swimming - a 2-day combination most clients love.",
      "Kefalonia's Fiskardo is the village evening. Lagoudera and Tassia restaurants for dinner.",
      "If you're sailing-experienced, ask about a one-way Lefkada-to-Corfu charter. The northern Ionian (Paxos, Corfu) is meaningfully different from the south.",
    ],

    faq: [
      { q: "How much sailing actually happens on an Ionian charter?", a: "Typically 50-65% of the week under sail. Mornings are usually motor or motor-sail (the thermal hasn't kicked in). Afternoons sail at 8-14 knots. The pace suits charter rather than racing - relaxed, swim-stop friendly, dinner-ready by 19:00." },
      { q: "Is the Ionian suitable for sailing newcomers?", a: "Best sailing region in Greek waters for newcomers. Gentle wind, sheltered passages, supportive crew tradition. Many of our first-time charterers begin here and add Cycladic charter only in year 2 or 3." },
      { q: "How much does an Ionian sailing charter cost?", a: "On the Greek Charter Index 2026 a crewed sailing yacht of 24 to 31 metres lists at EUR 24,000 to 49,000 a week net base; the crewed sailing catamarans that share the Ionian bays run EUR 10,900 to 90,000 by length. Before APA of 20 to 30% and Greek VAT at the certified rate." },
      { q: "Can we do a Lefkada-to-Corfu one-way charter?", a: "Yes. A one-way charter carries a repositioning cost that is quoted per yacht, on the delivery line rather than on the week. The northern Ionian (Corfu, Paxos) has different character from the south; a one-way charter sees both. Common request for repeat Ionian clients." },
    ],

    ctaTitle: "Charter a sailing yacht for Ionian 2027.",
    ctaPrimary: "Find a sailing yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "honeymoon-yacht-charter-mykonos",
    urlPath: "/honeymoon-yacht-charter-mykonos",
    eyebrow: "Honeymoon in Mykonos",
    h1: "Honeymoon Yacht Charter Mykonos",
    tagline: "Mykonos energy by day, quiet anchorage by night. The honeymoon week with both sides of the island.",
    seoTitle: "Honeymoon Yacht Charter Mykonos",
    seoDescription: "Honeymoon yacht charter from Mykonos. Couples-only crewed yachts, chef-led, Mykonos energy balanced with private anchorages. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-mykonos",
    touristType: ["Honeymooners", "Couples"],

    whyTitle: "Why Mykonos works as a honeymoon yacht week",
    whyBody:
      "Mykonos has **two faces** that a yacht week can balance perfectly. The **public face**: beach clubs, fine dining, the chora's evening energy, the social tempo that puts Mykonos on every brand's list. The **private face**: quiet anchorages off Rhenia and Delos, dawn swimming, breakfast on deck with the village still asleep. " +
      "A yacht honeymoon week from Mykonos lets the couple **dial between the two**. Day three is dinner at Nammos, fireworks at the chora. Day four is breakfast at anchor in Rhenia, alone, no other boats in sight. Day five is sunset at Ornos with the chef preparing the meal you talked about last night. " +
      "We curate Mykonos-departure honeymoon weeks on smaller yachts (50-foot sailing yacht through 30-metre motor yacht) **for two guests specifically**. The crew brief is for honeymoon energy: discrete service, master cabin priority, evenings designed around the couple's preferences rather than a generic agenda.",

    bestFor: [
      "Honeymoons starting from a few days in Mykonos hotels",
      "Couples who got married in the Cyclades and want a yacht week",
      "Honeymoons that mix Mykonos energy with quiet anchorage decompression",
      "Repeat Mykonos visitors wanting the yacht version of the island",
      "Photographers / content-conscious couples wanting Cycladic cinematics",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["sea-u", "sea-ya", "n-ice", "meliti-sy", "endless-beauty", "just-marie-2", "shooting-star"] && !(retired == true)',
    yachtsHeadline: "Honeymoon-sized yachts in Mykonos",
    featuredHeading: "Two-cabin and intimate yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**June and September** are the cleanest Mykonos honeymoon months - warm enough for daily swimming, energy dialled back from peak August, restaurants book-able. **July-August** delivers full Mykonos energy but loses some of the privacy. Book honeymoon weeks **6-12 months ahead** for ideal yacht selection.",

    insiderTips: [
      "Brief the chef on a specific dish from somewhere meaningful (your first date restaurant, a holiday). The chef plans the week around it.",
      "Anchor at Rhenia for the morning of day three. Empty, white-sand cove, the boat all to yourselves.",
      "Sunset dinner on the foredeck in Ornos is the photograph. Plan it for day five when you've relaxed but the suntan is still fresh.",
      "If your wedding was in Mykonos, board the yacht the morning after - perfect decompression from the reception.",
      "Two-week charters give more flexibility. Week 1 active (Mykonos energy, Cycladic loop), week 2 quiet (Ionian transit or southern Cyclades decompression).",
    ],

    faq: [
      { q: "How much does a Mykonos honeymoon yacht charter cost?", a: "On the Greek Charter Index 2026 a couple has a 12 to 16 metre crewed sailing catamaran to themselves at EUR 10,900 to 22,000 a week net base, a 24 to 31 metre sailing yacht at 24,000 to 49,000, or a 22 to 24 metre motor yacht at 21,000 to 33,000. Plus APA of 20 to 40% by type and Greek VAT at the certified rate (5.2 to 12%). A EUR 20,000 catamaran week settles around EUR 30,000 all-in." },
      { q: "Is Mykonos too busy for a honeymoon?", a: "Depends on which Mykonos you visit. The chora and south-shore beach clubs are busy. The anchorages at Rhenia, Ornos, and Super Paradise back beach are quiet even in August. A yacht honeymoon visits both selectively." },
      { q: "Can we board the yacht in Mykonos and finish elsewhere?", a: "Yes. One-way charters (Mykonos to Santorini, or to Athens) are possible; the repositioning is quoted per yacht on the delivery line. Some couples board in Mykonos for the energy and disembark in Santorini for the caldera honeymoon ending." },
      { q: "When should we book?", a: "6-12 months ahead for peak August. 4-6 months for June and September. Late-booking yachts exist for 4-week windows but with limited yacht choice." },
    ],

    ctaTitle: "Plan your Mykonos honeymoon week for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=honeymoon&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "family-yacht-charter-lefkada",
    urlPath: "/family-yacht-charter-lefkada",
    eyebrow: "Family in Lefkada",
    h1: "Family Yacht Charter Lefkada",
    tagline: "The Ionian's gentlest charter week. Children safe on deck, grandparents happy in the shade, parents on holiday.",
    seoTitle: "Family Yacht Charter Lefkada",
    seoDescription: "Family yacht charter from Lefkada. Ionian family routes - Meganisi, Ithaca, Kefalonia. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/family-yacht-charter-lefkada",
    touristType: ["Multi-generational families", "Families with young children"],

    whyTitle: "Why Lefkada is the family-charter capital of Greek waters",
    whyBody:
      "Multi-generational family weeks have **three competing demands**: children need active days and shallow-water access, parents need adult time and easy evenings, grandparents need shade and stable platforms. Lefkada-based Ionian charters satisfy all three better than any other Greek region. " +
      "**Short day-passages** (Lefkada to Meganisi is 5 nm, Meganisi to Ithaca is 15 nm) mean every transit is a morning or an afternoon, not a full day. **Sheltered anchorages** mean lunches and afternoons happen in flat water - children swim from the boat without worry, grandparents sit on deck without rolling. **Modern marinas** (Lefkada has the best in Greece) handle the logistics: provisioning, crew turnover, easy daughter-of-yacht-club departures. " +
      "Our family yacht fleet for Lefkada concentrates on **60-80 foot catamarans (4-5 cabins, family of 6-10)** and **25-35 metre motor yachts (5-6 cabins, family of 8-12)**. Both formats deliver the platform a family needs: flat decks, multiple cabins for separate sleeping groups, chef-prepared meals that respect every dietary preference at the table.",

    bestFor: [
      "Multi-generational charters with grandparents and grandchildren",
      "Families with children 3-15 wanting an Ionian-friendly first charter",
      "Two-family weeks consolidating two households on one yacht",
      "Wedding anniversary weeks for parents with adult children joining",
      "Charters where any guest has mobility considerations",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Lefkada*") && sleeps >= 6',
    yachtsHeadline: "Family yachts in Lefkada",
    featuredHeading: "Family-ready yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**Late June through early September** is the family window - school holidays align across Northern Europe, water is warm, anchorages are open. **Early July** is the sweet spot: temperatures comfortable, density lower than August peak. **Late August into early September** for families with older children who can extend past school start.",

    insiderTips: [
      "Brief the chef on each child's likes by name 3-4 weeks before charter. Lunch becomes the children's favourite meal by day three.",
      "Ithaca's Kioni harbour for at least one evening. The taverna scene is the most family-friendly in the Ionian.",
      "Kefalonia's Antisamos beach (the Mamma Mia 2 location) for the children's photography day.",
      "Hire a local guide for a half-day inland excursion (Kefalonia's caves, Lefkada's mountain villages). Builds variety into the week.",
      "Plan one beach-day and one village-evening for every two boat-only days. Children's attention spans benefit from the cadence.",
    ],

    faq: [
      { q: "How much does a family yacht charter from Lefkada cost?", a: "On the Greek Charter Index 2026 a family of six to eight charters a crewed sailing catamaran from Lefkada at EUR 18,900 to 27,500 a week net base at 16 to 19 metres, or EUR 31,500 to 43,500 at 20 to 22 metres; a 26 to 31 metre motor yacht lists at EUR 40,000 to 65,000. One price per yacht per week, for the whole party, before APA and Greek VAT at the certified rate." },
      { q: "Is the Ionian safe for children swimming from the boat?", a: "Yes - Ionian anchorages are the safest in Greek waters. Sheltered, shallow approaches, low boat traffic in summer. The crew on family-experienced yachts always supervise children's water activities and brief on safety on day one." },
      { q: "How many cabins do we need for a family of 8?", a: "Minimum 4 cabins. Recommended 5. A 60-foot catamaran (4-cabin) works for tight families; a 75-foot catamaran (5-cabin) gives a 'quiet cabin' for grandparents. For 10+ family members, a 25-metre motor yacht (5-6 cabins) is the right scale." },
      { q: "Can teenagers do watersports on the charter?", a: "Yes - most charter yachts above 25 metres carry paddleboards, kayaks, snorkel kits, and many have wakeboards or jet skis. Brief us on teen interests at booking; we'll match a yacht with strong watersports crew." },
    ],

    ctaTitle: "Plan your family yacht week for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=family&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "family-yacht-charter-corfu",
    urlPath: "/family-yacht-charter-corfu",
    eyebrow: "Family in Corfu",
    h1: "Family Yacht Charter Corfu",
    tagline: "Venetian harbours, beach-fringed coves, the easiest air access of the Ionian. The northern-Ionian family week.",
    seoTitle: "Family Yacht Charter Corfu",
    seoDescription: "Family yacht charter from Corfu. Northern Ionian routes covering Paxos, Antipaxos, Albanian Riviera. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/family-yacht-charter-corfu",
    touristType: ["Families", "Northern European visitors"],

    whyTitle: "Why Corfu opens up the northern Ionian for family charter",
    whyBody:
      "Corfu has **the second-easiest international air access in Greek waters after Athens**. Direct flights from London, Vienna, Frankfurt, Amsterdam, Manchester, and Dublin land at Corfu airport (IATA: CFU) at high frequency from April to October. This makes Corfu the natural departure point for **northern European families** whose flight logistics into Athens or Mykonos would add a day of transit. " +
      "From Corfu, the **northern Ionian** opens up: Paxos and Antipaxos to the south (2-3 hour transit), the Albanian Riviera to the north-east (cross-border but doable), the **Diapontian islands** (Othonoi, Erikoussa, Mathraki) to the north-west - the quietest Greek islands accessible from a Corfu base. Most Corfu-departure family charters run a 7-night loop **Corfu - Paxos - Antipaxos - back via the west coast**. " +
      "The **Corfu town** itself is a UNESCO World Heritage Old Town: Venetian architecture, two fortresses, café culture. Worth a half-day shore excursion as part of the charter rhythm. The family-friendly beach side of Corfu (Glyfada, Paleokastritsa) is on the west coast and reachable by yacht as part of the week's anchorages.",

    bestFor: [
      "Northern European families with direct flights to Corfu",
      "Multi-generational charters with elder family members preferring flat Ionian water",
      "Families adding a yacht week to a Corfu hotel stay",
      "Charters wanting cross-border (Greece-Albania) exploration",
      "First-time family charterers wanting easy logistics",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Corfu*" || cruisingRegion match "*Ionian*") && sleeps >= 6',
    yachtsHeadline: "Family yachts from Corfu",
    featuredHeading: "Corfu-ready family yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**May to October** is the active Corfu charter season. **Late June through August** is family-peak with school holidays in alignment. **September and early October** are the sweet spots for families with older children (no school constraint) - warm water, quiet anchorages, lower rates. Most Corfu-based yachts winter in Lefkada Marina; charter availability begins mid-May.",

    insiderTips: [
      "Corfu town's Old Fortress is a 30-minute walk from the new marina. Plan a half-day shore excursion with the family.",
      "Paxos's Lakka harbour for at least one evening. Small, sheltered, lit-from-below water that the children remember.",
      "Antipaxos beaches (Voutoumi, Vrika) for the day. White sand, Caribbean water, no shore infrastructure.",
      "Albanian Riviera (Sarande, Ksamil) as a cross-border day trip from Corfu. Possible with paperwork; ask at booking.",
      "Provisioning in Corfu town is the best in the Ionian. Brief the chef on any specific ingredient requests.",
    ],

    faq: [
      { q: "How do we get to Corfu to board the yacht?", a: "Corfu airport (CFU) has direct flights from 30+ European destinations in season. Flight time from London is 3.5 hours, from Vienna 2 hours. The marina is 10 minutes from the airport by taxi." },
      { q: "What's the typical Corfu family yacht itinerary?", a: "7-night standard: Day 1 Corfu town and anchorage. Day 2 sail south to Paxos. Day 3-4 Paxos and Antipaxos. Day 5 Lefkimi or back-route via Othonoi. Day 6-7 Corfu west coast (Paleokastritsa, Glyfada) and return. About 100 nm total." },
      { q: "How much does a Corfu family yacht charter cost?", a: "On the Greek Charter Index 2026 a family of six has a 16 to 19 metre crewed sailing catamaran at EUR 18,900 to 27,500 a week net base; a family of ten or twelve a 23 to 24 metre catamaran at 49,000 to 90,000 or a 35 to 40 metre motor yacht at 60,000 to 120,000. Before APA of 20 to 40% by type and VAT at the certified rate." },
      { q: "Can we cross to Albania from a Corfu yacht charter?", a: "Yes, with paperwork. Sarande and Ksamil on the Albanian Riviera are 6-12 nm from Corfu. Cross-border charters require advance notice (typically 4 weeks for visa coordination) and a yacht owner who agrees to the route. We coordinate." },
    ],

    ctaTitle: "Plan your Corfu family week for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=family&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "superyacht-charter-mykonos",
    urlPath: "/superyacht-charter-mykonos",
    eyebrow: "Superyacht in Mykonos",
    h1: "Superyacht Charter Mykonos",
    tagline: "Above 30 metres, in Mykonos in August. Private chef. Two tenders. The Mykonos charter that doesn't compromise.",
    // 2026-09-07 (plan #13, GEO): 75 impressions at 6.3 and no answer unit.
    // Named from the rate cards; the invented Mykonos-based count and the
    // shore-side relationship claims are removed from the body below.
    quickAnswer: {
      question: "Which superyachts can I charter for Mykonos and what do they cost?",
      answer: "The largest yachts we represent, from their own rate cards: LA PELLEGRINA 1, 50 metres, nine crew for twelve, EUR 180,000 to 235,000 a week; KOKOMO NIGHTS, 47.5 metres, EUR 120,000 to 140,000; NORTHWIND II, 45.6 metres, EUR 83,300 to 110,000; ARIELA, OTTAWA and PAREAKI II at 39 to 40 metres, EUR 98,000 to 120,000; CAN'T REMEMBER and BROOKLYN at 36 to 37 metres, EUR 60,000 to 90,000. Per yacht per week before VAT and APA. Most are based around Athens, 90 nautical miles from Mykonos, so a Mykonos boarding adds the delivery on its own line; the week anchors at Ornos or Psarou in the lee of the Meltemi.",
    },
    keyFacts: [
      "Above 35 metres, from their own cards: LA PELLEGRINA 1 EUR 180,000 to 235,000, KOKOMO NIGHTS EUR 120,000 to 140,000, ARIELA EUR 105,000 to 120,000, OTTAWA EUR 100,000 to 110,000, PAREAKI II EUR 98,000 to 115,000, NORTHWIND II EUR 83,300 to 110,000, CAN'T REMEMBER EUR 80,000 to 90,000, BROOKLYN EUR 60,000 to 75,000.",
      "Mykonos anchorages from the verified guide: Psarou 8 to 15 metres over sand for Nammos with beach service to the yacht; Ornos 6 to 12 metres with excellent shelter from the north; Paradise and Super Paradise 10 to 18 metres; Kalafati on the east coast, the best Meltemi shelter on the island.",
      "Alimos to Mykonos is 90 nautical miles: under three hours at 33 knots, about four and a half on PAREAKI II at 21, seven to nine on a displacement yacht; a Mykonos boarding is quoted per yacht on the delivery line.",
      "August APA on a motor yacht runs 30 to 40% of the base, so a EUR 100,000 week carries a working float of EUR 30,000 to 40,000; VAT at 5.2 to 12% by certification; gratuity 10 to 15% on the base.",
      "Peak weeks on yachts above 40 metres commit a year or more ahead on the Greek Charter Index; on this desk, 26 of the 57 dated enquiries received between 30 May and 6 September 2026 were already for 2027.",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026 and anchorage guides", href: "/greek-charter-index-2026" },
    seoTitle: "Superyacht Charter Mykonos | 30m+ Yachts",
    seoDescription: "Superyacht charter from Mykonos: 30 to 50 metres, full crew, chef, two tenders, full toy fleet, Cycladic itineraries. Index 2026 rates from EUR 60,000 a week.",
    canonical: "https://georgeyachts.com/superyacht-charter-mykonos",
    touristType: ["UHNW Mykonos visitors", "Celebrities", "Repeat charterers"],

    whyTitle: "Why superyachts dominate Mykonos's UHNW charter market",
    whyBody:
      "Mykonos in August is the **highest-density UHNW Mediterranean destination outside Cap d'Antibes**. The anchorages off Psarou and Ornos fill with large yachts through July and August, and the boats below 30 metres feel it. The boats below 30 metres feel small in this company; the boats above 30 metres feel like home. " +
      "**Above 30 metres**, the yacht becomes a private hotel that floats. Crew of 6-10. Dedicated chef. Two tenders (one for guest transfers, one for crew provisioning and discreet runs). A chief stewardess who runs the social rhythm of the week. Master cabin forward with separate-deck access. The Mykonos energy doesn't interrupt the privacy. " +
      "The largest yachts we represent are named on this page with their own rate cards, and most of them are based around Athens, 90 nautical miles away, so a Mykonos boarding adds the delivery on its own line and an Athens boarding saves it. Reservations ashore, at Nammos, SantAnna and the Chora's higher-end addresses, are made by the crew in the yacht's name, which is how a principal eats out in Mykonos without being seen to arrive.",

    bestFor: [
      "UHNW repeat clients moving from 25-30 metre to superyacht class",
      "Celebrity charters needing maximum privacy in Mykonos",
      "Multi-generational charters with 8-12 family members on one platform",
      "Long-stay charters (10-14 nights) covering Cyclades + Dodecanese",
      "Hosted charters for corporate or sovereign principals requiring discretion",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["la-pellegrina-1", "elysium", "kokomo-nights", "northwind-ii", "ariela", "ottawa", "pareaki-ii", "brooklyn", "cant-remember"] && !(retired == true)',
    yachtsHeadline: "Superyachts in Mykonos",
    featuredHeading: "Mykonos superyachts for 2027",

    whenTitle: "When to book",
    whenBody: "**Mid-July to early September** is peak superyacht season in Mykonos. On the Greek Charter Index the peak weeks on yachts above 40 metres commit a year or more ahead, and the mid-August weeks go first. **Late May to early July** and **mid-September to mid-October** are shoulder seasons at the low end of each Index band with full superyacht service intact.",

    insiderTips: [
      "Mykonos marina has limited 30+ metre slots. Most superyachts anchor at Ornos or Mykonos Bay rather than dock.",
      "Two tenders matters in Mykonos. One for guest evening transfers (to Nammos, Scorpios, the Chora), one for crew provisioning. Below 30m yachts usually have one tender; superyachts almost always two.",
      "Provisioning in Mykonos is restaurant-quality but expensive. Brief the chef on specific ingredient sources; some restaurant kitchens accept yacht orders.",
      "Crew gratuity convention is 10 to 15% of the base rate. For a superyacht above 50 metres at EUR 200,000 a week on the Index, that is EUR 20,000 to 30,000, handed to the captain on the final morning.",
      "Helicopter touch-and-go is possible from yachts above 40 metres. Mykonos airport is 5 minutes by helicopter; useful for late-arriving or early-departing guests.",
    ],

    faq: [
      { q: "How much does a Mykonos superyacht charter cost?", a: "On the Greek Charter Index 2026 a 26 to 31 metre motor yacht lists at EUR 40,000 to 65,000 a week net base, a 35 to 40 metre at EUR 60,000 to 120,000 and the yachts above 50 metres at EUR 162,500 to 235,000, before APA of 30 to 40% and Greek VAT at the certified rate. A 35 to 40 metre week at EUR 90,000 base settles around EUR 138,600 all-in with APA at 30%, VAT at 12% and a 12% gratuity, less on a yacht certified at 5.2% or 6.5%." },
      { q: "Can a 40-metre superyacht dock in Mykonos marina?", a: "Limited slots. Most 40m+ yachts anchor at Ornos or the outer bay and tender to the chora. Marina dockage for 40m+ is typically only for boarding/disembarkation, not for nightly stays." },
      { q: "Is helicopter operation possible?", a: "Touch-and-go landings on a yacht's helideck are possible above 40 metres (yacht-specific). Mykonos airport (JMK) is 5 minutes by helicopter to most anchorages. We coordinate with helicopter operators for guest pickups." },
      { q: "What's a typical 7-night Mykonos superyacht itinerary?", a: "Day 1 boarding and Ornos sunset. Day 2 Delos and Rhenia. Day 3-4 Paros (Naoussa). Day 5 Folegandros. Day 6-7 return to Mykonos via Antiparos. About 120-150 nm. Superyachts can extend to Santorini (extra 60 nm south) in 10-14 night charters." },
    ],

    ctaTitle: "Charter a superyacht for Mykonos 2027.",
    ctaPrimary: "Find a superyacht",
    ctaPrimaryHref: "/yacht-finder?type=superyacht&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "luxury-yacht-charter-athens",
    urlPath: "/luxury-yacht-charter-athens",
    eyebrow: "Charter departing Athens",
    h1: "Luxury Yacht Charter from Athens",
    tagline: "The easiest yacht week to plan. Direct flights, the largest Greek fleet, 200+ yachts within 25 minutes of the airport.",
    seoTitle: "Luxury Yacht Charter Athens",
    seoDescription: "Luxury yacht charter from Athens (Alimos, Lavrio). Largest Greek fleet, full crew. Cyclades, Saronic, Sporades routes.",
    canonical: "https://georgeyachts.com/luxury-yacht-charter-athens",
    touristType: ["International UHNW visitors", "First-time charterers"],

    whyTitle: "Why Athens is the natural Greek charter departure port",
    whyBody:
      "Athens has **the largest yacht charter fleet in Greek waters**. Roughly 70% of the country's charter yachts base in or near Athens - primarily at **Alimos marina** (25 minutes from the airport, the largest commercial charter marina in Europe) and **Lavrio** (60 minutes east, smaller but increasingly preferred for departures toward the Sporades). " +
      "**For international UHNW visitors, Athens is the obvious departure point**. Athens International Airport (ATH) handles direct flights from 80+ destinations including all major US east-coast cities, Asia-Pacific via Doha or Istanbul, and every European capital. Same-day fly-and-board is standard: arrive 14:00, dinner aboard 19:00, sail at dawn next morning. " +
      "From Athens the **Saronic Gulf** (Aegina 18 nautical miles, Poros 25, Hydra 35, Spetses 50 on the house table) is the ground of the five-night week, the shortest programme this house writes. The **central Cyclades** (Kea 35 nm, Kythnos 45, Sifnos 80) are the seven-night loop. For 10 to 14 day charters, the Cyclades from Mykonos to Santorini and back through Milos, Sifnos and Serifos add extraordinary variety without leaving the grounds this house works.",

    bestFor: [
      "First-time international charterers using Athens for easiest logistics",
      "Charters with guests arriving from multiple international cities",
      "Repeat clients seeking the broadest Greek-waters yacht selection",
      "The five-night Saronic week from Athens, the shortest programme this house writes",
      "Multi-week charters with crew change at Athens midpoint",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Athens*" || cruisingRegion match "*Greece*" || cruisingRegion match "*Saronic*")',
    yachtsHeadline: "Yachts based in Athens",
    featuredHeading: "Athens-based fleet for 2027",

    whenTitle: "When to book",
    whenBody: "Athens charter season runs **mid-April to late October**. **June and September** are the sweet spots for UHNW charters: warm water, quieter anchorages, rates at the low end of each Index band. **July-August** is peak - book 9-12 months ahead. **Shoulder months** (May, October) suit charters where weather flexibility is acceptable.",

    insiderTips: [
      "Alimos marina is 25 minutes from the airport; Lavrio is 60 minutes. For same-day boarding, Alimos is the easier choice.",
      "Athens-Hydra is 3 hours under power, 5 hours under sail. Plan Day 1 as a half-day positioning leg to a Saronic anchorage.",
      "The Saronic loop (Hydra-Spetses-Poros) is the gentlest 4-night charter in Greek waters. Perfect for first-time charterers or short weeks.",
      "For a Cyclades-focused week, depart Athens, motor or sail south overnight, breakfast at Kythnos. Saves a day of charter-week time.",
      "Crew change midweek is easiest at Mykonos or Paros (international flight access) on extended charters.",
    ],

    faq: [
      { q: "How big is the Athens-based charter fleet?", a: "Roughly 200+ yachts across Alimos and Lavrio marinas, the largest concentration in Greek waters. Selection spans from 50-foot sailing yachts to 70-metre megayachts." },
      { q: "How fast can we board after landing at Athens airport?", a: "Same-day boarding is standard. From airport touchdown to yacht boarding: typically 90 minutes via taxi to Alimos (25 minutes), check-in, suitcases aboard. Dinner aboard at the marina at 19:00 is achievable from an afternoon arrival." },
      { q: "What's the best 7-day itinerary from Athens?", a: "Most popular: Saronic + central Cyclades loop. Day 1 Athens-Kythnos. Day 2-3 Cyclades (Sifnos, Serifos). Day 4 Hydra. Day 5 Spetses. Day 6 Poros. Day 7 return to Alimos. About 200 nm total. Combines island variety with realistic passage times." },
      { q: "How much does an Athens-departure yacht charter cost?", a: "The same rate card as anywhere in Greek waters, because a crewed yacht's base attaches to the vessel, not the port. On the Greek Charter Index 2026: motor yachts EUR 21,000 to 33,000 a week net base at 22 to 24 metres, 40,000 to 65,000 at 26 to 31, 60,000 to 120,000 at 35 to 40, and 162,500 to 235,000 above 50; crewed sailing catamarans EUR 10,900 to 90,000 by length. Athens has the deepest choice in every band, and no delivery on the bill." },
    ],

    ctaTitle: "Charter from Athens for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?departure=Athens",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "wedding-yacht-charter-mykonos",
    urlPath: "/wedding-yacht-charter-mykonos",
    eyebrow: "Wedding in Mykonos",
    h1: "Wedding Yacht Charter Mykonos",
    tagline: "Mykonos wedding receptions on the water. 30 to 80 guests on one boat, or multi-yacht flotillas for larger.",
    seoTitle: "Wedding Yacht Charter Mykonos | Reception Yachts",
    seoDescription: "Mykonos wedding yacht charter. Reception yachts for 30-80 guests, multi-yacht flotillas, photography days, after-party charters. Bespoke planning.",
    canonical: "https://georgeyachts.com/wedding-yacht-charter-mykonos",
    touristType: ["Wedding parties", "Bridal couples"],

    whyTitle: "Why a Mykonos wedding works on a yacht",
    whyBody:
      "Mykonos weddings have become **a category of their own** in the destination-wedding market. Roughly 200 international weddings happen on Mykonos each summer. The visual signature, the air-access logistics for international guests, and the established wedding-planner ecosystem all explain the rise. " +
      "**The yacht-based Mykonos wedding** solves the venue compromise. Mykonos's chora venues are atmospheric but capacity-limited and noise-restricted. Beach-club venues (Nammos, SantAnna, Scorpios) are spectacular but you're sharing with non-wedding crowds. A yacht venue is **entirely yours** - anchored off Mykonos, your decoration, your music, your tempo. " +
      "Three patterns dominate. **Reception on yacht**: 30-60 guests anchored offshore for dinner, dancing, and a tender-back to land at 02:00. **Multi-yacht flotilla**: 2-3 yachts chartered together for a week where the wedding day is hosted across them. **Photography day**: small yacht chartered for the bride-and-groom photography session in iconic Mykonos anchorages.",

    bestFor: [
      "Mykonos weddings with 30-80 guest receptions on water",
      "Wedding weeks combining hotel ceremony with yacht reception",
      "Multi-yacht weddings for 50+ guests across 2-3 boats",
      "Bridal photography day in cinematic Cycladic anchorages",
      "Pre-wedding bachelor and bachelorette weeks on a second yacht",
    ],

    yachtFilter: '_type == "yacht" && category in ["motor-yachts", "power-catamarans", "sailing-catamarans"] && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Mykonos wedding yachts",
    featuredHeading: "Reception-capable yachts for 2027 weddings",

    whenTitle: "When to plan",
    whenBody: "**Peak Mykonos summer dates commit six to twelve months ahead** on the Greek Charter Index, and a fixed wedding date on a specific yacht is a same-week decision when the yacht is free. The Mykonos wedding planner network handles the on-shore logistics; we coordinate the yacht side. **September and early October** are increasingly popular as 'shoulder-season weddings' - weather still warm, rates 15 to 25% below peak on the Greek Charter Index, marinas less crowded.",

    insiderTips: [
      "We coordinate with your wedding planner; we don't replace one. Brief us early.",
      "Greek law requires civil weddings on Greek soil. The yacht hosts reception, photography, after-party - not the legal ceremony.",
      "Reception capacity: 30-foot yacht 12 guests max; 40-foot yacht 30 guests; 50-metre yacht 60+ guests. Larger receptions require multi-yacht flotilla.",
      "Best Mykonos wedding photography anchorages: Rhenia (white sand cove), Ornos (sunset), Super Paradise (cliff backdrop). Coordinate with photographer 4 weeks ahead.",
      "Multi-yacht flotillas require 12+ months booking ahead. Two-yacht for 30-50 guest weddings is most common.",
    ],

    faq: [
      { q: "Can we get legally married on a Mykonos yacht?", a: "No. Greek law requires civil weddings to be performed by a Greek registrar on Greek soil. The legal ceremony happens at a Mykonos hotel, town hall, or chora venue; the yacht serves for reception, photography, and after-party." },
      { q: "How many guests can a Mykonos wedding yacht host for reception?", a: "Depends on yacht size and event format. The 12-overnight-guest cap applies to multi-night charters; event-only receptions can host more. 30-metre yacht: 30-50 guests for dinner. 40-metre: 60-80 guests. Larger weddings need multi-yacht flotilla." },
      { q: "Cost of a Mykonos wedding yacht charter?", a: "This house arranges the wedding week, not the reception day: the couple and their closest guests on a crewed yacht for the week around the ceremony, priced per yacht per week from the Greek Charter Index 2026 (a 26 to 31 metre motor yacht at EUR 40,000 to 65,000 net base, a 23 to 24 metre catamaran at 49,000 to 90,000, the yachts above 50 metres at 162,500 to 235,000). A flotilla for a larger wedding party is two or three rate cards side by side. The reception ashore and its catering are the planner's line, not the yacht's." },
      { q: "Can the yacht stay docked at Mykonos marina during the reception?", a: "Marina dockage is rarely the right choice. Anchored offshore (Ornos, Super Paradise) gives privacy, lighting control, no marina background noise. Marina dockage is best for boarding guest groups before sailing out." },
    ],

    ctaTitle: "Plan your Mykonos wedding yacht for 2027.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=wedding-mykonos",
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 7 Round 7 (2026-05-11) — 8 high-value combo gaps:
  // honeymoon-santorini, sailing-mykonos, sailing-lefkada,
  // catamaran-paros, catamaran-corfu, motor-corfu, motor-athens,
  // superyacht-athens. Hand-curated, distinct content per combo.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "honeymoon-yacht-charter-santorini",
    urlPath: "/honeymoon-yacht-charter-santorini",
    eyebrow: "Honeymoon yacht in Santorini",
    h1: "Honeymoon Yacht Charter Santorini",
    tagline: "The Santorini caldera, watched from your own deck, with no balcony crowd behind the photograph.",
    seoTitle: "Honeymoon Yacht Charter Santorini",
    seoDescription: "Crewed honeymoon yacht charter from Santorini. Sunset in the caldera at anchor, southern Cyclades loop, full chef service. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-santorini",
    touristType: ["Honeymooners", "Anniversary couples", "Romantic getaway"],

    whyTitle: "Why Santorini honeymooners step off the island and onto a yacht",
    whyBody:
      "The Santorini honeymoon photograph everyone has seen is taken from a hotel balcony in Oia at 19:45, with 180 other couples behind the same lens. A yacht honeymoon flips that geometry. **You watch the caldera from the water side, anchored alone in 200 metres of water, with the village lights above you and nothing in the frame but each other.** " +
      "A 7-day Santorini-based honeymoon week starts with two evenings in the caldera (different anchorages, one off Oia and one off Imerovigli for the southern view), then opens up the **Southern Cyclades**: Folegandros for the cliff-walk village, Ios for the protected beaches at Manganari, the Small Cyclades for the Aegean nobody else reaches. Return for one last caldera dinner, disembark Vlyhada. " +
      "The vessel size that suits honeymoons here is **18 to 28 metres**, large enough for a proper master suite and chef, small enough to anchor where larger boats cannot (Manganari Cove on Ios, Ammoudi at the base of Oia). The crew on a honeymoon week is invisible. They cook, they brief, they vanish.",

    bestFor: [
      "First-time-in-Greece honeymoon couples (Santorini is the recognisable anchor)",
      "Couples wanting one week with zero logistics (no ferry, no luggage, no taxi)",
      "Photographers' honeymoons (caldera, Folegandros cliffs, Ios beaches in one week)",
      "Anniversary trips returning to where the wedding happened",
      "Honeymooners adding a wellness component (private yoga + chef + spa-trained stewardess)",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["sea-u", "sea-ya", "n-ice", "meliti-sy", "endless-beauty", "just-marie-2", "shooting-star"] && !(retired == true)',
    yachtsHeadline: "Honeymoon yachts for Santorini 2027",
    featuredHeading: "Intimate yachts for two",

    whenTitle: "When to book",
    whenBody: "**May and June** are the honeymoon-perfect Santorini months: water warm, peak crowds not yet arrived, hotel rates still climbing. **September** repeats the same window from the other side. **July and August** book 12 months out and run 30-40% above shoulder pricing - and the caldera anchorage is busy. **Avoid the first ten days of August** for honeymoons: Santorini hotel-set's peak week.",

    insiderTips: [
      "Anchor off Imerovigli (not Oia) for the second evening: same caldera, half the noise, sunset from a slightly different angle.",
      "Vlyhada Marina disembarkation, not Athinios. Vlyhada is calmer, more discreet, no day-tripper crowd.",
      "Day-trip to Folegandros from Santorini is 4 hours by motor. Anchor at Karavostasis, walk to Chora, dinner at Pounta or Kalimera, back overnight.",
      "Manganari Beach on Ios is the best protected lunch anchorage in the Southern Cyclades. Pure white sand, no road access from the village.",
      "Chef briefing matters here: communicate dietary preferences plus 'one Greek tasting menu evening' before boarding. The chef plans the market round accordingly.",
    ],

    faq: [
      { q: "How much does a Santorini honeymoon yacht charter cost?", a: "On the Greek Charter Index 2026 a couple has an 18 to 20 metre motor yacht at EUR 17,500 to 22,900 a week net base, a 22 to 24 metre at 21,000 to 33,000, or a 26 to 31 metre at 40,000 to 65,000; a 12 to 16 metre crewed catamaran to themselves at 10,900 to 22,000. APA of 20 to 40% by type on top, covering fuel, food and beverages, plus VAT at the certified rate. A EUR 30,000 motor yacht week settles around EUR 46,000 all-in." },
      { q: "Should we board in Santorini or Athens?", a: "Board in Santorini. Direct flights into Santorini in summer make Athens the wrong departure point unless you're already in Athens. The week stays Cycladic the whole time, no need to backtrack to Attica." },
      { q: "Can we do Santorini + Mykonos in one honeymoon week?", a: "Yes, but it's a transit-heavy week. Santorini to Mykonos is 80 nm, which is 5 to 8 hours under power depending on the yacht, or about 11 hours under sail. A 10-day charter is the more relaxed format: 3 days Santorini caldera + south Cyclades, then 4 days Mykonos + Delos, then disembarkation." },
      { q: "Is the caldera anchorage rough?", a: "Caldera holding is poor (volcanic seabed, 40-60m depth in many spots). Yachts with stabilisers and competent captains anchor with double-scope; sailing yachts need careful boat selection. The crew knows the holds, trust their anchor call." },
    ],

    ctaTitle: "Plan a Santorini honeymoon for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=honeymoon&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht-charter-mykonos",
    urlPath: "/sailing-yacht-charter-mykonos",
    eyebrow: "Sailing yacht in Mykonos",
    h1: "Sailing Yacht Charter Mykonos",
    tagline: "The Mykonos charter for sailors. Meltemi-tested boats, captain who reads the wind, and the slower way to see the Cyclades.",
    seoTitle: "Sailing Yacht Charter Mykonos",
    seoDescription: "Crewed sailing yacht charter from Mykonos. Meltemi-rated yachts, Cyclades itineraries, classic sailing experience. Index 2026 rates from EUR 24,000 a week.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-mykonos",
    touristType: ["Sailing enthusiasts", "Couples", "Families with older children"],

    whyTitle: "Why Mykonos works for sailing-yacht charters (with the right captain)",
    whyBody:
      "Most Mykonos charterers want motor yachts. The 10-15% who want sailing yachts want them for the right reasons: **the Meltemi, which kills motor-yacht weeks, is the sailing yacht's best friend**. A 15-25 knot reliable north-westerly from June to early September is what sailors design holidays around. The boat heels, the wind is free, the noise is wind and water rather than engines. " +
      "Mykonos is the wrong departure for a relaxed sailing week, the Meltemi blows from the north so anything north of Mykonos (Tinos, Andros) becomes a beat upwind. But **southward routing** turns the wind into a fast downwind reach: Mykonos to Paros (4 hours), Paros to Ios (6 hours), Ios to Santorini (4 hours), Santorini back to Folegandros (3 hours). One of the great Aegean sails. " +
      "The yacht selection matters more here than anywhere else in the Cyclades. **Modern performance cruisers (Beneteau Oceanis 50+, Jeanneau 51, Hanse 588)** with experienced captains handle the Meltemi day after day. Older or lighter boats overheel and exhaust guests. We filter for the right vessel.",

    bestFor: [
      "Sailing-experienced couples who want the wind, not the engine",
      "Families with teenagers who can handle 20° of heel for 4-hour passages",
      "Southward Cycladic loops (Mykonos to Santorini with the Meltemi astern)",
      "Charterers who want to participate (helming, hoisting) rather than be served",
      "Photographers chasing the white-sail-against-blue-water Aegean shot",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-monohulls", "sailing-catamarans"] && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Sailing yachts based in Mykonos",
    featuredHeading: "Meltemi-rated sailing yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**June and September** are the sailor's Mykonos months - Meltemi steady at 15-20 knots, water warm, anchorages quieter. **July and August** the wind builds to 20-30 knots most days; great for experienced crews, exhausting for novices. **May and October** are possible but the wind is less reliable and sailing-charter season is winding down. **Avoid late October** for Mykonos sailing - Meltemi gone, replaced by southerly fronts.",

    insiderTips: [
      "Brief the captain on your sailing experience honestly. He'll set the reefing decisions and route accordingly.",
      "Naxos to Mykonos against Meltemi is a 6-hour beat. Don't put it in the itinerary as a last-day repositioning leg.",
      "Anchor at Schoinoussa or Koufonisia on the Mykonos-to-south route. Small Cyclades, empty in late June, full in August.",
      "Dress code on sailing yachts is functional: bare feet, soft clothing, no luggage with hard shells (scuffs the teak).",
      "The Greek courtesy flag and Q flag go up at the boarding port. Your captain handles this; you'll see it on the spreader.",
    ],

    faq: [
      { q: "How much does a Mykonos sailing yacht charter cost?", a: "On the Greek Charter Index 2026 a crewed sailing yacht of 24 to 31 metres lists at EUR 24,000 to 49,000 a week net base, against 40,000 to 65,000 for a motor yacht of 26 to 31 metres; the crewed sailing catamarans run EUR 10,900 to 90,000 by length. The sailing yacht is the lower band at the same length, and its APA is lower too, because the fuel is." },
      { q: "Can we charter a sailing yacht for Mykonos August?", a: "Yes, sailing yachts are easier to secure for August than motor yachts because motor demand dominates. Booking 4-6 months ahead is usually sufficient. The reverse of the motor-yacht market." },
      { q: "Will we sail every day or motor most of the week?", a: "On a Meltemi week you sail real distances - 4 of 7 days with proper passage-making, wind in the sails. On a low-wind week (less common July to early September) the engine carries more of the route. Captain calls daily." },
      { q: "Is a sailing yacht too active for an inexperienced family?", a: "Not necessarily. Modern crewed sailing yachts with stabilisers, autopilot, and experienced crew are comfortable for inexperienced families. The key is honest captain briefing about expectations and route." },
    ],

    ctaTitle: "Find a sailing yacht for Mykonos 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht-charter-lefkada",
    urlPath: "/sailing-yacht-charter-lefkada",
    eyebrow: "Sailing yacht in Lefkada",
    h1: "Sailing Yacht Charter Lefkada",
    tagline: "The Ionian sailor's home port. Sheltered water, daily thermal wind, and the most-sailed yacht-charter base in Greece.",
    quickAnswer: {
      question: "Why charter a sailing yacht from Lefkada?",
      answer:
        "Because the Ionian east of Lefkada is the flattest, most predictable sailing water in Greece: sheltered by the mainland and the island chain, with an afternoon thermal that builds late in the morning and dies at sunset. From Lefkada the hops are short, Ithaca 20 nautical miles and Kefalonia 25 on the house table, so a week reaches Meganisi, Ithaca, Fiscardo and back with days to spare. Rates run 15 to 25% below peak in June and September on the Greek Charter Index 2026.",
    },
    keyFacts: [
      "Distances from the house table: Lefkada to Ithaca 20 nm, Lefkada to Kefalonia 25, Paxos to Lefkada 50, Corfu to Lefkada 80",
      "The wind: an afternoon thermal that builds late morning and dies at sunset, on water sheltered by the mainland and the islands",
      "Shoulder months (June, September, early October) list 15 to 25% below peak on the Greek Charter Index 2026",
      "Lead time on the Index: 6 to 12 months for July and August weeks",
      "The Ionian sails later into October than the Aegean; the thermal holds most years until mid-October",
      "One price per yacht per week, crew included; APA of 20 to 30% for sailing yachts and catamarans, Greek VAT at the certified rate",
    ],
    evidence: { label: "Rates, lead time and shoulder discount from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
    seoTitle: "Sailing Yacht Charter Lefkada",
    seoDescription: "Crewed sailing yacht charter from Lefkada Marina. Ionian-sheltered cruising, daily thermal wind, Kefalonia and Paxos loops. From EUR 24,000 a week, Index 2026.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-lefkada",
    touristType: ["Sailing enthusiasts", "Families", "Multi-generational groups"],

    whyTitle: "Why Lefkada is the most-loved Greek sailing base",
    whyBody:
      "Lefkada Marina is **one of the largest charter sailing bases in Greece**. The reason isn't marketing, it's geography. The Ionian Sea on Lefkada's eastern side is **sheltered by the mainland and by the island chain**, so the water stays flat. The wind is a **predictable afternoon thermal** that builds late in the morning, peaks mid-afternoon and dies at sunset. Every day. Sailors call this 'fair-weather sailing': the conditions never break the routine. " +
      "From Lefkada you reach **Meganisi in 90 minutes** (the easiest first night), **Ithaca in 4 hours** (Odysseus's island, the most romantic landfall), **Kefalonia in 5 hours** (Fiscardo for dinner), **Paxos in a full day, 50 nautical miles** (Loggos for the all-time Ionian village). A 7-day round-trip covers all of this and returns to Lefkada with two days to spare for re-visiting favourites. " +
      "The yacht-set Ionian is **older, more family, less party** than the Cyclades. The thermal wind plus protected water means children, grandparents, and inexperienced sailors all manage comfortably. The Ionian is where George started chartering; it's also where he sends families who've never been on a yacht before.",

    bestFor: [
      "Families with children under 12 (calm water plus reliable wind equals no seasickness)",
      "Multi-generational groups (grandparents comfortable, kids entertained)",
      "First-time sailing charterers building confidence",
      "Tight 7-day windows (Lefkada reachable from Preveza airport, 30-min taxi)",
      "Returning charterers who want a different Greek experience from the Cyclades",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-monohulls", "sailing-catamarans"] && !(retired == true)',
    yachtsHeadline: "Sailing yachts based in Lefkada Marina",
    featuredHeading: "Lefkada-based sailing yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**May through October** all work in the Ionian. **June and September** are the sweet spots: water warm enough to swim, wind reliable, rates 15 to 25% below peak on the Greek Charter Index. **July and August** the thermal still blows but harbours fill; book 6 to 12 months ahead, the Index lead time for peak. The Ionian sails later into October than the Aegean: thermal lasts until mid-October most years.",

    insiderTips: [
      "Fly into Preveza airport (PVK), not Athens. Preveza is 30 minutes from Lefkada Marina by taxi. Athens transfer adds 5 hours.",
      "Lefkada Town is connected to the mainland by a floating bridge that opens hourly. Time provisioning runs accordingly.",
      "The Meganisi anchorages (Spilia, Atherinos, Vathy) fill by 17:00 in July. Arrive earlier or anchor in less-popular Vourliotis.",
      "Fiscardo on Kefalonia for dinner is the Ionian must-do, but it gets crowded. Anchor in Foki Bay 1 nm south and tender in.",
      "Loggos on Paxos has 7 restaurants. The best one (Vasilis) takes no reservations: walk over by 19:30 or eat at midnight.",
    ],

    faq: [
      { q: "How much does a Lefkada sailing yacht charter cost?", a: "One price per yacht per week, crew included, from the Greek Charter Index 2026: crewed sailing catamarans from EUR 10,900 a week at 14 metres to EUR 90,000 at 24, and crewed sailing yachts of 24 to 31 metres at EUR 24,000 to 49,000 net base. Add APA of 20 to 30% and Greek VAT at the certified rate. June and September list 15 to 25% below peak." },
      { q: "Is the Ionian boring compared to the Cyclades?", a: "Different, not boring. The Ionian is green, protected, family-friendly, with a slower pace. The Cyclades is dramatic, exposed, party-energy, photographic. Repeat charterers usually do Ionian first, Cyclades second." },
      { q: "What's the best 7-day Ionian itinerary from Lefkada?", a: "Lefkada → Meganisi (Spilia) → Ithaca (Vathy) → Kefalonia (Fiscardo) → Kefalonia (Assos) → Paxos (Loggos) → Lefkada. Roughly 150 nm round trip on the house distance table, 10 to 50 nm a day, plenty of swim stops." },
      { q: "Can I charter without sailing experience?", a: "Yes, crewed charters require zero sailing experience. The captain sails, the chef cooks, you participate as much or as little as you like. Bareboat charters require an ICC or equivalent license." },
    ],

    ctaTitle: "Find a Lefkada sailing yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-paros",
    urlPath: "/catamaran-charter-paros",
    eyebrow: "Catamaran in Paros",
    h1: "Catamaran Charter Paros",
    tagline: "The family Cyclades charter. Stable in the Meltemi, shallow enough for the best Antiparos beaches, big enough for three couples.",
    seoTitle: "Catamaran Charter Paros",
    seoDescription: "Crewed catamaran charter from Paros (Parikia). Stable cruising, Antiparos and Naxos loops, family-friendly Cyclades. Index 2026 rates from EUR 10,900 a week.",
    canonical: "https://georgeyachts.com/catamaran-charter-paros",
    touristType: ["Families with young children", "Multi-couple groups", "Cyclades returners"],

    whyTitle: "Why catamarans win the Paros brief",
    whyBody:
      "Paros sits in the **geographic centre of the Cyclades**, with Antiparos 15 minutes south, Naxos 12 nm east, Mykonos 30 nm north, Ios 40 nm south. From Paros a catamaran reaches more anchorages in a day than from any other Cycladic base. " +
      "Catamarans win for three Paros-specific reasons. **First**, the shallow draft (1.2-1.4m vs 2.5m on a sailing monohull) opens up the best Antiparos beaches (Soros, Apantima, Faneromeni) where deeper-draft boats anchor 200 metres offshore. **Second**, the **stability in the Meltemi**: flat water under sail at 15-20 knots makes catamarans the only sailing platform families enjoy in August. **Third**, the layout: three or four equal cabins, no master-vs-guest hierarchy, perfect for two or three couples chartering together. " +
      "Paros catamarans deliver the **Cycladic loop without the Cycladic compromises**. The Lagoon 50 and Bali 4.6 here sleep 8 in genuine comfort, cruise at 8 knots under engine and 10 knots under sail in the Meltemi, anchor in 2 metres of water at Soros where everyone else is in 15 metres.",

    bestFor: [
      "Two or three couples sharing one yacht for a Cyclades week",
      "Families with toddlers (flat water plus dual hulls equals no seasickness)",
      "Charterers who prioritise swim-anchorage access over restaurant proximity",
      "Repeat Cycladic visitors who've done Mykonos motor yacht (want a different format)",
      "Snorkelling and diving-focused weeks (shallow anchorages open underwater terrain)",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-catamarans", "power-catamarans"] && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Catamarans based in Paros and the Cyclades",
    featuredHeading: "Cyclades catamarans for 2027",

    whenTitle: "When to book",
    whenBody: "**June and September** are the family-perfect Paros catamaran weeks: Meltemi mild, water 22-24°C, all the beaches still open. **July and August** book 9 months ahead, the Cyclades family-catamaran market is the most over-subscribed segment in Greek charter. **May and early October** the water cools (19-20°C) but yacht availability and pricing both improve materially.",

    insiderTips: [
      "Anchor at Soros on Antiparos (south coast) rather than the main bay: same water, no day-tripper crowd from Antiparos chora.",
      "Naoussa on Paros for dinner: the marina is small; anchor at Kolymbithres 1 nm east and tender in by sunset.",
      "Despotiko (uninhabited island west of Antiparos) is the Cyclades' best protected anchorage: sandy bottom, blue water, archaeological site ashore.",
      "Catamaran kids' setup: webbing on the lifelines is non-negotiable for children under 8. Brief the captain pre-charter.",
      "Antiparos is dry-cleaning-free, pack accordingly. Soft luggage only; the cabin hanging space is limited on catamarans.",
    ],

    faq: [
      { q: "How much does a Paros catamaran charter cost?", a: "Weekly rates €30-50K for 12-15m catamarans (sleeps 6-8), €60-100K for 16-20m luxury catamarans (sleeps 8-10). APA 30-35% on top; typical Paros catamaran week settles €50-80K all-in." },
      { q: "Why a catamaran over a monohull in the Cyclades?", a: "Three reasons: stability in Meltemi (catamaran heels 2°, monohull heels 15°), shallow draft (access to better anchorages), and cabin layout (equal cabins for multi-couple groups). Monohulls are faster and more responsive under sail; choose based on whether comfort or performance wins for your group." },
      { q: "Can a catamaran reach Mykonos from Paros?", a: "Yes, Paros to Mykonos is 30 nm (3.5 hours by catamaran). Most 7-day Paros catamaran weeks include 1-2 nights at Mykonos with the rest split between Antiparos, Naxos, and the Small Cyclades." },
      { q: "Where do we board?", a: "Most Paros catamarans board at Parikia (the main town and ferry port). Some specific yachts base in Naoussa marina, confirm at booking. Paros airport (PAS) is 20 minutes from either." },
    ],

    ctaTitle: "Find a Paros catamaran for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-corfu",
    urlPath: "/catamaran-charter-corfu",
    eyebrow: "Catamaran in Corfu",
    h1: "Catamaran Charter Corfu",
    tagline: "The Ionian family catamaran. Sheltered cruising, Albania across the channel, and Paxos two hours south.",
    seoTitle: "Catamaran Charter Corfu",
    seoDescription: "Crewed catamaran charter from Corfu (Gouvia Marina). Sheltered Ionian cruising, Albanian coast, Paxos and Antipaxos loops. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/catamaran-charter-corfu",
    touristType: ["Families with young children", "Multi-couple groups", "Ionian first-timers"],

    whyTitle: "Why catamarans fit Corfu cruising",
    whyBody:
      "Corfu sits at the **northern end of the Ionian**, three nautical miles from the Albanian coast and 35 nm north of Paxos. The cruising water from Corfu south to Paxos and Antipaxos is **sheltered by the mainland, calm in the afternoon thermal, and dotted with shallow sand anchorages**. The catamaran's combination of stability and shallow draft fits this brief better than any monohull. " +
      "From Gouvia Marina, the **classic 7-day Ionian catamaran loop** is: Corfu (Kassiopi or Kalami) → Sivota mainland (the 'Caribbean of Greece' anchorages at Mourtos) → Paxos (Lakka in the north) → Antipaxos (Voutoumi beach, the bluest water in the Ionian) → Paxos (Loggos) → Sivota → Corfu. Roughly 100 nm round trip, two-thirds of which is downwind under sail. " +
      "Children under 10 are the **catamaran's specialty market in Corfu**. The flat water keeps the parents happy, the dual-hull stability means no seasickness, the swim platform sits 30 cm above water, and the shallow anchorages at Voutoumi and Mourtos let kids snorkel from the boat without tender deployment. Multi-generational charters where one grandparent is anxious about yachts: catamaran in Corfu is the answer.",

    bestFor: [
      "Families with children aged 4-12 (catamaran stability plus shallow Voutoumi-style beaches)",
      "Multi-generational groups bridging anxious-grandparent and active-kid expectations",
      "Two-couple groups sharing one yacht for an Ionian week",
      "Ionian first-timers who want the easiest charter format",
      "Sun-and-swim weeks where 70% of the time is anchored, not under sail",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Corfu*") && (subtitle match "*catamaran*" || subtitle match "*Catamaran*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine Pajot*" || builder match "*Leopard*")',
    yachtsHeadline: "Catamarans based in Corfu (Gouvia)",
    featuredHeading: "Corfu-based catamarans for 2027",

    whenTitle: "When to book",
    whenBody: "**May through early October** all work in the Ionian for catamaran charter. **June and September** are the peak family weeks: water 22-25°C, harbours not yet overrun, rates 15 to 25% below peak on the Greek Charter Index. **July and August** book 9-12 months ahead for Corfu catamarans. **Late October** is possible for hardier families but the thermal wind weakens after the 15th.",

    insiderTips: [
      "Fly into Corfu airport (CFU) - direct flights from London, Manchester, most northern European hubs. Gouvia Marina is 15 minutes by taxi.",
      "Voutoumi Beach on Antipaxos is the Ionian's photo anchorage. Arrive by 11:00 - the day-charter boats arrive at 12:00.",
      "Lakka on Paxos has the best northern Paxos anchorage and a Mediterranean-mooring quay. Reserve quay space if you want to walk to dinner.",
      "Sivota (mainland) is technically a 'discovery week' anchorage: protected, sandy, three or four restaurants, no road tourism.",
      "Cross-border note: Albania visa-free for charter yachts but you check in/out at Saranda. Most catamaran weeks skip the Albanian leg.",
    ],

    faq: [
      { q: "How much does a Corfu catamaran charter cost?", a: "Weekly rates €30-50K for 12-15m catamarans (sleeps 6-8), €55-95K for 16-20m luxury catamarans (sleeps 8-10). APA 30-35% on top. Corfu catamarans are typically 10-15% cheaper than equivalent Cycladic catamarans because of lower fuel and shorter passages." },
      { q: "Is Corfu the right base for a first catamaran charter?", a: "Yes. Gouvia Marina is one of the most family-friendly charter bases in the Mediterranean. Direct flights to Corfu airport, 15-minute taxi to the boat, sheltered first-day cruising to Kassiopi or Sivota. The easiest start of any Greek charter destination." },
      { q: "What's the best 7-day Corfu catamaran itinerary?", a: "Corfu (Gouvia) → Kassiopi → Sivota → Paxos (Lakka) → Antipaxos (Voutoumi) → Paxos (Loggos) → Corfu. 100-110 nm round trip, 15-20 nm per day, half the time anchored and swimming." },
      { q: "Can we visit Albania during the charter?", a: "Possible. Saranda is 12 nm north of Corfu and accepts charter yachts. Requires advance customs notification through the broker. Most charterers skip Albania unless specifically interested." },
    ],

    ctaTitle: "Find a Corfu catamaran for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-corfu",
    urlPath: "/motor-yacht-charter-corfu",
    eyebrow: "Motor yacht in Corfu",
    h1: "Motor Yacht Charter Corfu",
    tagline: "The Ionian motor-yacht week. Sheltered passages, Paxos for lunch, Albania across the channel.",
    seoTitle: "Motor Yacht Charter Corfu",
    seoDescription: "Crewed motor yacht charter from Corfu (Gouvia). Sheltered Ionian cruising, Paxos and Antipaxos, full chef service. Index 2026 rates from EUR 17,500 a week.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-corfu",
    touristType: ["UHNW Corfu visitors", "Multi-generational families", "Discrete clients"],

    whyTitle: "Why a motor yacht in Corfu reads quietly luxurious",
    whyBody:
      "Corfu's UHNW visitor profile is different from Mykonos. The Rothschilds and the Greek shipping families summer here. The villas are inland, the energy is restrained, the publicity is low. A motor yacht from Corfu does the same thing the villas do: **it stays private**. " +
      "The Ionian's sheltered geometry means the motor yacht runs **fast and smooth** between destinations. Corfu to Paxos is 35 nm, under two hours at 20 knots. Paxos to Antipaxos is 10 minutes. Sivota to Lefkada is 35 nm. A 40-metre motor yacht here covers more anchorages in a 7-day week than the same boat does in the Cyclades because the seas don't push back. " +
      "The Corfu-based motor yacht fleet skews **older, classic, more 'Riva' than 'Pershing'**. Heesen, Benetti, Custom Line are the recurring builds. The owners summer locally; the boats are maintained to spec. This is the Ionian's quiet wealth segment, a different aesthetic from the Cycladic motor-yacht fleet.",

    bestFor: [
      "UHNW families summering in Corfu villas adding a yacht week",
      "Multi-generational charters with grandparents on board (sheltered cruising)",
      "Discrete UHNW principals avoiding Mykonos visibility",
      "First-time Greek motor-yacht charterers wanting the easiest cruising water",
      "European royals and aristocrats with Corfu family ties",
    ],

    yachtFilter: '_type == "yacht" && category in ["motor-yachts", "power-catamarans"] && !(retired == true)',
    yachtsHeadline: "Motor yachts based in Corfu",
    featuredHeading: "Corfu motor yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**June and September** are the discretionary UHNW Corfu months: peak villa-set season, weather perfect, the August crowds not yet arrived (June) or already gone (September). **July and August** commit six to twelve months ahead on the Greek Charter Index; the Greek shipping families lock in their dates two summers in advance. **May and October** are possible at materially discounted rates.",

    insiderTips: [
      "Gouvia Marina is the main boarding base. NAOK in Corfu town for shorter stays. Brief George on which works for your transfer logistics.",
      "Paleokastritsa anchorage on the west coast: protected, monastery overlooking, the Rolls-Royce of Corfu anchorages.",
      "Sivota mainland anchorages (Mourtos, Mega Ammos) are the 'Caribbean of Greece': pure white sand, turquoise water. Day-trip from Corfu, 30 nm.",
      "Antipaxos Voutoumi for lunch is the Ionian's set piece. Arrive 10:30, swim, lunch on board at noon, leave before the day-boats arrive.",
      "Corfu Old Town for dinner: the captain will dock at the Old Port for the evening. Walk to Bellini's or Klimataria. Greek wine selection here is the best in the Ionian.",
    ],

    faq: [
      { q: "How much does a Corfu motor yacht charter cost?", a: "On the Greek Charter Index 2026 a 22 to 24 metre motor yacht lists at EUR 21,000 to 33,000 a week net base, a 26 to 31 metre at 40,000 to 65,000 and a 35 to 40 metre at 60,000 to 120,000, before APA of 30 to 40% and VAT at the certified rate. The base rate attaches to the yacht, not to Corfu; what Corfu changes is the delivery, which for an Athens-based yacht runs through the Corinth Canal." },
      { q: "How does a Corfu motor yacht week compare to Mykonos?", a: "Quieter, more sheltered, more family-oriented, more discreet. Corfu is where UHNW principals charter when they want zero Mykonos visibility. The yachts are larger, the anchorages are deeper, the dinners are villa-private rather than club-public." },
      { q: "Can we cross to Italy or Albania during the charter?", a: "Possible. Brindisi (Italy) is 100 nm west of Corfu, Saranda (Albania) is 12 nm north. Both require advance customs notification. Most Corfu motor yacht weeks stay within Greek waters." },
      { q: "Which is better for August: Corfu or Cycladic?", a: "Corfu in August. Same weather, half the crowd-pressure, materially more anchorage privacy. Cyclades in August is for the energy and the scene; Corfu is for the calm and the discretion. Different briefs, same calendar." },
    ],

    ctaTitle: "Find a Corfu motor yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-athens",
    urlPath: "/motor-yacht-charter-athens",
    eyebrow: "Motor yacht from Athens",
    h1: "Motor Yacht Charter Athens",
    tagline: "The most-flexible Greek charter departure. Alimos Marina to anywhere: Cyclades, Saronic, or further.",
    seoTitle: "Motor Yacht Charter Athens",
    seoDescription: "Crewed motor yacht charter from Athens (Alimos Marina). The largest Greek charter base - every itinerary reachable. Index 2026 rates from EUR 17,500 a week.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-athens",
    touristType: ["UHNW Greek-arriving travellers", "Multi-destination charterers", "Cyclades + Saronic combination weeks"],

    whyTitle: "Why Athens is the right motor yacht departure for most charters",
    whyBody:
      "**Alimos Marina is the largest charter base in Greece**: roughly 1,200 yachts berthed at peak, 60% of which charter commercially in the summer months. Every itinerary in Greek waters is reachable from here: the Cyclades to the south-east (Mykonos 8 hours by motor, Santorini 14 hours), the Saronic to the south-west (Hydra 2 hours, Spetses 4 hours), the Argolic and further into the Peloponnese. " +
      "The right Athens motor yacht week depends on the brief. **For first-time Greek charterers, the Saronic loop** (Athens → Hydra → Spetses → Aegina) is the easiest 4-night week: short passages, sheltered water, all the iconic Greek-village photographs without the Cycladic transit-time. **For the Cycladic-set, Athens to Mykonos with an overnight at Kea** is the standard 7-day opener; the boat repositions during the night and you wake up in Mykonos. **For the longer-week clients**, a 10-day Athens → Saronic → Cyclades → Athens covers both worlds. " +
      "Vessel selection in Athens is the **widest in Greece**: every yacht type, every size class, every flag is represented in Alimos. The trade-off is that the boat doesn't 'live' in the destination; repositioning the yacht to Mykonos before the charter starts saves the first day at sea but adds a delivery fee. Most charterers absorb the delivery cost.",

    bestFor: [
      "First-time Greek charterers wanting maximum itinerary flexibility",
      "Multi-destination weeks combining Cyclades and Saronic",
      "Charterers arriving Athens for cultural pre-charter days (Acropolis, dinner)",
      "Last-minute charter searches (Athens has the deepest live inventory)",
      "Repeat clients customising bespoke routes off the standard scripts",
    ],

    yachtFilter: '_type == "yacht" && category == "motor-yachts" && !(retired == true)',
    yachtsHeadline: "Motor yachts based at Alimos Marina",
    featuredHeading: "Athens motor yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**May through October** all work from Athens. **June and September** are the discretionary-spend sweet spots: same weather as peak August, 25-30% better pricing, marina less crowded. **July and August** book 6-9 months ahead for the popular 30-50m motor yachts. **Last-minute summer availability** is realistic in Athens (more so than in Mykonos or Santorini) because of the marina's scale.",

    insiderTips: [
      "Alimos Marina has 16 piers, confirm with George which pier your boat is on for taxi drop-off. From Athens airport (ATH) the transfer is 35-45 minutes depending on traffic.",
      "First-night options: stay in Athens (Acropolis dinner, board at 11:00 next morning) or sail to Aegina at sunset and have dinner on board. Both work; depends on whether you want city-end or sea-start.",
      "Day-trip option from Athens before boarding: Sounion Cape (45 minutes by car). Temple of Poseidon at sunset. Yacht-set tradition.",
      "Provisioning Athens is by far the best in Greece: Carrefour Voula and the Glyfada food markets stock anything. Brief the chef accordingly.",
      "Greek Easter and August 15 (Panagia) are domestic-travel holidays. Marina ferry traffic and provisioning logistics shift on those days. Brief in advance.",
    ],

    faq: [
      { q: "How much does an Athens motor yacht charter cost?", a: "On the Greek Charter Index 2026: EUR 17,500 to 22,900 a week net base at 18 to 20 metres, 21,000 to 33,000 at 22 to 24, 40,000 to 65,000 at 26 to 31, 60,000 to 120,000 at 35 to 40, and 162,500 to 235,000 above 50 metres, before APA of 30 to 40% and Greek VAT at the certified rate. Athens has the broadest range in every band, and no delivery on the bill." },
      { q: "Should we board in Athens or have the yacht reposition to Mykonos?", a: "Depends on flight logistics. Direct flight to Athens + board Alimos: save the repositioning fee, lose the first sailing day. Direct flight to Mykonos + reposition the yacht: pay the delivery fee (€2-8K), start the charter at the destination. Both are common; George briefs based on your specific dates." },
      { q: "What's the best 7-day Athens motor yacht itinerary?", a: "Two clean options. (1) Saronic loop: Athens → Aegina → Hydra → Spetses → Hydra → Athens. Light cruising, all islands within 4 hours. (2) Cycladic outbound: Athens → Kea (overnight) → Mykonos → Naxos → Paros → Sifnos → Athens. Heavier transit, more destinations." },
      { q: "Can we add a private chef + sommelier for a special dinner?", a: "Yes. Athens-based charters have the strongest auxiliary-service network in Greece: Michelin-trained private chefs, sommeliers from the Athens wine scene, security details if needed. Brief George at booking; the bookings happen through Alimos-based agencies." },
    ],

    ctaTitle: "Find an Athens motor yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Saronic",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "superyacht-charter-athens",
    urlPath: "/superyacht-charter-athens",
    eyebrow: "Superyacht from Athens",
    h1: "Superyacht Charter Athens",
    tagline: "The 40-metre-plus charter departure from Greece. Heesen, Benetti, Custom Line, Lürssen, Alimos to anywhere.",
    seoTitle: "Superyacht Charter Athens",
    seoDescription: "Crewed superyacht charter from Athens. 35 to 50 metre superyachts, full crew, Cycladic and Ionian itineraries. From EUR 60,000 a week, Index 2026.",
    canonical: "https://georgeyachts.com/superyacht-charter-athens",
    touristType: ["UHNW principals", "Royal families", "C-suite executives"],

    quickAnswer: {
      question: "Which superyachts charter from Athens, and what does a week cost?",
      answer:
        "Above 35 metres this house represents nine yachts, all based in Athens: LA PELLEGRINA 1 (50 m, Couach, twelve guests, nine crew, EUR 180,000 to 235,000 a week), KOKOMO NIGHTS (47.5 m, Picchiotti, 120,000 to 140,000), NORTHWIND II (45.6 m, Camper and Nicholsons 1966, 83,300 to 110,000), ARIELA (39.6 m, 105,000 to 120,000), OTTAWA (39 m, 100,000 to 110,000), PAREAKI II (39 m, 98,000 to 115,000), CAN'T REMEMBER (35.6 m, 80,000 to 90,000), BROOKLYN (37 m, 60,000 to 75,000) and ELYSIUM (64 m, up to 49 guests, 162,500). Each rate is the yacht's own card, per week, before APA of 30 to 40% and Greek VAT at the certified rate. On the Greek Charter Index 2026 the yachts above 40 metres book a year or more ahead.",
    },
    keyFacts: [
      "Above 50 metres: LA PELLEGRINA 1, 50 m, 12 guests, 9 crew, EUR 180,000 to 235,000 a week; ELYSIUM, 64 m, up to 49 guests as a certified passenger ship, EUR 162,500",
      "40 to 48 metres: KOKOMO NIGHTS (47.5 m, 12 guests, 10 crew, EUR 120,000 to 140,000), NORTHWIND II (45.6 m, 10 guests, 9 crew, 83,300 to 110,000)",
      "35 to 40 metres: ARIELA (39.6 m, 6 cabins, 105,000 to 120,000), OTTAWA (39 m, 100,000 to 110,000), PAREAKI II (39 m, 98,000 to 115,000), CAN'T REMEMBER (35.6 m, 80,000 to 90,000), BROOKLYN (37 m, 10 guests, 60,000 to 75,000)",
      "Index 2026 bands for the class: 35 to 40 m EUR 60,000 to 120,000; above 50 m 162,500 to 235,000 a week net base; APA 30 to 40% of base",
      "Passages from Athens on the house table: Alimos to Mykonos 90 nm, Mykonos to Santorini 80, Santorini to Alimos 130, Hydra 35 from Alimos for the last night in the Saronic",
      "Lead time on the Index: a year or more for the yachts above 40 metres, 6 to 12 months for peak weeks below that; gratuity 10 to 15% of base, at your discretion",
    ],
    evidence: { label: "The nine yachts above 35 metres, with rates, on the best-superyachts page", href: "/best-superyachts-greece-august" },

    whyTitle: "Why the Athens superyacht fleet is Greece's UHNW market",
    whyBody:
      "The superyachts this house represents base in **Athens**, at the marinas of the Athens Riviera, and that is where a Greek superyacht week begins: the country's main airport is half an hour away, the provisioning is the best in Greece, and the whole of the Cyclades opens from the first evening. Above 35 metres the list runs from **BROOKLYN and CAN'T REMEMBER at 36 and 37 metres** through **PAREAKI II, OTTAWA and ARIELA at 39 to 40**, **NORTHWIND II and KOKOMO NIGHTS at 46 and 48**, to **LA PELLEGRINA 1 at 50 metres** and **ELYSIUM at 64**, a certified passenger ship for up to 49 guests. Every one carries a chef, and the crews run from six to ten on the motor yachts. " +
      "A 50-metre superyacht week from Athens reaches **anywhere in our grounds** with overnight passages: Alimos to Mykonos is 90 nautical miles on the house table, Mykonos to Santorini 80, Santorini back to Athens 130 with a last night at Hydra, 35 miles from Alimos. Most charters use the overnight passages to wake up at the next destination; the vessel runs watches and the principals are unaware of the transit. " +
      "What Athens offers that Monaco or St. Tropez does not is **quiet**. The Greek market does not advertise its best hulls; it works through brokers who hold direct relationships with the captains and owners. On the Greek Charter Index 2026 the 35 to 40 metre band lists at EUR 60,000 to 120,000 a week net base and the yachts above 50 metres at 162,500 to 235,000; the nine yachts named here sit inside those bands, each at its own card rate.",

    bestFor: [
      "Principals chartering 40m+ for the first time from the Greek base fleet",
      "Multi-generational families needing five or six cabins and a crew of eight or more",
      "Multi-week summer programmes with the Saronic, the Cyclades and the Ionian in one season",
      "Hosted charters where the guest list runs past twelve (ELYSIUM, 64 m, up to 49 guests)",
      "Discreet UHNW principals avoiding St. Tropez visibility",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["la-pellegrina-1", "elysium", "kokomo-nights", "northwind-ii", "ariela", "ottawa", "pareaki-ii", "cant-remember", "brooklyn"] && !(retired == true)',
    yachtsHeadline: "Superyachts above 35 metres for 2027",
    featuredHeading: "Athens-based superyachts",

    whenTitle: "When to book",
    whenBody: "**On the Greek Charter Index 2026 the yachts above 40 metres book a year or more ahead**, and peak weeks below that 6 to 12 months. The Greek season runs **May through October**; the marquee July and August weeks go first, to repeat clients who hold them season after season. **June and September** are the discretionary windows: the same yachts, 15 to 25% below peak on the Index, warmer sea in September, and none of the August crush at the anchorages.",

    insiderTips: [
      "Boarding is at the Athens Riviera marinas; the airport is about half an hour away by road. A helicopter transfer is arranged ashore when a principal asks for it.",
      "Brief the captain on principal preferences well ahead of the charter: provisioning, beverages, security detail, communications setup. The captain coordinates with the principal's chief of staff.",
      "Tender count, toys and a helipad are yacht-by-yacht facts stated on each rate card. Confirm the list at booking; nothing is assumed.",
      "Cabin allocation matters on multi-family charters. ARIELA carries six cabins at 39.6 metres, LA PELLEGRINA 1 five for twelve at 50. Brief George on the principal hierarchy.",
      "Charter licensing and permits for the yacht are the owner's responsibility under the MYBA contract; this house confirms the paperwork is in place before you sign.",
    ],

    faq: [
      { q: "How much does an Athens superyacht charter cost?", a: "On the Greek Charter Index 2026 a 35 to 40 metre motor yacht lists at EUR 60,000 to 120,000 a week net base and the yachts above 50 metres at EUR 162,500 to 235,000. APA of 30 to 40% on top, Greek VAT at the certified rate, 5.2 or 6.5% common at this size, 13% at the ceiling. The nine yachts named on this page sit inside those bands at their own card rates, from BROOKLYN at 60,000 to LA PELLEGRINA 1 at 235,000." },
      { q: "What's included in a superyacht charter?", a: "The charter fee covers the vessel, the full crew (six to ten on the motor yachts named here), insurance and the berth at the base marina. APA covers fuel, food, beverages, port fees and marina dockage. VAT is on top. Excludes crew gratuity (10 to 15% of base, at your discretion) and excursions ashore." },
      { q: "Can we use a helicopter from the yacht?", a: "Only if the yacht carries a certified helipad, which is a yacht-by-yacht fact stated on the rate card; ask and we confirm before you commit. Otherwise a helicopter transfer is arranged ashore, to and from the marina or the nearest heliport to the anchorage." },
      { q: "Which Athens superyachts are available for next August?", a: "Live availability changes weekly and the largest hulls are asked for a year out: 26 of the 57 dated enquiries this desk logged in the 2026 season were already for 2027. Send the dates and the party size; the answer comes back with the yachts that are open." },
    ],

    ctaTitle: "Charter a superyacht from Athens for 2027.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=superyacht-athens",
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 7 Round 10 (2026-05-11) — 8 combos for under-covered
  // islands: Hydra (3 combos), Naxos (2), Kefalonia (2), Paros
  // honeymoon. Each hand-curated, distinct copy.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-hydra",
    urlPath: "/motor-yacht-charter-hydra",
    eyebrow: "Motor yacht to Hydra",
    h1: "Motor Yacht Charter Hydra",
    tagline: "The Athens-set's discreet Saronic week. Two hours from Alimos, anchored off Hydra's car-free harbour, dinner ashore at Sunset.",
    seoTitle: "Motor Yacht Charter Hydra",
    seoDescription: "Crewed motor yacht charter to Hydra from Athens. 2-hour passage, Saronic loop, car-free island. Index 2026 rates from EUR 17,500 a week.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-hydra",
    touristType: ["Athens-based weekenders", "Discreet UHNW", "First-time Greek charterers"],

    whyTitle: "Why Hydra is the right Saronic motor-yacht week",
    whyBody:
      "Hydra is **two hours from Alimos Marina by motor yacht**. It's the closest serious charter destination to Athens, and the one the Athens shipping families use when they want a yacht week without the Cycladic transit-time. " +
      "**The island has no cars.** Donkeys carry luggage from the harbour to the houses. The harbour itself is one of the great Mediterranean photographs - stone amphitheatre, two yacht-set restaurants (Sunset and Omilos), Leonard Cohen's house above the port. A motor yacht anchored off Hydra is the quintessential discreet Saronic image. " +
      "**A 5-night Saronic motor-yacht week** is Athens → Aegina (Saint Nektarios monastery) → Hydra (2 nights) → Spetses → Athens. **A 7-night week** extends to Poros and the Argolic gulf (Porto Cheli, Ermioni for dinner). Both are sheltered, all-Greek-waters itineraries - VAT stays at the reduced weekly-charter treatment, crew don't have a long-passage week, charterers don't lose days to transit.",

    bestFor: [
      "Athens-based weekenders extending a city trip to a yacht week",
      "Discreet UHNW principals avoiding Mykonos and Cycladic crowds",
      "First-time Greek charterers wanting the easiest format",
      "Cultural-travel groups combining Athens (Acropolis, museums) with sea",
      "Repeat charterers who've done Cyclades and want a different brief",
    ],

    yachtFilter: '_type == "yacht" && category == "motor-yachts" && !(retired == true)',
    yachtsHeadline: "Motor yachts for Saronic / Hydra weeks",
    featuredHeading: "Saronic-ready motor yachts",

    whenTitle: "When to book",
    whenBody: "**June and September** are optimal Hydra months - weather perfect, August Greek-domestic crowd not yet arrived (June) or already left (September), harbour atmospheric without being overrun. **July and August** are pleasant but the harbour fills with Athenian elite. **May and October** work for shoulder-season charters; the Saronic stays comfortable longer than the Cyclades.",

    insiderTips: [
      "Anchor outside the harbour mouth, NOT inside. The inside fills with day-charter caïques. Tender in for dinner.",
      "Sunset (the restaurant) at the western edge of the harbour books out 2 days ahead in season. Have the chef call.",
      "Visit Leonard Cohen's house (now closed but exterior accessible) on the steep walk up from the harbour. Cultural pilgrimage.",
      "Day-trip Porto Cheli on the mainland for the most-protected Saronic lunch anchorage. 1 hour west by motor yacht.",
      "Hydra has no streetlights past the harbour. Return to the yacht by 23:00 or carry a torch up the cobbled paths.",
    ],

    faq: [
      { q: "How much does a Hydra motor yacht charter cost?", a: "On the Greek Charter Index 2026 a motor yacht lists at EUR 17,500 to 22,900 a week net base at 18 to 20 metres, 21,000 to 33,000 at 22 to 24, 40,000 to 65,000 at 26 to 31 and 60,000 to 120,000 at 35 to 40. The base is the same as in the Cyclades, because it attaches to the yacht; what the Saronic saves is the APA, with shorter passages, less fuel and fewer marina nights." },
      { q: "Is 7 nights too long for the Saronic?", a: "No, 7 nights is comfortable with the Argolic Gulf added: Athens → Aegina → Hydra → Porto Cheli → Spetses → Poros → Athens. Plenty of swim time, all sheltered water, none of the Cycladic transit-time." },
      { q: "What's the best Saronic month?", a: "September. Weather warm, Greek-summer crowd dispersed, all the restaurants still open. June is a close second." },
      { q: "Can we anchor inside Hydra harbour?", a: "Possible but undesirable. The harbour fills with day-charter caïques during day, fishing boats overnight. Anchor in deep water off the harbour mouth and tender in." },
    ],

    ctaTitle: "Find a motor yacht for Hydra 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Saronic",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "honeymoon-yacht-charter-hydra",
    urlPath: "/honeymoon-yacht-charter-hydra",
    eyebrow: "Honeymoon yacht to Hydra",
    h1: "Honeymoon Yacht Charter Hydra",
    tagline: "The romantic Saronic honeymoon. Car-free island, candlelit harbour-side dinners, two-hour passages, zero logistics.",
    seoTitle: "Honeymoon Yacht Charter Hydra",
    seoDescription: "Crewed honeymoon yacht charter to Hydra and the Saronic. Athens-departure week, car-free island, candlelit dinners. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-hydra",
    touristType: ["Honeymooners", "Anniversary couples", "Athens cultural-trip couples"],

    whyTitle: "Why Hydra works for honeymoons",
    whyBody:
      "Most Greek honeymoon yacht charters head to Santorini for the photographic caldera. **The Saronic alternative - Hydra-based, Athens departure - is the quieter, more atmospheric, more 'discovered' honeymoon week.** " +
      "Hydra has **no cars, no scooters, no roads**. Donkeys do the luggage. The light at sunset is the same warm Greek light that drew Henry Miller and Leonard Cohen here in the 1960s, and the harbour is unchanged. A honeymoon yacht anchored off the harbour, dinner at Sunset restaurant looking back at the boat, candles on deck for nightcap - this is the photograph that couples send back. " +
      "**The Saronic loop is short and sheltered**, which matters for honeymoons: no transit-day pressure, no rough passages, no logistics. Athens → Aegina (1 day) → Hydra (2 days) → Spetses (1 day) → Poros → Athens. **Five nights of mostly anchorage** with two-hour daily passages. The couple is together, not surviving transits.",

    bestFor: [
      "Honeymoon couples combining Athens cultural days with yacht week",
      "Couples wanting an alternative to the Santorini honeymoon photograph",
      "First-time charterers who want a stress-free, sheltered week",
      "Anniversary trips returning to where the romance started",
      "Couples flying into Athens with limited time (5-7 nights)",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["sea-u", "sea-ya", "n-ice", "meliti-sy", "endless-beauty", "just-marie-2", "shooting-star"] && !(retired == true)',
    yachtsHeadline: "Saronic honeymoon yachts",
    featuredHeading: "Intimate Saronic yachts for two",

    whenTitle: "When to book",
    whenBody: "**May, June, and September** are the romantic-charter sweet spots - weather warm, harbours not yet overrun, restaurants atmospheric. **July and August** Hydra fills with Athenian high society - beautiful but louder. **Avoid the second week of August** (Greek Panagia holiday weekend).",

    insiderTips: [
      "Anchor off Mandraki (1 nm east of Hydra harbour) for the second night - same island, more secluded.",
      "Book the candlelit harbour table at Sunset for the third night. Watching your own yacht at anchor from a hilltop restaurant is the honeymoon image.",
      "Day-trip Spetses for the carriage-only old town - the same horse-drawn quiet as Hydra's donkeys.",
      "Stop at the Aegina pistachio market on Day 1. Buy 1kg for the chef; he'll work it into dessert all week.",
      "Vlychos beach (15 min walk from Hydra harbour) has the only sandy beach on the island. Take the trail at sunset.",
    ],

    faq: [
      { q: "How much does a Hydra honeymoon yacht week cost?", a: "Weekly rates €40-70K for 18-22m motor yachts (sleeps 4-6 in 2-3 cabins). APA 30-35% on top. Most Hydra honeymoon weeks settle €60-90K all-in for 5 nights." },
      { q: "Hydra vs Santorini for honeymoon - which is better?", a: "Different briefs. Santorini is the recognisable photograph but busier (especially August) and harder to anchor cleanly in the caldera. Hydra is quieter, more atmospheric, closer to Athens (less travel time), less photographed. Repeat couples often choose Hydra second." },
      { q: "Is 5 nights enough for a Saronic honeymoon?", a: "Yes, perfectly. Saronic doesn't have the Cycladic transit-time problem. 5 nights handles Aegina + Hydra + Spetses + Poros comfortably with daily swim stops." },
      { q: "Can we add Cyclades to a Hydra week?", a: "Possible for 10-night charters. Hydra → Mykonos is 100 nm (overnight steam). Most honeymoon weeks stay Saronic-only for the relaxed pace; if you want both, 10 nights is the right length." },
    ],

    ctaTitle: "Plan a Saronic honeymoon for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=honeymoon&region=Saronic",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "family-yacht-charter-hydra",
    urlPath: "/family-yacht-charter-hydra",
    eyebrow: "Family yacht to Hydra",
    h1: "Family Yacht Charter Hydra",
    tagline: "The easiest first-Greek-charter for families. Two hours from Athens, sheltered cruising, car-free island, multi-generational comfort.",
    seoTitle: "Family Yacht Charter Hydra",
    seoDescription: "Crewed family yacht charter to Hydra and the Saronic. Sheltered cruising, kid-safe anchorages, easy Athens departure. Index 2026 rates from EUR 10,900 a week.",
    canonical: "https://georgeyachts.com/family-yacht-charter-hydra",
    touristType: ["Families with young children", "Multi-generational groups", "First-time Greek family charter"],

    whyTitle: "Why Hydra is the easiest first family yacht week in Greece",
    whyBody:
      "Families considering a Greek yacht charter for the first time face one decision early: **how much logistics complexity can the group handle**? Multi-generational charters with grandparents and small children prioritise sheltered cruising, short passages, easy provisioning, and grounded contingency options. The **Saronic Gulf delivers all four**; the Cyclades doesn't. " +
      "**Hydra in particular is the family-charter sweet spot**. The island is car-free, so kids run freely on the harbour-front. The water in the Saronic stays flat through summer (no Meltemi). The passages are short - Athens to Hydra is 2 hours, Hydra to Spetses is 2.5 hours, Spetses to Poros is 2 hours. No 6-hour upwind beats, no rough overnight runs, no parents quietly worried about seasick kids. " +
      "**A 7-night family Saronic week** runs Athens → Aegina → Hydra (2 nights) → Spetses → Porto Cheli (mainland, sandy beaches) → Poros → Athens. Plenty of swim time at every anchorage, restaurant ashore most evenings, grandparents comfortable, kids exhausted in the good way.",

    bestFor: [
      "Multi-generational families with children under 12 plus grandparents",
      "First-time Greek-charter families wanting the easiest format",
      "Families flying into Athens with limited transit time",
      "Yacht-anxious family members (calm water reduces resistance)",
      "Cultural-trip families adding a yacht week to an Athens museum tour",
    ],

    yachtFilter: '_type == "yacht" && category in ["motor-yachts", "power-catamarans", "sailing-catamarans"] && !(cruisingRegion match "*Ionian*") && !(retired == true)',
    yachtsHeadline: "Family-suited yachts for the Saronic",
    featuredHeading: "Saronic family yachts for 2027",

    whenTitle: "When to book",
    whenBody: "**Mid-June to mid-July** and **mid-September** are the family-perfect Saronic windows - water 23-25°C, harbours not yet at peak, all restaurants open, school holidays still allow. **August** is the Greek-domestic peak; Saronic harbours are crowded with Greek family yachts. **May and early-June** the water is still cool for kids (19-21°C).",

    insiderTips: [
      "Brief George on ages of kids - yacht selection differs materially for under-5 vs 6-12 vs teen groups.",
      "Most Saronic family charters anchor 60-70% of nights and dock 30-40%. The kids prefer harbour evenings (taverna life); the parents prefer anchorage evenings (peace).",
      "Porto Cheli on the mainland has the longest sandy beach in the Saronic - Kosta Beach. Day-trip lunch anchorage.",
      "Spetses has horse-drawn carriages - only place in Greece. The 30-minute carriage ride is the kid memory of the week.",
      "Catamarans dominate the family-Saronic format. Stability + dual hulls + shallow draft = no seasick kid stories.",
    ],

    faq: [
      { q: "How much does a family Saronic yacht week cost?", a: "Weekly rates €40-65K for 14-18m catamarans (sleeps 8-10), €70-120K for 22-28m motor yachts (sleeps 8-12). APA 30-35% on top. Family Saronic weeks typically settle €60-100K all-in for 7 nights." },
      { q: "Is the Saronic boring compared to the Cyclades?", a: "For young families, no. For teenagers without sun-and-swim interest, possibly. The Saronic delivers Greek-village experience and beach time but lacks the Cycladic photography. For first-time families it's the right choice; for repeat charterers with older kids, consider the Ionian or Cyclades." },
      { q: "What if my child gets seasick?", a: "Catamaran cruising in the Saronic is the lowest-seasick-risk Greek format. Flat water, short passages, dual hulls. Children prone to motion sickness handle catamaran-Saronic combinations comfortably." },
      { q: "Can we go ashore every night?", a: "Yes, almost every night. Every Saronic destination has a tender-accessible village with restaurants. Aegina, Hydra, Spetses, Porto Cheli, Poros all support a 'tender in for dinner' format." },
    ],

    ctaTitle: "Plan a Saronic family week for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=family&region=Saronic",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-naxos",
    urlPath: "/catamaran-charter-naxos",
    eyebrow: "Catamaran in Naxos",
    h1: "Catamaran Charter Naxos",
    tagline: "The under-discovered Cyclades catamaran base. Bigger island, quieter anchorages, central position for the southern Cyclades loop.",
    seoTitle: "Catamaran Charter Naxos",
    seoDescription: "Crewed catamaran charter from Naxos chora. Central Cyclades base, Small Cyclades loop, family-friendly anchorages. Index 2026 rates from EUR 10,900 a week.",
    canonical: "https://georgeyachts.com/catamaran-charter-naxos",
    touristType: ["Families with young children", "Multi-couple groups", "Repeat Cyclades visitors"],

    whyTitle: "Why Naxos is the smart Cyclades catamaran base",
    whyBody:
      "Naxos is the **largest of the Cyclades** and the most-undervalued charter base in the group. While Mykonos and Paros sell through their summer charter weeks 9 months ahead, Naxos has **inventory available 4-5 months out** even for August. The reason isn't quality - it's brand recognition. Naxos doesn't show up in the Instagram aesthetic the way Mykonos does, so the international charter market under-prioritises it. " +
      "**The geography is excellent**. Naxos sits in the **central Cyclades**, 30 nm from Mykonos, 12 nm from Paros, 30 nm from Ios, 55 nm from Santorini. From Naxos a catamaran reaches the **Small Cyclades cluster** (Koufonisia, Schoinoussa, Iraklia, Donoussa) in 90 minutes - empty Cycladic anchorages that almost no Mykonos-departure charters reach. " +
      "**Catamarans win the Naxos brief** for the same reasons as Paros: shallow draft opens the best Small Cyclades beaches (Pori Beach on Koufonisia, Italida on Donoussa), stability handles the Meltemi, family format suits the local character.",

    bestFor: [
      "Families wanting the Cycladic experience without August Mykonos chaos",
      "Repeat Cyclades charterers exploring the Small Cyclades",
      "Late-booking charterers (Naxos has inventory when others don't)",
      "Two-couple catamaran weeks looking for quieter anchorages",
      "Photography-focused weeks (Small Cyclades are unphotographed)",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Naxos*") && (subtitle match "*catamaran*" || subtitle match "*Catamaran*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine Pajot*" || builder match "*Leopard*")',
    yachtsHeadline: "Catamarans based in Naxos chora",
    featuredHeading: "Central-Cyclades catamarans",

    whenTitle: "When to book",
    whenBody: "**June and September** are the Naxos sweet spots. **July and August** still book but with 3-4 months lead time (vs Mykonos's 9-month requirement). **May and October** are surprisingly viable - Naxos's larger landmass keeps the island lively into the shoulder seasons.",

    insiderTips: [
      "Anchor at Plaka Beach (south Naxos) for the longest sandy beach in the Cyclades. Walk-able from the anchorage.",
      "Day-trip Koufonisia for Pori Beach lunch - the bluest water in the Cyclades, accessible only by yacht/private boat.",
      "Naxos chora has the most-substantial restaurant scene of any Cycladic island after Mykonos. Eat ashore freely.",
      "Iraklia and Donoussa (Small Cyclades) are uninhabited-feeling outposts. Anchor for one night each - the disconnect is the value.",
      "Catamaran chartering Naxos sees Meltemi but less intensely than Mykonos. The island's bulk creates a wind shadow on the south coast.",
    ],

    faq: [
      { q: "How much does a Naxos catamaran charter cost?", a: "Weekly rates €28-50K for 12-15m catamarans, €55-95K for 16-20m luxury catamarans. APA 30-35% on top. 10-15% cheaper than equivalent Mykonos catamarans because of lower marina costs." },
      { q: "Is Naxos boring compared to Mykonos?", a: "Different. Naxos has substance - a real Greek island with year-round population, restaurants, beaches, archaeology. Mykonos has scene - beach clubs, parties, restaurant choreography. Naxos suits families and repeat Cyclades visitors; Mykonos suits party-energy groups." },
      { q: "Can we reach Mykonos and Santorini from Naxos?", a: "Yes. Mykonos is 30 nm north (about 3.5 hours by catamaran), Santorini is 55 nm south (about 7 hours). A 10-day Naxos-based charter handles both with the Small Cyclades in between." },
      { q: "What's special about the Small Cyclades?", a: "Empty. Koufonisia, Schoinoussa, Iraklia, Donoussa are uninhabited-feeling, all 5-15 nm from Naxos, accessible mainly by yacht. The Small Cyclades are the Cycladic photography most charterers never see." },
    ],

    ctaTitle: "Find a Naxos catamaran for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "honeymoon-yacht-charter-paros",
    urlPath: "/honeymoon-yacht-charter-paros",
    eyebrow: "Honeymoon yacht to Paros",
    h1: "Honeymoon Yacht Charter Paros",
    tagline: "The Cycladic honeymoon for couples who prefer Naoussa to Oia. Quieter Cyclades, longer evenings, the better-kept secret.",
    seoTitle: "Honeymoon Yacht Charter Paros",
    seoDescription: "Crewed honeymoon yacht charter to Paros and the Cyclades. Naoussa dinners, Antiparos anchorages, Despotiko archaeology. Index 2026 rates from EUR 10,900 a week.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-paros",
    touristType: ["Honeymooners", "Anniversary couples", "Couples avoiding crowds"],

    whyTitle: "Why Paros works for the quieter Cycladic honeymoon",
    whyBody:
      "The Cyclades have two honeymoon brand-names - **Mykonos and Santorini**. Both are extraordinary but both are loud. The couples who want the Cycladic light and the Aegean photography without the August balcony-crowds book **Paros**. " +
      "Paros gives you **Naoussa for dinner** - a Cycladic fishing village turned restaurant town, white-washed and bougainvillea-lined, ten restaurants within five minutes' walk, the kind of place where you eat the same dish three nights running because it's that good. **Antiparos for the beaches** - Soros, Apantima, the protected south-facing coves where the yacht anchors and the swimming is the photograph. **Despotiko for the archaeology** - uninhabited island west of Antiparos with a continuously-excavated Mycenaean sanctuary; you anchor, walk, swim, leave by sunset. " +
      "**A 7-day Paros honeymoon week** runs Paros (Naoussa) → Antiparos (Soros) → Despotiko → Naxos (Plaka) → Small Cyclades (Koufonisia) → Antiparos → Paros. **120 nm round trip**, all short passages, two nights in Naoussa for the bookend dinners.",

    bestFor: [
      "Honeymoon couples who've been to Mykonos or Santorini and want the alternative",
      "Photography-focused couples who care about empty anchorages",
      "Couples flying direct to Paros airport (PAS) from Athens",
      "Anniversary couples returning for a quieter Cycladic week",
      "Couples wanting the Cycladic light without the Cycladic energy",
    ],

    yachtFilter: '_type == "yacht" && slug.current in ["sea-u", "sea-ya", "n-ice", "meliti-sy", "endless-beauty", "just-marie-2", "shooting-star"] && !(retired == true)',
    yachtsHeadline: "Honeymoon yachts based around Paros",
    featuredHeading: "Intimate Cycladic yachts",

    whenTitle: "When to book",
    whenBody: "**Late May through June** and **early-mid September** are the honeymoon-perfect Paros windows. Water 22-25°C, restaurants all open, Naoussa atmospheric without the August crush. **July and August** Paros is energetic but the romance dilutes. **Avoid the second week of August** (Greek Panagia, Naoussa packed).",

    insiderTips: [
      "Anchor at Kolymbithres (1 nm east of Naoussa) for the protected swim mornings. Tender into Naoussa harbour for dinner.",
      "Soros beach on Antiparos for the lunch anchorage. South-facing, sandy, almost-empty in shoulder season.",
      "Despotiko archaeology - the Mycenaean sanctuary excavation is open for visits, no entry fee, no crowds.",
      "Naoussa has 10 restaurants; we recommend Mario, Ouzeri Stou Frix, and Soso. The first two need reservations.",
      "Take a Paros-pottery tour mid-week (Parikia old town has 3 working studios). Anniversary gift opportunity.",
    ],

    faq: [
      { q: "How much does a Paros honeymoon yacht week cost?", a: "Weekly rates €35-70K for 18-25m motor yachts (sleeps 4-6). APA 30-35% on top. Most Paros honeymoon weeks settle €55-95K all-in." },
      { q: "Paros vs Santorini for honeymoon - which is better?", a: "Different. Santorini wins for the recognisable photograph (caldera) and once-in-a-lifetime brand. Paros wins for quieter restaurant atmosphere, easier anchorages, less August chaos. Couples wanting iconic photos pick Santorini; couples wanting a less-photographed week pick Paros." },
      { q: "Can we fly direct to Paros?", a: "Paros airport (PAS) has direct flights from Athens (40 min) only. International couples typically fly Athens → Paros same-day. No direct international flights yet." },
      { q: "Is Antiparos worth the side-trip?", a: "Absolutely. Antiparos is the quieter, smaller sister island accessible only by yacht/local ferry. Soros and Apantima beaches plus Despotiko archaeology are honeymoon highlights." },
    ],

    ctaTitle: "Plan a Paros honeymoon for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=honeymoon&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht-charter-kefalonia",
    urlPath: "/sailing-yacht-charter-kefalonia",
    eyebrow: "Sailing yacht to Kefalonia",
    h1: "Sailing Yacht Charter Kefalonia",
    tagline: "The Odysseus's-island sailing week. Fiscardo, Assos, Myrtos - the classic Ionian sailor's destinations.",
    seoTitle: "Sailing Yacht Charter Kefalonia",
    seoDescription: "Crewed sailing yacht charter to Kefalonia. Fiscardo, Assos, Myrtos Beach, Ithaca day-trip. From EUR 24,000 a week, Index 2026.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-kefalonia",
    touristType: ["Sailing enthusiasts", "Couples", "Multi-generational sailing families"],

    whyTitle: "Why Kefalonia is the Ionian sailor's destination",
    whyBody:
      "Lefkada is the largest Ionian charter base, but **Kefalonia is the destination Lefkada-based sailors travel to**. The northern Kefalonian coast - **Fiscardo, Assos, Myrtos Beach** - is the most-photographed stretch of the Ionian Sea, and every 7-day Ionian sailing week visits these three. Chartering directly from Kefalonia skips the Lefkada-to-Kefalonia transit day and gives you immediate access. " +
      "**Fiscardo** is the Ionian's flagship village - pastel houses, Venetian architecture, four good restaurants, Mediterranean-mooring quay. **Assos** is the smaller, more atmospheric option - a peninsula with a Venetian fortress at the tip and ten houses curved around a tiny harbour. **Myrtos Beach** is the photograph everyone knows - chalk-white pebbles, electric-blue water, the Cliffs of Pelekas backdrop. " +
      "**A 7-day Kefalonia-based sailing week** runs Kefalonia (Argostoli) → Ithaca (Vathy or Frikes) → Kefalonia (Fiscardo) → Kefalonia (Assos) → Lefkada (Sivota or Vasiliki) → Meganisi → Kefalonia. **Roughly 150 nm round trip**, all sheltered Ionian thermal-wind sailing.",

    bestFor: [
      "Sailing-experienced couples who've outgrown Lefkada-only weeks",
      "Multi-generational sailing families (sheltered Ionian, predictable wind)",
      "Ithaca-pilgrimage sailors (Odysseus's island, classic Aegean literature)",
      "Photographers chasing Myrtos Beach and Fiscardo light",
      "Charterers who want the Ionian without the Lefkada-base crowds",
    ],

    yachtFilter: '_type == "yacht" && category in ["sailing-monohulls", "sailing-catamarans"] && !(retired == true)',
    yachtsHeadline: "Sailing yachts based in Kefalonia",
    featuredHeading: "Kefalonia-based sailing yachts",

    whenTitle: "When to book",
    whenBody: "**June and September** are optimal. **July and August** Fiscardo and Assos fill rapidly - the photogenic restaurants need 48-hour reservations. **May and October** the Ionian holds longer than the Aegean - Kefalonia is sailable through mid-October most years.",

    insiderTips: [
      "Anchor in Foki Bay (1 nm south of Fiscardo) and tender into Fiscardo. Avoid the Fiscardo Mediterranean-mooring scrum.",
      "Assos has one quay slot for medium-size yachts. Reserve via the harbourmaster 24h ahead or anchor in the small bay outside the village.",
      "Myrtos Beach is no-anchorage (no holding, exposed). Drop anchor 200m offshore, swim/tender ashore, take photos, leave by mid-afternoon.",
      "Ithaca's Vathy is too big and motor-yacht-friendly. Frikes (north Ithaca) is the sailor's overnight - smaller, quieter, the village dog adopts you for the evening.",
      "Robola wine (Kefalonia's native grape) is the Ionian's best white. Buy 6 bottles at the Argostoli market for the week.",
    ],

    faq: [
      { q: "How much does a Kefalonia sailing yacht charter cost?", a: "Weekly rates €22-40K for 12-16m sailing yachts, €45-75K for 17-22m, €85-140K for 24-30m. Comparable to Lefkada-based rates." },
      { q: "How does Kefalonia compare to Lefkada as a sailing base?", a: "Lefkada has the larger fleet and easier flight access (Preveza airport). Kefalonia is the destination Lefkada-based sailors visit - chartering directly from Kefalonia gives you immediate access to Fiscardo, Assos, and Ithaca without the day-one transit." },
      { q: "Can we reach Corfu from Kefalonia?", a: "Yes for 10-day charters. Kefalonia to Corfu is 100 nm - a Paxos overnight breaks the passage. 7-day charters stay south (Kefalonia + Ithaca + Lefkada + Meganisi)." },
      { q: "Is Kefalonia airport (EFL) easy to reach?", a: "Direct flights from London, Manchester, Vienna, Rome in summer. 20 minutes from Argostoli marina by taxi. Athens connection adds 5 hours." },
    ],

    ctaTitle: "Find a Kefalonia sailing yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-kefalonia",
    urlPath: "/catamaran-charter-kefalonia",
    eyebrow: "Catamaran to Kefalonia",
    h1: "Catamaran Charter Kefalonia",
    tagline: "The family-friendly version of the Fiscardo + Assos + Ithaca week. Stable cruising, shallow anchorages, full Ionian classic.",
    seoTitle: "Catamaran Charter Kefalonia",
    seoDescription: "Crewed catamaran charter to Kefalonia. Fiscardo, Assos, Ithaca classic Ionian itinerary. From EUR 10,900 a week, Index 2026.",
    canonical: "https://georgeyachts.com/catamaran-charter-kefalonia",
    touristType: ["Families with children", "Multi-couple groups", "Ionian first-timers"],

    // 2026-09-07 (plan #10, depth): 565 → ~1,500 words, 31 impressions at
    // position 7.7. The week is rebuilt on the verified Kefalonia, Ithaca,
    // Lefkada, Meganisi and Zakynthos anchorage records and the house
    // distance table; the unsourced heel angles, wind speeds, platform
    // heights, the 1.5 metre Foki depth, the Fiskardo 48-hour rule, the
    // Myrtos holding claim, the invented rates and the 60 mile figure are
    // gone. Named yachts from their own listings.
    quickAnswer: {
      question: "Which catamaran should I charter for Kefalonia?",
      answer: "A crewed catamaran of 16 to 24 metres, because the Kefalonia week is short passages and shallow bays: Fiskardo is 10 nautical miles from Ithaca and 25 from Lefkada on our distance table, Vathy on Ithaca is three and a half to four metres deep, and the Meltemi never reaches the Ionian. ARIVA, a Fountaine Pajot Power 67 with five cabins for ten, is based in the Ionian at Corfu on her own listing at EUR 34,000 to 48,000 a week; on the Greek Charter Index 2026 a fully crewed sailing catamaran for eight runs EUR 18,900 to 27,500 at 16 to 19 metres and EUR 31,500 to 43,500 at 20 to 22, per yacht before VAT and APA, one price for the whole party.",
    },
    keyFacts: [
      "Kefalonia anchorages from the verified guide: Fiskardo 8 to 15 metres over sand and weed with all-round shelter; Sami Bay 10 to 20 metres, sheltered north to west, the gateway to the Melissani and Drogarati caves; Argostoli outer bay 8 to 15 metres over mud with very good holding.",
      "Legs from the house distance table: Kefalonia to Ithaca 10 nautical miles, to Lefkada 25, to Zakynthos 35; Corfu to Ithaca 95, so the Kefalonia week loops from Lefkada rather than from Corfu.",
      "Based in the Ionian on her own listing: ARIVA, Fountaine Pajot Power 67, five cabins, ten guests, four crew, from Corfu, EUR 34,000 to 48,000 a week; on the Index a 16 to 19 metre sailing catamaran runs EUR 18,900 to 27,500, a 20 to 22 metre EUR 31,500 to 43,500.",
      "APA on a catamaran runs 20 to 30% of the base, VAT 5.2 to 12% by certification, a customary 10 to 15% crew gratuity on the base. The rate card does not change by region; the Ionian saves on the delivery line.",
      "The Meltemi never reaches the Ionian; the summer wind is the north-westerly afternoon sea breeze, and the all-weather hole of the area is Vlicho Bay on Lefkada, 5 to 7 metres over mud. One in six enquiries on this desk in 2026 came from a family.",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026 and anchorage guides", href: "/greek-charter-index-2026" },
    whyTitle: "Why a catamaran handles the Kefalonia brief",
    whyBody:
      "The Kefalonia week, Fiskardo, Ithaca, Sami, Argostoli, with Zakynthos as the long day south, is the classic of the southern Ionian, and the catamaran is the hull it was built for. **First, stability.** The Ionian summer wind is the north-westerly afternoon sea breeze, gentle by Cyclades standards, and a catamaran stays level in it where a monohull heels; the guest who is seasick on a keelboat is fine on two hulls. **Second, the water.** A catamaran's swim platforms sit close to the surface and span the whole beam, so at Fiskardo, in the Aetos coves on Ithaca and off the beaches the party walks into the sea from the boat. **Third, draft.** Vathy on Ithaca is three and a half to four metres at the quay and Port Kalamos two and a half to four; a catamaran lies in them where a deeper keel anchors off. **Fourth, cabins.** A four-cabin catamaran gives two couples two equal cabins, and a five-cabin one gives two families a cabin each, without the master-and-guest hierarchy of a monohull. " +
      "The passages are short: Fiskardo to Ithaca 10 nautical miles, to Lefkada 25, to Zakynthos 35, all mornings, and the anchorages are from our own guides: Fiskardo 8 to 15 metres over sand and weed with all-round shelter, crowded in August, a second anchoring attempt often helping; Sami Bay 10 to 20 metres with good holding, sheltered from north to west; Argostoli outer bay 8 to 15 metres over mud with very good holding, the capital for provisioning. The one honest caution is Zakynthos: Navagio is a fair-weather morning anchorage, left as soon as the wind picks up, and the night is spent in the port of Zakynthos or back at Argostoli.",

    bestFor: [
      "Two-couple charters wanting the classic Ionian route comfortably",
      "Families with children, the shallow bays and the level deck",
      "Three-generation groups, grandparents and children on one platform",
      "Ionian first-timers wanting the photogenic destinations without the Meltemi",
      "Repeat Mediterranean charterers trying the catamaran for the first time",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Kefalonia*") && (subtitle match "*catamaran*" || subtitle match "*Catamaran*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine Pajot*" || builder match "*Leopard*")',
    yachtsHeadline: "Catamarans based in Kefalonia",
    featuredHeading: "Kefalonia / Ionian catamarans",

    whenTitle: "When to book",
    whenBody: "**June and September** are the family Kefalonia weeks: warm water, empty bays, and on the Greek Charter Index the shoulder months price 15 to 25% below peak on the same rate card with three to four months of lead time rather than a year. **July and August** commit six to twelve months ahead, and Fiskardo is crowded every evening; the catamaran that wants the harbour arrives early and the one that wants quiet sleeps in the Aetos coves on Ithaca. **May and October** work for the shoulder; the Meltemi never arrives, and what the captain watches is the afternoon sea breeze.",

    insiderTips: [
      "Fiskardo, 8 to 15 metres over sand and weed with all-round shelter, is the harbour everyone wants in August: arrive early, and if the first anchor drags on the patchy holding try again rather than settle. Kioni on Ithaca, sheltered from all but the rare east-south-easterly, is the alternative across ten miles of water.",
      "Sami Bay, 10 to 20 metres with good holding and shelter from north to west, is the anchorage for the Melissani and Drogarati caves, a short taxi from the quay; Agia Efimia up the coast has patchy holding, so use plenty of scope.",
      "Argostoli, 8 to 15 metres over mud with very good holding in the outer bay, is the capital and the provisioning stop; the chef restocks here mid-week.",
      "Zakynthos is a morning, not a night: Navagio is a fair-weather day anchorage left as soon as the wind picks up, Porto Vromi takes a buoy or a tripline over a foul bottom, and the yacht sleeps in the port of Zakynthos or runs the 35 miles back to Argostoli.",
      "Vlicho Bay on Lefkada, 5 to 7 metres over mud with protection from every direction, is the all-weather bolt-hole 25 miles north, and Nidri beside it has fuel and full services.",
    ],

    faq: [
      { q: "How much does a Kefalonia catamaran charter cost?", a: "Per yacht per week before VAT and APA: ARIVA, the Fountaine Pajot Power 67 based in the Ionian, EUR 34,000 to 48,000 from her own rate card; on the Greek Charter Index 2026 a fully crewed sailing catamaran runs EUR 10,900 to 22,000 at 12 to 16 metres, EUR 18,900 to 27,500 at 16 to 19, EUR 31,500 to 43,500 at 20 to 22 and EUR 56,000 to 90,000 at 23 to 24; a power catamaran EUR 14,000 to 28,000 up to 17 metres and EUR 34,000 to 69,000 at 20 to 22. Add APA of 20 to 30% of the base, VAT at 5.2 to 12% by the yacht's certification, and a customary 10 to 15% crew gratuity on the base. A EUR 30,000 base week lands around EUR 38,000 to 43,000 all-in before gratuity." },
      { q: "Can we charter a catamaran for the classic Fiskardo and Ithaca route?", a: "Yes, and it is the week the southern Ionian is known for: Fiskardo with its all-round shelter, Vathy and the Aetos coves on Ithaca ten miles away, Sami for the caves, Argostoli for the capital, with Zakynthos as the long morning south. Every leg is a morning, every night has a lee, and a catamaran lies in the shallow bays where a keelboat anchors off." },
      { q: "Where does the charter start, Kefalonia or Lefkada?", a: "Usually Lefkada, at Nidri, which has fuel and full services, is 25 nautical miles from Fiskardo and is where most Ionian catamarans are based; Kefalonia has an international airport with summer flights and the yacht can position to Argostoli for a Kefalonia start, quoted per yacht on the delivery line. We say which is cheaper for your dates before you book flights." },
      { q: "Can we add Corfu and Paxos to a Kefalonia catamaran week?", a: "In two weeks, not one. Corfu to Ithaca is 95 nautical miles on the house table, Paxos to Lefkada 50 and Lefkada to Kefalonia 25, so the whole chain is a fortnight, Corfu to Lefkada one way. A seven-night week stays south of Lefkada: Meganisi, Ithaca, Kefalonia and Zakynthos. Our Ionian two-week page writes the long version." },
      { q: "Is the Meltemi a problem in Kefalonia?", a: "No. The Meltemi never reaches the Ionian. The summer wind is the north-westerly afternoon sea breeze, which builds after midday and eases overnight, and the enclosed bays take katabatic gusts at night; the passages are done in the morning and the anchorages above all have a lee. That is the whole reason we route families with young children here rather than into the Cyclades." },
      { q: "How far ahead should I book a Kefalonia catamaran?", a: "Six to twelve months for July and August on the Greek Charter Index, three to four for June and September, when the shoulder months price 15 to 25% below peak. The Ionian catamarans are few and the five-cabin ones go first. On this desk, 26 of the 57 dated enquiries received between 30 May and 6 September 2026 were already for 2027." },
    ],

    ctaTitle: "Find a Kefalonia catamaran for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Ionian",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-rhodes",
    urlPath: "/motor-yacht-charter-rhodes",
    eyebrow: "Motor yacht to Rhodes",
    h1: "Motor Yacht Charter Rhodes",
    tagline: "The Dodecanese motor-yacht week. Symi for lunch, Lindos for dinner, the latest-season Greek charter destination.",
    seoTitle: "Motor Yacht Charter Rhodes",
    seoDescription: "Motor yacht charter from Rhodes: Symi, Lindos, Karpathos and the late-season Dodecanese, a sailing guide. This house works from Athens, Lefkada and Corfu.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-rhodes",
    touristType: ["Dodecanese visitors", "Late-season charterers", "Cultural-travel groups"],

    whyTitle: "Why Rhodes is Greece's latest-season motor-yacht charter base",
    whyBody:
      "Most Greek charter destinations wind down by end-September. **Rhodes runs through mid-October**. The southern Aegean position keeps water 2-3 weeks warmer than the Cyclades, the Meltemi is replaced by a gentler thermal, and the photogenic Dodecanese destinations (Symi, Lindos, Halki, Karpathos) all stay open. " +
      "**Symi**, 15 nm north of Rhodes, is the Dodecanese's most-photographed village - pastel-coloured neoclassical houses tumbling down both sides of a harbour, ten-minute walk from yacht-mooring to dinner. A Rhodes-based motor yacht hits Symi for lunch on Day 2 and stays through dinner. " +
      "**Lindos**, on Rhodes itself (1 hour from the marina), is the Acropolis-with-beach combination - the white-washed village beneath a Knights Templar fortress overlooking St. Paul's Bay. Anchor in St. Paul's, walk the village, climb the fortress, dinner ashore. " +
      "**A 7-day Rhodes motor-yacht week** runs Rhodes (Mandraki) → Symi → Halki → Karpathos (northern coast) → Tilos → Symi → Rhodes (Lindos). **Roughly 250 nm**, all sheltered Dodecanese cruising.",

    bestFor: [
      "October charterers who can't make Cycladic dates work",
      "Cultural-travel groups (Rhodes Old Town, Lindos archaeology, Symi neoclassical)",
      "Direct-flight charterers (Rhodes airport (RHO) has direct flights from northern Europe)",
      "Late-season honeymoons (Rhodes stays warm into mid-October)",
      "Repeat Mediterranean charterers exploring beyond the Cyclades",
    ],

    yachtFilter: '_type == "yacht" && category == "motor-yachts" && !(retired == true)',
    yachtsHeadline: "Motor yachts based in Rhodes",
    featuredHeading: "Dodecanese motor yachts",

    whenTitle: "When to book",
    whenBody: "**June and September** are optimal. **October** is uniquely viable - Rhodes is Greece's latest-season charter destination. **July and August** are hot (30-35°C onshore) but the south-Aegean thermal keeps the boat comfortable. **May** the water is still cool (19-20°C) but the islands are atmospheric.",

    insiderTips: [
      "Symi harbour Mediterranean-mooring fills by 16:00 in season. Arrive by mid-afternoon or anchor outside the harbour and tender in.",
      "St. Paul's Bay at Lindos is the iconic anchorage. Arrive 09:00 for the best mooring slots - by 11:00 day-tripper boats from Rhodes arrive.",
      "Halki is the Dodecanese's quietest island - one harbour-front village (Emborios), three restaurants, no tourist infrastructure. Worth a full day.",
      "Rhodes Old Town for one dinner - walk the medieval Knights Templar streets. The yacht stays at Mandraki marina; you walk into the Old Town in 10 minutes.",
      "Karpathos's north coast (Olympos village) is an hour by car from the south anchorages - culturally extraordinary but logistically demanding. Brief George if interested.",
    ],

    faq: [
      { q: "How much does a Rhodes motor yacht charter cost?", a: "Weekly rates €55-95K for 22-28m motor yachts, €120-200K for 30-40m. APA 30-35% on top. Comparable to Cycladic equivalent - slightly cheaper because of less crew premium and shorter passages." },
      { q: "Can we charter from Rhodes in October?", a: "Yes - Rhodes is Greece's latest-season viable charter destination. Water stays 22-24°C until mid-October, the thermal wind is gentle, the Dodecanese villages stay open. The only Greek charter market still active through October." },
      { q: "How does the Dodecanese compare to the Cyclades?", a: "Different. The Dodecanese is south-Aegean, warmer, less Meltemi-affected, more Byzantine and Knights Templar in cultural character. The Cyclades is photogenic-iconic; the Dodecanese is layered-historical. Both worthwhile; different briefs." },
      { q: "Can we cross to Turkey from Rhodes?", a: "Possible - Marmaris (Turkey) is 20 nm east of Rhodes. Requires advance customs notification. Some charters add a Turkish leg (Marmaris, Bozburun) for the cultural diversity. VAT treatment may shift to 24% if non-Greek time exceeds the threshold." },
    ],

    ctaTitle: "Find a Rhodes motor yacht for 2027.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Dodecanese",
  },
];

export function getComboBySlug(slug) {
  return COMBOS.find((c) => c.slug === slug) || null;
}
