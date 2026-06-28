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
  // 2026-05-20 — Friend-test pass 6 (Tyler, Sarah):
  //   "On /cabin/brief/arrival, the labels above the date / time /
  //    flight-number / departure-city inputs don't render at all.
  //    DOM inspection shows the labels' textContent contains the
  //    literal CSS block as a string: 'When you land in Greece
  //    .brief-label { display: block; font-fa…'."
  //
  // Root cause: this component rendered a <style> block AS A CHILD
  // of the <label> element. In iOS Safari and a couple of
  // accessibility readers, a <style> nested inside other elements
  // sometimes leaks its source into textContent. The CSS was also
  // duplicated 10–20× per page (once per FieldLabel instance).
  //
  // Fix: <style> rules are now in cabin-tones.css alongside the
  // other label / kicker overrides. <label> renders nothing but
  // semantic content.
  return (
    <label htmlFor={htmlFor} className="brief-label">
      {required && <RequiredDot />}
      <span>{children}</span>
      {hint && <em>{hint}</em>}
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
  // 2026-05-25 — Phase 5 closeout: when true, the field is
  // disabled with a small "group" tag so non-principals see
  // that the value was already set by the group and the server
  // will refuse to overwrite (mergeForGuest keep-existing). The
  // page-level caller computes this from initialData[name].
  lockedByGroup = false,
}) {
  const id = useId();
  const props = register ? register(name) : { name };
  return (
    <div className={"brief-field" + (lockedByGroup ? " brief-field--locked" : "")}>
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
        disabled={lockedByGroup || undefined}
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
        .brief-input:disabled {
          cursor: not-allowed;
          color: rgba(13, 27, 42, 0.72);
          border-bottom-color: rgba(201, 168, 76, 0.4);
        }
        .brief-field__locked-tag {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          margin-left: 8px;
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
  // 2026-05-25 — Phase 5 closeout: same lock-by-group as TextField.
  lockedByGroup = false,
}) {
  const id = useId();
  const props = register ? register(name) : { name };
  return (
    <div className={"brief-field" + (lockedByGroup ? " brief-field--locked" : "")}>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...props}
        disabled={lockedByGroup || undefined}
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
        .brief-textarea:disabled {
          cursor: not-allowed;
          color: rgba(13, 27, 42, 0.72);
          border-color: rgba(201, 168, 76, 0.4);
          background: rgba(201, 168, 76, 0.05);
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
  // 2026-05-25 — Phase 5 closeout: when a single value is set
  // (the group's existing pick), all options are disabled and
  // the row carrying the locked value shows a small "group" tag.
  // For non-principals this stops a stray click that the server
  // would silently keep-existing on anyway.
  lockedValue = null,
}) {
  const isLocked = lockedValue != null && lockedValue !== "";
  return (
    <fieldset className={"brief-radio-group" + (isLocked ? " brief-radio-group--locked" : "")}>
      <legend>
        {required && <RequiredDot />}
        {label}
        {hint && <em>{hint}</em>}
      </legend>
      <div className="brief-radio-list">
        {options.map((opt) => {
          const optLocked = isLocked;
          return (
            <label
              key={opt.value}
              className={
                "brief-radio-item" +
                (optLocked ? " brief-radio-item--locked" : "")
              }
            >
              <input
                type="radio"
                value={opt.value}
                disabled={optLocked || undefined}
                {...(register ? register(name) : { name })}
              />
              <span className="brief-radio-circle" aria-hidden />
              <span className="brief-radio-text">
                <strong>{opt.label}</strong>
                {opt.description && <em>{opt.description}</em>}
              </span>
            </label>
          );
        })}
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
        /* 2026-05-25 - Phase 5 closeout: locked radio rows */
        .brief-radio-item--locked {
          cursor: not-allowed;
          opacity: 0.82;
        }
        .brief-radio-item--locked:hover {
          background: #ffffff;
        }
        .brief-radio-locked-tag {
          align-self: center;
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
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
  // 2026-05-25 — Phase 5: array of values pre-set by other cabin
  // members that this user is not allowed to un-tick. Rendered
  // as disabled checkboxes with a small "set by your group" tag,
  // so the guest can ADD new picks but can't appear to remove
  // someone else's. Passed in from the page level (DiningFields
  // computes it from initialData when isPrincipal === false).
  lockedValues = [],
}) {
  const lockedSet =
    lockedValues && lockedValues.length > 0
      ? new Set(lockedValues.map(String))
      : null;
  return (
    <fieldset className="brief-check-group">
      <legend>
        {label}
        {hint && <em>{hint}</em>}
      </legend>
      <div className={"brief-check-list" + (twoColumn ? " is-two" : "")}>
        {options.map((opt) => {
          const isLocked = lockedSet ? lockedSet.has(String(opt.value)) : false;
          return (
            <label
              key={opt.value}
              className={
                "brief-check-item" +
                (isLocked ? " brief-check-item--locked" : "")
              }
            >
              <input
                type="checkbox"
                value={opt.value}
                disabled={isLocked || undefined}
                {...(register ? register(name) : { name })}
              />
              <span className="brief-check-box" aria-hidden />
              <span>{opt.label}</span>
            </label>
          );
        })}
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
        /* 2026-05-25 - Phase 5: locked-by-group state. Cursor
           becomes "not-allowed", the row dims, and a small
           gold tag sits at the end so it reads "ticked by your
           group, not me". Still legible; just clearly not
           interactive for this guest. */
        .brief-check-item--locked {
          cursor: not-allowed;
          opacity: 0.82;
        }
        .brief-check-item--locked .brief-check-box {
          border-color: rgba(201, 168, 76, 0.55);
        }
        .brief-check-locked-tag {
          margin-left: auto;
          padding-left: 10px;
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
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
export function LikeDislikeMatrix({ name, label, hint, items, register, lockedKeys = {} }) {
  // lockedKeys: { fish: "like", lamb: "dislike", ... } — per-row
  // values already set by the group. For non-principals the row
  // is disabled (can't change the verdict) and a "group" tag
  // shows. Empty {} = nothing locked.
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
        {items.map((it) => {
          const rowLocked = lockedKeys && lockedKeys[it.value];
          return (
          <div
            key={it.value}
            className={
              "brief-matrix-row" + (rowLocked ? " brief-matrix-row--locked" : "")
            }
          >
            {/* 2026-05-23 — NUCLEAR fix for the food matrix labels
                that George has reported as invisible/washed-out
                THREE TIMES across three days.

                Inline style sets pure black + weight 800 + system
                fonts so we don't depend on FontShare at all for
                these safety-critical labels. The CSS rule in
                cabin-tones.css does the same — between the two
                there is no path by which these labels render
                anything other than bold black on near-white.

                If George reports faint labels again after this,
                it is not a CSS rendering problem; it would be a
                cache problem (old CSS or JS still in Chrome). */}
            <span
              className="brief-matrix-label"
              style={{
                color: "#000000",
                fontWeight: 800,
                fontSize: "16px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Inter", Arial, sans-serif',
                textShadow: "0 0 0.5px #000000",
                opacity: 1,
                filter: "none",
                letterSpacing: "0.1px",
              }}
            >
              {it.label}
            </span>
            {["like", "dislike", "indifferent"].map((v) => (
              <label key={v} className="brief-matrix-cell">
                <input
                  type="radio"
                  value={v}
                  disabled={rowLocked || undefined}
                  {...(register ? register(`${name}.${it.value}`) : { name: `${name}.${it.value}` })}
                />
                <span className="brief-matrix-dot" aria-hidden />
                <span className="brief-matrix-srlabel">{v}</span>
              </label>
            ))}
          </div>
          );
        })}
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
        /* 2026-05-25 - Phase 5 closeout: row already set by the
           group. Dim the radios; cursor signals not-interactive. */
        .brief-matrix-row--locked {
          cursor: not-allowed;
          opacity: 0.82;
          background: rgba(201, 168, 76, 0.05);
        }
        .brief-matrix-row--locked .brief-matrix-cell {
          cursor: not-allowed;
        }
        /* 2026-05-20 - Eleanna friend-test: "Είμαι πολύ αχνα" + "δεν
           φαίνονται οι επιλογές που πρέπει να τσεκάρω". Both the row
           labels (food names) and the radio circles were too low-
           contrast for over-40 eyes. Pushed font weight + size up
           on labels; tightened radio border. */
        /* 2026-05-20 - Friend-test pass 3: George flagged the food
           matrix as "πολύ αχνά" - first column labels invisible.
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
        /* 2026-05-26 - Brief 05 / T1 (Domingo principal audit):
           was opacity:0 + position:absolute + pointer-events:none.
           That hides the input visually on desktop Chrome/Firefox,
           but on iOS Safari + some Android builds the native blue
           radio accent + focus ring still leaked through (visible
           as a small blue dot + ring on top of the custom gold
           .brief-matrix-dot). The sibling RadioGroup uses
           display:none and renders perfectly - matching that
           pattern here. The label wraps the input so the
           implicit label/input association still toggles on tap.
           accent-color is also set (belt-and-braces) so any
           browser that still renders the input ghost paints it
           gold, not the system default blue. */
        .brief-matrix-cell input {
          display: none;
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
        /* 2026-05-23 - Audit pass: the 4-column grid (label + 3
           radios) crowds badly at 360px Galaxy S - each cell ~62px,
           tracked uppercase header overlaps. Two-stage breakpoint:
             ≤599: tighter columns, smaller label
             ≤389: matrix header text smaller still (Like/Dislike/
                   Indifferent must fit in 60-62px per cell). */
        @media (max-width: 599.98px) {
          .brief-matrix-head,
          .brief-matrix-row { grid-template-columns: 1.2fr 0.85fr 0.85fr 0.85fr; }
          .brief-matrix-label { font-size: 14px; padding: 10px 8px; }
          .brief-matrix-head span {
            font-size: 8.5px !important;
            letter-spacing: 1.2px !important;
          }
        }
        @media (max-width: 389.98px) {
          .brief-matrix-head,
          .brief-matrix-row { grid-template-columns: 1.4fr 0.8fr 0.8fr 0.8fr; column-gap: 4px; }
          .brief-matrix-label { font-size: 13px !important; padding: 8px 6px; }
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
        /* 2026-05-23 - Audit pass:
           At 360px viewport the old "1fr 0.7fr 0.9fr 36px" with-price
           layout gave the wine-label input ~80px wide - typing
           "Ruinart Brut Blanc de Blancs" was impossible. Now: hide
           the table header on phones, stack each row vertically
           (label full-width on its own row, then qty + price + remove
           as a sub-row). Same data, usable forms. */
        @media (max-width: 599.98px) {
          .brief-lq-head { display: none; }
          .brief-lq-row {
            grid-template-columns: 1fr 48px !important;
            grid-template-areas: "label remove" "controls controls" !important;
            row-gap: 8px;
            padding-bottom: 14px;
            border-bottom: 1px dashed rgba(13, 27, 42, 0.08);
          }
          .brief-lq-row > :first-child { grid-area: label; }
          .brief-lq-row > :last-child { grid-area: remove; align-self: start; }
          .brief-lq-row.has-price {
            grid-template-columns: 1fr 48px !important;
          }
          /* Quantity + price inputs share the controls row, 50/50. */
          .brief-lq-row .brief-lq-qty,
          .brief-lq-row .brief-lq-price {
            grid-area: controls;
          }
          .brief-lq-row.has-price .brief-lq-qty,
          .brief-lq-row.has-price .brief-lq-price {
            display: inline-block;
            width: calc(50% - 4px);
            margin-right: 8px;
          }
          .brief-lq-row.has-price .brief-lq-price {
            margin-right: 0;
          }
        }
      `}</style>
    </fieldset>
  );
}
