// Outreach open-events poll endpoint.
//
// The Apps Script bot calls this every 30 minutes from the `syncOpens()`
// trigger, passes a `since` cursor (unix ms of the latest open it has
// already persisted), and gets back everything newer. It then stamps
// each matching tracking_id row in the Prospects sheet and pings
// Telegram on the FIRST open of each email.
//
// Auth: Bearer <OUTREACH_SECRET or CRON_SECRET> — both supported so
// you can reuse the existing cron secret if you don't want a new env
// var.

import { NextResponse } from "next/server";
import { kvLrange } from "@/lib/kv";

export const dynamic = "force-dynamic";

const LIST_KEY = "outreach:opens";

// Flip to true to give the outreach bot its open feed (and Telegram pings) back.
const OUTREACH_OPENS_ENABLED = false;

function authorized(request) {
  const header = request.headers.get("authorization") || "";
  const outreach = process.env.OUTREACH_SECRET;
  const cron = process.env.CRON_SECRET;
  if (outreach && header === `Bearer ${outreach}`) return true;
  if (cron && header === `Bearer ${cron}`) return true;
  return false;
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const since = Number(searchParams.get("since") || 0);
  const max = Math.min(
    Math.max(Number(searchParams.get("max") || 500), 1),
    1000
  );

  // 2026-08-18, George: "Δεν θέλω να βλέπω τα ανοίγματα στο bot, δεν με
  // ενδιαφέρει καθόλου αυτό." The outreach bot's only use for this feed is
  // the Telegram ping it fires on a prospect's first open, and he does not
  // want it. Returning an empty page makes syncOpens() return early: no
  // Telegram, no sheet writes, no errors, and not one line of the bot
  // touched. Sending is unaffected - opens_count feeds the stats block and
  // nothing in the send logic reads it (verified before this change).
  //
  // The pixel in /api/track/open KEEPS recording to KV, so nothing is lost
  // and turning this back on is deleting the next line.
  //
  // Honest side effect: the bot's daily summary counts opens from the sheet,
  // so it will now read 0 opened. That is "we stopped counting", not
  // "nobody opened". Say so if the number ever comes up.
  if (!OUTREACH_OPENS_ENABLED) {
    // Same shape the live branch returns. syncOpens() reads `now` to advance
    // its cursor on an empty page; omitting it would silently fall back to
    // Apps Script clock time, which is the sort of drift that bites months
    // later. Match the contract exactly.
    return NextResponse.json({ opens: [], count: 0, now: Date.now(), disabled: true });
  }

  const raw = (await kvLrange(LIST_KEY, 0, max - 1)) || [];
  const opens = [];
  for (const row of raw) {
    try {
      const obj = JSON.parse(row);
      if (obj && typeof obj.ts === "number" && obj.ts > since && obj.id) {
        opens.push(obj);
      }
    } catch {
      /* skip corrupt rows */
    }
  }
  // Oldest → newest so Apps Script processes in chronological order.
  opens.sort((a, b) => a.ts - b.ts);

  return NextResponse.json({
    opens,
    count: opens.length,
    now: Date.now(),
  });
}
