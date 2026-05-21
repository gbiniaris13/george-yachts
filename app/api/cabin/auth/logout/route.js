// app/api/cabin/auth/logout/route.js
// POST /api/cabin/auth/logout — destroy session + clear cookie.

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  destroySession,
  SESSION_COOKIE,
  PREVIEW_COOKIE,
} from "@/lib/cabin/auth";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

export async function POST(req) {
  const session = await readSessionFromCookies();
  if (session?.token) {
    await destroySession(session.token);
    try {
      // Logout is a per-user event; cabin_id is intentionally null
      // since a session may span multiple cabins. Role reported as
      // "charterer" for compatibility (audit consumers expect it).
      await writeAudit({
        cabinId: null,
        actorEmail: session.email,
        actorRole: "charterer",
        action: AUDIT_ACTIONS.SESSION_DESTROYED,
        metadata: { memberships_count: session.memberships?.length ?? 0 },
      });
    } catch {}
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  // 2026-05-21 — Also clear the admin preview marker, in case
  // this logout is the "Exit preview" button in CabinShell.
  // No-op for normal customer logouts (cookie not set).
  res.cookies.set(PREVIEW_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
