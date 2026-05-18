// lib/cabin/supabase.js
// =============================================================
// THE CABIN — Supabase service-role client (server-only).
//
// We do NOT use Supabase Auth. Authentication is handled by the
// Next.js layer (magic link + Vercel KV sessions, mirroring
// lib/partner-portal.js). This client uses the SERVICE_ROLE key
// and therefore bypasses RLS.
//
// CRITICAL: Never import this module from a client component or
// from any route that runs in the browser. Server-side only.
// =============================================================

import { createClient } from "@supabase/supabase-js";

// Fall back to the CRM_* names — george-yachts already has those
// secrets in Vercel for the same Supabase project. Saves us from
// duplicating env vars at deploy time.
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.CRM_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRM_SUPABASE_SERVICE_KEY;

let _client = null;

export function getCabinDb() {
  if (_client) return _client;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // Don't throw at module-load time — that breaks builds when
    // Vercel evaluates the bundle without runtime secrets. Throw
    // only when an actual request needs the client.
    throw new Error(
      "[cabin/supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-cabin-context": "server" } },
  });

  return _client;
}

// Convenience: a tiny wrapper that surfaces errors as thrown
// exceptions instead of the {data,error} dance everywhere. Use
// for queries where any error should bubble up.
export async function dbQuery(promise) {
  const { data, error } = await promise;
  if (error) throw new Error(`[cabin/db] ${error.message}`);
  return data;
}
