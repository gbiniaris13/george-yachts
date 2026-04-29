// Phase 5.3 — Re-engagement campaign.
//
// One-time, soft, never noisy. The flow:
//
//   1. /api/admin/newsletter-engagement?stream=<X> identifies candidates
//      (no opens/clicks in 180 days, ≥ 90 days on list, ≥ 2 sends).
//   2. George (manually, or via the CRM admin tab in Phase 6) POSTs the
//      candidate list to /api/admin/newsletter-reengage.
//   3. Each address gets a single re-engagement email — warm, in
//      George's voice, with one CTA: "Yes, keep sending."
//   4. The CTA URL carries an HMAC token bound to the address. Click
//      → /api/newsletter/reengage-confirm → record `clicked=true`,
//      address stays subscribed.
//   5. Daily cron (Phase 5.4 — newsletter-reengage-followup) walks
//      reengagement:<email> records older than 30 days WITHOUT click,
//      auto-unsubscribes them, adds to suppression so they can't be
//      re-added by accident.
//
// We never send re-engagement twice to the same address (the
// `reengagement:<email>` record is checked before sending). The
// existing /api/newsletter/unsubscribe path is unaffected — if they
// click the one-click footer link instead of the CTA, they get
// unsubscribed cleanly via that path.

import crypto from "node:crypto";
import { kvGet, kvSet } from "@/lib/kv";

const KEY_PREFIX = "reengagement:";

function key(email) {
  return `${KEY_PREFIX}${String(email).trim().toLowerCase()}`;
}

export async function getReengagementRecord(email) {
  try {
    const raw = await kvGet(key(email));
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function recordReengagementSent(email) {
  const e = String(email).trim().toLowerCase();
  const record = {
    email: e,
    sent_at: new Date().toISOString(),
    clicked: false,
    clicked_at: null,
    completed: false, // set true when auto-unsubscribed
  };
  await kvSet(key(e), JSON.stringify(record));
  return record;
}

export async function markReengagementClicked(email) {
  const e = String(email).trim().toLowerCase();
  const existing = await getReengagementRecord(e);
  if (!existing) return null; // never sent — no-op
  if (existing.clicked) return existing; // idempotent
  existing.clicked = true;
  existing.clicked_at = new Date().toISOString();
  await kvSet(key(e), JSON.stringify(existing));
  return existing;
}

export async function markReengagementCompleted(email) {
  const e = String(email).trim().toLowerCase();
  const existing = await getReengagementRecord(e);
  if (!existing) return null;
  existing.completed = true;
  existing.completed_at = new Date().toISOString();
  await kvSet(key(e), JSON.stringify(existing));
  return existing;
}

/**
 * HMAC-signed click token bound to (email, sent_at). Same secret as
 * the unsubscribe URL — defense in depth, single rotating key.
 */
export function signReengageToken(email, sentAt) {
  const secret =
    process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  if (!secret) throw new Error("NEWSLETTER_UNSUB_SECRET missing");
  const payload = `reengage:${String(email).trim().toLowerCase()}:${sentAt}`;
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
}

export function verifyReengageToken(email, sentAt, provided) {
  const expected = signReengageToken(email, sentAt);
  if (typeof provided !== "string" || provided.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(provided, "hex"),
  );
}

export function reengageConfirmUrl(email, sentAt) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
  const token = signReengageToken(email, sentAt);
  const params = new URLSearchParams({
    e: String(email).trim().toLowerCase(),
    t: token,
    s: sentAt,
  });
  return `${base}/api/newsletter/reengage-confirm?${params.toString()}`;
}

/**
 * Build the re-engagement email body. Soft, in George's voice, single
 * CTA. Plain-text mirror builds itself.
 */
export function buildReengagementBody({ email, sentAt }) {
  const confirmUrl = reengageConfirmUrl(email, sentAt);
  const subject = "Still going — but only if you want it";
  const preheader =
    "A quiet check-in from Athens. One click keeps The Bridge coming.";
  const body_text = `Hi from Athens.

I noticed you haven't opened anything from The Bridge in a while.

The newsletter is still going — every other Thursday from the Greek waters — but if it's stopped landing for you, no hard feelings.

If you want to keep getting it, just click the line below.

[Yes, keep sending →](${confirmUrl})

If you don't click, I'll quietly take you off the list in 30 days. No need to do anything.

— George

George P. Biniaris
Managing Broker, George Yachts
georgeyachts.com`;
  return { subject, preheader, body_text };
}
