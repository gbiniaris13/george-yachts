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

// HTML radios with value="true"/"false" submit STRINGS, not booleans.
// react-hook-form passes them through as-is. We can't use z.coerce.boolean()
// because that turns every truthy string (including "false") into true.
// Preprocess them properly: only the literal strings "true"/"false"
// (and their boolean equivalents) flip to a boolean; everything else
// (null, undefined, empty string) becomes null.
const optBoolRadio = z.preprocess((v) => {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return null;
}, z.boolean().nullable().optional());

// 2026-05-20 — friend-test fix. React-hook-form's CheckboxGroup
// behaviour is asymmetric: 0 boxes checked → `false`; 1 box checked
// → the single string value; 2+ boxes checked → array of strings.
// The brief schemas declared every checkbox set as `z.array(...)`
// which rejected the 0-box and 1-box cases, breaking saves for
// every user who only ticked one option in a group (Billy hit this
// on "What Kind of Week" / `group_type`).
//
// `arrayOf` wraps an inner enum/string schema so all three cases
// resolve to a valid array (or undefined). Composed of two layers:
//   1. preprocess() coerces false → undefined, scalar → [scalar].
//   2. inner z.array() does the per-element validation, then
//      .optional().nullable() keeps absent/empty briefs valid.
//
// Use this in place of `opt(z.array(...))` everywhere a checkbox
// group writes.
const arrayOf = (inner) =>
  z.preprocess((v) => {
    if (v === null || v === undefined) return undefined;
    if (v === false || v === "") return undefined;
    if (Array.isArray(v)) {
      const cleaned = v.filter(
        (x) => x !== null && x !== undefined && x !== "" && x !== false,
      );
      return cleaned.length === 0 ? undefined : cleaned;
    }
    return [v]; // single scalar (RHF when only one checkbox is checked)
  }, z.array(inner).optional().nullable());

// 2026-05-20 — friend-test fix. Same root cause as arrayOf: unset
// radios in RHF arrive as `null` or `""`, neither accepted by
// `z.enum(...).optional()`. `optEnum` accepts both as "unset" and
// also tolerates an extra-cautious `false` (defensive — should not
// happen with our radios but cheap to cover).
const optEnum = (values) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === false ? undefined : v),
    z.enum(values).optional().nullable(),
  );

// 2026-05-20 — same pattern for date inputs. <input type="date" />
// sends "" when empty, which fails the YYYY-MM-DD regex even though
// the schema is .optional(). Treat "" as "no date entered."
const optDate = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
);

// 2026-05-20 — number inputs. <input type="number" /> sends ""
// when empty; z.coerce.number("") returns 0, which would write a
// junk 0 to the DB on every empty save. Treat "" as "unset."
const optNumber = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce.number().optional().nullable(),
);

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
  flight_type: optEnum(["commercial", "private"]),
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

  transfers_requested: optEnum(["yes", "no", "undecided"]),
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

  // 2026-05-22 — Industry preference sheets (BF Charter Preferences
  // Form, Yachtzoo, Northrop & Johnson) all carry a "Local Contact"
  // line at the top of section 01: the person already on the ground
  // in Greece — relative, concierge, hotel rep — that the captain
  // can reach for last-minute coordination.
  //
  // George's three-way version (his white-glove broker-in-country
  // offer is the differentiator):
  //   • principal — captain reaches the charterer directly
  //   • broker    — captain coordinates via George P. Biniaris
  //                 (he IS in Greece; this is what many charterers
  //                 will tap)
  //   • other     — name + mobile of a friend / concierge /
  //                 local family member they nominate
  //
  // Free-text fields stay optional and only matter when
  // routing === "other".
  local_contact: z
    .object({
      routing: optEnum(["principal", "broker", "other"]),
      full_name: optStringShort,
      relationship: optStringShort,
      mobile: optStringShort,
      notes: optString,
    })
    .optional(),
});

