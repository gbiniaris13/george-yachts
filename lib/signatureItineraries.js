// Signature Greek yacht charter itineraries - single source of truth.
//
// 2026-06-26. Extracted verbatim from app/yacht-itineraries-greece/
// ItinerariesContent.jsx so BOTH the UI (client component) and the page's
// TouristTrip JSON-LD (server component) read the same data. A server
// component cannot import a data const from a "use client" module (the export
// arrives as a client reference, not the value), so the data must live here.

export const itineraries = [
  {
    id: "cyclades",
    title: "The Cyclades Classic",
    subtitle: "Athens to Mykonos & Beyond",
    duration: "7 Days / 6 Nights",
    embarkation: "Athens (Lavrion Marina)",
    season: "June – September",
    idealFor: "First-time charterers, couples, families",
    days: [
      { day: 1, title: "Athens → Kea (Tzia)", nm: "25 NM", desc: "The closest Cycladic island to Athens. Arrive at Vourkari bay for a quiet first evening. Swim at Koundouros beach. Dinner at a waterfront taverna — grilled octopus, local wine, the slow pace beginning." },
      { day: 2, title: "Kea → Syros", nm: "35 NM", desc: "The “capital” of the Cyclades. Ermoupoli’s neoclassical architecture feels more Italian than Greek. Explore the town, visit the Apollon Theater (a miniature La Scala), dine at the harbour under fairy lights." },
      { day: 3, title: "Syros → Mykonos", nm: "20 NM", desc: "Arrive at the island of the winds. Anchor at Ornos or Psarou Bay. Little Venice for sunset cocktails. Dinner at Nammos or Kiki’s Taverna (arrive early — no reservations). The nightlife starts after midnight." },
      { day: 4, title: "Mykonos → Paros", nm: "18 NM", desc: "Cross to Paros — the Cyclades’ best-kept balance of beauty and authenticity. Naoussa harbour for lunch. Explore the Old Town’s narrow marble streets. Sunset from the hilltop church, dinner at Mario." },
      { day: 5, title: "Paros → Antiparos → Koufonisia", nm: "30 NM", desc: "Morning stop at Antiparos — the cave of stalactites, lunch at Captain Pipinos. Then sail to Koufonisia — crystal-clear turquoise water, white sand, zero cars. Anchor overnight." },
      { day: 6, title: "Koufonisia → Naxos", nm: "15 NM", desc: "The largest Cycladic island. Visit the Portara (Temple of Apollo). Long sandy beaches. The best local cuisine in the Cyclades — Naxos cheese, potatoes, fresh fish. Dinner in the Old Town." },
      { day: 7, title: "Naxos → Kea → Athens", nm: "60 NM", desc: "Final cruise back via Kea. Farewell breakfast aboard. Arrive Lavrion by afternoon." },
    ],
    highlights: "Mykonos nightlife, Koufonisia beaches, Syros architecture, Naxos cuisine",
    yachts: [
      { name: "M/Y Can’t Remember", slug: "cant-remember" },
      { name: "S/Y World’s End", slug: "worlds-end" },
      { name: "M/Y Vista", slug: "vista" },
    ],
  },
  {
    id: "saronic",
    title: "Saronic Elegance",
    subtitle: "The Athens Riviera Circuit",
    duration: "7 Days / 6 Nights",
    embarkation: "Athens (Alimos Marina)",
    season: "May – October",
    idealFor: "Couples, history lovers, first-time charterers",
    days: [
      { day: 1, title: "Athens → Aegina", nm: "17 NM", desc: "Sail from Alimos to Aegina — the pistachio island. Visit the Temple of Aphaia (one of the best-preserved Greek temples). Walk the harbour, try the local pistachio ice cream. Easy first day." },
      { day: 2, title: "Aegina → Hydra", nm: "20 NM", desc: "The jewel of the Saronic. No cars, no motorbikes — only donkeys and water taxis. Swim at Vlychos beach. Sundowners at the harbour. Dinner at Omilos or Sunset." },
      { day: 3, title: "Hydra → Dokos", nm: "5 NM", desc: "The uninhabited island between Hydra and the Peloponnese. Anchor in the bay — crystal water, absolute silence, just you and the sea. Lunch aboard, afternoon swimming, stargazing at night." },
      { day: 4, title: "Dokos → Spetses", nm: "12 NM", desc: "Pine-covered island with elegant mansions. Horse-drawn carriages around the port. Dinner at On The Verandah or Liotrivi. Walk the coastal path at sunset." },
      { day: 5, title: "Spetses → Porto Heli", nm: "8 NM", desc: "Cross to the Peloponnese coast. Porto Heli is the Greek Hamptons — luxury villas, Amanzoe resort nearby. Lunch at Aman Beach Club, swim at Hinitsa Bay." },
      { day: 6, title: "Porto Heli → Nafplio", nm: "25 NM", desc: "Greece’s first capital. The most romantic town in the Peloponnese. Palamidi Fortress (999 steps). Bourtzi castle in the harbour. Old Town dinner — some of the best food in Greece." },
      { day: 7, title: "Nafplio → Poros → Athens", nm: "35 NM", desc: "Stop at Poros — the island so close to the mainland you could swim. Clock tower views. Then final cruise to Athens. Farewell lunch aboard." },
    ],
    highlights: "Hydra’s car-free charm, Nafplio’s romance, Dokos isolation, Porto Heli luxury",
    yachts: [
      { name: "M/Y Shero", slug: "shero" },
      { name: "M/Y M Five", slug: "m-five" },
      { name: "M/Y Vista", slug: "vista" },
      { name: "S/Y Sahana", slug: "sahana" },
    ],
  },
  {
    id: "ionian",
    title: "The Ionian Dream",
    subtitle: "Corfu to Kefalonia",
    duration: "7 Days / 6 Nights",
    embarkation: "Corfu (Gouvia Marina)",
    season: "May – October",
    idealFor: "Families with children, sailing enthusiasts, nature lovers",
    days: [
      { day: 1, title: "Corfu → Paxos", nm: "30 NM", desc: "Sail south to the tiny island of Paxos. Anchor at Lakka — a horseshoe bay surrounded by olive groves. Swim in turquoise water, dine at the harbour. The Ionian pace begins." },
      { day: 2, title: "Paxos → Antipaxos → Parga", nm: "15 NM", desc: "Morning at Antipaxos — Voutoumi beach (Caribbean-blue water, white pebbles). Then cross to Parga on the mainland — a Venetian fortress town cascading down to the sea." },
      { day: 3, title: "Parga → Lefkada (Sivota Bay)", nm: "25 NM", desc: "Sail to Lefkada’s east coast. Sivota Bay is one of the most protected anchorages in Greece — perfect for a lazy day. Swim, paddleboard, explore by tender." },
      { day: 4, title: "Lefkada → Meganisi", nm: "8 NM", desc: "The secret island. Tiny Meganisi has 3 villages, zero tourist buses, and some of the clearest water in Greece. Anchor in Atherinos Bay. Lunch at Tropicana in Vathy." },
      { day: 5, title: "Meganisi → Ithaca", nm: "15 NM", desc: "Odysseus’ homeland. Anchor in Kioni — a postcard-perfect fishing village. Walk the hillside path to ancient ruins. Dinner in the harbour — the kind of meal you remember for years." },
      { day: 6, title: "Ithaca → Kefalonia (Fiskardo)", nm: "10 NM", desc: "The crown jewel. Fiskardo is the only Kefalonian village that survived the 1953 earthquake. Venetian architecture, pastel-coloured houses. Dinner at Tassia — legendary cooking." },
      { day: 7, title: "Kefalonia → Corfu", nm: "65 NM", desc: "Long final passage back to Corfu (or arrange one-way disembarkation). Farewell breakfast aboard." },
    ],
    highlights: "Antipaxos beaches, Meganisi serenity, Fiskardo elegance, Parga fortress views",
    yachts: [
      { name: "S/Y Kimata", slug: "kimata" },
      { name: "S/Y Alexandra II", slug: "alexandra-ii" },
      { name: "S/Y Huayra", slug: "huayra" },
      { name: "S/Y Serenissima", slug: "serenissima" },
    ],
  },
  // Sporades Escape itinerary retired 2026-05-08 (Boss directive): Sporades +
  // Dodecanese are no longer surfaced anywhere on the site. Re-add only on
  // explicit owner direction.
];
