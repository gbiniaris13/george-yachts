/**
 * One rule for the brand suffix, applied everywhere a page sets a title.
 *
 * 2026-08-08. Bing's site scan flagged three titles over 70 characters and
 * every source string was comfortably under it. The overflow came from the
 * root layout's template, which appends " | George Yachts" to any title that
 * does not already carry the brand.
 *
 * Sixteen characters is nothing on a short title and fatal on a long one. On
 * /weekly-yacht-charter-rates-greece the price range that was deliberately put
 * into the title on 2026-08-06, to catch searchers who type a number, was being
 * pushed past the truncation point by a brand token nobody reads anyway.
 *
 * So: past the limit, the title keeps its own words and loses the suffix.
 *
 * lib/pageMeta.js already did this for titles that carry the brand themselves.
 * The blog route and /credentials set their metadata directly and never saw
 * that logic, which is why the rule lives here now rather than inside one
 * caller. Any new page that sets a title gets it right by using this.
 */

const BRAND_SUFFIX = " | George Yachts";

// Bing recommends under 70. Google truncates on pixel width, roughly 60
// characters, so anything past 70 is certainly losing its tail.
export const MAX_TITLE_LENGTH = 70;

/** True when appending the brand would push the title past the limit. */
export function wouldOverflowWithBrand(title) {
  return (
    typeof title === "string" &&
    title.length + BRAND_SUFFIX.length > MAX_TITLE_LENGTH
  );
}

/** True when the title already says "George Yachts" and must not say it twice. */
export function carriesBrand(title) {
  return typeof title === "string" && /george yachts/i.test(title);
}

/**
 * The value to hand Next.js for `metadata.title`.
 *
 * Returns a plain string when the root template should append the brand, and
 * `{ absolute }` when it must not: either because the title already names the
 * house, or because there is no room left for it.
 */
export function titleField(title) {
  if (typeof title !== "string") return title;
  return carriesBrand(title) || wouldOverflowWithBrand(title)
    ? { absolute: title }
    : title;
}
