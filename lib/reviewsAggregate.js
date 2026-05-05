// Phase 27e (Forbes-launch eve, 2026-05-05) — AggregateRating infrastructure.
//
// Boss wants 5-star stars in Google SERP results — that requires
// Schema.org AggregateRating injected into the Organization or Service
// schema. Google + ChatGPT + Perplexity render stars only when there
// are >=3 reviews with explicit numeric ratings. Faking stars is a
// Google Search Essentials violation that gets the entire site
// penalised in rankings — so this helper is built to ONLY emit
// AggregateRating when REAL data exists in Sanity.
//
// Once George creates a `review` document type in Sanity Studio with
// schema:
//
//   review {
//     author:        string         // e.g. "M.K., London"
//     rating:        number 1–5
//     body:          text           // the review text
//     datePublished: date
//     publishedOnSite: boolean      // gate so drafts don't ship
//     yachtRef:      reference?     // optional: yacht-specific
//   }
//
// …and publishes 3+ reviews, the function below returns { count, avg,
// best, worst } and the caller injects an AggregateRating. Until then,
// it returns null and the schema is emitted WITHOUT a rating block.
//
// Why this is the right shape: Boss can populate Sanity at his pace
// after Forbes drops; the moment 3 real testimonials are published,
// stars appear in Google overnight without a code deploy.

import { sanityClient } from "@/lib/sanity";

const QUERY = `{
  "count": count(*[_type == "review" && publishedOnSite == true && defined(rating)]),
  "ratings": *[_type == "review" && publishedOnSite == true && defined(rating)].rating
}`;

export async function fetchReviewAggregate() {
  // Defensive: in dev/local without Sanity envs, the client throws.
  // Treat that as "no reviews" so the build never fails.
  try {
    const data = await sanityClient.fetch(QUERY);
    const ratings = Array.isArray(data?.ratings) ? data.ratings.filter(Number.isFinite) : [];
    if (ratings.length < 3) return null; // schema-org requires >=3 for stars
    const sum = ratings.reduce((a, b) => a + b, 0);
    const avg = sum / ratings.length;
    return {
      count: ratings.length,
      avg: Math.round(avg * 10) / 10, // one decimal place
      best: 5,
      worst: 1,
    };
  } catch {
    return null;
  }
}

// Schema.org AggregateRating block builder. Pass the result of
// fetchReviewAggregate() — returns null if argument is null so the
// caller can spread { ...(maybeAggregate || {}) } safely.
export function aggregateRatingForSchema(agg) {
  if (!agg) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: String(agg.avg),
    reviewCount: agg.count,
    bestRating: "5",
    worstRating: "1",
  };
}
