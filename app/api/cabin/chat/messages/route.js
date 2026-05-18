// app/api/cabin/chat/messages/route.js
// GET ?since=ISO  — return messages, optionally only newer than `since`
// POST { body }   — send a charterer message

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { listMessages, postMessage, markRead, unreadCounts, maybeNotifyOnNewMessage } from "@/lib/cabin/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHARTERER_ROLES = new Set(["principal_charterer", "designated_assistant"]);

async function gate() {
  const session = await readSessionFromCookies();
  if (!session) return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  // Guests cannot access the private chat (privacy by design).
  // Resolve role from the ACTIVE cabin — never from index 0, which
  // would let a user with multiple memberships at different roles
  // bypass the gate on the wrong cabin.
  const member = resolveMembership(session, cabinId);
  if (!member || !CHARTERER_ROLES.has(member.role)) {
    return { error: NextResponse.json({ ok: false, error: "private-chat" }, { status: 403 }) };
  }
  return { session, cabinId, member };
}

export async function GET(req) {
  const a = await gate();
  if (a.error) return a.error;
  const url = new URL(req.url);
  const since = url.searchParams.get("since");
  const messages = await listMessages({ cabinId: a.cabinId, since });

  // Side-effect: mark all admin messages read when the charterer
  // pulls them in (only if no `since` was supplied — pull-to-refresh
  // semantics, not the incremental long-poll fetch).
  if (!since) {
    await markRead({ cabinId: a.cabinId, readerRole: "charterer" });
  }
  const counts = await unreadCounts(a.cabinId);

  return NextResponse.json({
    ok: true,
    messages,
    unread_for_admin: counts.admin_unread,
    unread_for_charterer: counts.charterer_unread,
  });
}

export async function POST(req) {
  const a = await gate();
  if (a.error) return a.error;
  const body = await req.json().catch(() => null);
  try {
    const row = await postMessage({
      cabinId: a.cabinId,
      senderEmail: a.session.email,
      senderRole: "charterer",
      body: body?.body ?? "",
    });
    // Fire-and-forget Telegram nudge to George
    void maybeNotifyOnNewMessage({ cabinId: a.cabinId, senderRole: "charterer" });
    return NextResponse.json({ ok: true, message: row });
  } catch (e) {
    // Log the underlying detail server-side; expose a stable code
    // to the client so we never leak DB errors over the wire.
    console.error("[cabin/chat] post failed:", e);
    const code = /empty body/i.test(e?.message || "") ? "empty-body" : "post-failed";
    return NextResponse.json({ ok: false, error: code }, { status: 400 });
  }
}
