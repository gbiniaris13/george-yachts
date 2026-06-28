// app/components/cabin/InstallNudge.jsx
// =============================================================
// 2026-05-20 — Phase 2 invite-first architecture.
//
// "PWA install" prompt — but warm and unobtrusive. George's
// brief:
//
//   "θέλω όταν μπαίνω μέσα να μπορώ να ξαναμπώ πολύ εύκολα ή να
//    το κατεβάω στο κινητό μου. Να μην με μπερδεύει δηλαδή με
//    email και ξανά email και ξανά βάλ το mail σου και ξανά
//    κάνε confirm γιατί είναι και άνθρωποι που είναι μεγάλης
//    ηλικίας"
//
//   → after first login, offer a one-tap install. Android shows
//     the native beforeinstallprompt; iOS Safari requires the
//     manual share-sheet dance, so we show a labelled card with
//     a Share icon and the line "Tap share, then Add to Home
//     Screen."
//
// Renders client-side. Dismissed state persists in localStorage
// so we don't nag past the first session. Already-installed
// PWAs (display-mode: standalone) suppress the nudge entirely.
// =============================================================
"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "gy:cabin:install-nudge-dismissed-v1";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  // iOS user agents include "iPhone", "iPad", or "iPod". iPadOS 13+
  // can also masquerade as Mac — but those have touch + standalone
  // support, so we accept the false positive.
  return /iP(hone|ad|od)/i.test(navigator.userAgent);
}
function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS-specific:
    window.navigator?.standalone === true
  );
}

export default function InstallNudge() {
  const [show, setShow] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return; // already installed
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // localStorage blocked (private mode etc) — show anyway
    }

    if (isIOS()) {
      // iOS Safari has no beforeinstallprompt — we show a manual
      // hint after a short delay so it doesn't crash the first
      // paint.
      setIosMode(true);
      const t = setTimeout(() => setShow(true), 2200);
      return () => clearTimeout(t);
    }

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  }

  async function onInstall() {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      // Swallow — user dismissed or browser blocked.
    }
    dismiss();
  }

  if (!show) return null;

  return (
    <aside className="gy-install" role="complementary" aria-label="Install The Cabin">
      <button
        type="button"
        className="gy-install__close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
      <div className="gy-install__eyebrow">A small touch</div>
      <h3 className="gy-install__title">Save The Cabin to your phone.</h3>
      {iosMode ? (
        <p className="gy-install__blurb">
          One tap to come back, no more sign-in emails. Tap{" "}
          <span className="gy-install__share" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 4v12" />
              <path d="M8 8l4-4 4 4" />
              <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
            </svg>
          </span>{" "}
          (the Share icon below), then <em>Add to Home Screen</em>.
        </p>
      ) : (
        <p className="gy-install__blurb">
          One tap to come back - no more sign-in emails. Adds a small
          gold anchor to your home screen.
        </p>
      )}
      <div className="gy-install__actions">
        <button type="button" className="gy-install__dismiss" onClick={dismiss}>
          Maybe later
        </button>
        {!iosMode && (
          <button type="button" className="gy-install__cta" onClick={onInstall}>
            Add to home screen
          </button>
        )}
      </div>

      <style jsx>{`
        .gy-install {
          position: relative;
          background: var(--gy-navy, #0D1B2A);
          color: var(--gy-ivory, #F8F5F0);
          border: 1px solid var(--gy-gold, #C9A84C);
          padding: 22px 22px 20px;
          margin-top: 8px;
        }
        /* 2026-05-23 - Audit pass: 4/8 padding + 22px font gave a
           ~30×38px target - below Apple HIG 44px and crowding the
           eyebrow text. Now a true 44×44 with the × centred. */
        .gy-install__close {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 44px;
          height: 44px;
          background: transparent;
          border: 0;
          color: rgba(248, 245, 240, 0.7);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gy-install__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold, #C9A84C);
          font-weight: 500;
        }
        .gy-install__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 22px;
          margin: 8px 0 6px 0;
          color: var(--gy-ivory, #F8F5F0);
        }
        .gy-install__blurb {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(248, 245, 240, 0.8);
          margin: 0 0 14px 0;
        }
        .gy-install__blurb em { font-style: italic; }
        .gy-install__share {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border: 1px solid rgba(248, 245, 240, 0.45);
          color: rgba(248, 245, 240, 0.85);
          vertical-align: middle;
          margin: 0 2px;
        }
        .gy-install__actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .gy-install__dismiss {
          background: transparent;
          border: 0;
          color: rgba(248, 245, 240, 0.65);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 11px 0;
          cursor: pointer;
        }
        .gy-install__cta {
          background: var(--gy-gold, #C9A84C);
          color: var(--gy-navy, #0D1B2A);
          border: 0;
          padding: 12px 22px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 600;
        }
        .gy-install__cta:hover { filter: brightness(1.05); }
      `}</style>
    </aside>
  );
}
