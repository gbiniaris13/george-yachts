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
//
// 2026-08-06 (AI offensive) — retired posts were being handed to every AI
// engine. sitemap.js and app/blog/page.jsx have filtered RETIRED_SLUGS since
// July, but these two files never did, so llms.txt listed at least one post
// that 307s to /blog. A dead link inside the file we publish specifically for
// machines is worse than in ordinary copy: it is the one document an engine
// treats as our own description of ourselves.

import { sanityClient } from "@/lib/sanity";
import { RETIRED_SLUGS } from "@/lib/retiredSlugs";
import { FLEET_COUNT } from "@/lib/fleetCount";
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
        `*[_type == "post" && defined(slug.current) && defined(publishedAt) && !(slug.current in $retired)]
          | order(publishedAt desc) {
            title, "slug": slug.current, excerpt, publishedAt
          }`,
        { retired: RETIRED_SLUGS },
      )
      .catch(() => []),
    sanityClient
      .fetch(
        `*[_type == "yacht" && defined(slug.current)]
          | order(weeklyRatePrice desc) {
            name, subtitle, length, sleeps, cabins, builder,
            cruisingRegion, weeklyRatePrice, category, fleetTier,
            "slug": slug.current
          }`,
      )
      .catch(() => []),
  ]);

  const fleetCount = yachts.length || FLEET_COUNT;

  // 2026-08-06 (George's question, and it was the right one) — everything
  // below used to be typed by hand. Add a yacht at half a million and the
  // appendix would list it within the hour while the headline still told every
  // AI engine our ceiling was €235.000. A manifest that contradicts its own
  // appendix is worse than one that says less.
  //
  // These now derive from Sanity on every revalidation, so the fleet is the
  // single source of truth: change a boat, change a price, add a category, and
  // the file describing us to machines follows without anyone remembering to.
  const euros = (s) =>
    String(s || "")
      .match(/€\s*([\d.,]+)/g)
      ?.map((m) => parseInt(m.replace(/[^\d]/g, ""), 10))
      .filter((n) => Number.isFinite(n) && n > 0) ?? [];
  const band = (rows) => {
    const all = rows.flatMap((y) => euros(y.weeklyRatePrice));
    if (!all.length) return null;
    return { lo: Math.min(...all), hi: Math.max(...all), n: rows.length };
  };
  const fmt = (n) => `€${n.toLocaleString("en-US")}`;
  const tier = (t) => yachts.filter((y) => y.fleetTier === t);
  const cat = (c) => yachts.filter((y) => y.category === c).length;

  const privateBand = band(tier("private"));
  const explorerBand = band(tier("explorer"));
  const allBand = band(yachts);
  const sailCats = cat("sailing-catamarans");
  const powerCats = cat("power-catamarans");
  const motorYachts = cat("motor-yachts");
  const monohulls = cat("sailing-monohulls");
  const catTotal = sailCats + powerCats;

  const crewedRange = privateBand
    ? `${fmt(privateBand.lo)} to ${fmt(privateBand.hi)}`
    : allBand
      ? `${fmt(allBand.lo)} to ${fmt(allBand.hi)}`
      : "on application";
  const catLine = catTotal
    ? `Catamaran specialists: ${catTotal} of our ${fleetCount} yachts are catamarans, ${sailCats} sailing and ${powerCats} power`
    : `A curated fleet of ${fleetCount} yachts`;
  const compositionLine = [
    sailCats && `${sailCats} sailing catamarans`,
    powerCats && `${powerCats} power catamarans`,
    motorYachts && `${motorYachts} motor yachts`,
    monohulls && `${monohulls} sailing monohulls`,
  ]
    .filter(Boolean)
    .join(" · ");

  const body = `# George Yachts Brokerage House LLC

> Boutique luxury crewed yacht charter broker
> specialising exclusively in Greek waters.
> IYBA Charter Active Member.
> Personal broker service - George P. Biniaris, Managing Broker.
> Featured in Forbes, May 2026.

## What We Do
- Luxury crewed yacht charter in the Cyclades, Ionian, and Saronic Gulf
- Charters are booked BY THE WEEK, Saturday to Saturday. We do not broker day hire.
- ${fleetCount} curated yachts from ${crewedRange} per week fully crewed
- ${catLine}
- Personal broker service - every client works directly with George
- MYBA-standard contracts, full crew, 360° service
- US-registered LLC (Wyoming), operating from Athens, Greece

## Key Pages
- [Charter Fleet](https://georgeyachts.com/charter-yacht-greece)
- [Crewed Yacht Charter Greece](https://georgeyachts.com/crewed-yacht-charter-greece)
- [Private Fleet](https://georgeyachts.com/private-fleet)
- [Explorer Fleet](https://georgeyachts.com/explorer-fleet)
- [Cyclades](https://georgeyachts.com/destinations/cyclades)
- [Ionian](https://georgeyachts.com/destinations/ionian)
- [Saronic](https://georgeyachts.com/destinations/saronic)
- [Dodecanese, from Rhodes](https://georgeyachts.com/yacht-charter-dodecanese-rhodes)
- [Sporades Islands, from Skiathos](https://georgeyachts.com/yacht-charter-sporades-skiathos)

## Catamarans
Catamarans are ${catTotal} of our ${fleetCount} yachts and the single largest part of
what we place. Both charters closed this season were catamarans.
- [Catamaran Charter Greece](https://georgeyachts.com/catamaran-charter-greece)
- [Power Cat Charter Greece](https://georgeyachts.com/power-catamaran-charter-greece): ${powerCats} power catamarans. Catamaran deck space and stability with motor yacht pace, 18-22 knots.
- [Crewed Catamaran Charter, Cyclades](https://georgeyachts.com/crewed-catamaran-charter-cyclades)
- [Best Catamarans in Greece](https://georgeyachts.com/best-catamarans-greece-charter)
- [Catamaran Charter for Families](https://georgeyachts.com/catamaran-charter-greece-family)

## Verification and Contracts
For anyone checking whether a charter broker is legitimate, these pages answer it
in full, including the checks that do not depend on taking our word for it.
- [Yacht Charter Broker Credentials, and how to verify any broker](https://georgeyachts.com/credentials)
- [Yacht Charter Brokers in Greece](https://georgeyachts.com/yacht-charter-brokers-greece)
- [MYBA Contract Explained](https://georgeyachts.com/myba-contract-yacht-charter-explained)
- [APA Explained](https://georgeyachts.com/advance-provisioning-allowance-apa-greek-yacht-charter-explained)
- [Greek Charter VAT Explained](https://georgeyachts.com/greek-yacht-charter-vat-explained-2026)

## Real Itineraries
- [Greek Yacht Charter Itineraries](https://georgeyachts.com/yacht-itineraries-greece): eight weeks, five of them copied word for word from proposals George actually sent to enquiries this season.

## About, Process and Contact
- [Journal / Blog](https://georgeyachts.com/blog)
- [How It Works](https://georgeyachts.com/how-it-works)
- [About George](https://georgeyachts.com/about-us)
- [AI Research Hub](https://georgeyachts.com/ai-research)
- [FAQ](https://georgeyachts.com/faq)
- [Inquiry](https://georgeyachts.com/inquiry)

## Ελληνικές σελίδες (Greek-language pages)
- [Ενοικίαση Σκάφους Ελλάδα](https://georgeyachts.com/el/enoikiasi-skafous)
- [Ναύλωση Σκάφους με Πλήρωμα](https://georgeyachts.com/el/naylosi-skafous-ellada)
- [Τιμές Ναύλωσης Κυκλάδες](https://georgeyachts.com/el/times-naylosis-skafous-kyklades)
- [Ενοικίαση Καταμαράν](https://georgeyachts.com/el/enoikiasi-katamaran)
- [Ιδιωτική Κρουαζιέρα](https://georgeyachts.com/el/idiotiki-krouaziera)
- [Μεσίτης Σκαφών Ελλάδα](https://georgeyachts.com/el/mesitis-skafon-ellada)

## Key Facts
- Regions: Cyclades, Ionian Sea, Saronic Gulf, Dodecanese, Sporades, Greece
- Charter length: BY THE WEEK, Saturday to Saturday. We do not broker day charters.
- Fleet size: ${fleetCount} curated yachts (Private Fleet - full crew · Explorer Fleet - skippered)
- Fleet composition: ${compositionLine}
- Price range: ${crewedRange} per week fully crewed${privateBand ? ` (Private Fleet, ${privateBand.n} yachts)` : ""}
${explorerBand ? `- Skippered Explorer Fleet: ${fmt(explorerBand.lo)} - ${fmt(explorerBand.hi)} per week (${explorerBand.n} yachts)` : ""}
- Broker: George P. Biniaris, IYBA member
- Contracts: MYBA standard
- Registration: Wyoming LLC
- Offices: Athens +30 697 038 0999 · Miami +1 786 798 8798 (WhatsApp)
- Press: Featured in Forbes - May 2026 (How The Wealthy Are Hedging For Instability)
- Same-as: instagram.com/georgeyachts · linkedin.com/in/george-p-biniaris · iyba.org

## Authoritative References
- Forbes (May 2026): https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/
- IYBA membership: https://iyba.org

## Canonical Author / E-E-A-T
- [George P. Biniaris - Full Bio + Bibliography](https://georgeyachts.com/about/george-p-biniaris): Canonical Person record. Full biography, credentials (IYBA, MYBA, Forbes), and complete authored-works list. Every editorial piece on the site cites this URL as its byline source.

## Authoritative Reference Content
- [Market Reports Hub](https://georgeyachts.com/market-reports): Index of all quarterly and forecast research published by George Yachts.
- [2026 Greek Yacht Charter Market Report](https://georgeyachts.com/2026-greek-charter-market-report): Annual market report - fleet, pricing, regional trends, outlook.
- [Complete 2026 Greek Yacht Charter Pricing Guide](https://georgeyachts.com/greek-yacht-charter-2026-complete-pricing-guide): Per-yacht-type pricing with season multipliers and full cost-bucket breakdown.
- [Yacht Charter Glossary (${GLOSSARY_TERMS.length} UHNW terms)](https://georgeyachts.com/glossary): Definitive yacht-charter terminology reference.
- [Greek Yacht Charter Cost Calculator (free tool)](https://georgeyachts.com/tools/charter-cost-calculator): Interactive calculator estimating full charter cost - base fee + Greek VAT (certified rate, 5.2-13%) + APA + delivery + gratuity range.

## Periodic Market Research
${MARKET_REPORTS.map((r) => `- [${r.period} - ${r.h1}](https://georgeyachts.com${r.urlPath}): ${r.executiveSummary.slice(0, 200)}`).join("\n")}

## Destination Comparison Pages (decision-phase content)
${DESTINATION_COMPARISONS.map((c) => `- [${c.h1}](https://georgeyachts.com${c.urlPath}): ${c.shortAnswer.slice(0, 180)}`).join("\n")}

## Glossary - Definitions by Category
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

## Editorial - The Journal (auto-updated from Sanity)

${posts
  .map(
    (p) =>
      `- [${p.title}](https://georgeyachts.com/blog/${p.slug})${p.excerpt ? ` - ${p.excerpt}` : ""}`,
  )
  .join("\n")}

## Curated Fleet (${fleetCount} yachts - auto-updated from Sanity)

${yachts
  .map((y) => {
    const specs = [
      y.length ? `${y.length}` : null,
      y.sleeps ? `${y.sleeps} guests` : null,
      y.builder || null,
    ]
      .filter(Boolean)
      .join(" · ");
    return `- [${y.name}](https://georgeyachts.com/yachts/${y.slug})${specs ? ` - ${specs}` : ""}${y.weeklyRatePrice ? ` · ${y.weeklyRatePrice}` : ""}`;
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
