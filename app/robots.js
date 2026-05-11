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
    // Phase 7 Round 4 — split sitemaps surfaced to search engines
    // (Section 1.4 of the SEO strategy doc). The main sitemap.xml
    // remains the comprehensive index; the split ones help large-
    // site indexing on Google + Bing.
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-yachts.xml`,
      `${BASE_URL}/sitemap-destinations.xml`,
      `${BASE_URL}/sitemap-blog.xml`,
      `${BASE_URL}/sitemap-programmatic.xml`,
    ],
    host: BASE_URL,
  };
}
