// SEO <title> overrides for Journal posts.
//
// 2026-07-30 — the Ahrefs crawl flagged 42 posts whose <title> ran past the
// ~60-character mark Google renders. The cause is structural, not sloppy:
// our editorial headlines are deliberately long and question-shaped, because
// that is what wins answer-engine citations and what reads well on the page.
// Truncating the headline itself would damage both.
//
// So the headline and the SERP title are separated. The H1, the OG card and
// the Journal index keep the full editorial headline. Only the browser/SERP
// <title> is swapped for the short keyword-forward form below.
//
// Budget: 44 characters. The root layout appends " | George Yachts" (16),
// which lands the rendered title at 60 or under so the brand always survives
// truncation. Keep new entries inside that budget, keyword first, and follow
// the house rules: no em dashes, nothing claimed that the article does not
// actually deliver.
//
// A post with no entry here simply uses its own headline.

export const BLOG_SEO_TITLES = {
  "12-passenger-rule-greek-yacht-charter-groups-of-14":
    "More Than 12 Guests on a Greek Charter",
  "7-day-dodecanese-yacht-charter-itinerary-2026":
    "7-Day Dodecanese Yacht Charter Itinerary",
  "airport-hell-2026-skip-terminal-yacht-charter-greece":
    "Skip the Airport: Yacht Charter Greece",
  "american-guide-yacht-charter-greece-from-usa":
    "Yacht Charter Greece From the USA (2027)",
  "august-or-september-greek-yacht-charter-shoulder-season-2026":
    "August or September in Greece by Yacht",
  "best-time-to-charter-yacht-greece-month-by-month-2026":
    "Best Time to Charter a Yacht in Greece",
  "crewed-vs-bareboat-yacht-charter-greece-2026":
    "Crewed vs Bareboat Charter in Greece",
  "cyclades-vs-ionian-yacht-charter-2026":
    "Cyclades vs Ionian Yacht Charter 2026",
  "dubai-exodus-yacht-charter-greece-2026":
    "Dubai Is Emptying: Where UHNW Sail Now",
  "greece-vs-croatia-yacht-charter-2026":
    "Greece vs Croatia Yacht Charter 2026",
  "greek-islands-sailing-distance-time-calculator-2026":
    "Greek Islands Sailing Distance Times",
  "greek-yacht-charter-contract-myba-standard-terms-explained":
    "Greek Charter Contract: MYBA Terms",
  "greek-yacht-charter-insurance-complete-guide-2026":
    "Greek Yacht Charter Insurance Guide",
  "greek-yacht-charter-shoulder-season-may-september":
    "Greek Shoulder Season: May and September",
  "greek-yacht-charter-vs-mediterranean-2026":
    "Why Greece Over the Wider Mediterranean",
  // 2026-08-01 SD-1 — pos 8.2 with 0% CTR: the bare keyword title gave no
  // reason to pick us over five bigger names above. "The Private Route"
  // sells the differentiator in the SERP itself. 43 chars.
  "honeymoon-yacht-charter-greece-2026-romantic-itinerary":
    "Honeymoon Yacht Charter Greece: the Private Route",
  "how-much-does-yacht-charter-greece-cost-complete-breakdown":
    "How Much a Yacht Charter in Greece Costs",
  "how-to-charter-yacht-greece-step-by-step-2026":
    "How to Charter a Yacht in Greece",
  "how-to-choose-yacht-charter-broker-greece-2026":
    "How to Choose a Charter Broker in Greece",
  "how-to-verify-yacht-charter-broker-credentials-2026":
    "How to Verify a Yacht Charter Broker",
  "hushpitality-greek-yacht-charter-quiet-luxury-2026":
    "Hushpitality: Quiet Luxury in Greece",
  "is-catamaran-best-yacht-charter-greece-2026":
    "Is a Catamaran Best for a Greek Charter?",
  "is-greek-yacht-charter-right-for-us-seasickness-safety-2026":
    "Is a Greek Yacht Charter Right for Us?",
  "is-motor-yacht-worth-it-greek-charter-2026":
    "Is a Motor Yacht Worth It in Greece?",
  "last-cabin-standing-book-crewed-yacht-greece-summer-2026":
    "Booking a Crewed Yacht for Summer 2026",
  "motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece":
    "How to Choose Your Charter Yacht Type",
  "oil-spike-smart-money-yacht-charter-greece":
    "When Oil Spikes, Book a Yacht in Greece",
  "pre-collaboration-interview-thethoms":
    "What Sets George Yachts Apart",
  "superyacht-charter-greece-40m-plus-2026":
    "Superyacht Charter Greece: the 40m Tier",
  "tepai-tax-greece-2026-complete-yacht-charter-breakdown":
    "TEPAI Tax Greece 2026 for Yachts",
  "the-7-day-cyclades-itinerary-what-your-captain-won-t-tell-you-until-you-re-onboard":
    "The 7-Day Cyclades Yacht Itinerary",
  "the-eur50-000-mistake-what-goes-wrong-when-you-book-a-yacht-charter-without-a-broker":
    "Booking a Yacht Charter Without a Broker",
  "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece":
    "First-Timer's Guide to Crewed Charter",
  "the-ripple-effect-how-geopolitical-shifts-are-reshaping-the-2026-mediterranean-yacht-charter":
    "Geopolitics and the 2026 Charter Market",
  // 2026-08-01 — kosher article (queue #0, George's call). Differentiated
  // from the money page's "Kosher Yacht Charter Greece 2026: Shabbat at Sea"
  // so the two never show identical titles in one SERP. Slug kept yearless
  // on purpose: the piece is aimed at 2027 bookings and the URL should not
  // expire every January.
  "how-kosher-yacht-charter-greece-works":
    "How a Kosher Charter Week in Greece Works",
  "the-saronic-gulf-the-5-day-crewed-charter-that-starts-where-you-land":
    "Saronic Gulf: the 5-Day Crewed Charter",
  "uhnw-yacht-charter-trends-2026-greek-market-analysis":
    "UHNW Yacht Charter Trends 2026",
  "what-50000-week-yacht-charter-greece-buys-2026":
    "What a €50,000 Week in Greece Buys",
  "what-happens-crewed-yacht-charter-greece-hour-by-hour":
    "A Crewed Charter in Greece, Hour by Hour",
  "what-to-pack-greek-yacht-charter-dress-code-2026":
    "What to Pack for a Greek Yacht Charter",
  "yacht-charter-booking-process-greece-what-happens-after-you-book":
    "The Charter Booking Process in Greece",
  "yacht-charter-crew-greece-captain-chef-stewardess-roles-explained":
    "Yacht Charter Crew Roles in Greece",
  "yacht-charter-greece-september-2026":
    "Yacht Charter Greece in September 2026",
  "yacht-charter-vs-5-star-hotel-greece-family-2026":
    "Yacht Charter vs 5-Star Hotel in Greece",
};

export function blogSeoTitle(slug, fallback) {
  return BLOG_SEO_TITLES[slug] || fallback;
}
