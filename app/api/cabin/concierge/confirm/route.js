// app/api/cabin/concierge/confirm/route.js
// =============================================================
// POST  /api/cabin/concierge/confirm
//
// Client-facing endpoint. The charterer clicks "Everything looks
// correct" in the concierge banner; this finalizes the handoff:
//   • cabins.concierge_mode_active   → false
//   • cabins.brief_submitted_at      → now()
//   • audit log entry
// =============================================================

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

export async function POST() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });

  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins").select("concierge_mode_active, brief_submitted_at").eq("id", cabinId).maybeSingle()
  );
  if (!cabin) return NextResponse.json({ ok: false }, { status: 404 });

  // Idempotent: if already confirmed, just return ok.
  if (!cabin.concierge_mode_active && cabin.brief_submitted_at) {
    return NextResponse.json({ ok: true, already: true });
  }

  await dbQuery(
    db.from("cabins")
      .update({
        concierge_mode_active: false,
        concierge_mode_activated_at: null,
        concierge_mode_activated_by_email: null,
        brief_submitted_at: new Date().toISOString(),
        status: "active",
      })
      .eq("id", cabinId)
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: member.role,
    action: AUDIT_ACTIONS.CONCIERGE_MODE_OFF,
    metadata: { reason: "client-confirmed" },
  });
  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: member.role,
    action: AUDIT_ACTIONS.BRIEF_SUBMITTED,
    metadata: { via: "concierge-confirm" },
  });

  return NextResponse.json({ ok: true });
}
