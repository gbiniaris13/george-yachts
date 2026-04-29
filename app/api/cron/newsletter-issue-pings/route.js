// Phase 6.4 + 6.5 — Post-send analytics pings.
//
// Hourly cron. Walks recently-sent drafts, fires:
//
//   1h ping  — first ~1h after sent_at: delivery rate, bounce rate
//              (Phase 6.4 bounce-rate guardian piggybacks here),
//              early opens
//   24h ping — first ~25h after sent_at: settled opens, clicks,
//              unsubscribes, complaints. Final-ish numbers
//
// Idempotency via per-draft KV flags:
//   issue_pings:<draftId> = { ping_1h_at, ping_24h_at }
// Once a flag is set, that ping won't re-fire.
//
// Walks happen in two stages:
//   - Active drafts that are status="sent" (still in draft:active set
//     OR linked from issue_sent:<stream>:<num>)
//   - Recently completed drafts: we keep them around for 25h after
//     sent_at via a `recent_sends` index (added in /approve when a
//     draft finalises). The issue-pings cron reads from that index.

import { NextResponse } from "next/server";
import {
  kvGet,
  kvSet,
  kvSadd,
  kvSrem,
  kvSmembers,
} from "@/lib/kv";
import { getIssueStats } from "@/lib/newsletter/issue-stats";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const RECENT_SENDS_KEY = "recent_sends";
const PINGS_PREFIX = "issue_pings:";
// Bounce-rate guardian threshold per the brief.
const BOUNCE_RATE_ALERT_PCT = 3;
// Window thresholds for each ping (hours since sent_at).
const PING_1H_MIN = 0.5; // start firing 30 min in
const PING_1H_MAX = 6; // up to 6h after, in case the cron missed an hour
const PING_24H_MIN = 23;
const PING_24H_MAX = 28;
// How long to keep a draft in `recent_sends` (hours).
const RETENTION_HOURS = 30;

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

