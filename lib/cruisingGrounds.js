/**
 * The waters this house actually sells, as a chart rather than as prose.
 *
 * ── Why this file exists ─────────────────────────────────────────────────
 *
 * Every yacht page carries a sample week. Until today those weeks were
 * written per boat and never checked against the boat, and the result was
 * two opposite mistakes sitting on the same site:
 *
 *   • ABOVE AND BEYOND cruises at 10 knots and her week contained a 95
 *     nautical mile leg. That is nine and a half hours underway, which is
 *     not a charter day, it is a delivery.
 *   • SEA U cruises at 25 knots and her longest leg was 30 miles. Seventy
 *     minutes. A boat that can be in the Cyclades before lunch was being
 *     shown a week she could finish by Wednesday.
 *
 * George put it plainly on 8 September: a motor yacht that runs at thirty
 * knots does not belong in the Saronic, and a catamaran that runs at eight
 * does not belong crossing to Mykonos. The distances decide, not the copy.
 *
 * ── What is in here ──────────────────────────────────────────────────────
 *
 * Positions for every port and anchorage the house uses, and a list of the
 * legs between them that a yacht actually sails. Distances are computed
 * from the positions on the great circle and then multiplied by a factor
 * for the legs where land is in the way, because a boat leaving Athens for
 * Hydra does not fly over the Methana peninsula. The factors are per leg
 * and each one is there for a named headland.
 *
 * Nothing outside the operating grounds is in this file. Athens and the
 * Saronic, the Cyclades and the Ionian, which is the whole of what this
 * house sells and the whole of what the itinerary planner can reach. The
 * Dodecanese and the Sporades are absent on purpose: see
 * lib/operatingGrounds and scripts/checkOperatingGrounds.mjs.
 */

