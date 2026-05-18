"use client";

// /cabin/brief/beverages — In the Cellar.
// Provisioning-grade capture for what the hostess and captain
// actually buy: bottled water type & brand & per-day estimate,
// soft drinks Label×Quantity table, wines (Greek vineyards toggle,
// price range, Label×Qty×Price/bottle table), spirits per type
// (Whiskey/Vodka/Gin/Rum/Tequila/Liqueur), beers international +
// local, cocktails + mocktails.

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
  LabelQuantityRows,
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
      >
        {({ register }) => (
          <>
            {/* ─────────── Water ─────────── */}
            <h2 className="brief-subhead">Bottled water</h2>
            <CheckboxGroup
              name="water_type"
              label="Type"
              register={register}
              twoColumn
              options={[
                { value: "mineral",   label: "Mineral" },
                { value: "sparkling", label: "Sparkling" },
                { value: "spring",    label: "Spring" },
              ]}
            />
            <TextField
              label="Preferred brands"
              name="water_brand"
              placeholder="e.g. La Croix, Pellegrino, Evian, Waterloo"
              register={register}
            />
            <TextField
              label="Consumption estimate"
              name="water_consumption_estimate"
              placeholder="e.g. 2-3 bottles per day per person"
              register={register}
            />

            {/* ─────────── Soft drinks ─────────── */}
            <h2 className="brief-subhead">Soft drinks</h2>
            <p className="brief-note">
              <em>
                Add labels and quantities — the captain provisions straight
                from this list. Use plural counts (24 cans, 12 bottles).
                Leave blank what you don&apos;t need.
              </em>
            </p>
            <LabelQuantityRows
              name="soft_drinks"
              label=""
              register={register}
              startRows={4}
            />

            {/* ─────────── Standard bar ─────────── */}
            <h2 className="brief-subhead">Standard bar (classics included)</h2>
            <p className="brief-note">
              <em>
                Tick to keep these stocked by default, or untick to skip a
                category and let your specific picks below take over.
              </em>
            </p>
            <CheckboxGroup
              name="standard_bar_items"
              label=""
              register={register}
              twoColumn
              options={[
                { value: "tonic",     label: "Tonic & sodas" },
                { value: "citrus",    label: "Fresh citrus & garnish" },
                { value: "champagne", label: "House champagne for arrival toast" },
              ]}
            />

            {/* ─────────── Wines ─────────── */}
            <h2 className="brief-subhead">Wines & Champagne</h2>
            <RadioGroup
              name="wine_greek_vineyards"
              label="Would you like to taste Greek wines from the best vineyards?"
              hint="Greece offers exceptional wines — Assyrtiko, Xinomavro, old-vine reds. The crew happily recommends."
              register={register}
              options={[
                { value: "yes",     label: "Yes please" },
                { value: "open_to", label: "Open to a few — a mix with our own picks" },
                { value: "no",      label: "No, just our own selections" },
              ]}
            />
            <TextField
              label="Preferred price range per bottle (Greek wines)"
              name="wine_price_range"
              placeholder="e.g. €40-80, €100-150"
              register={register}
            />
            <RadioGroup
              name="wine_style"
              label="Overall wine approach"
              register={register}
              options={[
                { value: "surprise_greek",   label: "Surprise us with Greek selections" },
                { value: "house_red_white",  label: "House red & white, no fuss" },
                { value: "specific_only",    label: "Only the specific labels I list" },
                { value: "combination",      label: "A combination — some surprise, some specific" },
              ]}
            />
            <p className="brief-note" style={{ marginTop: 14 }}>
              <em>
                Specific labels — Label, Quantity, Price range per bottle.
                Leave price blank to let the captain choose within your
                overall range above.
              </em>
            </p>
            <LabelQuantityRows
              name="wines"
              label=""
              register={register}
              withPriceRange
              startRows={4}
            />

            {/* ─────────── Spirits ─────────── */}
            <h2 className="brief-subhead">Spirits</h2>
            <p className="brief-note">
              <em>One block per spirit. Add only what you want stocked.</em>
            </p>

            <LabelQuantityRows name="whiskey" label="Whiskey" register={register} startRows={2} />
            <LabelQuantityRows name="vodka"   label="Vodka"   register={register} startRows={2} />
            <LabelQuantityRows name="gin"     label="Gin"     register={register} startRows={2} />
            <LabelQuantityRows name="rum"     label="Rum"     register={register} startRows={2} />
            <LabelQuantityRows name="tequila" label="Tequila" register={register} startRows={2} />
            <LabelQuantityRows name="liqueur" label="Liqueur" register={register} startRows={2} />

            {/* ─────────── Beers ─────────── */}
            <h2 className="brief-subhead">Beers</h2>
            <LabelQuantityRows
              name="beers"
              label="International beers"
              register={register}
              startRows={3}
            />
            <LabelQuantityRows
              name="beers_local"
              label="Local Greek beers (Mythos, Alfa, Septem…)"
              register={register}
              startRows={2}
            />

            {/* ─────────── Specific brand prefs ─────────── */}
            <h2 className="brief-subhead">Anything else specific</h2>
            <OpenTextarea
              label="Specific brand preferences or rare labels"
              hint="Free text — anything that didn't fit the tables above."
              name="specific_preferences"
              register={register}
              rows={3}
            />

            {/* ─────────── Cocktails ─────────── */}
            <h2 className="brief-subhead">Cocktails & mocktails</h2>
            <OpenTextarea
              label="Cocktails the hostess should know"
              hint="How you like them prepared — ice, garnish, glassware."
              name="cocktails"
              register={register}
              rows={3}
              placeholder="e.g. Negroni 1:1:1 over a single large cube, Margarita on the rocks with salt"
            />
            <OpenTextarea
              label="Mocktails"
              hint="Non-alcoholic versions for kids or non-drinkers."
              name="mocktails"
              register={register}
              rows={2}
              placeholder="e.g. Virgin mojitos, fresh juice spritzers, ginger cooler"
            />

            <p className="bev-extras-note">
              <strong>A small note on rare bottles.</strong> Vintage champagnes,
              high-end Bordeaux, very rare spirits — anything outside a typical
              charter bar — may carry a cost outside what&apos;s included. We&apos;ll
              come back with the exact figure before anything is ordered, so
              the choice is entirely yours.
            </p>
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
          margin: 32px 0 0 0;
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
