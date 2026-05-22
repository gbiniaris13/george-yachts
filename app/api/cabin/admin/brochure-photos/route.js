// app/api/cabin/admin/brochure-photos/route.js
// =============================================================
// 2026-05-22 — Receive auto-extracted brochure photo JPEGs from
// the CRM, upload each to the cabin-photos bucket, write the
// resulting storage paths to cabins.vessel_photos.
//
// George's directive on the EFFIE STAR preview:
//   "Στο GY Command υπάρχει η μπροσούρα του σκάφους, άρα από
//    εκεί δεν θα πρέπει να είναι όλες τις φωτογραφίες?"
//
// Companion to the existing extract-brochure endpoint (which
// pulls TEXT data from the PDF via Gemini). This route handles
// the IMAGE half of the same brochure: the CRM renders each
// non-text-heavy page to a JPEG client-side, then POSTs the
// batch here. We persist them to Supabase Storage and update
// cabins.vessel_photos as an array of { path, caption?, page? }.
//
// The customer-facing /cabin pages resolve those paths to
// signed URLs at render time (see lib/cabin/vessel-photo-urls.js).
//
// Body (multipart):
//   cabin_id           — required
//   replace_existing   — "true" / "false"; default true so a
//                        fresh brochure upload replaces any
//                        prior auto-extracted set. We don't
//                        wipe URL-style entries the operator
//                        manually pasted; those stay.
//   photo              — repeated file field (use
//                        formData.getAll("photo")).
//   captions[i]        — optional per-photo caption (parallel array).
//   pages[i]           — optional per-photo source page number.
//
// Auth: x-cabin-admin-secret.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { uploadCabinPhoto } from "@/lib/cabin/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Each photo lands ~400-700 KB; up to MAX_PHOTOS in the CRM
// extractor caps the total well under Vercel's 4.5 MB body
// limit. This is the defensive backstop.
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS = 16;

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad-multipart" },
      { status: 400 },
    );
  }

  const cabinId = String(form.get("cabin_id") || "").trim();
  if (!cabinId) {
    return NextResponse.json(
      { ok: false, error: "cabin_id-required" },
      { status: 400 },
    );
  }

  const replaceExisting = String(form.get("replace_existing") || "true") === "true";

  // Collect repeated file fields. We accept the field name
  // "photo" specifically so the CRM proxy can append multiple
  // files in a single FormData.
  const files = form.getAll("photo").filter(
    (f) => f && typeof f !== "string" && "arrayBuffer" in f,
  );
  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no-photos" },
      { status: 400 },
    );
  }
  if (files.length > MAX_PHOTOS) {
    return NextResponse.json(
      { ok: false, error: "too-many-photos", max: MAX_PHOTOS },
      { status: 400 },
    );
  }

  const captions = form.getAll("captions[]").map((s) => String(s || ""));
  const pages = form.getAll("pages[]").map((s) => Number(s) || null);

  // Resolve the current cabin row so we know what to merge with.
  const db = getCabinDb();
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select("id, vessel_photos")
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!cabin) {
    return NextResponse.json(
      { ok: false, error: "cabin-not-found" },
      { status: 404 },
    );
  }

  // 2026-05-22 — Separate the existing vessel_photos into two
  // groups:
  //   • items the operator pasted manually (have `.url`)
  //   • items we previously auto-extracted (have `.path`)
  // On a fresh brochure upload we replace the auto-extracted
  // half but keep manual URL entries — those are explicit
  // operator overrides ("THIS photo is better than what the
  // brochure had") and shouldn't be silently wiped.
  const existing = Array.isArray(cabin.vessel_photos) ? cabin.vessel_photos : [];
  const manualPasted = existing.filter(
    (p) => p && typeof p.url === "string" && p.url.trim().length > 0 && !p.path,
  );

  // Upload each file. Any individual upload failure is logged
  // but doesn't abort the batch — we want as many photos as
  // possible to land even if one mid-batch is corrupt.
  const uploaded = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_BYTES) {
      console.warn(
        "[brochure-photos] skip oversized photo idx",
        i,
        file.size,
      );
      continue;
    }
    const contentType = file.type || "image/jpeg";
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const path = await uploadCabinPhoto({
        cabinId,
        bytes,
        contentType,
        folder: "vessel",
      });
      uploaded.push({
        path,
        caption: captions[i] || null,
        page: pages[i] || null,
        source: "brochure-extraction",
        // Timestamp for "freshness": if we ever need to
        // distinguish between multiple extraction passes.
        extracted_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error(
        "[brochure-photos] upload failed idx",
        i,
        err?.message || err,
      );
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no-uploads-succeeded" },
      { status: 502 },
    );
  }

  // Merge the new auto-extracted set with the kept manual URL
  // entries. Auto-extracted photos lead (they're typically the
  // hero shots from the brochure), manual pastes follow as
  // operator overrides at the end of the gallery.
  const nextVesselPhotos = replaceExisting
    ? [...uploaded, ...manualPasted]
    : [...existing, ...uploaded];

  await dbQuery(
    db
      .from("cabins")
      .update({ vessel_photos: nextVesselPhotos })
      .eq("id", cabinId),
  );

  return NextResponse.json({
    ok: true,
    cabin_id: cabinId,
    uploaded_count: uploaded.length,
    total_count: nextVesselPhotos.length,
    kept_manual_count: manualPasted.length,
  });
}
