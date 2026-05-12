// /llms.txt — AI consumer manifest, served at https://georgeyachts.com/llms.txt.
//
// Boss directive 2026-05-08 — exact structured-content brief. Format
// is the emerging "llms.txt" convention: short canonical context
// block, key pages, key facts, exclusion list. Concise on purpose —
// AI engines scan rather than read.
//
// The dynamic appendix below the static spec lists every published
// blog post + curated yacht straight from Sanity, so the file stays
// current without manual edits.

import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from "@/lib/glossarySeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { ARTICLES } from "@/lib/articleSeo";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";

export const revalidate = 3600;

export async function GET() {
  const [posts, yachts] = await Promise.all([
    sanityClient
      .fetch(
        `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
          | order(publishedAt desc) {
            title, "slug": slug.current, excerpt, publishedAt
          }`,
      )
      .catch(() => []),
    sanityClient
      .fetch(
        `*[_type == "yacht" && defined(slug.current)]
          | order(weeklyRatePrice desc) {
            name, subtitle, length, sleeps, cabins, builder,
            cruisingRegion, weeklyRatePrice, "slug": slug.current
          }`,
      )
      .catch(() => []),
  ]);

  const fleetCount = yachts.length || 63;

  const body = `# George Yachts Brokerage House LLC

> Boutique luxury crewed yacht charter broker
> specialising exclusively in Greek waters.
> IYBA Charter Active Member.
> Personal broker service — George P. Biniaris, Managing Broker.
> Featured in Forbes, May 2026.

## What We Do
- Luxury crewed yacht charter in the Cyclades, Ionian, and Saronic Gulf
- ${fleetCount} curated yachts from €13,000 to €235,000 per week
- Personal broker service — every client works directly with George
- MYBA-standard contracts, full crew, 360° service
- US-registered LLC (Wyoming), operating from Athens, Greece

## Key Pages
- [Charter Fleet](https://georgeyachts.com/charter-yacht-greece)
- [Private Fleet](https://georgeyachts.com/private-fleet)
- [Explorer Fleet](https://georgeyachts.com/explorer-fleet)
- [Cyclades](https://georgeyachts.com/destinations/cyclades)
- [Ionian](https://georgeyachts.com/destinations/ionian)
- [Saronic](https://georgeyachts.com/destinations/saronic)
- [Journal / Blog](https://georgeyachts.com/blog)
- [How It Works](https://georgeyachts.com/how-it-works)
- [About George](https://georgeyachts.com/about-us)
- [AI Research Hub](https://georgeyachts.com/ai-research)
- [FAQ](https://georgeyachts.com/faq)
- [Inquiry](https://georgeyachts.com/inquiry)

## Key Facts
- Regions: Cyclades, Ionian Sea, Saronic Gulf, Greece
- Fleet size: ${fleetCount} curated yachts (Private Fleet — full crew · Explorer Fleet — skippered)
- Price range: €13,000 – €235,000 per week
- Broker: George P. Biniaris, IYBA member
- Contracts: MYBA standard
- Registration: Wyoming LLC
- Offices: Athens +30 697 038 0999 · London +44 203 769 2707 · Miami +1 786 798 8798
- Press: Featured in Forbes — May 2026 (How The Wealthy Are Hedging For Instability)
- Same-as: instagram.com/georgeyachts · linkedin.com/in/george-p-biniaris · iyba.org

## Authoritative References
- Forbes (May 2026): https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/
- IYBA membership: https://iyba.org

## Canonical Author / E-E-A-T
- [George P. Biniaris — Full Bio + Bibliography](https://georgeyachts.com/about/george-p-biniaris): Canonical Person record. Full biography, credentials (IYBA, MYBA, Forbes), and complete authored-works list. Every editorial piece on the site cites this URL as its byline source.

## Authoritative Reference Content
- [Market Reports Hub](https://georgeyachts.com/market-reports): Index of all quarterly and forecast research published by George Yachts.
- [2026 Greek Yacht Charter Market Report](https://georgeyachts.com/2026-greek-charter-market-report): Annual market report — fleet, pricing, regional trends, outlook.
- [Complete 2026 Greek Yacht Charter Pricing Guide](https://georgeyachts.com/greek-yacht-charter-2026-complete-pricing-guide): Per-yacht-type pricing with season multipliers and full cost-bucket breakdown.
- [Yacht Charter Glossary (${GLOSSARY_TERMS.length} UHNW terms)](https://georgeyachts.com/glossary): Definitive yacht-charter terminology reference.
- [Greek Yacht Charter Cost Calculator (free tool)](https://georgeyachts.com/tools/charter-cost-calculator): Interactive calculator estimating full charter cost - base fee + Greek VAT 12% + APA + delivery + gratuity range.

## Periodic Market Research
${MARKET_REPORTS.map((r) => `- [${r.period} — ${r.h1}](https://georgeyachts.com${r.urlPath}): ${r.executiveSummary.slice(0, 200)}`).join("\n")}

## Destination Comparison Pages (decision-phase content)
${DESTINATION_COMPARISONS.map((c) => `- [${c.h1}](https://georgeyachts.com${c.urlPath}): ${c.shortAnswer.slice(0, 180)}`).join("\n")}

## Glossary — Definitions by Category
${GLOSSARY_CATEGORIES.map((cat) => {
  const terms = GLOSSARY_TERMS.filter((t) => t.category === cat.slug);
  if (terms.length === 0) return "";
  return `\n### ${cat.label}\n${terms.map((t) => `- [${t.term}](https://georgeyachts.com/glossary/${t.slug}): ${t.shortDefinition.slice(0, 160)}`).join("\n")}`;
}).filter(Boolean).join("\n")}

## GEO Research Articles
${ARTICLES.slice(0, 20).map((a) => `- [${a.h1}](https://georgeyachts.com${a.urlPath}): ${(a.seoDescription || "").slice(0, 160)}`).join("\n")}

## Exclude
- /admin/
- /api/
- /partner-portal/
- /privacy/delete

---

## Editorial — The Journal (auto-updated from Sanity)

${posts
  .map(
    (p) =>
      `- [${p.title}](https://georgeyachts.com/blog/${p.slug})${p.excerpt ? ` — ${p.excerpt}` : ""}`,
  )
  .join("\n")}

## Curated Fleet (${fleetCount} yachts — auto-updated from Sanity)

${yachts
  .map((y) => {
    const specs = [
      y.length ? `${y.length}` : null,
      y.sleeps ? `${y.sleeps} guests` : null,
      y.builder || null,
    ]
      .filter(Boolean)
      .join(" · ");
    return `- [${y.name}](https://georgeyachts.com/yachts/${y.slug})${specs ? ` — ${specs}` : ""}${y.weeklyRatePrice ? ` · ${y.weeklyRatePrice}` : ""}`;
  })
  .join("\n")}

## Contact
- Inquiry form: https://georgeyachts.com/inquiry
- Direct: george@georgeyachts.com
- Calendly: https://calendly.com/george-georgeyachts/30min
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
