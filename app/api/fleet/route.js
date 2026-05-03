// /api/fleet — public list of charter yachts from Sanity.
//
// Roberto 2026-05-02 — added so the StickyFleetCTA bottom bar AND
// the /inquiry yacht selector dropdown can query a single, cheap
// JSON endpoint instead of each component re-doing its own GROQ
// fetch. Mirror of the same shape the gy-command CRM uses so any
// existing client code (e.g. CRM's Fleet panel) works against
// either endpoint with no shape change.
//
// Returns:
//   { count: <number>, yachts: [{ name, slug, weeklyRatePrice,
//     subtitle, length, sleeps, tier, type, image }, ...] }
//
// Cached at the edge for 1h via revalidate.

import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)] | order(name asc) {
        name,
        "slug": slug.current,
        subtitle,
        length,
        sleeps,
        cabins,
        crew,
        builder,
        weeklyRatePrice,
        cruisingRegion,
        fleetTier,
        yachtType,
        "image": images[0].asset->url
      }`,
    );

    const yachts = (Array.isArray(result) ? result : []).map((y) => {
      // Mirror gy-command's category derivation so both endpoints
      // emit the same shape. Name-prefix heuristic for type.
      const name = String(y?.name || "");
      let type = "Motor";
      if (name.startsWith("S/CAT") || name.startsWith("P/CAT")) type = "Catamaran";
      else if (name.startsWith("S/Y")) type = "Sailing";
      else if (name.startsWith("M/Y")) type = "Motor";

      return {
        name,
        slug: y?.slug ?? null,
        subtitle: y?.subtitle ?? null,
        length: y?.length ?? null,
        sleeps: typeof y?.sleeps === "number" ? y.sleeps : (parseInt(String(y?.sleeps || "0")) || 0),
        cabins: y?.cabins ?? null,
        crew: y?.crew ?? null,
        builder: y?.builder ?? null,
        weeklyRatePrice: y?.weeklyRatePrice ?? "",
        cruisingRegion: y?.cruisingRegion ?? null,
        tier: y?.fleetTier ?? "private",
        type,
        image: y?.image ?? null,
      };
    });

    return NextResponse.json({ yachts, count: yachts.length });
  } catch (error) {
    console.error("[/api/fleet]", error);
    return NextResponse.json(
      { yachts: [], count: 0, error: "Failed to fetch fleet" },
      { status: 500 },
    );
  }
}
