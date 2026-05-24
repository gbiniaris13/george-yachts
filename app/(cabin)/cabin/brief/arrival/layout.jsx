// 2026-05-24 — Per George friend test 4 (Alexandros): only the
// principal charterer can edit the Arrival section. Server-side
// layout wraps the (client-component) page with our gate so
// non-principals see the form as read-only with a calm banner.
//
// Defence-in-depth: /api/cabin/brief/arrival PUT also returns
// 403 for non-principals — this layout is the polite UI, the
// API gate is the protection.

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function ArrivalSectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="Arrival & Departure">
      {children}
    </PrincipalOnlyGate>
  );
}
