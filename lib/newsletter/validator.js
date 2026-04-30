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
  /μεσογει|αιγαι|κυκλαδ|ελλην|αθηνα|ιονι|σποραδ|σαρων|δωδεκαν|υδρα|σπετσ|μυκον|σαντορ|κρητ|παρο|κυθν|μηλο|φιλοτιμ/i, // Greek-language equivalents (waters + islands + filotimo)
];

// Update 2 §5.1 — Voice hard rules.
// Booking.com-style marketing language destroys George's voice.
// These three regex sets are checked against every body before
// draft creation. Any hit = block + Telegram warning, never auto-fix.

// Banned phrases (case-insensitive substring match). Appear in
// generic AI superlatives, OTA badge syntax, and "rave review" filler
// that contradicts Issue #1's promise: "you will not get a calendar
// of yachts to book." Working brokers don't write these phrases.
const BANNED_PHRASES = [
  // Badge / OTA syntax
  "5-star",
  "5 stars",
  "five-star",
  "five stars",
  "★★★",
  "⭐⭐⭐",
  "top-rated",
  "top rated",
  "award-winning",
  "award winning",
  "family favourite",
  "family favorite",
  "best in class",
  "best-in-class",
  "limited time",
  "limited-time",
  "exclusive offer",
  "act now",
  "book now",
  // Empty AI superlatives
  "extraordinary",
  "world-class",
  "world class",
  "unparalleled",
  "state of the art",
  "state-of-the-art",
  "truly unique",
  "one of a kind",
  "one-of-a-kind",
  "the best week of",
  "year after year",
  "hard to quantify",
  "something special",
  "guests rave",
  "rave reviews",
  "a truly memorable",
  "memorable journey",
];

// Detect 3+ consecutive ALL CAPS words. Vessel names and 1-2 word
// brand terms are allowed (e.g. "SUMMER STAR" in masthead is fine);
// 3+ in a row is marketing copy ("5-STAR REVIEWS, FAMILY FAVOURITE").
// We only check inside body content, after stripping the masthead
// and a known-safe prefix list.
const ALL_CAPS_RUN_RE = /\b([A-Z][A-Z0-9&'-]{1,}\s+){2,}[A-Z][A-Z0-9&'-]{1,}\b/g;

// Badge syntax: stars + marketing-badge-words after em-dash.
// We catch the OTA-style badges that the brief banned ("— EXCLUSIVE",
// "— BEST", "— LIMITED OFFER" etc.) but explicitly allow neutral
// caps following an em-dash that are NOT marketing language: yacht
// brand names (LAGOON, AZIMUT, SUNSEEKER), region names (CYCLADES,
// IONIAN), or a captain's surname in caps. Those are factual content
// in offer/announce bodies, not advertising puff.
const BADGE_WORDS = [
  "EXCLUSIVE", "LIMITED", "FEATURED", "PREMIUM", "BEST", "HOT",
  "SALE", "DEAL", "SPECIAL", "OFFER", "MUST-SEE", "MUST", "ONLY",
  "NEW", "RARE", "WOW", "VIP", "TOP",
];
const BADGE_PATTERNS = [
  /[★⭐]/,                                                            // any star char
  new RegExp(`—\\s+(?:${BADGE_WORDS.join("|")})\\b`, "i"),          // "— BEST", "— EXCLUSIVE"
];

// Em-dash counter — Update 2 §3.1.4 says max 1 per sentence in body
// copy AND max 1 per line in headers. We enforce per-LINE which
// covers both: header lines, spec lines, and most prose lines.
//
// Multi-sentence paragraphs that legitimately need 2 em-dashes
// (parenthetical asides) should be rewritten as two sentences with
// commas — that's the Update 2 voice rule, not a workaround.
function countEmDashes(s) {
  return (s.match(/—/g) ?? []).length;
}
function tooManyEmDashes(body) {
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    // Allow visual divider lines that consist only of em-dashes (and
    // optional whitespace). Those aren't prose, they're section breaks.
    if (/^[—\s]+$/.test(trimmed) && trimmed.length > 0) {
      continue;
    }
    if (countEmDashes(line) > 1) {
      return { rule: "line", evidence: line.trim().slice(0, 160) };
    }
  }
  return null;
}

// Brief §13 rule 6: per-stream sign-off. Soft warn if missing the
// expected one (pre-send the cron stamps it; this is a defence in
// depth check).
//
// 2026-04-29 amendment: George's full byline carries the middle
// initial — "George P. Biniaris" everywhere it's used as a formal
// signature. Bridge stays the warm "— George".
const SIGN_OFFS = {
  bridge: ["— George", "-- George"],
  wake: [
    "— George P. Biniaris, George Yachts",
    "-- George P. Biniaris, George Yachts",
  ],
  compass: ["— George P. Biniaris", "-- George P. Biniaris"],
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

  // RULE 2.5 — Update 2 §5.1: banned phrases (Booking.com / OTA
  // badge syntax + empty AI superlatives). These contradict Issue
  // #1's promise of restraint. Working brokers don't write them.
  const phraseHits = BANNED_PHRASES.filter((p) => haystack.includes(p));
  if (phraseHits.length > 0) {
    violations.push({
      rule: "Update 2 §5.1 — banned phrases (badge syntax / empty superlatives)",
      evidence: phraseHits,
      severity: "block",
    });
  }

  // RULE 2.6 — Update 2 §3.1.1: 3+ consecutive ALL CAPS words.
  // Vessel names in mastheads are fine; runs of marketing copy
  // ("5-STAR REVIEWS, FAMILY FAVOURITE") destroy the voice.
  const allCapsHits = body.match(ALL_CAPS_RUN_RE);
  if (allCapsHits && allCapsHits.length > 0) {
    violations.push({
      rule: "Update 2 §3.1.1 — 3+ consecutive ALL CAPS words in body",
      evidence: allCapsHits.slice(0, 3),
      severity: "block",
    });
  }

  // RULE 2.7 — Update 2 §3.1.3: badge syntax (stars + em-dash-followed-by-CAPS)
  for (const re of BADGE_PATTERNS) {
    const m = body.match(re);
    if (m) {
      violations.push({
        rule: "Update 2 §3.1.3 — badge syntax (stars or em-dash followed by ALL CAPS)",
        evidence: [m[0]],
        severity: "block",
      });
      break;
    }
  }

  // RULE 2.8 — Update 2 §3.1.4: em-dash limits.
  const dashIssue = tooManyEmDashes(body);
  if (dashIssue) {
    violations.push({
      rule: `Update 2 §3.1.4 — em-dash overuse (max 1 per line; rewrite the parenthetical aside as two sentences with commas)`,
      evidence: dashIssue.evidence,
      severity: "block",
    });
  }

  // RULE 4 — no pricing in the body. EXCEPTION: OFFER stream legitimately
  // exists to surface time-bound deals, and a deal without a price is not
  // a deal — it's a paragraph. For content_type === "offer" we downgrade
  // §13.4 from a hard block to a soft "warn" so the operator sees the
  // flag but the send proceeds. All other content types keep the block.
  if (priceHits.length > 0) {
    const isOffer = contentType === "offer";
    violations.push({
      rule: "§13.4 — no prices in newsletter bodies (1-on-1 reply only)",
      evidence: priceHits,
      severity: isOffer ? "warn" : "block",
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
