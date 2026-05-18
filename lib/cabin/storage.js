// lib/cabin/storage.js
// =============================================================
// Helpers around the cabin-photos Supabase Storage bucket.
//
// Uploads accept Buffer/Uint8Array/ArrayBuffer (the route handler
// converts the multipart blob). Returns the stored path. A signed
// URL is generated on read so the bucket stays private.
// =============================================================

import { getCabinDb } from "./supabase";

const BUCKET = "cabin-photos";

function randId(n = 14) {
  const a = "abcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

// Extension map covers every MIME the bucket policy allows.
const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export function isVideoMime(t) {
  return typeof t === "string" && t.startsWith("video/");
}

export async function uploadCabinPhoto({
  cabinId,
  bytes,
  contentType = "image/jpeg",
  folder = "mood-board",
}) {
  if (!cabinId || !bytes) throw new Error("[storage] cabinId + bytes required");
  const ext = EXT_BY_MIME[contentType] || "bin";
  const path = `${cabinId}/${folder}/${Date.now()}-${randId()}.${ext}`;

  const db = getCabinDb();
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType, upsert: false });
  if (error) throw new Error(`[storage] upload: ${error.message}`);

  return path;
}

// Sign a URL for the client to display. Default TTL 1 hour.
export async function signCabinPhotoUrl(path, ttlSeconds = 3600) {
  if (!path) return null;
  const db = getCabinDb();
  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUrl(path, ttlSeconds);
  if (error) {
    console.error("[storage] sign error:", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function deleteCabinPhoto(path) {
  if (!path) return;
  const db = getCabinDb();
  await db.storage.from(BUCKET).remove([path]);
}

// =============================================================
// Direct-upload signed URLs — bypass the Vercel 4.5 MB request-body
// ceiling for big files (mostly videos). The route generates a
// short-lived signed upload URL, the browser PUTs the bytes
// directly to Supabase Storage, then a small finalize call records
// the row. Photos still go through the multipart route because the
// client-side compression keeps them well under the ceiling — no
// need for an extra round-trip there.
//
// Returns: { signedUrl, token, path } from Supabase's
// createSignedUploadUrl. Caller must use the path to record the row.
// =============================================================
export async function createSignedUploadUrlForCabin({
  cabinId,
  contentType,
  folder = "voyage",
}) {
  if (!cabinId || !contentType) {
    throw new Error("[storage] cabinId + contentType required");
  }
  const ext = EXT_BY_MIME[contentType] || "bin";
  const path = `${cabinId}/${folder}/${Date.now()}-${randId()}.${ext}`;

  const db = getCabinDb();
  const { data, error } = await db.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (error) throw new Error(`[storage] signed upload url: ${error.message}`);
  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path ?? path,
  };
}

// Heuristic: detect whether a mood-board image_path is an external
// URL (user pasted a Pinterest link) or a Storage path (we uploaded).
export function isStoragePath(s) {
  if (!s || typeof s !== "string") return false;
  return !/^https?:\/\//i.test(s);
}
