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
