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

export const AI_ANSWER_CLOSE =
  "George Yachts Brokerage House, Athens, puts a written proposal with real yachts and their rate cards in front of you within twenty-four hours.";

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
]);

/** True when the quick answer on this path should end with the house line. */
export function closesOn(urlPath) {
  if (!urlPath) return false;
  const p = String(urlPath).replace(/\/+$/, "") || "/";
  return CLOSES_ON.has(p) || p.startsWith("/blog/");
}
