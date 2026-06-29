# George Yachts - Live SEO / GEO / AI-Search Inventory

Date verified live: 28 June 2026
Domain: https://georgeyachts.com
Production deploy: 1da72ae (Vercel, READY)
Everything below was confirmed live on the production site, not from memory.

## How to use this file

Hand this to any AI/research assistant with a prompt like:
"This is everything currently live on georgeyachts.com for SEO, GEO and AI
search. Audit it against the best luxury yacht-charter sites in the world and
tell me, ranked by impact, what is missing to become the #1 AI-cited brand for
Greek motor-yacht charter. Separate on-site technical gaps from off-site
authority gaps."

## Snapshot

- Stack: Next.js 15 (App Router), Sanity CMS, hosted on Vercel (edge CDN, ISR).
- Public fleet: 63 yachts.
- Pages in sitemap: 391 (all server-rendered, AI-readable HTML, not JS-walled).
- Last content freshness stamp live: 2026-06-25.

---

## A. Technical SEO (live)

- Server-side rendering + ISR (incremental static regeneration). Pages served
  from Vercel edge CDN (verified: `x-vercel-cache: HIT`, region fra1), hourly
  revalidate so content stays fresh without rebuilds.
- `robots.txt`: live, per-bot rules, references the sitemap (see section C).
- `sitemap.xml`: live, 391 URLs, declared in robots.txt and Search Console.
- Canonical tags: on every page (self-referencing, absolute URLs).
- Meta titles + descriptions: unique per page, length-tuned for SERP rendering.
- Open Graph + Twitter Card tags: on every page.
- Image optimization: Next.js image pipeline in use (`/_next/image`), 774
  optimized image requests on the fleet page, lazy-loading on below-fold images.
