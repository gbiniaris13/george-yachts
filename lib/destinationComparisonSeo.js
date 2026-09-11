// Destination comparison data, five head-to-head pages on the
// DestinationComparison template: Greece against Croatia, the French Riviera,
// Italy, Turkey and the Caribbean.
//
// ── 2026-09-11, the rewrite, and why every number changed ─────────────────
//
// The May edition of these pages read like research and was not. It quoted
// "client data" the house never collected (a share of repeat charterers who
// had chartered Croatia, survey results, a share of clients who charter both
// seas), fleet counts for five countries, marina prices per metre, foreign
// VAT rates to the decimal, restaurant star counts, a 35 metre motor yacht at
// EUR 120,000 to 180,000 when the Index band is 59,900 to 150,000, Athens to
// Mykonos at 100 miles when the house table says 90, and the Sporades and
// the Dodecanese as grounds this house sails. None of it was sourced and
// most of it was wrong. The Ahrefs and AI-citation audits of September
// showed the Croatia page alone drawing 213 impressions in 28 days, so the
// engines were lifting those figures as fact.
//
// The rule now is the one applied to the market reports on 6 September:
// every Greek figure comes from a named source this house holds, and the
// other side of the table is described, not priced. Sources for the Greek
// side: lib/charterIndex2026.js (bands, APA, VAT, lead time), the house
// distance table in lib/sailingDistances.js, lib/fleetCount.js (88 yachts,
// 61 with a walkthrough video), the enquiry log in The Helm (68 requests
// logged 30 May to 6 September 2026, four charters closed, all Athens to
// Athens). Foreign tax regimes are stated as structure ("standard rate",
// "reduced rate", "outside the EU"), never as a percentage, because the house
// does not advise on them and they change. Restaurants are not counted.
// Fleets abroad are not counted.
//
// Titles, H1s and URLs are untouched (structure freeze to 18 September).
// A `keyFacts` list and an `evidence` link were added to each entry for the
// answer unit; the template renders them under the quick answer.
//
// Data contract:
//   slug, competitorName, urlPath, eyebrow, h1, tagline
//   shortAnswer           string   -  the answer unit, 40 to 90 words
//   keyFacts              [string] -  Greek-side figures, each with a source
//   evidence              {label, href}
//   introBody             string
//   comparisonTable       [{criterion, greece, competitor, edge, note}]
//   sections              [{title, body}]
//   whoChoosesGreece      [string]
//   whoChoosesCompetitor  [string]
//   verdict               string
//   faq                   [{q, a}]
//   relatedPages          [{title, url}]
//   seoTitle, seoDescription, canonical

