"use client";

// app/components/cabin/brief/DiningFields.jsx
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3).
//
// The body of the "At the Table" form fields, extracted from the
// principal-only /cabin/brief/dining page so it can be reused by
// the guest-contribution page at /cabin/me/at-the-table.
//
// Pure render function: takes `register` (RHF) + `hasMinors`
// (server-fetched boolean for the kids block) and returns the
// field tree. The wrapping <BriefFormShell> + page header +
// AllergyAlert + SampleMenuPreview live in the caller so the
// principal route and the guest-contribution route can frame the
// fields differently while sharing the SAME field set, the SAME
// validation, and the SAME save semantics.
//
// Field-order, copy, hints, options — all preserved verbatim
// from the original dining/page.jsx so no chef brief loses
// fidelity in the move.
// =============================================================

import {
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
  LikeDislikeMatrix,
} from "./FormFields";

// 2026-05-24 — Christos pass (item 3): service preferences (lunch
// + dinner service style) came back as a PRINCIPAL-ONLY block at
// the bottom. George's logic stands — "αν πούνε πέντε διαφορετικά
// τι θα κάνει το crew" — so guests never see or change it. The
// principal sees the block in their /cabin/brief/dining view and
// chooses one tone per meal that the whole table follows.
//
// isPrincipal=true → renders the service-style RadioGroups.
// isPrincipal=false (default) → block is omitted entirely so
// guests never even see that the field exists.

const FOOD_MATRIX_ITEMS = [
  { value: "fish",        label: "Fish" },
  { value: "shellfish",   label: "Shellfish" },
  { value: "beef",        label: "Beef" },
  { value: "pork",        label: "Pork" },
  { value: "lamb",        label: "Lamb" },
  { value: "veal",        label: "Veal" },
  { value: "chicken",     label: "Chicken" },
  { value: "turkey",      label: "Turkey" },
  { value: "greek_meze",  label: "Greek meze" },
  { value: "pasta",       label: "Pasta" },
  { value: "rice",        label: "Rice" },
  { value: "vegetables",  label: "Vegetables" },
  { value: "salad",       label: "Salad" },
];

