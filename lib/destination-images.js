// Shared pool of Greek-scenery stock images for the destination pages.
//
// George 2026-04-20: the destinations pages need photos per island.
// Per-island photos will eventually live in Sanity (so George can
// upload his own shots from Roberto IG), but until then each island
// pulls from this curated Pexels/Unsplash pool.
//
// We use known Pexels/Unsplash photo IDs. If any URL 404s in prod, the
// IslandCard component falls back to a gold monogram tile, so nothing
// breaks visually — the page still ships all the islands, just without
// that single photo.

const PEXELS = (id, w = 900, h = 680) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

// A pool of Greek/Mediterranean photos. These IDs were verified
// working on Pexels and are unlikely to be removed. If any do break,
// IslandCard falls back gracefully.
const POOL = [
  PEXELS(1010657), // Blue domes, Cycladic architecture
  PEXELS(2356045), // Greek island harbor
  PEXELS(2506923), // Mediterranean coast
  PEXELS(3601425), // Blue sea with boats
  PEXELS(3601083), // Aegean sunset
  PEXELS(2132126), // White village sprawl
  PEXELS(2412606), // Mykonos windmills
  PEXELS(1619317), // Coastal blue water
  PEXELS(4353813), // Mediterranean rooftops
  PEXELS(4617820), // Sailing in Greece
];

// Deterministic picker — given an island name, always return the same
// image URL so refreshing the page doesn't shuffle the photos.
export function imageFor(name) {
  const key = String(name || "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return POOL[hash % POOL.length];
}
