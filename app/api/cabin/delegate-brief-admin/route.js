// app/api/cabin/delegate-brief-admin/route.js
// =============================================================
// POST /api/cabin/delegate-brief-admin
//
// Principal-only. Grants or revokes the is_brief_admin flag on
// a cabin_member so that member can press "Send to George" on
// the brief review screen (the gate to ship the brief to the
// broker).
//
// Body: { member_id: uuid, is_admin: boolean }
// Returns: { ok, audit_action }
//
// The principal cannot delegate admin to themselves (they
// already have it via role) and cannot revoke their own
// principal role. Idempotent — re-setting the same value is a
// no-op (audit still records the explicit click).
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

export async function POST(req) {
  const session = await readSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const me = resolveMembership(session, cabinId);
  if (!me) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (me.role !== "principal_charterer") {
    return NextResponse.json(
      {
        ok: false,
        error: "only-principal",
        message:
          "Only the principal charterer can grant or revoke brief-admin rights.",
      },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const memberId = body?.member_id;
  const isAdmin = body?.is_admin === true;
  if (!memberId || typeof memberId !== "string") {
    return NextResponse.json(
      { ok: false, error: "member_id-required" },
      { status: 400 },
    );
  }

  const db = getCabinDb();
  // Look up the target member and verify they belong to THIS cabin.
  const target = await dbQuery(
    db
      .from("cabin_members")
      .select("id, email, role, display_name, is_brief_admin, cabin_id")
      .eq("id", memberId)
      .maybeSingle(),
  );
  if (!target || target.cabin_id !== cabinId) {
    return NextResponse.json(
      { ok: false, error: "no-such-member" },
      { status: 404 },
    );
  }

  // Reject delegation to the principal themselves — they already
  // have the right via role.
  if (target.role === "principal_charterer") {
    return NextResponse.json(
      {
        ok: false,
        error: "cannot-delegate-to-principal",
        message:
          "The principal charterer already has admin rights — no delegation needed.",
      },
      { status: 400 },
    );
  }

  // Idempotent — if the desired state already matches, return ok
  // without writing or auditing.
  if (Boolean(target.is_brief_admin) === isAdmin) {
    return NextResponse.json({ ok: true, no_change: true });
  }

  await dbQuery(
    db
      .from("cabin_members")
      .update({ is_brief_admin: isAdmin })
      .eq("id", memberId),
  );

  const action = isAdmin
    ? AUDIT_ACTIONS.DELEGATED_BRIEF_ADMIN
    : AUDIT_ACTIONS.REVOKED_BRIEF_ADMIN;

  try {
    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole: me.role,
      action,
      metadata: {
        delegated_to_member_id: memberId,
        delegated_to_email: target.email,
        delegated_to_display_name: target.display_name || null,
      },
    });
  } catch (e) {
    console.warn("[cabin/delegate-brief-admin] audit failed:", e);
  }

  return NextResponse.json({ ok: true, audit_action: action });
}
