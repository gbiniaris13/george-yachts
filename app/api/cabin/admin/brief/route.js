// app/api/cabin/admin/brief/route.js
// =============================================================
// Admin endpoint — gy-command calls this to save a brief section
// on behalf of a client (concierge mode). Service-role write,
// stamps last_edited_concierge = true.
//
// Body:  { cabin_id, section_key, data }
// Auth:  x-cabin-admin-secret === CABIN_ADMIN_SECRET
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { SECTION_SCHEMAS, sectionCompleteness } from "@/lib/cabin/schemas";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { recomputeCabinCompletion } from "@/lib/cabin/prefill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  const sectionKey = body?.section_key;
  const actorEmail = body?.actor_email || "admin@georgeyachts.com";

  if (!cabinId || !sectionKey) {
    return NextResponse.json({ ok: false, error: "cabin_id + section_key required" }, { status: 400 });
  }

  const schema = SECTION_SCHEMAS[sectionKey];
  if (!schema) {
    return NextResponse.json({ ok: false, error: "unknown-section" }, { status: 400 });
  }

  const parsed = schema.safeParse(body?.data ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const completeness = sectionCompleteness(sectionKey, parsed.data);
  const completed = completeness >= 40;

  const db = getCabinDb();
  await dbQuery(
    db.from("cabin_brief_sections").upsert(
      {
        cabin_id: cabinId,
        section_key: sectionKey,
        data: parsed.data,
        completed,
        last_edited_at: new Date().toISOString(),
        last_edited_by_email: actorEmail.toLowerCase(),
        last_edited_concierge: true,
      },
      { onConflict: "cabin_id,section_key" }
    )
  );

  await writeAudit({
    cabinId,
    actorEmail,
    actorRole: "admin",
    action: AUDIT_ACTIONS.CONCIERGE_FIELD_SAVED,
    targetSection: sectionKey,
  });

  const overallPercent = await recomputeCabinCompletion(cabinId);
  return NextResponse.json({ ok: true, completed, overall_percent: overallPercent });
}
