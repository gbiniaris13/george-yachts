// app/(cabin)/cabin/install/page.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 3.
//
// George: "Δεν είδα κουμπί να βάλω την Καμπίνα στο κινητό."
//
// The PWA install card on /cabin home is dismissible and easy to
// miss. This dedicated page is reachable from a "Add to phone"
// tile in the Cabin map — it always works, regardless of dismiss
// state, and shows platform-aware instructions.
//
//   - Android Chrome / Edge → fires beforeinstallprompt, we
//     install in one tap via the native sheet.
//   - iOS Safari → no programmatic API. We render the share-sheet
//     instructions with an inline icon.
//   - Desktop Chrome / Edge → also install in one tap (handy for
//     George's own laptop usage).
//   - Anything else (Firefox iOS, Brave iOS, etc.) → manual
//     bookmark prompt.
// =============================================================
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

function detectPlatform() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iP(hone|ad|od)/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator?.standalone === true
  );
}

export default function CabinInstallPage() {
  const [platform, setPlatform] = useState("unknown");
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onAppInstalled() {
      setInstalled(true);
      setOutcome("installed");
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function onInstallTap() {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setOutcome(choice?.outcome === "accepted" ? "installed" : "dismissed");
      setDeferredPrompt(null);
    } catch {
      setOutcome("error");
    }
  }

  if (installed) {
    return (
      <article>
        <SectionTitle
          kicker="The Cabin on your phone"
          title="Already"
          italic="installed."
        />
        <IntroParagraph>
          You’re browsing The Cabin in installed mode — the icon is already
          on your home screen. Open from there next time and you skip the
          sign-in email entirely.
        </IntroParagraph>
        <Link href="/cabin" className="install-back">← Back to your Cabin</Link>
        <style jsx>{styles}</style>
      </article>
    );
  }

  // 2026-05-20 — Friend-test pass 4 (Tyler, Sarah): platform
  // detection was misfiring (UA sniffing fails when devtools
  // emulate a phone size with desktop UA). Result: only "ON YOUR
  // LAPTOP" rendered on real phones. Fix: ALWAYS render all three
  // platform blocks — the user picks their own. No UA sniffing
  // dependency for the most critical conversion surface in the
  // product. The `deferredPrompt` wiring still works for Android
  // Chrome since the beforeinstallprompt listener attaches
  // unconditionally above.
  return (
    <article>
      <SectionTitle
        kicker="The Cabin on your phone"
        title="Save it to"
        italic="your home screen."
      />
      <IntroParagraph>
        One tap to come back next time — no more sign-in emails on this
        device. Pick the section below that matches your phone.
      </IntroParagraph>

      {/* Reorder so iPhone (~60% of UHNW guests) is first.
          All three blocks always shown — no UA sniffing. */}
      {/* iPhone — Safari (manual, but the most common case) */}
      <section className="install-card">
        <div className="install-eyebrow">iPhone · Safari</div>
        <p>
          Safari on iPhone doesn’t offer a one-tap install button —
          Apple’s rules. The good news: it takes three taps.
        </p>
        <ol className="install-steps">
          <li>
            At the bottom of Safari, tap the share icon{" "}
            <span className="install-share" aria-hidden>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 4v12" />
                <path d="M8 8l4-4 4 4" />
                <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
              </svg>
            </span>{" "}
            (the box with the arrow pointing up).
          </li>
          <li>
            Scroll down the share sheet and tap{" "}
            <em>Add to Home Screen</em>.
          </li>
          <li>
            Confirm the name (we suggest <em>The Cabin</em>) and tap{" "}
            <em>Add</em>.
          </li>
        </ol>
        <p className="install-note">
          <em>
            Tip: if you opened this in a different browser (Chrome,
            Firefox, Brave), iOS won’t let those install apps — only
            Safari can. Open the magic-link email in Safari first.
          </em>
        </p>
      </section>

      {/* Android — Chrome / Edge (one-tap when beforeinstallprompt
          has fired, manual three-step otherwise). */}
      <section className="install-card">
        <div className="install-eyebrow">Android · Chrome or Edge</div>
        {deferredPrompt ? (
            <>
              <p>
                Tap the button below. Your browser will ask once whether
                to add The Cabin to your home screen — confirm, and you’re
                done.
              </p>
              <button
                type="button"
                className="install-cta"
                onClick={onInstallTap}
              >
                Add to home screen
              </button>
              {outcome === "installed" && (
                <p className="install-ok">
                  Installed. Look for the gold anchor icon on your home screen.
                </p>
              )}
              {outcome === "dismissed" && (
                <p className="install-note">
                  No problem — you can come back and tap the button any time.
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                Your browser hasn’t offered the one-tap install yet — it
                usually does after a moment’s use. In the meantime you can
                still install manually:
              </p>
              <ol className="install-steps">
                <li>Tap the three-dot menu in the top right of Chrome.</li>
                <li>
                  Choose <em>Add to Home screen</em> (or <em>Install app</em>).
                </li>
                <li>Confirm the name and tap <em>Add</em>.</li>
              </ol>
            </>
          )}
      </section>

      {/* Desktop — Chrome / Edge / Arc. Shown for everyone since
          UA sniffing isn't reliable; the user just ignores blocks
          that aren't theirs. */}
      <section className="install-card">
        <div className="install-eyebrow">On your laptop</div>
          {deferredPrompt ? (
            <>
              <p>
                Chrome or Edge can install The Cabin like an app on your
                desktop too — it opens in its own window with no browser
                tabs around it. Useful when you’re reviewing a charter.
              </p>
              <button
                type="button"
                className="install-cta"
                onClick={onInstallTap}
              >
                Install on this computer
              </button>
            </>
          ) : (
            <>
              <p>
                Most desktop install of The Cabin happens via the small
                icon in your address bar — look for a tile-shaped icon
                next to the URL.
              </p>
              <p className="install-note">
                <em>
                  Firefox and Safari on macOS don’t support installing
                  websites as apps. Chrome, Edge and Arc all do.
                </em>
              </p>
            </>
          )}
      </section>

      <Link href="/cabin" className="install-back">← Back to your Cabin</Link>

      <style jsx>{styles}</style>
    </article>
  );
}

const styles = `
  .install-card {
    background: #ffffff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    padding: 22px 22px 20px 22px;
    margin: 22px 0;
  }
  .install-eyebrow {
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gy-gold);
    font-weight: 500;
    margin-bottom: 14px;
  }
  .install-card p {
    font-family: var(--gy-font-editorial);
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--gy-navy);
    margin: 0 0 14px 0;
  }
  .install-card p.install-note,
  .install-card .install-note {
    color: rgba(13, 27, 42, 0.55);
    font-style: italic;
    font-size: 13px;
  }
  .install-cta {
    background: var(--gy-navy);
    color: var(--gy-ivory);
    border: 1px solid var(--gy-gold);
    padding: 13px 26px;
    font-family: var(--gy-font-ui);
    font-size: 11px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    cursor: pointer;
  }
  .install-cta:hover { background: #142233; }
  .install-ok {
    color: #2f7d3a;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 14px;
    margin-top: 12px;
  }
  .install-steps {
    margin: 0 0 14px 0;
    padding-left: 20px;
    font-family: var(--gy-font-editorial);
    font-size: 14.5px;
    line-height: 1.7;
    color: var(--gy-navy);
  }
  .install-steps li {
    margin-bottom: 8px;
  }
  .install-steps em {
    font-style: italic;
    font-weight: 500;
    color: var(--gy-navy);
  }
  .install-share {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(13, 27, 42, 0.3);
    color: var(--gy-navy);
    vertical-align: middle;
    margin: 0 2px;
  }
  .install-back {
    display: inline-block;
    margin-top: 16px;
    font-family: var(--gy-font-ui);
    font-size: 10.5px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(13, 27, 42, 0.55);
    text-decoration: none;
  }
  .install-back:hover { color: var(--gy-navy); }
`;
