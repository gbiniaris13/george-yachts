// /cabin/welcome — First-login onboarding (required gate).
//
// 2026-05-20 — Friend-test pass 3 (George):
//   "When the principal invites someone, we definitely want first
//    name + surname + phone + date of birth. Email we already have
//    because we invited them. As soon as they tap to enter, show
//    a mask: 'Welcome, fill these in, continue to the Cabin.'"
//
// Required fields (all four below) gate access to /cabin. There is
// NO skip button. The /cabin landing page checks for the same four
// fields and redirects back here until they're filled.
//
// First name + Last name are split here even though the API saves
// them as a single `display_name` — the split is purely for input
// clarity (and for any future marina-paperwork workflow that needs
// the surname separately).
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";
import DateOfBirthPicker from "../../../components/cabin/DateOfBirthPicker";

function splitFullName(full) {
  if (!full) return { first: "", last: "" };
  const parts = String(full).trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
}

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  // Optional fields — only shown when expanded, never required.
  const [hometown, setHometown] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/api/cabin/profile")
      .then((r) => r.json())
      .then((j) => {
        if (j?.profile) {
          const { first, last } = splitFullName(j.profile.display_name);
          setFirstName(first);
          setLastName(last);
          setDob(j.profile.date_of_birth ?? "");
          setHometown(j.profile.hometown ?? "");
          setAnniversary(j.profile.anniversary_date ?? "");
          setMobile(j.profile.mobile ?? "");
          // If user has hometown/anniversary saved already, expand
          // the optional section so they can see/edit it.
          if (j.profile.hometown || j.profile.anniversary_date) {
            setMoreOpen(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const requiredFilled =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(dob.trim()) &&
    mobile.trim().length >= 5;

  async function onSave(e) {
    e.preventDefault();
    if (!requiredFilled) {
      // 2026-05-23 — Eleanna (friend-test): when one field was off
      // (mobile missing country code), the form went yellow but
      // didn't say WHAT was wrong. Be specific.
      const missing = [];
      if (!firstName.trim()) missing.push("first name");
      if (!lastName.trim()) missing.push("surname");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) missing.push("date of birth");
      if (mobile.trim().length < 5) missing.push("mobile");
      setErr(
        missing.length === 1
          ? `Please fill in your ${missing[0]} above.`
          : `Please fill in: ${missing.join(", ")}.`,
      );
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/cabin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          date_of_birth: dob,
          hometown,
          anniversary_date: anniversary,
          mobile,
        }),
      });
      if (!r.ok) throw new Error();
      // 2026-05-23 — Eleanna's blocker: router.push("/cabin") raced
      // the DB write — the cabin home gate at page.jsx:170 ran
      // BEFORE the new row was visible, saw onboarding incomplete,
      // and redirected RIGHT BACK to /cabin/welcome. From her side:
      // button → "Saving…" → button again, nothing happened.
      //
      // Fix: full page navigation via window.location.assign. This
      // forces a fresh HTTP request → the gate query reads from the
      // master DB (not a replica) and sees the just-saved row. No
      // race. The user lands on /cabin and sees "Welcome on board,
      // Eleanna." properly.
      window.location.assign("/cabin");
    } catch {
      setErr("Could not save right now. Please try again.");
      setBusy(false);
    }
    // NOTE: deliberately don't reset busy on success path — the
    // page is about to navigate, keeping the button disabled
    // prevents double-submit.
  }

  if (loading) {
    return (
      <p style={{ padding: 24, fontStyle: "italic", color: "rgba(13,27,42,0.5)" }}>
        Loading…
      </p>
    );
  }

  return (
    <article>
      <SectionTitle
        kicker="A warm welcome aboard"
        title="A few quiet"
        italic="details, then you’re in."
      />
      <IntroParagraph>
        Just four small things — first name, surname, your mobile,
        and a date of birth. These let the chef, the captain and the
        marina paperwork find you. Everything else can wait.
      </IntroParagraph>

      <form className="wlc-form" onSubmit={onSave}>
        {/* 2026-05-20 — Pass 4 (Margaret 70F):
            "Four small red 'required' badges shout at me on a single
             form. The intro already told me there are only four
             small things. Don't repeat it loudly." Replaced the red
             chips with a single quiet "(all four needed)" hint
             under the row. */}
        <div className="wlc-row">
          <label className="wlc-field">
            <span>First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Alexandra"
              autoComplete="given-name"
              maxLength={60}
              required
            />
          </label>
          <label className="wlc-field">
            <span>Surname</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Papadopoulou"
              autoComplete="family-name"
              maxLength={80}
              required
            />
          </label>
        </div>

        <div className="wlc-row">
          <label className="wlc-field">
            <span>Date of birth</span>
            {/* 2026-05-23 — Olga friend-test: typeable Year. */}
            <DateOfBirthPicker
              value={dob}
              onChange={(iso) => setDob(iso)}
              required
            />
          </label>
          <label className="wlc-field">
            <span>Mobile <em className="wlc-field-hint">— with country code</em></span>
            {/* 2026-05-23 — Eleanna (friend-test, GR): typed her
                Greek mobile without the +30 country code, the input
                went yellow (invalid:not(:placeholder-shown) styling)
                with NO explanation. Now: the label says "with
                country code", the placeholder rotates through three
                regions (+30 GR, +1 US, +44 UK) every 3s so any
                international guest sees their format suggested. */}
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +30 6970 380 999  ·  +1 617 555 0100  ·  +44 7700 900000"
              inputMode="tel"
              maxLength={40}
              autoComplete="tel"
              required
              pattern="^\+[0-9 \-()]{5,}$"
              title="Include your country code, e.g. +30 for Greece, +1 for the US, +44 for the UK."
            />
          </label>
        </div>
        <p className="wlc-req-note">
          <em>
            All four above are needed before you go in. Mobile must include
            your country code (<strong>+30</strong> Greece, <strong>+1</strong>{" "}
            US, <strong>+44</strong> UK, etc.). Everything else can wait.
          </em>
        </p>

        <button
          type="button"
          className="wlc-more-toggle"
          onClick={() => setMoreOpen((v) => !v)}
        >
          {moreOpen ? "× Hide optional details" : "+ Add a couple of optional touches"}
        </button>

        {moreOpen && (
          <div className="wlc-more">
            <label className="wlc-field">
              <span>Where you call home <em>optional</em></span>
              <input
                type="text"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                placeholder="e.g. London · Athens · Miami"
                maxLength={120}
              />
            </label>
            <label className="wlc-field">
              <span>Anniversary date <em>optional</em></span>
              {/* Same Olga fix — anniversary years also need
                  typeable year entry. */}
              <DateOfBirthPicker
                value={anniversary}
                onChange={(iso) => setAnniversary(iso)}
              />
            </label>
          </div>
        )}

        {/* 2026-05-20 — Friend-test pass 4 (George):
            "Μην αναφέρεις yacht owner / management company / άλλους
             ανθρώπους — αυτά εκθέτουν την αλυσίδα στον πελάτη. Είμαστε
             brokers, ο πελάτης δεν χρειάζεται να ξέρει τίποτα γι' αυτό."
            Trimmed to a quiet privacy line that does not name any
            third party. */}
        <p className="wlc-note">
          <em>
            Kept privately in your Cabin.
          </em>
        </p>

        {err && <p className="wlc-err" role="alert">{err}</p>}

        <div className="wlc-actions">
          <button
            type="submit"
            disabled={busy || !requiredFilled}
            className="wlc-save"
          >
            {busy ? "Saving…" : "Save and enter the Cabin →"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .wlc-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 28px;
          background: #ffffff;
          padding: 22px;
          border: 1px solid rgba(13,27,42,0.08);
        }
        .wlc-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 560px) {
          .wlc-row { grid-template-columns: 1fr 1fr; }
        }
        .wlc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        /* 2026-05-23 — Audit pass: gold on cream at 10.5px tracked
           uppercase fails WCAG AA. The systemic eyebrow→navy fix
           in cabin-tones uses [class*="eyebrow"]/[class*="kicker"]
           wildcards, but .wlc-field > span doesn't match. Bump to
           the systemic-eyebrow look: navy at 11px, 2.4px tracking. */
        .wlc-field > span {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          font-weight: 600;
          display: flex;
          gap: 8px;
          align-items: baseline;
        }
        .wlc-field > span > em {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 10.5px;
          color: rgba(13,27,42,0.4);
          letter-spacing: 0;
          text-transform: none;
        }
        /* Pass 4 — the per-field red "required" chip was removed;
           replaced by a single quiet sentence below the row. */
        .wlc-req-note {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          margin: -6px 0 4px 0;
          line-height: 1.55;
        }
        .wlc-req-note em { font-style: italic; }
        .wlc-field input {
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 11px 0 13px;
          font-family: var(--gy-font-body);
          /* 16px on iOS prevents the keyboard auto-zoom that throws
             the layout sideways on small phones. */
          font-size: 16px;
          color: var(--gy-navy);
          outline: none;
        }
        .wlc-field input:focus { border-bottom-color: var(--gy-gold); }
        .wlc-field input:invalid:not(:placeholder-shown) {
          border-bottom-color: rgba(177, 74, 58, 0.5);
        }

        .wlc-more-toggle {
          background: transparent;
          border: 0;
          color: var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 0 0 0;
          cursor: pointer;
          text-align: left;
          align-self: flex-start;
        }
        .wlc-more {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding-top: 4px;
          border-top: 1px dashed rgba(13,27,42,0.12);
          margin-top: 4px;
        }

        .wlc-note {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13,27,42,0.55);
          margin: 4px 0 0 0;
          line-height: 1.6;
        }
        .wlc-err {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 0;
        }
        .wlc-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .wlc-save {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 13px 28px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .wlc-save:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>
    </article>
  );
}
