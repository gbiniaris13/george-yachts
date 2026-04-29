// Daily flush — drain the per-draft pending_sends:<id> queue up to
// the day's soft Resend cap (95). Runs 00:30 UTC every day.
//
// For every draft marked `draft_in_flight`, we:
//   1. Pop up to (95 - daily_used_so_far) emails
//   2. Send each via Resend (with suppression + dedup checks)
//   3. Track recipients in issue_sent:<stream>:<num>
//   4. If the queue is empty, mark the draft fully sent + Telegram update
//   5. If still more to flush, leave the draft in flight for tomorrow
//
// This makes the free-tier-friendly behaviour fully autonomous:
// George never has to babysit a multi-day send. Issue #N with 500
// subscribers will take ~5 days to reach everyone, with daily
// progress pings on Telegram.

import { NextResponse } from "next/server";
import {
  kvGet,
  kvSet,
  kvSrem,
  kvSadd,
  kvSismember,
} from "@/lib/kv";
import {
  popPending,
  markFlushed,
  listInFlight,
  getDailyHeadroom,
  DAILY_SOFT_CAP,
} from "@/lib/newsletter/quota";
import { sendNewsletterEmail, isSuppressed, unsubscribeUrlFor } from "@/lib/newsletter/resend";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

async function notifyTelegram(text) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!t || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // best-effort
  }
}

async function loadDraft(draftId) {
  const raw = await kvGet(`draft:${draftId}`);
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function flushOneDraft(draftId, headroom) {
  if (headroom <= 0) return { draftId, sent: 0, remaining: -1, skipped: "no-headroom" };
  const draft = await loadDraft(draftId);
  if (!draft) {
    // Orphaned marker — clean it up.
    await markFlushed(draftId);
    return { draftId, sent: 0, remaining: 0, skipped: "draft-missing" };
  }

  const { taken, remaining } = await popPending(draftId, headroom);
  if (taken.length === 0) {
    await markFlushed(draftId);
    // Also finalise the draft if it's still in sending_paused.
    if (draft.status === "sending_paused") {
      draft.status = (draft.failed_count ?? 0) > 0 ? "sent_with_failures" : "sent";
      draft.sent_at = new Date().toISOString();
      await kvSet(`draft:${draftId}`, JSON.stringify(draft));
      await kvSrem("draft:active", draftId).catch(() => {});
    }
    return { draftId, sent: 0, remaining: 0, skipped: "queue-empty" };
  }

  const stream = draft.stream ?? "bridge";
  const issueNumber = draft.issue_number ?? 1;
  const issueSentKey = `issue_sent:${stream}:${issueNumber}`;

  let sent = 0;
  let suppressed = 0;
  let failed = 0;
  let stoppedEarlyForCap = false;

  for (const email of taken) {
    // Per-issue dedup
    try {
      const already = await kvSismember(issueSentKey, email);
      if (already === 1 || already === "1") {
        suppressed += 1;
        continue;
      }
    } catch {
      // best-effort
    }

    if (await isSuppressed(email)) {
      suppressed += 1;
      continue;
    }

    const built = buildNewsletterEmail({
      stream,
      subject: draft.subject,
      preheader: draft.preheader,
      body_text: draft.body_text,
      hero_image_url: draft.hero_image_url,
      unsubscribe_url: unsubscribeUrlFor(email, { list: stream }),
    });

    const result = await sendNewsletterEmail({
      to: email,
      subject: built.subject,
      html: built.html,
      text: built.text,
      list: stream,
      tags: [
        { name: "stream", value: stream },
        { name: "issue", value: String(issueNumber) },
        { name: "kind", value: "queue-flush" },
      ],
    });

    if (result.ok) {
      sent += 1;
      await kvSadd(issueSentKey, email).catch(() => {});
    } else if (result.rate_limited) {
      // Pop popped them off; put this one back so we don't lose it.
      await kvSadd(`pending_sends:${draftId}`, email).catch(() => {});
      stoppedEarlyForCap = true;
      break;
    } else if (result.suppressed) {
      suppressed += 1;
    } else {
      failed += 1;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  // Update draft counters + finalise if queue empty.
  draft.sent_count = (draft.sent_count ?? 0) + sent;
  draft.suppressed_count = (draft.suppressed_count ?? 0) + suppressed;
  draft.failed_count = (draft.failed_count ?? 0) + failed;

  // Recompute remaining queue count (we may have re-added one if rate-limited).
  const stillRemaining = await popPending(draftId, 0)
    .then((x) => x.remaining)
    .catch(() => 0);
  if (stillRemaining === 0 && !stoppedEarlyForCap) {
    draft.status = (draft.failed_count ?? 0) > 0 ? "sent_with_failures" : "sent";
    draft.sent_at = new Date().toISOString();
    await markFlushed(draftId);
    await kvSrem("draft:active", draftId).catch(() => {});
  }
  await kvSet(`draft:${draftId}`, JSON.stringify(draft));

  return { draftId, sent, suppressed, failed, remaining: stillRemaining, stoppedEarlyForCap };
}

export async function GET(request) {
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const inflight = await listInFlight();
  if (inflight.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, note: "no drafts in flight" });
  }

  const results = [];
  for (const draftId of inflight) {
    const headroom = await getDailyHeadroom();
    if (headroom <= 0) {
      results.push({ draftId, skipped: "daily cap already reached" });
      continue;
    }
    const r = await flushOneDraft(draftId, headroom);
    results.push(r);
  }

  // Telegram summary.
  const totalSent = results.reduce((s, r) => s + (r.sent ?? 0), 0);
  const totalRemaining = results.reduce((s, r) => s + Math.max(0, r.remaining ?? 0), 0);
  const lines = [
    `🔁 <b>Daily queue flush</b>`,
    `Drafts in flight: ${inflight.length}`,
    `Sent today: ${totalSent}`,
    totalRemaining > 0
      ? `Still queued for tomorrow: ${totalRemaining}`
      : `All queues drained — every issue fully delivered.`,
  ];
  await notifyTelegram(lines.join("\n"));

  return NextResponse.json({
    ok: true,
    daily_soft_cap: DAILY_SOFT_CAP,
    processed: inflight.length,
    sent_today: totalSent,
    still_queued: totalRemaining,
    results,
  });
}
