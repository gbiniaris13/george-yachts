// app/api/cabin/me/life-aboard/route.js
// =============================================================
// 2026-05-24 — Angeliki pass (item 3): Life Aboard per-member.
//
// George + Angeliki: "Στο section 5 (life aboard) δεν θέλω να
// βλέπει τον αλωνών, θέλω να επιλέγει ο κάθε χρήστης μόνος του.
// Εμείς κρατάμε τα αρχεία αλωνών, αλλά ο καθένας δεν θέλω να
// βλέπει τι είπαν οι άλλοι εκεί."
//
// Life Aboard is subjective per person (crew tone, activities I
// personally enjoy, what would make MY week). A shared form
// muddles signals — what George needs is each member's honest
// individual answer.
//
// Storage: cabin_members.personal_details.life_aboard_brief
//   (already-existing JSONB column; no migration needed)
//
// API contract mirrors the principal-brief endpoint so the same
// useBriefAutosave hook can drive both:
//   GET  → { ok: true, data: <member's life_aboard answers> }
//   PUT  → { ok: true, completed }
//
// The CRM aggregator + brief-submit + principal review surface
// can read across cabin_members to produce a per-member view of
// life_aboard answers for George. (Wired into review + submit
// in a follow-up batch.)
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { lifeAboardSchema } from "@/lib/cabin/schemas";
import { normalizeBriefPayload } from "@/lib/cabin/brief-normalize";

export const runtime = "nodejs";

async function authorize() {
  const session = await readSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return { error: NextResponse.json({ ok: false, error: "no-cabin" }, { status: 400 }) };
  }
  const membership = resolveMembership(session, cabinId);
  if (!membership) {
    return { error: NextResponse.json({ ok: false, error: "no-membership" }, { status: 403 }) };
  }
  return { session, cabinId, membership };
}

export async function GET() {
  const a = await authorize();
  if (a.error) return a.error;

  const db = getCabinDb();
  const row = await dbQuery(
    db
      .from("cabin_members")
      .select("personal_details")
      .eq("id", a.membership.member_id)
      .maybeSingle(),
  );
  const pd = row?.personal_details ?? {};
  const data = (pd.life_aboard_brief && typeof pd.life_aboard_brief === "object")
    ? pd.life_aboard_brief
    : {};

  return NextResponse.json({ ok: true, data });
}

export async function PUT(req) {
  const a = await authorize();
  if (a.error) return a.error;

  // 2026-05-26 — Brief 02 (single-responsibility rework, Task A1.3).
  // Life Aboard is now a Main-Charterer decision under the new
  // model. Guests must not be able to write
  // personal_details.life_aboard_brief — only the principal
  // charterer (or a delegated brief-admin) may PUT here. The GET
  // stays open so the principal's own UI can still read back
  // their own past answers if needed. (A4 will rewire the
  // principal's life-aboard writes to the shared
  // cabin_brief_sections.life_aboard row; until then this
  // endpoint is the principal-only fallback.)
  const isPrincipalActor =
    a.membership.role === "principal_charterer" ||
    (await (async () => {
      const db = getCabinDb();
      const row = await dbQuery(
        db
          .from("cabin_members")
          .select("is_brief_admin")
          .eq("id", a.membership.member_id)
          .maybeSingle(),
      );
      return Boolean(row?.is_brief_admin);
    })());
  if (!isPrincipalActor) {
    return NextResponse.json(
      {
        ok: false,
        error: "principal-only-section",
        message:
          "Only the Main Charterer decides life aboard. Ask them to fill this section.",
      },
      { status: 403 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const cleaned = normalizeBriefPayload(body?.data ?? {}) ?? {};
  const parsed = lifeAboardSchema.safeParse(cleaned);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = getCabinDb();
  const existing = await dbQuery(
    db
      .from("cabin_members")
      .select("personal_details")
      .eq("id", a.membership.member_id)
      .maybeSingle(),
  );
  const pd = existing?.personal_details ?? {};
  const merged = {
    ...pd,
    life_aboard_brief: parsed.data,
  };

  await dbQuery(
    db
      .from("cabin_members")
      .update({ personal_details: merged })
      .eq("id", a.membership.member_id),
  );

  // Completeness: any non-empty answer counts. The principal
  // sees per-member "completed" badges on review.
  const completed = Object.values(parsed.data).some((v) => {
    if (v == null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
  });

  return NextResponse.json({ ok: true, completed });
}
