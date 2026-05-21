// app/(cabin)/cabin/me/page.jsx
// =============================================================
// 2026-05-20 — Phase 2 invite-first architecture.
//
// /cabin/me — the page each member uses to share THEIR OWN
// personal details with the captain.
//
// Why this page exists:
//   Friend-test pass 2 surfaced the elephant: the principal
//   charterer was being asked to fill out 6–12 people's DOBs,
//   allergies, swimming ability and passport data on their
//   behalf. They can't. They shouldn't. So every cabin_members
//   row now gets its own form here, scoped to its own row by
//   the session.
//
// Pattern notes:
//   - One screen, single column, plain language. The audience
//     includes guests in their 70s — no jargon, no acronyms,
//     short labels, italic hints.
//   - Every field is optional. The minimum that flips "details
//     complete" is DOB + allergies/dietary (covers the things
//     the chef and captain genuinely need).
//   - 16px input font on iOS to suppress keyboard auto-zoom.
//   - "Save" button stays disabled until something changed.
// =============================================================
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

const SWIMS_OPTIONS = [
  { value: "confident", label: "Confident swimmer" },
  { value: "some",      label: "Some — comfortable with help" },
  { value: "non_swimmer", label: "Non-swimmer" },
  { value: "prefer_not_say", label: "Prefer not to say" },
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-free",
  "Lactose-free",
  "Halal",
  "Kosher",
  "No pork",
  "No shellfish",
  "No red meat",
];

