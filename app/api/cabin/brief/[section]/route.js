// app/api/cabin/brief/[section]/route.js
// =============================================================
// GET  /api/cabin/brief/:section   — fetch section data
// PUT  /api/cabin/brief/:section   — autosave section data
//
// Authentication: validates the gy_cabin_session cookie. The
// session carries the cabin_id list — we authorize against that
// rather than re-querying.
// =============================================================

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { SECTION_SCHEMAS, sectionCompleteness } from "@/lib/cabin/schemas";
import { normalizeBriefPayload } from "@/lib/cabin/brief-normalize";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { recomputeCabinCompletion } from "@/lib/cabin/prefill";

export const runtime = "nodejs";

async function authorizeSection(params) {
  const session = await readSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  }
  const { section } = params;
  if (!SECTION_SCHEMAS[section]) {
    return { error: NextResponse.json({ ok: false }, { status: 404 }) };
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  }
  const member = resolveMembership(session, cabinId);
  if (!member) {
    return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  }
  return { session, cabinId, section, member };
}

export async function GET(_req, ctx) {
  const params = await ctx.params;
  const a = await authorizeSection(params);
  if (a.error) return a.error;

  const db = getCabinDb();
  const row = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("data, completed, last_edited_at")
      .eq("cabin_id", a.cabinId)
      .eq("section_key", a.section)
      .maybeSingle()
  );
  return NextResponse.json({ ok: true, data: row?.data ?? {}, completed: !!row?.completed });
}

export async function PUT(req, ctx) {
  const params = await ctx.params;
  const a = await authorizeSection(params);
  if (a.error) return a.error;

  // 2026-05-22 — Brief submission lock.
  // Once the principal has hit "Submit final to George", the brief
  // is frozen until George explicitly re-opens it from the CRM
  // (concierge mode). All save attempts after that point return a
  // 423 LOCKED with a helpful message — the UI surfaces this as
  // "Your brief is with George" instead of the normal error toast.
  const dbLock = getCabinDb();
  const cabinLock = await dbQuery(
    dbLock
      .from("cabins")
      .select("brief_submitted_at")
      .eq("id", a.cabinId)
      .maybeSingle(),
  );
  if (cabinLock?.brief_submitted_at) {
    return NextResponse.json(
      {
        ok: false,
        error: "brief-submitted",
        message:
          "Your brief has already been sent to George. Ask George if you need to reopen it for changes.",
        submitted_at: cabinLock.brief_submitted_at,
      },
      { status: 423 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const schema = SECTION_SCHEMAS[a.section];

  // 2026-05-20 — friend-test fix. RHF sends form-shaped payloads
  // (HTML input quirks intact: "" for empty dates, false for empty
  // checkbox groups, single strings for solo-checked checkbox
  // groups, etc.). normalizeBriefPayload strips those before the
  // schema sees them — without this, 3/3 testers hit
  // "Couldn't save — retrying" loops in their first section.
  const cleaned = normalizeBriefPayload(body?.data ?? {}) ?? {};
  const parsed = schema.safeParse(cleaned);
  if (!parsed.success) {
    // Log to the server for forensic analysis but still return a
    // clean 400 — the client retries on the next change anyway.
    console.error("[cabin/brief] validation rejected", {
      section: a.section,
      issues: parsed.error.flatten(),
      // Trim cleaned payload to first 500 chars so we don't blow up
      // logs with full brief copies.
      payload_preview: JSON.stringify(cleaned).slice(0, 500),
    });
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const completeness = sectionCompleteness(a.section, parsed.data);
  // 2026-05-22 — Threshold dropped from 30 → 21 (≥3 populated
  // values per section). George filled the entire Itinerary
  // section after the activities-extras removal — pace,
  // preferred_areas, specific_places, night_preference (4 fields ×
  // 7 = 28) — and the tick stayed off because 28 < 30. The earlier
  // 30 was sized for a 5–6-visible-field section; after pruning
  // it is now too strict. 21 = 3 fields = "the principal has put
  // something thoughtful here", which is what the dot is meant to
  // signal. Tighter gating still happens at the final readiness
  // check before Send-to-George, where it belongs.
  const completed = completeness >= 21;

  const db = getCabinDb();
  await dbQuery(
    db.from("cabin_brief_sections").upsert(
      {
        cabin_id: a.cabinId,
        section_key: a.section,
        data: parsed.data,
        completed,
        last_edited_at: new Date().toISOString(),
        last_edited_by_email: a.session.email,
        // 2026-05-22 — Track the member-id too so the UI can
        // render "Last edited by [display_name]" without a join
        // on the email back-reference.
        last_edited_by_member_id: a.member?.member_id ?? null,
        last_edited_concierge: false,
      },
      { onConflict: "cabin_id,section_key" }
    )
  );

  // Once the client themselves edits a section, the concierge
  // handoff is effectively over — switch the flag off so the
  // banner disappears and the audit history reflects it.
  const cabin = await dbQuery(
    db.from("cabins").select("concierge_mode_active").eq("id", a.cabinId).maybeSingle()
  );
  if (cabin?.concierge_mode_active) {
    await dbQuery(
      db.from("cabins")
        .update({
          concierge_mode_active: false,
          concierge_mode_activated_at: null,
          concierge_mode_activated_by_email: null,
          status: "active",
        })
        .eq("id", a.cabinId)
    );
    await writeAudit({
      cabinId: a.cabinId,
      actorEmail: a.session.email,
      actorRole: a.member.role,
      action: AUDIT_ACTIONS.CONCIERGE_MODE_OFF,
      metadata: { reason: "client-edited-section", section: a.section },
    });
  }

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.BRIEF_SECTION_SAVED,
    targetSection: a.section,
  });

  const overallPercent = await recomputeCabinCompletion(a.cabinId);

  return NextResponse.json({
    ok: true,
    completed,
    completeness,
    overall_percent: overallPercent,
  });
}
