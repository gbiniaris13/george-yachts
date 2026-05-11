// Split sitemap: blog posts only.
// Phase 7 Round 4 — Section 1.4 of the SEO strategy doc.

import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE_URL = "https://georgeyachts.com";

// Keep in sync with the matching exclude list in /sitemap.xml.
const RETIRED_SLUGS = [
  "dubai-exodus-yacht-charter-greece-2026",
  "last-cabin-standing-book-crewed-yacht-greece-summer-2026",
  "oil-spike-smart-money-yacht-charter-greece",
];

export async function GET() {
  let posts = [];
  try {
    posts = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current) && defined(publishedAt) && !(slug.current in $retired)]{ "slug": slug.current, _updatedAt }`,
      { retired: RETIRED_SLUGS }
    );
  } catch {
    posts = [];
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map((p) => `  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${p._updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
