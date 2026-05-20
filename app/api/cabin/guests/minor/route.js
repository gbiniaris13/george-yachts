// app/api/cabin/guests/minor/route.js
// =============================================================
// 2026-05-20 — Friend-test pass 4 round 5 (Sarah, mother of 2):
//   "My kids are 8 and 11. They do not have email addresses. The
//    Guests page is built around 'Add an email for each guest'.
//    Either I can't add my kids, or the system contradicts its own
//    promise that I don't need to fill in for them."
//
// POST: add a minor passenger directly to cabin_guests_manifest
// (no email, no member account). Crew list PDF in GY Command
// aggregates these alongside the adult members.
//
// Body: { first_name, last_name, date_of_birth?, allergies_dietary? }
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

const ALLOWED_ADDER_ROLES = new Set([
  "principal_charterer",
  "designated_assistant",
]);

function clean(s, max = 240) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t.slice(0, max) : null;
}
function cleanDate(s) {
  if (typeof s !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim()) ? s.trim() : null;
}

export async function POST(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const membership = resolveMembership(session, cabinId);
  if (!membership || !ALLOWED_ADDER_ROLES.has(membership.role)) {
    return NextResponse.json(
      { ok: false, error: "guest-cannot-add-minor" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const firstName = clean(body?.first_name, 60);
  const lastName = clean(body?.last_name, 80);
  if (!firstName || !lastName) {
    return NextResponse.json(
      { ok: false, error: "name-required" },
      { status: 400 }
    );
  }

  const db = getCabinDb();

  // Find the next available guest_order so we don't collide with
  // existing manifest rows (the table has a unique constraint on
  // (cabin_id, guest_order)).
  const existing = await dbQuery(
    db
      .from("cabin_guests_manifest")
      .select("guest_order")
      .eq("cabin_id", cabinId)
      .order("guest_order", { ascending: false })
      .limit(1)
  );
  const nextOrder =
    Array.isArray(existing) && existing[0]?.guest_order != null
      ? Number(existing[0].guest_order) + 1
      : 1;

  const row = {
    cabin_id: cabinId,
    guest_order: nextOrder,
    full_name: `${firstName} ${lastName}`,
    date_of_birth: cleanDate(body?.date_of_birth),
    allergies_dietary: clean(body?.allergies_dietary, 400),
    is_minor: true,
  };

  const inserted = await dbQuery(
    db.from("cabin_guests_manifest").insert(row).select().single()
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: membership.role,
    action: AUDIT_ACTIONS.CABIN_INVITE_SENT,
    metadata: { kind: "minor_added", name: row.full_name, age_known: !!row.date_of_birth },
  });

  return NextResponse.json({ ok: true, manifest_id: inserted?.id });
}
