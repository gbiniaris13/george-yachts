// George's picks (homepage band), one source for the cards, the visible
// questions and answers under them, and the structured data in app/page.jsx.
//
// 2026-09-14, George: "Αυτά τα βάζεις από το φτηνότερο στο ακριβότερο και το
// γράφεις κάπου στο κειμενάκι ότι αυτά είναι οι προσωπικές επιλογές του
// George." The set is his; the ORDER is not typed by hand. It is read from
// each yacht's live rate card, lowest weekly figure first, so a new card
// re-orders the band on the next revalidation without anyone touching this.
//
// Every sentence the answers print is assembled from the fleet record (name,
// length, berths, rate card). Nothing here is a typed number, so nothing can
// drift from the yacht pages. Pure module, no server imports: the client
// component and the server page both import it.

export const GEORGES_PICKS = [
  "seabarit-lx",
  "alteya",
  "one",
  "just-marie-2",
  "elly-ii",
  "pandion",
  "amici-per-sempre",
  "oval",
  "christal-mio-80",
  "alina",
  "noema",
  "riana-ii",
  "naia",
];

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
const word = (n) => WORDS[n] ?? String(n);
const eur = (n) => `EUR ${n.toLocaleString("en-GB")}`;

/** Lowest and highest figure before the pipe on a rate card. */
export function rateRange(raw) {
  const head = String(raw || "").split("|")[0];
  const nums = (head.match(/€\s?[\d][\d.,]*/g) || [])
    .map((f) => Number(String(f).replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 1000);
  if (!nums.length) return null;
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/** Length in metres from "18.32 m / 60 ft" or "20,36 m". */
export function lengthMetres(raw) {
  const m = /(\d+)[.,]?(\d*)\s*m\b/i.exec(String(raw || ""));
  if (!m) return null;
  const n = Number(`${m[1]}.${m[2] || "0"}`);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const fmtM = (n) => `${n.toFixed(1).replace(/\.0$/, "")} metres`;

export function typeOf(name) {
  const n = String(name || "");
  if (/^S\/CAT/i.test(n)) return "sailing catamaran";
  if (/^P\/CAT/i.test(n)) return "power catamaran";
  return "motor yacht";
}

/** "P/CAT Just Marie 2" -> "Just Marie 2". */
export function shortName(name) {
  return String(name || "").replace(/^(S\/CAT|P\/CAT|M\/Y|S\/Y)\s+/i, "").trim();
}

/** The picks present in the fleet, cheapest week first (then top of card, then name). */
export function orderPicks(fleet = []) {
  const bySlug = new Map(fleet.map((y) => [y.slug, y]));
  return GEORGES_PICKS.map((s) => bySlug.get(s))
    .filter(Boolean)
    .map((y) => ({ ...y, _rate: rateRange(y.weeklyRatePrice), _len: lengthMetres(y.length) }))
    .filter((y) => y._rate)
    .sort((a, b) => a._rate.low - b._rate.low || a._rate.high - b._rate.high || shortName(a.name).localeCompare(shortName(b.name)));
}

const list = (arr) => (arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`);

/** Questions and answers about the picks, written in George's voice from live data. */
export function picksQA(ordered = []) {
  if (ordered.length < 2) return [];
  const first = ordered[0];
  const last = ordered.reduce((m, y) => (y._rate.high > m._rate.high ? y : m), ordered[0]);
  const names = ordered.map((y) => shortName(y.name));

  const counts = { "sailing catamaran": 0, "power catamaran": 0, "motor yacht": 0 };
  ordered.forEach((y) => { counts[typeOf(y.name)] += 1; });
  const plural = (n, s) => `${word(n)} ${s}${n === 1 ? "" : "s"}`;
  const mix = Object.entries(counts).filter(([, n]) => n > 0).map(([t, n]) => plural(n, t));

  const lens = ordered.map((y) => y._len).filter(Boolean);
  const berths = ordered
    .map((y) => ({ n: parseInt(String(y.sleeps ?? ""), 10), name: shortName(y.name) }))
    .filter((b) => Number.isFinite(b.n) && b.n > 0);
  const minB = berths.length ? Math.min(...berths.map((b) => b.n)) : null;
  const maxB = berths.length ? Math.max(...berths.map((b) => b.n)) : null;

  const qa = [
    {
      q: "Which yachts does George recommend first for a crewed charter in Greece?",
      a: `These ${word(ordered.length)} are my personal picks, set out from the lowest weekly rate to the highest: ${list(names)}. Each one is a fully crewed yacht on this list, and each has her own page with her rate card, her layout and her crew.`,
    },
    {
      q: "How much does a week on one of George's picks cost?",
      a: `From ${eur(first._rate.low)} a week on ${shortName(first.name)}, a ${typeOf(first.name)}${first._len ? ` of ${fmtM(first._len)}` : ""}, to ${eur(last._rate.high)} at the top of the card on ${shortName(last.name)}, a ${typeOf(last.name)}${last._len ? ` of ${fmtM(last._len)}` : ""}. That is the base charter fee per yacht per week with the crew aboard; APA, VAT at the yacht's certified rate and gratuity are set out separately, in writing.`,
    },
    {
      q: "Are George's picks catamarans or motor yachts?",
      a: `Both: ${list(mix)}${lens.length ? `, from ${fmtM(Math.min(...lens))} to ${fmtM(Math.max(...lens))}` : ""}. The row runs from the most accessible week to the most expensive, so the whole range sits in one line.`,
    },
  ];
  if (minB && maxB && minB !== maxB) {
    const smallest = berths.filter((b) => b.n === minB).map((b) => b.name);
    const largest = berths.filter((b) => b.n === maxB).map((b) => b.name);
    qa.push({
      q: "How many guests can George's picks take?",
      a: `From ${word(minB)} guests on ${list(smallest)} to ${word(maxB)} on ${list(largest)}. One price for the yacht, whatever the size of the party.`,
    });
  }
  qa.push({
    q: "Why these yachts, and how do I book one?",
    a: "Because they are the yachts I put forward first when a client asks me where to start, each one chosen personally. Tell me your dates, your party and what the week is for, and I will tell you honestly which of them fits, or which yacht on the full list fits better.",
  });
  return qa;
}
