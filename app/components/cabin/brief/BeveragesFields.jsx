"use client";

// app/components/cabin/brief/BeveragesFields.jsx
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3).
//
// Extracted from /cabin/brief/beverages/page.jsx so the same field
// set drives both the principal-owned brief route AND the new
// guest-contribution route at /cabin/me/in-the-cellar. Fields,
// copy, hints, options preserved verbatim.
// =============================================================

import {
  TextField,
  OpenTextarea,
  CheckboxGroup,
  RadioGroup,
  FrequencyPicker,
} from "./FormFields";

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

export default function BeveragesFields({ register }) {
  return (
    <>
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
      <RadioGroup
        name="champagne_tier"
        label="If yes — what level"
        hint="The hostess matches the boat's house list to your level. Anything materially above your stated tier is confirmed by phone before ordering — never silently added to your tab."
        register={register}
        options={[
          {
            value: "premium",
            label: "Premium",
            description:
              "Vintage, grandes maisons. This is our most generous tier — selecting it noticeably shapes your APA usage.",
          },
          {
            value: "standard",
            label: "Standard",
            description:
              "Respected everyday champagne. The popular middle ground.",
          },
          {
            value: "classic",
            label: "Classic",
            description:
              "House pour for toasts. The lightest tier on your APA — most likely to leave a refund at week's end.",
          },
          {
            value: "leave_to_captain",
            label: "Leave it to the captain",
          },
        ]}
      />
      <OpenTextarea
        label="Specific labels you love (optional)"
        name="champagne_specifics"
        register={register}
        rows={2}
        placeholder="e.g. Krug Grande Cuvée · Dom Pérignon · Ruinart Blanc de Blancs"
      />

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
        hint="Same ceiling logic as champagne — anything materially above the stated tier is confirmed by phone first."
        register={register}
        options={[
          {
            value: "premium",
            label: "Premium",
            description:
              "Crus, vintages, vineyard-rare bottles. This is our most generous tier — selecting it noticeably shapes your APA usage.",
          },
          {
            value: "standard",
            label: "Standard",
            description:
              "Good everyday wines, respected Greek + international labels. The popular middle ground.",
          },
          {
            value: "classic",
            label: "Classic",
            description:
              "House red & white. The lightest tier on your APA — most likely to leave a refund at week's end.",
          },
          {
            value: "leave_to_captain",
            label: "Leave it to the captain",
          },
        ]}
      />
      <OpenTextarea
        label="Specific labels you love (optional)"
        name="wine_specifics"
        register={register}
        rows={3}
        placeholder="e.g. Sancerre Henri Bourgeois · any Domaine Gerovassiliou white · Châteauneuf-du-Pape if a vintage is around"
      />

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
  );
}
