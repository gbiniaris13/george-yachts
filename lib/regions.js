// Phase 27i.5 (2026-05-07) — Regional yacht map source-of-truth.
//
// Five "ports" the homepage map clusters yachts under. Athens is the
// hub — every yacht with no explicit cruisingRegion match falls
// here. The four sea regions branch out geographically:
//
//   Ionian    — west of mainland (Corfu, Lefkada, Ithaca)
//   Saronic   — just south of Athens (Hydra, Spetses, Aegina)
//   Cyclades  — central Aegean (Mykonos, Santorini, Paros, Naxos)
//   Sporades  — north Aegean (Skiathos, Skopelos, Alonissos)
//
// `position` is a {x, y} pair on a -100..+100 grid where Athens is
// (0, 0) — used by the SVG / R3F map to place region clusters in
// approximately correct Greek geography.
//
// `match` is a regex tested against the yacht's `cruisingRegion`
// Sanity string. First match wins; unmatched yachts → Athens hub.
//
// `photos` is an array of 4 region images stored under
// /public/images/regions/<slug>/N.jpg. Boss-curated set of Pexels
// CC0 stills (4 per region) — sips-resized to 1920px max, JPEG q80,
// EXIF stripped. The modal renders them as a slow-crossfade cover
// (each photo holds for ~5 s, then fades into the next).
//
// Boss provided these on 2026-05-07 from Desktop folders
// Cyclades / Ionian islands / Saronic / Sporades. Total bundle
// ~12 MB across 16 images.

// Positions on a -100..+100 grid. Athens is the visual centre. The
// 4 regions space out enough that labels never collide:
//   Sporades  ↑  north
//   Ionian    ←  west
//   Athens    ●  centre
//   Saronic   ↓  south (close — Hydra is 90 min from Piraeus)
//   Cyclades  ↘  south-east (further out across the Aegean)
// Tuned 2026-05-07 after the first prod render had Athens + Saronic
// overlapping each other.
export const REGIONS = [
  {
    slug: "athens",
    name: "Athens",
    subtitle: "The hub — every charter starts here",
    position: { x: 4, y: 4 },
    match: null,
    photos: [
      // Athens hub uses the Cyclades cover photos for now (Boss didn't
      // supply Athens-specific images; the hub modal is more of a
      // "starts here" intro than a destination gallery).
      "/images/regions/cyclades/1.jpg",
      "/images/regions/cyclades/2.jpg",
      "/images/regions/cyclades/3.jpg",
      "/images/regions/cyclades/4.jpg",
    ],
    blurb:
      "Charters embark from Alimos, Flisvos, or Vouliagmeni — within 40 minutes of Athens International. Athens is the hub from which every Greek route opens.",
  },
  {
    slug: "ionian",
    name: "Ionian",
    subtitle: "Corfu · Lefkada · Kefalonia · Ithaca",
    position: { x: -65, y: 16 },
    match: /\b(ionian|corfu|lefkad|kefaloni|ithac|paxo|zakyntho|zante)\b/i,
    photos: [
      "/images/regions/ionian/1.jpg",
      "/images/regions/ionian/2.jpg",
      "/images/regions/ionian/3.jpg",
      "/images/regions/ionian/4.jpg",
    ],
    blurb:
      "Greener and softer than the Aegean. Wind-shielded gulfs, turquoise coves, Italian-Venetian architecture in Corfu town. The classic August choice for families.",
  },
  {
    slug: "sporades",
    name: "Sporades",
    subtitle: "Skiathos · Skopelos · Alonissos",
    position: { x: 22, y: 52 },
    match: /\b(sporad|skiathos|skopelos|alonissos|skyros)\b/i,
    photos: [
      "/images/regions/sporades/1.jpg",
      "/images/regions/sporades/2.jpg",
      "/images/regions/sporades/3.jpg",
      "/images/regions/sporades/4.jpg",
    ],
    blurb:
      "Forested islands, marine-park waters, the Mamma Mia coastline. Pine-clad hills run straight to the sea. Skiathos handles flights; Skopelos and Alonissos reward those who stay further.",
  },
  {
    slug: "saronic",
    name: "Saronic",
    subtitle: "Hydra · Spetses · Aegina · Poros",
    position: { x: -8, y: -42 },
    match: /\b(saronic|hydra|spetses|aegina|poros)\b/i,
    photos: [
      "/images/regions/saronic/1.jpg",
      "/images/regions/saronic/2.jpg",
      "/images/regions/saronic/3.jpg",
      "/images/regions/saronic/4.jpg",
    ],
    blurb:
      "Five-day charters that start where the plane lands. Hydra has no cars; Spetses has horse-drawn carriages and a Cambridge old-money expat scene. The closest Greece gets to a private getaway.",
  },
  {
    slug: "cyclades",
    name: "Cyclades",
    subtitle: "Mykonos · Santorini · Paros · Naxos",
    position: { x: 50, y: -62 },
    match: /\b(cyclad|mykonos|santorini|paros|naxos|ios|milos|amorgos)\b/i,
    photos: [
      "/images/regions/cyclades/1.jpg",
      "/images/regions/cyclades/2.jpg",
      "/images/regions/cyclades/3.jpg",
      "/images/regions/cyclades/4.jpg",
    ],
    blurb:
      "The hero of the Greek charter map. Whitewashed villages, deep blue, and the steady summer Meltemi wind. Mykonos for nightlife, Santorini for legend, Paros and Naxos for quieter bays.",
  },
];

/**
 * Bucket yachts into regions based on cruisingRegion text matching.
 * Yachts that don't match any specific region fall into Athens (the hub).
 */
export function bucketYachtsByRegion(yachts) {
  const buckets = Object.fromEntries(REGIONS.map((r) => [r.slug, []]));
  for (const y of yachts ?? []) {
    const region = (y?.cruisingRegion ?? "").toString();
    let matched = false;
    for (const r of REGIONS) {
      if (r.match && r.match.test(region)) {
        buckets[r.slug].push(y);
        matched = true;
        break;
      }
    }
    if (!matched) buckets.athens.push(y);
  }
  return buckets;
}

export function regionForSlug(slug) {
  return REGIONS.find((r) => r.slug === slug) ?? null;
}