// =============================================================
// Section: Guests (high-level notes — full manifest lives in
// cabin_guests_manifest table)
// =============================================================
export const guestsSchema = z.object({
  // The single most important question — captures the spirit of the
  // week in the charterer's own words. Single textarea at the top
  // of the page so it sets the tone for everything that follows.
  charter_purpose_narrative: optString,

  // What KIND of week this is. Captain + chef + hostess all
  // calibrate around this — corporate vs honeymoon vs multi-gen
  // family is three completely different briefs even before any
  // meal-time question is answered.
  group_type: arrayOf(
    z.enum([
      "family_with_children",
      "couples_retreat",
      "friends_celebrating",
      "honeymoon",
      "multi_generational",
      "corporate_retreat",
      "solo_close_friends",
      "other",
    ]),
  ),

  // Group energy level — informs cellar provisioning + crew posture.
  energy_level: optEnum(["calm_restorative", "mixed", "very_social_late_nights"]),

  // Pets on board. Greece allows charters with dogs/cats with the
  // right paperwork; captain needs to know to plan rest stops.
  has_pet: optBoolRadio,
  pet_details: optString,

  // Quick multi-select scenarios so the crew has a head-start. None
  // are mandatory; the freeform field below covers everything else.
  group_scenarios: arrayOf(z.string().max(64)),
  group_notes: optString,   // "Anything else the crew should know…"

  // 2026-05-22 — George: photo-of-guests preference is a group-wide
  // decision (some clients, especially HNW / public-facing, prefer
  // the crew not point a phone at them at any time). We surface it
  // here in the group section rather than buried in a "little
  // things" tail page. Default = unset = crew uses their normal
  // discreet practice; only an explicit "true" tells them to put
  // the cameras away.
  no_photos_of_guests: optBoolRadio,
});

