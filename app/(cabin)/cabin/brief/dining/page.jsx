"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  CardChoice,
  CheckboxGroup,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

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
        designed. Don’t worry about being too specific. We would rather know
        too much than too little.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="dining"
        prevSection={{ key: "life_aboard", title: "Life Aboard" }}
        nextSection={{ key: "beverages", title: "In the Cellar" }}
      >
        {({ register }) => (
          <>
            <h2 className="brief-subhead">When do you like to eat?</h2>
            <div className="brief-grid">
              <TextField label="Breakfast typically" name="breakfast_time" placeholder="e.g. 9:00" register={register} />
              <TextField label="Lunch typically" name="lunch_time" placeholder="e.g. 14:00" register={register} />
              <TextField label="Dinner typically" name="dinner_time" placeholder="e.g. 20:30" register={register} />
            </div>

            <h2 className="brief-subhead">Breakfast style</h2>
            <CardChoice
              name="breakfast_style"
              register={register}
              options={[
                { value: "continental", label: "Continental", description: "Pastries, breads, jams, fruit." },
                { value: "american", label: "American", description: "Eggs, pancakes, bacon, sausages." },
                { value: "mediterranean", label: "Mediterranean", description: "Greek yoghurt, honey, cheese, olives, tomato." },
                { value: "light_healthy", label: "Light & healthy", description: "Fruit, smoothies, granola, eggs to order." },
              ]}
            />
            <OpenTextarea
              label="Your own version, or specifics"
              name="breakfast_specifics"
              register={register}
              rows={2}
            />

            <CheckboxGroup
              name="coffee_tea"
              label="How do you like your coffee & tea?"
              hint="We’re Greek — coffee matters to us. Tell us how you like it."
              register={register}
              twoColumn
              options={[
                { value: "espresso", label: "Espresso" },
                { value: "cappuccino", label: "Cappuccino" },
                { value: "filter", label: "Filter coffee" },
                { value: "greek", label: "Greek coffee" },
                { value: "iced", label: "Iced coffee" },
                { value: "black_tea", label: "Black tea" },
                { value: "green_tea", label: "Green tea" },
                { value: "herbal", label: "Herbal tea" },
                { value: "hot_choco", label: "Hot chocolate" },
              ]}
            />
            <OpenTextarea
              label="Brand preferences or specific orders"
              name="coffee_tea_specifics"
              register={register}
              rows={2}
            />

            <h2 className="brief-subhead">Lunch & dinner — what your group enjoys</h2>
            <p className="brief-note">
              <em>Tick what your group loves, and what to avoid. Your chef will design around these.</em>
            </p>
            <CheckboxGroup
              name="food_loves"
              label="Loves"
              register={register}
              twoColumn
              options={[
                { value: "fish_seafood", label: "Fish & seafood" },
                { value: "shellfish", label: "Shellfish" },
                { value: "beef_veal", label: "Beef & veal" },
                { value: "lamb", label: "Lamb" },
                { value: "pork", label: "Pork" },
                { value: "chicken_poultry", label: "Chicken & poultry" },
                { value: "pasta_risotto", label: "Pasta & risotto" },
                { value: "rice_dishes", label: "Rice dishes" },
                { value: "vegetables_salads", label: "Vegetables & salads" },
                { value: "greek_meze", label: "Greek meze" },
                { value: "asian_flavors", label: "Asian flavours" },
                { value: "spicy_food", label: "Spicy food" },
                { value: "raw_prep", label: "Raw (sushi, carpaccio)" },
              ]}
            />
            <CheckboxGroup
              name="food_avoid"
              label="Avoid"
              register={register}
              twoColumn
              options={[
                { value: "fish_seafood", label: "Fish & seafood" },
                { value: "shellfish", label: "Shellfish" },
                { value: "beef_veal", label: "Beef & veal" },
                { value: "lamb", label: "Lamb" },
                { value: "pork", label: "Pork" },
                { value: "chicken_poultry", label: "Chicken & poultry" },
                { value: "pasta_risotto", label: "Pasta & risotto" },
                { value: "rice_dishes", label: "Rice dishes" },
                { value: "vegetables_salads", label: "Vegetables & salads" },
                { value: "greek_meze", label: "Greek meze" },
                { value: "asian_flavors", label: "Asian flavours" },
                { value: "spicy_food", label: "Spicy food" },
                { value: "raw_prep", label: "Raw (sushi, carpaccio)" },
              ]}
            />

            <RadioGroup
              name="dining_ashore_evenings"
              label="Evenings ashore (approximate)"
              hint="Greek islands offer extraordinary tavernas and modern restaurants. The crew can recommend and reserve."
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
              label="Any restaurant style or specific places you’ve heard of"
              name="dining_ashore_notes"
              register={register}
              rows={2}
            />

            <OpenTextarea
              label="Children at the table"
              hint="If little ones are sailing, tell us what they love. Plain pasta, fish fingers, grilled cheese — whatever makes them happy. Different meal times if applicable."
              name="children_at_table"
              register={register}
              rows={3}
            />

            <OpenTextarea
              label="A note to the chef"
              hint="Favourite dishes from past travels, a meal you’ve always wanted to try in Greece, surprises you’d welcome."
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
          font-size: 11px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 28px 0 10px 0;
          font-weight: 500;
        }
        .brief-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid { grid-template-columns: 1fr 1fr 1fr; gap: 0 24px; }
        }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0 0 14px 0;
        }
      `}</style>
    </article>
  );
}
