// Single source of truth for retired blog slugs.
//
// A slug listed here is (a) excluded from the sitemap, (b) excluded
// from the /blog listing, and (c) usually carries a redirect in
// next.config.mjs so old links land somewhere coherent. Keep all
// three surfaces in sync by importing THIS array - the 2026-06-04
// incident (published articles shadowed by stale redirects) started
// because the sitemap list and next.config drifted apart.
//
// last-cabin-standing: expired "March 2026 final chance" urgency post,
// retired 2026-06-04. The post is still published in Sanity so its
// content history is preserved; it is simply withdrawn from every
// public surface.
export const RETIRED_SLUGS = [
  "last-cabin-standing-book-crewed-yacht-greece-summer-2026",
];
