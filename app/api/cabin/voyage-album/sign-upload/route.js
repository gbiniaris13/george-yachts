// POST /api/cabin/voyage-album/sign-upload
// Body: { content_type, size }
// Returns: { signedUrl, token, path } that the browser PUTs directly
// to Supabase Storage — bypassing the Vercel 4.5 MB request-body
// ceiling that capped raw multipart uploads.

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { createSignedUploadUrlForCabin } from "@/lib/cabin/storage";

export const runtime = "nodejs";

// 100 MB cap on direct uploads. Generous enough for HD phone clips
// (~30-50s at 1080p) without letting someone PUT a 4 GB movie.
const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

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
  const contentType = String(body?.content_type ?? "");
  const size = Number(body?.size ?? 0);

  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({ ok: false, error: "unsupported-type" }, { status: 415 });
  }
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  try {
    const out = await createSignedUploadUrlForCabin({
      cabinId: a.cabinId,
      contentType,
      folder: "voyage",
    });
    return NextResponse.json({ ok: true, ...out });
  } catch (e) {
    console.error("[voyage-album/sign-upload]", e);
    return NextResponse.json({ ok: false, error: "sign-failed" }, { status: 500 });
  }
}
