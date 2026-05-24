// 2026-05-24 — Per George friend test 4: only the principal
// charterer can edit Itinerary (pace, islands, places). Server-
// side layout wraps the (client-component) page with our gate.
// See sibling arrival/layout.jsx for context.

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function ItinerarySectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="Your Itinerary">
      {children}
    </PrincipalOnlyGate>
  );
}
