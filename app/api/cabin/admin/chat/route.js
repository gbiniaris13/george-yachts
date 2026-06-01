// Admin endpoint — gy-command calls these for the chat view.
// All operations scoped to one cabin via `cabin_id` query/body.
//
// GET  ?cabin_id=...&since=ISO  — list (marks admin-side read)
// POST { cabin_id, body, actor_email }  — send admin message

import { NextResponse } from "next/server";
import { listMessages, postMessage, markRead, maybeNotifyOnNewMessage } from "@/lib/cabin/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

export async function GET(req) {
  if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(req.url);
  const cabinId = url.searchParams.get("cabin_id");
  const since = url.searchParams.get("since");
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 400 });

  const messages = await listMessages({ cabinId, since });
  if (!since) await markRead({ cabinId, readerRole: "admin" });
  return NextResponse.json({ ok: true, messages });
}

export async function POST(req) {
  if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  const actorEmail = body?.actor_email || "george@georgeyachts.com";
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const row = await postMessage({
      cabinId,
      senderEmail: actorEmail,
      senderRole: "admin",
      body: body?.body ?? "",
    });
    // 2026-06-01 — Brief 06 cabin-closeout (S4). Await the throttled
    // charterer email notification (was fire-and-forget → dropped on
    // serverless freeze), guarded so it can't fail the admin reply.
    try {
      await maybeNotifyOnNewMessage({ cabinId, senderRole: "admin" });
    } catch (notifyErr) {
      console.error("[cabin/admin/chat] notify failed:", notifyErr);
    }
    return NextResponse.json({ ok: true, message: row });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
