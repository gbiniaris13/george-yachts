// 2026-05-23 — SHARED BRIEF MODEL. The Phase-3 per-member
// contribution flow (this page used to mount a private-to-the-
// guest DiningFields form writing to cabin_brief_contributions)
// has been superseded by the shared-brief model George chose:
// every member edits the same /cabin/brief/dining canonical form.
//
// Kept as a server-side redirect so anyone who bookmarked the
// short-lived contribution URL still lands on the right place.
//
// The cabin_brief_contributions table data (Bill's earlier picks
// etc.) is preserved in the DB as archeology — the principal can
// still see what was added in the previous flow if they need to.

import { redirect } from "next/navigation";

export default function AtTheTableContributionRedirect() {
  redirect("/cabin/brief/dining");
}
