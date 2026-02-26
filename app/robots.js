export default function robots() {
  const BASE_URL = "https://georgeyachts.com";

  return {
    rules: [
      {
        userAgent: "*", // Applies to all bots (Google, Bing, etc.)
        allow: "/", // Allow them to crawl the whole site
        disallow: [
          "/_next/", // Don't crawl internal Next.js build files
          "/api/", // Don't crawl your internal API routes
          "/admin/", // If you ever add a private admin area
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
