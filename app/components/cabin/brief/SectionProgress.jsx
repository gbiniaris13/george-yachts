"use client";

// app/components/cabin/brief/SectionProgress.jsx
// =============================================================
// 2026-05-25 — Phase 6.
//
// Angeliki on her test pass: "θέλουμε τα βήματα να τους οδηγάμε
// όλους να ξέρουν ακριβώς τι κάνουν και μετά να ξέρουν ακριβώς
// προχωράνε, είτε με save είτε με next."
//
// Each brief section already shows a textual kicker
// ("Section Six · At the Table"), but mid-form the user loses
// the sense of "where am I" + "how far to go". This component
// renders a small boutique strip at the top of every brief
// section page: gold "STEP X OF Y" caps + a row of small dots
// (one filled per completed step, current step ringed). The
// strip is sticky-ish (no JS scrolling logic — just a quiet
// header card with the same boutique aesthetic as the rest of
// the cabin). Adds no extra interaction, just orientation.
//
// Pure presentation. Caller passes `stepNumber`, `stepTotal`,
// and `stepLabel`. We assume current-step centered, prior
// filled, future hollow.
// =============================================================

export default function SectionProgress({ stepNumber, stepTotal, stepLabel }) {
  if (
    !Number.isFinite(stepNumber) ||
    !Number.isFinite(stepTotal) ||
    stepTotal < 1
  ) {
    return null;
  }
  const dots = Array.from({ length: stepTotal }, (_, i) => {
    const idx = i + 1;
    if (idx < stepNumber) return "filled";
    if (idx === stepNumber) return "current";
    return "empty";
  });
  return (
    <aside className="section-progress" aria-label={`Step ${stepNumber} of ${stepTotal}`}>
      <div className="section-progress__row">
        <span className="section-progress__eyebrow">
          Step {String(stepNumber).padStart(2, "0")} of {String(stepTotal).padStart(2, "0")}
        </span>
        {stepLabel && (
          <span className="section-progress__divider" aria-hidden>·</span>
        )}
        {stepLabel && (
          <span className="section-progress__label">{stepLabel}</span>
        )}
      </div>
      <ol className="section-progress__dots" aria-hidden>
        {dots.map((kind, i) => (
          <li key={i} className={`section-progress__dot section-progress__dot--${kind}`} />
        ))}
      </ol>
      <style>{`
        .section-progress {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
          margin: 0 0 20px 0;
        }
        .section-progress__row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .section-progress__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 700;
        }
        .section-progress__divider {
          color: rgba(13, 27, 42, 0.3);
          font-size: 11px;
        }
        .section-progress__label {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          color: var(--gy-navy);
          letter-spacing: 0.2px;
        }
        .section-progress__dots {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .section-progress__dot {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(13, 27, 42, 0.12);
          border: 1px solid transparent;
        }
        .section-progress__dot--filled {
          background: var(--gy-gold);
        }
        .section-progress__dot--current {
          background: var(--gy-gold);
          border: 1px solid var(--gy-navy);
          box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.25);
          width: 10px;
          height: 10px;
        }
        @media (max-width: 480px) {
          .section-progress {
            padding: 10px 14px;
          }
          .section-progress__eyebrow {
            font-size: 10px;
            letter-spacing: 2.3px;
          }
          .section-progress__label {
            font-size: 13px;
          }
        }
      `}</style>
    </aside>
  );
}