export default function CabinMePage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);

  const [member, setMember] = useState(null);

  // Local form state — initialised from server on mount, diffed
  // against initial below to drive the disabled state of Save.
  const [form, setForm] = useState({
    date_of_birth: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    allergies_dietary: "",
    dietary_preferences: [],
    swims: "",
    mobility_notes: "",
    cabin_pairing: "",
    special_dates_during_charter: "",
    anything_else: "",
  });
  const [initial, setInitial] = useState(form);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/cabin/me");
        const j = await r.json();
        if (cancelled) return;
        if (!r.ok || !j.ok) throw new Error(j?.error || "load-failed");
        const pd = j.member?.personal_details ?? {};
        const next = {
          date_of_birth: pd.date_of_birth ?? "",
          nationality: pd.nationality ?? "",
          passport_number: pd.passport_number ?? "",
          passport_expiry: pd.passport_expiry ?? "",
          allergies_dietary: pd.allergies_dietary ?? "",
          dietary_preferences: Array.isArray(pd.dietary_preferences)
            ? pd.dietary_preferences
            : [],
          swims: pd.swims ?? "",
          mobility_notes: pd.mobility_notes ?? "",
          cabin_pairing: pd.cabin_pairing ?? "",
          special_dates_during_charter: pd.special_dates_during_charter ?? "",
          anything_else: pd.anything_else ?? "",
        };
        setMember(j.member);
        setForm(next);
        setInitial(next);
      } catch (e) {
        setErr("Could not load your details just now. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initial);
  }, [form, initial]);

  function toggleDietary(label) {
    setForm((f) => {
      const has = f.dietary_preferences.includes(label);
      return {
        ...f,
        dietary_preferences: has
          ? f.dietary_preferences.filter((v) => v !== label)
          : [...f.dietary_preferences, label],
      };
    });
  }

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setOk(false);
    try {
      const r = await fetch("/api/cabin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j?.error || "save-failed");
      setInitial(form);
      setOk(true);
      // Tuck the "saved" message away after a beat — no need to nag.
      setTimeout(() => setOk(false), 3500);
    } catch {
      setErr("Could not save just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // 2026-05-20 — Pass 6 (Tyler, Helen): "italic 'Loading your
  // details…' looks like an error/empty state, not loading." A
  // pulsing skeleton reads as intentional progress and stops Tyler
  // from refreshing while it's still resolving the fetch.
  if (loading) {
    return (
      <article aria-busy="true">
        <SectionTitle
          kicker="A few details about you"
          title="Just enough"
          italic="for the captain and the chef."
        />
        <div className="me-skel" aria-hidden>
          <div className="me-skel__intro" />
          <div className="me-skel__card">
            <div className="me-skel__head" />
            <div className="me-skel__row" />
            <div className="me-skel__row" />
            <div className="me-skel__row" />
            <div className="me-skel__row me-skel__row--short" />
          </div>
        </div>
        <span className="sr-only" role="status">Loading your details…</span>
        <style>{`
          @keyframes me-skel-pulse {
            0%, 100% { opacity: 0.55; }
            50%      { opacity: 0.92; }
          }
          .me-skel {
            display: flex;
            flex-direction: column;
            gap: 22px;
            margin-top: 28px;
          }
          .me-skel__intro {
            height: 14px;
            width: 78%;
            max-width: 420px;
            background: rgba(13,27,42,0.08);
            animation: me-skel-pulse 1.6s ease-in-out infinite;
          }
          .me-skel__card {
            background: #ffffff;
            border: 1px solid rgba(13,27,42,0.08);
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .me-skel__head {
            height: 12px;
            width: 140px;
            background: rgba(201,168,76,0.18);
            animation: me-skel-pulse 1.6s ease-in-out infinite;
          }
          .me-skel__row {
            height: 38px;
            background: rgba(13,27,42,0.05);
            border-bottom: 1px solid rgba(13,27,42,0.06);
            animation: me-skel-pulse 1.6s ease-in-out infinite;
          }
          .me-skel__row--short { width: 60%; }
          .sr-only {
            position: absolute;
            width: 1px; height: 1px;
            padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0,0,0,0);
            white-space: nowrap; border: 0;
          }
        `}</style>
      </article>
    );
  }

  const firstName =
    (member?.display_name || member?.email || "").split(/[\s@]/)[0] || "friend";

  return (
    <article>
      <SectionTitle
        kicker="A few details about you"
        title="Just enough"
        italic="for the captain and the chef."
      />
      <IntroParagraph>
        Hello, {firstName}. Everything here is optional — but the few
        fields you fill in mean the chef knows what not to cook, the
        captain has the right paperwork at marinas, and we can quietly
        mark any small celebration that falls during your week. Saves
        as you tap Save. Edit any time.
      </IntroParagraph>

      <form className="me-form" onSubmit={onSave}>
        <h2 className="me-subhead">The essentials</h2>

        <label className="me-field">
          <span>Date of birth</span>
          <input
            type="date"
            value={form.date_of_birth}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />
        </label>

        <label className="me-field">
          <span>Allergies & dietary notes</span>
          <textarea
            rows={3}
            value={form.allergies_dietary}
            placeholder="e.g. severe shellfish allergy · lactose intolerant · no nuts"
            onChange={(e) =>
              setForm({ ...form, allergies_dietary: e.target.value })
            }
          />
          <em className="me-hint">
            The chef adapts every menu around this — please be specific.
          </em>
        </label>

        <fieldset className="me-fieldset">
          <legend>Dietary preferences (tap any that apply)</legend>
          <div className="me-chip-grid">
            {DIETARY_OPTIONS.map((label) => {
              const selected = form.dietary_preferences.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  className={`me-chip${selected ? " me-chip--on" : ""}`}
                  onClick={() => toggleDietary(label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="me-fieldset">
          <legend>Swimming</legend>
          <div className="me-radio-stack">
            {SWIMS_OPTIONS.map((opt) => (
              <label key={opt.value} className="me-radio">
                <input
                  type="radio"
                  name="swims"
                  value={opt.value}
                  checked={form.swims === opt.value}
                  onChange={() => setForm({ ...form, swims: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <em className="me-hint">
            Helps the crew quietly look out for everyone in the water.
          </em>
        </fieldset>

        <label className="me-field">
          <span>Mobility or medical notes (private to the crew)</span>
          <textarea
            rows={2}
            value={form.mobility_notes}
            placeholder="e.g. recent knee surgery — slow with the swim ladder"
            onChange={(e) =>
              setForm({ ...form, mobility_notes: e.target.value })
            }
          />
        </label>

        <h2 className="me-subhead">For marina paperwork (optional)</h2>

        <label className="me-field">
          <span>Nationality</span>
          <input
            type="text"
            value={form.nationality}
            placeholder="e.g. British · Greek · American"
            maxLength={80}
            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
          />
        </label>

        <div className="me-row">
          <label className="me-field">
            <span>Passport number</span>
            <input
              type="text"
              value={form.passport_number}
              placeholder="optional"
              maxLength={32}
              autoComplete="off"
              onChange={(e) =>
                setForm({ ...form, passport_number: e.target.value })
              }
            />
          </label>
          <label className="me-field">
            <span>Passport expiry</span>
            <input
              type="date"
              value={form.passport_expiry}
              onChange={(e) =>
                setForm({ ...form, passport_expiry: e.target.value })
              }
            />
          </label>
        </div>
        <em className="me-hint">
          {/* 2026-05-20 — Pass 6 (Domingo, Helen): "Kept privately
              in your Cabin" is vague — privacy language for a
              passport field should commit to encryption + the people
              who can decrypt it. */}
          Some marinas (especially in the Cyclades) ask for these.
          Stored encrypted in your Cabin — visible only to you,
          and decrypted for the captain at the moment of
          embarkation paperwork.
        </em>

        <h2 className="me-subhead">Aboard the yacht</h2>

        <label className="me-field">
          <span>Cabin pairing (who you’ll share with)</span>
          <input
            type="text"
            value={form.cabin_pairing}
            placeholder="e.g. sharing with my husband Andreas"
            maxLength={120}
            onChange={(e) =>
              setForm({ ...form, cabin_pairing: e.target.value })
            }
          />
        </label>

        <label className="me-field">
          <span>A celebration during the week?</span>
          <textarea
            rows={2}
            value={form.special_dates_during_charter}
            placeholder="e.g. my 60th on July 14 — keep it a surprise"
            onChange={(e) =>
              setForm({ ...form, special_dates_during_charter: e.target.value })
            }
          />
        </label>

        <label className="me-field">
          <span>Anything else</span>
          <textarea
            rows={3}
            value={form.anything_else}
            placeholder="anything we should know about you that doesn’t fit the boxes above"
            onChange={(e) =>
              setForm({ ...form, anything_else: e.target.value })
            }
          />
        </label>

        {err && <p className="me-err" role="alert">{err}</p>}
        {ok && <p className="me-ok">Saved — thank you.</p>}

        <div className="me-actions">
          <Link href="/cabin" className="me-back">
            ← Back to your Cabin
          </Link>
          {/* 2026-05-20 — Pass 6 (Domingo, Tyler): the saved state
              still rendered as a full navy CTA — just slightly
              dimmed. To a tester it looked clickable, and they
              tapped Save again expecting confirmation. The saved
              state is now a calm checkmark badge that is visibly a
              status (not a button), while the dirty button keeps
              its CTA weight. */}
          {!dirty && !busy ? (
            <span className="me-saved" aria-live="polite">
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden focusable="false">
                <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Saved
            </span>
          ) : (
            <button type="submit" disabled={busy} className="me-save">
              {busy ? "Saving…" : "Save my details"}
            </button>
          )}
        </div>
      </form>

      <style>{`
        .me-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 28px;
          background: #ffffff;
          padding: 22px;
          border: 1px solid rgba(13,27,42,0.08);
        }
        .me-subhead {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          margin: 8px 0 0 0;
        }
        .me-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .me-field > span {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .me-field input,
        .me-field textarea {
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 11px 0 13px;
          font-family: var(--gy-font-body);
          font-size: 16px;
          color: var(--gy-navy);
          outline: none;
          resize: vertical;
        }
        .me-field textarea {
          border: 1px solid rgba(13,27,42,0.12);
          padding: 11px 12px;
          background: rgba(13,27,42,0.02);
        }
        .me-field input:focus { border-bottom-color: var(--gy-gold); }
        .me-field textarea:focus { border-color: var(--gy-gold); }
        .me-hint {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          font-style: italic;
          color: rgba(13,27,42,0.55);
          line-height: 1.55;
        }
        .me-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 560px) {
          .me-row { grid-template-columns: 1fr 1fr; }
        }
        .me-fieldset {
          border: 0;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .me-fieldset > legend {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          padding: 0;
          margin-bottom: 4px;
        }
        .me-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .me-chip {
          background: transparent;
          border: 1px solid rgba(13,27,42,0.2);
          color: var(--gy-navy);
          padding: 8px 13px;
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 0.5px;
          cursor: pointer;
        }
        .me-chip--on {
          background: var(--gy-gold);
          border-color: var(--gy-gold);
          color: #ffffff;
        }
        .me-radio-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .me-radio {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          color: var(--gy-navy);
          cursor: pointer;
        }
        .me-radio input { accent-color: var(--gy-gold); }
        .me-err {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 0;
        }
        .me-ok {
          color: #2f7d3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 0;
        }
        .me-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .me-back {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          text-decoration: none;
          padding: 11px 0;
        }
        .me-save {
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
        .me-save:disabled {
          opacity: 0.6;
          cursor: default;
        }
        /* Passive saved-state badge. Not a button — a status. */
        .me-saved {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px 11px 14px;
          background: rgba(47, 125, 58, 0.08);
          color: #2f7d3a;
          border: 1px solid rgba(47, 125, 58, 0.35);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: default;
          user-select: none;
        }
      `}</style>
    </article>
  );
}
