# George Yachts - GEO / AI-Search Master Plan to Jan 2027

**Owner goal:** from January 2027, a standing baseline of **10 qualified charter requests per month**, at **zero ad spend**, by owning AI-search / GEO / SEO leadership for Greek luxury (especially motor) yacht charter before the January booking wave.

**Context:** 2026 motor-yacht demand fell ~50-60% (war + fuel). Pent-up international demand is expected to land in 2027. We have ~6-7 months (late June 2026 -> Jan 2027) to become the cited authority.

Compiled 2026-06-26 from a Task 0 audit of the live codebase + 4 web-grounded research streams (GEO citation mechanics, 2026-2027 demand/queries, competitor gap, off-site authority + conversion). No data fabricated. This is the north-star plan; sister doc `SEO-GEO-AI-SEARCH-PROJECT.md` is the record of what is already live.

---

## The one insight that changes the plan

The site is already best-in-class on-page. **Another 1,000 owned pages would barely move the KPI.** The decisive 2026 finding: AI engines cite **earned, third-party, consensus signals** far more than owned pages.

- Brand mentions correlate with AI visibility ~**3x stronger than backlinks** (0.66 vs 0.22).
- Distributing the same content off-site lifts citations up to **~325%** vs publishing only on your own site.
- ChatGPT serves ~**69-82% earned-media** results (vs Google ~40%); luxury brands systematically **under-cite** because they lack editorial corroboration.
- A weaker competitor (**MyGreekCharter**) wins AI citations purely through free PR-wire distribution.

George holds the rarest assets in this niche that nobody else has: a **real Forbes May-2026 feature**, **IYBA membership**, and **proprietary Greek Charter Index data**, and is not yet syndicating them.

**So: shift weight from building pages to manufacturing off-site consensus** (Wikipedia/Wikidata entity, PR syndication, trade/advisor placements, authentic Reddit/Quora, review velocity) while shipping the small set of on-page levers that genuinely move citation.

---

## Positioning (the wedge)

The transparent, Forbes-recognized **motor-yacht cost authority** for Greek waters who publishes the one number nobody else will: the **true all-in weekly cost**. Aggregators bury rates inside 4,000 listings; competitors give hedged prose. George owns proprietary data + a real broker's voice, so he becomes the single **extractable, citable source of truth** on cost, fuel/APA economics, and itineraries. We do not fight the 2026 fuel narrative that crushed motor demand - we **own it** (model APA at 2026 Brent; motor vs sail vs catamaran honestly) so that when 2027 motor demand rebounds, George is already the cited authority anxious buyers are sent to.

We win the **AI-citation race**, not the head-term race owned by aggregators we cannot out-scale in six months.

---

## Strategic pillars

1. **Entity authority (the truth anchor)** [high] - enrich Wikidata Q140078221 + earn a Wikipedia footprint (Forbes + IYBA = notability). Compounds over ~90 days, so start now.
2. **Earned off-site consensus** [high] - the biggest gap to the KPI. Replicate MyGreekCharter's free PR-wire method with a genuinely stronger asset, plus trade/advisor placements and authentic Reddit/Quora.
3. **Motor-cost data moat** [high] - "weekly motor yacht charter Greece cost all-in" has no clean citable answer anywhere. Own it with a size-band x season all-in table + per-person readouts, powered by the Greek Charter Index.
4. **Itinerary extractability** [high] - TouristTrip + per-island TouristAttraction schema on ~42 itinerary pages (only 6 have it today) so itineraries are machine-extractable for "plan a 7-day Cyclades motor trip" prompts.
5. **Review velocity / E-E-A-T** [high] - 0 published reviews is the one thin axis. 3-5 real reviews/month flips the already-coded AggregateRating gate on honestly. George-only work; never fabricate.
6. **Conversion + capture** [medium] - founder-led discretion, fast WhatsApp response, Forbes/IYBA trust signals turn cited visits into the 10 requests. Response speed is the dominant high-ticket lever.
7. **Technical citation hygiene** [medium] - Claude-SearchBot allow, .md noindex, one VAT figure, Offer.validThrough, front-loaded answers. Small, high-certainty, outsized downside if missed.

