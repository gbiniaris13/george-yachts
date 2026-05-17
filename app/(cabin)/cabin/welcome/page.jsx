// /cabin/welcome — First-login onboarding.
// Captures display_name, date_of_birth, hometown for the Filotimo
// Circle and the broker's "birthday wishes" workflow. Every field
// optional — we never block the user.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [hometown, setHometown] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/api/cabin/profile")
      .then((r) => r.json())
      .then((j) => {
        if (j?.profile) {
          setName(j.profile.display_name ?? "");
          setDob(j.profile.date_of_birth ?? "");
          setHometown(j.profile.hometown ?? "");
          setAnniversary(j.profile.anniversary_date ?? "");
          setMobile(j.profile.mobile ?? "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/cabin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: name,
          date_of_birth: dob,
          hometown,
          anniversary_date: anniversary,
          mobile,
        }),
      });
      if (!r.ok) throw new Error();
      router.push("/cabin");
    } catch {
      setErr("Could not save right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function onSkip() {
    router.push("/cabin");
  }

  if (loading) {
    return <p style={{ padding: 24, fontStyle: "italic", color: "rgba(13,27,42,0.5)" }}>Loading…</p>;
  }

  return (
    <article>
      <SectionTitle
        kicker="A warm welcome aboard"
        title="Three small"
        italic="touches, before you sail."
      />
      <IntroParagraph>
        We don’t need much — but a few details mean we can look after
        you well over the years. Your name to address you properly,
        a date of birth so we can wish you well in the right season,
        and where you’re from. Anything you leave blank stays blank;
        you can always come back to this page.
      </IntroParagraph>

      <form className="wlc-form" onSubmit={onSave}>
        <label className="wlc-field">
          <span>Your full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alexandra Papadopoulou"
            autoComplete="name"
            maxLength={120}
          />
        </label>

        <div className="wlc-row">
          <label className="wlc-field">
            <span>Date of birth</span>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <label className="wlc-field">
            <span>Where you call home</span>
            <input
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              placeholder="e.g. London · Athens · Miami"
              maxLength={120}
            />
          </label>
        </div>

        <label className="wlc-field">
          <span>Mobile (optional)</span>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+44 7700 900000"
            inputMode="tel"
            maxLength={40}
          />
        </label>

        <label className="wlc-field">
          <span>Anniversary date (optional)</span>
          <input
            type="date"
            value={anniversary}
            onChange={(e) => setAnniversary(e.target.value)}
          />
        </label>

        <p className="wlc-note">
          <em>
            Stored privately in your Cabin. Visible to George only —
            never shared with the yacht owner, the management company,
            or anyone else. You can edit or delete any of this from
            the Your Data page at any time.
          </em>
        </p>

        {err && <p className="wlc-err" role="alert">{err}</p>}

        <div className="wlc-actions">
          <button type="button" onClick={onSkip} className="wlc-skip">
            Skip for now
          </button>
          <button type="submit" disabled={busy} className="wlc-save">
            {busy ? "Saving…" : "Save and continue"}
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
        .wlc-field > span {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
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
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .wlc-skip {
          background: transparent;
          border: 0;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          cursor: pointer;
          padding: 11px 0;
        }
        .wlc-save {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 12px 26px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .wlc-save:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </article>
  );
}
