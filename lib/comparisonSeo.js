// Comparison landing page data (8 high-commercial-value comparison
// pages). 2026-05-11 Phase 7 SEO strategy doc execution.
//
// Each comparison page targets a high-intent UHNW search ("greece vs
// croatia yacht charter", "motor vs sailing yacht greece") and gives
// a genuinely-useful side-by-side breakdown. These pages convert at
// 5 to 10x the rate of general info content because the visitor is
// already in decision mode.

export const COMPARISONS = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greece-vs-croatia-yacht-charter",
    urlPath: "/greece-vs-croatia-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs Croatia Yacht Charter",
    tagline: "Two Mediterranean classics. Different temperaments. Here's how they actually compare.",
    seoTitle: "Greece vs Croatia Yacht Charter 2026",
    seoDescription: "Detailed comparison of Greece vs Croatia for yacht charter: pricing, weather, anchorages, cuisine, logistics. Which fits your trip in 2026.",
    canonical: "https://georgeyachts.com/greece-vs-croatia-yacht-charter",
    touristType: ["UHNW charterers", "Couples", "Families"],

    whyTitle: "Two Mediterranean destinations, different temperaments",
    whyBody:
      "Greece and Croatia are the Mediterranean's two big-name yacht charter destinations after the Cote d'Azur. Both deliver 6 months of season, both have established charter fleets, both will give you a memorable week. **They are not the same trip**, and the choice matters more than most charterers realise. " +
      "**Greece is the bigger, more varied charter ground**. 6,000 islands across 5 distinct island groups, each with its own wind patterns, anchorages, and culture. The Cyclades for cinematic Aegean cliffs and white villages. The Ionian for sheltered green water and easy day-sailing. The Saronic for the close-to-Athens classics. The Sporades and Dodecanese for the wilder edges. " +
      "**Croatia is more concentrated**. The 1,250-island Adriatic coast runs roughly 300 nm from Trieste to Dubrovnik, all of it in protected water with shorter day-sails between anchorages. The visual signature is medieval walled towns (Korčula, Hvar, Trogir, Dubrovnik), pine-scented bays, and turquoise water that often photographs even bluer than Greek waters do. " +
      "**Pricing differs**. Greek charter rates run 10 to 20% above Croatian for equivalent yachts in equivalent weeks. Greek VAT is 13% on commercial charters over 48 hours (24% for short or static); Croatian VAT is fixed at 13%. Greek APA tends to settle higher due to longer cruising distances; Croatian APA is more predictable on shorter day-passages. " +
      "**The decision usually comes down to mood**. For Cyclades cinematics and Mykonos energy, Greece. For walled-town romance and sheltered family sailing, Croatia. For a more remote, slower-paced trip, Greek Dodecanese. For 7-night first-time charter ease, Croatia. We brief honestly on both.",

    bestFor: [
      "First-time charterers debating where to start",
      "Repeat clients alternating between Med destinations",
      "Families weighing Greek-style adventure vs Croatian shelter",
      "Charterers comparing seasonal pricing across the two markets",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How the comparison breaks down across 12 dimensions",
    whenBody:
      "**Charter season length**: Greece April-October (7 months active); Croatia May-October (6 months active). " +
      "**Weekly base rate** (50-foot sailing yacht, crewed): Greece €18-28K; Croatia €15-24K. " +
      "**APA convention**: Greece 25-30%; Croatia 22-28%. " +
      "**VAT on charter**: Greece 13% (commercial charters over 48 hours) or 24% (short or static charters); Croatia 13% flat. " +
      "**Dominant wind**: Greece - Meltemi 15-25kt June-August in Cyclades, mild Ionian; Croatia - Bura cold blasts in spring/autumn, summer mostly calm. " +
      "**Day-passage convention**: Greece 30-80 nm between Cycladic islands; Croatia 15-40 nm typical. " +
      "**Anchorage style**: Greece mostly open roadsteads in Cyclades, sheltered in Ionian; Croatia almost universally sheltered pine-fringed bays. " +
      "**Provisioning quality**: Both excellent; Greece higher seafood depth, Croatia better wine and olive oil. " +
      "**Marina infrastructure**: Croatia denser and more modern (ACI marina network); Greece patchier but improving. " +
      "**Yacht fleet quality**: Both deep; Greece has more 30m+ yachts available; Croatia stronger sub-25m fleet. " +
      "**Cuisine**: Greek seafood-led with mezze culture; Croatian inland meat-led with seafood on coast. " +
      "**Cultural depth**: Both world-class; Greek archaeology slightly broader (Athens, Crete, Delos), Croatian medieval architecture more concentrated.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If you've never chartered, Croatia is the easier first week. Shorter passages, more sheltered, gentler learning curve.",
      "If you have chartered before, Greece gives you more variety and a richer sense of place.",
      "August in Croatia is busier than August in Greece outside Mykonos/Santorini. The Dalmatian coast fills up.",
      "Greek-Turkey itineraries (Dodecanese to Turkish Aegean) are unique to the Greek charter scene and worth knowing about.",
      "Charter both within 3 years. Most repeat clients alternate destinations and have a clear preference by the third trip.",
    ],

    faq: [
      {
        q: "Is Greece or Croatia cheaper for yacht charter?",
        a: "Croatia is typically 10 to 20% cheaper on equivalent yachts in equivalent weeks. The gap narrows for premium yachts (above 30 metres, where Greece has deeper inventory) and widens for entry-level charters (below 25 metres, where Croatian production fleet is competitive)."
      },
      {
        q: "Which has better weather for yacht charter?",
        a: "Croatia summer weather is more reliably calm; Greek Aegean has the Meltemi 15-25 knot wind from June to August. For sailing enthusiasts, Greece is more interesting. For family or first-time charterers wanting flat water, Croatia. Ionian Greece (Lefkada area) splits the difference."
      },
      {
        q: "Are Greek or Croatian charter yachts better quality?",
        a: "Both fleets are world-class. Croatia has slightly newer average build year due to faster fleet turnover; Greece has more depth in 30+ metre yachts. For a 25-metre charter, parity. For a 40-metre superyacht, Greece has more options."
      },
      {
        q: "Can we charter from Greece to Croatia or vice versa?",
        a: "Possible but uncommon and complex. One-way charters between the two countries require customs paperwork at borders, higher repositioning fees, and most owners don't agree to the route. Two separate charters (Greece one year, Croatia the next) is typically the better answer."
      },
      {
        q: "Which has better food?",
        a: "Both excellent in their tradition. Greek charter weeks lean seafood, mezze, and Greek-island fish. Croatian charter weeks lean Mediterranean fusion with Italian influence, strong wines, and excellent olive oil. Honest answer: depends on guest preferences."
      },
    ],

    ctaTitle: "Charter in Greece for 2026?",
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
    seoTitle: "Greece vs Spain Yacht Charter 2026",
    seoDescription: "Greece vs Spain (Balearics) yacht charter compared: VAT and pricing, cruising ground, glamour, fleet, logistics. Which fits your 2026 week.",
    canonical: "https://georgeyachts.com/greece-vs-spain-yacht-charter",
    touristType: ["UHNW charterers", "Couples", "Families"],

    whyTitle: "Two summer destinations, very different economics",
    whyBody:
      "Greece and Spain are both first-rank Mediterranean charter grounds, but they are not the same trip and the cost difference is larger than most charterers expect. " +
      "**Spain means the Balearics**: Mallorca, Menorca, Ibiza, and Formentera, a compact four-island cluster with short hops between anchorages. Palma de Mallorca is the Mediterranean's superyacht hub and refit capital, so large-yacht inventory is deep. The signature is glamour: Ibiza's club scene, Formentera's turquoise sandbars, and some of the busiest, most expensive August marinas anywhere. " +
      "**Greece is the larger, more varied ground**: five distinct island groups across the Aegean and Ionian, from the cinematic Cyclades to the sheltered Ionian, with far more cruising choice over a week and a depth of culture (Delos, Athens, Crete) the Balearics cannot match. " +
      "**The tax difference is real money**. Greece charges a reduced **13% VAT** on commercial crewed charters over 48 hours (every weekly charter); Spain charges its standard **21% VAT** on charter with no equivalent reduced rate. On a 100,000 EUR week that is roughly an 8,000 EUR swing before anything else. Balearic marina and berthing costs in peak August also run materially higher than Greek equivalents. " +
      "**The decision comes down to what the week is for**. For nightlife, glamour, and short glamorous hops, the Balearics. For variety, culture, anchorage choice, and a lower all-in cost, Greece. We brief honestly on both.",

    bestFor: [
      "Charterers weighing glamour (Balearics) against variety and value (Greece)",
      "UHNW buyers sensitive to the 13% vs 21% VAT difference at six figures",
      "Repeat clients alternating Mediterranean destinations",
      "Groups deciding between Ibiza-style nightlife and a fuller island week",
    ],

    yachtFilter: null,
    yachtsHeadline: null,
    featuredHeading: null,

    whenTitle: "How the comparison breaks down",
    whenBody:
      "**Charter season**: both roughly May to October. " +
      "**VAT on charter**: Greece 13% (commercial crewed charters over 48 hours) or 24% (short or static); Spain 21% standard, no reduced charter rate. " +
      "**Cruising ground**: Greece vast (five island groups, hundreds of options); Balearics compact (four islands, short hops). " +
      "**Marina cost and availability**: Balearics denser and more modern but among the most expensive in the Med in August; Greece patchier but cheaper and improving. " +
      "**Fleet**: Spain deep in large motor yachts and superyachts (Palma refit hub); Greece deep in crewed yachts across all sizes. " +
      "**Wind**: Greek Cyclades carry the Meltemi 15-25kt in July-August; Balearic summers are generally calmer. " +
      "**Crowds**: Ibiza and Formentera in August are intensely busy; Greece spreads across far more anchorages. " +
      "**Culture**: Greece materially deeper (archaeology, history, island variety); Balearics lean lifestyle and beach.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "The VAT gap (13% Greece vs 21% Spain) is the single biggest cost lever between the two. On a long week it pays for a chef upgrade.",
      "Palma is the place to find and refit very large motor yachts; if you want a specific 50m-plus vessel, the Balearic-based fleet is worth checking.",
      "You cannot sensibly combine both in one charter; they are over 700 nautical miles apart. Pick one per trip.",
      "For a first glamorous long weekend, Ibiza and Formentera are hard to beat. For a full week with range, Greece gives more.",
      "Balearic August berths must be booked far ahead and cost a premium; Greek anchorages stay more open.",
    ],

    faq: [
      {
        q: "Is Greece or Spain cheaper for yacht charter?",
        a: "Greece is typically cheaper all-in, and the clearest reason is tax: Greek crewed charters over 48 hours carry a 13% reduced VAT, while Spanish charter VAT is the standard 21% with no equivalent reduction. Balearic peak-August marina costs also run higher than Greek equivalents."
      },
      {
        q: "Which has better nightlife, Greece or Spain?",
        a: "Both are strong. Ibiza has the deepest club scene in the Mediterranean; Mykonos is its closest Greek equivalent. For pure nightlife the Balearics edge it; for nightlife plus a varied island week, Greece."
      },
      {
        q: "Can we charter one yacht across both Greece and Spain?",
        a: "Not practically. The two cruising grounds are over 700 nautical miles apart, so a single charter spanning both means days of open-water transit and heavy repositioning fees. Charter one per trip."
      },
      {
        q: "Which has better anchorages?",
        a: "Greece offers more variety and more open anchorages across five island groups. The Balearic calas are beautiful and sheltered but fewer and very crowded in peak season. For anchorage choice over a week, Greece."
      },
    ],

    ctaTitle: "Charter in Greece for 2026?",
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
    seoTitle: "Mykonos vs Santorini Yacht Charter 2026",
    seoDescription: "Mykonos vs Santorini for a yacht charter: anchorages, as a base vs a stop, the caldera, nightlife, logistics. Honest broker guidance for your Cyclades week.",
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
    seoTitle: "Greece vs French Riviera Yacht Charter 2026",
    seoDescription: "Greece vs French Riviera yacht charter compared: pricing, glamour, anchorages, cuisine, fleet, logistics. Which Mediterranean destination fits your 2026 trip.",
    canonical: "https://georgeyachts.com/greece-vs-french-riviera-yacht-charter",
    touristType: ["UHNW charterers", "Repeat charterers"],

    whyTitle: "Two icons of Mediterranean yachting",
    whyBody:
      "The **French Riviera** is the cradle of modern yachting. It is where the format was invented, where Onassis and Niarchos kept their fleets, where Cannes and Monaco staged the first yacht shows. The infrastructure is unmatched. The glamour is unrelenting. The price tag matches both. " +
      "**Greece** is the older sea. The wind that pushed Odysseus is the wind that pushes yachts today. The islands are sharper, the water clearer, the food simpler. Greek charter has scaled aggressively since 2010 and now rivals the Riviera for fleet quality at significantly lower cost. " +
      "**The deepest difference is pace**. A Riviera week is a high-energy social tour: Monaco, Saint-Tropez, Cap d'Antibes, Cannes, lunch at Eden Roc, dinner at La Vague d'Or. A Greek week is a quieter, more contemplative arc: dawn at anchor in Folegandros, swim before breakfast, ouzo at sunset on Antiparos. Both are luxury. Different luxury. " +
      "**Pricing gap is significant**. A 35-metre charter yacht in the Riviera in August runs €280-450K/week base. The same yacht in Greek waters in August runs €180-320K/week. The €100-130K/week differential funds a chef-led add-on, a helicopter day, or an extra week somewhere else.",

    bestFor: [
      "Charterers comparing Mediterranean destinations cost-by-feature",
      "Repeat Riviera clients considering a Greek season",
      "First-time UHNW charterers weighing both icons",
      "Family offices planning multi-year charter strategy",
    ],

    yachtFilter: null,

    whenTitle: "Side-by-side breakdown",
    whenBody:
      "**Glamour and social scene**: French Riviera wins outright. Cannes, Monaco, Saint-Tropez are the world's most-photographed yacht destinations. **Greek waters give you cinematic anchorages and quieter prestige.** " +
      "**Cost**: Greece 30 to 40% cheaper on equivalent yachts in equivalent weeks. " +
      "**Anchorage character**: Riviera mostly open coastline with marina dockage as primary night stop. **Greece mostly sheltered island anchorages with marina nights only when you choose them.** " +
      "**Cuisine**: Riviera Provençal-Mediterranean fine dining with Michelin density unmatched anywhere. **Greek charter food is excellent and seafood-led but Michelin-density is much lower (only ~6 Michelin-starred restaurants in Greece).** " +
      "**Crew quality**: Both world-class. Riviera crews tend to be older and more polished; Greek crews younger and more energetic. " +
      "**Wind and weather**: Riviera generally calmer summer wind; Greece has the Meltemi for sailing enthusiasts. " +
      "**Photography light**: Greek light is harder, brighter, more saturated; Riviera light softer and golden. Both photograph well in different ways.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If brand-visibility on the social scene matters (paparazzi, social media), the Riviera in August is irreplaceable. If you actually want quiet, Greece.",
      "Combine both: 2 weeks Riviera in July (Monaco GP and Cannes), 2 weeks Greece in September. We coordinate.",
      "Family offices increasingly book Greek charter for their principals' summer weeks and Riviera for September/October celebration events. The cost savings on the long stretch fund the Riviera moment.",
      "Greek waters are now where the better-value-per-Euro 35-50 metre yachts are. The Riviera market has appreciated faster than the Greek fleet.",
      "Crew gratuity convention is similar (12-18% of base rate); the absolute Euro number is lower in Greece because the base rate is lower.",
    ],

    faq: [
      {
        q: "Is the French Riviera always more expensive than Greece?",
        a: "On like-for-like yachts, yes - typically 25 to 40% more. The gap is widest in peak July-August weeks and narrows in shoulder seasons. Riviera marina fees are also significantly higher (€800 to €3,500/night in Monaco vs €200 to €800 in Greek marinas)."
      },
      {
        q: "Which has better restaurants accessible from a yacht?",
        a: "The Riviera. Michelin-starred dining ashore is denser in Antibes, Monaco, Cannes, and Saint-Tropez than anywhere in Greek waters. Greek charter food on board can equal or exceed many of these restaurants, but Greek shoreside fine dining is more limited."
      },
      {
        q: "Where is the better sailing destination?",
        a: "Greek waters, by a meaningful margin. The Meltemi delivers reliable wind, Greek waters have more variety in sailing grounds (Cyclades, Ionian, Saronic, Sporades), and the long-distance sailing culture is stronger in Greece. The Riviera is best for short coastal motor-yacht hops."
      },
      {
        q: "What about the social scene?",
        a: "The Riviera in late July and August is the world's epicentre of yacht social life. Cannes, Monaco GP week, Saint-Tropez evening scenes. Greek waters are quieter; Mykonos approaches Riviera energy in August but Greek anchorages elsewhere are decidedly more private."
      },
      {
        q: "Can we combine Riviera and Greek charter?",
        a: "Yes, in two separate charters. Repositioning a yacht from Monaco to Athens takes 7-10 days and costs €40K to €120K, so practically you'd charter one fleet in the Riviera, fly to Athens, and pick up a separate Greek yacht. We coordinate; many UHNW clients alternate between the two markets year-on-year."
      },
    ],

    ctaTitle: "Charter Greek waters for 2026?",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "greece-vs-turkey-yacht-charter",
    urlPath: "/greece-vs-turkey-yacht-charter",
    eyebrow: "Charter Destination Comparison",
    h1: "Greece vs Turkey Yacht Charter",
    tagline: "Same sea, different shores. The complete comparison for 2026 charterers.",
    seoTitle: "Greece vs Turkey Yacht Charter 2026 | Comparison",
    seoDescription: "Greece vs Turkey for yacht charter: pricing, fleet, regulations, cuisine, anchorages. Detailed 2026 comparison for UHNW charterers.",
    canonical: "https://georgeyachts.com/greece-vs-turkey-yacht-charter",
    touristType: ["Repeat charterers", "UHNW families"],

    whyTitle: "The two shores of the Aegean",
    whyBody:
      "Greece and Turkey share the **Aegean Sea** and split its eastern and western shores. Many of the same destinations are reachable from both: Symi sits 4 nm off the Turkish coast, Bodrum is a 90-minute crossing from Kos. Yet charter from Greek vs Turkish ports gives meaningfully different weeks. " +
      "**Greek waters are more developed for charter**. The fleet is larger and newer. The brokerage infrastructure (IYBA members, MYBA contracts, established practice) is more mature. Greek charter VAT is 13% on commercial charters over 48 hours (24% for short or static charters). The cross-charter regulations are well-known. " +
      "**Turkish waters are 25 to 35% cheaper for equivalent yachts** but the charter market is less standardised. Turkish-flagged yachts on Turkish-only itineraries operate under different regulations than EU-flagged yachts. The MYBA contract is less universal; specific Turkish broker terms vary. " +
      "**Visa and bureaucracy** are now significant. Post-Brexit and post-COVID, Greek-Turkey crossings during a charter require advance paperwork: TRANSAS (Turkish entry), Greek port clearance, and sometimes Schengen visa issues for charter crew. We handle these but the lead time is real. " +
      "**Itinerary suitability**: For Cycladic and central Aegean charters, Greek base is dominant. For the **southern Dodecanese (Kos, Rhodes, Symi) and Turkish Aegean (Bodrum, Marmaris, Göcek)**, a Turkish base or a Greek-Turkey cross-charter can offer better access. We coordinate both options.",

    bestFor: [
      "Charterers considering Dodecanese itineraries with Turkish access",
      "Repeat Greek charter clients wanting Turkish coast variety",
      "UHNW families weighing comfort vs cost vs cultural depth",
      "Anyone planning multi-week itineraries that span both countries",
    ],

    yachtFilter: null,

    whenTitle: "Twelve-point comparison",
    whenBody:
      "**Charter season**: Greece April-October; Turkey similar but with earlier September shoulder. " +
      "**Weekly base rate** (35m motor yacht): Greece €180-280K; Turkey €130-220K. " +
      "**VAT**: Greek 13% (international) or 24% (Greek-only); Turkish 18% (with reductions for foreign-flagged yachts on certain itineraries). " +
      "**Fleet age**: Greek charter fleet slightly newer on average; Turkey strong on gulets and traditional vessels. " +
      "**Anchorage style**: Greek waters mostly open Cycladic roadsteads in summer; Turkish waters mostly sheltered pine-lined bays (similar feel to Croatian coast). " +
      "**Marina infrastructure**: Greek improving (Mykonos, Lefkada, Crete refurbished); Turkish denser (Bodrum, Marmaris, Antalya networks). " +
      "**Cuisine**: Greek Aegean seafood and mezze; Turkish stronger meat tradition with seafood on coast. " +
      "**Cultural depth**: Both world-class. Greek archaeology (Delos, Knossos, Athens); Turkish coastline includes Ephesus, Pamukkale, Bodrum's castle. " +
      "**Cross-border**: Possible but adds 1-2 days paperwork and €1-3K per crossing.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Greek-flagged yacht in Greek-Turkey cross-charter is the cleanest paperwork. Turkish-flagged for Turkish-only itineraries.",
      "Best Turkish-coast destinations for charter: Bodrum, Göcek, Marmaris, Datça, Fethiye. Worth knowing the names if comparing.",
      "Crew visa requirements for Greek-Turkey crossings have tightened since 2024. 6-week lead time on cross-charters minimum.",
      "Greek charter food is more standardised across the fleet; Turkish charter food varies more by chef. Brief if specific.",
      "If the brief is 'less crowded and cheaper than Greece' the answer is often Turkish coast, not Greek Dodecanese.",
    ],

    faq: [
      {
        q: "Is Turkey cheaper than Greece for yacht charter?",
        a: "Yes, typically 25 to 35% cheaper for equivalent yachts in equivalent weeks. The gap closes for premium yachts (the Turkish 40m+ fleet is smaller). For 25 to 35 metre yachts, the savings are most meaningful."
      },
      {
        q: "Can we charter a yacht that crosses Greece and Turkey?",
        a: "Yes. Greek-Turkey cross-charters are common, especially in the southern Dodecanese (Kos, Rhodes, Symi to Bodrum, Marmaris). Requires advance paperwork: Turkish entry, Greek clearance, crew visa coordination. Lead time 6-8 weeks. We handle the logistics."
      },
      {
        q: "Is the Turkish charter market regulated like the Greek one?",
        a: "Different framework. Greek charter operates under MYBA contracts (international standard) and EU regulations. Turkish charter operates under Turkish maritime law with significant variation by broker. We work with vetted Turkish operators; the contract structure is the most variable element to review."
      },
      {
        q: "Which has better anchorages?",
        a: "Both excellent, different. Greek Cyclades have iconic open-water cinematics (Mykonos, Santorini caldera, Folegandros cliffs). Turkish coast has sheltered pine-lined bays (Göcek 12 Islands, Bodrum peninsula). Greek Ionian and Turkish coast share similar sheltered-bay character."
      },
      {
        q: "Is Turkey safe for yacht charter?",
        a: "Yes. The yacht-charter destinations (Bodrum, Marmaris, Göcek, Antalya area) are stable, well-regulated, and well-known to international charterers. Travel advisories are routine; charter operations are uninterrupted. We brief clients on current conditions at booking."
      },
    ],

    ctaTitle: "Charter in Greek waters for 2026?",
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
    seoTitle: "Cyclades vs Ionian Yacht Charter 2026 | Comparison",
    seoDescription: "Cyclades vs Ionian Greek islands for yacht charter: wind, weather, anchorages, recommended yacht types, itineraries. Which fits your 2026 charter.",
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
        a: "Logistically difficult. The two island groups are 200+ nautical miles apart with a long peloponnesian rounding between them. Most clients pick one for a charter and return for the other. We coordinate two-charter sequences."
      },
    ],

    ctaTitle: "Plan your Greek charter for 2026.",
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
    seoTitle: "Motor vs Sailing Yacht Charter Greece 2026",
    seoDescription: "Motor vs sailing yacht charter in Greek waters: speed, cost, comfort, sailing experience. Which yacht type fits your 2026 Greek charter.",
    canonical: "https://georgeyachts.com/motor-vs-sailing-yacht-charter-greece",
    touristType: ["First-time charterers", "Yacht buyers", "Repeat clients"],

    whyTitle: "Two yacht types, two different charter weeks",
    whyBody:
      "Most charterers focus on yacht size when choosing. The bigger question is **yacht type**. A 25-metre motor yacht and a 25-metre sailing yacht in the same week, in the same waters, give two very different experiences. " +
      "**A motor yacht delivers comfort and pace.** Air-conditioned interiors. Stabilisers that neutralise anchor-side roll. 18-22 knot cruise speeds that let you sleep in two destinations in a day. The format suits guests who value the boat as a luxury hotel that moves. " +
      "**A sailing yacht delivers rhythm and romance.** The day is structured by wind and weather rather than itinerary speed. Anchorages are quieter. Fuel costs are 50 to 60% lower. The rhythm of cutting the engine and reaching across the Aegean under sail is the experience charterers remember for years. " +
      "**Greek waters favour both formats differently by season**. July-August in the Cyclades calls for motor yacht comfort during peak Meltemi (or for experienced sailors who want serious wind for sail-handling). May-June and September across all Greek island groups suit sailing perfectly. The Ionian suits sailing year-round; the southern Dodecanese is where motor yachts shine. " +
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
        a: "Yes. APA on motor yachts typically runs 30 to 35% of base rate (vs 25 to 30% on sailing). For a €100K base-rate motor yacht in July, expect €30-35K APA, of which fuel is the largest single line item. We brief clients on APA budget at booking."
      },
      {
        q: "Which holds value better for repeat charters?",
        a: "Motor yachts depreciate faster as a class but rotate inventory faster as well, so the available fleet stays modern. Sailing yachts hold value longer and the fleet includes 20-year-old classics in excellent maintenance. Both are stable as charter assets."
      },
    ],

    ctaTitle: "Find your yacht for 2026.",
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
    seoTitle: "Catamaran vs Monohull Yacht Charter Greece 2026",
    seoDescription: "Catamaran vs monohull yacht charter: stability, deck space, sailing performance, cost. Which yacht hull type fits your Greek charter in 2026.",
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

    ctaTitle: "Find your yacht for 2026.",
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
    seoTitle: "Crewed vs Bareboat Yacht Charter Greece 2026",
    seoDescription: "Crewed vs bareboat yacht charter in Greek waters: cost, requirements, experience needed, what's included. Which fits your 2026 Greek charter.",
    canonical: "https://georgeyachts.com/crewed-vs-bareboat-yacht-charter-greece",
    touristType: ["Yacht charterers", "Sailing enthusiasts", "First-time charterers"],

    whyTitle: "Two charter formats for two different charterers",
    whyBody:
      "**Bareboat charter** means you charter just the boat. You and your party are the crew. You handle navigation, sailing, anchoring, cooking, cleaning, fuelling, and all logistics. The captain of the trip is whoever in your party has the appropriate qualification (typically RYA Day Skipper or Yachtmaster in EU waters). " +
      "**Crewed charter** means you charter the boat with a full crew. At minimum a captain. Usually also a chef, hostess, and sometimes additional deckhands. The crew handles everything; you bring suitcases and preferences. " +
      "**Bareboat is cheaper** (a 50-foot bareboat sailing yacht in Greece runs €4-7K/week; crewed equivalent runs €18-28K/week). The €15K+ difference is the crew and the service. Bareboat suits experienced sailors and budget-conscious charterers. Crewed suits charterers who want the boat as a hotel rather than a hands-on activity. " +
      "**Bareboat requires qualifications**. Greek and EU regulations require at least one onboard sailor with valid charter-skipper certification (RYA Day Skipper or equivalent ICC). For yachts over 24 metres, additional commercial endorsements apply. Crewed charters require nothing from guests beyond signing the contract. " +
      "**In Greek waters specifically**, bareboat is mature and well-supported. There are dozens of bareboat fleet operators (Sunsail, The Moorings, Dream Yacht Charter, etc). Crewed market is what George Yachts handles directly: 200+ yachts, mostly above 50 feet, all with full crews.",

    bestFor: [
      "Experienced sailors with charter-skipper qualifications (bareboat)",
      "Sailing-experienced families wanting cost-conscious week (bareboat)",
      "UHNW charterers wanting boat-as-hotel format (crewed)",
      "First-time charterers without sailing experience (crewed)",
      "Charters above 50-foot where bareboat becomes complex (crewed)",
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
        a: "Yes, dramatically - typically 70 to 80% cheaper on equivalent yachts. A €5K bareboat week vs a €22K crewed week is the typical comparison. The trade-off is that you do all the work: sailing, navigation, cooking, cleaning, anchoring, paperwork."
      },
      {
        q: "Can we bareboat with a hired skipper?",
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

    ctaTitle: "Charter crewed for 2026?",
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
    seoTitle: "Athens vs Mykonos vs Lefkada Charter Departure 2026",
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
      "**Athens (Alimos)**: Best for - first-time charterers, larger groups using the city's full air access. Itinerary unlocks - Saronic (3-day round trip), central Cyclades (7-day arc), Sporades (10-day reach). Marina infrastructure - best in Greece. Transfer time from international flight - 25 minutes by taxi. " +
      "**Athens (Lavrio)**: Best for - long-range eastward itineraries to Sporades or Northern Aegean. Itinerary unlocks - same as Alimos with better Sporades access. Transfer from airport - 60 minutes. Marina is functional but less polished than Alimos. " +
      "**Mykonos**: Best for - Cyclades-focused charters, guests starting from Mykonos hotels. Itinerary unlocks - full Cycladic loop, southern Cyclades (Santorini, Milos), Dodecanese reach. Direct international flights into Mykonos airport May to October. " +
      "**Lefkada**: Best for - Ionian charters, family weeks with young children. Itinerary unlocks - Lefkada to Corfu (4-7 days), Lefkada to Zakynthos (3-day reach south), Lefkada to Paxos (gentlest Ionian week). Air access is Preveza airport (30 minutes) or Athens via 4-hour drive.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Mykonos departure plus a Cyclades arc back to Athens is the magazine-cover Greek charter week. Worth the slightly more complex logistics.",
      "First-time charterers from the US or Asia: book Athens departure. The flight logistics into the country's main airport are simpler.",
      "If your family wants gentle sailing and quiet anchorages, Lefkada is the answer. Don't be talked into Mykonos energy on a family week.",
      "Athens-departure charters often start with day one transiting out to the Saronic. Brief us if this matters; we can build a Mykonos-departure that skips the transit.",
      "Lavrio is underrated. Less crowded marina, faster Sporades access, but tougher airport transfer. Worth knowing about for repeat clients.",
    ],

    faq: [
      {
        q: "What's the easiest departure port for international guests?",
        a: "Athens (Alimos), by far. Athens International Airport is the largest in Greece with direct flights from 80+ international destinations. The marina is 25 minutes from the airport. Most charterers fly in same-day and board same evening."
      },
      {
        q: "Can we charter a yacht to deliver to a different port for departure?",
        a: "Yes, but delivery fees apply (€2-8K depending on yacht size and distance). Most yachts are based at fixed ports - Athens or Lefkada usually - and delivery to Mykonos or Santorini for departure adds cost. We can coordinate; common for repeat clients."
      },
      {
        q: "Is Mykonos departure available year-round?",
        a: "Charter operations from Mykonos run May to October. Outside this window, yachts winter elsewhere and Mykonos-departure becomes uneconomic. For November-April departures, Athens or Lefkada are the options."
      },
      {
        q: "Where do most of the fleet's yachts actually live?",
        a: "Roughly 70% of the Greek charter fleet bases in Athens (Alimos and Lavrio), 15% in Lefkada, 10% in Mykonos for the season, and 5% in other ports (Crete, Rhodes, Skiathos, Volos). When you pick a non-Athens departure, the boat is typically delivered there at the start of the season and stays for some weeks."
      },
      {
        q: "Can a charter end at a different port from where it started?",
        a: "Yes - one-way charters are possible. The one-way fee is typically €1,500 to €5,000 depending on distance. Common one-way patterns: Athens-Mykonos, Lefkada-Corfu, Athens-Lefkada (via the Corinth Canal). We coordinate the routing."
      },
    ],

    ctaTitle: "Plan your departure for 2026.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder",
  },
];

export function getComparisonBySlug(slug) {
  return COMPARISONS.find((c) => c.slug === slug) || null;
}
