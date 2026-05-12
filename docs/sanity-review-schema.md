# Sanity Review Schema Configuration

**Phase 7 Round 37 (2026-05-12). Technical brief Priority 4B.**

The `AggregateRating` schema on georgeyachts.com is wired and will
activate automatically when there are 3+ verified review documents
in Sanity. This doc gives the exact Sanity schema config to paste
into the Sanity Studio for that to work.

## Status (as of May 2026)

- `getServiceSchemaWithReviews()` in `lib/serviceSchema.js` already
  reads from Sanity reviews and aggregates.
- `lib/reviewsAggregate.js` handles the aggregation logic.
- `AggregateRating` is injected into Service schema when count ≥ 3.

What's missing: the Sanity `review` document type definition. The
Sanity Studio config lives outside this repo (at the separate Sanity
Studio project, likely under gy-command or a standalone studio).

## Schema to add to Sanity Studio

Paste this into the Sanity Studio's schema definitions:

```javascript
// schemas/review.js
export default {
  name: 'review',
  title: 'Client Review',
  type: 'document',
  fields: [
    {
      name: 'reviewerName',
      title: 'Reviewer Name',
      type: 'string',
      description: 'First name + last initial typical (e.g. "Maria K.")',
      validation: (R) => R.required().min(2).max(100),
    },
    {
      name: 'reviewerLocation',
      title: 'Reviewer Location',
      type: 'string',
      description: 'e.g. "London, UK" or "New York, USA"',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (R) => R.required().integer().min(1).max(5),
    },
    {
      name: 'reviewBody',
      title: 'Review Body',
      type: 'text',
      rows: 6,
      description:
        'The actual review text. 50-300 words ideal. No marketing copy - real client voice.',
      validation: (R) => R.required().min(50).max(2000),
    },
    {
      name: 'charterYear',
      title: 'Charter Year',
      type: 'number',
      description: 'Year of the charter being reviewed (e.g. 2025)',
    },
    {
      name: 'yachtName',
      title: 'Yacht Name (optional)',
      type: 'string',
      description: 'Helps surface the review on specific yacht pages',
    },
    {
      name: 'datePublished',
      title: 'Date Published',
      type: 'date',
      validation: (R) => R.required(),
    },
    {
      name: 'verified',
      title: 'Verified (real client)',
      type: 'boolean',
      initialValue: false,
      description:
        'CRITICAL - only flip true after manual verification this is a real client. False reviews trigger Google penalty.',
    },
    {
      name: 'publishedOnSite',
      title: 'Show on Site',
      type: 'boolean',
      initialValue: false,
      description:
        'Hide from public review list / AggregateRating until ready.',
    },
  ],
  preview: {
    select: {
      title: 'reviewerName',
      rating: 'rating',
      verified: 'verified',
      year: 'charterYear',
    },
    prepare({ title, rating, verified, year }) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
      return {
        title: `${title || '(no name)'} - ${stars}`,
        subtitle: `${year || '?'} charter ${verified ? '✓ verified' : '⚠ unverified'}`,
      };
    },
  },
  orderings: [
    { title: 'Date Published, Newest', name: 'dateDesc', by: [{ field: 'datePublished', direction: 'desc' }] },
    { title: 'Rating, Highest', name: 'ratingDesc', by: [{ field: 'rating', direction: 'desc' }] },
  ],
};
```

## Register in studio config

```javascript
// schemas/schema.js (or sanity.config.ts)
import review from './review';

export const schemaTypes = [
  // ... existing types
  review,
];
```

## After deployment

1. Add the schema file to your Sanity Studio repo (likely
   `gy-command` or a standalone studio repo).
2. Deploy the Sanity Studio (`sanity deploy` or commit to the
   studio repo if auto-deployed).
3. In the Studio, create review documents for verified clients.
4. Set `verified: true` and `publishedOnSite: true` on each.
5. Once count ≥ 3, the georgeyachts.com site auto-injects
   AggregateRating into Service schema on next page render
   (revalidate window is 24h).

## Stars in SERP timeline

- After 3+ reviews published: 1-3 weeks for Google to render stars
  in SERP listings.
- CTR boost typical: +20-35% across all organic results.
- No additional code deployment needed on georgeyachts.com side -
  the existing wiring handles it.

## Common mistakes to avoid

- DO NOT create fake reviews. Google's algorithmic checks catch
  invented reviews (similar IP, similar wording, no public footprint)
  and the entire domain loses ranking for months.
- DO NOT enable `publishedOnSite` before flipping `verified`. The
  unverified review document is for storage, not display.
- DO NOT set rating to a number outside 1-5. Schema validation
  catches it but client-side may not.

---

*Brief prepared: May 2026 | Version 1.0*
