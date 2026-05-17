// app/api/cabin/brief/submit/route.js
// =============================================================
// POST /api/cabin/brief/submit
//
// Charterer-initiated "I'm done with the brief" action. Stamps
// cabins.brief_submitted_at, flips status from invited/active to
// active (no-op if already), and writes an audit row.
//
// Idempotent — repeat calls are safe and return ok.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { notifyGeorge } from "@/lib/cabin/notify";

export const runtime = "nodejs";

export async function POST() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });

  const db = getCabinDb();

  await dbQuery(
    db.from("cabins")
      .update({
        brief_submitted_at: new Date().toISOString(),
        status: "active",
        // Charterer self-confirm also clears any leftover concierge
        // banner — they've taken ownership.
        concierge_mode_active: false,
        concierge_mode_activated_at: null,
        concierge_mode_activated_by_email: null,
      })
      .eq("id", cabinId)
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: member.role,
    action: AUDIT_ACTIONS.BRIEF_SUBMITTED,
    metadata: { via: "self-submit" },
  });

  // Notify George — fire-and-forget so a failed nudge never blocks
  // the client response.
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );
  void notifyGeorge({
    icon: "✅",
    title: "Charter Brief submitted",
    lines: [
      `From: ${cabin?.principal_charterer_name ?? session.email}`,
      `Re: ${cabin?.vessel_name ?? "—"}`,
    ],
    link: `/dashboard/cabins/${cabinId}`,
  });

  return NextResponse.json({ ok: true });
}
