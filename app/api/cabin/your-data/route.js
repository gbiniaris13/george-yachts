// GET — aggregate all data points we hold about the current user
// DELETE — body { kind: 'cabin_member_field' | 'consent', target: ... }
//          erases a specific consent / nulls a field

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);

  const db = getCabinDb();

  const member = await dbQuery(
    db.from("cabin_members")
      .select("id, role, email, display_name, mobile, consents, last_login_at")
      .ilike("email", session.email)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle()
  );

  const consents = await dbQuery(
    db.from("cabin_data_consents")
      .select("*")
      .ilike("email", session.email)
      .order("created_at", { ascending: false })
  );

  const circle = await dbQuery(
    db.from("filotimo_circle_members")
      .select("voyages_count, tier, joined_at, date_of_birth, anniversary_date, hometown")
      .ilike("email", session.email)
      .is("deleted_at", null)
      .maybeSingle()
  );

  return NextResponse.json({
    ok: true,
    cabin_id: cabinId,
    profile: {
      email: session.email,
      display_name: member?.display_name,
      mobile: member?.mobile,
      role: member?.role,
      last_login_at: member?.last_login_at,
    },
    consents_inline: member?.consents ?? {},
    consents: consents ?? [],
    circle,
  });
}

export async function DELETE(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });
  const actorRole = member.role;

  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  const target = body?.target;

  const db = getCabinDb();

  if (kind === "inline_consent" && typeof target === "string") {
    // Toggle off one of the JSONB inline consents on cabin_members.
    // Read-modify-write (RPC variant removed — was never deployed).
    const m = await dbQuery(
      db.from("cabin_members")
        .select("id, consents")
        .ilike("email", session.email)
        .limit(1)
        .maybeSingle()
    );
    if (m) {
      const next = { ...(m.consents || {}), [target]: false };
      await dbQuery(
        db.from("cabin_members").update({ consents: next }).eq("id", m.id)
      );
    }

    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole,
      action: AUDIT_ACTIONS.CONSENT_CHANGED,
      metadata: { key: target, value: false },
    });
    return NextResponse.json({ ok: true });
  }

  if (kind === "consent_row" && typeof target === "string") {
    await dbQuery(
      db.from("cabin_data_consents")
        .update({ consent_state: "withdrawn" })
        .eq("id", target)
        .ilike("email", session.email)
    );
    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole,
      action: AUDIT_ACTIONS.CONSENT_CHANGED,
      metadata: { id: target, value: "withdrawn" },
    });
    return NextResponse.json({ ok: true });
  }

  if (kind === "profile_field" && typeof target === "string") {
    const allowed = new Set(["display_name", "mobile"]);
    if (!allowed.has(target)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await dbQuery(
      db.from("cabin_members")
        .update({ [target]: null })
        .ilike("email", session.email)
    );
    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole,
      action: AUDIT_ACTIONS.DATA_DELETED,
      targetField: target,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown-kind" }, { status: 400 });
}
