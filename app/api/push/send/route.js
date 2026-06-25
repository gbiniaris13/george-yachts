// POST /api/push/send
// Sends a push notification to every active subscriber.
//
// PROTECTED: requires `authorization: Bearer <CRON_SECRET>` (same
// secret Vercel cron + the other automation routes use). Callable by
// George manually or by the weekly routine. Body: { title, body, url }.
//
// Example (last-minute availability):
//   { "title": "Rare August availability",
//     "body": "M/Y Genny just opened a week in the Cyclades.",
//     "url": "https://georgeyachts.com/yachts/genny" }

import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const alt = request.headers.get("x-cron-secret") || "";
  return bearer === expected || alt === expected;
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (!payload?.title && !payload?.body) {
    return NextResponse.json(
      { ok: false, error: "title or body required" },
      { status: 400 }
    );
  }
  try {
    const result = await sendPushToAll(payload);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[push/send] failed:", err?.message || err);
    const noKey = String(err?.message || "").includes("VAPID_PRIVATE_KEY");
    return NextResponse.json(
      { ok: false, error: noKey ? "VAPID_PRIVATE_KEY not set in env" : "send failed" },
      { status: 500 }
    );
  }
}
