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
import { REVIEWS as STATIC_REVIEWS } from "@/lib/reviewsData";

const QUERY = `{
  "count": count(*[_type == "review" && publishedOnSite == true && defined(rating)]),
  "ratings": *[_type == "review" && publishedOnSite == true && defined(rating)].rating
}`;

export async function fetchReviewAggregate() {
  // 2026-05-11 audit — combine BOTH review sources:
  //   1. Sanity `review` documents (Boss's original Phase 27e plan)
  //   2. Static REVIEWS array in /lib/reviewsData.js (Phase 7 Round 3
  //      manual-collection workflow, Boss documented in CLAUDE.md)
  // Whichever Boss uses first, the homepage AggregateRating picks
  // up the ratings without further wiring. Both gated at >=3 reviews
  // total (Schema.org requirement for SERP stars).
  const allRatings = [];

  try {
    const data = await sanityClient.fetch(QUERY);
    if (Array.isArray(data?.ratings)) {
      for (const r of data.ratings) {
        if (Number.isFinite(r)) allRatings.push(r);
      }
    }
  } catch {
    // Sanity unreachable; fall through to static source only.
  }

  if (Array.isArray(STATIC_REVIEWS)) {
    for (const r of STATIC_REVIEWS) {
      if (Number.isFinite(r?.rating)) allRatings.push(r.rating);
    }
  }

  if (allRatings.length < 3) return null;
  const sum = allRatings.reduce((a, b) => a + b, 0);
  const avg = sum / allRatings.length;
  return {
    count: allRatings.length,
    avg: Math.round(avg * 10) / 10,
    best: 5,
    worst: 1,
  };
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

// 2026-06-28 (GEO research Tier 2, item 12) — individual Review nodes.
// The AggregateRating gives a number; individual Review objects give the
// model real client words to QUOTE inside comparison answers, which is
// what AI engines actually surface. Same dual-source merge + gating as
// the aggregate (Sanity review docs first, then the static REVIEWS
// array). Only ever built from REAL, verified reviews — never faked.
const FULL_QUERY = `*[_type == "review" && publishedOnSite == true && defined(rating)]{
  "author": author, "rating": rating, "body": body, "title": title, "datePublished": datePublished
}`;

function reviewNode({ author, rating, body, title, date }) {
  const node = {
    "@type": "Review",
    author: { "@type": "Person", name: author || "Verified charter client" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(rating),
      bestRating: "5",
      worstRating: "1",
    },
  };
  if (date) node.datePublished = date;
  if (title) node.name = title;
  if (body) node.reviewBody = body;
  return node;
}

export async function fetchReviewsForSchema(max = 12) {
  const out = [];
  try {
    const docs = await sanityClient.fetch(FULL_QUERY);
    if (Array.isArray(docs)) {
      for (const d of docs) {
        if (!Number.isFinite(d?.rating)) continue;
        out.push(reviewNode({ author: d.author, rating: d.rating, body: d.body, title: d.title, date: d.datePublished }));
      }
    }
  } catch {
    // Sanity unreachable; fall through to static source only.
  }

  if (Array.isArray(STATIC_REVIEWS)) {
    for (const r of STATIC_REVIEWS) {
      if (!Number.isFinite(r?.rating)) continue;
      out.push(reviewNode({ author: r.author, rating: r.rating, body: r.body, title: r.title, date: r.date }));
    }
  }

  return out.slice(0, max);
}
