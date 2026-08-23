import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { extractPriceRange } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// 2026-08-23, George's #3: the thank-you screen shows the visitor
// two or three live yachts matching the budget band and type they
// just briefed. Real fleet, real rates, nothing invented; the
// sanityClient wrapper keeps retired hulls out on its own.
//
// Band edges are NET BASE thresholds behind the ALL-IN chips the
// form shows (all-in runs roughly 1.5 to 1.65x base).
const BAND_TO_BASE = {
  "Up to €25,000": [0, 15000],
  "€25,000 - €50,000": [15000, 31000],
  "€50,000 - €80,000": [31000, 50000],
  "€80,000 - €150,000": [50000, 95000],
  "€150,000+": [95000, Infinity],
};

const TYPE_TO_CATEGORY = {
  "Motor Yacht": "motor-yachts",
  "Power Catamaran": "power-catamarans",
  "Sailing Catamaran": "sailing-catamarans",
  "Sailing Monohull": "sailing-monohulls",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const budget = searchParams.get("budget") || "";
    const type = searchParams.get("type") || "";

    const yachts = await sanityClient.fetch(
      `*[_type == "yacht"]{name, "slug": slug.current, weeklyRatePrice, category, subtitle}`
    );

    let pool = yachts.filter((y) => y?.slug && y?.weeklyRatePrice && !/on request/i.test(y.weeklyRatePrice));

    const category = TYPE_TO_CATEGORY[type];
    if (category) pool = pool.filter((y) => y.category === category);

    let range = BAND_TO_BASE[budget] || null;
    if (!range && budget.startsWith("Custom: ")) {
      const n = parseInt(budget.replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(n) && n >= 5000) {
        const base = n / 1.6; // their figure is all-in
        range = [base * 0.65, base * 1.35];
      }
    }
    if (range) {
      pool = pool.filter((y) => {
        const { low } = extractPriceRange(y.weeklyRatePrice);
        return low !== null && low > range[0] && low <= range[1];
      });
    }

    // If the crossing of type and budget leaves nothing, loosen the
    // type before showing an empty shelf.
    if (!pool.length && category && range) {
      pool = yachts.filter((y) => {
        if (!y?.slug || !y?.weeklyRatePrice || /on request/i.test(y.weeklyRatePrice)) return false;
        const { low } = extractPriceRange(y.weeklyRatePrice);
        return low !== null && low > range[0] && low <= range[1];
      });
    }
    if (!pool.length) {
      return NextResponse.json({ yachts: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    pool.sort((a, b) => (extractPriceRange(a.weeklyRatePrice).low || 0) - (extractPriceRange(b.weeklyRatePrice).low || 0));

    // Up to three, spread across the shelf: entry, middle, top.
    let picks;
    if (pool.length <= 3) {
      picks = pool;
    } else {
      picks = [pool[0], pool[Math.floor(pool.length / 2)], pool[pool.length - 1]];
    }

    const result = picks.map((y) => ({
      name: y.name,
      slug: y.slug,
      subtitle: y.subtitle || "",
      rate: String(y.weeklyRatePrice).split("|")[0].trim(),
    }));

    return NextResponse.json({ yachts: result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ yachts: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
