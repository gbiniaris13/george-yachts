// app/api/cabin/guests/route.js
// =============================================================
// Charterer-only API for inviting / listing / removing guest
// members on their cabin. Each invited guest also auto-enrolls
// into the Filotimo Circle via the DB trigger.
// =============================================================

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership, createMagicLinkOtp } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { sendMagicLinkEmail } from "@/lib/cabin/email";

export const runtime = "nodejs";

const ALLOWED_INVITER_ROLES = new Set(["principal_charterer", "designated_assistant"]);

// Any-member gate — used by GET. Returns { session, cabinId, member } or { error }.
async function authGate() {
  const session = await readSessionFromCookies();
  if (!session) return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  const member = resolveMembership(session, cabinId);
  if (!member) return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  return { session, cabinId, member };
}

// Charterer-only gate — used by POST and DELETE.
// Resolves role from the ACTIVE cabin membership (not index 0), so a
// user holding both charterer and guest memberships across different
// cabins cannot escalate.
async function inviterGate() {
  const r = await authGate();
  if (r.error) return r;
  if (!ALLOWED_INVITER_ROLES.has(r.member.role)) {
    return { error: NextResponse.json({ ok: false, error: "guest-cannot-invite" }, { status: 403 }) };
  }
  return r;
}

export async function GET() {
  const a = await authGate();
  if (a.error) return a.error;
  const db = getCabinDb();
  const data = await dbQuery(
    db.from("cabin_members")
      .select("id, role, email, display_name, invite_sent_at, last_login_at, personal_details_completed_at, is_brief_admin, brief_participation_opt_out_at, brief_participation_opt_out_note, created_at")
      .eq("cabin_id", a.cabinId)
      .is("deleted_at", null)
      .order("created_at")
  );
  return NextResponse.json({
    ok: true,
    members: data ?? [],
    viewer: {
      member_id: a.member.member_id,
      role: a.member.role,
      email: a.session.email,
    },
  });
}

export async function POST(req) {
  const a = await inviterGate();
  if (a.error) return a.error;

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const display_name = body?.display_name ? String(body.display_name).slice(0, 120) : null;
  const sendInvite = body?.send_invite !== false;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }
  if (email === String(a.session.email).toLowerCase()) {
    return NextResponse.json({ ok: false, error: "cannot-invite-self" }, { status: 400 });
  }

  const db = getCabinDb();

  // Insert as guest. Conflict on (cabin_id, email) → no-op then read.
  const existing = await dbQuery(
    db.from("cabin_members")
      .select("id, role")
      .eq("cabin_id", a.cabinId)
      .ilike("email", email)
      .maybeSingle()
  );

  let member;
  if (existing) {
    member = existing;
  } else {
    member = await dbQuery(
      db.from("cabin_members")
        .insert({
          cabin_id: a.cabinId,
          role: "guest",
          email,
          display_name,
          invite_sent_at: sendInvite ? new Date().toISOString() : null,
        })
        .select()
        .single()
    );
  }

  // Get cabin for the email template
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, charter_period_from, charter_period_to")
      .eq("id", a.cabinId)
      .maybeSingle()
  );

  let mailed = false;
  if (sendInvite) {
    try {
      // Pin the magic link to THIS cabin so the recipient lands on
      // it (not whatever cabin happens to sort first for their
      // email). Critical when a guest is invited to multiple cabins
      // by different principals — without the pin they'd land on
      // the wrong one.
      const otp = await createMagicLinkOtp(email, a.cabinId);
      const origin = new URL(req.url).origin;
      const link = `${origin}/api/cabin/auth/verify?token=${encodeURIComponent(otp)}`;
      await sendMagicLinkEmail({
        to: email,
        displayName: display_name,
        vesselName: cabin?.vessel_name ?? "your charter",
        fromDate: cabin?.charter_period_from ?? "",
        toDate: cabin?.charter_period_to ?? "",
        link,
      });
      mailed = true;
      // Stamp invite_sent_at for resends too — otherwise the
      // principal's group page can't tell whether a guest was
      // re-prodded today vs invited 3 weeks ago.
      if (existing) {
        await dbQuery(
          db.from("cabin_members")
            .update({ invite_sent_at: new Date().toISOString() })
            .eq("id", existing.id)
        );
      }
    } catch (err) {
      console.error("[guests] invite send error:", err);
    }
  }

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.CABIN_INVITE_SENT,
    metadata: { to: email, mailed, kind: "guest" },
  });

  return NextResponse.json({ ok: true, member, mailed });
}

export async function DELETE(req) {
  const a = await inviterGate();
  if (a.error) return a.error;

  const body = await req.json().catch(() => null);
  const memberId = body?.member_id;
  if (!memberId) return NextResponse.json({ ok: false }, { status: 400 });

  const db = getCabinDb();
  // Guard: cannot delete the principal charterer (themselves)
  const row = await dbQuery(
    db.from("cabin_members")
      .select("id, role, email")
      .eq("id", memberId)
      .eq("cabin_id", a.cabinId)
      .maybeSingle()
  );
  if (!row) return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
  if (row.role === "principal_charterer") {
    return NextResponse.json({ ok: false, error: "cannot-remove-principal" }, { status: 400 });
  }

  await dbQuery(
    db.from("cabin_members")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", memberId)
      .eq("cabin_id", a.cabinId)
  );

  return NextResponse.json({ ok: true });
}
