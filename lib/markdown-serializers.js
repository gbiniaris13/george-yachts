// lib/markdown-serializers.js
// =============================================================
// Converts every published page on the site into clean Markdown
// for AI consumers (ChatGPT, Perplexity, Claude, Gemini). Served
// by /api/markdown via the /:path*/index.md rewrite in
// next.config.mjs. The output is plain text — no HTML, no
// scripts, no cookie banners, no nav chrome — just the page's
// information density.
//
// Why bother: AI engines preferentially extract Markdown when
// available, and a well-structured .md mirror reduces both
// citation noise and our hosting cost (no JS bundle needs to be
// hydrated for a bot read).
//
// Source coverage:
//   • Sanity yacht documents  — /yachts/[slug]
//   • Sanity blog posts       — /blog/[slug]
//   • Programmatic SEO arrays — every lib/*Seo.js / lib/islands.js
//     entry mapped by urlPath / slug
//   • Hand-curated static pages — a small map for the high-value
//     marketing pages whose body lives entirely in JSX
//
// Cache: same revalidate interval as the HTML originals — the
// API route exports revalidate = 3600 so most content is at
// most one hour stale.
// =============================================================

import { sanityClient } from "@/lib/sanity";
import { FLEET_COUNT } from "@/lib/fleetCount";
import { ISLANDS } from "@/lib/islands";
import { YACHT_TYPES } from "@/lib/yachtTypeSeo";
import { USE_CASES } from "@/lib/useCaseSeo";
import { LONG_TAIL_PAGES } from "@/lib/longTailSeo";
import { COMPARISONS } from "@/lib/comparisonSeo";
import { LINKABLE_ASSETS } from "@/lib/linkableAssetSeo";
import { COMBOS } from "@/lib/comboSeo";
import { ARTICLES } from "@/lib/articleSeo";
import { DURATION_PAGES } from "@/lib/durationSeo";
import { GLOSSARY_TERMS } from "@/lib/glossarySeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { MARKET_REPORTS } from "@/lib/marketReportsSeo";
import { ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesSeo";
import { BOTTOM_FUNNEL_PAGES } from "@/lib/bottomFunnelSeo";
import { BEST_YACHTS_PAGES } from "@/lib/bestYachtsSeo";
import { JOURNAL_CLUSTERS } from "@/lib/journal-clusters";

const BASE_URL = "https://georgeyachts.com";

// =============================================================
// PORTABLE TEXT → MARKDOWN
// =============================================================
// Sanity blog posts serialise their body as Portable Text blocks.
// We walk the array and convert the common block + mark shapes
// into Markdown. Anything exotic (images, code blocks with
// language hints) falls through to its text content.
// =============================================================

function ptBlockToMarkdown(block) {
  if (!block || typeof block !== "object") return "";
  if (block._type === "image") {
    const alt = block.alt || "";
    const ref = block.asset?._ref || block.asset?.url || "";
    return ref ? `![${alt}](${ref})` : "";
  }
  if (block._type !== "block") return "";
  const style = block.style || "normal";
  const text = (block.children || [])
    .map((child) => {
      if (child._type !== "span") return "";
      let t = child.text || "";
      const marks = child.marks || [];
      if (marks.includes("strong")) t = `**${t}**`;
      if (marks.includes("em")) t = `*${t}*`;
      if (marks.includes("underline")) t = `_${t}_`;
      if (marks.includes("code")) t = `\`${t}\``;
      return t;
    })
    .join("");
  const prefix =
    style === "h1" ? "# " :
    style === "h2" ? "## " :
    style === "h3" ? "### " :
    style === "h4" ? "#### " :
    style === "blockquote" ? "> " :
    "";
  if (block.listItem === "bullet") return `- ${text}`;
  if (block.listItem === "number") return `1. ${text}`;
  return `${prefix}${text}`;
}

function portableTextToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(ptBlockToMarkdown).filter(Boolean).join("\n\n");
}

