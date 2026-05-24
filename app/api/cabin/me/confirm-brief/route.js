// app/api/cabin/me/confirm-brief/route.js
// =============================================================
// POST /api/cabin/me/confirm-brief
//
// Toggle the calling member's brief_confirmed_at timestamp.
// Body: { confirmed: true | false }
//
// 2026-05-24 — George friend test 4 final: per-member explicit
// confirmation of brief participation. Set when the member
// presses the Confirm CTA on /cabin/brief; cleared when they
// revoke. Used by the cabin-home readiness card and the
// Send-to-George gate.
//
// Blocked when the brief has already been submitted (same lock
// posture as every other brief write). Members can only set
// their OWN flag.
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

  const db = getCabinDb();

  // Same lock as every other brief write.
  const cabinLock = await dbQuery(
    db
      .from("cabins")
      .select("brief_submitted_at")
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (cabinLock?.brief_submitted_at) {
    return NextResponse.json(
      {
        ok: false,
        error: "brief-submitted",
        message:
          "The brief has already been sent to George. Ask the principal charterer if anything needs reopening.",
      },
      { status: 423 },
    );
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    // tolerate an empty body — treat as a confirm
  }
  const confirmed = body?.confirmed !== false; // default true
  const confirmedAt = confirmed ? new Date().toISOString() : null;

  await dbQuery(
    db
      .from("cabin_members")
      .update({ brief_confirmed_at: confirmedAt })
      .eq("id", me.member_id),
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: me.role,
    action: AUDIT_ACTIONS.BRIEF_SECTION_SAVED,
    targetSection: confirmed
      ? "brief-confirmed"
      : "brief-confirmation-revoked",
    metadata: { at: confirmedAt },
  });

  return NextResponse.json({
    ok: true,
    confirmed,
    confirmed_at: confirmedAt,
  });
}
