// app/api/cabin/me/route.js
// =============================================================
// 2026-05-20 — Phase 2 invite-first architecture.
//
// Each cabin_members row owns its own personal_details JSONB.
// Guests (and the principal too) fill THEIR OWN data — they don't
// rely on the principal charterer to remember 12 people's
// passport numbers and allergies.
//
// GET  — current member's personal_details for the active cabin
// PUT  — patch personal_details for the current session's row
//
// Both routes scope strictly to (session.email, active cabin).
// A guest cannot see or write anyone else's data.
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

// -----------------------------------------------------------
// Cleaners — defensive against arbitrary user input
// -----------------------------------------------------------
function cleanStr(s, max = 240) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t.slice(0, max) : null;
}
function cleanDate(s) {
  if (typeof s !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim()) ? s.trim() : null;
}
function cleanEnum(s, allowed) {
  if (typeof s !== "string") return null;
  return allowed.includes(s) ? s : null;
}
function cleanStrArray(arr, max = 24) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0 && v.length < 80)
    .slice(0, max);
}

// The shape we persist in cabin_members.personal_details.
// Keep this list small — every field is optional, every field is
// honest about why we ask. Brokers reflex: anything that hints at
// the management company / ownership stays OUT.
const SWIMS_VALUES = ["confident", "some", "non_swimmer", "prefer_not_say"];

function sanitisePersonalDetails(body) {
  return {
    date_of_birth: cleanDate(body?.date_of_birth),
    nationality: cleanStr(body?.nationality, 80),
    passport_number: cleanStr(body?.passport_number, 32),
    passport_expiry: cleanDate(body?.passport_expiry),
    allergies_dietary: cleanStr(body?.allergies_dietary, 600),
    dietary_preferences: cleanStrArray(body?.dietary_preferences),
    swims: cleanEnum(body?.swims, SWIMS_VALUES),
    mobility_notes: cleanStr(body?.mobility_notes, 600),
    cabin_pairing: cleanStr(body?.cabin_pairing, 120),
    special_dates_during_charter: cleanStr(
      body?.special_dates_during_charter,
      400
    ),
    anything_else: cleanStr(body?.anything_else, 600),
  };
}

// Minimum we ask for a member to count as "details complete" —
// just DOB and the allergies/dietary line. Anything more is
// nice-to-have. This drives the "details complete" badge on
// the principal's group page.
function isComplete(details) {
  return Boolean(details?.date_of_birth && details?.allergies_dietary);
}

// -----------------------------------------------------------
// GET — read THIS member's row for the active cabin
// -----------------------------------------------------------
export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 400 });
  }
  const membership = resolveMembership(session, cabinId);
  if (!membership) {
    return NextResponse.json({ ok: false, error: "no-membership" }, { status: 403 });
  }

  const db = getCabinDb();
  const row = await dbQuery(
    db
      .from("cabin_members")
      .select("id, role, display_name, email, personal_details, personal_details_completed_at")
      .eq("id", membership.member_id)
      .maybeSingle()
  );

  if (!row) {
    return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    member: {
      id: row.id,
      role: row.role,
      display_name: row.display_name,
      email: row.email,
      personal_details: row.personal_details ?? {},
      completed_at: row.personal_details_completed_at,
    },
  });
}

// -----------------------------------------------------------
// PUT — patch THIS member's personal_details
// -----------------------------------------------------------
export async function PUT(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 400 });
  }
  const membership = resolveMembership(session, cabinId);
  if (!membership) {
    return NextResponse.json({ ok: false, error: "no-membership" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const patch = sanitisePersonalDetails(body);

  // Drop empty keys so the JSONB doesn't accumulate { x: null } noise.
  const cleaned = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v == null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    cleaned[k] = v;
  }

  const completedAt = isComplete(cleaned) ? new Date().toISOString() : null;

  const db = getCabinDb();

  // Read existing row so we merge (vs. clobber) — letting the user
  // patch a single field without losing the rest.
  const existing = await dbQuery(
    db
      .from("cabin_members")
      .select("personal_details, personal_details_completed_at")
      .eq("id", membership.member_id)
      .maybeSingle()
  );

  const merged = {
    ...(existing?.personal_details ?? {}),
    ...cleaned,
  };

  // Once completed, keep the timestamp even if the user later edits
  // and removes a field (we don't want to flicker the badge state).
  const stampedCompletedAt =
    existing?.personal_details_completed_at ?? completedAt;

  await dbQuery(
    db
      .from("cabin_members")
      .update({
        personal_details: merged,
        personal_details_completed_at: stampedCompletedAt,
      })
      .eq("id", membership.member_id)
  );

  // Audit + George ping. Only emit the ping the first time a member
  // completes — subsequent edits don't need to wake him up.
  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: membership.role,
    action: AUDIT_ACTIONS.CONSENT_CHANGED,
    metadata: {
      kind: "personal_details_update",
      fields: Object.keys(cleaned),
      completed: Boolean(stampedCompletedAt),
    },
  });

  const firstCompletion =
    !existing?.personal_details_completed_at && Boolean(stampedCompletedAt);
  if (firstCompletion) {
    void notifyGeorge({
      icon: "🪪",
      title: "Cabin member shared their details",
      lines: [
        `From: ${session.email}`,
        membership.role === "principal_charterer"
          ? "Role: principal charterer"
          : "Role: guest",
        cleaned.allergies_dietary
          ? `Allergies/dietary: ${cleaned.allergies_dietary.slice(0, 100)}${cleaned.allergies_dietary.length > 100 ? "…" : ""}`
          : null,
      ],
      link: `/dashboard/cabins/${cabinId}`,
    });
  }

  return NextResponse.json({
    ok: true,
    completed: Boolean(stampedCompletedAt),
  });
}