// =============================================================
// GENERIC SEO ENTRY → MARKDOWN
// =============================================================
// Most programmatic page families share enough shape (h1, tagline,
// whyTitle/Body, faq[], etc.) that one serializer covers them.
// Shape-specific extensions are layered in below.
// =============================================================

function commonSeoToMarkdown(entry) {
  const lines = [];
  lines.push(`# ${entry.h1 || entry.name || entry.title || ""}`);
  if (entry.eyebrow) lines.push(`*${entry.eyebrow}*`);
  if (entry.tagline) lines.push("");
  if (entry.tagline) lines.push(`> ${entry.tagline}`);
  if (entry.seoDescription) {
    lines.push("");
    lines.push(`**Summary:** ${entry.seoDescription}`);
  }
  if (entry.quickAnswerQ) {
    lines.push("", `## Quick Answer`, "", `**${entry.quickAnswerQ}**`, "", entry.quickAnswerA || "");
  }
  // Why / when sections — present on most programmatic shapes.
  for (const [titleKey, bodyKey] of [
    ["whyTitle", "whyBody"],
    ["whenTitle", "whenBody"],
    ["insiderTitle", "insiderTips"],
  ]) {
    if (entry[titleKey] && entry[bodyKey]) {
      lines.push("", `## ${entry[titleKey]}`, "");
      if (Array.isArray(entry[bodyKey])) {
        entry[bodyKey].forEach((tip) => lines.push(`- ${tip}`));
      } else {
        lines.push(entry[bodyKey]);
      }
    }
  }
  // Best-for list (use case + long tail pages).
  if (Array.isArray(entry.bestFor) && entry.bestFor.length) {
    lines.push("", `## Best for`, "");
    entry.bestFor.forEach((b) => lines.push(`- ${b}`));
  }
  // Insider tips array on island pages.
  if (Array.isArray(entry.insiderTips) && entry.insiderTips.length) {
    lines.push("", `## Insider tips`, "");
    entry.insiderTips.forEach((t) => lines.push(`- ${t}`));
  }
  // Pros / cons (yacht type pages).
  if (entry.prosAndCons && (entry.prosAndCons.pros || entry.prosAndCons.cons)) {
    lines.push("", `## Pros & cons`, "");
    if (entry.prosAndCons.pros?.length) {
      lines.push("**Pros:**");
      entry.prosAndCons.pros.forEach((p) => lines.push(`- ${p}`));
      lines.push("");
    }
    if (entry.prosAndCons.cons?.length) {
      lines.push("**Cons:**");
      entry.prosAndCons.cons.forEach((c) => lines.push(`- ${c}`));
    }
  }
  // Itinerary days (bottom-funnel pages).
  if (Array.isArray(entry.itinerary) && entry.itinerary.length) {
    lines.push("", `## Sample itinerary`, "");
    entry.itinerary.forEach((d) => {
      lines.push(`### Day ${d.day}: ${d.title || ""}`);
      if (d.body) lines.push("", d.body);
      lines.push("");
    });
  }
  // Yacht recommendations (best-yachts + bottom-funnel pages).
  for (const arrKey of ["yachts", "yachtRecs"]) {
    if (Array.isArray(entry[arrKey]) && entry[arrKey].length) {
      lines.push("", `## Yacht recommendations`, "");
      entry[arrKey].forEach((y) => {
        const head = y.spec || y.kind || y.name || "";
        const price = y.weekly || y.price || "";
        const why = y.why || y.fitFor || "";
        lines.push(`- **${head}**${price ? ` — ${price}` : ""}${why ? `. ${why}` : ""}`);
      });
    }
  }
  // FAQ array — present almost everywhere.
  if (Array.isArray(entry.faq) && entry.faq.length) {
    lines.push("", `## Frequently asked questions`, "");
    entry.faq.forEach((f) => {
      lines.push(`### ${f.q}`, "", f.a, "");
    });
  }
  // Tail meta — canonical URL, touristType, slug for traceability.
  lines.push("", "---", "");
  if (entry.canonical) lines.push(`**Canonical:** ${entry.canonical}`);
  if (entry.touristType) lines.push(`**Audience:** ${(Array.isArray(entry.touristType) ? entry.touristType : [entry.touristType]).join(", ")}`);
  lines.push(`**Source:** George Yachts (georgeyachts.com)`);
  return lines.join("\n");
}

