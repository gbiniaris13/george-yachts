// POST /api/cabin/voyage-album/finalize
// Body: { path, caption }
// Called after the browser PUTs bytes to the signed Supabase URL —
// records the cabin_voyage_photos row so the gallery can show it.

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { signCabinPhotoUrl } from "@/lib/cabin/storage";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

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

export async function POST(req) {
  const a = await gate();
  if (a.error) return a.error;

  const body = await req.json().catch(() => null);
  const path = String(body?.path ?? "").trim();
  const caption = String(body?.caption ?? "").slice(0, 240).trim();

  // Path safety: must live under THIS cabin's folder, so a client
  // can't claim a photo uploaded to someone else's cabin.
  if (!path || !path.startsWith(`${a.cabinId}/`)) {
    return NextResponse.json({ ok: false, error: "bad-path" }, { status: 400 });
  }

  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_voyage_photos")
      .insert({
        cabin_id: a.cabinId,
        uploaded_by_email: a.session.email,
        storage_path: path,
        caption: caption || null,
      })
      .select()
      .single(),
  );
  await writeAudit({
    cabinId: a.cabinId,
    actorEmail: a.session.email,
    actorRole: a.member.role,
    action: AUDIT_ACTIONS.VOYAGE_PHOTO_UPLOADED,
    metadata: { photo_id: row.id, has_caption: Boolean(row.caption), direct_upload: true },
  });
  return NextResponse.json({
    ok: true,
    item: { ...row, url: await signCabinPhotoUrl(path, 3600) },
  });
}
