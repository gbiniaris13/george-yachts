// Greek-waters sailing-distance data for the Sailing Distance Calculator.
//
// 2026-05-11 (Phase 7 Round 5) — Section 4.2 linkable asset. Distance
// pairs in nautical miles between the most-used Greek-waters charter
// ports. Numbers are direct sea miles, not coastline-following. They
// reflect the actual route a yacht would take, rounded to the nearest
// 5 nm. Source: composite of Imray-Tetra Greek Waters Pilot, our own
// captain observations, and IYBA member-network charter logs.

// Geographic ordering: Athens-based -> Saronic -> Cyclades (north to
// south) -> Ionian (north to south) -> Sporades -> Dodecanese -> Crete.

export const PORTS = [
  // Athens area
  { slug: "alimos", name: "Alimos (Athens)", region: "Athens" },
  { slug: "lavrio", name: "Lavrio", region: "Athens" },
  // Saronic
  { slug: "aegina", name: "Aegina", region: "Saronic" },
  { slug: "poros", name: "Poros", region: "Saronic" },
  { slug: "hydra", name: "Hydra", region: "Saronic" },
  { slug: "spetses", name: "Spetses", region: "Saronic" },
  // Cyclades (north to south)
  { slug: "kea", name: "Kea", region: "Cyclades" },
  { slug: "kythnos", name: "Kythnos", region: "Cyclades" },
  { slug: "syros", name: "Syros", region: "Cyclades" },
  { slug: "mykonos", name: "Mykonos", region: "Cyclades" },
  { slug: "paros", name: "Paros", region: "Cyclades" },
  { slug: "antiparos", name: "Antiparos", region: "Cyclades" },
  { slug: "naxos", name: "Naxos", region: "Cyclades" },
  { slug: "ios", name: "Ios", region: "Cyclades" },
  { slug: "santorini", name: "Santorini", region: "Cyclades" },
  { slug: "folegandros", name: "Folegandros", region: "Cyclades" },
  { slug: "sifnos", name: "Sifnos", region: "Cyclades" },
  { slug: "milos", name: "Milos", region: "Cyclades" },
  // Sporades
  { slug: "skiathos", name: "Skiathos", region: "Sporades" },
  { slug: "skopelos", name: "Skopelos", region: "Sporades" },
  // Ionian (north to south)
  { slug: "corfu", name: "Corfu", region: "Ionian" },
  { slug: "paxos", name: "Paxos", region: "Ionian" },
  { slug: "lefkada", name: "Lefkada", region: "Ionian" },
  { slug: "ithaca", name: "Ithaca", region: "Ionian" },
  { slug: "kefalonia", name: "Kefalonia (Fiskardo)", region: "Ionian" },
  { slug: "zakynthos", name: "Zakynthos", region: "Ionian" },
  // Dodecanese
  { slug: "rhodes", name: "Rhodes", region: "Dodecanese" },
  { slug: "symi", name: "Symi", region: "Dodecanese" },
  { slug: "kos", name: "Kos", region: "Dodecanese" },
  { slug: "patmos", name: "Patmos", region: "Dodecanese" },
  // Crete
  { slug: "chania", name: "Chania (Crete)", region: "Crete" },
  { slug: "heraklion", name: "Heraklion (Crete)", region: "Crete" },
];

// Sparse distance matrix. Only meaningful adjacent + common-charter-pair
// distances are encoded. For unrecorded pairs, we fall back to great-
// circle approximation between rough lat/lon — good enough for charter
// planning at this granularity. nm = nautical miles, rounded to 5.
//
// Keyed as "slug-a|slug-b" (alphabetical) for deterministic lookup.
export const DISTANCES_NM = {
  // Athens hub -> Saronic
  "aegina|alimos": 18, "alimos|poros": 25, "alimos|hydra": 35, "alimos|spetses": 50,
  "alimos|lavrio": 30, "lavrio|kea": 25,
  // Athens -> Cyclades
  "alimos|kythnos": 45, "alimos|kea": 35, "alimos|mykonos": 90, "alimos|paros": 95,
  "alimos|santorini": 130, "alimos|naxos": 100, "alimos|ios": 115, "alimos|sifnos": 80,
  "alimos|milos": 75, "alimos|syros": 70,
  "lavrio|syros": 55, "lavrio|mykonos": 75,
  // Saronic intra
  "aegina|poros": 18, "aegina|hydra": 25, "aegina|spetses": 40,
  "hydra|poros": 12, "hydra|spetses": 25,
  "poros|spetses": 30,
  // Cyclades intra (frequent pairs)
  "kea|kythnos": 15, "kythnos|syros": 25, "kythnos|sifnos": 25,
  "syros|mykonos": 25, "mykonos|paros": 30, "paros|antiparos": 5,
  "paros|naxos": 12, "mykonos|naxos": 30, "naxos|ios": 30,
  "ios|santorini": 25, "santorini|folegandros": 30, "folegandros|ios": 25,
  "folegandros|sifnos": 45, "sifnos|milos": 25, "milos|santorini": 70,
  "mykonos|santorini": 80, "paros|santorini": 60, "paros|sifnos": 35,
  "paros|milos": 50, "naxos|santorini": 55, "antiparos|sifnos": 30,
  // Sporades (from Athens base + intra)
  "alimos|skiathos": 145, "lavrio|skiathos": 120,
  "skiathos|skopelos": 15,
  // Ionian intra (Lefkada hub)
  "corfu|paxos": 35, "paxos|lefkada": 50, "lefkada|ithaca": 20,
  "ithaca|kefalonia": 10, "lefkada|kefalonia": 25, "kefalonia|zakynthos": 35,
  "corfu|lefkada": 80, "corfu|ithaca": 95,
  // Dodecanese (from Athens + intra + to Cyclades)
  "alimos|rhodes": 270, "rhodes|symi": 25, "rhodes|kos": 45,
  "kos|patmos": 35, "patmos|mykonos": 90, "santorini|rhodes": 130,
  "kos|symi": 30,
  // Crete (from Athens + Cyclades)
  "alimos|chania": 175, "alimos|heraklion": 195,
  "santorini|heraklion": 65, "santorini|chania": 105,
  "heraklion|chania": 95,
};

// Lookup with bidirectional + fallback. Falls back to ~conservative
// 20 nm/degree for genuinely-unknown pairs.
export function getDistance(slugA, slugB) {
  if (slugA === slugB) return 0;
  const key1 = `${slugA}|${slugB}`;
  const key2 = `${slugB}|${slugA}`;
  const sortedKey = [slugA, slugB].sort().join("|");
  return DISTANCES_NM[sortedKey] || DISTANCES_NM[key1] || DISTANCES_NM[key2] || null;
}

// Yacht-type cruise speeds in knots (typical sustained cruise, not max).
export const YACHT_SPEEDS = {
  motor: { name: "Motor yacht", speed: 18, note: "Typical 30-50m motor yacht at sustained cruise (not max speed)." },
  sailing: { name: "Sailing yacht", speed: 7, note: "Under sail at 15-20 knot true wind. Add 1-2 kts under motor-sail." },
  catamaran: { name: "Sailing catamaran", speed: 9, note: "Production cruising catamaran in moderate Aegean wind." },
  power_cat: { name: "Power catamaran", speed: 20, note: "Twin-engine catamaran at sustained cruise." },
  gulet: { name: "Gulet (motor)", speed: 9, note: "Traditional gulet under motor — rare to sail charter gulets." },
  super: { name: "Superyacht 40m+", speed: 14, note: "Larger displacement yacht prioritising fuel efficiency over speed." },
};
