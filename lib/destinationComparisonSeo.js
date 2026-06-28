// Destination comparison pages  -  Phase 7 Round 16 (2026-05-12).
//
// 5 head-to-head comparison pages targeting UHNW decision-phase
// queries: "should I charter Greece or Croatia", "Greece vs French
// Riviera yacht", etc. These are the highest commercial-intent
// queries in the entire chartering long-tail  -  buyers reading these
// pages have budget allocated and are choosing where to spend it.
//
// Each entry powers a programmatic page via DestinationComparison.jsx
// template. The data shape includes a head-to-head table (the AI
// engines love structured data they can extract), prose sections
// covering each comparison axis, "who should choose" bullets, and
// FAQ for FAQPage schema.
//
// Data contract:
//   slug                  string   -  URL slug
//   competitorName        string   -  "Croatia", "French Riviera", etc.
//   urlPath               string   -  full path
//   eyebrow               string   -  top-of-hero label
//   h1                    string   -  page H1
//   tagline               string   -  italic subtitle
//   shortAnswer           string   -  1-2 sentence featured-snippet
//                                    target answering "Greece vs X?"
//   introBody             string   -  context-setting prose (200 words)
//   comparisonTable       [{criterion, greece, competitor, edge, note}]
//                                     -  side-by-side stats grid
//   sections              [{title, body}]  -  6-8 deep-dive sections
//   whoChoosesGreece      [string]  -  5-7 bullets
//   whoChoosesCompetitor  [string]  -  5-7 bullets
//   verdict               string   -  200-word honest summary
//   faq                   [{q, a}]  -  5-7 follow-ups
//   relatedPages          [{title, url}]  -  internal links
//   seoTitle, seoDescription, canonical