// =============================================================
// Section: Health, Allergies & Safety
// =============================================================
export const healthSchema = z.object({
  allergies_dietary: opt(z.string().max(5000)),
  medical_conditions: optString,
  medications_onboard: optString,
  swimming_experience: optEnum([
    "all_strong",
    "some_prefer_not",
    "children_supervised",
    "other",
  ]),
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
  preferred_areas: arrayOf(
    z.enum(["cyclades", "saronic", "ionian", "mixed", "undecided"]),
  ),
  specific_places: optString,
  pace: optEnum(["productive", "slow_restful", "balanced"]),
  night_preference: optEnum([
    "marinas",
    "anchorages",
    "mostly_anchor_some_marina",
    "captain_decides",
  ]),
  celebrations: optString,

  // Industry adds: per-event-type checkboxes + which extras the
  // crew should pre-stage (Flowers / Music / Board games /
  // Magazines / Banner / Cake).
  special_event_types: arrayOf(
    z.enum(["birthday", "anniversary", "honeymoon", "proposal", "other"]),
  ),
  special_event_extras: arrayOf(
    z.enum(["flowers", "music", "board_games", "magazines", "banner", "cake"]),
  ),

  // High-level character of the week — bar/cellar provisioning,
  // crew posture, itinerary aggressiveness all key off this.
  overall_experience: optEnum([
    "productive_exciting",
    "peaceful_relaxing",
    "combination",
  ]),

  // 2026-05-20 — `docking_preference` removed (was duplicated with
  // `night_preference` above per Da$k's feedback: "you ask this
  // again with slightly different wording"). The combined question
  // is `night_preference` only; keeping the field key in the
  // schema as an optional pass-through so any already-saved value
  // doesn't error out the read.
  docking_preference: optEnum(["marinas", "anchoring", "both"]),

  // Industry preference sheets list these as distinct activities
  // (yes/no per item, not multi-select chips), and the captain
  // tunes the day plan around them. Kept as multi-select for UX
  // consistency with our existing activities chips.
  activities_extra: arrayOf(
    z.enum(["cycling", "island_tour", "scuba_diving_padi", "fishing_specific"]),
  ),

  // 2026-05-20 — Pass 4 (Sarah): brief never asked who in the group
  // is already certified to dive. Conditional textarea on the
  // itinerary page; captain reads verbatim.
  diving_certifications: optString,
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
  crew_interaction: optEnum(["always_around", "balanced", "discreet"]),
  activities: arrayOf(z.enum(ACTIVITIES)),
  activities_other: optString,

  // 2026-05-22 — George's directive after the BF preference-list
  // audit: "Δεν ξέρω αν είναι δυνατό η hostess να βάζει
  // διαφορετική μουσική ανά ώρα της ημέρας — να το ρωτάμε λίγο
  // πιο γενικά τι είδους μουσική τους αρέσει, όχι να νομίζει ο
  // πελάτης ότι αυτή τη μουσική θα παίζει."
  //
  // The previous music block had four per-time-of-day fields
  // (morning / lunch_afternoon / sunset_dinner / late_night) plus
  // a specific-artists textarea. That set up expectations the
  // hostess might not be able to deliver — a "you said you wanted
  // Sinatra at sunset and you got Lo-Fi" complaint risk.
  //
  // New shape: ONE freeform field for general taste. The legacy
  // `music.*` object stays in the schema so already-submitted
  // briefs continue to validate; only this new field is collected
  // via the UI and printed on the preference sheet.
  music_taste: optString,
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

  // Wellness offerings — the captain pre-checks availability with
  // the management company. All can carry a small cost depending
  // on the yacht; the brief just flags interest.
  wellness_onboard: arrayOf(
    z.enum([
      "yoga_morning",
      "massage_onboard",
      "stargazing_nights",
      "sunrise_meditation",
      "personal_trainer",
    ]),
  ),
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
  "milk_oat",
  "milk_almond",
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
  breakfast_style: optEnum(["continental", "american", "mediterranean", "light_healthy"]),
  breakfast_styles: arrayOf(
    z.enum(["continental", "american", "british", "european", "mediterranean", "light_healthy"]),
  ),
  // Per-item yes/no checkboxes. Stored as an array of keys that the
  // chef should keep stocked. Items missing from the list aren't
  // explicitly off-limits — that's what food_matrix is for.
  breakfast_items: arrayOf(z.enum(BREAKFAST_ITEMS)),
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
  coffee_tea: arrayOf(z.enum(COFFEE_TEA_OPTIONS)),
  coffee_tea_specifics: optString,

  // Service preferences per meal. Light = grazing platters, Cold =
  // gazpacho/carpaccio etc., Hot = plated entrée. Family style =
  // serve in the centre, not individually plated.
  lunch_service: optEnum(["light", "cold", "hot", "family_style"]),
  dinner_service: optEnum(["light", "cold", "hot", "family_style"]),

  // The food matrix is the heart of provisioning — the chef
  // shouldn't have to read free text to know "fish: yes, lamb: no."
  food_matrix: foodMatrixSchema,

  // Legacy multi-selects retained for back-compat with submitted
  // briefs. New UI prefers food_matrix above; the captain's print
  // shows both if both are populated.
  food_loves: arrayOf(z.enum(FOOD_CATEGORIES)),
  food_avoid: arrayOf(z.enum(FOOD_CATEGORIES)),

  // Dessert
  dessert_styles: arrayOf(
    z.enum(["pastries", "fruits", "ice_cream", "greek_traditional", "cakes", "no_dessert"]),
  ),
  dessert_specifics: optString,

  // Snacks between meals
  snacks_yes_no: optEnum(["yes", "no", "occasional"]),
  snacks_details: optString,

  // Afternoon tea
  afternoon_tea_yes_no: optEnum(["yes", "no", "occasional"]),
  afternoon_tea_details: optString,

  // 2026-05-20 — `dining_ashore_evenings` kept on the schema for
  // back-compat with existing briefs, but the field is no longer
  // surfaced in the UI (Da$k friend-test: the explicit-count UI
  // read as "πιεστικό, γύφτικο" — like the broker was counting
  // food to save money). Captain still asks ashore-dining intent
  // verbally on day one.
  dining_ashore_evenings: optEnum(["0", "1", "2", "3", "4_plus"]),
  dining_ashore_notes: optString,

  // Kids meals (industry sheets have a dedicated kids' food block)
  kids_meal_arrangement: optEnum(["with_adults", "separate", "mixed"]),
  kids_meal_specifics: optString,
  // optBoolRadio handles the "true"/"false" string ↔ boolean
  // coercion the same way `has_pet` does; single checkboxes send
  // through register("name") as boolean cleanly but defensive
  // wrapping costs nothing.
  kids_needs_baby_cot: optBoolRadio,
  kids_needs_high_chair: optBoolRadio,
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
  water: arrayOf(z.enum(["still", "sparkling"])),
  water_type: arrayOf(z.enum(["mineral", "sparkling", "spring"])),
  water_brand: optStringShort,
  // Per-day per-person estimate ("2-3 waters per day per person")
  // so the captain can compute total provisioning.
  water_consumption_estimate: optStringShort,

  // "Standard bar — classics included" pre-checked boxes. We keep
  // values open so we can add more categories without a migration.
  standard_bar_items: arrayOf(z.string().max(64)),

  // Specific labels — free text (legacy field, kept).
  specific_preferences: optString,

  // ─── Provisioning tables ───────────────────────────────────
  // 2026-05-20 — Da$k friend-test: "Αυτό δεν μπορεί να το
  // υπολογίσει ο άλλος... τα σκάφη έχουν φουλ bar, η Hostess
  // υπολογίζει". The exact-quantity tables for soft drinks /
  // spirits / beers read as broker counting drinks for budget
  // reasons. Schema fields kept for back-compat with already-
  // submitted briefs; the UI is being simplified to "we drink
  // Coca-Cola, lots of water" free-text per section instead of
  // forcing label/qty rows.
  soft_drinks: opt(z.array(labelQtySchema).max(40)),

  // Wines / Champagne
  wine_style: optEnum(["surprise_greek", "house_red_white", "specific_only", "combination"]),
  wine_greek_vineyards: optEnum(["yes", "no", "open_to"]),
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

  // 2026-05-20 — Replaces the six per-spirit and two per-beer label
  // /qty tables with two freeform fields (see UI in beverages/page.jsx
  // for the friend-test rationale). The label/qty schema fields above
  // stay defined so already-submitted briefs continue to validate; new
  // briefs will populate the freeform fields below instead.
  spirits_notes: optString,
  beers_notes: optString,

  // Cocktails kept as free text (legacy). Mocktails added — most
  // groups with kids ask for them.
  cocktails: optString,
  mocktails: optString,

  // ─── 2026-05-20 friend-test pass 3: frequency-based capture ───
  // George's mandate: drop literal quantities, capture
  // category presence + frequency per item, plus a free-text brand
  // preference per category. The hostess provisions from "we drink
  // gin often, vodka rarely" — exact numbers are her job, not the
  // charterer's. New shape is *additive* to the old keys above so
  // already-submitted briefs keep validating.
  champagne_wanted: optEnum(["yes", "no", "leave_to_captain"]),
  champagne_tier: optEnum(["premium", "standard", "classic", "leave_to_captain"]),
  champagne_specifics: optString,

  wine_wanted: optEnum(["yes", "no", "leave_to_captain"]),
  wine_colors: arrayOf(z.enum(["red", "white", "rose", "orange"])),
  wine_grapes: optString,
  wine_tier: optEnum(["premium", "standard", "classic", "leave_to_captain"]),
  wine_specifics: optString,

  // Frequency-keyed object. Keys are stable slugs (whisky, gin,
  // vodka, rum, tequila, liqueurs) → "often" | "sometimes" |
  // "rarely" | "skip". Open shape so we can add categories without
  // a schema bump.
  spirits_frequency: opt(z.record(z.enum(["often", "sometimes", "rarely", "skip"]))),
  spirits_brands: optString,

  beers_frequency: optEnum(["often", "sometimes", "rarely", "skip"]),
  beers_origin: optEnum(["international", "greek", "both", "leave_to_captain"]),
  beers_specifics: optString,

  soft_drinks_frequency: opt(z.record(z.enum(["often", "sometimes", "rarely", "skip"]))),
  soft_drinks_brands: optString,
});

