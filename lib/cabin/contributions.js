// lib/cabin/contributions.js
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3).
//
// Pure helpers for converting a guest's stored
// cabin_brief_contributions.data JSONB into a small set of
// human-readable highlights. Used in:
//   • /cabin/brief/review            (principal-side display)
//   • /api/cabin/brief/submit        (email + Telegram payload)
//
// Each helper returns an ARRAY of short strings — caller chooses
// how to render (bullets, paragraphs, comma-separated). The
// summary is deliberately concise: the principal reading the
// review (or George reading the email) needs to spot the
// noteworthy choices, not re-parse the full preference matrix.
// The full raw data still lives in the JSONB; this is just the
// at-a-glance view.
// =============================================================

const LIST_LIMIT = 6;

function listSome(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const trimmed = arr.slice(0, LIST_LIMIT);
  const out = trimmed.map(prettyValue).join(", ");
  return arr.length > LIST_LIMIT ? `${out} +${arr.length - LIST_LIMIT}` : out;
}

function prettyValue(v) {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") return String(v);
  return String(v).replace(/_/g, " ");
}

function truncate(s, n = 100) {
  const str = String(s ?? "").trim();
  if (!str) return "";
  return str.length > n ? str.slice(0, n).trimEnd() + "…" : str;
}

function tierLabel(v) {
  if (v === "premium") return "Premium";
  if (v === "standard") return "Standard";
  if (v === "classic") return "Classic";
  if (v === "leave_to_captain") return "Leave to captain";
  return prettyValue(v);
}

// ---- Dining (At the Table) ----

export function summariseDiningContribution(data = {}) {
  const out = [];

  if (Array.isArray(data.breakfast_styles) && data.breakfast_styles.length > 0) {
    out.push(`Breakfast: ${listSome(data.breakfast_styles)}`);
  }
  if (Array.isArray(data.coffee_tea) && data.coffee_tea.length > 0) {
    out.push(`Coffee/tea: ${listSome(data.coffee_tea)}`);
  }

  // Food matrix → buckets of likes / dislikes for at-a-glance scan
  const matrix = data.food_matrix && typeof data.food_matrix === "object"
    ? data.food_matrix
    : {};
  const likes = Object.keys(matrix).filter((k) => matrix[k] === "like");
  const dislikes = Object.keys(matrix).filter((k) => matrix[k] === "dislike");
  if (likes.length) out.push(`Likes: ${listSome(likes)}`);
  if (dislikes.length) out.push(`Dislikes: ${listSome(dislikes)}`);

  if (data.lunch_service)  out.push(`Lunch service: ${prettyValue(data.lunch_service)}`);
  if (data.dinner_service) out.push(`Dinner service: ${prettyValue(data.dinner_service)}`);

  if (data.snacks_yes_no && data.snacks_yes_no !== "no") {
    const tail = truncate(data.snacks_details, 60);
    out.push(`Snacks: ${prettyValue(data.snacks_yes_no)}${tail ? ` — ${tail}` : ""}`);
  }
  if (data.afternoon_tea_yes_no && data.afternoon_tea_yes_no !== "no") {
    const tail = truncate(data.afternoon_tea_details, 60);
    out.push(
      `Afternoon tea: ${prettyValue(data.afternoon_tea_yes_no)}${
        tail ? ` — ${tail}` : ""
      }`,
    );
  }

  const ashore = truncate(data.dining_ashore_notes, 140);
  if (ashore) out.push(`Dining ashore: ${ashore}`);

  const chefNote = truncate(data.chef_open_note, 140);
  if (chefNote) out.push(`Note to chef: ${chefNote}`);

  return out;
}

// ---- Beverages (In the Cellar) ----

export function summariseBeveragesContribution(data = {}) {
  const out = [];

  if (Array.isArray(data.water_type) && data.water_type.length > 0) {
    out.push(`Water: ${listSome(data.water_type)}`);
  }

  if (data.champagne_wanted) {
    const tier = data.champagne_tier && data.champagne_tier !== "leave_to_captain"
      ? ` (${tierLabel(data.champagne_tier)})`
      : "";
    out.push(`Champagne: ${prettyValue(data.champagne_wanted)}${tier}`);
  }
  const champLabels = truncate(data.champagne_specifics, 100);
  if (champLabels) out.push(`Champagne labels: ${champLabels}`);

  if (data.wine_wanted) {
    const tier = data.wine_tier && data.wine_tier !== "leave_to_captain"
      ? ` (${tierLabel(data.wine_tier)})`
      : "";
    out.push(`Wine: ${prettyValue(data.wine_wanted)}${tier}`);
  }
  if (Array.isArray(data.wine_colors) && data.wine_colors.length > 0) {
    out.push(`Wine colours: ${listSome(data.wine_colors)}`);
  }
  const grapes = truncate(data.wine_grapes, 80);
  if (grapes) out.push(`Grapes: ${grapes}`);
  const wineLabels = truncate(data.wine_specifics, 100);
  if (wineLabels) out.push(`Wine labels: ${wineLabels}`);

  if (data.beers_frequency && data.beers_frequency !== "skip") {
    const origin = data.beers_origin
      ? ` · ${prettyValue(data.beers_origin)}`
      : "";
    out.push(`Beer: ${prettyValue(data.beers_frequency)}${origin}`);
  }
  const beerLabels = truncate(data.beers_specifics, 100);
  if (beerLabels) out.push(`Beer labels: ${beerLabels}`);

  const spirits = truncate(data.spirits_brands, 100);
  if (spirits) out.push(`Spirits: ${spirits}`);

  const soft = truncate(data.soft_drinks_brands, 100);
  if (soft) out.push(`Soft drinks: ${soft}`);

  const cocktails = truncate(data.cocktails, 140);
  if (cocktails) out.push(`Cocktails: ${cocktails}`);

  const mocktails = truncate(data.mocktails, 140);
  if (mocktails) out.push(`Mocktails: ${mocktails}`);

  return out;
}

// Dispatcher used by callers that don't want to switch on section.
export function summariseContribution(sectionKey, data) {
  if (sectionKey === "dining") return summariseDiningContribution(data);
  if (sectionKey === "beverages") return summariseBeveragesContribution(data);
  return [];
}
