// Body assembler — Brief §8 templates per content type.
//
// Deterministic, template-driven. NO LLM call at runtime. Reasons:
//   1. Free-tier — no AI bill.
//   2. Zero hallucination — outputs are reproducible and reviewable.
//   3. Always passes §13 validator + Update 2 §5.1 hard rules
//      because we never type those tokens into a slot.
//   4. George approves on Telegram before send anyway, so the value
//      of "creative variation" is near zero.
//
// Update 2 §3 voice rules — encoded here as templates, not as
// runtime LLM nudges:
//   • Lead with what you know, not what's claimed
//   • One specific over three generic
//   • Working broker tone (no marketing energy, no second-person sales)
//   • Sign-off "— George" (one em-dash, no period)
//   • Stripped Sanity inputs: subtitle ALL CAPS marketing fragments
//     are filtered, georgeInsiderTip is validated before inclusion
//   • If a field's content is empty or fails the voice gate, the
//     line is OMITTED — never replaced with a generic superlative
//
// Each builder returns:
//   { subject, preheader, body_text, content_type, hero_image_url, audience_suggested }

import { truncateAtSentence } from "./sanity-yachts";
import { routeAudience } from "./router";

// ─── Sign-offs (mirrors validator.SIGN_OFFS) ───────────────────────
const SIGNOFFS = {
  bridge: "— George\n\nGeorge P. Biniaris\nManaging Broker, George Yachts\ngeorgeyachts.com",
  wake: "— George P. Biniaris, George Yachts\ngeorgeyachts.com",
  compass: "— George P. Biniaris\nGeorge Yachts · Greek waters",
  greece: "— Γιώργος\n\nΓιώργος Π. Μπινιάρης\nGeorge Yachts",
};

// ─── Stream-tone openers ───────────────────────────────────────────
// Update 2 §3.4 specifies per-flow per-stream openers. Defaults
// listed here are the /announce defaults; per-flow overrides below.
const OPENERS = {
  bridge: "From Athens —",
  wake: "For your Greek-waters file —",
  compass: "Athens, brief note.",
  greece: "Καλημέρα από Αθήνα —",
};

// ─── Voice gate (mirror of validator.js banned phrases) ────────────
// Used INSIDE the assembler to drop Sanity-sourced strings before
// they ever make it into the body. The validator is the last line of
// defense; this is the first. Same word list — keep them in sync.
const VOICE_BANNED = [
  "5-star", "5 stars", "five-star", "five stars",
  "★★★", "⭐⭐⭐", "top-rated", "top rated", "award-winning", "award winning",
  "family favourite", "family favorite", "best in class", "best-in-class",
  "limited time", "limited-time", "exclusive offer", "act now", "book now",
  "extraordinary", "world-class", "world class", "unparalleled",
  "state of the art", "state-of-the-art", "truly unique",
  "one of a kind", "one-of-a-kind", "the best week of",
  "year after year", "hard to quantify", "something special",
  "guests rave", "rave reviews", "a truly memorable", "memorable journey",
];

