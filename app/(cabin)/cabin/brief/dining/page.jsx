"use client";

// /cabin/brief/dining — At the Table.
// Industry-grade preference capture: per-item Like/Dislike/Indifferent
// matrix for proteins + sides, granular breakfast checklist with
// "kind of cereal / cheese / jam" specifics, coffee/tea matrix,
// service preferences per meal (light/cold/hot/family style),
// dessert/snacks/afternoon-tea sections, kids' meal arrangement
// with baby cot + high chair + baby food specifics. This is what
// the chef and provisioning team print and shop from.

import { useEffect, useState } from "react";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
import SampleMenuPreview from "../../../../components/cabin/brief/SampleMenuPreview";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
  LikeDislikeMatrix,
} from "../../../../components/cabin/brief/FormFields";

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

export default function DiningSectionPage() {
  // 2026-05-21 — Pass 7 prep (Domingo): the Children block below
  // was rendered unconditionally. It's now gated on a server signal
  // sourced from cabin_guests_manifest. Sailing with no minors →
  // no kids subheading, no cot/high-chair toggles, no baby-food
  // prompt. With minors → the block surfaces with a soft intro so
  // it doesn't appear out of nowhere.
  const [hasMinors, setHasMinors] = useState(null); // null = unknown
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/has-minors")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.ok) setHasMinors(Boolean(j.hasMinors));
        else setHasMinors(false);
      })
      .catch(() => {
        if (!cancelled) setHasMinors(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article>
      <SectionTitle
        kicker="Section Six · At the Table"
        title="At the"
        italic="table."
      />
      <IntroParagraph>
        Your chef builds every menu from scratch — there is no fixed list of
        dishes. The more you share, the more thoughtfully your meals can be
        designed. Don&apos;t worry about being too specific. We would rather know
        too much than too little.
      </IntroParagraph>

      {/* 2026-05-20 — Da$k friend-test asked for an allergy banner
          on every food-related page, prominently. AllergyAlert mounts
          at top of dining, beverages, and children sections so the
          context follows wherever a chef/hostess will be reading. */}
      <AllergyAlert />

      {/* 2026-05-20 — Friend-test pass 3 (George): "I upload the
          sample menu in GY Command. The charterer should see what
          the chef proposes BEFORE ticking preferences — otherwise
          they're filling in a vacuum." Component fetches the active
          cabin's sample_menu and renders a collapsed preview at the
          top of the dining page. Quietly renders nothing if no menu
          has been uploaded yet. */}
      <SampleMenuPreview />

      <BriefFormShell
        sectionKey="dining"
        prevSection={{ key: "life_aboard", title: "Life Aboard" }}
        nextSection={{ key: "beverages", title: "In the Cellar" }}
      >
        {({ register }) => (
          <>
            {/* ─────────── Meal times ─────────── */}
            {/* 2026-05-20 — Friend-test pass 3: times read for both
                American (AM/PM) and European (24h) charterers. We
                accept either format as free text — the captain reads
                "2pm" and "14:00" identically. Placeholder + hint show
                both so neither audience feels asked the wrong thing. */}
            <h2 className="brief-subhead">When do you like to eat?</h2>
            <p className="brief-note">
              <em>
                Either format is fine — write &quot;9am&quot; or &quot;09:00&quot;,
                whichever feels natural.
              </em>
            </p>
            <div className="brief-grid-3">
              <TextField label="Breakfast typically" name="breakfast_time" placeholder="e.g. 9am or 09:00" register={register} />
              <TextField label="Lunch typically" name="lunch_time" placeholder="e.g. 2pm or 14:00" register={register} />
              <TextField label="Dinner typically" name="dinner_time" placeholder="e.g. 8:30pm or 20:30" register={register} />
            </div>

            {/* ─────────── Breakfast ─────────── */}
            <h2 className="brief-subhead">Breakfast</h2>
            <CheckboxGroup
              name="breakfast_styles"
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

            {/* 2026-05-20 — Friend-test pass 4 (Sarah):
                "Milk — low fat / Milk — full fat as separate items.
                 If I tick neither, do I get nothing? Default?"
                Added a hint: tick none = whichever the chef prefers
                (typically full fat for cooking + low fat for coffee
                 carafe). Plus oat/almond options for completeness. */}
            <CheckboxGroup
              name="breakfast_items"
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
              <TextField label="Cheese kind"  name="breakfast_cheese_kind"  placeholder="e.g. Feta, Graviera, brie" register={register} />
              <TextField label="Cereal kind"  name="breakfast_cereal_kind"  placeholder="e.g. Granola, raisin bran" register={register} />
              <TextField label="Jam kind"     name="breakfast_jam_kind"     placeholder="e.g. Strawberry, fig, marmalade" register={register} />
              <TextField label="Tea kind"     name="breakfast_tea_kind"     placeholder="e.g. English breakfast, green, herbal" register={register} />
              <TextField label="Juice kind"   name="breakfast_juice_kind"   placeholder="e.g. Fresh OJ, apple, multivitamin" register={register} />
            </div>
            <OpenTextarea
              label="Anything else for breakfast"
              name="breakfast_specifics"
              register={register}
              rows={2}
              placeholder="e.g. Açai bowls, smoked salmon on Sundays, vegan options for one guest"
            />

            {/* ─────────── Coffee & tea ─────────── */}
            <h2 className="brief-subhead">Coffee, tea & cold drinks</h2>
            <CheckboxGroup
              name="coffee_tea"
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
                /* 2026-05-20 — Pass 4 round 5 (Tyler):
                   "Instant coffee on a €40k charter. Remove it." Yep.
                   Kept the enum value in schemas.js so already-saved
                   briefs validate; just hidden from the UI. */
                { value: "milk_shake",      label: "Milk shake" },
                { value: "cold_chocolate",  label: "Cold chocolate" },
                { value: "hot_chocolate",   label: "Hot chocolate" },
                { value: "tea",             label: "Tea (kind in specifics)" },
                { value: "juice",           label: "Juice (kind in specifics)" },
              ]}
            />
            <OpenTextarea
              label="Brand preferences or specific orders"
              name="coffee_tea_specifics"
              register={register}
              rows={2}
              placeholder="e.g. Lavazza espresso, oat milk for the cappuccinos, Earl Grey tea"
            />

            {/* ─────────── Service preferences ─────────── */}
            <h2 className="brief-subhead">Service preferences</h2>
            <p className="brief-note"><em>How the chef plates your meals.</em></p>
            <RadioGroup
              name="lunch_service"
              label="Lunch"
              register={register}
              options={[
                { value: "light",        label: "Light — grazing platters, salads" },
                { value: "cold",         label: "Cold — gazpacho, carpaccio, ceviche" },
                { value: "hot",          label: "Hot — plated entrée" },
                { value: "family_style", label: "Family style — served in the centre" },
              ]}
            />
            <RadioGroup
              name="dinner_service"
              label="Dinner"
              register={register}
              options={[
                { value: "light",        label: "Light — appetisers, mezze" },
                { value: "cold",         label: "Cold — tartare, summer dishes" },
                { value: "hot",          label: "Hot — plated entrée" },
                { value: "family_style", label: "Family style — served in the centre" },
              ]}
            />

            {/* ─────────── Food matrix ─────────── */}
            <h2 className="brief-subhead">Lunch & dinner — what your group enjoys</h2>
            {/* 2026-05-20 — Friend-test pass 4 (Sarah):
                "My husband loves shellfish; my son is allergic. If I
                 check 'Dislike' my husband loses out; if I check 'Like'
                 my son might die. The Health page captures the allergy,
                 but the food matrix is the chef's working document —
                 those two sources need to be wired together visibly."
                Added a copy bridge: tick what the group EATS, not what
                the chef will SERVE blanket. Allergies from Health +
                from each guest's /cabin/me override. */}
            {/* 2026-05-20 — Pass 4 round 5 (Sarah):
                "If 'Indifferent' is functionally the same as unmarked,
                 why is Indifferent a column?" Clarified: Indifferent
                 is a positive signal ("yes we eat this, doesn't excite
                 us"); unmarked is "we haven't decided yet, chef uses
                 his judgement." Different by intent. */}
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
              items={FOOD_MATRIX_ITEMS}
              register={register}
            />

            {/* ─────────── Dessert ─────────── */}
            <h2 className="brief-subhead">Dessert</h2>
            <CheckboxGroup
              name="dessert_styles"
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
              register={register}
              rows={2}
              placeholder="e.g. Custom birthday cake for the 19th, chocolate soufflé, fruit platters daily"
            />

            {/* ─────────── Snacks ─────────── */}
            <h2 className="brief-subhead">Snacks between meals</h2>
            <RadioGroup
              name="snacks_yes_no"
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
              register={register}
              rows={2}
              placeholder="e.g. Cured meats & cheeses, fruits, salami, parmigiano, crackers, breads"
            />

            {/* ─────────── Afternoon tea ─────────── */}
            <h2 className="brief-subhead">Afternoon tea</h2>
            <RadioGroup
              name="afternoon_tea_yes_no"
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
              register={register}
              rows={2}
              placeholder="e.g. Earl Grey with scones and clotted cream around 17:00"
            />

            {/* ─────────── Dining ashore ─────────── */}
            {/* 2026-05-20 — Da$k friend-test: the explicit "0 / 1 / 2 / 3 / 4+
                evenings ashore" question read as "πιεστικό" and "γύφτικο" —
                like the broker was counting dinners to save on food. Replaced
                the radio count with an open prompt about restaurant intent.
                The captain hears the actual count by ear on day one — the
                brief just needs to know that ashore-dining is on the menu. */}
            <h2 className="brief-subhead">Dining ashore</h2>
            <OpenTextarea
              label="Restaurants or places you'd like to try"
              hint="Anywhere you've heard of, anywhere you've loved before, or any vibe (waterfront tavernas / a Michelin night / quiet local spot). The captain knows the islands and will fold them in. Leave blank if you'd rather decide week-of."
              name="dining_ashore_notes"
              register={register}
              placeholder="e.g. We've heard about Spondi in Athens before embarkation, and we'd love at least one quiet taverna night in the Cyclades — the kind with grandma in the kitchen."
              rows={4}
            />

            {/* ─────────── Kids ─────────── */}
            {/* 2026-05-21 — Pass 7 prep: only render when minors are
                on the manifest. While `hasMinors` is still loading
                (null) we keep the block hidden so the page doesn't
                visibly reshuffle once the answer arrives. */}
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
                {/* 2026-05-20 — Friend-test pass 3 (George): the
                    "HiPP Stage 2 in jars" placeholder reads as jargon
                    to anyone outside the baby-food world. Replaced
                    with a plain-English example. */}
                <OpenTextarea
                  label="Baby food / formula"
                  name="kids_baby_food_specifics"
                  register={register}
                  rows={2}
                  placeholder="e.g. The brand of formula we use, any baby food jars or pouches we'd like stocked"
                />
              </>
            )}

            {/* 2026-05-20 — Friend-test pass 3: removed the orphan
                "Children at the table — anything more" textarea. It
                sat above the chef note with no label clarity and George
                flagged it as "δεν έχει ουσία να υπάρχει εκεί". Schema
                field children_at_table kept in lib/cabin/schemas.js
                for back-compat with already-saved briefs. */}

            <OpenTextarea
              label="A note to the chef"
              hint="Favourite dishes from past travels, a meal you've always wanted to try in Greece, surprises you would welcome."
              name="chef_open_note"
              register={register}
              rows={4}
            />
          </>
        )}
      </BriefFormShell>

      <style jsx>{`
        .brief-subhead {
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 36px 0 12px 0;
          font-weight: 500;
        }
        .brief-subhead-sm {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          margin: 18px 0 10px 0;
          font-weight: 500;
        }
        .brief-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid-3 { grid-template-columns: 1fr 1fr 1fr; gap: 0 24px; }
        }
        .brief-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid-2 { grid-template-columns: 1fr 1fr; gap: 0 24px; }
        }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0 0 14px 0;
        }
        .brief-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          cursor: pointer;
        }
        .brief-toggle input { width: 18px; height: 18px; accent-color: var(--gy-gold); }
      `}</style>
    </article>
  );
}
