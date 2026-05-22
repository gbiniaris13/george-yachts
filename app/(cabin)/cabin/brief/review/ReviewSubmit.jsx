"use client";

// app/(cabin)/cabin/brief/review/ReviewSubmit.jsx
// =============================================================
// 2026-05-22 — The "Send to George" client-side island.
//
// Triggers the modal confirmation, fires POST /api/cabin/brief/
// submit, then refreshes the page so the locked banner takes
// over. The server page does the heavy work of read-only
// rendering; this component only owns the submit interaction.
// =============================================================

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewSubmit({
  vesselName,
  completionPercent,
  allDone,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function confirm() {
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/cabin/brief/submit", { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        throw new Error(j?.message || j?.error || `status ${r.status}`);
      }
      // Refresh — server-rendered submitted state will take over.
      router.refresh();
      // Navigate back to the overview so the locked banner is
      // the first thing they see.
      setTimeout(() => router.push("/cabin/brief"), 300);
    } catch (e) {
      setError(e?.message || "Could not send the brief — try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="cbr-submit">
      {!allDone && (
        <p className="cbr-submit__hint">
          {completionPercent
            ? `Your brief is ${completionPercent}% complete. Some sections still have blanks. You can still send it — George will read what's here and follow up if anything is missing.`
            : "Some sections still have blanks. You can still send it — George will read what's here and follow up if anything is missing."}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cbr-submit__cta"
      >
        Send to George →
      </button>
      <p className="cbr-submit__after">
        Once you send, only George can re-open the brief.
      </p>

      {open && (
        <div
          className="cbr-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cbr-modal-title"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="cbr-modal__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cbr-modal__eyebrow">One last look</div>
            <h3 className="cbr-modal__title" id="cbr-modal-title">
              Ready to send the brief to George?
            </h3>
            <p className="cbr-modal__copy">
              Once you send, the brief for{" "}
              <strong>{vesselName || "your cabin"}</strong> is locked.
              Guests can no longer edit. Make sure everyone in your group
              has had a chance to weigh in. If something changes, write to
              George — he can reopen the brief for everyone.
            </p>
            {error && (
              <p className="cbr-modal__error">
                <strong>Couldn&apos;t send:</strong> {error}
              </p>
            )}
            <div className="cbr-modal__actions">
              <button
                type="button"
                className="cbr-modal__cancel"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Go back
              </button>
              <button
                type="button"
                className="cbr-modal__confirm"
                onClick={confirm}
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send it — I'm sure"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cbr-submit {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          margin-top: 8px;
          padding: 24px 24px 24px 24px;
          background: rgba(201, 168, 76, 0.08);
          border: 1px solid rgba(201, 168, 76, 0.5);
          border-left: 3px solid var(--gy-gold);
        }
        .cbr-submit__hint {
          margin: 0 0 4px 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(13, 27, 42, 0.7);
        }
        .cbr-submit__cta {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 14px 24px;
          border: 1px solid var(--gy-gold);
          cursor: pointer;
          transition: background 160ms ease, color 160ms ease;
        }
        .cbr-submit__cta:hover {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }
        .cbr-submit__after {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.5);
          margin: 0;
        }

        .cbr-modal {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(13, 27, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .cbr-modal__inner {
          background: #ffffff;
          max-width: 520px;
          width: 100%;
          padding: 28px 28px 24px 28px;
          border: 1px solid rgba(13, 27, 42, 0.18);
        }
        .cbr-modal__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .cbr-modal__title {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 22px;
          margin: 8px 0 14px 0;
          color: var(--gy-navy);
          line-height: 1.25;
        }
        .cbr-modal__copy {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.78);
          margin: 0 0 20px 0;
        }
        .cbr-modal__error {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: #b91c1c;
          background: rgba(185, 28, 28, 0.06);
          padding: 10px 12px;
          margin: 0 0 16px 0;
          border-left: 3px solid #b91c1c;
        }
        .cbr-modal__actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .cbr-modal__cancel {
          background: transparent;
          color: var(--gy-navy);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 11px 18px;
          border: 1px solid rgba(13, 27, 42, 0.2);
          cursor: pointer;
        }
        .cbr-modal__confirm {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 22px;
          border: 1px solid var(--gy-gold);
          cursor: pointer;
        }
        .cbr-modal__confirm:hover {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }
        .cbr-modal__confirm:disabled,
        .cbr-modal__cancel:disabled {
          opacity: 0.6;
          cursor: wait;
        }
      `}</style>
    </div>
  );
}
