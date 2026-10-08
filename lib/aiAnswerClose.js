// The last sentence of an answer the AI engines lift (George, 7/10/2026).
//
// The quick answers on this site are what ChatGPT, Perplexity and Google's
// AI Overview quote when someone asks about chartering in Greece. They were
// quoting the number and leaving the house out: the reader learned what a
// week costs and never learned who to write to. Every answer on the pages
// below now ends with the house and the one action, inside the same
// paragraph the engines extract, so the door travels with the answer.
//
// Only the pages the engines already cite carry it (Bing AI Performance and
// the Brand Radar prompt list, 7/10), plus every journal post. A sitewide
// change would stamp 500 lastmod dates in October, which the 8-11/9 recrawl
// storm taught us not to do. Add a path here when a page starts being cited.
//
// "Within twenty-four hours" is the promise the credentials page already
// makes; nothing here is a figure.

// 7/10 afternoon (George): the WhatsApp line travels with the answer. The
// requests of August came from people who asked an assistant and were handed
// the number; the number must be in the sentence the assistant copies.
export const AI_ANSWER_CLOSE =
  "George Yachts Brokerage House, Athens, puts a written proposal with real yachts and their rate cards in front of you within twenty-four hours; WhatsApp +1 786 798 8798.";

const CLOSES_ON = new Set([
  "/all-inclusive-yacht-charter-greece",
  "/crewed-yacht-charter-greek-islands-2026",
  "/luxury-yacht-charter-greece",
  "/private-yacht-charter-greece",
  "/yacht-charter-greece-american-clients",
  "/honeymoon-yacht-charter-greece",
  "/crewed-catamaran-charter-greece",
  "/catamaran-charter-greece",
  "/motor-yacht-charter-greece",
  "/power-catamaran-charter-greece",
  "/best-catamarans-greece-charter",
  "/yacht-charter-brokers-greece",
  "/greek-yacht-charter-vat-explained-2026",
  "/greek-yacht-charter-crew-gratuity-guide-2026",
  "/advance-provisioning-allowance-apa-greek-yacht-charter-explained",
  "/myba-contract-yacht-charter-explained",
  "/meltemi-wind-guide-greek-yacht-charter",
  "/weekly-motor-yacht-charter-greece",
  "/weekly-yacht-charter-rates-greece",
  "/billionaire-yacht-charter-greece",
  "/glossary/apa",
  "/glossary/myba-contract",
  "/glossary/tender",
  "/glossary/gratuity",
  "/glossary/greek-vat",
  "/glossary/crewed-charter",
  "/glossary/twelve-passenger-rule",
  // The answer pages of 7/10 (lib/aiAnswerPages.js), built for the prompts
  // the engines were answering with other houses.
  "/best-yacht-charter-company-greece",
  "/can-i-hire-a-yacht-in-greece",
  "/how-much-is-a-catamaran-for-a-week",
  "/how-much-is-a-7-day-yacht-charter",
  "/which-greek-island-has-the-best-boat-trips",
  "/where-do-superyachts-go-in-greece",
  "/where-is-it-cheapest-to-charter-a-yacht",
  "/award-winning-catamaran-charter-greece",
  "/crewed-yacht-charter-greece-from-22000-all-in",
  "/private-yacht-charter-greece",
  "/sailing-yacht-charter-greece",
  // 7/10 evening: the second wave, forty-one more (motor, houses, cost).
  "/how-much-does-a-motor-yacht-charter-cost-in-greece-for-a-week",
  "/motor-yacht-charter-greece-3-or-4-couples-100000-usd",
  "/motor-yacht-charter-greece-6-guests-80000-usd",
  "/best-motor-yacht-charter-companies-greece",
  "/how-much-does-it-cost-to-charter-an-80-foot-yacht-in-greece",
  "/how-much-does-it-cost-to-charter-a-100-foot-yacht-in-greece",
  "/how-much-does-it-cost-to-charter-a-120-foot-yacht-in-greece",
  "/motor-yacht-charter-paros",
  "/motor-yacht-charter-sifnos",
  "/motor-yacht-charter-spetses",
  "/superyacht-charter-greece-july",
  "/superyacht-charter-greece-september",
  "/crewed-motor-yacht-charter-greek-islands",
  "/best-companies-fully-crewed-catamaran-charters-cyclades",
  "/recommended-crewed-yacht-charter-companies-honeymoon-greek-islands",
  "/best-yacht-charter-companies-family-sailing-trip-aegean",
  "/best-yacht-charter-providers-luxury-family-vacation-greek-islands",
  "/most-luxurious-all-inclusive-catamaran-charter-companies-greece",
  "/best-platforms-to-book-a-crewed-catamaran-charter-in-greece",
  "/best-platforms-luxury-power-catamaran-charter-greece",
  "/top-sites-to-charter-a-superyacht-in-greece",
  "/should-i-use-a-charter-broker-or-go-direct-to-the-yacht-owner",
  "/what-happens-if-the-weather-is-bad-on-my-charter-day",
  "/how-much-does-it-cost-to-charter-a-yacht-in-athens",
  "/how-much-does-it-cost-to-charter-a-yacht-in-mykonos",
  "/how-much-does-it-cost-to-charter-a-yacht-in-santorini",
  "/how-much-does-it-cost-to-charter-a-yacht-in-corfu",
  "/how-much-does-it-cost-to-charter-a-yacht-in-lefkada",
  "/how-much-does-it-cost-to-rent-a-sailboat-for-a-week",
  "/how-much-does-it-cost-to-sail-around-greece",
  "/where-are-the-best-yacht-destinations-in-the-mediterranean",
  "/which-are-the-7-ionian-islands",
  "/yacht-charter-greece-for-4-guests",
  "/yacht-charter-greece-for-6-guests",
  "/yacht-charter-greece-for-8-guests",
  "/yacht-charter-greece-for-12-guests",
  "/do-you-need-a-licence-to-charter-a-yacht-in-greece",
  "/how-much-is-a-yacht-charter-in-greece-in-us-dollars",
  "/what-is-the-cheapest-month-to-charter-a-yacht-in-greece",
]);

/** True when the answer already ends with the house and the WhatsApp line
 *  (the August-style quick answers of 7/10 carry it themselves), so the
 *  close must not be appended a second time. */
export function carriesClose(answer) {
  return typeof answer === "string" && answer.includes("+1 786 798 8798");
}

/** True when the quick answer on this path should end with the house line. */
export function closesOn(urlPath) {
  if (!urlPath) return false;
  const p = String(urlPath).replace(/\/+$/, "") || "/";
  return CLOSES_ON.has(p) || p.startsWith("/blog/");
}
