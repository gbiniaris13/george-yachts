"use client";

// 2026-08-19 (design pass, job 5) — reCAPTCHA stops loading on pages nobody
// fills in a form on.
//
// It used to sit in layout.jsx as a plain <Script strategy="lazyOnload">, so
// every page of the site fetched Google's enterprise.js. Measured on the live
// homepage on 19/8 it was 313 KB, the fifth heaviest thing there, behind only
// the hero video, the ambient track, the logo and one poster. A visitor who
// reads an article and leaves pays for it and never touches a form.
//
// It cannot simply be dropped from the homepage, which is what the original
// note on this job assumed. ContactFormSection renders there, and on 25 other
// pages, so the homepage does have a form; it is just below the fold.
//
// So the trigger moves from "the page loaded" to "a form is about to be
// used", which is the only moment the token is worth anything:
//
//   focusin on any input, textarea or select   the visitor started typing
//   the gy:recaptcha-needed event               a modal opened
//
// Timing is comfortable. Nobody types a name, an email and a message in under
// a second, and Google's script is a single request against a warm CDN. The
// modal fires the event the moment it opens, before the first keystroke.
//
// And if it somehow is not ready in time, nothing is lost: all three forms
// send without a token and /api/inquiry flags the lead as unverified rather
// than refusing it. That is the standing rule, forms never lose leads.
//
// The script id stays "recaptcha-script" so anything that looked for it still
// finds it.

import { useEffect } from "react";

export default function RecaptchaOnDemand({ siteKey }) {
  useEffect(() => {
    if (!siteKey || typeof document === "undefined") return;
    if (document.getElementById("recaptcha-script")) return;

    let loaded = false;

    // 2026-08-19 — three input events, not one, and the reason is worth
    // keeping. The first version listened only for focusin, and while
    // verifying it the field became document.activeElement and focusin never
    // fired, because the window did not hold the operating system's focus.
    // That was a quirk of the test browser, but it makes the point: focus is
    // the most easily suppressed of the three. A tap fires pointerdown, a
    // keyboard user fires keydown, and either arrives whatever the window
    // manager thinks. Any one of them is enough, and load() is idempotent.
    const FIELD = /^(INPUT|TEXTAREA|SELECT)$/;
    const onInput = (e) => {
      const t = e.target;
      if (!t || !t.tagName) return;
      if (FIELD.test(t.tagName) || (t.closest && t.closest("form"))) load();
    };

    const cleanup = () => {
      for (const ev of ["focusin", "pointerdown", "keydown"]) {
        document.removeEventListener(ev, onInput, true);
      }
      window.removeEventListener("gy:recaptcha-needed", load);
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();
      if (document.getElementById("recaptcha-script")) return;
      const s = document.createElement("script");
      s.id = "recaptcha-script";
      s.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
      s.async = true;
      document.head.appendChild(s);
    }

    // Capture phase, because a handler inside a form must not be able to stop
    // this one from seeing the event.
    for (const ev of ["focusin", "pointerdown", "keydown"]) {
      document.addEventListener(ev, onInput, true);
    }
    window.addEventListener("gy:recaptcha-needed", load);
    return cleanup;
  }, [siteKey]);

  return null;
}
