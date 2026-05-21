// lib/cabin/menu-format.js
// =============================================================
// Shared display transforms for menu dishes — used by both the
// brief's SampleMenuPreview (client) and /cabin/menu (server).
//
// 2026-05-21 — Roberto's brief (v1) reframes display philosophy:
//   "Auto-fill from PDF […] must output text that matches the
//    source document. […] No conversion, no inference, no
//    stripping."
//
// Two earlier display-time transforms violated this rule:
//   • renameBrands: "Nutella" → "chocolate-hazelnut spread"
//   • toSentenceCase: "Butter Croissant" → "Butter croissant"
// Both rewrote owner-supplied menu text. Removed.
//
// What stays:
//   • GREEK_DISH_GLOSSES — a thin annotation layer that renders
//     ALONGSIDE the dish name (as "— translation") for foreign
//     guests. This does NOT modify the source label. It's a
//     footnote, not a rewrite. Sarah (travel-advisor friend test)
//     specifically praised this. The brief forbids "injecting
//     George Yachts' wording into owner-supplied CREW text" —
//     this is menu, not crew, and the gloss is a culinary aid
//     comparable to Wikipedia footnoting a foreign-language film
//     title without changing the title itself.
//   • photo_url support — new in Pass 7, owner can attach a hero
//     photo per dish; renders above the verbatim label.
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

function dishGloss(s) {
  if (!s) return "";
  const lower = String(s).toLowerCase();
  for (const [key, gloss] of Object.entries(GREEK_DISH_GLOSSES)) {
    if (new RegExp(`\\b${key}\\b`).test(lower)) return gloss;
  }
  return "";
}

// Dishes can be either:
//   (a) a plain string ("Moussaka") — the existing shape; or
//   (b) an object { label, gloss?, photo_url? } — attached photo,
//       optional explicit gloss override.
//
// presentDish() returns { label, gloss, photo_url } for every
// input, with photo_url null for the string case. The label is
// passed through VERBATIM — no brand renaming, no case
// transformation. Whatever the owner wrote is what shows.
export function presentDish(raw) {
  if (!raw) return { label: "", gloss: "", photo_url: null };

  if (typeof raw === "object") {
    const label = String(raw.label ?? "").trim();
    const photo =
      typeof raw.photo_url === "string" && raw.photo_url.trim().length > 0
        ? raw.photo_url.trim()
        : null;
    return {
      label,
      gloss:
        raw.gloss != null && String(raw.gloss).trim().length > 0
          ? String(raw.gloss).trim()
          : dishGloss(label),
      photo_url: photo,
    };
  }

  const label = String(raw).trim();
  return { label, gloss: dishGloss(label), photo_url: null };
}
