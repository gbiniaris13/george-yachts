// Tier 3 combo landing pages — yacht-type × destination intersections.
//
// 2026-05-11 — Phase 7 Round 3 SEO execution. Strategy doc lists
// 400 possible combos (8 yacht-types × 50 destinations). At that
// scale most pages become thin template fill-ins, which Google
// penalises. Instead we hand-curate the 12 combinations with the
// strongest commercial intent and write distinct content for each.
// Better 12 ranking-quality pages than 400 thin ones.

export const COMBOS = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht-charter-mykonos",
    urlPath: "/motor-yacht-charter-mykonos",
    eyebrow: "Motor yacht in Mykonos",
    h1: "Motor Yacht Charter Mykonos",
    tagline: "The Mykonos charter that survives August. Air-conditioned, stabilised, fast enough for Delos by dawn and Antiparos by dinner.",
    seoTitle: "Motor Yacht Charter Mykonos 2026 | Crewed Motor Yachts | George Yachts",
    seoDescription: "Crewed motor yacht charter from Mykonos. 18-50 metre motor yachts with chef, stabilisers, full toy fleet. Cyclades itineraries. Weekly rates from €60K.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-mykonos",
    touristType: ["UHNW Mykonos visitors", "Couples", "Families"],

    whyTitle: "Why motor yachts dominate Mykonos charters",
    whyBody:
      "Mykonos is **a motor-yacht destination first**. The combination of the **Meltemi** (15 to 25 knot summer wind), the long inter-island day-passages (Mykonos to Folegandros is 60 nm, to Santorini 80 nm), and the comfort expectations of the typical Mykonos charterer all point at the same yacht type. " +
      "A 30-metre motor yacht in Mykonos in August does what no sailing yacht can: anchors stabilised off Ornos at noon, transits 40 nm to Naoussa for dinner by 18:00, beats the Meltemi back to Mykonos by midnight without rolling the master cabin guests out of their beds. The pace matches the energy of the destination. " +
      "We base 8 motor yachts in Mykonos directly through the high season (June to September) — they don't reposition from Athens for charter starts. This saves a positioning leg of 6 to 8 hours from the start of the week and lets the charter begin with dinner ashore rather than a long day at sea.",

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
    whenBody: "**Mykonos motor yacht weeks book 9-12 months ahead** for peak August. **June and September** are the most-bookable shoulder weeks at 20-30% off August peak — the Meltemi has softened, the chora is quieter, the beach clubs still operational. **May and October** are possible but the season is winding down; some boats reposition out by mid-October.",

    insiderTips: [
      "Anchor at Ornos rather than the New Port — quieter, cleaner water, tender to the chora.",
      "Two tenders on the boat matters more in Mykonos than anywhere else. One for guest transfers, one for the chef's market runs.",
      "The Delos archaeological site closes at 15:00 — dawn anchorage, walk 09:00, back to Ornos by lunch.",
      "Mykonos marina fees are €1,500-€3,500/night for 30m+ yachts. Anchor at Ornos instead unless boarding/disembarking.",
      "Naoussa on Paros for dinner is the yacht-set route. 90 min by motor yacht, eat at Ouzeri Stou Frix or Soso, back to Mykonos by midnight.",
    ],

    faq: [
      { q: "How much does a motor yacht charter from Mykonos cost?", a: "Weekly rates start €60K for a 22-metre motor yacht and run to €450K+ for a 40-metre superyacht. Most Mykonos motor yacht charters settle €120-€250K base before APA (30-35%) and Greek VAT (12-24%)." },
      { q: "Which yachts are based in Mykonos?", a: "Roughly 8 motor yachts in our fleet base in Mykonos for high season including 2-3 in the 30-40 metre range. Direct boarding saves the Athens positioning leg." },
      { q: "Can we charter just for Mykonos August week?", a: "Yes. Mykonos motor yacht weeks for the peak August dates book 9-12 months out. Available motor yachts at that period are typically the larger 35-50m vessels — the smaller fleet sells through fastest." },
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
    seoTitle: "Motor Yacht Charter Santorini 2026 | Crewed Motor Yachts | George Yachts",
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
    whenBody: "**June and September** are the cleanest Santorini motor yacht months: full caldera season, light cruise-ship density, comfortable temperatures. **July-August** is spectacular but the Vlyhada marina (Santorini's only protected port) is heavily booked; tender mooring at the caldera works but plan ahead. **October** is the most underrated month — sunsets stay extraordinary, water swimmable, marina availability genuine.",

    insiderTips: [
      "Vlyhada marina is the only protected port. Book months in advance for July-August.",
      "Anchor below Oia for sunset, not below the chora — the chora side has the cliff drop and the wind eddy.",
      "Drone shots over the caldera from the foredeck are the highest-shared photos from any Cycladic charter. Plan the timing.",
      "Folegandros (35 nm) is the natural next stop. Don't loop back to Santorini every night.",
      "Skip the Akrotiri archaeological site on hot days; do it from a different port on a cool day.",
    ],

    faq: [
      { q: "Can a yacht anchor in the Santorini caldera overnight?", a: "Yes, weather permitting. The caldera is open to the south and can get swell on certain wind days. Captains move to the lee of Oia or the eastern coast when conditions require. For a calm August week, expect 2-3 caldera anchorage nights." },
      { q: "How long does a Santorini-based charter typically run?", a: "Seven nights is the standard. The Cycladic loop from Santorini (Folegandros, Sikinos, Ios, Small Cyclades) takes 4-5 days, with 2-3 days at the caldera bookending. Extending to 10 days adds Astypalaia or Anafi." },
      { q: "Can we board a yacht directly in Santorini?", a: "Yes. Several motor yachts in our fleet base in or reposition to Santorini for high-season charters. Vlyhada Marina is the main boarding point." },
      { q: "How much does a Santorini motor yacht charter cost?", a: "Base rate €60-€280K depending on yacht size, plus 30-35% APA and 12-24% Greek VAT. Most charters settle €120-€220K all-in for a 25-30m motor yacht." },
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
    seoTitle: "Catamaran Charter Mykonos 2026 | Family-Ready Catamarans | George Yachts",
    seoDescription: "Crewed catamaran charter from Mykonos. Sailing and power catamarans 50-80 feet, family-friendly, chef + hostess. Cycladic itineraries. From €30K.",
    canonical: "https://georgeyachts.com/catamaran-charter-mykonos",
    touristType: ["Families", "Friend groups", "Multi-couple charters"],

    whyTitle: "Why catamarans work for Mykonos",
    whyBody:
      "Mykonos in August is hot, busy, and exposed to Meltemi. A catamaran solves all three. **Wide deck for the heat** (more shaded living area than equivalent monohulls). **Zero heel and minimal anchor-side roll** in the strong Meltemi. **Shallow draft** that opens anchorages monohulls and motor yachts can't reach (Super Paradise back beach, the inside of Rhenia). " +
      "For **family groups of 6-10**, a 60-80 foot catamaran in Mykonos hits the sweet spot: enough cabin count, the children stay safe on the flat decks, and the budget runs 25-40% below an equivalent-capacity motor yacht. " +
      "The Mykonos catamaran fleet is split between **sailing catamarans** (Lagoon, Fountaine Pajot, Bali — slower, lower fuel cost, more authentic sailing feel) and **power catamarans** (Aquila, Sunreef Power — 18-22 knot cruise, motor-yacht-pace itineraries). Either works for Mykonos; the choice depends on whether your guests want sailing rhythm or fast inter-island transits.",

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
    whenBody: "Catamarans book 6-9 months ahead for peak August. **June, July, September** are the catamaran sweet spots — warm water, manageable Meltemi (or in catamaran-tolerant range), full beach-club operation. **May and October** suit pre/post-season weeks at 30-40% off peak.",

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
    seoTitle: "Catamaran Charter Lefkada 2026 | Family-Friendly Ionian | George Yachts",
    seoDescription: "Crewed catamaran charter from Lefkada. The Ionian's family-friendliest week. Kefalonia, Ithaca, Paxos in a single sheltered loop. From €25K.",
    canonical: "https://georgeyachts.com/catamaran-charter-lefkada",
    touristType: ["Families", "First-time charterers", "Couples"],

    whyTitle: "Why Lefkada is the catamaran capital of Greek charter",
    whyBody:
      "Lefkada Marina is **the most modern marina in Greek waters** and the natural departure port for any Ionian week. The Ionian's gentle thermal winds (8 to 14 knots in summer afternoons), the sheltered anchorages, and the short inter-island day-passages (Lefkada to Meganisi 5 nm, to Kefalonia 25 nm) all suit catamarans perfectly. " +
      "The Ionian is **the family-friendly Greek charter region**. No Meltemi. No long open-water passages. Anchorages are pine-fringed coves with shore access for swimming, lunch, and afternoon village walks. The Mamma Mia anchorages on Skopelos (yes, the church on the rock and the beach scenes from the film) are technically Sporades, not Ionian — but the Ionian's mood is similar: green, sheltered, lyrical. " +
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
    whenBody: "**May through October** is the Ionian charter season. **June, July, September** are the sweetest weeks — warm water, gentle wind, marinas at comfortable density. **August** is busier but never crowded by Cycladic standards. **Late September and October** are the under-the-radar shoulder months: water still 22°C, marinas half-empty, rates 30-40% off August peak.",

    insiderTips: [
      "Kioni on Ithaca for the evening anchorage — sheltered, restaurant-fringed, the most-photographed Ionian harbour.",
      "Paxos requires 6-week lead time for August peak. Lakka anchorage fills up early.",
      "Antipaxos (5 nm south of Paxos) has the best swimming beaches in the Mediterranean. Day trip from Paxos anchorage.",
      "Fiskardo on Kefalonia is the dinner village — book Tassia or Lagoudera ahead.",
      "Lefkada-Kefalonia is a 25 nm day under sail. Plan a leisurely morning departure, beach swim midday, arrive Fiskardo for sunset.",
    ],

    faq: [
      { q: "How much does a catamaran charter from Lefkada cost?", a: "Weekly rates start €25K for a 50-foot crewed catamaran and run to €90K for an 80-foot power catamaran. Most Lefkada catamaran weeks settle €35-€55K base before APA and Greek VAT (typically 12-24% depending on itinerary)." },
      { q: "Is the Ionian really suitable for first-time charterers?", a: "More than suitable — it's the recommended starting point. Sheltered water, short passages, calm anchorages, easy marina infrastructure. Most family charter weeks in Greek waters happen in the Ionian for these reasons." },
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
    seoTitle: "Sailing Yacht Charter Cyclades 2026 | Meltemi Sailing | George Yachts",
    seoDescription: "Crewed sailing yacht charter in the Cyclades. The Meltemi delivers reliable 15-25 knot wind for serious sailing. Mykonos, Paros, Naxos, Santorini routes. From €18K.",
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
      "August charters where Meltemi peaks — sailing weeks that handle wind",
      "Repeat clients alternating between sailing and motor",
      "Photography clients who want sailing-yacht-under-canvas shots",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*") && (subtitle match "*sailing*" || subtitle match "*Sailing*" || subtitle match "*S/Y*" || builder match "*Oyster*" || builder match "*Swan*" || builder match "*CNB*" || builder match "*Hallberg-Rassy*")',
    yachtsHeadline: "Sailing yachts in the Cyclades",
    featuredHeading: "Cycladic sailing yachts for 2026",

    whenTitle: "When the Cyclades sail best",
    whenBody: "**Mid-July to mid-September** is the Meltemi peak — best sailing of the year, suitable for experienced charterers who want serious wind. **June and early July** offer gentler 10-18 knot sailing — the sweetest weeks for couples and families new to monohull sailing. **May and late September** can have variable wind; expect mix of sailing and motor-sailing days.",

    insiderTips: [
      "Brief us at booking on sailing experience level. Beginners do better in June; experienced sailors thrive in August Meltemi.",
      "Reaching across the central Aegean at 22 knots true is the photograph. Plan one such day if conditions allow.",
      "Sailing yachts handle Meltemi better than motor yachts in some respects — the boats sail in it rather than push through.",
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
    seoTitle: "Sailing Yacht Charter Ionian 2026 | Gentle Sailing Greece | George Yachts",
    seoDescription: "Crewed sailing yacht charter in the Ionian. Corfu, Lefkada, Kefalonia, Paxos. Gentle thermal winds, sheltered anchorages. Perfect for first-time charterers. From €18K.",
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
    whenBody: "**May to October** is the active Ionian sailing season. **June, July, September** are the sweetest — warm water (22-25°C), reliable afternoon thermals, anchorages at low density. **August** is busier with charter traffic but still much quieter than Cycladic equivalents. **October** is the secret: warm air, swimmable water, sailors-only density.",

    insiderTips: [
      "Day-sails of 4-6 hours are the Ionian standard. Don't plan to sail dawn-to-dusk; the wind doesn't support it.",
      "Anchor in Kioni (Ithaca) at least one night. The most-photographed Ionian harbour.",
      "Paxos's Lakka harbour and Antipaxos for swimming — a 2-day combination most clients love.",
      "Kefalonia's Fiskardo is the village evening. Lagoudera and Tassia restaurants for dinner.",
      "If you're sailing-experienced, ask about a one-way Lefkada-to-Corfu charter. The northern Ionian (Paxos, Corfu) is meaningfully different from the south.",
    ],

    faq: [
      { q: "How much sailing actually happens on an Ionian charter?", a: "Typically 50-65% of the week under sail. Mornings are usually motor or motor-sail (the thermal hasn't kicked in). Afternoons sail at 8-14 knots. The pace suits charter rather than racing — relaxed, swim-stop friendly, dinner-ready by 19:00." },
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
    seoTitle: "Honeymoon Yacht Charter Mykonos 2026 | Romantic Cycladic Week | George Yachts",
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
    whenBody: "**June and September** are the cleanest Mykonos honeymoon months — warm enough for daily swimming, energy dialled back from peak August, restaurants book-able. **July-August** delivers full Mykonos energy but loses some of the privacy. Book honeymoon weeks **6-12 months ahead** for ideal yacht selection.",

    insiderTips: [
      "Brief the chef on a specific dish from somewhere meaningful (your first date restaurant, a holiday). The chef plans the week around it.",
      "Anchor at Rhenia for the morning of day three. Empty, white-sand cove, the boat all to yourselves.",
      "Sunset dinner on the foredeck in Ornos is the photograph. Plan it for day five when you've relaxed but the suntan is still fresh.",
      "If your wedding was in Mykonos, board the yacht the morning after — perfect decompression from the reception.",
      "Two-week charters give more flexibility. Week 1 active (Mykonos energy, Cycladic loop), week 2 quiet (Ionian transit or southern Cyclades decompression).",
    ],

    faq: [
      { q: "How much does a Mykonos honeymoon yacht charter cost?", a: "Weekly rates start €30K for a 50-foot sailing yacht with two crew. Mid-range 60-foot crewed catamarans run €45-€75K. 25-metre motor yachts with full crew €80-€140K. Plus APA 25-30% and Greek VAT 12-24%. Most honeymoon charters settle €55-€110K all-in." },
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
    slug: "honeymoon-yacht-charter-santorini",
    urlPath: "/honeymoon-yacht-charter-santorini",
    eyebrow: "Honeymoon from Santorini",
    h1: "Honeymoon Yacht Charter Santorini",
    tagline: "The caldera at anchor, every evening you choose. The most cinematic honeymoon yacht week in Greek waters.",
    seoTitle: "Honeymoon Yacht Charter Santorini 2026 | Caldera & Beyond | George Yachts",
    seoDescription: "Santorini honeymoon yacht charter. Anchor below Oia for sunset, day-trip to Folegandros, southern Cyclades loop. Curated romantic itineraries from €30K.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-santorini",
    touristType: ["Honeymooners", "Couples"],

    whyTitle: "Why Santorini honeymoons work best from a yacht",
    whyBody:
      "The classic Santorini honeymoon is a hotel balcony in Oia at sunset. Beautiful for the first night. Repetitive by night three, when you've watched the same crowd assemble for the same Instagram. A yacht honeymoon from Santorini **breaks the pattern**. " +
      "Sunset one: anchored below Oia, your own deck, the caldera in front of you, dinner the chef has been preparing all day. Sunset two: Folegandros at the cliff edge, a village walk before dinner ashore. Sunset three: back in the caldera if you want, or pressing south to Sikinos. The whole point is the freedom to choose. " +
      "Most Santorini-departure honeymoon weeks alternate between **caldera anchorages (2-3 nights)** and **southern Cyclades exploration (4-5 nights)**. Folegandros, Sikinos, Ios, the Small Cyclades. The honeymoon week ends back in the caldera for one final sunset before disembarking via Santorini airport.",

    bestFor: [
      "Couples ending a longer honeymoon trip with a yacht week",
      "Honeymooners who want the iconic caldera but on their own terms",
      "Couples mixing yacht week with Santorini hotel stay",
      "Photography-conscious honeymoons (the caldera shots are unmatched)",
      "Honeymoons in May, September, October when Santorini is mild but warm",
    ],

    yachtFilter: '_type == "yacht" && (cruisingRegion match "*Santorini*" || cruisingRegion match "*Cyclades*") && sleeps <= 4',
    yachtsHeadline: "Honeymoon yachts from Santorini",
    featuredHeading: "Caldera-ready yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**June and September** are the cinematic-light months — golden hour stretches longer, water is calm, cruise-ship density is manageable. **May and October** are the underrated months: warm, quiet, marinas open, rates 30-40% off summer peak. **July-August** is full caldera season but Vlyhada marina books out for honeymoon week stays.",

    insiderTips: [
      "Vlyhada marina is the only protected port for boarding. Book months ahead for July-August.",
      "Drone shots over the caldera from the foredeck are the highest-shared photos from any Cycladic honeymoon.",
      "Folegandros at sunset on day two — different cliff, different mood, just as cinematic.",
      "Chef's dinner on the foredeck below Oia is the photograph the couple ends up framing. Plan it for the night you're ready for it.",
      "If you're combining yacht with hotel, do hotel first (jet lag, settle in) then yacht (decompression, romance peak).",
    ],

    faq: [
      { q: "Can the yacht actually anchor in the caldera overnight?", a: "Yes, weather permitting. The caldera is deep (40-60m) and open to certain wind directions. Captains move to the lee of Oia or eastern coast when conditions require. Expect 2-3 caldera nights in a 7-night charter." },
      { q: "How much does a Santorini honeymoon charter cost?", a: "Weekly rates start €30K for a small sailing yacht; mid-range motor yacht honeymoon weeks run €60-€100K base. Plus APA 25-30% and Greek VAT 12-24%. Most Santorini honeymoon charters settle €50-€90K all-in." },
      { q: "Is Santorini better than Mykonos for a honeymoon?", a: "Different mood. Santorini delivers caldera-cinema and quiet evenings; Mykonos delivers energy and a livelier social tempo. Many honeymoons we plan visit BOTH — Mykonos start, Santorini end, yacht week between them." },
      { q: "When does Santorini's marina close for the season?", a: "Vlyhada operates year-round but the charter market scales down in October. Most charter yachts reposition out by mid-October. November to March charters are rare and require yacht-specific arrangement." },
    ],

    ctaTitle: "Plan your Santorini honeymoon for 2026.",
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
    seoTitle: "Family Yacht Charter Lefkada 2026 | Multi-Generational Ionian | George Yachts",
    seoDescription: "Family yacht charter from Lefkada. Ionian family routes — Meganisi, Ithaca, Kefalonia. Catamarans + motor yachts for 6-12 family members. From €30K.",
    canonical: "https://georgeyachts.com/family-yacht-charter-lefkada",
    touristType: ["Multi-generational families", "Families with young children"],

    whyTitle: "Why Lefkada is the family-charter capital of Greek waters",
    whyBody:
      "Multi-generational family weeks have **three competing demands**: children need active days and shallow-water access, parents need adult time and easy evenings, grandparents need shade and stable platforms. Lefkada-based Ionian charters satisfy all three better than any other Greek region. " +
      "**Short day-passages** (Lefkada to Meganisi is 5 nm, Meganisi to Ithaca is 15 nm) mean every transit is a morning or an afternoon, not a full day. **Sheltered anchorages** mean lunches and afternoons happen in flat water — children swim from the boat without worry, grandparents sit on deck without rolling. **Modern marinas** (Lefkada has the best in Greece) handle the logistics: provisioning, crew turnover, easy daughter-of-yacht-club departures. " +
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
    whenBody: "**Late June through early September** is the family window — school holidays align across Northern Europe, water is warm, anchorages are open. **Early July** is the sweet spot: temperatures comfortable, density lower than August peak. **Late August into early September** for families with older children who can extend past school start.",

    insiderTips: [
      "Brief the chef on each child's likes by name 3-4 weeks before charter. Lunch becomes the children's favourite meal by day three.",
      "Ithaca's Kioni harbour for at least one evening. The taverna scene is the most family-friendly in the Ionian.",
      "Kefalonia's Antisamos beach (the Mamma Mia 2 location) for the children's photography day.",
      "Hire a local guide for a half-day inland excursion (Kefalonia's caves, Lefkada's mountain villages). Builds variety into the week.",
      "Plan one beach-day and one village-evening for every two boat-only days. Children's attention spans benefit from the cadence.",
    ],

    faq: [
      { q: "How much does a family yacht charter from Lefkada cost?", a: "Weekly rates for a 6-8 person family yacht start €30K (60-foot crewed catamaran) and run to €120K (35-metre motor yacht). Most family weeks settle €45-€85K base before APA and Greek VAT. Per family member, that's typically €5,500-€11,000 for a 7-night charter." },
      { q: "Is the Ionian safe for children swimming from the boat?", a: "Yes — Ionian anchorages are the safest in Greek waters. Sheltered, shallow approaches, low boat traffic in summer. The crew on family-experienced yachts always supervise children's water activities and brief on safety on day one." },
      { q: "How many cabins do we need for a family of 8?", a: "Minimum 4 cabins. Recommended 5. A 60-foot catamaran (4-cabin) works for tight families; a 75-foot catamaran (5-cabin) gives a 'quiet cabin' for grandparents. For 10+ family members, a 25-metre motor yacht (5-6 cabins) is the right scale." },
      { q: "Can teenagers do watersports on the charter?", a: "Yes — most charter yachts above 25 metres carry paddleboards, kayaks, snorkel kits, and many have wakeboards or jet skis. Brief us on teen interests at booking; we'll match a yacht with strong watersports crew." },
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
    seoTitle: "Family Yacht Charter Corfu 2026 | Northern Ionian Family Routes | George Yachts",
    seoDescription: "Family yacht charter from Corfu. Northern Ionian routes covering Paxos, Antipaxos, Albanian Riviera. Catamarans + motor yachts for families. From €25K.",
    canonical: "https://georgeyachts.com/family-yacht-charter-corfu",
    touristType: ["Families", "Northern European visitors"],

    whyTitle: "Why Corfu opens up the northern Ionian for family charter",
    whyBody:
      "Corfu has **the second-easiest international air access in Greek waters after Athens**. Direct flights from London, Vienna, Frankfurt, Amsterdam, Manchester, and Dublin land at Corfu airport (IATA: CFU) at high frequency from April to October. This makes Corfu the natural departure point for **northern European families** whose flight logistics into Athens or Mykonos would add a day of transit. " +
      "From Corfu, the **northern Ionian** opens up: Paxos and Antipaxos to the south (2-3 hour transit), the Albanian Riviera to the north-east (cross-border but doable), the **Diapontian islands** (Othonoi, Erikoussa, Mathraki) to the north-west — the quietest Greek islands accessible from a Corfu base. Most Corfu-departure family charters run a 7-night loop **Corfu - Paxos - Antipaxos - back via the west coast**. " +
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
    whenBody: "**May to October** is the active Corfu charter season. **Late June through August** is family-peak with school holidays in alignment. **September and early October** are the sweet spots for families with older children (no school constraint) — warm water, quiet anchorages, lower rates. Most Corfu-based yachts winter in Lefkada Marina; charter availability begins mid-May.",

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
    seoTitle: "Superyacht Charter Mykonos 2026 | 30m+ Yachts | George Yachts",
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
      { q: "How much does a Mykonos superyacht charter cost?", a: "Weekly rates start €280K for a 30-metre superyacht and run to €1.2M+ for a 50-metre. Most Mykonos superyacht charters settle €350-€600K base before APA (30-35%) and Greek VAT (12-24%). All-in for a 35-metre week in peak August: typically €600-€900K." },
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
    seoTitle: "Luxury Yacht Charter Athens 2026 | 200+ Yachts from Alimos | George Yachts",
    seoDescription: "Luxury yacht charter departing Athens (Alimos and Lavrio marinas). Direct international flights, largest Greek fleet, full crew. Cyclades, Saronic, Sporades routes.",
    canonical: "https://georgeyachts.com/luxury-yacht-charter-athens",
    touristType: ["International UHNW visitors", "First-time charterers"],

    whyTitle: "Why Athens is the natural Greek charter departure port",
    whyBody:
      "Athens has **the largest yacht charter fleet in Greek waters**. Roughly 70% of the country's charter yachts base in or near Athens — primarily at **Alimos marina** (25 minutes from the airport, the largest commercial charter marina in Europe) and **Lavrio** (60 minutes east, smaller but increasingly preferred for departures toward the Sporades). " +
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
    whenBody: "Athens charter season runs **mid-April to late October**. **June and September** are the sweet spots for UHNW charters: warm water, quieter anchorages, 25-35% off August peak rates. **July-August** is peak — book 9-12 months ahead. **Shoulder months** (May, October) suit charters where weather flexibility is acceptable.",

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
    seoTitle: "Wedding Yacht Charter Mykonos 2026 | Reception Yachts | George Yachts",
    seoDescription: "Mykonos wedding yacht charter. Reception yachts for 30-80 guests, multi-yacht flotillas, photography days, after-party charters. Bespoke planning.",
    canonical: "https://georgeyachts.com/wedding-yacht-charter-mykonos",
    touristType: ["Wedding parties", "Bridal couples"],

    whyTitle: "Why a Mykonos wedding works on a yacht",
    whyBody:
      "Mykonos weddings have become **a category of their own** in the destination-wedding market. Roughly 200 international weddings happen on Mykonos each summer. The visual signature, the air-access logistics for international guests, and the established wedding-planner ecosystem all explain the rise. " +
      "**The yacht-based Mykonos wedding** solves the venue compromise. Mykonos's chora venues are atmospheric but capacity-limited and noise-restricted. Beach-club venues (Nammos, SantAnna, Scorpios) are spectacular but you're sharing with non-wedding crowds. A yacht venue is **entirely yours** — anchored off Mykonos, your decoration, your music, your tempo. " +
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
    whenBody: "**Bookings open 12-18 months ahead** for peak Mykonos summer dates (June through August). The Mykonos wedding planner network handles the on-shore logistics; we coordinate the yacht side. **September and early October** are increasingly popular as 'shoulder-season weddings' — weather still warm, costs 25% lower than peak summer, marinas less crowded.",

    insiderTips: [
      "We coordinate with your wedding planner; we don't replace one. Brief us early.",
      "Greek law requires civil weddings on Greek soil. The yacht hosts reception, photography, after-party — not the legal ceremony.",
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
];

export function getComboBySlug(slug) {
  return COMBOS.find((c) => c.slug === slug) || null;
}
