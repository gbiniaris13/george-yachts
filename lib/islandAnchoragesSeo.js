import { EXTRA_ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesExtra";
// Island anchorages topical-cluster data  -  Phase 7 Round 21
// (2026-05-12).
//
// Spoke pages for the top-5 island roots. Each provides a curated
// guide to the island's anchorages with practical sailing detail
// (depth, holding, shelter, ashore access)  -  the kind of content
// captains and charterers actually use. This is genuinely useful
// information that doesn't duplicate existing pages, and it signals
// deep local authority to Google + AI engines.
//
// Schema: each page renders as TouristAttraction collection plus
// individual Place entries with GeoCoordinates.

const BASE_ISLAND_ANCHORAGES = [
  {
    slug: "mykonos",
    islandName: "Mykonos",
    region: "Cyclades",
    urlPath: "/yacht-charter-mykonos-anchorages",
    eyebrow: "Mykonos anchorage guide",
    h1: "Mykonos Yacht Anchorages: The Complete 2026 Guide",
    tagline:
      "Where to anchor a yacht around Mykonos  -  practical depth, holding, shelter, and ashore-access detail for every major anchorage on the island.",
    intro:
      "Mykonos has the highest yacht traffic of any Greek island, and the anchorages reflect that demand: the famous bays fill by 11am in July-August, side-anchorages are increasingly important, and Meltemi routing matters. This guide covers every meaningful Mykonos anchorage with the practical detail captains and charterers need  -  depth, holding quality, shelter direction, what's ashore, and our honest assessment of which work in peak vs shoulder. " +
      "All coordinates are approximate centre-of-anchorage. Captains will use updated chart data for the precise anchor drop. Depths are normal sand-bottom anchorage depths; rock or weed patches exist in most Cycladic bays.",
    bestUseCase:
      "Use this guide to: (1) understand your captain's routing decisions, (2) request specific anchorages on your preference sheet, (3) decide whether Mykonos is the right base for your charter style, and (4) compare against quieter alternative islands.",
    anchorages: [
      {
        name: "Ornos Bay",
        coords: { lat: 37.420, lng: 25.32 },
        depth: "6-12m typical",
        holding: "Good (sand with weed patches)",
        shelter: "Excellent from north (Meltemi). Open to south winds (rare in summer).",
        ashore: "Multiple beach clubs (Kuzina, Branco), restaurants ashore, tender dock available",
        notes: "Mykonos' most popular anchorage. Expect 30+ yachts in peak July-August. Best to arrive by 10am for prime position. Beach club lunch reservations need 24-48 hours advance.",
        bestFor: "First-Mykonos visitors, families wanting beach club access",
      },
      {
        name: "Psarou Beach",
        coords: { lat: 37.418, lng: 25.337 },
        depth: "8-15m",
        holding: "Good (sand)",
        shelter: "Excellent from north, exposed south (rare issue)",
        ashore: "Nammos beach club (Mykonos' most famous), restaurants, beach service to yacht",
        notes: "Glamorous anchorage with high visibility. UHNW yacht concentration. Nammos lunch is an event  -  book 1 week ahead in peak. Beach club tender service to yacht for swimwear shopping etc.",
        bestFor: "Social-scene-focused groups, see-and-be-seen charterers",
      },
      {
        name: "Platis Gialos",
        coords: { lat: 37.410, lng: 25.342 },
        depth: "6-10m",
        holding: "Good (sand and pebbles)",
        shelter: "Excellent from north, open south",
        ashore: "Family-friendly beach, multiple tavernas, water sports concessions",
        notes: "Wider bay than Ornos, easier to find space in peak. Less glamorous than Psarou, more family-friendly. Tender access to several beach tavernas (Avli tou Thodori is recommended).",
        bestFor: "Families with children, casual lunch ashore",
      },
      {
        name: "Paranga Beach",
        coords: { lat: 37.405, lng: 25.348 },
        depth: "8-12m",
        holding: "Good (sand)",
        shelter: "Good from north, open south",
        ashore: "Quieter beach, single taverna ashore, walking trail to Paradise",
        notes: "The quieter alternative to Paradise/Super Paradise. Same southern Mykonos location with less party atmosphere. Excellent swim spot.",
        bestFor: "Families and groups wanting the south coast without the crowds",
      },
      {
        name: "Paradise Beach",
        coords: { lat: 37.402, lng: 25.353 },
        depth: "10-15m",
        holding: "Good (sand)",
        shelter: "Excellent from north, fully exposed south",
        ashore: "Paradise beach club (DJ-driven, daytime party scene), tavernas",
        notes: "Lively daytime atmosphere  -  DJ music carries to anchored yachts. Right anchorage for charterers wanting the Mykonos party vibe from the water. Wrong anchorage for restful afternoons.",
        bestFor: "Party-scene groups, young UHNW guests",
      },
      {
        name: "Super Paradise Beach",
        coords: { lat: 37.401, lng: 25.358 },
        depth: "12-18m",
        holding: "Good (sand)",
        shelter: "Excellent from north, fully exposed south",
        ashore: "JackieO Beach Club (the iconic Mykonos LGBTQ+ scene), tavernas",
        notes: "Atmospheric daytime beach scene. Anchorage deeper than Paradise. JackieO bookings essential in peak. Atmospherically distinct from anywhere else on Mykonos.",
        bestFor: "Atmospheric afternoon scene, themed events",
      },
      {
        name: "Kalafati Beach",
        coords: { lat: 37.443, lng: 25.420 },
        depth: "6-10m",
        holding: "Good (sand)",
        shelter: "Excellent from north (the most-Meltemi-protected Mykonos anchorage)",
        ashore: "Single taverna, surf school, very few crowds",
        notes: "On the east coast, the least-trafficked Mykonos anchorage. Best Meltemi shelter on the island. Often empty even in peak. The captain's escape valve.",
        bestFor: "Meltemi days, charterers wanting solitude near Mykonos",
      },
      {
        name: "Delos Anchorage (off Delos Island)",
        coords: { lat: 37.395, lng: 25.270 },
        depth: "10-18m",
        holding: "Variable (sand with rock patches)",
        shelter: "Good from north, open south",
        ashore: "Delos archaeological site (UNESCO), guided tours, no restaurants",
        notes: "10nm from Mykonos. Tender to Delos for the morning archaeological visit. Anchor watching the Aegean's most important ancient sanctuary. Visit typically 9am-12pm; lunch back on Mykonos.",
        bestFor: "Cultural-focused day trip, archaeology",
      },
    ],
    seasonality:
      "Peak July-August: every Mykonos south-coast anchorage is busy by 11am. Captains arrive early for prime position or accept side-anchorages. Shoulder seasons (June, September): plenty of space, no queues. October: most beach clubs closed, anchorages essentially empty.",
    captainAdvice:
      "On Meltemi days (north winds 25-35 knots), all south-coast anchorages are usable. Kalafati on the east coast is the back-up if south coast is full. The captain should pre-check Nammos and JackieO reservations 48 hours before the planned visit day.",
    relatedPages: [
      { title: "Yacht charter Mykonos", url: "/yacht-charter-mykonos" },
      { title: "2027 charter calendar - join the priority list", url: "/yacht-charter-greece-2027" },
      { title: "Motor yacht charter Mykonos", url: "/motor-yacht-charter-mykonos" },
      { title: "Cyclades cruising guide", url: "/destinations/cyclades" },
    ],
    seoTitle: "Mykonos Yacht Anchorages 2026: Every Bay, Ranked by a Working Broker",
    seoDescription:
      "Every Mykonos yacht anchorage  -  depth, holding, shelter, ashore access. Practical guide from George Yachts for charterers and captains.",
    canonical: "https://georgeyachts.com/yacht-charter-mykonos-anchorages",
  },

  {
    slug: "santorini",
    islandName: "Santorini",
    region: "Cyclades",
    urlPath: "/yacht-charter-santorini-anchorages",
    eyebrow: "Santorini anchorage guide",
    h1: "Santorini Yacht Anchorages: The Complete 2026 Guide",
    tagline:
      "Where to anchor around Santorini  -  the caldera, the south coast, and the smaller alternatives that captains and charterers should know.",
    intro:
      "Santorini's geology defines the anchorage strategy: the caldera is dramatic but deep (60-300m, no anchoring possible  -  yachts use mooring buoys), the south coast offers conventional sand-bottom anchorages, and the east coast provides Meltemi-shielded alternatives. This guide covers every meaningful Santorini anchorage with the practical detail needed for itinerary planning. " +
      "Santorini is best understood as a 1-2 night stop within a larger Cyclades itinerary, not as a charter base. Anchoring is constrained, services are limited compared to Mykonos, and the island's drama is best experienced from anchor at sunset.",
    bestUseCase:
      "Use this guide to plan: (1) which side of Santorini fits your charter  -  caldera-side for the iconic photography, south coast for swimming and lunches; (2) which night to overnight (caldera evening view is essential at least once); (3) tender logistics for Oia/Fira excursions.",
    anchorages: [
      {
        name: "Ammoudi Bay (Oia)",
        coords: { lat: 36.466, lng: 25.355 },
        depth: "Mooring buoys (caldera depth 80-180m)",
        holding: "Mooring only  -  anchor will not hold caldera depths",
        shelter: "Excellent (caldera basin geometry shields from most winds)",
        ashore: "Ammoudi tavernas (famous for fresh fish), tender dock, stairs/donkey path to Oia",
        notes: "The iconic Santorini sunset anchorage. Mooring buoys book 1-2 weeks ahead in peak. Sunset is the unforgettable moment. Ammoudi tavernas (Sunset Ammoudi)  -  book lunch or dinner well in advance.",
        bestFor: "Sunset photography, the Santorini moment, fish dinner ashore",
      },
      {
        name: "Vlychada Marina (south coast)",
        coords: { lat: 36.337, lng: 25.430 },
        depth: "Marina alongside (5-8m for yachts up to 60m)",
        holding: "Marina mooring (not anchorage)",
        shelter: "Excellent",
        ashore: "Small marina town, restaurants, taxi access to Akrotiri archaeological site",
        notes: "Santorini's primary yacht marina. Larger yachts may not fit  -  confirm depth and length with marina office. Tender access to Vlychada beach is the alternative. Restaurants are decent but not destination dining.",
        bestFor: "Yachts needing marina services, overnight stays away from caldera",
      },
      {
        name: "Akrotiri Anchorage",
        coords: { lat: 36.346, lng: 25.405 },
        depth: "6-15m",
        holding: "Good (sand bottom outside the marina basin)",
        shelter: "Excellent from north, open south (rare summer issue)",
        ashore: "Red Beach (the famous volcanic-red sand beach), Akrotiri archaeological site (10 min by tender + walk)",
        notes: "South-coast anchorage near Red Beach. The archaeology  -  Akrotiri Bronze-Age site, one of the world's most important  -  is a half-day excursion. Anchorage less photogenic than caldera but the swimming is excellent.",
        bestFor: "Archaeology, Red Beach swimming, less-trafficked anchorage",
      },
      {
        name: "White Beach",
        coords: { lat: 36.337, lng: 25.397 },
        depth: "8-14m",
        holding: "Good (sand)",
        shelter: "Excellent from north, open south",
        ashore: "Tender-access only beach (no road), single taverna",
        notes: "Wild, dramatic anchorage with white cliffs framing the beach. Less photographed than Red Beach but arguably more striking. Lunch ashore at the single taverna requires VHF call ahead.",
        bestFor: "Dramatic photography, solitude swimming",
      },
      {
        name: "Perissa / Perivolos south coast",
        coords: { lat: 36.354, lng: 25.471 },
        depth: "6-12m",
        holding: "Good (volcanic sand)",
        shelter: "Excellent from north (the south coast is the Meltemi-shielded side of Santorini)",
        ashore: "Long black-sand beach, multiple beach clubs (Theros, JoJo, SeaSide), tavernas, full beach infrastructure",
        notes: "South-east coast. The Santorini equivalent of Mykonos' beach club coast. Several glamorous beach clubs with serious DJ programming in peak summer. Long beach (3km+) so anchorage spreading is possible.",
        bestFor: "Beach club afternoons, longer south-coast stays",
      },
      {
        name: "Thirassia (Manolas Bay)",
        coords: { lat: 36.420, lng: 25.395 },
        depth: "Mooring buoys (caldera depth)",
        holding: "Mooring only",
        shelter: "Good (caldera-protected)",
        ashore: "Small village (population ~250), 2-3 tavernas, donkey path or stairs up to Manolas village",
        notes: "Across the caldera from Santorini. Authentic, sleepy Greek island feel. Sunset views back at Santorini's caldera wall are spectacular. Lunch at Captain John's taverna.",
        bestFor: "Caldera sunset reverse-angle, authentic island lunch",
      },
    ],
    seasonality:
      "Caldera mooring buoys book out 1-2 weeks ahead in July-August. Shoulder season (June, September) has reasonable mooring availability. October: caldera quiet but evening winds can pick up. South-coast anchorages have steadier capacity year-round.",
    captainAdvice:
      "If sunset at Ammoudi is the goal, secure the mooring buoy as part of the contract before charter. Last-minute caldera mooring in peak season is unreliable. South-coast as fallback works well  -  Vlychada or Akrotiri.",
    relatedPages: [
      { title: "Yacht charter Santorini", url: "/yacht-charter-santorini" },
      { title: "2027 charter calendar - join the priority list", url: "/yacht-charter-greece-2027" },
      { title: "Cyclades cruising guide", url: "/destinations/cyclades" },
    ],
    seoTitle: "Santorini Yacht Anchorages 2026: Where to Moor in the Caldera (and Where Not To)",
    seoDescription:
      "Every Santorini yacht anchorage  -  caldera mooring buoys, south-coast options, Thirassia. Depth, holding, shelter, ashore detail. Practical guide.",
    canonical: "https://georgeyachts.com/yacht-charter-santorini-anchorages",
  },

  {
    slug: "paros",
    islandName: "Paros",
    region: "Cyclades",
    urlPath: "/yacht-charter-paros-anchorages",
    eyebrow: "Paros anchorage guide",
    h1: "Paros Yacht Anchorages: The Complete 2026 Guide",
    tagline:
      "Where to anchor around Paros and Antiparos  -  the Cyclades' under-rated central pair with anchorage variety to rival Mykonos.",
    intro:
      "Paros is the Cyclades' geographic centre and arguably the best anchorage island in the chain. The east coast has Meltemi-protected bays, the west coast offers calmer-water swimming, and the channel between Paros and Antiparos is one of the Mediterranean's most beautiful cruising stretches. This guide covers every meaningful Paros anchorage. " +
      "Compared to Mykonos: Paros is quieter, anchorages are less crowded, the food is comparable, and the cost is lower. For repeat Cyclades charterers, Paros increasingly displaces Mykonos as the preferred base.",
    bestUseCase:
      "Use this guide for: (1) planning a Paros-base charter (rare but increasingly compelling); (2) using Paros as the calm-anchorage alternative when Mykonos is full; (3) the Paros-Antiparos channel exploration that defines this island's appeal.",
    anchorages: [
      {
        name: "Naoussa Bay",
        coords: { lat: 37.125, lng: 25.245 },
        depth: "8-15m",
        holding: "Good (sand)",
        shelter: "Excellent from south, open to north Meltemi (the main constraint)",
        ashore: "Naoussa village (one of the Cyclades' prettiest), restaurants (Mario's, Barbarossa), bar scene",
        notes: "Paros' prettiest village and main anchorage. Restaurant scene rivals Mykonos at lower prices. The bay can be uncomfortable on strong Meltemi days  -  captain may relocate to south coast.",
        bestFor: "Village access, dining ashore, evening atmosphere",
      },
      {
        name: "Parikia",
        coords: { lat: 37.085, lng: 25.150 },
        depth: "6-12m",
        holding: "Good (sand and rock)",
        shelter: "Excellent from north (Meltemi-protected on the west side)",
        ashore: "Parikia town (Paros' capital and main port), ferry traffic, restaurants, Panagia Ekatontapyliani church",
        notes: "Larger town than Naoussa, more commercial. Ferry traffic makes the anchorage noisier but the location is convenient for crew provisioning and overnight crew rest. Less atmospheric than Naoussa for guests.",
        bestFor: "Crew provisioning days, ferry transfers, less-photogenic overnight",
      },
      {
        name: "Antiparos Channel (between Paros and Antiparos)",
        coords: { lat: 37.040, lng: 25.115 },
        depth: "5-15m",
        holding: "Good (sand)",
        shelter: "Variable depending on exact spot  -  many small anchorages along the channel",
        ashore: "Tender access to Antiparos town, Despotiko archaeological site, Soros beach",
        notes: "The signature Paros-area cruising. Multiple anchorages along 5km of channel. Soros (south end) is the iconic spot. Despotiko is a small uninhabited islet with an active archaeological dig  -  captain handles permit for landing.",
        bestFor: "The Paros-area highlight cruise, day-long anchorage rotation",
      },
      {
        name: "Soros Bay (Antiparos south)",
        coords: { lat: 36.985, lng: 25.085 },
        depth: "6-12m",
        holding: "Excellent (sand)",
        shelter: "Excellent from all directions",
        ashore: "Beach club (Soros Beach), single taverna, walking access to Antiparos town (45 min)",
        notes: "Arguably the Cyclades' most beautiful turquoise-water anchorage. Soros Beach club is excellent. UHNW-discreet  -  fewer Instagram crowds than Mykonos equivalents.",
        bestFor: "The signature Antiparos moment, UHNW discreet beach day",
      },
      {
        name: "Kolymbithres",
        coords: { lat: 37.130, lng: 25.245 },
        depth: "4-8m",
        holding: "Good (sand)",
        shelter: "Good from north (the rock formations provide unusual shelter)",
        ashore: "Famous rock-formation beach (small, photogenic), beach taverna, hotels above",
        notes: "Distinctive geology  -  large rounded rocks creating natural pools. Photogenic but small anchorage; one yacht at a time really. Tender access for swimming and the famous rocks.",
        bestFor: "Photo-stop, geological-interest swim",
      },
      {
        name: "Pisso Livadi",
        coords: { lat: 37.040, lng: 25.255 },
        depth: "6-10m",
        holding: "Good (sand)",
        shelter: "Good from north and west",
        ashore: "Small fishing village, traditional Greek taverna scene, fishing harbour",
        notes: "Authentic east-coast Paros village. Less touristy than Naoussa. Excellent fresh fish at the harbour tavernas. Off the main cruise route, so quieter.",
        bestFor: "Authentic Greek dinner ashore, off-beaten-path",
      },
    ],
    seasonality:
      "Naoussa peaks in July-August but never reaches Mykonos congestion levels. Antiparos channel busy in peak but with multiple anchorage alternatives. Shoulder season (June, September) is excellent everywhere.",
    captainAdvice:
      "Paros allows the captain more routing flexibility than Mykonos because anchorage alternatives are plentiful. On Meltemi days, the Paros-Antiparos channel south-end (Soros) provides the best calm-water option in the central Cyclades.",
    relatedPages: [
      { title: "Yacht charter Paros", url: "/yacht-charter-paros" },
      { title: "Yacht charter Antiparos", url: "/yacht-charter-antiparos" },
      { title: "Cyclades cruising guide", url: "/destinations/cyclades" },
    ],
    seoTitle: "Paros Yacht Anchorages 2026: Naoussa, Antiparos Channel, and Beyond",
    seoDescription:
      "Every Paros yacht anchorage  -  Naoussa, Parikia, the Antiparos channel, Soros, Kolymbithres. Practical depth, holding, and ashore detail for charterers.",
    canonical: "https://georgeyachts.com/yacht-charter-paros-anchorages",
  },

  {
    slug: "corfu",
    islandName: "Corfu",
    region: "Ionian",
    urlPath: "/yacht-charter-corfu-anchorages",
    eyebrow: "Corfu anchorage guide",
    h1: "Corfu Yacht Anchorages: The Complete 2026 Guide",
    tagline:
      "Where to anchor around Corfu and the northern Ionian  -  the green, calm, wind-protected antidote to Cyclades chartering.",
    intro:
      "Corfu sits at the head of the Ionian and offers a fundamentally different anchorage experience than the Cyclades. The water is calmer (no Meltemi), the landscape is green and tree-covered, the anchorages are sheltered, and the cruising is gentler. Corfu suits charterers who want the relaxed-pace Greek experience without the wind and crowds. " +
      "This guide covers Corfu's main anchorages plus the nearby Diapontia islands (Erikoussa, Othoni, Mathraki) that form the natural day-cruise extension.",
    bestUseCase:
      "Use this guide for: (1) planning a Corfu-base Ionian charter; (2) understanding why repeat charterers move from Cyclades to Ionian; (3) the Diapontia day-cruise extensions that few charterers know about.",
    anchorages: [
      {
        name: "Kassiopi",
        coords: { lat: 39.787, lng: 19.918 },
        depth: "6-12m",
        holding: "Good (sand)",
        shelter: "Excellent from all directions (deeply protected harbour)",
        ashore: "Charming village with castle ruins, restaurants, water sports, beaches",
        notes: "Corfu's most-visited charter anchorage. The village is one of the prettiest in the Ionian. Multiple restaurants of good quality. Castle ruins above the harbour for sunset walk.",
        bestFor: "Atmospheric village dinner, scenic harbour, family-friendly",
      },
      {
        name: "Sidari & Canal d'Amour",
        coords: { lat: 39.792, lng: 19.703 },
        depth: "5-10m",
        holding: "Good (sand)",
        shelter: "Good from south, open north (rare summer issue)",
        ashore: "Unique limestone formations creating natural pools, beach bars",
        notes: "The Canal d'Amour rock formations are the visual highlight. Anchorage less developed than Kassiopi  -  quieter but fewer dining options ashore.",
        bestFor: "Geological photography, swimming in natural pools",
      },
      {
        name: "Paleokastritsa",
        coords: { lat: 39.671, lng: 19.713 },
        depth: "8-18m",
        holding: "Good (sand with rock patches)",
        shelter: "Excellent from north, open south (rare issue)",
        ashore: "Multiple coves to choose from, monastery on the hill, restaurants, beach access",
        notes: "Corfu's most photographed coastline. Multiple small bays  -  the captain picks based on conditions and how full each is. Monastery visit (Theotokos) is the cultural highlight.",
        bestFor: "Iconic Corfu photography, monastery visit",
      },
      {
        name: "Agni Bay",
        coords: { lat: 39.802, lng: 19.928 },
        depth: "5-10m",
        holding: "Good (sand)",
        shelter: "Excellent",
        ashore: "Famous Agni tavernas (Taverna Agni, Toulas)  -  three world-class fish restaurants in a single small bay",
        notes: "The Ionian's culinary anchorage. Three excellent tavernas, all on the waterfront. Lunch or dinner ashore at Agni is a Corfu signature. Bay is small so anchorage spreads beyond.",
        bestFor: "Dining ashore  -  the Ionian's best concentration of fresh-fish tavernas",
      },
      {
        name: "Erikoussa (Diapontia island)",
        coords: { lat: 39.872, lng: 19.582 },
        depth: "6-12m",
        holding: "Good (sand)",
        shelter: "Excellent from south and east",
        ashore: "Single village, beach taverna, sandy beach, very few tourists",
        notes: "12nm northwest of Corfu. Day-cruise destination. One of the Ionian's most-isolated inhabited islands. Beach is excellent for swimming. Family-friendly easy day.",
        bestFor: "Day cruise away from Corfu congestion, family swim day",
      },
      {
        name: "Lakka (Paxos)",
        coords: { lat: 39.235, lng: 20.130 },
        depth: "4-10m",
        holding: "Good (sand)",
        shelter: "Excellent from all directions",
        ashore: "Picture-perfect village, restaurants, walking trails, swimming beaches",
        notes: "Paxos' northern anchorage, 20nm south of Corfu. Worth a 1-2 night visit on any Corfu-based charter. The village atmosphere is exceptional. Restaurants  -  La Rosa di Paxos, Akis  -  are world-class.",
        bestFor: "Paxos overnight from Corfu base, village atmosphere",
      },
    ],
    seasonality:
      "Corfu's anchorage capacity is generous  -  even peak July-August rarely creates anchorage queues. Shoulder seasons (May-June, September) are essentially empty of charter traffic. October is the Ionian's quiet jewel  -  water still 22°C, restaurants open, no crowds.",
    captainAdvice:
      "Corfu doesn't have a Meltemi issue. Routing decisions are driven by the day's activity plan, not wind. Captain flexibility is highest in the Ionian  -  itinerary changes are easier than in the Cyclades.",
    relatedPages: [
      { title: "Yacht charter Corfu", url: "/yacht-charter-corfu" },
      { title: "Yacht charter Paxos", url: "/yacht-charter-paxos" },
      { title: "Ionian cruising guide", url: "/destinations/ionian" },
    ],
    seoTitle: "Corfu Yacht Anchorages 2026: Kassiopi, Paleokastritsa, Agni Bay",
    seoDescription:
      "Every Corfu yacht anchorage  -  Kassiopi, Paleokastritsa, Agni dining bay, Diapontia islands. Wind-sheltered Ionian alternatives to Cyclades.",
    canonical: "https://georgeyachts.com/yacht-charter-corfu-anchorages",
  },

  {
    slug: "hydra",
    islandName: "Hydra",
    region: "Saronic",
    urlPath: "/yacht-charter-hydra-anchorages",
    eyebrow: "Hydra anchorage guide",
    h1: "Hydra Yacht Anchorages: The Complete 2026 Guide",
    tagline:
      "Where to anchor around Hydra  -  Greece's car-free, donkey-only island whose harbour anchorage is one of the Mediterranean's most photogenic.",
    intro:
      "Hydra is unlike anywhere else in Greek chartering. No cars are permitted on the island. Transportation is by donkey or on foot. The harbour-town architecture  -  18th-century captain's mansions in tiered ascending semicircle  -  is among Greece's most beautiful settings. " +
      "Anchorage at Hydra is a different problem than the Cyclades. The harbour is deep and small; mooring is the norm rather than anchoring. The surrounding coastline has limited side-anchorages. This guide covers what works.",
    bestUseCase:
      "Use this guide for: (1) understanding the practical constraints of Hydra anchorage; (2) planning the perfect Hydra evening (anchor at sunset, tender into harbour for dinner ashore, return for the iconic harbour-lit overnight); (3) side-anchorages for daytime swimming.",
    anchorages: [
      {
        name: "Hydra Town Harbour",
        coords: { lat: 37.349, lng: 23.466 },
        depth: "Stern-to mooring (deep harbour, 30-40m bottom)",
        holding: "Mooring chains laid by harbour authority",
        shelter: "Excellent from all directions",
        ashore: "Hydra Town  -  restaurants (Sunset, Omilos), shops, art galleries, walks",
        notes: "The signature Hydra moment. Yachts moor stern-to along the harbour wall. Space is constrained  -  for yachts above 40m, harbour entry needs advance arrangement with the port authority. The harbour-mooring experience at evening (lights coming on across the amphitheatre town) is unforgettable.",
        bestFor: "The Hydra experience, harbour evening, dining ashore",
      },
      {
        name: "Vlychos",
        coords: { lat: 37.343, lng: 23.450 },
        depth: "8-15m",
        holding: "Good (sand and weed)",
        shelter: "Good from north, open south (rare issue)",
        ashore: "Small beach, single beach taverna (Marina), no road access  -  donkey or walking path from Hydra Town (20 min)",
        notes: "The main daytime swim anchorage 2nm west of Hydra Town. Quiet, family-friendly, excellent fresh-fish taverna ashore. Yachts typically morning here for swim, then move to Hydra Town for evening.",
        bestFor: "Daytime swim, lunch ashore, escape from harbour bustle",
      },
      {
        name: "Bisti",
        coords: { lat: 37.317, lng: 23.412 },
        depth: "10-18m",
        holding: "Good (sand)",
        shelter: "Excellent from north",
        ashore: "Beach taverna (Bisti), uninhabited beach, walking trail to Hydra Town (45 min)",
        notes: "Western Hydra. Quieter than Vlychos. Bisti taverna is family-run, excellent fish. The walk to Hydra is for fit guests only  -  recommend tender transfer for the elderly.",
        bestFor: "Quiet swim, off-the-beaten-path lunch",
      },
      {
        name: "Mandraki",
        coords: { lat: 37.354, lng: 23.487 },
        depth: "6-12m",
        holding: "Good (sand)",
        shelter: "Good from north",
        ashore: "Small beach, single hotel/restaurant (Mandraki resort), tender access to Hydra Town (15 min walk)",
        notes: "East of Hydra Town. The closest beach anchorage to the harbour. Resort restaurant is a beach-club style lunch venue. Good first-stop on Hydra arrivals.",
        bestFor: "First-day Hydra orientation, beach lunch close to town",
      },
      {
        name: "Plakes (Dokos Island, off Hydra)",
        coords: { lat: 37.337, lng: 23.348 },
        depth: "6-12m",
        holding: "Good (sand)",
        shelter: "Excellent from all directions",
        ashore: "Uninhabited Dokos island  -  single small chapel, no taverna",
        notes: "5nm west of Hydra. The Saronic's most isolated anchorage. Dokos is uninhabited. Total privacy. Best as a self-contained morning anchor with breakfast aboard before pushing on.",
        bestFor: "Maximum privacy, private morning at anchor",
      },
    ],
    seasonality:
      "Hydra harbour fills with yachts every evening in July-August. Mooring arrangement essential 1-2 days in advance for large yachts. Shoulder seasons (May-June, September) have ample harbour capacity. October Hydra is one of Greece's best charter moments  -  warm, quiet, beautifully lit evenings.",
    captainAdvice:
      "If Hydra harbour mooring is the goal, captain pre-arranges with port authority via VHF 6 hours before approach. For yachts above 50m, harbour entry can be denied during very full evenings  -  anchor at Mandraki and tender in is the fallback. Hydra is one of the Mediterranean's must-do anchorages but the logistics require planning.",
    relatedPages: [
      { title: "Yacht charter Hydra", url: "/yacht-charter-hydra" },
      { title: "Yacht charter Spetses", url: "/yacht-charter-spetses" },
      { title: "Saronic cruising guide", url: "/destinations/saronic" },
    ],
    seoTitle: "Hydra Yacht Anchorages 2026: Harbour Moorings, Vlychos, Bisti (Broker Guide)",
    seoDescription:
      "Every Hydra yacht anchorage  -  the famous harbour mooring, Vlychos lunch bay, Bisti, Mandraki. Practical mooring and tender detail for the Saronic's iconic island.",
    canonical: "https://georgeyachts.com/yacht-charter-hydra-anchorages",
  },
];

export const ISLAND_ANCHORAGES = [...BASE_ISLAND_ANCHORAGES, ...EXTRA_ISLAND_ANCHORAGES];

export function getAnchorageGuideBySlug(slug) {
  return ISLAND_ANCHORAGES.find((a) => a.slug === slug) || null;
}
