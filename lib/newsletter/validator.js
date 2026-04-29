// Content validator — Brief §13 hard rules.
//
// Last line of defence before any newsletter goes out. Pure function.
// Returns { ok, violations: [{rule, evidence, severity}] }.
//
// Caller (cron, /announce, /offer, anything) MUST run this BEFORE
// firing Resend. If `ok === false`, the send must be blocked and
// the violations Telegrammed to George with a re-write request.
//
// The brief is the source of truth — every entry here cites the
// section that mandates it.

// ─── Static blocklists ─────────────────────────────────────────────

// Brief §13 rule 2: never reference central agents / management cos.
// Captured exact + lowercase variants. Keep generous — bias toward
// false positives because false negatives are reputational damage.
const FORBIDDEN_AGENT_NAMES = [
  "iyc",
  "international yacht company",
  "fraser",
  "fraser yachts",
  "fraseryachts",
  "burgess",
  "burgess yachts",
  "northrop & johnson",
  "northrop and johnson",
  "moravia",
  "moravia yachting",
  "edmiston",
  "ocean independence",
  "camper & nicholsons",
  "camper and nicholsons",
  "yco",
  "y.co",
  "ekka",
  "ekka yachts",
  "istion",
  "istion yachting",
  "cosmos yachting",
  "kavas",
  "kavas yachting",
  "fyly",
  "ekkayachts",
  "valef",
  "valef yachts",
  "boatbookings",
  "boatsetter",
  "click&boat",
  "myba",  // industry body name shouldn't appear in client letters
  "iyba",  // same
  "central agent",
  "central agency",
  "fleet manager",
  "yacht management company",
];

// Brief §13 rule 4: pricing only happens 1-on-1.
// Match: € / EUR / USD / $ followed by digits + optional k/K/m/M.
// Match: "per week" patterns with a price.
const PRICE_PATTERNS = [
  /€\s*\d[\d.,]*\s*(?:k|m|euros?|eur)?\b/i,
  /\b\d[\d.,]*\s*€/i,
  /\b(?:eur|usd|gbp|chf|aed)\s*\d[\d.,]*/i,
  /\$\s*\d[\d.,]*\s*(?:k|m|usd)?\b/i,
  /\b\d[\d.,]*\s*(?:k|m)\s*(?:per\s+week|\/\s*week|p\.?w\.?)\b/i,
  /\b\d[\d.,]*\s*(?:euros?|dollars?|pounds?)\b/i,
];

// Brief §13 rule 1: no specific yacht + specific week + specific price.
// Detect "week NN" or "wk NN" or specific date ranges.
const WEEK_PATTERNS = [
  /\bweek\s+\d{1,2}\b/i,
  /\bwk\s*\d{1,2}\b/i,
  /\bw\d{1,2}[\s,.]/i,
];

// Brief §13 rule 1 + 8.2 hard rule: avoid bookable specifics.
// Specific calendar dates with a year (DD/MM/YYYY, "August 5-12 2026", etc.)
const SPECIFIC_DATE_PATTERNS = [
  /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]20\d{2}\b/, // 05/08/2026
  /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\s*[-–]\s*\d{1,2}\b/i,
];

// Brief §13 rule 5: every issue should reference Greek waters / hospitality / filotimo.
// We don't BLOCK if missing (some intel issues are abstract), but we WARN.
const GREEK_CONTEXT_PATTERNS = [
  /\bgreek\b/i,
  /\bgreece\b/i,
  /\baegean\b/i,
  /\bionian\b/i,
  /\bcyclades?\b/i,
  /\bsporades?\b/i,
  /\bsaronic\b/i,
  /\bdodecanese\b/i,
  /\bathens\b/i,
  /\bfilotimo\b/i,
  /\bμεσογει|αιγαι|κυκλαδ|ελλην|αθηνα/i, // Greek-language equivalents
];

