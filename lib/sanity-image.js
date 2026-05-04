// A.11 (Roberto brief, May 2026) — Sanity image helper.
//
// Sanity's image API supports query params for on-the-fly transforms
// (resize, format, quality, fit). The codebase has been using raw
// `images[0].asset->url` everywhere — Sanity then serves the original
// asset, sometimes 2500×1875 JPEGs, even when the client only renders
// a 480×360 card thumbnail. This wastes bandwidth and tanks LCP.
//
// `sanityImg(url, opts)` returns the same URL with `?w=…&fm=webp&q=75`
// appended. `sanityImgSrcSet(url, widths)` returns a `srcSet` string
// for responsive serving. AVIF is preferred for hero images;
// WebP is the safe default for yacht cards.
//
// Usage:
//   <img src={sanityImg(yacht.image, { w: 480 })}
//        srcSet={sanityImgSrcSet(yacht.image, [480, 960, 1440])}
//        sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
//        loading={i < 6 ? "eager" : "lazy"}
//        fetchpriority={i === 0 ? "high" : "auto"} />

const SANITY_HOST = "cdn.sanity.io";
const DEFAULT_QUALITY = 75;

function isSanityUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.endsWith(SANITY_HOST);
  } catch {
    return false;
  }
}

/**
 * Append width / quality / format params to a Sanity image URL.
 * Returns the URL unchanged if it's not a Sanity URL (defensive
 * fallback — we don't want to break Pexels/Unsplash images).
 */
export function sanityImg(url, { w, h, q = DEFAULT_QUALITY, fm = "webp", fit = "crop" } = {}) {
  if (!url) return "";
  if (!isSanityUrl(url)) return url;
  try {
    const u = new URL(url);
    if (w) u.searchParams.set("w", String(w));
    if (h) u.searchParams.set("h", String(h));
    u.searchParams.set("q", String(q));
    u.searchParams.set("fm", fm);
    u.searchParams.set("fit", fit);
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Build a srcset string for responsive serving. `widths` defaults
 * to a sensible set for yacht cards. Pair with a `sizes` attribute
 * on the <img> tag so the browser picks the right candidate.
 */
export function sanityImgSrcSet(url, widths = [480, 960, 1440, 1920], opts = {}) {
  if (!url || !isSanityUrl(url)) return undefined;
  return widths
    .map((w) => `${sanityImg(url, { ...opts, w })} ${w}w`)
    .join(", ");
}

/**
 * Hero / above-the-fold helper — uses AVIF (best modern compression)
 * with WebP fallback handled by next/image or your <picture> tag.
 */
export function sanityHeroImg(url, w = 1600) {
  return sanityImg(url, { w, q: 85, fm: "avif" });
}

/**
 * Card thumbnail — used in fleet listing, trending carousel, blog
 * yacht-callouts. Optimised for the smallest visible size.
 */
export function sanityCardImg(url, w = 600) {
  return sanityImg(url, { w, q: 78, fm: "webp" });
}
