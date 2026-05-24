// app/(cabin)/cabin/me/private/page.jsx
// =============================================================
// 2026-05-24 — Christos pass (item 2).
//
// Health / allergies / dietary moved off the main /cabin/me page
// onto a dedicated /cabin/me/private route. George + Christos:
// "βάζε το σαν χωριστή σελίδα, όχι banner στην ίδια — έτσι
// καταλαβαίνει ο πελάτης ότι ΑΥΤΑ είναι μόνο για τον γιατρό
// του πλοίου / chef, κι όχι για τους φίλους του."
//
// Same API endpoint (/api/cabin/me, PUT) as the main page —
// the server-side merger only overwrites the keys we send, so
// posting from this page leaves the crew-list essentials alone
// and vice-versa.
//
// Each member sees only their own row. The principal sees the
// full aggregate of all members' health info on /cabin/brief/
// review (which is principal-only) when they prepare the final
// brief for George.
// =============================================================
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import { firstNameFromDisplayName } from "@/lib/cabin/format";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";

const SWIMS_OPTIONS = [
  { value: "confident",      label: "Confident swimmer" },
  { value: "some",           label: "Some — comfortable with help" },
  { value: "non_swimmer",    label: "Non-swimmer" },
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

export default function CabinMePrivatePage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  const [member, setMember] = useState(null);

  const [form, setForm] = useState({
    allergies_dietary: "",
    dietary_preferences: [],
    swims: "",
    mobility_notes: "",
    consent_share_with_crew: false,
  });
  const [initial, setInitial] = useState(form);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/cabin/me", { cache: "no-store" });
        const j = await r.json();
        if (cancelled) return;
        if (!r.ok || !j.ok) throw new Error(j?.error || "load-failed");
        const pd = j.member?.personal_details ?? {};
        const next = {
          allergies_dietary: pd.allergies_dietary ?? "",
          dietary_preferences: Array.isArray(pd.dietary_preferences)
            ? pd.dietary_preferences
            : [],
          swims: pd.swims ?? "",
          mobility_notes: pd.mobility_notes ?? "",
          consent_share_with_crew: Boolean(pd.consent_share_with_crew),
        };
        setMember(j.member);
        setForm(next);
        setInitial(next);
      } catch {
        setErr("Could not load your private notes just now. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

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
      setTimeout(() => setOk(false), 3500);
    } catch {
      setErr("Could not save just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <article aria-busy="true">
        <SectionTitle
          kicker="Private to you · Health & dietary"
          title="What the crew"
          italic="needs to know."
        />
        <p style={{ marginTop: 28, fontFamily: "var(--gy-font-editorial)", fontStyle: "italic", color: "rgba(13,27,42,0.55)" }}>
          Loading your private notes…
        </p>
      </article>
    );
  }

  const firstName =
    firstNameFromDisplayName(member?.display_name) ||
    (member?.email || "").split("@")[0] ||
    "friend";

  return (
    <article>
      <SectionTitle
        kicker="Private to you · Health & dietary"
        title="What the crew"
        italic="needs to know."
      />
      <IntroParagraph>
        Hello again, {firstName}. The fields below stay between you,
        George, and the captain, chef and hostess on board — your
        fellow guests never see these answers. We need them only for
        safety and provisioning. Edit any time.
      </IntroParagraph>

      <div className="mp-banner">
        <span className="mp-banner__chip">Private to you</span>
        <p className="mp-banner__copy">
          <em>
            The chef cooks around your allergies, the captain plans
            for the swim level you have, the hostess respects the
            things you&apos;d rather not have aboard. None of it is
            shared with the rest of your group.
          </em>
        </p>
      </div>

      <form className="mp-form" onSubmit={onSave}>
        <label className="mp-field">
          <span>Allergies &amp; dietary notes</span>
          <textarea
            rows={3}
            value={form.allergies_dietary}
            placeholder="e.g. severe shellfish allergy · lactose intolerant · no nuts"
            onChange={(e) =>
              setForm({ ...form, allergies_dietary: e.target.value })
            }
          />
          <em className="mp-hint">
            The chef adapts every menu around this — please be specific.
          </em>
        </label>

        <fieldset className="mp-fieldset">
          <legend>Dietary preferences (tap any that apply)</legend>
          <div className="mp-chip-grid">
            {DIETARY_OPTIONS.map((label) => {
              const selected = form.dietary_preferences.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  className={`mp-chip${selected ? " mp-chip--on" : ""}`}
                  onClick={() => toggleDietary(label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mp-fieldset">
          <legend>Swimming</legend>
          <div className="mp-radio-stack">
            {SWIMS_OPTIONS.map((opt) => (
              <label key={opt.value} className="mp-radio">
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
          <em className="mp-hint">
            Helps the crew quietly look out for everyone in the water.
          </em>
        </fieldset>

        <label className="mp-field">
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

        <div className="mp-consent">
          <label>
            <input
              type="checkbox"
              checked={Boolean(form.consent_share_with_crew)}
              onChange={(e) =>
                setForm({
                  ...form,
                  consent_share_with_crew: e.target.checked,
                })
              }
            />
            <span className="mp-consent__copy">
              <strong>I agree</strong> that George Yachts may share
              the personal health and dietary information above with
              my captain, chef and hostess for the duration of this
              charter, for safety and provisioning planning. The
              rest of my group does not see these answers.
            </span>
          </label>
        </div>

        {err && <p className="mp-err" role="alert">{err}</p>}

        {ok && (
          <div className="mp-saved-panel" aria-live="polite">
            <div className="mp-saved-panel__eyebrow">Saved</div>
            <p className="mp-saved-panel__copy">
              Your private notes are saved — thank you. Only George
              and the crew see this information.
            </p>
            <div className="mp-saved-panel__ctas">
              <Link href="/cabin/me" className="mp-saved-panel__cta-secondary">
                ← Back to your details
              </Link>
              <Link href="/cabin" className="mp-saved-panel__cta">
                Go back to the Cabin →
              </Link>
            </div>
          </div>
        )}

        <div className="mp-actions">
          <Link href="/cabin/me" className="mp-back">
            ← Back to your details
          </Link>
          {!dirty && !busy ? (
            <span className="mp-saved" aria-live="polite">
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden focusable="false">
                <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Saved
            </span>
          ) : (
            <button type="submit" disabled={busy} className="mp-save">
              {busy ? "Saving…" : "Save private notes"}
            </button>
          )}
        </div>
      </form>

      <style>{`
        .mp-banner {
          margin: 24px 0 18px 0;
          padding: 14px 18px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .mp-banner__chip {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          flex-shrink: 0;
        }
        .mp-banner__copy {
          margin: 0;
          flex: 1;
          min-width: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .mp-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 6px;
          background: #ffffff;
          padding: 22px;
          border: 1px solid rgba(13,27,42,0.08);
        }
        .mp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mp-field > span {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .mp-field textarea {
          border: 1px solid rgba(13,27,42,0.12);
          padding: 11px 12px;
          background: rgba(13,27,42,0.02);
          font-family: var(--gy-font-body);
          font-size: 16px;
          color: var(--gy-navy);
          outline: none;
          resize: vertical;
        }
        .mp-field textarea:focus { border-color: var(--gy-gold); }
        .mp-hint {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          font-style: italic;
          color: rgba(13,27,42,0.55);
          line-height: 1.55;
        }
        .mp-fieldset {
          border: 0;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mp-fieldset > legend {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          padding: 0;
          margin-bottom: 4px;
        }
        .mp-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .mp-chip {
          background: transparent;
          border: 1px solid rgba(13,27,42,0.2);
          color: var(--gy-navy);
          padding: 8px 13px;
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 0.5px;
          cursor: pointer;
        }
        .mp-chip--on {
          background: var(--gy-gold);
          border-color: var(--gy-gold);
          color: #ffffff;
        }
        .mp-radio-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mp-radio {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          color: var(--gy-navy);
          cursor: pointer;
        }
        .mp-radio input { accent-color: var(--gy-gold); }
        .mp-consent {
          margin: 6px 0 0 0;
          padding: 14px 16px;
          background: rgba(13, 27, 42, 0.03);
          border: 1px solid rgba(13, 27, 42, 0.1);
          border-radius: 3px;
        }
        .mp-consent label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .mp-consent input {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          accent-color: var(--gy-gold);
        }
        .mp-consent__copy {
          flex: 1;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.55;
        }
        .mp-consent__copy strong { font-weight: 600; }
        .mp-err {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 0;
        }
        .mp-saved-panel {
          margin: 8px 0 0 0;
          padding: 18px 20px;
          background: #F5FAF5;
          border: 1px solid rgba(76, 138, 88, 0.55);
          border-left: 3px solid #4C8A58;
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mp-saved-panel__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #2D5C36;
          font-weight: 700;
        }
        .mp-saved-panel__copy {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .mp-saved-panel__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .mp-saved-panel__cta {
          background: #2D5C36;
          color: #ffffff;
          border: 1px solid #4C8A58;
          padding: 13px 22px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 700;
          border-radius: 3px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .mp-saved-panel__cta:hover { background: #1F4426; }
        .mp-saved-panel__cta-secondary {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          text-decoration: none;
          padding: 11px 0;
        }
        .mp-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .mp-back {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          text-decoration: none;
          padding: 11px 0;
        }
        .mp-save {
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
        .mp-save:disabled { opacity: 0.6; cursor: default; }
        .mp-saved {
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