---

## Roadmap (sequenced to the Jan-Mar 2027 wave)

### Phase 0 - Citation hygiene + entity foundation (late June - mid July) [both]
Remove every crawler/fact-check blocker; start the ~90-day compounding clock now.
- [DONE] Add `Claude-SearchBot` to `app/robots.js`.
- [DONE] Noindex the `/path/index.md` mirrors (X-Robots-Tag in the markdown route; still crawlable for AI).
- [DONE] Add `Offer.validThrough` + `priceValidUntil` to yacht pages (rolling season-end date).
- [BLOCKED on George] Standardize VAT to a single sourced figure across ~70 instances (kill the 12% vs 13% hedges). George confirms the figure + legal basis first.
- Front-load 40-60 word extractable answer blocks + dated "Last updated" line on the top pages (`/motor-yacht-charter-greece`, `/greek-charter-index-2026`, top itineraries); convert key H2/H3 to question form.
- Enrich Wikidata Q140078221 (sameAs, founder Person item, occupation, IYBA, Forbes ref, Kifisia, knowsAbout). [Claude drafts QuickStatements; George submits]
- Stand up the 25-prompt AI-citation tracking panel + baseline run.

### Phase 1 - Motor-cost data moat + itinerary schema (mid July - end Aug) [claude]
Publish verbatim-extractable answers to the highest-intent queries before competitors react.
- Build the **weekly MOTOR all-in cost pillar**: size-band x season table (base + APA modeled at 2026 Brent + VAT + gratuity) with per-person + per-night readouts, powered by the Index. George supplies/approves all real rate numbers; flag estimates.
- Add **TouristTrip + per-island TouristAttraction** schema to the ~42 itinerary pages.
- Add an extractable spec/price/availability summary block to each ~67 yacht page; tie each yacht to named destinations (Mykonos/Cyclades motor angle ranks 3rd globally in AI luxury-destination share).
- A few high-intent motor long-tails (motor vs sail Cyclades meltemi, fastest Athens-Mykonos, APA vs fuel), each with FAQPage + a direct-answer paragraph.

### Phase 2 - Earned media + entity push (Sept - Oct) [george, Claude drafts]
Plant off-site consensus + Wikipedia footprint so they mature before the wave.
- Syndicate 1-2 data-led, Forbes-anchored press releases (Index + 2027 outlook) via free wires (OpenPR, EIN/PRLog).
- Pitch 2-3 yachting trade / luxury-advisor outlets (SuperYachtTimes, CharterWorld, Robb Report Marine, Virtuoso-adjacent advisor networks).
- Pursue a Wikipedia article for George Yachts / George P. Biniaris using Forbes + IYBA + trade coverage as notability anchors (neutral, sourced).
- Lock NAP consistency on the IYBA directory + major aggregators; claim free fleet listings.
- Begin authentic Reddit/Quora presence answering real cost/broker/itinerary questions with Index data (Claude drafts; a human posts).

### Phase 3 - Publish the 2027 outlook + freshness cadence (Nov) [both]
- Publish a data-grounded "2027 Greek luxury charter outlook" report (figures George-verifies).
- Refresh the Greek Charter Index with a Q4 update + dated stat callout high on page.
- Wire per-yacht + org AggregateRating to publish automatically as real reviews cross thresholds (gate already coded).
- Ship the honest "motor vs catamaran vs sail: the 2026 fuel-economics decision" comparison.

