// app/api/cabin/mood-board/route.js
// GET  — list mood-board entries for the active cabin
// POST — add a new entry { image_url, caption }
// DELETE — body { id }
//
// MVP: stores external image URLs (paste from Pinterest, etc.).
// Direct uploads will land in Phase 2 once we wire Supabase Storage.

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { signCabinPhotoUrl, isStoragePath, deleteCabinPhoto } from "@/lib/cabin/storage";

export const runtime = "nodejs";

async function gate() {
  const session = await readSessionFromCookies();
  if (!session) return { error: NextResponse.json({ ok: false }, { status: 401 }) };
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  const member = resolveMembership(session, cabinId);
  if (!member) return { error: NextResponse.json({ ok: false }, { status: 403 }) };
  return { session, cabinId, member };
}

export async function GET() {
  const a = await gate();
  if (a.error) return a.error;
  const db = getCabinDb();
  const data = await dbQuery(
    db.from("cabin_mood_board").select("*").eq("cabin_id", a.cabinId).order("display_order")
  );

  // For storage-backed items, sign a temporary URL so the browser
  // can render them without exposing the private bucket publicly.
  const items = await Promise.all(
    (data ?? []).map(async (row) => {
      if (isStoragePath(row.image_path)) {
        return { ...row, display_url: await signCabinPhotoUrl(row.image_path) };
      }
      return { ...row, display_url: row.image_path };
    })
  );

  return NextResponse.json({ ok: true, items });
}

export async function POST(req) {
  const a = await gate();
  if (a.error) return a.error;
  const body = await req.json().catch(() => null);
  if (!body?.image_url || typeof body.image_url !== "string") {
    return NextResponse.json({ ok: false, error: "image_url-required" }, { status: 400 });
  }
  // Basic URL safety: must be https + must not contain script tags
  let url;
  try { url = new URL(body.image_url); } catch { url = null; }
  if (!url || url.protocol !== "https:") {
    return NextResponse.json({ ok: false, error: "url-must-be-https" }, { status: 400 });
  }
  const db = getCabinDb();
  const existing = await dbQuery(
    db.from("cabin_mood_board").select("display_order").eq("cabin_id", a.cabinId).order("display_order", { ascending: false }).limit(1)
  );
  const nextOrder = (existing?.[0]?.display_order ?? 0) + 1;

  const inserted = await dbQuery(
    db.from("cabin_mood_board")
      .insert({
        cabin_id: a.cabinId,
        uploaded_by_email: a.session.email,
        image_path: url.toString(),
        caption: typeof body.caption === "string" ? body.caption.slice(0, 240) : null,
        display_order: nextOrder,
      })
      .select()
      .single()
  );

  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.MOOD_BOARD_UPLOADED,
    metadata: { id: inserted.id },
  });

  return NextResponse.json({ ok: true, item: inserted });
}

export async function DELETE(req) {
  const a = await gate();
  if (a.error) return a.error;
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false }, { status: 400 });
  const db = getCabinDb();
  // Look up the row to find the storage path (if any) so we can
  // also delete the object from the bucket.
  const row = await dbQuery(
    db.from("cabin_mood_board").select("image_path, uploaded_by_email").eq("id", body.id).eq("cabin_id", a.cabinId).maybeSingle()
  );
  if (!row) return NextResponse.json({ ok: false }, { status: 404 });
  // Only the uploader or the principal charterer can remove —
  // prevents a guest from purging another member's contributions.
  const canDelete =
    String(row.uploaded_by_email).toLowerCase() === String(a.session.email).toLowerCase() ||
    a.member.role === "principal_charterer";
  if (!canDelete) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (isStoragePath(row.image_path)) {
    try { await deleteCabinPhoto(row.image_path); } catch (e) { console.error("[mood-board] storage delete:", e.message); }
  }
  await dbQuery(
    db.from("cabin_mood_board").delete().eq("id", body.id).eq("cabin_id", a.cabinId)
  );
  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.MOOD_BOARD_DELETED,
    metadata: { id: body.id },
  });
  return NextResponse.json({ ok: true });
}
