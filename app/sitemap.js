import { sanityClient } from "@/lib/sanity";
import { JOURNAL_CLUSTERS } from "@/lib/journal-clusters";
import { ISLANDS } from "@/lib/islands";

const BASE_URL = "https://georgeyachts.com";

const staticRoutes = [
  // Core pages
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/charter-yacht-greece", priority: 0.95, changeFrequency: "daily" },
  { path: "/private-fleet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/explorer-fleet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.85, changeFrequency: "monthly" },
  { path: "/charter-timeline", priority: 0.8, changeFrequency: "monthly" },

  // Primary conversion page
  { path: "/inquiry", priority: 0.95, changeFrequency: "weekly" },

  // Phase 27b (Forbes-launch eve, 2026-05-05) — AI Research Hub.
  // Engineered specifically for ChatGPT / Perplexity / Claude /
  // Gemini / Bing AI to cite when users ask about yacht charter
  // Greece. Single-source-of-truth page with structured data,
  // direct first-paragraph answers, and per-section deep links.
  { path: "/ai-research", priority: 0.92, changeFrequency: "weekly" },

  // Side-by-side comparison hub (NEW 2026-04-25). Both the index
  // and the 3 broker-curated comparison URLs are sitemap'd so
  // Google indexes the high-value comparison-query pages directly.
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" },
  { path: "/compare?yachts=genny,altaia", priority: 0.7, changeFrequency: "weekly" },
  { path: "/compare?yachts=la-pellegrina,filotimo", priority: 0.7, changeFrequency: "weekly" },
  { path: "/compare?yachts=genny,filotimo", priority: 0.7, changeFrequency: "weekly" },

  // Per-region SEO landing pages.
  // 2026-05-08 — Boss flagged /yacht-charter/[region] as off-brand
  // vs the rebuilt /destinations/[region] editorial pages. The
  // /yacht-charter/* family now 308-redirects in next.config.mjs
  // and only /destinations/* is sitemap'd as the canonical region
  // surface.
  { path: "/destinations/cyclades", priority: 0.9, changeFrequency: "weekly" },
  { path: "/destinations/ionian", priority: 0.9, changeFrequency: "weekly" },
  { path: "/destinations/saronic", priority: 0.9, changeFrequency: "weekly" },

  // Interactive tools.
  // E.3 (Roberto master rebuild brief, May 2026): /cost-calculator
  // is back as a real interactive page (no longer a redirect to
  // /inquiry). Listed here at high priority — UHNW Google searches
  // for "yacht charter cost Greece" land directly. /yacht-finder
  // still 301-redirects to /inquiry until the Smart Match Quiz
  // ships at /yacht-finder.
  { path: "/cost-calculator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/itinerary-builder", priority: 0.85, changeFrequency: "monthly" },
  { path: "/island-quiz", priority: 0.8, changeFrequency: "monthly" },
  { path: "/yacht-size-visualizer", priority: 0.8, changeFrequency: "monthly" },
  { path: "/proposal-generator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing-calendar", priority: 0.8, changeFrequency: "weekly" },
  { path: "/weather-greece", priority: 0.75, changeFrequency: "daily" },

  // Content
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/yacht-itineraries-greece", priority: 0.8, changeFrequency: "monthly" },
  // Phase 3 / E1 (luxury rebuild, 2026-05-05) — cinematic 10-stop
  // editorial page. High priority — UHNW buyer-shortlist reading
  // surface that doubles as the strongest brand touchpoint.
  { path: "/greece-by-yacht", priority: 0.92, changeFrequency: "weekly" },

  // Destinations pages removed 2026-04-21 — only the home-page
  // GreekWatersMap kept as a visual anchor. Paths redirect in
  // next.config.mjs so legacy bookmarks still land somewhere valid.

  // Services
  { path: "/yachts-for-sale", priority: 0.8, changeFrequency: "weekly" },
  { path: "/private-jet-charter", priority: 0.75, changeFrequency: "monthly" },
  { path: "/vip-transfers-greece", priority: 0.75, changeFrequency: "monthly" },
  { path: "/luxury-villas-greece", priority: 0.75, changeFrequency: "monthly" },

  // Company
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/team", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.85, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.8, changeFrequency: "monthly" },
  { path: "/events", priority: 0.7, changeFrequency: "monthly" },
  // Tier 2.4 (Forbes integration brief, May 2026) — /press lives
  // here so Google indexes the Forbes feature credential alongside
  // the rest of the company pages. Priority 0.7 per brief: lower
  // than homepage, higher than yacht detail pages.
  { path: "/press", priority: 0.7, changeFrequency: "monthly" },
  // Phase 4 / D1 (luxury rebuild, 2026-05-05) — credentials editorial
  // page consolidating Forbes / IYBA / MYBA-standard / Wyoming-Athens
  // dual residency. UHNW pre-deposit verification surface.
  { path: "/credentials", priority: 0.85, changeFrequency: "monthly" },

  // Team members
  { path: "/team/george-biniaris", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team/george-katrantzos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/elleana-karvouni", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/chris-daskalopoulos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/valleria-karvouni", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/manos-kourmoulakis", priority: 0.5, changeFrequency: "monthly" },
  // Removed /team/nemesis (placeholder). Re-add when it becomes a real page.

  // O.2 (Roberto brief, May 2026) — GDPR data deletion request page.
  // Indexable: it's the user's right to find this surface.
  { path: "/privacy/delete", priority: 0.4, changeFrequency: "yearly" },

  // Accessibility statement
  { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },

  // Legal
  { path: "/terms-of-service", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/your-privacy-security", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap() {
  // 2026-05-07 SEO fix — DROPPED the per-entry hreflang alternates.
  // Ahrefs flagged 37 "Hreflang to non-canonical" + 15 "Missing
  // reciprocal hreflang" criticals because the alternates pointed
  // at `?lang=xx` URLs whose canonical was the bare URL (i18n is
  // client-side only — same canonical page, content swapped via
  // I18nProvider). Google ignores hreflang when the alternate
  // resolves to a different canonical. Cleanest signal: declare
  // English as the only canonical and let on-page UX handle locale
  // switching. If we ever move to directory-based i18n (/el/...,
  // /ru/...) we'll re-add hreflang at that point.
  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries = [];
  try {
    // 2026-05-07 SEO fix — exclude (a) drafts (no publishedAt) and
    // (b) the 3 retired slugs that next.config.mjs 307s to /blog.
    // Ahrefs was flagging those as "3XX redirect in sitemap"
    // criticals. The retired slugs DO have publishedAt set in
    // Sanity (they were published then retired), so the
    // defined(publishedAt) filter alone wasn't enough — they need
    // an explicit exclude list. Keep this list in sync with the
    // matching `source` entries in next.config.mjs.
    const RETIRED_SLUGS = [
      "dubai-exodus-yacht-charter-greece-2026",
      "last-cabin-standing-book-crewed-yacht-greece-summer-2026",
      "oil-spike-smart-money-yacht-charter-greece",
    ];
    const posts = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current) && defined(publishedAt) && !(slug.current in $retired)]{ "slug": slug.current, _updatedAt }`,
      { retired: RETIRED_SLUGS }
    );
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt || new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch blog posts", error);
  }

  // F.4 (Roberto brief) — topic-cluster landing pages.
  const journalClusterEntries = JOURNAL_CLUSTERS.map((c) => ({
    url: `${BASE_URL}/journal/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // G.1 (Roberto brief) — per-island programmatic SEO landing pages.
  // Higher priority than the regional pages since "[island] yacht
  // charter" is the high-intent UHNW search.
  const islandEntries = ISLANDS.map((i) => ({
    url: `${BASE_URL}/yacht-charter-${i.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.92,
  }));

  let yachtEntries = [];
  try {
    const yachts = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
    yachtEntries = yachts.map((yacht) => ({
      url: `${BASE_URL}/yachts/${yacht.slug}`,
      lastModified: yacht._updatedAt || new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch yachts", error);
  }

  return [
    ...staticEntries,
    ...journalClusterEntries,
    ...islandEntries,
    ...blogEntries,
    ...yachtEntries,
  ];
}
