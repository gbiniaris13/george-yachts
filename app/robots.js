export default function robots() {
  const BASE_URL = "https://georgeyachts.com";

  return {
    rules: [
      // Traditional search engines — full access
      { userAgent: "*", allow: "/", disallow: ["/_next/", "/api/", "/admin/", "/studio"] },

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
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