const INDEX = { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" };

const GREEK_TAX_NOTE =
  "Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the statutory ceiling; short charters under 48 hours and bareboat hires carry 24 per cent.";

export const DESTINATION_COMPARISONS = [
  // ─────────────────────────────────────────────────────────────
  // GREECE vs CROATIA, the most-asked comparison
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-croatia",
    competitorName: "Croatia",
    urlPath: "/greek-yacht-charter-vs-croatia",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Croatia: A UHNW Decision Guide",
    tagline: "Two of the Mediterranean's most-asked yacht charter destinations, compared honestly.",
    shortAnswer:
      "Greece is the bigger sea: three cruising grounds within a week of Athens, the Cyclades, the Saronic and the Ionian, with more anchorages to spread across in August and a crewed fleet priced per yacht per week from EUR 10,900 on the Greek Charter Index. Croatia is the shorter passage: a dense island chain where the yacht anchors by lunch, a very large bareboat market, and a reduced VAT rate on charter. A first-time charterer who wants the easiest week often starts in Croatia. The charterer who wants the week they will talk about tends to come to Greece, and this house only writes Greek weeks.",
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000 net base, power catamarans 14,000 to 90,000, motor yachts 17,500 to 235,000, per yacht per week before VAT and APA",
      "Passages on the house table: Alimos to Aegina 18 nautical miles, to Hydra 35, to Mykonos 90; Mykonos to Paros 30, Paros to Santorini 60; Corfu to Paxos 35 in the Ionian",
      GREEK_TAX_NOTE,
      "Eighty-eight crewed yachts on this house's list, 42 catamarans and 46 motor yachts, boarding at Athens, Lefkada or Corfu; 61 carry a walkthrough video on their page",
      "Weeks start on any day; the five-night Saronic week from Athens is the shortest programme this house writes",
    ],
    evidence: INDEX,
    introBody:
      "Greece and Croatia are the two Mediterranean charter grounds most often weighed against each other by a family or a group planning a first crewed week, and the comparison is fair: both have hundreds of anchorages, working charter infrastructure and a season that runs from May to October. They are different products, though, and the guest who picks the wrong one for the week they had in mind comes home with a good holiday that was not quite the one they wanted. " +
      "This page is written from one side of the table. This house works only in Greek waters, so what follows on Croatia is what we tell a client who asks, not a brokerage pitch for it, and every Greek figure is from a source we hold.",
    comparisonTable: [
      {
        criterion: "VAT on the charter",
        greece: "Invoiced at the yacht's certified rate, 5.2 to 12 per cent; 13 per cent ceiling",
        competitor: "A reduced rate applies to yacht charter",
        edge: "tie",
        note: "Both countries tax charter below their standard rate. In Greece the exact rate is a property of the yacht and is written into the contract before you sign.",
      },
      {
        criterion: "Weekly net base, crewed, per yacht",
        greece: "EUR 10,900 to 235,000 on the Index, by type and size",
        competitor: "Quoted per yacht by the operator; generally lower than Greece at the same length",
        edge: "competitor",
        note: "Croatia is the cheaper week at most sizes. The Greek figure is the observed range of the rate cards this house holds, not an estimate.",
      },
      {
        criterion: "Passages between islands",
        greece: "Cyclades 25 to 60 nautical miles; Saronic 12 to 35; Ionian 20 to 50 (house table)",
        competitor: "Short hops along a dense coastal chain",
        edge: "competitor",
        note: "Croatia anchors by lunch most days. The Greek week has more sea in it, which is either the point or the drawback.",
      },
      {
        criterion: "Anchorage choice in August",
        greece: "Three grounds, dozens of alternatives within a morning of the famous bays",
        competitor: "Compact, and the popular bays fill early in peak season",
        edge: "greece",
        note: "The Greek escape valve is geography: when Mykonos is full, Rhenia and Kalafati are a few miles away.",
      },
      {
        criterion: "Provisioning and the chef",
        greece: "Island by island, from the morning market of whichever port you woke in",
        competitor: "Largely provisioned from the departure port",
        edge: "greece",
        note: "On a Greek week the chef re-provisions as the yacht moves. It is a structural difference, not a matter of talent.",
      },
      {
        criterion: "Season",
        greece: "May to October; late September and October are the connoisseur weeks",
        competitor: "May to September",
        edge: "greece",
        note: "The Greek shoulder runs longer, and the Index lists shoulder weeks 15 to 25 per cent below peak.",
      },
      {
        criterion: "Summer wind",
        greece: "Meltemi in the Cyclades, 15 to 25 knots for days at a stretch in July and August",
        competitor: "Summer is generally settled",
        edge: "competitor",
        note: "A Greek captain routes around the Meltemi; the Ionian and the Saronic barely feel it.",
      },
      {
        criterion: "Culture ashore",
        greece: "Delos, the Athens museums, Hydra's harbour, Corfu's old town",
        competitor: "Walled medieval and Renaissance towns",
        edge: "tie",
        note: "Different centuries, equally rich.",
      },
      {
        criterion: "Bareboat charter",
        greece: "Not offered by this house; every Greek week here is fully crewed",
        competitor: "One of the largest bareboat markets in Europe",
        edge: "competitor",
        note: "If you intend to sail the boat yourself, Croatia has the depth. Bareboat hires in Greece carry 24 per cent VAT.",
      },
      {
        criterion: "Airport to the yacht",
        greece: "Athens airport to Alimos marina about 25 minutes by car",
        competitor: "Coastal airports close to the main marinas",
        edge: "tie",
        note: "Both are same-afternoon boardings. Greek weeks also board at Lefkada and Corfu.",
      },
      {
        criterion: "Contract and money",
        greece: "MYBA-standard terms, one price per yacht per week, APA 20 to 40 per cent by type",
        competitor: "Varies by operator; ask for the form",
        edge: "greece",
        note: "The Greek contract states base fee, the yacht's certified VAT rate, APA and the gratuity range before you sign.",
      },
    ],
    sections: [
      {
        title: "The cost difference, honestly",
        body:
          "Croatia is usually the cheaper week at the same length of yacht, and we say so. What the Greek rate buys is worth naming. On the Greek Charter Index 2026, built from the rate cards this house holds, a fully crewed sailing catamaran runs from EUR 10,900 a week net base at 14 metres to EUR 90,000 at 24 metres; a power catamaran from EUR 14,000 to 90,000; a motor yacht from EUR 17,500 at 20 metres to EUR 150,000 at 39 metres, and the two yachts above 50 metres from EUR 162,500 to 235,000. " +
          "Every figure is per yacht per week, before Greek VAT at the yacht's certified rate and before APA, which runs 20 to 30 per cent of the base under sail and 30 to 40 per cent on a motor yacht and pays fuel, food and berths at cost. A crew gratuity of 10 to 15 per cent of the base is customary. " +
          "We do not publish a Croatian number, because we do not hold Croatian rate cards and a figure we cannot source is not a figure. Ask the Croatian operator for the gross weekly total with tax and provisioning, and compare it with a Greek proposal that already itemises those lines.",
      },
      {
        title: "Short hops against real passages",
        body:
          "Croatia's geography is compact: an island chain close to a long coast, so most days the yacht is anchored by lunch and the hours underway are short. " +
          "Greek geography is open. On the house distance table Alimos to Mykonos is 90 nautical miles, Mykonos to Santorini 80, and even inside the Cyclades the legs run 25 to 60 miles: Mykonos to Paros 30, Paros to Santorini 60. The Saronic is the exception, with Aegina 18 miles from Alimos, Poros 25 and Hydra 35, which is why the five-night Saronic week is the shortest programme this house writes and the one we suggest to a group that wants to be at anchor more than underway. The Ionian sits between the two, with Corfu to Paxos at 35 miles and Lefkada to Ithaca at 20. " +
          "For guests who get queasy, who have small children, or who want the maximum of swimming time, Croatia or the Greek Saronic. For guests who enjoy the passage itself and want the landscape to change under them, the Cyclades.",
      },
      {
        title: "Privacy in the peak weeks",
        body:
          "Every popular Mediterranean anchorage is busy in the first three weeks of August. The difference is what lies within a morning's sail. " +
          "In the Cyclades, when Mykonos is full the captain moves to Rhenia across the channel, to Kalafati on the east coast, or south to Antiparos, where Soros bay holds in 6 to 12 metres over sand and is sheltered from every direction. Sifnos, Folegandros, Milos and the small islands south of Naxos see a fraction of the traffic. The house anchorage guides give depth, holding and shelter for each of them. " +
          "The Greek pattern in August is to take the famous bay in the morning, lunch somewhere quieter, and spend the night where the only lights are the yacht's own.",
      },
      {
        title: "Food, and how the chef works",
        body:
          "A Greek charter chef provisions as the yacht moves: the morning market in Naxos, a fisherman at the quay in Kythnos, tomatoes and capers bought on the island they grew on. The week's food is an island-by-island tour and it is the part of a Greek charter that guests describe first. " +
          "Croatia has excellent produce and serious wine, and a charter there eats well; the structural difference is that provisioning tends to be done from the departure port for the whole week. " +
          "If the food aboard is the point of the week, Greece. If the wine list ashore is the point, Croatia gives a very good account of itself.",
      },
      {
        title: "The Meltemi",
        body:
          "The Meltemi is the Aegean's northerly summer wind. In July and August it blows across the Cyclades at 15 to 25 knots for days at a stretch, and it is the single variable a Greek captain plans around. On a Meltemi day the south-facing anchorages are calm and the north-facing ones are not; a captain who has anchored in these bays his whole life reads the forecast two days out and moves the plan. " +
          "The Ionian and the Saronic sit outside the Meltemi's reach, which is why families go there in August and why the Cyclades are at their best in June and September. Croatia has no equivalent summer wind, and for a group with poor sea legs and a fixed itinerary that is a genuine advantage.",
      },
      {
        title: "What this house does and does not do",
        body:
          "This house writes weekly, fully crewed charters in Greek waters only: the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu. Eighty-eight yachts are on the list, 42 catamarans and 46 motor yachts, and 61 of them carry a walkthrough video on their page so you can walk the yacht before you ask about her. " +
          "We do not broker bareboat, day charters or Croatia. If Croatia is the right week for you, we will say so and you will not hear from us again until you want Greece.",
      },
    ],
    whoChoosesGreece: [
      "Repeat charterers who have done Croatia and want a different sea",
      "Groups who want anchorage choice in August rather than a queue",
      "Guests for whom the chef's provisioning is part of the holiday",
      "Charterers who want three different grounds, the Cyclades, the Saronic and the Ionian, available from one country",
      "Late-season charterers: October in the Saronic is often perfect",
      "Anyone who wants a fully crewed week with one price per yacht, contract terms itemised before signing",
    ],
    whoChoosesCompetitor: [
      "First-time charterers who want the easiest possible week",
      "Families with very small children or motion-sensitive guests who want short passages",
      "Bareboat sailors; Croatia has the fleet for it",
      "Groups who want the yacht anchored by lunch every day",
      "Charterers for whom the lower weekly cost decides it",
    ],
    verdict:
      "Croatia is the easier charter. Greece is the more memorable one. " +
      "If you have never chartered before and are not sure you will love it, a Croatian week or a five-night Saronic week from Athens is the gentle introduction: short passages, calm water, a good chance of a lovely week. " +
      "If you have chartered before, or you know exactly why you are going, Greece: bigger landscapes, more anchorages to choose from, a chef who shops each morning, and a crewed fleet whose rate cards are published by band on the Greek Charter Index. " +
      "We cannot tell you what share of charterers prefer which, because we do not hold that data and we will not invent it. We can tell you that every charter this house closed this season was a Greek week from Athens, and that the guests came back with the same stories.",
    faq: [
      {
        q: "Is Greece more expensive than Croatia for yacht charter?",
        a: "At the same length of yacht, usually yes: Croatia is the cheaper week. The Greek side is published: on the Greek Charter Index 2026 a crewed sailing catamaran runs EUR 10,900 to 90,000 a week net base, a power catamaran 14,000 to 90,000, a motor yacht 17,500 to 235,000, per yacht per week before VAT at the yacht's certified rate and APA of 20 to 40 per cent. We do not publish Croatian figures we cannot source; ask the operator for the gross weekly total and compare it with a Greek proposal that itemises every line.",
      },
      {
        q: "Can I charter from Greece into Croatia or the other way?",
        a: "Not through this house. Our weeks begin and end in Greek waters, at Athens, Lefkada or Corfu. A cross-Adriatic trip is best built as two separate charters with the yacht repositioning in between, and the second half is not ours to arrange.",
      },
      {
        q: "Which has better food, Greece or Croatia?",
        a: "Aboard the yacht, Greece, because the chef re-provisions island by island instead of loading the week at the departure port. Ashore, both eat very well; Croatia's wine is a genuine strength.",
      },
      {
        q: "Is the Meltemi a real problem for a Greek charter?",
        a: "In the Cyclades in July and August, it is the variable the captain plans around: 15 to 25 knots from the north for days at a stretch. South-facing anchorages stay calm and the captain routes for them. The Ionian and the Saronic sit outside its reach, and June and September in the Cyclades are mostly free of it.",
      },
      {
        q: "How do the contracts compare?",
        a: "This house contracts on MYBA-standard terms: one price per yacht per week, the base fee, the yacht's certified VAT rate, the APA percentage and the customary gratuity range all itemised before you sign, and the broker's commission paid by the owner. Croatian operators use their own forms; ask for it in full before comparing totals.",
      },
      {
        q: "What is the best month for a first charter in each?",
        a: "Greece: late May to June, or September, when the Cyclades are warm and the Meltemi is quiet; the Index lists those weeks 15 to 25 per cent below peak. For August, the Ionian or the Saronic. Croatia: June or September, before and after the crowds.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Full Greek charter fleet", url: "/charter-yacht-greece" },
      { title: "The Greek Charter Index 2026", url: "/greek-charter-index-2026" },
    ],
    seoTitle: "Greek Yacht Charter vs Croatia: Honest UHNW Comparison",
    seoDescription:
      "Greece or Croatia for a crewed yacht week? Passages, anchorages, VAT, food and the published Greek rate bands, compared by a house that only writes Greek weeks.",
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
    h1: "Greek Yacht Charter vs French Riviera: UHNW Decision Guide",
    tagline: "The Greek islands or the Côte d'Azur, two iconic Mediterranean charters compared.",
    shortAnswer:
      "Greece is the landscape charter: three cruising grounds within a week of Athens, anchorages with room in August, a chef who provisions island by island, and a crewed fleet whose weekly rates are published by band on the Greek Charter Index. The French Riviera is the social charter: one short, celebrated coast, the densest concentration of large yachts in the Mediterranean, and the Monaco calendar within reach of the tender. A charterer who wants the scene chooses the Riviera. A charterer who wants the sea chooses Greece, and it is the only sea this house writes.",
    keyFacts: [
      "Greek motor yachts on the Index 2026: EUR 17,500 to 28,000 a week at 18 to 21 metres, 59,900 to 150,000 at 35 to 40 metres, 162,500 to 235,000 above 50 metres, net base per yacht per week",
      "The largest yachts on this house's list: LA PELLEGRINA 1 at 50 metres and ELYSIUM, a 64 metre passenger ship for up to 49 guests; sixteen yachts above 35 metres, all based in Athens",
      GREEK_TAX_NOTE,
      "A Greek week can change ground: Alimos to Hydra is 35 nautical miles, Alimos to Mykonos 90, and the Ionian boards at Lefkada or Corfu",
      "Sixty-one of the eighty-eight yachts on the list carry a walkthrough video on their own page",
    ],
    evidence: INDEX,
    introBody:
      "The French Riviera, Saint-Tropez to Monaco, was the original luxury yacht charter coast and it remains the industry's headquarters: the yacht show, the brokerage houses, the largest concentration of big yachts in the Mediterranean. " +
      "Greece is where the Riviera charterer tends to go next, for bigger landscapes, more room at anchor and a different kind of week. This house works only in Greek waters, so the Riviera half of this page is what we tell a client who asks, and the Greek half is what we can source.",
    comparisonTable: [
      {
        criterion: "VAT on the charter",
        greece: "Invoiced at the yacht's certified rate, 5.2 to 12 per cent; 13 per cent ceiling",
        competitor: "Standard-rate VAT, with reductions tied to time spent outside EU waters; ask for the gross figure",
        edge: "greece",
        note: "The Greek rate is a property of the yacht and is written into the contract. On the Riviera the effective rate depends on how the itinerary is structured.",
      },
      {
        criterion: "Weekly net base, crewed motor yacht, per yacht",
        greece: "EUR 59,900 to 150,000 at 35 to 40 metres; 162,500 to 235,000 above 50 metres (Index 2026)",
        competitor: "Quoted per yacht; the Riviera is the most expensive charter coast in the Mediterranean",
        edge: "greece",
        note: "The Greek figures are the observed range of the rate cards this house holds. We do not publish a Riviera number we cannot source.",
      },
      {
        criterion: "Very large yachts",
        greece: "Sixteen yachts above 35 metres on this list, the largest 50 and 64 metres",
        competitor: "The deepest concentration of yachts above 70 metres anywhere in the Mediterranean",
        edge: "competitor",
        note: "For a specific yacht above 70 metres, Monaco and Antibes are where she is most likely to be berthed.",
      },
      {
        criterion: "Landscape in one week",
        greece: "The Cyclades, the Saronic or the Ionian, each a different world",
        competitor: "One celebrated coast, Saint-Tropez to the Italian border",
        edge: "greece",
        note: "A Greek week can be volcanic, green or pine-scented. The Riviera is one landscape, beautifully done.",
      },
      {
        criterion: "Restaurants ashore",
        greece: "Athens, Mykonos and Santorini have serious tables; the islands eat simply and well",
        competitor: "The argument for the Riviera, and a strong one",
        edge: "competitor",
        note: "If the week is built around dinners ashore, the Riviera. If it is built around the chef aboard, Greece.",
      },
      {
        criterion: "Privacy at anchor",
        greece: "Alternatives within a morning's sail of every famous bay",
        competitor: "A short coast, densely chartered; the famous anchorages are shared in season",
        edge: "greece",
        note: "The Greek geography permits escape. The Riviera's does not.",
      },
      {
        criterion: "Monaco and the social calendar",
        greece: "Not part of a Greek week",
        competitor: "Native: the Grand Prix in May, the yacht show in September",
        edge: "competitor",
        note: "If the charter must coincide with a Monaco event, the Riviera is the only answer.",
      },
      {
        criterion: "Provisioning",
        greece: "Island by island, from the morning market",
        competitor: "Access to some of the best markets in France",
        edge: "tie",
        note: "Different virtues: provenance against range.",
      },
      {
        criterion: "Summer wind",
        greece: "Meltemi in the Cyclades in July and August; the Ionian and the Saronic are calm",
        competitor: "The Mistral, occasional",
        edge: "tie",
        note: "Both coasts have a wind to plan around and a settled shoulder season.",
      },
      {
        criterion: "Swimming and beaches from the yacht",
        greece: "Sand-bottomed bays at scale: Soros on Antiparos in 6 to 12 metres, Manganari on Ios in 4 to 10, Kalafati on Mykonos in 6 to 10",
        competitor: "Beautiful coves, fewer of them, and busy",
        edge: "greece",
        note: "Depths and shelter from the house anchorage guides.",
      },
      {
        criterion: "Contract",
        greece: "MYBA-standard terms, one price per yacht per week, every line itemised before signing",
        competitor: "MYBA-standard terms are common; confirm the VAT treatment in writing",
        edge: "tie",
        note: "The form is similar. The tax line is where the two differ.",
      },
    ],
    sections: [
      {
        title: "The cost gap, stated only as far as we can source it",
        body:
          "The Riviera is the most expensive charter coast in the Mediterranean; nobody in the trade disputes it. What we can put a number on is the Greek side. On the Greek Charter Index 2026 a 35 to 40 metre crewed motor yacht lists at EUR 59,900 to 150,000 a week net base, a 45 to 48 metre at 83,300 to 140,000, and the two yachts above 50 metres at 162,500 to 235,000, each figure the lowest and highest on a rate card this house holds. " +
          "On top of the base: APA of 30 to 40 per cent on a motor yacht for fuel, food and berths at cost, Greek VAT at the yacht's certified rate, and a customary crew gratuity of 10 to 15 per cent of the base. Berths in Greece are a line in the APA rather than a headline; most nights the yacht anchors. " +
          "The Riviera premium buys something real: the scene, the restaurants, the calendar. Whether it is worth it is a question about the week you want, not about the yacht.",
      },
      {
        title: "Landscape variety: Greece's structural advantage",
        body:
          "A Greek week can be one of three countries. The Cyclades are volcanic and white, with the Meltemi and the long views; the Ionian is green, sheltered and Venetian; the Saronic is pine and stone within an afternoon of Athens, Aegina 18 nautical miles from Alimos, Hydra 35. A guest who has chartered the Cyclades comes back for the Ionian and finds a different sea. " +
          "The Riviera is one coast, Saint-Tropez to Menton, and it is beautiful in one consistent way: rocky coves, pines, a run of famous towns. That consistency is the appeal for the charterer who wants to be somewhere recognisable every evening, and the limitation for the one who wants the landscape to change.",
      },
      {
        title: "Monaco's gravitational pull",
        body:
          "There is one case where the Riviera is not a choice but a requirement: a charter that has to coincide with a Monaco event, the Grand Prix in late May or the yacht show in late September. Those weeks need the yacht in Port Hercule or Antibes, and no Greek itinerary can offer them. " +
          "If Monaco is incidental, the calculation changes entirely. The Greek week is longer at anchor, quieter, and the same money goes further on the yacht itself.",
      },
      {
        title: "Restaurants ashore, and the chef aboard",
        body:
          "The Riviera's restaurants are its strongest argument and we will not talk them down. If your week is built around dinners ashore, the Côte d'Azur has the density and the reputations to fill seven evenings. " +
          "Greece answers with the chef aboard. On a Greek week the galley provisions as the yacht moves, from the morning market of whichever port you woke in, and the best meals of the week are usually eaten on the aft deck in a bay with three other boats. Athens, Mykonos and Santorini have serious tables for the nights you want them; the islands eat simply and very well.",
      },
      {
        title: "Privacy: the Riviera's structural problem",
        body:
          "The Riviera coast is short and, in July and August, the most densely chartered water in the Mediterranean. Pampelonne, the Lérins islands, Villefranche: the famous anchorages are shared, and the privacy a guest imagined at the brochure stage is not what the tender finds. " +
          "Greek anchorages, even the famous ones, have alternatives within a morning's sail. When Mykonos is full the captain moves to Rhenia or Kalafati; when Santorini's caldera is busy, Folegandros and Sifnos are a short passage west. The house anchorage guides cover 41 islands in the three grounds with depth, holding and shelter for each bay, and a captain who has anchored in them his whole life reads them before you do.",
      },
      {
        title: "The very top of the fleet",
        body:
          "If the requirement is a specific yacht above 70 metres, the Riviera is where she is most likely to be found: Monaco and Antibes are the berthing capitals of the largest charter yachts and the brokerages that represent them. " +
          "This house's list runs to 50 metres in LA PELLEGRINA 1, twelve guests with a crew of nine at EUR 180,000 to 235,000 a week, and to 64 metres in ELYSIUM, a passenger-certified ship for up to 49 guests at EUR 162,500. Between 35 and 48 metres there are sixteen yachts on the list, all based in Athens, ten of them with a walkthrough video on their page. For a week above that size we say so and help you find her elsewhere.",
      },
    ],
    whoChoosesGreece: [
      "Charterers who have done the Riviera and want a bigger sea",
      "Guests who want room at anchor in August",
      "Groups who eat aboard most nights and want the chef's provisioning to be the point",
      "Families who want sand-bottomed bays to swim from",
      "Charterers who want the same budget to buy more yacht and more days at anchor",
      "Anyone who wants three grounds, the Cyclades, the Saronic and the Ionian, from one country",
    ],
    whoChoosesCompetitor: [
      "Charterers whose week must coincide with Monaco's calendar",
      "Guests who build the week around restaurants ashore",
      "Charterers who need a specific yacht above 70 metres",
      "Anyone who wants the recognisable Saint-Tropez and Cannes experience for its own sake",
      "Owners and buyers around the September yacht show",
    ],
    verdict:
      "The French Riviera is the Mediterranean's most expensive charter coast and its most social. If you want Monaco's calendar or its restaurants, nothing replaces it. " +
      "If you want landscape, room and a chef who shops each morning, Greece delivers a different and, for most families, a better week, on rate cards this house publishes by band. " +
      "We do not hold data on how many Riviera charterers come to Greece next, so we will not claim a pattern. We can say that the guests who ask us this question have usually done the Riviera already.",
    faq: [
      {
        q: "Is a Greek yacht charter cheaper than the French Riviera?",
        a: "Generally yes, and the Greek side is published: a 35 to 40 metre crewed motor yacht lists at EUR 59,900 to 150,000 a week net base on the Greek Charter Index 2026, the yachts above 50 metres at 162,500 to 235,000, before APA of 30 to 40 per cent and VAT at the yacht's certified rate of 5.2 to 12 per cent. Riviera VAT is charged at the standard rate with reductions tied to time outside EU waters, so ask for the gross figure. We do not publish Riviera rates we cannot source.",
      },
      {
        q: "Can I charter from Greece to Monaco?",
        a: "Not as one week through this house; the passage is well over a thousand nautical miles and our charters begin and end in Greek waters. Charterers who want both do two separate weeks in the same year.",
      },
      {
        q: "Which has better restaurants?",
        a: "Ashore, the Riviera, and by a margin. Aboard, Greece, because the chef provisions island by island. Decide which of the two dinners you are chartering for.",
      },
      {
        q: "Are Greek charter yachts of the same standard?",
        a: "Between 20 and 50 metres, yes: the yachts on this list are the same builders and the same refits you would find in Antibes, and 61 of the 88 carry a walkthrough video so you can judge for yourself. Above 70 metres the Riviera has more yachts to choose from.",
      },
      {
        q: "Is the Riviera easier for a first charter?",
        a: "Shorter passages and no Meltemi make it gentle. The Greek Saronic offers the same gentleness, Aegina 18 miles from Alimos and Hydra 35, with the five-night week from Athens as the shortest programme this house writes.",
      },
      {
        q: "What is the best month for each?",
        a: "Greece: late May to June or September for the Cyclades, when the Meltemi is quiet and the Index lists weeks 15 to 25 per cent below peak; the Ionian and the Saronic hold up in August. The Riviera: outside the Monaco weeks unless the event is the reason you are going.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "The Greek Charter Index 2026", url: "/greek-charter-index-2026" },
    ],
    seoTitle: "Greek Yacht Charter vs French Riviera",
    seoDescription:
      "Greece or the French Riviera for a crewed yacht week? Landscape, anchorages, VAT, restaurants and the published Greek rate bands, compared honestly.",
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
    h1: "Greek Yacht Charter vs Italy: Amalfi, Sardinia, and the Choice",
    tagline: "Greece's island archipelagos against Italy's twin yachting capitals, compared honestly.",
    shortAnswer:
      "Italy is two charters, Amalfi and Sardinia, each iconic, each concentrated, each busy in August and each priced at the top of the Mediterranean. Greece is three cruising grounds from one country, the Cyclades, the Saronic and the Ionian, with more anchorages to spread across, a VAT rate that is a property of the yacht and written into the contract, and crewed weekly rates published by band on the Greek Charter Index from EUR 10,900. Italy is the week for the photographs. Greece is the week people come back to, and it is the only week this house writes.",
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000 net base, motor yachts 17,500 to 235,000, per yacht per week before VAT and APA",
      GREEK_TAX_NOTE,
      "Greek anchorages do not need a berth booked a year ahead: Mykonos, Hydra and Santorini are taken at anchor or on buoys and reached by tender",
      "Passages on the house table: Alimos to Hydra 35 nautical miles, Mykonos to Paros 30, Paros to Santorini 60, Corfu to Paxos 35",
      "Eighty-eight crewed yachts on the list, 42 catamarans and 46 motor yachts; 61 with a walkthrough video on their page",
    ],
    evidence: INDEX,
    introBody:
      "Italian yacht chartering is really two products. Amalfi, with Capri, Positano and Ischia, is the short, celebrated coast. Sardinia, with the Costa Smeralda and the Maddalena archipelago, is the longer cruising ground with the grander harbour scene. Both are spectacular, both are expensive, both are crowded in July and August. " +
      "Greece offers three different grounds from one country and a different economy. This house works in Greek waters only, so the Italian half of this page is what we tell a client who asks; the Greek half is sourced.",
    comparisonTable: [
      {
        criterion: "VAT on the charter",
        greece: "Invoiced at the yacht's certified rate, 5.2 to 12 per cent; 13 per cent ceiling; stated in the contract",
        competitor: "Standard-rate VAT with reductions tied to time outside EU waters; quotes are often net of tax",
        edge: "greece",
        note: "Ask any Italian quote whether it is gross or net. A Greek proposal from this house states the rate before you sign.",
      },
      {
        criterion: "Weekly net base, crewed, per yacht",
        greece: "EUR 10,900 to 235,000 on the Index, by type and size",
        competitor: "Quoted per yacht; Amalfi and the Costa Smeralda sit at the top of the Mediterranean",
        edge: "greece",
        note: "The Greek range is observed from rate cards this house holds. We do not publish an Italian figure.",
      },
      {
        criterion: "Anchorage and berth",
        greece: "At anchor or on buoys; Hydra and Mykonos by tender, Santorini on the Ammoudi buoys",
        competitor: "Berths at Capri and Porto Cervo are the constraint of the Italian summer",
        edge: "greece",
        note: "A Greek week does not penalise the charterer who books six months out.",
      },
      {
        criterion: "The photograph",
        greece: "Santorini's caldera, Hydra's harbour, Corfu's old town",
        competitor: "Positano, the Faraglioni, Porto Cervo",
        edge: "competitor",
        note: "Amalfi is the most photographed coast in the Mediterranean, and it earns it.",
      },
      {
        criterion: "Restaurants ashore",
        greece: "Athens, Mykonos and Santorini have serious tables; the islands eat simply and well",
        competitor: "The argument for Italy, and a strong one",
        edge: "competitor",
        note: "If the week is dinners ashore, Italy. If it is the chef aboard, Greece.",
      },
      {
        criterion: "Passages",
        greece: "Cyclades 25 to 60 nautical miles; Saronic 12 to 35; Ionian 20 to 50 (house table)",
        competitor: "Amalfi short; Sardinia and the Maddalena open",
        edge: "tie",
        note: "Choose the Greek ground by the passage you want: the Saronic for short legs, the Cyclades for sea.",
      },
      {
        criterion: "Variety in one week",
        greece: "Three grounds, each a different world",
        competitor: "Amalfi is concentrated; Sardinia is one long coast",
        edge: "greece",
        note: "After the icons of Amalfi the week needs imagination; the Greek week keeps changing.",
      },
      {
        criterion: "Culture ashore",
        greece: "Delos, the Athens museums, Byzantine and Venetian Corfu",
        competitor: "Greco-Roman, Renaissance and the maritime republics",
        edge: "tie",
        note: "Both have millennia; different ones.",
      },
      {
        criterion: "Swimming from the yacht",
        greece: "Sand-bottomed bays at scale, depths on the house anchorage guides",
        competitor: "Sardinia has fine beaches; Amalfi has few",
        edge: "greece",
        note: "For children, the Greek Cyclades south coasts and the Ionian.",
      },
      {
        criterion: "Contract",
        greece: "MYBA-standard terms, one price per yacht per week, every line itemised",
        competitor: "MYBA-standard terms are common; confirm the tax line in writing",
        edge: "tie",
        note: "Same form. The tax treatment is the difference.",
      },
    ],
    sections: [
      {
        title: "Amalfi: concentrated, celebrated, short",
        body:
          "The Amalfi week is the most recognisable image in Mediterranean chartering: the yacht off Positano, lunch by tender, a swim off Capri. The Italian provenance in food, wine and design is genuinely world class and the coast earns its photographs. " +
          "It is also short. The classic run from Capri to Ischia and along the Amalfi coast is a few days of cruising, and the rest of the week goes to the Aeolians or back to Naples. For the charterer who wants to be in the icon, that concentration is the point. For the one who wants a week that keeps changing, it is the limit.",
      },
      {
        title: "Sardinia and the Costa Smeralda",
        body:
          "Sardinia is Italy's other yachting capital and the grander of the two: Porto Cervo's harbour, the Maddalena archipelago to the north, and the largest gathering of big yachts on the Italian coast in August. The cruising covers more water than Amalfi and the beaches are better. " +
          "The premium is the most pronounced on the Italian coast, and the berth is the constraint. A Greek equivalent to Porto Cervo does not exist and this house does not pretend one does; the Greek pattern is dispersed across three grounds rather than concentrated in one harbour.",
      },
      {
        title: "Tax: the line to read twice",
        body:
          "Italian charter VAT is charged at the standard rate, with reductions tied to time the yacht spends outside EU waters, and Italian quotes are often presented net of tax. The charterer who does not ask whether a figure is gross or net can meet a large surprise at the second invoice. We do not advise on Italian tax and do not publish a rate for it. " +
          "The Greek regime is simpler because the rate belongs to the yacht: 5.2, 6.5, 7.8 or 12 per cent by her certification, 13 per cent the statutory ceiling, stated in the contract before you sign, with no structuring required. Short charters under 48 hours and bareboat hires carry 24 per cent, which is one reason this house writes weeks.",
      },
      {
        title: "Restaurants ashore, and the chef aboard",
        body:
          "Italy's tables are its strongest argument. A week built around dinners ashore in Capri or on the Costa Smeralda fills seven evenings without effort, and we will not talk that down. " +
          "Greece answers with the chef aboard, provisioning island by island from the morning market, and with the aft deck at anchor as the dining room. Athens, Mykonos and Santorini have serious restaurants for the nights you want them. Decide which dinner you are chartering for.",
      },
      {
        title: "The berth problem, and why Greece does not have it",
        body:
          "The Italian summer is rationed by berths. Capri and Porto Cervo fill their harbours long in advance and the charterer who books a few months out anchors off and tenders in, which is fine, but it is not the brochure. " +
          "Greek harbours are taken at anchor by habit rather than by necessity. Hydra's port is small and yachts lie off it; Mykonos anchors at Ornos, Psarou or Kalafati and tenders to town; Santorini takes the mooring buoys at Ammoudi below Oia, where the caldera is 80 to 180 metres deep and no anchor holds. None of it needs a berth booked the year before. On the Greek Charter Index the lead time that matters is the yacht's, six to twelve months for July and August, not the harbour's.",
      },
    ],
    whoChoosesGreece: [
      "Charterers who want three grounds from one country rather than one concentrated coast",
      "Anyone who wants the tax line settled before signing",
      "Charterers booking three to six months out who do not want to be rationed by a berth",
      "Families who want sand-bottomed bays to swim from",
      "Repeat charterers who have done Amalfi and want a different sea",
      "Groups who eat aboard most nights",
    ],
    whoChoosesCompetitor: [
      "First-charter guests who want the Amalfi photographs",
      "Charterers who build the week around restaurants ashore",
      "Anyone for whom Porto Cervo in August is the point",
      "Charterers who can book the berths a year ahead",
      "Guests who want Italian wine, design and provenance above all",
    ],
    verdict:
      "Amalfi and Sardinia are world-class charter coasts, and the Italian week is an event: the photographs, the tables, the harbour. " +
      "Greece is the week that keeps changing, on anchorages that do not need booking and a tax line that is settled before you sign, with the yacht's weekly rate published by band. " +
      "Italy is the trip you take for the pictures. Greece is the one you take for the sea. This house writes only the second, and says so.",
    faq: [
      {
        q: "Is Italian VAT higher than Greek VAT on a charter?",
        a: "Italian charter VAT is charged at the standard rate with reductions tied to time outside EU waters, and quotes are often net of it; we do not advise on it or publish a figure. Greek VAT on a weekly crewed charter is invoiced at the yacht's certified rate, 5.2, 6.5, 7.8 or 12 per cent, with 13 per cent the ceiling, and the rate is stated in the contract before you sign.",
      },
      {
        q: "Can I charter from Greece to Italy?",
        a: "Not as one week through this house. Our charters begin and end in Greek waters. Charterers who want both do two separate weeks, and the Italian one is not ours to arrange.",
      },
      {
        q: "Amalfi or Sardinia?",
        a: "Amalfi for the shorter, more famous coast and the dinners ashore. Sardinia for more water, better beaches and the Maddalena. Neither is ours to book; both are honest answers to the question.",
      },
      {
        q: "Do Greek harbours have the Capri berth problem?",
        a: "No. Greek yachts take the famous harbours at anchor or on buoys and tender in: Hydra, Mykonos at Ornos or Kalafati, Santorini on the Ammoudi buoys. The lead time that matters in Greece is the yacht's, six to twelve months for a July or August week on the Index.",
      },
      {
        q: "Which has the better food aboard?",
        a: "Both galleys are excellent. The structural difference is that a Greek chef provisions island by island as the yacht moves, so the week's food is a tour of where you have been.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "The Greek Charter Index 2026", url: "/greek-charter-index-2026" },
    ],
    seoTitle: "Greek Yacht Charter vs Italy: Which Wins?",
    seoDescription:
      "Greece, Amalfi or Sardinia for a crewed yacht week? Tax, berths, anchorages and the published Greek rate bands, compared by a house writing only Greek weeks.",
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
    h1: "Greek Yacht Charter vs Turkey: The Aegean Decision Guide",
    tagline: "Two coastlines of the same Aegean, two very different charter products.",
    shortAnswer:
      "Greece and Turkey share the Aegean and little else in how a charter is sold. Greece is the EU market: MYBA-standard contracts, the yacht's VAT rate written into the agreement, a crewed fleet of motor yachts and catamarans priced per yacht per week on the Greek Charter Index from EUR 10,900. Turkey is the gulet coast: the traditional wooden charter yacht at scale, a lower cost base, and the Lycian shore's remoteness, outside the EU's regulatory frame. A charterer who wants a modern crewed yacht under European terms chooses Greece. A charterer who wants a gulet week at a lower price chooses Turkey. This house writes only the first.",
    keyFacts: [
      "Greek crewed weeks on the Index 2026: sailing catamarans EUR 10,900 to 90,000, power catamarans 14,000 to 90,000, motor yachts 17,500 to 235,000, net base per yacht per week",
      GREEK_TAX_NOTE,
      "Contract: MYBA-standard terms, the base fee, the certified VAT rate, APA of 20 to 40 per cent by type and the customary 10 to 15 per cent gratuity itemised before signing",
      "Gulets: this house does not carry them; the Index has no gulet band and quotes them on request only",
      "Grounds: the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu; no cross-border weeks",
    ],
    evidence: INDEX,
    introBody:
      "Greek and Turkish yacht chartering share a sea and differ in almost everything else. Greece is the EU-regulated, English-speaking market that contracts on the MYBA form and charters modern crewed motor yachts and catamarans. Turkey is the gulet market, the traditional wooden charter yacht built for the purpose on its own coast, at a lower cost base and outside the EU. " +
      "This house works in Greek waters only and does not broker gulets, so the Turkish half of this page is what we tell a client who asks, not a product we sell.",
    comparisonTable: [
      {
        criterion: "VAT on the charter",
        greece: "Invoiced at the yacht's certified rate, 5.2 to 12 per cent; 13 per cent ceiling",
        competitor: "Turkey is outside the EU and applies its own standard VAT; confirm the gross figure with the operator",
        edge: "greece",
        note: "The Greek rate is a property of the yacht and appears in the contract. We do not advise on Turkish tax.",
      },
      {
        criterion: "Weekly net base, crewed, per yacht",
        greece: "EUR 10,900 to 235,000 on the Index, by type and size",
        competitor: "Quoted per yacht; the Turkish cost base is lower, most visibly on gulets",
        edge: "competitor",
        note: "Turkey is the cheaper week. The Greek figures are observed from rate cards this house holds; we publish no Turkish number.",
      },
      {
        criterion: "The gulet",
        greece: "Not carried by this house; the Index has no gulet band",
        competitor: "The national product, built for charter on the Bodrum and Marmaris coast",
        edge: "competitor",
        note: "For a gulet week, Turkey has the fleet, the yards and the price.",
      },
      {
        criterion: "Contract",
        greece: "MYBA-standard terms, one price per yacht per week, every line itemised before signing",
        competitor: "MYBA-standard and local forms both in use; read which one you are signing",
        edge: "greece",
        note: "A family office that wants a known form and a known jurisdiction has less to review on the Greek side.",
      },
      {
        criterion: "Regulatory frame",
        greece: "EU member: EU shipping rules and data protection apply",
        competitor: "Outside the EU; a separate regulatory and legal regime",
        edge: "greece",
        note: "Relevant to the charterer who cares about jurisdiction; irrelevant to the one who cares only about the week.",
      },
      {
        criterion: "Coastline",
        greece: "The Cyclades, the Ionian, the Saronic: islands, white towns, Venetian harbours",
        competitor: "The Lycian shore: mountains to the water, pine, ruins on the headlands",
        edge: "tie",
        note: "Both spectacular, in different registers. Turkey's coast is greener; the Greek islands are the more dramatic.",
      },
      {
        criterion: "Room at anchor",
        greece: "Three grounds and alternatives within a morning's sail of every famous bay",
        competitor: "A less developed coast with fewer charter yachts on it",
        edge: "competitor",
        note: "The Lycian coast is quiet by default. The Greek equivalent needs the captain to choose it: Sifnos, Folegandros, Kythnos, the Ionian.",
      },
      {
        criterion: "Crew and language",
        greece: "Professional crews, English spoken aboard as standard",
        competitor: "Varies by yacht; confirm with the operator",
        edge: "greece",
        note: "Every yacht on this list is fully crewed: captain and chef at minimum, up to ten on the largest.",
      },
      {
        criterion: "Food",
        greece: "Greek and Mediterranean, provisioned island by island by the chef",
        competitor: "Turkish and Levantine, excellent, with simpler galleys on many gulets",
        edge: "tie",
        note: "Both eat very well. Different tables.",
      },
      {
        criterion: "Airport to the yacht",
        greece: "Athens airport to Alimos marina about 25 minutes; Corfu and Lefkada for the Ionian",
        competitor: "Bodrum and Dalaman serve the coast; transfers vary",
        edge: "tie",
        note: "Both are same-day boardings.",
      },
      {
        criterion: "Modern crewed motor yachts and catamarans",
        greece: "Forty-six motor yachts and forty-two catamarans on this list, 61 with a walkthrough video",
        competitor: "A smaller modern fleet beside a very large gulet fleet",
        edge: "greece",
        note: "For a stabilised motor yacht or a crewed catamaran with a full galley, Greece has the depth.",
      },
    ],
    sections: [
      {
        title: "The price gap, and what sits behind it",
        body:
          "Turkey is the cheaper charter, and the reasons are structural: a lower cost base ashore, a fleet built locally for charter rather than imported, and a national product, the gulet, that was designed to be affordable at length. We do not publish a Turkish rate because we hold no Turkish rate cards. " +
          "The Greek side is published. On the Greek Charter Index 2026 a crewed sailing catamaran runs EUR 10,900 to 90,000 a week net base, a power catamaran 14,000 to 90,000, a motor yacht 17,500 to 235,000, per yacht per week, before Greek VAT at the yacht's certified rate and APA of 20 to 40 per cent by type. A Greek proposal from this house itemises every one of those lines before you sign; ask a Turkish operator for the same and compare the gross totals.",
      },
      {
        title: "Regulation: Greece's advantage, for the client who needs it",
        body:
          "Greece is an EU member. EU shipping rules and EU data protection apply, the contract is the MYBA form, and disputes are settled under a jurisdiction a family office already knows. " +
          "Turkey is outside the EU and runs its own regime, with local contract forms alongside the MYBA form. For a charterer whose office insists on a known framework, that is less to review on the Greek side. For the charterer who cares only about the week, it is not a factor.",
      },
      {
        title: "The Lycian coast, and its Greek equivalents",
        body:
          "The Turkish shore from Fethiye south to Kaş is one of the Mediterranean's least developed charter coasts: mountains falling to the water, pine, ruins on the headlands, deep clear bays with few other yachts in them. Its remoteness is its argument. " +
          "The Greek grounds this house works have their own quiet: Kythnos, Serifos and Sifnos in the western Cyclades, Folegandros, the small islands south of Naxos, the inner Ionian around Meganisi and Kalamos. They need the captain to choose them over Mykonos, which he will if asked. The house anchorage guides give depth, holding and shelter for each.",
      },
      {
        title: "The gulet, honestly",
        body:
          "The gulet is Turkey's product: a wooden motor-sailer built on the Bodrum and Marmaris coast for charter, slow at seven or eight knots, with a great deal of deck and a relaxed pace. For a gulet week Turkey has the fleet, the yards and the price, and we will not pretend otherwise. " +
          "This house does not carry gulets and the Greek Charter Index has no gulet band; we quote them on request only. The comparable crewed Greek week is a sailing catamaran of 20 to 22 metres at EUR 31,500 to 43,500 net base, or a crewed sailing yacht of 24 to 31 metres at 24,000 to 55,000, reaching the same bays with a full galley and a table that stays set.",
      },
      {
        title: "Combining the two",
        body:
          "Cross-border charters between Greek and Turkish waters exist in the trade, on yachts whose flag and paperwork allow it, with a customs stop on each side. This house does not write them. Our weeks begin and end in Greek waters, at Athens, Lefkada or Corfu, in the Cyclades, the Saronic and the Ionian. A charterer who wants both coasts takes two separate weeks, and the Turkish one is not ours to arrange.",
      },
    ],
    whoChoosesGreece: [
      "Charterers who want a modern, stabilised motor yacht or a crewed catamaran with a full galley",
      "Family offices that want the MYBA form and an EU jurisdiction",
      "Guests who want English spoken aboard as standard",
      "Charterers who want the VAT rate settled in the contract before signing",
      "Anyone who wants three cruising grounds from one country",
      "Groups above 35 metres: sixteen yachts on this list, all based in Athens",
    ],
    whoChoosesCompetitor: [
      "Gulet charterers; Turkey is where the gulet is built and priced",
      "Charterers for whom the lower weekly cost decides it",
      "Guests who want the Lycian coast's remoteness by default",
      "Charterers who want Turkish food and Anatolian archaeology ashore",
      "Anyone comfortable outside the EU's contractual frame",
    ],
    verdict:
      "Turkey offers a lower-cost week on a spectacular coast and the gulet at its best. For a gulet charter, or for a value-led week where the wooden hull and the slow pace are the point, it is the honest answer. " +
      "Greece offers the MYBA contract, EU regulation, English aboard, a crewed fleet of modern motor yachts and catamarans and rate cards published by band. For a modern crewed yacht under European terms, Greece. " +
      "The two are complementary rather than rivals, and many charterers do both in different years. This house writes only the Greek one and says so.",
    faq: [
      {
        q: "Is a Turkish yacht charter cheaper than a Greek one?",
        a: "Usually yes, most clearly on gulets, because the cost base ashore is lower and the fleet is built locally for charter. The Greek side is published: crewed catamarans from EUR 10,900 a week net base and motor yachts from 17,500 on the Greek Charter Index 2026, before VAT at the yacht's certified rate and APA of 20 to 40 per cent. We do not publish a Turkish figure we cannot source.",
      },
      {
        q: "Can I charter from Greece into Turkey?",
        a: "Not through this house. Our weeks begin and end in Greek waters, in the Cyclades, the Saronic and the Ionian. Cross-border charters exist in the trade on yachts whose flag allows it; a charterer who wants both coasts takes two separate weeks.",
      },
      {
        q: "Does George Yachts charter gulets?",
        a: "No. The Greek Charter Index has no gulet band and this house quotes gulets on request only. The comparable crewed Greek weeks are a sailing catamaran of 20 to 22 metres at EUR 31,500 to 43,500 net base or a crewed sailing yacht of 24 to 31 metres at 24,000 to 55,000.",
      },
      {
        q: "Is English spoken aboard a Greek charter?",
        a: "Yes, as standard. Every yacht on this list is fully crewed, captain and chef at minimum, and this house's guests are mostly American, so English aboard is the working language.",
      },
      {
        q: "Which has the better food?",
        a: "Both eat very well. A Greek chef provisions island by island as the yacht moves; Turkish and Levantine cooking is superb ashore and simpler in many gulet galleys. Decide where you want the best meal of the week to happen.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Crewed catamaran charter Greece", url: "/crewed-catamaran-charter-greece" },
      { title: "The Greek Charter Index 2026", url: "/greek-charter-index-2026" },
    ],
    seoTitle: "Greek Yacht Charter vs Turkey: Aegean Guide",
    seoDescription:
      "Greece or Turkey for a crewed yacht week? Contract, VAT, gulets, coastline and the published Greek rate bands, compared by a house that writes only Greek weeks.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-turkey",
  },

  // ─────────────────────────────────────────────────────────────
  // GREECE vs CARIBBEAN (BVI, St. Barths)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "greek-yacht-charter-vs-caribbean",
    competitorName: "Caribbean (BVI & St. Barths)",
    urlPath: "/greek-yacht-charter-vs-caribbean",
    eyebrow: "Destination comparison",
    h1: "Greek Yacht Charter vs Caribbean: Mediterranean vs Tropical",
    tagline: "Two of the world's premier yacht charter destinations: different seas, different seasons, different experiences.",
    shortAnswer:
      "Greece is the summer charter, May to October: cultural depth in every harbour, three cruising grounds from one country, and a crewed fleet priced per yacht per week on the Greek Charter Index from EUR 10,900. The Caribbean is the winter charter, November to April: warm water, the steadiest sailing wind in the trade, and St. Barths' season. They are opposites on the calendar rather than rivals, and a family that charters twice a year often does both. This house writes only the Greek summer.",
    keyFacts: [
      "Greek season on the Index: May to October, with July and August booking six to twelve months ahead and the shoulder months listing 15 to 25 per cent below peak",
      "Greek crewed weeks on the Index 2026: catamarans EUR 10,900 to 90,000 net base, motor yachts 17,500 to 235,000, per yacht per week before VAT and APA",
      GREEK_TAX_NOTE,
      "Athens is a direct flight from New York; Athens airport to Alimos marina is about 25 minutes by car",
      "Most of this house's guests are American; every charter it closed this season was a Greek week from Athens",
    ],
    evidence: INDEX,
    introBody:
      "Greek and Caribbean chartering are rarely a direct choice, because they happen in opposite halves of the year: Greece from May to October, the Caribbean from November to April. The question a family actually faces is whether the year's yacht week is a summer week or a winter one, and for a family with two, which sea takes which. " +
      "This house works in Greek waters only, so the Caribbean half of this page is what we tell a client who asks. The Greek half is sourced.",
    comparisonTable: [
      {
        criterion: "Season",
        greece: "May to October, peak June to September",
        competitor: "November to April, peak December to March",
        edge: "tie",
        note: "Opposite halves of the year. A family with two charters can have both.",
      },
      {
        criterion: "VAT on the charter",
        greece: "Invoiced at the yacht's certified rate, 5.2 to 12 per cent; 13 per cent ceiling",
        competitor: "Most Caribbean charter jurisdictions charge no VAT on the charter fee",
        edge: "competitor",
        note: "The Caribbean week is structurally free of charter VAT; the Greek rate is low and stated in the contract.",
      },
      {
        criterion: "Weekly net base, crewed, per yacht",
        greece: "EUR 10,900 to 235,000 on the Index, by type and size",
        competitor: "Quoted per yacht, typically in US dollars, by the operator",
        edge: "tie",
        note: "The Greek range is observed from rate cards this house holds. We publish no Caribbean number.",
      },
      {
        criterion: "Water",
        greece: "Aegean and Ionian summer water, warmest in August and September",
        competitor: "Tropical, warm through the winter season",
        edge: "competitor",
        note: "The Caribbean's water is the reason to fly nine hours in January.",
      },
      {
        criterion: "Culture ashore",
        greece: "Delos, the Athens museums, Hydra's captains' houses, Corfu's old town",
        competitor: "Beach and harbour towns; St. Barths' social season",
        edge: "greece",
        note: "A Greek week has history within a tender's ride of every anchorage.",
      },
      {
        criterion: "Sailing wind",
        greece: "Meltemi in the Cyclades in July and August; the Ionian and the Saronic gentle",
        competitor: "The trade winds, the steadiest charter wind anywhere",
        edge: "competitor",
        note: "For sailing as sailing, the BVI. For sailing as transport between islands worth arriving at, Greece.",
      },
      {
        criterion: "Bareboat",
        greece: "Not offered by this house; every Greek week here is fully crewed",
        competitor: "The largest bareboat market in the world",
        edge: "competitor",
        note: "If you intend to sail the boat yourself, the BVI.",
      },
      {
        criterion: "Room at anchor",
        greece: "Three grounds, alternatives within a morning's sail of every famous bay",
        competitor: "The BVI are compact and busy in peak; St. Barths is small and exclusive",
        edge: "greece",
        note: "The Greek geography permits escape.",
      },
      {
        criterion: "From Europe",
        greece: "Three to four hours from London or Paris; Alimos 25 minutes from Athens airport",
        competitor: "A long-haul flight and a connection",
        edge: "greece",
        note: "For a European family, a Greek week loses no days to travel.",
      },
      {
        criterion: "From the United States",
        greece: "A direct overnight flight from New York to Athens",
        competitor: "A few hours from the east coast",
        edge: "competitor",
        note: "Most of this house's guests are American and take the overnight flight; the Caribbean is the shorter trip.",
      },
      {
        criterion: "Variety in one week",
        greece: "The Cyclades, the Saronic or the Ionian, each a different world",
        competitor: "A chain of similar islands, with St. Barths the exception",
        edge: "greece",
        note: "The Greek week keeps changing.",
      },
    ],
    sections: [
      {
        title: "The calendar decides most of it",
        body:
          "Greek peak is June to September; Caribbean peak is December to March. The same family cannot be in both at once, so the question is usually which half of the year the yacht week belongs to. A summer charter joins the European school holidays and the long light; a winter charter is the escape from them. " +
          "Families who charter twice a year often take Greece in summer and the Caribbean in winter. We do not hold data on how many do, and we will not invent a share. We can say that this house's own season is May to October and that on the Greek Charter Index the July and August weeks book six to twelve months ahead.",
      },
      {
        title: "The BVI: sailing as the point",
        body:
          "The British Virgin Islands are the most concentrated sailing charter ground in the world: a steady trade wind, islands a few miles apart, sheltered anchorages and the deepest bareboat infrastructure anywhere. For a week where the sailing itself is the point, the BVI are structurally superior and we say so. " +
          "Greek sailing is a different pleasure: the Meltemi in the Cyclades for those who want wind, the Ionian for those who want it gentle, and in both cases an island worth arriving at. This house's list has 27 crewed sailing catamarans and six crewed sailing yachts of 24 to 31 metres, every one with a captain who does the sailing, and no bareboat.",
      },
      {
        title: "St. Barths, and its Greek equivalent",
        body:
          "St. Barths is the Caribbean's social capital, with a harbour that fills with large yachts through December and a calendar around the New Year that has no Greek counterpart, because the Greek charter season is over by then. " +
          "The nearest Greek equivalent is Mykonos in August, broader and busier, and the Greek answer to either is the anchorage a few miles away where the only lights are your own.",
      },
      {
        title: "Culture ashore: Greece's structural advantage",
        body:
          "A Greek week has history within a tender's ride of every anchorage: Delos across the channel from Mykonos, the captains' houses of Hydra, the Venetian old town of Corfu, the museums of Athens on the day you board. It is part of the itinerary whether or not you plan it. " +
          "A Caribbean week is sea and beach, and is not trying to be anything else. For a family that wants the shore to mean something, Greece. For a family that wants the water to be everything, the Caribbean is honest about what it offers.",
      },
      {
        title: "Logistics, from either side of the Atlantic",
        body:
          "For a European family, Greece is three to four hours from London or Paris, and Athens airport to Alimos marina is about 25 minutes by car: the week begins the afternoon you land. The Caribbean costs a long-haul flight and a connection each way. " +
          "For an American family the geometry reverses: the Caribbean is a few hours from the east coast, Greece an overnight flight from New York. Most of this house's guests are American and take that flight for a week or two; for a shorter charter the Caribbean is the practical choice, and we say so.",
      },
    ],
    whoChoosesGreece: [
      "European families, for whom a Greek week loses no days to travel",
      "Charterers who want the shore to mean something",
      "Groups who want three grounds from one country",
      "Summer charterers, June to September, or the shoulder weeks at 15 to 25 per cent below peak",
      "Guests who want the chef's Mediterranean provisioning",
      "Anyone who wants a modern crewed motor yacht or catamaran with rates published by band",
    ],
    whoChoosesCompetitor: [
      "Winter charterers who want warm tropical water",
      "Sailors, for whom the trade winds are the point",
      "Guests who want the St. Barths season around the New Year",
      "American east-coast families on a shorter trip",
      "Bareboat sailors; the BVI have the fleet",
    ],
    verdict:
      "Greece and the Caribbean are complements, not rivals: the summer week and the winter week. " +
      "Choose Greece if you are in Europe, if the shore matters as much as the water, or if you want three grounds from one country on rates published by band. Choose the Caribbean if you are on the American east coast with a short window, if the sailing is the point, or if the St. Barths season is the reason. " +
      "Both are world class. This house writes only the Greek summer, and will tell you when the other is the better answer.",
    faq: [
      {
        q: "Can I charter year-round in either?",
        a: "Practically, no. The Greek season runs May to October; many yachts refit through the winter. The Caribbean season runs November to April, around the hurricane months. They do not overlap.",
      },
      {
        q: "Is the Caribbean cheaper because there is no VAT?",
        a: "The Caribbean week carries no charter VAT in most jurisdictions, which is a real difference on the tax line. Whether the total is lower depends on the yacht and the dates, and we do not publish Caribbean rates we cannot source. The Greek side is on the Index: crewed catamarans from EUR 10,900 and motor yachts from 17,500 a week net base, VAT at 5.2 to 12 per cent by certification, APA 20 to 40 per cent.",
      },
      {
        q: "Which has the better sailing, Greece or the BVI?",
        a: "For sailing as sailing, the BVI: the trade winds are the steadiest charter wind anywhere. Greek sailing is the Meltemi for those who want it and the Ionian for those who do not, with an island worth arriving at in either case.",
      },
      {
        q: "What about hurricanes?",
        a: "The Caribbean charter season is timed around them, November to April. Ask the operator how the contract treats a cancellation for weather; it is not a question that arises in a Greek summer.",
      },
      {
        q: "Is St. Barths comparable to Mykonos?",
        a: "In social density, yes, at opposite ends of the year: St. Barths around the New Year, Mykonos in August. The Greek difference is that the quiet anchorage is a few miles away when you have had enough of it.",
      },
    ],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Sailing yacht charter Greece", url: "/sailing-yacht-charter-greece" },
      { title: "The Greek Charter Index 2026", url: "/greek-charter-index-2026" },
    ],
    seoTitle: "Greek Yacht Charter vs Caribbean: Med vs BVI",
    seoDescription:
      "Greek summer or Caribbean winter for a crewed yacht week? Season, sailing, culture, logistics and the published Greek rate bands, compared honestly.",
    canonical: "https://georgeyachts.com/greek-yacht-charter-vs-caribbean",
  },
];

// Helper lookups
export function getComparisonBySlug(slug) {
  return DESTINATION_COMPARISONS.find((c) => c.slug === slug) || null;
}
