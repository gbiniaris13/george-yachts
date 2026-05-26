// 2026-05-26 — Brief 02 (Task A4.1): Life Aboard is now a
// Main-Charterer decision under the new single-responsibility
// model. The server-side layout wraps the (client-component)
// page with PrincipalOnlyGate so non-principals see the form as
// read-only with a calm "Principal only" banner. Same pattern
// already used by arrival/itinerary/guests/health.
//
// Defence-in-depth: /api/cabin/brief/life_aboard PUT also returns
// 403 for non-principals (added to PRINCIPAL_ONLY_SECTIONS in
// CP1). This layout is the polite UI; the API gate is the
// protection.

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function LifeAboardSectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="Life Aboard">
      {children}
    </PrincipalOnlyGate>
  );
}
