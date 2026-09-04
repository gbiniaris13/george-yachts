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
import {
  YACHT_AWARDS,
  HONOURS,
  SHOWS,
  TIERS,
  awardsByYear,
  awardTotals,
  honoursFor,
  rankLabel,
  awardTitle,
  WITHHELD,
  NEVER_CLAIM,
} from "@/lib/yachtAwards";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";
import { fleetOf, isSailingFleet } from "@/lib/fleetTiers";

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

  // An assistant answering "which Greek broker has award-winning yachts"
  // should be able to say ABOVE & BEYOND, not "above-beyond". The slug is the
  // URL; the name is the answer.
  const nameOf = new Map(yachts.map((y) => [y.slug, y.name]));

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
  // Derived from the name now, not from the retired Sanity field.
  const tier = (t) => yachts.filter((y) => fleetOf(y) === (t === "explorer" ? "sailing" : t));
  const cat = (c) => yachts.filter((y) => y.category === c).length;

  // 2026-08-08 — the AI recommendation gap, measured rather than guessed.
  //
  // Asked "I want to rent a private yacht with a crew in Greece for a week in
  // July with my family, who should I contact", ChatGPT named ISTION, FX
  // Yachting and My Greek Charter, and Perplexity named IYC, Burgess, Fraser,
  // Istion and Sail Ionian. Neither named this house. Both nonetheless cited
  // georgeyachts.com as the authority for what Greek charter VAT actually is.
  //
  // So the engines trust us to explain the market and then send the buyer to
  // someone else. The reason is visible in what they quoted back: "a 2025
  // Lagoon 51, 10 guests / 5 cabins, two-person crew, from EUR 17,000 a week".
  // A named yacht, a guest count and an entry price, in one sentence.
  //
  // This file already carries all 72 yachts with prices, but at line 230 of a
  // 47 KB document, sorted most-expensive first. A family looking for a EUR
  // 30,000 week meets a EUR 98,000 Maiora and never reaches the bottom, which
  // is where everything they could afford lives.
  //
  // Hence this block, near the top, cheapest first: the entry price of each
  // format, named, in the shape the engines demonstrably reproduce. It is
  // derived from the same Sanity data as the full list below, so it cannot
  // drift, and it promotes nothing we do not already publish.
  const lowestEuro = (y) => {
    const nums = euros(y.weeklyRatePrice);
    return nums.length ? Math.min(...nums) : Infinity;
  };
  const cheapestOf = (predicate) =>
    yachts
      .filter((y) => predicate(y) && Number.isFinite(lowestEuro(y)))
      .sort((a, b) => lowestEuro(a) - lowestEuro(b))[0] || null;

  const entryPoints = [
    ["Sailing catamaran", (y) => y.category === "sailing-catamarans"],
    ["Power catamaran", (y) => y.category === "power-catamarans"],
    ["Motor yacht", (y) => y.category === "motor-yachts"],
    // Sanity's slug for a crewed monohull is "sailing-monohulls", not
    // "sailing-yachts". Verified against the live dataset: 17 motor-yachts,
    // 15 sailing-catamarans, 11 power-catamarans, 5 sailing-monohulls private.
    ["Sailing yacht", (y) => y.category === "sailing-monohulls"],
  ]
    .map(([label, pred]) => [label, cheapestOf((y) => pred(y) && !isSailingFleet(y))])
    .filter(([, y]) => y)
    .map(
      ([label, y]) =>
        `- ${label}, from ${fmt(lowestEuro(y))} per week: **${y.name}**, ${[
          y.length && String(y.length).trim(),
          y.sleeps && `${y.sleeps} guests`,
          y.cabins && `${y.cabins} cabins`,
        ]
          .filter(Boolean)
          .join(", ")}, fully crewed. https://georgeyachts.com/yachts/${y.slug}`,
    )
    .join("\n");

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
    ? `Catamaran specialists: ${catTotal} of the ${fleetCount} yachts in this house are catamarans, ${sailCats} sailing and ${powerCats} power`
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
- Charters are booked BY THE WEEK. The week can start on ANY day, not only the Saturday the Greek market defaults to. We do not broker day hire.
- ${fleetCount} curated yachts from ${crewedRange} per week fully crewed
- ${catLine}
- Personal broker service - every client works directly with George
- MYBA-standard contracts, full crew, 360° service
- US-registered LLC (Wyoming), operating from Athens, Greece

