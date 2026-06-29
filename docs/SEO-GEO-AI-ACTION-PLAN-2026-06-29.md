# George Yachts: SEO / GEO / AI-Search Action Plan

**Compiled 2026-06-29** from a 7-specialist research workflow (full site audit + live market/SERP/AI-search/emerging-tech research), every claim verified against live code. This is the working plan for the page-1-for-charters push.

---

## Executive read

The site is a best-in-class on-page build (schema graph, AI-crawler robots rules, sitemap, OG, review-gating all present and correct). The problem is not the pages, it is **which intent they own**. The corpus over-indexes on the informational layer (VAT, APA, TEPAI, glossary, anchorage guides) which earns citations but rarely a charter request, while the genuinely commercial permutations (type x destination, duration, use-case) are built but under-ranked. The bare head terms ("luxury yacht charter greece") are owned by aggregators with 800+ indexed yachts and decade-old broker entities: un-winnable head-on, and partly the wrong (bareboat/day-rental) buyer anyway.

The credible fast path to page 1 is the **flank**: George already ranks ~#2 for "yacht charter saronic gulf hydra spetses crewed motor" and ~#3 for "how much does a yacht charter in greece cost", proving specific crewed-motor + named-destination long-tails are winnable. Two hand-recorded GSC positions ("motor yacht charter greece prices" @ ~12.8, "athens yacht charter cost" @ ~16.5) sit one nudge off page 1 and are the single best on-page wins available.

Beyond on-page, every specialist converges on the same ceiling: the KPI is now gated by **off-site earned consensus** (mentions, reviews, entity clarity), none of which is a code change.

> **Caveat:** there is no Google Search Console query export in the repo. Every "what ranks today" claim except the 3 hand-recorded snapshots is live-SERP inference. **Highest-value next input: George exports a GSC Queries+Pages CSV** so the whole keyword plan goes from qualitative to quantitative.

---

## The money-keyword -> page-1 plan

Ranked by (intent-to-book x winnability). **[GSC]** = real hand-recorded position from `docs/SEO-GEO-FULL-RECORD-2026-06-10.md`. Everything else is live-SERP inference (no invented volumes).