// Brief §13 rule 6: per-stream sign-off. Soft warn if missing the
// expected one (pre-send the cron stamps it; this is a defence in
// depth check).
const SIGN_OFFS = {
  bridge: ["— George", "-- George"],
  wake: ["— George Biniaris, George Yachts", "-- George Biniaris, George Yachts"],
  compass: ["— George Biniaris", "-- George Biniaris"],
  greece: ["— Γιώργος", "-- Γιώργος"],
};

// ─── Validator ─────────────────────────────────────────────────────

/**
 * @param {object} args
 * @param {string} args.body_text   plain-text body
 * @param {string} args.subject     subject line
 * @param {string} args.stream      "bridge" | "wake" | "compass" | "greece"
 * @param {string} args.content_type  "announcement" | "offer" | "story" | ...
 * @returns {{ ok: boolean, violations: Array, warnings: Array }}
 */
export function validateNewsletterContent(args) {
  const body = String(args.body_text ?? "");
  const subject = String(args.subject ?? "");
  const stream = String(args.stream ?? "");
  const contentType = String(args.content_type ?? "");
  const haystack = `${subject}\n\n${body}`.toLowerCase();
  const violations = [];
  const warnings = [];

  // RULE 1 — no specific yacht + specific week + specific price.
  // We can't know "yacht specific" without a yacht extractor; we DO
  // know weeks + prices. If a body has BOTH a week AND a price, that's
  // bookable-specifics → block.
  const weekHits = WEEK_PATTERNS.flatMap((re) => {
    const m = haystack.match(re);
    return m ? [m[0]] : [];
  });
  const priceHits = PRICE_PATTERNS.flatMap((re) => {
    const m = haystack.match(re);
    return m ? [m[0]] : [];
  });
  if (weekHits.length > 0 && priceHits.length > 0) {
    violations.push({
      rule: "§13.1 — no specific week + specific price",
      evidence: { weeks: weekHits, prices: priceHits },
      severity: "block",
    });
  }
  // Specific calendar dates alone are also a soft block for offers/announcements.
  const specificDateHits = SPECIFIC_DATE_PATTERNS.flatMap((re) => {
    const m = haystack.match(re);
    return m ? [m[0]] : [];
  });
  if (
    specificDateHits.length > 0 &&
    (contentType === "offer" || contentType === "announcement")
  ) {
    violations.push({
      rule: "§13.1 — no specific bookable dates in offer/announcement bodies",
      evidence: { dates: specificDateHits },
      severity: "block",
    });
  }

  // RULE 2 — no central agent / management company names.
  const agentHits = FORBIDDEN_AGENT_NAMES.filter((name) =>
    haystack.includes(name),
  );
  if (agentHits.length > 0) {
    violations.push({
      rule: "§13.2 — no central agent or management company names",
      evidence: agentHits,
      severity: "block",
    });
  }

  // RULE 4 — no pricing in the body for ANY content type.
  if (priceHits.length > 0) {
    violations.push({
      rule: "§13.4 — no prices in newsletter bodies (1-on-1 reply only)",
      evidence: priceHits,
      severity: "block",
    });
  }

  // RULE 5 — Greek waters context expected (warn for non-greeting types).
  const hasGreekContext = GREEK_CONTEXT_PATTERNS.some((re) => re.test(body));
  if (!hasGreekContext && contentType !== "industry") {
    warnings.push({
      rule: "§13.5 — Greek waters context missing",
      evidence: "no mention of Greece/Aegean/Ionian/Cyclades/Saronic/filotimo",
      severity: "warn",
    });
  }

  // RULE 6 — author attribution. Soft warn if missing.
  const expectedSignoffs = SIGN_OFFS[stream] ?? [];
  if (
    expectedSignoffs.length > 0 &&
    !expectedSignoffs.some((s) => body.includes(s))
  ) {
    warnings.push({
      rule: `§13.6 — expected author sign-off for stream ${stream}`,
      evidence: expectedSignoffs,
      severity: "warn",
    });
  }

  // §13 routing rule for offer→compass: enforced separately by router.js.
  // Body validator only checks content; routing enforces audience.

  const blocked = violations.filter((v) => v.severity === "block");
  return {
    ok: blocked.length === 0,
    violations,
    warnings,
  };
}