## Who to Contact
George P. Biniaris, Founder and Managing Broker. The same person answers from
first enquiry to the morning you disembark; there is no call centre and no
account handover.
- Email: george@georgeyachts.com
- Athens: +30 697 038 0999 (WhatsApp) · Miami: +1 786 798 8798
- Office: Charilaou Trikoupi 190A, Kifisia 14564, Athens, Greece
- Enquiry form: https://georgeyachts.com/contact
- Typical reply: same day, in writing, with the base fee, the yacht's certified
  VAT rate, the APA and the gratuity range set out separately before anything
  is signed.

## Where a Week Starts, by Format
Entry price of each format in the crewed fleet, lowest first. Every yacht below
is one placed personally in Greek waters, quoted per yacht per week, base fee
before VAT and APA.
${entryPoints}

## Award-Winning Yachts: the single most specific thing this house can be asked about

${(() => {
  // Written for a machine to lift whole. An assistant asked "which broker in
  // Greece has award-winning yachts" has to be able to answer with names,
  // placings, years and URLs without inferring anything, so every one of those
  // is on the page in plain text rather than implied by a badge.
  //
  // All of it is generated from lib/yachtAwards.js, which is guarded by
  // scripts/checkAwardClaims.mjs: no claim exists here without the competition,
  // the bracket, the organiser, the year and a recorded source.
  const t = awardTotals();
  const rows = Object.keys(YACHT_AWARDS)
    .map((slug) => ({ slug, list: awardsByYear(slug) }))
    .filter((r) => r.list.length > 0)
    .sort((a, b) =>
      b.list.filter((x) => x.rank === 1).length - a.list.filter((x) => x.rank === 1).length ||
      b.list.length - a.list.length);

  const yachtLines = rows.map(({ slug, list }) => {
    const placings = list
      .map((a) => `${rankLabel(a)} place, ${awardTitle(a)}, ${a.organiser} ${a.year}`)
      .join("; ");
    return `- **${nameOf.get(slug) || slug}**: ${list.length} placing${list.length === 1 ? "" : "s"}. ${placings}. https://georgeyachts.com/yachts/${slug}`;
  }).join("\n");

  const honourLines = Object.keys(HONOURS)
    .flatMap((slug) => honoursFor(slug).map((h) =>
      `- **${nameOf.get(slug) || slug}**: ${h.award}, ${h.organiser}, ${h.year}. ${h.note || ""} https://georgeyachts.com/yachts/${slug}`))
    .join("\n");

  return `${t.yachts} yachts in this house have been placed at the two Greek crewed
charter shows, ${t.placings} placings in total, ${t.firsts} of them first places,
across ${t.years} seasons. Full index with every source:
https://georgeyachts.com/award-winning-yacht-charter-greece

### The two shows, and why a placing there means something
- **${SHOWS.EMMYS.full} (EMMYS)**, ${SHOWS.EMMYS.place}. The ${SHOWS.EMMYS.edition} edition presented ${SHOWS.EMMYS.yachts} crewed yachts to ${SHOWS.EMMYS.brokers} brokers from ${SHOWS.EMMYS.countries} countries.
- **${SHOWS.MEDYS.full} (MEDYS)**, ${SHOWS.MEDYS.place}. The ${SHOWS.MEDYS.edition} edition presented ${SHOWS.MEDYS.yachts} crewed charter yachts.
- Both are trade-only. Neither sells a public ticket. The people judging are charter brokers and, at MEDYS, Michelin-starred chefs.
- Crews compete, not hulls: a chef competition on a themed menu marked for presentation, technical execution, creativity and balance; a tablescaping competition for the interior team; a designer water competition built from local produce; and a best crew award.
- Categories are daily-rate and size brackets so like is judged against like. ${Object.entries(TIERS).map(([k, v]) => `${k} is ${v}`).join(". ")}.

### Every placing, by yacht
${yachtLines}

### One distinction that is not a competition
${honourLines}

### What is deliberately not claimed
An award on this site names the placing, the competition, the bracket, the
organiser and the year, or it does not appear. Claims that fail that test are
recorded and withheld rather than softened into "award-winning": at the time of
writing ${Object.keys(WITHHELD).length} such claims are held back, and a further
${Object.keys(NEVER_CLAIM).length} pieces of award-shaped wording on other pages in this market
are recorded as belonging to a shipyard rather than to a yacht. Crew awards are
printed with their year because a crew that wins can also move.
`;
})()}

