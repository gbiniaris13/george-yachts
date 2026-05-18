"use client";

// Shared low-level form primitives for the Charter Brief. All
// use plain HTML controls (no shadcn dependency) and are styled
// inline to keep the section pages self-contained.

import { useId } from "react";

// =================== Required dot ===========================
export function RequiredDot({ label = "required" }) {
  return (
    <span className="brief-req" title={label} aria-label={label}>
      ·
      <style>{`
        .brief-req {
          color: var(--gy-gold, #C9A84C);
          font-weight: 700;
          margin-right: 6px;
          font-size: 16px;
          line-height: 1;
        }
      `}</style>
    </span>
  );
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
