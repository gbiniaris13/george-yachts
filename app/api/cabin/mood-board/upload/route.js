// app/api/cabin/mood-board/upload/route.js
// POST  multipart/form-data { file, caption? }
//
// Strategy: the client compresses the photo in the browser
// (Canvas → JPEG, max 2000px, ~80% quality) before sending, so
// here we just validate the size + MIME and pipe to Storage.

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { uploadCabinPhoto } from "@/lib/cabin/storage";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-multipart" }, { status: 400 });
  }
  const file = form.get("file");
  const caption = (form.get("caption") || "").toString().slice(0, 240);

  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "no-file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "unsupported-type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  let storagePath;
  try {
    storagePath = await uploadCabinPhoto({
      cabinId,
      bytes,
      contentType: file.type,
    });
  } catch (err) {
    console.error("[mood-board/upload]", err);
    return NextResponse.json({ ok: false, error: "upload-failed" }, { status: 500 });
  }

  // Insert mood-board row referencing the storage path
  const db = getCabinDb();
  const existing = await dbQuery(
    db.from("cabin_mood_board")
      .select("display_order")
      .eq("cabin_id", cabinId)
      .order("display_order", { ascending: false })
      .limit(1)
  );
  const nextOrder = (existing?.[0]?.display_order ?? 0) + 1;

  const inserted = await dbQuery(
    db.from("cabin_mood_board")
      .insert({
        cabin_id: cabinId,
        uploaded_by_email: session.email,
        image_path: storagePath,
        caption: caption || null,
        display_order: nextOrder,
      })
      .select()
      .single()
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: member.role,
    action: AUDIT_ACTIONS.MOOD_BOARD_UPLOADED,
    metadata: { id: inserted.id, kind: "upload" },
  });

  return NextResponse.json({ ok: true, item: inserted });
}
