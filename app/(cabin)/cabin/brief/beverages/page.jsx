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
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
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

      {/* 2026-05-20 — Allergy banner echoes on every food-adjacent
          page. Bartender pours these too. */}
      <AllergyAlert />

      <BriefFormShell
        sectionKey="beverages"
        prevSection={{ key: "dining", title: "At the Table" }}
        nextSection={{ key: "little_things", title: "The Little Things" }}
      >
        {({ register, control }) => (
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

            {/* 2026-05-20 — Da$k friend-test: "Αυτό δεν μπορεί να το
                υπολογίσει ο άλλος... συνήθως λένε ότι πίνουμε κοκακόλα
                και η Hostess τα υπολογίζει." The exact-quantity table
                read as broker counting drinks. Softened framing so the
                charterer can say "we drink lots of Coke Zero" without
                feeling pressured to specify "24 cans". The labels still
                get saved if anyone uses the rows; the captain treats
                quantity as advisory, not literal. */}
            <h2 className="brief-subhead">Soft drinks</h2>
            <p className="brief-note">
              <em>
                Tell us what your group drinks and the hostess will keep it
                stocked. You don&apos;t need to specify exact quantities —
                she calibrates from group size and the week ahead. If you
                want a specific brand (Coca-Cola Zero, San Pellegrino,
                Sprite light), name it; otherwise leave blank.
              </em>
            </p>
            <LabelQuantityRows
              name="soft_drinks"
              label=""
              register={register}
              control={control}
              startRows={3}
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
            {/* 2026-05-20 — Eleanna friend-test: asked "per person or per
                bottle?" on this exact field even though the LABEL said
                per bottle. Adding it to the placeholder makes the unit
                unambiguous at the point of input, not only in the label. */}
            <TextField
              label="Preferred price range per bottle (Greek wines)"
              hint="Per bottle, not per person. The captain agrees the final budget with you when you board."
              name="wine_price_range"
              placeholder="e.g. €40-80 per bottle, or €100-150 per bottle"
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
              control={control}
              withPriceRange
              startRows={4}
            />

            {/* 2026-05-20 — Da$k friend-test: "γενικά από όσο ξέρω αυτά
                τα σκάφη από μπαρ κτλ είναι φουλ γιατί δεν ξέρουν τι θα
                ζητήσει ο πελάτης". The six per-spirit label/qty tables
                + two per-beer tables produced visible fatigue ("γενικά
                είναι πολύ μεγάλο") and the implication that the charter
                bar wasn't already stocked. Collapsed into one prompt
                each for spirits + beers — the bartender already has the
                core spirits and works from a one-liner like "we drink
                gin & tonics, dark rum on the rocks, Mythos with lunch."

                Original LabelQuantityRows for each spirit + beer kept
                in schemas.js (commented use) so old saved briefs still
                load; new submissions will use the new freeform fields
                below. */}

            <h2 className="brief-subhead">Spirits — what your group drinks</h2>
            <p className="brief-note">
              <em>
                The yacht keeps a full bar (gin, vodka, rum, tequila, whiskey,
                core liqueurs, mixers). Tell us your favourites and any
                specific labels you love — the hostess buys what matters and
                leaves the rest stocked at house level.
              </em>
            </p>
            <OpenTextarea
              label="Spirits, brands, and how you take them"
              name="spirits_notes"
              register={register}
              rows={4}
              placeholder="e.g. We drink gin & tonics — Hendrick's if you have it, Fever-Tree tonic. My husband loves a Talisker neat in the evening. Margaritas on Friday night, Don Julio if possible."
            />

            <h2 className="brief-subhead">Beers</h2>
            <OpenTextarea
              label="Beers your group drinks"
              hint="Mention international labels (Heineken, Corona, IPA) or Greek beers you'd like to taste (Mythos, Alfa, Vergina, Septem)."
              name="beers_notes"
              register={register}
              rows={3}
              placeholder="e.g. Mostly Corona with lime at lunch. Open to Greek labels — happy to try Mythos and whatever the captain recommends."
            />

            {/* 2026-05-20 — "Anything else specific" section removed.
                It was a third place for charterers to write spirit/beer/
                wine brand preferences after we already ask in three
                other places. specific_preferences kept on the schema
                for back-compat with already-saved briefs. */}

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
