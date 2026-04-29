// Compass auto-cron — Update 3 §7 #8.
//
// Runs the 1st of every even month (Feb, Apr, Jun, Aug, Oct, Dec) at
// 06:00 UTC. The cron schedule in vercel.json fires every month;
// inside, we check whether today's UTC month is even and exit silently
// if not. Cleaner than running odd-month crons just to no-op.
//
// Per Update 3 §6, Compass routing matrix blocks /offer + /announce +
// /story + /blog. The only auto-mode flow available is /intel from
// the queue.

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

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isBimonthlyFirst(now = new Date()) {
  // UTC month index 0..11; even calendar months are Feb(1), Apr(3),
  // Jun(5), Aug(7), Oct(9), Dec(11). And it has to be the 1st.
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const isEvenMonth =
    m === 1 || m === 3 || m === 5 || m === 7 || m === 9 || m === 11;
  return isEvenMonth && d === 1;
}

export async function GET(request) {
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  if (!isBimonthlyFirst(now)) {
    return NextResponse.json({
      ok: true,
      action: "skipped",
      reason: `today (${now.toISOString().slice(0, 10)}) is not the 1st of an even month`,
    });
  }

  const auto = autoModeEnabledFor("compass");
  if (!auto.enabled) {
    await sendTelegramText(
      pausedAlertText({
        stream: "compass",
        reason: auto.reason,
        intended_action:
          "pop oldest queue entry + send /intel approval card (Compass)",
      }),
    ).catch(() => {});
    return NextResponse.json({ ok: true, action: "paused", reason: auto.reason });
  }

  const entry = await peekOldestPending("compass");
  if (!entry) {
    await sendTelegramText(
      [
        `📭 <b>Compass auto-cron — queue is empty</b>`,
        ``,
        `Today is the 1st of an even month and Compass should send.`,
        `There are no pending intel signals in the queue.`,
        ``,
        `Add one in the CRM (Newsletter → Queues tab) or wait for next`,
        `bimonth. Watchdog tracks this in the daily digest too.`,
      ].join("\n"),
    ).catch(() => {});
    return NextResponse.json({ ok: true, action: "queue_empty" });
  }

  const proxySecret =
    process.env.NEWSLETTER_PROXY_SECRET ||
    process.env.NEWSLETTER_UNSUB_SECRET ||
    process.env.CRON_SECRET;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
  const composeUrl = `${base}/api/admin/newsletter-compose?key=${encodeURIComponent(proxySecret)}`;

  const payload = {
    content_type: "intel",
    audience: ["compass"],
    signal_text: entry.text,
    source_note: entry.notes ?? undefined,
    queue_entry: { stream: "compass", id: entry.id },
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
      `🚨 <b>Compass auto-cron failed</b>\nQueue entry: ${entry.id}\nError: ${err?.message || err}\nEntry stays pending; next cron retries.`,
    ).catch(() => {});
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }

  await markEntryUsed({
    stream: "compass",
    id: entry.id,
    issue_id: composeResp?.results?.[0]?.draft_id ?? null,
  }).catch(() => {});

  return NextResponse.json({
    ok: true,
    action: "draft_queued",
    queue_entry: { stream: "compass", id: entry.id },
    compose: composeResp,
  });
}