async function readDraft(draftId) {
  try {
    const raw = await kvGet(`draft:${draftId}`);
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function readPingsFlag(draftId) {
  try {
    const raw = await kvGet(`${PINGS_PREFIX}${draftId}`);
    if (!raw) return {};
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

async function writePingsFlag(draftId, flag) {
  await kvSet(
    `${PINGS_PREFIX}${draftId}`,
    JSON.stringify(flag),
    7 * 24 * 3600,
  ).catch(() => {});
}

function fmtPct(n) {
  return `${(Number(n) || 0).toFixed(1)}%`;
}

function streamLabel(stream) {
  return (
    {
      bridge: "The Bridge",
      wake: "The Wake",
      compass: "The Compass",
      greece: "Από την Ελλάδα",
    }[stream] ?? stream
  );
}

async function build1hPing(draft, stats) {
  const totalSent = draft.sent_count ?? stats?.counters?.sent ?? 0;
  const delivered = stats?.counters?.delivered ?? totalSent;
  const bouncedHard = stats?.counters?.bounced_hard ?? 0;
  const bouncedSoft = stats?.counters?.bounced_soft ?? 0;
  const opens = stats?.unique_opens ?? 0;
  const bounceRate = stats?.bounce_rate ?? 0;
  const guardianTriggered = bounceRate > BOUNCE_RATE_ALERT_PCT;
  const lines = [
    `${guardianTriggered ? "🚨" : "📡"} <b>1h post-send report — ${streamLabel(draft.stream)} Issue #${draft.issue_number ?? "?"}</b>`,
    ``,
    `Subject: ${draft.subject ?? ""}`,
    `Sent: ${totalSent}`,
    `Delivered: ${delivered}`,
    `Bounces: ${bouncedHard} hard · ${bouncedSoft} soft  (rate: ${fmtPct(bounceRate)})`,
    `Opens (so far): ${opens} · ${fmtPct(stats?.open_rate ?? 0)}`,
    ``,
    guardianTriggered
      ? `⚠️ <b>Bounce rate above ${BOUNCE_RATE_ALERT_PCT}% threshold.</b> Investigate now — could indicate a list-quality issue or a deliverability event. Cleanup affected addresses before the next send.`
      : `On track. 24h report follows tomorrow.`,
  ];
  return { text: lines.join("\n"), guardianTriggered };
}

async function build24hPing(draft, stats) {
  const totalSent = draft.sent_count ?? stats?.counters?.sent ?? 0;
  const delivered = stats?.counters?.delivered ?? totalSent;
  const opens = stats?.unique_opens ?? 0;
  const clicks = stats?.unique_clicks ?? 0;
  const complaints = stats?.counters?.complained ?? 0;
  const lines = [
    `📊 <b>24h post-send report — ${streamLabel(draft.stream)} Issue #${draft.issue_number ?? "?"}</b>`,
    ``,
    `Subject: ${draft.subject ?? ""}`,
    `Recipients: ${totalSent}`,
    `Delivered: ${delivered} (${fmtPct((delivered / Math.max(totalSent, 1)) * 100)})`,
    ``,
    `Opens:    ${opens} unique  (${fmtPct(stats?.open_rate ?? 0)})`,
    `Clicks:   ${clicks} unique  (${fmtPct(stats?.click_rate ?? 0)})`,
    ``,
    `Bounces:  ${(stats?.counters?.bounced_hard ?? 0) + (stats?.counters?.bounced_soft ?? 0)}  (${fmtPct(stats?.bounce_rate ?? 0)})`,
    `Complaints: ${complaints}  (${fmtPct(stats?.complaint_rate ?? 0)})`,
    ``,
    opens === 0 && delivered > 0
      ? `<i>No opens recorded — Resend webhook may not be wired yet (see CLAUDE.md → Resend webhook setup runbook).</i>`
      : `<i>Final-ish numbers. Webhook events still trickle in for ~7 days.</i>`,
  ];
  return { text: lines.join("\n") };
}

export async function GET(request) {
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Walk the recent_sends index — drafts that finalised in the last
  // ~30 hours. /approve and the flush-queue cron add to this index;
  // we trim entries older than RETENTION_HOURS as we go.
  const recent = (await kvSmembers(RECENT_SENDS_KEY)) ?? [];
  const now = Date.now();
  const fired1h = [];
  const fired24h = [];
  const expired = [];

  for (const draftId of recent) {
    const draft = await readDraft(draftId);
    if (!draft) {
      expired.push(draftId);
      continue;
    }
    const sentAt = draft.sent_at ? Date.parse(draft.sent_at) : 0;
    if (!sentAt) {
      // Not yet finalised — leave it on the index, will check next hour.
      continue;
    }
    const ageHours = (now - sentAt) / 3600000;
    if (ageHours > RETENTION_HOURS) {
      expired.push(draftId);
      continue;
    }

    const flag = await readPingsFlag(draftId);
    const stats = await getIssueStats(draft.stream, draft.issue_number);

    // 1h ping window: 0.5h–6h since sent_at, fire once.
    if (
      !flag.ping_1h_at &&
      ageHours >= PING_1H_MIN &&
      ageHours <= PING_1H_MAX
    ) {
      const ping = await build1hPing(draft, stats);
      await notifyTelegram(ping.text);
      flag.ping_1h_at = new Date().toISOString();
      await writePingsFlag(draftId, flag);
      fired1h.push({
        draftId,
        stream: draft.stream,
        issue: draft.issue_number,
        guardian: ping.guardianTriggered,
      });
    }

    // 24h ping window: 23h–28h since sent_at, fire once.
    if (
      !flag.ping_24h_at &&
      ageHours >= PING_24H_MIN &&
      ageHours <= PING_24H_MAX
    ) {
      const ping = await build24hPing(draft, stats);
      await notifyTelegram(ping.text);
      flag.ping_24h_at = new Date().toISOString();
      await writePingsFlag(draftId, flag);
      fired24h.push({
        draftId,
        stream: draft.stream,
        issue: draft.issue_number,
      });
    }
  }

  // Trim expired entries.
  for (const id of expired) {
    await kvSrem(RECENT_SENDS_KEY, id).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    walked: recent.length,
    fired_1h: fired1h,
    fired_24h: fired24h,
    expired_count: expired.length,
  });
}
