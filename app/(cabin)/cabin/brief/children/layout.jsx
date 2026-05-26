// 2026-05-26 — Brief 02 (Task A6.1): the Children section is a
// decision about minors aboard (cot, high chair, baby food,
// children-at-table arrangement). Under the new single-
// responsibility model, the Main Charterer owns this decision;
// guests don't fill someone else's children's preferences. The
// server-side layout wraps the (client-component) page with
// PrincipalOnlyGate so guests see a "Principal only" banner with
// the fields locked (disabled fieldset).
//
// Defence-in-depth: /api/cabin/brief/children PUT now returns
// 403 for non-principals ("children" added to
// PRINCIPAL_ONLY_SECTIONS alongside life_aboard/dining/beverages
// in this same brief).

import PrincipalOnlyGate from "@/components/cabin/brief/PrincipalOnlyGate";

export default function ChildrenSectionLayout({ children }) {
  return (
    <PrincipalOnlyGate sectionTitle="The Little Sailors">
      {children}
    </PrincipalOnlyGate>
  );
}