| # | Keyword | Current | Page to own it | Action |
|---|---|---|---|---|
| 1 | motor yacht charter greece prices | [GSC] ~12.8 | /motor-yacht-charter-greece | Front-load "prices/weekly cost" in first 40-60 words + question H2 (existing verified figures only) |
| 2 | athens yacht charter cost | [GSC] ~16.5, no owner | /luxury-yacht-charter-athens | Front-loaded all-in cost paragraph (George's rate-card numbers) + internal links from Athens duration pages |
| 3 | how much does a yacht charter in greece cost | Page 1 ~#3 | /blog/how-much-does-yacht-charter-greece-cost... | Defend: internal links to rate card + 2-3 yacht pages; refresh dateModified |
| 4 | weekly yacht charter rates greece | ranking | /weekly-yacht-charter-rates-greece | Keep VAT 13%/24%; cross-link from #3 (all-in price math is the moat) |
| 5 | motor yacht charter saronic gulf | Page 1 ~#2 | /motor-yacht-charter-saronic-gulf | Defend + replicate the pattern; name 2-3 bookable yachts |
| 6 | yacht charter [island]: milos, spetses, paros | Sifnos ranks; gaps | combo/anchorage engine | Build the named-island gap pages (thin SERPs, winnable) |
| 7 | private yacht charter mykonos | not owned | new combo page | Differentiate from day-trip operators (multi-day crewed) |
| 8 | crewed catamaran charter mykonos | winnable | catamaran x Mykonos | List real catamarans; correct APA/VAT FAQ |
| 9 | corporate yacht charter greece | winnable | use-case engine | Competitor prints obsolete 6.5-12% VAT; correct 13%/24% is the moat |
| 10 | honeymoon yacht charter greece | exists | use-case page | Internal links + name suitable yachts |
| 11 | motor yacht charter santorini | held by IYC | motor x Santorini | Lead with southern-Cyclades routing |
| 12 | crewed family yacht charter greece | "crewed" winnable | family use-case | Target CREWED qualifier to dodge bareboat aggregators |
| 13-15 | what's-included / 12-passenger-rule / greece-vs-croatia | ranking | existing blog/guides | Defend + link to enquiry |
| 16 | best luxury yacht charter company greece | listicle SERP | (off-site) | Get George named IN the listicles + AI answers (PR, not on-page) |

---

## SHIP NOW (safe, no new claims, verifiable in one local build)

- **[DONE 2026-06-29, commit c2cf685]** Doubled `<title>` fix (central `pageMeta` + 5 raw pages; 13 pages). Forbidden em/en dashes removed from `/yacht-charter/[region]`.
- **B2-pending** Add `TouristTrip`/`TouristAttraction` schema to the ~36 itinerary/duration pages missing it (only ~6 of ~42 have it). Cheapest "plan a 7-day Cyclades trip" AI-prompt lever.
- **B2-pending** Attach `AggregateOffer` to the fleet-hub `ItemList` (`charter-yacht-greece` `generateFleetSchema`, using the already-imported `extractPriceRange`).
- **B2-pending** `Article`/`Report` schema on `/greek-yacht-charter-2027-outlook` + `/greek-charter-index-2026` (author -> George Person @id; dates exist in `contentFreshness.js`).
- **B2-pending** `HowTo` JSON-LD on `/how-it-works` from the steps already on the page.
- **B2-pending** Explicit `Bravebot` Allow in `app/robots.js` (powers Claude web search; wildcard already permits, this is parity/clarity).
- **B2-pending** Trim 4 over-length (>60 char) anchorage titles (Santorini, Paros, August superyacht, Corfu).
- **B2-pending** Lift `max-snippet:-1` + `max-image-preview:large` to the top-level `robots` block (currently only on `googleBot`).
- **Care** Resolve the 6 duplicate comparison routes via canonical (reversible) not redirect while George is away; confirm keeper against GSC first.

---

## NEEDS GEORGE (decisions, not code)

1. **WhatsApp number routing.** SeoLanding routes all programmatic pages' WhatsApp to the US line (`17867988798`) while the FAB uses Athens (`306970380999`). Split by template accident, not audience logic. Pick one rule.
2. **Primary CTA on commercial pages:** quiz (`/yacht-finder`) vs "Brief George" (direct human). For UHNW, human path likely converts better and matches the "no AI proposals" thesis.
3. **Reconcile two review sources:** `/reviews` reads static `lib/reviewsData.js` (4) while homepage Service schema computes AggregateRating from Sanity. Divergent counts = rich-result risk. Pick the canonical 3.
4. **Rate-card numbers** for the Athens-cost + named-island cost paragraphs (#2, #6). No estimates.
5. **New authority pages** (`/yacht-charter-mykonos`, `/yacht-charter-santorini` head pages; Dodecanese/Sporades full itineraries; "how to vet a charter broker"). Real copy + real fleet photos, one distinct fact each.
6. **Off-site (the real ceiling):** post the 4 drafts in `docs/off-site-drafts/`; execute the Wikidata QuickStatements; grow Google reviews from 3 toward 8-10. Highest leverage of anything here.

---

## Levers not previously considered (ranked)

1. **LinkedIn Pulse as an AI-citation engine** (LinkedIn is #2 most-cited domain in AI answers; Pulse takes 72% of its citations). Reformat 3 strongest live assets as Pulse posts from George's profile, one per ~10 days, each with one deep link.
2. **Google Knowledge Panel claim** (from Wikidata + consistent profiles + mentions). First step: add all social handles to `Organization.sameAs`, make the title byte-identical across profiles, then claim.
3. **Virtuoso / luxury-advisor B2B distribution** (most UHNW charters book through advisors/family-office concierges; George has zero B2B feeder). A `/for-advisors` page + 5-10 conversations.
4. **WhatsApp Business Platform API** (not click-to-chat): 72h window + instant human-handoff acknowledgement wired into GY Command. Avoid paid Click-to-WhatsApp ads.
5. **Bing Webmaster Tools + verify IndexNow fires** (free AI Performance report shows which URLs Copilot cites).
6. **Stat-led "citation magnet" micro-reports** from the Index data (statistics lift AI citation ~4.5x). One 300-word note/month, number in the first sentence, George-verified.
7. **Pinterest top-of-funnel** using existing approved fleet imagery, deep-linked to itineraries.

---

## Honest reality check

- **Winnable in days (on-page):** the title/dash fixes (shipped), schema additions, the two GSC page-2 queries (#1, #2) move within weeks because the page already sits at position 12-16.
- **Winnable in weeks-months (needs George):** named-island/combo pages (the proven flank), reviews 3->10, Wikidata/Knowledge Panel, LinkedIn footprint.
- **NOT winnable, do not waste effort:** bare head terms ("luxury yacht charter greece", "yacht charter mykonos/santorini", "superyacht charter greece"). Aggregator-owned, partly the wrong buyer. The "best company" listicle SERP is an off-site placement game.
- **De-prioritize:** ChatGPT Shopping / Perplexity merchant feeds (built for shippable SKUs, not bespoke charters); more permutation pages on the dense motor/duration cluster (cannibalization); chasing FAQ rich results (deprecated by Google May 2026, keep the markup for AI/Bing but do not build for the dead dropdown).
