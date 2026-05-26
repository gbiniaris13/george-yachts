"use client";

// app/components/cabin/brief/GuestBriefReadOnly.jsx
// =============================================================
// 2026-05-26 — Brief 02 (single-responsibility rework, Task A2).
//
// Under the new model, guests no longer write to dining /
// beverages — those become Main-Charterer decisions. They MAY
// view the principal's choices read-only so they have visibility
// into what the table and the cellar are going to be.
//
// This component fetches the section's data via the existing
// GET /api/cabin/brief/:section endpoint (which has no role
// gate — read is open to any cabin member) and renders the
// populated values as a calm def-list. Empty fields are
// omitted entirely; no "blank dash" walls. No form controls,
// no inputs, no buttons — render-only.
//
// kind = "dining" | "beverages" — picks the section + label map.
// =============================================================

import { useEffect, useState } from "react";

// ---- Field label maps -----------------------------------------------------
// Pretty-print only the keys we know about. Anything else falls
// back to titleCase(key) so future schema additions still render
// without code changes.

const DINING_LABELS = {
  breakfast_time: "Breakfast time",
  lunch_time: "Lunch time",
  dinner_time: "Dinner time",
  breakfast_style: "Breakfast style",
  breakfast_styles: "Breakfast styles",
  breakfast_items: "Breakfast items",
  breakfast_cheese_kind: "Cheese kind",
  breakfast_cereal_kind: "Cereal kind",
  breakfast_jam_kind: "Jam kind",
  breakfast_tea_kind: "Tea kind",
  breakfast_juice_kind: "Juice kind",
  breakfast_specifics: "Breakfast specifics",
  breakfast_styles_other: "Breakfast style (other)",
  coffee_tea: "Coffee & tea",
  coffee_tea_specifics: "Coffee/tea specifics",
  coffee_tea_other: "Coffee/tea (other)",
  lunch_service: "Lunch service style",
  dinner_service: "Dinner service style",
  food_matrix: "Foods — like / dislike",
  food_loves: "Foods loved",
  food_avoid: "Foods to avoid",
  dessert_styles: "Dessert styles",
  dessert_specifics: "Dessert specifics",
  snacks_yes_no: "Snacks between meals",
  snacks_details: "Snack details",
  afternoon_tea_yes_no: "Afternoon tea",
  afternoon_tea_details: "Afternoon tea details",
  dining_ashore_evenings: "Evenings ashore",
  dining_ashore_notes: "Ashore notes",
  kids_meal_arrangement: "Children — meal arrangement",
  kids_meal_specifics: "Children — meal specifics",
  kids_needs_baby_cot: "Baby cot needed",
  kids_needs_high_chair: "High chair needed",
  kids_baby_food_specifics: "Baby food specifics",
  children_at_table: "Children at the table",
  chef_open_note: "Open note to the chef",
};

const BEVERAGES_LABELS = {
  water_type: "Water type",
  water_brand: "Water brands",
  champagne_wanted: "Champagne wanted",
  champagne_tier: "Champagne tier",
  champagne_specifics: "Champagne labels",
  wine_wanted: "Wine wanted",
  wine_colors: "Wine colours",
  wine_grapes: "Wine grapes/styles",
  wine_tier: "Wine tier",
  wine_specifics: "Wine labels",
  wine_greek_vineyards: "Greek vineyards",
  wine_price_range: "Wine price range",
  wine_style: "Wine style",
  wines: "Wine — specific labels",
  spirits_frequency: "Spirits — frequency",
  spirits_brands: "Spirits — brands",
  spirits_notes: "Spirits notes",
  beers_frequency: "Beers — frequency",
  beers_origin: "Beers — origin",
  beers_specifics: "Beers labels",
  beers_notes: "Beers notes",
  beers: "Beers — international",
  beers_local: "Beers — local Greek",
  soft_drinks_frequency: "Soft drinks — frequency",
  soft_drinks_brands: "Soft drinks — brands",
  soft_drinks: "Soft drinks",
  standard_bar_items: "Standard bar items",
  specific_preferences: "Specific preferences",
  whiskey: "Whiskey",
  vodka: "Vodka",
  gin: "Gin",
  rum: "Rum",
  tequila: "Tequila",
  liqueur: "Liqueur",
  cocktails: "Cocktails",
  mocktails: "Mocktails",
};

const LIFE_ABOARD_LABELS = {
  crew_interaction: "Crew style",
  activities: "Activities the group loves",
  activities_other: "Other activities",
  extras_freeform: "Small touches for the captain",
};

const CREW_INTERACTION_LABELS = {
  always_around: "Warm and chatty",
  balanced: "Warm but discreet",
  discreet: "Quiet & formal",
};

const FREQUENCY_LABEL = {
  often: "Often",
  sometimes: "Sometimes",
  rarely: "Rarely but keep some",
  skip: "Skip",
};

