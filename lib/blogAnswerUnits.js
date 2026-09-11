// Code-side answer units for Journal posts (plan items 9 and 13, George
// 4/9/2026).
//
// The cost breakdown post is the winner of the cost cluster: it holds
// nearly every "how much / cost / prices" query the site receives
// (205 impressions on the head term alone in the last 28 days, position
// 9 in the US tracker). The post body lives in Sanity; the one exact
// answer an engine should lift, with the Index's hard numbers, lives
// here so it can be kept in step with lib/charterIndex2026.js without a
// Studio edit. Rendered by app/blog/[slug]/page.jsx above the body and
// merged into the post's FAQPage as the first Question.
//
// Rules: 60 to 70 words, one price model (per yacht per week), figures
// from the Greek Charter Index only, no dashes.

export const BLOG_ANSWER_UNITS = {
  "how-much-does-yacht-charter-greece-cost-complete-breakdown": {
    question: "How much does a yacht charter in Greece cost?",
    answer:
      "A crewed yacht charter in Greece is priced per yacht per week. On the Greek Charter Index the weekly net base runs from EUR 10,900 for a 12 to 16 metre sailing catamaran to EUR 235,000 for a motor yacht above 50 metres. Add VAT at the yacht's certified rate (5.2 to 12% in practice), APA of 20 to 40% for running costs, and a customary 10 to 15% crew gratuity.",
    keyFacts: [
      "Sailing catamaran 12 to 16m: EUR 10,900 to 22,000 net base a week; 23 to 24m: EUR 54,900 to 90,000",
      "Motor yacht 18 to 25 m: EUR 17,500 to 47,500; 26 to 31m: EUR 35,900 to 75,000; 35 to 40m: EUR 59,900 to 150,000; above 50m: EUR 162,500 to 235,000",
      "VAT by certification: 5.2, 6.5, 7.8 or 12%; 13% is the statutory ceiling. APA 20 to 30% sail and catamaran, 30 to 40% motor",
      "Gratuity 10 to 15% of the base fee, at your discretion; always one price per yacht for the whole party",
      "For American guests: you contract with a US company, George Yachts Brokerage House LLC (Wyoming), and reach George on a Miami line, +1 786 798 8798",
    ],
    evidence: { label: "George Yachts Greek Charter Index", href: "/greek-charter-index-2026" },
  },

  // 2026-09-07 (plan #13): the next five posts by impressions. Each unit says
  // only what the rate cards, the Index and this desk's own log say; the
  // Sanity quickAnswer stays as the fallback but these render first.
  "12-passenger-rule-greek-yacht-charter-groups-of-14": {
    question: "Can more than 12 guests charter one yacht in Greece?",
    answer:
      "Twelve guests is the line most charter yachts are licensed for, and every yacht this house represents above 35 metres sleeps twelve or fewer except one: ELYSIUM, 64 metres, certified as a passenger ship for up to 49 guests, EUR 162,500 a week on the Index. For a party of fourteen the honest routes are ELYSIUM, or two yachts in tandem on one itinerary, each priced per yacht per week.",
    keyFacts: [
      "Twelve-guest yachts we represent: LA PELLEGRINA 1 (50 m), KOKOMO NIGHTS (47.5 m), ARIELA (39.6 m), OTTAWA (39 m), PAREAKI II (39 m), CAN'T REMEMBER (35.6 m), PROJECT STEEL (34 m), SUMMER FUN (30.8 m), ChristAl MiO 80 (24 m power catamaran)",
      "Above twelve: ELYSIUM, 64 m, up to 49 guests as a certified passenger ship, 24 to 28 crew, EUR 162,500 a week net base",
      "Tandem: two ten-guest catamarans on one itinerary, for example ALINA and ChristAl MiO, each EUR 34,000 to 90,000 a week by length on the Index",
      "One price per yacht per week with crew; APA 20 to 30% on catamarans, 30 to 40% on motor yachts; Greek VAT at the certified rate",
      "The licensed guest count is on every rate card and is confirmed with the owner before a name goes on a shortlist",
    ],
    evidence: { label: "ELYSIUM and the twelve-guest yachts, with rates, on the best-superyachts page", href: "/best-superyachts-greece-august" },
  },

  "honeymoon-yacht-charter-greece-2026-romantic-itinerary": {
    question: "How much does a honeymoon yacht charter in Greece cost?",
    answer:
      "One price per yacht per week with crew, from the Greek Charter Index 2026: a crewed sailing catamaran from EUR 10,900 a week at 14 metres, a six-guest motor yacht from EUR 21,000 (SEA U) to 28,000 (SEA YA), MELITI, a 26 metre sailing yacht for six, at 26,500. Add APA of 20 to 40% by type and Greek VAT at the certified rate. May, June and September list 15 to 25% below peak.",
    keyFacts: [
      "Six-guest yachts we represent: Endless Beauty (13.4 m power catamaran, EUR 14,000 to 17,500), SEA U (Riva 72, 21,000 to 24,000), SEA YA (Azimut 66, 24,000 to 28,000), MELITI (Garcia 86 sailing yacht, 26,500), Just Marie 2 (Lagoon Seventy 8, 49,000 to 59,000)",
      "Catamarans on the Index: from EUR 10,900 a week at 14 m to 43,500 at 20 to 22 m; a couple alone on a four-cabin catamaran pays the same one price as a party of eight",
      "The honeymoon week runs Mykonos first and Santorini last, 80 nautical miles apart on the house table, so the Meltemi stays behind you; the caldera night is a mooring buoy at Ammoudi, secured before the charter",
      "Shoulder months (May, June, September) list 15 to 25% below peak; July and August book 6 to 12 months ahead",
      "Gratuity 10 to 15% of the base, at your discretion; the Saronic five-night week from Athens is the shortest programme this house writes",
    ],
    evidence: { label: "The six-guest yachts, with rates, on the honeymoon page", href: "/honeymoon-yacht-charter-greece" },
  },

  "yacht-charter-vs-5-star-hotel-greece-family-2026": {
    question: "What does a crewed yacht week for a family of eight cost against a hotel?",
    answer:
      "The yacht side is one price per yacht per week with crew, from the Greek Charter Index 2026: a 16 to 19 metre sailing catamaran for eight at EUR 18,900 to 41,500, a 20 to 22 metre at 31,500 to 43,500, a 26 to 31 metre motor yacht at 35,900 to 75,000, plus APA of 20 to 40% and Greek VAT at the certified rate. The hotel side is the hotel's own rate card for four rooms.",
    keyFacts: [
      "Index 2026 bands for eight guests: 16 to 19 m sailing catamaran EUR 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 26 to 31 m motor 35,900 to 75,000 a week net base",
      "APA 20 to 30% on a catamaran, 30 to 40% on a motor yacht, covers fuel, food, drink and berths; unused balance refunded",
      "Greek VAT at the yacht's certified rate, 5.2 to 12%, 13% at the ceiling; gratuity 10 to 15% of base at your discretion",
      "The yacht moves the family every day without a ferry, a transfer or a restaurant booking; the chef cooks three meals aboard from the APA",
      "Shoulder months list 15 to 25% below peak on the Index; the five-night Saronic week from Athens is the shortest programme this house writes",
    ],
    evidence: { label: "The all-in arithmetic for any band, on the charter cost calculator", href: "/tools/charter-cost-calculator" },
  },

  "yacht-charter-corfu-cost": {
    question: "How much does a yacht charter from Corfu cost?",
    answer:
      "One price per yacht per week with crew, from the Greek Charter Index 2026: crewed catamarans from EUR 10,900 a week at 14 metres to 90,000 at 24, a 26 to 31 metre motor yacht 35,900 to 75,000, plus APA of 20 to 40% and Greek VAT at the certified rate. ARIVA, a Fountaine Pajot Power 67 for ten at EUR 34,000 to 48,000, is based in Corfu; an Athens-based yacht adds a positioning fee quoted per yacht.",
    keyFacts: [
      "Based in Corfu: ARIVA, Fountaine Pajot Power 67, 20.4 m, ten guests, four crew, EUR 34,000 to 48,000 a week net base",
      "Index 2026 bands: 16 to 19 m sailing catamaran EUR 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 26 to 31 m motor 35,900 to 75,000",
      "Distances from Corfu on the house table: Paxos 35 nm, Lefkada 80, Ithaca 95; the Ionian is sheltered from the Meltemi",
      "Positioning from Athens is quoted per yacht by the owner and covers the delivery and the crew days; ask where the yacht winters before comparing rates",
      "Shoulder months (June, September, early October) list 15 to 25% below peak; July and August book 6 to 12 months ahead",
    ],
    evidence: { label: "Bands, APA and VAT from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },

  "yacht-charter-athens-cost": {
    question: "How much does a yacht charter from Athens cost?",
    answer:
      "One price per yacht per week with crew, from the Greek Charter Index 2026: catamarans from EUR 10,900 a week at 14 metres, a 20 to 22 metre catamaran 31,500 to 43,500, a 26 to 31 metre motor yacht 35,900 to 75,000, above 50 metres 162,500 to 235,000, plus APA of 20 to 40% and Greek VAT at the certified rate. The yachts this house represents base in Athens, so no positioning fee appears.",
    keyFacts: [
      "Index 2026 bands: 14 m catamaran from EUR 10,900; 20 to 22 m 31,500 to 43,500; 22 to 25 m motor 21,000 to 47,500; 26 to 31 m 35,900 to 75,000; 35 to 40 m 59,900 to 150,000; above 50 m 162,500 to 235,000",
      "APA 20 to 30% under sail and on catamarans, 30 to 40% on motor yachts; Greek VAT 5.2 to 12% by certification; gratuity 10 to 15% of base at your discretion",
      "Athens was the cruising ground named most in the 68 enquiries this desk logged in the 2026 season, and every charter it won boarded in Athens",
      "From Alimos on the house table: Aegina 18 nm, Poros 25, Hydra 35, Kea 35, Mykonos 90; the airport is about 25 minutes from the marina by road",
      "Shoulder months list 15 to 25% below peak on the Index; the five-night Saronic week is the shortest programme this house writes",
    ],
    evidence: { label: "Bands, APA and VAT from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },

  "is-catamaran-best-yacht-charter-greece-2026": {
    question: "Is a catamaran the best yacht to charter in Greece?",
    answer:
      "For a family or a group of six to twelve, usually yes: two hulls do not heel and reach the shallow coves a motor yacht waits outside. One price per yacht per week with crew, from the Greek Charter Index 2026: EUR 10,900 at 14 metres, 18,900 to 41,500 at 16 to 19, 31,500 to 43,500 at 20 to 22, 54,900 to 90,000 at 23 to 24, plus APA of 20 to 30% and Greek VAT at the certified rate.",
    keyFacts: [
      "Index 2026 catamaran bands: 14 m from EUR 10,900; 16 to 19 m 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 23 to 24 m 54,900 to 90,000 a week net base",
      "APA 20 to 30% of base on a catamaran against 30 to 40% on a motor yacht, because the fuel bill is smaller",
      "Twelve-guest catamarans we represent: ChristAl MiO 80 (Fountaine Pajot Thira 80, EUR 70,000 to 90,000); ten guests: ALINA, Ad Astra, Aloia, Sol Madinina, Serenissima III at 24 m",
      "Stabilised at anchor or under way on their listing: ChristAl MiO, ChristAl MiO 80, Crazy Horse, SAMARA, Ad Astra, Serenissima III, Alegria, Endless Beauty",
      "When a motor yacht wins: speed for a Cyclades week with long legs, Athens to Mykonos 90 nautical miles in a morning at 20 knots",
    ],
    evidence: { label: "The catamaran fleet and the Index bands on the crewed catamaran page", href: "/crewed-catamaran-charter-greece" },
  },

  // 2026-09-07, second wave: the next posts by impressions whose Sanity
  // quickAnswer carries a figure the Index does not support.
  "best-time-to-charter-yacht-greece-month-by-month-2026": {
    question: "When is the best time to charter a yacht in Greece?",
    answer:
      "June and September, for most parties: warm sea, a softer Meltemi, room at the anchorages, and rates 15 to 25% below July and August on the Greek Charter Index 2026. July and August are the Meltemi months in the Cyclades and book 6 to 12 months ahead; the Ionian and the Saronic stay sheltered. May and early October carry the same shoulder pricing with cooler water. One price per yacht per week, crew included.",
    keyFacts: [
      "Shoulder months on the Index (May, June, September, early October) list 15 to 25% below peak; the yacht, crew and islands are the same",
      "The Meltemi blows from the north through the central Cyclades on July and August afternoons; the Ionian and the Saronic are sheltered from it in every month",
      "Lead time on the Index: 6 to 12 months for July and August, a year or more for the yachts above 40 metres; shoulder weeks usually 3 to 6 months out",
      "August was the busiest month for new enquiries on this desk in 2026, 25 of the 68 logged since 30 May, and 26 of the 57 dated requests were already for 2027",
      "The Ionian sails later into October than the Aegean; the afternoon thermal holds most years until mid-October",
    ],
    evidence: { label: "Shoulder discount and lead time from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },

  "august-or-september-greek-yacht-charter-shoulder-season-2026": {
    question: "Is September cheaper than August for a Greek yacht charter?",
    answer:
      "Yes: on the Greek Charter Index 2026 September lists 15 to 25% below August for the same yacht, one price per yacht per week with crew. On a 26 to 31 metre motor yacht at EUR 35,900 to 75,000 a week that is EUR 5,400 to 18,800 on the base alone, before APA and Greek VAT at the certified rate. The sea is at its warmest, the Meltemi softens, and the anchorages empty. August wins only when school dates decide.",
    keyFacts: [
      "Index 2026: September 15 to 25% below peak; 20 to 22 m sailing catamaran EUR 31,500 to 43,500 and 26 to 31 m motor yacht 35,900 to 75,000 are the peak bands the discount applies to",
      "The Meltemi is strongest in July and August through the central Cyclades and eases through September; the Ionian and Saronic are sheltered in both months",
      "August peak weeks book 6 to 12 months ahead on the Index; September weeks are usually still open 3 to 6 months out",
      "August was the busiest month for new enquiries on this desk in 2026 (25 of 68), most of them for the following season",
      "APA 20 to 40% of base by type covers the fuel; calmer September legs burn less of it, and the unused balance is refunded",
    ],
    evidence: { label: "The shoulder discount on the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },

  "sailing-in-greece": {
    question: "What does a week of sailing in Greece cost, and where does it go?",
    answer:
      "Short passages between islands 20 to 60 nautical miles apart on the house table, in three grounds: the windy Cyclades, the sheltered Ionian, the Saronic within reach of Athens. One price per yacht per week with crew, from the Greek Charter Index 2026: crewed sailing catamarans from EUR 10,900 at 14 metres, crewed sailing yachts of 24 to 31 metres at 24,000 to 55,000, plus APA of 20 to 30% and Greek VAT at the certified rate. No experience is required.",
    keyFacts: [
      "The six crewed sailing yachts we represent: BLACK LION (Perini Navi, 31 m, EUR 50,000 to 55,000), Huayra (Comet 100, 31 m, 44,000 to 49,000), Aizu (Marine 99, 30 m, 33,000 to 39,000), Nadamas (Y8, 24 m, 35,000 to 41,000), MELITI (Garcia 86, 26 m, 26,500), Gigreca (Admiral Sail Silent 76, 24 m, 24,000 to 29,900)",
      "Sailing catamarans on the Index: from EUR 10,900 at 14 m to 90,000 at 24 m a week net base",
      "Legs from the house table: Lefkada to Ithaca 20 nm, Mykonos to Paros 30, Paros to Sifnos 35, Alimos to Hydra 35, Paros to Santorini 60",
      "The Meltemi gives the Cyclades 15 to 25 knots from the north on July and August afternoons; the Ionian's afternoon thermal dies at sunset",
      "APA 20 to 30% under sail against 30 to 40% on a motor yacht; shoulder months list 15 to 25% below peak",
    ],
    evidence: { label: "The five sailing yachts, with rates, on the best-sailing-yachts page", href: "/best-sailing-yachts-greece" },
  },

  "superyacht-charter-greece-40m-plus-2026": {
    question: "What does a superyacht charter above 40 metres cost in Greece?",
    answer:
      "On the Greek Charter Index 2026 a 35 to 40 metre motor yacht lists at EUR 59,900 to 150,000 a week net base and the yachts above 50 metres at 162,500 to 235,000, one price per yacht with crew, plus APA of 30 to 40% and Greek VAT at the certified rate. Above 40 metres this house represents NORTHWIND II, KOKOMO NIGHTS, LA PELLEGRINA 1 and ELYSIUM; they book a year or more ahead.",
    keyFacts: [
      "Above 40 metres we represent: NORTHWIND II (45.6 m, 10 guests, 9 crew, EUR 83,300 to 110,000), KOKOMO NIGHTS (47.5 m, 12 guests, 10 crew, 120,000 to 140,000), LA PELLEGRINA 1 (50 m, 12 guests, 9 crew, 180,000 to 235,000), ELYSIUM (64 m, up to 49 guests, 162,500)",
      "Index 2026 bands: 35 to 40 m EUR 59,900 to 150,000; above 50 m 162,500 to 235,000 a week net base",
      "APA 30 to 40% of base on a motor yacht: a EUR 200,000 week carries a working float of EUR 60,000 to 80,000, fuel first, unused balance refunded",
      "Lead time on the Index: a year or more for the yachts above 40 metres; 26 of the 57 dated enquiries this desk logged in 2026 were already for 2027",
      "Gratuity 10 to 15% of base, at your discretion, handed to the captain at the end; tender count and helipad are yacht-by-yacht facts on the rate card",
    ],
    evidence: { label: "The yachts above 35 metres, with rates, on the best-superyachts page", href: "/best-superyachts-greece-august" },
  },

  "oil-spike-smart-money-yacht-charter-greece": {
    question: "Does a rise in oil prices change the cost of a Greek yacht charter?",
    answer:
      "Not the charter fee. The base rate is fixed per yacht per week in the MYBA-form contract when you sign, from the Greek Charter Index 2026 bands. Fuel is paid from the APA, the advance of 30 to 40% of base on a motor yacht and 20 to 30% on a catamaran or sailing yacht, which runs as an open account and refunds what the week does not burn. A dearer barrel moves that float, not the price of the yacht.",
    keyFacts: [
      "The base rate is fixed at contract: one price per yacht per week with crew, on the MYBA form; the owner cannot reprice a signed week",
      "Fuel sits inside the APA: 30 to 40% of base on a motor yacht, 20 to 30% on catamarans and sailing yachts, settled at the end against receipts",
      "The sailing week burns least: crewed sailing catamarans from EUR 10,900 a week and sailing yachts of 24 to 31 metres at 24,000 to 55,000 on the Index",
      "Shorter legs burn less: the Saronic week from Athens runs 18 to 50 nautical miles a day on the house table, the Cyclades 25 to 60",
      "Shoulder months list 15 to 25% below peak on the Index, a larger saving than any fuel swing inside a week's APA",
    ],
    evidence: { label: "APA, the fuel account, explained", href: "/advance-provisioning-allowance-apa-greek-yacht-charter-explained" },
  },

  // 2026-09-07, third wave: the posts whose Sanity quickAnswer quotes
  // distances or figures the house distance table and the Index do not
  // support (Athens to Mykonos is 90 nm, Mykonos to Santorini 80).
  "the-saronic-gulf-the-5-day-crewed-charter-that-starts-where-you-land": {
    question: "What is the five-night Saronic yacht charter from Athens?",
    answer:
      "The shortest programme this house writes: board at Alimos, about 25 minutes from the airport, and sail the sheltered Saronic on short legs from the house table, Aegina 18 nautical miles, Poros 25, Hydra 35, Spetses 50, roughly 120 miles in all. One price per yacht with crew, from the Greek Charter Index 2026: a 16 to 19 metre sailing catamaran EUR 18,900 to 41,500 a week, a 22 to 25 metre motor yacht 21,000 to 47,500, five nights quoted by the owner.",
    keyFacts: [
      "Legs on the house table: Alimos to Aegina 18 nm, Aegina to Poros 18, Poros to Hydra 12, Hydra to Spetses 25, Spetses back to Alimos 50",
      "Anchorages from the guides: Vlychos on Hydra 8 to 15 m over sand and weed, Plakes on Dokos 6 to 12 m sheltered from every direction, Hydra harbour stern-to in a deep basin",
      "The Saronic is sheltered from the Meltemi, which is why it is the ground this house proposes to first-time charterers and to fixed short dates",
      "Index 2026 bands: 16 to 19 m sailing catamaran EUR 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 22 to 25 m motor 21,000 to 47,500; 26 to 31 m 35,900 to 75,000 a week net base; five nights quoted per yacht from the weekly rate",
      "Athens was the cruising ground named most in the 68 enquiries this desk logged in the 2026 season; shoulder months list 15 to 25% below peak",
    ],
    evidence: { label: "The Saronic hub, with the distances and the anchorages", href: "/destinations/saronic" },
  },

  "the-7-day-cyclades-itinerary-what-your-captain-won-t-tell-you-until-you-re-onboard": {
    question: "How far does a seven-day Cyclades yacht charter actually sail?",
    answer:
      "Further than the brochure says. On the house distance table Athens (Alimos) to Mykonos is 90 nautical miles, Mykonos to Paros 30, Paros to Naxos 12, Naxos to Ios 30, Ios to Santorini 25, and Santorini back to Athens 130. A week that ends at Santorini is one way; a loop that must return to Alimos gives up Santorini for Milos or Sifnos. The captain has the last word, because the Meltemi blows from the north.",
    keyFacts: [
      "Legs on the house table: Alimos to Kea 35 nm, Kea to Kythnos 15, Kythnos to Syros 25, Syros to Mykonos 25, Mykonos to Paros 30, Paros to Naxos 12, Naxos to Ios 30, Ios to Santorini 25, Santorini to Alimos 130",
      "The week runs north to south so the Meltemi stays behind you: Mykonos first, Santorini last; a Santorini start is the reverse loop",
      "The way home from Santorini without the 130-mile leg: Folegandros 30 nm, Milos 70, then Sifnos 25, Kythnos 25, Alimos 45",
      "Index 2026 bands: 20 to 22 m sailing catamaran EUR 31,500 to 43,500; 26 to 31 m motor 35,900 to 75,000 a week net base; July and August book 6 to 12 months ahead",
      "The yachts that carry the Cyclades wind comfortably are the 20 metre and larger catamarans and the 26 metre and larger motor yachts, stabilisers stated on each rate card",
    ],
    evidence: { label: "The house distance table on the Cyclades hub", href: "/destinations/cyclades" },
  },

  "greek-islands-sailing-distance-time-calculator-2026": {
    question: "How far apart are the Greek islands by yacht?",
    answer:
      "From the house distance table: Athens (Alimos) to Aegina 18 nautical miles, Hydra 35, Kea 35, Mykonos 90, Santorini 130; Mykonos to Paros 30 and to Santorini 80; Paros to Santorini 60; Lefkada to Ithaca 20 and Kefalonia 25; Corfu to Paxos 35. A comfortable charter day is 20 to 50 miles, three to six hours under way, and a Greek week covers 100 to 180 miles in total.",
    keyFacts: [
      "Saronic from Alimos: Aegina 18 nm, Poros 25, Hydra 35, Spetses 50; Hydra to Poros 12, Hydra to Spetses 25",
      "Cyclades: Alimos to Kea 35, Kythnos 45, Sifnos 80, Mykonos 90, Paros 95, Naxos 100, Santorini 130; Mykonos to Syros 25, Paros 30, Naxos 30, Santorini 80; Paros to Antiparos 5, Naxos 12, Sifnos 35, Milos 50, Santorini 60",
      "Ionian: Corfu to Paxos 35, Paxos to Lefkada 50, Lefkada to Ithaca 20, Ithaca to Kefalonia 10, Lefkada to Kefalonia 25, Kefalonia to Zakynthos 35, Corfu to Lefkada 80",
      "Speed: a sailing catamaran plans on 6 to 8 knots, a motor yacht on 15 to 22 knots cruising; the Meltemi adds time on a northbound leg in July and August",
      "Every itinerary this house writes is drawn from this table; the captain adjusts on the day for wind and swell",
    ],
    evidence: { label: "The sailing distance calculator, built on the same table", href: "/sailing-distance-calculator" },
  },

  "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece": {
    question: "What does a first crewed yacht charter in Greece cost, and how does it work?",
    answer:
      "One price per yacht per week with the crew included, from the Greek Charter Index 2026: crewed catamarans from EUR 10,900 a week at 14 metres, 18,900 to 41,500 at 16 to 19 metres, 31,500 to 43,500 at 20 to 22, a 26 to 31 metre motor yacht 35,900 to 75,000. Add APA of 20 to 40% by type, Greek VAT at the certified rate and a gratuity of 10 to 15%. The contract is the MYBA form; boarding is in Athens, Lefkada or Corfu.",
    keyFacts: [
      "Index 2026 bands: 14 m catamaran from EUR 10,900; 16 to 19 m 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 22 to 25 m motor 21,000 to 47,500; 26 to 31 m 35,900 to 75,000 a week net base",
      "APA 20 to 30% under sail and on catamarans, 30 to 40% on motor yachts: fuel, food, drink, berths, settled at the end against receipts",
      "Greek VAT at the yacht's certified rate, 5.2, 6.5, 7.8 or 12%, 13% at the ceiling; gratuity 10 to 15% of base at your discretion",
      "Grounds this house writes weeks for: Athens and the Saronic, the Cyclades, the Ionian; the five-night Saronic week is the shortest programme; no bareboat, no day charters",
      "Lead time on the Index: 6 to 12 months for July and August; shoulder months list 15 to 25% below peak",
    ],
    evidence: { label: "Bands, APA and VAT from the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },

  "motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece": {
    question: "Motor yacht, catamaran or sailing yacht: what does each cost in Greece?",
    answer:
      "One price per yacht per week with crew, from the Greek Charter Index 2026. Crewed catamarans: EUR 10,900 at 14 metres, 18,900 to 41,500 at 16 to 19, 31,500 to 43,500 at 20 to 22, 54,900 to 90,000 at 23 to 24. Crewed sailing yachts of 24 to 31 metres: 24,000 to 55,000. Motor yachts: 21,000 to 47,500 at 22 to 25 metres, 35,900 to 75,000 at 26 to 31, 59,900 to 150,000 at 35 to 40.",
    keyFacts: [
      "Catamarans on the Index: 14 m from EUR 10,900; 16 to 19 m 18,900 to 41,500; 20 to 22 m 31,500 to 43,500; 23 to 24 m 54,900 to 90,000 a week net base",
      "Motor yachts on the Index: 22 to 25 m EUR 21,000 to 47,500; 26 to 31 m 35,900 to 75,000; 35 to 40 m 59,900 to 150,000; above 50 m 162,500 to 235,000",
      "Crewed sailing yachts of 24 to 31 m: EUR 24,000 to 55,000; the six this house represents are BLACK LION, Huayra, Aizu, Nadamas, MELITI and Gigreca",
      "The Index carries no gulet band: the crewed fleet this house prices is motor yachts, catamarans and sailing yachts; the Greek gulets base mostly outside our grounds",
      "APA 20 to 30% under sail and on catamarans, 30 to 40% on motor yachts; the catamaran is the family default, the motor yacht wins the long Cyclades legs, the sailing yacht the Meltemi",
    ],
    evidence: { label: "All bands by type on the Greek Charter Index 2026", href: "/greek-charter-index-2026" },
  },
};

export function getBlogAnswerUnit(slug) {
  return BLOG_ANSWER_UNITS[slug] || null;
}
