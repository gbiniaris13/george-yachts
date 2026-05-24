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
import { firstNameFromDisplayName } from "@/lib/cabin/format";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import DateOfBirthPicker from "../../../components/cabin/DateOfBirthPicker";

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

// 2026-05-22 — Crew List (port-authority) gender options.
const GENDER_OPTIONS = [
  { value: "female",         label: "Female" },
  { value: "male",           label: "Male" },
  { value: "non_binary",     label: "Non-binary" },
  { value: "prefer_not_say", label: "Prefer not to say" },
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
    // ----- Crew-list essentials (mandatory)
    date_of_birth: "",
    gender: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    mobile: "",
    // ----- Chef + captain niceties (optional)
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
          gender: pd.gender ?? "",
          nationality: pd.nationality ?? "",
          passport_number: pd.passport_number ?? "",
          passport_expiry: pd.passport_expiry ?? "",
          mobile: pd.mobile ?? "",
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

  // ----- Opt-out of order/cellar choices (any non-principal can set
  // their own; personal facts stay mandatory). State derives from the
  // member row, updated by POST /api/cabin/me/opt-out-brief.
  const [optOutBusy, setOptOutBusy] = useState(false);
  const [optOutNote, setOptOutNote] = useState("");
  useEffect(() => {
    setOptOutNote(member?.brief_opt_out_note ?? "");
  }, [member?.brief_opt_out_note]);

  async function onSetOptOut(nextOptOut) {
    setOptOutBusy(true);
    try {
      const r = await fetch("/api/cabin/me/opt-out-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opt_out: nextOptOut,
          note: nextOptOut ? optOutNote : null,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j?.error || "opt-out-failed");
      setMember((m) =>
        m
          ? {
              ...m,
              brief_opt_out_at: j.opt_out_at,
              brief_opt_out_note: nextOptOut ? optOutNote : null,
            }
          : m,
      );
    } catch {
      setErr("Could not update just now. Please try again.");
    } finally {
      setOptOutBusy(false);
    }
  }

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

  // 2026-05-21 — Pass 7: honorific-stripping helper. Was
  // split(/[\s@]/)[0] which yielded "Ms." on MYBA-style names.
  const firstName =
    firstNameFromDisplayName(member?.display_name) ||
    (member?.email || "").split("@")[0] ||
    "friend";

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
        {/* 2026-05-22 — Crew List essentials block. Port authorities
            require name + gender + DOB + ID/passport + mobile for
            every person aboard. These five fields are MANDATORY for
            the brief to lock — the principal sees who's still
            missing on the review screen before they send to George. */}
        <div className="me-crewlist">
          <div className="me-crewlist__head">
            <div className="me-crewlist__eyebrow">Crew list · Required</div>
            <p className="me-crewlist__copy">
              <em>
                Five lines for the harbour authorities. The brief
                cannot be sent to George until everyone in the
                group has finished this short block.
              </em>
            </p>
          </div>

          <label className="me-field">
            <span>Date of birth</span>
            {/* 2026-05-23 — Olga friend-test: the native HTML
                date picker forced her to click month-arrows back
                year-by-year to reach 1991. Replaced with a
                3-field Day / Month / Year control that lets her
                type the year directly. Emits the same ISO date
                string format the server expects. */}
            <DateOfBirthPicker
              value={form.date_of_birth}
              onChange={(iso) =>
                setForm({ ...form, date_of_birth: iso })
              }
              required
            />
          </label>

          <fieldset className="me-fieldset">
            <legend>Gender</legend>
            <div className="me-radio-stack">
              {GENDER_OPTIONS.map((opt) => (
                <label key={opt.value} className="me-radio">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    checked={form.gender === opt.value}
                    onChange={() =>
                      setForm({ ...form, gender: opt.value })
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="me-field">
            <span>Nationality</span>
            <input
              type="text"
              value={form.nationality}
              placeholder="e.g. British · Greek · American"
              maxLength={80}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
              required
            />
          </label>

          <div className="me-row">
            <label className="me-field">
              <span>ID / Passport number</span>
              <input
                type="text"
                value={form.passport_number}
                placeholder="e.g. AE1234567"
                maxLength={32}
                autoComplete="off"
                onChange={(e) =>
                  setForm({ ...form, passport_number: e.target.value })
                }
                required
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

          <label className="me-field">
            <span>Mobile phone</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.mobile}
              placeholder="e.g. +30 694 000 0000"
              maxLength={32}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
          </label>

          <p className="me-hint" style={{ marginTop: 4 }}>
            Stored encrypted in your Cabin — visible to you, decrypted
            for the captain at the moment of embarkation paperwork.
          </p>
        </div>

        <h2 className="me-subhead">For the chef &amp; the captain</h2>

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

        {/* 2026-05-22 — Old "For marina paperwork (optional)" block
            removed. Nationality / passport number / passport expiry
            / mobile all moved up into the mandatory Crew List block
            at the top of the form. The privacy hint is now rendered
            inside that block too. */}

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

        {member?.role && member.role !== "principal_charterer" && (
          <div className="me-contribute">
            {/* 2026-05-23 — Multi-user Brief (Phase 3, George friend
                test 4 with Vasilis on iPhone 13 Pro Max):
                "Δεν γίνεται μόνο ο main charterer να επιλέγει την καύα.
                 Όλοι θέλουμε να έχουν πρόσβαση." Two contribution
                cards offer guests their own pass through At the Table
                + In the Cellar. Their answers land in
                cabin_brief_contributions per-member and surface for
                the principal at /cabin/brief/review. The opt-out
                button below is the alternative for guests who'd
                rather defer entirely. */}
            <h2 className="me-subhead">Add your preferences</h2>
            <p className="me-contribute__intro">
              <em>
                Your host invited the whole group to share their own
                menu and cellar tastes. Your picks land alongside
                everyone else&apos;s — the principal charterer reviews
                them all before George sees the final brief.
                {member?.brief_opt_out_at
                  ? " (You've opted out; toggle below to opt back in.)"
                  : ""}
              </em>
            </p>

            {!member?.brief_opt_out_at && (
              <div className="me-contribute__cards">
                <Link
                  href="/cabin/me/at-the-table"
                  className="me-contribute__card"
                >
                  <span className="me-contribute__card-eyebrow">
                    At the Table
                  </span>
                  <strong>Your food &amp; menu picks</strong>
                  <em>
                    Breakfast style, foods you love or skip,
                    service preferences, dessert. ~5 minutes.
                  </em>
                  <span className="me-contribute__card-cta">Open →</span>
                </Link>
                <Link
                  href="/cabin/me/in-the-cellar"
                  className="me-contribute__card"
                >
                  <span className="me-contribute__card-eyebrow">
                    In the Cellar
                  </span>
                  <strong>Your wine &amp; bar picks</strong>
                  <em>
                    Champagne, wines, spirits, beers, cocktails —
                    no quantities. ~4 minutes.
                  </em>
                  <span className="me-contribute__card-cta">Open →</span>
                </Link>
              </div>
            )}

            {/* The original opt-out path is preserved as a quieter
                alternative beneath the contribution cards. A guest
                who genuinely wants to defer can still do so, just
                not as the headline action. */}
            <details className="me-contribute__optout">
              <summary>
                {member?.brief_opt_out_at
                  ? "You've opted out of orders & cellar choices"
                  : "Or, leave orders & cellar entirely to the group"}
              </summary>
              <div className="me-contribute__optout-body">
                {member?.brief_opt_out_at ? (
                  <button
                    type="button"
                    className="me-optout__back"
                    onClick={() => onSetOptOut(false)}
                    disabled={optOutBusy}
                  >
                    {optOutBusy ? "Saving…" : "Opt back in"}
                  </button>
                ) : (
                  <>
                    <label className="me-field">
                      <span>Anything you&apos;d like noted (optional)</span>
                      <input
                        type="text"
                        value={optOutNote}
                        placeholder="e.g. I trust whatever Patricia picks"
                        maxLength={240}
                        onChange={(e) => setOptOutNote(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="me-optout__btn"
                      onClick={() => onSetOptOut(true)}
                      disabled={optOutBusy}
                    >
                      {optOutBusy
                        ? "Saving…"
                        : "I'll leave orders & cellar to the group"}
                    </button>
                  </>
                )}
              </div>
            </details>
          </div>
        )}

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
        /* 2026-05-22 — Crew List essentials block: bordered to read
            as a distinct, mandatory unit; subtle ivory background
            so it doesn't shout. */
        .me-crewlist {
          background: rgba(201, 168, 76, 0.05);
          border: 1px solid rgba(201, 168, 76, 0.35);
          border-left: 3px solid var(--gy-gold);
          padding: 18px 18px 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 4px;
        }
        .me-crewlist__head { display: flex; flex-direction: column; gap: 4px; }
        .me-crewlist__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3.2px;
          text-transform: uppercase;
          color: #8a7327;
          font-weight: 700;
        }
        .me-crewlist__copy {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.72);
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
        /* 2026-05-23 — Multi-user Brief (Phase 3). Contribute block
           styles: two prominent boutique cards (At the Table + In
           the Cellar) with a quieter <details> below for the
           opt-out alternative. */
        .me-contribute {
          margin-top: 16px;
          padding-top: 18px;
          border-top: 1px dashed rgba(13,27,42,0.14);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .me-contribute__intro {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13,27,42,0.7);
          line-height: 1.6;
        }
        .me-contribute__cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 599.98px) {
          .me-contribute__cards { grid-template-columns: 1fr; }
        }
        .me-contribute__card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 18px 18px 22px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-radius: 4px;
          text-decoration: none;
          color: var(--gy-navy);
          transition: border-color 160ms ease, transform 160ms ease;
        }
        .me-contribute__card:hover {
          border-color: var(--gy-gold);
          transform: translateY(-1px);
        }
        .me-contribute__card-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          margin-bottom: 2px;
        }
        .me-contribute__card strong {
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          font-weight: 400;
          color: var(--gy-navy);
        }
        .me-contribute__card em {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13,27,42,0.62);
          line-height: 1.55;
          margin-bottom: 8px;
        }
        .me-contribute__card-cta {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-navy);
          align-self: flex-start;
          padding-top: 4px;
          border-top: 1px solid rgba(201, 168, 76, 0.4);
          padding-right: 12px;
        }
        .me-contribute__card:hover .me-contribute__card-cta {
          color: var(--gy-gold);
        }
        .me-contribute__optout {
          margin-top: 4px;
        }
        .me-contribute__optout > summary {
          cursor: pointer;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13,27,42,0.5);
          padding: 8px 0;
          list-style: none;
        }
        .me-contribute__optout > summary:hover { color: var(--gy-navy); }
        .me-contribute__optout-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 8px;
        }
        .me-optout {
          margin-top: 16px;
          padding-top: 18px;
          border-top: 1px dashed rgba(13,27,42,0.14);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .me-optout__intro {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13,27,42,0.7);
          line-height: 1.6;
        }
        .me-optout__btn {
          align-self: flex-start;
          background: transparent;
          color: var(--gy-navy);
          border: 1px solid var(--gy-gold);
          padding: 11px 22px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .me-optout__btn:disabled { opacity: 0.6; cursor: default; }
        .me-optout__badge {
          background: rgba(13,27,42,0.06);
          border-left: 2px solid var(--gy-gold);
          padding: 12px 14px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          color: var(--gy-navy);
        }
        .me-optout__back {
          align-self: flex-start;
          background: transparent;
          border: 0;
          color: var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 0;
          cursor: pointer;
        }
        .me-optout__back:disabled { opacity: 0.6; cursor: default; }
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
