// Tier 3 combo landing pages — yacht-type × destination intersections.
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
    seoTitle: "Motor Yacht Charter Mykonos 2026 | Crewed Motor Yachts",
    seoDescription: "Crewed motor yacht charter from Mykonos. 18-50 metre motor yachts with chef, stabilisers, full toy fleet. Cyclades itineraries. Weekly rates from €60K.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-mykonos",
    touristType: ["UHNW Mykonos visitors", "Couples", "Families"],

    whyTitle: "Why motor yachts dominate Mykonos charters",
    whyBody:
      "Mykonos is **a motor-yacht destination first**. The combination of the **Meltemi** (15 to 25 knot summer wind), the long inter-island day-passages (Mykonos to Folegandros is 60 nm, to Santorini 80 nm), and the comfort expectations of the typical Mykonos charterer all point at the same yacht type. " +
      "A 30-metre motor yacht in Mykonos in August does what no sailing yacht can: anchors stabilised off Ornos at noon, transits 40 nm to Naoussa for dinner by 18:00, beats the Meltemi back to Mykonos by midnight without rolling the master cabin guests out of their beds. The pace matches the energy of the destination. " +
      "We base 8 motor yachts in Mykonos directly through the high season (June to September) - they don't reposition from Athens for charter starts. This saves a positioning leg of 6 to 8 hours from the start of the week and lets the charter begin with dinner ashore rather than a long day at sea.",

    bestFor: [
      "Mykonos-based weeks with multiple Cycladic destinations",
      "Charters that include Delos archaeological site day-trip",
      "August charters when Meltemi makes sailing yachts uncomfortable",
      "Repeat Mykonos visitors stepping up from hotel weeks",
      "UHNW principals arriving via Mykonos airport direct flights",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Couach*" || builder match "*Pershing*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Heesen*" || builder match "*Benetti*" || builder match "*Custom Line*")',
    yachtsHeadline: "Motor yachts based in or near Mykonos",
    featuredHeading: "Mykonos-ready motor yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**Mykonos motor yacht weeks book 9-12 months ahead** for peak August. **June and September** are the most-bookable shoulder weeks at 20-30% off August peak - the Meltemi has softened, the chora is quieter, the beach clubs still operational. **May and October** are possible but the season is winding down; some boats reposition out by mid-October.",

    insiderTips: [
      "Anchor at Ornos rather than the New Port - quieter, cleaner water, tender to the chora.",
      "Two tenders on the boat matters more in Mykonos than anywhere else. One for guest transfers, one for the chef's market runs.",
      "The Delos archaeological site closes at 15:00 - dawn anchorage, walk 09:00, back to Ornos by lunch.",
      "Mykonos marina fees are €1,500-€3,500/night for 30m+ yachts. Anchor at Ornos instead unless boarding/disembarking.",
      "Naoussa on Paros for dinner is the yacht-set route. 90 min by motor yacht, eat at Ouzeri Stou Frix or Soso, back to Mykonos by midnight.",
    ],

    faq: [
      { q: "How much does a motor yacht charter from Mykonos cost?", a: "Weekly rates start €60K for a 22-metre motor yacht and run to €450K+ for a 40-metre superyacht. Most Mykonos motor yacht charters settle €120-€250K base before APA (30-35%) and Greek VAT at the certified rate." },
      { q: "Which yachts are based in Mykonos?", a: "Roughly 8 motor yachts in our fleet base in Mykonos for high season including 2-3 in the 30-40 metre range. Direct boarding saves the Athens positioning leg." },
      { q: "Can we charter just for Mykonos August week?", a: "Yes. Mykonos motor yacht weeks for the peak August dates book 9-12 months out. Available motor yachts at that period are typically the larger 35-50m vessels - the smaller fleet sells through fastest." },
      { q: "What's the most-popular Mykonos motor yacht week?", a: "August 15-22 is the historical peak. August 8-15 and August 22-29 are equally booked. For more relaxed pricing and density, June and September deliver the same Mykonos experience at 20-30% less." },
    ],

    ctaTitle: "Find a motor yacht for Mykonos 2026.",
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
    seoTitle: "Motor Yacht Charter Santorini 2026",
    seoDescription: "Crewed motor yacht charter from Santorini. View the caldera from the water, day-trip to Folegandros, full Cycladic loop. Weekly rates from €60K.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-santorini",
    touristType: ["Santorini-based UHNW", "Couples", "Honeymooners"],

    whyTitle: "Why a motor yacht is the right Santorini charter",
    whyBody:
      "Santorini gets photographed from balconies in Oia for fifteen minutes at sunset, with 200 people behind every camera. Charter guests see the same caldera **at anchor, from the water, for an entire evening, alone**. That's the whole reason to charter from Santorini. " +
      "Motor yachts win the Santorini brief because the caldera anchorage is **open to swell and deep** (40-60m sounding most places). Sailing yachts hold less well in the caldera. Motor yachts with stabilisers ride out the wraparound waves and let dinner happen on deck without choreography. " +
      "From Santorini, the **Southern Cyclades** open up: Folegandros at 35 nm, Ios at 30 nm, Sikinos and the Small Cyclades within day-sail. A 7-day Santorini-based charter is one of the strongest Cycladic loops we run. Two days in the caldera (sunset both nights), three days exploring south Cyclades, return to Santorini for disembarkation.",

    bestFor: [
      "Couples on honeymoon arriving via Santorini airport direct flights",
      "Charters built around 2-3 caldera nights",
      "Photographers and content creators (the caldera is the shot)",
      "Repeat Cycladic charterers wanting a south-end loop",
      "Anyone who's done the hotel-balcony Santorini and wants the yacht version",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Santorini*" || cruisingRegion match "*Cyclades*") && (subtitle match "*motor*" || subtitle match "*Motor*")',
    yachtsHeadline: "Motor yachts for Santorini charters",
    featuredHeading: "Caldera-ready motor yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**June and September** are the cleanest Santorini motor yacht months: full caldera season, light cruise-ship density, comfortable temperatures. **July-August** is spectacular but the Vlyhada marina (Santorini's only protected port) is heavily booked; tender mooring at the caldera works but plan ahead. **October** is the most underrated month - sunsets stay extraordinary, water swimmable, marina availability genuine.",

    insiderTips: [
      "Vlyhada marina is the only protected port. Book months in advance for July-August.",
      "Anchor below Oia for sunset, not below the chora - the chora side has the cliff drop and the wind eddy.",
      "Drone shots over the caldera from the foredeck are the highest-shared photos from any Cycladic charter. Plan the timing.",
      "Folegandros (35 nm) is the natural next stop. Don't loop back to Santorini every night.",
      "Skip the Akrotiri archaeological site on hot days; do it from a different port on a cool day.",
    ],

    faq: [
      { q: "Can a yacht anchor in the Santorini caldera overnight?", a: "Yes, weather permitting. The caldera is open to the south and can get swell on certain wind days. Captains move to the lee of Oia or the eastern coast when conditions require. For a calm August week, expect 2-3 caldera anchorage nights." },
      { q: "How long does a Santorini-based charter typically run?", a: "Seven nights is the standard. The Cycladic loop from Santorini (Folegandros, Sikinos, Ios, Small Cyclades) takes 4-5 days, with 2-3 days at the caldera bookending. Extending to 10 days adds Astypalaia or Anafi." },
      { q: "Can we board a yacht directly in Santorini?", a: "Yes. Several motor yachts in our fleet base in or reposition to Santorini for high-season charters. Vlyhada Marina is the main boarding point." },
      { q: "How much does a Santorini motor yacht charter cost?", a: "Base rate €60-€280K depending on yacht size, plus 30-35% APA and Greek VAT at the certified rate. Most charters settle €120-€220K all-in for a 25-30m motor yacht." },
    ],

    ctaTitle: "Charter a motor yacht for Santorini 2026.",
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
    seoTitle: "Catamaran Charter Mykonos 2026",
    seoDescription: "Crewed catamaran charter from Mykonos. Sailing and power catamarans 50-80 feet, family-friendly, chef + hostess. Cycladic itineraries. From €30K.",
    canonical: "https://georgeyachts.com/catamaran-charter-mykonos",
    touristType: ["Families", "Friend groups", "Multi-couple charters"],

    whyTitle: "Why catamarans work for Mykonos",
    whyBody:
      "Mykonos in August is hot, busy, and exposed to Meltemi. A catamaran solves all three. **Wide deck for the heat** (more shaded living area than equivalent monohulls). **Zero heel and minimal anchor-side roll** in the strong Meltemi. **Shallow draft** that opens anchorages monohulls and motor yachts can't reach (Super Paradise back beach, the inside of Rhenia). " +
      "For **family groups of 6-10**, a 60-80 foot catamaran in Mykonos hits the sweet spot: enough cabin count, the children stay safe on the flat decks, and the budget runs 25-40% below an equivalent-capacity motor yacht. " +
      "The Mykonos catamaran fleet is split between **sailing catamarans** (Lagoon, Fountaine Pajot, Bali - slower, lower fuel cost, more authentic sailing feel) and **power catamarans** (Aquila, Sunreef Power - 18-22 knot cruise, motor-yacht-pace itineraries). Either works for Mykonos; the choice depends on whether your guests want sailing rhythm or fast inter-island transits.",

    bestFor: [
      "Multi-family Mykonos weeks (2-3 families on one boat)",
      "Friend groups of 6-10 wanting deck space",
      "Children-aboard charters needing flat platforms",
      "Charterers stepping up from a bareboat catamaran week",
      "Mykonos honeymoons with a budget-conscious framing",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && (subtitle match "*catamaran*" || subtitle match "*cat*")',
    yachtsHeadline: "Catamarans for Mykonos",
    featuredHeading: "Mykonos-based catamarans for 2026",

    whenTitle: "When to book",
    whenBody: "Catamarans book 6-9 months ahead for peak August. **June, July, September** are the catamaran sweet spots - warm water, manageable Meltemi (or in catamaran-tolerant range), full beach-club operation. **May and October** suit pre/post-season weeks at 30-40% off peak.",

    insiderTips: [
      "Catamaran beam means specific anchorages: Super Paradise back beach is catamaran-friendly, Ornos is fine for all yacht types.",
      "Rhenia island (between Mykonos and Delos) has a sheltered cove that catamarans can enter and monohulls cannot. Quiet swim-day option.",
      "Mykonos marina has limited catamaran berths (wide-beam slots are scarce). Plan around anchorage rather than marina dockage.",
      "Friday night dinner: the yacht-set move is Naoussa on Paros via catamaran motor (90 min). Catamaran is comfortable on the return leg even in Meltemi.",
      "Sunreef Power catamarans (the largest in the fleet) command the premium rate but compete with motor yachts for comfort. Worth considering if budget allows.",
    ],

    faq: [
      { q: "How much does a catamaran charter from Mykonos cost?", a: "Weekly rates start €30K for a 50-foot crewed catamaran and run to €130K+ for an 80-foot power catamaran. Most Mykonos catamaran charters settle €45-€85K base before APA and VAT." },
      { q: "Sailing or power catamaran for Mykonos?", a: "Sailing catamarans give the rhythm and lower fuel cost; perfect for charters with sailing curiosity. Power catamarans give motor-yacht-pace itineraries without the motor-yacht roll. For pure-Cyclades weeks staying near Mykonos, sailing works. For crossing to Santorini and beyond, power saves time." },
      { q: "Are catamarans good for families with kids in Mykonos?", a: "Best yacht format for families in Mykonos specifically. The Meltemi-tolerant stability, flat decks, and shallow-draft anchorage access all favour children. We place 70% of our family Mykonos charters on catamarans." },
      { q: "Can a catamaran fit in Mykonos marina?", a: "Limited slots. Most catamaran charters anchor at Ornos or Super Paradise; marina dockage typically only for boarding/disembarkation. Brief us at booking on marina nights needed." },
    ],

    ctaTitle: "Charter a catamaran for Mykonos 2026.",
    ctaPrimary: "Find a catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&region=Cyclades",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran-charter-lefkada",
    urlPath: "/catamaran-charter-lefkada",
    eyebrow: "Catamaran in Lefkada",
    h1: "Catamaran Charter Lefkada",
    tagline: "Sheltered Ionian waters. Wide decks. Children on board. The gentlest Greek charter week in our fleet.",
    seoTitle: "Catamaran Charter Lefkada 2026",
    seoDescription: "Crewed catamaran charter from Lefkada. The Ionian's family-friendliest week. Kefalonia, Ithaca, Paxos in a single sheltered loop. From €25K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Lefkada*") && subtitle match "*catamaran*"',
    yachtsHeadline: "Catamarans based in Lefkada",
    featuredHeading: "Lefkada-ready catamarans for 2026",

    whenTitle: "When to book",
    whenBody: "**May through October** is the Ionian charter season. **June, July, September** are the sweetest weeks - warm water, gentle wind, marinas at comfortable density. **August** is busier but never crowded by Cycladic standards. **Late September and October** are the under-the-radar shoulder months: water still 22°C, marinas half-empty, rates 30-40% off August peak.",

    insiderTips: [
      "Kioni on Ithaca for the evening anchorage - sheltered, restaurant-fringed, the most-photographed Ionian harbour.",
      "Paxos requires 6-week lead time for August peak. Lakka anchorage fills up early.",
      "Antipaxos (5 nm south of Paxos) has the best swimming beaches in the Mediterranean. Day trip from Paxos anchorage.",
      "Fiskardo on Kefalonia is the dinner village - book Tassia or Lagoudera ahead.",
      "Lefkada-Kefalonia is a 25 nm day under sail. Plan a leisurely morning departure, beach swim midday, arrive Fiskardo for sunset.",
    ],

    faq: [
      { q: "How much does a catamaran charter from Lefkada cost?", a: "Weekly rates start €25K for a 50-foot crewed catamaran and run to €90K for an 80-foot power catamaran. Most Lefkada catamaran weeks settle €35-€55K base before APA and Greek VAT at the certified rate (6.5-12% typical)." },
      { q: "Is the Ionian really suitable for first-time charterers?", a: "More than suitable - it's the recommended starting point. Sheltered water, short passages, calm anchorages, easy marina infrastructure. Most family charter weeks in Greek waters happen in the Ionian for these reasons." },
      { q: "Can children safely participate in a catamaran sailing week?", a: "Yes, with the right crew brief. Catamarans don't heel under sail, decks are flat and wide, anchorages are easy swim-from-boat. Crew on family-experienced boats know how to engage children with activities (knots, helm time, snorkelling) when conditions allow." },
      { q: "What's the Lefkada-to-Paxos itinerary?", a: "Day 1: Lefkada to Meganisi. Day 2: Meganisi to Ithaca (Kioni harbour). Day 3: Ithaca exploration. Day 4: Kefalonia (Fiskardo). Day 5-6: Kefalonia south to Zakynthos (Navagio dawn). Day 7: Return to Lefkada. About 150 nm total." },
    ],

    ctaTitle: "Plan your Lefkada catamaran week for 2026.",
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
    seoTitle: "Sailing Yacht Charter Cyclades 2026 | Meltemi Sailing",
    seoDescription: "Crewed sailing yacht charter in the Cyclades. Meltemi 15-25 knot wind, serious sailing. Mykonos, Paros, Naxos, Santorini. From €18K.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-cyclades",
    touristType: ["Sailing enthusiasts", "Couples", "Repeat charterers"],

    whyTitle: "Why the Cyclades are Greece's premier sailing ground",
    whyBody:
      "The **Meltemi is the world's most reliable summer sailing wind**. From late June through mid-September, a steady 15 to 25 knots from the north pushes across the central Aegean for 5 to 7 days at a stretch. For sailors, this is the equivalent of the Caribbean trade winds: a wind you can plan around, route into, and trust. " +
      "**Cycladic sailing weeks are reaching-heavy**. A 60-foot performance sailing yacht in 20 knots true wind reaches at 9 to 11 knots boat speed, making 80-90 nm days routine. Mykonos to Folegandros is one day under sail. Santorini to Sifnos is one day. The longer crossings that make motor yachts the practical choice for non-sailing families are the **whole point** of a sailing charter. " +
      "Our sailing yacht fleet in the Cyclades runs from **50-foot classic sloops** (cap couples, captain-and-cook crew) through **80-100 foot performance yachts** (Frers, Hoek, Swan pedigrees) for larger groups who want serious sailing. The choice depends on whether you want to drive the wheel or sip wine while the captain does.",

    bestFor: [
      "Sailing-experienced couples or families",
      "Charterers who've done a motor week and want the opposite pace",
      "August charters where Meltemi peaks - sailing weeks that handle wind",
      "Repeat clients alternating between sailing and motor",
      "Photography clients who want sailing-yacht-under-canvas shots",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || subtitle match "*S/Y*" || builder match "*Oyster*" || builder match "*Swan*" || builder match "*CNB*" || builder match "*Hallberg-Rassy*")',
    yachtsHeadline: "Sailing yachts in the Cyclades",
    featuredHeading: "Cycladic sailing yachts for 2026",

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
      { q: "How much does a Cycladic sailing charter cost?", a: "Weekly rates start €18K for a 50-foot sailing yacht with captain-and-cook crew and run to €120K+ for a 90-foot performance yacht. Most settle €25-€55K base before APA (25-30%, lower than motor yachts due to lower fuel) and VAT." },
      { q: "Will the sailing yacht actually sail or just motor between islands?", a: "Brief the captain on your sailing preference. Most Cycladic sailing weeks see 60-75% sailing days, with the rest motor-sailing or motoring (calm dawns, weather avoidance, marina arrivals). Pure-sail weeks are possible with itinerary flexibility." },
    ],

    ctaTitle: "Charter a sailing yacht for Cyclades 2026.",
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
    seoTitle: "Sailing Yacht Charter Ionian 2026",
    seoDescription: "Crewed sailing yacht charter in the Ionian. Corfu, Lefkada, Kefalonia, Paxos. Gentle thermal winds, sheltered. First-time-friendly. From €18K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Lefkada*" || cruisingRegion match "*Corfu*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || subtitle match "*S/Y*")',
    yachtsHeadline: "Sailing yachts in the Ionian",
    featuredHeading: "Ionian sailing yachts for 2026",

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
      { q: "How much does an Ionian sailing charter cost?", a: "Weekly rates start €18K for a 50-foot sailing yacht with captain-and-cook crew. Mid-range 65-foot yachts run €35-€60K. Above 80 feet, €60-€120K. Most Ionian sailing weeks settle €25-€50K base before APA and Greek VAT." },
      { q: "Can we do a Lefkada-to-Corfu one-way charter?", a: "Yes. One-way fee is typically €1,500-€3,500 (depending on yacht size). The northern Ionian (Corfu, Paxos) has different character from the south; a one-way charter sees both. Common request for repeat Ionian clients." },
    ],

    ctaTitle: "Charter a sailing yacht for Ionian 2026.",
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
    seoTitle: "Honeymoon Yacht Charter Mykonos 2026",
    seoDescription: "Honeymoon yacht charter from Mykonos. Couples-only crewed yachts, chef-led, curated itineraries balancing Mykonos energy with private anchorages. From €30K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && sleeps <= 4',
    yachtsHeadline: "Honeymoon-sized yachts in Mykonos",
    featuredHeading: "Two-cabin and intimate yachts for 2026",

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
      { q: "How much does a Mykonos honeymoon yacht charter cost?", a: "Weekly rates start €30K for a 50-foot sailing yacht with two crew. Mid-range 60-foot crewed catamarans run €45-€75K. 25-metre motor yachts with full crew €80-€140K. Plus APA 25-30% and Greek VAT at the certified rate (6.5-12% typical). Most honeymoon charters settle €55-€110K all-in." },
      { q: "Is Mykonos too busy for a honeymoon?", a: "Depends on which Mykonos you visit. The chora and south-shore beach clubs are busy. The anchorages at Rhenia, Ornos, and Super Paradise back beach are quiet even in August. A yacht honeymoon visits both selectively." },
      { q: "Can we board the yacht in Mykonos and finish elsewhere?", a: "Yes. One-way charters (Mykonos to Santorini, or to Athens) are possible with €1,500-€3,500 reposition fee. Some couples board in Mykonos for the energy and disembark in Santorini for the caldera honeymoon ending." },
      { q: "When should we book?", a: "6-12 months ahead for peak August. 4-6 months for June and September. Late-booking yachts exist for 4-week windows but with limited yacht choice." },
    ],

    ctaTitle: "Plan your Mykonos honeymoon week for 2026.",
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
    seoTitle: "Family Yacht Charter Lefkada 2026",
    seoDescription: "Family yacht charter from Lefkada. Ionian family routes - Meganisi, Ithaca, Kefalonia. Catamarans + motor yachts for 6-12 family members. From €30K.",
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
    featuredHeading: "Family-ready yachts for 2026",

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
      { q: "How much does a family yacht charter from Lefkada cost?", a: "Weekly rates for a 6-8 person family yacht start €30K (60-foot crewed catamaran) and run to €120K (35-metre motor yacht). Most family weeks settle €45-€85K base before APA and Greek VAT. Per family member, that's typically €5,500-€11,000 for a 7-night charter." },
      { q: "Is the Ionian safe for children swimming from the boat?", a: "Yes - Ionian anchorages are the safest in Greek waters. Sheltered, shallow approaches, low boat traffic in summer. The crew on family-experienced yachts always supervise children's water activities and brief on safety on day one." },
      { q: "How many cabins do we need for a family of 8?", a: "Minimum 4 cabins. Recommended 5. A 60-foot catamaran (4-cabin) works for tight families; a 75-foot catamaran (5-cabin) gives a 'quiet cabin' for grandparents. For 10+ family members, a 25-metre motor yacht (5-6 cabins) is the right scale." },
      { q: "Can teenagers do watersports on the charter?", a: "Yes - most charter yachts above 25 metres carry paddleboards, kayaks, snorkel kits, and many have wakeboards or jet skis. Brief us on teen interests at booking; we'll match a yacht with strong watersports crew." },
    ],

    ctaTitle: "Plan your family yacht week for 2026.",
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
    seoTitle: "Family Yacht Charter Corfu 2026",
    seoDescription: "Family yacht charter from Corfu. Northern Ionian routes covering Paxos, Antipaxos, Albanian Riviera. Catamarans + motor yachts for families. From €25K.",
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
    featuredHeading: "Corfu-ready family yachts for 2026",

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
      { q: "How much does a Corfu family yacht charter cost?", a: "Weekly rates start €25K for a 60-foot crewed catamaran (family of 6) and run to €120K for a 35-metre motor yacht (family of 10-12). Most settle €40-€75K base before APA and VAT." },
      { q: "Can we cross to Albania from a Corfu yacht charter?", a: "Yes, with paperwork. Sarande and Ksamil on the Albanian Riviera are 6-12 nm from Corfu. Cross-border charters require advance notice (typically 4 weeks for visa coordination) and a yacht owner who agrees to the route. We coordinate." },
    ],

    ctaTitle: "Plan your Corfu family week for 2026.",
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
    seoTitle: "Superyacht Charter Mykonos 2026 | 30m+ Yachts",
    seoDescription: "Superyacht charter from Mykonos. Vessels 30-60 metres with full crew, chef, two tenders, full toy fleet. Iconic Cycladic itineraries. From €280K.",
    canonical: "https://georgeyachts.com/superyacht-charter-mykonos",
    touristType: ["UHNW Mykonos visitors", "Celebrities", "Repeat charterers"],

    whyTitle: "Why superyachts dominate Mykonos's UHNW charter market",
    whyBody:
      "Mykonos in August is the **highest-density UHNW Mediterranean destination outside Cap d'Antibes**. The harbour and surrounding anchorages routinely see 15-25 superyachts simultaneously through July-August. The boats below 30 metres feel small in this company; the boats above 30 metres feel like home. " +
      "**Above 30 metres**, the yacht becomes a private hotel that floats. Crew of 6-10. Dedicated chef. Two tenders (one for guest transfers, one for crew provisioning and discreet runs). A chief stewardess who runs the social rhythm of the week. Master cabin forward with separate-deck access. The Mykonos energy doesn't interrupt the privacy. " +
      "We represent **11 superyachts that base in Mykonos for high season**, including 3 in the 40+ metre range. Direct boarding saves the Athens positioning leg. Discreet relationships with shore-side service providers (Nammos, SantAnna, the Chora's higher-end addresses) handle reservations and arrangements at the yacht-management level rather than guest-facing.",

    bestFor: [
      "UHNW repeat clients moving from 25-30 metre to superyacht class",
      "Celebrity charters needing maximum privacy in Mykonos",
      "Multi-generational charters with 8-12 family members on one platform",
      "Long-stay charters (10-14 nights) covering Cyclades + Dodecanese",
      "Hosted charters for corporate or sovereign principals requiring discretion",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && length match "*m*" && (length match "3*m*" || length match "4*m*" || length match "5*m*" || length match "6*m*")',
    yachtsHeadline: "Superyachts in Mykonos",
    featuredHeading: "Mykonos superyachts for 2026",

    whenTitle: "When to book",
    whenBody: "**Mid-July to early September** is peak superyacht season in Mykonos. Book 12-18 months ahead for the marquee weeks (August 15-22 specifically). **Late May to early July** and **mid-September to mid-October** are shoulder seasons at 25-35% off peak rates with full superyacht service intact.",

    insiderTips: [
      "Mykonos marina has limited 30+ metre slots. Most superyachts anchor at Ornos or Mykonos Bay rather than dock.",
      "Two tenders matters in Mykonos. One for guest evening transfers (to Nammos, Scorpios, the Chora), one for crew provisioning. Below 30m yachts usually have one tender; superyachts almost always two.",
      "Provisioning in Mykonos is restaurant-quality but expensive. Brief the chef on specific ingredient sources; some restaurant kitchens accept yacht orders.",
      "Crew gratuity convention is 12-18% of base rate. For a 30+ metre superyacht at €280K/week base, that's €35,000-€50,000 in cash to the captain on the final day.",
      "Helicopter touch-and-go is possible from yachts above 40 metres. Mykonos airport is 5 minutes by helicopter; useful for late-arriving or early-departing guests.",
    ],

    faq: [
      { q: "How much does a Mykonos superyacht charter cost?", a: "Weekly rates start €280K for a 30-metre superyacht and run to €1.2M+ for a 50-metre. Most Mykonos superyacht charters settle €350-€600K base before APA (30-35%) and Greek VAT at the certified rate. All-in for a 35-metre week in peak August: typically €600-€900K." },
      { q: "Can a 40-metre superyacht dock in Mykonos marina?", a: "Limited slots. Most 40m+ yachts anchor at Ornos or the outer bay and tender to the chora. Marina dockage for 40m+ is typically only for boarding/disembarkation, not for nightly stays." },
      { q: "Is helicopter operation possible?", a: "Touch-and-go landings on a yacht's helideck are possible above 40 metres (yacht-specific). Mykonos airport (JMK) is 5 minutes by helicopter to most anchorages. We coordinate with helicopter operators for guest pickups." },
      { q: "What's a typical 7-night Mykonos superyacht itinerary?", a: "Day 1 boarding and Ornos sunset. Day 2 Delos and Rhenia. Day 3-4 Paros (Naoussa). Day 5 Folegandros. Day 6-7 return to Mykonos via Antiparos. About 120-150 nm. Superyachts can extend to Santorini (extra 60 nm south) in 10-14 night charters." },
    ],

    ctaTitle: "Charter a superyacht for Mykonos 2026.",
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
    seoTitle: "Luxury Yacht Charter Athens 2026",
    seoDescription: "Luxury yacht charter from Athens (Alimos, Lavrio). Largest Greek fleet, full crew. Cyclades, Saronic, Sporades routes.",
    canonical: "https://georgeyachts.com/luxury-yacht-charter-athens",
    touristType: ["International UHNW visitors", "First-time charterers"],

    whyTitle: "Why Athens is the natural Greek charter departure port",
    whyBody:
      "Athens has **the largest yacht charter fleet in Greek waters**. Roughly 70% of the country's charter yachts base in or near Athens - primarily at **Alimos marina** (25 minutes from the airport, the largest commercial charter marina in Europe) and **Lavrio** (60 minutes east, smaller but increasingly preferred for departures toward the Sporades). " +
      "**For international UHNW visitors, Athens is the obvious departure point**. Athens International Airport (ATH) handles direct flights from 80+ destinations including all major US east-coast cities, Asia-Pacific via Doha or Istanbul, and every European capital. Same-day fly-and-board is standard: arrive 14:00, dinner aboard 19:00, sail at dawn next morning. " +
      "From Athens the **Saronic Gulf** (Hydra, Spetses, Poros, Aegina) is reachable for shorter 3-5 day charters. The **central Cyclades** (Kea, Kythnos, Sifnos, Serifos, Milos) sit 3-6 hours sail south. The **Sporades** (Skiathos, Skopelos, Alonissos) are reachable in 8-10 hours direct. For 10-14 day charters, the Cyclades plus a southern Peloponnese return loop adds extraordinary variety.",

    bestFor: [
      "First-time international charterers using Athens for easiest logistics",
      "Charters with guests arriving from multiple international cities",
      "Repeat clients seeking the broadest Greek-waters yacht selection",
      "Saronic-focused weeks for 3-5 day charters near Athens",
      "Multi-week charters with crew change at Athens midpoint",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Athens*" || cruisingRegion match "*Greece*" || cruisingRegion match "*Saronic*")',
    yachtsHeadline: "Yachts based in Athens",
    featuredHeading: "Athens-based fleet for 2026",

    whenTitle: "When to book",
    whenBody: "Athens charter season runs **mid-April to late October**. **June and September** are the sweet spots for UHNW charters: warm water, quieter anchorages, 25-35% off August peak rates. **July-August** is peak - book 9-12 months ahead. **Shoulder months** (May, October) suit charters where weather flexibility is acceptable.",

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
      { q: "How much does an Athens-departure yacht charter cost?", a: "Same as anywhere in Greek waters by yacht-type: €30K-€600K+ per week depending on size and season. Athens has the deepest 25-35 metre motor yacht selection at €60-€220K base. Saronic-focused weeks on 50-65 foot yachts run €20-€45K base." },
    ],

    ctaTitle: "Charter from Athens for 2026.",
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
    seoTitle: "Wedding Yacht Charter Mykonos 2026 | Reception Yachts",
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
      "Pre-wedding bachelor/bachelorette yacht day-charters",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && sleeps >= 8',
    yachtsHeadline: "Mykonos wedding yachts",
    featuredHeading: "Reception-capable yachts for 2026 weddings",

    whenTitle: "When to plan",
    whenBody: "**Bookings open 12-18 months ahead** for peak Mykonos summer dates (June through August). The Mykonos wedding planner network handles the on-shore logistics; we coordinate the yacht side. **September and early October** are increasingly popular as 'shoulder-season weddings' - weather still warm, costs 25% lower than peak summer, marinas less crowded.",

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
      { q: "Cost of a Mykonos wedding yacht charter?", a: "Single-day reception charter: €15-€60K depending on yacht size, plus catering, crew gratuity, and APA. Multi-day wedding-week yacht: €40-€300K+. Multi-yacht flotilla for 50+ guests: €150-€500K. Catering for the reception is separate (typically €150-€400 per guest)." },
      { q: "Can the yacht stay docked at Mykonos marina during the reception?", a: "Marina dockage is rarely the right choice. Anchored offshore (Ornos, Super Paradise) gives privacy, lighting control, no marina background noise. Marina dockage is best for boarding guest groups before sailing out." },
    ],

    ctaTitle: "Plan your Mykonos wedding yacht for 2026.",
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
    seoTitle: "Honeymoon Yacht Charter Santorini 2026",
    seoDescription: "Private crewed honeymoon yacht charter from Santorini. Sunset in the caldera at anchor, southern Cyclades loop, full chef service. Weekly rates from €40K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Santorini*") && sleeps <= 6 && (subtitle match "*honeymoon*" || subtitle match "*intimate*" || subtitle match "*Motor*" || builder match "*Sunseeker*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Lagoon*" || builder match "*Fountaine*")',
    yachtsHeadline: "Honeymoon yachts for Santorini 2026",
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
      { q: "How much does a Santorini honeymoon yacht charter cost?", a: "Weekly rates start €40K for an 18-metre yacht (sleeps 4-6) and reach €120-180K for 28-metre motor yachts. APA (advance provisioning allowance) is 30-35% on top: covers fuel, food, beverages. Most Santorini honeymoon weeks settle €70-110K all-in." },
      { q: "Should we board in Santorini or Athens?", a: "Board in Santorini. Direct flights into Santorini in summer make Athens the wrong departure point unless you're already in Athens. The week stays Cycladic the whole time, no need to backtrack to Attica." },
      { q: "Can we do Santorini + Mykonos in one honeymoon week?", a: "Yes, but it's a transit-heavy week. Santorini to Mykonos is 80 nm (5h motor / 11h sail). A 10-day charter is the more relaxed format: 3 days Santorini caldera + south Cyclades, then 4 days Mykonos + Delos, then disembarkation." },
      { q: "Is the caldera anchorage rough?", a: "Caldera holding is poor (volcanic seabed, 40-60m depth in many spots). Yachts with stabilisers and competent captains anchor with double-scope; sailing yachts need careful boat selection. The crew knows the holds, trust their anchor call." },
    ],

    ctaTitle: "Plan a Santorini honeymoon for 2026.",
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
    seoTitle: "Sailing Yacht Charter Mykonos 2026",
    seoDescription: "Crewed sailing yacht charter from Mykonos. Meltemi-rated yachts 12-30m, Cyclades itineraries, classic sailing experience. Weekly rates from €25K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || builder match "*Beneteau*" || builder match "*Jeanneau*" || builder match "*Hanse*" || builder match "*Bavaria*" || builder match "*Dufour*")',
    yachtsHeadline: "Sailing yachts based in Mykonos",
    featuredHeading: "Meltemi-rated sailing yachts for 2026",

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
      { q: "How much does a Mykonos sailing yacht charter cost?", a: "Weekly rates €25-€45K for 14-18m sailing yachts (sleeps 6-8), €50-€90K for 19-25m, €100-180K for 28-35m. Cheaper than equivalent motor yachts by 40-50% because of lower fuel and engine maintenance." },
      { q: "Can we charter a sailing yacht for Mykonos August?", a: "Yes, sailing yachts are easier to secure for August than motor yachts because motor demand dominates. Booking 4-6 months ahead is usually sufficient. The reverse of the motor-yacht market." },
      { q: "Will we sail every day or motor most of the week?", a: "On a Meltemi week you sail real distances - 4 of 7 days with proper passage-making, wind in the sails. On a low-wind week (less common July to early September) the engine carries more of the route. Captain calls daily." },
      { q: "Is a sailing yacht too active for an inexperienced family?", a: "Not necessarily. Modern crewed sailing yachts with stabilisers, autopilot, and experienced crew are comfortable for inexperienced families. The key is honest captain briefing about expectations and route." },
    ],

    ctaTitle: "Find a sailing yacht for Mykonos 2026.",
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
    seoTitle: "Sailing Yacht Charter Lefkada 2026",
    seoDescription: "Crewed sailing yacht charter from Lefkada Marina. Ionian-sheltered cruising, daily thermal wind, Kefalonia and Paxos loops. Weekly rates from €20K.",
    canonical: "https://georgeyachts.com/sailing-yacht-charter-lefkada",
    touristType: ["Sailing enthusiasts", "Families", "Multi-generational groups"],

    whyTitle: "Why Lefkada is the most-loved Greek sailing base",
    whyBody:
      "Lefkada Marina is the **single largest charter sailing base in Greece**. The reason isn't marketing, it's geography. The Ionian Sea on Lefkada's eastern side is **sheltered by the mainland and by the island chain**, so the water stays flat. The wind is a **predictable afternoon thermal** that builds from 11:00, peaks at 15-18 knots by 15:00, dies at sunset. Every day. Sailors call this 'fair-weather sailing': the conditions never break the routine. " +
      "From Lefkada you reach **Meganisi in 90 minutes** (the easiest first night), **Ithaca in 4 hours** (Odysseus's island, the most romantic landfall), **Kefalonia in 5 hours** (Fiscardo for dinner), **Paxos in 7 hours** (Loggos for the all-time Ionian village). A 7-day round-trip covers all of this and returns to Lefkada with two days to spare for re-visiting favourites. " +
      "The yacht-set Ionian is **older, more family, less party** than the Cyclades. The thermal wind plus protected water means children, grandparents, and inexperienced sailors all manage comfortably. The Ionian is where George started chartering; it's also where he sends families who've never been on a yacht before.",

    bestFor: [
      "Families with children under 12 (calm water plus reliable wind equals no seasickness)",
      "Multi-generational groups (grandparents comfortable, kids entertained)",
      "First-time sailing charterers building confidence",
      "Tight 7-day windows (Lefkada reachable from Preveza airport, 30-min taxi)",
      "Returning charterers who want a different Greek experience from the Cyclades",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Lefkada*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || builder match "*Beneteau*" || builder match "*Jeanneau*" || builder match "*Hanse*" || builder match "*Bavaria*" || builder match "*Dufour*")',
    yachtsHeadline: "Sailing yachts based in Lefkada Marina",
    featuredHeading: "Lefkada-based sailing yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**May through October** all work in the Ionian. **June and September** are the sweet spots: water warm enough to swim, wind reliable, prices 25-30% below July/August peak. **July and August** the thermal still blows but harbours fill; book 6-9 months ahead. The Ionian sails later into October than the Aegean: thermal lasts until mid-October most years.",

    insiderTips: [
      "Fly into Preveza airport (PVK), not Athens. Preveza is 30 minutes from Lefkada Marina by taxi. Athens transfer adds 5 hours.",
      "Lefkada Town is connected to the mainland by a floating bridge that opens hourly. Time provisioning runs accordingly.",
      "The Meganisi anchorages (Spilia, Atherinos, Vathy) fill by 17:00 in July. Arrive earlier or anchor in less-popular Vourliotis.",
      "Fiscardo on Kefalonia for dinner is the Ionian must-do, but it gets crowded. Anchor in Foki Bay 1 nm south and tender in.",
      "Loggos on Paxos has 7 restaurants. The best one (Vasilis) takes no reservations: walk over by 19:30 or eat at midnight.",
    ],

    faq: [
      { q: "How much does a Lefkada sailing yacht charter cost?", a: "Weekly rates €20-35K for 12-16m sailing yachts (sleeps 6-8), €40-65K for 17-22m, €80-130K for 24-30m. Lefkada bareboat is the cheapest sailing-charter market in Greece; crewed adds 30-50%." },
      { q: "Is the Ionian boring compared to the Cyclades?", a: "Different, not boring. The Ionian is green, protected, family-friendly, with a slower pace. The Cyclades is dramatic, exposed, party-energy, photographic. Repeat charterers usually do Ionian first, Cyclades second." },
      { q: "What's the best 7-day Ionian itinerary from Lefkada?", a: "Lefkada → Meganisi (Spilia) → Ithaca (Vathy) → Kefalonia (Fiscardo) → Kefalonia (Assos) → Paxos (Loggos) → Lefkada. Roughly 200 nm round trip, 25-30 nm per day, plenty of swim stops." },
      { q: "Can I charter without sailing experience?", a: "Yes, crewed charters require zero sailing experience. The captain sails, the chef cooks, you participate as much or as little as you like. Bareboat charters require an ICC or equivalent license." },
    ],

    ctaTitle: "Find a Lefkada sailing yacht for 2026.",
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
    seoTitle: "Catamaran Charter Paros 2026",
    seoDescription: "Crewed catamaran charter from Paros (Parikia). Stable cruising, Antiparos and Naxos loops, family-friendly Cyclades. Weekly rates from €30K.",
    canonical: "https://georgeyachts.com/catamaran-charter-paros",
    touristType: ["Families with young children", "Multi-couple groups", "Cyclades returners"],

    whyTitle: "Why catamarans win the Paros brief",
    whyBody:
      "Paros sits in the **geographic centre of the Cyclades**, with Antiparos 15 minutes south, Naxos 20 nm east, Mykonos 30 nm north, Ios 40 nm south. From Paros a catamaran reaches more anchorages in a day than from any other Cycladic base. " +
      "Catamarans win for three Paros-specific reasons. **First**, the shallow draft (1.2-1.4m vs 2.5m on a sailing monohull) opens up the best Antiparos beaches (Soros, Apantima, Faneromeni) where deeper-draft boats anchor 200 metres offshore. **Second**, the **stability in the Meltemi**: flat water under sail at 15-20 knots makes catamarans the only sailing platform families enjoy in August. **Third**, the layout: three or four equal cabins, no master-vs-guest hierarchy, perfect for two or three couples chartering together. " +
      "Paros catamarans deliver the **Cycladic loop without the Cycladic compromises**. The Lagoon 50 and Bali 4.6 in our fleet sleep 8 in genuine comfort, cruise at 8 knots under engine and 10 knots under sail in the Meltemi, anchor in 2 metres of water at Soros where everyone else is in 15 metres.",

    bestFor: [
      "Two or three couples sharing one yacht for a Cyclades week",
      "Families with toddlers (flat water plus dual hulls equals no seasickness)",
      "Charterers who prioritise swim-anchorage access over restaurant proximity",
      "Repeat Cycladic visitors who've done Mykonos motor yacht (want a different format)",
      "Snorkelling and diving-focused weeks (shallow anchorages open underwater terrain)",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Paros*") && (subtitle match "*catamaran*" || subtitle match "*Catamaran*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine Pajot*" || builder match "*Leopard*")',
    yachtsHeadline: "Catamarans based in Paros and the Cyclades",
    featuredHeading: "Cyclades catamarans for 2026",

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

    ctaTitle: "Find a Paros catamaran for 2026.",
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
    seoTitle: "Catamaran Charter Corfu 2026",
    seoDescription: "Crewed catamaran charter from Corfu (Gouvia Marina). Sheltered Ionian cruising, Albanian coast, Paxos and Antipaxos loops. Weekly rates from €30K.",
    canonical: "https://georgeyachts.com/catamaran-charter-corfu",
    touristType: ["Families with young children", "Multi-couple groups", "Ionian first-timers"],

    whyTitle: "Why catamarans fit Corfu cruising",
    whyBody:
      "Corfu sits at the **northern end of the Ionian**, three nautical miles from the Albanian coast and 30 nm north of Paxos. The cruising water from Corfu south to Paxos and Antipaxos is **sheltered by the mainland, calm in the afternoon thermal, and dotted with shallow sand anchorages**. The catamaran's combination of stability and shallow draft fits this brief better than any monohull. " +
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
    featuredHeading: "Corfu-based catamarans for 2026",

    whenTitle: "When to book",
    whenBody: "**May through early October** all work in the Ionian for catamaran charter. **June and September** are the peak family weeks: water 22-25°C, harbours not yet overrun, prices 25% below August. **July and August** book 9-12 months ahead for Corfu catamarans. **Late October** is possible for hardier families but the thermal wind weakens after the 15th.",

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

    ctaTitle: "Find a Corfu catamaran for 2026.",
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
    seoTitle: "Motor Yacht Charter Corfu 2026",
    seoDescription: "Crewed motor yacht charter from Corfu (Gouvia). Sheltered Ionian cruising, Paxos and Antipaxos, full chef service. Weekly rates from €50K.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-corfu",
    touristType: ["UHNW Corfu visitors", "Multi-generational families", "Discrete clients"],

    whyTitle: "Why a motor yacht in Corfu reads quietly luxurious",
    whyBody:
      "Corfu's UHNW visitor profile is different from Mykonos. The Rothschilds and the Greek shipping families summer here. The villas are inland, the energy is restrained, the publicity is low. A motor yacht from Corfu does the same thing the villas do: **it stays private**. " +
      "The Ionian's sheltered geometry means the motor yacht runs **fast and smooth** between destinations. Corfu to Paxos is 30 nm, 90 minutes at 20 knots. Paxos to Antipaxos is 10 minutes. Sivota to Lefkada is 35 nm. A 40-metre motor yacht here covers more anchorages in a 7-day week than the same boat does in the Cyclades because the seas don't push back. " +
      "The Corfu-based motor yacht fleet skews **older, classic, more 'Riva' than 'Pershing'**. Heesen, Benetti, Custom Line are the recurring builds. The owners summer locally; the boats are maintained to spec. This is the Ionian's quiet wealth segment, a different aesthetic from the Cycladic motor-yacht fleet.",

    bestFor: [
      "UHNW families summering in Corfu villas adding a yacht week",
      "Multi-generational charters with grandparents on board (sheltered cruising)",
      "Discrete UHNW principals avoiding Mykonos visibility",
      "First-time Greek motor-yacht charterers wanting the easiest cruising water",
      "European royals and aristocrats with Corfu family ties",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Corfu*") && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Heesen*" || builder match "*Benetti*" || builder match "*Custom Line*" || builder match "*Pershing*" || builder match "*Princess*" || builder match "*Sunseeker*" || builder match "*Azimut*" || builder match "*Ferretti*")',
    yachtsHeadline: "Motor yachts based in Corfu",
    featuredHeading: "Corfu motor yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**June and September** are the discretionary UHNW Corfu months: peak villa-set season, weather perfect, August Russian/Italian charter crowd not yet arrived (June) or already left (September). **July and August** book 12-18 months ahead; the Greek shipping families lock in their dates two summers in advance. **May and October** are possible at materially discounted rates.",

    insiderTips: [
      "Gouvia Marina is the main boarding base. NAOK in Corfu town for shorter stays. Brief George on which works for your transfer logistics.",
      "Paleokastritsa anchorage on the west coast: protected, monastery overlooking, the Rolls-Royce of Corfu anchorages.",
      "Sivota mainland anchorages (Mourtos, Mega Ammos) are the 'Caribbean of Greece': pure white sand, turquoise water. Day-trip from Corfu, 30 nm.",
      "Antipaxos Voutoumi for lunch is the Ionian's set piece. Arrive 10:30, swim, lunch on board at noon, leave before the day-boats arrive.",
      "Corfu Old Town for dinner: the captain will dock at the Old Port for the evening. Walk to Bellini's or Klimataria. Greek wine selection here is the best in the Ionian.",
    ],

    faq: [
      { q: "How much does a Corfu motor yacht charter cost?", a: "Weekly rates €50K for 22-metre motor yachts and €250K+ for 40-metre superyachts. The Corfu-based fleet skews larger and more classic than the Cycladic equivalents; typical week settles €100-200K base before APA and VAT." },
      { q: "How does a Corfu motor yacht week compare to Mykonos?", a: "Quieter, more sheltered, more family-oriented, more discreet. Corfu is where UHNW principals charter when they want zero Mykonos visibility. The yachts are larger, the anchorages are deeper, the dinners are villa-private rather than club-public." },
      { q: "Can we cross to Italy or Albania during the charter?", a: "Possible. Brindisi (Italy) is 100 nm west of Corfu, Saranda (Albania) is 12 nm north. Both require advance customs notification. Most Corfu motor yacht weeks stay within Greek waters." },
      { q: "Which is better for August: Corfu or Cycladic?", a: "Corfu in August. Same weather, half the crowd-pressure, materially more anchorage privacy. Cyclades in August is for the energy and the scene; Corfu is for the calm and the discretion. Different briefs, same calendar." },
    ],

    ctaTitle: "Find a Corfu motor yacht for 2026.",
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
    seoTitle: "Motor Yacht Charter Athens 2026",
    seoDescription: "Crewed motor yacht charter from Athens (Alimos Marina). The largest Greek charter base - every itinerary reachable. Weekly rates from €50K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Athens*" || cruisingRegion match "*Alimos*" || cruisingRegion match "*Attica*" || cruisingRegion match "*Saronic*") && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Pershing*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Heesen*" || builder match "*Benetti*" || builder match "*Sunseeker*" || builder match "*Riva*")',
    yachtsHeadline: "Motor yachts based at Alimos Marina",
    featuredHeading: "Athens motor yachts for 2026",

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
      { q: "How much does an Athens motor yacht charter cost?", a: "Weekly rates €50K for 22-metre motor yachts and €350K+ for 50-metre superyachts. Athens has the broadest range; typical week settles €80-150K base for 25-30m motor yachts before APA (30-35%) and Greek VAT at the certified rate." },
      { q: "Should we board in Athens or have the yacht reposition to Mykonos?", a: "Depends on flight logistics. Direct flight to Athens + board Alimos: save the repositioning fee, lose the first sailing day. Direct flight to Mykonos + reposition the yacht: pay the delivery fee (€2-8K), start the charter at the destination. Both are common; George briefs based on your specific dates." },
      { q: "What's the best 7-day Athens motor yacht itinerary?", a: "Two clean options. (1) Saronic loop: Athens → Aegina → Hydra → Spetses → Hydra → Athens. Light cruising, all islands within 4 hours. (2) Cycladic outbound: Athens → Kea (overnight) → Mykonos → Naxos → Paros → Sifnos → Athens. Heavier transit, more destinations." },
      { q: "Can we add a private chef + sommelier for a special dinner?", a: "Yes. Athens-based charters have the strongest auxiliary-service network in Greece: Michelin-trained private chefs, sommeliers from the Athens wine scene, security details if needed. Brief George at booking; the bookings happen through Alimos-based agencies." },
    ],

    ctaTitle: "Find an Athens motor yacht for 2026.",
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
    seoTitle: "Superyacht Charter Athens 2026",
    seoDescription: "Crewed superyacht charter from Athens. 40-70m superyachts, full crew, helipad-equipped options, Cycladic and Ionian itineraries. Weekly rates from €250K.",
    canonical: "https://georgeyachts.com/superyacht-charter-athens",
    touristType: ["UHNW principals", "Royal families", "C-suite executives"],

    whyTitle: "Why the Athens superyacht fleet is Greece's UHNW market",
    whyBody:
      "The Greek shipping families berth their personal yachts in **Flisvos Marina** (Athens, immediately south of Alimos). When those yachts charter commercially they appear in our brokerage feed - **48 to 95 metres, 8 to 12 cabins, 16 to 28 crew, helipad more often than not, chef trained at Le Cordon Bleu or El Bulli alumni**. This is the Mediterranean's quietest superyacht market; it doesn't advertise, it doesn't list, it works through brokers who hold direct relationships with the captains. " +
      "A 50-metre superyacht week from Athens reaches **anywhere in Greek waters** in 12 hours of overnight steaming. Most charters use overnight passages to wake up at the next destination: Athens to Mykonos overnight, Mykonos to Santorini overnight, Santorini back to Athens with a daylight stop at Hydra. The vessel runs 24-hour watches; the principals are unaware of the transit. " +
      "The Athens superyacht fleet differs from **Monaco or St. Tropez** in one critical way: **older Greek-built provenance**. The Onassis, Niarchos, Latsis, Vardinoyannis families commissioned superyachts in the 1960s through 1990s; the survivors have been refit twice and now charter at €250-€800K per week. The newer 2010+ Italian (Benetti, Sanlorenzo) and Dutch (Heesen, Feadship) builds run €400K-€1.2M.",

    bestFor: [
      "Principals chartering 40m+ for the first time (Athens has the broadest fleet)",
      "Royal families and C-suite executives needing helipad-equipped vessels",
      "Multi-week summer programmes with port-of-departure flexibility",
      "Charters combining Greek waters with Italian (Capri, Sardinia) crossings",
      "Discrete UHNW principals avoiding St. Tropez visibility",
    ],

    yachtFilter: '_type == "yacht" && (length match "*40m*" || length match "*45m*" || length match "*50m*" || length match "*55m*" || length match "*60m*" || length match "*70m*" || length match "*80m*" || builder match "*Heesen*" || builder match "*Benetti*" || builder match "*Feadship*" || builder match "*Lürssen*" || builder match "*Sanlorenzo*" || builder match "*Custom Line*")',
    yachtsHeadline: "40m+ superyachts available 2026",
    featuredHeading: "Athens-based superyachts",

    whenTitle: "When to book",
    whenBody: "**Bookings for 40m+ superyachts open 12-24 months ahead**. The Mediterranean superyacht season runs **mid-May through end-September**; outside that window most vessels reposition to the Caribbean or undergo refit. **July and August** are the peak booking months; these vessels sell weeks out 18 months ahead. **June and September** are the discretionary windows: better pricing, vessel selection still excellent, principals avoiding the August Mediterranean crush.",

    insiderTips: [
      "Flisvos Marina is the superyacht berth (not Alimos for 40m+). Helicopter transfers from Athens airport land at the marina helipad directly.",
      "Brief the captain on principal preferences 60 days pre-charter: provisioning, beverages, security detail, communications setup. The captain coordinates with the principal's chief of staff.",
      "Most superyachts carry **2 tenders, 1 helicopter (if helipad), 12-20 toys** (jet skis, sea-bobs, paddleboards, water trampolines, diving compressors). Confirm the toy list at booking.",
      "Cabin allocation matters on multi-family charters. The master suite + VIP + 4 doubles is the standard 50m layout. Brief George on the principal hierarchy.",
      "Greek-flagged vessels under 35m can charter freely; 35m+ Greek-flagged or any foreign-flagged vessel needs a charter permit. George handles the paperwork.",
    ],

    faq: [
      { q: "How much does an Athens superyacht charter cost?", a: "Weekly rates €250K for 40-metre motor yachts and €1.2M+ for 80-metre Lürssen or Feadship superyachts. APA 30-35% on top, Greek VAT at the certified rate; 5.2-6.5% is common at this size (statutory 13%; 24% for short charters). Typical 50-metre week settles €500-800K base." },
      { q: "What's included in a superyacht charter?", a: "The charter fee covers vessel, full crew (12-28 people), insurance, mooring at base marina. APA covers fuel, food, beverages, port fees, marina dockage. VAT is on top. Excludes crew gratuity (typically 15-20% of base) and excursions ashore." },
      { q: "Can we use a helicopter from the yacht?", a: "Yes if the yacht has a certified helipad (most 60m+ vessels do). Greek helipad certifications require pre-flight notification through HCAA. George handles the coordination." },
      { q: "Which Athens superyachts are available for August 2026?", a: "Live availability changes weekly. The 40-50m segment typically has 4-6 yachts open for August 2026 as of May 2026; the 60-80m segment is mostly committed by now. George's broker network surfaces unlisted availability." },
    ],

    ctaTitle: "Charter a superyacht from Athens for 2026.",
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
    seoTitle: "Motor Yacht Charter Hydra 2026",
    seoDescription: "Crewed motor yacht charter to Hydra from Athens. 2-hour passage, Saronic loop, car-free island. Weekly rates from €45K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Saronic*" || cruisingRegion match "*Athens*" || cruisingRegion match "*Hydra*") && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Heesen*" || builder match "*Benetti*" || builder match "*Custom Line*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Sunseeker*" || builder match "*Pershing*")',
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
      { q: "How much does a Hydra motor yacht charter cost?", a: "Weekly rates from €45K for 18-22m motor yachts, €80-150K for 26-32m, €250K+ for 40m+. Saronic charter is materially cheaper than Cycladic equivalent - shorter passages, lower fuel, less marina cost." },
      { q: "Is 7 nights too long for the Saronic?", a: "No, 7 nights is comfortable with the Argolic Gulf added: Athens → Aegina → Hydra → Porto Cheli → Spetses → Poros → Athens. Plenty of swim time, all sheltered water, none of the Cycladic transit-time." },
      { q: "What's the best Saronic month?", a: "September. Weather warm, Greek-summer crowd dispersed, all the restaurants still open. June is a close second." },
      { q: "Can we anchor inside Hydra harbour?", a: "Possible but undesirable. The harbour fills with day-charter caïques during day, fishing boats overnight. Anchor in deep water off the harbour mouth and tender in." },
    ],

    ctaTitle: "Find a motor yacht for Hydra 2026.",
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
    seoTitle: "Honeymoon Yacht Charter Hydra 2026",
    seoDescription: "Crewed honeymoon yacht charter to Hydra and the Saronic. Athens-departure week, car-free island, candlelit dinners, no Cycladic transit. From €40K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Saronic*" || cruisingRegion match "*Athens*") && sleeps <= 6 && (subtitle match "*honeymoon*" || subtitle match "*intimate*" || subtitle match "*Motor*" || builder match "*Princess*" || builder match "*Sunseeker*" || builder match "*Azimut*" || builder match "*Riva*")',
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

    ctaTitle: "Plan a Saronic honeymoon for 2026.",
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
    seoTitle: "Family Yacht Charter Hydra 2026",
    seoDescription: "Crewed family yacht charter to Hydra and the Saronic. Sheltered cruising, kid-safe anchorages, easy Athens departure. Weekly rates from €40K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Saronic*" || cruisingRegion match "*Athens*") && sleeps >= 8 && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Princess*" || builder match "*Sunseeker*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Lagoon*" || builder match "*Fountaine*")',
    yachtsHeadline: "Family-suited yachts for the Saronic",
    featuredHeading: "Saronic family yachts for 2026",

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

    ctaTitle: "Plan a Saronic family week for 2026.",
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
    seoTitle: "Catamaran Charter Naxos 2026",
    seoDescription: "Crewed catamaran charter from Naxos chora. Central Cyclades base, Small Cyclades loop, family-friendly anchorages. Weekly rates from €28K.",
    canonical: "https://georgeyachts.com/catamaran-charter-naxos",
    touristType: ["Families with young children", "Multi-couple groups", "Repeat Cyclades visitors"],

    whyTitle: "Why Naxos is the smart Cyclades catamaran base",
    whyBody:
      "Naxos is the **largest of the Cyclades** and the most-undervalued charter base in the group. While Mykonos and Paros sell through their summer charter weeks 9 months ahead, Naxos has **inventory available 4-5 months out** even for August. The reason isn't quality - it's brand recognition. Naxos doesn't show up in the Instagram aesthetic the way Mykonos does, so the international charter market under-prioritises it. " +
      "**The geography is excellent**. Naxos sits in the **central Cyclades**, 20 nm from Mykonos, 25 nm from Paros, 30 nm from Ios, 50 nm from Santorini. From Naxos a catamaran reaches the **Small Cyclades cluster** (Koufonisia, Schoinoussa, Iraklia, Donoussa) in 90 minutes - empty Cycladic anchorages that almost no Mykonos-departure charters reach. " +
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
      { q: "Can we reach Mykonos and Santorini from Naxos?", a: "Yes. Mykonos is 20 nm north (2.5 hours by catamaran), Santorini is 50 nm south (6 hours). A 10-day Naxos-based charter handles both with the Small Cyclades in between." },
      { q: "What's special about the Small Cyclades?", a: "Empty. Koufonisia, Schoinoussa, Iraklia, Donoussa are uninhabited-feeling, all 5-15 nm from Naxos, accessible mainly by yacht. The Small Cyclades are the Cycladic photography most charterers never see." },
    ],

    ctaTitle: "Find a Naxos catamaran for 2026.",
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
    seoTitle: "Honeymoon Yacht Charter Paros 2026",
    seoDescription: "Crewed honeymoon yacht charter to Paros and the Cyclades. Naoussa dinners, Antiparos anchorages, Despotiko archaeology. Weekly rates from €35K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Paros*") && sleeps <= 6 && (subtitle match "*Motor*" || subtitle match "*motor*" || builder match "*Princess*" || builder match "*Sunseeker*" || builder match "*Azimut*" || builder match "*Lagoon*" || builder match "*Fountaine*")',
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

    ctaTitle: "Plan a Paros honeymoon for 2026.",
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
    seoTitle: "Sailing Yacht Charter Kefalonia 2026",
    seoDescription: "Crewed sailing yacht charter to Kefalonia. Fiscardo, Assos, Myrtos Beach, Ithaca day-trip. Ionian thermal wind, sheltered cruising. From €22K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Kefalonia*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || builder match "*Beneteau*" || builder match "*Jeanneau*" || builder match "*Hanse*" || builder match "*Dufour*" || builder match "*Bavaria*")',
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

    ctaTitle: "Find a Kefalonia sailing yacht for 2026.",
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
    seoTitle: "Catamaran Charter Kefalonia 2026",
    seoDescription: "Crewed catamaran charter to Kefalonia. Fiscardo, Assos, Ithaca classic Ionian itinerary. Family-friendly stability and shallow draft. From €32K.",
    canonical: "https://georgeyachts.com/catamaran-charter-kefalonia",
    touristType: ["Families with children", "Multi-couple groups", "Ionian first-timers"],

    whyTitle: "Why a catamaran handles the Kefalonia brief",
    whyBody:
      "The Kefalonia itinerary (Fiscardo, Assos, Myrtos, Ithaca) is genuinely the Ionian's classic - the route every sailor wants to do. **Catamarans bring four advantages over monohulls** for the family or multi-couple version of this week. " +
      "**First, stability.** Even in the gentle Ionian thermal wind (15-18 knots), a sailing monohull heels 12-15°. A catamaran stays flat. Kids who get seasick on monohulls handle catamarans comfortably. " +
      "**Second, the swim platform.** A catamaran's swim platform sits 30 cm above the water and stretches the full width of the boat - kids walk on and off into water at every anchorage. Myrtos Beach lunch, the Fiscardo morning swim, the Ithaca afternoon snorkel - all accessible directly from the boat. " +
      "**Third, shallow draft.** Catamarans access the Foki Bay anchorage (south of Fiscardo, 1.5m depth) where deeper-draft monohulls anchor further offshore. Better swimming, easier tender access to Fiscardo. " +
      "**Fourth, cabin layout.** Catamaran 4-cabin layouts give two equal couples two equal cabins - the format that makes two-couple charters work without the master-vs-guest hierarchy of monohulls.",

    bestFor: [
      "Two-couple charters wanting the classic Ionian route comfortably",
      "Families with children aged 4-12 (catamaran + shallow anchorages = no complaints)",
      "Multi-generational groups bridging anxious-grandparent + active-kid",
      "Ionian first-timers wanting the photogenic destinations",
      "Repeat Mediterranean charterers trying catamaran format for the first time",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Ionian*" || cruisingRegion match "*Kefalonia*") && (subtitle match "*catamaran*" || subtitle match "*Catamaran*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine Pajot*" || builder match "*Leopard*")',
    yachtsHeadline: "Catamarans based in Kefalonia",
    featuredHeading: "Kefalonia / Ionian catamarans",

    whenTitle: "When to book",
    whenBody: "**June and September** are the family-perfect Kefalonia catamaran weeks. **July and August** book 9 months ahead - Fiscardo's catamaran moorings are the most-fought-over slots in the Ionian. **May and October** work for shoulder weeks; water cools but the family format still suits.",

    insiderTips: [
      "Reserve Fiscardo Mediterranean-mooring 48h ahead via the harbourmaster, or plan to anchor in Foki Bay and tender in.",
      "Myrtos Beach lunch anchorage: drop in 200m offshore (no holding inshore). Swim/tender to the beach by 11:00 before the day-tripper buses arrive.",
      "Assos has one catamaran-suitable slot at the quay. If full, anchor in the small bay outside the Venetian fortress.",
      "Ithaca's Frikes (north) over Vathy (south) for the catamaran family format. Smaller, less motor-yacht congestion, walk into the village dog scene.",
      "Robola white wine and Mavrodaphne dessert wine - both Kefalonian. Stock both at Argostoli before boarding.",
    ],

    faq: [
      { q: "How much does a Kefalonia catamaran charter cost?", a: "Weekly rates €32-55K for 12-15m catamarans, €58-95K for 16-20m luxury catamarans. APA 30-35% on top. Most Kefalonia catamaran weeks settle €50-85K all-in." },
      { q: "Can we charter a catamaran from Kefalonia for the classic Fiscardo+Assos+Ithaca route?", a: "Yes - this is the most-requested Kefalonia catamaran format. The route works perfectly for catamarans (stable Fiscardo morning crossing, shallow anchorages at Assos and Myrtos, calm Ithaca channels)." },
      { q: "Is Kefalonia airport (EFL) easy to reach?", a: "Direct flights from London, Manchester, Rome, Vienna in summer. 20-minute taxi to Argostoli marina (the catamaran base). Athens connection adds 5 hours." },
      { q: "Can we add Corfu and Paxos to a Kefalonia catamaran week?", a: "Possible for 10-day charters. Kefalonia → Paxos is 60 nm, Paxos → Corfu is 30 nm. 7-day weeks stay south of Lefkada; 10-day weeks reach Corfu." },
    ],

    ctaTitle: "Find a Kefalonia catamaran for 2026.",
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
    seoTitle: "Motor Yacht Charter Rhodes 2026",
    seoDescription: "Crewed motor yacht charter from Rhodes. Symi, Lindos, Karpathos, late-season Dodecanese itineraries. October still viable. From €55K.",
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

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Rhodes*") && (subtitle match "*motor*" || subtitle match "*Motor*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Sunseeker*" || builder match "*Pershing*" || builder match "*Heesen*")',
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

    ctaTitle: "Find a Rhodes motor yacht for 2026.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor&region=Dodecanese",
  },
];

export function getComboBySlug(slug) {
  return COMBOS.find((c) => c.slug === slug) || null;
}
