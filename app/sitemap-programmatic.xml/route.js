// Split sitemap: all programmatic SEO pages (yacht-types,
// use-cases, comparisons, combos, long-tail, articles, linkable
// assets). 100+ URLs in a single sitemap helps search engines
// discover the surface area faster.
// Phase 7 Round 4 — Section 1.4 of the SEO strategy doc.

import { YACHT_TYPES } from "@/lib/yachtTypeSeo";
import { USE_CASES } from "@/lib/useCaseSeo";
import { LONG_TAIL_PAGES } from "@/lib/longTailSeo";
import { COMPARISONS } from "@/lib/comparisonSeo";
import { LINKABLE_ASSETS } from "@/lib/linkableAssetSeo";
import { COMBOS } from "@/lib/comboSeo";
import { ARTICLES } from "@/lib/articleSeo";
import { DURATION_PAGES } from "@/lib/durationSeo";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://georgeyachts.com";

export function GET() {
  const now = new Date().toISOString();
  const all = [
    ...YACHT_TYPES.map((t) => ({ loc: `${BASE_URL}${t.urlPath}`, priority: 0.88 })),
    ...USE_CASES.map((u) => ({ loc: `${BASE_URL}${u.urlPath}`, priority: 0.85 })),
    ...LONG_TAIL_PAGES.map((p) => ({ loc: `${BASE_URL}${p.urlPath}`, priority: 0.82 })),
    ...COMPARISONS.map((c) => ({ loc: `${BASE_URL}${c.urlPath}`, priority: 0.85 })),
    ...LINKABLE_ASSETS.map((a) => ({ loc: `${BASE_URL}${a.urlPath}`, priority: 0.83 })),
    ...COMBOS.map((c) => ({ loc: `${BASE_URL}${c.urlPath}`, priority: 0.84 })),
    ...ARTICLES.map((a) => ({ loc: `${BASE_URL}${a.urlPath}`, priority: 0.87 })),
    ...DURATION_PAGES.map((p) => ({ loc: `${BASE_URL}${p.urlPath}`, priority: 0.82 })),
    { loc: `${BASE_URL}/2026-greek-charter-market-report`, priority: 0.88 },
    { loc: `${BASE_URL}/reviews`, priority: 0.85 },
    { loc: `${BASE_URL}/sailing-distance-calculator`, priority: 0.86 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
