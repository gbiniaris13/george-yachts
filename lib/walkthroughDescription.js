// The walkthrough video's description (George, 8 October 2026, plan item 1):
// every cleared video says, first, which yacht it is, how long she is, how
// many guests she takes, what her week costs and where her page is. One
// sentence, built from the yacht record, so the VideoObject markup, the
// video sitemap and the caption under the player all say the same thing and
// none of them can drift from her rate card.
//
// The weekly figure is her base rate, per yacht with the crew, and the
// sentence says so; APA and VAT come on top, the gratuity is never inside
// ([lib/officialPrices.js]). The rate is read from weeklyRatePrice with the
// same extractor the Offer markup uses, so the two never disagree.

import { extractLowPrice } from "@/lib/pricing";

const BASE_URL = "https://georgeyachts.com";

/** "20,36 m / 67 ft" -> "20.36 m"; "15.84 m / 52 ft " -> "15.84 m". */
export function metresOf(length) {
  if (!length) return "";
  const m = String(length).match(/(\d+(?:[.,]\d+)?)\s*m\b/i) || String(length).match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return "";
  return `${m[1].replace(",", ".")} m`;
}

function count(v) {
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function walkthroughDescription(yacht, { withLink = true } = {}) {
  if (!yacht || !yacht.name) return "";
  const parts = [];
  const metres = metresOf(yacht.length);
  if (metres) parts.push(metres);
  const guests = count(yacht.sleeps);
  const cabins = count(yacht.cabins);
  if (guests && cabins) parts.push(`${guests} guests in ${cabins} cabins`);
  else if (guests) parts.push(`${guests} guests`);
  const low = extractLowPrice(yacht.weeklyRatePrice);
  if (low >= 1000) parts.push(`from EUR ${low.toLocaleString("en-US")} a week base, per yacht with the crew, plus APA and VAT`);
  let s = `${String(yacht.name).trim()}: ${parts.join(", ")}.`;
  if (withLink && yacht.slug) {
    const slug = typeof yacht.slug === "string" ? yacht.slug : yacht.slug.current;
    if (slug) s += ` Her page, rate card and availability: ${BASE_URL}/yachts/${slug}`;
  }
  return s;
}
