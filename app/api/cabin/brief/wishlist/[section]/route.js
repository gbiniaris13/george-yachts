// app/api/cabin/brief/wishlist/[section]/route.js
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3, MUB-C).
//
// GET    /api/cabin/brief/wishlist/:section       — list items
// POST   /api/cabin/brief/wishlist/:section       — add an item
// DELETE /api/cabin/brief/wishlist/:section?id=…  — remove an item
//
// The wishlist is the OPTIONAL escape hatch for clients who want
// to name a specific bottle/brand/dish (e.g. "Don Julio Reposado"
// or "Wagyu steak") instead of relying solely on the frequency-
// based picks. Default flow stays "we drink beer often" → hostess
// orders; this is the override for the few moments where a
// specific item matters.
//
// Shared per cabin per section: anyone in the cabin sees the
// same list. Vasilis adds "Don Julio", Patricia opens the cellar
// and sees it — that's George's "live group list" requirement.
//
// Removal rules (enforced here):
//   • The member who added an item can remove it.
//   • The principal charterer can remove anyone's item.
//   • Everyone else gets 403 on DELETE for someone else's item.
//
// Locked when cabin.brief_submitted_at is set — matches the
// brief-section lock so the wishlist freezes once the brief is
// in George's hands.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

const ALLOWED_SECTIONS = new Set(["dining", "beverages"]);

async function authorize(params) {
  const session = await readSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  }
  const { section } = params;
  if (!ALLOWED_SECTIONS.has(section)) {
    return { error: NextResponse.json({ ok: false }, { status: 404 }) };
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  }
  const me = resolveMembership(session, cabinId);
  if (!me) {
    return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  }
  return { session, cabinId, section, me };
}

async function assertBriefUnlocked(db, cabinId) {
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select("brief_submitted_at")
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (cabin?.brief_submitted_at) {
    return NextResponse.json(
      {
        ok: false,
        error: "brief-submitted",
        message:
          "The brief is locked. Ask the principal charterer to have George reopen it for changes.",
        submitted_at: cabin.brief_submitted_at,
      },
      { status: 423 },
    );
  }
  return null;
}

// ============================================================
// GET — list every wishlist item for this cabin's section,
//        joined with the adding member's display name so the UI
//        can render "Don Julio · added by Vasilis" without a
//        second round-trip.
// ============================================================
export async function GET(_req, ctx) {
  const params = await ctx.params;
  const a = await authorize(params);
  if (a.error) return a.error;

  const db = getCabinDb();
  const rows = await dbQuery(
    db
      .from("cabin_brief_wishlist_items")
      .select(
        "id, label, quantity, notes, added_by_member_id, added_at",
      )
      .eq("cabin_id", a.cabinId)
      .eq("section_key", a.section)
      .order("added_at", { ascending: false }),
  );

  // Resolve names in one IN query.
  const ids = new Set(
    (rows ?? []).map((r) => r.added_by_member_id).filter(Boolean),
  );
  let nameById = {};
  if (ids.size > 0) {
    const nameRows = await dbQuery(
      db
        .from("cabin_members")
        .select("id, display_name, email")
        .in("id", Array.from(ids)),
    );
    nameById = Object.fromEntries(
      (nameRows ?? []).map((m) => [
        m.id,
        m.display_name || m.email || "(member)",
      ]),
    );
  }

  const items = (rows ?? []).map((r) => ({
    id: r.id,
    label: r.label,
    quantity: r.quantity,
    notes: r.notes,
    addedByMemberId: r.added_by_member_id,
    addedByName: r.added_by_member_id
      ? nameById[r.added_by_member_id] || "(member)"
      : "(removed member)",
    addedAt: r.added_at,
    // The client can show a delete button on items the caller is
    // allowed to remove without re-asking the server.
    canRemove:
      a.me.role === "principal_charterer" ||
      r.added_by_member_id === a.me.member_id,
  }));

  return NextResponse.json({ ok: true, items });
}

// ============================================================
// POST — add a new wishlist item.
//        Body: { label: string, quantity?: string, notes?: string }
// ============================================================
export async function POST(req, ctx) {
  const params = await ctx.params;
  const a = await authorize(params);
  if (a.error) return a.error;

  const db = getCabinDb();
  const lockResp = await assertBriefUnlocked(db, a.cabinId);
  if (lockResp) return lockResp;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const label = typeof body?.label === "string" ? body.label.trim() : "";
  const quantity =
    typeof body?.quantity === "string" ? body.quantity.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  if (!label) {
    return NextResponse.json(
      { ok: false, error: "label-required" },
      { status: 400 },
    );
  }
  if (label.length > 200) {
    return NextResponse.json(
      { ok: false, error: "label-too-long" },
      { status: 400 },
    );
  }
  if (quantity.length > 100) {
    return NextResponse.json(
      { ok: false, error: "quantity-too-long" },
      { status: 400 },
    );
  }
  if (notes.length > 500) {
    return NextResponse.json(
      { ok: false, error: "notes-too-long" },
      { status: 400 },
    );
  }

  const inserted = await dbQuery(
    db
      .from("cabin_brief_wishlist_items")
      .insert({
        cabin_id: a.cabinId,
        section_key: a.section,
        label,
        quantity: quantity || null,
        notes: notes || null,
        added_by_member_id: a.me.member_id,
      })
      .select("id")
      .single(),
  );

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.me.role,
    action: AUDIT_ACTIONS.BRIEF_SECTION_SAVED,
    targetSection: `wishlist:${a.section}`,
    metadata: { label, id: inserted?.id },
  });

  return NextResponse.json({ ok: true, id: inserted?.id });
}

// ============================================================
// DELETE — remove a wishlist item by id.
//          Query: ?id=…
// ============================================================
export async function DELETE(req, ctx) {
  const params = await ctx.params;
  const a = await authorize(params);
  if (a.error) return a.error;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "id-required" },
      { status: 400 },
    );
  }

  const db = getCabinDb();
  const lockResp = await assertBriefUnlocked(db, a.cabinId);
  if (lockResp) return lockResp;

  const row = await dbQuery(
    db
      .from("cabin_brief_wishlist_items")
      .select("id, added_by_member_id, label")
      .eq("cabin_id", a.cabinId)
      .eq("section_key", a.section)
      .eq("id", id)
      .maybeSingle(),
  );
  if (!row) {
    return NextResponse.json(
      { ok: false, error: "not-found" },
      { status: 404 },
    );
  }

  const isOwner = row.added_by_member_id === a.me.member_id;
  const isPrincipal = a.me.role === "principal_charterer";
  if (!isOwner && !isPrincipal) {
    return NextResponse.json(
      {
        ok: false,
        error: "not-authorised",
        message:
          "Only the person who added an item, or the principal charterer, can remove it.",
      },
      { status: 403 },
    );
  }

  await dbQuery(
    db.from("cabin_brief_wishlist_items").delete().eq("id", id),
  );

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.me.role,
    action: AUDIT_ACTIONS.BRIEF_SECTION_SAVED,
    targetSection: `wishlist-remove:${a.section}`,
    metadata: { label: row.label, id },
  });

  return NextResponse.json({ ok: true });
}
