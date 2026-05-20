"use client";

// Discreet autosave indicator. Mounts bottom-right of any
// brief-section page. Three states: idle, saving, saved.
// No "Save" button anywhere — autosave is the contract.

import { useEffect, useState } from "react";

export default function SaveStatus({ state }) {
  // state = 'idle' | 'saving' | 'saved' | 'error'
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === "saving" || state === "saved" || state === "error") {
      setVisible(true);
      if (state === "saved") {
        const t = setTimeout(() => setVisible(false), 1800);
        return () => clearTimeout(t);
      }
    }
  }, [state]);

  if (!visible && state === "idle") return null;

  // 2026-05-20 — Friend-test fix. The original "Couldn't save —
  // retrying" copy was misleading: the autosave hook does NOT
  // retry; it only re-attempts on the next user edit. Testers
  // saw the message persist for entire sections, assumed the
  // save was actively retrying, then panicked when nothing
  // changed. New copy makes the action explicit ("try again")
  // without sounding like a hard error.
  const label =
    state === "saving"
      ? "Saving…"
      : state === "saved"
        ? "Saved"
        : state === "error"
          ? "Couldn’t save — keep typing to retry"
          : "";

  return (
    <div
      className={
        "cabin-save-status cabin-save-status--" + state +
        (visible ? " is-visible" : "")
      }
      role="status"
      aria-live="polite"
    >
      <span className="cabin-save-status__dot" aria-hidden />
      <span>{label}</span>

      <style>{`
        .cabin-save-status {
          position: fixed;
          bottom: calc(72px + env(safe-area-inset-bottom, 0));
          right: 18px;
          z-index: 22;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 9px 14px 9px 12px;
          border: 1px solid rgba(201, 168, 76, 0.45);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 180ms ease, transform 180ms ease;
          pointer-events: none;
        }
        .cabin-save-status.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (min-width: 768px) {
          .cabin-save-status { bottom: 24px; }
        }
        .cabin-save-status__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gy-gold);
        }
        .cabin-save-status--saving .cabin-save-status__dot {
          animation: cabin-save-pulse 1.1s ease-in-out infinite;
        }
        .cabin-save-status--error .cabin-save-status__dot { background: #E0BA77; }
        @keyframes cabin-save-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50%      { opacity: 1;    transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
