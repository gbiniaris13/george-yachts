// Money pages — the surfaces where a visitor is actively evaluating
// a charter (ASK B section 5.1, approved by George 2026-07-02).
//
// Rule: NO interruptive machinery here. A guest reading a yacht
// dossier who gets an exit-intent modal has just been treated like
// abandoned-cart traffic. Popups gate themselves OFF on these routes
// (hidden, never deleted); email capture survives via the quiet
// inline FirstAccessBand and the footer signup, per George's
// explicit requirement ("θέλω να τους παίρνουμε τα mail").
//
// Pure constant, safe to import from client components.

const MONEY_PATHS = new Set([
  "/contact",
  "/inquiry",
  "/charter-yacht-greece",
  "/crewed-yacht-charter-greece",
  "/private-fleet",
  "/explorer-fleet",
]);

export function isMoneyPage(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith("/yachts/")) return true;
  return MONEY_PATHS.has(pathname);
}
