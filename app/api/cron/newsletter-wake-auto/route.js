// Wake auto-cron — Update 3 §7 #7.
//
// Runs the 15th of every month at 06:00 UTC. Picks the oldest pending
// entry from the Wake intel queue (Update 3 §2), generates a /intel
// draft via the standard compose endpoint, and Telegrams George the
// usual approval card. Optimistic mark — entry flips to `used` at
// draft creation time so the next cron doesn't re-prompt the same
// signal. If George aborts the draft, he can re-add the text via the
// CRM Queues tab.
//
// If the queue is empty: silent KV record + Telegram alert "Wake send
// is due, queue is empty". The watchdog (Phase 4 #5) folds this same
// concern into the daily digest, but a same-day alert at the 15th
// 06:00 UTC firing is a stronger nudge than waiting for the digest.

import { NextResponse } from "next/server";
import {
  peekOldestPending,
  markEntryUsed,
} from "@/lib/newsletter/intel-queue";
import {
  autoModeEnabledFor,
  pausedAlertText,
} from "@/lib/newsletter/auto-mode";
import { sendTelegramText } from "@/lib/newsletter/telegram";
import { getCurrentSeason } from "@/lib/newsletter/season";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Update 1 §4.2 — Wake editorial mode varies by season; surface the
// mode in the cron payload so George sees it on the approval card.
function wakeEditorialMode(seasonPhase) {
  if (seasonPhase === "deep_winter") return "education";
  if (seasonPhase === "spring_lift" || seasonPhase === "season_open")
    return "booking_signals";
  if (seasonPhase === "high_season") return "last_minute";
  return "preview_2027";
}

export async function GET(request) {
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const auto = autoModeEnabledFor("wake");
  if (!auto.enabled) {
    await sendTelegramText(
      pausedAlertText({
        stream: "wake",
        reason: auto.reason,
        intended_action:
          "pop oldest queue entry + send /intel approval card",
      }),
    ).catch(() => {});
    return NextResponse.json({ ok: true, action: "paused", reason: auto.reason });
  }

  const entry = await peekOldestPending("wake");
  if (!entry) {
    await sendTelegramText(
      [
        `📭 <b>Wake auto-cron — queue is empty</b>`,
        ``,
        `Today is the 15th and Wake should send. There are no pending`,
        `intel signals in the queue.`,
        ``,
        `Add one in the CRM (Newsletter → Queues tab) or wait for next`,
        `month. Watchdog will surface this in tonight's daily digest.`,
      ].join("\n"),
    ).catch(() => {});
    return NextResponse.json({ ok: true, action: "queue_empty" });
  }

  // Drive the standard compose endpoint so all the §13 + Update 2
  // §5.1 voice rules + routing matrix run uniformly with what the
  // manual Composer produces.
  const proxySecret =
    process.env.NEWSLETTER_PROXY_SECRET ||
    process.env.NEWSLETTER_UNSUB_SECRET ||
    process.env.CRON_SECRET;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
  const composeUrl = `${base}/api/admin/newsletter-compose?key=${encodeURIComponent(proxySecret)}`;

  const season = getCurrentSeason();
  const editorialMode = wakeEditorialMode(season.phase);

  const payload = {
    content_type: "intel",
    audience: ["wake"],
    headline: undefined, // queue entries don't carry a separate headline
    signal_text: entry.text,
    source_note: entry.notes ?? undefined,
    queue_entry: { stream: "wake", id: entry.id, editorial_mode: editorialMode },
  };

  let composeResp;
  try {
    const r = await fetch(composeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    composeResp = await r.json();
  } catch (err) {
    await sendTelegramText(
      `🚨 <b>Wake auto-cron failed</b>\nQueue entry: ${entry.id}\nError: ${err?.message || err}\nEntry stays pending; next cron retries.`,
    ).catch(() => {});
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }

  // Optimistic mark — even if the assembler / validator failed, we
  // flip the entry to `used` to prevent repeat firings on the same
  // text. George can re-add via the Queues tab.
  await markEntryUsed({
    stream: "wake",
    id: entry.id,
    issue_id: composeResp?.results?.[0]?.draft_id ?? null,
  }).catch(() => {});

  return NextResponse.json({
    ok: true,
    action: "draft_queued",
    queue_entry: { stream: "wake", id: entry.id },
    editorial_mode: editorialMode,
    compose: composeResp,
  });
}
