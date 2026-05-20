"use client";

// Shared low-level form primitives for the Charter Brief. All
// use plain HTML controls (no shadcn dependency) and are styled
// inline to keep the section pages self-contained.

import { useId, useState, useEffect } from "react";
import { useFieldArray } from "react-hook-form";

// =================== Required dot ===========================
// 2026-05-20 — Friend-test pass 4 (David):
//   "Emergency contact labels '·FULL NAME · RELATIONSHIP · MOBILE
//    · EMAIL' — the middle-dot bullets appear attached to the label
//    like a typo." They WERE the "required" indicator — a single
//    "·" prefix per required field. David read them as typos.
//
// The brief uses autosave (no form submit), so the visual required
// signal was decorative anyway. We collapse it to nothing — the
// `required` attribute on the input still hints to assistive tech
// where appropriate. If we want to bring it back, a single italic
// "(needed)" suffix on the field hint would be calmer.
export function RequiredDot() {
  return null;
}

// =================== Label =================================
function FieldLabel({ children, required, htmlFor, hint }) {
  return (
    <label htmlFor={htmlFor} className="brief-label">
      {required && <RequiredDot />}
      <span>{children}</span>
      {hint && <em>{hint}</em>}
      <style>{`
        .brief-label {
          display: block;
          font-family: var(--gy-font-ui);
          /* Bumped from 10px → 11.5px and opacity from 0.55 → 0.78.
             At 10px uppercase + tracked, the labels read as decorative
             rules rather than "this is what to type here." George
             reported empty Music/Emergency-contact fields because
             the labels were invisible to anyone over 40 years old. */
          font-size: 11.5px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          margin-bottom: 8px;
          font-weight: 500;
        }
        .brief-label em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.5);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
      `}</style>
    </label>
  );
}

// =================== TextField =============================
export function TextField({
  name,
  label,
  hint,
  required,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  register,
}) {
  const id = useId();
  const props = register ? register(name) : { name };
  return (
    <div className="brief-field">
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...props}
        className="brief-input"
      />
      <style>{`
        .brief-field { display: block; margin-bottom: 22px; }
        .brief-input {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13, 27, 42, 0.18);
          padding: 8px 0 9px 0;
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          color: var(--gy-navy);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          background-color: transparent;
          transition: border-color 160ms ease;
        }
        .brief-input::placeholder {
          color: rgba(13, 27, 42, 0.28);
          font-style: italic;
        }
        .brief-input:focus {
          border-bottom-color: var(--gy-gold);
        }
      `}</style>
    </div>
  );
}

