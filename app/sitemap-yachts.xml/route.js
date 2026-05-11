// Split sitemap: yacht detail pages only.
// Phase 7 Round 4 — Section 1.4 of the SEO strategy doc.
// Search engines prefer split sitemaps for large sites; this
// makes yacht-page indexing faster and more reliable.

import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE_URL = "https://georgeyachts.com";

export async function GET() {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
  } catch {
    yachts = [];
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${yachts.map((y) => `  <url>
    <loc>${BASE_URL}/yachts/${y.slug}</loc>
    <lastmod>${y._updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
