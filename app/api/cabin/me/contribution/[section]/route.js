// app/api/cabin/me/contribution/[section]/route.js
// =============================================================
// GET  /api/cabin/me/contribution/:section  — fetch this member's
//                                              personal contribution
// PUT  /api/cabin/me/contribution/:section  — autosave it
//
// Multi-user Brief (Phase 3, 2026-05-23).
//
// Where the principal's /api/cabin/brief/[section] writes to the
// per-cabin cabin_brief_sections table, THIS endpoint writes to
// the per-member cabin_brief_contributions table. Each invited
// guest has their own row per allowed section so they can share
// their personal preferences without overwriting the principal's
// canonical brief.
//
// Whitelisted to two sections only — "dining" (At the Table) and
// "beverages" (In the Cellar). The DB also enforces this via a
// CHECK constraint on cabin_brief_contributions.section_key.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { SECTION_SCHEMAS } from "@/lib/cabin/schemas";
import { normalizeBriefPayload } from "@/lib/cabin/brief-normalize";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

// Hard whitelist — DB CHECK constraint enforces the same set, but
// rejecting in the handler gives a cleaner 404 instead of a 500.
const ALLOWED_SECTIONS = new Set(["dining", "beverages"]);

async function authorize(params) {
  const session = await readSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ ok: false, error: "auth" }, { status: 401 }) };
  }
  const { section } = params;
  if (!ALLOWED_SECTIONS.has(section)) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          error: "section-not-contributable",
          message:
            "Only the dining and beverages sections accept group contributions.",
        },
        { status: 404 },
      ),
    };
  }
  if (!SECTION_SCHEMAS[section]) {
    // Defence-in-depth: even if the schemas registry drifts away
    // from our whitelist, we never trust an unknown section.
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
  const a = await authorize(params);
  if (a.error) return a.error;

  const db = getCabinDb();
  const row = await dbQuery(
    db
      .from("cabin_brief_contributions")
      .select("data, updated_at")
      .eq("cabin_id", a.cabinId)
      .eq("member_id", a.member.member_id)
      .eq("section_key", a.section)
      .maybeSingle(),
  );
  return NextResponse.json({
    ok: true,
    data: row?.data ?? {},
    updated_at: row?.updated_at ?? null,
  });
}

export async function PUT(req, ctx) {
  const params = await ctx.params;
  const a = await authorize(params);
  if (a.error) return a.error;

  // Mirror the brief-submission lock from /api/cabin/brief/[section]:
  // once the principal has sent the brief to George, contributions
  // are frozen too. The principal asks George to reopen.
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
          "The brief has been sent to George. Ask the principal charterer if you need to revise your preferences.",
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

  // Same normalisation + Zod validation as the principal brief — we
  // accept exactly the same shape per section so contributions can
  // be merged into the same aggregation logic at review time.
  const schema = SECTION_SCHEMAS[a.section];
  const cleaned = normalizeBriefPayload(body?.data ?? {}) ?? {};
  const parsed = schema.safeParse(cleaned);
  if (!parsed.success) {
    console.error("[cabin/contribution] validation rejected", {
      section: a.section,
      member_id: a.member.member_id,
      issues: parsed.error.flatten(),
      payload_preview: JSON.stringify(cleaned).slice(0, 500),
    });
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = getCabinDb();
  await dbQuery(
    db.from("cabin_brief_contributions").upsert(
      {
        cabin_id: a.cabinId,
        member_id: a.member.member_id,
        section_key: a.section,
        data: parsed.data,
        // updated_at is touched by the cabin_brief_contributions_touch
        // trigger on UPDATE; we still pass it on INSERT for the
        // initial row.
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cabin_id,member_id,section_key" },
    ),
  );

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.BRIEF_SECTION_SAVED,
    targetSection: `contribution:${a.section}`,
  });

  return NextResponse.json({ ok: true });
}
