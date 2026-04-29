// Phase 6.3 — Resend monthly cap threshold alerts.
//
// Resend free-tier monthly cap = 3000 emails (MONTHLY_HARD_CAP).
// MONTHLY_SOFT_CAP at 2900 already exists as a routing gate. The
// alert thresholds are at 80% / 90% / 95% of the HARD cap so George
// has runway to react before hitting the wall:
//
//   80% → 2400 emails — heads-up, plan deceleration
//   90% → 2700 emails — alert, some flush deferral expected
//   95% → 2850 emails — final warning before SOFT cap kicks in
//
// Each threshold fires AT MOST ONCE per UTC month. The flag KV
// `quota_alert:<YYYY-MM>:<threshold>` makes that idempotent. New
// month = new alerts when applicable.
//
// Called from sendNewsletterEmail() after every successful send.
// Cheap when no threshold crossed (one KV read of monthly count + a
// max of 3 boolean flag reads).

import { kvGet, kvSet } from "@/lib/kv";
import { getMonthlyCount, MONTHLY_HARD_CAP } from "./quota";

const FLAG_PREFIX = "quota_alert:";

const THRESHOLDS = [
  { pct: 80, label: "80%", emoji: "📊" },
  { pct: 90, label: "90%", emoji: "⚠️" },
  { pct: 95, label: "95%", emoji: "🚨" },
];

function thisMonthUtc() {
  return new Date().toISOString().slice(0, 7);
}

async function flagAlreadyFired(month, pct) {
  try {
    const v = await kvGet(`${FLAG_PREFIX}${month}:${pct}`);
    return Boolean(v);
  } catch {
    return false;
  }
}

async function setAlreadyFired(month, pct) {
  // 35 days TTL — comfortably more than any month.
  await kvSet(
    `${FLAG_PREFIX}${month}:${pct}`,
    "1",
    35 * 24 * 3600,
  ).catch(() => {});
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

/**
 * Check the current month's Resend usage against thresholds; fire
 * Telegram alert(s) for any newly-crossed threshold. No-ops if the
 * threshold was already alerted this month.
 *
 * Returns the list of thresholds that fired this call (usually empty).
 */
export async function maybeFireQuotaAlert() {
  const month = thisMonthUtc();
  const used = await getMonthlyCount();
  const fired = [];

  for (const t of THRESHOLDS) {
    const cap = Math.floor((MONTHLY_HARD_CAP * t.pct) / 100);
    if (used < cap) continue;
    if (await flagAlreadyFired(month, t.pct)) continue;

    const remaining = MONTHLY_HARD_CAP - used;
    const pctActual = ((used / MONTHLY_HARD_CAP) * 100).toFixed(1);
    await notifyTelegram(
      [
        `${t.emoji} <b>Resend monthly cap — ${t.label} threshold crossed</b>`,
        ``,
        `Month: <code>${month}</code>`,
        `Used: <b>${used}</b> / ${MONTHLY_HARD_CAP} (${pctActual}%)`,
        `Remaining: <b>${remaining}</b> emails this month`,
        ``,
        t.pct === 95
          ? `Soft cap kicks in at ${MONTHLY_HARD_CAP - 100} (97%). Auto-mode crons will start deferring sends if usage continues. Consider delaying the next Wake/Compass issue.`
          : t.pct === 90
            ? `Roughly ${remaining} emails left. Watch the next Bridge cron carefully — at this rate, the soft cap could trigger before month-end.`
            : `On track but worth knowing. The 90% and 95% thresholds will alert if usage keeps climbing.`,
      ].join("\n"),
    );
    await setAlreadyFired(month, t.pct);
    fired.push(t.pct);
  }
  return fired;
}
