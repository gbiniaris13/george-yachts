# Google Business Profile + Reviews Activation Guide

**Phase 7 Round 33 (2026-05-12). Technical brief Priorities 4A + 4B.**

Both LocalBusiness/GBP schema and AggregateRating Review schema are
already wired in the codebase. They activate automatically when
George completes the Boss-side setup:

1. Creating the Google Business Profile (4A)
2. Collecting 3+ verified reviews into Sanity (4B)

This doc walks through both.

---

## 4A. Google Business Profile setup

### What's already in code

`lib/organizationSchema.js` already declares:
- `@type: ["Organization", "LocalBusiness", "TravelAgency"]`
- Real Athens address: Charilaou Trikoupi 190A, Nea Kifisia 14564
- `geo` with lat/lng (approx 38.0833 N, 23.8167 E)
- `openingHoursSpecification` (Mon-Sun 09:00-21:00)
- `hasMap` Google Maps deep link
- Phone numbers (Athens / London / Miami)

The schema is live on every page via JsonLd in layout.jsx. Google's
crawler already sees this data.

### What George needs to do

1. Sign in at https://business.google.com with george@georgeyachts.com
2. Click "Add your business to Google"
3. Business name: George Yachts Brokerage House
4. Categories (in order):
   - Primary: Yacht Broker
   - Secondary: Travel Agency
   - Secondary: Boat Charter Service
5. Address: Charilaou Trikoupi 190A, Nea Kifisia 14564, Attica, Greece
   - Important: confirm exact address matches organizationSchema.js
6. Service area: Greece (and any specific countries you serve)
7. Phone: +30 6970380999
8. Website: https://georgeyachts.com
9. Hours: Mon-Sun 09:00-21:00 (matches schema)
10. Submit. Google sends a verification card to the Kifisia address
    (10-14 day arrival).
11. When card arrives, enter the verification code at business.google.com.
12. Once verified, upload:
    - 10+ photos: George at the office, sample yachts (use existing
      Sanity assets), the Athens marina, Greek itinerary maps
    - Logo: /images/yacht-icon-only.svg converted to PNG
    - Cover photo: a flagship yacht photo at sea
13. Set the business description (limit 750 chars). Suggested copy:

> Luxury crewed yacht charter brokerage based in Athens, Greece.
> George Yachts specialises in MYBA-standard chartering across the
> Cyclades, Ionian, Saronic Gulf, and Dodecanese for ultra-high-net-
> worth clientele. IYBA member. Featured in Forbes (May 2026).
> Direct conversation with George P. Biniaris on every inquiry.

### After verification

The schema in code is already aligned with the GBP profile. Google
will reconcile the two automatically and start surfacing George
Yachts in the local pack for queries like:
- "yacht charter Athens"
- "yacht broker Greece"
- "yacht charter near me" (when Greek user is on holiday)

No code changes needed post-verification unless the address changes.

---

## 4B. Review schema activation

### What's already in code

`lib/serviceSchema.js` exports `getServiceSchemaWithReviews()` which:
1. Fetches review documents from Sanity
2. Filters to `publishedOnSite:true` + valid rating 1-5
3. Computes AggregateRating (mean + count)
4. Attaches to Service schema ONLY when count >= 3

Below 3 reviews: AggregateRating block stays out of the schema.
Faking stars triggers a Google penalty - the >=3 gate is strict.

The same wiring extends to homepage schema and Organization
schema. Once 3+ verified reviews exist, stars appear in SERP
automatically.

### What George needs to do

1. Identify 5-10 best repeat-charterers from 2025.
2. Email each one a short, personal note asking for a written
   review. Sample text:

> Dear [Name],
>
> One of the most valuable things you can do for us as your broker
> is share your experience publicly. If you have a few minutes,
> would you write a short review of your 2025 charter with us?
>
> We've set up the review form here: https://georgeyachts.com/reviews
> (takes 3 minutes; you can submit anonymously if you prefer).
>
> Three honest reviews from real clients unlock star ratings on
> Google for our entire site. It's the highest-leverage thing
> existing clients can do for our brand without referring anyone.
>
> Thank you,
> George

3. Direct them to https://georgeyachts.com/reviews where the
   submission form already exists.

4. Each review submission creates a Sanity `review` document
   (publishedOnSite:false by default). George reviews each and
   flips `publishedOnSite:true` for the genuine ones.

5. Once count >= 3 with `publishedOnSite:true`:
   - AggregateRating appears in Service + Organization schema
   - Stars surface in Google SERP within 7-21 days of next crawl
   - CTR boost typically +20-35%

### Schema example (post-activation)

```json
{
  "@type": "Service",
  "name": "Luxury Yacht Charter in Greek Waters",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "5",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

---

## Common mistakes to avoid

- DO NOT create fake reviews. Google's algorithmic checks catch
  invented reviews (similar IP, similar wording, no public footprint)
  and the entire site loses ranking for months.
- DO NOT publish a 5/5 average from a single review. The >=3 gate
  in code is intentional.
- DO NOT change the LocalBusiness type unless the GBP categories
  change too. Schema and GBP must agree.
- DO NOT add new addresses to organizationSchema.js without first
  setting up a GBP for each location. Google penalises unverified
  multi-location claims.

---

*Brief prepared: May 2026 | Version 1.0*