// =============================================================
// Section: Little Things  (Section 12)
// =============================================================
export const littleThingsSchema = z.object({
  surprises_celebrations: optString,
  things_to_avoid: optString,
  connectivity: optEnum([
    "strong_internet",
    "fine_not_priority",
    "no_photos_of_guests",
  ]),
  connectivity_notes: optString,
  // GDPR-clean record of consent for our archive use of photos.
  // We never use without explicit yes.
  photo_archive_permission: optEnum([
    "yes_archive_ok",
    "yes_no_faces",
    "no_only_for_us",
  ]),
  anything_else: optString,

  // Night service — items the hostess places in each cabin between
  // 6 and 9pm. Per industry sheets, this is a discrete checklist
  // (not free text) so the hostess can run it from the printed sheet.
  night_service: arrayOf(
    z.enum(["water_bottles", "chocolates", "bedtime_books", "fresh_fruit", "herbal_tea"]),
  ),

  // Photography on board. Drone laws vary by Greek island so the
  // captain pre-checks the route; a hired photographer is usually
  // a paid extra arranged with the management company.
  drone_photography: optEnum(["yes_please", "already_bringing", "no_thanks"]),
  professional_photographer: optEnum([
    "yes_please",
    "already_arranging",
    "no_thanks",
  ]),
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
  sleeps_with_parent: optEnum(["yes", "no"]),
  bedtime_preference: optStringShort,
});

export const childrenSchema = z.object({
  children: opt(z.array(childSchema).max(6)),
  equipment: arrayOf(
    z.enum([
      "baby_cot",
      "high_chair",
      "kids_life_jackets",
      "pool_toys",
      "bedtime_books",
      "baby_food",
      "other",
    ]),
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
