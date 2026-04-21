// Destination pages — island photo pool.
//
// History:
//   v1 (2026-04-20) — Pexels photo IDs, some resolved to foreign stock
//                     (Paris). George: "exei rezili". Replaced.
//   v2 (2026-04-21) — local /public/images/ pool (Greek but limited
//                     variety, same 9 photos cycling).
//   v3 (2026-04-21, THIS) — server-side Sanity yacht photo pool.
//
// The yacht photos in Sanity (66 documents, each with a gallery) are
// ALL real shoots from Greek waters — Cyclades anchorages, Ionian
// bays, crew and interior shots George personally approved. Using
// those as the destination island pool gives:
//   • zero external dependency (already on cdn.sanity.io + in CSP)
//   • 100+ unique Greek photos instead of 9 repeating locals
//   • brand-approved (they're George's own fleet)
//   • free to rotate — when he uploads new yachts, pool grows
//
// Server components call `fetchYachtImagePool()` at request / ISR
// time; client components (IslandCard) just consume the final
// `island.image` URL string.

import { sanityClient } from "@/lib/sanity";

// ─── Local fallback pool — used when Sanity is unreachable during
// build, so the page never ships with broken/blank cards. All Greek.
const LOCAL_POOL = [
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

// ─── Server-side Sanity fetch. Returns a de-duped list of yacht
// gallery image URLs (sized to 900×680 via Sanity image pipeline).
// Gracefully falls back to LOCAL_POOL if the fetch fails.
export async function fetchYachtImagePool() {
  try {
    const raw = await sanityClient.fetch(`
      *[_type == "yacht" && defined(slug.current)]{
        "imgs": images[].asset->url
      }
    `);
    const urls = [];
    const seen = new Set();
    for (const row of raw || []) {
      for (const u of row.imgs || []) {
        if (!u || seen.has(u)) continue;
        seen.add(u);
        // Sanity CDN supports inline transforms — crop & size so the
        // IslandCard (4:3) renders sharply without shipping full-res.
        urls.push(`${u}?w=900&h=680&fit=crop&auto=format&q=75`);
      }
    }
    return urls.length ? urls : LOCAL_POOL;
  } catch {
    return LOCAL_POOL;
  }
}

// ─── Deterministic picker. Given an island name and a pool, always
// returns the same URL for that island — refreshing the page doesn't
// shuffle the cards. If pool is empty, falls back to LOCAL_POOL.
export function imageFromPool(pool, name) {
  const list = Array.isArray(pool) && pool.length ? pool : LOCAL_POOL;
  const key = String(name || "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return list[hash % list.length];
}

// ─── Legacy sync helper — kept for any consumer that still imports
// it; just uses the local pool. New destination pages should call
// fetchYachtImagePool() + imageFromPool() instead.
export function imageFor(name) {
  return imageFromPool(LOCAL_POOL, name);
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