- LCP / Core Web Vitals work: hero poster preloaded with high priority
  (`rel="preload" as="image"`); fixed a React hydration mismatch (#418) that was
  throwing on the fleet page.
- Security/quality headers: `x-content-type-options: nosniff`.
- Mobile: responsive; email popup disabled on mobile to avoid Google's
  intrusive-interstitial penalty.
- Internationalization: single-locale (English), targeting international
  English-speaking UHNW. No hreflang (deliberate, not an error).
- Redirects: retired-slug 307 map in next.config.mjs + sitemap exclusion, so
  dead URLs do not leak into the index.

---

## B. Structured data / schema.org (the "something on every page")

Every page carries JSON-LD structured data (4 to 8 blocks each). This is what
lets AI and search engines understand, trust, and quote the content. Types
confirmed live across the site:

### Site-wide (on every page via the root layout)
- `Organization` (name, logo, address in Kifisia, contact point, founder)
- `WebSite` (with `SearchAction` for sitelinks search box)
- `Service` (luxury crewed yacht charter) + `OfferCatalog`
- `AggregateRating` (5.0, 3 reviews) - gated to appear only with >=3 real reviews
- `ContactPoint`, `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification`
- `Person` (George P. Biniaris, founder/managing broker)
- `NewsArticle` reference to the Forbes feature

### Per page type
- Homepage: `FAQPage` (6 high-volume Q&A), `Offer`, `PriceSpecification`
- Fleet hub: `Product`, `Boat`, `AggregateOffer`, `ItemList`, `Brand`,
  `BreadcrumbList`
- Yacht detail (63 pages): `Product` + `Vehicle` + `Boat` triple type, `Offer`
  (price, currency, availability), `BreadcrumbList`
- Type / long-tail pages: `FAQPage`, `BreadcrumbList`, `SpeakableSpecification`
- Rate card + Charter Index: `Dataset` (AI reads pricing as a structured
  dataset), `FAQPage`
- Duration + itinerary pages: `TouristTrip` (the trip as a structured
  itinerary), `BreadcrumbList`, `FAQPage`
- Blog/journal (27 articles): `Article`, `WebPage`, `Person`, `Occupation`,
  `ImageObject`, `SpeakableSpecification`, `BreadcrumbList`
- Glossary (30 terms): `DefinedTerm` + `DefinedTermSet` (definitions AI cites)

### Freshness + commerce signals
- `dateModified` stamps for content freshness (live: 2026-06-25).
- `Offer` / `AggregateOffer` with price, currency and availability on
  fleet/yacht pages.

---

## C. GEO / AI-search specific (live)

This is the layer that makes the site readable and trusted by generative
engines (ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini).

### AI crawler access (robots.txt, all `Allow: /`)
Explicitly named and allowed: GPTBot, ChatGPT-User, OAI-SearchBot,
anthropic-ai, ClaudeBot, Claude-SearchBot, Claude-Web, PerplexityBot,
Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, FacebookBot,
Amazonbot, CCBot, cohere-ai, Diffbot.
Deliberately blocked: Bytespider (low-value aggressive scraper).
Disallowed paths for all: /_next/, /api/, /admin, /studio, /island/.

### AI plain-text feeds (the "read my whole site automatically" layer)
- `/llms.txt`: live. Identity summary (who, what, fleet, pricing range).
- `/llms-full.txt`: live. The ENTIRE site as one clean text file for AI:
  ~119,656 words / 7,715 lines, including all 34 journal articles, TEPAI,
  insurance, FAQs and pricing. An AI can ingest the whole site in one fetch.

### Extractability / answer-engine optimization
- Front-loaded "short answer" blocks at the top of money pages (AI lifts these
  into answer boxes).
- `SpeakableSpecification` marks the AI/voice-answerable passages.
- Question-style H2s + `FAQPage` Q&A pairs for direct answer extraction.
- `Dataset` schema on rate card + Charter Index so pricing is machine-parseable.
- AI citation reference page live at `/ai-research`.

### Entity / identity graph (so AI corroborates who you are)
`Organization.sameAs` links live: Instagram, LinkedIn (company + George
personal), IYBA membership page, and the Forbes 2026 feature article.

---

## D. Content / programmatic SEO (live page tiers)

391 pages generated from structured systems. Verified live counts from sitemap:

| Tier | Live count | Engine (lib/) |
|---|---|---|
| Yacht detail pages | 63 | Sanity yacht docs |
| Duration pages (3/7/10/14-day x destinations) | 41 | durationSeo.js |
| Glossary terms | 30 | glossarySeo.js |
| Blog / journal articles | 27 | articleSeo.js, Sanity |
| Use-case pages (birthday, family, honeymoon, corporate...) | 23 | useCaseSeo.js |
| Type pages (motor, sailing, catamaran, gulet, mega, luxury) | 21 | yachtTypeSeo.js |
| Comparison pages (X vs Y) | 19 | comparisonSeo.js, destinationComparisonSeo.js |
| Itinerary pages | 4 | signatureItineraries.js, touristTripSchema.js |
| Destination / region / combo / market-report / best-of / core | ~163 | comboSeo.js, marketReportsSeo.js, bestYachtsSeo.js, bottomFunnelSeo.js, islandAnchoragesSeo.js, longTailSeo.js |

### Money / conversion pages (the 2027 motor wedge)
- `/weekly-yacht-charter-rates-greece` - all-in rate card (base, APA, VAT 13%,
  gratuity) with `Dataset` schema.
- `/motor-yacht-charter-greece` - motor type pillar.
- `/greek-charter-index-2026` - proprietary market index with `Dataset`.
- Long-tails: running-costs/APA/fuel, Athens-Mykonos, motor-vs-catamaran.

### Supporting SEO/GEO engines in lib/
articleSchema, articleSeo, bestYachtsSeo, bottomFunnelSeo, charterIndex2026,
comboSeo, comparisonSeo, contentFreshness, destinationComparisonSeo,
durationSeo, faqSchema, glossarySeo, islandAnchoragesSeo, linkableAssetSeo,
longTailSeo, marketReportsSeo, organizationSchema, reviewsAggregate,
reviewsData, sample-itineraries, serviceSchema, signatureItineraries,
teamSchema, touristTripSchema, useCaseSeo, yachtTypeSeo, seoInternalLinks,
markdown-serializers.

---

## E. E-E-A-T / trust signals (live)

- Real Google reviews: 3 five-star reviews, visible on the homepage + emitted
  as `AggregateRating` (5.0). Gated so the rating only shows with >=3 reviews.
- Authority: IYBA Charter Active Member (linked), Forbes May 2026 feature
  (linked + `NewsArticle`).
- Authorship: named author (`Person` / founder George P. Biniaris) on articles.
- Locality: Kifisia, Athens (NAP consistent, Google Business Profile).
- No invented statistics: all copy uses only real, client-verified figures.
- Copy hygiene: em dashes (an AI-written "tell") removed from all public copy
  (1,418 instances across 183 files).

---

## F. Internal linking + conversion (live)

- Programmatic internal linking system (seoInternalLinks.js) connects the tiers
  (type -> duration -> destination -> yacht) for crawl depth and topical
  authority.
- Breadcrumb navigation + `BreadcrumbList` schema on all sub-pages.
- Conversion: one-tap WhatsApp (prefilled) + "personal reply within a few
  hours" promise on ~50 programmatic pages and the money pages; express inquiry
  modal + sticky enquiry on yacht pages; email-capture popup (8s / 40% scroll).

---

## G. Measurement (live)

- Google Analytics 4: live (G-CM483Z0JT5), with CTA click events
  (whatsapp, phone, email, brief) mirrored as GA4 events.
- Google Search Console: verified at property level.
- Google Business Profile: live (Kifisia).
- Note: AI-citation tracking (whether ChatGPT/Perplexity name the brand) is not
  yet measured with a standing prompt panel - see gaps.

---

## H. What is NOT done yet (honest gaps - point research here)

On-site technology is comprehensive. The remaining levers are mostly off-site,
which is where ranking and AI-citation dominance is actually won:

1. Off-site authority / earned mentions: PR wire releases, third-party
   features, and brand mentions on other sites (AI weights brand mentions
   heavily). Drafts exist in docs/off-site-drafts/ but are not yet posted.
2. Wikipedia / Wikidata entity: not yet created. Needs the full social handle
   set (Facebook, YouTube, TikTok still missing from the entity graph).
3. Review velocity: only 3 Google reviews live. More real reviews raise the
   AggregateRating weight and trust.
4. AI-citation baseline: no standing measurement of whether the brand is being
   named by ChatGPT/Perplexity/Google AI for target queries.
5. Phase 2 content: weekly-motor spoke pages, more destination gap pages
   (Milos, Spetses), Charter Index sub-views, a B2B advisor resource.
6. Optional on-site: per-page Markdown mirrors (currently covered by
   llms-full.txt instead); video schema; more `priceValidUntil` coverage.

---

## Appendix: full union of schema.org types live on the site

Organization, WebSite, Service, OfferCatalog, Offer, AggregateOffer,
PriceSpecification, UnitPriceSpecification, QuantitativeValue, AggregateRating,
Product, Vehicle, Boat, Brand, FAQPage, Question, Answer, BreadcrumbList,
ListItem, ItemList, Dataset, TouristTrip, Article, NewsArticle, WebPage,
Person, Occupation, ImageObject, DefinedTerm, DefinedTermSet,
SpeakableSpecification, ContactPoint, PostalAddress, GeoCoordinates, Place,
Country, AdministrativeArea, Audience, OpeningHoursSpecification, SearchAction,
EntryPoint.
