// /cabin/time-capsule — touch ③
"use client";

import { useEffect, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function TimeCapsulePage() {
  const [capsule, setCapsule] = useState(undefined); // undefined = loading
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/cabin/time-capsule")
      .then((r) => r.json())
      .then((j) => setCapsule(j.capsule ?? null))
      .catch(() => setCapsule(null));
  }, []);

  async function onSeal(e) {
    e.preventDefault();
    if (draft.trim().length < 4) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/cabin/time-capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: draft }),
      });
      const j = await r.json();
      if (j.ok) {
        setCapsule(j.capsule);
      } else {
        setError("Could not seal that just now. Please try again in a moment.");
      }
    } catch {
      setError("Could not reach the Cabin. Check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article>
      <SectionTitle
        kicker="A small ritual, before you sail"
        title="The voyage"
        italic="time capsule."
      />
      <IntroParagraph>
        Write one short paragraph to yourself — anything from a single
        sentence to a few lines. Why are you sailing this week? What are you
        hoping to find, to leave behind, to remember? We seal it in your
        Cabin, and return it to you, quietly, six months from today.
      </IntroParagraph>

      {capsule === undefined && (
        <div className="tc-skel">
          <div /><div /><div />
          <style jsx>{`
            .tc-skel { margin-top: 28px; display: flex; flex-direction: column; gap: 8px; }
            .tc-skel > div {
              height: 14px;
              background: linear-gradient(90deg, rgba(13,27,42,0.06) 25%, rgba(13,27,42,0.12) 37%, rgba(13,27,42,0.06) 63%);
              background-size: 400% 100%;
              animation: shimmer 1.4s infinite;
            }
            @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
          `}</style>
        </div>
      )}

      {capsule === null && (
        <form className="tc-form" onSubmit={onSeal}>
          <textarea
            rows={7}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="A few lines, in your own voice. Nobody else will read this — not even me."
            className="tc-textarea"
            maxLength={4000}
          />
          <div className="tc-form__row">
            <span className="tc-form__hint">
              {draft.length > 0 ? `${draft.length} characters` : "Take your time."}
            </span>
            <button type="submit" disabled={submitting || draft.trim().length < 4}>
              {submitting ? "Sealing…" : "Seal in my Cabin"}
            </button>
          </div>
          {error && (
            <p className="tc-form__err" role="alert">{error}</p>
          )}
        </form>
      )}

      {capsule && capsule.id && (
        <section className="tc-sealed">
          <div className="tc-sealed__label">Sealed</div>
          <p className="tc-sealed__date">
            On <strong>{fmtDate(capsule.sealed_at)}</strong>
          </p>
          <p className="tc-sealed__return">
            We will return this to you on{" "}
            <strong>{fmtDate(capsule.reveal_at)}</strong> — a quiet email from
            George, with the paragraph below in your own words.
          </p>
          <details className="tc-sealed__peek">
            <summary>Show me what I wrote</summary>
            <blockquote>{capsule.message}</blockquote>
          </details>
        </section>
      )}

      <style>{`
        .tc-form {
          margin-top: 28px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 18px 18px 16px;
        }
        .tc-textarea {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 17px;
          line-height: 1.75;
          color: var(--gy-navy);
          outline: none;
          resize: vertical;
          min-height: 180px;
        }
        .tc-textarea::placeholder {
          color: rgba(13,27,42,0.35);
        }
        .tc-form__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(13,27,42,0.08);
        }
        .tc-form__hint {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.45);
        }
        .tc-form__err {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 12px 0 0 0;
        }
        /* 2026-05-26 — Brief 04 / T6 (Domingo guest audit): "SEAL IN
           MY CABIN" looked dead — pale grey text on a medium grey
           button. Root cause: when the textarea is empty (the
           default state on page load), the button is disabled
           and previous styling was just opacity 0.55 on the
           navy CTA, which read as a broken button rather than a
           form gate. Now: two distinct visual states.
             • Disabled (no content): cream ghost outline, muted
               navy text, "wait for content" cursor.
             • Enabled (≥4 chars typed): full navy CTA with gold
               border + ivory text — the brand's primary action
               style, matching "NEXT: PRIVATE NOTES" / "ADD PHOTOS".
           Behaviour untouched. */
        .tc-form__row button {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 11px 22px;
          border: 1px solid var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
        }
        .tc-form__row button:hover:not(:disabled) {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }
        .tc-form__row button:disabled {
          background: transparent;
          color: rgba(13, 27, 42, 0.42);
          border-color: rgba(13, 27, 42, 0.18);
          cursor: not-allowed;
          opacity: 1;
        }

        .tc-sealed {
          margin-top: 28px;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 28px 24px;
          position: relative;
        }
        .tc-sealed__label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          color: var(--gy-gold);
          text-transform: uppercase;
        }
        .tc-sealed__date {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 22px;
          margin: 12px 0 4px;
        }
        .tc-sealed__return {
          font-family: var(--gy-font-body);
          font-size: 14px;
          color: rgba(248,245,240,0.78);
          line-height: 1.7;
        }
        .tc-sealed__peek {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(201,168,76,0.25);
        }
        .tc-sealed__peek summary {
          cursor: pointer;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          color: var(--gy-gold);
          text-transform: uppercase;
        }
        .tc-sealed__peek blockquote {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(248,245,240,0.85);
          margin: 14px 0 0 0;
          padding-left: 12px;
          border-left: 1px solid var(--gy-gold);
        }
      `}</style>
    </article>
  );
}