### Phase 4 - Conversion + capture hardening (Dec) [both]
- Discreet WhatsApp/direct-line CTA + peer-grade response-time promise on yacht + inquiry pages.
- Foreground person-led E-E-A-T (Forbes, IYBA, George's name/photo/title); add one high-value gated asset (2027 motor-yacht season brief) to capture inquiries + seed the email list. No discounts/urgency.
- Make the season-time inquiry SLA (<15 min) operationally real; dry-run inquiry-to-qualified end to end.

### Phase 5 - Wave monitoring + iterate (Jan 2027+) [both]
- Run the 25-prompt citation panel weekly; reallocate to whichever queries/engines we win or lose.
- Sustain review velocity (3-5/month) + a monthly dated market note for Perplexity recency.
- Attribute inquiries to source ("how did you find us / via AI?") to confirm the citation -> request chain.

---

## How we scale pages WITHOUT thin content

The "put 1,000 pages" instinct is right only when channeled into pages where **each page is a distinct verifiable fact**. Rule: a new page ships only if it has (a) a distinct head query, (b) at least one number/fact on no sibling page, and (c) a self-contained extractable answer in its first 30%.

- **Per-yacht pages (~67)** - already unique by real spec/price; the "named anchor properties" AI cites. Biggest legitimate page count.
- **Itinerary pages (~42)** - made citable via TouristTrip; add a few NEW named high-intent 7-day routes only where a distinct query exists.
- **Greek Charter Index sub-views** - size-band x season x region all-in tables; every cut is a different real number, so each is a legitimate page.
- **Glossary DefinedTerms (37)** - extend only with terms AI is actually asked to define.

What we do NOT do: more city x type permutations on the already-dense motor cluster (cannibalization), AI-generated filler, thin near-duplicates. Cadence: 1 dated market note/month + quarterly Index refresh keeps the corpus fresh without dilution.

---

## What only George can do (the highest-leverage levers)

These cap the plan if under-invested. Claude cannot do them.
- **Reviews:** WhatsApp 2-4 genuinely happy past clients/month with a one-tap GBP review link. Target ~20-30 real reviews by Jan 2027. Never incentivized or scripted.
- **The real rate numbers** for the all-in cost table (central-agency data).
- **The VAT figure** to publish, with legal basis.
- **PR approval + posting** from real accounts (press wires, Reddit/Quora, Wikipedia relationships).
- **Trade/advisor relationships.**

---

## Measurement (free tools only)

- Fixed **25-prompt AI-citation panel** run monthly across ChatGPT, Perplexity, Claude, Google AI Overviews. Track % of answers that NAME George Yachts (the leading indicator).
- GA4 + Microsoft Clarity (live) segmented by AI-referrer (chat.openai.com, perplexity.ai...).
- Google Search Console (verified) for AI Overview impressions + the cost/itinerary clusters.
- Inquiry-form source field ("how did you find us / via an AI assistant?").
- Monthly qualified-request count (the KPI) in the GY Command Center CRM, with a documented "qualified" definition.
- GBP review count + velocity (target ~3-5/month).
- Off-site consensus tally: distinct third-party domains that name George Yachts.

---

## Top risks

- **Lead-time:** entity + earned-media work compounds over ~90 days. If PR/Wikipedia/Reddit slip to Q4, they will not mature before the wave. Start in Phase 0-2.
- **Owner-dependency:** the highest-leverage off-site levers need George's hands. Under-invest here and the plan caps at the on-page ceiling, which alone will not hit 10/month.
- **Fabrication:** every rate, stat, VAT figure, external claim must be George-verified or sourced. One invented number gets George dropped by fact-checking LLMs.
- **Reddit/Quora authenticity:** value-first only; spammy seeding is toxic for a Forbes-tier brand.
- **Cannibalization:** scale only via per-yacht / per-data-cut / named-itinerary pages.
- **VAT correctness:** confirm the figure + legal basis before the sitewide change.
- **Vercel build minutes:** build/verify locally, batch changes into few deploys.

---

*Living document. Update as phases ship. Companion: `SEO-GEO-AI-SEARCH-PROJECT.md` (what is already live), `CONTENT-PLAN-20-ARTICLES-2026.md` (editorial).*
