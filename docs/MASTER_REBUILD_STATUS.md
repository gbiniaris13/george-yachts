# Master Rebuild — Final Status (May 2026)

This file tracks the implementation status of every item in
`ROBERTO_BRIEF_georgeyachts_MASTER_REBUILD.md` after the autonomous
push that closed the rebuild on **2026-05-04**.

Status keys:
- ✅ **DONE** — shipped to production, verified live
- 🟡 **CODE DONE — AWAITS CONTENT** — code path is live; content
  population is George's task (Sanity edits, real photos,
  Matterport scans, etc.)
- 🟡 **CODE DONE — AWAITS ENV VAR** — code path is live; activates
  when George adds an env var in Vercel
- ⚪ **EXPLICITLY DEFERRED** — brief flagged this as "future" or
  "low priority — not now"

---

## Section 0 — Identity guardrails

| Item | Status | Notes |
|---|---|---|
| 0.1 Managing Broker (no Founder/Owner/CEO) | ✅ | Audit confirms zero violations sitewide |
| 0.2 IYBA Member, MYBA-standard contracts (no "MYBA Member") | ✅ | Audit confirms |
| 0.3 No years/charter counts in copy | ✅ | Audit confirms |
| 0.4 No fabricated testimonials | ✅ | Broker testimonials labeled as "industry partners" |
| 0.5 No real-time availability calendar | ✅ | Confirmed absent |
| 0.6 Hero video stays as-is | ✅ | Not touched |
| 0.7 Pricing display — per-yacht / per-person separation | ✅ | `priceModel` deployed on 66/66 yachts; PriceBlock + sortAllFleet enforce |
| 0.8 Trust signals copy | ✅ | HomeStats, Footer, FAQ all aligned |

## Section A — Sitewide

| Item | Status | Notes |
|---|---|---|
| A.1 Stat counters zero-render fix | ✅ | HomeStats hardcoded values, SSR-safe |
| A.2 Search bar in primary nav | ✅ | NavSearch.jsx with debounced GROQ |
| A.3 Slug & redirect cleanup | ✅ | next.config.mjs redirects + sitemap clean |
| A.4 Forbes feature badge sitewide | ✅ | ForbesTopBar live with addendum-v2 mods |
| A.5 Press strip near footer | ✅ | PressStrip.jsx in Footer |
| A.6 Breadcrumb navigation | ✅ | BreadcrumbSchema on all key routes (incl. island, cluster, privacy/delete) |
| A.7 Microsoft Clarity install | ✅ | MicrosoftClarity.jsx with NEXT_PUBLIC_CLARITY_ID |
| A.8 Anti-fraud notice in footer | ✅ | "A note on payments" block live |
| A.9 Font reduction 4 → 2 | ✅ | Cormorant + Montserrat only |
| A.10 Bailout-to-CSR fixes | ✅ | `ssr: false` removed previously, components SSR + hydrate |
| A.11 Image opt (Sanity URL params) | ✅ | sanityCardImg/sanityHeroImg helpers used everywhere |
| A.12 Sticky mini-nav covers titles | ✅ | scroll-margin-top: 140px in globals.css |
| A.13 Text contrast pass | ✅ | All visible text ≥ /65 opacity |
| A.14 Entry animations — drop opacity dip | ✅ | Fleet cards + HomeStats both at opacity 0.5 / 280ms / 50ms stagger |

## Section B — Homepage

| Item | Status | Notes |
|---|---|---|
| B.1 Hero rebuild — utility above fold | ✅ | VideoSection with new copy + CTA hierarchy |
| B.2 Smart Match Quiz (5 questions) | ✅ | YachtFinderQuiz.jsx live at /yacht-finder |
| B.3 "This Week's Selection" carousel | ✅ | TrendingYachts with unit badges |
| B.4 Filotimo section sharper | ✅ | Filotimon.jsx 3-pillar editorial spread |
| B.5 Signature Yacht — fix truncated quote | ✅ | cleanTruncate + George quote attribution |
| B.6 Blog teaser block on homepage | ✅ | HomeJournalTeaser with 3 most-recent posts |
| B.7 Mobile sticky bottom CTA — re-copy | ✅ | StickyFleetCTA cleaned of emoji |

## Section C — Fleet listing

