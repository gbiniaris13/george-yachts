// /cabin/your-data — touch ④ · Transparency Dashboard
"use client";

import { useEffect, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

const INLINE_LABELS = {
  essential_charter_emails: "Essential charter emails (logistics, confirmations)",
  memory_anchors: "Photo memory anchors after your voyage",
  filotimo_circle: "Filotimo Circle communications (birthdays, name days)",
  marketing_newsletter: "Occasional newsletters (Bridge, Wake, Compass)",
};

// 2026-05-20 — Friend-test pass 4 (Margaret 70F):
//   "DOB is 1980-06-15 but last sign-in is 5/20/2026, 3:41:23 PM.
//    Two formats on the same page. Pick one." — fmtDate/fmtDateTime
//   unify everything to "15 June 1980" / "20 May 2026, 15:41".
function fmtDate(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) return String(iso);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}
function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function YourDataPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const r = await fetch("/api/cabin/your-data");
      const j = await r.json();
      if (j.ok) {
        setData(j);
        setError(null);
      } else {
        setError("Could not load your data right now. Please refresh in a moment.");
      }
    } catch {
      setError("Could not reach the Cabin. Check your connection and refresh.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function withdraw(kind, target) {
    try {
      const r = await fetch("/api/cabin/your-data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, target }),
      });
      if (!r.ok) throw new Error("delete-failed");
      void load();
    } catch {
      setError("That change could not be saved. Please try again.");
    }
  }

  return (
    <article>
      <SectionTitle
        kicker="Transparency · Your data"
        title="Everything we"
        italic="hold for you."
      />
      <IntroParagraph>
        We believe what we know about you should be visible to you, always.
        Below is every piece of personal information we hold, and what each
        one allows us to do. Switch anything off at any time — your data,
        your decision.
      </IntroParagraph>

      {error && (
        <p className="yd-error" role="alert">{error}</p>
      )}
      {!data && !error && <p className="yd-loading">Loading…</p>}

      {data && (
        <>
          <section className="yd-block">
            <h2>Your profile</h2>
            <dl>
              <Row label="Email">{data.profile.email}</Row>
              <Row label="Display name" onRemove={data.profile.display_name ? () => withdraw("profile_field", "display_name") : null}>
                {data.profile.display_name || <em>—</em>}
              </Row>
              <Row label="Mobile" onRemove={data.profile.mobile ? () => withdraw("profile_field", "mobile") : null}>
                {data.profile.mobile || <em>—</em>}
              </Row>
              <Row label="Role">{data.profile.role?.replace(/_/g, " ")}</Row>
              <Row label="Last sign-in">
                {data.profile.last_login_at
                  ? fmtDateTime(data.profile.last_login_at)
                  : <em>—</em>}
              </Row>
            </dl>
          </section>

          <section className="yd-block">
            <h2>What we may contact you about</h2>
            <ul className="yd-consents">
              {Object.entries(INLINE_LABELS).map(([key, label]) => {
                const granted = data.consents_inline?.[key] !== false;
                return (
                  <li key={key} className={granted ? "is-on" : "is-off"}>
                    <div className="yd-consents__row">
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => withdraw("inline_consent", key)}
                        disabled={!granted}
                      >
                        {granted ? "Stop" : "Off"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {data.circle && (
            <section className="yd-block">
              <h2>What the Filotimo Circle knows</h2>
              <dl>
                <Row label="Member since">
                  {new Date(data.circle.joined_at).toLocaleDateString("en-GB", { year: "numeric" })}
                </Row>
                <Row label="Tier">{data.circle.tier}</Row>
                <Row label="Voyages with us">{data.circle.voyages_count ?? 0}</Row>
                <Row label="Date of birth">{fmtDate(data.circle.date_of_birth) || <em>—</em>}</Row>
                <Row label="Anniversary">{fmtDate(data.circle.anniversary_date) || <em>—</em>}</Row>
                <Row label="Hometown">{data.circle.hometown || <em>—</em>}</Row>
              </dl>
            </section>
          )}

          <section className="yd-block">
            <h2>What we have done with your data</h2>
            {(!data.consents || data.consents.length === 0) ? (
              <p className="yd-empty"><em>Nothing yet. Every interaction will appear here.</em></p>
            ) : (
              <ul className="yd-history">
                {data.consents.map((c) => (
                  <li key={c.id}>
                    <strong>{c.data_point.replace(/_/g, " ")}</strong>
                    <em>used for {c.given_for}</em>
                    <span>{fmtDate(c.created_at)}</span>
                    {c.consent_state === "granted" && (
                      <button onClick={() => withdraw("consent_row", c.id)}>Withdraw</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="yd-foot">
            <em>
              To delete everything we hold for you forever, email
              <a href="mailto:george@georgeyachts.com?subject=Erase%20my%20Cabin">
                &nbsp;george@georgeyachts.com
              </a>. We respond within one working day.
            </em>
          </p>
        </>
      )}

      <style>{`
        .yd-loading {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13,27,42,0.5);
          margin-top: 28px;
        }
        .yd-error {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          margin-top: 28px;
        }
        .yd-block {
          margin-top: 32px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 22px;
        }
        .yd-block h2 {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 0 0 16px 0;
          font-weight: 500;
        }
        dl { margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .yd-row {
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(13,27,42,0.05);
          font-family: var(--gy-font-body);
          font-size: 14px;
        }
        .yd-row dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.5);
        }
        .yd-row dd { margin: 0; font-family: var(--gy-font-editorial); }
        .yd-row em { color: rgba(13,27,42,0.3); }
        .yd-row__btn {
          background: transparent;
          border: 1px solid rgba(13,27,42,0.18);
          color: rgba(13,27,42,0.65);
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 10px;
          cursor: pointer;
        }
        .yd-row__btn:hover { color: var(--gy-gold); border-color: var(--gy-gold); }

        .yd-consents { list-style: none; padding: 0; margin: 0; }
        .yd-consents li {
          padding: 12px 0;
          border-bottom: 1px solid rgba(13,27,42,0.05);
        }
        .yd-consents__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-family: var(--gy-font-body);
          font-size: 14px;
        }
        .yd-consents li.is-off { opacity: 0.45; }
        .yd-consents button {
          background: transparent;
          border: 1px solid rgba(13,27,42,0.18);
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 12px;
          cursor: pointer;
        }
        .yd-consents button:hover:not(:disabled) {
          color: var(--gy-gold);
          border-color: var(--gy-gold);
        }
        .yd-consents button:disabled { opacity: 0.5; cursor: not-allowed; }

        .yd-history { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .yd-history li {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(13,27,42,0.05);
          font-family: var(--gy-font-body);
          font-size: 13px;
        }
        .yd-history em { font-style: italic; color: rgba(13,27,42,0.55); }
        .yd-history span { color: rgba(13,27,42,0.45); }
        .yd-history button {
          background: transparent;
          border: 0;
          color: var(--gy-gold);
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .yd-empty {
          font-family: var(--gy-font-editorial);
          color: rgba(13,27,42,0.5);
          margin: 0;
        }
        .yd-foot {
          margin-top: 28px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13,27,42,0.55);
        }
        .yd-foot a { color: var(--gy-gold); text-decoration: none; border-bottom: 1px solid currentColor; }
      `}</style>
    </article>
  );
}

function Row({ label, children, onRemove }) {
  return (
    <div className="yd-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
      {onRemove ? (
        <button className="yd-row__btn" onClick={onRemove} type="button">Erase</button>
      ) : <span />}
    </div>
  );
}
