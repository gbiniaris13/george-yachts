// 2026-05-14 — Single source of truth for per-page metadata.
//
// Ahrefs 2026-05-14 crawl flagged:
//   - 95 pages with "Open Graph tags incomplete"
//   - 19 pages with "Open Graph URL not matching canonical"
//
// Root cause: pages that don't export their own openGraph block
// inherit the homepage default from app/layout.jsx — so every static
// surface (privacy, FAQ, team, events, press, partners, etc) was
// emitting:
//   og:title       = homepage title
//   og:description = homepage description
//   og:url         = https://georgeyachts.com  (mismatches canonical)
// That meant Google + AI search engines (Perplexity / ChatGPT /
// Claude / Gemini) couldn't tell those pages apart from the home
// page when extracting snippets, and 19 of them had Ahrefs flagging
// the og:url vs canonical mismatch as a structural error.
//
// pageMeta() returns a complete Next.js Metadata object. Pages call
// it with just the four fields that actually vary — title,
// description, path, and (optionally) a custom OG image. Everything
// downstream (canonical, og:url, og:site_name, twitter card,
// twitter:site, twitter:creator, default OG image fallback) is
// derived consistently so no page can drift.
//
// Usage:
//   import { pageMeta } from "@/lib/pageMeta";
//   export const metadata = pageMeta({
//     title: "FAQ — George Yachts",
//     description: "Frequently asked questions about Greek yacht charters.",
//     path: "/faq",
//   });
//
// For pages whose OG image lives at a custom route (e.g. dynamic
// /api/og?title=... pages), pass `image` explicitly. Otherwise the
// site-wide /opengraph-image (declared in app/opengraph-image.jsx)
// is inherited automatically — same fallback the homepage uses.

const SITE_URL = "https://georgeyachts.com";
const SITE_NAME = "George Yachts Brokerage House";
const TWITTER_HANDLE = "@georgeyachts";

export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}) {
  // Normalise the path so callers can pass "/faq" or "faq" or
  // "https://georgeyachts.com/faq" interchangeably.
  let normalisedPath = path || "";
  if (normalisedPath.startsWith(SITE_URL)) {
    normalisedPath = normalisedPath.slice(SITE_URL.length);
  }
  if (normalisedPath && !normalisedPath.startsWith("/")) {
    normalisedPath = `/${normalisedPath}`;
  }
  const url = `${SITE_URL}${normalisedPath}`;

  // If the caller's title already carries the brand ("... | George Yachts"),
  // mark it absolute so the root layout's "%s | George Yachts" template does
  // not append a second brand token (was rendering "... | George Yachts |
  // George Yachts" on every brand-bearing page). Brandless titles stay
  // templated so they still receive the brand exactly once. The OG/Twitter
  // titles keep the plain string either way.
  const titleHasBrand =
    typeof title === "string" && /george yachts/i.test(title);

  // 2026-07-11 — the "inherited automatically" assumption above proved
  // wrong in practice: the Ahrefs crawl found 95 pages emitting NO
  // og:image because a route that defines its own openGraph block does
  // not receive the root /opengraph-image file. Every page now gets an
  // explicit image: the caller's custom one, or the site-wide card.
  const ogImage = image || `${SITE_URL}/opengraph-image`;

  const meta = {
    title: titleHasBrand ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [ogImage],
    },
  };

  if (noIndex) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
}