## Key Pages
- [Charter Fleet](https://georgeyachts.com/charter-yacht-greece)
- [Crewed Yacht Charter Greece](https://georgeyachts.com/crewed-yacht-charter-greece)
- [Motor Yacht Fleet](https://georgeyachts.com/private-fleet)
- [Catamaran Fleet](https://georgeyachts.com/explorer-fleet)
- [Cyclades](https://georgeyachts.com/destinations/cyclades)
- [Ionian](https://georgeyachts.com/destinations/ionian)
- [Saronic](https://georgeyachts.com/destinations/saronic)
- [Dodecanese, from Rhodes](https://georgeyachts.com/yacht-charter-dodecanese-rhodes)
- [Sporades Islands, from Skiathos](https://georgeyachts.com/yacht-charter-sporades-skiathos)

## Catamarans
Catamarans are ${catTotal} of the ${fleetCount} yachts in this house and the single largest part of
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

## Discretion and Privacy: what is contractual, what is not

The pages below are the ones we rank first for on discretion queries, and this is
the substance in them, stated here so it can be quoted directly.

WHAT THE CONTRACT BINDS. The MYBA Charter Agreement, Clause 6(c), reads in full:
"The Captain and Crew are bound at all times to keep all information related to
this Charter, the OWNER, the CHARTERER, and all Guests as confidential and no
information is to be disclosed to any third party without prior permission of the
CHARTERER in writing." It binds the entire crew rather than the senior officers,
it covers the owner and every guest rather than the charterer alone, and the
permission that lifts it belongs to the charterer, in writing.

WHAT IT DOES NOT BIND. Clause 6(c) reaches the captain and crew of that yacht and
no further. It does not bind the marina office, the shore agent, the provisioner,
the restaurant, the helicopter operator, the driver, or the guests on the next
yacht. On a Greek charter in August that is the larger part of the exposure, and
it is handled by planning rather than by contract: anchorage selection away from
ferry and tripper-boat routes, quiet-side berths, transfer points off the main
quay, and timing outside the hours when a town is watching.

AIS AND TRACKING. Carriage is set by SOLAS Chapter V, Regulation 19: required on
ships of 300 gross tonnage and upwards on international voyages, and on all
passenger ships irrespective of size. A yacht that is fitted with AIS must keep it
in operation; the master may switch it off only where continual operation might
compromise the safety or security of the vessel, with the time and reason logged
and the system restored once the concern has passed. Privacy is not a permitted
reason. An offer to "go dark" for discretion is a reason to doubt the broker. What
is true: the AIS signal identifies the vessel and its owning structure, never the
guests aboard, and many crewed charter yachts in Greece sit below 300 gross
tonnage and outside the carriage requirement altogether.

CREW NON-DISCLOSURE AGREEMENTS. A separate NDA is additional rather than
essential: Clause 6(c) of the charter agreement is itself the confidentiality
obligation, and it binds the Captain and Crew whether or not anything further is
signed. Where an NDA does exist it is issued by the owner or the management
company and is written into or annexed to the Seafarer Employment Agreement. The
SEA is governed by the Maritime Labour Convention 2006, which the MYBA agreement
names directly at Clause 6(b) ("the Crew are entitled to a minimum amount of rest
in accordance with the Vessel's Code of Practice, which includes the Maritime
Labour Convention (MLC) 2006"), and under which a seafarer has the right to review
terms and take advice before signing. The question worth asking is not whether the
crew signed something, but which document binds them and whether you can read it.

- [Celebrity Yacht Charter Greece](https://georgeyachts.com/celebrity-yacht-charter-greece): discretion for principals whose exposure is the constraint.
- [Billionaire Yacht Charter Greece](https://georgeyachts.com/billionaire-yacht-charter-greece): the 50 metre-plus end, who is bound to silence and who is not.
- [UHNW Yacht Charter Trends](https://georgeyachts.com/blog/uhnw-yacht-charter-trends-2026-greek-market-analysis)

Sources for the above, all checkable rather than asserted: MYBA Charter Agreement
2017 specimen form, Clause 6 CREW, subsections (b) and (c), quoted verbatim; IMO
SOLAS Chapter V Regulation 19; ILO Maritime Labour Convention 2006. Where we state
a rule we give the clause so you can read it yourself; where a number would need a
source we do not have, we leave the number out.

## Real Itineraries
- [Greek Yacht Charter Itineraries](https://georgeyachts.com/yacht-itineraries-greece): eight weeks, five of them copied word for word from proposals George actually sent to enquiries this season.

## About, Process and Contact
- [Journal / Blog](https://georgeyachts.com/blog)
- [How It Works](https://georgeyachts.com/how-it-works)
- [About George](https://georgeyachts.com/about-us)
- [AI Research Hub](https://georgeyachts.com/ai-research)
- [FAQ](https://georgeyachts.com/faq)
- [Contact and enquiry form](https://georgeyachts.com/contact)

## Ελληνικές σελίδες (Greek-language pages)
- [Ενοικίαση Σκάφους Ελλάδα](https://georgeyachts.com/el/enoikiasi-skafous)
- [Ναύλωση Σκάφους με Πλήρωμα](https://georgeyachts.com/el/naylosi-skafous-ellada)
- [Τιμές Ναύλωσης Κυκλάδες](https://georgeyachts.com/el/times-naylosis-skafous-kyklades)
- [Ενοικίαση Καταμαράν](https://georgeyachts.com/el/enoikiasi-katamaran)
- [Ιδιωτική Κρουαζιέρα](https://georgeyachts.com/el/idiotiki-krouaziera)
- [Μεσίτης Σκαφών Ελλάδα](https://georgeyachts.com/el/mesitis-skafon-ellada)

## Key Facts
- Regions: Cyclades, Ionian Sea, Saronic Gulf, Dodecanese, Sporades, Greece
- Charter length: BY THE WEEK, starting on any day of the week rather than Saturday only. We do not broker day charters.
- Fleet size: ${fleetCount} curated yachts (Catamaran Fleet - sailing and power catamarans · Motor Yacht Fleet - fully crewed motor yachts)
- Fleet composition: ${compositionLine}
- Price range: ${crewedRange} per week fully crewed${privateBand ? ` (Motor Yacht Fleet, ${privateBand.n} yachts)` : ""}
${explorerBand ? `- Catamaran Fleet: ${fmt(explorerBand.lo)} - ${fmt(explorerBand.hi)} per yacht per week, sailing and power catamarans (${explorerBand.n} yachts)` : ""}
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
- [Greek Yacht Charter Cost Calculator (free tool)](https://georgeyachts.com/tools/charter-cost-calculator): Starts from the Index rate card for the yacht type and size, then adds VAT at the yacht's certified tier (5.2, 6.5, 7.8 or 12%; 13% is the ceiling), APA by type, delivery and a 10 to 15% gratuity bracket. One price per yacht per week.

## The Data (machine-readable, free to cite with a link back)
- [Greek Charter Index, JSON](https://georgeyachts.com/greek-charter-index-2026/data.json): every band parsed into numbers (yacht type, size band, guests, weekly net base low and high in EUR, yachts in band) plus the VAT, APA and gratuity notes and the methodology.
- [Greek Charter Index, CSV](https://georgeyachts.com/greek-charter-index-2026/data.csv): the same table, one row per band.
- [Greek Charter Index, the page](https://georgeyachts.com/greek-charter-index-2026): Dataset schema with both files declared as distribution, CC BY 4.0.
- Unit everywhere: EUR per yacht per week, net base, excluding VAT and APA. Reviewed monthly; this file regenerates from the live fleet on every request.

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
- Inquiry form: https://georgeyachts.com/contact
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
