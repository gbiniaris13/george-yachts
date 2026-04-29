// Daily digest — Brief §7.5 + Update 1 seasonal-context addition.
//
// Runs 16:00 UTC (= 18:00 Athens summer / 19:00 Athens winter — close
// enough that the digest lands at the end of the working day in
// Athens year-round). Telegrams George with:
//
//   • Subscribers per stream (Bridge / Wake / Compass / Greece) +
//     delta vs yesterday
//   • Today's signups
//   • Drafts pending (`draft:active` set)
//   • Resend usage this month
//   • Last error in the last 24h (or "none")
//   • One-line season posture (Update 1)
//
// Yesterday's snapshot is stored in KV under `digest:last:<YYYY-MM-DD>`
// so deltas are real, not made up. We keep 7 days then prune.

import { NextResponse } from "next/server";
import { kvScard, kvSmembers, kvGet, kvSet } from "@/lib/kv";
import { seasonOneliner } from "@/lib/newsletter/season";
import {
  getDailyCount,
  getMonthlyCount,
  MONTHLY_HARD_CAP,
} from "@/lib/newsletter/quota";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};

function todayAthens(d = new Date()) {
  return new Date(
    d.toLocaleString("en-US", { timeZone: "Europe/Athens" }),
  )
    .toISOString()
    .slice(0, 10);
}

function yesterdayAthens(d = new Date()) {
  const t = new Date(d.getTime() - 24 * 60 * 60 * 1000);
  return todayAthens(t);
}

async function getCounts() {
  const out = {};
  for (const [stream, key] of Object.entries(STREAM_SETS)) {
    out[stream] = (await kvScard(key)) ?? 0;
  }
  return out;
}

async function getDraftsPending() {
  try {
    const ids = (await kvSmembers("draft:active")) ?? [];
    let pending = 0;
    for (const id of ids) {
      const raw = await kvGet(`draft:${id}`);
      if (!raw) continue;
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (parsed?.status === "pending") pending += 1;
      } catch {
        // skip
      }
    }
    return pending;
  } catch {
    return 0;
  }
}

async function getResendUsageThisMonth() {
  // 2026-04-29 fix: previously read `digest:resend_usage:<month>` which
  // was never populated — the real counter is `monthly_resend_count:<month>`
  // maintained by lib/newsletter/quota.js recordSend() on every successful
  // Resend send. The digest was always reporting 0/3000 even after live
  // sends went out. Use the canonical helper so there's one source of truth.
  try {
    return await getMonthlyCount();
  } catch {
    return 0;
  }
}

async function getLastError24h() {
  try {
    const raw = await kvGet("digest:last_error");
    if (!raw) return null;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed?.at) return null;
    const ageHours = (Date.now() - new Date(parsed.at).getTime()) / 3600000;
    if (ageHours > 24) return null;
    return parsed;
  } catch {
    return null;
  }
}

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

function delta(current, previous) {
  if (previous === undefined || previous === null) return "—";
  const d = current - previous;
  if (d === 0) return "no change";
  return d > 0 ? `+${d} today` : `${d} today`;
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const provided =
    authHeader?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (provided !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = todayAthens();
  const yesterday = yesterdayAthens();

  const [
    currentCounts,
    prevSnapshotRaw,
    draftsPending,
    resendUsage,
    dailyUsage,
    lastError,
  ] = await Promise.all([
    getCounts(),
    kvGet(`digest:last:${yesterday}`),
    getDraftsPending(),
    getResendUsageThisMonth(),
    getDailyCount().catch(() => 0),
    getLastError24h(),
  ]);
  const monthlyPct = ((resendUsage / MONTHLY_HARD_CAP) * 100).toFixed(1);

  let prev = null;
  if (prevSnapshotRaw) {
    try {
      prev = typeof prevSnapshotRaw === "string" ? JSON.parse(prevSnapshotRaw) : prevSnapshotRaw;
    } catch {
      prev = null;
    }
  }

  const lines = [
    `📊 <b>Daily digest — ${today}</b>`,
    "",
    `<b>Subscribers</b>`,
    `· Bridge: ${currentCounts.bridge} (${delta(currentCounts.bridge, prev?.counts?.bridge)})`,
    `· Wake: ${currentCounts.wake} (${delta(currentCounts.wake, prev?.counts?.wake)})`,
    `· Compass: ${currentCounts.compass} (${delta(currentCounts.compass, prev?.counts?.compass)})`,
    `· Greece: ${currentCounts.greece} (${delta(currentCounts.greece, prev?.counts?.greece)})`,
    "",
    `<b>Today</b>`,
    `· Drafts pending: ${draftsPending}`,
    `· Resend usage this month: ${resendUsage} / ${MONTHLY_HARD_CAP} (${monthlyPct}%) · today: ${dailyUsage}`,
    `· Last error (24h): ${
      lastError ? `🚨 ${(lastError.component ?? "—")}: ${lastError.message ?? ""}` : "none"
    }`,
    "",
    `${seasonOneliner()}`,
  ];

  await notifyTelegram(lines.join("\n"));

  // Snapshot today's counts so tomorrow's digest can compute deltas.
  await kvSet(
    `digest:last:${today}`,
    JSON.stringify({ counts: currentCounts, drafts_pending: draftsPending, at: new Date().toISOString() }),
  );

  return NextResponse.json({
    ok: true,
    today,
    counts: currentCounts,
    drafts_pending: draftsPending,
    resend_usage_this_month: resendUsage,
    last_error: lastError,
    season: seasonOneliner(),
  });
}
