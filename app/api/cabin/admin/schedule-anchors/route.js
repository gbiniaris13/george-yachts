// app/api/cabin/admin/schedule-anchors/route.js
// =============================================================
// Admin endpoint — called by gy-command to schedule the full
// Memory Anchor sequence for a cabin.
//
// Auth: x-cabin-admin-secret must match CABIN_ADMIN_SECRET env var.
// =============================================================

import { NextResponse } from "next/server";
import { scheduleAnchorSequence } from "@/lib/cabin/anchors";
import { recordVoyageCompletion } from "@/lib/cabin/filotimo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;     // must be set in production
  const given = req.headers.get("x-cabin-admin-secret") || "";
  return given === expected;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  if (!cabinId) return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });

  try {
    // Two on-completion side effects, both safe to re-run:
    //   1. Schedule 8 memory anchor emails for every cabin member.
    //   2. Bump Filotimo Circle voyages_count + maybe upgrade tier
    //      for every cabin member (one row per email, not per cabin).
    const anchors = await scheduleAnchorSequence(cabinId);
    await recordVoyageCompletion(cabinId);
    return NextResponse.json({ ok: true, anchors });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
