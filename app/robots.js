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
  // '/island/' (Stage 2, Extra IB) is the INTERNAL route backing the public
  // /yacht-charter-{island} URLs (served via a next.config rewrite). Bots
  // should crawl the public /yacht-charter-* form, not the duplicate
  // internal path - belt-and-braces on top of the canonical that already
  // points /island/* -> /yacht-charter-*. Note: '/island/' (trailing slash)
  // does NOT match the '/islands' hub page.
  const COMMON_DISALLOW = ["/_next/", "/api/", "/admin", "/studio", "/island/"];

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
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
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
