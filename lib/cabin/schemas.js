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
});

export const arrivalSchema = z.object({
  flight_group_1: flightGroupSchema.optional(),
  flight_group_2: flightGroupSchema.optional(),
  private_arrival_notes: optString,

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

export const diningSchema = z.object({
  breakfast_time: optStringShort,
  lunch_time: optStringShort,
  dinner_time: optStringShort,

  breakfast_style: z
    .enum(["continental", "american", "mediterranean", "light_healthy"])
    .optional(),
  breakfast_specifics: optString,

  coffee_tea: opt(z.array(z.string().max(64))),
  coffee_tea_specifics: optString,

  food_loves: opt(z.array(z.enum(FOOD_CATEGORIES))),
  food_avoid: opt(z.array(z.enum(FOOD_CATEGORIES))),

  dining_ashore_evenings: z
    .enum(["0", "1", "2", "3", "4_plus"])
    .optional(),
  dining_ashore_notes: optString,

  children_at_table: optString,
  chef_open_note: optString,
});

// =============================================================
// Section: Beverages
// =============================================================
export const beveragesSchema = z.object({
  water: opt(z.array(z.enum(["still", "sparkling"]))),
  water_brand: optStringShort,

  // "Standard bar — classics included" pre-checked boxes. We keep
  // values open so we can add more categories without a migration.
  standard_bar_items: opt(z.array(z.string().max(64))),

  // Charterer's specific preferences (brands, labels, vintages).
  // Free text; the hostess pre-stocks based on what's here.
  specific_preferences: optString,

  wine_style: z
    .enum(["surprise_greek", "house_red_white", "specific_only", "combination"])
    .optional(),

  cocktails: optString,
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