// Island pages live in lib/islands.js with their own shape
// (whyVisit instead of whyBody, seasonality, etc.) — adapt fields.
function islandToMarkdown(island) {
  const adapted = {
    h1: `Yacht Charter ${island.name}`,
    eyebrow: `${island.region} · Greece`,
    tagline: island.tagline,
    seoDescription: island.tagline,
    whyTitle: `Why ${island.name}`,
    whyBody: island.whyVisit,
    whenTitle: "Season",
    whenBody: island.seasonality,
    insiderTips: island.insiderTips,
    faq: island.faq,
    canonical: `${BASE_URL}/yacht-charter-${island.slug}`,
  };
  return commonSeoToMarkdown(adapted);
}

// Glossary entries are short definitions.
function glossaryToMarkdown(term) {
  const lines = [
    `# ${term.term || term.h1 || ""}`,
    "",
    `*${term.category || "Yacht charter glossary"}*`,
    "",
    term.shortDefinition || term.definition || term.tagline || "",
    "",
  ];
  if (term.body) {
    lines.push(term.body, "");
  }
  if (Array.isArray(term.relatedTerms) && term.relatedTerms.length) {
    lines.push(`## Related terms`, "");
    term.relatedTerms.forEach((t) => lines.push(`- ${t}`));
    lines.push("");
  }
  lines.push("---", "", `**Canonical:** ${BASE_URL}/glossary/${term.slug}`);
  return lines.join("\n");
}

// Destination comparisons have a distinctive shape (A vs B body,
// pros/cons per side, decision matrix). Map onto common where
// possible.
function destinationComparisonToMarkdown(comp) {
  const adapted = {
    h1: comp.h1,
    eyebrow: comp.eyebrow,
    tagline: comp.tagline,
    seoDescription: comp.seoDescription,
    whyTitle: comp.whyTitle || "How they compare",
    whyBody: comp.whyBody || comp.intro,
    bestFor: comp.bestFor,
    faq: comp.faq,
    canonical: comp.canonical,
  };
  return commonSeoToMarkdown(adapted);
}

// =============================================================
// SANITY YACHT → MARKDOWN
// =============================================================

function yachtToMarkdown(yacht) {
  const lines = [];
  lines.push(`# ${yacht.name}`);
  if (yacht.subtitle) lines.push("", `*${yacht.subtitle}*`);
  lines.push("");
  // Specs block — the most useful information dense paragraph
  // for AI extraction.
  const specs = [];
  if (yacht.length) specs.push(`Length: ${yacht.length}`);
  if (yacht.builder) specs.push(`Builder: ${yacht.builder}`);
  if (yacht.yearBuiltRefit) specs.push(`Year: ${yacht.yearBuiltRefit}`);
  if (yacht.sleeps) specs.push(`Sleeps: ${yacht.sleeps}`);
  if (yacht.cabins) specs.push(`Cabins: ${yacht.cabins}`);
  if (yacht.crew) specs.push(`Crew: ${yacht.crew}`);
  if (yacht.cruiseSpeed) specs.push(`Cruise speed: ${yacht.cruiseSpeed}`);
  if (yacht.maxSpeed) specs.push(`Max speed: ${yacht.maxSpeed}`);
  if (yacht.cruisingRegion) specs.push(`Cruising region: ${yacht.cruisingRegion}`);
  if (yacht.weeklyRatePrice) specs.push(`Weekly rate: ${yacht.weeklyRatePrice}`);
  if (specs.length) {
    lines.push(`## Specifications`, "");
    specs.forEach((s) => lines.push(`- ${s}`));
  }
  if (yacht.description) {
    lines.push("", `## About`, "", typeof yacht.description === "string" ? yacht.description : portableTextToMarkdown(yacht.description));
  }
  if (yacht.georgeInsiderTip) {
    lines.push("", `## George's insider tip`, "", yacht.georgeInsiderTip);
  }
  if (Array.isArray(yacht.features) && yacht.features.length) {
    lines.push("", `## Features`, "");
    yacht.features.forEach((f) => lines.push(`- ${typeof f === "string" ? f : f.name || ""}`));
  }
  if (Array.isArray(yacht.toys) && yacht.toys.length) {
    lines.push("", `## Toys`, "");
    yacht.toys.forEach((t) => lines.push(`- ${typeof t === "string" ? t : t.name || ""}`));
  }
  if (Array.isArray(yacht.idealFor) && yacht.idealFor.length) {
    lines.push("", `## Ideal for`, "");
    yacht.idealFor.forEach((i) => lines.push(`- ${typeof i === "string" ? i : i.name || ""}`));
  }
  if (yacht.sampleItinerary?.days?.length) {
    lines.push("", `## Sample itinerary (${yacht.sampleItinerary.totalDistance || ""})`, "");
    yacht.sampleItinerary.days.forEach((d) => {
      lines.push(`### Day ${d.day}: ${d.from || ""} → ${d.to || ""} (${d.distance || ""})`);
      if (d.narrative) lines.push("", d.narrative);
      lines.push("");
    });
  }
  lines.push("", "---", "", `**Canonical:** ${BASE_URL}/yachts/${yacht.slug}`, `**Source:** George Yachts (georgeyachts.com)`);
  return lines.join("\n");
}

