// app/(cabin)/cabin/layout.jsx
// =============================================================
// /cabin/* layout. Renders the sticky top header (navy bar with
// charterer name + vessel + dates), the side/bottom navigation,
// and the page content area.
//
// AUTH NOTE: the soft "do you have a session cookie?" gate lives
// in middleware.js (anonymous → redirected to /cabin/login).
// The layout itself never redirects — that prevents the infinite
// loop you get if a missing header tricks the layout into
// redirecting the login page back onto itself.
//
// /cabin/login passes through this layout WITHOUT a session and
// renders its own full-page shell (CabinShell hides chrome when
// pathname ends with "/cabin/login").
// =============================================================

import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import CabinShell from "../../components/cabin/CabinShell";

async function fetchCabinForHeader(cabinId) {
  const db = getCabinDb();
  return dbQuery(
    db
      .from("cabins")
      .select(
        `id, status, vessel_name, charter_period_from, charter_period_to,
         principal_charterer_name, brief_completion_percent, concierge_mode_active`
      )
      .eq("id", cabinId)
      .maybeSingle()
  );
}

export default async function CabinLayout({ children }) {
  let session = null;
  let cabin = null;

  try {
    session = await readSessionFromCookies();
    if (session) {
      const activeCabinId = pickActiveCabinId(session);
      if (activeCabinId) {
        cabin = await fetchCabinForHeader(activeCabinId);
      }
    }
  } catch (err) {
    // If KV / Supabase are momentarily unreachable, fall through
    // to anonymous rendering. The middleware gate has already
    // ensured we won't show authenticated pages without a cookie.
    console.error("[cabin/layout] session/cabin fetch error:", err);
  }

  return (
    <CabinShell session={session} cabin={cabin}>
      {children}
    </CabinShell>
  );
}
