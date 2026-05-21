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

import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { displayNameWithoutHonorific } from "@/lib/cabin/format";
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

// 2026-05-20 — Friend-test pass 6 (Domingo):
//   "The header chip on every page shows the principal's name,
//    even when I'm logged in as an invited guest. For Tricia
//    herself looks fine; for any guest she invites it's going to
//    look like the page belongs to Tricia and they're an intruder."
//
// Fix: fetch the VIEWER's own display_name from cabin_members
// using the membership's member_id. Pass as a prop so CabinShell
// renders the viewer's identity, not the principal's.
async function fetchViewerDisplayName(memberId) {
  if (!memberId) return null;
  const db = getCabinDb();
  const row = await dbQuery(
    db
      .from("cabin_members")
      .select("display_name")
      .eq("id", memberId)
      .maybeSingle()
  );
  // 2026-05-21 — Strip leading honorifics ("Ms.", "Dr.", etc) so
  // a member whose display_name was seeded from the MYBA contract
  // ("Ms. Tricia Stevens") doesn't display "Ms." in the header
  // chip. After the principal's passport extraction runs, this
  // value is already clean — but cabins not yet passport-checked
  // still benefit from defensive stripping here.
  return displayNameWithoutHonorific(row?.display_name) ?? row?.display_name ?? null;
}

export default async function CabinLayout({ children }) {
  let session = null;
  let cabin = null;
  let viewerDisplayName = null;

  try {
    session = await readSessionFromCookies();
    if (session) {
      const activeCabinId = pickActiveCabinId(session);
      if (activeCabinId) {
        const membership = resolveMembership(session, activeCabinId);
        const [c, name] = await Promise.all([
          fetchCabinForHeader(activeCabinId),
          fetchViewerDisplayName(membership?.member_id),
        ]);
        cabin = c;
        viewerDisplayName = name;
      }
    }
  } catch (err) {
    // If KV / Supabase are momentarily unreachable, fall through
    // to anonymous rendering. The middleware gate has already
    // ensured we won't show authenticated pages without a cookie.
    console.error("[cabin/layout] session/cabin fetch error:", err);
  }

  // 2026-05-21 — Admin preview indicator. The layout passes a
  // single flag + the admin's email + expiry timestamp; CabinShell
  // renders a permanent banner so George (or any other admin)
  // never mistakes a preview for a real customer session.
  const previewMode = Boolean(session?.preview_mode);
  const previewAdminEmail = session?.preview_admin_email || null;
  const previewExpiresAt = session?.expires || null;

  return (
    <CabinShell
      session={session}
      cabin={cabin}
      viewerDisplayName={viewerDisplayName}
      previewMode={previewMode}
      previewAdminEmail={previewAdminEmail}
      previewExpiresAt={previewExpiresAt}
    >
      {children}
    </CabinShell>
  );
}
