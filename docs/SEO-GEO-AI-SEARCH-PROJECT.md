# George Yachts - SEO / GEO / AI-Search Project

**The complete, verified record of every search-visibility system that is live on georgeyachts.com.**

Last compiled: 2026-06-10. Everything below was confirmed by reading the actual code in `~/Projects/george-yachts`, not from memory. Where something is built but not yet switched on, it is marked clearly so nothing here overstates what is active.

Three terms, so the rest of the document reads cleanly:

- **SEO** (Search Engine Optimization) - being found and ranked by Google / Bing.
- **GEO** (Generative Engine Optimization) - being read, understood, and cited by AI engines (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews).
- **AI-Search** - the live citation outcome of GEO: an AI naming George Yachts in its answer (this is already happening - a client found George via ChatGPT in June 2026).

---

## Table of contents

1. [The big picture](#1-the-big-picture)
2. [Technical SEO infrastructure](#2-technical-seo-infrastructure)
3. [Structured data (JSON-LD) - the machine-readable identity](#3-structured-data-json-ld)
4. [GEO / AI-search specific systems](#4-geo--ai-search-specific-systems)
5. [The programmatic SEO page engine](#5-the-programmatic-seo-page-engine)
6. [Content, internal linking, and freshness](#6-content-internal-linking-and-freshness)
7. [E-E-A-T and authority signals](#7-e-e-a-t-and-authority-signals)
8. [Local SEO / NAP](#8-local-seo--nap)
9. [Analytics and measurement](#9-analytics-and-measurement)
10. [Off-site and verification](#10-off-site-and-verification)
11. [Live vs pending - honest status table](#11-live-vs-pending-status)
12. [Known minor inconsistencies / cleanup candidates](#12-known-minor-cleanup-candidates)
13. [Maintenance playbook](#13-maintenance-playbook)
14. [File reference index](#14-file-reference-index)

---

## 1. The big picture

The site is a Next.js 15 App Router application backed by Sanity CMS, deployed on Vercel. Search visibility is built in three stacked layers:

1. **Technical SEO** - the plumbing every search engine reads: metadata, sitemap, robots, canonicals, redirects, security headers, fast images.
2. **Structured data (JSON-LD)** - a hidden machine-readable description of who George Yachts is, what it sells, and who works there. This is what lets Google build a Knowledge Graph entity and what AI engines parse to cite the brand.
3. **GEO / AI-search** - systems built specifically so AI engines prefer to cite George Yachts: an `llms.txt` manifest, plain-text markdown mirrors of every page, a dedicated AI-research page, original data (the Greek Charter Index), a glossary of defined terms, and explicit permission for AI crawlers.

On top of those three layers sits a **large programmatic content engine**: ~245 hand-curated and templated landing pages generated from data files, plus all the Sanity-driven yacht and blog pages.

---

## 2. Technical SEO infrastructure

### 2.1 Site-wide metadata - `app/layout.jsx`

Every page inherits a complete metadata baseline so no crawler ever receives a blank tag:

- `metadataBase`: `https://georgeyachts.com`
- Title template: `"%s | George Yachts"`, default `"George Yachts | Featured in Forbes · Luxury Yacht Charter Greece"`
- Default description, application name, author (George P. Biniaris), 11 seed keywords
- Open Graph block (type, siteName, locale, url, title, description, 1200x630 image)
- Twitter card (`summary_large_image`) - title/description/image intentionally omitted at layout level so each page's dynamic OG image flows through instead of the homepage banner
- `robots`: index + follow, with `googleBot` set to `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`
- Canonical: `https://georgeyachts.com`
- RSS alternate: `/feed.xml`
- Icons: `/icon.svg` (gold "G") + `/apple-icon.png` (180x180)
- Viewport + theme color (`#0D1B2A`)

### 2.2 Per-page metadata helper - `lib/pageMeta.js`

Created after an Ahrefs crawl found 95 pages with incomplete Open Graph tags and 19 with og:url not matching canonical (static pages were inheriting the homepage OG). `pageMeta({ title, description, path, image? })` returns a complete, consistent Metadata object so canonical, og:url, og:title, twitter card, and OG image fallback can never drift per page.

### 2.3 Sitemap - `app/sitemap.js`

A single canonical `/sitemap.xml` (the old 5-sitemap split was collapsed after Ahrefs flagged 240 "page in multiple sitemaps" warnings). It emits:

- 57 static routes (core, conversion, tools, services, company, legal) with tuned `priority` + `changeFrequency`
- All programmatic families (see section 5) pulled from the `lib/*Seo.js` data files
- Blog posts and yacht detail pages fetched live from Sanity (excludes drafts + retired slugs)
- The Greek Charter Index (`/greek-charter-index-2026`) - always included
- `lastModified` for every static/programmatic entry comes from `lib/contentFreshness.js` (see 6.3) so sitemap dates and JSON-LD `dateModified` can never disagree
- Per-entry hreflang alternates were deliberately **removed** (see 2.6)

### 2.4 Robots - `app/robots.js`

- Wildcard `*`: allow `/`, disallow `/_next/`, `/api/`, `/admin`, `/studio`, `/island/`
- **15 AI crawlers explicitly allowed** on the public surface (the heart of the GEO strategy): `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `anthropic-ai`, `Claude-Web`, `ClaudeBot`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `FacebookBot`, `Amazonbot`, `CCBot`, `cohere-ai`, `Diffbot` - each carries its own admin/api disallow (RFC 9309: a bot matched to a specific block ignores the wildcard block)
- `Bytespider` (ByteDance) blocked entirely - consumes crawl budget without driving citations
- Single sitemap reference + host

### 2.5 Redirects - `next.config.mjs`

~17 redirects protecting link equity and canonical structure:
- Typo/legacy catches: `/yacht-charter`, `/charter-yacht`, `/yachts-charter`, `/yachts` -> `/charter-yacht-greece`
- `/charter-yacht-greece/[slug]` -> `/yachts/[slug]` (canonical yacht detail)
- `/aviation-charter` -> `/private-jet-charter`
- Region canonicalization: `/yacht-charter/{cyclades,ionian,saronic}` -> `/destinations/{region}` (kills duplicate-content)
- `/destinations` -> `/#destinations`; `/destinations/sporades` -> `/yacht-charter-skiathos`
- Retired/ghost slugs -> `/blog` (only `last-cabin-standing` remains retired; `oil-spike` + `dubai-exodus` were un-retired 2026-06-04)
- `/power-catamaran-charter-greece` -> `/best-motor-yachts-greece-speed`

### 2.6 Internationalization / hreflang - intentionally OFF

The WebSite schema declares `inLanguage: ["en","el","ar","ru","he"]`, but **hreflang alternates are deliberately not emitted**. i18n is client-side only (`?lang=xx` swaps content but shares the bare URL's canonical), so declaring those as hreflang alternates mis-signalled to Google - Ahrefs flagged 37 "hreflang to non-canonical" + 15 "missing reciprocal hreflang" criticals. English is declared as the single canonical. Re-introduce hreflang only if the site moves to directory-based locales (`/el/...`, `/ru/...`).

### 2.7 Security + crawl headers - `next.config.mjs`

`X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, tight `Permissions-Policy`, a full `Content-Security-Policy`, and `Strict-Transport-Security` (HSTS preload). `/admin/*` and `/api/admin/*` get `X-Robots-Tag: noindex, nofollow` at the CDN layer as a belt-and-braces fallback to robots.txt.

### 2.8 Performance / Core Web Vitals

- `next/image` with AVIF + WebP, Sanity/Pexels/Unsplash whitelisted
- Preconnect hints for FontShare, Sanity CDN, Pexels, Unsplash (shaves 150-300 ms off first image/font fetch)
- All fonts are free-tier (Fraunces via next/font, Sentient/General Sans/Switzer via FontShare) - no paid-font payload
- `optimizeCss` experiment, `removeConsole` in production, `poweredByHeader: false`

---

## 3. Structured data (JSON-LD)

This is the layer that makes the brand a machine-readable *entity* rather than just a web page. Rendered via the reusable `app/components/JsonLd.jsx`.

### 3.1 The site-wide `@graph` - `app/layout.jsx`

Organization + Service + WebSite are consolidated into **one connected `@graph` node** with a single shared `@context`. Their `@id`s cross-reference each other, so Google and AI engines read one connected knowledge graph instead of three fragmented objects. Per-page schemas (FAQPage, Article, Product, BreadcrumbList, etc.) intentionally stay as their own blocks because they are page-specific.

### 3.2 Organization / LocalBusiness / TravelAgency - `lib/organizationSchema.js`

`@id: /#organization` (the canonical entity every other schema points to - all 26 references unified to the trailing-slash form). Includes: triple type, name, slogan, description, logo, foundingDate, NAICS `561520`, founder + employee (cross-referenced to the `/about` Person), areaServed, IYBA membership, three phone numbers + contactPoints (GR/GB/US), full Kifisia NAP address + geo, `legalName`, `hasOfferCatalog` (Private + Explorer offers with price spec), opening hours, knowsAbout, and `subjectOf` -> the Forbes feature. `aggregateRating` is intentionally OMITTED until real reviews exist (no fabrication).

### 3.3 Service + WebSite - `lib/serviceSchema.js`

- **Service** (`@id: /#service`): name, 6 alternateNames, serviceType, areaServed (10 places), audience (UHNW), two structured Offers (Explorer per-guest, Private per-yacht price spec), isRelatedTo links to adjacent services. `getServiceSchemaWithReviews()` attaches `AggregateRating` automatically once 3+ real Sanity reviews exist.
- **WebSite** (`@id: /#website`): `dateModified` (from contentFreshness), inLanguage, publisher, and a `SearchAction` (`potentialAction`) that unlocks the Google SERP sitelinks search box.

### 3.4 Person / E-E-A-T - `lib/teamSchema.js`

Per-team-member Person records. George's record: jobTitle "Founder and Managing Broker", 13 `knowsAbout` topics, `sameAs` (LinkedIn personal + company, Wikidata `Q140078221`, Forbes, Instagram, the `/about` author page), languages, IYBA membership, O*NET occupation code, `subjectOf` Forbes, nationality, Kifisia workLocation, and Forbes feature as an `award`. Also embeddable as the structured `author` on every blog post.

### 3.5 The full schema-type inventory (verified in code)

Types currently emitted across `lib/` + components (and per-page route files add more inline):

`Organization`, `LocalBusiness`, `TravelAgency`, `Service`, `WebSite`, `WebPage`, `Person`, `Article`, `NewsArticle`, `CreativeWork`, `FAQPage` (+ `Question` / `Answer`), `BreadcrumbList` (+ `ListItem`), `Product`, `Offer`, `AggregateOffer`, `AggregateRating`, `OfferCatalog`, `PriceSpecification`, `UnitPriceSpecification`, `Dataset`, `Report`, `DefinedTerm` + `DefinedTermSet` (glossary), `TouristDestination`, `TouristTrip`, `TouristAttraction`, `ItemList`, `CollectionPage`, `SpeakableSpecification`, `SearchAction` + `EntryPoint`, `Occupation`, `Audience`, `OpeningHoursSpecification`, `GeoCoordinates`, `PostalAddress`, `ContactPoint`, `Place`, `Country`, `ImageObject`, `QuantitativeValue`, `Thing`.

### 3.6 Supporting schema builders

- `lib/faqSchema.js` - FAQPage + speakable
- `lib/articleSchema.js` - Article/NewsArticle for editorial + programmatic pages
- `app/components/BreadcrumbSchema.jsx` + `Breadcrumbs.jsx` / `PageBreadcrumb.jsx` - BreadcrumbList everywhere
- `lib/charterIndex2026.js` - Dataset (the Greek Charter Index, section 4.5)
- Per-yacht pages emit Product/Offer with `extractPriceRange` (min/max) from `lib/pricing.js`

---

## 4. GEO / AI-search specific systems

These exist specifically so AI engines find, trust, and cite the brand.

### 4.1 `llms.txt` + `llms-full.txt` - `app/llms.txt/route.js`, `app/llms-full.txt/route.js`

The emerging "llms.txt" convention - an AI-consumer manifest at `/llms.txt`. Static canonical-context block (boutique broker, Greek waters, IYBA, George as Managing Broker, Forbes) plus a **dynamic appendix generated live from Sanity** listing every published blog post and curated yacht, so it stays current with zero manual edits. Also pulls glossary terms, destination comparisons, articles, and market reports. Revalidates hourly.

### 4.2 Plain-text markdown mirrors - `next.config.mjs` rewrites + `/api/markdown`

Any page is available as clean plain-text markdown at `/path/index.md` (and `/index.md` for home), routed to the `/api/markdown` handler via `lib/markdown-serializers.js`. Bots that want a stripped representation get one without parsing HTML.

### 4.3 AI crawler permissions

All 15 major AI crawlers are explicitly allowed in `robots.js` (section 2.4). This is the prerequisite for any AI citation - many sites accidentally block these.

### 4.4 AI-search hint meta + geo meta - `app/layout.jsx` `<head>`

- `geo.region`, `geo.placename`, `geo.position`, `ICBM` (anchor to Athens/Greece for local intent)
- `ai-content-declaration: human-authored`
- `ai-search-priority: yacht-charter-greece, ...` (non-standard hints some AI crawlers parse)
- `/ai-research` page (sitemap priority 0.92) - a single-source-of-truth page engineered for ChatGPT/Perplexity/Claude/Gemini/Bing AI to cite, with direct first-paragraph answers and per-section deep links

### 4.5 Original data: the Greek Charter Index 2026 - `lib/charterIndex2026.js` + `app/greek-charter-index-2026/page.jsx`

George's own market data (rate table by yacht-type x region with "(est.)" flags, booking lead-time, in-demand islands, APA/VAT/fuel/TEPAI budgeting, stat callouts, methodology, FAQs), presented as George Yachts authority with **no external sources or competitors named**. Emits `Dataset` + `FAQPage` schema. This is the single strongest AI-citation magnet on the site - AI engines preferentially cite original, structured, primary data. A published Sanity `dataReport` doc can override the JS default for future Studio editing; the JS data ships live regardless.

### 4.6 Glossary of defined terms - `app/glossary/` + `lib/glossarySeo.js`

37 definition pages + a hub, each emitting `DefinedTerm` / `DefinedTermSet` schema. LLMs cite DefinedTerm pages preferentially for "what is X" queries (APA, MYBA, TEPAI, etc.).

### 4.7 Speakable + market reports

`SpeakableSpecification` is attached on FAQ/island content for voice-assistant extraction. The market-reports family (`/market-reports` hub + quarterly reports) is original-research content - a high-value GEO citation surface.

### 4.8 IndexNow + instant reindex - `app/api/indexnow/route.js`, `app/api/reindex/route.js`

- **IndexNow**: free instant-reindex standard (Bing, Yandex, Seznam, Naver; a signal to Google). One POST notifies all of them. Verification key file at `public/00828e97c23b40259c163410fd1b83b1.txt`. Secured by `INDEXNOW_AUTH_TOKEN`.
- **/api/reindex**: Sanity webhook (HMAC-verified) -> `revalidatePath`/`revalidateTag` + an IndexNow ping, so publishing in Sanity refreshes the cache and pings search engines within minutes.

### 4.9 Dynamic Open Graph images - `app/opengraph-image.jsx` + `/api/og`

Per-page social share images generated dynamically (`/api/og?title=...&eyebrow=...`) so every page shares with its own branded card, not the homepage banner.

---

## 5. The programmatic SEO page engine

The site's scale comes from a data-driven architecture: each `lib/*Seo.js` file is an array of page definitions, rendered by a matching component in `app/components/seo/` and auto-added to the sitemap. Verified counts (2026-06-10):

| Family | Count | URL pattern | Data file |
|---|---|---|---|
| Island landing pages | 26 | `/yacht-charter-{island}` | `lib/islands.js` |
| Duration pages | 40 | 10 destinations x 4 durations | `lib/durationSeo.js` |
| Glossary terms | 37 | `/glossary/{term}` | `lib/glossarySeo.js` |
| Yacht-type x destination combos | 28 | various | `lib/comboSeo.js` |
| Bottom-funnel commercial pages | 20 | various | `lib/bottomFunnelSeo.js` |
| GEO reference articles | 15 | various | `lib/articleSeo.js` |
| Use-case pages | 14 | various | `lib/useCaseSeo.js` |
| Best-yachts-for-X pages | 10 | various | `lib/bestYachtsSeo.js` |
| Long-tail pages | 10 | various | `lib/longTailSeo.js` |
| Comparison pages | 8 | various | `lib/comparisonSeo.js` |
| Yacht-type pages | 8 | various | `lib/yachtTypeSeo.js` |
| Journal topic clusters | 7 | `/journal/{cluster}` | `lib/journal-clusters.js` |
| Island anchorage spokes | 5 | various | `lib/islandAnchoragesSeo.js` |
| Destination comparison pages | 5 | various | `lib/destinationComparisonSeo.js` |
| Market reports | 3 (+ hub) | various | `lib/marketReportsSeo.js` |
| Linkable assets | 3 | various | `lib/linkableAssetSeo.js` |
| Hubs (CollectionPage + ItemList) | 4 | `/islands`, `/yacht-types`, `/best-yachts`, `/comparisons` | `app/components/seo/HubPage.jsx` |

Plus: 57 static routes, the Greek Charter Index, the glossary + market-reports hubs, and all Sanity-driven yacht detail pages (~63 fleet) and blog posts. **Roughly 245 curated/templated URLs in the sitemap before Sanity content is added on top.**

The matching renderers in `app/components/seo/`: `BestYachtsPage`, `BottomFunnelPage`, `DestinationComparison`, `GlossaryTerm`, `IslandAnchorages`, `MarketReport`, `SeoLanding`, `HubPage`, `BrowseSeoCategories`, `LastUpdated`.

---

## 6. Content, internal linking, and freshness

### 6.1 Auto-linking - `lib/auto-link-content.js`

`autoLinkPortableText(blocks, dynamicTerms)` turns yacht names (>=5 chars) in blog posts into links to `/yachts/{slug}`, plus a curated static term map. Spreads internal link equity and keeps readers on-site.

### 6.2 Internal link architecture - `lib/seoInternalLinks.js`

Centralized internal-linking helper feeding related-content modules across programmatic pages.

### 6.3 Freshness - `lib/contentFreshness.js`

Single source of truth for the "last meaningful edit" date of each content family (`LAST_REFRESH.*`) plus a computed `SITE_UPDATED`. Consumed by BOTH `sitemap.js` (lastmod) AND every page's JSON-LD `dateModified`, so they never diverge. The discipline is **honest freshness** - a date is bumped only when that family's content actually changes, never auto-stamped on build (a date that flips every deploy trains Google to distrust it). Sanity docs use their real `_updatedAt`.

---

## 7. E-E-A-T and authority signals

(Experience, Expertise, Authoritativeness, Trust - Google's quality framework, and what AI engines weight for source credibility.)

- **Forbes feature** (May 2026) - surfaced as `subjectOf` on Organization, `subjectOf` + `award` on George's Person, a sitewide non-dismissible `ForbesTopBar`, a `/press` page, and a `ForbesReferrerWelcome` card for `?ref=forbes` traffic
- **Person entity** for George with full `knowsAbout`, credentials, and a dedicated canonical authority page at `/about/george-p-biniaris` (higher sitemap priority than `/team/george-biniaris`)
- **IYBA membership** - referenced from Organization + Person
- **Wikidata entity** `Q140078221` - in `sameAs` (feeds Google Knowledge Graph + LLM training). Submission docs: `docs/wikidata-entity-submission.md`, `docs/wikidata-quickstatements.txt`
- **/credentials page** consolidating Forbes / IYBA / MYBA-standard / dual residency
- **Reviews** - `lib/reviewsAggregate.js` + `/reviews` page. `AggregateRating` (star ratings in SERP) is gated OFF until 3+ real reviews exist in Sanity - it switches on automatically with no code change (activation guide: `docs/gbp-reviews-activation.md`)

---

## 8. Local SEO / NAP

Consistent Name-Address-Phone across schema and content:
- **Address**: Charilaou Trikoupi 190A, Kifisia 14564, Attica, GR
- **Geo (schema)**: 38.0742, 23.8243
- **Phones**: +30 6970380999 (GR), +44 2037692707 (GB), +1 7867988798 (US) with per-country contactPoints
- **Opening hours**: Mon-Fri 09:00-18:00
- `hasMap`, `location` Place, `legalName` (Wyoming LLC disclosed separately so the Greek operational address carries the local-SEO signal)

> Action on George's side: ensure the Google Business Profile shows "Kifisia" so it reconciles with the NAP above.

---

## 9. Analytics and measurement

Mounted in `app/layout.jsx`:
- **Google Analytics 4** - `G-CM483Z0JT5` (active)
- **Microsoft Clarity** - session recordings + heatmaps (active, `MicrosoftClarity` component)
- **EnhancedAnalytics** - additive custom analytics (active)
- **PostHog** - product analytics, **inert until `NEXT_PUBLIC_POSTHOG_KEY` is set** in Vercel (free 1M events/mo)
- **VisitorIntelligence / VisitorBeacon / VisitorGreeting** - first-party visitor signals + IP-city greeting (Vercel geo headers, `lib/visitor-signals.js`, `lib/ip-enrich.js`)
- **Cookiebot** consent (CBID present) - GDPR banner
- AI-monitoring helpers exist in `lib/aiMonitoring.js`, `lib/ai-visibility.js`, `lib/haroMonitor.js`, `lib/competitorIntel.js`

> Gap / recommendation: **Google Search Console** is the one major free measurement tool not clearly verified in the metadata (Bing, Pinterest, Yandex are). Verifying GSC is the highest-value free next step - it shows which queries rank and which pages sit at positions 5-15 (the "one nudge from page one" set).

---

## 10. Off-site and verification

- **Bing Webmaster** - `msvalidate.01` meta + `public/BingSiteAuth.xml`
- **Pinterest** - `p:domain_verify` meta + `public/pinterest-90c23.html`
- **Yandex** - `public/yandex_ca7f0d2ae243a269.html`
- **TikTok** - `public/tiktokVxLKVy7tSVtM9Euz5Sklw7uT9qVnwzjK.txt`
- **IndexNow** - `public/00828e97c23b40259c163410fd1b83b1.txt`
- **Wikidata** - entity `Q140078221` (see section 7)
- Activation guides in `docs/`: `indexnow-activation.md`, `wikidata-entity-submission.md`, `gbp-reviews-activation.md`

---

## 11. Live vs pending status

| System | Status |
|---|---|
| Metadata baseline + per-page `pageMeta` | LIVE |
| Single canonical sitemap | LIVE |
| robots.txt + 15 AI crawlers allowed | LIVE |
| Redirects + security headers | LIVE |
| `@graph` entity consolidation | LIVE |
| Organization / Service / WebSite / Person schema | LIVE |
| Programmatic page families (~245) | LIVE |
| llms.txt + llms-full.txt | LIVE |
| Markdown mirrors (`/index.md`) | LIVE |
| Greek Charter Index (Dataset) | LIVE |
| Glossary DefinedTerm pages (37) | LIVE |
| IndexNow + Sanity reindex webhook | LIVE (needs env tokens set in Vercel) |
| Dynamic OG images | LIVE |
| GA4 + Microsoft Clarity + Cookiebot | LIVE |
| Forbes / IYBA / Wikidata authority signals | LIVE |
| **AggregateRating (SERP stars)** | GATED - switches on automatically at 3+ real reviews |
| **PostHog** | INERT - set `NEXT_PUBLIC_POSTHOG_KEY` to activate |
| **hreflang alternates** | OFF by design (client-side i18n) |
| **Google Search Console** | NOT verified - recommended next step |
| **Sanity `dataReport` schema** | built, not deployed (JS data ships instead) |

---

## 12. Known minor cleanup candidates

Honest small discrepancies found while compiling this - none are breaking, all are low priority:

1. **Geo coordinates mismatch**: the `<head>` geo meta tags in `app/layout.jsx` still use the older approximate `38.0833;23.8167` ("Athens"), while the Organization schema uses the precise Kifisia `38.0742;23.8243`. Worth unifying the meta tags to the precise pair.
2. **GSC verification**: no `google-site-verification` meta tag present (GA4 can serve as a GSC verification method, but GSC itself should be confirmed connected).
3. **Stale count comments**: several `lib/*Seo.js` header comments cite old entry counts (e.g. "13 combos", "30 glossary terms") that have since grown (28 combos, 37 terms). Cosmetic only - the arrays are the source of truth.

---

## 13. Maintenance playbook

How to keep this healthy without breaking anything (all local, free):

- **Add a programmatic page**: append an entry to the relevant `lib/*Seo.js` array - it auto-appears in the sitemap and renders via its `app/components/seo/` component. Then bump that family's date in `lib/contentFreshness.js`.
- **Refresh content**: when you actually edit a family's copy, bump only that family's `LAST_REFRESH.*` date. Do not mass-bump.
- **Update the Charter Index**: edit `lib/charterIndex2026.js` and bump its `dataModified`. Keep "(est.)" flags honest, no sources/competitors named.
- **New reviews**: once 3+ real reviews are in Sanity (`publishedOnSite:true`, rating 1-5), star ratings appear automatically - no code change.
- **After publishing in Sanity**: the reindex webhook revalidates + pings IndexNow automatically. For manual pages, you can POST to `/api/indexnow`.
- **Build locally, push only finished work** - Vercel build minutes are billed (see memory). Verify with a local `next build` + smoke test before any push.

---

## 14. File reference index

**Core infrastructure**
- `app/layout.jsx` - metadata baseline, `@graph`, geo + AI meta, analytics
- `app/sitemap.js` - single canonical sitemap
- `app/robots.js` - crawler rules + AI crawler allowlist
- `next.config.mjs` - redirects, rewrites, headers, image config
- `lib/pageMeta.js` - per-page metadata helper
- `lib/contentFreshness.js` - freshness single source of truth
- `app/components/JsonLd.jsx` - JSON-LD renderer

**Schema builders**
- `lib/organizationSchema.js`, `lib/serviceSchema.js`, `lib/teamSchema.js`, `lib/faqSchema.js`, `lib/articleSchema.js`, `lib/charterIndex2026.js`, `lib/pricing.js`, `lib/reviewsAggregate.js`
- `app/components/BreadcrumbSchema.jsx`, `Breadcrumbs.jsx`, `PageBreadcrumb.jsx`

**GEO / AI-search**
- `app/llms.txt/route.js`, `app/llms-full.txt/route.js`
- `app/api/markdown/`, `lib/markdown-serializers.js`
- `app/ai-research/`, `app/greek-charter-index-2026/page.jsx`
- `app/glossary/`, `lib/glossarySeo.js`
- `app/api/indexnow/route.js`, `app/api/reindex/route.js`
- `app/opengraph-image.jsx`, `app/api/og/`
- `lib/aiMonitoring.js`, `lib/ai-visibility.js`, `lib/haroMonitor.js`, `lib/competitorIntel.js`

**Programmatic SEO data + renderers**
- `lib/islandsSeo` family: `islands.js`, `durationSeo.js`, `glossarySeo.js`, `comboSeo.js`, `bottomFunnelSeo.js`, `articleSeo.js`, `useCaseSeo.js`, `bestYachtsSeo.js`, `longTailSeo.js`, `comparisonSeo.js`, `yachtTypeSeo.js`, `journal-clusters.js`, `islandAnchoragesSeo.js`, `destinationComparisonSeo.js`, `marketReportsSeo.js`, `linkableAssetSeo.js`
- `app/components/seo/*` renderers
- `lib/auto-link-content.js`, `lib/seoInternalLinks.js`

**Docs (related)**
- `docs/indexnow-activation.md`, `docs/wikidata-entity-submission.md`, `docs/wikidata-quickstatements.txt`, `docs/gbp-reviews-activation.md`

---

*Compiled from a direct read of the codebase. No data fabricated. Nothing here was pushed or changed by compiling this document - it is a read-only audit artifact.*