const ALL_CAPS_RUN_RE = /\b([A-Z][A-Z0-9&'-]{1,}\s+){2,}[A-Z][A-Z0-9&'-]{1,}\b/g;

/**
 * True if a Sanity-sourced string contains any banned-phrase pattern
 * or 3+ consecutive ALL CAPS words. We use this to gate inclusion
 * of free-text fields like georgeInsiderTip.
 */
function failsVoiceGate(text) {
  if (!text || typeof text !== "string") return true; // empty = drop
  const t = text.toLowerCase();
  for (const p of VOICE_BANNED) {
    if (t.includes(p)) return true;
  }
  if (ALL_CAPS_RUN_RE.test(text)) return true;
  // Update 2 §3.1.4: drop the insider/free-text source if any line
  // has more than 1 em-dash. Keeps the validator from blocking a
  // structurally valid /announce just because Sanity content has
  // parenthetical em-dashes ("Captain Zacharias — Yachtmaster — has
  // been on board since 2019.")
  for (const line of text.split("\n")) {
    if ((line.match(/—/g) ?? []).length > 1) return true;
  }
  return false;
}

/**
 * Take a yacht's `subtitle` field (which often contains marketing
 * fluff like "LAGOON 52 | 5-STAR REVIEWS, FAMILY FAVOURITE") and
 * extract just the boat-class fragment ("Lagoon 52"). Strategy:
 *   1. Split on common separators: |, ·, —, ,, /
 *   2. Drop fragments that are pure ALL CAPS or contain banned phrases
 *   3. Title-case the survivor (e.g. "LAGOON 52" → "Lagoon 52")
 *   4. If nothing survives, return null (caller skips the line)
 */
function cleanClassFragment(subtitle) {
  if (!subtitle || typeof subtitle !== "string") return null;
  // Split on common separators but NOT on `/` — that would
  // destroy marine acronyms (M/Y, S/Y, S/CAT, M/V).
  const segments = subtitle
    .split(/[|·—,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const seg of segments) {
    if (failsVoiceGate(seg)) continue;
    // Title-case ALL CAPS segments. Leave mixed case alone.
    if (seg === seg.toUpperCase()) {
      return seg
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
        // Preserve common marine acronyms
        .replace(/\bMy\b/, "M/Y")
        .replace(/\bSy\b/, "S/Y")
        .replace(/\bScat\b/i, "S/CAT");
    }
    return seg;
  }
  return null;
}

// ─── Helpers ────────────────────────────────────────────────────────

function withSignoff(stream, body) {
  const sig = SIGNOFFS[stream] ?? SIGNOFFS.bridge;
  return `${body.trim()}\n\n${sig}`;
}

function ensureGreekContext(body) {
  if (/greek|greece|aegean|ionian|cyclades|saronic|sporades|filotimo/i.test(body)) {
    return body;
  }
  return `${body}\n\n(Context: Greek waters, where George Yachts works exclusively.)`;
}

function preheaderFrom(body, fallback) {
  const first = String(body).split(/\n+/).map((s) => s.trim()).find(Boolean) ?? "";
  if (first.length > 20 && first.length < 130) return first;
  return fallback;
}

// Ordinal helper for "she's in her 6th season" lines.
function ordinal(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 1) return null;
  const mod10 = num % 10;
  const mod100 = num % 100;
  if (mod10 === 1 && mod100 !== 11) return `${num}st`;
  if (mod10 === 2 && mod100 !== 12) return `${num}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${num}rd`;
  return `${num}th`;
}

/**
 * Update 2 §5.3 amendment (2026-04-29) — STABLE-INFO-ONLY insider
 * block. Crew identities (captain/chef names + credentials) are
 * volatile across bookings; emitting them in a sent newsletter
 * creates a credibility liability when George later talks to a
 * client and the crew has changed. Body now sources only fields
 * that are properties of the BOAT, not of its current personnel:
 *
 *   1. First 1-2 sentences of the Sanity `description` (Portable
 *      Text → plain via pt::text()), voice-gated. This is George's
 *      curated boat-level prose — long-lived.
 *   2. `idealFor` if set — "Built for {idealFor}." Boat-level.
 *   3. `seasons_active_count` if ≥2 — "She's in her Nth season with
 *      us." Boat-level (number of seasons under our brokerage).
 *
 * Each line voice-gated; failed inputs silently dropped. Returns
 * empty string if nothing populated → caller falls back to
 * `georgeInsiderTip` (also voice-gated) → omission per §3.2.1.
 *
 * NOTE: captain_name, captain_on_board_since, captain_credentials_short,
 *       chef_name, chef_specialty_one_line are intentionally NOT
 *       read here. They remain in the schema as record-of-truth
 *       for admin contexts (e.g. /intel safety briefings) but
 *       never appear in /announce.
 */
function buildInsiderBlockFromStable(y) {
  const lines = [];

  // 1. Description excerpt — first 1-2 sentences, ~50 words.
  if (y.description_text && !failsVoiceGate(y.description_text)) {
    const trimmed = truncateAtSentence(y.description_text, 50);
    if (trimmed && trimmed.length >= 30) lines.push(trimmed);
  }

  // 2. idealFor → positioning of who-she-fits in one breath.
  // Voice-gated and trailing-punctuation-cleaned to avoid double dots.
  const ideal = y.idealFor?.trim().replace(/[.!?,;:]+$/, "");
  if (ideal && !failsVoiceGate(ideal)) {
    lines.push(`Built for ${ideal}.`);
  }

  // 3. Seasons-active line — only when meaningful (≥2 seasons).
  // This is a property of the BOAT under our brokerage, not of any
  // specific captain.
  const seasonOrd = ordinal(y.seasons_active_count);
  if (seasonOrd && Number(y.seasons_active_count) >= 2) {
    lines.push(`She's in her ${seasonOrd} season with us.`);
  }

  return lines.join(" ");
}

/**
 * Extract just the numeric crew count from the Sanity `crew` field,
 * which George's records sometimes contain a full crew bio:
 *   "2-3 — Captain Zacharias (Yachtmaster Offshore), Cook/Hostess Elena…"
 * We want only "2-3" for the spec line. Anything past the first
 * non-digit/hyphen character is dropped; the bio info belongs in
 * the "What I know about her:" block, not the spec line.
 */
function sanitizeCrewCount(crewRaw) {
  if (crewRaw == null) return null;
  const s = String(crewRaw).trim();
  const m = s.match(/^(\d+(?:\s*[-–]\s*\d+)?)/);
  if (!m) return null;
  return m[1].replace(/\s+/g, "");
}

/**
 * Strip imperial conversion from length so we get "15.84m" instead of
 * "15.84 m / 52 ft". Update 2 §4 "After" target uses metric only —
 * the audience is European and the imperial parenthetical is clutter.
 */
function sanitizeLength(lengthRaw) {
  if (lengthRaw == null) return null;
  const s = String(lengthRaw).trim();
  // "15.84 m / 52 ft" → "15.84 m" → "15.84m"
  const m = s.match(/^(\d+(?:[.,]\d+)?\s*m\b)/i);
  if (m) return m[1].replace(/\s+/g, "");
  // Fallback: return as-is, just collapsed whitespace
  return s.replace(/\s+/g, " ");
}

// Build the spec line: "[length] · [N] guests · [N] cabins · crew of [N]"
// Update 2 §4 "After" example. Sanitize each field so stuffed-in
// Sanity values don't leak through ("crew of 2-3 — Captain Zacharias…").
function buildSpecLine(yacht) {
  const parts = [];
  const len = sanitizeLength(yacht.length);
  if (len) parts.push(len);
  if (yacht.sleeps) parts.push(`${yacht.sleeps} guests`);
  if (yacht.cabins) parts.push(`${yacht.cabins} cabins`);
  const crewCount = sanitizeCrewCount(yacht.crew);
  if (crewCount) parts.push(`crew of ${crewCount}`);
  return parts.join(" · ");
}

// ─── §8.1 — Announcement (new yacht in fleet) ──────────────────────
//
// Rewritten per Update 2 §3.3 + §4 "After" spec. Strict skeleton,
// breathing whitespace, no header clutter, voice-gated insider note.

export function buildAnnouncement({
  stream,
  yacht,            // from getYachtForNewsletter
  george_angle,     // 1-3 sentences from George — used as the
                    // positioning line per §3.3 ("This is a family boat.")
  link_label = "See her on the site",
  include_captain_credentials = false,  // Composer UI checkbox
                                        // per Update 2 caveat #1
}) {
  if (!yacht) throw new Error("yacht required for announcement");

  // Per-stream opener (§3.4)
  const opener = OPENERS[stream] ?? OPENERS.bridge;

  // Subject lines tuned per stream voice — no badges, no clutter.
  const subject =
    stream === "bridge"
      ? `New in our Greek fleet: ${yacht.name}`
      : stream === "wake"
        ? `For your file: ${yacht.name} (Greek waters)`
        : stream === "compass"
          ? `Fleet add — ${yacht.name}`
          : `Νέο σκάφος στον στόλο: ${yacht.name}`;

  // Class line. Prefer cleaned subtitle, fall back to builder, fall
  // back to nothing. NEVER emit "5-STAR REVIEWS" etc.
  const cleanedClass = cleanClassFragment(yacht.subtitle);
  const classLine = cleanedClass
    ? `${yacht.name} — ${cleanedClass}`
    : yacht.builder
      ? `${yacht.name} — ${yacht.builder}`
      : yacht.name;

  // Spec line per §4 "After"
  const specs = buildSpecLine(yacht);

  // "What I know about her:" block. Update 2 §5.3 amendment priority:
  //   1. STABLE yacht-level info from Sanity (description excerpt,
  //      idealFor, seasons_active_count) — boat-level, not crew-level
  //   2. Fallback to legacy georgeInsiderTip if stable is empty AND
  //      the tip passes the voice gate
  //   3. Otherwise OMIT entirely (§3.2.1: never fabricate)
  //
  // Crew identities (captain_name, chef_name, captain_credentials_short)
  // are deliberately NOT used here — they're volatile across bookings.
  const stableInsider = buildInsiderBlockFromStable(yacht);
  let insiderBlock = "";
  if (stableInsider) {
    insiderBlock = `\n\nWhat I know about her:\n${stableInsider}`;
  } else if (yacht.georgeInsiderTip && !failsVoiceGate(yacht.georgeInsiderTip)) {
    insiderBlock = `\n\nWhat I know about her:\n${truncateAtSentence(yacht.georgeInsiderTip, 70)}`;
  }

  // Positioning sentence. Priority:
  //   1. George's per-issue angle (always wins — most contextual)
  //   2. yacht.positioning_one_liner from Sanity (default for the boat)
  //   3. Omit (§3.2.1: never fabricate)
  let positioningLine = "";
  const angleClean = george_angle?.trim();
  const posClean = yacht.positioning_one_liner?.trim();
  if (angleClean) {
    positioningLine = `\n\n${angleClean}`;
  } else if (posClean && !failsVoiceGate(posClean)) {
    positioningLine = `\n\n${posClean}`;
  }

  // CTA per §3.5. Wake gets a slightly more functional CTA than Bridge.
  const cta =
    stream === "wake"
      ? `\n\nIf she fits a brief you're working on, hit reply.`
      : stream === "compass"
        ? `\n\n${link_label}: ${yacht.page_url}`
        : `\n\nIf she sounds like the right fit for someone you know, hit reply.`;

  // Page link line. Wake gets it; Bridge gets it as the closing
  // breadcrumb after the CTA. Compass already has it inline above.
  const pageLink =
    stream === "compass"
      ? ""
      : yacht.page_url
        ? `\n\n${link_label}: ${yacht.page_url}`
        : "";

  // Assemble. Update 2 §4 "After" — opener on its own line, blank
  // line, then a single declarative sentence, then class + specs,
  // then insider, then positioning, then CTA, then link.
  const body = [
    opener,
    "",
    "A new boat just joined our Greek-waters fleet.",
    "",
    classLine,
    specs,
  ]
    .filter((line, i) => i < 6 || line) // keep first 6 even if blank
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    + insiderBlock
    + positioningLine
    + cta
    + pageLink;

  return {
    subject,
    preheader: preheaderFrom(body, `New in our fleet — ${yacht.name}.`),
    body_text: withSignoff(stream, body),
    content_type: "announcement",
    hero_image_url: yacht.hero_image_url ?? null,
    audience_suggested: routeAudience("announcement").suggested,
  };
}

// ─── §8.2 — Offer (special week / discount) ────────────────────────
// Brief §13.1 + §13.4 are EXTREMELY strict here:
//   - no specific bookable week
//   - no prices ever
//   - no calendar dates
// Update 2 §3.5: soft urgency, no marketing. Close with "Reply if any
// of your clients are still deciding on Greece this summer."

export function buildOffer({
  stream,
  yacht,            // optional — generic offer if absent
  george_angle,     // mandatory — what's the human reason
  posture = "select availability",
}) {
  const opener = OPENERS[stream] ?? OPENERS.bridge;
  const subjectName = yacht?.name ? ` — ${yacht.name}` : "";

  const subject =
    stream === "bridge"
      ? `A note about availability${subjectName}`
      : stream === "wake"
        ? `Greek waters availability${subjectName}`
        : `Availability note${subjectName}`;

  const yachtLine = yacht
    ? `On ${yacht.name}${cleanClassFragment(yacht.subtitle) ? ` (${cleanClassFragment(yacht.subtitle)})` : ""}, cruising ${yacht.cruisingRegion ?? "Greek waters"}.`
    : "Across our Greek-waters fleet.";

  const angle = george_angle?.trim()
    ? `\n\n${george_angle.trim()}`
    : "\n\nA quiet word: a few of the right pieces are lining up.";

  // §3.5 Wake CTA is more functional than Bridge.
  const close =
    stream === "wake"
      ? `\n\nReply if any of your clients are still deciding on Greece this summer.`
      : `\n\nIf you've been thinking about a stretch of summer for someone, hit reply and I'll pull what's actually open. No calendar — a real conversation.`;

  const link = yacht?.page_url ? `\n\nMore on her: ${yacht.page_url}` : "";

  const body = `${opener}\n\nI have ${posture} this season worth a quick word.\n\n${yachtLine}${angle}${close}${link}`;

  return {
    subject,
    preheader: preheaderFrom(body, "A note about availability."),
    body_text: withSignoff(stream, body),
    content_type: "offer",
    hero_image_url: yacht?.hero_image_url ?? null,
    audience_suggested: routeAudience("offer").suggested, // bridge + wake only
  };
}

// ─── §8.3 — Story / charter recap (George's free text) ─────────────
// Update 2 §3.5: personal + warm, lead with a specific moment, often
// no CTA. Story stands alone.

export function buildStory({
  stream,
  subject_line,
  body_text,        // George's whole story, hand-written
  hero_image_url = null,
}) {
  if (!body_text || body_text.trim().length < 40) {
    throw new Error("story body_text too short");
  }
  const subject =
    subject_line?.trim() ||
    (stream === "greece" ? "Από τη γέφυρα" : "From the bridge");

  // No template framing — George's voice carries. We don't even
  // prepend the opener for stories (§3.5: "personal, warm, lead with
  // a specific moment"). Whatever he wrote IS the body.
  const body = body_text.trim();

  return {
    subject,
    preheader: preheaderFrom(body, subject),
    body_text: withSignoff(stream, body),
    content_type: "story",
    hero_image_url,
    audience_suggested: routeAudience("story").suggested,
  };
}

// ─── §8.5 — Intel / market signal ──────────────────────────────────
// Update 2 §3.5: industry-peer tone, no fluff, lead with the signal,
// close with "Reply if you want the data behind this."

export function buildIntel({
  stream,
  headline,
  signal_text,      // George's intel — 80-200 words
  source_note = null,
}) {
  if (!signal_text || signal_text.trim().length < 40) {
    throw new Error("intel signal_text too short");
  }

  // Compass: clipped peer memo. Wake: collegial advisor briefing.
  // Bridge: soft market context. Different opener per stream.
  const opener =
    stream === "compass"
      ? "Athens, brief note."
      : stream === "wake"
        ? "For your Greek-waters file —"
        : "Quick read from Athens —";

  const subject =
    stream === "compass"
      ? headline?.trim() || "Greek-waters signal"
      : stream === "wake"
        ? `Greek-waters intel: ${headline?.trim() || "what we're seeing"}`
        : `What we're seeing in Greek waters`;

  const headlineLine = headline?.trim()
    ? `\n\n${headline.trim()}.`
    : "";

  const sourceLine = source_note?.trim()
    ? `\n\n(${source_note.trim()})`
    : "";

  const close = `\n\nReply if you want the data behind this.`;

  const body = `${opener}${headlineLine}\n\n${signal_text.trim()}${sourceLine}${close}`;
  const withCtx = ensureGreekContext(body);

  return {
    subject,
    preheader: preheaderFrom(withCtx, headline?.trim() || "Greek-waters signal"),
    body_text: withSignoff(stream, withCtx),
    content_type: "intel",
    hero_image_url: null,
    audience_suggested: routeAudience("intel").suggested,
  };
}

// ─── §8.4 — Blog recap ─────────────────────────────────────────────
// Update 2 §3.5: editorial framing, slightly distanced, link to read.
// No body filler.

export function buildBlogRecap({
  stream,
  post,             // from getPostForNewsletter
  george_angle,     // why this post matters NOW
}) {
  if (!post) throw new Error("post required for blog recap");
  const opener = OPENERS[stream] ?? OPENERS.bridge;

  const subject =
    stream === "bridge"
      ? `${post.title}`
      : `New on the site: ${post.title}`;

  const teaser = post.excerpt
    ? truncateAtSentence(post.excerpt, 50)
    : "I wrote something new on the site.";

  const angle = george_angle?.trim()
    ? `\n\n${george_angle.trim()}`
    : "";

  const body = `${opener}\n\n${post.title}\n\n${teaser}${angle}\n\nRead the full piece: ${post.page_url}`;

  return {
    subject,
    preheader: preheaderFrom(body, post.title),
    body_text: withSignoff(stream, body),
    content_type: "blog",
    hero_image_url: post.hero_image_url ?? null,
    audience_suggested: routeAudience("blog").suggested,
  };
}

// ─── Dispatcher ─────────────────────────────────────────────────────

export function assembleBody(args) {
  switch (args.content_type) {
    case "announcement":
      return buildAnnouncement(args);
    case "offer":
      return buildOffer(args);
    case "story":
      return buildStory(args);
    case "intel":
      return buildIntel(args);
    case "blog":
      return buildBlogRecap(args);
    default:
      throw new Error(`unknown content_type: ${args.content_type}`);
  }
}
