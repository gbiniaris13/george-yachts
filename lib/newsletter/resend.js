// Thin Resend client + suppression-list helpers.
//
// Uses fetch + the Resend REST API directly so we don't add a new npm
// dependency. The endpoints we need are stable and documented:
//   POST   https://api.resend.com/emails        — send an email
//   POST   https://api.resend.com/emails/batch  — send up to 100 emails
//   GET    https://api.resend.com/emails/<id>   — fetch status
//
// FROM address policy:
//   Default `newsletter@georgeyachts.com` (apex domain — the verified
//   one in Resend). DKIM is on `resend._domainkey.georgeyachts.com`
//   so apex sends are DKIM-signed and DMARC-aligned via DKIM. The
//   `send` subdomain in DNS handles bounces / return-path only,
//   it's not a separately verified Resend domain (which is why an
//   earlier attempt to send FROM the subdomain failed with 403:
//   "send.georgeyachts.com domain is not verified" — Resend treats
//   each subdomain as a discrete domain entity).
//
//   SPF on the apex currently allows Google only. DKIM-aligned mail
//   still passes DMARC for the major receivers (Gmail, Outlook,
//   Yahoo, Apple Mail) without SPF alignment. If we ever see soft-
//   fail deliveries we'll widen apex SPF to add `include:amazonses.com`.
//
//   Reply-to stays on the apex `george@georgeyachts.com` so when
//   subscribers reply, it lands in George's normal Gmail inbox.
//
// Suppression list (Brief §16.1 idempotency + §12.4 bounce handling):
//   KV key `suppression:emails` — a Set<email> of addresses that must
//   never be mailed again. Maintained by the Resend webhook handler
//   when we see hard bounces or complaints. `assertNotSuppressed`
//   refuses to send to anyone on this list, so a bounce on Day 1 can
//   never re-bounce on Day 7.

import crypto from "node:crypto";
import { kvSadd, kvSismember } from "@/lib/kv";

const RESEND_API = "https://api.resend.com";
const SUPPRESSION_SET = "suppression:emails";

const DEFAULT_FROM =
  process.env.RESEND_FROM_ADDRESS ||
  "George Yachts <newsletter@georgeyachts.com>";
const DEFAULT_REPLY_TO =
  process.env.RESEND_REPLY_TO || "george@georgeyachts.com";

function apiKey() {
  const k = process.env.RESEND_API_KEY;
  if (!k) throw new Error("RESEND_API_KEY missing");
  return k;
}

/**
 * Per-recipient HMAC unsubscribe URL. Mirrors the format the legacy
 * /api/newsletter/unsubscribe endpoint already validates, so existing
 * tokens stay valid.
 */
export function unsubscribeUrlFor(email, opts = {}) {
  const secret =
    process.env.NEWSLETTER_UNSUB_SECRET ||
    process.env.CRON_SECRET ||
    "change-me";
  const lower = String(email).trim().toLowerCase();
  const t = crypto
    .createHmac("sha256", secret)
    .update(lower)
    .digest("hex")
    .slice(0, 24);
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
  const list = opts.list ? `&list=${encodeURIComponent(opts.list)}` : "";
  return `${base}/api/newsletter/unsubscribe?e=${encodeURIComponent(lower)}&t=${t}${list}`;
}

export async function isSuppressed(email) {
  const lower = String(email).trim().toLowerCase();
  try {
    const r = await kvSismember(SUPPRESSION_SET, lower);
    return r === 1 || r === "1";
  } catch {
    return false;
  }
}

export async function suppress(email, reason = "manual") {
  const lower = String(email).trim().toLowerCase();
  await kvSadd(SUPPRESSION_SET, lower).catch(() => {});
  return { email: lower, reason, at: new Date().toISOString() };
}

/**
 * Send a single email through Resend. Auto-injects:
 *   - List-Unsubscribe + List-Unsubscribe-Post (RFC 8058 one-click)
 *   - Reply-To header
 *   - Suppression-list refusal
 *
 * Returns:
 *   { ok: true,  message_id: string }
 *   { ok: false, error: string, suppressed?: true, status?: number }
 */
export async function sendNewsletterEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM,
  reply_to = DEFAULT_REPLY_TO,
  list, // "bridge" | "wake" | ... — added to unsub URL for granular unsub
  tags = [],
  extra_headers = {},
}) {
  const recipient = String(to).trim().toLowerCase();
  if (await isSuppressed(recipient)) {
    return { ok: false, error: "suppressed", suppressed: true, status: 0 };
  }

  const unsubUrl = unsubscribeUrlFor(recipient, { list });
  const headers = {
    "List-Unsubscribe": `<${unsubUrl}>, <mailto:george@georgeyachts.com?subject=Unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    ...extra_headers,
  };

  const body = {
    from,
    to: [recipient],
    subject,
    html,
    text,
    reply_to,
    headers,
    tags,
  };

  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return {
      ok: false,
      error: `resend ${res.status}: ${detail.slice(0, 200)}`,
      status: res.status,
    };
  }
  const j = await res.json();
  return { ok: true, message_id: j?.id ?? null };
}

/**
 * Convenience wrapper that builds the email from our own template
 * builder so callers only need (stream, subject, body_text, etc.).
 */
export async function sendNewsletterFromTemplate(args) {
  const { buildNewsletterEmail } = await import("./email-template.js");
  const built = buildNewsletterEmail({
    stream: args.stream,
    subject: args.subject,
    preheader: args.preheader,
    body_text: args.body_text,
    hero_image_url: args.hero_image_url,
    unsubscribe_url: unsubscribeUrlFor(args.to, { list: args.stream }),
    privacy_url: "https://georgeyachts.com/privacy-policy",
  });
  return sendNewsletterEmail({
    to: args.to,
    subject: built.subject,
    html: built.html,
    text: built.text,
    list: args.stream,
    tags: args.tags ?? [{ name: "stream", value: args.stream ?? "bridge" }],
  });
}
