// Body assembler — Brief §8 templates per content type.
//
// Deterministic, template-driven. NO LLM call at runtime. Reasons:
//   1. Free-tier — no AI bill.
//   2. Zero hallucination — outputs are reproducible and reviewable.
//   3. Always passes §13 validator (no agent names, no prices, etc.)
//      because we never type those tokens into a slot.
//   4. George approves on Telegram before send anyway, so the value
//      of "creative variation" is near zero.
//
// Each builder takes:
//   - the operator's free-text angle (1-3 sentences, George's voice)
//   - structured slots from Sanity / form (yacht facts, blog excerpt)
// And returns:
//   { subject, preheader, body_text, content_type, hero_image_url, audience_suggested }
//
// Per-stream sign-off is appended automatically and matches the
// validator's SIGN_OFFS map. The byline policy (Brief §13.6 + the
// 2026-04-29 amendment "George P. Biniaris" everywhere except
// Bridge's warm "— George") is the single source of truth for naming.

import { truncateAtSentence } from "./sanity-yachts";
import { routeAudience } from "./router";

// ─── Sign-offs (mirrors validator.SIGN_OFFS) ───────────────────────
const SIGNOFFS = {
  bridge: "— George\n\nGeorge P. Biniaris\nManaging Broker, George Yachts\ngeorgeyachts.com",
  wake: "— George P. Biniaris, George Yachts\ngeorgeyachts.com",
  compass: "— George P. Biniaris\nGeorge Yachts · Greek waters",
  greece: "— Γιώργος\n\nΓιώργος Π. Μπινιάρης\nGeorge Yachts",
};

// ─── Stream-tone openings ──────────────────────────────────────────
// Brief §7 (voice). Bridge = warm-but-grounded. Wake = peer-collegial.
// Compass = clipped market memo. Greece = Greek personal.
const OPENERS = {
  bridge: "From Athens —",
  wake: "Quick note from Athens.",
  compass: "Athens, brief note.",
  greece: "Καλημέρα από Αθήνα —",
};

// ─── Helpers ────────────────────────────────────────────────────────

function withSignoff(stream, body) {
  const sig = SIGNOFFS[stream] ?? SIGNOFFS.bridge;
  return `${body.trim()}\n\n${sig}`;
}

function ensureGreekContext(body) {
  // Soft inject if no Greek term already present — defence in depth
  // for §13.5. Only used by intel/blog where the hand-written angle
  // might not mention waters.
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

// ─── §8.1 — Announcement (new yacht in fleet) ──────────────────────

export function buildAnnouncement({
  stream,
  yacht,            // from getYachtForNewsletter
  george_angle,     // 1-3 sentences from George — why HE likes her
  link_label = "See her on the site",
}) {
  if (!yacht) throw new Error("yacht required for announcement");
  const opener = OPENERS[stream] ?? OPENERS.bridge;
  const sub = yacht.subtitle ? ` — ${yacht.subtitle}` : "";

  // Subject lines tuned per stream voice.
  const subject =
    stream === "bridge"
      ? `New in our Greek fleet: ${yacht.name}`
      : stream === "wake"
        ? `New for your shortlist: ${yacht.name} (${yacht.length ?? ""}, ${yacht.cruisingRegion})`
        : stream === "compass"
          ? `${yacht.name} added — Greek waters fleet`
          : `Νέο σκάφος στον στόλο: ${yacht.name}`;

  const facts = [
    yacht.length && `${yacht.length}`,
    yacht.builder && `${yacht.builder}`,
    yacht.sleeps && `${yacht.sleeps} guests`,
    yacht.cabins && `${yacht.cabins} cabins`,
    yacht.crew && `${yacht.crew} crew`,
  ]
    .filter(Boolean)
    .join(" · ");

  const cruise = yacht.cruisingRegion
    ? `Cruises ${yacht.cruisingRegion}.`
    : "Cruises Greek waters.";

  const insider =
    yacht.georgeInsiderTip && yacht.georgeInsiderTip.length > 20
      ? `\n\nWhat I know about her: ${truncateAtSentence(yacht.georgeInsiderTip, 60)}`
      : "";

  const angle =
    george_angle && george_angle.trim().length > 0
      ? `\n\n${george_angle.trim()}`
      : "";

  const cta =
    stream === "compass"
      ? `\n\n${link_label}: ${yacht.page_url}`
      : `\n\nIf she sounds like the right fit for someone you know, hit reply. ${link_label}: ${yacht.page_url}`;

  const body = `${opener} ${yacht.name}${sub} has joined our Greek-waters fleet.\n\n${facts}. ${cruise}${insider}${angle}${cta}`;

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
// So the "offer" body is a posture-only nudge: "we have select
// availability worth knowing about" + George's framing + reply CTA.
// All specifics happen in the 1-on-1 reply.

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
        ? `Heads up — availability worth knowing${subjectName}`
        : `Availability note${subjectName}`;

  const yachtLine = yacht
    ? `On ${yacht.name}${yacht.subtitle ? ` (${yacht.subtitle})` : ""}, cruising ${yacht.cruisingRegion ?? "Greek waters"}.`
    : "Across our Greek-waters fleet.";

  const angle = george_angle?.trim()
    ? `\n\n${george_angle.trim()}`
    : "\n\nQuiet word: a few of the right pieces are lining up.";

  const close = `\n\nIf there's a stretch of summer you've been turning over for someone, hit reply and I'll pull what's actually open — no calendar, just a real conversation.`;

  const link = yacht?.page_url ? `\n\nMore on her: ${yacht.page_url}` : "";

  const body = `${opener} I have ${posture} this season worth a quick word.\n\n${yachtLine}${angle}${close}${link}`;

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

  // Minimal framing — let George's voice carry.
  const opener =
    stream === "greece"
      ? "" // Greek-language stories are personal; no opener needed
      : ""; // Free-form for all streams

  const body = opener
    ? `${opener}\n\n${body_text.trim()}`
    : body_text.trim();

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
// Wake + Compass primary. Bridge sometimes (only if client-relevant).
// Tone differs PER STREAM — Wake = collegial advisor briefing,
// Compass = clipped peer memo, Bridge = soft market context.

export function buildIntel({
  stream,
  headline,
  signal_text,      // George's intel — 80-200 words
  source_note = null,  // optional one-line attribution context
}) {
  if (!signal_text || signal_text.trim().length < 40) {
    throw new Error("intel signal_text too short");
  }
  const opener = OPENERS[stream] ?? OPENERS.wake;

  const subject =
    stream === "compass"
      ? headline?.trim() || "Greek-waters signal"
      : stream === "wake"
        ? `Greek-waters intel: ${headline?.trim() || "what we're seeing"}`
        : `What we're seeing in Greek waters`;

  const body = `${opener} ${headline?.trim() ? headline.trim() + "." : "Quick signal."}\n\n${signal_text.trim()}${source_note ? `\n\n(${source_note.trim()})` : ""}\n\nIf you're tracking the same pattern, hit reply.`;

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

  const body = `${opener} I wrote something new.\n\n${post.title}\n\n${teaser}${angle}\n\nRead the full piece: ${post.page_url}`;

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