| Item | Status | Notes |
|---|---|---|
| C.1 3-column grid at ≥1280px | ✅ | fleet-page.css `repeat(3, 1fr)` |
| C.2 Eager-load top 6 cards | ✅ | `loading={index < 6 ? 'eager' : 'lazy'}` |
| C.3 Pricing display — strict per-yacht/per-person | ✅ | sortAllFleet + PriceBlock |
| C.4 Hover preview — 3-photo cycle | ✅ | gy-card-cycle CSS animation, focus-within for mobile |
| C.5 Sticky filter bar | ✅ | fleet-filters--compact compact mode |
| C.6 Filter expansion — refit/toys/master deck/speed | ✅ | All 4 filters wired + reset |
| C.7 Saved view chips | ✅ | Preset filter pills with URL bookmarks |
| C.8 Express inquiry per card | ✅ | ExpressInquiryModal inline on each card |

## Section D — Yacht detail

| Item | Status | Notes |
|---|---|---|
| D.1 Page reorder — utility above poetry | ✅ | YachtPageContent layout reordered |
| D.2 Sticky Inquire CTA | ✅ | stickyVisible state in YachtPageContent |
| D.3 Photo gallery (Swiper + lightbox) | ✅ | Lightbox.jsx with `yacht_gallery_opened` event |
| D.4 Express inquiry modal | ✅ | ExpressInquiryModal with reCAPTCHA hardening |
| D.5 Interactive deck plans | 🟡 | Code shipped (tabbed view + hotspot modal). Awaits deck plan illustrations + cabin photos uploaded to Sanity for ChristAl MiO + La Pellegrina (per brief acceptance) |
| D.6 Matterport 360° tours | 🟡 | Code shipped (click-to-load embed). Awaits George commissioning Matterport scans (~€800-1,200 each, top-15 yachts per brief) and pasting URLs into Sanity |
| D.7 Sample 7-day itinerary | ✅ | 10 yachts seeded (Genny, Above & Beyond, La Pellegrina 1, Majesty of Greece, My Angel, Perseids, Madicon, Fo's, Kos 52, Alia). SVG mini-map + "Build a fully custom itinerary →" CTA |
| D.8 Crew profiles row | ✅ | Hover-only bio + closing caption. Photos remain editor-driven |

## Section E — Inquiry & funnel

| Item | Status | Notes |
|---|---|---|
| E.1 Reroute /yacht-finder, /inquiry, /cost-calculator | ✅ | All three live as their proper destinations |
| E.2 Telegram notifications for every inquiry | ✅ | sendTelegram wired across all inquiry endpoints |
| E.3 Real cost calculator at /cost-calculator | ✅ | Interactive UI with N.1 events + "Get exact pricing →" CTA to quiz |

## Section F — Blog → yacht funnel

| Item | Status | Notes |
|---|---|---|
| F.1 "Yachts to consider" block on every blog post | ✅ | BlogPostFooter + slug-deterministic fallback so every post shows the section |
| F.2 Blog author bio block | ✅ | BlogPostFooter renders George's identity-rule-compliant bio |
| F.3 Inline yachtCallout + Forbes citation blocks | ✅ | RichTextComponents renderers + Sanity schema both live |
| F.4 Topic-cluster landing pages | ✅ | 7 clusters at /journal/[cluster] (cyclades-charters, saronic-charters, family-yachting, first-time-charterers, yacht-charter-pricing, geopolitics-and-2026, choosing-a-yacht) |

## Section G — Destination landing pages

| Item | Status | Notes |
|---|---|---|
| G.1 Per-island landing pages | ✅ | 5 pages live: /yacht-charter-mykonos, -santorini, -paros, -corfu, -hydra. Place + FAQPage + BreadcrumbList JSON-LD each |

## Section H — AI Concierge

| Item | Status | Notes |
|---|---|---|
| H.1 "Ask George" widget | 🟡 | Code shipped (API + widget + Telegram follow-up + KV rate limit + conversation log). Awaits 3 Vercel env vars: `AI_API_KEY`, `AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`, `AI_MODEL=gemini-2.5-flash`. Without them the widget shows a graceful fallback ("write to George at /inquiry") |

## Section I — Team page

| Item | Status | Notes |
|---|---|---|
| I.1 Sweep & sanitize | ✅ | Nemesis removed, no founder/owner/CEO labels |
| I.2 George's profile photo | 🟡 | Awaits real golden-hour candid photo from Boss |
| I.3 Team contact fields | 🟡 | Email + LinkedIn fields wired into card UI. George's are populated; other 5 members empty placeholders awaiting Boss confirmation (especially George Katrantzos public business email per brief) |

## Section J — Partners

| Item | Status | Notes |
|---|---|---|
| J.1 Open the partners landing | ✅ | Gate removed by default, 5-question FAQ added, Calendly link prominent |
| J.2 Partner dashboard | ⚪ | Brief: future feature, not now |

## Section K — Favorites

| Item | Status | Notes |
|---|---|---|
| K.1 Email capture after 2+ favorites | ✅ | FavoritesEmailPrompt with frequency rules |
| K.2 "Send my shortlist to George" button | ✅ | FavoritesContent + Telegram fire on submit |

## Section L — Itinerary builder

| Item | Status | Notes |
|---|---|---|
| L.1 phase 1 SSR + interactive map + save flow | ✅ | Save modal + /api/itinerary-save (Telegram + email confirmation) on existing SVG map |
| L.1 phase 2 Mapbox GL upgrade | 🟡 | Code shipped (MapboxRouteMap.jsx). Activates when `NEXT_PUBLIC_MAPBOX_TOKEN` is set in Vercel; SVG fallback unchanged |
| L.2 3D map toggle | 🟡 | 2D ⇄ 3D toggle with Mapbox terrain DEM + sky atmosphere. Same env-var dependency as L.1.2 |

## Section M — Multi-currency

| Item | Status | Notes |
|---|---|---|
| M.1 Currency switcher €/$/£ | ⚪ | Brief: explicitly deferred, "not in this round per Boss directive" |

## Section N — Analytics

| Item | Status | Notes |
|---|---|---|
| N.1 GA4 custom events (full instrumentation) | ✅ | All 23 brief-specified events wired with brief-correct names |
| N.2 Microsoft Clarity heatmaps | ✅ | Already covered by A.7 |
| N.3 Weekly KPI dashboard | ✅ + 🟡 | Looker Studio is George's task. Code: KV-counter system + `/api/admin/kpis` auth-gated endpoint + `/admin/kpis` sparkline page. Awaits `KPI_ADMIN_KEY` env var to activate |

## Section O — Security & trust

| Item | Status | Notes |
|---|---|---|
| O.1 reCAPTCHA timing audit | ✅ | Express inquiry now polls grecaptcha for 4s + blocks submit with friendly error if absent |
| O.2 GDPR compliance reinforcement | ✅ | Footer data-residency line + /privacy/delete page + /api/privacy-deletion (Telegram + confirmation email) |

## Section P — Design polish

| Item | Status | Notes |
|---|---|---|
| P.1 Cinematic hover effects sitewide | ✅ | Button scale + gold glow, gold focus rings, draw-from-left underline on .prose links |
| P.2 Skeleton loading states | ✅ | Verified clean — no "Loading…" text or spinners; fleet card already has skeleton |
| P.3 Slow-cinema video styling | ✅ | .gy-film-grain SVG-data-URI overlay on hero video at 6% opacity, mix-blend overlay |
| P.4 Custom cursor labels audit | ✅ | All 18 data-cursor labels are meaningful action verbs, no generic "Click" |

## Section Q — Smart Proposal Generator

| Item | Status | Notes |
|---|---|---|
| Q.1 Pick up to 5 yachts, generate PDF | ✅ | Multi-select grid + sticky bottom CTA + form modal + @react-pdf/renderer template + Resend email with attachment + Telegram. Activates fully when RESEND_API_KEY is set (already configured for newsletters); without it the PDF still downloads, only email step no-ops |

## Section R — Internationalization

| Item | Status | Notes |
|---|---|---|
| R.* | ⚪ | Brief: "EN-only for now per Boss directive" |

## Section S — Success metrics

Measurement targets — not actions. Track via GA4 + the new
`/admin/kpis` endpoint.

---

## Activation env vars George needs to add to Vercel

| Env var | Activates | Required for |
|---|---|---|
| `AI_API_KEY` | Ask George AI Concierge | H.1 |
| `AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai` | Ask George AI Concierge | H.1 |
| `AI_MODEL=gemini-2.5-flash` | Ask George AI Concierge | H.1 |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL upgrade + 3D toggle | L.1.2 + L.2 |
| `KPI_ADMIN_KEY` | Internal KPI dashboard | N.3 |
| `RESEND_API_KEY` | Already set (newsletter) | Q.1 email + O.2 confirmation |

## Content tasks George needs to action

1. **D.5** — Upload deck-plan illustrations + cabin photos to Sanity for ChristAl MiO + La Pellegrina (brief acceptance target)
2. **D.6** — Commission Matterport scans (€800-1,200 each, top-15 yachts) and paste URLs into Sanity
3. **I.2** — Provide one canonical golden-hour candid portrait
4. **I.3** — Confirm + populate public business emails for 5 team members (especially George Katrantzos per brief)
5. **D.7 / D.8** — Continue seeding itineraries + crew profiles for the remaining 56 yachts (10 seeded, no acceptance gap; quality lift only)
6. **N.3** — Connect Looker Studio to GA4 (free) for the canonical Monday review
