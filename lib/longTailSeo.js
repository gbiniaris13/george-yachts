// Long-tail UHNW landing page data (6 specialised pages).
//
// 2026-05-11 — Phase 7 SEO strategy doc execution. Targets very
// specific long-tail UHNW queries that convert at the highest rate:
// "luxury yacht charter greece with private chef", "all-inclusive
// yacht charter greece", etc. Lower volume than head terms, higher
// intent, far less competition.

export const LONG_TAIL_PAGES = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "private-yacht-charter-greece-2026",
    urlPath: "/private-yacht-charter-greece-2026",
    eyebrow: "Private Charters 2026",
    h1: "Private Yacht Charter Greece 2026",
    tagline: "The 2026 charter season in Greek waters. Boats, dates, prices, and what's worth knowing.",
    seoTitle: "Private Yacht Charter Greece 2026 | Full-Year Guide",
    seoDescription: "The complete 2026 guide to private yacht charter in Greek waters. Fleet availability, peak vs shoulder pricing, itinerary planning, and how to book.",
    canonical: "https://georgeyachts.com/private-yacht-charter-greece-2026",
    touristType: ["UHNW charterers", "First-time charterers"],

    whyTitle: "The 2026 season",
    whyBody:
      "The Greek charter season runs **late April to late October**. Within that window, three sub-seasons define availability, pricing, and the kind of week you'll have. " +
      "**Early season (late April to mid-June)** is the quietest and the most sought-after by clients in the know. Water is warming (20 to 23°C by mid-June). Wind is gentle. Anchorages are nearly empty. Charter rates run 25 to 35% below August peak. Most boats are fresh from winter refit, fully serviced, and crewed for the season. " +
      "**Peak season (mid-June to early September)** is when the Cyclades fill in. Mykonos, Santorini, Paros, and Hydra are busy. The Meltemi blows steadily 15 to 25 knots through July and August. Charter rates are at their annual peak. Booking lead time for the most desirable yachts is **9 to 12 months**. " +
      "**Late season (mid-September to late October)** mirrors early season: warm water, quiet anchorages, mild weather, and the most beautiful golden-hour light of the year. Charter rates drop 30 to 40% from August peak. For repeat charterers, this is the favoured window. " +
      "**For 2026 specifically**: the fleet has grown by 11 vessels across the IYBA member network since 2025, with more 30-to-40 metre motor yachts available than in any previous year. Catamaran demand continues to outpace supply for July-August; book early. Greek charter VAT remains at 12% for charters that cross to international waters and 24% for fully-Greek itineraries. The TEPAI tax (annual hull-length-based) is the responsibility of the yacht owner, not the charterer.",

    bestFor: [
      "First-time charterers planning 2026 dates",
      "Repeat clients comparing 2026 against past seasons",
      "Family offices planning multi-year charter strategy",
      "Anyone weighing Greek charter against French Riviera or Croatia",
    ],

    yachtFilter: '_type == "yacht" && defined(slug.current)',
    yachtsHeadline: "Available for 2026",
    featuredHeading: "Featured yachts for the 2026 season",

    whenTitle: "When to book for 2026",
    whenBody:
      "**Peak weeks (mid-July to mid-August)**: book by **November 2025** for the best inventory. Top motor yachts and catamarans are gone by January. **Early and late season**: book **3 to 6 months ahead** for most yachts. Some flagship vessels (top 5% of the fleet) book 12 months in advance even for shoulder months. **Last-minute bookings** (under 4 weeks) are possible at 20 to 30% lower rates on remaining inventory, but the choice is whatever's left.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Book the boat before the dates. The best yachts in the fleet have limited weeks; finding boat-first and adjusting dates 1 to 2 weeks gives the most optionality.",
      "Greek charter VAT depends on itinerary. Crossing into international waters (Turkey, Albania, Egypt) for more than 50% of the charter reduces VAT to 12%. Plan with us.",
      "TEPAI is the owner's responsibility. Don't accept any broker who tries to pass TEPAI cost through to the charterer; this is regulated.",
      "Yacht refit history matters. Boats refit in the last 2 to 3 years are generally a safer bet than older builds with older interiors.",
      "Two-week charters are the highest-value-per-day. Crew settles into the rhythm, longer routes become possible, and many yachts offer 5 to 10% off the second week.",
    ],

    faq: [
      {
        q: "When does the 2026 Greek charter season open?",
        a: "Most yachts launch from winter refit by mid-April. Charter availability begins early to mid-May. The bulk of the fleet (95%) is active by late May. Charter weeks before mid-May exist but inventory is limited; ask if your dates are specific."
      },
      {
        q: "How does Greek charter VAT work in 2026?",
        a: "For charters that begin and end in Greek waters with no foreign-port stops: 24% VAT on the base rate. For charters that include time in international waters (Turkey, Albania, Egypt) for more than 50% of the charter duration: reduced 12% VAT. APA is not VAT-bearing. This rule is unchanged from 2025 and is set to remain through 2026."
      },
      {
        q: "What are the 2026 charter rate ranges?",
        a: "50-foot sailing yacht with captain and cook: €18,000 to €28,000/week. 60-foot crewed catamaran: €25,000 to €45,000. 25-metre motor yacht with full crew: €45,000 to €85,000. 35-metre superyacht: €150,000 to €280,000. 50-metre megayacht: €450,000 to €900,000+. Most charters settle in the €40,000 to €120,000 range."
      },
      {
        q: "Should we book through a broker or direct?",
        a: "Through a broker. The Greek charter market has 200+ yachts available, varied owner agreements, and complex contract terms. A broker (we are IYBA members operating under MYBA contracts) protects the charterer in disputes, negotiates terms, and works across the fleet rather than representing a single owner's interests. The broker fee is paid by the owner, not the charterer."
      },
      {
        q: "How do we start the booking process?",
        a: "Send us your preferred dates, guest count, departure port (Athens, Mykonos, Lefkada are most common), budget range, and any specific preferences (yacht type, sailing vs motor, family vs adults-only). We respond within 24 hours with a curated yacht list and detailed pricing. From there, the booking typically takes 2 to 3 weeks from first conversation to signed contract."
      },
    ],

    ctaTitle: "Let's plan your 2026 charter.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "luxury-yacht-charter-greece-with-private-chef",
    urlPath: "/luxury-yacht-charter-greece-with-private-chef",
    eyebrow: "Charter with Private Chef",
    h1: "Luxury Yacht Charter Greece with Private Chef",
    tagline: "Yachts where the chef is the centre of the week. Michelin-trained, on board, all yours.",
    seoTitle: "Luxury Yacht Charter Greece with Private Chef",
    seoDescription: "Crewed yacht charter in Greek waters with dedicated private chef. Michelin-trained kitchens, bespoke menus, dietary accommodations. From €60K/week.",
    canonical: "https://georgeyachts.com/luxury-yacht-charter-greece-with-private-chef",
    touristType: ["UHNW gourmands", "Couples", "Families"],

    whyTitle: "Why the chef matters more than the boat",
    whyBody:
      "On a charter, **the chef is the room you spend most time in**. The boat is the platform, the destination is the view, but the chef shapes how the week tastes, smells, and feels. Three meals a day for seven days is twenty-one opportunities. The right chef turns each into something memorable; the wrong chef turns each into one more buffet. " +
      "We distinguish between **dedicated chefs and dual-role chefs**. **Dedicated chefs** are full-time culinary professionals whose only job on the yacht is the galley. They typically come from Michelin-starred restaurants, work at the level of a private estate chef, and produce 3 to 5 course tasting menus on demand. **Dual-role chefs** are crew members who also handle other duties; they cook well but at a different ambition level. Above 30-metre yachts, dedicated chefs are standard. Below 25 metres, dual-role is more common. " +
      "We curate **chef-led yacht weeks** by matching the chef's specialty to the charter brief. A French-trained chef for traditional Mediterranean cuisine. A Japanese-trained chef for the increasing demand for Asian-influenced cuisine on charter. A market-driven chef who plans each day around what's fresh at the dawn fish auction in Piraeus, Mykonos, or Naxos. We also coordinate **guest-chef weeks**: a renowned land-based chef joining the yacht for 2 to 3 nights of the charter for a specific occasion.",

    bestFor: [
      "UHNW charterers for whom dining is the core of the experience",
      "Charters with significant dietary restrictions or allergies",
      "Anniversary or milestone weeks built around memorable meals",
      "Wine-pairing charters with a curated cellar list",
      "Charters with land-based guest chefs joining for specific evenings",
    ],

    yachtFilter: '_type == "yacht" && length match "*m*" && sleeps >= 6',
    yachtsHeadline: "Yachts with dedicated chefs",
    featuredHeading: "Chef-led yacht selections",

    whenTitle: "When the chef matters most",
    whenBody:
      "Every charter week, but particularly **shoulder-season weeks (May, June, September, October)** when the chef has time to plan and source carefully. Peak August weeks are excellent but the chef is operating at speed. **Two-week charters** are the chef's favourite format: they have time to source specific provisions, build menus that develop across days, and adapt to guest preferences as the week unfolds.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Send the chef your dietary brief 4 weeks before the charter. Allergies, preferences, dislikes, alcohol preferences. The chef will plan around it rather than guess.",
      "Brief on a specific 'best meal ever' from a previous restaurant or trip. The chef will work to match or exceed it on the right night.",
      "Wine: most yachts have a sommelier-curated cellar. Ask for the list ahead and request specific bottles if you have favourites. We coordinate special-order wines (€200+ per bottle) on request.",
      "Mid-charter market visits with the chef are a guest favourite. The chef takes 2 to 3 guests to the local fish market or vegetable stall at dawn; lunch that day is what they bought.",
      "Guest chefs joining the yacht for 1 to 3 nights is possible and lovely. Book 12 weeks ahead minimum. We coordinate with land-based restaurants.",
    ],

    faq: [
      {
        q: "What's the standard for chef quality on Greek charter yachts?",
        a: "On yachts above 30 metres, chefs typically come from Michelin-starred restaurants (one or two star) or fine-dining establishments in major European cities. On 25 to 30 metre yachts, chefs come from quality restaurants but rarely Michelin-starred. Below 25 metres, dual-role chefs (also serving or cabin duties) are the norm. We can match by ambition level."
      },
      {
        q: "Can the chef accommodate vegetarian, vegan, kosher, halal diets?",
        a: "Yes for all. Brief us 4 weeks before charter. Vegan and kosher require the most lead time (some ingredients and preparation methods). Multiple dietary regimes in one charter (one vegan guest, two omnivore, one gluten-free) are routine for experienced chefs."
      },
      {
        q: "How are special-occasion meals handled?",
        a: "Brief the chef at least 2 weeks ahead on any meal that should be special (birthday, anniversary, proposal, surprise). The chef will plan it, source ingredients separately, and coordinate with the captain and hostess on staging. The crew is excellent at this; trust them."
      },
      {
        q: "Can we have a wine pairing menu?",
        a: "Yes. The chef and sommelier work together. Brief the brokerage at booking if wine pairings matter; we'll match a yacht with appropriate cellar and sommelier presence. Pairing menus typically cost €80 to €200 per person per night beyond the base APA, depending on wines selected."
      },
      {
        q: "What if we want a guest chef from a Greek restaurant?",
        a: "Possible. We coordinate with land-based Greek chefs (Funky Gourmet, Hytra, the Mykonos and Santorini fine-dining scene). The chef joins the yacht for 2 to 3 nights; the on-board chef typically handles other meals. Cost: €3,000 to €10,000 for the guest chef beyond their travel expenses."
      },
    ],

    ctaTitle: "Plan a chef-led yacht week.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?feature=chef",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "all-inclusive-yacht-charter-greece",
    urlPath: "/all-inclusive-yacht-charter-greece",
    eyebrow: "All-Inclusive Charters",
    h1: "All-Inclusive Yacht Charter Greece",
    tagline: "One price covers the yacht, the crew, the food, the fuel, the drinks. Decided on at booking.",
    seoTitle: "All-Inclusive Yacht Charter Greece 2026",
    seoDescription: "All-inclusive yacht charter in Greek waters. Fixed-price weeks covering yacht, crew, food, fuel, and drinks. Predictable budget, no APA surprises. From €30K.",
    canonical: "https://georgeyachts.com/all-inclusive-yacht-charter-greece",
    touristType: ["First-time charterers", "Corporate", "Group charterers"],

    whyTitle: "Why all-inclusive",
    whyBody:
      "Standard yacht charters in Greek waters use the **MYBA contract**: base rate covers the yacht and crew, APA (Advance Provisioning Allowance) is paid up front and covers fuel, food, drinks, and dockage on a running-cost basis. APA is typically 25 to 30% of base rate, but it can run higher on heavy-itinerary weeks or lower on light ones. The remainder is refunded; sometimes APA runs short and the charterer tops it up. " +
      "**All-inclusive contracts work differently.** A single fixed price covers everything (yacht, crew, food, fuel, drinks, dockage, gratuity in some versions). The price is decided at booking and does not move regardless of how the week runs. The yacht owner takes the risk on fuel and provisioning rather than the charterer. " +
      "All-inclusive contracts exist in two flavours in Greek waters. **Fully-inclusive** weeks where literally everything is bundled including end-of-week gratuity. **Mostly-inclusive** where the price includes APA but tip is still paid separately at the end. The latter is more common; ask which you're booking. " +
      "We recommend all-inclusive for **first-time charterers** who want predictable budgeting, **corporate charters** where the accounting demands a single line item, and **group charters** where splitting variable APA among guests creates friction. We recommend standard MYBA APA contracts for repeat clients comfortable with the format, who often find APA charters give them more service flexibility.",

    bestFor: [
      "First-time charterers wanting predictable total cost",
      "Corporate off-sites with single-line-item accounting requirements",
      "Group charters where APA splitting across guests is awkward",
      "Charterers nervous about APA budget overruns on heavy itineraries",
      "International clients who prefer not to manage multiple cash flows",
    ],

    yachtFilter: '_type == "yacht" && defined(slug.current)',
    yachtsHeadline: "Yachts offering all-inclusive contracts",
    featuredHeading: "All-inclusive yacht selections",

    whenTitle: "When all-inclusive is the right choice",
    whenBody:
      "All-inclusive contracts are available across the season but vary in availability. **Peak weeks (mid-July to mid-August)** see fewer all-inclusive options because most owners prefer the variable APA structure during high-cost weeks. **Shoulder weeks** offer more all-inclusive flexibility. Multi-week charters often qualify for all-inclusive at a premium worth paying for the predictability.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "All-inclusive premiums vary. Some yachts charge 8 to 15% above standard MYBA pricing for the all-inclusive option. Others charge no premium and price the APA conservatively. Ask both prices before deciding.",
      "All-inclusive doesn't always include premium spirits. Standard wine and house spirits, yes; specific high-end Champagnes or single-malt scotches, no, those are typically extra.",
      "Gratuity is usually NOT in all-inclusive packages, even when called 'fully-inclusive'. Tip in cash at the end, 10 to 18% of the base rate.",
      "Greek VAT is also typically NOT in all-inclusive packages. Check the contract; 12 to 24% VAT is added on top.",
      "All-inclusive packages are cleaner for accounting but slightly less flexible on service. APA contracts give more room to make in-charter requests; all-inclusive locks the menu and provisioning before boarding.",
    ],

    faq: [
      {
        q: "What's typically included in an 'all-inclusive' yacht charter?",
        a: "The yacht, the crew, fuel, food, standard wine and spirits, dockage, mooring fees, and ordinary running costs. Typically NOT included: premium spirits and Champagne, special-order wines, crew gratuity, Greek charter VAT, scuba diving courses with external instructors, and any helicopter or off-yacht transport."
      },
      {
        q: "Is all-inclusive cheaper or more expensive than APA?",
        a: "On most weeks, all-inclusive is 5 to 12% more expensive than the equivalent APA charter would settle at, but predictable. If your itinerary runs lighter than budgeted, APA returns the unused balance; all-inclusive does not. Charterers comfortable with budget variance often save on APA. First-time charterers usually prefer all-inclusive predictability."
      },
      {
        q: "Can we customise the menu on an all-inclusive charter?",
        a: "Yes, within the pre-set provisioning. The chef will accommodate dietary preferences and create the planned menu around your taste. Specific ingredients beyond the provisioning (special-order wines, premium proteins, unusual ingredients) may add cost. Brief us 4 weeks before."
      },
      {
        q: "How does drinks budget work in all-inclusive?",
        a: "Standard table wines, beers, ordinary spirits, soft drinks: included. Premium wines (above €40/bottle retail), Champagne, vintage spirits, fine whiskeys: often excluded or added at cost. Specific wine or Champagne requests should be discussed with the broker at booking."
      },
      {
        q: "Is the gratuity included?",
        a: "Usually not, even on packages called 'fully-inclusive'. Crew gratuity convention is 10 to 18% of the base rate, paid in cash at the end of the charter. Always ask explicitly whether gratuity is included; the answer is almost always no."
      },
    ],

    ctaTitle: "Plan an all-inclusive yacht week.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?contract=all-inclusive",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "luxury-yacht-charter-greece-tender-and-toys",
    urlPath: "/luxury-yacht-charter-greece-tender-and-toys",
    eyebrow: "Charter with Tenders & Toys",
    h1: "Yacht Charter Greece with Tender and Toys",
    tagline: "Boats with the toy fleet that turns a charter into an active week. Jet skis, foils, scuba.",
    seoTitle: "Yacht Charter Greece with Tender and Toys 2026",
    seoDescription: "Yacht charter in Greek waters with full toy fleet: tenders, jet skis, e-foils, wakeboards, paddleboards, scuba kits. Active families and groups. From €40K.",
    canonical: "https://georgeyachts.com/luxury-yacht-charter-greece-tender-and-toys",
    touristType: ["Active families", "Watersports enthusiasts"],

    whyTitle: "Why the toy fleet matters",
    whyBody:
      "Greek waters are **active waters**. Clear visibility 20 metres down, sheltered bays for jet ski runs, calm Ionian coves for paddleboarding, swell-protected Cycladic anchorages for wakeboarding. The yacht's toy fleet decides how much of this you actually use. " +
      "The standard toy kit on a 30+ metre charter yacht in Greek waters in 2026 includes: **a primary tender** (typically a 6 to 8 metre Williams jet tender for fast guest transport), **a secondary tender** (4 to 5 metre RIB for crew use and short hops), **2 to 4 jet skis** (Sea-Doo or Yamaha, typically 300hp), **paddleboards** (3 to 6 boards depending on yacht), **kayaks** (1 to 2 tandems), **wakeboards and water-ski sets**, **a slide or banana inflatable**, and on better-equipped yachts, **e-foils** (Lift, Fliteboard, Awake), **a Seabob or scuba scooter**, and **a full scuba kit** with on-board compressor. " +
      "Above 35 metres, the toy fleet often includes **a small submarine** (typically 2-person, certified to 100m+), **a beach club platform** (extending swim platform for water-level dining and entry), and **specialised craft** (Hobie sailing dinghy, racing tender, etc.). Below 25 metres, toys are limited by storage and crew capacity; expect a primary tender, paddleboards, and possibly a single jet ski.",

    bestFor: [
      "Active families with teenagers wanting watersports",
      "Friend groups with experienced watersports participants",
      "Diving-focused charters with PADI-certified crew",
      "Multi-generational charters where toys keep youngest engaged",
      "Photography and lifestyle content creators",
    ],

    yachtFilter: '_type == "yacht" && length match "*m*" && (length match "3*m*" || length match "4*m*" || length match "5*m*" || length match "6*m*")',
    yachtsHeadline: "Yachts with full toy fleets",
    featuredHeading: "Activity-ready yacht selections",

    whenTitle: "When toy use matters most",
    whenBody:
      "**June through early September** for full toy use: warm water, sustained activity hours, all toys safe to deploy. **May and October** for cooler-water toys (jet ski, e-foil, scuba with wetsuit) but swimming is at the edge of comfortable for most guests. **Mid-July to mid-August** is peak; Mediterranean wind picks up afternoon and toy use is best 09:00 to 14:00 with adventures resuming early evening 17:00-19:00.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "E-foiling is the toy that's transformed charter weeks in 2024-2026. If anyone in your group hasn't tried it, build it into day three with a 30-minute lesson from the crew.",
      "Scuba on charter: the on-board compressor refills tanks but PADI-certified instruction requires either a certified crew member or an off-yacht instructor. Brief at booking; we can arrange.",
      "Jet ski use is restricted in some Cycladic anchorages (Mykonos around the south coast, Santorini caldera) due to local rules. The captain knows; ask before launching.",
      "Tender capacity matters for group activities. Two tenders means the chef can stay at the yacht while half the group is ashore; one tender forces choreography.",
      "Toys lock the morning rhythm: breakfast then active for 3 to 4 hours, lunch on the yacht, quiet afternoon. Build this into your week's expectations.",
    ],

    faq: [
      {
        q: "What toys typically come with a 25-metre motor yacht?",
        a: "Standard toy fleet on a 25 to 30 metre charter yacht: one primary tender (5 to 6m), paddleboards (3 to 4), kayaks (1 to 2), wakeboards or water skis, snorkel kits for all guests. Some 25-metre yachts add 1 to 2 jet skis. E-foils typically appear at 30 metres and up. Scuba on-board on yachts above 30 metres."
      },
      {
        q: "Can I bring my own e-foil or jet ski?",
        a: "Yes, with notice. Personal toys can be brought aboard but must be coordinated 4+ weeks ahead: storage space, charging facilities, insurance coverage. Some yachts have lifting capacity for guest tenders; most do not. Brief us at booking."
      },
      {
        q: "Is the scuba diving included or extra?",
        a: "On most yachts, the kit is included but **dive site fees, mandatory dive guide, and any PADI courses are additional**. Open-water dives with certified guests typically cost €50 to €100 per dive per person. Discovery dives (introductory) and full PADI courses run €300 to €800. Brief us at booking; we coordinate with the captain on dive logistics."
      },
      {
        q: "Are toys safe for children?",
        a: "Most are with appropriate adult supervision. Crew on yachts with a full toy fleet are typically water-safety trained. Children under 14 use jet skis only as passengers behind an adult; paddleboards, kayaks, snorkelling are all guest-managed at any age. The captain has the final say on what runs in what conditions."
      },
      {
        q: "What about wakeboard and water ski courses for beginners?",
        a: "Yes, most yacht crews include a member who's experienced at coaching beginners. A 30-minute introduction in flat water in the morning typically gets adult beginners up on a wakeboard or skis. Brief us at booking if anyone in the group is a complete beginner; we'll match a yacht with strong watersports crew."
      },
    ],

    ctaTitle: "Plan an active yacht charter.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?feature=toys",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "multi-yacht-charter-greece-large-group",
    urlPath: "/multi-yacht-charter-greece-large-group",
    eyebrow: "Multi-Yacht Charters",
    h1: "Multi-Yacht Charter Greece for Large Groups",
    tagline: "Two, three, four yachts cruising together. The way 14 to 30 guests charter in Greek waters.",
    seoTitle: "Multi-Yacht Charter Greece 2026",
    seoDescription: "Multi-yacht charter in Greek waters for groups of 14 to 30 guests. Two-yacht and three-yacht flotillas, coordinated itineraries, single-point booking.",
    canonical: "https://georgeyachts.com/multi-yacht-charter-greece-large-group",
    touristType: ["Large groups", "Multi-family", "Corporate"],

    whyTitle: "Why a flotilla, not a single big yacht",
    whyBody:
      "Greek charter law caps any single commercial yacht at **12 overnight guests** regardless of vessel size. There is no exception. For groups of 14, 18, 24, or 30 guests, the answer is not 'a bigger yacht' - it is **two or three yachts cruising together**. " +
      "A flotilla is **not two yachts that happen to take parallel itineraries**. It is a coordinated charter where the same broker arranges both boats, the captains know each other and have run shared itineraries before, the yachts dock and anchor together where possible (a 'raft up' at anchor lets guests move between boats easily), and the social rhythm of the week is designed across all the vessels rather than within each. " +
      "We run three flotilla patterns. **Two-yacht (14 to 24 guests)**: typically one larger flagship (where the principal and immediate family stay) and one slightly smaller second yacht. **Three-yacht (24 to 36 guests)**: three yachts of similar size, often used for wedding-week scale. **Yacht-plus-tender flotilla**: a single charter yacht plus a chartered RIB or larger tender that runs alongside for day trips and provisioning, suitable when 12 or fewer guests want significantly expanded toy and tender capacity. " +
      "The booking process is **single-point**: one broker (us), one contract structure (with sub-contracts per yacht), one budget conversation, one principal who makes decisions for the group. Splitting decision-making across two captains and 18 guests is how flotillas fall apart; clear principal-designation is how they thrive.",

    bestFor: [
      "Friend groups of 14 to 24 with strong organising principal",
      "Two- or three-family charters with closely-knit families",
      "Wedding weeks where 20+ guests share the celebration on water",
      "Corporate retreats requiring 14 to 30 participants",
      "Multi-generational charters where elder couples prefer separate yacht",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 8',
    yachtsHeadline: "Yachts that flotilla well",
    featuredHeading: "Flotilla-ready yachts for 2026",

    whenTitle: "Multi-yacht booking timeline",
    whenBody:
      "**9 to 12 months ahead** is the minimum lead time for multi-yacht charters in peak summer months. The complexity of locking two or three yacht owners on the same dates, agreeing rates, coordinating crew capacity, and aligning routes takes time. **For wedding weeks specifically, 12 to 18 months ahead** is standard. **Last-minute multi-yacht (under 8 weeks)** is rare but possible at shoulder months for repeat clients.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Decide the principal at booking. One person makes all major decisions for the flotilla. Splitting this across two captains creates conflict.",
      "Raft up at anchor is possible in calm-water anchorages and adds the 'one big yacht' feel for evenings. Outer-bay anchorages with chop don't permit it.",
      "Crew rotation: most captains arrange social interaction across yachts (a chef from yacht A cooking on yacht B for an evening, for example). Brief us at booking on any specific requests.",
      "Costs scale roughly linearly. A two-yacht flotilla of equivalent yacht sizes typically costs 1.9 to 2.0x a single charter (some shared overhead but not much).",
      "Don't underestimate the social planning. Cabin allocations, who stays on which yacht, meal-host rotations: all decisions worth making 4 to 6 weeks ahead, not at boarding.",
    ],

    faq: [
      {
        q: "What's the minimum group size for a multi-yacht charter?",
        a: "Practically, 14 guests is the floor. Below that, a single yacht of the right size accommodates the group within the 12-guest cap. Above 12, a two-yacht charter becomes mandatory. We've coordinated flotillas up to four yachts (32 to 36 guests); above that, the logistics typically push clients toward a single very-large megayacht with shore-based add-on facilities."
      },
      {
        q: "How much does a multi-yacht charter cost?",
        a: "A two-yacht charter pairing a 30-metre flagship (€220,000/week) with a 25-metre second (€90,000/week) costs €310,000/week base plus 30% APA each plus VAT. All-in for 18 guests: €450,000 to €550,000/week. Split across guests: €25,000 to €30,000 per guest for a 7-night charter."
      },
      {
        q: "Do the yachts always travel together?",
        a: "Usually. Anchorages and marinas in Greek waters accommodate two or three yachts in coordination. Some legs (long Aegean crossings) the yachts depart at different times to suit cruising speeds and meet up at destination. The captains coordinate; you don't need to."
      },
      {
        q: "Can guests move between yachts during the week?",
        a: "Yes. When yachts are anchored close (within 5 to 10 minute tender ride), guests move freely. When rafted at anchor (yachts tied alongside), movement is immediate. Cabin allocation is typically fixed for the week but day-trip visits between yachts are normal."
      },
      {
        q: "Who's responsible for the multi-yacht charter contract?",
        a: "A single principal signs all sub-contracts. The broker (us) acts as the central coordinator. The yachts have separate owners and separate captains but the booking, payment, and dispute resolution flows through one office. This is how multi-yacht charters protect the principal from coordination chaos."
      },
    ],

    ctaTitle: "Plan a multi-yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=multi-yacht",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "exclusive-yacht-charter-greece",
    urlPath: "/exclusive-yacht-charter-greece",
    eyebrow: "Exclusive Charters",
    h1: "Exclusive Yacht Charter Greece",
    tagline: "The boats, the routes, and the crews not in the public fleet listings.",
    seoTitle: "Exclusive Yacht Charter Greece 2026",
    seoDescription: "Off-market yacht charter in Greek waters. Yachts not on public listings, owner-direct introductions, ultra-discreet routings. By referral and proven client.",
    canonical: "https://georgeyachts.com/exclusive-yacht-charter-greece",
    touristType: ["UHNW repeat clients", "Discreet charterers"],

    whyTitle: "Why exclusive matters",
    whyBody:
      "Most yachts in Greek waters charter through the **standard MYBA fleet listings**. A few do not. Owners of the most desirable yachts often **don't list publicly**, preferring to charter only through trusted brokers' direct referrals. The boats are still chartering, but the path to them is not Google. " +
      "We hold direct relationships with **owners of 11 such yachts** that operate exclusively through our office in 2026. Some are kept off-listing by owner preference for discretion. Some are kept off-listing because the yacht's primary use is the owner's family, with charter weeks slotted in only when the family is not aboard. Some are kept off-listing because the owner has had bad experiences with public marketplaces and prefers the broker-curated channel. " +
      "**The brief for these yachts is narrow**. The owners want repeat-charterer-level discretion (not first-time charterers from a marketplace). They want the broker to vet the booking conversation. They want the contract to be MYBA-standard but with sometimes-bespoke terms. They prefer the broker handle all logistics rather than dealing with the charterer directly. " +
      "**For charterers, the advantage is access to the top 5% of the fleet at peak weeks** that public listings would have shown as unavailable. The disadvantage is the booking timeline: we typically need a referral conversation, a brief discussion of your charter history, and one to two weeks for the owner to confirm. Worth it for the right charter.",

    bestFor: [
      "Repeat charterers (we've worked with you before)",
      "Charterers introduced by existing clients or trusted brokers",
      "UHNW principals requiring maximum discretion",
      "Last-minute peak-week bookings (public fleet sold out)",
      "Specific yacht requirements outside the standard listing pool",
    ],

    yachtFilter: null, // Off-market — no fleet display
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How exclusive charters work",
    whenBody:
      "**Lead time** for first-time exclusive charter is 4 to 8 weeks (we need to introduce you to the right owner relationship). For known clients, lead time matches standard charter (often less, since the off-market yachts are not subject to public peak-booking rush). Some off-market yachts charter at **20 to 35% above standard market rate** because they're kept above the marketplace; others charter at standard market because the owner simply prefers not to be public. Mix varies.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "The introduction conversation matters. Brief us honestly on charter history (yachts you've taken, destinations, group sizes). Off-market owners want confidence in the fit.",
      "Discretion runs both ways. We don't disclose owner identities to charterers; the relationship is broker-mediated until contract signing.",
      "Off-market doesn't mean 'special charter terms'. The MYBA contract structure is the same; the boat just isn't on public listings.",
      "If you're working with another broker simultaneously, mention it. Off-market yachts will not double-book and the owner expects clarity.",
      "First-time off-market charterers typically book a standard fleet yacht the year before. Building the relationship through one normal charter unlocks off-market the following season.",
    ],

    faq: [
      {
        q: "What does 'exclusive' or 'off-market' actually mean?",
        a: "Yachts that don't appear in the standard MYBA public fleet listings. Charter weeks are arranged directly between broker and owner without public marketing. The yacht exists, charters, and operates under the same regulations as listed yachts; the difference is only in the marketing channel."
      },
      {
        q: "How do I qualify for off-market yacht access?",
        a: "Either a previous charter relationship with our office, an introduction from an existing client, or a clear brief that suits the off-market inventory (specific yacht type at a peak week, discretion requirements, etc.). First conversations typically include 10 to 15 minutes of context-gathering."
      },
      {
        q: "Are off-market yachts more expensive than listed yachts?",
        a: "Not categorically. Some off-market yachts charter at market rate (the owner simply prefers the broker channel). Others charter at 15 to 30% premium because the yacht-and-crew quality justifies it. The premium is for access and discretion, not different boats."
      },
      {
        q: "How is contract negotiation different for off-market?",
        a: "Same MYBA contract structure as standard charter, but owner-direct negotiation on bespoke terms is more common: cancellation flexibility, special itinerary requests, longer charter durations (often 2-3 weeks rather than 1), guest changes mid-charter. The broker handles all negotiations."
      },
      {
        q: "Can I see photos and details of off-market yachts?",
        a: "Yes, after the initial introduction conversation. Specifications, photos, sample menus, crew CVs, and rate sheets are shared once we've established the brief is a fit for the inventory. Some yachts have additional NDA requirements before sharing details; the broker manages this."
      },
    ],

    ctaTitle: "Inquire about an exclusive charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=exclusive",
  },

  // ═════════════════════════════════════════════════════════════
  // 2026-05-11 (Phase 7 Round 4) — 4 more long-tail UHNW pages
  // to complete Tier 6 (10/10). Strategy doc Section 2.1 listed
  // all 10 URLs.
  // ═════════════════════════════════════════════════════════════

  {
    slug: "superyacht-charter-cyclades-2026",
    urlPath: "/superyacht-charter-cyclades-2026",
    eyebrow: "Cyclades Superyacht 2026",
    h1: "Superyacht Charter Cyclades 2026",
    tagline: "Vessels above 30 metres across the Cyclades. The 2026 fleet, the marquee anchorages, the booking lead time you'll need.",
    seoTitle: "Superyacht Charter Cyclades 2026 | 30m+ Yachts",
    seoDescription: "Superyacht charter across the Cyclades in 2026. 30-60 metre vessels with full crew, chef, two tenders. Mykonos, Santorini, Paros, Folegandros. From €280K.",
    canonical: "https://georgeyachts.com/superyacht-charter-cyclades-2026",
    touristType: ["UHNW Cyclades visitors", "Repeat charterers"],

    whyTitle: "The 2026 Cyclades superyacht fleet",
    whyBody:
      "The Cyclades remain the **most-demanded superyacht charter destination in Greek waters**, accounting for roughly 60% of 30+ metre charter weeks across the IYBA member fleet. For 2026 specifically: the available 30-40 metre fleet has grown by 8 vessels vs 2025, with stronger 40-50 metre selection than any prior season. " +
      "**Where the 2026 fleet bases**: roughly half the active Cycladic superyacht inventory bases in Mykonos for high season (June-September) with direct boarding via the chora's marina or anchorage transfer. The remainder bases in Athens (Alimos and Lavrio) and repositions to the Cyclades for charter starts. **Lead time matters**: peak August weeks (Aug 8-22 specifically) book 10-14 months in advance for the marquee 35+ metre yachts. " +
      "**Itinerary highlights** for a 2026 Cycladic superyacht week: Mykonos chora and Rhenia (Days 1-2), Paros Naoussa and Antiparos (Days 3-4), Folegandros cliffs and southern Cyclades (Days 5-6), Santorini caldera (Day 7 if staying in the loop, or one-way disembarkation if heading to airport). Above 40 metres, the loop extends to Crete or Dodecanese in 10-14 day charters.",

    bestFor: [
      "UHNW principals booking 2026 Cycladic weeks now",
      "Repeat clients moving up from 25-30m to superyacht class",
      "Multi-generational families needing 30+ metre cabin separation",
      "Hosted charters for celebrity or sovereign principals",
      "10-14 day charters extending the Cycladic loop to Crete",
    ],

    yachtFilter: '_type == "yacht" && cruisingRegion match "*Cyclades*" && length match "*m*" && (length match "3*m*" || length match "4*m*" || length match "5*m*" || length match "6*m*")',
    yachtsHeadline: "2026 Cyclades superyachts",
    featuredHeading: "Available 30+ metre yachts for 2026",

    whenTitle: "2026 booking timeline",
    whenBody: "**Peak August (Aug 8-22)**: book by October 2025 for marquee inventory. By February 2026, peak Aug weeks for 40+ metre yachts are typically gone. **June, early July, September**: book by March 2026 for ideal selection. **Late May, October**: shoulder availability 4-6 months out.",

    insiderTips: [
      "Mykonos marina has limited 30+ metre slots. Most Cycladic superyachts anchor at Ornos or Mykonos Bay overnight.",
      "Two tenders is the threshold. Above 35 metres: standard. Below 30: rare. Affects what you can do on a given day.",
      "Crew gratuity convention 12-18% of base rate. For a €350K base-rate week, plan €45-€65K cash gratuity.",
      "Helicopter touch-and-go feasible above 40m. Mykonos airport is 5 minutes by helicopter to most anchorages.",
      "For 14-day charters: Cycladic loop + Dodecanese (Patmos, Symi, Rhodes) is the most-requested premium itinerary.",
    ],

    faq: [
      { q: "How much does a 2026 Cyclades superyacht charter cost?", a: "30-metre weeks start €280K base. 40-metre: €450-€800K. 50-metre megayacht: €900K-€1.4M. Plus 30-35% APA and 12-24% Greek VAT." },
      { q: "What's the booking deadline for peak August?", a: "10-14 months ahead for marquee 35+ metre yachts (most are gone by February of the charter year). 4-6 months for shoulder months." },
      { q: "Can we charter for 10-14 days?", a: "Yes. Multi-week charters often discount 5-10% on the second week. The Cycladic loop extends to Crete or Dodecanese for variety in extended itineraries." },
      { q: "Which 2026 Cycladic superyachts are most-requested?", a: "Recent (2022-2024) builds in the 35-45 metre range with helicopter capability sell through fastest. We can provide a curated 2026 list on request." },
      { q: "Can we get one-way charter (Mykonos to Santorini)?", a: "Yes. One-way fee €2-€5K depending on yacht size and route. Common request for honeymoon-yacht-week clients ending at Santorini for the airport." },
    ],

    ctaTitle: "Charter a Cyclades superyacht for 2026.",
    ctaPrimary: "Find a superyacht",
    ctaPrimaryHref: "/yacht-finder?type=superyacht&region=Cyclades&year=2026",
  },

  {
    slug: "crewed-yacht-charter-greek-islands-2026",
    urlPath: "/crewed-yacht-charter-greek-islands-2026",
    eyebrow: "Crewed Greek Islands 2026",
    h1: "Crewed Yacht Charter Greek Islands 2026",
    tagline: "Every yacht in our 2026 Greek charter fleet comes with crew. Captain, chef, hostess, deckhand. You bring suitcases.",
    seoTitle: "Crewed Yacht Charter Greek Islands 2026",
    seoDescription: "Crewed yacht charter across Greek islands in 2026. Captain, chef, hostess on every vessel. Cyclades, Ionian, Saronic, Sporades, Dodecanese. From €18K weekly.",
    canonical: "https://georgeyachts.com/crewed-yacht-charter-greek-islands-2026",
    touristType: ["First-time charterers", "UHNW families"],

    whyTitle: "Why every 2026 charter we represent is crewed",
    whyBody:
      "**George Yachts only handles crewed charters**. We don't broker bareboat. The reason is simple: a crewed week is a categorically different product, and we want our clients to experience the full luxury yacht-charter format. Bareboat charters serve sailing-experienced clients on a budget; they have their place but they're a different business. " +
      "**Crewed yacht charter** means a full crew lives on the boat for your week: minimum captain plus chef, scaling up to 12+ crew on large superyachts. The captain handles all navigation, sailing, anchoring, and itinerary management. The chef provides 3 meals daily, restaurant-tier on yachts above 25 metres. The hostess/chief stewardess runs cabin service, social rhythm, and guest interactions. " +
      "**For 2026**, our crewed fleet spans 200+ yachts across all Greek-water regions. From **50-foot sailing yachts** (€18-28K/week with captain-and-cook crew) to **50-metre megayachts** (€900K-€1.4M/week with 12 crew). The unifying standard: MYBA contracts, IYBA broker representation, full insurance and regulatory compliance, and our personal vetting of every captain and crew we place clients with.",

    bestFor: [
      "First-time charterers wanting full-service yacht week",
      "UHNW families across all yacht size categories",
      "Charters where guest convenience is the priority (vs hands-on sailing)",
      "Year-round 2026 booking across all Greek-island regions",
      "Charterers comparing crewed vs bareboat (we represent crewed only)",
    ],

    yachtFilter: '_type == "yacht" && defined(slug.current)',
    yachtsHeadline: "Our 2026 crewed fleet",
    featuredHeading: "Featured crewed yachts for 2026",

    whenTitle: "When to book your 2026 crewed charter",
    whenBody: "Peak August weeks book 9-12 months ahead for marquee yachts. Shoulder months (May-June, September-October) book 4-6 months out. Last-minute availability (under 4 weeks) exists in 2026 at 20-30% lower rates with limited yacht choice.",

    insiderTips: [
      "Crew is included in base rate. Gratuity (10-18% convention) is paid separately at end in cash.",
      "Crews are vetted by us as the broker - we have working relationships with each captain in the fleet.",
      "Chef-led galleys deliver restaurant-tier meals on yachts above 25 metres. Below that, the captain or hostess often doubles up.",
      "First-time charterers benefit from a captain who's done 10+ charter seasons. Brief us at booking; we match.",
      "Multi-week charters keep the same crew throughout. Crew rotation only between separate charters, not during.",
    ],

    faq: [
      { q: "What's included in a crewed yacht charter?", a: "Base rate covers the yacht, crew, insurance, and routine maintenance. APA (paid separately, 25-30% of base rate) covers fuel, food, drinks, dockage, and other running costs. Crew gratuity (10-18% at end) is separate." },
      { q: "What does the crew do?", a: "Captain handles navigation, anchoring, sailing or motor-yacht operation, and itinerary recommendations. Chef provides 3 meals daily. Hostess/chief stewardess runs cabin service, table service, social rhythm. Deckhands and engineers (on larger yachts) handle technical operations." },
      { q: "Do I tip the crew?", a: "Yes. Convention is 10-18% of base rate, paid in cash to the captain on the final day. The captain distributes to crew. For a €60K base rate week: typical tip is €8-€11K." },
      { q: "Can guests participate in sailing?", a: "Yes, on sailing yachts. The crew encourages guests who want to learn (winch handling, helm time, basics of trim). Brief at day-one captain conversation." },
      { q: "How does APA work?", a: "Advance Provisioning Allowance. Paid up front at typically 25-30% of base rate. Runs as a transparent account during the charter for fuel/food/drinks/dockage. Unused balance refunded at end; if charter runs heavier than budgeted, balance is topped up." },
    ],

    ctaTitle: "Charter crewed in Greek waters 2026.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  {
    slug: "billionaire-yacht-charter-greece",
    urlPath: "/billionaire-yacht-charter-greece",
    eyebrow: "Ultra-discreet Charter",
    h1: "Billionaire Yacht Charter Greece",
    tagline: "The off-market 50+ metre yachts, the security arrangements, the discretion required. Charter at the top of the Greek fleet.",
    seoTitle: "Billionaire Yacht Charter Greece 2026 | Ultra-Discreet",
    seoDescription: "Ultra-discreet yacht charter in Greek waters for principals at the highest wealth tier. 50+ metre megayachts, security coordination, off-market access.",
    canonical: "https://georgeyachts.com/billionaire-yacht-charter-greece",
    touristType: ["UHNW principals", "Heads of state", "Family offices"],

    whyTitle: "Charter at the top of the Greek fleet",
    whyBody:
      "The Greek charter market serves the **entire range of UHNW clients**, from couples on a €60K honeymoon week to principals chartering 80-metre megayachts at €2.5M+/week. The latter category has specific requirements that aren't met by standard charter intermediation: off-market inventory, security coordination, helicopter operations, multi-yacht arrangements, sovereign-guest protocols. " +
      "**Our top-tier service** at this level: direct relationships with the owners of 6 off-market megayachts that charter in Greek waters but aren't on public IYBA listings. Pre-vetting of charterers (we don't bring first-time relationships to these owners). NDAs at owner, broker, and crew levels. Coordinated security (ex-military close-protection officers available as add-on). Helicopter operations to and from the yacht for guest arrivals. Discreet shore-side service at marquee restaurants and venues. " +
      "**Practical reality**: charters at this level book 12-18 months in advance for peak summer. Single-week minimum is the floor; 10-14 night charters are standard. The MYBA contract structure applies with significant bespoke addenda. Communications happen primarily through one principal contact rather than email threads. We've handled this category of charter for over a decade.",

    bestFor: [
      "Principals at the highest wealth tier requiring full discretion",
      "Family offices arranging charters for principal or guests",
      "Sovereign-guest hosted charters with security requirements",
      "Repeat clients moving up from 30-50 metre to 50m+ class",
      "Multi-week charters spanning Greek waters and beyond",
    ],

    yachtFilter: null, // Off-market — no public fleet display
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How we work at this level",
    whenBody: "Lead time **12-18 months** for peak summer dates. First conversation typically by introduction or referral. We don't list specific yachts publicly at this tier; the introduction conversation includes a brief on the principal's charter history and preferences, after which we share a curated short-list. From signed agreement to charter start: typically 2-3 months minimum for full setup.",

    insiderTitle: "How we serve at this tier",
    insiderTips: [
      "Introductions happen by referral or via our existing repeat-client network. First conversations are by phone or in-person, not email.",
      "Owner-direct yachts at the megayacht tier require pre-vetting of charterers. We handle the broker-side; the owner agrees before contracts circulate.",
      "Security coordination is handled by separate specialists we partner with. €8-€15K/week per officer for ex-military close protection.",
      "Crew NDAs are standard; additional principal-specific NDAs available on request.",
      "Shore-side service at marquee restaurants and venues is pre-arranged at the captain level. Reservations don't happen in the principal's name.",
    ],

    faq: [
      { q: "How do we begin a conversation?", a: "Phone or in-person, by introduction. We don't take first inquiries via web forms at this tier. If you're new to us, an introduction from an existing repeat client, family office, or partner brokerage opens the conversation. Otherwise the route is your private aviation broker or wealth manager." },
      { q: "What's the typical weekly rate?", a: "50-metre megayacht: €900K-€1.4M base. 60-70 metre: €1.4M-€2.5M+. Plus APA (30-35%) and Greek VAT (12-24%)." },
      { q: "Is security available?", a: "Yes, through partners. Ex-military close-protection officers typically €8-€15K/week per officer. Coordinated with the captain and broker discreetly." },
      { q: "Helicopter operations?", a: "Yes for yachts above 40 metres with helideck. Touch-and-go landings common. Mykonos airport is 5 minutes by helicopter to most anchorages. We coordinate with helicopter operators." },
      { q: "Discretion at marquee venues?", a: "Yes. Restaurant reservations at the top Mykonos and Santorini addresses can be arranged through the yacht crew without the principal's name appearing in the booking system. Standard at this tier." },
    ],

    ctaTitle: "Begin a conversation.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=top-tier",
  },

  {
    slug: "celebrity-yacht-charter-greece",
    urlPath: "/celebrity-yacht-charter-greece",
    eyebrow: "Celebrity Charter",
    h1: "Celebrity Yacht Charter Greece",
    tagline: "Discreet charters for principals where privacy is non-negotiable. Crew NDAs, anchorage selection, shore-side coordination.",
    seoTitle: "Celebrity Yacht Charter Greece 2026 | Discreet UHNW",
    seoDescription: "Discreet yacht charter in Greek waters for celebrity, entertainment, and high-profile principals. Crew NDAs, paparazzi-aware anchorage selection.",
    canonical: "https://georgeyachts.com/celebrity-yacht-charter-greece",
    touristType: ["Celebrity principals", "Entertainment industry", "Athletes"],

    whyTitle: "Yacht charter for principals where privacy is non-negotiable",
    whyBody:
      "Greek charter has a long history of serving celebrity, entertainment, and athletic principals. Mykonos in August is a focal point for the global UHNW celebrity scene, and the right yacht in the right anchorage is the **only way to be in Mykonos without being in public Mykonos**. " +
      "**What changes for celebrity charters**: anchorage selection avoids tender-traffic from press boats (Rhenia, Antiparos back coast, Folegandros are quieter than Ornos for a famous principal). Crew is vetted specifically for celebrity-experienced track record. NDAs are signed at owner, broker, captain, and full-crew level. Shore-side reservations happen under aliases the captain coordinates. Guest movements ashore are scheduled to avoid public visibility windows. " +
      "**Practical reality**: roughly 8 yachts in our 2026 fleet have celebrity-experienced crews and bookings that prioritise discretion. These yachts often have alternative names or hull designations for paperwork. We work directly with the principal's manager, agent, or security team for booking. No information about specific celebrity charters appears in our public materials, communications, or sales conversations.",

    bestFor: [
      "Entertainment, sports, and political celebrity principals",
      "Charterers requiring paparazzi-aware anchorage selection",
      "Hosted charters with celebrity guests joining mid-week",
      "Multi-yacht arrangements for entourage separation",
      "Repeat celebrity clients moving across years discretely",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How celebrity charters are arranged",
    whenBody: "Bookings happen through the principal's manager, agent, security team, or family office. Lead time 4-12 weeks depending on celebrity calendar and security setup. Specific yacht and crew vetting happens at the booking conversation. Last-minute celebrity bookings happen but require advance crew briefing.",

    insiderTitle: "What we do differently",
    insiderTips: [
      "Anchorage selection avoids known press-boat areas. Rhenia, Antiparos back coast, Folegandros for Cycladic privacy.",
      "Crew is vetted for celebrity-experienced track record before placement.",
      "Shore-side reservations made under aliases coordinated by the captain.",
      "Helicopter arrivals to the yacht skip airport visibility for marquee guests.",
      "Multi-yacht arrangements separate principal entourage from extended group when needed.",
    ],

    faq: [
      { q: "How do you handle privacy?", a: "Owner, broker, captain, and full-crew NDAs as standard. Anchorage selection avoids press-boat areas. Shore-side reservations via aliases. Communications consolidated through one principal contact." },
      { q: "Can paparazzi follow the yacht?", a: "It's happened in the Mediterranean. Greek waters specifically have less paparazzi infrastructure than the Riviera. Captains know the press-boat patterns and route around them. Specific anchorages (Rhenia, Antiparos back coast) are particularly private." },
      { q: "How is shore-side handled?", a: "Restaurant reservations under aliases. Beach club arrivals via tender at off-peak times. Private events arranged through the yacht crew rather than under the principal's name." },
      { q: "What about helicopter operations for marquee guests?", a: "Helicopter touch-and-go to the yacht is possible above 40 metres. Bypasses airport visibility for marquee guest arrivals. We coordinate with helicopter operators." },
      { q: "How do we begin?", a: "Through the principal's manager, agent, security team, or family office. Direct outreach is fine but we'll loop in the principal's representation early in the conversation." },
    ],

    ctaTitle: "Discuss a private charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=celebrity",
  },
];

export function getLongTailBySlug(slug) {
  return LONG_TAIL_PAGES.find((p) => p.slug === slug) || null;
}