// 2026-05-26 — Brief 02 (bug-pass v3): soft_drinks_frequency,
// spirits_frequency, beers_frequency etc. are stored as
// { coca_cola_light: "often", sprite: "skip", ... } — keyed
// per-item. Without a special case they hit the "plain primitive"
// formatter → String({}) → "[object Object]". Pretty-printed
// per-item labels live alongside the value renderer.
const SOFT_DRINK_ITEM_LABELS = {
  coca_cola: "Coca-Cola",
  coca_cola_light: "Coca-Cola Light",
  coca_cola_zero: "Coca-Cola Zero",
  sprite: "Sprite",
  fanta: "Fanta",
  ginger_ale: "Ginger ale",
  tonic: "Tonic",
  soda_water: "Soda water",
  bitter_lemon: "Bitter lemon",
  cranberry_juice: "Cranberry juice",
  energy_drink: "Energy drink",
};

const FOOD_MATRIX_LABELS = {
  fish: "Fish",
  shellfish: "Shellfish",
  beef: "Beef",
  pork: "Pork",
  lamb: "Lamb",
  veal: "Veal",
  chicken: "Chicken",
  turkey: "Turkey",
  greek_meze: "Greek meze",
  pasta: "Pasta",
  rice: "Rice",
  vegetables: "Vegetables",
  salad: "Salad",
};

const MATRIX_VERDICT_LABELS = {
  like: "Like",
  dislike: "Dislike",
  indifferent: "Indifferent",
};

// ---- Helpers --------------------------------------------------------------

