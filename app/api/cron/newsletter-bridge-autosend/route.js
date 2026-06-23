// Bridge (clients) full-auto newsletter cron.
//
// Tuesday send day for the clients stream (the wake/advisors stream
// fires Thursdays). Fires every Tuesday 13:00 UTC (~16:00 Athens). The cadence gate inside
// runAutoSend decides whether to actually send (2/month Jan–Mar, else
// 1/month). Sends nothing unless AUTO_SEND_ENABLED=true (else dry-run
// preview email to George). Append ?force=1 with the CRON_SECRET to
// bypass the cadence/in-flight gates for a manual test.

import { NextResponse } from "next/server";
import { runAutoSend } from "@/lib/newsletter/auto-send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request) {
  const url = new URL(request.url);
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("key");
  const vercelCron = request.headers.get("x-vercel-cron");
  if (auth !== process.env.CRON_SECRET && !vercelCron) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const force = url.searchParams.get("force") === "1";
  const result = await runAutoSend("bridge", { force });
  return NextResponse.json(result);
}
