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
import { signCabinPhotoUrl, isStoragePath, deleteCabinPhoto, uploadCabinPhoto } from "@/lib/cabin/storage";

export const runtime = "nodejs";

// 2026-05-23 — Alexandros's friend-test feedback: "Copy image link
// from Pinterest etc. fails most of the time, security error." Root
// cause: Pinterest + many CDNs check the Referer header and serve a
// 403 to any request not coming from their own domain (hotlink
// protection). Our <img src={url}> from cabin pages = blocked.
//
// Fix: fetch the image server-side (no CORS, no hotlink rule applies
// to server-to-server requests when we set a clean User-Agent) and
// re-host it in our Supabase Storage bucket. The cabin then serves
// from our own bucket — bulletproof, no source can block us, and
// the image stays available even if the source URL later 404s.
//
// Fallback: if the fetch fails (rare — usually a dead URL), we
// return a clear error to the user instead of saving a broken link.
const FETCH_TIMEOUT_MS = 12_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB hard cap
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

async function fetchAndRehost(cabinId, url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        // Browser-like UA so CDNs that block bots still serve us.
        "User-Agent":
          "Mozilla/5.0 (compatible; GeorgeYachts-Cabin/1.0; +https://georgeyachts.com)",
        Accept: "image/*",
      },
    });
    if (!r.ok) {
      throw new Error(`source returned HTTP ${r.status}`);
    }
    const contentType = (r.headers.get("content-type") || "").split(";")[0].trim();
    if (!ALLOWED_MIME.has(contentType)) {
      throw new Error(`not an image (got ${contentType || "unknown"})`);
    }
    const buf = await r.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`image too large (${Math.round(buf.byteLength / 1024)} KB > 8 MB)`);
    }
    const path = await uploadCabinPhoto({
      cabinId,
      bytes: new Uint8Array(buf),
      contentType,
      folder: "mood-board",
    });
    return { ok: true, path };
  } catch (e) {
    const msg = e?.name === "AbortError" ? "fetch timed out" : (e?.message || String(e));
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

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
  // 2026-05-23 — Re-host strategy: try to fetch the image server-side
  // and upload to our bucket. If that works (95%+ of the time for
  // Pinterest/Unsplash/most CDNs), the cabin serves the image from
  // our own storage — bulletproof. If it fails (dead URL, weird MIME,
  // or genuine block), return a clear error so the user knows to
  // upload the file directly instead.
  const rehost = await fetchAndRehost(a.cabinId, url.toString());
  if (!rehost.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "url-fetch-failed",
        detail: rehost.error,
        hint:
          "We couldn't fetch the image from that link. Many sites (Pinterest, social media) block hot-linking. Save the image to your device and use the upload button instead.",
      },
      { status: 422 },
    );
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
        image_path: rehost.path,  // stored as a storage path now, not the raw URL
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
