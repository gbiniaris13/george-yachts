// "Best yachts for X" series - Phase 7 Round 35 (2026-05-12).
// Technical brief Priority 5B.
//
// 10 high-intent comparison/recommendation pages. Each names yacht
// specs (not specific vessels - avoids outdated info) for a given
// use case. Schema: Article + ItemList + FAQPage.

export const BEST_YACHTS_PAGES = [
  {
    slug: "best-yachts-greece-large-groups",
    urlPath: "/best-yachts-greece-large-groups",
    eyebrow: "Large groups (10-12 guests)",
    h1: "Best Yachts in Greece for Large Groups (10-12 Guests, 2026)",
    tagline: "The SOLAS 12-guest cap is the hard line. Here are the yacht specs that deliver the right experience at that cap.",
    quickAnswerQ: "What's the best yacht in Greece for a group of 10-12?",
    quickAnswerA: "For 10-12 guests, target a 40-50m motor yacht with 5-6 cabins and stabilisers. Crew of 8-10. Peak July-August base: €220,000-€380,000 per week. The 12-guest SOLAS cap means even bigger yachts (50m+, 70m+) still sleep only 12 - the extra spec gives more amenity per guest, not more guests. For groups of 13+, multi-yacht flotilla is the answer.",
    yachts: [
      { spec: "40-45m motor yacht with 5 cabins", weekly: "€180,000-260,000", why: "Most-balanced spec. 8-10 crew, full stabilisers, premium amenities." },
      { spec: "45-50m motor yacht with 6 cabins", weekly: "€260,000-380,000", why: "Extra cabin for split-occupancy or single-room comfort." },
      { spec: "50-60m superyacht with 6+ cabins", weekly: "€380,000-650,000", why: "Hotel-grade service ratios, dedicated children's stewardess possible." },
      { spec: "Luxury catamaran 26-30m with 5-6 cabins", weekly: "€85,000-180,000", why: "Zero roll, shallow draft, more deck space than monohull equivalent." },
    ],
    faq: [
      { q: "Why not bigger yacht for 12 guests?", a: "You can - 70m+ megayachts for 12 guests deliver hotel-grade service ratios (1.5:1 crew-to-guest), beach club, helipad. Pricing scales to €650k-€1.8M+ weekly. Worth it for milestone events." },
      { q: "Can I add day guests for events?", a: "Yes. The 12-cap is overnight only. Day events can host 18-24 additional guests via tender from shore. Standard practice for dinners, lunches, sundowners." },
      { q: "What if my group is 14-16?", a: "Multi-yacht flotilla: two yachts in parallel formation, alternating dinner host, shared itinerary. Cost ~1.7x equivalent single yacht. Common arrangement for weddings and milestone events." },
    ],
    seoTitle: "Best Yachts in Greece for Large Groups 10-12 Guests 2026",
    seoDescription: "Best yacht specs for 10-12 guests in Greece: 40-50m motor yachts, luxury cats, superyachts. SOLAS 12-cap explained. Real pricing.",
  },
  {
    slug: "best-yachts-greece-families-children",
    urlPath: "/best-yachts-greece-families-children",
    eyebrow: "Families with children",
    h1: "Best Yachts in Greece for Families with Children (2026)",
    tagline: "Catamarans dominate the family chartering market for good reason. Here's the full spec landscape for kids of every age.",
    quickAnswerQ: "What's the best yacht for a family with young children in Greece?",
    quickAnswerA: "Catamarans win for families with under-10s: zero roll at anchor means kids sleep through moves, shallow 1.5m draft accesses calm-water beaches monohulls miss, 50% more deck space at equivalent length. For older kids (10+), 32-40m motor yachts with stabilisers and full water-toy inventory work better. Ionian Sea routing for kids under 10 (no Meltemi).",
    yachts: [
      { spec: "Sailing catamaran 50-55ft", weekly: "€35,000-60,000", why: "Lower budget, family-friendly pace, sailing experience for older kids." },
      { spec: "Power catamaran 26-30m", weekly: "€85,000-130,000", why: "Zero roll, shallow draft, large deck for kids' activities." },
      { spec: "Motor yacht 32-40m with stabilisers", weekly: "€140,000-240,000", why: "Space, amenity, children's-programme stewardess possible." },
      { spec: "Luxury catamaran 80-100ft (Sunreef)", weekly: "€140,000-240,000", why: "UHNW family spec - all the cat advantages + Sunreef amenity." },
    ],
    faq: [
      { q: "Cyclades or Ionian for kids?", a: "Ionian for under-10s. Cyclades for 10+ if kids handle wind. The Meltemi is the deciding factor - Cyclades summer can be 25-30 knots for 3-5 day stretches." },
      { q: "What about teenage water toys?", a: "Teenagers love e-foils (12+), Seabobs (10+), jet skis (16+). Brief George 14+ days ahead so the yacht stocks the right kit for your kids' ages." },
      { q: "Can crew handle infant routines?", a: "Yes - stewardesses are trained for nap timing, bottle prep, baby-monitor support. Brief specifics 14+ days ahead." },
    ],
    seoTitle: "Best Yachts in Greece for Families with Children 2026",
    seoDescription: "Best family yacht specs Greece: catamarans, stabilised motor yachts. Ionian vs Cyclades. Real pricing. Family-tested by George Yachts.",
  },
  {
    slug: "best-yachts-greece-couples",
    urlPath: "/best-yachts-greece-couples",
    eyebrow: "Couples / honeymoon",
    h1: "Best Yachts in Greece for Couples (2026)",
    tagline: "For two guests, the right yacht is intimate, fast, and romantic without the overhead of bigger-yacht logistics.",
    quickAnswerQ: "What's the best yacht for a couple's Greek charter?",
    quickAnswerA: "For couples, target a 24-30m motor yacht (1-2 cabins, 3-4 crew, €55,000-110,000 weekly base) or a 32-40m sailing yacht (€55,000-130,000). Smaller crews mean more privacy, faster Cyclades passages, and shorter pre-charter logistics. Honeymoons typically combine 1-2 nights Santorini caldera with 4-5 nights smaller Cyclades.",
    yachts: [
      { spec: "Motor yacht 24-28m, 1-2 cabins", weekly: "€55,000-85,000", why: "Maximum intimacy, fast passages, premium service" },
      { spec: "Motor yacht 28-34m, 2 cabins", weekly: "€85,000-130,000", why: "Room for couples' privacy + dedicated dining areas" },
      { spec: "Sailing yacht 32-40m, 2-3 cabins", weekly: "€55,000-95,000", why: "Sailing-into-sunset moments, lower fuel, romantic pace" },
      { spec: "Catamaran 50-60ft", weekly: "€35,000-65,000", why: "Stability + space, for couples who get queasy or want value" },
    ],
    faq: [
      { q: "Why not a bigger yacht for a couple?", a: "You can - 35m+ yachts for a couple deliver more amenity per guest. But the crew-to-guest ratio gets odd (5-6 crew for 2 guests can feel intrusive). Most couples find 24-30m the sweet spot for privacy + service." },
      { q: "Best month for a couples' Greek charter?", a: "Late June or early September. Same warm water, ~20% lower rates than peak, Meltemi quieter, less yacht traffic at iconic anchorages." },
      { q: "Can the yacht arrange a proposal or anniversary setup?", a: "Yes - flowers, photographer, custom champagne label, surprise anchor timing. Brief George 21+ days ahead." },
    ],
    seoTitle: "Best Yachts in Greece for Couples + Honeymoon 2026",
    seoDescription: "Best couples' yacht specs Greece: 24-30m motor, 32-40m sailing, catamarans. Romantic itineraries, proposal logistics. From George Yachts.",
  },
  {
    slug: "best-yachts-greece-corporate-events",
    urlPath: "/best-yachts-greece-corporate-events",
    eyebrow: "Corporate / events",
    h1: "Best Yachts in Greece for Corporate Events (2026)",
    tagline: "Off-sites, client hosting, board retreats. The yacht specs that signal seriousness without overspending.",
    quickAnswerQ: "What's the best yacht in Greece for a corporate event?",
    quickAnswerA: "For corporate events, target a 40-50m motor yacht (5-6 cabins, 8-10 crew, 12-guest peak) or 50-60m superyacht for upper-tier client hosting. Aft decks at anchor work as meeting spaces. Starlink + 4G/5G connectivity across the archipelago. MYBA-standard NDAs available. Peak summer base: €220,000-€650,000 per week.",
    yachts: [
      { spec: "Motor yacht 40-50m", weekly: "€220,000-380,000", why: "Standard corporate spec, 12-guest cap, meeting-ready aft deck" },
      { spec: "Superyacht 50-70m", weekly: "€380,000-1,200,000", why: "Premium client hosting, helipad, board-meeting privacy" },
      { spec: "Conference-capable catamaran 26-30m", weekly: "€85,000-180,000", why: "Better deck space for working sessions" },
    ],
    faq: [
      { q: "Can we run a board meeting onboard?", a: "Yes - aft decks at anchor are excellent meeting spaces. Starlink + 4G/5G connectivity throughout. Captain holds calm anchorage on request." },
      { q: "Are corporate charters tax-deductible?", a: "Depends on jurisdiction and use case. Client-hosting is typically marketing/BD spend; off-sites are training/development. Consult your tax advisor. George provides MYBA-standard invoices." },
      { q: "Can we bring extra event staff (DJ, photographer)?", a: "Yes - via George's vendor network. Standard yacht crew handles base service; specialty staff coordinated separately." },
    ],
    seoTitle: "Best Yachts in Greece for Corporate Events + Off-Sites 2026",
    seoDescription: "Best corporate yacht specs Greece: 40-50m motor, 50-70m superyacht. Meeting-ready aft decks, Starlink, NDAs available. From George Yachts.",
  },
  {
    slug: "best-yachts-greece-stabilizers-smooth-sailing",
    urlPath: "/best-yachts-greece-stabilizers-smooth-sailing",
    eyebrow: "Smoothest yachts",
    h1: "Best Yachts in Greece with Stabilizers (2026)",
    tagline: "The yachts that eliminate roll entirely. For motion-sensitive guests or wind-day comfort on the Cyclades.",
    quickAnswerQ: "Which yacht specs in Greece have the best stabilisers?",
    quickAnswerA: "Modern 30-50m motor yachts built 2018+ typically have zero-speed gyroscopic stabilisers (Seakeeper) that reduce roll from 5-8 degrees to under 1 degree at anchor. Above 50m, twin-gyro setups eliminate roll entirely. Catamarans (1-2 degree roll naturally) need no stabilisers. Pre-2015 yachts often have fin-only systems - less effective at anchor.",
    yachts: [
      { spec: "Motor yacht 28-35m with Seakeeper", weekly: "€110,000-180,000", why: "Modern build + premium stabilisation, motion-sickness-proof" },
      { spec: "Motor yacht 35-50m with twin gyros", weekly: "€180,000-420,000", why: "Maximum-comfort stabilised, ideal for Meltemi-aware UHNW" },
      { spec: "Catamaran any size", weekly: "€35,000-240,000", why: "Naturally roll-resistant, no stabiliser needed" },
    ],
    faq: [
      { q: "Do stabilisers consume fuel?", a: "Gyroscopic systems consume electricity (3-10kW) which means the generator runs slightly more. Fuel cost over a full charter: ~€200-€500 incremental. Negligible vs comfort gain." },
      { q: "Are stabilisers retrofitted on older yachts?", a: "Some - Seakeeper retrofits became common 2018+. Pre-2015 yachts often still have fin-only systems (effective underway, less so at anchor). Always ask specifically." },
      { q: "Can stabilisers handle Meltemi?", a: "Modern gyro systems handle 25-knot Meltemi easily at anchor. In severe conditions (30+ knots), captain may relocate to sheltered anchorage anyway." },
    ],
    seoTitle: "Best Yachts in Greece with Stabilizers 2026 | Seakeeper Spec",
    seoDescription: "Best stabilised yachts Greece: Seakeeper-equipped 28-50m motor yachts, twin-gyro 50m+. Eliminate roll on Meltemi days. From George Yachts.",
  },
  {
    slug: "best-sailing-yachts-greece",
    urlPath: "/best-sailing-yachts-greece",
    eyebrow: "Sailing yachts",
    h1: "Best Sailing Yachts in Greece (2026)",
    tagline: "Modern luxury sailing yachts offer the sailing experience itself plus 30-40% lower rates than equivalent motor yachts. Here's the spec landscape.",
    quickAnswerQ: "What's the best sailing yacht charter in Greece?",
    quickAnswerA: "For sailing yachts in Greece, target a 30-45m cruising yacht (Oyster, Swan, Hoek) for amenity + sailing experience balance. Peak July-August base: €55,000-€280,000 per week. Performance sailing yachts (Wally, Baltic) prioritise speed but have less guest space. The Ionian Sea (no Meltemi) suits relaxed sailing; the Cyclades for charterers who want wind.",
    yachts: [
      { spec: "Sailing yacht 30-35m (cruising spec)", weekly: "€55,000-95,000", why: "Standard cruising sailing yacht, family-friendly" },
      { spec: "Sailing yacht 35-45m (premium cruising)", weekly: "€95,000-180,000", why: "Premium amenity + sailing experience" },
      { spec: "Sailing yacht 45-60m (performance + amenity)", weekly: "€180,000-450,000", why: "Top-tier sailing yacht with full amenity" },
      { spec: "Sailing catamaran 50-60ft", weekly: "€35,000-75,000", why: "Family-friendly stability + sailing pace" },
    ],
    faq: [
      { q: "Do I need to know how to sail?", a: "No - crewed sailing yachts have professional crew handling every aspect of sailing. Guests can be entirely passengers. Captain teaches the helm in 1-2 hours if interested." },
      { q: "Sailing vs motor yacht for the same length?", a: "Sailing yachts are 30-40% cheaper for equivalent length. Pay-off: slower passages (8-10 knots cruise vs 13-16), less interior volume (mast takes vertical space). Right for buyers who specifically want the sailing experience." },
      { q: "Ionian vs Cyclades for sailing?", a: "Ionian for relaxed family sailing (no Meltemi, calm waters). Cyclades for charterers who want wind sailing experience (real downwind passages in Meltemi)." },
    ],
    seoTitle: "Best Sailing Yacht Charter Greece 2026 | 30-60m Specs",
    seoDescription: "Best Greek sailing yacht specs: 30-45m cruising, 45-60m premium, sailing cats. 30-40% cheaper than motor. From George Yachts.",
  },
  {
    slug: "best-catamarans-greece-charter",
    urlPath: "/best-catamarans-greece-charter",
    eyebrow: "Catamarans",
    h1: "Best Catamaran Charters in Greece (2026)",
    tagline: "The named yachts, not spec classes: George's crewed catamaran picks for 2026, with live rates from the fleet.",
    // 2026-07-02 (ASK A Section 2, Phase 2) — rebuilt from generic spec
    // classes to the REAL fleet. The old rows quoted bands (60-80ft power
    // at €85-180k) that contradicted our own live listings (€49-90k),
    // exactly the cross-page inconsistency AI engines punish. Every row
    // below is a named yacht with its listed 2026 rate and a link.
    quickAnswerQ: "What's the best catamaran charter in Greece?",
    quickAnswerA: "The strongest crewed catamarans in George's 2026 Greek fleet: the Sunreef 70 Power ALTEYA (€49,000-69,000 weekly base), the Sunreef 80s Genny and Above & Beyond (€56,000-79,000), the Fountaine Pajot Thira 80 class sleeping up to 12 guests (€65,000-90,000), and value picks from the Aquila 54 at €21,000-28,000 down to the crewed Fountaine Pajot MY 44 at €14,000-17,500. All rates are weekly base, excluding VAT (at each yacht's certified rate) and APA. Catamarans carry roughly 40% more deck space than a monohull of equal length and a shallow draft that opens anchorages like the Antiparos channel.",
    yachts: [
      { spec: "ALTEYA - Sunreef 70 Power, 8 guests, 4 cabins, 4 crew", weekly: "€49,000-69,000", why: "Listed as the only Sunreef 70 Power in the Mediterranean: motor-yacht pace with catamaran floor space, a gourmet Mediterranean chef aboard, and the week's fuel line kept honest by twin efficient hulls.", href: "/yachts/alteya" },
      { spec: "Genny - Sunreef 80, 10 guests, 5 cabins, 6 crew", weekly: "€56,000-79,000", why: "Five suites, 340 square metres of living space and a jet ski in the garage. The five-cabin layout is the two-families sweet spot, with crew service run from separate quarters.", href: "/yachts/genny" },
      { spec: "Above & Beyond - Sunreef 80, 8 guests, 4 cabins, 5-6 crew", weekly: "€56,000-77,000", why: "The galley is the story: Chef Savvas took 1st Place Platinum at MEDYS 2022 and 1st Place Diamond at EMMYS 2023. Four full suites and the same 340 square metres as her sister.", href: "/yachts/above-beyond" },
      { spec: "Ad Astra - Fountaine Pajot Thira 80, 10 guests, 5 cabins, 5 crew", weekly: "€65,000-90,000", why: "The sailing superyacht of the class, chartering year-round. Her sister Aloia adds solar-powered silent nights at anchor - no generator hum under the stars.", href: "/yachts/ad-astra" },
      { spec: "ChristAl MiO 80 - Fountaine Pajot Thira 80, 12 guests, 6 cabins, 5 crew", weekly: "€70,000-90,000", why: "The full twelve: six cabins take a Greek charter to its legal guest ceiling on one platform. The single-yacht answer for three families or a milestone week.", href: "/yachts/christal-mio-80" },
      { spec: "Crazy Horse - Lagoon 78, 10 guests, 5 cabins, 5 crew", weekly: "€50,000-69,000", why: "Five crew for ten guests, a chef doing modern Greek creative cuisine with a pastry specialism, and a captain who teaches as he sails.", href: "/yachts/crazy-horse" },
      { spec: "Explorion - Aquila 54, 8 guests, 4 cabins, 3 crew", weekly: "€21,000-28,000", why: "The value pick with a full brief: HACCP-certified chef of 22 years, a captain who freedives, and power-cat pace at a mid-fleet rate.", href: "/yachts/explorion" },
      { spec: "Endless Beauty - Fountaine Pajot MY 44, 6 guests, 3 cabins, 2 crew", weekly: "€14,000-17,500", why: "The entry to fully crewed: an intimate power cat for one family, with captain and cook-hostess aboard. Proof the crewed week starts lower than most guests expect.", href: "/yachts/endless-beauty" },
    ],
    faq: [
      { q: "Sailing or power catamaran for family?", a: "Sailing for lower cost + relaxed pace + sailing experience. Power for faster passages + larger interior + quieter at anchor (no rigging noise). In this fleet: Genny, Above & Beyond and Ad Astra sail; ALTEYA, ChristAl MiO 80 and Endless Beauty run power." },
      { q: "Marina fees on catamarans?", a: "Some Greek marinas charge 1.3-1.5x monohull rate due to wider beam. Most Cyclades anchorages are anchorage-only, so this rarely impacts total cost." },
      { q: "What's the largest catamaran in the Greek market?", a: "Sunreef 100s and 110s appear in Greek waters occasionally - €240k+ weekly. Most consistent inventory tops at 80-90ft, which is exactly where this fleet's flagships (Sunreef 80, Thira 80, Lagoon 78 and CNB 81) sit." },
      { q: "What do these rates include?", a: "Weekly base rate covers the yacht and her crew. On top come APA (typically 25-30% for catamarans, covering fuel, provisioning and berthing, settled transparently) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans (statutory 13%; 24% applies to short, static or bareboat arrangements)." },
      { q: "How far ahead do the named flagships book?", a: "The Sunreef 80s and Thira 80s commit earliest, often 6 to 12 months out for peak July-August weeks. June and September hold availability closer in, at softer rates for the same yacht." },
    ],
    seoTitle: "Best Catamaran Charter Greece 2026 | Sailing vs Power",
    seoDescription: "Best Greek catamarans: 50-55ft Lagoon/Bali, 60-80ft Sunreef/Aquila power, 80-100ft luxury. Family + UHNW specs from George Yachts.",
  },
  {
    slug: "best-motor-yachts-greece-speed",
    urlPath: "/best-motor-yachts-greece-speed",
    eyebrow: "Speed",
    h1: "Best Fast Motor Yachts in Greece (2026)",
    tagline: "When the itinerary demands speed - Athens to Mykonos in 3 hours, Cyclades-to-Cyclades in afternoons. Planing-hull and performance specs.",
    quickAnswerQ: "What's the fastest motor yacht charter in Greece?",
    quickAnswerA: "For speed in Greek charters, planing-hull motor yachts in the 24-40m range deliver 25-35 knots top speed. Common builders: Pershing, Sunseeker, Princess, Fairline. Peak July-August base: €55,000-€220,000 per week. Trade-off: fuel consumption 3-4x displacement yachts (higher APA needed, 35% typical). Best for short-format charters (4-5 days) covering long distances.",
    yachts: [
      { spec: "Performance motor yacht 24-30m (Pershing-class)", weekly: "€55,000-110,000", why: "30-35 knot top speed, sporty handling" },
      { spec: "Sport yacht 30-40m (Sunseeker Predator-class)", weekly: "€110,000-220,000", why: "Speed + premium amenity" },
      { spec: "Sport superyacht 40-50m", weekly: "€220,000-380,000", why: "Top-tier performance + space" },
    ],
    faq: [
      { q: "Is speed worth the fuel cost?", a: "For short-format charters (3-5 nights) covering multiple regions, yes. For 7-night relaxed itineraries within one archipelago, no - displacement hulls do the same job at half the fuel cost." },
      { q: "Fastest passage time Athens to Mykonos?", a: "Performance yachts: ~3 hours at 25-30 knots. Standard displacement: 5-6 hours. The 2-3 hour saving is meaningful on short charters." },
      { q: "Is the ride comfortable at top speed?", a: "At 25+ knots in chop, planing-hull yachts pound more than displacement. Most owners cruise these yachts at 18-22 knots for comfort; top speed reserved for showcase moments." },
    ],
    seoTitle: "Best Fast Motor Yacht Charter Greece 2026 | Planing-Hull Specs",
    seoDescription: "Fastest motor yachts Greece: 24-50m Pershing, Sunseeker, Princess. 25-35kt top speed. Short-format charter optimised. From George Yachts.",
  },
  {
    slug: "best-superyachts-greece-august",
    urlPath: "/best-superyachts-greece-august",
    eyebrow: "Superyacht · August",
    h1: "Best Superyacht Charters in Greece for August (2026)",
    tagline: "August in the Greek archipelago is the most-requested charter month. The 50m+ yachts that still have availability + the early-2027 booking strategy.",
    quickAnswerQ: "What's the best superyacht charter in Greece for August?",
    quickAnswerA: "August Greek superyacht availability is 94% committed by mid-May 2026. Remaining options: 50-60m yachts in compressed formats. Recommended specs: 50-60m motor yacht (6 cabins, 11-14 crew, €380-650k base), 60-80m megayacht (€650k-1.3M), or 80m+ gigayacht via Monaco repositioning (€1.3M-2.5M+). Plan 2027 by October 2026 if specific yacht required.",
    yachts: [
      { spec: "Superyacht 50-60m", weekly: "€380,000-650,000", why: "Most-available August superyacht spec" },
      { spec: "Megayacht 60-80m", weekly: "€650,000-1,300,000", why: "Premium tier with helipad, beach club" },
      { spec: "Gigayacht 80m+ (Monaco-positioned)", weekly: "€1,300,000-2,500,000+", why: "Top-tier global fleet, repositioned to Greece on request" },
    ],
    faq: [
      { q: "How committed is August 2026?", a: "As of mid-May 2026: 50m+ effectively closed (94% committed). 60-70m: 6 yachts have August dates remaining. 70m+ requires Monaco repositioning." },
      { q: "What about August 2027?", a: "Start conversation October 2026 for peak August 2027. Top 50m+ yachts will fully commit by Q1 2027 based on 2026 booking pace." },
      { q: "Are there alternatives to August?", a: "Late September Cyclades + October Saronic. Same warm water, no Meltemi, 18-32% lower rates than August peak. Most premium UHNW repeat-charterers actually prefer these windows." },
    ],
    seoTitle: "Best Superyacht Charter Greece August 2026 | Availability + Pricing",
    seoDescription: "50m+ superyacht charter Greece August 2026: 94% committed. Real specs + pricing. 60-80m + 80m+ Monaco-positioned options.",
  },
  {
    slug: "best-gulets-greece-authentic-experience",
    urlPath: "/best-gulets-greece-authentic-experience",
    eyebrow: "Gulets",
    h1: "Best Gulet Charters in Greece (2026)",
    tagline: "Wooden traditional yachts. Slow pace, large deck space, authentic Mediterranean atmosphere. The Greek gulet landscape.",
    quickAnswerQ: "What's the best gulet charter in Greece?",
    quickAnswerA: "For Greek gulets, target 30-35m for mid-tier (€42-70k weekly base) or 35-45m for luxury (€70-140k). Greek-flagged gulets operate primarily out of the Dodecanese (Rhodes, Symi) with itineraries into the Cyclades possible. Wooden-hull aesthetic, 6-8 cabins typical, slow cruising (7-8 knots). Charter format suits buyers who want atmosphere + space at moderate prices.",
    yachts: [
      { spec: "Gulet 25-30m", weekly: "€25,000-50,000", why: "Entry-level, 5-6 cabins, basic amenities" },
      { spec: "Luxury gulet 30-35m", weekly: "€42,000-70,000", why: "Standard luxury gulet spec, 6-8 cabins, AC, full crew" },
      { spec: "Premium luxury gulet 35-45m", weekly: "€70,000-140,000", why: "8 cabins (12 guests), jacuzzi, water toys, refit since 2020" },
    ],
    faq: [
      { q: "Are gulets sailing yachts?", a: "Technically yes (masts + sails) but in practice gulets cruise primarily under engine at 7-8 knots. The sailing is aesthetic rather than functional on most modern gulets." },
      { q: "Greek vs Turkish gulet?", a: "Greek gulets are Greek-flagged, MYBA-contracted, EU-regulated. Turkish gulets are typically cheaper but have flag-state restrictions on Greek itineraries. Most charterers wanting all-Greek itineraries pick Greek-flagged gulets." },
      { q: "Best region for gulets in Greece?", a: "Dodecanese (Symi, Rhodes, Kos) is the natural gulet area - calm waters, authentic villages, less yacht traffic than Cyclades. Some gulets work Cycladic itineraries from Athens base." },
    ],
    seoTitle: "Best Gulet Charter Greece 2026 | Authentic Wooden Yacht Specs",
    seoDescription: "Greek gulet charter: 25-45m wooden yachts, Dodecanese base, €25-140k weekly. Authentic Mediterranean atmosphere. From George Yachts.",
  },

  // ─────────────────────────────────────────────────────────────
  // 2026-07-03 (Wave 2, catamaran cluster) — cabin-count listicles.
  // Unlike the spec-class pages above, these name REAL fleet yachts
  // with live listed rates (read from Sanity 2026-07-02), because
  // cabin count is the exact question families ask and named answers
  // are what engines extract. Feeds /catamaran-charter-greece.
  {
    slug: "best-4-cabin-catamarans-greece",
    urlPath: "/best-4-cabin-catamarans-greece",
    eyebrow: "4 Cabins · 8 Guests",
    h1: "Best 4-Cabin Catamarans in Greece (2026)",
    tagline: "Eight guests, four suites, one deck. The named yachts, with live rates from the fleet.",
    quickAnswerQ: "What is the best 4-cabin catamaran to charter in Greece?",
    quickAnswerA: "The strongest 4-cabin (8-guest) catamarans in George's 2026 Greek fleet: the Sunreef 70 Power ALTEYA (€49,000-69,000 weekly base), the Sunreef 80 Above & Beyond with her award-winning chef (€56,000-77,000), the Lagoon CNB 81 Imladris (€65,000-85,000), the Fountaine Pajot Alegria 67 sisters Kimata and Alexandra II (€31,500-43,500), and the value picks Aquila 54 Explorion (€21,000-28,000) and Lagoon 55 Azul (€20,000-26,900). All rates weekly base, excluding VAT (at each yacht's certified rate) and APA. Four cabins is the two-couples or family-plus-grandparents layout.",
    yachts: [
      { spec: "ALTEYA - Sunreef 70 Power, 8 guests, 4 crew", weekly: "€49,000-69,000", why: "The only Sunreef 70 Power listed in the Mediterranean: motor-yacht pace with four full suites and a gourmet chef.", href: "/yachts/alteya" },
      { spec: "Above & Beyond - Sunreef 80, 8 guests, 5-6 crew", weekly: "€56,000-77,000", why: "Four suites across 340 square metres, and the galley that took 1st Place Platinum at MEDYS 2022 and 1st Place Diamond at EMMYS 2023.", href: "/yachts/above-beyond" },
      { spec: "Imladris - Lagoon CNB 81, 8 guests, 5 crew", weekly: "€65,000-85,000", why: "The state-of-the-art sailing superyacht of the class: four cabins on an 81-footer means every suite breathes.", href: "/yachts/imladris" },
      { spec: "SAMARA - custom 80 ft power cat, 8 guests, 4 crew", weekly: "€65,000-70,000", why: "4,000 square feet of living space for eight guests - the most room per person in the catamaran fleet.", href: "/yachts/samara" },
      { spec: "Alexandra II - Fountaine Pajot Alegria 67, 8 guests, 4 crew", weekly: "€33,500-43,500", why: "All-inclusive styling with a jacuzzi on deck; the Alegria 67 is the class workhorse for two families sharing.", href: "/yachts/alexandra-ii" },
      { spec: "Kimata - Fountaine Pajot Alegria 67, 8 guests, 3 crew", weekly: "€31,500-42,500", why: "Award-winning, full teak deck, and a Le Monde Athens-trained chef of 12+ years in the galley.", href: "/yachts/kimata" },
      { spec: "Explorion - Aquila 54, 8 guests, 3 crew", weekly: "€21,000-28,000", why: "The value pick: power-cat pace, HACCP-certified chef of 22 years, at a mid-fleet rate.", href: "/yachts/explorion" },
      { spec: "Azul - Lagoon 55, 8 guests, 3 crew", weekly: "€20,000-26,900", why: "The entry to the 4-cabin sailing class, with a chef guests describe as belt-loosening.", href: "/yachts/azul" },
    ],
    faq: [
      { q: "Who does a 4-cabin catamaran suit?", a: "Two couples, a family with three or four children, or a family plus grandparents. Eight guests map onto four suites without anyone drawing the short straw, which is why the 4-cabin layout is the workhorse of Greek family chartering." },
      { q: "What do these rates include?", a: "The yacht and her crew. On top come APA (typically 25-30% for catamarans, a transparent account for fuel, provisioning and berthing) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans." },
      { q: "Sailing or power in the 4-cabin class?", a: "Sailing (Above & Beyond, Imladris, Kimata, Alexandra II, Azul) for the rhythm and the lower rate; power (ALTEYA, SAMARA, Explorion) for 18-22 knot passages that fit two island groups into one week." },
      { q: "What if we are more than eight guests?", a: "Step up to the 5-cabin class (ten guests) or, for the full legal twelve, the six-cabin Fountaine Pajot Thira 80 ChristAl MiO 80. George keeps a separate guide for 5-cabin catamarans." },
    ],
    seoTitle: "Best 4-Cabin Catamaran Charter Greece 2026 | Named Fleet & Rates",
    seoDescription: "The best 4-cabin, 8-guest crewed catamarans in Greece with live weekly rates: Sunreef 70 Power, Sunreef 80, Lagoon CNB 81, Alegria 67, Aquila 54. From George Yachts, IYBA member.",
  },
  {
    slug: "best-5-cabin-catamarans-greece",
    urlPath: "/best-5-cabin-catamarans-greece",
    eyebrow: "5 Cabins · 10 Guests",
    h1: "Best 5-Cabin Catamarans in Greece (2026)",
    tagline: "Ten guests, five suites: the two-families sweet spot. Named yachts, live rates.",
    quickAnswerQ: "What is the best 5-cabin catamaran to charter in Greece?",
    quickAnswerA: "The strongest 5-cabin (10-guest) catamarans in George's 2026 Greek fleet: the Sunreef 80 Genny with jet ski and 340 square metres of living space (€56,000-79,000 weekly base), the Fountaine Pajot Thira 80 sisters Ad Astra (€65,000-90,000) and solar-powered Aloia (€65,000-85,000), the Fountaine Pajot Power 80 ALINA (€70,000-90,000), the Lagoon 78 Crazy Horse with five crew (€50,000-69,000), and the value picks ChristAl MiO Power 67 (€34,000-48,000) and Bali Catspace 55 Libra (€18,900-26,900). All rates weekly base, excluding VAT (at each yacht's certified rate) and APA.",
    yachts: [
      { spec: "Genny - Sunreef 80, 10 guests, 6 crew", weekly: "€56,000-79,000", why: "Five suites, a jet ski in the garage, and six crew serving ten guests - the flagship ratio of the sailing class.", href: "/yachts/genny" },
      { spec: "Ad Astra - Fountaine Pajot Thira 80, 10 guests, 5 crew", weekly: "€65,000-90,000", why: "The sailing superyacht of the class, chartering year-round with five full suites.", href: "/yachts/ad-astra" },
      { spec: "Aloia - Fountaine Pajot Thira 80, 10 guests, 5 crew", weekly: "€65,000-85,000", why: "Solar-powered silent nights: no generator hum at anchor, a detail light sleepers pay for twice.", href: "/yachts/aloia" },
      { spec: "ALINA - Fountaine Pajot Power 80, 10 guests, 5 crew", weekly: "€70,000-90,000", why: "The power flagship of the class: 5 cabins at motor-yacht pace, with a captain of 15+ years in Greek waters.", href: "/yachts/alina" },
      { spec: "Crazy Horse - Lagoon 78, 10 guests, 5 crew", weekly: "€50,000-69,000", why: "Five crew for ten guests and a chef doing modern Greek creative cuisine with a pastry specialism.", href: "/yachts/crazy-horse" },
      { spec: "ChristAl MiO - Fountaine Pajot Power 67, 10 guests, 4 crew", weekly: "€34,000-48,000", why: "Ten guests at roughly half the flagship rate: the value door into the 5-cabin class, at power-cat pace.", href: "/yachts/christal-mio" },
      { spec: "Libra - Bali Catspace 55, 10 guests, 3 crew", weekly: "€18,900-26,900", why: "Brand new, five cabins on 55 feet, and a chef who offers cooking lessons mid-charter.", href: "/yachts/libra" },
    ],
    faq: [
      { q: "Who does a 5-cabin catamaran suit?", a: "Two families sharing, a three-generation party, or a friends' trip of five couples' worth of privacy. Ten guests across five suites is the layout that keeps everyone on speaking terms by Thursday." },
      { q: "What do these rates include?", a: "The yacht and her crew. On top come APA (typically 25-30% for catamarans) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans. George confirms the all-in figure, including the exact VAT line, in writing before you commit." },
      { q: "Can we take twelve guests on a catamaran?", a: "Yes - the six-cabin Fountaine Pajot Thira 80 ChristAl MiO 80 sleeps the full legal twelve (€70,000-90,000 weekly base). Above twelve, Greek regulations require the right vessel class or a two-yacht flotilla." },
      { q: "Which 5-cabin boat books out first?", a: "The named 80-footers - Genny, Ad Astra, Aloia, ALINA - commit 6 to 12 months ahead for peak July-August weeks. June and September hold availability closer in, at softer rates for the same yacht." },
    ],
    seoTitle: "Best 5-Cabin Catamaran Charter Greece 2026 | Named Fleet & Rates",
    seoDescription: "The best 5-cabin, 10-guest crewed catamarans in Greece with live weekly rates: Sunreef 80, Fountaine Pajot Thira 80 and Power 80, Lagoon 78. From George Yachts, IYBA member.",
  },
];

export function getBestYachtsPageBySlug(slug) {
  return BEST_YACHTS_PAGES.find((p) => p.slug === slug) || null;
}
