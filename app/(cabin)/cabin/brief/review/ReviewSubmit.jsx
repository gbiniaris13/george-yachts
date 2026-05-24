"use client";

// 2026-05-23 — Portal the confirm modal into document.body so the
// luxury layer's transform on cabin-shell children cannot trap its
// `position: fixed`. Same fix as PhotoGallery + voyage-album.
import { createPortal } from "react-dom";

// app/(cabin)/cabin/brief/review/ReviewSubmit.jsx
// =============================================================
// 2026-05-22 — The "Send to George" client-side island.
//
// Triggers the modal confirmation, fires POST /api/cabin/brief/
// submit, then refreshes the page so the locked banner takes
// over. The server page does the heavy work of read-only
// rendering; this component only owns the submit interaction.
// =============================================================

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewSubmit({
  vesselName,
  completionPercent,
  allDone,
  // 2026-05-22 — Readiness signals injected by the server page.
  // guestsTotal: total non-principal cabin members.
  // pendingGuests: [{ name, hasLoggedIn }] — guests who haven't
  // opted out AND haven't completed personal details. Principal
  // sees them surface both in the calm preamble panel AND in the
  // confirmation modal so the lock decision is informed.
  guestsTotal = 0,
  pendingGuests = [],
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const pendingCount = pendingGuests.length;
  // 2026-05-24 — Hard gate now requires BOTH:
  //   (1) every non-opted-out member has crew list done
  //   (2) every visible brief section is marked complete (the
  //       core dining + beverages picks the chef and hostess need)
  // George friend test 4 final: "Δεν μπορείς να μου το στείλεις
  // αν δεν το έχουν συμπληρώσει όλοι ... στα ποτά και στα crew
  // list και στα φαγητά."
  const canSend = pendingCount === 0 && allDone;
  const everyoneIn =
    guestsTotal === 0 || (pendingCount === 0 && guestsTotal > 0);

  async function confirm() {
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/cabin/brief/submit", { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        throw new Error(j?.message || j?.error || `status ${r.status}`);
      }
      // Refresh — server-rendered submitted state will take over.
      router.refresh();
      // Navigate back to the overview so the locked banner is
      // the first thing they see.
      setTimeout(() => router.push("/cabin/brief"), 300);
    } catch (e) {
      setError(e?.message || "Could not send the brief — try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="cbr-submit">
      {/* 2026-05-24 — Sections-incomplete is now HARD-BLOCKING
          (was soft-warning before). Surface it loudly so the
          principal knows what to chase. */}
      {!allDone && (
        <div
          className="cbr-submit__pending"
          style={{ background: "#ffffff", marginBottom: 14 }}
        >
          <div
            className="cbr-submit__pending-eyebrow"
            style={{ color: "#9a3a2c", fontWeight: 700 }}
          >
            Brief sections still pending — required before sending
          </div>
          <p
            className="cbr-submit__pending-copy"
            style={{ color: "#0D1B2A" }}
          >
            Your brief is{" "}
            <strong>{completionPercent || 0}%</strong> complete.
            The chef and hostess need every section filled — food
            picks, drinks, the lot — before George can plan
            provisioning. Hop back into any section marked&nbsp;
            <em>Not yet filled</em> above and add what&apos;s
            missing. The button below unlocks the moment every
            section flips to <em>Filled</em>.
          </p>
        </div>
      )}

      {/* 2026-05-22 — HARD readiness gate. Per George's directive
          "πρέπει για να κλειδώσει ή αλλιώς δεν κλειδώνει", the brief
          cannot be sent until every non-opted-out member has finished
          their Crew List essentials (port-authority paperwork). The
          Send button below stays disabled while pendingCount > 0,
          and this panel names who's pending so the principal can
          nudge them. */}
      {pendingCount > 0 && (
        <div
          className="cbr-submit__pending"
          /* 2026-05-23 — Explicit white background so the cream-on-
              gold tint of the outer wrapper can't bleed through and
              wash out the text inside this panel. George re-reported
              the eyebrow + "not yet signed in" tags as invisible. */
          style={{ background: "#ffffff" }}
        >
          <div
            className="cbr-submit__pending-eyebrow"
            style={{ color: "#9a3a2c", fontWeight: 700 }}
          >
            Crew list still pending — required before sending
          </div>
          <p
            className="cbr-submit__pending-copy"
            style={{ color: "#0D1B2A" }}
          >
            <strong>{pendingCount}</strong> {pendingCount === 1 ? "person" : "people"} in your group {pendingCount === 1 ? "hasn't" : "haven't"} finished {pendingCount === 1 ? "their" : "their"} Crew List yet (date of birth, gender, nationality, ID or passport number, mobile). The harbour authorities require these for every person aboard, so the brief stays unlocked until they're in.
          </p>
          <ul
            className="cbr-submit__pending-list"
            style={{ color: "#0D1B2A" }}
          >
            {pendingGuests.slice(0, 8).map((g, i) => (
              <li key={`${g.name}-${i}`} style={{ color: "#0D1B2A" }}>
                {g.name}
                {g.role === "principal_charterer" && (
                  <em
                    className="cbr-submit__pending-tag"
                    style={{ color: "#5a4a1f", fontStyle: "italic" }}
                  >
                    {" "}
                    · you
                  </em>
                )}
                {!g.hasLoggedIn && g.role !== "principal_charterer" && (
                  <em
                    className="cbr-submit__pending-tag"
                    style={{ color: "#5a4a1f", fontStyle: "italic" }}
                  >
                    {" "}
                    · not yet signed in
                  </em>
                )}
              </li>
            ))}
            {pendingGuests.length > 8 && (
              <li>
                <em>and {pendingGuests.length - 8} more…</em>
              </li>
            )}
          </ul>
          <p
            className="cbr-submit__pending-note"
            style={{ color: "rgba(13, 27, 42, 0.78)" }}
          >
            <em>
              Nudge them quietly from{" "}
              <a href="/cabin/guests" style={{ color: "#8a7327", borderBottom: "1px solid rgba(201, 168, 76, 0.55)" }}>
                Your Group
              </a>
              , or — if you decide someone won&apos;t be filling theirs
              — they can mark themselves as having stepped aside (opt
              out) from their own page.
            </em>
          </p>
        </div>
      )}

      {everyoneIn && guestsTotal > 0 && (
        <div className="cbr-submit__ready">
          <div className="cbr-submit__ready-eyebrow">Everyone's in</div>
          <p className="cbr-submit__ready-copy">
            All {guestsTotal} {guestsTotal === 1 ? "guest" : "guests"} in
            your group have shared their details, opted out, or had
            their share carried by another member. Whenever you're
            ready, the brief is ready too.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => canSend && setOpen(true)}
        className="cbr-submit__cta"
        disabled={!canSend}
        title={
          !canSend
            ? "Every crew list AND every brief section must be complete before you can send."
            : undefined
        }
        /* 2026-05-23 — Inline contrast guarantee so the disabled
            button text is always readable even if a theme override
            tries to wash it out. */
        style={
          !canSend
            ? {
                background: "rgba(13, 27, 42, 0.08)",
                color: "#0D1B2A",
                borderColor: "rgba(13, 27, 42, 0.25)",
                cursor: "not-allowed",
              }
            : undefined
        }
      >
        {pendingCount > 0
          ? `Waiting on ${pendingCount} crew-list ${pendingCount === 1 ? "line" : "lines"}`
          : !allDone
            ? "Waiting on brief sections"
            : "Send to George →"}
      </button>
      <p className="cbr-submit__after">
        {!canSend
          ? "The brief unlocks the moment crew lists AND every brief section are in. You'll see the green light here."
          : "Once you send, only George can re-open the brief."}
      </p>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="cbr-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cbr-modal-title"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="cbr-modal__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cbr-modal__eyebrow">One last look</div>
            <h3 className="cbr-modal__title" id="cbr-modal-title">
              Ready to send the brief to George?
            </h3>
            <p className="cbr-modal__copy">
              Once you send, the brief for{" "}
              <strong>{vesselName || "your cabin"}</strong> is locked —
              guests can no longer edit, and any change has to come
              through George.{" "}
              {pendingCount > 0 ? (
                <>
                  <strong>
                    {pendingCount} of {guestsTotal}{" "}
                    {guestsTotal === 1 ? "guest" : "guests"}
                  </strong>{" "}
                  in your group hasn't shared their details yet. If you
                  send now, George will read what's here and follow up
                  with them directly.
                </>
              ) : guestsTotal > 0 ? (
                <>Everyone in your group has weighed in.</>
              ) : null}
            </p>
            {error && (
              <p className="cbr-modal__error">
                <strong>Couldn&apos;t send:</strong> {error}
              </p>
            )}
            <div className="cbr-modal__actions">
              <button
                type="button"
                className="cbr-modal__cancel"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Go back
              </button>
              <button
                type="button"
                className="cbr-modal__confirm"
                onClick={confirm}
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send it — I'm sure"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <style>{`
        .cbr-submit {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          margin-top: 8px;
          padding: 24px 24px 24px 24px;
          background: rgba(201, 168, 76, 0.08);
          border: 1px solid rgba(201, 168, 76, 0.5);
          border-left: 3px solid var(--gy-gold);
        }
        .cbr-submit__hint {
          margin: 0 0 4px 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(13, 27, 42, 0.7);
        }
        .cbr-submit__cta {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 14px 24px;
          border: 1px solid var(--gy-gold);
          cursor: pointer;
          transition: background 160ms ease, color 160ms ease;
        }
        .cbr-submit__cta:hover:not(:disabled) {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }
        .cbr-submit__cta:disabled {
          background: rgba(13, 27, 42, 0.18);
          color: rgba(248, 245, 240, 0.85);
          border-color: rgba(13, 27, 42, 0.18);
          cursor: not-allowed;
        }
        .cbr-submit__after {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.5);
          margin: 0;
        }

        /* 2026-05-22 — Readiness preamble panel. */
        .cbr-submit__pending {
          align-self: stretch;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.12);
          border-left: 3px solid rgba(180, 100, 100, 0.85);
          padding: 16px 18px;
          margin: 4px 0;
        }
        .cbr-submit__pending-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(180, 100, 100, 0.95);
          font-weight: 700;
        }
        .cbr-submit__pending-copy {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.82);
          margin: 8px 0 8px 0;
        }
        .cbr-submit__pending-list {
          list-style: disc;
          padding-left: 20px;
          margin: 0 0 10px 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.78);
          line-height: 1.7;
        }
        .cbr-submit__pending-tag {
          color: rgba(13, 27, 42, 0.5);
          font-size: 12.5px;
        }
        .cbr-submit__pending-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.6);
          margin: 8px 0 0 0;
        }
        .cbr-submit__pending-note a {
          color: var(--gy-gold);
          text-decoration: none;
          border-bottom: 1px solid rgba(201, 168, 76, 0.4);
        }

        .cbr-submit__ready {
          align-self: stretch;
          background: rgba(47, 125, 58, 0.06);
          border: 1px solid rgba(47, 125, 58, 0.25);
          border-left: 3px solid #2f7d3a;
          padding: 14px 16px;
          margin: 4px 0;
        }
        .cbr-submit__ready-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #2f7d3a;
          font-weight: 700;
        }
        .cbr-submit__ready-copy {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.78);
          margin: 6px 0 0 0;
        }

        .cbr-modal {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(13, 27, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .cbr-modal__inner {
          background: #ffffff;
          max-width: 520px;
          width: 100%;
          padding: 28px 28px 24px 28px;
          border: 1px solid rgba(13, 27, 42, 0.18);
        }
        .cbr-modal__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .cbr-modal__title {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 22px;
          margin: 8px 0 14px 0;
          color: var(--gy-navy);
          line-height: 1.25;
        }
        .cbr-modal__copy {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.78);
          margin: 0 0 20px 0;
        }
        .cbr-modal__error {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: #b91c1c;
          background: rgba(185, 28, 28, 0.06);
          padding: 10px 12px;
          margin: 0 0 16px 0;
          border-left: 3px solid #b91c1c;
        }
        .cbr-modal__actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .cbr-modal__cancel {
          background: transparent;
          color: var(--gy-navy);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 11px 18px;
          border: 1px solid rgba(13, 27, 42, 0.2);
          cursor: pointer;
        }
        .cbr-modal__confirm {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 22px;
          border: 1px solid var(--gy-gold);
          cursor: pointer;
        }
        .cbr-modal__confirm:hover {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }
        .cbr-modal__confirm:disabled,
        .cbr-modal__cancel:disabled {
          opacity: 0.6;
          cursor: wait;
        }
      `}</style>
    </div>
  );
}
