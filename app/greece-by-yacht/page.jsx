// Phase 3 / E1 (Boss luxury rebuild brief, 2026-05-05) —
// /greece-by-yacht — the cinematic statement page.
//
// Ten editorial "stops" through the Greek waters, each with curated
// yacht picks pulled from Sanity. Designed to feel like a Conde Nast
// Traveler print spread that breathes, not a page of cards.
//
// Architecture:
//   • This is the server entry. We fetch the full fleet once (ISR
//     hourly) and let GreeceByYachtClient hand each stop the right
//     subset under "Yachts that do this route well".
//   • The hero + stops are mostly typography + layout; visuals come
//     from real Sanity yacht hero images (no stock placeholders, per
//     the no-fake-photos rule).
//   • When Boss drops drone footage at /public/videos/greece/<slug>.mp4
//     the client component swaps the still backdrop for the video.
//
// SEO/AI: server-rendered headlines + paragraphs so Googlebot,
// Perplexity, ChatGPT, Claude all see the editorial copy without JS.

import { sanityClient } from "@/lib/sanity";
import { GREECE_STOPS } from "@/lib/greece-stops";
import GreeceByYachtClient from "./GreeceByYachtClient";
import LifestyleGallery from "@/app/components/LifestyleGallery";
import ItineraryPreview from "@/app/components/ItineraryPreview";
import Footer from "@/app/components/Footer";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const revalidate = 3600;

export const metadata = {
  title: "Greece by Yacht | Ten Stops Across the Aegean",
  description:
    "A broker's diary across ten places we keep returning to with charter clients — Mykonos, Folegandros, Milos, Hydra, Symi and beyond. Editorial stops with the yachts that do each route best.",
  alternates: { canonical: "https://georgeyachts.com/greece-by-yacht" },
  openGraph: {
    title: "Greece by Yacht | George Yachts",
    description:
      "Ten cinematic stops across the Aegean — editorial routes with the yachts that do each one best.",
    url: "https://georgeyachts.com/greece-by-yacht",
    type: "article",
  },
};

// Region key normalisation — matches lib/greece-stops.js yachtFilter.regions
// to the actual cruisingRegion strings on yachts in Sanity. Keep this loose;
// not every yacht has a strict region tag.
function yachtMatchesRegion(yacht, regions) {
  if (!regions?.length) return true;
  const region = String(yacht.cruisingRegion || "").toLowerCase();
  return regions.some((r) => region.includes(r.toLowerCase()));
}

export default async function GreeceByYachtPage() {
  // Fetch a compact fleet projection — just enough to render the
  // "yachts that do this route well" cards under each stop.
  const fleet = await sanityClient
    .fetch(
      `*[_type == "yacht" && defined(slug.current)] | order(weeklyRatePrice desc)[0...60]{
        _id,
        name,
        subtitle,
        length,
        sleeps,
        cabins,
        weeklyRatePrice,
        cruisingRegion,
        fleetTier,
        priceModel,
        "slug": slug.current,
        "imageUrl": images[0].asset->url,
        "imageAlt": images[0].alt
      }`
    )
    .catch(() => []);

  // Pre-bucket yachts per stop server-side so the client component
  // doesn't have to filter on every scroll.
  const stops = GREECE_STOPS.map((stop) => {
    const eligible = fleet.filter((y) =>
      yachtMatchesRegion(y, stop.yachtFilter?.regions)
    );
    // Light deterministic shuffle so the same yacht doesn't dominate
    // every cyclades stop. Use stop slug as seed.
    const seed = stop.slug.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const sorted = [...eligible].sort((a, b) => {
      const an = (a.name || "").charCodeAt(0) + seed;
      const bn = (b.name || "").charCodeAt(0) + seed;
      return an - bn;
    });
    return {
      ...stop,
      yachts: sorted.slice(0, stop.suggestedYachts || 3),
    };
  });

  // Pick a hero backdrop yacht photo (the lead Cyclades stop's first yacht
  // is a safe bet — most spectacular fleet inventory).
  const heroBackdrop = stops[0]?.yachts?.[0]?.imageUrl || null;

  return (
    <>
      <PageBreadcrumb path="/greece-by-yacht" />
      <GreeceByYachtClient stops={stops} heroBackdrop={heroBackdrop} />
      {/* Phase 5 / H1 — AI itinerary preview (texture only, never a
          proposal). Streams a 3-day sample week from Gemini based on
          the visitor's brief. The real proposal always comes from a
          human broker via /inquiry. */}
      <ItineraryPreview />
      <LifestyleGallery />
      <Footer />
    </>
  );
}
