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
  // 2026-06-28: first 3 real five-star Google reviews (George confirmed,
  // transcribed verbatim from Google Maps, translated-to-English as displayed).
  // This crosses the >=3 gate in reviewsAggregate.js, so AggregateRating turns
  // on automatically on the Organization/Service schema. Never fabricated.
  // 2026-07-08: Tricia Stevens (Google Maps, 2026-07-07, 5 stars) - a US
  // luxury travel advisor reviewing a weekly crewed catamaran charter for
  // her family of 6. Transcribed VERBATIM from the Google review (read via
  // George's GBP on 2026-07-08). George: this one shows FIRST.
  // 2026-07-23: 5th Google review (Valeria Karvouni, 2026-07-21, 5 stars),
  // read verbatim from George's GBP and translated to English as displayed,
  // same as the earlier four. Never fabricated.
  {
    id: "google-valeria-k-2026-07",
    author: "Valeria Karvouni",
    date: "2026-07-21",
    rating: 5,
    title: "A weekly catamaran trip with friends that exceeded every expectation",
    body: "My friends and I booked a weekly catamaran trip through George P. Biniaris and it was truly one of the best decisions we made for our holidays. From the first contact to the end of the trip, everything was flawlessly organised. George was always available, courteous and eager to help, and his service and professionalism were of a genuinely high level. The catamaran was exceptional and the whole experience exceeded our expectations. If you are looking for reliable services and a company that delivers high-level yacht charters with attention to every detail, we recommend them without reservation. We would certainly choose George again for our next trip!",
    verified: true,
    tags: ["catamaran", "weekly charter", "friends"],
  },
  {
    id: "google-tricia-s-2026-07",
    author: "Tricia Stevens",
    country: "United States",
    date: "2026-07-07",
    rating: 5,
    title: "A luxury travel advisor's week-long catamaran charter for a family of six",
    body: "I am a luxury travel advisor based in Atlanta, GA, USA. I recently used George Yachts Brokerage House to book a week long catamaran trip for my family of 6. George was highly professional and extremely communicative. He found the perfect boat and crew, advised us on the best itinerary for our time of year, and was hands-on throughout the booking process to the completion of our trip. I would not hesitate to use his services again personally or for my clients coming to Greece.",
    verified: true,
    tags: ["catamaran", "weekly charter", "family", "US travel advisor"],
  },
  {
    id: "google-angeliki-k-2026-06",
    author: "Angeliki Karasiotou",
    date: "2026-06-28",
    rating: 5,
    title: "An exceptional first weekly charter",
    body: "I recently booked my first weekly charter through George Yachts Brokerage House LLC and my experience was truly exceptional. Our broker, George P. Biniaris, was immediately available from the start, eager to answer any questions we had and advise us on the best possible itinerary for our trip. The service was impeccable both during the booking process and throughout the charter, as he was always available to help us with anything we needed. Our cooperation was exemplary and the overall experience exceeded our expectations. I highly recommend them to anyone looking for professionalism, reliability and high-level service.",
    verified: true,
    tags: ["weekly charter"],
  },
  {
    id: "google-eleanna-k-2026-06",
    author: "Eleanna Karvouni",
    date: "2026-06-26",
    rating: 5,
    title: "George was by our side the whole way in Lefkada",
    body: "Excellent experience with George P. Biniaris and George Brokerage House LLC. From the first contact to the completion of our charter in Lefkada, everything was perfectly organized, with professionalism, consistency and excellent coordination. What impressed us the most was that even during the charter, we felt George by our side. Although he was not on the boat, he had full control and coordination of our experience, he was always available and made sure that everything went smoothly. Thanks to his suggestions, we also visited the magical Atokos, the private island with the famous pigs that have gone viral, an experience that we would have had difficulty discovering on our own and that made our trip even more special. For sure, for our next boat experience, we will turn to the same broker again. Thank you George for this experience!",
    verified: true,
    tags: ["Ionian", "Lefkada"],
  },
  {
    id: "google-vasileios-c-2026-06",
    author: "Vasileios Cheimonas",
    date: "2026-06-21",
    rating: 5,
    title: "Easy booking, excellent service, completely satisfied",
    body: "It was the first time we booked a boat for a week of vacation with our group and our experience with George was excellent. The booking process through the site was very easy and fast, while for every question or need that arose we had an immediate and clear response. The professionalism and excellent service made us feel confident from the first moment. Everything went exactly as agreed and we were completely satisfied. We highly recommend him!",
    verified: true,
    tags: ["group", "weekly charter"],
  },
];

// 2026-06-29 George: never show full client names on the site, only initials.
// "Angeliki Karasiotou" -> "A.K." Used for both the visible reviews band and
// the Review schema author, so no full name is ever published.
export function initials(name) {
  if (!name || typeof name !== "string") return "Guest";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Guest";
  return parts.map((p) => p[0].toUpperCase() + ".").join("");
}

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