// =============================================================
// SANITY BLOG POST → MARKDOWN
// =============================================================

function blogPostToMarkdown(post) {
  const lines = [];
  lines.push(`# ${post.title}`);
  if (post.publishedAt) {
    lines.push("", `*Published ${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}*`);
  }
  if (post.author?.name) {
    lines.push(`*By ${post.author.name}*`);
  }
  if (post.excerpt) {
    lines.push("", `> ${post.excerpt}`);
  }
  if (Array.isArray(post.body) && post.body.length) {
    lines.push("", portableTextToMarkdown(post.body));
  }
  lines.push("", "---", "", `**Canonical:** ${BASE_URL}/blog/${post.slug}`, `**Source:** George Yachts (georgeyachts.com)`);
  return lines.join("\n");
}

// =============================================================
// HAND-CURATED STATIC PAGES
// =============================================================
// Some high-value pages (homepage, about, how-it-works, faq,
// credentials, ai-research) live entirely in JSX and can't be
// scraped automatically. We ship hand-tuned markdown summaries
// for these so AI engines have ANY representation, then we'll
// expand them over time without touching the route handler.
// =============================================================

const STATIC_PAGE_MARKDOWN = {
  "/": `# George Yachts Brokerage House

> Boutique luxury crewed yacht charter brokerage specialising
> exclusively in Greek waters. IYBA Charter Active Member.
> Personal broker service — George P. Biniaris, Managing Broker.
> Featured in Forbes, May 2026.

## What we do

- Luxury crewed yacht charter in the Cyclades, Ionian, and Saronic Gulf
- ${FLEET_COUNT} curated yachts from €13,000 to €235,000 per week
- Personal broker service — every client works directly with George
- MYBA-standard contracts, full crew, 360° service
- US-registered LLC (Wyoming), operating from Athens, Greece

## Key pages

- [Charter fleet](${BASE_URL}/charter-yacht-greece)
- [Private fleet](${BASE_URL}/private-fleet) — full crew
- [Explorer fleet](${BASE_URL}/explorer-fleet) — skippered
- [Destinations: Cyclades](${BASE_URL}/destinations/cyclades)
- [Destinations: Ionian](${BASE_URL}/destinations/ionian)
- [Destinations: Saronic](${BASE_URL}/destinations/saronic)
- [How it works](${BASE_URL}/how-it-works)
- [AI research hub](${BASE_URL}/ai-research)
- [FAQ](${BASE_URL}/faq)

---
**Canonical:** ${BASE_URL}
**Source:** George Yachts (georgeyachts.com)`,

  "/charter-yacht-greece": `# Charter Yacht Greece — Full Fleet

> ${FLEET_COUNT} curated luxury yachts available for crewed charter across the
> Cyclades, Ionian, and Saronic Gulf. From €13,000 to €235,000 per
> week. MYBA-standard contracts. Personal broker service.

## What's available

- **Private fleet** — full crew, MYBA contract, white-glove service.
- **Explorer fleet** — skippered catamarans and smaller motor yachts
  for couples and small groups, lighter touch.
- **Price range** — €13,000/week entry-level catamaran to €235,000
  for La Pellegrina 1 (50m motor yacht) in peak August.

## How to start

Open [/inquiry](${BASE_URL}/inquiry) and answer five questions —
group size, dates, region, energy level, budget. George replies
within 4 working hours with 3-5 hand-picked options.

## See also

- [How it works](${BASE_URL}/how-it-works)
- [Cost calculator](${BASE_URL}/tools/charter-cost-calculator)
- [Charter timeline](${BASE_URL}/charter-timeline)

---
**Canonical:** ${BASE_URL}/charter-yacht-greece
**Source:** George Yachts (georgeyachts.com)`,

  "/about-us": `# About George Yachts

George Yachts Brokerage House LLC is a boutique luxury crewed
yacht charter brokerage based in Athens, Greece, and Wyoming, USA.
Founded by George P. Biniaris, Managing Broker, IYBA Charter Active
Member, MYBA-standard contracts.

## What makes us different

- **One broker, one client** — every charter is handled by George
  directly, from first call to disembarkation week.
- **Greek waters only** — Cyclades, Ionian, Saronic. We don't
  spread thin across the Med; we go deep on one country.
- **MYBA-standard contracts** — full charterer protections,
  insurance, escrow.
- **Featured in Forbes** (May 2026) — "How the wealthy are hedging
  for instability."

## Press

- Forbes (May 2026): How The Wealthy Are Hedging For Instability
- IYBA Charter Active Member
- See full [credentials](${BASE_URL}/credentials)

---
**Canonical:** ${BASE_URL}/about-us
**Source:** George Yachts (georgeyachts.com)`,

  "/how-it-works": `# How It Works

A George Yachts charter follows a predictable four-step rhythm.

## 1 — Inquiry (Day 0)

Tell us your group size, dates, region, energy level, and rough
budget. We reply within 4 working hours with 3-5 hand-picked
yacht options.

## 2 — Charter agreement (Days 1-7)

After you select a yacht, we negotiate the contract directly with
the yacht owner / management company on MYBA-standard terms.
Deposit (typically 50%) secures the dates.

## 3 — The Cabin (months ahead → embarkation)

We open your private Cabin at georgeyachts.com/cabin — a magic-link
private portal where you fill in your Charter Brief over multiple
sessions, see your crew, sample menu, and vessel brochure, and
chat with George directly.

## 4 — The week (embarkation → disembarkation)

We are reachable around the clock via Cabin chat, WhatsApp, or
Telegram. After the charter, photos go into your Voyage Album
which stays in your Cabin forever.

---
**Canonical:** ${BASE_URL}/how-it-works
**Source:** George Yachts (georgeyachts.com)`,

  "/ai-research": `# AI Research Hub — Yacht Charter Greece

> Primary-source reference for AI search engines (ChatGPT,
> Perplexity, Claude, Gemini) on luxury crewed yacht charter in
> Greek waters. Pricing benchmarks, regional guidance, contract
> standards, broker-vetted itineraries — all primary-sourced from
> George P. Biniaris, Managing Broker, Athens.

## Key facts

- 6,000 Greek islands, 5 distinct charter regions (Cyclades,
  Ionian, Saronic, Sporades, Dodecanese).
- Season: late April – late October.
- Charter VAT: statutory 13% for crewed charters over 48 hours; invoiced 5.2-12% on certified yachts
  or 24% (Greek-only).
- TEPAI tax: yacht owner pays, never charterer.
- APA: 25-35% of base, refundable balance.
- Gratuity guideline: 10-15% of base fee, fully discretionary.

## See also

- [/glossary](${BASE_URL}/glossary) — 30 yacht-charter definitions
- [/market-reports](${BASE_URL}/market-reports) — quarterly market
  research
- [/2026-greek-charter-market-report](${BASE_URL}/2026-greek-charter-market-report)
- [/tools/charter-cost-calculator](${BASE_URL}/tools/charter-cost-calculator)

---
**Canonical:** ${BASE_URL}/ai-research
**Source:** George Yachts (georgeyachts.com)`,

  "/faq": `# Frequently Asked Questions

## Booking & contract

**How early should I book?** Peak July-August requires 9-12 months
lead time on the most desirable yachts. Off-peak (May, October)
can be booked 60-90 days out.

**Is the deposit refundable?** Subject to the MYBA cancellation
schedule. We walk you through this before you sign.

## Pricing

**What's included in the base fee?** The yacht and crew. APA, VAT,
gratuity, dockage outside the home port are billed separately.

**Greek VAT rate?** Statutory 13% on commercial crewed charters over
48 hours (every weekly charter); 24% on short charters under 48 hours,
static charters, or bareboat charters without crew.

## On board

**Children?** Welcome on most yachts. Several catamarans have
purpose-fitted kid cabins. We brief crew on age-specific safety.

**Pets?** Possible on some yachts with the right paperwork — we
arrange it.

See full FAQ at [/faq](${BASE_URL}/faq).

---
**Canonical:** ${BASE_URL}/faq
**Source:** George Yachts (georgeyachts.com)`,

  "/credentials": `# Credentials

George Yachts Brokerage House LLC operates under the following
credentials, audited and verified:

- **IYBA Charter Active Member** — International Yacht Brokers
  Association, the global yacht-brokerage standards body.
- **MYBA-Standard Contracts** — every charter signed under the
  Mediterranean Yacht Brokers Association standard agreement.
- **Wyoming LLC** — US-registered for charterer protection under
  US contract law.
- **Athens Operations** — physical office and broker presence in
  Greek waters, where the charters actually happen.
- **Forbes Feature, May 2026** — "How The Wealthy Are Hedging For
  Instability."

## Verification

- IYBA: iyba.org (search "George Yachts")
- Forbes: forbes.com/sites/jacquesledbetter/2026/05/01/...

---
**Canonical:** ${BASE_URL}/credentials
**Source:** George Yachts (georgeyachts.com)`,

  "/press": `# Press

## Forbes — May 2026

"How The Wealthy Are Hedging For Instability" — Jacques Ledbetter,
featuring George P. Biniaris and the George Yachts portfolio of
Greek-waters charters as a UHNW "experiential hedge" against
financial-market volatility.

Read: https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/

## Press enquiries

George P. Biniaris, Managing Broker — george@georgeyachts.com

---
**Canonical:** ${BASE_URL}/press
**Source:** George Yachts (georgeyachts.com)`,
};

