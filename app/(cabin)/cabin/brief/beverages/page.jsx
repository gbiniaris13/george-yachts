"use client";

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
} from "../../../../components/cabin/brief/FormFields";

export default function BeveragesSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Seven · In the Cellar"
        title="In the"
        italic="cellar."
      />
      <IntroParagraph>
        The hostess provisions the bar to your taste. Anything not consumed
        during the week is yours to take home — a glass with friends back
        home is the loveliest way to remember Greece.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="beverages"
        prevSection={{ key: "dining", title: "At the Table" }}
        nextSection={{ key: "little_things", title: "The Little Things" }}
        defaultValues={{
          standard_bar: true,
          water: ["still", "sparkling"],
        }}
      >
        {({ register }) => (
          <>
            <CheckboxGroup
              name="water"
              label="Water"
              register={register}
              twoColumn
              options={[
                { value: "still", label: "Mineral (still)" },
                { value: "sparkling", label: "Sparkling" },
              ]}
            />
            <TextField
              label="Preferred brands (optional)"
              name="water_brand"
              register={register}
            />

            <h2 className="brief-subhead">Standard bar</h2>
            <p className="brief-note">
              <em>
                The classics are stocked by default — vodka, whisky, gin,
                rum, tonic, sodas, fresh citrus, ice. Tick to keep, or
                untick if you’d like to skip a category and tell us below.
              </em>
            </p>
            <CheckboxGroup
              name="standard_bar_items"
              label=""
              register={register}
              twoColumn
              options={[
                { value: "vodka",   label: "Vodka (classic brand)" },
                { value: "whisky",  label: "Whisky (Scotch · blend)" },
                { value: "gin",     label: "Gin (London dry)" },
                { value: "rum",     label: "Rum (white & aged)" },
                { value: "tonic",   label: "Tonic & sodas" },
                { value: "citrus",  label: "Fresh citrus & garnish" },
                { value: "beer",    label: "Local & international beer" },
                { value: "champagne", label: "House champagne for arrival toast" },
              ]}
            />

            <h2 className="brief-subhead">Anything specific</h2>
            <p className="brief-note">
              <em>
                A particular bottle, a specific label or vintage, a favourite
                brand the hostess should pre-stock. Write freely — one per
                line is easiest. Leave blank to let us choose.
              </em>
            </p>
            <OpenTextarea
              label="Your specific preferences"
              hint="e.g. Belvedere vodka · Hendrick’s gin · Domaine Sigalas Assyrtiko (Santorini) · Negroni"
              name="specific_preferences"
              register={register}
              rows={5}
            />

            <RadioGroup
              name="wine_style"
              label="Wines for the table"
              hint="Greek wines have quietly become some of the most interesting in Europe — Assyrtiko, Xinomavro, old-vine reds from the islands. We’re happy to choose for you, or stock your own preferences."
              register={register}
              options={[
                { value: "surprise_greek", label: "Surprise us with Greek selections" },
                { value: "house_red_white", label: "House red & white, no fuss" },
                { value: "specific_only", label: "Only the specific labels I listed above" },
                { value: "combination", label: "A combination — some surprise, some specific" },
              ]}
            />

            <OpenTextarea
              label="Cocktails the hostess should know"
              hint="If there’s a particular cocktail your group loves, tell us how you like it prepared so the hostess has everything ready."
              name="cocktails"
              register={register}
              rows={3}
            />

            <p className="bev-extras-note">
              <strong>A small note on rare bottles.</strong> Vintage champagnes,
              high-end Bordeaux, very rare spirits — anything outside a typical
              charter bar — may carry a cost outside what’s included. We’ll
              come back with the exact figure before anything is ordered, so
              the choice is entirely yours.
            </p>
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
          margin: 32px 0 4px 0;
          font-weight: 500;
        }
        .brief-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid { grid-template-columns: 1fr 1fr; gap: 0 24px; }
        }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0 0 14px 0;
        }
        .bev-extras-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.65);
          background: rgba(201, 168, 76, 0.06);
          border-left: 1px solid var(--gy-gold);
          padding: 14px 18px;
          margin: 28px 0 0 0;
        }
        .bev-extras-note strong {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
      `}</style>
    </article>
  );
}
