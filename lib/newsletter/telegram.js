// Telegram helper for the newsletter system.
//
// George reuses the existing TELEGRAM_BOT_TOKEN bot rather than spinning
// a second one — this matters because Telegram bots can only have ONE
// webhook URL active at a time, and gy-command already owns it. To stay
// out of that contention zone, the newsletter system uses **URL inline
// buttons** instead of callback buttons. URL buttons open a https://
// link in the user's browser, no webhook involvement.
//
// Approval flow:
//   1. /api/cron/* generates a draft → writes draft:<id> to KV
//   2. We Telegram George with URL buttons:
//        ✅ Approve   → https://georgeyachts.com/api/newsletter/approve?id=<id>&token=<HMAC>
//        👀 Preview   → https://georgeyachts.com/api/newsletter/preview?id=<id>&token=<HMAC>
//        ❌ Cancel    → https://georgeyachts.com/api/newsletter/cancel?id=<id>&token=<HMAC>
//   3. George taps a button → page handler executes server-side → sends
//   4. Result back to Telegram as a fresh status message
//
// The token in each URL is an HMAC over (action, draft_id) using
// NEWSLETTER_UNSUB_SECRET as the key. It binds each button to its
// specific action, so tapping Preview can never accidentally fire a
// send.

import crypto from "node:crypto";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";

function tg() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN missing");
  }
  return `https://api.telegram.org/bot${token}`;
}

function chatId() {
  const id = process.env.TELEGRAM_CHAT_ID;
  if (!id) throw new Error("TELEGRAM_CHAT_ID missing");
  return id;
}

/**
 * HMAC-SHA256 token bound to (action, draft_id). Short enough for URL,
 * long enough that brute-force is uneconomical (~16 hex chars = 64 bits).
 * The full SHA-256 is overkill for what's effectively a single-use signed
 * link — we truncate to keep URLs scannable.
 */
export function signApprovalToken(action, draftId) {
  const secret = process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  if (!secret) throw new Error("NEWSLETTER_UNSUB_SECRET missing");
  return crypto
    .createHmac("sha256", secret)
    .update(`${action}:${draftId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyApprovalToken(action, draftId, provided) {
  const expected = signApprovalToken(action, draftId);
  if (typeof provided !== "string" || provided.length !== expected.length) {
    return false;
  }
  // constant-time compare
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(provided, "hex"),
  );
}

export function approvalUrl(action, draftId) {
  const token = signApprovalToken(action, draftId);
  return `${SITE}/api/newsletter/${action}?id=${encodeURIComponent(draftId)}&token=${token}`;
}

/**
 * Update 3 §1 — Bridge auto-cron menu buttons. Same HMAC pattern as
 * approvalUrl but the resource is a 3-tuple (action, fire_id, slug)
 * so the same fire_id can carry several distinct buttons (blog vs
 * yacht vs skip vs story-redirect) without token collision.
 */
export function autoBridgePickUrl({ action, fire_id, slug = "" }) {
  const secret =
    process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  if (!secret) throw new Error("NEWSLETTER_UNSUB_SECRET missing");
  const payload = `auto-bridge:${action}:${fire_id}:${slug}`;
  const token = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  const params = new URLSearchParams({
    action,
    fire_id,
    token,
  });
  if (slug) params.set("slug", slug);
  return `${SITE}/api/newsletter/auto-bridge-pick?${params.toString()}`;
}

export function verifyAutoBridgePickToken({ action, fire_id, slug = "", token }) {
  const secret =
    process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  if (!secret) return false;
  const payload = `auto-bridge:${action}:${fire_id}:${slug}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  if (typeof token !== "string" || token.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(token, "hex"),
  );
}

/**
 * Send a plain text message. Returns { ok, message_id }.
 */
export async function sendTelegramText(text, opts = {}) {
  const res = await fetch(`${tg()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId(),
      text,
      parse_mode: opts.parse_mode ?? "HTML",
      disable_web_page_preview: opts.disable_web_page_preview ?? true,
    }),
  });
  if (!res.ok) {
    return { ok: false, error: `telegram ${res.status}`, message_id: null };
  }
  const j = await res.json();
  return { ok: true, message_id: j?.result?.message_id ?? null };
}

/**
 * Send a message with URL inline keyboard. Each button is one row.
 * `buttons` shape: [{ text: "✅ Approve", url: "..." }, ...]
 */
export async function sendTelegramWithUrlButtons(text, buttons, opts = {}) {
  const inline_keyboard = buttons.map((b) => [{ text: b.text, url: b.url }]);
  const res = await fetch(`${tg()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId(),
      text,
      parse_mode: opts.parse_mode ?? "HTML",
      disable_web_page_preview: opts.disable_web_page_preview ?? true,
      reply_markup: { inline_keyboard },
    }),
  });
  if (!res.ok) {
    return { ok: false, error: `telegram ${res.status}`, message_id: null };
  }
  const j = await res.json();
  return { ok: true, message_id: j?.result?.message_id ?? null };
}