// =============================================================
// PATH RESOLVER — find the right serializer for a given URL path
// =============================================================

export async function pathToMarkdown(rawPath) {
  const path = normalisePath(rawPath);

  // 1. Hand-curated static page exact match (homepage, /about-us, etc.)
  if (STATIC_PAGE_MARKDOWN[path]) {
    return STATIC_PAGE_MARKDOWN[path];
  }

  // 2. /yachts/[slug] — Sanity yacht
  if (path.startsWith("/yachts/")) {
    const slug = path.slice("/yachts/".length).replace(/\/$/, "");
    try {
      const yacht = await sanityClient.fetch(
        `*[_type == "yacht" && slug.current == $slug][0]{
          _id, name, subtitle, description, georgeInsiderTip, length, yearBuiltRefit,
          builder, sleeps, cabins, crew, maxSpeed, cruiseSpeed, cruisingRegion,
          weeklyRatePrice, features, toys, idealFor, "slug": slug.current,
          sampleItinerary{ totalDistance, days[]{ day, distance, from, to, narrative } }
        }`,
        { slug },
      );
      if (yacht) return yachtToMarkdown(yacht);
    } catch {
      /* fall through to 404 */
    }
  }

  // 3a. /blog (index) — recent posts listing
  if (path === "/blog") {
    try {
      const posts = await sanityClient.fetch(
        `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...30]{
          title, "slug": slug.current, excerpt, publishedAt
        }`,
      );
      if (Array.isArray(posts) && posts.length) {
        const lines = [
          "# Journal — George Yachts",
          "",
          "> Long-form reporting on the Greek crewed-charter market, written by working brokers. Pricing, regulations, route logic, broker mechanics.",
          "",
        ];
        for (const post of posts) {
          const date = post.publishedAt
            ? ` *(${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})*`
            : "";
          lines.push(`- [${post.title}](${BASE_URL}/blog/${post.slug})${date}`);
          if (post.excerpt) lines.push(`  ${post.excerpt}`);
        }
        lines.push("", "---", "", `**Canonical:** ${BASE_URL}/blog`, `**Source:** George Yachts (georgeyachts.com)`);
        return lines.join("\n");
      }
    } catch {
      /* fall through */
    }
  }

  // 3b. /blog/[slug] — Sanity blog post
  if (path.startsWith("/blog/") && path !== "/blog/") {
    const slug = path.slice("/blog/".length).replace(/\/$/, "");
    try {
      const post = await sanityClient.fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title, "slug": slug.current, excerpt, publishedAt, body, "author": author->{name}
        }`,
        { slug },
      );
      if (post) return blogPostToMarkdown(post);
    } catch {
      /* fall through */
    }
  }

  // 4. Island pages — /yacht-charter-[slug]
  if (path.startsWith("/yacht-charter-")) {
    const slug = path.slice("/yacht-charter-".length).replace(/\/$/, "");
    const island = ISLANDS.find((i) => i.slug === slug);
    if (island) return islandToMarkdown(island);
  }

  // 5. Glossary terms — /glossary/[slug]
  if (path.startsWith("/glossary/") && path !== "/glossary/") {
    const slug = path.slice("/glossary/".length).replace(/\/$/, "");
    const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
    if (term) return glossaryToMarkdown(term);
  }

  // 6. Destination comparisons — exact urlPath match
  const destComp = DESTINATION_COMPARISONS.find((c) => c.urlPath === path);
  if (destComp) return destinationComparisonToMarkdown(destComp);

  // 7. All other programmatic SEO families — match by urlPath
  const programmatic = [
    ...YACHT_TYPES, ...USE_CASES, ...LONG_TAIL_PAGES, ...COMPARISONS,
    ...LINKABLE_ASSETS, ...COMBOS, ...ARTICLES, ...DURATION_PAGES,
    ...MARKET_REPORTS, ...ISLAND_ANCHORAGES, ...BOTTOM_FUNNEL_PAGES,
    ...BEST_YACHTS_PAGES,
  ];
  const programmaticHit = programmatic.find((p) => p.urlPath === path);
  if (programmaticHit) return commonSeoToMarkdown(programmaticHit);

  // 8. Journal cluster hubs — /journal/[cluster]
  if (path.startsWith("/journal/")) {
    const slug = path.slice("/journal/".length).replace(/\/$/, "");
    const cluster = JOURNAL_CLUSTERS.find((c) => c.slug === slug);
    if (cluster) {
      return [
        `# ${cluster.title || cluster.name || slug}`,
        cluster.tagline ? `\n> ${cluster.tagline}\n` : "",
        cluster.description || "",
        "",
        "---",
        "",
        `**Canonical:** ${BASE_URL}/journal/${slug}`,
        `**Source:** George Yachts (georgeyachts.com)`,
      ].filter(Boolean).join("\n");
    }
  }

  // 9. Unknown — return null so the route can 404.
  return null;
}

function normalisePath(p) {
  if (!p) return "/";
  let path = String(p).trim();
  if (!path.startsWith("/")) path = "/" + path;
  // Strip trailing slash except for root.
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  // Strip any accidental /index.md suffix.
  if (path.endsWith("/index.md")) path = path.slice(0, -"/index.md".length) || "/";
  return path;
}