// =================== Textarea ==============================
export function OpenTextarea({
  name,
  label,
  hint,
  required,
  placeholder,
  rows = 3,
  register,
}) {
  const id = useId();
  const props = register ? register(name) : { name };
  return (
    <div className="brief-field">
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...props}
        className="brief-textarea"
      />
      <style>{`
        .brief-textarea {
          width: 100%;
          background: rgba(13, 27, 42, 0.02);
          border: 1px solid rgba(13, 27, 42, 0.1);
          padding: 12px 14px;
          font-family: var(--gy-font-body);
          font-size: 15px;
          line-height: 1.6;
          color: var(--gy-navy);
          outline: none;
          resize: vertical;
          min-height: 84px;
          transition: border-color 160ms ease;
        }
        .brief-textarea::placeholder {
          color: rgba(13, 27, 42, 0.32);
          font-style: italic;
        }
        .brief-textarea:focus {
          border-color: var(--gy-gold);
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

// =================== RadioGroup ============================
// options: [{ value, label, description? }]
export function RadioGroup({
  name,
  label,
  hint,
  options,
  required,
  register,
}) {
  return (
    <fieldset className="brief-radio-group">
      <legend>
        {required && <RequiredDot />}
        {label}
        {hint && <em>{hint}</em>}
      </legend>
      <div className="brief-radio-list">
        {options.map((opt) => (
          <label key={opt.value} className="brief-radio-item">
            <input
              type="radio"
              value={opt.value}
              {...(register ? register(name) : { name })}
            />
            <span className="brief-radio-circle" aria-hidden />
            <span className="brief-radio-text">
              <strong>{opt.label}</strong>
              {opt.description && <em>{opt.description}</em>}
            </span>
          </label>
        ))}
      </div>

      <style>{`
        .brief-radio-group {
          border: 0;
          padding: 0;
          margin: 0 0 22px 0;
        }
        .brief-radio-group legend {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          margin-bottom: 12px;
          font-weight: 500;
        }
        .brief-radio-group legend em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.5);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
        .brief-radio-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(13, 27, 42, 0.06);
          border: 1px solid rgba(13, 27, 42, 0.08);
        }
        .brief-radio-item {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 14px;
          background: #ffffff;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .brief-radio-item:hover {
          background: rgba(201, 168, 76, 0.04);
        }
        .brief-radio-item input { display: none; }
        .brief-radio-circle {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(13, 27, 42, 0.35);
          border-radius: 50%;
          margin-top: 3px;
          transition: border-color 160ms ease, background 160ms ease;
          position: relative;
        }
        .brief-radio-item input:checked + .brief-radio-circle {
          border-color: var(--gy-gold);
        }
        .brief-radio-item input:checked + .brief-radio-circle::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: var(--gy-gold);
          border-radius: 50%;
        }
        .brief-radio-text strong {
          display: block;
          font-family: var(--gy-font-body);
          font-weight: 500;
          font-size: 14.5px;
          color: var(--gy-navy);
        }
        .brief-radio-text em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          margin-top: 2px;
        }
      `}</style>
    </fieldset>
  );
}

// =================== CheckboxGroup =========================
export function CheckboxGroup({
  name,
  label,
  hint,
  options,
  register,
  twoColumn = false,
}) {
  return (
    <fieldset className="brief-check-group">
      <legend>
        {label}
        {hint && <em>{hint}</em>}
      </legend>
      <div className={"brief-check-list" + (twoColumn ? " is-two" : "")}>
        {options.map((opt) => (
          <label key={opt.value} className="brief-check-item">
            <input
              type="checkbox"
              value={opt.value}
              {...(register ? register(name) : { name })}
            />
            <span className="brief-check-box" aria-hidden />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      <style>{`
        .brief-check-group {
          border: 0;
          padding: 0;
          margin: 0 0 22px 0;
        }
        .brief-check-group legend {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          margin-bottom: 12px;
          font-weight: 500;
        }
        .brief-check-group legend em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.5);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
        .brief-check-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .brief-check-list.is-two {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-check-list.is-two { grid-template-columns: 1fr 1fr; gap: 0 14px; }
        }
        .brief-check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(13, 27, 42, 0.06);
          cursor: pointer;
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          color: var(--gy-navy);
        }
        .brief-check-item input { display: none; }
        .brief-check-box {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(13, 27, 42, 0.35);
          flex-shrink: 0;
          position: relative;
        }
        .brief-check-item input:checked + .brief-check-box {
          background: var(--gy-gold);
          border-color: var(--gy-gold);
        }
        .brief-check-item input:checked + .brief-check-box::after {
          content: "";
          position: absolute;
          top: 1px;
          left: 5px;
          width: 4px;
          height: 8px;
          border: solid var(--gy-navy);
          border-width: 0 1.8px 1.8px 0;
          transform: rotate(45deg);
        }
      `}</style>
    </fieldset>
  );
}

// =================== CardChoice ============================
// Selection cards (used for breakfast style, etc.). Single-select
// when name is shared; multi-select when consumer uses CheckboxGroup.
export function CardChoice({ name, options, register }) {
  return (
    <div className="brief-card-choice">
      {options.map((opt) => (
        <label key={opt.value} className="brief-card">
          <input
            type="radio"
            value={opt.value}
            {...(register ? register(name) : { name })}
          />
          <span className="brief-card__inner">
            <strong>{opt.label}</strong>
            <em>{opt.description}</em>
          </span>
        </label>
      ))}
      <style>{`
        .brief-card-choice {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 22px;
        }
        @media (min-width: 560px) {
          .brief-card-choice { grid-template-columns: 1fr 1fr; }
        }
        .brief-card { display: block; cursor: pointer; }
        .brief-card input { display: none; }
        .brief-card__inner {
          display: block;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.12);
          padding: 16px 16px;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .brief-card input:checked + .brief-card__inner {
          border-color: var(--gy-gold);
          background: rgba(201, 168, 76, 0.06);
        }
        .brief-card__inner strong {
          display: block;
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 17px;
          color: var(--gy-navy);
        }
        .brief-card__inner em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

