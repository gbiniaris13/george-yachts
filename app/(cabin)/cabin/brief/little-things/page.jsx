// app/(cabin)/cabin/brief/little-things/page.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 3.
//
// George removed "The Little Things" from the brief flow:
//   "Βγάλετε τελείως. Μόνο χρόνο μας τρώει."
//
// The schema (littleThingsSchema in lib/cabin/schemas.js) and any
// already-saved data on existing cabins stay where they are — we
// just stop collecting new entries via this section. If someone
// follows an older link or bookmark to this URL, send them back
// to the brief overview rather than show a dead page.
// =============================================================

import { redirect } from "next/navigation";

export default function LittleThingsRedirectPage() {
  redirect("/cabin/brief");
}
