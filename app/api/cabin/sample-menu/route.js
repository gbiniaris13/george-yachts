// app/api/cabin/sample-menu/route.js
// =============================================================
// 2026-05-20 — Friend-test pass 3.
//
// Returns the active cabin's sample_menu JSONB so client-side
// components (the dining brief, mainly) can preview "what the
// chef proposes" before the charterer fills out preferences.
//
// Read-only. Scoped to the active cabin via session.
// =============================================================

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";

export const runtime = "nodejs";

function normaliseMenu(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw.sections) && raw.sections.length > 0) {
    return {
      title: raw.title ?? null,
      tagline: raw.tagline ?? null,
      sections: raw.sections.map((s) => ({
        name: s.name ?? "Course",
        dishes: Array.isArray(s.dishes) ? s.dishes.filter(Boolean) : [],
      })),
    };
  }
  if (Array.isArray(raw.days) && raw.days.length > 0) {
    return {
      title: raw.title ?? null,
      tagline: raw.tagline ?? null,
      sections: raw.days.map((d) => ({
        name: d.title ?? "Day",
        dishes: Array.isArray(d.courses) ? d.courses.filter(Boolean) : [],
      })),
    };
  }
  return null;
}

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 400 });
  }

  const db = getCabinDb();
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select("sample_menu")
      .eq("id", cabinId)
      .maybeSingle()
  );

  return NextResponse.json({
    ok: true,
    menu: normaliseMenu(cabin?.sample_menu),
  });
}