function titleCase(s) {
  return String(s)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

function formatPrimitive(v) {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  // 2026-05-26 — Defensive: never render "[object Object]" in
  // production. Any future field that arrives as a bare object
  // without a dedicated renderer above falls through to here;
  // returning empty string lets the parent .filter(!isEmpty) drop it.
  if (v != null && typeof v === "object") return "";
  return String(v);
}

function formatArray(arr) {
  // Array of plain strings/enums → " · " join with titleCase.
  if (arr.every((x) => typeof x === "string" || typeof x === "number")) {
    return arr.map((x) => titleCase(String(x))).join(" · ");
  }
  // Array of objects (label/qty rows etc.) — render as a list.
  return null; // caller renders a <ul>
}

// ---- Component ------------------------------------------------------------

const styles = `
  .gbr {
    margin: 22px 0 0 0;
    padding: 22px 22px 18px 22px;
    background: #ffffff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    border-left: 3px solid var(--gy-gold);
    border-radius: 3px;
  }
  .gbr__intro {
    margin: 0 0 18px 0;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 15px;
    line-height: 1.65;
    color: rgba(13, 27, 42, 0.78);
  }
  .gbr__empty {
    margin: 0;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 14px;
    color: rgba(13, 27, 42, 0.55);
  }
  .gbr__loading {
    height: 90px;
    background: linear-gradient(90deg,
      rgba(13,27,42,0.05) 25%,
      rgba(13,27,42,0.1)  37%,
      rgba(13,27,42,0.05) 63%);
    background-size: 400% 100%;
    animation: gbr-shimmer 1.4s infinite;
    border-radius: 3px;
  }
  @keyframes gbr-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
  .gbr__dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }
  .gbr__row {
    display: grid;
    grid-template-columns: 170px 1fr;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(13, 27, 42, 0.06);
    font-family: var(--gy-font-editorial);
  }
  .gbr__row:last-child { border-bottom: none; }
  @media (max-width: 559.98px) {
    .gbr__row { grid-template-columns: 1fr; gap: 2px; padding: 10px 0; }
  }
  .gbr__dt {
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(13, 27, 42, 0.55);
    padding-top: 2px;
  }
  .gbr__dd {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--gy-navy);
  }
  .gbr__sublist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 4px 16px;
  }
  .gbr__subli {
    font-size: 13.5px;
    color: var(--gy-navy);
  }
  .gbr__subli em {
    color: var(--gy-gold);
    font-style: normal;
    font-weight: 600;
    margin-left: 6px;
  }
  .gbr__rows-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .gbr__rows-list li {
    padding: 2px 0;
    font-size: 13.5px;
  }
`;

export default function GuestBriefReadOnly({ sectionKey, kind }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  const [data, setData] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cabin/brief/${sectionKey}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.ok) {
          setData(j.data ?? {});
          setState("ready");
        } else {
          setState("error");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  const labels =
    kind === "beverages"
      ? BEVERAGES_LABELS
      : kind === "life_aboard"
      ? LIFE_ABOARD_LABELS
      : DINING_LABELS;
  // 2026-05-26 — Brief 02 (bug-pass v3): kind-specific intro so the
  // copy matches what the principal owns. Life Aboard isn't about
  // "the table and the cellar".
  const introCopy =
    kind === "life_aboard"
      ? "The Main Charterer is arranging life aboard for the whole group. Here is what they have chosen so far."
      : "The Main Charterer is arranging the table and the cellar for the whole group. Here is what they have chosen so far.";

  if (state === "loading") {
    return (
      <section className="gbr" aria-busy="true" aria-label="Loading">
        <p className="gbr__intro">{introCopy}</p>
        <div className="gbr__loading" />
        <style>{styles}</style>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="gbr">
        <p className="gbr__intro">{introCopy}</p>
        <p className="gbr__empty">
          We couldn&apos;t load the choices just now. Please try again in a
          moment.
        </p>
        <style>{styles}</style>
      </section>
    );
  }

  // ready
  const entries = Object.entries(data).filter(([, v]) => !isEmpty(v));

  return (
    <section className="gbr">
      <p className="gbr__intro">{introCopy}</p>
      {entries.length === 0 ? (
        <p className="gbr__empty">
          The Main Charterer hasn&apos;t shared their choices yet. You&apos;ll
          see them here as soon as they do.
        </p>
      ) : (
        <dl className="gbr__dl">
          {entries.map(([key, value]) => {
            const label = labels[key] || titleCase(key);

            // 2026-05-26 — Brief 02 (bug-pass v3, Domingo): frequency-
            // picker objects like soft_drinks_frequency, spirits_frequency
            // and beers_frequency store as { item: enum-string } per item.
            // Without this case they fell through to formatPrimitive →
            // String({}) → "[object Object]". Render each non-skip
            // entry as "Coca-Cola — Often" in a sublist; mirrors the
            // food_matrix block one level above.
            const isFrequencyKey =
              key === "soft_drinks_frequency" ||
              key === "spirits_frequency" ||
              key === "beers_frequency";
            if (
              isFrequencyKey &&
              value &&
              typeof value === "object" &&
              !Array.isArray(value)
            ) {
              const freqEntries = Object.entries(value).filter(
                ([, verdict]) =>
                  typeof verdict === "string" &&
                  verdict.length > 0 &&
                  verdict !== "skip",
              );
              if (freqEntries.length === 0) return null;
              return (
                <div key={key} className="gbr__row">
                  <dt className="gbr__dt">{label}</dt>
                  <dd className="gbr__dd">
                    <ul className="gbr__sublist">
                      {freqEntries.map(([itemKey, verdict]) => (
                        <li key={itemKey} className="gbr__subli">
                          {SOFT_DRINK_ITEM_LABELS[itemKey] || titleCase(itemKey)}{" "}
                          <em>
                            {FREQUENCY_LABEL[verdict] || titleCase(verdict)}
                          </em>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              );
            }

            // 2026-05-26 — Brief 02 (bug-pass v3): life_aboard's
            // crew_interaction is a plain enum string. Pretty-print it.
            if (key === "crew_interaction" && typeof value === "string") {
              const pretty = CREW_INTERACTION_LABELS[value] || titleCase(value);
              return (
                <div key={key} className="gbr__row">
                  <dt className="gbr__dt">{label}</dt>
                  <dd className="gbr__dd">{pretty}</dd>
                </div>
              );
            }

            // food_matrix: render verdict per item as a sub-grid
            if (
              key === "food_matrix" &&
              value &&
              typeof value === "object" &&
              !Array.isArray(value)
            ) {
              const matrixEntries = Object.entries(value).filter(
                ([, verdict]) => Boolean(verdict),
              );
              if (matrixEntries.length === 0) return null;
              return (
                <div key={key} className="gbr__row">
                  <dt className="gbr__dt">{label}</dt>
                  <dd className="gbr__dd">
                    <ul className="gbr__sublist">
                      {matrixEntries.map(([k, verdict]) => (
                        <li key={k} className="gbr__subli">
                          {FOOD_MATRIX_LABELS[k] || titleCase(k)}{" "}
                          <em>
                            {MATRIX_VERDICT_LABELS[verdict] ||
                              titleCase(verdict)}
                          </em>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              );
            }

            // Array of objects (e.g. labelQty rows for wines/spirits/beers)
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === "object" &&
              value[0] !== null
            ) {
              const items = value
                .map((row) => {
                  const lab = row?.label?.trim?.() || "";
                  const qty = row?.quantity?.trim?.() || "";
                  if (!lab && !qty) return null;
                  return [lab, qty].filter(Boolean).join(" — ");
                })
                .filter(Boolean);
              if (items.length === 0) return null;
              return (
                <div key={key} className="gbr__row">
                  <dt className="gbr__dt">{label}</dt>
                  <dd className="gbr__dd">
                    <ul className="gbr__rows-list">
                      {items.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              );
            }

            // Plain array → " · " join
            if (Array.isArray(value)) {
              const text = formatArray(value);
              if (!text) return null;
              return (
                <div key={key} className="gbr__row">
                  <dt className="gbr__dt">{label}</dt>
                  <dd className="gbr__dd">{text}</dd>
                </div>
              );
            }

            // Plain primitive
            return (
              <div key={key} className="gbr__row">
                <dt className="gbr__dt">{label}</dt>
                <dd className="gbr__dd">{formatPrimitive(value)}</dd>
              </div>
            );
          })}
        </dl>
      )}
      <style>{styles}</style>
    </section>
  );
}
