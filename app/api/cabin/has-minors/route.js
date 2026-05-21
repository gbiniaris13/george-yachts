// /api/cabin/has-minors — boolean signal used by client forms to
// decide whether to surface child-specific blocks (kids' meal
// arrangement in the dining section, baby cot / high chair toggles,
// etc).
//
// 2026-05-21 — Pass 7 prep (Domingo, Helen):
//   The Children block inside /cabin/brief/dining was rendered
//   unconditionally — guests with no children saw a "Children (if
//   any)" subheading with cot/high-chair toggles and a baby food
//   prompt, which read as either irrelevant or, worse, as the
//   broker fishing for an upsell. The block is now driven by the
//   same `hasMinors` signal the brief overview already uses to
//   conditionally show the Children section in the section list.
//
// Logic mirrors app/(cabin)/cabin/brief/page.jsx:
//   - is_minor === true on any manifest row → true
//   - OR a date_of_birth ≥ 18 years ago → true
//   - otherwise false

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "auth-required" }, { status: 401 });
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 403 });
  }
  const db = getCabinDb();
  const manifest = await dbQuery(
    db.from("cabin_guests_manifest")
      .select("is_minor, date_of_birth")
      .eq("cabin_id", cabinId)
  );

  const now = Date.now();
  const eighteenYearsMs = 18 * 365.25 * 24 * 60 * 60 * 1000;
  const hasMinors = (manifest ?? []).some((g) => {
    if (g.is_minor === true) return true;
    if (!g.date_of_birth) return false;
    const dob = Date.parse(String(g.date_of_birth));
    if (Number.isNaN(dob)) return false;
    return now - dob < eighteenYearsMs;
  });

  return NextResponse.json({ ok: true, hasMinors });
}
