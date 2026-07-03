// Yacht-type landing page data (8 types).
//
// 2026-05-11 — Phase 7 SEO strategy doc execution. Each entry powers
// a /[type]-charter-greece/ landing page rendered by the shared
// SeoLanding template. Content is researched per-type, not template
// boilerplate. Real Greek-waters context, real fleet matching via
// Sanity GROQ filters on the yacht type field.

export const YACHT_TYPES = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "motor-yacht",
    urlPath: "/motor-yacht-charter-greece",
    eyebrow: "Motor Yacht Charters",
    h1: "Motor Yacht Charter Greece",
    tagline: "Speed, range, and shore-side stability for the most demanding Greek itineraries.",
    seoTitle: "Motor Yacht Charter Greece 2026 | Prices & Weekly Cost",
    seoDescription: "Crewed motor yacht charter in Greece: real weekly prices by size and season. 12 to 50m, full crew, Cyclades to Ionian, rates from €25K. IYBA member.",
    canonical: "https://georgeyachts.com/motor-yacht-charter-greece",
    touristType: ["UHNW families", "Couples", "Yacht charterers"],

    // 2026-06-26 — authored front-loaded answer (was falling back to the
    // generic "{h1}: what should I know?"). Figures align with the all-in rate
    // card (/weekly-yacht-charter-rates-greece). AI Overviews cite the top of
    // the page, so the bottom-line cost answer goes first.
    quickAnswer: {
      question: "How much does a motor yacht charter in Greece cost per week?",
      answer:
        "A crewed motor yacht charter in Greece runs roughly €45,000 to €235,000 all-in per week, depending on size and season. A 30m motor yacht is about €118,000 all-in for a peak-season week, or around €19,600 per guest at six. The all-in figure covers the yacht and full crew, APA provisioning, 13% VAT and a suggested gratuity.",
    },

    whyTitle: "Why a motor yacht in Greek waters",
    whyBody:
      "A **motor yacht** is the right answer when distance, speed, and stability matter more than the romance of a sail. Greek waters reward the type. **The Cyclades sit 30 to 80 nautical miles apart** with the Meltemi pressing south from late June through August, and a 20-knot cruise lets you arrive ahead of weather rather than fight it. The Dodecanese stretch even further. A motor yacht turns what would be a punishing sailing leg into a comfortable afternoon transit, leaving the morning for breakfast at anchor and the evening for dinner in a different harbour. " +
      "Beyond pace, modern motor yachts give you the **floor area, generator capacity, and shore-power flexibility** to charter at full standard, all season. Air-conditioned interiors are not a luxury in August in the Aegean, they are the difference between sleeping and not. Stabilisers, where fitted, neutralise the rolling that even calm Greek anchorages can produce when an outside swell wraps in. " +
      "The fleet we represent spans **classic 50-footers built for couples** to **50-metre flagships** with separate crew zones, dual tenders, and master-suite forward layouts that families with grown children actually use. We match by passage style first, group size second, build quality third. Anything less and the week reads as a compromise.",

    prosAndCons: {
      pros: [
        "Beat the Meltemi: arrive ahead of weather, not behind it.",
        "Stabilisers neutralise anchor-side roll on outside swell.",
        "Full air-conditioning at anchor without generator noise.",
        "Tender garages free deck space for sun pads and dining.",
        "Two daily destinations are realistic on long passage days.",
      ],
      cons: [
        "Fuel adds 8 to 14% to APA in peak season.",
        "Larger draft excludes some shallow anchorages on Paxos and Antiparos.",
        "Mooring fees on Mykonos and Hydra are higher than sailing tonnage.",
      ],
    },
    bestFor: [
      "Families with grown children booking a private cabin each",
      "Itineraries crossing more than two island groups in one week",
      "Charters in July or August when Meltemi limits sailing comfort",
      "Repeat clients used to the comfort floor of recent-build interiors",
      "Multi-generational groups where mobility around the boat matters",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "Motor*" || subtitle match "*motor yacht*" || subtitle match "*Couach*" || subtitle match "*Pershing*" || subtitle match "*Sunseeker*" || subtitle match "*Princess*" || subtitle match "*Azimut*" || subtitle match "*Ferretti*" || subtitle match "*Mangusta*" || subtitle match "*Riva*" || builder match "*Couach*" || builder match "*Pershing*" || builder match "*Sunseeker*" || builder match "*Princess*" || builder match "*Azimut*" || builder match "*Ferretti*" || builder match "*Mangusta*" || builder match "*Riva*" || builder match "*Custom Line*" || builder match "*Benetti*" || builder match "*Heesen*" || builder match "*CRN*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Motor yachts ready for the 2026 season",

    whenTitle: "When to book a motor yacht",
    whenBody:
      "Motor yachts hold their value of comfort year-round, but **July and August are when they save the week**. The Meltemi peaks 25 to 35 knots, often for three days at a stretch. A sailing itinerary forced to wait out wind in a single port loses the variety that made the charter worth the price. A motor yacht keeps moving. **September and October** are the quietest months of the season, with warm water still and the long-shore winds softer, ideal for slower-paced family weeks and shoulder-rate pricing.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Ask whether the yacht has zero-speed stabilisers. The standard fin-only systems work at 8 knots and up, not at anchor.",
      "Two tenders is worth paying for when you have eight guests. One drops people on the beach while the other runs to the village for the lunch reservation.",
      "Fuel pricing is rarely fixed before booking. Build a 10% APA cushion if the itinerary includes long transits to the Sporades or Dodecanese.",
      "Heesen, Benetti, and Custom Line layouts above 35 metres usually carry a master forward with private terrace. Worth asking before viewing.",
      "Don't book on length alone. A well-laid 40-metre often gives more usable sun-deck space than a poorly-laid 45.",
    ],

    faq: [
      {
        q: "How much does a motor yacht charter in Greece cost?",
        a: "Weekly rates start around €25,000 for a 50-foot motor yacht with a couple as crew, and run to €600,000+ for a 50-metre vessel with seven crew, two tenders, and a full toy kit. Most of our motor yacht charter weeks settle between €70,000 and €180,000, before APA (typically 30 to 35% of the base rate) and 13% Greek charter VAT (24% for short charters under 48 hours)."
      },
      {
        q: "What's the difference between APA and the base rate?",
        a: "Base rate covers the yacht and crew. APA (Advance Provisioning Allowance) is paid up front and pays for fuel, food, drinks, dockage, and other running costs during the charter. APA is run as a transparent account and any unspent balance is returned at the end of the week. For motor yachts, APA is higher than sailing because fuel is the largest variable."
      },
      {
        q: "Can a motor yacht reach the Sporades from Athens in one charter week?",
        a: "Yes. A 20-knot motor yacht covers Athens to Skiathos in about 8 hours. We typically build a 7-day route as Athens to Cyclades to Sporades or vice versa, with two full days at anchor in each group. Tighter than that and the charter feels rushed; longer and you lose the variety that makes the loop worth doing."
      },
      {
        q: "Do motor yachts come with a chef?",
        a: "Most motor yachts from 30 metres up carry a dedicated chef. Below 30 metres, the captain's partner or chief stewardess often handles galley duties to a high standard. The 2026 fleet shows the chef position separately on every motor yacht listing; ask if you don't see it called out."
      },
      {
        q: "Is a motor yacht the right choice for our honeymoon?",
        a: "If your honeymoon vision is morning yoga on deck and quiet anchorages where you barely hear the engine, a sailing catamaran will give a softer rhythm. If it's room service in a master suite with a sea-view shower, a 30-metre motor yacht with a separate crew zone delivers privacy that a sailing boat cannot match. Both work for the right couple."
      },
    ],

    ctaTitle: "Find your motor yacht for 2026.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?type=motor",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-yacht",
    urlPath: "/sailing-yacht-charter-greece",
    eyebrow: "Sailing Yacht Charters",
    h1: "Sailing Yacht Charter Greece",
    tagline: "The original way to read the Aegean. Wind under the hull, mountains on the horizon.",
    seoTitle: "Sailing Yacht Charter Greece 2026",
    seoDescription: "Crewed sailing yacht charter in Greece. Monohull sloops and ketches 50-130 ft, captain and chef. Cyclades, Ionian, Saronic. Weekly rates from €18K.",
    quickAnswer: {
      question: "How much does a crewed sailing yacht charter in Greece cost per week?",
      answer:
        "A crewed sailing yacht charter in Greece starts around €18,000 base, roughly €29,000 all-in per week once APA provisioning, 13% VAT and a suggested gratuity are added, and rises with length and luxury level. Sailing yachts are the most economical crewed option and the classic way to experience the Aegean under canvas.",
    },
    canonical: "https://georgeyachts.com/sailing-yacht-charter-greece",
    touristType: ["Sailing enthusiasts", "Couples", "Families"],

    whyTitle: "Why a sailing yacht in Greece",
    whyBody:
      "Greek waters are **the most generous sailing ground in the Mediterranean**. The Meltemi delivers a reliable 15 to 25 knot beam reach across the Cyclades from June through August. The Ionian gives gentler 8 to 14 knot afternoon breezes for those who prefer sail-handling without weather. Saronic itineraries from Athens cover three islands a day at a relaxed 6 knots. " +
      "A **crewed sailing yacht** is the right answer when the journey matters as much as the destination. There is nothing in modern luxury travel quite like cutting the engine off Antiparos at 17:00, hoisting full main, and reaching across to Sifnos under sail alone with dinner cooking below. The rhythm of a sailing week pulls guests off their phones inside two days. " +
      "The sailing fleet we represent ranges from **classic 50-foot sloops** with captain-and-cook crews for couples to **performance ketches over 30 metres** with a chef, chief stewardess, and dedicated deckhand. We have purpose-built charter platforms (Oyster, Hallberg-Rassy, CNB) and elegant racing pedigrees retired into charter (Frers, Hoek, Nautor's Swan). The right match depends on whether you want to drive a winch or have wine poured for you.",

    prosAndCons: {
      pros: [
        "Heeling reads as romance, not discomfort, at 12 to 18 knots true.",
        "Anchor-side roll is far softer than a motor yacht of equal length.",
        "Half the fuel cost on the same itinerary as a motor yacht.",
        "Sailing the Meltemi is the experience guests remember years later.",
        "Better access to small bays that motor yachts struggle to enter.",
      ],
      cons: [
        "Long passages take longer. Two-destination days require an early start.",
        "Floor space is roughly half what an equal-length motor yacht offers.",
        "Heeling under sail is uncomfortable for guests with mobility issues.",
        "Mast height limits some bridge-clearance routes.",
      ],
    },
    bestFor: [
      "Couples on a honeymoon who want rhythm over speed",
      "Friend groups where two or three guests will actually trim the sails",
      "Families introducing children to sailing in safe coastal water",
      "Ionian itineraries where day-sailing 6 to 10 hours suits the calm wind",
      "Repeat clients who have already done two motor yacht weeks",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "Sailing*" || subtitle match "*sailing yacht*" || subtitle match "*sailboat*" || subtitle match "*sloop*" || subtitle match "*ketch*" || subtitle match "*S/Y*" || builder match "*Oyster*" || builder match "*Hallberg-Rassy*" || builder match "*CNB*" || builder match "*Swan*" || builder match "*Hanse*" || builder match "*Beneteau*" || builder match "*Jeanneau*" || builder match "*Frers*" || builder match "*Bavaria*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Sailing yachts for the 2026 season",

    whenTitle: "When to book a sailing yacht",
    whenBody:
      "**May to mid-June** is the sweetest sailing window in Greek waters. The Meltemi has not yet set in, daily breezes are 10 to 18 knots and reliable from mid-morning, water is warm enough for swimming, and the anchorages still feel quiet. **Mid-July to August** suits experienced charterers who want serious wind for spinnaker runs and tight downwind boatwork; we recommend stronger crew on these weeks. **September** mirrors May, often slightly warmer, and is the favourite shoulder month for repeat clients.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Ask whether the yacht has electric winches. On boats over 18 metres, hand-cranking a 45-foot genoa loses its romance by day three.",
      "If you've never sailed, a one-hour briefing on day one with the captain answers more questions than a week of marketing brochures.",
      "Children under eight do better on catamarans. Heel angles disorient them on monohulls.",
      "Reaching across the central Aegean in 22 knots true is the postcard the brochures don't show. Plan one such day if the weather pattern allows.",
      "Sailing crews are often the most musical. If the captain hosts dinner on deck with a guitar, accept the invitation.",
    ],

    faq: [
      {
        q: "How much does a sailing yacht charter cost in Greece?",
        a: "Weekly rates start around €18,000 for a 50-foot sailing yacht with captain and cook, and run to €180,000+ for a 100-foot performance ketch with five crew. Most of our sailing charter weeks settle between €30,000 and €70,000, before APA (typically 25 to 30% of the base rate, lower than motor yachts due to lower fuel use) and Greek charter VAT."
      },
      {
        q: "Do I need sailing experience to charter a crewed sailing yacht?",
        a: "No. The crew handle every aspect of sail trim, navigation, and yacht operation. Guests are welcome to participate (steering, trimming, raising the main is a guest favourite) but no experience is required. We do recommend choosing a sailing yacht over a motor only if you appreciate that some days will have longer passages."
      },
      {
        q: "Will the yacht actually sail or just motor between islands?",
        a: "If you brief the captain on your preference for sailing, they will plan around it. The honest answer is that 60 to 70% of a typical Greek sailing week is under sail and the rest is motor-sailing or motoring (calm dawn departures, marina arrivals, weather avoidance). Pure-sail weeks exist, but they require flexibility on itinerary."
      },
      {
        q: "What's the difference between a sloop and a ketch?",
        a: "A sloop carries one mast and is the modern standard, easier to sail, better upwind. A ketch carries two masts (the second smaller and aft) and divides sail area into more manageable pieces, often preferred by older crew on long passages. For charter purposes the practical difference is small; ketches feel more traditional, sloops more contemporary."
      },
      {
        q: "Are there sailing catamarans available?",
        a: "Yes. Catamarans are technically sailing yachts but charter very differently. See our crewed catamaran page for that breed: more floor area, no heel, but slower upwind. Different week, different feel."
      },
    ],

    ctaTitle: "Find your sailing yacht for 2026.",
    ctaPrimary: "Find a sailing yacht",
    ctaPrimaryHref: "/yacht-finder?type=sailing",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "catamaran",
    urlPath: "/catamaran-charter-greece",
    eyebrow: "Catamaran Charters",
    h1: "Catamaran Charter Greece",
    tagline: "All the floor space of a 60-foot motor yacht. None of the roll. Half the fuel.",
    seoTitle: "Catamaran Charter Greece 2026 | Crewed Catamarans",
    seoDescription: "Crewed catamaran charter in Greece, Cyclades to Ionian. Sailing and power catamarans 45 to 80 ft, shallow draft, family favourite. Weekly rates from €15K.",
    quickAnswer: {
      question: "How much is a crewed catamaran charter in Greece per week?",
      answer:
        "A crewed catamaran charter in Greece starts around €15,000 base, about €25,000 all-in per week with APA, 13% VAT and gratuity, scaling up with size. Catamarans offer the most deck space and stability per euro, a shallow draft for beach anchorages, and are the family favourite in Greek waters.",
    },
    canonical: "https://georgeyachts.com/catamaran-charter-greece",
    touristType: ["Families", "Friend groups", "Couples"],

    whyTitle: "Why a catamaran in Greece",
    whyBody:
      "**Catamarans win on living space and stability.** A 50-foot catamaran offers more usable deck area than a 70-foot monohull and almost zero heel under sail. For families with children, friend groups where everyone wants their own corner of the boat, and couples who simply prefer not to chase coffee cups across a tilted saloon, a catamaran is the right yacht. " +
      "The shallow draft (typically 1.2 to 1.5 metres) opens up anchorages that monohulls and motor yachts cannot enter. The pink-sand bay on Elafonisi, the inside of Antiparos, the smaller coves of Paxos and Antipaxos - all comfortable for a catamaran, all complicated for a single-keel yacht of the same length. " +
      "Two flavours exist. **Sailing catamarans** (Lagoon, Bali, Fountaine Pajot, Sunreef) deliver romance and lower fuel cost. **Power catamarans** (Sunreef Power, Aquila, Horizon) trade sails for two diesel engines pushing 18 to 22 knots, giving motor-yacht-pace itineraries without the motor-yacht price. Both share the floor plan that makes the type special in the first place.",

    prosAndCons: {
      pros: [
        "Roughly 40% more deck space than monohull of equal length.",
        "Negligible heel under sail; children and elderly guests stay comfortable.",
        "Shallow draft opens anchorages that monohulls cannot reach.",
        "Twin engines provide redundancy and tight-quarters manoeuvrability.",
        "Lower fuel cost than equivalent motor yachts on the same itinerary.",
      ],
      cons: [
        "Slower upwind under sail than a monohull of equal length.",
        "Marina fees often charged at 1.5x length to account for beam.",
        "Less responsive feel under sail for experienced sailors.",
        "Master cabins typically smaller than equivalent-length monohulls.",
      ],
    },
    bestFor: [
      "Multi-family charters where two couples share the boat",
      "Anyone with mobility concerns or small children on deck",
      "Cyclades itineraries with multiple anchorage stops per week",
      "Couples who want sailing without committing to monohull heel",
      "Photo-shoot, wedding, and event charters needing flat deck space",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "Catamaran*" || subtitle match "*catamaran*" || subtitle match "*cat*" || builder match "*Lagoon*" || builder match "*Bali*" || builder match "*Fountaine*" || builder match "*Sunreef*" || builder match "*Aquila*" || builder match "*Leopard*" || builder match "*Nautitech*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Catamarans for the 2026 season",

    whenTitle: "When to charter a catamaran",
    whenBody:
      "Catamarans are **the most weather-tolerant platform in the Greek fleet**. The wide stance means strong winds matter less than they do on a monohull, and the shallow draft opens sheltered anchorages even when forecasts look firm. **May through October** is fair game. The peak family weeks in **late July and August** are when catamarans particularly shine: the boat tolerates a 30-knot Meltemi gust at anchor far more gracefully than an equal-length monohull.",

    // 2026-07-02 (ASK A Section 2, catamaran rebuild) — the visible
    // price ladder. Every figure below is a live listing from the
    // fleet, not an estimate: rates read from the Sanity yacht
    // records on 2026-07-02. Update alongside rate-card changes.
    rateTable: {
      eyebrow: "The Price Ladder · 2026",
      heading: "What a catamaran week costs, tier by tier",
      intro:
        "Live figures from George's own fleet, weekly base rate in EUR, excluding VAT and APA. The ladder runs wider than most visitors expect: the entry point is a skippered catamaran priced per person, the top is an 80-foot flagship with five crew.",
      caption:
        "George Yachts fleet, 2026 season. Weekly base charter fee in EUR, excluding VAT (13% weekly crewed) and APA. Rates as listed on each yacht's page.",
      columns: ["Tier", "Typical size", "Weekly base rate", "From the fleet"],
      rows: [
        {
          cells: [
            "Skippered catamaran (Explorer Fleet)",
            "36-46 ft",
            "from €4,900 per person, or from €10,900 per yacht",
            "Bali Catspace, Fountaine Pajot Isla 40, Lagoon 46, Nautitech 46",
          ],
        },
        {
          cells: [
            "Crewed, captain + chef",
            "44-55 ft",
            "€14,000-28,000",
            "Fountaine Pajot MY 44, Aquila 54, Lagoon 55, Bali Catspace 55",
          ],
        },
        {
          cells: [
            "Crewed, full service",
            "67 ft",
            "€31,500-48,000",
            "Fountaine Pajot Alegria 67 and Power 67",
          ],
        },
        {
          cells: [
            "Flagship, 4-6 crew",
            "70-81 ft",
            "€49,000-90,000",
            "Sunreef 70 Power, Sunreef 80, Fountaine Pajot Thira 80, Lagoon 78 and CNB 81",
          ],
        },
      ],
    },

    // 2026-07-02 — guide-depth editorial (ASK A: close the relevance
    // gap against the category pages that outrank us). Facts from the
    // live fleet records and the Charter Index 2026; links verified.
    deepDive: [
      {
        eyebrow: "The Choice",
        heading: "Sailing catamaran or power catamaran, honestly",
        body:
          "The question decides your week's rhythm, so it deserves a straight answer. A **sailing catamaran** gives you the mornings under canvas, the quiet, and the lower rate: at equal length, sailing types typically run about 30% below power for the week, and the fuel line in your APA stays modest. Our sailing roster runs from the Lagoon 46 and Bali Catspace of the Explorer Fleet to full-crew flagships like the Sunreef 80 and the Fountaine Pajot Thira 80. " +
          "A **power catamaran** trades the sails for two diesels and 18 to 22 knots, which is motor-yacht pace on roughly 70% of a monohull motor yacht's fuel. That speed is not vanity: it turns Athens to Milos into an afternoon and lets one week hold two island groups. The power side of the fleet runs from the compact Fountaine Pajot MY 44 through the Power 67s to the Sunreef 70 Power ALTEYA, listed as the only one of her kind in the Mediterranean. " +
          "The honest rule George gives guests: if the pleasure is the sailing itself, sail. If the pleasure is the places and the platform, power. Families split roughly evenly, and neither choice is wrong on Greek water.",
      },
      {
        eyebrow: "The Layout",
        heading: "Cabins, and who sleeps where",
        body:
          "Catamaran cabin counts read simply once you know the classes. **Three cabins** (six guests) is the intimate end, the Fountaine Pajot MY 44 Endless Beauty runs this way with a captain and cook aboard. **Four cabins** (eight guests) is the workhorse of the fleet, from the Aquila 54 to the Sunreef 70 and 80, where the two couples or the family-plus-grandparents map perfectly onto the four suites. **Five cabins** (ten guests) appears on the Lagoon 78, the Bali Catspace 55 and the Sunreef 80 Genny, and it is the sweet spot for two families sharing. At the top, the **six-cabin Fountaine Pajot Thira 80** sleeps twelve, the legal ceiling for most Greek charter yachts. " +
          "Two details worth asking about before you choose: whether the owner's suite runs full-beam forward (the Thira 80 and Sunreef 80 layouts give the master a private terrace feel), and where the crew sleep, because on a crewed 67-footer and above the crew quarters are separate hulls or forepeaks, which is what keeps service invisible until the moment you want it.",
      },
      {
        eyebrow: "The Waters",
        heading: "Catamaran itineraries, region by region",
        body:
          "The 1.2 to 1.5 metre draft is the catamaran's passport. In the **Cyclades**, that means anchoring inside the [Antiparos channel](/yacht-charter-antiparos-anchorages) where deeper keels wait outside, lunch stops at [Koufonisia](/yacht-charter-koufonisia-anchorages) sand bars, and the volcanic coves of [Milos](/yacht-charter-milos-anchorages) taken close-in. Plan south-going legs with the Meltemi behind you and overnight on lee shores; the [Cyclades destination guide](/destinations/cyclades) sets out the classic week. " +
          "The **Ionian** is catamaran heaven for a first charter: calm seas, short hops, green water. The inside passage at [Paxos and Antipaxos](/yacht-charter-paxos-anchorages) and the quiet bays of [Meganisi](/yacht-charter-meganisi-anchorages) are shallow-draft privileges, and several Explorer Fleet catamarans base in Lefkada and Corfu, which removes repositioning cost entirely. " +
          "The **Saronic** delivers the shortest transfer from Athens: [Poros](/yacht-charter-poros-anchorages), Hydra and Spetses in an unhurried loop, ideal for the five-day first taste. Every island above has its own anchorage guide with documented depths and shelter in [the anchorage library](/greek-anchorages-database), written from published cruising sources.",
      },
      {
        eyebrow: "The Money · 2026",
        heading: "What a crewed catamaran week really costs in 2026",
        body:
          "Three numbers make up the true cost, and George quotes all three in writing before you commit. **The base rate** is the ladder above: from €14,000 for an intimate crewed 44-footer to €90,000 for an 80-foot flagship in peak weeks, with the Explorer Fleet's skippered catamarans from €4,900 per person. **The APA**, typically 25 to 30% for catamarans, funds fuel, provisioning and berthing transparently, and catamarans hold the APA down because twin efficient hulls burn less than an equivalent motor yacht ([how APA works](/advance-provisioning-allowance-apa-greek-yacht-charter-explained)). **The VAT** is where 2026 catches people out: the standard weekly crewed charter, anything commercial and longer than 48 hours, carries **13% VAT**, while short, static or bareboat arrangements carry 24%. Much of what ranks on this query still quotes obsolete 12% or 6.5% figures; [the 2026 VAT rules, explained properly](/greek-yacht-charter-vat-explained-2026). " +
          "Per person, the arithmetic lands softer than the headlines: a crewed catamaran for up to 12 guests at €20,000 to €40,000 in Cyclades peak season is roughly €1,700 to €3,300 each for the week before VAT and APA, per the [Greek Charter Index 2026](/greek-charter-index-2026). The [complete pricing guide](/greek-yacht-charter-2026-complete-pricing-guide) walks every line item.",
      },
    ],

    insiderTitle: "Notes from George",
    insiderTips: [
      "On a sailing catamaran, the salon is glass on three sides. Brief the chef on which dishes will work in the sun; some preparations melt by lunchtime.",
      "Ask whether the catamaran has a flybridge. The view it gives the captain at port arrivals is also the best photography spot during sea legs.",
      "Power catamarans run on roughly 70% of the fuel of a monohull motor yacht of equal speed. Worth knowing for APA budgeting.",
      "Sunreef builds the largest sailing catamarans; if you want one above 60 feet with five suites, this is the marque to ask for first.",
      "Catamarans drive into shallow anchorages that monohulls anchor outside of. Day three, your captain will surprise you with a beach you would not have reached otherwise.",
    ],

    faq: [
      {
        q: "How much does a catamaran charter cost in Greece?",
        a: "Weekly rates start around €15,000 for a 45-foot sailing catamaran with captain and cook, and run to €120,000+ for an 80-foot power catamaran with a full crew. Most of our catamaran weeks settle between €25,000 and €55,000, before APA (typically 25 to 30%) and Greek charter VAT."
      },
      {
        q: "Sailing catamaran or power catamaran - which is better?",
        a: "Sailing catamarans suit guests who appreciate the rhythm of wind and want a softer pace. Power catamarans suit itineraries that cross island groups and want monohull motor-yacht speed without the roll. Sailing types are also typically 30% lower in weekly rate for equal length, given the lower running cost."
      },
      {
        q: "Are catamarans good for families with young children?",
        a: "Yes. The lack of heel, wide flat decks, and shallow draft (allowing direct beach access via tender or even drop-anchor swim-from-boat in sheltered bays) make catamarans the natural choice. We recommend boats with an enclosed flybridge or salon for hot-day shade as well."
      },
      {
        q: "Can a catamaran sail in the Meltemi?",
        a: "Yes, and they often sail it better than a monohull. The wide beam gives stability that handles 30 to 35 knot gusts without dramatic heel. Experienced captains will reef earlier on catamarans than on monohulls; you'll still cover 100 to 120 nm in a day under sail in firm Meltemi conditions."
      },
      {
        q: "Is a catamaran the right choice for a wedding party?",
        a: "If you have 8 to 12 guests and want a single platform for ceremony, dinner, and overnight, a 70 to 80-foot catamaran is the largest single-boat choice in the Greek fleet. For 14+ we usually recommend two yachts (a catamaran for the family, a motor yacht for friends) chartered together."
      },
      {
        q: "How many guests can a catamaran take in Greece?",
        a: "Greek commercial regulations cap most charter yachts at 12 guests under way, and the catamaran fleet is built to that ceiling: four cabins sleep eight, five cabins sleep ten, and the six-cabin Fountaine Pajot Thira 80 sleeps the full twelve. Larger groups are arranged legally with the right vessel class or a two-yacht flotilla."
      },
      {
        q: "Can I charter a catamaran bareboat through George Yachts?",
        a: "No, and deliberately so. George brokers crewed and skippered charters only: the Private Fleet comes with full crew, the Explorer Fleet with a professional skipper. The week is meant to be lived, not operated. If you hold licenses and want to sail yourself, we are honestly not the right house for that charter."
      },
      {
        q: "Which Greek islands suit a catamaran best?",
        a: "The ones that reward shallow draft and calm anchorages: the Antiparos channel and Koufonisia in the Cyclades, Paxos, Antipaxos and Meganisi in the Ionian, and the Poros-Hydra-Spetses loop in the Saronic. The Ionian is the gentlest first-charter water; the Cyclades trade a firmer Meltemi for the marquee names."
      },
      {
        q: "How far in advance should I book a catamaran for 2026?",
        a: "Peak July and August weeks book 6 to 12 months ahead, and the named flagships (Sunreef 80s, Thira 80s) commit earliest. June and September usually hold availability closer in, at softer rates for the same yacht. If your dates are fixed to school holidays, decide early; if they are flexible, the shoulder weeks are the connoisseur's buy."
      },
    ],

    ctaTitle: "Find your catamaran for 2026.",
    ctaPrimary: "Find a catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "superyacht",
    urlPath: "/superyacht-charter-greece",
    eyebrow: "Superyacht Charters",
    h1: "Superyacht Charter Greece",
    tagline: "Vessels above 30 metres. Two tenders. Five-star crew. The Aegean at its full scale.",
    seoTitle: "Superyacht Charter Greece 2026",
    seoDescription: "Luxury superyacht charter in Greece. 30-70m vessels, 5+ crew, multiple tenders, full toy kit, chef-led galleys. Weekly rates from €150K.",
    quickAnswer: {
      question: "How much does a superyacht charter in Greece cost per week?",
      answer:
        "A superyacht charter in Greece starts around €150,000 base, roughly €245,000 all-in per week once APA provisioning, 13% VAT and crew gratuity are added, and climbs steeply with length above 40m. The rate buys a full crew of five or more, multiple tenders, a complete water-toy kit and a chef-led galley.",
    },
    canonical: "https://georgeyachts.com/superyacht-charter-greece",
    touristType: ["UHNW families", "Celebrities", "Repeat charterers"],

    whyTitle: "Why a superyacht in Greece",
    whyBody:
      "A **superyacht** is defined first by length (typically 30 metres and above), but in practice it is defined by separation. A superyacht has separate crew zones, separate guest zones, and enough deck volume that ten people can move independently around the boat without ever crossing paths. That is the difference between a yacht week that feels like a hotel stay and a yacht week that feels like a luxury holiday. " +
      "In Greek waters, superyachts unlock destinations the smaller fleet cannot. **The northern Sporades, the eastern Dodecanese, the Cretan south coast** - all become realistic charter routes once a yacht can sustain 18 knots, carry enough fuel for 600 nm without refuelling, and offer guests a stabilised foredeck for the longer legs. Itineraries that would feel grueling on a 22-metre become comfortable on a 38-metre. " +
      "Our superyacht roster spans **classic builders** (Benetti, Heesen, Feadship) and **modern performance yards** (Sanlorenzo, Custom Line, Mangusta). All come with a chef who has trained at Michelin-starred restaurants, a chief stewardess who briefs the week as if it were a private hotel turnover, and a captain who has run charter weeks in the Med for at least a decade.",

    prosAndCons: {
      pros: [
        "True crew/guest separation. Privacy that smaller boats cannot offer.",
        "Two tenders means activities for two groups in parallel.",
        "Chef-led galleys deliver restaurant-tier meals daily.",
        "Stabilisers at anchor as well as underway.",
        "Long-range cruising opens up the Dodecanese and Crete loops.",
      ],
      cons: [
        "Marina dockage at €1,500 to €5,000 per night in peak season.",
        "Greek charter VAT scales with vessel length; budget accordingly.",
        "Some smaller anchorages excluded by draft and beam.",
      ],
    },
    bestFor: [
      "UHNW families chartering two-week+ itineraries",
      "Multi-generational charters with 8 to 12 guests",
      "Repeat clients who have outgrown the 25 to 30 metre range",
      "Long-range routes crossing Cyclades to Dodecanese in one week",
      "Charters with celebrity or high-profile guest privacy requirements",
    ],

    yachtFilter: '_type == "yacht" && length match "*m*" && (length match "3*m*" || length match "4*m*" || length match "5*m*" || length match "6*m*" || length match "7*m*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Superyachts ready for 2026",

    whenTitle: "When to charter a superyacht",
    whenBody:
      "**June through early September** is the active charter window. Superyachts are also available in **shoulder season (May, late September, October)** at 25 to 35% lower weekly rates, with the same crew and the same itinerary options. Many of our UHNW clients prefer shoulder months for the quieter anchorages and the absence of the Meltemi at its peak. **Winter charters** (December to March) are extremely rare in Greek waters; ask if the brief is specific.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Above 40 metres, ask about helicopter compatibility. Many superyachts are touch-and-go rated but not full-load certified.",
      "The chef's tasting menu on the first night is the brief for the rest of the week. Don't be polite about preferences.",
      "Two tenders is the threshold. Below 30 metres you typically get one; above 35 you usually get two. The difference reshapes activities.",
      "Greek charter VAT for vessels above 24 metres is 24% unless international waters are crossed for more than half the charter. Plan with the captain.",
      "Superyacht crews are tipped 5 to 15% of the charter rate. Budget separately, paid in cash to the captain on the final morning.",
    ],

    faq: [
      {
        q: "What defines a superyacht?",
        a: "Industry consensus is any vessel above 24 metres (78 feet) is a yacht; above 30 metres is a superyacht; above 50 metres is a megayacht. Definitions vary by publication; the more useful metric is crew count. A vessel with five or more crew, full chef-led galley, and at least two tenders is operating at superyacht standards regardless of exact length."
      },
      {
        q: "How much does a superyacht charter cost in Greece?",
        a: "Weekly rates start around €150,000 for a 30-metre superyacht with five crew, and run to €1.5M+ for a 60-metre vessel with eleven crew, two tenders, and a helicopter. Most of our superyacht weeks settle between €280,000 and €500,000, before APA (typically 30%) and Greek charter VAT (13%, or 24% for short charters under 48 hours)."
      },
      {
        q: "How many guests can a superyacht accommodate?",
        a: "The legal cap for any commercial charter yacht in Greece is 12 guests, regardless of vessel size. A 50-metre superyacht typically sleeps 12 in 6 cabins (one master, one VIP, four guest twins or doubles) plus 10 to 12 crew in separate quarters. This is a regulation, not a marketing position; do not let any broker tell you otherwise."
      },
      {
        q: "Is helicopter use possible on a superyacht charter?",
        a: "Many superyachts above 40 metres have touch-and-go pads suitable for a single approach to drop off or collect guests. Permanent helicopter operation requires a yacht with a certified helideck and hangar; we represent two such vessels in 2026. Helicopter operations from islands (Mykonos, Athens) are common and cheaper; ask the captain about logistics."
      },
      {
        q: "What's the difference between a superyacht and a motor yacht?",
        a: "Every superyacht is technically a motor yacht (the few sailing superyachts are explicitly noted). The distinction is scale: a 25-metre motor yacht is a motor yacht; a 35-metre is a superyacht. The threshold is roughly where dedicated chef, separate crew zones, and second tender become standard. Below that, the yacht is a motor yacht. Above, a superyacht."
      },
    ],

    ctaTitle: "Find your superyacht for 2026.",
    ctaPrimary: "Find a superyacht",
    ctaPrimaryHref: "/yacht-finder?type=superyacht",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "mega-yacht",
    urlPath: "/mega-yacht-charter-greece",
    eyebrow: "Megayacht Charters",
    h1: "Megayacht Charter Greece",
    tagline: "Vessels above 50 metres. Reserved for charterers who already know what they want.",
    seoTitle: "Megayacht Charter Greece 2026 | 50m+ Yachts",
    seoDescription: "Megayacht charter in Greek waters. Vessels 50 to 100m+ with ten-plus crew, helicopter touch-and-go, full toy fleet. Weekly rates from €500K. IYBA member.",
    quickAnswer: {
      question: "How much is a megayacht charter in Greece per week?",
      answer:
        "A megayacht charter in Greek waters starts around €500,000 base, well over €800,000 all-in per week with APA, 13% VAT and gratuity, and rises further above 80m. At this level you charter ten-plus crew, helicopter touch-and-go capability and a full tender and toy fleet, with the itinerary built entirely around you.",
    },
    canonical: "https://georgeyachts.com/mega-yacht-charter-greece",
    touristType: ["UHNW principals", "Private offices", "Heads of state"],

    whyTitle: "Why a megayacht",
    whyBody:
      "Above 50 metres, the yacht stops being a vessel and becomes a private estate that happens to float. A megayacht typically carries **ten to fourteen crew**, two or three tenders, often a submarine or beach club platform, a chef whose CV includes Michelin-starred dining rooms, and enough fuel for trans-Mediterranean passages. " +
      "In Greek waters, megayachts are most commonly chartered by **principals who already own a yacht** and want to try a different class for a specific trip, by **multi-family groups** who book the maximum 12 guests legal cap across two extended families, and by **private offices** arranging discreet hosting for corporate or sovereign guests. The audience is narrow. The service standard is unforgiving. " +
      "We represent a small set of megayachts each season; selection is by relationship and direct introduction. If you have not chartered above the 40 metre mark before, our usual recommendation is to start at a 35 to 45 metre superyacht and step up in the second season. The capacity to use what a megayacht offers takes one charter to develop.",

    bestFor: [
      "Principals stepping up from 35 to 45 metre superyacht charters",
      "Charters with helicopter, submarine, or limousine-tender requirements",
      "Two-week+ itineraries crossing Greece, Turkey, and Croatia",
      "Hosted charters for corporate or sovereign guests requiring full privacy",
      "Multi-family charters consolidating two households on one platform",
    ],

    yachtFilter: '_type == "yacht" && length match "*m*" && (length match "5*m*" || length match "6*m*" || length match "7*m*" || length match "8*m*" || length match "9*m*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Megayachts available 2026",

    whenTitle: "When megayachts charter best in Greece",
    whenBody:
      "Megayachts hold their value year-round, but Greek waters call them in for **early summer (late May to mid-June)** and **late season (September to mid-October)**. Peak August weeks (15 to 31) are often pre-booked by repeat clients with multi-year arrangements. If your dates are flexible, ask about **shoulder weeks at June and September edges** - the same vessel at 20 to 30% off peak rates with quieter anchorages.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "The first conversation with a megayacht captain happens in person, not over email. Plan a yacht-visit week before signing.",
      "Charter VAT is paid by the charterer, not the broker. Megayacht totals can carry VAT bills of €100,000+; ensure your tax advisor reviews the contract.",
      "Crew gratuity convention on megayachts is 10 to 15% of base rate, paid in cash to the captain who distributes. €40,000 to €75,000 is typical.",
      "Megayachts cruise at 12 to 16 knots most of the day. Faster passages compromise the meal-and-service rhythm the crew is set up for.",
      "The submarine, where the yacht has one, is typically rated for two people including the pilot. The on-board scuba kit will dive deeper than most.",
    ],

    faq: [
      {
        q: "What's the minimum charter duration for a megayacht?",
        a: "Most megayacht owners require a minimum 7-day charter. Some specify 10 or 14 days as a standard. For Greek-water itineraries spanning Cyclades, Dodecanese, and the Cretan coast, we recommend 10 to 14 days; less than that and the megayacht class is wasted on logistics rather than experience."
      },
      {
        q: "How much does a megayacht charter cost?",
        a: "Weekly rates start around €500,000 for a 50-metre and run to €2M+ for an 80-metre vessel. Most of our megayacht weeks settle between €750,000 and €1.4M, before APA (typically 30%, occasionally 35% for high-fuel itineraries) and Greek charter VAT."
      },
      {
        q: "Can we charter just one or two days of a megayacht?",
        a: "No. The economics of megayacht operations require a full week minimum. Day charters are not offered. If your event needs only a day, ask about superyacht charter (smaller vessels, similar service tier, day-charter possible in select cases)."
      },
      {
        q: "Do megayachts come with private security?",
        a: "Some do. Approximately a third of the megayachts we represent in Greek waters have ex-military security available as an add-on (€8,000 to €15,000 per week per officer). Ask discreetly; the answer depends on the owner's standing arrangements."
      },
      {
        q: "Will the crew sign an NDA?",
        a: "Yes. Megayacht crews routinely sign NDAs as a condition of employment. For specific charters requiring additional confidentiality (celebrity, sovereign, corporate principal), supplementary NDAs are arranged through our office at no additional charge."
      },
    ],

    ctaTitle: "Find your megayacht for 2026.",
    ctaPrimary: "Find a megayacht",
    ctaPrimaryHref: "/yacht-finder?type=mega",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "crewed-catamaran",
    urlPath: "/crewed-catamaran-charter-greece",
    eyebrow: "Crewed Catamaran Charters",
    h1: "Crewed Catamaran Charter Greece",
    tagline: "The catamaran format with a full crew. Captain, chef, hostess. You bring the suitcase.",
    seoTitle: "Crewed Catamaran Charter Greece 2026",
    seoDescription: "Fully crewed catamaran charters in Greek waters. Captain, chef, and hostess included. Sailing and power catamarans, 45 to 80 feet. Weekly rates from €18K.",
    quickAnswer: {
      question: "How much is a fully crewed catamaran charter in Greece per week?",
      answer:
        "A fully crewed catamaran charter in Greece starts around €18,000 base, about €29,000 all-in per week with APA, 13% VAT and gratuity. The rate includes a captain, chef and hostess, so you step aboard to full service. Catamarans give families the most space, stability and shallow-draft beach access of any crewed type.",
    },
    canonical: "https://georgeyachts.com/crewed-catamaran-charter-greece",
    touristType: ["Families", "Friend groups", "First-time crewed charterers"],

    whyTitle: "Why a crewed catamaran",
    whyBody:
      "**A crewed catamaran is the gateway to crewed yachting for many guests.** The format pairs the wide-deck, low-heel character of a catamaran with the comfort of a full crew: typically a captain (who navigates and runs the boat), a chef (who handles all meals), and a hostess (who serves, tends cabins, and runs the social rhythm of the week). " +
      "The result is a charter week that feels far more like a private hotel than a sailing trip. Guests wake to coffee on the foredeck, swim before breakfast, eat at noon in a private cove, anchor for the afternoon in another, and arrive at the harbour-side dinner spot by 19:30 without lifting a finger. " +
      "We focus our crewed catamaran fleet on **45 to 80 foot vessels** that suit four to ten guests. Smaller and the crew zones become tight; larger and the crew count grows to four or five, which puts the boat closer to a superyacht in rate and feel. The sweet spot for a first crewed charter is **55 to 65 feet for six to eight guests** with a three-person crew, which is what we recommend most often.",

    prosAndCons: {
      pros: [
        "Three-person crew (captain, chef, hostess) is the smoothest staffing for 6 to 8 guests.",
        "Catamaran format avoids heel and motion-sensitivity issues.",
        "Lower entry price than equivalent crewed motor yachts of same length.",
        "Strong fit for families with school-age children.",
        "Easy beach-cove access via tender from shallow anchorages.",
      ],
      cons: [
        "Crew berths take 1.5 to 2 cabins on smaller catamarans; check guest layout.",
        "Galley space limits chef ambition vs equivalent motor yacht.",
        "Above 70 feet, you're effectively chartering a smaller superyacht; rates rise quickly.",
      ],
    },
    bestFor: [
      "First-time crewed charterers stepping up from bareboat",
      "Families with kids aged 6 to 16 wanting captain-handled sailing",
      "Friend groups of four to six couples on a shared week",
      "Honeymoons on a budget that still want a chef and full service",
      "Multi-family weeks with two households sharing the platform",
    ],

    yachtFilter: '_type == "yacht" && subtitle match "*catamaran*" && defined(crew)',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Crewed catamarans for 2026",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Confirm whether the crew is included in the rate or added separately. Most crewed catamarans include crew; some smaller ones price crew separately.",
      "Ask about the chef's prior experience. Many catamaran chefs come from land-based restaurants and bring genuine creativity. Some come from larger yachts and excel at scale.",
      "The hostess role doubles as childcare on many family charters. Discuss with the captain if you'll have small children aboard.",
      "Crewed catamaran rates rise faster than monohull rates as you add length. The reason is crew count: above 65 feet you typically add a fourth crew member.",
      "Tipping convention is 10 to 15% of the base rate, split across crew. €1,500 to €3,000 per crew member for a typical week is what we see.",
    ],

    faq: [
      {
        q: "What's included in a crewed catamaran charter?",
        a: "Base rate covers: the yacht, the crew (captain, chef, hostess at minimum), insurance, and routine maintenance. APA (separate payment, typically 25 to 30% of base rate) covers fuel, dockage, food, drinks, and other running costs. You bring suitcases and preferences."
      },
      {
        q: "How many guests can a crewed catamaran take?",
        a: "Greek charter law caps any commercial charter at 12 guests. Most crewed catamarans in our fleet sleep 6 to 10 guests in 3 to 5 cabins, with crew berths separate. The 12-guest cap is a regulation; if a broker quotes you 14 guests on a 'crewed catamaran' assume the boat is operating outside regulation."
      },
      {
        q: "Crewed catamaran or crewed monohull - which is better for our family?",
        a: "For families with children under 14, almost always the catamaran. The flat decks, no-heel sailing, and shallow draft turn the boat into a usable platform rather than something children sit out on. For sailing-experienced families with teenagers, a monohull gives more authentic sailing feel."
      },
      {
        q: "What does a crewed catamaran charter cost in Greece?",
        a: "Weekly rates start around €18,000 for a 45-foot sailing catamaran with three crew, and run to €90,000+ for an 80-foot power catamaran with five crew. Most weeks settle between €28,000 and €55,000, before APA and Greek charter VAT (13%)."
      },
      {
        q: "Will the crew be the same throughout the week?",
        a: "Yes. The captain, chef, and hostess on day one are the same on day seven. Crew rotation only happens between charters, not during. The crew lives aboard for the season and treats the boat as home."
      },
    ],

    ctaTitle: "Find your crewed catamaran for 2026.",
    ctaPrimary: "Find a catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&crew=true",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "sailing-catamaran",
    urlPath: "/sailing-catamaran-charter-greece",
    eyebrow: "Sailing Catamaran Charters",
    h1: "Sailing Catamaran Charter Greece",
    tagline: "Two hulls, full sail. The format that turned charterers into catamaran loyalists.",
    seoTitle: "Sailing Catamaran Charter Greece 2026",
    seoDescription: "Crewed sailing catamaran charter in Greek waters. Lagoon, Bali, Sunreef, Fountaine Pajot. 45 to 80 feet, with captain, chef, hostess. From €18K/week.",
    quickAnswer: {
      question: "How much does a crewed sailing catamaran charter in Greece cost per week?",
      answer:
        "A crewed sailing catamaran charter in Greece starts around €18,000 base, roughly €29,000 all-in per week with APA, 13% VAT and gratuity. Brands like Lagoon, Bali and Sunreef pair the stability and space of two hulls with quiet sailing, a combination families and groups of friends choose again and again.",
    },
    canonical: "https://georgeyachts.com/sailing-catamaran-charter-greece",
    touristType: ["Sailing enthusiasts", "Families", "Couples"],

    whyTitle: "Why a sailing catamaran",
    whyBody:
      "A sailing catamaran combines the sailing experience with the catamaran living format. **You sail under wind, not motor**; you have all the floor space and no-heel comfort of the catamaran type; you get the romance of cutting engines on a beam reach across the Aegean without losing the picnic-lunch-on-deck practicality that families with children rely on. " +
      "The sailing catamaran market has matured into three tiers. **Production catamarans** (Lagoon, Fountaine Pajot, Bali) at 45 to 55 feet deliver excellent value with crewed weekly rates from €18,000. **Higher-spec catamarans** (Sunreef, Privilege, Outremer) at 55 to 70 feet offer faster performance, finer interiors, and rates from €40,000. **Custom sailing catamarans** above 70 feet (Sunreef Eco, Gunboat, Nautor) move into superyacht territory with rates from €80,000. " +
      "Greek waters favour sailing catamarans because of the **consistent Meltemi**. A 60-foot catamaran in 18 knots true reaches at 11 to 13 knots boat speed without effort, which makes day passages of 60 to 100 nautical miles practical for sailing weeks. The Ionian's gentler breezes suit slower hull speeds and longer relaxed days at anchor.",

    prosAndCons: {
      pros: [
        "True sailing experience with catamaran living format.",
        "Lower fuel cost than power catamarans on equal itineraries.",
        "Reaching the Aegean Meltemi at 10 to 13 knots is the postcard.",
        "Modern designs (Sunreef, Outremer) sail upwind well for a catamaran.",
        "Quieter at anchor: no genset running for refrigeration in mild weather.",
      ],
      cons: [
        "Slower upwind than a monohull sailing yacht of equal length.",
        "Larger beam restricts marina options and increases mooring fees.",
        "Less responsive helm feel for experienced monohull sailors.",
      ],
    },
    bestFor: [
      "Sailing families with children under 14",
      "Couples who want sailing romance without monohull heel",
      "Charters across the Cyclades in peak Meltemi weeks",
      "Repeat catamaran charterers stepping up from a bareboat week",
      "Lower-budget honeymoons that still want crew and sailing",
    ],

    yachtFilter: '_type == "yacht" && subtitle match "*sailing catamaran*" || subtitle match "*sail cat*" || (builder match "*Lagoon*" || builder match "*Sunreef*" || builder match "*Outremer*" || builder match "*Privilege*" || builder match "*Fountaine*") && subtitle match "*sail*"',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Sailing catamarans for 2026",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Lagoon catamarans are the production standard. Sunreef leads on luxury. Outremer leads on performance. Choose by what you value.",
      "On a sailing catamaran above 55 feet, ask whether the helm is on a flybridge or in a cockpit. Flybridge gives view; cockpit gives social proximity.",
      "Reaching at 12 knots is sustained on Lagoon 55+ in good Meltemi. Day passages of 80 nm are realistic; plan accordingly.",
      "The galley on a sailing catamaran sits between the hulls. Chefs work in tight space but with excellent ventilation.",
      "Sailing catamarans are easier than monohulls for first-time crewed charterers. The boat feels stable from the first night.",
    ],

    faq: [
      {
        q: "Sailing catamaran or power catamaran?",
        a: "Sailing catamarans are 25 to 35% lower in weekly rate, lower in fuel cost, and deliver actual sailing days as part of the week. Power catamarans cover ground faster (18 to 22 knots vs 8 to 12 under sail) and suit cross-Aegean itineraries. For Ionian and Saronic itineraries, sailing wins. For Cyclades to Dodecanese, power."
      },
      {
        q: "Do sailing catamarans handle rough weather well?",
        a: "Yes. The wide stance and reduced heel make them more stable than monohulls in firm conditions. Captains reef earlier on catamarans than on monohulls but the boats themselves tolerate Meltemi 30 to 35 knot gusts very comfortably."
      },
      {
        q: "Can we actually sail every day on a sailing catamaran week?",
        a: "Most weeks see 4 to 6 sailing days with 1 to 3 marina or sheltered-anchorage rest days. Pure-sail weeks are possible but require itinerary flexibility. If sailing every day matters, brief the captain at day one and they will route the week around it."
      },
      {
        q: "How experienced does the captain need to be?",
        a: "We work with captains who have run charter weeks for at least three seasons on sailing catamarans specifically. Beneath that, monohull-experienced captains often handle catamarans differently than the boats want; the experience curve matters."
      },
      {
        q: "What about teak decks versus modern composite?",
        a: "Traditional charter sailing catamarans (Sunreef, older Lagoon) have teak decks. Newer production catamarans (recent Lagoon, Bali, Fountaine Pajot) often use composite or cork. Teak is warmer underfoot, more traditional; composite is cooler, lower-maintenance. Most guests don't notice after day two."
      },
    ],

    ctaTitle: "Find your sailing catamaran for 2026.",
    ctaPrimary: "Find a sailing catamaran",
    ctaPrimaryHref: "/yacht-finder?type=catamaran&power=sail",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "gulet",
    urlPath: "/gulet-charter-greece",
    eyebrow: "Gulet Charters",
    h1: "Gulet Charter Greece",
    tagline: "Traditional Turkish wooden yachts. Wide decks. Larger groups. Honest pricing.",
    seoTitle: "Gulet Charter Greece 2026 | Traditional Wooden Yachts",
    seoDescription: "Gulet charter in Greek waters. Traditional Turkish-built wooden yachts 18 to 40m, full crew, ideal for groups of 8 to 16. Weekly rates from €14K. IYBA member.",
    quickAnswer: {
      question: "How much is a gulet charter in Greece per week?",
      answer:
        "A gulet charter in Greek waters starts around €14,000 base, about €23,000 all-in per week with APA, 13% VAT and gratuity, depending on size and season. Traditional wooden gulets of 18 to 40m suit groups of 8 to 16, with broad shaded decks for long lunches and a relaxed, sociable rhythm aboard.",
    },
    canonical: "https://georgeyachts.com/gulet-charter-greece",
    touristType: ["Friend groups", "Multi-family charters", "Larger parties"],

    whyTitle: "Why a gulet",
    whyBody:
      "A gulet is a **traditional Turkish-built wooden yacht** with two or three masts (originally sail, almost always motor-driven in modern use), a wide flat deck, and a charm that no fibreglass yacht can manufacture. The format originated in Bodrum and the Turkish Aegean and has moved into Greek waters as charter demand grew. " +
      "Where gulets win is **group size**. A 28-metre gulet typically sleeps 16 guests in 8 cabins with a six-person crew. The equivalent capacity in a monohull motor yacht would cost three times the weekly rate. Gulets are the value answer when a friend group, an extended family, or a corporate retreat needs to fit 12 to 16 people on a single boat without paying superyacht pricing. " +
      "The trade-off is **scale and pace**. Gulets cruise at 8 to 10 knots, so itineraries compress around fewer destinations and more anchorage time. The interiors are functional rather than opulent; the social life on deck is what the format optimises for. Long dinner tables, evening fires (gas-permitted), live music on some boats, swimming platforms wide enough for ten people. The gulet week reads as a Mediterranean villa-on-water, not a polished hotel suite.",

    prosAndCons: {
      pros: [
        "Sleeps 8 to 16 guests at value-tier rates.",
        "Wide flat decks make group dining and lounging natural.",
        "Wooden construction delivers character no production yacht offers.",
        "Crew typically larger than equivalent-capacity motor yachts.",
        "Itineraries focus on anchorages and beach days, not transit.",
      ],
      cons: [
        "Slower cruising speed limits multi-island day passages.",
        "Older gulets may show maintenance signs in cabins; ask for recent photos.",
        "Tighter accommodation per guest than modern motor yacht equivalents.",
        "Mostly motor-only; sailing under canvas is rare on charter gulets.",
      ],
    },
    bestFor: [
      "Friend groups of 10 to 16 booking a single platform",
      "Multi-family charters consolidating two or three families",
      "Corporate retreats and team off-sites with budget discipline",
      "Sporades and Dodecanese itineraries that suit slower cruising",
      "Birthday and anniversary milestones with extended guest lists",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "*gulet*" || subtitle match "*Gulet*" || builder match "*Bodrum*" || builder match "*Turkish*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Gulets for 2026",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Confirm the year of refit, not the year of original build. Many 30-year-old gulets are immaculate after recent refits.",
      "Ask whether the crew speaks fluent English. Older gulets often have Turkish-only crew; modern ones have multilingual captains.",
      "Gulets stop at marinas every two to three days for water and fresh provisioning. Plan an island village in the rotation.",
      "The on-board kitchen on a gulet typically produces excellent traditional Greek and Turkish meals. Ask for a sample menu before booking.",
      "Children sleep on the foredeck on hot August nights. The wide foredeck cushions on a gulet are a feature, not a quirk.",
    ],

    faq: [
      {
        q: "What's the difference between a gulet and a sailing yacht?",
        a: "A gulet is a specific traditional Turkish-built wooden yacht type, typically two or three masted but rarely sailed in modern charter use. A sailing yacht is the general class of any wind-powered yacht (typically fibreglass, modern build, regularly sailed). Gulets are the format; sailing yachts are the discipline."
      },
      {
        q: "How many guests does a gulet sleep?",
        a: "Production gulets sleep 8 to 16 guests in 4 to 8 cabins. The legal cap in Greek waters is 12 commercial-charter guests, regardless of cabin count, so 16-cabin gulets typically charter 12 guests with extra cabins available as private use. Crew quarters are separate, usually below decks forward."
      },
      {
        q: "How much does a gulet charter cost in Greece?",
        a: "Weekly rates start around €14,000 for a 24-metre gulet with a six-person crew for 10 to 12 guests, and run to €60,000+ for a 35-metre luxury gulet with a chef and full hospitality crew. Most gulet weeks settle between €18,000 and €30,000, before APA (typically 25 to 30%) and Greek charter VAT."
      },
      {
        q: "Are gulets safe in rough weather?",
        a: "Yes, when properly maintained. Gulets built in the last 20 years to commercial charter standards meet Greek and Turkish maritime regulations. Older gulets must be inspected to current refit standard. The wide flat hull form is forgiving in chop; the wooden construction is durable but requires careful captaincy in strong wind."
      },
      {
        q: "Can a gulet sail to Greek islands from Turkey?",
        a: "Yes, and it's the original gulet route. Some clients book a gulet for a week beginning in Bodrum or Marmaris (Turkey) and crossing into the Dodecanese (Kos, Rhodes, Symi). The cross-border paperwork requires lead time; brief us at least 6 weeks before the charter."
      },
    ],

    ctaTitle: "Find your gulet for 2026.",
    ctaPrimary: "Find a gulet",
    ctaPrimaryHref: "/yacht-finder?type=gulet",
  },

  // ─────────────────────────────────────────────────────────────
  // 2026-07-03 (Wave 2, catamaran cluster) — the power-catamaran
  // page. The URL /power-catamaran-charter-greece had inbound
  // interest and 301'd to the fast-motor-yachts page (2026-05-14
  // Ahrefs 404 fix) - topically wrong. The redirect is now removed
  // (dubai-exodus precedent) and the real page ships, because the
  // fleet genuinely runs 9+ power catamarans. Every figure below is
  // a live listing read from Sanity 2026-07-02.
  {
    slug: "power-catamaran",
    urlPath: "/power-catamaran-charter-greece",
    eyebrow: "Power Catamaran Charters",
    h1: "Power Catamaran Charter Greece",
    tagline: "Motor-yacht pace, catamaran floor space, a fraction of the fuel. The fastest-growing class in Greek chartering.",
    seoTitle: "Power Catamaran Charter Greece 2026 | Crewed Fleet & Rates",
    seoDescription: "Crewed power catamaran charter in Greece: Sunreef 70 Power, Fountaine Pajot Power 67 and 80, Aquila. 18-22 knots, shallow draft, weekly rates from EUR 14,000. IYBA member.",
    canonical: "https://georgeyachts.com/power-catamaran-charter-greece",
    touristType: ["Families", "Friend groups", "Multi-island itineraries"],

    quickAnswer: {
      question: "How much does a power catamaran charter in Greece cost per week?",
      answer:
        "Crewed power catamarans in George's Greek fleet run from EUR 14,000-17,500 per week base for a compact Fountaine Pajot MY 44 with captain and cook, EUR 21,000-28,000 for an Aquila 54, EUR 34,000-48,000 for the Fountaine Pajot Power 67 class, and EUR 49,000-90,000 for the 70-80 ft flagships (Sunreef 70 Power, Fountaine Pajot Power 80, custom 80s). Add 13% VAT for the standard weekly crewed charter and an APA of 25-30%. Power cats cruise at 18-22 knots on roughly 70% of the fuel of an equivalent-speed monohull motor yacht.",
    },

    whyTitle: "Why a power catamaran in Greek waters",
    whyBody:
      "The power catamaran answers the question most charter families actually ask: **can we have the speed without giving up the space?** Two efficient hulls carry a villa's worth of flat deck at 18 to 22 knots, which turns Athens to Milos into an afternoon and lets a single week hold two island groups. The same twin hulls burn roughly **70% of the fuel of a monohull motor yacht at equal pace**, which your APA statement will show in plain numbers. " +
      "The class keeps the catamaran's two defining privileges: **near-zero roll at anchor** and a **1.2 to 1.5 metre draft** that slips inside the Antiparos channel and the sand coves that deeper motor yachts wait outside of. What it gives up against sail: the romance of canvas, and a slightly higher fuel line than a sailing cat. " +
      "George's power-cat roster is unusually deep for the Greek market: the **Sunreef 70 Power ALTEYA** (listed as the only one of her kind in the Mediterranean), the **Fountaine Pajot Power 80 ALINA** and the **Thira 80 ChristAl MiO 80** sleeping the full twelve, three **Power 67s**, the **Aquila 54 Explorion**, the **custom 80 ft SAMARA** with 4,000 square feet of living space, and the compact **MY 44 Endless Beauty** where the crewed week starts.",

    prosAndCons: {
      pros: [
        "18-22 knot cruise: two island groups in one week is realistic.",
        "Roughly 70% of the fuel of an equal-speed monohull motor yacht.",
        "Catamaran stability at anchor; children and grandparents stay comfortable.",
        "Shallow draft opens anchorages motor yachts cannot enter.",
        "Flat, single-level deck plans that families actually use.",
      ],
      cons: [
        "Higher fuel line in the APA than a sailing catamaran.",
        "No sailing romance; the rig is not the point of this class.",
        "Marina fees often charged at 1.5x length due to beam.",
      ],
    },
    bestFor: [
      "Families who want Mykonos AND Milos in the same week",
      "Groups mixing swimmers, nappers, and cocktail-hour guests on one deck",
      "Guests prone to seasickness who still want pace",
      "Repeat charterers upgrading from sailing cats for the speed",
      "Shoulder-season weeks where covering distance beats waiting on wind",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "*POWER*" || subtitle match "*Power*" || builder match "*Power*" || builder match "*Aquila*")',
    yachtsHeadline: "From the fleet",
    featuredHeading: "Power catamarans ready for the 2026 season",

    rateTable: {
      eyebrow: "The Ladder · 2026",
      heading: "Power catamaran rates, tier by tier",
      intro:
        "Live figures from George's own fleet, weekly base rate in EUR, excluding VAT and APA.",
      caption:
        "George Yachts power-catamaran fleet, 2026 season. Weekly base charter fee in EUR, excluding VAT (13% weekly crewed) and APA. Rates as listed on each yacht's page.",
      columns: ["Tier", "Size", "Weekly base rate", "From the fleet"],
      rows: [
        { cells: ["Compact crewed", "44 ft", "€14,000-17,500", "Fountaine Pajot MY 44 Endless Beauty (6 guests, captain + cook)"] },
        { cells: ["Mid fleet", "54 ft", "€21,000-28,000", "Aquila 54 Explorion (8 guests, 3 crew)"] },
        { cells: ["Full service", "67 ft", "€34,000-48,000", "FP Power 67: ALENA, ChristAl MiO, Majesty of Greece"] },
        { cells: ["Flagship", "70-80 ft", "€49,000-90,000", "Sunreef 70 Power ALTEYA, FP Power 80 ALINA, Thira 80 ChristAl MiO 80, custom 80 SAMARA"] },
      ],
    },

    whenTitle: "When the power cat earns its keep",
    whenBody:
      "**July and August**, when the Meltemi presses hardest and a sailing itinerary starts negotiating with the forecast. A power catamaran holds its schedule at 18-plus knots and its comfort at anchor, which is why the class books out early for peak family weeks. In **June and September** the same boats run softer rates for the same itineraries, and the fuel line drops with calmer seas. Booking lead time follows the fleet-wide pattern: 6 to 12 months for peak weeks, with the named flagships committing first.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "The Power 67 class is the value sweet spot: full-service crew, 10 guests on ChristAl MiO and Majesty of Greece, at roughly half the flagship rate.",
      "ALTEYA is the conversation piece: guests who have seen every Lagoon in the Aegean have not seen a Sunreef 70 Power. Book her early.",
      "If your party is exactly twelve, ChristAl MiO 80 is the single-platform answer: six cabins, the full legal guest count, five crew.",
      "Power cats reward two-group itineraries: Saronic warm-up, then the western Cyclades, in one week without a single hard passage day.",
      "Ask about the tender: on 70 ft-plus power cats the tender garage frees the aft deck that smaller cats give up to davits.",
    ],

    faq: [
      {
        q: "How fast is a power catamaran compared to a sailing catamaran?",
        a: "The power cats in this fleet cruise at 18 to 22 knots; crewed sailing catamarans typically make passage at 7 to 9 knots under power or sail. In practical terms: Athens to the western Cyclades becomes an afternoon rather than a full passage day.",
      },
      {
        q: "How much does a power catamaran charter cost in Greece?",
        a: "From the live fleet: EUR 14,000-17,500 per week base for the compact MY 44, EUR 21,000-28,000 for the Aquila 54, EUR 34,000-48,000 for Power 67s, and EUR 49,000-90,000 for the 70-80 ft flagships. Add 13% VAT (standard weekly crewed charter) and APA of 25-30%.",
      },
      {
        q: "Is a power catamaran cheaper to run than a motor yacht?",
        a: "At equal speed, yes: twin efficient hulls burn roughly 70% of the fuel of a monohull motor yacht, and fuel is the largest variable in a motor APA. Your APA statement itemises it transparently either way.",
      },
      {
        q: "Are power catamarans good for seasick-prone guests?",
        a: "They are the strongest answer in the fleet: catamaran beam kills the roll at anchor, and speed shortens the open-water legs where motion happens. Pair one with a lee-shore itinerary in Meltemi weeks and most guests forget the question.",
      },
      {
        q: "Which islands suit a power catamaran best?",
        a: "Everywhere a shallow draft and pace both pay: the Antiparos channel and Koufonisia sandbars, Milos' volcanic coves, and any two-group itinerary (Saronic plus western Cyclades is the classic). The anchorage guides map the specific bays.",
      },
    ],

    ctaTitle: "Find your power catamaran for 2026.",
    ctaPrimary: "Find a power cat",
    ctaPrimaryHref: "/yacht-finder?type=catamaran",
  },
];

export function getYachtTypeBySlug(slug) {
  return YACHT_TYPES.find((t) => t.slug === slug) || null;
}
