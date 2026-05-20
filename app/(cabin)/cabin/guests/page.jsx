// /cabin/guests — charterer's group page.
//
// 2026-05-20 — Phase 2 (invite-first architecture). The page
// used to ship as a Phase 2 stub. Now it's the principal's
// primary dashboard:
//
//   - Compact "Add a guest" form at the top (single + bulk).
//   - Member list with three-state badge per row:
//       Invited       → invite_sent_at present, never logged in
//       Joined        → has logged in once
//       Details ready → personal_details_completed_at set
//   - Per-row "Resend invite" button for anyone still on Invited.
//   - "Remove" stays as before.
//
// Bulk invite still POSTs sequentially — clearer feedback and we
// avoid hitting Resend's rate limits.
"use client";

import { useEffect, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

const ROLE_LABEL = {
  principal_charterer: "Principal charterer (you)",
  guest: "Guest",
  designated_assistant: "Designated assistant",
};

function statusFor(member) {
  if (member.personal_details_completed_at) return "ready";
  if (member.last_login_at) return "joined";
  if (member.invite_sent_at) return "invited";
  return "unsent";
}

const STATUS_BADGE = {
  ready:   { label: "Details ready", tone: "ok" },
  joined:  { label: "Joined — waiting on details", tone: "warm" },
  invited: { label: "Invite sent", tone: "cool" },
  unsent:  { label: "Not invited yet", tone: "muted" },
};

export default function GuestsPage() {
  const [members, setMembers] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  // Bulk-invite state — paste a list of emails (one per line, or
  // comma-separated). We POST each sequentially and report the
  // count back so the charterer doesn't have to submit 12 forms.
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkProgress, setBulkProgress] = useState(null);

  function parseBulkEmails(text) {
    return Array.from(
      new Set(
        text
          .split(/[\s,;]+/)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.includes("@") && s.length < 254)
      )
    );
  }

  async function onBulkInvite(e) {
    e.preventDefault();
    const list = parseBulkEmails(bulkText);
    if (!list.length) {
      setError("Add at least one valid email.");
      return;
    }
    setError(null);
    setInfo(null);
    setBusy(true);
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < list.length; i++) {
      setBulkProgress(`Sending ${i + 1} of ${list.length}…`);
      try {
        const r = await fetch("/api/cabin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: list[i], send_invite: true }),
        });
        if (r.ok) ok += 1; else fail += 1;
      } catch {
        fail += 1;
      }
    }
    setBulkProgress(null);
    setBusy(false);
    setInfo(
      `${ok} invitation${ok === 1 ? "" : "s"} sent${fail ? ` · ${fail} failed` : ""}.`
    );
    setBulkText("");
    void load();
  }

  async function load() {
    try {
      const j = await (await fetch("/api/cabin/guests")).json();
      setMembers(j.members ?? []);
    } catch {
      setMembers([]);
    }
  }
  useEffect(() => { void load(); }, []);

  async function onInvite(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please use a valid email.");
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const r = await fetch("/api/cabin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), display_name: name.trim() || null, send_invite: true }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "invite-failed");
      setInfo(j.mailed
        ? `Invitation sent to ${email.trim()}.`
        : `Added ${email.trim()} (no email sent).`);
      setEmail(""); setName("");
      void load();
    } catch (err) {
      setError(
        err.message === "guest-cannot-invite"
          ? "Only the principal charterer can invite guests."
          : err.message === "cannot-invite-self"
            ? "You are already part of this cabin."
            : "Could not send. Try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function onResend(memberEmail, memberId) {
    setResendingId(memberId);
    setError(null);
    setInfo(null);
    try {
      const r = await fetch("/api/cabin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: memberEmail, send_invite: true }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "resend-failed");
      setInfo(`Reminder sent to ${memberEmail}.`);
      void load();
    } catch {
      setError("Could not resend just now. Try again in a moment.");
    } finally {
      setResendingId(null);
    }
  }

  async function onRemove(member_id, role) {
    if (role === "principal_charterer") return;
    if (!confirm("Remove this guest from your cabin? They will lose access immediately.")) return;
    setError(null);
    try {
      const r = await fetch("/api/cabin/guests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "remove-failed");
      }
      void load();
    } catch {
      setError("Could not remove that guest just now. Please try again.");
    }
  }

  // Compute a tiny summary line — used in the header so the
  // principal sees progress at a glance.
  const guestRows = (members ?? []).filter(
    (m) => m.role !== "principal_charterer" && m.role !== "designated_assistant"
  );
  const readyCount = guestRows.filter(
    (m) => m.personal_details_completed_at
  ).length;
  const joinedCount = guestRows.filter((m) => m.last_login_at).length;
  const invitedTotal = guestRows.length;

  return (
    <article>
      <SectionTitle
        kicker="Your group"
        title="Who is"
        italic="sailing with you?"
      />
      <IntroParagraph>
        Add an email for each guest. Each one receives their own private
        sign-in to your Cabin — they share their own details (allergies,
        swimming, anything we should know) so you’re not asked to remember
        it all for them. You stay in control: invite, resend or remove
        at any time.
      </IntroParagraph>

      {invitedTotal > 0 && (
        <div className="guests-summary" aria-live="polite">
          <span><strong>{invitedTotal}</strong> invited</span>
          <span>·</span>
          <span><strong>{joinedCount}</strong> joined</span>
          <span>·</span>
          <span><strong>{readyCount}</strong> shared their details</span>
        </div>
      )}

      <form className="guests-add" onSubmit={onInvite}>
        <div className="guests-add__row">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="guest@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Their name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send invite"}
          </button>
        </div>
        {error && <p className="guests-add__error">{error}</p>}
        {info  && <p className="guests-add__info">{info}</p>}

        <button
          type="button"
          className="guests-add__bulk-toggle"
          onClick={() => setBulkOpen((v) => !v)}
        >
          {bulkOpen ? "× Close bulk invite" : "+ Invite multiple guests at once"}
        </button>

        {bulkOpen && (
          <div className="guests-add__bulk">
            <p className="guests-add__bulk-hint">
              <em>Paste one email per line — or separated by commas. We’ll
              send each guest their own private sign-in link.</em>
            </p>
            <textarea
              rows={6}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"alice@example.com\nbob@example.com\ncarol@example.com"}
              disabled={busy}
            />
            <div className="guests-add__bulk-row">
              <span className="guests-add__bulk-count">
                {(() => {
                  const n = parseBulkEmails(bulkText).length;
                  return n === 0 ? "" : `${n} valid email${n === 1 ? "" : "s"} detected`;
                })()}
              </span>
              <button type="button" onClick={onBulkInvite} disabled={busy || parseBulkEmails(bulkText).length === 0}>
                {bulkProgress || (busy ? "Sending…" : "Send all invitations")}
              </button>
            </div>
          </div>
        )}
      </form>

      <h2 className="guests-section">Your cabin members</h2>
      {members === null && <p style={{ color: "rgba(13,27,42,0.5)" }}>Loading…</p>}
      {members?.length > 0 && (
        <ul className="guests-list">
          {members.map((m) => {
            const status = statusFor(m);
            const badge = STATUS_BADGE[status];
            const showResend =
              m.role !== "principal_charterer" &&
              m.role !== "designated_assistant" &&
              (status === "invited" || status === "joined");
            return (
              <li key={m.id}>
                <div className="guests-list__head">
                  <strong>{m.display_name || m.email}</strong>
                  <em>{ROLE_LABEL[m.role] ?? m.role}</em>
                </div>
                <div className="guests-list__meta">
                  <span>{m.email}</span>
                  {m.last_login_at
                    ? <span>· signed in {new Date(m.last_login_at).toLocaleDateString()}</span>
                    : m.invite_sent_at
                      ? <span>· invited {new Date(m.invite_sent_at).toLocaleDateString()}</span>
                      : <span>· not invited yet</span>}
                </div>
                {m.role !== "principal_charterer" && (
                  <div className={`guests-list__badge guests-list__badge--${badge.tone}`}>
                    {badge.label}
                  </div>
                )}
                <div className="guests-list__actions">
                  {showResend && (
                    <button
                      type="button"
                      onClick={() => onResend(m.email, m.id)}
                      disabled={resendingId === m.id}
                      className="guests-list__resend"
                    >
                      {resendingId === m.id ? "Resending…" : "Resend invite"}
                    </button>
                  )}
                  {m.role !== "principal_charterer" && (
                    <button
                      onClick={() => onRemove(m.id, m.role)}
                      className="guests-list__remove"
                      type="button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        .guests-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: baseline;
          margin: 18px 0 0 0;
          padding: 14px 16px;
          background: rgba(201, 168, 76, 0.07);
          border-left: 2px solid var(--gy-gold);
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          color: rgba(13,27,42,0.75);
        }
        .guests-summary strong {
          font-weight: 500;
          color: var(--gy-navy);
        }
        .guests-add {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 18px;
          margin-top: 28px;
          margin-bottom: 28px;
        }
        .guests-add__row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .guests-add__row { grid-template-columns: 1.4fr 1fr auto; align-items: end; gap: 16px; }
        }
        .guests-add__row input {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 8px 0 9px;
          font-family: var(--gy-font-body);
          font-size: 16px;
          color: var(--gy-navy);
          outline: none;
        }
        .guests-add__row input:focus { border-bottom-color: var(--gy-gold); }
        .guests-add__row button {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 11px 22px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
        }
        .guests-add__row button:disabled { opacity: 0.55; cursor: not-allowed; }
        .guests-add__error {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 10px 0 0 0;
        }
        .guests-add__bulk-toggle {
          background: transparent;
          border: 0;
          color: var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 14px 0 0 0;
          cursor: pointer;
        }
        .guests-add__bulk {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed rgba(13,27,42,0.12);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .guests-add__bulk-hint {
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13,27,42,0.6);
          margin: 0;
        }
        .guests-add__bulk textarea {
          width: 100%;
          background: rgba(13,27,42,0.02);
          border: 1px solid rgba(13,27,42,0.12);
          padding: 12px;
          font-family: var(--gy-font-body);
          font-size: 14px;
          color: var(--gy-navy);
          outline: none;
          resize: vertical;
          min-height: 110px;
        }
        .guests-add__bulk textarea:focus { border-color: var(--gy-gold); }
        .guests-add__bulk-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .guests-add__bulk-count {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 1.5px;
          color: rgba(13,27,42,0.5);
          text-transform: uppercase;
        }
        .guests-add__bulk-row button {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 11px 22px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .guests-add__bulk-row button:disabled { opacity: 0.55; cursor: not-allowed; }
        .guests-add__info {
          color: #2f7d3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 10px 0 0 0;
        }
        .guests-section {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 28px 0 14px 0;
          font-weight: 500;
        }
        .guests-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guests-list li {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 14px 16px;
          position: relative;
        }
        .guests-list__head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .guests-list__head strong {
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          font-weight: 400;
        }
        .guests-list__head em {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-style: normal;
        }
        .guests-list__meta {
          margin-top: 4px;
          font-family: var(--gy-font-body);
          font-size: 12.5px;
          color: rgba(13,27,42,0.55);
        }
        .guests-list__badge {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 9px;
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .guests-list__badge--ok    { background: rgba(47, 125, 58, 0.12); color: #2f7d3a; }
        .guests-list__badge--warm  { background: rgba(201, 168, 76, 0.14); color: #8a7327; }
        .guests-list__badge--cool  { background: rgba(13, 27, 42, 0.06);   color: rgba(13,27,42,0.65); }
        .guests-list__badge--muted { background: rgba(13, 27, 42, 0.04);   color: rgba(13,27,42,0.45); }
        .guests-list__actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .guests-list__resend {
          background: transparent;
          border: 1px solid var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 12px;
          cursor: pointer;
          color: var(--gy-gold);
        }
        .guests-list__resend:hover {
          background: var(--gy-gold);
          color: #ffffff;
        }
        .guests-list__resend:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .guests-list__remove {
          background: transparent;
          border: 1px solid rgba(13,27,42,0.18);
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 12px;
          cursor: pointer;
          color: rgba(13,27,42,0.6);
        }
        .guests-list__remove:hover {
          color: #b14a3a;
          border-color: #b14a3a;
        }
      `}</style>
    </article>
  );
}
