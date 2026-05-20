"use client";

// /cabin/brief/beverages — In the Cellar.
//
// 2026-05-20 — Friend-test pass 3 (George):
//   "Δεν είναι F&B managers οι πελάτες μας. Μη βάζεις τον άλλο να
//    γράφει '16 κοκακόλες'. Βάλε τον να μου πει 'Coca-Cola light'
//    και να επιλέξει: το πίνω συχνά / χαλαρά / σπάνια αλλά το
//    χρειάζομαι. Στα κρασιά: θες κρασί; ναι; ελληνικά; ποια
//    χρώματα; premium / standard / classic; συγκεκριμένη
//    ετικέττα; αλλιώς leave it to us."
//
// So the cellar is reframed by category. Each category asks:
//   1. Do you want this stocked?
//   2. (where it matters) Tier — premium / standard / classic /
//      leave-to-us.
//   3. (where it matters) Specific labels you love (free text).
// Plus FrequencyPicker rows for the spirits + soft drinks where
// each item has its own drink-often / sometimes / rarely-but-keep
// chip choice. No numbers, ever.
//
// Old keys (soft_drinks[], wines[], wine_price_range, whiskey[],
// vodka[], gin[], rum[], tequila[], liqueur[], beers[], beers_local[],
// spirits_notes, beers_notes, wine_style, standard_bar_items) stay
// defined in lib/cabin/schemas.js so already-submitted briefs keep
// validating. New submissions populate the *_wanted / *_tier /
// *_frequency / *_specifics keys below.

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
// 2026-05-20 — Friend-test pass 4 round 5 (Sarah):
//   "ALLERGIES & MEDICAL — Add in Health & Safety appears on the
//    cellar page. What allergy info am I going to add to my drinks
//    page? Make it conditional, or remove from cellar entirely."
// Removed the AllergyAlert from the beverages section — the only
// pages where it makes sense are dining (allergens drive food)
// and health (where the data is captured). Cellar is too far from
// that concern; the banner was noise.
import {
  SectionTitle,
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
  FrequencyPicker,
} from "../../../../components/cabin/brief/FormFields";

const SOFT_DRINK_ITEMS = [
  { value: "still_water",      label: "Still water" },
  { value: "sparkling_water",  label: "Sparkling water" },
  { value: "tonic",            label: "Tonic water" },
  { value: "coca_cola",        label: "Coca-Cola" },
  { value: "coca_cola_light",  label: "Coca-Cola Light / Zero" },
  { value: "sprite",           label: "Sprite / Lemon-Lime" },
  { value: "ginger_ale",       label: "Ginger ale" },
  { value: "fresh_juices",     label: "Freshly squeezed juices" },
  { value: "iced_tea",         label: "Iced tea" },
];

const SPIRITS_ITEMS = [
  { value: "gin",        label: "Gin" },
  { value: "vodka",      label: "Vodka" },
  { value: "whisky",     label: "Whisky / Bourbon" },
  { value: "rum",        label: "Rum" },
  { value: "tequila",    label: "Tequila / Mezcal" },
  { value: "liqueurs",   label: "Liqueurs (Aperol, Campari, etc.)" },
];

const WINE_COLOR_OPTIONS = [
  { value: "red",    label: "Red" },
  { value: "white",  label: "White" },
  { value: "rose",   label: "Rosé" },
  { value: "orange", label: "Orange / amber (when available)" },
];

