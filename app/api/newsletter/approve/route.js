// /api/newsletter/approve?id=<draft_id>&token=<HMAC>
//
// George taps "✅ Approve & Send" in Telegram. We:
//
//   1. Verify the HMAC token (action=approve scoped to this draft)
//   2. Pull the draft from KV; refuse if status≠pending
//   3. Acquire `lock:sending` (SETNX-style via SET if absent)
//   4. Resolve the audience for each `audience_lists` stream
//   5. Apply enforceRouting() so blocked streams (e.g. compass for
//      offers) drop out automatically — defence in depth
//   6. For each unique recipient: build email via template, run
//      validator, fire Resend (suppression-list aware)
//   7. Update draft.status to "sending" → "sent" (or "failed")
//   8. Update Telegram card: ✅ + open/sent counts, then schedule
//      1h + 24h follow-up status pings (Phase 6 will add those)
//
// Idempotency: re-tapping ✅ on a draft already in status="sent" or
// "sending" is a no-op + reminds the user.

import { NextResponse } from "next/server";
import { kvGet, kvSet, kvSrem, kvSmembers, kvSadd, kvSismember } from "@/lib/kv";
import {
  verifyApprovalToken,
  editTelegramText,
  sendTelegramText,
} from "@/lib/newsletter/telegram";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";
import { validateNewsletterContent } from "@/lib/newsletter/validator";
import { enforceRouting, STREAMS } from "@/lib/newsletter/router";
import {
  sendNewsletterEmail,
  unsubscribeUrlFor,
  isSuppressed,
} from "@/lib/newsletter/resend";
import { queueRemaining } from "@/lib/newsletter/quota";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:80px auto;padding:0 24px;color:#0D1B2A;background:#F8F5F0"><h1 style="font-family:Georgia,serif;font-weight:300;font-size:28px">${title}</h1><div style="line-height:1.7">${body}</div><p style="margin-top:24px;font-size:11px;color:rgba(13,27,42,0.5)">George Yachts · Athens</p></body></html>`;
}

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
  // Dedup by email (keep first stream, but a future enhancement could
  // pick the "primary" stream per recipient)
  const seen = new Set();
  return final.filter((r) => {
    if (seen.has(r.email)) return false;
    seen.add(r.email);
    return true;
  });
}

async function tryAcquireLock() {
  // Best-effort: SET lock:sending <exp> NX EX 600 — if KV doesn't
  // support NX in our wrapper, fall back to optimistic check.
  const existing = await kvGet("lock:sending");
  if (existing && Number(existing) > Date.now() - 10 * 60 * 1000) {
    return { acquired: false };
  }
  await kvSet("lock:sending", String(Date.now()));
  return { acquired: true };
}

