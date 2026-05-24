// 2026-05-24 — Christos pass: emergency contact is principal-only.
// See sibling arrival/layout.jsx for the gate pattern.

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function HealthSectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="Emergency Contact">
      {children}
    </PrincipalOnlyGate>
  );
}
