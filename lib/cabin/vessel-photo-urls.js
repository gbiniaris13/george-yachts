// lib/cabin/vessel-photo-urls.js
// =============================================================
// 2026-05-22 — Resolve cabin.vessel_photos for customer-facing
// rendering. Two shapes coexist in the column:
//
//   Manual paste — { url, caption?, credit? }
//     The operator pasted a public URL (Sanity CDN, marketing
//     site image, etc.) in the CRM's Vessel Photos editor.
//     Used as-is; nothing to sign.
//
//   Auto-extracted — { path, caption?, page?, source }
//     The "Auto-extract from brochure" flow uploaded the JPEG
//     to the private cabin-photos bucket. We mint a signed URL
//     here at render time so the customer cabin can display it
//     without the bucket having to be public.
//
// The signed-URL TTL is generous (4 hours) so a slowly-read
// charter brief doesn't drop images mid-session, but short
// enough that a leaked URL stops working before the customer's
// next refresh.
//
// All resolver paths are non-throwing — a single corrupt entry
// (missing path, malformed url) is skipped, not propagated to
// the customer view. We log warnings for the operator's audit
// trail.
// =============================================================

import { signCabinPhotoUrl } from "./storage";

const SIGNED_URL_TTL_SECONDS = 4 * 3600; // 4h

/**
 * @param {Array<{url?: string, path?: string, caption?: string|null, credit?: string|null, page?: number|null}>} vesselPhotos
 * @returns {Promise<Array<{url: string, caption: string|null, credit: string|null, page: number|null}>>}
 */
export async function resolveVesselPhotoUrls(vesselPhotos) {
  if (!Array.isArray(vesselPhotos) || vesselPhotos.length === 0) return [];

  const resolved = await Promise.all(
    vesselPhotos.map(async (entry, i) => {
      if (!entry || typeof entry !== "object") return null;

      // Manual paste — already a URL.
      if (typeof entry.url === "string" && entry.url.trim().length > 0) {
        return {
          url: entry.url.trim(),
          caption: entry.caption ?? null,
          credit: entry.credit ?? null,
          page: entry.page ?? null,
        };
      }

      // Auto-extracted — sign the storage path.
      if (typeof entry.path === "string" && entry.path.trim().length > 0) {
        try {
          const url = await signCabinPhotoUrl(
            entry.path.trim(),
            SIGNED_URL_TTL_SECONDS,
          );
          if (!url) {
            console.warn(
              "[vessel-photo-urls] sign returned null for idx",
              i,
              "path",
              entry.path,
            );
            return null;
          }
          return {
            url,
            caption: entry.caption ?? null,
            credit: entry.credit ?? null,
            page: entry.page ?? null,
          };
        } catch (err) {
          console.error(
            "[vessel-photo-urls] sign threw for idx",
            i,
            err?.message || err,
          );
          return null;
        }
      }

      return null;
    }),
  );

  return resolved.filter((x) => x !== null);
}