export default function DiningFields({
  register,
  hasMinors,
  isPrincipal = false,
  // 2026-05-25 — Phase 5: server-loaded initial data. For
  // non-principals we lock checkbox values already ticked by
  // other members so a stray un-tick can't even appear to
  // succeed (Angeliki: "if I un-tick fruits, the server keeps
  // them via mergeForGuest, refresh re-shows them → confusing").
  // Defaults to {} when the form hasn't loaded yet — empty means
  // nothing locked, all options interactive.
  initialData = {},
}) {
  // Helper: array of values pre-ticked by the group for this
  // field. Principal sees nothing locked (they own /review).
  const lockedArray = (name) => {
    if (isPrincipal) return [];
    const v = initialData[name];
    return Array.isArray(v) ? v : [];
  };
  // 2026-05-25 — Phase 5 closeout: same idea, applied across
  // every field type — free-text (TextField, OpenTextarea),
  // single-select (RadioGroup), and the food_matrix object
  // (per-key locks). For guests, any value already loaded from
  // the server is locked so the merge keep-existing semantics
  // can't silently swallow a guest's edit.
  const lockedText = (name) => {
    if (isPrincipal) return false;
    const v = initialData[name];
    return typeof v === "string" && v.trim().length > 0;
  };
  const lockedRadio = (name) => {
    if (isPrincipal) return null;
    const v = initialData[name];
    return typeof v === "string" && v.trim().length > 0 ? v : null;
  };
  const lockedMatrix = (name) => {
    if (isPrincipal) return {};
    const v = initialData[name];
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  };
  return (
    <>
      {/* 2026-05-24 — Angeliki pass: meal TIMES are now principal-
          only. Angeliki: "δεν μπορεί ο καθένας να λέει ότι θα τρώει
          διαφορετικές ώρες, ο σεφ δεν θα μπορεί να το υπολογίσει."
          One eat-schedule per table — set by the principal, shown
          to guests as read-only. The rest of dining (food matrix,
          breakfast styles, snacks, etc.) stays shared, so the
          group's preferences still feed the chef collectively. */}
      <h2 className="brief-subhead" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span>When do you like to eat?</span>
        {isPrincipal && (
          <span
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 9.5,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--gy-gold)",
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.45)",
              padding: "3px 8px",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Principal only
          </span>
        )}
      </h2>
      <p className="brief-note">
        <em>
          {isPrincipal ? (
            <>Either format is fine — write &quot;9am&quot; or &quot;09:00&quot;, whichever feels natural. The whole table follows these times so the chef can plan one rhythm for the week.</>
          ) : (
            <>One eating rhythm per table — the principal sets the meal times so the chef can plan a single coherent service. If anything below needs changing, ask the principal directly.</>
          )}
        </em>
      </p>
      {isPrincipal ? (
        <div className="brief-grid-3">
          <TextField label="Breakfast typically" name="breakfast_time" placeholder="e.g. 9am or 09:00" register={register} />
          <TextField label="Lunch typically" name="lunch_time" placeholder="e.g. 2pm or 14:00" register={register} />
          <TextField label="Dinner typically" name="dinner_time" placeholder="e.g. 8:30pm or 20:30" register={register} />
        </div>
      ) : (
        <fieldset
          disabled
          style={{ border: 0, padding: 0, margin: 0, opacity: 0.78 }}
          aria-label="Meal times — read-only (principal only)"
        >
          <div className="brief-grid-3">
            <TextField label="Breakfast typically" name="breakfast_time" placeholder="—" register={register} />
            <TextField label="Lunch typically" name="lunch_time" placeholder="—" register={register} />
            <TextField label="Dinner typically" name="dinner_time" placeholder="—" register={register} />
          </div>
        </fieldset>
      )}

      <h2 className="brief-subhead">Breakfast</h2>
      <CheckboxGroup
        name="breakfast_styles"
        lockedValues={lockedArray("breakfast_styles")}
        label="Style (tick any that apply)"
        register={register}
        twoColumn
        options={[
          { value: "continental",    label: "Continental — pastries, bread, jams, butter" },
          { value: "american",       label: "American — pancakes, bacon, sausages, eggs" },
          { value: "british",        label: "British — eggs, beans, bacon, porridge" },
          { value: "european",       label: "European — cold meats, cheese, yoghurt, fruit" },
          { value: "mediterranean",  label: "Mediterranean — Greek yoghurt, honey, olives, tomato" },
          { value: "light_healthy",  label: "Light & healthy — fruit, granola, smoothies" },
        ]}
      />
      {/* 2026-05-24 — Christos pass: free-text "other" after each
          multiple-choice food subsection. We may not have included
          your style on the list. */}
      <OpenTextarea
        label="Other breakfast styles or special requests"
        name="breakfast_styles_other"
        lockedByGroup={lockedText("breakfast_styles_other")}
        register={register}
        rows={2}
        placeholder="e.g. Açai bowls, Israeli shakshuka, Japanese rice & miso, anything we missed"
      />

      <CheckboxGroup
        name="breakfast_items"
        lockedValues={lockedArray("breakfast_items")}
        label="Items to have available"
        hint="If you don't tick anything in a row, the chef carries the boat's normal stock for that item."
        register={register}
        twoColumn
        options={[
          { value: "poached_eggs",    label: "Poached eggs" },
          { value: "fried_eggs",      label: "Fried eggs" },
          { value: "omelet",          label: "Omelet" },
          { value: "scrambled_eggs",  label: "Scrambled eggs" },
          { value: "boiled_eggs",     label: "Boiled eggs" },
          { value: "bacon",           label: "Bacon" },
          { value: "sausages",        label: "Sausages" },
          { value: "pancakes",        label: "Pancakes" },
          { value: "toast",           label: "Toast" },
          { value: "cheese",          label: "Cheese" },
          { value: "cream_cheese",    label: "Cream cheese" },
          { value: "milk_low_fat",    label: "Milk — low fat" },
          { value: "milk_full_fat",   label: "Milk — full fat" },
          { value: "milk_oat",        label: "Oat milk" },
          { value: "milk_almond",     label: "Almond milk" },
          { value: "yogurt_low_fat",  label: "Yoghurt — low fat" },
          { value: "yogurt_full_fat", label: "Yoghurt — full fat" },
          { value: "honey",           label: "Honey" },
          { value: "cereal",          label: "Cereal" },
          { value: "jam",             label: "Jam" },
          { value: "seasonal_fruits", label: "Seasonal fruits" },
        ]}
      />

      <h3 className="brief-subhead-sm">Specifics (kinds & brands)</h3>
      <div className="brief-grid-2">
        <TextField label="Cheese kind"  name="breakfast_cheese_kind"  lockedByGroup={lockedText("breakfast_cheese_kind")} placeholder="e.g. Feta, Graviera, brie" register={register} />
        <TextField label="Cereal kind"  name="breakfast_cereal_kind"  lockedByGroup={lockedText("breakfast_cereal_kind")} placeholder="e.g. Granola, raisin bran" register={register} />
        <TextField label="Jam kind"     name="breakfast_jam_kind"     lockedByGroup={lockedText("breakfast_jam_kind")} placeholder="e.g. Strawberry, fig, marmalade" register={register} />
        <TextField label="Tea kind"     name="breakfast_tea_kind"     lockedByGroup={lockedText("breakfast_tea_kind")} placeholder="e.g. English breakfast, green, herbal" register={register} />
        <TextField label="Juice kind"   name="breakfast_juice_kind"   lockedByGroup={lockedText("breakfast_juice_kind")} placeholder="e.g. Fresh OJ, apple, multivitamin" register={register} />
      </div>
      <OpenTextarea
        label="Anything else for breakfast"
        name="breakfast_specifics"
        lockedByGroup={lockedText("breakfast_specifics")}
        register={register}
        rows={2}
        placeholder="e.g. Açai bowls, smoked salmon on Sundays, vegan options for one guest"
      />

      <h2 className="brief-subhead">Coffee, tea & cold drinks</h2>
      <CheckboxGroup
        name="coffee_tea"
        lockedValues={lockedArray("coffee_tea")}
        label="Tick any that apply"
        register={register}
        twoColumn
        options={[
          { value: "espresso",        label: "Espresso" },
          { value: "cappuccino",      label: "Cappuccino" },
          { value: "cafe_latte",      label: "Café latte" },
          { value: "iced_latte",      label: "Iced latte" },
          { value: "americano",       label: "Americano" },
          { value: "filtered_coffee", label: "Filtered coffee" },
          { value: "greek_coffee",    label: "Greek coffee" },
          { value: "milk_shake",      label: "Milk shake" },
          { value: "cold_chocolate",  label: "Cold chocolate" },
          { value: "hot_chocolate",   label: "Hot chocolate" },
          { value: "tea",             label: "Tea (kind in specifics)" },
          { value: "juice",           label: "Juice (kind in specifics)" },
        ]}
      />
      <OpenTextarea
        label="Other coffees, teas, or specific drink requests"
        name="coffee_tea_other"
        lockedByGroup={lockedText("coffee_tea_other")}
        register={register}
        rows={2}
        placeholder="e.g. matcha latte, chai, specific tea brand, oat-milk flat white"
      />

      {/* 2026-05-24 — Christos pass (item 3): service-style block
          re-introduced as PRINCIPAL-ONLY. George wanted it gone
          from the shared form ("αν πούνε πέντε διαφορετικά τι θα
          κάνει το crew") but kept in the principal's view so ONE
          voice picks the tone of the table. Hidden entirely for
          guests; their copy of /cabin/brief/dining doesn't even
          render this section. */}
      {isPrincipal && (
        <>
          <h2
            className="brief-subhead"
            style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
          >
            <span>Service preferences</span>
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9.5,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--gy-gold)",
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.45)",
                padding: "3px 8px",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Principal only
            </span>
          </h2>
          <p className="brief-note">
            <em>
              One tone per meal — the whole table follows. Only you
              see and answer this block; your group is spared the
              choice so the crew gets a single, clear signal.
            </em>
          </p>
          <RadioGroup
            name="lunch_service"
            label="Lunch service style"
            register={register}
            options={[
              { value: "light",        label: "Light — salads, mezze, something easy after a swim" },
              { value: "cold",         label: "Cold — platters, charcuterie, marinated dishes" },
              { value: "hot",          label: "Hot — proper cooked plates" },
              { value: "family_style", label: "Family style — shared bowls down the centre" },
            ]}
          />
          <RadioGroup
            name="dinner_service"
            label="Dinner service style"
            register={register}
            options={[
              { value: "light",        label: "Light — keep it simple, especially after a long day" },
              { value: "cold",         label: "Cold — refined platters in the cockpit" },
              { value: "hot",          label: "Hot — courses brought to the table" },
              { value: "family_style", label: "Family style — shared bowls, everyone serves themselves" },
            ]}
          />
        </>
      )}

      <h2 className="brief-subhead">Lunch & dinner — what your group enjoys</h2>
      <p className="brief-note">
        <em>
          The chef provisions and plans around this. Three signals
          per item: <strong>Like</strong> (please feature it),
          {" "}<strong>Dislike</strong> (please skip it), and
          {" "}<strong>Indifferent</strong> (we eat it, doesn&apos;t
          need to be central). Unmarked rows mean &quot;chef&apos;s
          judgement&quot; — neither a yes nor a no.
          {" "}<strong>Allergies and intolerances always override
          Like</strong>: anything flagged on Health & Safety or on
          a guest&apos;s personal page is never served to that
          person, even if the group&apos;s matrix says Like.
        </em>
      </p>
      <LikeDislikeMatrix
        name="food_matrix"
        lockedKeys={lockedMatrix("food_matrix")}
        items={FOOD_MATRIX_ITEMS}
        register={register}
      />

      <h2 className="brief-subhead">Dessert</h2>
      <CheckboxGroup
        name="dessert_styles"
        lockedValues={lockedArray("dessert_styles")}
        label="Styles you enjoy"
        register={register}
        twoColumn
        options={[
          { value: "pastries",          label: "Pastries" },
          { value: "fruits",            label: "Fresh fruits" },
          { value: "ice_cream",         label: "Ice cream" },
          { value: "greek_traditional", label: "Greek traditional (galaktoboureko, baklava)" },
          { value: "cakes",             label: "Cakes" },
          { value: "no_dessert",        label: "Generally we skip dessert" },
        ]}
      />
      <OpenTextarea
        label="Special dessert requests"
        name="dessert_specifics"
        lockedByGroup={lockedText("dessert_specifics")}
        register={register}
        rows={2}
        placeholder="e.g. Custom birthday cake for the 19th, chocolate soufflé, fruit platters daily"
      />

      <h2 className="brief-subhead">Snacks between meals</h2>
      <RadioGroup
        name="snacks_yes_no"
        lockedValue={lockedRadio("snacks_yes_no")}
        label=""
        register={register}
        options={[
          { value: "yes",        label: "Yes, always have snacks available" },
          { value: "occasional", label: "Occasionally, depending on the day" },
          { value: "no",         label: "No, just the main meals" },
        ]}
      />
      <OpenTextarea
        label="What kind of snacks"
        name="snacks_details"
        lockedByGroup={lockedText("snacks_details")}
        register={register}
        rows={2}
        placeholder="e.g. Cured meats & cheeses, fruits, salami, parmigiano, crackers, breads"
      />

      <h2 className="brief-subhead">Afternoon tea</h2>
      <RadioGroup
        name="afternoon_tea_yes_no"
        lockedValue={lockedRadio("afternoon_tea_yes_no")}
        label=""
        register={register}
        options={[
          { value: "yes",        label: "Yes please" },
          { value: "occasional", label: "Occasionally" },
          { value: "no",         label: "No, thank you" },
        ]}
      />
      <OpenTextarea
        label="Tea details"
        name="afternoon_tea_details"
        lockedByGroup={lockedText("afternoon_tea_details")}
        register={register}
        rows={2}
        placeholder="e.g. Earl Grey with scones and clotted cream around 17:00"
      />

      <h2 className="brief-subhead">Dining ashore</h2>
      <OpenTextarea
        label="Restaurants or places you'd like to try"
        hint="Anywhere you've heard of, anywhere you've loved before, or any vibe (waterfront tavernas / a Michelin night / quiet local spot). The captain knows the islands and will fold them in. Leave blank if you'd rather decide week-of."
        name="dining_ashore_notes"
        lockedByGroup={lockedText("dining_ashore_notes")}
        register={register}
        placeholder="e.g. We've heard about Spondi in Athens before embarkation, and we'd love at least one quiet taverna night in the Cyclades — the kind with grandma in the kitchen."
        rows={4}
      />

      {hasMinors === true && (
        <>
          <h2 className="brief-subhead">For your children</h2>
          <p className="brief-note">
            <em>
              These few fields appear because your group includes a
              child or infant. They&apos;re entirely optional — the
              chef will quietly check in with you on day one in any
              case.
            </em>
          </p>
          <RadioGroup
            name="kids_meal_arrangement"
            lockedValue={lockedRadio("kids_meal_arrangement")}
            label="When do the children eat?"
            register={register}
            options={[
              { value: "with_adults", label: "With the adults" },
              { value: "separate",    label: "Separately, earlier" },
              { value: "mixed",       label: "A mix — depends on the day" },
            ]}
          />
          <OpenTextarea
            label="What the children love"
            name="kids_meal_specifics"
            lockedByGroup={lockedText("kids_meal_specifics")}
            register={register}
            rows={2}
            placeholder="e.g. Pasta & butter, grilled cheese, tomato soup, chicken nuggets, fries"
          />
          <div className="brief-grid-2">
            <label className="brief-toggle">
              <input type="checkbox" {...register("kids_needs_baby_cot")} />
              <span>Baby cot needed</span>
            </label>
            <label className="brief-toggle">
              <input type="checkbox" {...register("kids_needs_high_chair")} />
              <span>High chair needed</span>
            </label>
          </div>
          <OpenTextarea
            label="Baby food / formula"
            name="kids_baby_food_specifics"
            lockedByGroup={lockedText("kids_baby_food_specifics")}
            register={register}
            rows={2}
            placeholder="e.g. The brand of formula we use, any baby food jars or pouches we'd like stocked"
          />
        </>
      )}

      <OpenTextarea
        label="A note to the chef"
        hint="Favourite dishes from past travels, a meal you've always wanted to try in Greece, surprises you would welcome."
        name="chef_open_note"
        lockedByGroup={lockedText("chef_open_note")}
        register={register}
        rows={4}
      />
    </>
  );
}