export default function BeveragesSectionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Section Seven · In the Cellar"
        title="In the"
        italic="cellar."
      />
      <IntroParagraph>
        The bar comes already stocked — gin, vodka, whisky, the usual mixers.
        We only need a sense of what your group actually drinks, and any
        labels that matter to you. The hostess buys the rest. No quantities
        to count, ever.
      </IntroParagraph>

      <BriefFormShell
        sectionKey="beverages"
        prevSection={{ key: "dining", title: "At the Table" }}
        isLastSection
      >
        {({ register }) => (
          <>
            {/* ─────────── Water ─────────── */}
            <h2 className="brief-subhead">Bottled water</h2>
            <CheckboxGroup
              name="water_type"
              label="Type your group prefers"
              register={register}
              twoColumn
              options={[
                { value: "mineral",   label: "Mineral" },
                { value: "sparkling", label: "Sparkling" },
                { value: "spring",    label: "Spring" },
              ]}
            />
            <TextField
              label="Brand preferences (optional)"
              name="water_brand"
              placeholder="e.g. Pellegrino at meals, anything else for everyday"
              register={register}
            />

            {/* ─────────── Champagne ─────────── */}
            <h2 className="brief-subhead">Champagne</h2>
            <RadioGroup
              name="champagne_wanted"
              label="Would you like champagne stocked?"
              register={register}
              options={[
                { value: "yes",               label: "Yes please" },
                { value: "no",                label: "No, thank you" },
                { value: "leave_to_captain",  label: "Leave it to the captain" },
              ]}
            />
            {/* 2026-05-20 — Pass 4 round 5 (David, Sarah):
                "What does 'Premium' translate to in dollars? If
                 Premium means $400/night × 7 nights, that's $2,800
                 I didn't budget. Give me a price ladder or a
                 'typical charter spends X here' range."
                Added rough per-bottle price ranges to each tier
                so the user can mentally budget before ticking. */}
            <RadioGroup
              name="champagne_tier"
              label="If yes — what level"
              hint="The hostess matches the boat's house list to your level. Anything beyond the range below is confirmed by phone before ordering, never silently added to your tab."
              register={register}
              options={[
                { value: "premium",          label: "Premium · €120–€300 per bottle (vintage, grandes maisons)" },
                { value: "standard",         label: "Standard · €60–€120 per bottle (everyday quality)" },
                { value: "classic",          label: "Classic · €40–€70 per bottle (house pour for toasts)" },
                { value: "leave_to_captain", label: "Leave it to the captain" },
              ]}
            />
            <OpenTextarea
              label="Specific labels you love (optional)"
              name="champagne_specifics"
              register={register}
              rows={2}
              placeholder="e.g. Krug Grande Cuvée · Dom Pérignon · Ruinart Blanc de Blancs"
            />

            {/* ─────────── Wines ─────────── */}
            <h2 className="brief-subhead">Wines</h2>
            <RadioGroup
              name="wine_wanted"
              label="Would you like wine stocked?"
              register={register}
              options={[
                { value: "yes",               label: "Yes please" },
                { value: "no",                label: "No, thank you" },
                { value: "leave_to_captain",  label: "Leave it to the captain" },
              ]}
            />
            <RadioGroup
              name="wine_greek_vineyards"
              label="Greek wines from the best vineyards?"
              hint="Greece offers exceptional wines — Assyrtiko, Xinomavro, old-vine reds. The crew recommends warmly."
              register={register}
              options={[
                { value: "yes",     label: "Yes please" },
                { value: "open_to", label: "Open to a few — mixed with our own picks" },
                { value: "no",      label: "No, only our own selections" },
              ]}
            />
            <CheckboxGroup
              name="wine_colors"
              label="Colours your group enjoys"
              register={register}
              twoColumn
              options={WINE_COLOR_OPTIONS}
            />
            <OpenTextarea
              label="Grape varieties you love (optional)"
              hint="Sauvignon Blanc, Pinot Noir, Assyrtiko, Agiorgitiko — the crew will look these out."
              name="wine_grapes"
              register={register}
              rows={2}
              placeholder="e.g. Burgundy reds, Sancerre whites, Greek Assyrtiko"
            />
            <RadioGroup
              name="wine_tier"
              label="Overall level"
              hint="Same ceiling logic as champagne — anything above the range is confirmed by phone first."
              register={register}
              options={[
                { value: "premium",          label: "Premium · €80–€200 per bottle (crus, vintages)" },
                { value: "standard",         label: "Standard · €30–€70 per bottle (good everyday wines)" },
                { value: "classic",          label: "Classic · €15–€30 per bottle (house red & white)" },
                { value: "leave_to_captain", label: "Leave it to the captain" },
              ]}
            />
            <OpenTextarea
              label="Specific labels you love (optional)"
              name="wine_specifics"
              register={register}
              rows={3}
              placeholder="e.g. Sancerre Henri Bourgeois · any Domaine Gerovassiliou white · Châteauneuf-du-Pape if a vintage is around"
            />

            {/* ─────────── Spirits ─────────── */}
            {/* 2026-05-20 — Friend-test pass 4 (David):
                "Cellar page is a LOT. I'm going to lie and tick 'Sometimes'
                 for everything to get through it."
                Made the per-item frequency rows skippable: the wrapper is
                a <details> that defaults to collapsed. If the user doesn't
                open it, the hostess defaults to her own provisioning.
                If they do open it, they can answer per item. */}
            <h2 className="brief-subhead">Spirits</h2>
            <p className="brief-note">
              <em>
                The bar already carries the core categories — gin, vodka,
                whisky, rum, tequila, liqueurs. If your group has strong
                preferences, set them per category below; otherwise leave
                everything closed and the hostess provisions from her usual
                stock.
              </em>
            </p>
            <details className="brief-details">
              <summary>Set per-spirit detail (optional)</summary>
              <FrequencyPicker
                name="spirits_frequency"
                label=""
                items={SPIRITS_ITEMS}
                register={register}
              />
            </details>
            <OpenTextarea
              label="Specific labels you love (optional)"
              hint="Single malts, particular gins, dark rums — anything the hostess should hunt for at provisioning."
              name="spirits_brands"
              register={register}
              rows={3}
              placeholder="e.g. Hendrick's gin · Talisker 10 · Don Julio Reposado · Aperol for spritz at sunset"
            />

            {/* ─────────── Beers ─────────── */}
            <h2 className="brief-subhead">Beers</h2>
            <RadioGroup
              name="beers_frequency"
              label="How often does your group drink beer?"
              register={register}
              options={[
                { value: "often",     label: "Often" },
                { value: "sometimes", label: "Sometimes" },
                { value: "rarely",    label: "Rarely, but keep some" },
                { value: "skip",      label: "Skip — we don't drink beer" },
              ]}
            />
            <RadioGroup
              name="beers_origin"
              label="International or Greek?"
              register={register}
              options={[
                { value: "international",    label: "International (Corona, Heineken, IPA, etc.)" },
                { value: "greek",            label: "Greek (Mythos, Alfa, Vergina, Septem)" },
                { value: "both",             label: "Both — a mix" },
                { value: "leave_to_captain", label: "Leave it to the captain" },
              ]}
            />
            <OpenTextarea
              label="Specific labels (optional)"
              name="beers_specifics"
              register={register}
              rows={2}
              placeholder="e.g. Corona with lime at lunch · happy to try Mythos and Septem"
            />

            {/* ─────────── Soft drinks ─────────── */}
            <h2 className="brief-subhead">Soft drinks</h2>
            <p className="brief-note">
              <em>
                The fridge stays stocked with water, tonic, cola, lemon-lime
                and fresh juices as standard. Open the panel below only if
                your group has clear preferences worth recording per item.
              </em>
            </p>
            <details className="brief-details">
              <summary>Set per-drink detail (optional)</summary>
              <FrequencyPicker
                name="soft_drinks_frequency"
                label=""
                items={SOFT_DRINK_ITEMS}
                register={register}
              />
            </details>
            <OpenTextarea
              label="Specific brands (optional)"
              name="soft_drinks_brands"
              register={register}
              rows={2}
              placeholder="e.g. Fever-Tree tonic · Schweppes ginger ale · only Coca-Cola Light, not Zero"
            />

            {/* ─────────── Cocktails ─────────── */}
            <h2 className="brief-subhead">Cocktails & mocktails</h2>
            <OpenTextarea
              label="Cocktails the hostess should know"
              hint="How you like them prepared — ice, garnish, glassware."
              name="cocktails"
              register={register}
              rows={3}
              placeholder="e.g. Negroni 1:1:1 over a single large cube · Margarita on the rocks with salt"
            />
            <OpenTextarea
              label="Mocktails"
              hint="Non-alcoholic versions for kids or non-drinkers."
              name="mocktails"
              register={register}
              rows={2}
              placeholder="e.g. Virgin mojitos · fresh juice spritzers · ginger cooler"
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
          color: rgba(13, 27, 42, 0.65);
          margin: 0 0 14px 0;
          line-height: 1.6;
        }
        /* Pass 4: collapse heavy per-item frequency rows behind a
           details/summary so David's "I'll lie and tick Sometimes"
           failure mode doesn't happen. The hostess provisions from
           house defaults if the user doesn't open the panel. */
        .brief-details {
          margin: 0 0 22px 0;
          padding: 0;
          border-top: 1px solid rgba(13,27,42,0.08);
          border-bottom: 1px solid rgba(13,27,42,0.08);
        }
        .brief-details > summary {
          cursor: pointer;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          padding: 14px 0;
          list-style: none;
        }
        .brief-details > summary::before {
          content: "+ ";
          color: var(--gy-gold);
        }
        .brief-details[open] > summary::before { content: "− "; }
        .brief-details[open] {
          padding: 0 0 14px 0;
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
