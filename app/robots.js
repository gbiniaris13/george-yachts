export default function robots() {
  const BASE_URL = "https://georgeyachts.com";

  return {
    rules: [
      // Traditional search engines — full access.
      // 2026-05-11 — '/admin' (no trailing slash) instead of '/admin/'
      // so the rule covers both bare '/admin' (404 with smart-404
      // fallback) and '/admin/*' (KPIs dashboard, future tools).
      // Per Google's robots spec, '/admin/' would only match the
      // trailing-slash path, not the bare one.
      { userAgent: "*", allow: "/", disallow: ["/_next/", "/api/", "/admin", "/studio"] },

      // AI crawlers — explicitly allowed (GEO strategy)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      // Boss directive 2026-05-08: Bytespider (ByteDance / TikTok)
      // disallowed. Doesn't drive AI citations and consumes
      // bandwidth — net-negative for our crawl budget.
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
    ],
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
