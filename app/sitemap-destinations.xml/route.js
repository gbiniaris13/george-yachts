// Split sitemap: destination pages (islands + regions).
// Phase 7 Round 4 — Section 1.4 of the SEO strategy doc.

import { ISLANDS } from "@/lib/islands";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://georgeyachts.com";

export function GET() {
  const islandUrls = ISLANDS.map((i) => ({
    loc: `${BASE_URL}/yacht-charter-${i.slug}`,
    priority: 0.92,
  }));

  const regionUrls = [
    { loc: `${BASE_URL}/destinations/cyclades`, priority: 0.9 },
    { loc: `${BASE_URL}/destinations/ionian`, priority: 0.9 },
    { loc: `${BASE_URL}/destinations/saronic`, priority: 0.9 },
  ];

  const all = [...islandUrls, ...regionUrls];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
