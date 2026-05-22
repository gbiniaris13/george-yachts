// app/api/cabin/me/opt-out-brief/route.js
// =============================================================
// POST /api/cabin/me/opt-out-brief
//
// A cabin_member opts out (or back in) of choosing orders /
// cellar selections on their own behalf. Personal facts
// (allergies, dietary, swimming, passport) REMAIN mandatory —
// this only covers preference choices. The act is recorded as
// proof.
//
// Body: { opt_out: boolean, note?: string }
// Returns: { ok, audit_action, opt_out_at }
//
// Each member can only set their OWN opt-out — no admin override
// (would defeat the "proof from the guest's own click" goal).
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

  const body = await req.json().catch(() => null);
  const optOut = body?.opt_out === true;
  const note = typeof body?.note === "string" ? body.note.trim() : null;

  const db = getCabinDb();
  const optOutAt = optOut ? new Date().toISOString() : null;

  await dbQuery(
    db
      .from("cabin_members")
      .update({
        brief_participation_opt_out_at: optOutAt,
        brief_participation_opt_out_note: optOut ? (note || null) : null,
      })
      .eq("id", me.member_id),
  );

  const action = optOut
    ? AUDIT_ACTIONS.GUEST_OPTED_OUT_BRIEF
    : AUDIT_ACTIONS.GUEST_OPTED_IN_BRIEF;

  try {
    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole: me.role,
      action,
      metadata: {
        opt_out: optOut,
        note: optOut ? (note || null) : null,
      },
    });
  } catch (e) {
    console.warn("[cabin/me/opt-out-brief] audit failed:", e);
  }

  return NextResponse.json({
    ok: true,
    audit_action: action,
    opt_out_at: optOutAt,
  });
}
