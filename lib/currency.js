// M.1 (Roberto brief, May 2026) — Currency conversion utilities.
//
// All canonical prices on the site are EUR strings (e.g.
// "€56,000 - €79,000 | plus expenses VAT & APA"). When the visitor
// switches to USD or GBP we don't rewrite the EUR string — we
// surface a secondary line ("≈ $61,000 – $86,000") so the source
// of truth stays unambiguous.

const SYMBOLS = { EUR: "€", USD: "$", GBP: "£" };

/**
 * Pull EUR numerals out of a display string. Returns an array of
 * positive integers in the order they appeared.
 *
 * Handles forms like:
 *   "€56,000 - €79,000 | plus expenses VAT & APA"
 *   "From €4,900"
 *   "€20,000 – €26,900"
 */
export function extractEurNumbers(displayStr) {
  if (!displayStr || typeof displayStr !== "string") return [];
  const out = [];
  // Look for a digit cluster preceded (within 3 chars) by € OR EUR.
  const rx = /(?:€|EUR\s?)([\d.,\s]+)/gi;
  let m;
  while ((m = rx.exec(displayStr)) !== null) {
    const cleaned = m[1].replace(/[\s.,]/g, "");
    const n = parseInt(cleaned, 10);
    if (Number.isFinite(n) && n >= 100) out.push(n);
  }
  return out;
}

/**
 * Format a EUR amount in the target currency using the supplied rate.
 * Returns a string like "$61,000". Rounds to the nearest 100 to
 * communicate that the FX rate is indicative, not transactional.
 */
export function formatConverted(amountEur, rate, code) {
  if (!Number.isFinite(amountEur) || !Number.isFinite(rate) || !code) return "";
  const sym = SYMBOLS[code] || "";
  const converted = Math.round((amountEur * rate) / 100) * 100;
  return `${sym}${converted.toLocaleString("en-US")}`;
}

/**
 * Convert a EUR display string to a target-currency display string.
 * Mirrors the input's "low – high" structure when possible.
 *
 * extractToConverted("€56,000 - €79,000 …", 1.08, "USD")
 *   → "≈ $60,500 – $85,300"  (or "" if no EUR numbers were detected)
 */
export function convertEurDisplay(displayStr, rate, code) {
  const nums = extractEurNumbers(displayStr);
  if (nums.length === 0 || !rate || !code || code === "EUR") return "";
  if (nums.length === 1) {
    return `≈ ${formatConverted(nums[0], rate, code)}`;
  }
  const low = formatConverted(nums[0], rate, code);
  const high = formatConverted(nums[nums.length - 1], rate, code);
  if (!low || !high) return "";
  return `≈ ${low} - ${high}`;
}

export const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP"];
export const CURRENCY_SYMBOLS = SYMBOLS;
