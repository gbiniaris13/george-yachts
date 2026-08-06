export default function robots() {
  const BASE_URL = "https://georgeyachts.com";

  // Paths that must stay out of search-engine indexes — applied
  // to EVERY user-agent block below, not just the wildcard.
  //
  // 2026-05-18 — Security audit found that per RFC 9309 the
  // explicit `Allow: /` rules under each AI-crawler block (GPTBot,
  // ClaudeBot, etc.) OVERRIDE the `Disallow: /admin` under the
  // wildcard `User-Agent: *` (a bot matched to a specific block
  // only sees that block's rules). So AI bots had been authorised
  // to crawl /admin/* even though the wildcard block disallowed
  // it. Each per-bot block now carries its own admin/api disallow.
  //
  // The '/admin' no-trailing-slash form covers both bare '/admin'
  // (404 fallback) and '/admin/*' (KPIs dashboard etc.).
  // '/island/' USED to be disallowed here as "belt and braces" on top of the
  // canonical. 2026-08-06 — that was backwards and Search Console proved it:
  // six of those URLs sit under "Indexed, though blocked by robots.txt". A
  // blocked URL can still be indexed from links alone, and blocking is
  // precisely what stops Google reading the canonical that would have
  // consolidated it. Belt and braces cancelled each other out.
  //
  // /island/* already carries a correct canonical to its public
  // /yacht-charter-{island} twin, so the fix is to let Google crawl it, see
  // that canonical, and fold the duplicate away properly. Never block a URL
  // you want de-indexed: blocking hides the very instruction that would
  // de-index it.
  // 2026-08-06 — /videos/ added, and this is the single biggest crawl-budget
  // find of the day. Search Console's Crawl Stats (no API, read from the
  // console itself) show 4,853 requests to this host over 90 days, 7.55 GB
  // downloaded, and the breakdown by file type is:
  //
  //     HTML 42%  ·  Image 31%  ·  VIDEO 23%  ·  other 4%
  //
  // Roughly 1.7 GB of Googlebot's budget on this site is spent re-fetching
  // 79 MB of background video. Every one of those files is a decorative
  // loop (hero, fleet CTA backgrounds, footer sunset) and the site carries
  // ZERO VideoObject markup, which is why Search Console's video report reads
  // "no videos indexed" on 62 pages. We pay the download and get nothing.
  //
  // Meanwhile 62 real pages have never been fetched at all.
  //
  // robots.txt governs crawlers only: visitors still get every video exactly
  // as before, and blocking a purely decorative resource does not affect how
  // Google renders or assesses the page. Reversible by deleting one string.
  const COMMON_DISALLOW = ["/_next/", "/api/", "/admin", "/studio", "/videos/"];

  // AI crawlers — explicitly allowed for the public surface (GEO
  // strategy), but with the same admin/api guardrails as everyone
  // else.
  const AI_USER_AGENTS = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "anthropic-ai",
    "Claude-Web",
    "ClaudeBot",
    // 2026-06-26 — Claude-SearchBot is Anthropic's dedicated AI-SEARCH
    // fetcher (distinct from ClaudeBot=training and Claude-Web). It gates
    // whether Claude can cite georgeyachts.com in answers, so it must be
    // explicitly allowed alongside OAI-SearchBot and PerplexityBot.
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    // 2026-06-28 - Bingbot made explicit (also powers ChatGPT/Copilot's Bing
    // index). It was already allowed via the wildcard; an explicit block makes
    // intent clear and matches the Phase 1 brief's crawler checklist.
    "Bingbot",
    "FacebookBot",
    "Amazonbot",
    "CCBot",
    "cohere-ai",
    "Diffbot",
  ];

  const rules = [
    // Traditional search engines — full public site, no internal.
    // 2026-05-11 — '/admin' (no trailing slash) instead of '/admin/'
    // so the rule covers both bare '/admin' (404 with smart-404
    // fallback) and '/admin/*' (KPIs dashboard, future tools).
    // Per Google's robots spec, '/admin/' would only match the
    // trailing-slash path, not the bare one.
    { userAgent: "*", allow: "/", disallow: COMMON_DISALLOW },

    // AI crawlers — allowed on /, blocked from /admin + /api etc.
    ...AI_USER_AGENTS.map((ua) => ({
      userAgent: ua,
      allow: "/",
      disallow: COMMON_DISALLOW,
    })),

    // Boss directive 2026-05-08: Bytespider (ByteDance / TikTok)
    // disallowed. Doesn't drive AI citations and consumes bandwidth
    // — net-negative for our crawl budget.
    { userAgent: "Bytespider", disallow: "/" },
  ];

  return {
    rules,
    // 2026-05-14 — collapsed back to a single /sitemap.xml. The Phase 7
    // Round 4 split was duplicating every URL across 5 sitemaps (Ahrefs
    // flagged 240 "Page in multiple sitemaps" warnings). /sitemap.xml
    // is the comprehensive canonical surface — the 4 sub-sitemaps
    // (yachts / destinations / blog / programmatic) were 100% subsets
    // of it. Removed both the route handlers and the robots.txt
    // references in the same change so search engines don't keep
    // hitting deleted endpoints.
    sitemap: [`${BASE_URL}/sitemap.xml`],
    host: BASE_URL,
  };
}
