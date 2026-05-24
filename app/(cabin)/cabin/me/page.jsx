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

// 2026-05-24 — Christos pass (item 2): SWIMS_OPTIONS and
// DIETARY_OPTIONS moved to /cabin/me/private — they only matter
// for the private health/dietary form which now lives there.

// 2026-05-24 — Christos pass: country-code picker for the mobile
// field. Common GY-clientele dial codes first (Greece for hosts,
// US/UK/EU for typical guests), then a long tail for everywhere
// else. The select stores the +CC; the local number lives in a
// separate text input; we join them with a space for storage.
const COUNTRY_CODES = [
  { code: "+30",  flag: "🇬🇷", label: "Greece" },
  { code: "+1",   flag: "🇺🇸", label: "US / Canada" },
  { code: "+44",  flag: "🇬🇧", label: "United Kingdom" },
  { code: "+33",  flag: "🇫🇷", label: "France" },
  { code: "+49",  flag: "🇩🇪", label: "Germany" },
  { code: "+39",  flag: "🇮🇹", label: "Italy" },
  { code: "+34",  flag: "🇪🇸", label: "Spain" },
  { code: "+41",  flag: "🇨🇭", label: "Switzerland" },
  { code: "+31",  flag: "🇳🇱", label: "Netherlands" },
  { code: "+32",  flag: "🇧🇪", label: "Belgium" },
  { code: "+43",  flag: "🇦🇹", label: "Austria" },
  { code: "+45",  flag: "🇩🇰", label: "Denmark" },
  { code: "+46",  flag: "🇸🇪", label: "Sweden" },
  { code: "+47",  flag: "🇳🇴", label: "Norway" },
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+353", flag: "🇮🇪", label: "Ireland" },
  { code: "+357", flag: "🇨🇾", label: "Cyprus" },
  { code: "+90",  flag: "🇹🇷", label: "Türkiye" },
  { code: "+972", flag: "🇮🇱", label: "Israel" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", label: "Qatar" },
  { code: "+965", flag: "🇰🇼", label: "Kuwait" },
  { code: "+852", flag: "🇭🇰", label: "Hong Kong" },
  { code: "+65",  flag: "🇸🇬", label: "Singapore" },
  { code: "+61",  flag: "🇦🇺", label: "Australia" },
  { code: "+7",   flag: "🇷🇺", label: "Russia" },
  { code: "+86",  flag: "🇨🇳", label: "China" },
  { code: "+81",  flag: "🇯🇵", label: "Japan" },
  { code: "+91",  flag: "🇮🇳", label: "India" },
  { code: "+55",  flag: "🇧🇷", label: "Brazil" },
  { code: "+52",  flag: "🇲🇽", label: "Mexico" },
  { code: "+27",  flag: "🇿🇦", label: "South Africa" },
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
  // 2026-05-24 — Christos pass (item 2): private health/dietary
  // fields (allergies_dietary, dietary_preferences, swims,
  // mobility_notes, consent_share_with_crew) live on
  // /cabin/me/private. NOT tracked here so this page's Save
  // cannot accidentally overwrite them.
  const [form, setForm] = useState({
    // ----- Crew-list essentials (mandatory)
    date_of_birth: "",
    gender: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    mobile: "",
    mobile_cc: "+30",
    // ----- Aboard the yacht (social, OK to be visible across group)
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
          // Derive CC from the stored mobile string if it starts
          // with a +; default to +30 (most of our customers).
          mobile_cc: (() => {
            const m = (pd.mobile || "").match(/^(\+\d{1,4})/);
            return m ? m[1] : "+30";
          })(),
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

  // 2026-05-24 — Christos pass (item 2): toggleDietary helper
  // moved to /cabin/me/private alongside the dietary chips.

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

          {/* 2026-05-24 — Christos pass: country-code picker.
              Christos typed +30 in the mobile field, the number
              never picked it up — phone numbers without an
              explicit country code aren't dialable from a Greek
              SIM if the captain is calling from abroad. Split
              into a Greek/US/UK/etc. picker + local-number field.
              Combined value persists as a single string in DB so
              the existing GET/PUT contract is unchanged. */}
          <div className="me-field">
            <span>Mobile phone</span>
            <div className="me-mobile-row">
              <select
                className="me-mobile-cc"
                aria-label="Country code"
                value={form.mobile_cc || "+30"}
                onChange={(e) => {
                  const cc = e.target.value;
                  const local = form.mobile.replace(/^\+\d{1,4}\s*/, "");
                  setForm({
                    ...form,
                    mobile_cc: cc,
                    mobile: `${cc} ${local}`.trim(),
                  });
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                className="me-mobile-num"
                value={form.mobile.replace(/^\+\d{1,4}\s*/, "")}
                placeholder="6940 000 000"
                maxLength={24}
                onChange={(e) => {
                  const local = e.target.value;
                  const cc = form.mobile_cc || "+30";
                  setForm({
                    ...form,
                    mobile: local ? `${cc} ${local}` : "",
                  });
                }}
                required
              />
            </div>
          </div>

          <p className="me-hint" style={{ marginTop: 4 }}>
            Stored encrypted in your Cabin — visible to you, decrypted
            for the captain at the moment of embarkation paperwork.
          </p>
        </div>

        {/* 2026-05-24 — Christos pass (item 2): the health /
            allergies / dietary / mobility / consent block was
            moved off this page onto a dedicated /cabin/me/private
            route. Christos wanted the privacy boundary to be a
            wholly separate page rather than a banner-on-the-same-
            page — that way it's visually obvious the answers
            below it are for the crew's eyes only, not for the
            other guests.

            This page keeps: crew-list essentials (top, mandatory)
            and the "Aboard the yacht" social bits (cabin pairing,
            celebration, anything-else) which are perfectly fine
            to be visible across the group. */}
        <div className="me-private-link">
          <div>
            <div className="me-private-link__eyebrow">Private to you</div>
            <p className="me-private-link__copy">
              <em>
                Health, allergies, dietary preferences and swimming
                ability live on a separate page — only George and
                the crew see those answers, never the rest of your
                group.
              </em>
            </p>
          </div>
          <Link href="/cabin/me/private" className="me-private-link__cta">
            Open my private notes →
          </Link>
        </div>

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

        {/* 2026-05-24 — GDPR consent checkbox moved to /cabin/me/
            private alongside the health fields it gates. Keeps the
            consent literally adjacent to what it covers. */}

        {member?.role && member.role !== "principal_charterer" && (
          <div className="me-contribute">
            {/* 2026-05-23 — SHARED BRIEF MODEL.
                George's clarification: the brief is now a single
                common document everyone fills together — "σαν να
                έχουν ένα ρε παιδί μου όλοι και το συμπληρώνουν
                ένας-ένας ξεχωριστά από το κινητό τους". Pre-Phase-3
                per-member contribution pages removed; everyone
                edits the same /cabin/brief/dining etc. */}
            <h2 className="me-subhead">Help fill the group brief</h2>
            <p className="me-contribute__intro">
              <em>
                Your group&apos;s brief is one shared document —
                anyone aboard can add to it. Open it from your cabin
                home (&quot;The Brief&quot; tile) or jump straight
                in below. Last edits show whose pen wrote what, so
                you can see at a glance what&apos;s been added
                before you and pick up where the others left off.
                {member?.brief_opt_out_at
                  ? " (You've opted out; toggle below to opt back in.)"
                  : ""}
              </em>
            </p>

            {!member?.brief_opt_out_at && (
              <Link
                href="/cabin/brief"
                className="me-contribute__open"
              >
                Open the brief →
              </Link>
            )}

            {/* The opt-out path is preserved as a quieter
                alternative: a guest who genuinely wants to defer
                entirely can step aside, and the principal review
                shows their opt-out badge. */}
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

        {/* 2026-05-24 — Christos pass: after a successful save,
            render a green confirmation panel with a clear "Go
            back to the Cabin" CTA so the guest knows what to do
            next. Replaces the silent inline "Saved" message. */}
        {ok && (
          <div className="me-saved-panel" aria-live="polite">
            <div className="me-saved-panel__eyebrow">Saved</div>
            <p className="me-saved-panel__copy">
              Your information is saved — thank you. The principal
              charterer reviews every member&apos;s details before
              the brief goes to George.
            </p>
            <Link href="/cabin" className="me-saved-panel__cta">
              Go back to the Cabin →
            </Link>
          </div>
        )}

        <div className="me-actions">
          <Link href="/cabin" className="me-back">
            ← Back to your Cabin
          </Link>
          {!dirty && !busy ? (
            <span className="me-saved" aria-live="polite">
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden focusable="false">
                <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Saved
            </span>
          ) : (
            <button type="submit" disabled={busy} className="me-save">
              {busy ? "Saving…" : "Save my information"}
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
        /* 2026-05-23 — SHARED BRIEF MODEL. Single open-the-brief
           CTA replaces the two contribution cards. Same boutique
           visual weight as the principal's Save button so guests
           feel invited to participate, not relegated. */
        /* 2026-05-24 — Country-code + local mobile split. The
           select carries the +CC; the input holds the local part.
           16px font on both so iOS Safari doesn't auto-zoom. */
        /* 2026-05-24 — Christos pass: post-save confirmation panel
           with a clear "go back to Cabin" CTA. Green tone signals
           success without competing with the navy Save button. */
        .me-saved-panel {
          margin: 18px 0 0 0;
          padding: 18px 20px;
          background: #F5FAF5;
          border: 1px solid rgba(76, 138, 88, 0.55);
          border-left: 3px solid #4C8A58;
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .me-saved-panel__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #2D5C36;
          font-weight: 700;
        }
        .me-saved-panel__copy {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .me-saved-panel__cta {
          align-self: flex-start;
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
        .me-saved-panel__cta:hover { background: #1F4426; }
        .me-mobile-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }
        .me-mobile-cc {
          flex: 0 0 auto;
          min-width: 110px;
          max-width: 160px;
          font-size: 16px;
          padding: 10px 8px;
          border: 1px solid rgba(13, 27, 42, 0.18);
          background: #ffffff;
          color: var(--gy-navy);
          font-family: var(--gy-font-body);
          border-radius: 3px;
        }
        .me-mobile-num {
          flex: 1;
          min-width: 0;
        }
        /* 2026-05-24 — Christos pass (item 2): "Open my private
           notes" panel replaces the inline health banner. Same
           gold tone family as the crew-list block so the page
           reads as two warm sections (mandatory paperwork +
           private notes link) before the social bits. */
        .me-private-link {
          margin: 22px 0 6px 0;
          padding: 18px 20px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
          display: flex;
          gap: 18px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .me-private-link > div {
          flex: 1;
          min-width: 240px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .me-private-link__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .me-private-link__copy {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .me-private-link__cta {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 13px 22px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .me-private-link__cta:hover { background: #142233; }
        .me-private-banner {
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
        .me-private-banner__chip {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          flex-shrink: 0;
        }
        .me-private-banner__copy {
          margin: 0;
          flex: 1;
          min-width: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .me-consent {
          margin: 24px 0 12px 0;
          padding: 14px 16px;
          background: rgba(13, 27, 42, 0.03);
          border: 1px solid rgba(13, 27, 42, 0.1);
          border-radius: 3px;
        }
        .me-consent label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .me-consent input {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          accent-color: var(--gy-gold);
        }
        .me-consent__copy {
          flex: 1;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.55;
        }
        .me-consent__copy strong {
          font-weight: 600;
        }
        .me-contribute {
          margin-top: 16px;
          padding-top: 18px;
          border-top: 1px dashed rgba(13,27,42,0.14);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .me-contribute__intro {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13,27,42,0.7);
          line-height: 1.6;
        }
        .me-contribute__open {
          align-self: flex-start;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 14px 22px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          transition: background 160ms ease;
        }
        .me-contribute__open:hover { background: #142233; }
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
