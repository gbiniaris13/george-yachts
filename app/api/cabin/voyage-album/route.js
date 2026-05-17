// GET     — list voyage photos for the active cabin (signed URLs)
// POST    — multipart upload (file, caption?)
// DELETE  — body { id } (only uploader OR principal charterer)

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { uploadCabinPhoto, signCabinPhotoUrl, deleteCabinPhoto } from "@/lib/cabin/storage";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Photos: 5MB after client-side compression. Videos: 50MB.
const MAX_PHOTO = 5 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const ALLOWED_PHOTO = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/quicktime", "video/webm"]);

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
  const rows = await dbQuery(
    db.from("cabin_voyage_photos")
      .select("id, uploaded_by_email, storage_path, caption, created_at, taken_at")
      .eq("cabin_id", a.cabinId)
      .is("redacted_at", null)
      .order("created_at", { ascending: false })
      .limit(500)
  );
  const items = await Promise.all((rows ?? []).map(async (r) => ({
    ...r,
    url: await signCabinPhotoUrl(r.storage_path, 3600),
  })));
  return NextResponse.json({ ok: true, items });
}

export async function POST(req) {
  const a = await gate();
  if (a.error) return a.error;
  let form;
  try { form = await req.formData(); } catch { return NextResponse.json({ ok: false, error: "bad-multipart" }, { status: 400 }); }
  const file = form.get("file");
  const caption = (form.get("caption") || "").toString().slice(0, 240);
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "no-file" }, { status: 400 });
  }
  const isVideo = ALLOWED_VIDEO.has(file.type);
  const isPhoto = ALLOWED_PHOTO.has(file.type);
  if (!isVideo && !isPhoto) {
    return NextResponse.json({ ok: false, error: "unsupported-type" }, { status: 415 });
  }
  const limit = isVideo ? MAX_VIDEO : MAX_PHOTO;
  if (file.size > limit) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const storagePath = await uploadCabinPhoto({
    cabinId: a.cabinId,
    bytes,
    contentType: file.type,
    folder: "voyage",
  });

  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_voyage_photos")
      .insert({
        cabin_id: a.cabinId,
        uploaded_by_email: a.session.email,
        storage_path: storagePath,
        caption: caption || null,
      })
      .select()
      .single()
  );
  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.VOYAGE_PHOTO_UPLOADED,
    metadata: { photo_id: row.id, has_caption: Boolean(row.caption) },
  });
  return NextResponse.json({
    ok: true,
    item: { ...row, url: await signCabinPhotoUrl(storagePath, 3600) },
  });
}

export async function DELETE(req) {
  const a = await gate();
  if (a.error) return a.error;
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false }, { status: 400 });

  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_voyage_photos")
      .select("id, uploaded_by_email, storage_path")
      .eq("id", body.id)
      .eq("cabin_id", a.cabinId)
      .maybeSingle()
  );
  if (!row) return NextResponse.json({ ok: false }, { status: 404 });

  // Only the uploader or the principal charterer can remove
  const canDelete =
    row.uploaded_by_email.toLowerCase() === String(a.session.email).toLowerCase() ||
    a.member.role === "principal_charterer";
  if (!canDelete) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  await dbQuery(
    db.from("cabin_voyage_photos")
      .update({ redacted_at: new Date().toISOString() })
      .eq("id", body.id)
  );
  try { await deleteCabinPhoto(row.storage_path); } catch {}
  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.VOYAGE_PHOTO_DELETED,
    metadata: { photo_id: body.id, uploader: row.uploaded_by_email },
  });
  return NextResponse.json({ ok: true });
}
