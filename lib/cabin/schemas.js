// lib/cabin/schemas.js
// =============================================================
// THE CABIN — zod schemas for every Charter Brief section.
//
// One zod schema per section. Used both client-side (react-hook-
// form via @hookform/resolvers/zod) and server-side (validate
// before writing into cabin_brief_sections.data JSONB).
//
// All fields are `optional()` by default — the brief insists on
// "leave blanks freely". The form UI marks the few truly mandatory
// fields with a gold dot via the `required` prop on the input
// component; field names stay clean so they read naturally on the
// admin/PDF side.
// =============================================================

import { z } from "zod";

// Common primitives ------------------------------------------------
const opt = (s) => s.optional().nullable();
const optString = opt(z.string().max(2000));
const optStringShort = opt(z.string().max(255));
const optDate = opt(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
const optNumber = opt(z.coerce.number());

// =============================================================
// Section: Arrival & Departure
// =============================================================
const flightGroupSchema = z.object({
  date_of_arrival: optDate,
  time_of_arrival: optStringShort,
  airline_and_flight: optStringShort,
  coming_from: optStringShort,
  number_of_guests: optNumber,
  // commercial vs private — captain coordinates pickup differently
  flight_type: z.enum(["commercial", "private"]).optional(),
});

export const arrivalSchema = z.object({
  flight_group_1: flightGroupSchema.optional(),
  flight_group_2: flightGroupSchema.optional(),
  private_arrival_notes: optString,
  // Industry preference sheets ask about the group's previous
  // sailing/boating experience so the captain calibrates the
  // briefing. Free text — covers "first charter" through "I race
  // J/70s on weekends."
  yachting_experience: optString,

  before_embarkation: z
    .object({
      hotel_or_address: optStringShort,
      check_out_date: optDate,
    })
    .optional(),

  after_disembarkation: z
    .object({
      hotel_or_address: optStringShort,
      check_in_date: optDate,
    })
    .optional(),

  transfers_requested: z.enum(["yes", "no", "undecided"]).optional(),
  transfer_to_yacht: z
    .object({
      pickup_location: optStringShort,
      pickup_datetime: optStringShort,
      number_of_guests: optNumber,
    })
    .optional(),
  transfer_from_yacht: z
    .object({
      dropoff_location: optStringShort,
      dropoff_datetime: optStringShort,
      number_of_guests: optNumber,
    })
    .optional(),
});

// =============================================================
// Section: Guests (high-level notes — full manifest lives in
// cabin_guests_manifest table)
// =============================================================
export const guestsSchema = z.object({
  // Quick multi-select scenarios so the crew has a head-start. None
  // are mandatory; the freeform field below covers everything else.
  group_scenarios: opt(z.array(z.string().max(64))),
  group_notes: optString,   // "Anything else the crew should know…"
});

// =============================================================
// Section: Health, Allergies & Safety
// =============================================================
export const healthSchema = z.object({
  allergies_dietary: opt(z.string().max(5000)),
  medical_conditions: optString,
  medications_onboard: optString,
  swimming_experience: z
    .enum(["all_strong", "some_prefer_not", "children_supervised", "other"])
    .optional(),
  swimming_other: optString,

  emergency_contact: z
    .object({
      full_name: optStringShort,
      relationship: optStringShort,
      mobile: optStringShort,
      // Accept empty string from autosave-on-empty-field; only
      // validate format when there's actually content.
      email: opt(z.union([z.literal(""), z.string().email().max(255)])),
    })
    .optional(),
});

// =============================================================
// Section: Itinerary
// =============================================================
export const itinerarySchema = z.object({
  preferred_areas: opt(
    z.array(z.enum(["cyclades", "saronic", "ionian", "mixed", "undecided"]))
  ),
  specific_places: optString,
  pace: z.enum(["productive", "slow_restful", "balanced"]).optional(),
  night_preference: z
    .enum([
      "marinas",
      "anchorages",
      "mostly_anchor_some_marina",
      "captain_decides",
    ])
    .optional(),
  celebrations: optString,

  // Industry adds: per-event-type checkboxes + which extras the
  // crew should pre-stage (Flowers / Music / Board games /
  // Magazines / Banner / Cake).
  special_event_types: opt(
    z.array(z.enum(["birthday", "anniversary", "honeymoon", "proposal", "other"]))
  ),
  special_event_extras: opt(
    z.array(z.enum(["flowers", "music", "board_games", "magazines", "banner", "cake"]))
  ),

  // High-level character of the week — bar/cellar provisioning,
  // crew posture, itinerary aggressiveness all key off this.
  overall_experience: z
    .enum(["productive_exciting", "peaceful_relaxing", "combination"])
    .optional(),

  // Docking preference — distinct from night_preference above
  // because that's about WHERE (marina vs anchor) and this is
  // about HOW the captain treats the choice (rigid vs flexible).
  docking_preference: z.enum(["marinas", "anchoring", "both"]).optional(),

  // Industry preference sheets list these as distinct activities
  // (yes/no per item, not multi-select chips), and the captain
  // tunes the day plan around them. Kept as multi-select for UX
  // consistency with our existing activities chips.
  activities_extra: opt(
    z.array(
      z.enum(["cycling", "island_tour", "scuba_diving_padi", "fishing_specific"])
    )
  ),
});

// =============================================================
// Section: Life Aboard
// =============================================================
const ACTIVITIES = [
  "swimming_snorkel",
  "kayaking",
  "wakeboarding",
  "scuba_rendezvous",
  "fishing",
  "sunbathing",
  "shopping_ashore",
  "sunset_cocktails",
  "paddleboarding",
  "water_skiing",
  "tubing",
  "jet_ski",
  "sailing_under_sail",
  "island_hikes",
  "cultural_tours",
  "stargazing",
];

export const lifeAboardSchema = z.object({
  crew_interaction: z
    .enum(["always_around", "balanced", "discreet"])
    .optional(),
  activities: opt(z.array(z.enum(ACTIVITIES))),
  activities_other: optString,
  music: z
    .object({
      morning: optStringShort,
      lunch_afternoon: optStringShort,
      sunset_dinner: optStringShort,
      late_night: optStringShort,
      specific_artists: optString,
    })
    .optional(),
  // Free-text "small touches" replaces the old fixed checkbox list.
  // We avoid surfacing checkboxes here because several items can
  // carry extra charges from the management company, and a list
  // suggests they're all free.
  extras_freeform: optString,
});

// =============================================================
// Section: Dining
// =============================================================
const FOOD_CATEGORIES = [
  "fish_seafood",
  "shellfish",
  "beef_veal",
  "lamb",
  "pork",
  "chicken_poultry",
  "pasta_risotto",
  "rice_dishes",
  "vegetables_salads",
  "greek_meze",
  "asian_flavors",
  "spicy_food",
  "raw_prep",
];

// Per-item like / dislike / indifferent — this is what the chef
// actually plans menus from. Keys are stable across renderers
// (form, sheet, captain print) so we never have to re-parse.
const FOOD_MATRIX_ITEMS = [
  "fish",
  "shellfish",
  "beef",
  "pork",
  "lamb",
  "veal",
  "chicken",
  "turkey",
  "greek_meze",
  "pasta",
  "rice",
  "vegetables",
  "salad",
];

const FOOD_MATRIX_VALUES = ["like", "dislike", "indifferent"];

// Object keyed by item → enum verdict. We keep it as a freeform
// record so adding a new item later (e.g. duck, game) does not
// require a migration of existing rows.
const foodMatrixSchema = opt(
  z.record(z.string(), z.enum(FOOD_MATRIX_VALUES))
);

const BREAKFAST_ITEMS = [
  "poached_eggs",
  "fried_eggs",
  "omelet",
  "scrambled_eggs",
  "boiled_eggs",
  "cheese",
  "milk_low_fat",
  "milk_full_fat",
  "yogurt_low_fat",
  "yogurt_full_fat",
  "cream_cheese",
  "honey",
  "toast",
  "cereal",
  "seasonal_fruits",
  "jam",
  "pancakes",
  "bacon",
  "sausages",
];

const COFFEE_TEA_OPTIONS = [
  "espresso",
  "cappuccino",
  "cafe_latte",
  "iced_latte",
  "americano",
  "filtered_coffee",
  "greek_coffee",
  "instant_coffee",
  "milk_shake",
  "cold_chocolate",
  "hot_chocolate",
  "tea",
  "juice",
];

export const diningSchema = z.object({
  breakfast_time: optStringShort,
  lunch_time: optStringShort,
  dinner_time: optStringShort,

  // Legacy single-pick — kept for backwards compat. New UI can use
  // breakfast_styles (plural array) for "I want continental AND
  // american items available."
  breakfast_style: z
    .enum(["continental", "american", "mediterranean", "light_healthy"])
    .optional(),
  breakfast_styles: opt(
    z.array(z.enum(["continental", "american", "british", "european", "mediterranean", "light_healthy"]))
  ),
  // Per-item yes/no checkboxes. Stored as an array of keys that the
  // chef should keep stocked. Items missing from the list aren't
  // explicitly off-limits — that's what food_matrix is for.
  breakfast_items: opt(z.array(z.enum(BREAKFAST_ITEMS))),
  // Specifics for the items that ask for a kind (cheese kind, cereal
  // kind, jam kind). Free strings so charterers can name the brand.
  breakfast_cheese_kind: optStringShort,
  breakfast_cereal_kind: optStringShort,
  breakfast_jam_kind: optStringShort,
  breakfast_tea_kind: optStringShort,
  breakfast_juice_kind: optStringShort,
  breakfast_specifics: optString,

  // Replaces the loose multi-select with a curated set. We keep the
  // old `coffee_tea` field name and just constrain values via the
  // enum so existing rows still validate (extra keys are stripped).
  coffee_tea: opt(z.array(z.enum(COFFEE_TEA_OPTIONS))),
  coffee_tea_specifics: optString,

  // Service preferences per meal. Light = grazing platters, Cold =
  // gazpacho/carpaccio etc., Hot = plated entrée. Family style =
  // serve in the centre, not individually plated.
  lunch_service: z.enum(["light", "cold", "hot", "family_style"]).optional(),
  dinner_service: z.enum(["light", "cold", "hot", "family_style"]).optional(),

  // The food matrix is the heart of provisioning — the chef
  // shouldn't have to read free text to know "fish: yes, lamb: no."
  food_matrix: foodMatrixSchema,

  // Legacy multi-selects retained for back-compat with submitted
  // briefs. New UI prefers food_matrix above; the captain's print
  // shows both if both are populated.
  food_loves: opt(z.array(z.enum(FOOD_CATEGORIES))),
  food_avoid: opt(z.array(z.enum(FOOD_CATEGORIES))),

  // Dessert
  dessert_styles: opt(
    z.array(z.enum(["pastries", "fruits", "ice_cream", "greek_traditional", "cakes", "no_dessert"]))
  ),
  dessert_specifics: optString,

  // Snacks between meals
  snacks_yes_no: z.enum(["yes", "no", "occasional"]).optional(),
  snacks_details: optString,

  // Afternoon tea
  afternoon_tea_yes_no: z.enum(["yes", "no", "occasional"]).optional(),
  afternoon_tea_details: optString,

  dining_ashore_evenings: z
    .enum(["0", "1", "2", "3", "4_plus"])
    .optional(),
  dining_ashore_notes: optString,

  // Kids meals (industry sheets have a dedicated kids' food block)
  kids_meal_arrangement: z.enum(["with_adults", "separate", "mixed"]).optional(),
  kids_meal_specifics: optString,
  kids_needs_baby_cot: z.boolean().optional(),
  kids_needs_high_chair: z.boolean().optional(),
  kids_baby_food_specifics: optString,

  children_at_table: optString,
  chef_open_note: optString,
});

// =============================================================
// Section: Beverages
// =============================================================
// Label + quantity rows used for soft drinks, wines, spirits, beers.
// Quantity is text (not number) because real preference sheets say
// things like "24 cans" or "6 bottles" or "by the case" — locking
// to integer would force unnatural input.
const labelQtySchema = z.object({
  label: optStringShort,
  quantity: optStringShort,
});

// Wine rows additionally carry a price range per bottle (free text
// like "150" or "€100-150" — the captain agrees the budget with
// the charterer, this is the brief value).
const wineRowSchema = z.object({
  label: optStringShort,
  quantity: optStringShort,
  price_range_per_bottle: optStringShort,
});

export const beveragesSchema = z.object({
  // Type: legacy "water" stayed for back-compat. Industry sheets
  // distinguish mineral/sparkling/spring; we expand into water_type
  // (multi-select) and keep `water` as alias resolved at render.
  water: opt(z.array(z.enum(["still", "sparkling"]))),
  water_type: opt(z.array(z.enum(["mineral", "sparkling", "spring"]))),
  water_brand: optStringShort,
  // Per-day per-person estimate ("2-3 waters per day per person")
  // so the captain can compute total provisioning.
  water_consumption_estimate: optStringShort,

  // "Standard bar — classics included" pre-checked boxes. We keep
  // values open so we can add more categories without a migration.
  standard_bar_items: opt(z.array(z.string().max(64))),

  // Specific labels — free text (legacy field, kept).
  specific_preferences: optString,

  // ─── Provisioning tables ───────────────────────────────────
  // Each is an array of label/qty rows. Empty rows are dropped
  // server-side. Captain reads these straight into a shopping list.
  soft_drinks: opt(z.array(labelQtySchema).max(40)),

  // Wines / Champagne
  wine_style: z
    .enum(["surprise_greek", "house_red_white", "specific_only", "combination"])
    .optional(),
  wine_greek_vineyards: z.enum(["yes", "no", "open_to"]).optional(),
  wine_price_range: optStringShort,
  wines: opt(z.array(wineRowSchema).max(40)),

  // Spirits — separate field per type so the captain doesn't have
  // to read "type=whiskey, label=..." merged rows. Each is a
  // label/qty array.
  whiskey: opt(z.array(labelQtySchema).max(10)),
  vodka: opt(z.array(labelQtySchema).max(10)),
  gin: opt(z.array(labelQtySchema).max(10)),
  rum: opt(z.array(labelQtySchema).max(10)),
  tequila: opt(z.array(labelQtySchema).max(10)),
  liqueur: opt(z.array(labelQtySchema).max(10)),

  // Beers — international + local. Local label captured separately
  // because Greek beers (Mythos, Alfa) are categorised that way in
  // industry sheets.
  beers: opt(z.array(labelQtySchema).max(20)),
  beers_local: opt(z.array(labelQtySchema).max(20)),

  // Cocktails kept as free text (legacy). Mocktails added — most
  // groups with kids ask for them.
  cocktails: optString,
  mocktails: optString,
});

// =============================================================
// Section: Little Things  (Section 12)
// =============================================================
export const littleThingsSchema = z.object({
  surprises_celebrations: optString,
  things_to_avoid: optString,
  connectivity: z
    .enum([
      "strong_internet",
      "fine_not_priority",
      "no_photos_of_guests",
    ])
    .optional(),
  connectivity_notes: optString,
  // GDPR-clean record of consent for our archive use of photos.
  // We never use without explicit yes.
  photo_archive_permission: z
    .enum(["yes_archive_ok", "yes_no_faces", "no_only_for_us"])
    .optional(),
  anything_else: optString,

  // Night service — items the hostess places in each cabin between
  // 6 and 9pm. Per industry sheets, this is a discrete checklist
  // (not free text) so the hostess can run it from the printed sheet.
  night_service: opt(
    z.array(z.enum(["water_bottles", "chocolates", "bedtime_books", "fresh_fruit", "herbal_tea"]))
  ),
});

// =============================================================
// Section: Children
// =============================================================
const childSchema = z.object({
  name: optStringShort,
  age: optNumber,
  allergies_repeat: optString,
  favourite_foods: optString,
  foods_avoid: optString,
  activities_loves: optString,
  sleeps_with_parent: z.enum(["yes", "no"]).optional(),
  bedtime_preference: optStringShort,
});

export const childrenSchema = z.object({
  children: opt(z.array(childSchema).max(6)),
  equipment: opt(
    z.array(
      z.enum([
        "baby_cot",
        "high_chair",
        "kids_life_jackets",
        "pool_toys",
        "bedtime_books",
        "baby_food",
        "other",
      ])
    )
  ),
  equipment_other: optString,
});

// =============================================================
// Section registry
// =============================================================
export const SECTION_SCHEMAS = {
  arrival: arrivalSchema,
  guests: guestsSchema,
  health: healthSchema,
  itinerary: itinerarySchema,
  life_aboard: lifeAboardSchema,
  dining: diningSchema,
  beverages: beveragesSchema,
  little_things: littleThingsSchema,
  children: childrenSchema,
};

export const ALL_SECTION_KEYS = Object.keys(SECTION_SCHEMAS);

// -----------------------------------------------------------
// Section completeness — counts how many "important" fields the
// section has filled. Used for the brief_completion_percent on
// the cabin record and for the per-section progress dot.
// -----------------------------------------------------------
export function sectionCompleteness(sectionKey, data) {
  const schema = SECTION_SCHEMAS[sectionKey];
  if (!schema) return 0;
  const parsed = schema.safeParse(data ?? {});
  if (!parsed.success) return 0;
  // Count any "meaningfully populated" value across the section.
  // Walks the object recursively. Counts: non-empty strings,
  // numbers, booleans=true, and array entries (each entry = 1).
  // Empty strings, null, undefined, false, {} all count as 0.
  let count = 0;
  const walk = (v) => {
    if (v === null || v === undefined) return;
    if (typeof v === "string") { if (v.trim().length > 0) count += 1; return; }
    if (typeof v === "number") { count += 1; return; }
    if (typeof v === "boolean") { if (v) count += 1; return; }
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v === "object") { Object.values(v).forEach(walk); return; }
  };
  walk(parsed.data);
  // 6 populated fields → 42 → completed (≥40 threshold in route).
  return Math.min(100, count * 7);
}