async function releaseLock() {
  await kvSet("lock:sending", "0");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("id");
  const token = searchParams.get("token");
  if (!draftId || !token || !verifyApprovalToken("approve", draftId, token)) {
    return new NextResponse(
      page("Invalid link", "This approval link is invalid or has expired."),
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const raw = await kvGet(`draft:${draftId}`);
  if (!raw) {
    return new NextResponse(
      page("Draft gone", "This draft no longer exists. Re-prepare it from the admin endpoint."),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  const draft = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (draft.status === "sent") {
    return new NextResponse(
      page(
        "Already sent",
        `This issue went out at ${draft.sent_at ?? "an earlier moment"}. Nothing to do.`,
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  if (draft.status === "sending") {
    return new NextResponse(
      page("Sending in progress", "A previous tap already triggered the send. Refreshing won't help."),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  if (draft.status === "aborted") {
    return new NextResponse(
      page("Aborted", "This draft was already aborted. Re-prepare a new one from the admin endpoint."),
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  if (draft.status === "blocked") {
    return new NextResponse(
      page(
        "Draft blocked by validator",
        `<p>The composer flagged §13 violations on this draft. It cannot be sent. Adjust the angle / signal text in the Composer and try again.</p><ul>${(draft.voice_violations ?? []).map((v) => `<li>${v.rule ?? v}</li>`).join("")}</ul>`,
      ),
      { status: 422, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  // Defensive re-validation in case the body changed since prepare.
  const validation = validateNewsletterContent({
    body_text: draft.body_text,
    subject: draft.subject,
    stream: draft.stream,
    content_type: draft.content_type,
  });
  if (!validation.ok) {
    await sendTelegramText(
      `🚨 <b>Approval blocked — validator failed</b>\n${draft.stream} #${draft.issue_number ?? "?"}: ${draft.subject}\n${validation.violations.map((v) => `• ${v.rule}`).join("\n")}`,
    ).catch(() => {});
    return new NextResponse(
      page(
        "Validator blocked send",
        `<p>Body violates the §13 hard rules:</p><ul>${validation.violations.map((v) => `<li>${v.rule}</li>`).join("")}</ul><p>No emails went out.</p>`,
      ),
      { status: 422, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  // Apply routing matrix before resolving audience — Brief §13.7.
  const route = enforceRouting(draft.content_type, draft.audience_lists ?? []);
  const finalAudienceLists = route.final_audience.length > 0 ? route.final_audience : ["bridge"];

  const lock = await tryAcquireLock();
  if (!lock.acquired) {
    return new NextResponse(
      page("Another send is in progress", "A previous send hasn't finished yet. Try again in a few minutes."),
      { status: 423, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  draft.status = "sending";
  draft.sending_started_at = new Date().toISOString();
  await kvSet(`draft:${draftId}`, JSON.stringify(draft));

  let recipients = [];
  let sent = 0;
  let suppressed = 0;
  let failed = 0;
  let queued = 0;
  const failures = [];
  const remainingForQueue = [];

  try {
    recipients = await resolveAudience(finalAudienceLists);

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
      // Per-issue dedup — never re-deliver the same issue to the same
      // address even if a later send is re-fired.
      const issueSentKey = `issue_sent:${r.stream}:${draft.issue_number ?? 1}`;
      try {
        const already = await kvSismember(issueSentKey, r.email);
        if (already === 1 || already === "1") {
          // Already received this issue — skip silently and don't
          // count as failed. Bumps `suppressed` so George sees it
          // in the summary, with a clear-enough label.
          suppressed += 1;
          continue;
        }
      } catch {
        // best-effort dedup; if KV check fails we still send.
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
        ],
      });
      if (result.ok) {
        sent += 1;
        // Record this email as having received this issue.
        await kvSadd(issueSentKey, r.email).catch(() => {});
      } else if (result.suppressed) suppressed += 1;
      else if (result.rate_limited) {
        // Resend daily/monthly cap reached — queue the rest of the
        // audience into this draft's pending set; the daily flush
        // cron at 00:30 UTC will pick up where we left off, and so
        // on for as many days as it takes to drain the queue.
        for (let j = idx; j < recipients.length; j += 1) {
          remainingForQueue.push(recipients[j].email);
        }
        break;
      } else {
        failed += 1;
        failures.push({ email: r.email, error: result.error });
      }
      // Crude pacing — friendly to sender reputation.
      await new Promise((r) => setTimeout(r, 250));
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
      // Update 3 §1 — record per-stream last_send_at so the auto-cron
      // cadence gate can read it next Thursday. Set even on
      // sent_with_failures (the cadence is about elapsed time, not
      // delivery quality).
      try {
        await kvSet(
          `last_send_at:${draft.stream}`,
          new Date().toISOString(),
        );
      } catch {
        // best-effort
      }
      // Phase 6.5 — index into recent_sends so the issue-pings cron
      // (1h + 24h) has something to walk. Entries are auto-trimmed
      // after ~30h by that cron.
      await kvSadd("recent_sends", draftId).catch(() => {});
    }

    // Update the original Telegram card → final state.
    if (draft.telegram_message_id) {
      const cardText = fullyDone
        ? `✅ <b>Sent — ${draft.stream} Issue #${draft.issue_number ?? "?"}</b>\nSubject: ${escapeHtml(draft.subject)}\nRecipients: ${recipients.length}\nDelivered: ${draft.sent_count}\nSuppressed: ${draft.suppressed_count}\nFailed: ${draft.failed_count}\nAt: ${draft.sent_at}`
        : `⏸ <b>Sending paused — daily Resend cap reached</b>\n${draft.stream} Issue #${draft.issue_number ?? "?"}\nDelivered today: ${sent}\nQueued for tomorrow's 00:30 UTC flush: ${queued}\nThe queue resumes automatically — no action needed.`;
      await editTelegramText(draft.telegram_message_id, cardText).catch(() => {});
    }
    const summaryLines = [
      `📨 <b>Issue #${draft.issue_number ?? "?"} — ${remainingForQueue.length === 0 ? "sent" : "paused"}</b>`,
      `Stream: ${draft.stream}`,
      `Delivered now: ${sent} / ${recipients.length}`,
      `Suppressed: ${suppressed}`,
      `Failed: ${failed}`,
    ];
    if (queued > 0) {
      // Estimate days to fully drain — assume the daily soft cap as the
      // worst-case daily throughput. (In practice headroom can vary if
      // other drafts are also queued.)
      const DAILY_PACE = 95;
      const daysToDrain = Math.max(1, Math.ceil(queued / DAILY_PACE));
      const ymd = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      summaryLines.push("");
      summaryLines.push(
        `⏸ <b>Σήμερα έφυγαν ${sent} · Αύριο θα φύγουν ${Math.min(queued, DAILY_PACE)}</b>`,
      );
      summaryLines.push(
        `Resend free-tier cap = 100/day (we soft-cap at 95). Όσα δεν χώρεσαν περιμένουν στο queue.`,
      );
      summaryLines.push(
        `📅 Auto-resume: ${ymd} 00:30 UTC (≈ 03:30 Athens). Δεν χρειάζεται να κάνεις τίποτα.`,
      );
      if (daysToDrain > 1) {
        summaryLines.push(
          `⏳ ETA fully delivered: ${daysToDrain} ημέρες (${queued} total queued at ${DAILY_PACE}/day).`,
        );
      }
    }
    if (failures.length > 0) {
      summaryLines.push("");
      summaryLines.push(
        ...failures
          .slice(0, 5)
          .map((f) => `• ${escapeHtml(f.email)}: ${escapeHtml(f.error)}`),
      );
    }
    await sendTelegramText(summaryLines.join("\n")).catch(() => {});
  } catch (e) {
    draft.status = "send_crashed";
    draft.crash_error = String(e?.message ?? e).slice(0, 500);
    await kvSet(`draft:${draftId}`, JSON.stringify(draft));
    await sendTelegramText(
      `🚨 <b>Send crashed</b>\n${draft.stream} #${draft.issue_number ?? "?"}: ${escapeHtml(draft.subject)}\n${escapeHtml(draft.crash_error)}\nManual intervention needed.`,
    ).catch(() => {});
  } finally {
    await releaseLock();
  }

  const fullyDoneOut = remainingForQueue.length === 0;
  return new NextResponse(
    page(
      fullyDoneOut ? "Sent" : "Sending paused — daily cap reached",
      fullyDoneOut
        ? `<p>Issue #${draft.issue_number ?? "?"} of <strong>${escapeHtml(draft.stream)}</strong> went out.</p>
           <p>Recipients: ${recipients.length} · Delivered: ${sent} · Suppressed: ${suppressed} · Failed: ${failed}</p>
           <p>You'll get a follow-up Telegram with delivery + open analytics.</p>`
        : `<p>Issue #${draft.issue_number ?? "?"} delivered to <strong>${sent}</strong> of <strong>${recipients.length}</strong> recipients today, then hit Resend's daily free-tier cap of 100.</p>
           <p>The remaining <strong>${queued}</strong> are queued. The daily flush cron resumes automatically at 00:30 UTC tomorrow and continues until the queue is drained. Telegram updates every day.</p>
           <p>No action needed from you.</p>`,
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
