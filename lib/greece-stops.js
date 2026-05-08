// Phase 3 / E1 (Boss luxury rebuild brief, 2026-05-05) —
// Curated cinematic stops for /greece-by-yacht.
//
// Ten places we keep returning to with charter clients, in the order
// a typical "best-of-the-Aegean" itinerary would visit them. Each
// stop has its own editorial voice — these are not destination
// summaries, they are a broker's diary entries about why a UHNW
// guest should care about the place this week.
//
// Each entry is keyed for matching against:
//   • the islands data in lib/islands.js (so /greece-by-yacht and
//     the per-island programmatic pages share the same canon)
//   • the cruisingRegion field in Sanity (so we can surface the right
//     yachts under "Yachts that do this route well")

export const GREECE_STOPS = [
  {
    slug: "mykonos",
    name: "Mykonos",
    region: "Cyclades",
    coordinates: [25.3289, 37.4467],
    eyebrow: "Stop 01 · Cyclades",
    headline: "Where every charter starts.",
    sub: "An hour by tender to anywhere worth going.",
    whyAboard: [
      "It's the only Cycladic island where dinner ends at 04:00 and breakfast still arrives by 09:00.",
      "Anchor outside Ornos at sunrise; tender into Spilia for lunch; sleep at Houlakia; repeat.",
      "Most yachts stage their Cyclades week here because every other island sits within a day's cruise.",
    ],
    tagline: "The only Cycladic island where dinner ends at 04:00 and breakfast still arrives by 09:00.",
    yachtFilter: { regions: ["cyclades"], minSleeps: 8 },
    suggestedYachts: 3,
  },
  {
    slug: "folegandros",
    name: "Folegandros",
    region: "Cyclades",
    coordinates: [24.8946, 36.6232],
    eyebrow: "Stop 02 · Cyclades",
    headline: "The quietest cliff in the Aegean.",
    sub: "60 nautical miles from Mykonos. Worth every one of them.",
    whyAboard: [
      "Spilia bay drops 200m straight off the bow — anchor gets set in 30m of water clearer than most pools.",
      "Dinner ashore at Pounta walking through whitewashed streets that haven't changed since the 1960s.",
      "Three yachts at most ever moor here at once. UHNW guests who came for Mykonos always remember Folegandros.",
    ],
    tagline: "Three yachts at most ever moor here at once.",
    yachtFilter: { regions: ["cyclades"] },
    suggestedYachts: 3,
  },
  {
    slug: "milos",
    name: "Milos",
    region: "Cyclades",
    coordinates: [24.4221, 36.7395],
    eyebrow: "Stop 03 · Cyclades",
    headline: "Volcanic geology, lunar swims.",
    sub: "Sarakiniko at 07:00 — before the day-trip boats arrive.",
    whyAboard: [
      "The only place in the Cyclades where the sea floor switches from sand to white volcanic rock mid-anchor.",
      "Kleftiko caves only open at dawn — get there from a yacht by tender, never from shore.",
      "78 named beaches; most accessible only from the water. Builders of motor yachts love this island.",
    ],
    tagline: "78 named beaches — most accessible only from the water.",
    yachtFilter: { regions: ["cyclades"] },
    suggestedYachts: 3,
  },
  {
    slug: "sifnos",
    name: "Sifnos",
    region: "Cyclades",
    coordinates: [24.7253, 36.9747],
    eyebrow: "Stop 04 · Cyclades",
    headline: "The thinking traveller's Mykonos.",
    sub: "Where Athenian families have summered for generations.",
    whyAboard: [
      "Anchor in Vathi bay; lunch at Manolis; afternoon swim at Apokofto.",
      "The food is the headline — Greek slow-cooking traditions older than the Cyclades themselves.",
      "Quiet harbours, careful service, no Instagram crowd. UHNW returners often skip Mykonos and start here.",
    ],
    tagline: "Quiet harbours, careful service, no Instagram crowd.",
    yachtFilter: { regions: ["cyclades"] },
    suggestedYachts: 3,
  },
  {
    slug: "hydra",
    name: "Hydra",
    region: "Saronic",
    coordinates: [23.4675, 37.3500],
    eyebrow: "Stop 05 · Saronic",
    headline: "No cars. No noise. Just stone.",
    sub: "An hour from Athens, three centuries from anywhere else.",
    whyAboard: [
      "The harbour is a 19th-century stage set — donkeys still carry luggage; the only engine you hear is your own.",
      "Anchor at Mandraki; tender to Pirate Bar; dinner at Sunset; back aboard for nightcaps under the rigging.",
      "We send our most demanding clients here when they want to disappear without leaving the country.",
    ],
    tagline: "The only engine you hear is your own.",
    yachtFilter: { regions: ["saronic"] },
    suggestedYachts: 3,
  },
  {
    slug: "spetses",
    name: "Spetses",
    region: "Saronic",
    coordinates: [23.1583, 37.2603],
    eyebrow: "Stop 06 · Saronic",
    headline: "An island that owns itself.",
    sub: "Pine forests, horse-drawn carriages, Athens in the rear-view mirror.",
    whyAboard: [
      "Anchor at Zogeria — the most photographed bay in the Saronic, accessible only by water or 6km hike.",
      "Old Harbour at sunset for the Poseidonion view; lunch at Tarsanas; swim at Agia Paraskevi.",
      "Greek shipping families summer here. You sail in their company without the overheads.",
    ],
    tagline: "Greek shipping families summer here.",
    yachtFilter: { regions: ["saronic"] },
    suggestedYachts: 3,
  },
  // Stops 07–10 (Symi, Lipsi, Patmos, Skiathos) retired 2026-05-08
  // — Boss directive: Sporades + Dodecanese are no longer surfaced
  // anywhere on the site. Re-add only on explicit owner direction.
];

// Convenience lookup by slug
export const STOP_BY_SLUG = Object.fromEntries(
  GREECE_STOPS.map((s) => [s.slug, s])
);
