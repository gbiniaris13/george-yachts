// app/api/cabin/admin/reopen-brief/route.js
// =============================================================
// 2026-05-22 — Admin endpoint to reopen a previously-submitted
// brief.
//
// Once the principal hits "Send to George" on the cabin's
// brief review screen, the brief is locked: cabins.brief_
// submitted_at is set and every /api/cabin/brief/:section PUT
// rejects with 423. The CRM calls THIS endpoint when George
// hits "Reopen brief" — clears the submission timestamps so
// guests can edit again.
//
// Auth: x-cabin-admin-secret (same shared secret the CRM uses
// for every cabin-admin operation).
//
// Body: { cabin_id, actor_email }
// Returns: { ok, was_submitted, submitted_at? }
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit } from "@/lib/cabin/audit";

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
  const actorEmail = body?.actor_email || "admin";
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });
  }

  const db = getCabinDb();
  const current = await dbQuery(
    db
      .from("cabins")
      .select("brief_submitted_at")
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!current) {
    return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
  }
  const wasSubmittedAt = current.brief_submitted_at;

  // Clear the lock — both timestamp and member id.
  await dbQuery(
    db
      .from("cabins")
      .update({
        brief_submitted_at: null,
        brief_submitted_by_member_id: null,
      })
      .eq("id", cabinId),
  );

  try {
    await writeAudit({
      cabinId,
      actorEmail,
      actorRole: "admin",
      action: "brief_reopened",
      metadata: {
        previously_submitted_at: wasSubmittedAt,
      },
    });
  } catch (e) {
    // audit failure is non-fatal
    console.warn("[admin/reopen-brief] audit failed:", e);
  }

  return NextResponse.json({
    ok: true,
    was_submitted: Boolean(wasSubmittedAt),
    previously_submitted_at: wasSubmittedAt ?? null,
  });
}
