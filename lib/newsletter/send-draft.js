// Auto-send the audience of a prepared draft via Resend.
//
// Mirrors the proven send loop in /api/newsletter/approve, but with NO
// Telegram side-effects — the full-auto orchestrator reports by email.
// Honors the suppression list, per-issue dedup, and the Resend daily
// soft-cap (overflow is queued for the 00:30 UTC flush cron, exactly
// like the approve handler does).
//
// We intentionally leave /api/newsletter/approve untouched — George's
// manual Telegram approval path keeps working unchanged. This is a
// separate, isolated sender for the unattended crons.

import {
  kvGet,
  kvSet,
  kvSrem,
  kvSmembers,
  kvSadd,
  kvSismember,
} from "@/lib/kv";
import { buildNewsletterEmail } from "./email-template";
import {
  sendNewsletterEmail,
  unsubscribeUrlFor,
  isSuppressed,
} from "./resend";
import { queueRemaining } from "./quota";

const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};

async function resolveAudience(audienceLists) {
  const final = [];
  for (const stream of audienceLists) {
    const setKey = STREAM_SETS[stream];
    if (!setKey) continue;
    const members = (await kvSmembers(setKey)) ?? [];
    for (const m of members) {
      const lower = String(m).trim().toLowerCase();
      if (lower && lower.includes("@")) final.push({ email: lower, stream });
    }
  }
  const seen = new Set();
  return final.filter((r) => {
    if (seen.has(r.email)) return false;
    seen.add(r.email);
    return true;
  });
}

/**
 * Send a draft (already created + validated) to its audience.
 * @returns {Promise<{ok:boolean, fullyDone?:boolean, status?:string,
 *   recipients?:number, sent?:number, suppressed?:number, failed?:number,
 *   queued?:number, failures?:Array, error?:string}>}
 */
export async function sendDraftAuto(draftId) {
  const raw = await kvGet(`draft:${draftId}`);
  if (!raw) return { ok: false, error: "draft_gone" };
  const draft = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (draft.status === "blocked") return { ok: false, error: "draft_blocked" };
  if (draft.status === "sent" || draft.status === "sending") {
    return { ok: false, error: `already_${draft.status}` };
  }

  draft.status = "sending";
  draft.sending_started_at = new Date().toISOString();
  await kvSet(`draft:${draftId}`, JSON.stringify(draft));

  // Record last_send_at at START (not just completion) so the cadence
  // gate counts from when we initiated — prevents an early re-fire if a
  // large list pauses mid-send and drains over several days.
  try {
    await kvSet(`last_send_at:${draft.stream}`, new Date().toISOString());
  } catch {
    /* best-effort */
  }

  const recipients = await resolveAudience(draft.audience_lists ?? [draft.stream]);
  let sent = 0;
  let suppressed = 0;
  let failed = 0;
  let queued = 0;
  const failures = [];
  const remainingForQueue = [];

  for (let idx = 0; idx < recipients.length; idx += 1) {
    const r = recipients[idx];
    const unsubUrl = unsubscribeUrlFor(r.email, { list: r.stream });
    const built = buildNewsletterEmail({
      stream: r.stream,
      subject: draft.subject,
      preheader: draft.preheader,
      body_text: draft.body_text,
      hero_image_url: draft.hero_image_url,
      unsubscribe_url: unsubUrl,
    });
    if (await isSuppressed(r.email)) {
      suppressed += 1;
      continue;
    }
    // Per-issue dedup — never re-deliver the same issue to the same address.
    const issueSentKey = `issue_sent:${r.stream}:${draft.issue_number ?? 1}`;
    try {
      const already = await kvSismember(issueSentKey, r.email);
      if (already === 1 || already === "1") {
        suppressed += 1;
        continue;
      }
    } catch {
      /* best-effort dedup */
    }

    const result = await sendNewsletterEmail({
      to: r.email,
      subject: built.subject,
      html: built.html,
      text: built.text,
      list: r.stream,
      tags: [
        { name: "stream", value: r.stream },
        { name: "issue", value: String(draft.issue_number ?? 1) },
        { name: "auto", value: "1" },
      ],
    });
    if (result.ok) {
      sent += 1;
      await kvSadd(issueSentKey, r.email).catch(() => {});
    } else if (result.suppressed) {
      suppressed += 1;
    } else if (result.rate_limited) {
      // Resend daily cap reached — queue the rest for the flush cron.
      for (let j = idx; j < recipients.length; j += 1) {
        remainingForQueue.push(recipients[j].email);
      }
      break;
    } else {
      failed += 1;
      failures.push({ email: r.email, error: result.error });
    }
    await new Promise((res) => setTimeout(res, 250)); // pacing
  }

  if (remainingForQueue.length > 0) {
    queued = await queueRemaining(draftId, remainingForQueue);
  }

  const fullyDone = remainingForQueue.length === 0;
  draft.status = fullyDone
    ? failed > 0
      ? "sent_with_failures"
      : "sent"
    : "sending_paused";
  draft.sent_at = fullyDone ? new Date().toISOString() : null;
  draft.recipient_count = recipients.length;
  draft.sent_count = (draft.sent_count ?? 0) + sent;
  draft.suppressed_count = (draft.suppressed_count ?? 0) + suppressed;
  draft.failed_count = (draft.failed_count ?? 0) + failed;
  draft.queued_count = queued;
  draft.failure_log = failures.slice(0, 10);
  await kvSet(`draft:${draftId}`, JSON.stringify(draft));

  if (fullyDone) {
    await kvSrem("draft:active", draftId).catch(() => {});
    await kvSadd("recent_sends", draftId).catch(() => {});
  }

  return {
    ok: true,
    fullyDone,
    status: draft.status,
    recipients: recipients.length,
    sent,
    suppressed,
    failed,
    queued,
    failures: failures.slice(0, 5),
  };
}
