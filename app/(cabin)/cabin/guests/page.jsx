// /cabin/guests — charterer's guest invitation page (Phase 2).
"use client";

import { useEffect, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

const ROLE_LABEL = {
  principal_charterer: "Principal charterer (you)",
  guest: "Guest",
  designated_assistant: "Designated assistant",
};

export default function GuestsPage() {
  const [members, setMembers] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
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

  return (
    <article>
      <SectionTitle
        kicker="Invite your guests"
        title="Who is"
        italic="sailing with you?"
      />
      <IntroParagraph>
        Add the email of each guest joining you. Each receives their own
        private sign-in link to your Cabin, with a small welcome from us.
        They see the same details you see, except for any pages you choose
        to keep private. You stay in control — invite or remove at any time.
        Most charters carry six to twelve guests; use the bulk option below
        if you’d rather paste the whole list at once.
      </IntroParagraph>

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
          {members.map((m) => (
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
                <button onClick={() => onRemove(m.id, m.role)} className="guests-list__remove" type="button">
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <style>{`
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
          font-size: 14px;
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
        .guests-list__remove {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: 1px solid rgba(13,27,42,0.18);
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 10px;
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
