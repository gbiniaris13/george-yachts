import { sanityClient } from "@/lib/sanity";
import { JOURNAL_CLUSTERS } from "@/lib/journal-clusters";
import { ISLANDS } from "@/lib/islands";
import { YACHT_TYPES } from "@/lib/yachtTypeSeo";
import { USE_CASES } from "@/lib/useCaseSeo";
import { LONG_TAIL_PAGES } from "@/lib/longTailSeo";
import { COMPARISONS } from "@/lib/comparisonSeo";
import { LINKABLE_ASSETS } from "@/lib/linkableAssetSeo";
import { COMBOS } from "@/lib/comboSeo";
import { ARTICLES } from "@/lib/articleSeo";
import { DURATION_PAGES } from "@/lib/durationSeo";
import { GLOSSARY_TERMS } from "@/lib/glossarySeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";
import { ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesSeo";
import { BOTTOM_FUNNEL_PAGES } from "@/lib/bottomFunnelSeo";
import { BEST_YACHTS_PAGES } from "@/lib/bestYachtsSeo";
import { LAST_REFRESH } from "@/lib/contentFreshness";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";
import { RETIRED_SLUGS } from "@/lib/retiredSlugs";

const BASE_URL = "https://georgeyachts.com";

// Per-collection lastmod dates now live in lib/contentFreshness.js as the
// single source of truth shared with the JSON-LD `dateModified` on each
// page, so sitemap lastmod and structured data never diverge. Bump dates
// there when a family's content actually changes. (LAST_REFRESH imported
// above.)

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

  // Stage 2 (Extra Z) - family hub / index pages (CollectionPage + ItemList).
  { path: "/islands", priority: 0.86, changeFrequency: "weekly" },
  { path: "/yacht-types", priority: 0.86, changeFrequency: "weekly" },
  { path: "/best-yachts", priority: 0.84, changeFrequency: "weekly" },
  { path: "/comparisons", priority: 0.84, changeFrequency: "weekly" },

  // Interactive tools.
  // E.3 (Roberto master rebuild brief, May 2026): /cost-calculator
  // is back as a real interactive page (no longer a redirect to
  // /inquiry). Listed here at high priority — UHNW Google searches
  // for "yacht charter cost Greece" land directly. /yacht-finder
  // still 301-redirects to /inquiry until the Smart Match Quiz
  // ships at /yacht-finder.
  { path: "/cost-calculator", priority: 0.9, changeFrequency: "weekly" },
  // Phase 7 R26 (2026-05-12, technical brief Priority 2A) - VAT/APA
  // calculator. Highest-leverage linkable asset. Higher priority
  // than cost-calculator because this is the comprehensive new
  // model with the full cost-bucket logic + flag-state awareness.
  { path: "/tools/charter-cost-calculator", priority: 0.92, changeFrequency: "monthly" },
  // 2026-06-26 — the all-in weekly rate card (motor, size band x season). High
  // priority: original-data money page + top AI-citation asset for "weekly
  // motor yacht charter Greece cost". Numbers derive from lib/weeklyMotorRates.
  { path: "/weekly-yacht-charter-rates-greece", priority: 0.92, changeFrequency: "monthly" },
  // 2026-06-26 — the weekly motor pillar/hub (query "weekly motor yacht charter
  // Greece"). Hubs the motor cluster + the rate card; angle is the 7-night unit.
  { path: "/weekly-motor-yacht-charter-greece", priority: 0.93, changeFrequency: "weekly" },
  // 2026-06-29 — fully-sourced 2027 market outlook (citation magnet).
  { path: "/greek-yacht-charter-2027-outlook", priority: 0.9, changeFrequency: "monthly" },
  { path: "/itinerary-builder", priority: 0.85, changeFrequency: "monthly" },
  // 2026-05-14 — moved here from the (now retired) sitemap-programmatic.xml.
  // Both pages were live and indexable but only listed in the sub-sitemap,
  // so they were "orphan from main" in Ahrefs. Folded in so /sitemap.xml
  // is the single canonical source after the multi-sitemap dedup.
  { path: "/charter-calendar-heat-map", priority: 0.78, changeFrequency: "monthly" },
  { path: "/charter-cost-estimator", priority: 0.78, changeFrequency: "monthly" },
  { path: "/island-quiz", priority: 0.8, changeFrequency: "monthly" },
  // 2026-06-25: both were live + indexable (robots index,follow) but
  // absent from the sitemap, so Ahrefs flagged them "indexable not in
  // sitemap". /yacht-finder is a high-intent matching tool; /newsletter
  // is the signup landing. Both self-canonical with no duplicate twin —
  // safe to fold into the canonical sitemap.
  { path: "/yacht-finder", priority: 0.8, changeFrequency: "monthly" },
  { path: "/newsletter", priority: 0.5, changeFrequency: "monthly" },
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
  // Phase 7 Round 17 (2026-05-12) — canonical E-E-A-T author surface.
  // Higher priority than /team/george-biniaris because this is the
  // authority page LLMs and Google should preferentially cite for
  // queries about George's expertise. Carries the canonical Person
  // record + complete authored-works bibliography.
  { path: "/about/george-p-biniaris", priority: 0.85, changeFrequency: "monthly" },
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
  // 2026-06-25: /your-privacy-security now 301-redirects to /privacy-policy
  // (legal-page consolidation), so it is dropped from the sitemap.
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
    lastModified: LAST_REFRESH.STATIC,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries = [];
  try {
    // 2026-05-07 SEO fix — exclude (a) drafts (no publishedAt) and
    // (b) the retired slugs that next.config.mjs 307s to /blog.
    // Ahrefs was flagging those as "3XX redirect in sitemap"
    // criticals. The retired slugs DO have publishedAt set in
    // Sanity (they were published then retired), so the
    // defined(publishedAt) filter alone wasn't enough — they need
    // an explicit exclude list. Keep this list in sync with the
    // matching `source` entries in next.config.mjs.
    //
    // 2026-06-04 — dubai-exodus and oil-spike un-retired (their
    // redirects were removed from next.config.mjs now that the real
    // posts are published). They resolve 200 again, so they belong
    // back in the sitemap and are no longer excluded here. Only
    // last-cabin-standing remains retired (expired urgency post).
    //
    // 2026-07-02 — list moved to lib/retiredSlugs.js so the /blog
    // listing excludes the same slugs (Ahrefs: the blog index was
    // still rendering the retired post's card, a link into a 307).
    const posts = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current) && defined(publishedAt) && !(slug.current in $retired)]{ "slug": slug.current, _updatedAt }`,
      { retired: RETIRED_SLUGS }
    );
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      // Sanity always populates _updatedAt; the fallback is defensive
      // only. If Sanity ever returns nothing, prefer the JOURNAL date
      // over "now" so we don't lie about a fresh edit.
      lastModified: post._updatedAt || LAST_REFRESH.JOURNAL,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch blog posts", error);
  }

  // Stage 2 (Task 6) - the Greek Charter Index page always renders real data
  // (lib/charterIndex2026.js default; a published Sanity dataReport doc
  // overrides it), so it is always indexable and always in the sitemap.
  let charterIndexDate = CHARTER_INDEX_2026.dataModified || LAST_REFRESH.HUBS;
  try {
    const report = await sanityClient.fetch(
      `*[_type == "dataReport" && slug.current == "greek-charter-index-2026"][0]{ dataModified, publishedAt }`
    );
    if (report) charterIndexDate = report.dataModified || report.publishedAt || charterIndexDate;
  } catch (error) {
    console.error("Sitemap: failed to fetch dataReport date", error);
  }
  const dataReportEntries = [{
    url: `${BASE_URL}/greek-charter-index-2026`,
    lastModified: charterIndexDate,
    changeFrequency: "monthly",
    priority: 0.9,
  }];

  // F.4 (Roberto brief) — topic-cluster landing pages.
  const journalClusterEntries = JOURNAL_CLUSTERS.map((c) => ({
    url: `${BASE_URL}/journal/${c.slug}`,
    lastModified: LAST_REFRESH.JOURNAL,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // G.1 (Roberto brief) — per-island programmatic SEO landing pages.
  // Higher priority than the regional pages since "[island] yacht
  // charter" is the high-intent UHNW search.
  const islandEntries = ISLANDS.map((i) => ({
    url: `${BASE_URL}/yacht-charter-${i.slug}`,
    lastModified: LAST_REFRESH.ISLANDS,
    changeFrequency: "weekly",
    priority: 0.92,
  }));

  // Phase 7 (2026-05-11, SEO strategy doc execution) — 22 new
  // programmatic SEO landing pages: yacht-type / use-case / long-tail.
  // Higher priority than yacht detail pages, lower than islands.
  const yachtTypeEntries = YACHT_TYPES.map((t) => ({
    url: `${BASE_URL}${t.urlPath}`,
    lastModified: LAST_REFRESH.YACHT_TYPES,
    changeFrequency: "weekly",
    priority: 0.88,
  }));
  const useCaseEntries = USE_CASES.map((u) => ({
    url: `${BASE_URL}${u.urlPath}`,
    lastModified: LAST_REFRESH.USE_CASES,
    changeFrequency: "weekly",
    priority: 0.85,
  }));
  const longTailEntries = LONG_TAIL_PAGES.map((p) => ({
    url: `${BASE_URL}${p.urlPath}`,
    lastModified: LAST_REFRESH.LONG_TAIL,
    changeFrequency: "monthly",
    priority: 0.82,
  }));
  // 2026-05-11 Phase 7 Round 2 — 8 comparison + 3 linkable assets.
  const comparisonEntries = COMPARISONS.map((c) => ({
    url: `${BASE_URL}${c.urlPath}`,
    lastModified: LAST_REFRESH.COMPARISONS,
    changeFrequency: "monthly",
    priority: 0.85,
  }));
  const linkableAssetEntries = LINKABLE_ASSETS.map((a) => ({
    url: `${BASE_URL}${a.urlPath}`,
    lastModified: LAST_REFRESH.LINKABLE,
    changeFrequency: "monthly",
    priority: 0.83,
  }));
  // Phase 7 Round 3 — 13 yacht-type x destination combo pages.
  const comboEntries = COMBOS.map((c) => ({
    url: `${BASE_URL}${c.urlPath}`,
    lastModified: LAST_REFRESH.COMBOS,
    changeFrequency: "monthly",
    priority: 0.84,
  }));
  // Phase 7 Round 3 — reviews page + market report.
  const otherSeoEntries = [
    {
      url: `${BASE_URL}/reviews`,
      lastModified: LAST_REFRESH.STATIC,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/2026-greek-charter-market-report`,
      lastModified: LAST_REFRESH.STATIC,
      changeFrequency: "monthly",
      priority: 0.88,
    },
  ];
  // Phase 7 Round 4 — 4 GEO reference articles.
  const articleEntries = ARTICLES.map((a) => ({
    url: `${BASE_URL}${a.urlPath}`,
    lastModified: LAST_REFRESH.ARTICLES,
    changeFrequency: "monthly",
    priority: 0.87,
  }));
  // Phase 7 Round 5 — 40 duration pages + sailing distance calculator.
  const durationEntries = DURATION_PAGES.map((p) => ({
    url: `${BASE_URL}${p.urlPath}`,
    lastModified: LAST_REFRESH.DURATION,
    changeFrequency: "monthly",
    priority: 0.82,
  }));
  const toolEntries = [
    {
      url: `${BASE_URL}/sailing-distance-calculator`,
      lastModified: LAST_REFRESH.HUBS,
      changeFrequency: "monthly",
      priority: 0.86,
    },
  ];

  // Phase 7 Round 15 (2026-05-12) — glossary hub + 30 definition pages.
  // Highest-leverage GEO content: LLMs (ChatGPT/Perplexity/Claude/
  // Gemini) cite DefinedTerm pages preferentially when users ask
  // "what is X" queries. Priority 0.86 for the hub (parity with
  // sailing distance calculator), 0.78 per term (high enough to crawl
  // weekly, lower than islands/articles since each is narrow).
  const glossaryHubEntry = {
    url: `${BASE_URL}/glossary`,
    lastModified: LAST_REFRESH.HUBS,
    changeFrequency: "monthly",
    priority: 0.86,
  };
  const glossaryEntries = GLOSSARY_TERMS.map((t) => ({
    url: `${BASE_URL}/glossary/${t.slug}`,
    lastModified: LAST_REFRESH.GLOSSARY,
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  // Phase 7 Round 16 (2026-05-12) — destination comparison pages.
  // 5 head-to-head pages targeting UHNW decision-phase queries.
  // High priority (0.9) — highest commercial intent in the entire
  // long-tail because the buyer is choosing where to commit
  // €150k+. Each page is ~3000 words of unique decision-grade
  // analysis with structured comparison data the AI engines can
  // extract directly.
  const destinationComparisonEntries = DESTINATION_COMPARISONS.map((c) => ({
    url: `${BASE_URL}${c.urlPath}`,
    lastModified: LAST_REFRESH.DEST_COMPARISONS,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Phase 7 Round 19 (2026-05-12) — quarterly market reports + hub.
  // Original-research pages are the highest GEO citation magnet.
  // Hub priority 0.88; individual reports 0.86 (slightly above
  // glossary terms since these have time-sensitive research value).
  const marketReportsHubEntry = {
    url: `${BASE_URL}/market-reports`,
    lastModified: LAST_REFRESH.HUBS,
    changeFrequency: "weekly",
    priority: 0.88,
  };
  const marketReportEntries = MARKET_REPORTS.map((r) => ({
    url: `${BASE_URL}${r.urlPath}`,
    lastModified: new Date(r.publishedAt).toISOString(),
    changeFrequency: "monthly",
    priority: 0.86,
  }));

  // Phase 7 Round 21 (2026-05-12) — topical-cluster anchorage spokes
  // for top 5 islands (Mykonos, Santorini, Paros, Corfu, Hydra).
  // Priority 0.84 — meaningful but below the island root pages so
  // crawlers prioritise the parent destination.
  const anchorageEntries = ISLAND_ANCHORAGES.map((a) => ({
    url: `${BASE_URL}${a.urlPath}`,
    lastModified: LAST_REFRESH.ANCHORAGES,
    changeFrequency: "monthly",
    priority: 0.84,
  }));

  // Phase 7 R34 (2026-05-12) - 20 bottom-funnel commercial-intent pages.
  // Priority 0.88 - highest among programmatic family since these are
  // pure purchase-intent queries.
  const bottomFunnelEntries = BOTTOM_FUNNEL_PAGES.map((p) => ({
    url: `${BASE_URL}${p.urlPath}`,
    lastModified: LAST_REFRESH.BOTTOM_FUNNEL,
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  // Phase 7 R35 (2026-05-12) - "Best yachts for X" series.
  const bestYachtsEntries = BEST_YACHTS_PAGES.map((p) => ({
    url: `${BASE_URL}${p.urlPath}`,
    lastModified: LAST_REFRESH.BEST_YACHTS,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  let yachtEntries = [];
  try {
    // 2026-06-25: image sitemap. The fleet's professional photography is
    // the strongest visual asset on the site, but the yacht entries
    // shipped URL-only — so Google Images had no declared images to index
    // for "luxury yacht greece"-type visual searches, and AI engines that
    // read sitemaps got no image signal. Pull up to 3 real photos per
    // yacht and attach them via Next.js's `images` field (rendered as
    // <image:image> tags). Real Sanity CDN URLs only — no placeholders.
    const yachts = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)]{
        "slug": slug.current, _updatedAt,
        "images": images[0..2].asset->url
      }`
    );
    yachtEntries = yachts.map((yacht) => {
      const imgs = Array.isArray(yacht.images)
        ? yacht.images.filter((u) => typeof u === "string" && u)
        : [];
      return {
        url: `${BASE_URL}/yachts/${yacht.slug}`,
        // Sanity always populates _updatedAt; the fallback is defensive.
        lastModified: yacht._updatedAt || LAST_REFRESH.STATIC,
        changeFrequency: "weekly",
        priority: 0.75,
        ...(imgs.length ? { images: imgs } : {}),
      };
    });
  } catch (error) {
    console.error("Sitemap: failed to fetch yachts", error);
  }

  return [
    ...staticEntries,
    ...dataReportEntries,
    ...journalClusterEntries,
    ...islandEntries,
    ...yachtTypeEntries,
    ...useCaseEntries,
    ...longTailEntries,
    ...comparisonEntries,
    ...linkableAssetEntries,
    ...comboEntries,
    ...otherSeoEntries,
    ...articleEntries,
    ...durationEntries,
    ...toolEntries,
    glossaryHubEntry,
    ...glossaryEntries,
    ...destinationComparisonEntries,
    marketReportsHubEntry,
    ...marketReportEntries,
    ...anchorageEntries,
    ...bottomFunnelEntries,
    ...bestYachtsEntries,
    ...blogEntries,
    ...yachtEntries,
  ];
}
