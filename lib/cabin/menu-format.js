// lib/cabin/menu-format.js
// =============================================================
// 2026-05-20 — Friend-test pass 4 round 5.
//
// Shared display transforms for menu dishes — used by both the
// brief's SampleMenuPreview (client) and /cabin/menu (server).
//
// Originally only the brief preview applied these. Helen flagged
// that /cabin/menu still shipped "Nutella" verbatim and all-Title-
// Case dishes. Lifting to a shared lib so both surfaces stay
// consistent.
// =============================================================

const GREEK_DISH_GLOSSES = {
  moussaka: "layered eggplant, lamb, béchamel",
  galaktoboureko: "sweet semolina custard in syrup",
  pastitsio: "baked pasta with béchamel + meat sauce",
  baklava: "filo pastry with nuts + honey",
  barbouni: "red mullet, pan-fried",
  loukoumades: "fried dough drizzled with honey",
  spanakopita: "spinach + feta in filo",
  tzatziki: "yoghurt, cucumber, garlic dip",
  taramosalata: "fish-roe dip",
  saganaki: "pan-seared cheese",
  bougatsa: "custard or cheese in filo",
  yiouvetsi: "lamb + orzo, baked",
  kleftiko: "slow-cooked lamb",
  fasolada: "white-bean soup",
  horiatiki: "Greek salad",
  dolmades: "stuffed vine leaves",
  souvlaki: "grilled meat skewers",
  gyros: "spit-roasted meat in pita",
  feta: "brined sheep-milk cheese",
  graviera: "hard sheep-milk cheese",
};

function isPureTitleCase(s) {
  const words = String(s).trim().split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (words.length < 2) return false;
  return words.every((w) => /^[A-Z]/.test(w));
}

function toSentenceCase(s) {
  if (!s || typeof s !== "string") return s;
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function renameBrands(s) {
  if (!s) return s;
  return s.replace(/\bnutella\b/gi, "chocolate-hazelnut spread");
}

function dishGloss(s) {
  if (!s) return "";
  const lower = String(s).toLowerCase();
  for (const [key, gloss] of Object.entries(GREEK_DISH_GLOSSES)) {
    if (new RegExp(`\\b${key}\\b`).test(lower)) return gloss;
  }
  return "";
}

export function presentDish(raw) {
  if (!raw) return { label: "", gloss: "" };
  let label = String(raw).trim();
  label = renameBrands(label);
  if (isPureTitleCase(label)) label = toSentenceCase(label);
  return { label, gloss: dishGloss(raw) };
}
