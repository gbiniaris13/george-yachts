// 2026-05-24 — Angeliki pass: Section Two ("Your Group") is now
// principal-only, same pattern as arrival / itinerary / health.
// Group composition + tone of the week is the principal's call.

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function GuestsSectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="Your Group">
      {children}
    </PrincipalOnlyGate>
  );
}
