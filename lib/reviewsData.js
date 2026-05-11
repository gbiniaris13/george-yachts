// Reviews data — free replacement for Trustpilot Business (€199/mo).
//
// 2026-05-11 Phase 7 Round 3 SEO execution. Section 8 Gap 1.
//
// How it works:
//   1. Reviews are collected manually (post-charter email, in-person
//      conversation, Telegram message from Boss, etc).
//   2. Each review gets added to the REVIEWS array below by editing
//      this file directly. Commit + deploy and the review appears.
//   3. The /reviews page renders all reviews with proper JSON-LD.
//   4. Per-yacht reviews surface on the yacht detail page (filtered
//      by yachtSlug).
//   5. AggregateRating schema is computed from the reviews and
//      output on the homepage Organization schema.
//
// Why not Trustpilot?
//   - €199/month for the integration tier we'd need.
//   - Reviews live on Trustpilot's domain, not ours. Authority leaks.
//   - Schema control is theirs, not ours.
//   - Auto-invitation is nice but easily replaced by a post-charter
//     email + manual capture into this file.
//
// To add a review:
//   1. Open /lib/reviewsData.js (this file).
//   2. Add a new object to REVIEWS following the schema below.
//   3. Use ratings from 1-5 (Schema.org Review standard).
//   4. Make sure the date is ISO 8601 (YYYY-MM-DD).
//   5. yachtSlug must match the yacht's slug in Sanity (e.g. "genny").
//      Leave empty for general/company reviews not about a specific yacht.
//   6. Commit + deploy. Review appears live.

export const REVIEWS = [
  // Each entry shape:
  // {
  //   id: "unique-string",            // for React keys
  //   author: "First L.",             // first name + last initial only for privacy
  //   country: "United States",       // optional, for context
  //   date: "2026-05-01",             // ISO 8601
  //   rating: 5,                       // 1-5
  //   title: "Headline of the review",// short, used as Review.name
  //   body: "Full review text...",    // the actual review content
  //   yachtName: "M/Y Genny",         // optional, the yacht chartered
  //   yachtSlug: "genny",             // optional, links to /yachts/[slug]
  //   verified: true,                  // we verified this charter actually happened
  //   tags: ["family", "Cyclades"],   // optional, for filtering
  // },
  //
  // EXAMPLE TEMPLATE BELOW — replace with real reviews as collected.
  // Until populated, the /reviews page shows a polished "first reviews
  // arriving" state rather than empty. Boss collects via email and adds.
];

export function getReviewsForYacht(yachtSlug) {
  return REVIEWS.filter((r) => r.yachtSlug === yachtSlug);
}

export function getOverallAggregateRating() {
  if (REVIEWS.length === 0) return null;
  const sum = REVIEWS.reduce((acc, r) => acc + (r.rating || 0), 0);
  return {
    ratingValue: (sum / REVIEWS.length).toFixed(1),
    reviewCount: REVIEWS.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export function getAggregateRatingForYacht(yachtSlug) {
  const yachtReviews = getReviewsForYacht(yachtSlug);
  if (yachtReviews.length === 0) return null;
  const sum = yachtReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return {
    ratingValue: (sum / yachtReviews.length).toFixed(1),
    reviewCount: yachtReviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}
