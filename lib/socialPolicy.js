// Which yachts may leave the website.
//
// 2026-09-08 (George). Some yachts on this site are listed under a written
// permission that covers the website and nothing else: no social media, no
// B2B, no newsletter. The rule is enforced in the CRM for Instagram,
// Pinterest and LinkedIn; this is the same gate for the two outward
// channels that live in this repository, the client newsletter and the
// advisor newsletter.
//
// The list of cleared yachts lives in one place, the CRM's private
// settings row, never in Sanity (world-readable) and never in this
// repository (public). An unreadable policy clears nobody: a newsletter
// that goes out without a yacht is recoverable, a breach of the
// permission is not.

const SETTING_KEY = "yacht_social_policy_v1";
const CACHE_MS = 5 * 60 * 1000;

let cache = { at: 0, allowed: null };

/**
 * Where the list lives, in order of authority.
 *
 * 2026-09-08, and this cost a newsletter. The list is written and edited in
 * the CRM, which is a different Supabase project from this site. This file
 * read process.env.SUPABASE_URL, which on Vercel is the site's own project,
 * where the row had never existed. So the gate cleared nobody, every yacht
 * in the fleet was treated as restricted, and the bridge could not compose
 * a letter about any of them. Failing closed is right and it is why nothing
 * leaked, but a gate that blocks everything is a gate nobody can tell is
 * broken.
 *
 * The row is now in both projects. GYC_SUPABASE_* is read first when it is
 * configured, so there is one source of truth and the site copy is only a
 * fallback; without it the site copy is authoritative and has to be kept in
 * step with the CRM, which scripts/checkOutwardPolicy.mjs checks.
 */
function policySource() {
  if (process.env.GYC_SUPABASE_URL && process.env.GYC_SUPABASE_SERVICE_ROLE_KEY) {
    return { url: process.env.GYC_SUPABASE_URL, key: process.env.GYC_SUPABASE_SERVICE_ROLE_KEY };
  }
  return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
}

async function loadAllowed() {
  if (cache.allowed && Date.now() - cache.at < CACHE_MS) return cache.allowed;
  const { url, key } = policySource();
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/settings?select=value&key=eq.${SETTING_KEY}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    const raw = rows?.[0]?.value;
    if (!raw) return null;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const list = Array.isArray(parsed?.allowed) ? parsed.allowed : null;
    if (!list || list.length === 0) return null;
    const allowed = new Set(list.map((s) => String(s).trim().toLowerCase()));
    cache = { at: Date.now(), allowed };
    return allowed;
  } catch {
    return null;
  }
}

/** Returns null when the yacht may be sent, or a reason when she may not. */
export async function outwardBlockReason(slug, channel = "newsletter") {
  const s = String(slug ?? "").trim().toLowerCase();
  if (!s) return `no yacht slug supplied for ${channel}`;
  const allowed = await loadAllowed();
  if (!allowed) return `yacht policy unreadable, nothing goes to ${channel}`;
  if (!allowed.has(s)) return `${s} is website only, not cleared for ${channel}`;
  return null;
}

/** Filters a list of yacht-shaped objects down to those cleared to leave the site. */
export async function filterOutwardAllowed(yachts, key = "slug") {
  const allowed = await loadAllowed();
  if (!allowed) return [];
  return (yachts ?? []).filter((y) =>
    allowed.has(String(y?.[key] ?? "").trim().toLowerCase()),
  );
}
