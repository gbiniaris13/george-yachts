"use client";

// /cabin/brief/dining — At the Table.
// Industry-grade preference capture: per-item Like/Dislike/Indifferent
// matrix for proteins + sides, granular breakfast checklist with
// "kind of cereal / cheese / jam" specifics, coffee/tea matrix,
// service preferences per meal (light/cold/hot/family style),
// dessert/snacks/afternoon-tea sections, kids' meal arrangement
// with baby cot + high chair + baby food specifics. This is what
// the chef and provisioning team print and shop from.

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
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

      <BriefFormShell
        sectionKey="dining"
        prevSection={{ key: "life_aboard", title: "Life Aboard" }}
        nextSection={{ key: "beverages", title: "In the Cellar" }}
      >
        {({ register }) => (
          <>
            {/* ─────────── Meal times ─────────── */}
            <h2 className="brief-subhead">When do you like to eat?</h2>
            <div className="brief-grid-3">
              <TextField label="Breakfast typically" name="breakfast_time" placeholder="e.g. 9:00" register={register} />
              <TextField label="Lunch typically" name="lunch_time" placeholder="e.g. 14:00" register={register} />
              <TextField label="Dinner typically" name="dinner_time" placeholder="e.g. 20:30" register={register} />
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

            <CheckboxGroup
              name="breakfast_items"
              label="Items to have available"
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
                { value: "instant_coffee",  label: "Instant coffee" },
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
            <p className="brief-note">
              <em>
                The chef provisions and plans around this. Mark each as Like,
                Dislike, or Indifferent — whatever you don&apos;t mark stays neutral.
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
            <h2 className="brief-subhead">Dining ashore</h2>
            <RadioGroup
              name="dining_ashore_evenings"
              label="Evenings ashore (approximate)"
              hint="The crew adjusts provisioning to avoid food waste."
              register={register}
              options={[
                { value: "0", label: "0" },
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4_plus", label: "4 or more" },
              ]}
            />
            <OpenTextarea
              label="Restaurant style or specific places"
              name="dining_ashore_notes"
              register={register}
              rows={2}
            />

            {/* ─────────── Kids ─────────── */}
            <h2 className="brief-subhead">Children (if any)</h2>
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
            <OpenTextarea
              label="Baby food / formula specifics"
              name="kids_baby_food_specifics"
              register={register}
              rows={2}
              placeholder="e.g. HiPP Stage 2 in jars, formula brand X 800g cans, organic purées"
            />

            <OpenTextarea
              label="Children at the table — anything more"
              name="children_at_table"
              register={register}
              rows={2}
            />

            <OpenTextarea
              label="A note to the chef"
              hint="Favourite dishes from past travels, a meal you've always wanted to try in Greece, surprises you'd welcome."
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