/** Ports, anchorages and the towns guests actually name. */
export const PORTS = {
  // ── Athens, the delivery ports ──────────────────────────────────────
  alimos:        { name: "Athens (Alimos)",        lat: 37.9111, lon: 23.7000, ground: "athens", base: true, delivery: true, kind: "marina" },
  flisvos:       { name: "Athens (Flisvos)",       lat: 37.9250, lon: 23.6820, ground: "athens", base: true, delivery: true, kind: "marina" },
  zea:           { name: "Athens (Zea)",           lat: 37.9330, lon: 23.6470, ground: "athens", base: true, delivery: true, kind: "marina" },
  lavrio:        { name: "Athens (Lavrio)",        lat: 37.7130, lon: 24.0600, ground: "athens", base: true, delivery: true, kind: "marina" },
  neaperamos:    { name: "Athens (Nea Peramos)",   lat: 38.0000, lon: 23.4300, ground: "athens", base: true, delivery: true, kind: "marina" },

  // The Attic coast. Sounion is the stepping stone every boat leaving
  // Alimos for the Cyclades uses on the first evening, and without it on
  // the chart the crossing to Kea was a single thirty three mile leg that
  // no catamaran could make after a late afternoon boarding. With it the
  // western Cyclades open to anything that cruises at ten knots or better,
  // which is where they should open.
  sounion:       { name: "Cape Sounion",           lat: 37.6500, lon: 24.0250, ground: "athens" },

  // ── The Saronic and the Argolic, the short-legged week ──────────────
  aegina:        { name: "Aegina (Agia Marina)",   lat: 37.7460, lon: 23.5330, ground: "saronic" },
  aeginatown:    { name: "Aegina Town",            lat: 37.7470, lon: 23.4270, ground: "saronic" },
  agkistri:      { name: "Agistri (Skala)",        lat: 37.7080, lon: 23.3520, ground: "saronic" },
  epidaurus:     { name: "Epidaurus",              lat: 37.6330, lon: 23.1550, ground: "saronic" },
  poros:         { name: "Poros",                  lat: 37.4990, lon: 23.4530, ground: "saronic" },
  hydra:         { name: "Hydra",                  lat: 37.3490, lon: 23.4650, ground: "saronic" },
  dokos:         { name: "Dokos (Skindos Bay)",    lat: 37.3350, lon: 23.3300, ground: "saronic" },
  ermioni:       { name: "Ermioni",                lat: 37.3870, lon: 23.2470, ground: "saronic" },
  spetses:       { name: "Spetses",                lat: 37.2620, lon: 23.1560, ground: "saronic" },
  porto_heli:    { name: "Porto Heli",             lat: 37.3220, lon: 23.1450, ground: "saronic" },
  nafplio:       { name: "Nafplio",                lat: 37.5670, lon: 22.8000, ground: "saronic" },

  // ── The Cyclades, west to east ──────────────────────────────────────
  kea:           { name: "Kea (Vourkari)",         lat: 37.6600, lon: 24.3170, ground: "cyclades" },
  kythnos:       { name: "Kythnos (Kolona)",       lat: 37.4300, lon: 24.3830, ground: "cyclades" },
  serifos:       { name: "Serifos (Livadi)",       lat: 37.1450, lon: 24.5150, ground: "cyclades" },
  sifnos:        { name: "Sifnos (Vathi)",         lat: 36.9330, lon: 24.6670, ground: "cyclades" },
  milos:         { name: "Milos (Adamas)",         lat: 36.7220, lon: 24.4470, ground: "cyclades" },
  kimolos:       { name: "Kimolos",                lat: 36.7900, lon: 24.5700, ground: "cyclades" },
  folegandros:   { name: "Folegandros (Karavostasi)", lat: 36.6300, lon: 24.9400, ground: "cyclades" },
  santorini:     { name: "Santorini (the caldera)",lat: 36.4200, lon: 25.4300, ground: "cyclades" },
  ios:           { name: "Ios (Mylopotas)",        lat: 36.7050, lon: 25.2900, ground: "cyclades" },
  paros:         { name: "Paros (Naoussa)",        lat: 37.1250, lon: 25.2400, ground: "cyclades" },
  antiparos:     { name: "Antiparos",              lat: 37.0370, lon: 25.0800, ground: "cyclades" },
  naxos:         { name: "Naxos (Chora)",          lat: 37.1030, lon: 25.3750, ground: "cyclades" },
  koufonisia:    { name: "Koufonisia",             lat: 36.9370, lon: 25.6070, ground: "cyclades" },
  amorgos:       { name: "Amorgos (Katapola)",     lat: 36.8300, lon: 25.8570, ground: "cyclades" },
  mykonos:       { name: "Mykonos (Ornos)",        lat: 37.4160, lon: 25.3300, ground: "cyclades" },
  delos:         { name: "Delos",                  lat: 37.3930, lon: 25.2680, ground: "cyclades" },
  rinia:         { name: "Rinia (Ambelia Bay)",    lat: 37.4030, lon: 25.2260, ground: "cyclades" },
  syros:         { name: "Syros (Ermoupoli)",      lat: 37.4440, lon: 24.9430, ground: "cyclades" },
  tinos:         { name: "Tinos (Panormos)",       lat: 37.6180, lon: 25.0630, ground: "cyclades" },
  andros:        { name: "Andros (Batsi)",         lat: 37.8600, lon: 24.7830, ground: "cyclades" },
  schinoussa:    { name: "Schinoussa",             lat: 36.8630, lon: 25.5200, ground: "cyclades" },

  // ── The Ionian ──────────────────────────────────────────────────────
  lefkada:       { name: "Lefkada Marina",         lat: 38.8330, lon: 20.7100, ground: "ionian", base: true, kind: "marina" },
  preveza:       { name: "Preveza",                lat: 38.9560, lon: 20.7530, ground: "ionian", base: true, kind: "marina" },
  gouvia:        { name: "Corfu (Gouvia)",         lat: 39.6470, lon: 19.8500, ground: "ionian", base: true, kind: "marina" },
  zakynthos:     { name: "Zakynthos",              lat: 37.7830, lon: 20.9000, ground: "ionian", base: true, kind: "marina" },
  sivota_lef:    { name: "Sivota (Lefkada)",       lat: 38.6180, lon: 20.6900, ground: "ionian" },
  meganisi:      { name: "Meganisi (Vathi)",       lat: 38.6600, lon: 20.7700, ground: "ionian" },
  kalamos:       { name: "Kalamos",                lat: 38.6220, lon: 20.9250, ground: "ionian" },
  kastos:        { name: "Kastos",                 lat: 38.5700, lon: 20.9100, ground: "ionian" },
  ithaca:        { name: "Ithaca (Kioni)",         lat: 38.4470, lon: 20.6900, ground: "ionian" },
  vathy_ith:     { name: "Ithaca (Vathy)",         lat: 38.3670, lon: 20.7170, ground: "ionian" },
  fiskardo:      { name: "Kefalonia (Fiskardo)",   lat: 38.4590, lon: 20.5750, ground: "ionian" },
  sami:          { name: "Kefalonia (Sami)",       lat: 38.2500, lon: 20.6470, ground: "ionian" },
  argostoli:     { name: "Kefalonia (Argostoli)",  lat: 38.1750, lon: 20.4890, ground: "ionian" },
  poros_kef:     { name: "Kefalonia (Poros)",      lat: 38.1500, lon: 20.7750, ground: "ionian" },
  paxos:         { name: "Paxos (Gaios)",          lat: 39.1970, lon: 20.1870, ground: "ionian" },
  antipaxos:     { name: "Antipaxos",              lat: 39.1450, lon: 20.2350, ground: "ionian" },
  sivota_mai:    { name: "Sivota (mainland)",      lat: 39.4070, lon: 20.2400, ground: "ionian" },
  parga:         { name: "Parga",                  lat: 39.2830, lon: 20.4000, ground: "ionian" },
  atokos:        { name: "Atokos (One House Bay)", lat: 38.4780, lon: 20.8180, ground: "ionian" },
  petalas:       { name: "Petalas",                lat: 38.4000, lon: 21.0500, ground: "ionian" },
};

