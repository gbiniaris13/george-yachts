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

// Build the spec line: "[length] · [N] guests · [N] cabins · crew of [N]"
// Update 2 §4 "After" example. Skip any field that's empty.
function buildSpecLine(yacht) {
  const parts = [];
  if (yacht.length) parts.push(yacht.length);
  if (yacht.sleeps) parts.push(`${yacht.sleeps} guests`);
  if (yacht.cabins) parts.push(`${yacht.cabins} cabins`);
  if (yacht.crew) {
    // Sanity often stores crew as "2-3" or "2"; "crew of N" is the format.
    const c = String(yacht.crew).trim();
    parts.push(c.includes("-") ? `crew of ${c}` : `crew of ${c}`);
  }
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

  // "What I know about her:" block — only if Sanity's georgeInsiderTip
  // passes the voice gate. If it's marketing fluff or empty, OMIT
  // the entire block (§3.2.1: "If the data isn't there, the line
  // should not exist — not be replaced by a generic superlative.")
  let insiderBlock = "";
  if (yacht.georgeInsiderTip && !failsVoiceGate(yacht.georgeInsiderTip)) {
    insiderBlock = `\n\nWhat I know about her:\n${truncateAtSentence(yacht.georgeInsiderTip, 70)}`;
  }

  // Positioning sentence — comes from George's free text in the form.
  // §3.3 wants ONE sentence: "This is a family boat." or similar.
  // If no angle was supplied, omit — don't fabricate.
  const positioningLine =
    george_angle && george_angle.trim().length > 0
      ? `\n\n${george_angle.trim()}`
      : "";

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
