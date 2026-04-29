// Resend webhook handler — Brief §12.4.
//
// Resend POSTs JSON events to this endpoint when emails bounce, are
// marked as complaint, or fail to deliver. We update the suppression
// list + Telegram-alert George on patterns that need attention.
//
// Configure in Resend dashboard → Webhooks → add endpoint:
//   URL:    https://georgeyachts.com/api/webhooks/resend
//   Events: email.bounced, email.complained, email.delivered,
//           email.opened, email.clicked, email.delivery_delayed
//
// Signature verification: Resend signs each webhook with HMAC over the
// raw body using the webhook secret. We verify via `Svix-Signature`
// header. RESEND_WEBHOOK_SECRET must be set in env (provided by Resend
// when the webhook is created).

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { kvSadd, kvSrem } from "@/lib/kv";
import { markEvent } from "@/lib/newsletter/engagement";
import {
  recordIssueEvent,
  tagsToStreamIssue,
} from "@/lib/newsletter/issue-stats";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUPPRESSION_SET = "suppression:emails";
const STREAM_SETS = [
  "subscribers:bridge",
  "subscribers:wake",
  "subscribers:compass",
  "subscribers:greece",
  "newsletter:subscribers", // legacy
];

async function notifyTelegram(text) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!t || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    });
  } catch {
    // best-effort
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Verify the Svix signature on the raw body. Resend uses the same
 * pattern as Svix: header `Svix-Signature` carries one or more
 * `v1,<base64>` pairs. The signed payload is `<id>.<timestamp>.<body>`
 * where id and timestamp also come from headers.
 */
function verifySvixSignature(headers, rawBody) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return { ok: false, reason: "RESEND_WEBHOOK_SECRET missing" };

  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sigHeader = headers.get("svix-signature");
  if (!id || !ts || !sigHeader) {
    return { ok: false, reason: "missing svix headers" };
  }

  const signedPayload = `${id}.${ts}.${rawBody}`;
  const decodedSecret = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", decodedSecret)
    .update(signedPayload)
    .digest("base64");

  // Header may carry multiple versions/keys (space-separated): "v1,sig1 v1,sig2"
  const parts = sigHeader.split(" ");
  for (const p of parts) {
    const [version, sig] = p.split(",");
    if (version !== "v1" || !sig) continue;
    if (sig.length !== expected.length) continue;
    if (
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return { ok: true };
    }
  }
  return { ok: false, reason: "no valid signature match" };
}

async function handleEvent(evt) {
  const type = String(evt?.type || "").toLowerCase();
  const email = String(evt?.data?.to?.[0] || evt?.data?.email || "")
    .trim()
    .toLowerCase();
  if (!email) return { type, action: "no-email" };

  // Phase 6.2 — extract stream + issue from tags so we can route
  // counter increments to the per-issue stats store. Returns null if
  // tags are absent (e.g. test event from Resend dashboard); we still
  // process the per-recipient engagement update below.
  const tagInfo = tagsToStreamIssue(evt?.data?.tags);

  // HARD BOUNCE — immediate suppression + remove from all streams.
  if (type === "email.bounced" || type === "email.delivery_delayed") {
    const isHard =
      String(evt?.data?.bounce?.type || "").toLowerCase() === "hard" ||
      type === "email.bounced";
    if (tagInfo) {
      await recordIssueEvent({
        ...tagInfo,
        event: isHard ? "bounced_hard" : "bounced_soft",
        email,
      }).catch(() => {});
      // Soft bounces also bump delivery_delayed for visibility.
      if (!isHard) {
        await recordIssueEvent({
          ...tagInfo,
          event: "delivery_delayed",
        }).catch(() => {});
      }
    }
    if (!isHard) return { type, action: "soft-bounce-noted" };
    await kvSadd(SUPPRESSION_SET, email).catch(() => {});
    for (const set of STREAM_SETS) {
      await kvSrem(set, email).catch(() => {});
    }
    await notifyTelegram(
      `📧 <b>Hard bounce — suppressed</b>\n${escapeHtml(email)}\nReason: ${escapeHtml(evt?.data?.bounce?.message ?? "n/a")}`,
    );
    return { type, action: "suppressed-hard-bounce", email };
  }

  // COMPLAINT — immediate suppression. Spam-marked is the strictest signal.
  if (type === "email.complained") {
    if (tagInfo) {
      await recordIssueEvent({
        ...tagInfo,
        event: "complained",
        email,
      }).catch(() => {});
    }
    await kvSadd(SUPPRESSION_SET, email).catch(() => {});
    for (const set of STREAM_SETS) {
      await kvSrem(set, email).catch(() => {});
    }
    await notifyTelegram(
      `🚨 <b>Spam complaint — suppressed</b>\n${escapeHtml(email)}\nThis address marked us as spam. Removed from every list.`,
    );
    return { type, action: "suppressed-complaint", email };
  }

  // Phase 5.1 — per-recipient engagement record (engagement:<email>)
  // Phase 6.2 — also route to per-issue stats counters when tags
  //             carry stream + issue.
  if (type === "email.delivered" || type === "email.sent") {
    await markEvent({ email, event: "send", at: evt?.created_at }).catch(() => {});
    if (tagInfo) {
      await recordIssueEvent({ ...tagInfo, event: "delivered", email }).catch(
        () => {},
      );
    }
    return { type, action: "engagement-recorded", recipient: email };
  }
  if (type === "email.opened") {
    await markEvent({ email, event: "open", at: evt?.created_at }).catch(() => {});
    if (tagInfo) {
      await recordIssueEvent({ ...tagInfo, event: "opened", email }).catch(
        () => {},
      );
    }
    return { type, action: "engagement-recorded", recipient: email };
  }
  if (type === "email.clicked") {
    await markEvent({ email, event: "click", at: evt?.created_at }).catch(() => {});
    if (tagInfo) {
      await recordIssueEvent({ ...tagInfo, event: "clicked", email }).catch(
        () => {},
      );
    }
    return { type, action: "engagement-recorded", recipient: email };
  }

  return { type, action: "logged" };
}

export async function POST(request) {
  const rawBody = await request.text();
  const verify = verifySvixSignature(request.headers, rawBody);
  if (!verify.ok) {
    // Brief §16.1: never silent fail. Telegram-alert + 401.
    await notifyTelegram(
      `🚨 <b>Resend webhook signature failed</b>\nReason: ${escapeHtml(verify.reason ?? "unknown")}\nIgnoring this event — possible attack.`,
    );
    return NextResponse.json(
      { error: "invalid signature", reason: verify.reason },
      { status: 401 },
    );
  }

  let evt;
  try {
    evt = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const result = await handleEvent(evt);
  return NextResponse.json({ ok: true, result });
}