/**
 * The legs a yacht actually sails, and only those.
 *
 * A pair listed here is a passage guests make; a pair not listed is either
 * impossible or is a delivery nobody sells. The optional factor stretches
 * the straight line where land intervenes, and the note says which land, so
 * the number can be argued with rather than trusted.
 */
const LEGS = [
  // Athens out to the Saronic. Everything south of Piraeus rounds nothing,
  // so these run close to the straight line.
  ["alimos", "aegina", 1.35, "round the north of Aegina to the east coast"],
  ["alimos", "aeginatown", 1.0],
  ["alimos", "agkistri", 1.0],
  ["alimos", "poros", 1.2, "down past the Methana shore"],
  ["alimos", "epidaurus", 1.05],
  ["flisvos", "aegina", 1.35, "round the north of Aegina to the east coast"],
  ["flisvos", "aeginatown", 1.0],
  ["flisvos", "poros", 1.2, "down past the Methana shore"],
  ["zea", "aegina", 1.35, "round the north of Aegina to the east coast"],
  ["zea", "aeginatown", 1.0],
  ["zea", "poros", 1.2, "down past the Methana shore"],
  ["neaperamos", "aeginatown", 1.0],
  ["neaperamos", "epidaurus", 1.0],
  ["neaperamos", "alimos", 1.0],
  ["alimos", "sounion", 1.0],
  ["flisvos", "sounion", 1.0],
  ["zea", "sounion", 1.0],
  ["sounion", "lavrio", 1.0],
  ["sounion", "kea", 1.0],
  ["sounion", "kythnos", 1.0],
  ["sounion", "aegina", 1.15, "across the mouth of the Saronic"],

  // Inside the Saronic.
  ["aegina", "aeginatown", 1.35, "round the north of Aegina"],
  ["aegina", "poros", 1.0],
  ["aeginatown", "agkistri", 1.0],
  ["aeginatown", "epidaurus", 1.0],
  ["aeginatown", "poros", 1.1],
  ["agkistri", "epidaurus", 1.0],
  ["epidaurus", "poros", 1.15, "round the Methana peninsula"],
  ["poros", "hydra", 1.3, "out of the Poros channel and west"],
  ["poros", "ermioni", 1.0],
  ["hydra", "dokos", 1.0],
  ["hydra", "ermioni", 1.0],
  ["hydra", "spetses", 1.0],
  ["dokos", "ermioni", 1.0],
  ["dokos", "spetses", 1.0],
  ["ermioni", "porto_heli", 1.2, "round the Kranidi headland"],
  ["ermioni", "spetses", 1.2, "round the Kranidi headland"],
  ["spetses", "porto_heli", 1.0],
  ["spetses", "nafplio", 1.0],
  ["porto_heli", "nafplio", 1.0],
  ["hydra", "aegina", 1.2, "north past Dokos and Methana"],

  // Athens across to the western Cyclades. Cape Sounion is the corner
  // every one of these turns.
  ["alimos", "kea", 1.0, "round Cape Sounion"],
  ["flisvos", "kea", 1.0, "round Cape Sounion"],
  ["zea", "kea", 1.0, "round Cape Sounion"],
  ["neaperamos", "kea", 1.15, "round Cape Sounion"],
  ["lavrio", "kea", 1.0],
  ["lavrio", "kythnos", 1.0],
  ["lavrio", "andros", 1.0],
  ["alimos", "kythnos", 1.1, "round Cape Sounion"],
  ["flisvos", "kythnos", 1.1, "round Cape Sounion"],
  ["alimos", "andros", 1.1, "round Cape Sounion"],
  ["alimos", "syros", 1.08, "round Cape Sounion"],
  ["flisvos", "syros", 1.08, "round Cape Sounion"],
  ["alimos", "serifos", 1.08, "round Cape Sounion"],
  ["alimos", "mykonos", 1.06, "round Cape Sounion"],
  ["flisvos", "mykonos", 1.06, "round Cape Sounion"],
  ["alimos", "paros", 1.06, "round Cape Sounion"],
  ["alimos", "milos", 1.06, "round Cape Sounion"],

  // Inside the Cyclades.
  ["kea", "kythnos", 1.0],
  ["kea", "syros", 1.2, "across the open Kea channel"],
  ["kea", "andros", 1.0],
  ["andros", "syros", 1.0],
  ["andros", "tinos", 1.0],
  ["kythnos", "serifos", 1.0],
  ["kythnos", "syros", 1.0],
  ["serifos", "sifnos", 1.0],
  ["serifos", "milos", 1.0],
  ["sifnos", "milos", 1.0],
  ["sifnos", "kimolos", 1.0],
  ["sifnos", "paros", 1.0],
  ["sifnos", "antiparos", 1.0],
  ["sifnos", "folegandros", 1.0],
  ["milos", "kimolos", 1.0],
  ["milos", "folegandros", 1.0],
  ["kimolos", "folegandros", 1.0],
  ["folegandros", "santorini", 0.9, "the direct line across the Santorini channel"],
  ["folegandros", "ios", 1.0],
  ["ios", "santorini", 1.0],
  ["ios", "naxos", 1.0],
  ["ios", "koufonisia", 1.0],
  ["santorini", "naxos", 1.0],
  ["santorini", "amorgos", 1.0],
  ["naxos", "paros", 1.0],
  ["naxos", "koufonisia", 1.0],
  ["naxos", "schinoussa", 1.0],
  ["naxos", "mykonos", 1.0],
  ["naxos", "amorgos", 1.0],
  ["koufonisia", "schinoussa", 1.0],
  ["koufonisia", "amorgos", 1.0],
  ["schinoussa", "amorgos", 1.0],
  ["paros", "antiparos", 1.0],
  ["paros", "mykonos", 1.0],
  ["paros", "delos", 1.0],
  ["paros", "syros", 1.0],
  ["antiparos", "syros", 1.0],
  ["mykonos", "delos", 1.6, "out of Ornos and round the west of Mykonos"],
  ["mykonos", "rinia", 1.0],
  ["mykonos", "tinos", 1.0],
  ["mykonos", "syros", 1.0],
  ["delos", "rinia", 1.0],
  ["delos", "syros", 1.0],
  ["rinia", "syros", 1.0],
  ["tinos", "syros", 1.0],

  // The western chain is a mesh, not a corridor. Without these the search
  // could only walk out to Sifnos and back the way it came, no circuit
  // closed without repeating an island, and every catamaran in the fleet
  // was handed a Saronic week by default. These are passages boats make.
  ["kea", "serifos", 1.0],
  ["kythnos", "sifnos", 1.0],
  ["kythnos", "milos", 1.0],
  ["kythnos", "paros", 1.0],
  ["serifos", "paros", 1.0],
  ["serifos", "antiparos", 1.0],
  ["serifos", "syros", 1.0],
  ["sifnos", "syros", 1.0],
  ["milos", "santorini", 1.0],
  ["kimolos", "paros", 1.0],
  ["kimolos", "antiparos", 1.0],
  ["folegandros", "paros", 1.0],
  ["folegandros", "antiparos", 1.0],
  ["paros", "ios", 1.0],
  ["paros", "koufonisia", 1.0],
  ["antiparos", "naxos", 1.15, "through the Paros channel"],
  ["naxos", "delos", 1.0],
  ["naxos", "tinos", 1.0],
  ["ios", "amorgos", 1.0],
  ["ios", "sifnos", 1.0],
  ["ios", "schinoussa", 1.0],
  ["mykonos", "koufonisia", 1.0],
  ["andros", "mykonos", 1.0],
  ["andros", "kythnos", 1.0],
  ["amorgos", "mykonos", 1.0],

  // The Ionian.
  ["lefkada", "preveza", 1.45, "north through the Lefkada canal"],
  ["lefkada", "meganisi", 1.0, "through the Lefkada canal"],
  ["lefkada", "sivota_lef", 1.2, "down the east coast of Lefkada"],
  ["lefkada", "kalamos", 1.15, "through the Lefkada canal"],
  ["preveza", "parga", 1.0],
  ["preveza", "paxos", 1.0],
  ["sivota_lef", "meganisi", 1.0],
  ["sivota_lef", "ithaca", 1.0],
  ["sivota_lef", "fiskardo", 1.0],
  ["meganisi", "kalamos", 1.0],
  ["meganisi", "atokos", 1.0],
  ["meganisi", "ithaca", 1.0],
  ["meganisi", "fiskardo", 1.0],
  ["kalamos", "kastos", 1.0],
  ["kalamos", "atokos", 1.0],
  ["kastos", "atokos", 1.0],
  ["kastos", "petalas", 1.0],
  ["atokos", "ithaca", 1.0],
  ["atokos", "vathy_ith", 1.0],
  ["ithaca", "vathy_ith", 1.25, "round the north of Ithaca"],
  ["ithaca", "fiskardo", 1.3, "round the north of Ithaca"],
  ["vathy_ith", "sami", 1.0],
  ["vathy_ith", "poros_kef", 1.0],
  ["fiskardo", "sami", 1.0],
  ["fiskardo", "argostoli", 1.9, "down the whole west coast of Kefalonia"],
  ["sami", "poros_kef", 1.0],
  ["poros_kef", "zakynthos", 1.0],
  ["argostoli", "zakynthos", 1.15, "round Cape Skinari"],
  ["zakynthos", "sami", 1.15, "round the south of Kefalonia"],
  ["fiskardo", "paxos", 1.0],
  ["paxos", "antipaxos", 1.0],
  ["paxos", "gouvia", 1.0, "up the Corfu channel"],
  ["paxos", "sivota_mai", 1.0],
  ["paxos", "parga", 1.0],
  ["antipaxos", "parga", 1.0],
  ["sivota_mai", "gouvia", 1.0],
  ["sivota_mai", "parga", 1.0],
  ["gouvia", "parga", 1.05],
  ["parga", "lefkada", 1.05],
  ["preveza", "sivota_mai", 1.05],
];

const R_NM = 3440.065; // earth radius in nautical miles

function haversine(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_NM * Math.asin(Math.sqrt(s));
}

/** key -> { to, nm, note } */
export const NETWORK = (() => {
  const g = {};
  for (const [a, b, factor = 1, note] of LEGS) {
    if (!PORTS[a] || !PORTS[b]) throw new Error(`Unknown port in leg ${a}-${b}`);
    const nm = Math.round(haversine(PORTS[a], PORTS[b]) * factor);
    (g[a] ||= []).push({ to: b, nm, note });
    (g[b] ||= []).push({ to: a, nm, note });
  }
  return g;
})();

export function legDistance(a, b) {
  const row = (NETWORK[a] || []).find((l) => l.to === b);
  return row ? row.nm : null;
}

/** Which ground a base sits in, used to pick the pool of destinations. */
export function groundOf(portKey) {
  return PORTS[portKey]?.ground || null;
}
