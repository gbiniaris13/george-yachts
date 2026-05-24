"use client";

// app/components/cabin/brief/BriefConfirmCta.jsx
// =============================================================
// 2026-05-24 — Per-member brief confirmation CTA.
//
// Bottom of /cabin/brief overview. Each member (principal +
// guest) sees a Confirm button that toggles their personal
// brief_confirmed_at timestamp. Two states:
//
//   • unconfirmed → big navy "I'm done — confirm my picks"
//     button. Calm explanatory copy above.
//   • confirmed   → green "✓ Confirmed" badge with a quiet
//     "click to revoke" link if the member changes their mind.
//
// Always visible while the brief is unlocked. Hidden by the
// page when brief_submitted_at is set (the page wraps this
// component in `!isSubmitted`).
// =============================================================

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BriefConfirmCta({ confirmedAt }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [localConfirmedAt, setLocalConfirmedAt] = useState(confirmedAt);
  const [error, setError] = useState(null);

  async function toggle() {
    const next = !localConfirmedAt;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/cabin/me/confirm-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ confirmed: next }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        throw new Error(j?.message || "save-failed");
      }
      setLocalConfirmedAt(j.confirmed_at || (next ? new Date().toISOString() : null));
      // Trigger a server-side refresh so the readiness card on
      // /cabin home reflects the new state when the user
      // navigates back.
      router.refresh();
    } catch (e) {
      setError(e?.message || "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const isConfirmed = Boolean(localConfirmedAt);

  return (
    <section
      className={"bcc" + (isConfirmed ? " bcc--confirmed" : "")}
      aria-label="Confirm your brief"
    >
      <div className="bcc__eyebrow">
        {isConfirmed ? "Your brief is confirmed" : "Are you done?"}
      </div>
      <p className="bcc__copy">
        {isConfirmed ? (
          <>
            You&apos;ve marked your brief picks as confirmed. The
            principal charterer sees this on their readiness card
            — the group&apos;s brief unlocks for sending once
            everyone has confirmed. If anything changes, you can
            revoke below and come back to edit.
          </>
        ) : (
          <>
            Add what you want above — your favourite drinks, the
            food you love, anything else for the chef. When you
            feel finished, press Confirm. The brief is shared, so
            everyone in your group does this once each before the
            principal charterer can send it to George.
          </>
        )}
      </p>

      {isConfirmed ? (
        <div className="bcc__row">
          <span className="bcc__badge">✓ Confirmed</span>
          <button
            type="button"
            className="bcc__revoke"
            onClick={toggle}
            disabled={busy}
          >
            {busy ? "Saving…" : "Revoke confirmation"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="bcc__cta"
          onClick={toggle}
          disabled={busy}
        >
          {busy ? "Saving…" : "I'm done — confirm my brief picks"}
        </button>
      )}

      {error && (
        <p className="bcc__err" role="alert">{error}</p>
      )}

      <style jsx global>{`
        .bcc {
          margin: 0;
          padding: 22px 24px 20px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 4px;
        }
        .bcc.bcc--confirmed {
          background: #F5FAF5;
          border-color: rgba(76, 138, 88, 0.55);
          border-left-color: #4C8A58;
        }
        .bcc__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: #0D1B2A;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .bcc--confirmed .bcc__eyebrow { color: #2D5C36; }
        .bcc__copy {
          margin: 0 0 16px 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 14px;
          color: #0D1B2A;
          line-height: 1.6;
        }
        .bcc__cta {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 14px 26px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          min-height: 48px;
          transition: background 160ms ease;
        }
        .bcc__cta:hover:not(:disabled) { background: #142233; }
        .bcc__cta:disabled { opacity: 0.6; cursor: default; }
        .bcc__row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .bcc__badge {
          background: #2D5C36;
          color: #ffffff;
          padding: 10px 18px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 2px;
        }
        .bcc__revoke {
          background: transparent;
          color: rgba(13, 27, 42, 0.6);
          border: 1px solid rgba(13, 27, 42, 0.2);
          padding: 10px 18px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .bcc__revoke:hover:not(:disabled) {
          color: var(--gy-navy);
          border-color: var(--gy-gold);
        }
        .bcc__revoke:disabled { opacity: 0.6; cursor: default; }
        .bcc__err {
          margin: 12px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: #b14a3a;
        }
      `}</style>
    </section>
  );
}
