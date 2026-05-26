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
// 2026-05-22 — gender + mobile added because the Crew List
// (port-authority paperwork) needs them. They live alongside the
// chef + captain fields in the same JSONB blob to avoid a schema
// migration; the UI groups them visually as the mandatory bloc.
const SWIMS_VALUES = ["confident", "some", "non_swimmer", "prefer_not_say"];
const GENDER_VALUES = ["male", "female", "non_binary", "prefer_not_say"];

function sanitisePersonalDetails(body) {
  return {
    // ----- Crew-list essentials (mandatory before the brief can lock)
    date_of_birth: cleanDate(body?.date_of_birth),
    gender: cleanEnum(body?.gender, GENDER_VALUES),
    nationality: cleanStr(body?.nationality, 80),
    passport_number: cleanStr(body?.passport_number, 32),
    passport_expiry: cleanDate(body?.passport_expiry),
    mobile: cleanStr(body?.mobile, 32),
    // ----- Chef + captain niceties (optional)
    allergies_dietary: cleanStr(body?.allergies_dietary, 600),
    dietary_preferences: cleanStrArray(body?.dietary_preferences),
    swims: cleanEnum(body?.swims, SWIMS_VALUES),
    mobility_notes: cleanStr(body?.mobility_notes, 600),
    cabin_pairing: cleanStr(body?.cabin_pairing, 120),
    // 2026-05-26 — Brief 02 (Task A3.3): shoe_size lives in the
    // Aboard step of the /cabin/me wizard. It's a string (not a
    // number) so charterers can enter "EU 42", "US 9", "UK 7"
    // etc. without us guessing a unit. ~12 chars is enough for
    // "EU 42 / US 9".
    shoe_size: cleanStr(body?.shoe_size, 24),
    special_dates_during_charter: cleanStr(
      body?.special_dates_during_charter,
      400
    ),
    anything_else: cleanStr(body?.anything_else, 600),
    // 2026-05-24 — Christos pass: explicit GDPR consent for sharing
    // the personal health info above with the captain/chef/hostess.
    consent_share_with_crew: Boolean(body?.consent_share_with_crew),
  };
}

// 2026-05-22 — Crew-list completeness gate. The brief cannot be
// sent to George until every non-opted-out cabin member has filled
// these five port-authority essentials. Allergies, dietary, and
// swimming are chef-related niceties and remain optional.
//
// personal_details_completed_at is the timestamp the rest of the
// app reads to mean "this member is brief-ready"; we now anchor it
// to the crew-list bar (not the old DOB + allergies bar).
function isCrewListComplete(details) {
  return Boolean(
    details?.date_of_birth &&
    details?.gender &&
    details?.nationality &&
    details?.passport_number &&
    details?.mobile,
  );
}
const isComplete = isCrewListComplete;

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
      .select("id, role, display_name, email, personal_details, personal_details_completed_at, is_brief_admin, brief_participation_opt_out_at, brief_participation_opt_out_note")
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
      is_brief_admin: Boolean(row.is_brief_admin),
      brief_opt_out_at: row.brief_participation_opt_out_at,
      brief_opt_out_note: row.brief_participation_opt_out_note,
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
