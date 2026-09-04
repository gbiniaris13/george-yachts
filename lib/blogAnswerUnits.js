// Code-side answer units for Journal posts (plan items 9 and 13, George
// 4/9/2026).
//
// The cost breakdown post is the winner of the cost cluster: it holds
// nearly every "how much / cost / prices" query the site receives
// (205 impressions on the head term alone in the last 28 days, position
// 9 in the US tracker). The post body lives in Sanity; the one exact
// answer an engine should lift, with the Index's hard numbers, lives
// here so it can be kept in step with lib/charterIndex2026.js without a
// Studio edit. Rendered by app/blog/[slug]/page.jsx above the body and
// merged into the post's FAQPage as the first Question.
//
// Rules: 60 to 70 words, one price model (per yacht per week), figures
// from the Greek Charter Index only, no dashes.

export const BLOG_ANSWER_UNITS = {
  "how-much-does-yacht-charter-greece-cost-complete-breakdown": {
    question: "How much does a yacht charter in Greece cost?",
    answer:
      "A crewed yacht charter in Greece is priced per yacht per week. On the Greek Charter Index the weekly net base runs from EUR 10,900 for a 12 to 16 metre sailing catamaran to EUR 235,000 for a motor yacht above 50 metres. Add VAT at the yacht's certified rate (5.2 to 12% in practice), APA of 20 to 40% for running costs, and a customary 10 to 15% crew gratuity.",
    keyFacts: [
      "Sailing catamaran 12 to 16m: EUR 10,900 to 22,000 net base a week; 23 to 24m: EUR 56,000 to 90,000",
      "Motor yacht 18 to 24m: EUR 17,500 to 33,000; 26 to 31m: EUR 40,000 to 65,000; 35 to 40m: EUR 60,000 to 120,000; above 50m: EUR 162,500 to 235,000",
      "VAT by certification: 5.2, 6.5, 7.8 or 12%; 13% is the statutory ceiling. APA 20 to 30% sail and catamaran, 30 to 40% motor",
      "Gratuity 10 to 15% of the base fee, at your discretion; always one price per yacht for the whole party",
    ],
    evidence: { label: "George Yachts Greek Charter Index", href: "/greek-charter-index-2026" },
  },
};

export function getBlogAnswerUnit(slug) {
  return BLOG_ANSWER_UNITS[slug] || null;
}
