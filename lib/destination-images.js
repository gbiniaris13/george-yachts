// Destination pages — island photo pool.
//
// History:
//   v1 (2026-04-20) used a pool of Pexels photo IDs. Some IDs
//   resolved to non-Greek stock (Paris, random Mediterranean cities),
//   so every island card showed ONE specific foreign photo. George
//   flagged on 2026-04-21 — "exei parisi, exei rezili". Fixed below.
//
//   v2 (2026-04-21, this file) uses only LOCAL assets bundled in
//   /public/images/. Every one of these is a real George Yachts /
//   Greek coast / Santorini photo curated by George himself or
//   already approved for use on the marketing site. Guaranteed to
//   load (same-origin) and guaranteed to be Greek.
//
// When George uploads a per-island image to Sanity, pass that URL
// directly as `island.image` on the destination page data object.
// This helper is the fallback pool.

// Curated Greek-scenery pool. All of these already render elsewhere
// on the site (hero images, section backgrounds, yacht gallery tiles)
// so we know they are brand-approved.
const POOL = [
  "/images/about-hero-santorini.jpg",
  "/images/private-fleet-hero.jpg",
  "/images/explorer-fleet-hero.jpg",
  "/images/yachts-charter.jpg",
  "/images/yacht-itineraries.jpeg",
  "/images/yacht-1.jpeg",
  "/images/yacht-2.jpeg",
  "/images/yacht-3.jpeg",
  "/images/yacht-4.jpeg",
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

// Optional hero video per region. When George drops a file into
// /public/videos/destinations-<slug>.mp4 we can wire it back up by
// flipping these entries from null to the path. For now all regions
// are null so the pages stay with rock-solid still-image heroes —
// the Sanity CDN images each destination page already uses.
export const HERO_VIDEO_BY_REGION = {
  cyclades: null,
  ionian: null,
  sporades: null,
  saronic: null,
};

export function videoForRegion(slug) {
  return HERO_VIDEO_BY_REGION[String(slug || "").toLowerCase()] || null;
}
