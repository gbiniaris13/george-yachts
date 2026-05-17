// app/api/cabin/profile/route.js
// =============================================================
// GET  — current profile (filotimo_circle_members + cabin_members)
// PUT  — { display_name, date_of_birth, hometown, anniversary_date }
//
// Used by /cabin/welcome (first-login onboarding) and the
// Transparency Dashboard for self-editing. Every field is
// optional — we never block the user on capturing PII.
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

function clean(s, max = 160) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t.slice(0, max) : null;
}

// ISO date YYYY-MM-DD only
function cleanDate(s) {
  if (typeof s !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim()) ? s.trim() : null;
}

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const db = getCabinDb();
  const [member, circle] = await Promise.all([
    dbQuery(
      db.from("cabin_members")
        .select("display_name, mobile")
        .ilike("email", session.email)
        .is("deleted_at", null)
        .limit(1)
        .maybeSingle()
    ),
    dbQuery(
      db.from("filotimo_circle_members")
        .select("display_name, date_of_birth, anniversary_date, hometown")
        .ilike("email", session.email)
        .is("deleted_at", null)
        .maybeSingle()
    ),
  ]);

  const profile = {
    email: session.email,
    display_name: member?.display_name ?? circle?.display_name ?? null,
    mobile: member?.mobile ?? null,
    date_of_birth: circle?.date_of_birth ?? null,
    anniversary_date: circle?.anniversary_date ?? null,
    hometown: circle?.hometown ?? null,
  };

  const complete = Boolean(
    profile.display_name && profile.date_of_birth && profile.hometown
  );

  return NextResponse.json({ ok: true, profile, complete });
}

export async function PUT(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  const member = cabinId ? resolveMembership(session, cabinId) : null;

  const body = await req.json().catch(() => null);
  const patch = {
    display_name: clean(body?.display_name, 120),
    mobile: clean(body?.mobile, 40),
    date_of_birth: cleanDate(body?.date_of_birth),
    anniversary_date: cleanDate(body?.anniversary_date),
    hometown: clean(body?.hometown, 120),
  };

  const db = getCabinDb();

  // Update cabin_members rows for the user across all their cabins
  // — name + mobile travel with the person across cabins.
  if (patch.display_name || patch.mobile) {
    const u = {};
    if (patch.display_name) u.display_name = patch.display_name;
    if (patch.mobile) u.mobile = patch.mobile;
    await dbQuery(
      db.from("cabin_members")
        .update(u)
        .ilike("email", session.email)
        .is("deleted_at", null)
    );
  }

  // Update filotimo_circle_members (person-scoped, one row per email)
  const circleUpdate = {};
  if (patch.display_name) circleUpdate.display_name = patch.display_name;
  if (patch.date_of_birth) circleUpdate.date_of_birth = patch.date_of_birth;
  if (patch.anniversary_date) circleUpdate.anniversary_date = patch.anniversary_date;
  if (patch.hometown) circleUpdate.hometown = patch.hometown;
  if (Object.keys(circleUpdate).length > 0) {
    await dbQuery(
      db.from("filotimo_circle_members")
        .update(circleUpdate)
        .ilike("email", session.email)
    );
  }

  const filledFields = Object.keys(patch).filter((k) => patch[k]);

  await writeAudit({
    cabinId: cabinId ?? null,
    actorEmail: session.email,
    actorRole: member?.role ?? "charterer",
    action: AUDIT_ACTIONS.CONSENT_CHANGED,
    metadata: { kind: "profile_update", fields: filledFields },
  });

  // Notify George when someone (especially a newly-invited guest)
  // fills in personal details — so he can capture birthdays,
  // hometowns and names without asking again.
  if (filledFields.length > 0) {
    void notifyGeorge({
      icon: "👤",
      title: "Cabin profile updated",
      lines: [
        `From: ${patch.display_name || session.email}`,
        `Email: ${session.email}`,
        patch.date_of_birth ? `DOB: ${patch.date_of_birth}` : null,
        patch.hometown ? `Hometown: ${patch.hometown}` : null,
        patch.mobile ? `Mobile: ${patch.mobile}` : null,
        patch.anniversary_date ? `Anniversary: ${patch.anniversary_date}` : null,
      ],
      link: cabinId ? `/dashboard/cabins/${cabinId}` : "",
    });
  }

  return NextResponse.json({ ok: true });
}