/**
 * Send a PHOTO with caption + URL inline keyboard. The image renders
 * inline in Telegram so George sees the actual hero before tapping
 * ✅ — a generic stock photo would scream visually.
 *
 * Telegram caption limit is 1024 chars; we truncate gracefully.
 */
export async function sendTelegramPhotoWithUrlButtons(
  photoUrl,
  caption,
  buttons,
  opts = {},
) {
  const inline_keyboard = buttons.map((b) => [{ text: b.text, url: b.url }]);
  const trimmed =
    caption && caption.length > 1024 ? caption.slice(0, 1020) + "…" : caption;
  const res = await fetch(`${tg()}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId(),
      photo: photoUrl,
      caption: trimmed,
      parse_mode: opts.parse_mode ?? "HTML",
      reply_markup: { inline_keyboard },
    }),
  });
  if (!res.ok) {
    return { ok: false, error: `telegram sendPhoto ${res.status}`, message_id: null };
  }
  const j = await res.json();
  return { ok: true, message_id: j?.result?.message_id ?? null };
}

/**
 * Edit an existing message's text — used after approve/cancel actions to
 * update the original draft card from "pending" to a final state.
 */
export async function editTelegramText(messageId, text, opts = {}) {
  if (!messageId) return { ok: false, error: "no message_id" };
  const res = await fetch(`${tg()}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId(),
      message_id: messageId,
      text,
      parse_mode: opts.parse_mode ?? "HTML",
      // Empty inline_keyboard removes the buttons after action.
      reply_markup: opts.keep_buttons ? undefined : { inline_keyboard: [] },
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    return { ok: false, error: `telegram edit ${res.status}` };
  }
  return { ok: true };
}

/**
 * Compose the standard "draft ready" approval card (Brief §7.2) and send
 * it. Returns the Telegram message_id so the draft KV record can store
 * it for later edit-on-completion.
 */
export async function sendDraftApprovalCard({
  draft_id,
  stream,
  issue_number,
  subject,
  audience_size,
  content_type,
  hero_image_url,
  word_count,
  reading_time_min,
  voice_violations = [],
  voice_warnings = [],
  voice_notes = null,    // Update 2 §5.3 — per-yacht "what NOT to say"
}) {
  const lines = [
    `📧 <b>DRAFT READY — The ${stream === "greece" ? "Greece" : capitalize(stream)}${issue_number ? ` — Issue #${issue_number}` : ""}</b>`,
    "",
    `<b>Subject:</b> ${escapeHtml(subject)}`,
    `<b>Audience:</b> ${audience_size} subscribers (${stream})`,
    `<b>Content type:</b> ${content_type ?? "—"}`,
    hero_image_url
      ? `<b>Hero photo:</b> ${escapeHtml(hero_image_url.split("/").pop() ?? "")} · ✅`
      : `<b>Hero photo:</b> none`,
    "",
    `<b>Word count:</b> ${word_count ?? "—"}`,
    `<b>Reading time:</b> ~${reading_time_min ?? "—"} min`,
    voice_violations.length
      ? `<b>⚠️ Voice violations:</b>\n${voice_violations.map((v) => `· ${v.rule}`).join("\n")}`
      : "",
    voice_warnings.length
      ? `<b>⚠️ Warnings:</b>\n${voice_warnings.map((v) => `· ${v.rule}`).join("\n")}`
      : "",
    voice_notes && voice_notes.trim()
      ? `\n<b>🗣 Voice notes for this yacht (what NOT to say):</b>\n<i>${escapeHtml(voice_notes.trim().slice(0, 400))}</i>\n\nVerify the body above does not contradict this guidance before tapping ✅.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const buttons = [
    { text: "👀 Preview HTML", url: approvalUrl("preview", draft_id) },
    { text: "✅ Approve & Send", url: approvalUrl("approve", draft_id) },
    { text: "❌ Abort", url: approvalUrl("cancel", draft_id) },
  ];

  // When we have a hero image, send it as a Telegram photo so George
  // sees what's about to ship, not just a URL. Caption carries all the
  // metadata; buttons sit underneath.
  // If sendPhoto fails (URL 404, oversized, geofenced, etc.), fall back
  // to a text card with the URL inlined. The brief's spirit is "George
  // sees the actual image"; if that's impossible we'd rather ship a
  // visible card than silently nothing.
  if (hero_image_url) {
    const photo = await sendTelegramPhotoWithUrlButtons(
      hero_image_url,
      lines,
      buttons,
    );
    if (photo.ok) return photo;
    const fallback = await sendTelegramWithUrlButtons(
      `${lines}\n\n⚠️ Hero photo failed to render in Telegram (${photo.error}). URL: ${hero_image_url}\nClick 👀 Preview HTML to see it in your browser before approving.`,
      buttons,
    );
    return {
      ...fallback,
      photo_fallback_reason: photo.error,
    };
  }
  return sendTelegramWithUrlButtons(lines, buttons);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function capitalize(s) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}
