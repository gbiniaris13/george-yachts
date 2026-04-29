// Phase 5.4 — re-engagement follow-up cron.
//
// Runs daily 02:00 UTC. Walks every reengagement:<email> KV record
// (by walking the four subscriber sets — KV doesn't expose SCAN
// reliably so this is the canonical iteration path) and:
//
//   - If sent_at > 30 days ago AND clicked == false AND completed == false
//     → auto-unsubscribe the address from every stream + add to
//       suppression so they can't be silently re-added by a bulk import
//     → mark the record completed so we don't process again
//
// Telegram-summary at end. No noise unless something happened.
//
// Auth: CRON_SECRET (Vercel cron Authorization: Bearer <secret>).

import { NextResponse } from "next/server";
import { kvSmembers, kvSrem, kvSadd } from "@/lib/kv";
import {
  getReengagementRecord,
  markReengagementCompleted,
} from "@/lib/newsletter/reengagement";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const SUPPRESSION_SET = "suppression:emails";
const STREAM_SETS = [
  "subscribers:bridge",
  "subscribers:wake",
  "subscribers:compass",
  "subscribers:greece",
  "newsletter:subscribers", // legacy
];

const FOLLOWUP_DAYS = 30;

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

export async function GET(request) {
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Walk all four subscriber streams to find every address that COULD
  // have a reengagement record. Vercel KV's REST shim doesn't expose
  // SCAN, so this is the canonical iteration path.
  const seen = new Set();
  for (const setKey of STREAM_SETS) {
    try {
      const members = (await kvSmembers(setKey)) ?? [];
      for (const m of members) {
        seen.add(String(m).trim().toLowerCase());
      }
    } catch {
      // skip one bad set, keep going
    }
  }

  const cutoffMs = Date.now() - FOLLOWUP_DAYS * 24 * 3600 * 1000;
  const unsubscribed = [];
  let scanned = 0;

  for (const email of seen) {
    const r = await getReengagementRecord(email);
    if (!r) continue;
    scanned += 1;
    if (r.completed) continue;
    if (r.clicked) continue;
    const sentMs = Date.parse(r.sent_at);
    if (Number.isNaN(sentMs) || sentMs >= cutoffMs) continue;

    // Auto-unsubscribe — remove from every stream + add to suppression.
    for (const setKey of STREAM_SETS) {
      await kvSrem(setKey, email).catch(() => {});
    }
    await kvSadd(SUPPRESSION_SET, email).catch(() => {});
    await markReengagementCompleted(email);
    unsubscribed.push(email);
  }

  if (unsubscribed.length > 0) {
    await notifyTelegram(
      [
        `🔁 <b>Re-engagement follow-up</b>`,
        `Auto-unsubscribed ${unsubscribed.length} address${unsubscribed.length === 1 ? "" : "es"}`,
        `(no click within ${FOLLOWUP_DAYS} days of re-engagement send)`,
        ``,
        `Each was added to <code>suppression:emails</code> to prevent`,
        `accidental re-add via bulk import. To restore manually: remove`,
        `from suppression + re-add to subscribers:&lt;stream&gt;.`,
      ].join("\n"),
    ).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    scanned_records: scanned,
    auto_unsubscribed: unsubscribed.length,
    cutoff_days: FOLLOWUP_DAYS,
    addresses: unsubscribed.slice(0, 50), // first 50 for the response
  });
}
