// app/api/cabin/brief/[section]/group-voices/route.js
// =============================================================
// GET /api/cabin/brief/:section/group-voices
//
// 2026-05-23 — Multi-user Brief (Phase 3, MUB-A).
//
// Returns every OTHER cabin member's voice for the given section
// (dining or beverages) so the caller can render a "what your
// group has already added" panel at the top of their own form.
// George's spec: "όταν μπαίνει ο καινούριος χρήστης, να βλέπει
// τι έχει βάλει ο προηγούμενος".
//
// Two data sources are merged here:
//
//   1. cabin_brief_sections — the per-cabin canonical brief
//      (mostly the principal's answer; technically any member
//      can edit it but it has ONE row per section per cabin).
//      Surface as { name: "(group brief — last edited by X)",
//      highlights: […] } when it has content.
//
//   2. cabin_brief_contributions — each member's PERSONAL
//      contribution row. Surface as { name: "Vasilis", highlights: […] }.
//
// The CALLING member is excluded — they don't need to see
// themselves in the panel; their own answer is in the form
// directly below.
//
// Refresh-on-load model per George: the panel re-fetches every
// time the page mounts, which matches the friend-test use case
// (members log in one after another, not simultaneously). No
// polling, no WebSockets — keeps the free-forever stance intact.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { summariseContribution } from "@/lib/cabin/contributions";

export const runtime = "nodejs";
// 2026-05-23 — Live panel: response must never be cached by the
// browser or any edge intermediary. Vasilis logs in 30 min after
// Patricia edits her brief — he MUST see the fresh state. Without
// this, Chrome can serve a stale "no voices" response and the
// panel renders empty.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_SECTIONS = new Set(["dining", "beverages"]);

export async function GET(_req, ctx) {
  const session = await readSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }
  const { section } = await ctx.params;
  if (!ALLOWED_SECTIONS.has(section)) {
    return NextResponse.json(
      { ok: false, error: "section-not-collaborative" },
      { status: 404 },
    );
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const me = resolveMembership(session, cabinId);
  if (!me) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const db = getCabinDb();

  // ----- Per-member contributions (excluding the caller) -----
  const contribRows = await dbQuery(
    db
      .from("cabin_brief_contributions")
      .select("member_id, data, updated_at")
      .eq("cabin_id", cabinId)
      .eq("section_key", section)
      .neq("member_id", me.member_id),
  );

  // ----- Canonical brief (cabin_brief_sections) -----
  // For dining + beverages this is the principal's authoritative
  // answer (or whichever cabin member edited it last). If the
  // CALLING member happens to be the last editor we DO still
  // surface it — but suppress the "(your own latest)" attribution
  // since this is a group document, not a personal one.
  const briefRow = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("data, last_edited_at, last_edited_by_member_id, completed")
      .eq("cabin_id", cabinId)
      .eq("section_key", section)
      .maybeSingle(),
  );

  // ----- Single round-trip for all referenced member names -----
  const idsToResolve = new Set();
  for (const c of contribRows ?? []) {
    if (c.member_id) idsToResolve.add(c.member_id);
  }
  if (briefRow?.last_edited_by_member_id) {
    idsToResolve.add(briefRow.last_edited_by_member_id);
  }
  let nameById = {};
  if (idsToResolve.size > 0) {
    const nameRows = await dbQuery(
      db
        .from("cabin_members")
        .select("id, display_name, email, role")
        .in("id", Array.from(idsToResolve)),
    );
    nameById = Object.fromEntries(
      (nameRows ?? []).map((m) => [
        m.id,
        {
          name: m.display_name || m.email || "(member)",
          role: m.role,
        },
      ]),
    );
  }

  const voices = [];

  // Canonical brief first (when it has real content). The caller
  // sees this as the "group brief so far" — it's not someone's
  // personal voice, it's the shared sheet.
  if (briefRow && briefRow.data && Object.keys(briefRow.data).length > 0) {
    const briefHighlights = summariseContribution(section, briefRow.data);
    if (briefHighlights.length > 0) {
      const lastEditor = briefRow.last_edited_by_member_id
        ? nameById[briefRow.last_edited_by_member_id]?.name
        : null;
      voices.push({
        kind: "shared-brief",
        name: "Group brief",
        sublabel: lastEditor ? `last edited by ${lastEditor}` : null,
        highlights: briefHighlights,
        updatedAt: briefRow.last_edited_at || null,
      });
    }
  }

  // Then each other member's personal voice.
  for (const c of contribRows ?? []) {
    const info = nameById[c.member_id];
    voices.push({
      kind: "personal",
      memberId: c.member_id,
      name: info?.name || "(member)",
      role: info?.role || null,
      sublabel:
        info?.role === "principal_charterer"
          ? "principal charterer"
          : "your group",
      highlights: summariseContribution(section, c.data ?? {}),
      updatedAt: c.updated_at || null,
    });
  }

  return NextResponse.json({
    ok: true,
    section,
    voices,
  });
}