// =================== Hairline ==============================
export function Hairline() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(13,27,42,0.08)",
        margin: "12px 0 28px",
      }}
    />
  );
}

// =================== SectionTitle ==========================
export function SectionTitle({ kicker, title, italic }) {
  return (
    <header className="brief-section-title">
      {kicker && <div className="brief-section-title__eyebrow">{kicker}</div>}
      <h1>
        {title} {italic && <em>{italic}</em>}
      </h1>
      <div className="brief-section-title__rule" aria-hidden />

      <style>{`
        .brief-section-title { margin-bottom: 26px; }
        .brief-section-title__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .brief-section-title h1 {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 30px;
          margin: 12px 0 0 0;
          line-height: 1.15;
          letter-spacing: -0.3px;
        }
        @media (min-width: 768px) {
          .brief-section-title h1 { font-size: 40px; }
        }
        .brief-section-title h1 em {
          font-style: italic;
          color: var(--gy-gold);
        }
        .brief-section-title__rule {
          width: 56px;
          height: 1px;
          background: var(--gy-gold);
          margin-top: 18px;
          opacity: 0.7;
        }
      `}</style>
    </header>
  );
}

// =================== LikeDislikeMatrix ======================
// Three-column radio matrix (Like / Dislike / Indifferent) over a
// list of food items. Stores as { item: "like" | "dislike" |
// "indifferent" } on a parent object — caller passes `name="food_matrix"`
// and we register child radios as `food_matrix.fish` etc.
//
// items: [{ value: "fish", label: "Fish" }, ...]
export function LikeDislikeMatrix({ name, label, hint, items, register }) {
  return (
    <fieldset className="brief-matrix">
      <legend>
        {label}
        {hint && <em>{hint}</em>}
      </legend>

      <div className="brief-matrix-grid" role="presentation">
        <div className="brief-matrix-head" aria-hidden>
          <span />
          <span>Like</span>
          <span>Dislike</span>
          <span>Indifferent</span>
        </div>
        {items.map((it) => (
          <div key={it.value} className="brief-matrix-row">
            <span className="brief-matrix-label">{it.label}</span>
            {["like", "dislike", "indifferent"].map((v) => (
              <label key={v} className="brief-matrix-cell">
                <input
                  type="radio"
                  value={v}
                  {...(register ? register(`${name}.${it.value}`) : { name: `${name}.${it.value}` })}
                />
                <span className="brief-matrix-dot" aria-hidden />
                <span className="brief-matrix-srlabel">{v}</span>
              </label>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .brief-matrix {
          border: 0;
          padding: 0;
          margin: 0 0 26px 0;
        }
        .brief-matrix legend {
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          margin-bottom: 12px;
          font-weight: 500;
        }
        .brief-matrix legend em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
        .brief-matrix-grid {
          background: rgba(13, 27, 42, 0.04);
          border: 1px solid rgba(13, 27, 42, 0.08);
        }
        .brief-matrix-head,
        .brief-matrix-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          align-items: center;
        }
        .brief-matrix-head {
          background: var(--gy-navy);
          color: var(--gy-ivory);
        }
        .brief-matrix-head span {
          padding: 9px 12px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.85);
          text-align: center;
        }
        .brief-matrix-head span:first-child { text-align: left; }
        .brief-matrix-row {
          background: #ffffff;
          border-top: 1px solid rgba(13, 27, 42, 0.05);
        }
        .brief-matrix-row:first-of-type { border-top: 0; }
        /* 2026-05-20 — Eleanna friend-test: "Είμαι πολύ αχνα" + "δεν
           φαίνονται οι επιλογές που πρέπει να τσεκάρω". Both the row
           labels (food names) and the radio circles were too low-
           contrast for over-40 eyes. Pushed font weight + size up
           on labels; tightened radio border. */
        /* 2026-05-20 — Friend-test pass 3: George flagged the food
           matrix as "πολύ αχνά" — first column labels invisible.
           Pushed font-size 15→16, weight 500→600, removed the
           half-tone navy in favour of full var(--gy-navy). Cell
           padding bumped so labels don't kiss the radio cells. */
        .brief-matrix-label {
          font-family: var(--gy-font-body);
          font-size: 16px;
          font-weight: 600;
          color: var(--gy-navy);
          padding: 14px 16px;
        }
        .brief-matrix-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
          cursor: pointer;
          position: relative;
        }
        .brief-matrix-cell input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .brief-matrix-dot {
          width: 20px;
          height: 20px;
          border: 1.5px solid rgba(13, 27, 42, 0.55);
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          transition: background 140ms ease, border-color 140ms ease;
        }
        .brief-matrix-cell input:checked + .brief-matrix-dot {
          background: var(--gy-gold);
          border-color: var(--gy-gold);
          box-shadow: inset 0 0 0 3px #fff;
        }
        .brief-matrix-cell:hover .brief-matrix-dot {
          border-color: var(--gy-gold);
        }
        .brief-matrix-srlabel {
          position: absolute;
          left: -10000px;
        }
        @media (max-width: 560px) {
          .brief-matrix-head,
          .brief-matrix-row { grid-template-columns: 1.1fr 0.9fr 0.9fr 0.9fr; }
          .brief-matrix-label { font-size: 14px; padding: 10px 10px; }
        }
      `}</style>
    </fieldset>
  );
}

// =================== FrequencyPicker ========================
// 2026-05-20 — Friend-test pass 3 (In the Cellar rework).
//
// George said: "Δεν είναι F&B managers οι πελάτες μας. Μη βάζεις
// τον άλλο να γράψει '16 κοκακόλες'. Βάλε τον να μου πει 'Coca-Cola
// light' και να επιλέξει: το πίνω συχνά / χαλαρά / σπάνια αλλά το
// χρειάζομαι."
//
// So this is a 4-option chip row keyed under a parent (e.g.
// soft_drinks_frequency.coca_cola_light). Stores values from the
// FREQUENCY enum below. The captain reads "often" and lets the
// hostess provision; the user never touches a number.
//
// items: [{ value: "coca_cola_light", label: "Coca-Cola Light" }, ...]
export const FREQUENCY_VALUES = ["often", "sometimes", "rarely", "skip"];
export const FREQUENCY_LABEL = {
  often: "Often",
  sometimes: "Sometimes",
  rarely: "Rarely but keep some",
  skip: "Skip",
};

export function FrequencyPicker({ name, label, hint, items, register }) {
  return (
    <fieldset className="brief-freq">
      <legend>
        {label}
        {hint && <em>{hint}</em>}
      </legend>
      <div className="brief-freq-list">
        {items.map((it) => (
          <div key={it.value} className="brief-freq-row">
            <span className="brief-freq-item">{it.label}</span>
            <div className="brief-freq-chips" role="radiogroup" aria-label={it.label}>
              {FREQUENCY_VALUES.map((v) => (
                <label key={v} className="brief-freq-chip">
                  <input
                    type="radio"
                    value={v}
                    {...(register
                      ? register(`${name}.${it.value}`)
                      : { name: `${name}.${it.value}` })}
                  />
                  <span>{FREQUENCY_LABEL[v]}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .brief-freq {
          border: 0;
          padding: 0;
          margin: 0 0 24px 0;
        }
        .brief-freq legend {
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          margin-bottom: 12px;
          font-weight: 500;
        }
        .brief-freq legend em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
        .brief-freq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .brief-freq-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(13, 27, 42, 0.06);
        }
        .brief-freq-row:last-of-type { border-bottom: 0; }
        .brief-freq-item {
          font-family: var(--gy-font-body);
          font-size: 15.5px;
          font-weight: 600;
          color: var(--gy-navy);
        }
        .brief-freq-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .brief-freq-chip {
          cursor: pointer;
          position: relative;
        }
        .brief-freq-chip input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .brief-freq-chip span {
          display: inline-block;
          padding: 7px 13px;
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 0.6px;
          border: 1px solid rgba(13, 27, 42, 0.2);
          color: var(--gy-navy);
          background: #ffffff;
          transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
        }
        .brief-freq-chip input:checked + span {
          background: var(--gy-gold);
          border-color: var(--gy-gold);
          color: #ffffff;
        }
        .brief-freq-chip:hover span {
          border-color: var(--gy-gold);
        }
      `}</style>
    </fieldset>
  );
}

// =================== LabelQuantityRows ======================
// Repeatable rows for "label" + "quantity" tables (soft drinks,
// spirits, beers). Optional third column for wines (price range).
//
// Uses react-hook-form's useFieldArray so adding, removing, and
// reordering rows keeps RHF's internal state perfectly in sync.
// Without useFieldArray, removing a middle row via local state
// (.filter on a plain array) leaves stale RHF entries behind and
// the next save writes the wrong indices.
//
// startRows controls how many empty rows show on first paint.
// Existing rows from loaded data populate via form.reset() inside
// BriefFormShell — useFieldArray reads from the parent form's
// state automatically.
export function LabelQuantityRows({
  name,
  label,
  hint,
  withPriceRange,
  startRows = 3,
  register,
  control,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Pad the field array up to startRows on first mount so the table
  // shows a useful number of blank rows out of the gate. We can't
  // do this inside useFieldArray's `defaultValues` because the
  // parent form owns defaults — we'd race the reset() that loads
  // server data. Instead, only pad once and only when empty.
  useEffect(() => {
    if (fields.length === 0) {
      for (let i = 0; i < startRows; i++) {
        append({
          label: "",
          quantity: "",
          ...(withPriceRange ? { price_range_per_bottle: "" } : {}),
        }, { shouldFocus: false });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addRow() {
    append({
      label: "",
      quantity: "",
      ...(withPriceRange ? { price_range_per_bottle: "" } : {}),
    }, { shouldFocus: false });
  }
  function removeRow(i) {
    remove(i);
  }

  return (
    <fieldset className="brief-lq">
      <legend>
        {label}
        {hint && <em>{hint}</em>}
      </legend>

      <div className="brief-lq-head" aria-hidden>
        <span>Label</span>
        <span>Quantity</span>
        {withPriceRange && <span>Price range / bottle</span>}
        <span />
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className={"brief-lq-row" + (withPriceRange ? " has-price" : "")}>
          <input
            type="text"
            placeholder={withPriceRange ? "e.g. Ruinart Brut Blanc" : "e.g. Diet Coke cans"}
            {...register(`${name}.${i}.label`)}
          />
          <input
            type="text"
            placeholder={withPriceRange ? "6" : "24"}
            {...register(`${name}.${i}.quantity`)}
          />
          {withPriceRange && (
            <input
              type="text"
              placeholder="150"
              {...register(`${name}.${i}.price_range_per_bottle`)}
            />
          )}
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="brief-lq-remove"
            aria-label="Remove this row"
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" onClick={addRow} className="brief-lq-add">
        + Add another row
      </button>

      <style>{`
        .brief-lq {
          border: 0;
          padding: 0;
          margin: 0 0 26px 0;
        }
        .brief-lq legend {
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          margin-bottom: 10px;
          font-weight: 500;
        }
        .brief-lq legend em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          letter-spacing: 0;
          text-transform: none;
          margin-top: 4px;
        }
        .brief-lq-head {
          display: grid;
          grid-template-columns: 2fr 1fr 36px;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 9px 12px;
          gap: 12px;
        }
        .brief-lq-head span {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.85);
        }
        .brief-lq-row {
          display: grid;
          grid-template-columns: 2fr 1fr 36px;
          gap: 12px;
          padding: 8px 12px;
          background: #fff;
          border-bottom: 1px solid rgba(13, 27, 42, 0.06);
          align-items: center;
        }
        .brief-lq-head:has(~ .brief-lq-row.has-price),
        .brief-lq-row.has-price {
          grid-template-columns: 2fr 0.8fr 1fr 36px;
        }
        .brief-lq-row input {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13, 27, 42, 0.15);
          padding: 6px 0 7px;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          outline: none;
        }
        .brief-lq-row input:focus {
          border-bottom-color: var(--gy-gold);
        }
        .brief-lq-remove {
          background: transparent;
          border: 0;
          color: rgba(13, 27, 42, 0.45);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }
        .brief-lq-remove:hover { color: #b91c1c; }
        .brief-lq-add {
          margin-top: 12px;
          background: transparent;
          border: 1px solid rgba(13, 27, 42, 0.2);
          padding: 10px 18px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-navy);
          cursor: pointer;
        }
        .brief-lq-add:hover { border-color: var(--gy-gold); }
        @media (max-width: 560px) {
          .brief-lq-head,
          .brief-lq-row { grid-template-columns: 1.4fr 1fr 36px; }
          .brief-lq-row.has-price { grid-template-columns: 1fr 0.7fr 0.9fr 36px; }
        }
      `}</style>
    </fieldset>
  );
}
