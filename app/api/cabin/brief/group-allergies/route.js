// app/api/cabin/brief/group-allergies/route.js
// =============================================================
// GET /api/cabin/brief/group-allergies
//
// 2026-05-23 — George friend test 4: the AllergyAlert on
// /cabin/brief/dining (the principal's brief surface) only read
// the PRINCIPAL'S Health section. It missed every guest's allergy
// entered via /cabin/me (e.g. Bill's "Nuts allergy", Olga's
// "pineapple allergy"). Safety-critical: the chef + hostess look
// at the principal brief and need to see EVERY allergy in the
// group, not just the principal's.
//
// This endpoint returns an aggregated, per-member list of every
// allergy / dietary / medical fact in the cabin:
//
//   1. The principal-brief Health section (cabin_brief_sections.
//      health.allergies_dietary / medical_conditions /
//      medications_onboard). This is the canonical broker copy
//      the principal wrote on behalf of the group.
//   2. Every cabin_member.personal_details.allergies_dietary +
//      dietary_preferences, with the member's display_name so
//      the chef knows "Nuts (Bill)", "pineapple (Olga)" etc.
//
// Caller is any cabin member — the data is safety information
// every person aboard has a right to know.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const db = getCabinDb();

  // 1. Principal's Health-section answer.
  const healthRow = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("data")
      .eq("cabin_id", cabinId)
      .eq("section_key", "health")
      .maybeSingle(),
  );
  const healthData = healthRow?.data ?? {};
  const healthAllergies = (healthData.allergies_dietary || "").trim();
  const healthConditions = (healthData.medical_conditions || "").trim();
  const healthMeds = (healthData.medications_onboard || "").trim();

  // 2. Every member's personal_details allergies + dietary array.
  const members = await dbQuery(
    db
      .from("cabin_members")
      .select("id, display_name, email, role, personal_details")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null),
  );

  const memberLines = [];
  for (const m of members ?? []) {
    const pd = m.personal_details ?? {};
    const allergies = String(pd.allergies_dietary || "").trim();
    const dietary = Array.isArray(pd.dietary_preferences)
      ? pd.dietary_preferences.filter(Boolean)
      : [];
    // Skip members who reported nothing — keep the panel signal-
    // dense. Empty members surface as a roll-up count instead.
    const hasAny = (allergies && allergies.toLowerCase() !== "none") ||
      dietary.length > 0;
    if (!hasAny) continue;
    memberLines.push({
      memberId: m.id,
      name: m.display_name || m.email || "(member)",
      role: m.role,
      allergies: allergies && allergies.toLowerCase() !== "none"
        ? allergies
        : null,
      dietary,
    });
  }

  // Roll-up: how many members have NO allergy / dietary info on
  // record? Useful context so a half-empty brief reads as
  // "incomplete" not "all clear".
  const totalMembers = (members ?? []).length;
  const membersWithData = memberLines.length;
  const membersClean = totalMembers - membersWithData;

  return NextResponse.json({
    ok: true,
    // Section-level (principal-written) facts — these describe the
    // group as a whole, not any one person. Render first.
    section: {
      allergies: healthAllergies,
      medical_conditions: healthConditions,
      medications_onboard: healthMeds,
    },
    // Per-member personal facts — render below the section block,
    // attributed by name so the chef can plan around each diner.
    members: memberLines,
    // Counts so the UI can say "3 of 8 members have shared
    // allergy/dietary info; the rest are clean."
    counts: {
      total: totalMembers,
      withData: membersWithData,
      clean: membersClean,
    },
  });
}
