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

// 2026-05-21 — Pass 7 (Helen HIGH):
//   "for a returning client who is paying around six figures, this
//    surface should be the chef's portfolio, not a Word-doc list.
//    At least one photo per course block."
//
// Dishes can now be either:
//   (a) a plain string — the existing shape ("Moussaka") — or
//   (b) an object { label, gloss?, photo_url? } — so George can
//       attach a hero photo per dish in gy-command without losing
//       backward compatibility with the string form.
//
// presentDish() returns { label, gloss, photo_url } for every
// input. The photo_url is propagated unchanged; the renderer
// decides whether to surface it. Strings keep working untouched.
export function presentDish(raw) {
  if (!raw) return { label: "", gloss: "", photo_url: null };

  // Object form first — read fields explicitly. We do NOT pass an
  // explicit gloss back through the inference pipeline, but we DO
  // still run isPureTitleCase / renameBrands so a structured
  // "Nutella" → "chocolate-hazelnut spread" still happens.
  if (typeof raw === "object") {
    let label = String(raw.label ?? "").trim();
    label = renameBrands(label);
    if (isPureTitleCase(label)) label = toSentenceCase(label);
    const photo = typeof raw.photo_url === "string" && raw.photo_url.trim().length > 0
      ? raw.photo_url.trim()
      : null;
    return {
      label,
      gloss: raw.gloss != null && String(raw.gloss).trim().length > 0
        ? String(raw.gloss).trim()
        : dishGloss(label),
      photo_url: photo,
    };
  }

  let label = String(raw).trim();
  label = renameBrands(label);
  if (isPureTitleCase(label)) label = toSentenceCase(label);
  return { label, gloss: dishGloss(raw), photo_url: null };
}