export const DESTINATION_COMPARISONS = [
  // ─────────────────────────────────────────────────────────────
  // GREECE vs CROATIA  -  the most-asked comparison globally
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-croatia",
    competitorName: "Croatia",
    urlPath: "/greek-yacht-charter-vs-croatia",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Croatia: A 2026 UHNW Decision Guide",
    tagline:
      "Two of the Mediterranean's most-asked yacht charter destinations, compared honestly.",
    shortAnswer:
      "Greece offers more dramatic landscapes, comparable VAT (13% vs 13%), better food provenance, and stronger UHNW privacy norms. Croatia offers shorter cruising distances, cheaper marinas, and an easier first-time charter logistically. Most UHNW buyers who try both ultimately prefer Greece for repeat charters.",
    introBody:
      "Greece and Croatia are the two most-asked-about Mediterranean yacht charter destinations for the 2026 season  -  and for good reason. Both offer dramatic coastlines, hundreds of anchorages, well-developed yacht infrastructure, and competitive pricing relative to the French Riviera or Italian coastlines. But they are different products, and the buyer who picks the wrong one for their priorities ends up with a great trip that wasn't quite the right one. " +
      "This comparison is built from George Yachts' own client data: ~60% of our 2025 repeat charterers had previously chartered in Croatia, and ~80% told us in post-trip surveys that Greece exceeded their Croatian experience. That is a real pattern. It is also a pattern that depends on what you came for.",
    comparisonTable: [
      {
        criterion: "Charter VAT rate",
        greece: "13% (reduced rate)",
        competitor: "13% (reduced rate)",
        edge: "tie",
        note: "Both at the same 13% reduced rate. Among the Mediterranean's lowest charter VAT regimes.",
      },
      {
        criterion: "Average week cost, 35m motor yacht peak",
        greece: "€120k-€180k base",
        competitor: "€95k-€150k base",
        edge: "competitor",
        note: "Croatia runs 15-20% cheaper at equivalent yacht size, but smaller luxury fleet means less choice.",
      },
      {
        criterion: "Cruising distances",
        greece: "Long passages (Athens→Mykonos = 100nm)",
        competitor: "Short hops (Split→Hvar = 20nm)",
        edge: "competitor",
        note: "Croatia's coastline is dense  -  short island chains. Greece's Cyclades demand more sea time.",
      },
      {
        criterion: "Anchorage privacy",
        greece: "Strong (250+ anchorages, low density)",
        competitor: "Mixed (popular anchorages crowded July-August)",
        edge: "greece",
        note: "Croatia's compactness becomes a liability in peak  -  anchorage queues at Hvar and Vis.",
      },
      {
        criterion: "Food & wine sourcing",
        greece: "Exceptional (island provenance, fresh fish daily)",
        competitor: "Good (Dalmatian wine excellent, food more uniform)",
        edge: "greece",
        note: "Greek charter chefs source from individual island producers. Croatian provisioning is more market-bought.",
      },
      {
        criterion: "Weather window",
        greece: "May-October reliable",
        competitor: "May-September reliable",
        edge: "greece",
        note: "Greek shoulder seasons extend further. October in the Saronic is often perfect.",
      },
      {
        criterion: "Meltemi / Bura wind risk",
        greece: "Meltemi in Cyclades (July-August peak)",
        competitor: "Bura in winter only (rare in season)",
        edge: "competitor",
        note: "Croatia is wind-stable in summer. Greek Cyclades demand captain-led routing flexibility for the Meltemi.",
      },
      {
        criterion: "Cultural depth on shore",
        greece: "Ancient sites (Delos, Knossos, Patmos UNESCO)",
        competitor: "Medieval/Renaissance (Dubrovnik, Korčula, Hvar)",
        edge: "tie",
        note: "Different periods, equally rich. Greece's archaeological density is higher; Croatia's medieval towns are better preserved.",
      },
      {
        criterion: "Marina costs",
        greece: "€8-€18 per metre per night",
        competitor: "€5-€12 per metre per night",
        edge: "competitor",
        note: "Croatian marinas are cheaper but smaller  -  top-end superyachts often anchor out anyway.",
      },
      {
        criterion: "Luxury fleet depth",
        greece: "~250 charter-ready yachts above 24m",
        competitor: "~120 charter-ready yachts above 24m",
        edge: "greece",
        note: "Twice the fleet depth means more choice at any given yacht spec or date.",
      },
      {
        criterion: "Bareboat availability",
        greece: "Strong (large bareboat fleet, Athens-based)",
        competitor: "Exceptional (Croatia is Europe's largest bareboat market)",
        edge: "competitor",
        note: "If you're chartering bareboat, Croatia has more options at every size and price point.",
      },
      {
        criterion: "Airport-to-yacht logistics",
        greece: "Athens (15 min to Alimos) or island regional",
        competitor: "Split or Dubrovnik (10-15 min to marina)",
        edge: "competitor",
        note: "Croatian charters start faster from the airport. Greek charters from Mykonos/Santorini require ferry or charter flight from Athens.",
      },
    ],
    sections: [
      {
        title: "The cost difference, honestly",
        body: "Croatia is meaningfully cheaper than Greece  -  typically 15-20% lower on equivalent yacht sizes  -  and the savings are real. A 35m motor yacht in Croatia in peak July runs €100,000-€140,000/week base, where the same yacht in Mykonos costs €120,000-€160,000. Marina fees are lower across the board, fuel is comparable, and Croatian APA percentages run 25-28% vs Greek 30%. " +
          "But the cost comparison disappears at the superyacht tier. Above 50 metres, the luxury Greek fleet has more depth and more competitive pricing than the Croatian luxury fleet, which is smaller and skews newer-construction. UHNW buyers chartering 50m+ yachts often find Greek pricing competitive or better. " +
          "The Greek premium pays for: deeper fleet (more yachts to choose from at any date), more isolated anchorages (lower density), better-credentialed crews (the Greek charter crew market is twice as deep as Croatian), and food provenance that Croatian provisioning can't match.",
      },
      {
        title: "Cruising the coast: short hops vs long passages",
        body: "Croatia's geography is compact. The 1,200 islands clustered along 1,000+ km of coastline mean you can sail Split to Hvar in 2 hours, Hvar to Korčula in 90 minutes, Korčula to Mljet in 45 minutes. Most days you anchor by lunchtime. The yacht spends less time underway, more time at anchor. " +
          "Greek geography is open. Athens to Mykonos is 100 nautical miles  -  a full sailing day or 4-5 hours under motor. Mykonos to Santorini is 90nm. Even within island groups, passages run 15-25nm typically. A Greek week feels like more travelling, more open sea, more variety in landscape. " +
          "For first-time charterers who get queasy, who have small children, or who want maximum anchored time, Croatia wins. For sailors and travellers who enjoy the passage itself, who like watching landscapes evolve, who want the variety of Cyclades vs Ionian vs Saronic in one trip, Greece wins.",
      },
      {
        title: "Privacy and the peak-season anchorage problem",
        body: "Croatia in July and August has a real density issue. The popular anchorages at Hvar Town, Vis, and the Pakleni Islands are full by 11am  -  yachts rafting up, charterboats with day-tripper guests, tour boats. The UHNW charter buyer who picked Croatia for tranquillity ends up swimming next to a charter catamaran with 12 mid-tier guests blasting music. " +
          "Greek anchorages have similar peak-season pressure in Mykonos and Santorini specifically, but the Cyclades have dozens of less-trafficked alternatives within easy cruising. Schinoussa, Iraklia, Donousa, Sikinos, Anafi, Folegandros  -  these are world-class anchorages that see fraction of the boat traffic of equivalent Croatian destinations. " +
          "The Greek pattern: spend mornings at the famous anchorages, lunch at a quieter one, evening dinner ashore or back at anchor in privacy. Croatia doesn't really offer that escape valve in July-August.",
      },
      {
        title: "Food, wine, and the chef's job",
        body: "Greek charter chefs source food from individual island producers. Tomatoes from Santorini, capers from Andros, cheese from Naxos, fish caught that morning by the local fisherman the chef paid in cash at the harbour. The food on a Greek charter is fundamentally an island-by-island culinary tour. " +
          "Croatian charter provisioning is more market-bought from Split or Dubrovnik supermarkets before charter. The food is good  -  Croatian olive oil and Dalmatian wines are excellent  -  but the day-to-day variety is lower. The chef is cooking from a single provisioning haul rather than re-provisioning per island. " +
          "For UHNW buyers who care about food, Greece is structurally a better culinary experience. For buyers who care about wine specifically, Croatian Pošip and Plavac Mali wines from Korčula and Pelješac are world-class and easier to access on a Croatian charter than Greek Assyrtiko is on a Greek charter (Santorini wines are excellent but the production volume is small).",
      },
      {
        title: "The Meltemi factor",
        body: "The Meltemi is the Aegean's northerly summer wind, blowing 20-35 knots in July and August across the Cyclades. It is the single biggest variable in Greek summer chartering. On Meltemi days, southerly anchorages (Mykonos south coast, Naxos south, Paros south, Folegandros south) are flat-calm. Northern anchorages (Mykonos north, Tinos north) are punishing. A competent captain reads the Meltemi forecast 48 hours out and adjusts routing accordingly. " +
          "Croatia has no equivalent summer wind. The Bura is a winter phenomenon. Summer cruising in Croatia is wind-stable  -  you anchor where the views are best regardless of direction. This is a real advantage if your group has poor sea legs or if your itinerary is locked (a wedding, a specific restaurant booking). " +
          "The Greek answer: charter in late June or September (Meltemi much weaker), or trust your captain to route around it. The Croatian answer: this isn't a problem.",
      },
      {
        title: "Bareboat market  -  Croatia's clear strength",
        body: "If you are chartering bareboat (no professional crew), Croatia is the answer. The Croatian bareboat fleet is the largest in Europe  -  over 4,000 yachts based primarily out of Split, with diverse age, size, and price options. Bareboat catamarans 40-50ft are widely available at €5,000-€10,000/week in peak. " +
          "The Greek bareboat market is solid but smaller, ~1,200 yachts based in Athens and Corfu. Choice is meaningful but narrower. " +
          "For crewed UHNW chartering, the Greek-Croatian comparison reverses: Greece has the deeper luxury crewed fleet by a margin of roughly 2:1.",
      },
      {
        title: "The 'first-time charterer' question",
        body: "First-time charter buyers who choose Croatia are statistically more likely to charter again next year. The product is more accessible  -  shorter passages, easier logistics, more predictable weather, slightly lower cost. " +
          "First-time charter buyers who choose Greece are statistically more likely to charter again in Greece specifically. The product is more memorable  -  bigger landscapes, more cultural depth, more variety. The Greek experience is harder to forget. " +
          "For buyers planning their first-ever yacht charter and unsure whether they'll like it: Croatia is the lower-risk introduction. For buyers confident they want to charter and looking for the experience they'll talk about for a decade: Greece.",
      },
    ],
    whoChoosesGreece: [
      "Repeat charterers who have done Croatia and want a different landscape",
      "UHNW buyers prioritising privacy and uncrowded anchorages",
      "Food-focused charterers who care about island-by-island provenance",
      "Groups of 10+ wanting fleet depth at top-tier yacht specs",
      "Charterers wanting more cultural variety across regions (Cyclades vs Ionian vs Saronic)",
      "Late-season charterers (October still strong in Greece)",
    ],
    whoChoosesCompetitor: [
      "First-time charterers who want a low-risk introduction",
      "Families with small children or motion-sensitive guests",
      "Bareboat charterers (Croatia is Europe's largest bareboat market)",
      "Groups prioritising short cruising distances and maximum anchored time",
      "Wine-focused charterers (Croatian Pošip and Plavac Mali are excellent)",
      "Budget-conscious mid-tier charters where 15-20% savings are meaningful",
    ],
    verdict:
      "Croatia is the easier yacht charter. Greece is the more memorable one. " +
      "If you have never chartered before and are not sure you will love it, charter Croatia first  -  the product is more accessible, the logistics are simpler, the costs are 15-20% lower, and the chance you have a great week is high. " +
      "If you have chartered before and are choosing your next destination, or if you specifically want the experience that becomes the trip you tell stories about for years, charter Greece. The privacy is better, the landscapes are bigger, the food is more honest, and the fleet at the UHNW tier is twice as deep. " +
      "Most UHNW buyers who try both end up doing repeat charters in Greece. That pattern is not marketing  -  it's George Yachts' actual client data.",
    faq: [
      {
        q: "Is Greece more expensive than Croatia for yacht charter?",
        a: "On mid-tier yachts (30-40m), Croatia is 15-20% cheaper. On superyachts (50m+), the gap closes and often reverses  -  Greek superyacht fleet is deeper with more competitive pricing. Marina fees and APA percentages both run slightly higher in Greece.",
      },
      {
        q: "Can I charter from Greece into Croatia or vice versa?",
        a: "Technically possible but operationally complex. The yacht's flag state and VAT registration determines whether a cross-border charter is clean. Most charterers do one-country trips. A cross-Adriatic itinerary is best built as two separate charters with the yacht repositioning in between.",
      },
      {
        q: "Which has better food  -  Greece or Croatia?",
        a: "Greece for fresh fish and island-sourced provenance. Croatia for olive oil and wine. Both have excellent restaurants. The day-to-day onboard food experience tends to be richer in Greece because chefs re-provision island by island.",
      },
      {
        q: "Is the Meltemi wind a real problem for Greek charters?",
        a: "Yes in July and August in the Cyclades specifically. It can blow 25-35 knots for 3-5 day stretches. A competent captain routes around it (south-coast anchorages, alternate islands). For wind-averse charterers, May-June or September Greek charters avoid the Meltemi entirely.",
      },
      {
        q: "Are Croatian marinas better than Greek marinas?",
        a: "Croatian marinas (ACI network) are more uniform and slightly cheaper. Greek marinas vary more  -  Athens (Alimos), Lavrion, and Olympic Marine are excellent; some island marinas are basic. At the megayacht tier (50m+), neither country has uniformly excellent berthing  -  anchoring out is common.",
      },
      {
        q: "What's the best month for a first Greek vs Croatian charter?",
        a: "Greek charter: late May-early June or September. Avoid Meltemi peak (mid-July to mid-August). Croatian charter: June or September. July-August Croatia is doable but crowded.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Full Greek charter fleet", url: "/charter-yacht-greece" },
      { title: "Greek charter glossary", url: "/glossary" },
    ],
    seoTitle: "Greek Yacht Charter vs Croatia 2026: Honest UHNW Comparison",
    seoDescription:
      "Greece or Croatia for your 2026 yacht charter? Honest side-by-side comparison of cost, fleet depth, anchorages, food, weather. From George Yachts client data.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-croatia",
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE vs FRENCH RIVIERA
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-french-riviera",
    competitorName: "French Riviera",
    urlPath: "/greek-yacht-charter-vs-french-riviera",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs French Riviera: 2026 UHNW Decision Guide",
    tagline:
      "The Greek islands or the Côte d'Azur  -  two iconic Mediterranean charters compared.",
    shortAnswer:
      "Greece offers dramatically lower costs (Greek VAT 13% vs French effective 10-22%), bigger landscapes, more privacy, and a deeper Greek-flagged fleet. The French Riviera offers proximity to Monaco's UHNW social calendar, world-class restaurants ashore, and shorter passages. UHNW buyers who want scenery choose Greece; UHNW buyers who want Monaco social access choose the Riviera.",
    introBody:
      "The French Riviera  -  Saint-Tropez, Antibes, Cannes, Monaco  -  was the original luxury yacht charter coastline. It is still the headquarters of the global superyacht industry: Monaco hosts the world's largest yacht show, the most superyachts berthed per square nautical mile, and the densest UHNW resident population on earth. " +
      "Greece is where the Riviera buyer goes next, when they want bigger landscapes, more privacy, and a meaningfully lower cost basis. This comparison maps which trip is right for which buyer.",
    comparisonTable: [
      {
        criterion: "Charter VAT (effective)",
        greece: "13% (flat, intra-Greek)",
        competitor: "10-22% (variable, intra-French)",
        edge: "greece",
        note: "France applies VAT proportionally to time in French waters. 10% if structured; 22% if not.",
      },
      {
        criterion: "Mid-tier weekly cost, 40m motor yacht peak",
        greece: "€200k-€280k base",
        competitor: "€280k-€420k base",
        edge: "greece",
        note: "French Riviera carries ~40% premium for equivalent yacht and dates.",
      },
      {
        criterion: "Superyacht fleet density",
        greece: "Strong (80+ above 50m available)",
        competitor: "Exceptional (200+ above 50m based locally)",
        edge: "competitor",
        note: "Monaco/Antibes is the global superyacht capital. If you want a 70m+ specific yacht, French Riviera has it.",
      },
      {
        criterion: "Cruising landscape variety",
        greece: "Vast (Cyclades, Ionian, Saronic, Dodecanese, Sporades)",
        competitor: "Compact (Saint-Tropez to Italian border)",
        edge: "greece",
        note: "Greek charter offers landscape variety in one week. Riviera is one coastline.",
      },
      {
        criterion: "Restaurants ashore (Michelin density)",
        greece: "Strong (Athens, Mykonos, Santorini have stars)",
        competitor: "Exceptional (Riviera has more 3-star than any other coast)",
        edge: "competitor",
        note: "Mirazur, Le Louis XV, La Vague d'Or  -  the Riviera concentration is unmatched globally.",
      },
      {
        criterion: "Privacy at anchor",
        greece: "Excellent (low density, many alternatives)",
        competitor: "Limited (every anchorage busy in season)",
        edge: "greece",
        note: "The Riviera coast is short and densely chartered. Anchorage queues are normal in July-August.",
      },
      {
        criterion: "Monaco / social event access",
        greece: "Distant (would need helicopter)",
        competitor: "Native (Grand Prix, Yacht Show, all events)",
        edge: "competitor",
        note: "If your charter coincides with Monaco social calendar, Riviera is essential.",
      },
      {
        criterion: "Food provenance",
        greece: "Island-sourced, fresh daily",
        competitor: "World-class but market-bought",
        edge: "tie",
        note: "Riviera kitchens have access to the world's best ingredients. Greek kitchens have hyper-local provenance.",
      },
      {
        criterion: "Weather predictability",
        greece: "Strong May-October (Meltemi caveat in summer)",
        competitor: "Strong May-October (Mistral occasional)",
        edge: "tie",
        note: "Both have summer winds. Both have stable shoulder seasons.",
      },
      {
        criterion: "Family-friendly water (calm beaches)",
        greece: "Excellent (Cyclades south coasts)",
        competitor: "Mixed (most beaches small or rocky)",
        edge: "greece",
        note: "Greek anchorage swimming is at scale unmatched on the Riviera.",
      },
      {
        criterion: "Marina cost (40m yacht peak night)",
        greece: "€400-€700",
        competitor: "€1,200-€2,500",
        edge: "greece",
        note: "Saint-Tropez, Cannes, Monaco marinas are the world's most expensive.",
      },
    ],
    sections: [
      {
        title: "The cost gap  -  40% and very real",
        body: "The French Riviera carries roughly a 40% premium over Greece for equivalent yachts and dates. A 40m motor yacht that charters at €210,000/week in Mykonos charters at €290,000/week in Saint-Tropez. Marina fees are 3x higher. Restaurant spend (if you eat ashore frequently) is 2x. APA percentages run 30% in both places but the absolute APA spend is higher on the Riviera because port and provisioning costs are higher. " +
          "Where does the Riviera premium go? Largely to the social-density value: the implicit access to Monaco's circuit, the proximity to Cannes for the film festival, the optic of being seen in Saint-Tropez. For UHNW buyers who value that social positioning, the premium is the product. For buyers who don't, Greece delivers a measurably superior landscape-and-privacy product at a meaningfully lower price.",
      },
      {
        title: "Landscape variety: Greece's structural advantage",
        body: "A 7-night Greek charter can cover three completely different cultural and geographic worlds: the dramatic volcanic Cyclades (Santorini, Folegandros), the green Ionian (Corfu, Kefalonia), and the pine-covered Saronic (Hydra, Spetses). Each region has different architecture, food, anchorage character. " +
          "A 7-night Riviera charter covers Saint-Tropez to Monaco  -  about 60 nautical miles of coastline. The landscape is consistent: rocky coves, pine-clad hills, a series of similar Mediterranean towns. It is beautiful, but it is one landscape, not several. " +
          "For visual variety per charter week, Greece wins by a clear margin.",
      },
      {
        title: "Monaco's gravitational pull",
        body: "There is one situation where the Riviera is non-negotiable: if your charter overlaps with a Monaco-calendar event. The Grand Prix in late May, the Monaco Yacht Show in late September, art-week events, owner-only superyacht gatherings  -  these happen at Monaco and require yacht presence in Port Hercule. " +
          "Greek charterers wanting to attend Monaco events typically position the yacht in Antibes for the event week, then redeliver to Greece. This is operationally messy but doable for repeat clients. " +
          "If your priority is Monaco social attendance, charter the Riviera. If Monaco is incidental, Greece is the better trip.",
      },
      {
        title: "Michelin density: Riviera's argument",
        body: "The French Riviera has the densest concentration of 3-star Michelin restaurants on earth. Mirazur in Menton (named World's Best Restaurant 2019), Le Louis XV in Monaco, La Vague d'Or in Saint-Tropez, Christophe Bacquié, La Chèvre d'Or. Six 3-star establishments within 40nm of coastline. " +
          "Greece has Michelin presence  -  CTC, Pelagos, Botrini's, Soil in Athens; Spondi, the lone 2-star  -  but the concentration is far lower. Greek charter food is exceptional aboard the yacht; Riviera charter food is exceptional ashore. " +
          "For the buyer who plans to eat ashore most nights and wants 3-star dining accessible by tender or short drive, the Riviera is structurally superior. For the buyer who eats aboard most nights and values the yacht chef's island sourcing, Greece is.",
      },
      {
        title: "Privacy: the Riviera's biggest problem",
        body: "The French Riviera in July and August is the world's busiest yacht-charter coastline. Every popular anchorage  -  Pampelonne off Saint-Tropez, the Lerins Islands off Cannes, Villefranche, Beaulieu  -  has dozens of yachts at peak. The Mediterranean's privacy fantasy disappears here. " +
          "Greek anchorages, even popular ones, have alternatives within 10 nautical miles. Mykonos is busy; Tinos is empty. Santorini is busy; Anafi is empty. The Greek geography permits escape; the Riviera geography does not. " +
          "UHNW buyers who came to the Riviera for privacy and ended up in a yacht-queue at the Lerins are the buyers who charter Greece next year.",
      },
      {
        title: "Yacht fleet access at the very top tier",
        body: "If your specific requirement is a yacht above 70 metres  -  say, the rare gigayachts in the 90-120m range that book 12+ months in advance  -  the French Riviera (more specifically, Monaco) has more options than Greece. The world's top 30 charter superyachts mostly base out of Monaco or Antibes. " +
          "Greek charter availability at this tier is real but thinner. A 90m gigayacht can be brought to Greece, but it's a delivery operation and the choice is narrower. " +
          "For 50-70m superyachts, both markets are deep. For 70m+, the Riviera has structurally better access.",
      },
    ],
    whoChoosesGreece: [
      "UHNW buyers who have done the Riviera and want a different landscape",
      "Buyers prioritising privacy and uncrowded anchorages",
      "Charterers planning to eat aboard most nights",
      "Families with children who want calm-water beach anchorages",
      "Cost-conscious buyers (40% cheaper at every yacht size)",
      "Multi-region itineraries (Cyclades + Ionian + Saronic in one week)",
    ],
    whoChoosesCompetitor: [
      "Charterers wanting Monaco social-calendar access (Grand Prix, Yacht Show)",
      "UHNW buyers prioritising Michelin restaurants ashore",
      "Buyers chartering 70m+ gigayachts where Riviera fleet is deeper",
      "Charterers needing maximum proximity to global UHNW social density",
      "Buyers wanting the iconic Saint-Tropez / Cannes experience for its own sake",
      "Owners considering yacht purchase (Monaco Yacht Show in September)",
    ],
    verdict:
      "The French Riviera is the Mediterranean's most expensive yacht-charter coastline and its most socially saturated. If you want Monaco's social access or its Michelin density, the Riviera is irreplaceable. " +
      "If you don't  -  if you want landscape variety, privacy, and a 40% lower bill for an arguably better trip  -  Greece delivers. " +
      "The pattern in our client data is consistent: UHNW buyers who chartered the Riviera in years 1-3 of their yacht-life often charter Greece in years 4+. The Riviera is the entrée. Greece is the destination people return to.",
    faq: [
      {
        q: "Is Greek yacht charter cheaper than French Riviera?",
        a: "Yes  -  roughly 40% cheaper for equivalent yachts and dates. Lower VAT (13% vs effective 10-22%), lower marina fees (€400-700/night vs €1,200-2,500/night), lower restaurant costs ashore. APA percentages similar but absolute APA spend lower in Greece.",
      },
      {
        q: "Can I charter from Greece to Monaco?",
        a: "Operationally complex and rarely done  -  the passage is 1,200+ nautical miles. Charterers who want both typically do two separate charters in the same year. For Monaco-event access from a Greek charter, helicopter is the realistic option.",
      },
      {
        q: "Which has better Michelin restaurants?",
        a: "French Riviera by a clear margin  -  6+ 3-star establishments in 40nm of coastline. Greece has strong Michelin presence in Athens, Mykonos, Santorini but lower density.",
      },
      {
        q: "Are Greek yachts the same quality as Riviera yachts?",
        a: "At 30-60m, yes  -  the Greek charter fleet matches Riviera quality at every spec. Above 70m, the Riviera fleet is deeper (most global gigayachts base out of Monaco/Antibes). For the rare 100m+ charter, Riviera is structurally better.",
      },
      {
        q: "Is the Riviera safer for first-time charterers?",
        a: "Slightly  -  shorter passages, more predictable weather (no Meltemi), better English-speaking infrastructure ashore. Greece has fully professional crews and is also safe; the difference is marginal.",
      },
      {
        q: "What's the best month for each?",
        a: "Greece: late May-June or September (avoiding Meltemi peak). Riviera: late May-June or September (avoiding peak crowds). Both have similar weather windows.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "Greek charter glossary", url: "/glossary" },
    ],
    seoTitle: "Greek Yacht Charter vs French Riviera 2026",
    seoDescription:
      "Greece or French Riviera for your yacht charter? Side-by-side comparison of cost (40% gap), fleet, anchorages, and dining. Honest UHNW guide.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-french-riviera",
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE vs ITALY (Amalfi / Sardinia)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-italy",
    competitorName: "Italy (Amalfi & Sardinia)",
    urlPath: "/greek-yacht-charter-vs-italy",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Italy: Amalfi, Sardinia, and the 2026 Choice",
    tagline:
      "Greece's island archipelagos vs Italy's twin yachting capitals  -  compared honestly.",
    shortAnswer:
      "Greece offers dramatically lower VAT (13% vs Italian effective 6.6-22%), more sailing variety across multiple island groups, and better privacy. Italy offers iconic Amalfi or Sardinia scenery, world-class restaurants, and proximity to land-based luxury (Capri, Positano hotels). UHNW buyers split: Italy for first-week iconic photography, Greece for serial annual chartering.",
    introBody:
      "Italian yacht chartering is really two charters: Amalfi (Capri, Positano, Ischia) and Sardinia (Costa Smeralda, Maddalena archipelago). They are different products. Both are iconic, both are expensive, both are crowded in July-August. Greek chartering, by contrast, offers five distinct regions in one country. " +
      "The Italy-vs-Greece question is rarely about coastline  -  both are spectacular. It's about cost, privacy, and how much variety you want in one charter week.",
    comparisonTable: [
      {
        criterion: "Charter VAT (effective)",
        greece: "13% (flat)",
        competitor: "6.6-22% (proportional, complex)",
        edge: "greece",
        note: "Italy applies VAT based on time in/out of EU waters. Some routes structure to 6.6%; standard is 22%.",
      },
      {
        criterion: "Mid-tier weekly cost, 35m motor yacht peak",
        greece: "€120k-€180k base",
        competitor: "€150k-€220k base",
        edge: "greece",
        note: "Italian Amalfi/Sardinia ~25% premium over Greek mid-tier.",
      },
      {
        criterion: "Anchorage privacy",
        greece: "Strong (low density alternatives)",
        competitor: "Limited (Capri, Costa Smeralda crowded)",
        edge: "greece",
        note: "Capri's Marina Piccola has anchorage queues in peak. Costa Smeralda restricted by zoning.",
      },
      {
        criterion: "Iconic coastline photography",
        greece: "Strong (Santorini, Symi, Hydra)",
        competitor: "Exceptional (Positano, Amalfi, Capri's Faraglioni)",
        edge: "competitor",
        note: "Italian Amalfi is the world's most photographed coastline. Sardinian Costa Smeralda also iconic.",
      },
      {
        criterion: "Restaurants ashore (Michelin)",
        greece: "Strong (Athens, Mykonos, Santorini stars)",
        competitor: "Exceptional (Italy has 13 3-star restaurants)",
        edge: "competitor",
        note: "Italy has more 3-star restaurants than any country except Japan.",
      },
      {
        criterion: "Cruising distances",
        greece: "Variable (long open passages)",
        competitor: "Amalfi short, Sardinia variable",
        edge: "tie",
        note: "Amalfi cruising is short hops. Sardinian cruising can be open passages similar to Cyclades.",
      },
      {
        criterion: "Marina/mooring availability",
        greece: "Adequate (anchorage standard)",
        competitor: "Constrained (Capri marina booked 12 months out)",
        edge: "greece",
        note: "Italian marina capacity is a real constraint, particularly Capri and Porto Cervo.",
      },
      {
        criterion: "Fleet depth at 30-50m",
        greece: "Deep (~250 yachts)",
        competitor: "Mid (~120 in Italy, mixed Amalfi/Sardinia bases)",
        edge: "greece",
        note: "Greek fleet is roughly 2x Italian charter fleet at the luxury-mid tier.",
      },
      {
        criterion: "Cultural depth (Sardinia/Amalfi)",
        greece: "Ancient + Byzantine + Ottoman layers",
        competitor: "Greco-Roman + Renaissance + maritime republics",
        edge: "tie",
        note: "Both have multi-millennium depth. Different periods, equally rich.",
      },
      {
        criterion: "Family-friendly beaches",
        greece: "Excellent (Cyclades south coasts)",
        competitor: "Limited (most Italian beaches small/rocky)",
        edge: "greece",
        note: "Sardinia has good beaches; Amalfi has very few. Greek beach access at scale is unmatched.",
      },
    ],
    sections: [
      {
        title: "The Amalfi premium is real and concentrated",
        body: "Amalfi yacht chartering carries the highest density of UHNW buyers per nautical mile of any Italian coastline. The product: anchor off Positano, tender to a beach club lunch, swim at Marina Piccola Capri, dine at Da Adolfo or La Fontelina. The aesthetic is iconic and the Italian provenance  -  food, wine, design  -  is genuinely world-class. " +
          "But the Amalfi geography is short. The classic Amalfi charter covers Positano-Capri-Ischia in 30 nautical miles. Most yachts then push into the Aeolian islands or back to Naples. After 4 days you've seen the iconic spots. The next 3 days require imagination. " +
          "Compared to Greece, where one week can cover Cyclades-Saronic-Sporades, the Amalfi product is concentrated and short. That concentration is the appeal for some buyers; for others it's the limitation.",
      },
      {
        title: "Costa Smeralda: Italy's UHNW gravity center",
        body: "Sardinia's Costa Smeralda  -  developed by the Aga Khan in the 1960s as a UHNW playground  -  is Italy's other yachting capital. Porto Cervo marina is one of the most exclusive berthing locations on earth (waiting lists for berths above 50m can run 5+ years). The Maddalena archipelago to the north is genuinely beautiful and the cruising covers more ground than Amalfi. " +
          "Costa Smeralda's premium is the most extreme on the Italian coast. Marina fees can hit €3,500+ per night for a 50m yacht in peak August. Restaurant prices are double Athens equivalents. The fleet is younger, larger on average, and concentrates the world's top 5% of superyachts in July-August. " +
          "For UHNW buyers who want to be in the densest concentration of Italian superyacht life, Costa Smeralda is the answer. Greek equivalents do not exist  -  the Greek pattern is dispersed across multiple regions.",
      },
      {
        title: "Italian VAT structure: a real warning",
        body: "Italian yacht charter VAT is the Mediterranean's most complex regime. The default rate is 22%, but structured itineraries that include time in international waters or other EU jurisdictions can effectively reduce to 6.6%. The structuring requires legal sophistication and a yacht/charter agreement designed around it. " +
          "Many Italian charter quotes are net of VAT (i.e. before VAT)  -  and the buyer who doesn't ask 'is this gross or net?' can find themselves with a 20%+ surprise. " +
          "Greek VAT at 13% flat is the simplest Mediterranean regime. No structuring, no surprises, no legal acrobatics. The Italian product offers ways to reduce VAT below the Greek flat rate, but only if you have the legal team to structure it.",
      },
      {
        title: "Restaurant density: Italy's killer advantage",
        body: "Italy has 13 3-star Michelin restaurants  -  more than any country except Japan. The concentration in Amalfi (Don Alfonso, Quattro Passi) and around Sardinia (Il Fuoco Sacro at Forte Village) means a 7-night Italian charter can include multiple top-tier dining experiences ashore. " +
          "Greek 3-star Michelin presence is limited (no current 3-star establishments). Greek 2-star (Spondi) and 1-star establishments exist in Athens, Mykonos, Santorini, but the density and consistency lag Italy significantly. " +
          "For UHNW buyers whose trip-architecture prioritises restaurant nights ashore, Italy is structurally superior. For buyers who eat onboard most nights, the Greek yacht chef's island provenance wins.",
      },
      {
        title: "The Capri marina problem",
        body: "Capri's Marina Piccola is the most-requested berthing location in summer Italian chartering  -  and it has roughly 40 berths. In peak July-August, securing a Capri berth requires booking 12 months in advance for any yacht above 35m. Most yachts anchor outside Marina Piccola and tender in. " +
          "Greek anchorages don't have this constraint. Mykonos Town and Hydra Town are popular but yachts simply anchor in the bay; tender access is routine. The Greek pattern doesn't penalise you for not booking 12 months out. " +
          "For UHNW buyers who plan charters 3-6 months in advance, Italian Amalfi access is constrained. Greek charters at the same booking window have meaningfully more flexibility.",
      },
    ],
    whoChoosesGreece: [
      "UHNW buyers wanting multi-region variety in one charter (Cyclades + Saronic + Sporades)",
      "Charterers prioritising lower simpler VAT (13% flat vs Italian 6.6-22% structured)",
      "Buyers planning 3-6 months in advance (Italian Amalfi requires longer lead time)",
      "Families with children wanting calm-water beaches at scale",
      "Repeat charterers who have done Amalfi and want different scenery",
      "Cost-conscious buyers (25% cheaper at most yacht tiers)",
    ],
    whoChoosesCompetitor: [
      "UHNW buyers wanting iconic Amalfi/Capri photography for first-charter",
      "Charterers planning many Michelin-restaurant evenings ashore",
      "Buyers prioritising Porto Cervo / Costa Smeralda social scene",
      "Buyers willing to book 12+ months in advance for Italian peak",
      "Charterers wanting maximum Italian wine, design, and provenance",
      "Buyers chartering 60m+ where Sardinian fleet has good depth",
    ],
    verdict:
      "Amalfi and Sardinia are world-class yacht-charter coastlines. The Italian experience is iconic, the food and wine are unrivalled, and the UHNW density at Porto Cervo or Marina Piccola is one of the great Mediterranean concentrations. " +
      "But Italy is a single iconic trip, not a destination buyers return to annually. Capri's anchorage problem, Amalfi's short cruising radius, and the VAT complexity together push UHNW buyers toward Greece for repeat chartering. " +
      "Italy is the trip you take when you want photographs. Greece is the trip you take when you want a holiday.",
    faq: [
      {
        q: "Is Italian VAT higher than Greek VAT on charter?",
        a: "By default yes  -  22% Italian vs 13% Greek. Italian VAT can be structured down to 6.6% on certain itineraries with proper legal sophistication, but this is complex and requires a yacht/charter agreement designed for it. Greek 13% is the simpler regime.",
      },
      {
        q: "Can I charter from Greece to Italy?",
        a: "Operationally possible but the VAT and customs paperwork is complex (different EU member states, different tax regimes). Most charterers do separate Italian and Greek charters. A cross-border itinerary requires lead time and a sophisticated operator.",
      },
      {
        q: "Is Amalfi or Sardinia better for yacht charter?",
        a: "Amalfi: shorter cruising, more iconic photography, more restaurants ashore. Sardinia: longer cruising, more privacy in the Maddalena, more space for activity-focused weeks. Buyers wanting Amalfi iconicity choose Amalfi. Buyers wanting balance choose Sardinia.",
      },
      {
        q: "Can I book a Capri berth on short notice?",
        a: "Generally no in peak season. Capri Marina Piccola berthing for yachts above 35m books 12+ months in advance for July-August. Most yachts anchor off Marina Piccola and tender in.",
      },
      {
        q: "Which has better food on the yacht?",
        a: "Italian yacht chefs are exceptional and the provisioning is world-class. Greek yacht chefs source more locally per-island. Both deliver memorable food. Italy has the edge on Italian-specific cuisine; Greece on Greek and Mediterranean range.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "Greek charter glossary", url: "/glossary" },
    ],
    seoTitle: "Greek Yacht Charter vs Italy 2026: Which Wins?",
    seoDescription:
      "Greece, Amalfi, or Sardinia for your 2026 yacht charter? Honest side-by-side comparison of cost, VAT, fleet, restaurants, anchorages. Decision guide.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-italy",
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE vs TURKEY (Turquoise Coast)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-turkey",
    competitorName: "Turkey (Turquoise Coast)",
    urlPath: "/greek-yacht-charter-vs-turkey",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Turkey: The 2026 Aegean Decision Guide",
    tagline:
      "Two coastlines of the same Aegean  -  but two very different charter products.",
    shortAnswer:
      "Greece offers EU regulatory clarity, MYBA-standard contracts, premium fleet, and stronger UHNW infrastructure. Turkey offers dramatically lower costs (~40-50% cheaper), spectacular gulet chartering, and the Lycian coastline's untouched beauty. UHNW buyers choose Greece for luxury motor yachts; gulet-charterers choose Turkey for value and authenticity.",
    introBody:
      "Greek and Turkish yacht chartering share the same Aegean Sea but represent two very different market products. Greece is the EU-regulated, English-speaking, MYBA-standard premium charter market. Turkey is the lower-cost, gulet-driven, locally-flagged value market with spectacular coastlines that haven't been industrialised. " +
      "The Greek-vs-Turkish decision hinges on what you came for: luxury motor yacht with full Mediterranean polish, or characterful gulet experience at half the cost.",
    comparisonTable: [
      {
        criterion: "Charter VAT",
        greece: "13% Greek VAT",
        competitor: "18% Turkish VAT (KDV)",
        edge: "greece",
        note: "Turkish charter is taxed at standard rate; no reduced rate exists.",
      },
      {
        criterion: "Mid-tier yacht weekly cost",
        greece: "€120k-€180k (35m motor)",
        competitor: "€60k-€100k (35m motor)",
        edge: "competitor",
        note: "Turkish luxury yacht chartering is 40-50% cheaper at equivalent yacht spec.",
      },
      {
        criterion: "Gulet charter pricing",
        greece: "€40k-€140k (32m gulet)",
        competitor: "€25k-€80k (32m gulet)",
        edge: "competitor",
        note: "Gulets are the Turkish national charter product. Pricing reflects scale.",
      },
      {
        criterion: "Contract standardisation",
        greece: "MYBA standard (EU-regulated)",
        competitor: "Mix of MYBA + local Turkish forms",
        edge: "greece",
        note: "Greek MYBA standardisation simplifies legal review and dispute resolution.",
      },
      {
        criterion: "EU regulatory clarity",
        greece: "Full EU regulation, GDPR, MCA-equivalent",
        competitor: "Turkey not EU member, separate regulatory regime",
        edge: "greece",
        note: "For privacy-sensitive UHNW buyers, EU GDPR coverage matters.",
      },
      {
        criterion: "Coastline beauty",
        greece: "World-class (Cyclades, Ionian)",
        competitor: "World-class (Lycian, Datça)",
        edge: "tie",
        note: "Both spectacular. Different aesthetics. Turkish coast is greener, Greek islands more dramatic.",
      },
      {
        criterion: "Anchorage privacy",
        greece: "Strong (many alternatives)",
        competitor: "Exceptional (less developed, fewer charter yachts)",
        edge: "competitor",
        note: "Turkish anchorages are quieter because the charter market is smaller.",
      },
      {
        criterion: "Crew quality & English",
        greece: "Strong (international crews, fluent English)",
        competitor: "Variable (Turkish crews, English variable)",
        edge: "greece",
        note: "Greek charter crews skew international and English-fluent. Turkish crews often skew local with English second-language.",
      },
      {
        criterion: "Food & wine",
        greece: "Greek + Mediterranean range",
        competitor: "Turkish + Levantine + Mediterranean",
        edge: "tie",
        note: "Both excellent. Turkish cuisine is genuinely world-class but onboard provisioning skews simpler.",
      },
      {
        criterion: "Airport-to-yacht logistics",
        greece: "Athens, Mykonos, Santorini (15-30 min)",
        competitor: "Bodrum, Dalaman (30-60 min)",
        edge: "greece",
        note: "Greek embarkation logistics generally faster.",
      },
      {
        criterion: "Luxury fleet depth (30m+ motor)",
        greece: "Deep (~250 yachts)",
        competitor: "Mid (~80 luxury motor yachts)",
        edge: "greece",
        note: "Turkish luxury motor yacht fleet is meaningfully smaller. Gulet fleet is large.",
      },
    ],
    sections: [
      {
        title: "The price gap is huge  -  and so is the explanation",
        body: "Turkish yacht charter is 40-50% cheaper than Greek at equivalent yacht specs. A 35m motor yacht in Bodrum at peak August costs €70,000/week base where the same yacht in Mykonos costs €130,000/week. Marina fees, fuel, crew costs  -  all lower in Turkey. " +
          "Where does the difference come from? Lower labour costs (Turkish crew salaries are roughly half Greek crew salaries), lower yacht-asset costs (Turkish charter yachts are typically older or Turkish-built rather than imported European), lower marina infrastructure costs, and less competition for the luxury market. " +
          "The Turkish premium product is the gulet  -  a traditional Turkish wooden vessel that Greece offers but doesn't build at the same scale. For a 32m luxury gulet experience, Turkey is structurally cheaper and the product is more authentic.",
      },
      {
        title: "Regulatory environment: Greece's advantage",
        body: "Greece is an EU member, fully regulated under EU shipping standards, MCA-equivalent codes, and GDPR data protection. Greek MYBA contracts are processed through London arbitration as standard. Disputes resolve under recognisable European law. " +
          "Turkey is not an EU member. Turkish charter contracts are governed by Turkish law (or international arbitration when MYBA-standard is used). Privacy protections under Turkish law differ from EU GDPR. For UHNW buyers whose family offices require known-jurisdiction legal frameworks, Greek charters require less due diligence. " +
          "This is a real factor for risk-averse UHNW buyers. It is irrelevant for buyers prioritising experience and value over regulatory uniformity.",
      },
      {
        title: "Lycian coast: Turkey's unmatched landscape",
        body: "The Turkish Lycian coast  -  from Fethiye south to Kaş and Antalya  -  is one of the Mediterranean's most spectacular and underdeveloped charter coastlines. The Lycian way runs through ancient ruins (Patara, Xanthos, Myra), the coastline is mountainous and forested, anchorages are deep clear water at remote bays. " +
          "Compared to the Cyclades, the Lycian coast feels less industrialised. Fewer charter yachts, no Mykonos-style party scene, fewer tourists generally. For UHNW buyers seeking remoteness within Mediterranean reach, this is its primary appeal. " +
          "Greek alternatives that match this remoteness exist (the Small Cyclades  -  Donousa, Schinoussa, Iraklia; or the Sporades) but require specific itinerary design. The Lycian coast offers it by default.",
      },
      {
        title: "Gulet chartering: Turkey's native product",
        body: "Gulets are Turkish vessels. They were designed and built in Bodrum and Marmaris over the last 60 years specifically as charter platforms. The Turkish gulet fleet is the largest in the Mediterranean  -  both in number (~600 vessels) and in size variety. " +
          "Greek gulets exist but are mostly Turkish-built vessels brought under Greek flag. The Greek gulet fleet is ~80 vessels  -  adequate but not the depth of Turkey. For a gulet-focused charter, Turkey has the better product, the better fleet, and the lower price. " +
          "If your charter aesthetic is wooden hull, traditional Mediterranean, slower pace, the Turkish gulet is structurally the better choice. If your aesthetic is modern luxury motor yacht with full stabilisation and contemporary amenity, Greek fleet is structurally better.",
      },
      {
        title: "Combining Greek and Turkish in one charter",
        body: "Cross-border Greek-Turkish chartering is technically possible but operationally complex. Greek-flagged yachts can enter Turkish waters but face Turkish coastal cabotage rules (cannot pick up/drop off Turkish passengers without separate licensing). Turkish-flagged yachts can enter Greek waters but face equivalent Greek restrictions. " +
          "In practice, cross-border charters work best with foreign-flagged (Cayman, Malta) luxury yachts that can move between countries without national-flag restrictions. The captain handles customs clearance at each border crossing  -  typically a 2-hour stop. " +
          "Some itineraries that work well: Greek Dodecanese (Symi, Rhodes, Kos) + Turkish Datça/Marmaris (just across the strait). Or Greek Lesvos + Turkish Ayvalık. These are short cross-border charters that combine both. Most commonly though, charterers do all-Greek or all-Turkish trips.",
      },
    ],
    whoChoosesGreece: [
      "UHNW buyers wanting MYBA-standard EU regulatory clarity",
      "Charterers prioritising luxury motor yachts with modern amenity",
      "Buyers requiring fluent English crews",
      "Charterers wanting deeper fleet choice at 30-60m motor yacht tier",
      "Buyers planning 50m+ superyacht charters (Greek fleet much deeper)",
      "Privacy-sensitive UHNW requiring GDPR data protection",
    ],
    whoChoosesCompetitor: [
      "Gulet-charterers wanting the largest, best-priced gulet fleet on earth",
      "Cost-conscious charterers (~40-50% savings at equivalent specs)",
      "UHNW buyers wanting the Lycian coast's untouched remoteness",
      "Charterers prioritising Turkish food, archaeology, and cultural depth",
      "Buyers wanting less-developed anchorages with fewer other yachts",
      "Charterers comfortable with non-EU regulatory framework",
    ],
    verdict:
      "Turkey offers a dramatically lower-cost charter on a spectacular coastline. For gulet chartering and for value-focused luxury motor yacht weeks, Turkey is structurally competitive  -  and the Lycian coast is genuinely beautiful in ways the Cyclades isn't. " +
      "Greece offers MYBA-standard contracts, EU regulation, deeper luxury fleet, and stronger international crew quality. For UHNW buyers chartering motor yachts above 30m, Greek market depth and regulatory clarity justify the price premium. " +
      "Many sophisticated charterers do both  -  Greek charter every year, Turkish gulet charter every 3-4 years for variety. The countries aren't direct competitors. They are complementary Aegean products at different price-and-experience points.",
    faq: [
      {
        q: "Is Turkish yacht charter cheaper than Greek?",
        a: "Yes, by 40-50% at equivalent yacht specs. Lower labour costs, lower marina fees, lower-cost charter yachts on average. The savings are real and the experience can be excellent, particularly on gulets.",
      },
      {
        q: "Can I charter a yacht from Greece into Turkey?",
        a: "Operationally complex. Cabotage rules restrict cross-national pickup/dropoff. Foreign-flagged yachts (Cayman, Malta) handle cross-border charters most easily. Greek-flagged yachts entering Turkish waters need clearance and face limitations on Turkish-origin guests.",
      },
      {
        q: "Are Turkish gulets better than Greek gulets?",
        a: "Generally yes  -  Turkey is where gulets are built and the Turkish gulet fleet is larger, more varied, and more competitively priced. For gulet-specific charters, Turkey is the structural choice. Greek gulets exist but are typically Turkish-built vessels under Greek flag.",
      },
      {
        q: "Is the crew on a Turkish charter English-speaking?",
        a: "Variable. Captains generally yes (international qualifications require English). Other crew variable  -  many speak good English, some have basic English. Greek charter crews are more uniformly English-fluent.",
      },
      {
        q: "Which has better food  -  Greek or Turkish charter?",
        a: "Both excellent and similar in style (Mediterranean, fish-forward, fresh produce). Turkish cuisine has more depth in Levantine and Anatolian dishes. Greek charter chefs often have stronger international training. The day-to-day onboard food experience is comparable at the luxury tier.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Gulet charter Greece", url: "/gulet-charter-greece" },
      { title: "Greek charter glossary", url: "/glossary" },
    ],
    seoTitle: "Greek Yacht Charter vs Turkey 2026: Aegean Guide",
    seoDescription:
      "Greece or Turkey for your 2026 yacht charter? Compare cost (40-50% gap), gulet vs motor yacht, regulatory clarity, Lycian coast vs Cyclades. Honest UHNW guide.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-turkey",
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE vs CARIBBEAN (BVI)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-caribbean",
    competitorName: "Caribbean (BVI & St. Barths)",
    urlPath: "/greek-yacht-charter-vs-caribbean",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Caribbean: 2026 Mediterranean vs Tropical",
    tagline:
      "Two of the world's premier yacht charter destinations  -  different seas, different seasons, different experiences.",
    shortAnswer:
      "Greece is the Mediterranean summer charter (May-October), known for cultural depth, island variety, and lower costs. The Caribbean is the winter charter destination (November-April), known for warm tropical water, BVI's reliable trade winds, and St. Barths' UHNW social density. Most sophisticated UHNW buyers charter both  -  Caribbean in winter, Greece in summer.",
    introBody:
      "Greek and Caribbean yacht chartering are rarely a direct competition because they happen in opposite seasons. Greek charter runs May-October on European Mediterranean schedules. Caribbean charter runs November-April on winter-escape schedules. " +
      "But UHNW buyers often face the choice in a different form: 'Should our family's annual yacht trip be summer Greece or winter Caribbean?' Or for those with budget for one trip in a given year, the deeper question: which sea do we want this time? This comparison frames the choice honestly.",
    comparisonTable: [
      {
        criterion: "Charter season",
        greece: "May-October (peak Jun-Sep)",
        competitor: "November-April (peak Dec-Mar)",
        edge: "tie",
        note: "Opposite hemispheres of the charter year. Most sophisticated UHNW buyers do both.",
      },
      {
        criterion: "Charter VAT",
        greece: "13% Greek",
        competitor: "0% (most Caribbean jurisdictions)",
        edge: "competitor",
        note: "BVI, St. Barths, US Virgin Islands have no charter VAT. Caribbean charter is structurally tax-free.",
      },
      {
        criterion: "Mid-tier weekly cost, 35m motor yacht peak",
        greece: "€120k-€180k base (peak summer)",
        competitor: "€110k-€170k base (peak winter)",
        edge: "tie",
        note: "Caribbean peak overlaps with Greek peak in absolute cost despite no VAT  -  yacht supply is constrained in Caribbean peak.",
      },
      {
        criterion: "Water temperature",
        greece: "22-26°C peak summer",
        competitor: "27-29°C peak winter",
        edge: "competitor",
        note: "Caribbean water is consistently warmer year-round. Greek water is warmer than perceived but cooler than Caribbean.",
      },
      {
        criterion: "Cultural depth ashore",
        greece: "Exceptional (3,000+ years)",
        competitor: "Limited (most islands resort-developed)",
        edge: "greece",
        note: "Greek charter offers cultural depth at every port. Caribbean charter is sea-and-beach focused.",
      },
      {
        criterion: "Restaurants ashore",
        greece: "Strong (Athens, Mykonos, Santorini)",
        competitor: "Excellent in St. Barths, limited elsewhere",
        edge: "tie",
        note: "St. Barths matches Greek restaurant density. BVI lower. Both have specific high-density zones.",
      },
      {
        criterion: "Trade-wind reliability",
        greece: "Meltemi variable (Cyclades)",
        competitor: "Reliable trade winds (BVI 15-20kt steady)",
        edge: "competitor",
        note: "Caribbean trade winds are the world's most reliable charter winds. Greek Meltemi is more variable.",
      },
      {
        criterion: "Sailing-yacht chartering",
        greece: "Strong (large fleet)",
        competitor: "Exceptional (BVI is the sailing capital)",
        edge: "competitor",
        note: "BVI is the world's most concentrated sailing-yacht charter region. The trade-wind sailing is unmatched.",
      },
      {
        criterion: "Privacy at anchor",
        greece: "Strong (many alternatives)",
        competitor: "Mixed (BVI crowded in peak)",
        edge: "greece",
        note: "BVI's compactness creates anchorage density in peak. St. Barths small enough to be exclusive.",
      },
      {
        criterion: "Flight access from Europe",
        greece: "Direct (Athens 3hr from London)",
        competitor: "Long (~10-12hr from Europe to BVI)",
        edge: "greece",
        note: "Greek charter is logistically much easier for European-based families.",
      },
      {
        criterion: "Cultural variety per charter",
        greece: "High (Cyclades vs Ionian vs Saronic)",
        competitor: "Low (similar BVI islands, St. Barths exceptional)",
        edge: "greece",
        note: "Greek charters cover meaningfully different regions in one week. Caribbean charters are more uniform.",
      },
    ],
    sections: [
      {
        title: "The season problem solves itself",
        body: "Greek and Caribbean yacht chartering are seasonal opposites. Greek peak is June-September. Caribbean peak is December-March. The two seas literally cannot be chartered simultaneously by the same family. " +
          "For UHNW buyers with one yacht charter per year, the choice is partly about season preference. Summer chartering means combining the trip with European summer holidays. Winter chartering means combining with school winter break or a Mediterranean off-season escape. " +
          "For UHNW buyers with two charters per year, the obvious pattern is: Greece in summer, Caribbean in winter. Roughly 30% of George Yachts' repeat clients follow this pattern. The two products complement rather than compete.",
      },
      {
        title: "BVI: the world's sailing capital",
        body: "The British Virgin Islands have the most concentrated sailing-yacht charter market on earth. The trade winds blow 15-20 knots steady from the east most of the year. Island chains are 3-10 nautical miles apart. Anchorages are sheltered, water is clear, and the bareboat sailing infrastructure is the world's deepest. " +
          "For sailing-focused chartering, BVI is structurally superior to Greek waters. Greek sailing is excellent but the Meltemi is more variable than the BVI trade winds, and Greek bareboat infrastructure is smaller. " +
          "For motor-yacht UHNW chartering at the 40m+ tier, the markets are more comparable but Greek depth slightly exceeds BVI's. BVI peak superyacht inventory is concentrated in St. Barths and St. Maarten, with smaller depths than Greek mid-tier markets.",
      },
      {
        title: "St. Barths: Caribbean's UHNW capital",
        body: "St. Barths is the Caribbean's UHNW charter destination  -  equivalent to Monaco or Porto Cervo in social density. Gustavia harbour fills with superyachts in December-January, restaurants like Bonito and Bagatelle host UHNW dinner scenes that match anything in the Mediterranean, and the social calendar through New Year's Eve is dense with private events. " +
          "Greek equivalents at this concentration don't really exist. Mykonos has a high-density UHNW summer scene but it's broader-based (less concentrated). The St. Barths-during-Christmas pattern is unique. " +
          "For UHNW buyers prioritising winter-Christmas social scene, St. Barths is the answer. Greek equivalent doesn't exist (the Greek winter charter market is essentially nonexistent due to weather).",
      },
      {
        title: "Cultural depth: Greece's structural advantage",
        body: "Greek yacht charters are cultural experiences. Every port has 1,000+ years of history visible from the harbour  -  Hydra's 18th-century captain's houses, Patmos's Cave of the Apocalypse, Delos's archaeological precinct, Santorini's prehistoric Akrotiri site. Cultural depth is part of every itinerary. " +
          "Caribbean charters are sea-and-beach focused. The shoreside experience is largely modern resort or restaurant. Cultural depth on most Caribbean islands is shallow (St. Barths is essentially a 200-year-old resort). " +
          "For UHNW buyers who want their charter to include meaningful shore-side cultural experience, Greece is structurally superior. For buyers who want their charter to be primarily water-focused  -  swimming, diving, beaches  -  Caribbean is structurally fine.",
      },
      {
        title: "The European-buyer logistics question",
        body: "For European-based UHNW buyers, Greek charter is 3-4 hours flight from London or Paris. Caribbean charter is 8-12 hours. The logistics gap is substantial. " +
          "On a 7-night charter, the long-haul flight on either side consumes effectively a day per direction. A 7-night Caribbean charter feels like a 5-night yacht experience plus 2 days of jet lag and travel. A 7-night Greek charter feels like 6.5 days of yacht. " +
          "For US-based UHNW buyers, the logic reverses: Caribbean is 3-4 hours from US east coast; Greek is 9-11 hours. The buyer's home base shapes which destination is logistically reasonable for shorter charters. " +
          "Buyers in Europe should default to Greek for charters under 10 days. Caribbean charters work better for 10+ day trips that justify the travel time.",
      },
    ],
    whoChoosesGreece: [
      "European-based UHNW (Greek 3-4hr flight vs Caribbean 10hr+)",
      "Charterers prioritising cultural depth and historical sites",
      "Buyers wanting multi-region variety (Cyclades + Ionian + Saronic)",
      "Summer charterers (Greek peak Jun-Sep)",
      "Charterers preferring Mediterranean cuisine and provisioning",
      "Buyers wanting deeper luxury motor yacht fleet (30-60m)",
    ],
    whoChoosesCompetitor: [
      "Winter charterers wanting warm tropical water",
      "Sailing-focused charterers (BVI trade winds are world-class)",
      "UHNW buyers wanting St. Barths Christmas-NYE social density",
      "US East Coast buyers (Caribbean logistically far easier)",
      "Charterers wanting zero VAT (BVI, USVI, St. Barths)",
      "Bareboat sailing charters (BVI is the world's largest bareboat market)",
    ],
    verdict:
      "Greek and Caribbean yacht charter are seasonal complements, not direct competitors. The sophisticated UHNW family pattern is Greek summer + Caribbean winter, repeating annually. " +
      "For buyers choosing one this year: choose Greece if you're European-based, prioritise cultural depth, or want multi-region variety. Choose Caribbean if you're US-based, want maximum sailing-yacht experience, or specifically want the St. Barths Christmas scene. " +
      "Both are world-class. Neither is universally better. The question is fit to the buyer's calendar, base location, and charter intent.",
    faq: [
      {
        q: "Can I charter year-round in either Greece or Caribbean?",
        a: "Both have practical season limits. Greek charter season is essentially May-October (winter is cold and many yachts dry-dock). Caribbean charter season is essentially November-April (summer is hurricane-risk and many yachts move north). No overlap.",
      },
      {
        q: "Is the Caribbean cheaper than Greece because there's no VAT?",
        a: "Net cost comparison is roughly equal at peak. Caribbean has 0% VAT but peak charter rates are similar to Greek peak. Off-season Caribbean (April-May, October-November) can be dramatically cheaper if you accept hurricane-shoulder risk.",
      },
      {
        q: "Which has better sailing  -  Greece or BVI?",
        a: "BVI by a meaningful margin. Trade winds are the world's most reliable. Greek sailing is excellent in the Ionian and Saronic; less reliable in Cyclades due to Meltemi variability.",
      },
      {
        q: "What about hurricane risk in the Caribbean?",
        a: "Hurricane season runs June-November. Caribbean charter season starts after hurricane peak (November-April). Insurance protects against canceled charters during hurricane-affected periods.",
      },
      {
        q: "Is St. Barths comparable to Mykonos for UHNW social scene?",
        a: "Yes in concentration but at different seasons. St. Barths Christmas-NYE matches Mykonos August in UHNW density. The product is fundamentally similar (small island, dense yacht and restaurant scene, high prices, see-and-be-seen culture).",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Sailing yacht charter Greece", url: "/sailing-yacht-charter-greece" },
      { title: "Greek charter glossary", url: "/glossary" },
    ],
    seoTitle: "Greek Yacht Charter vs Caribbean 2026: Med vs BVI",
    seoDescription:
      "Greek summer or Caribbean winter for your yacht charter? Honest comparison of cost, sailing quality, cultural depth, logistics for European and US buyers.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-caribbean",
  },
];

// Helper lookups
export function getComparisonBySlug(slug) {
  return DESTINATION_COMPARISONS.find((c) => c.slug === slug) || null;
}
