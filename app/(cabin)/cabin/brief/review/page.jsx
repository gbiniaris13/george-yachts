// app/(cabin)/cabin/brief/review/page.jsx
// =============================================================
// 2026-05-22 — Brief review + submit screen.
//
// The principal charterer hits "Send to George" here. This is
// the gate between the collaborative-editing phase and the
// locked-by-the-broker phase.
//
// Behaviour:
//   • Only renders for principal_charterer (everyone else is
//     redirected back to /cabin/brief read-only).
//   • Shows submission state at the top (locked banner if
//     already submitted, otherwise the pre-submit summary).
//   • Lists each brief section with the member who last edited
//     it and a quick "open" link — the principal can hop back
//     to any section to adjust before sending.
//   • Submit button opens a double-click modal ("One last
//     look") to prevent accidental presses.
//
// After successful submit, redirects back to /cabin/brief which
// shows the locked banner.
// =============================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import ReviewSubmit from "./ReviewSubmit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review your brief · The Cabin" };

const SECTION_ORDER = [
  { key: "arrival", title: "Arrival & Departure" },
  { key: "guests", title: "Your Group" },
  { key: "health", title: "Health & Safety" },
  { key: "itinerary", title: "Your Itinerary" },
  { key: "life_aboard", title: "Life Aboard" },
  { key: "dining", title: "At the Table" },
  { key: "beverages", title: "In the Cellar" },
  { key: "children", title: "If You're Sailing with Children", onlyIfMinors: true },
];

export default async function BriefReviewPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const membership = resolveMembership(session, cabinId);
  if (!membership) redirect("/cabin/login");

  // Only the principal can ship the brief. Other members land
  // back at /cabin/brief which is read-only for everyone after
  // the principal submits — but before submission they can
  // still edit sections; just not press Submit.
  if (membership.role !== "principal_charterer") {
    redirect("/cabin/brief");
  }

  const db = getCabinDb();

  // Cabin + submission state
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select(
        "vessel_name, principal_charterer_name, charter_period_from, charter_period_to, brief_submitted_at, brief_submitted_by_member_id, brief_completion_percent",
      )
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!cabin) return null;

  // Manifest — children-section gating
  const manifest = await dbQuery(
    db
      .from("cabin_guests_manifest")
      .select("is_minor, date_of_birth")
      .eq("cabin_id", cabinId),
  );
  const hasMinors = (manifest ?? []).some((g) => {
    if (g.is_minor === true) return true;
    if (!g.date_of_birth) return false;
    const years =
      (Date.now() - new Date(g.date_of_birth).getTime()) /
      (365.25 * 24 * 3600 * 1000);
    return Number.isFinite(years) && years < 18;
  });
  const visible = SECTION_ORDER.filter((s) => !s.onlyIfMinors || hasMinors);

  // Sections + last-edited-by member ids
  const sections = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select(
        "section_key, completed, last_edited_at, last_edited_by_member_id",
      )
      .eq("cabin_id", cabinId),
  );

  // Pull display names for any member referenced
  const ids = new Set();
  for (const s of sections ?? []) {
    if (s.last_edited_by_member_id) ids.add(s.last_edited_by_member_id);
  }
  if (cabin.brief_submitted_by_member_id) {
    ids.add(cabin.brief_submitted_by_member_id);
  }
  let nameById = {};
  if (ids.size > 0) {
    const rows = await dbQuery(
      db
        .from("cabin_members")
        .select("id, display_name")
        .in("id", Array.from(ids)),
    );
    nameById = Object.fromEntries(
      (rows ?? []).map((r) => [r.id, r.display_name || ""]),
    );
  }

  const sectionsByKey = Object.fromEntries(
    (sections ?? []).map((s) => [s.section_key, s]),
  );

  // 2026-05-22 — Brief admins (delegated) + opted-out guests + the
  // readiness check on the Send-to-George modal. The principal sees:
  //   • who's been delegated brief-admin (also able to submit)
  //   • who has formally stepped aside from order/cellar choices
  //   • who's still pending personal-details (so they can be nudged
  //     before the brief is locked).
  const groupRows = await dbQuery(
    db
      .from("cabin_members")
      .select(
        "id, display_name, email, role, is_brief_admin, brief_participation_opt_out_at, brief_participation_opt_out_note, personal_details_completed_at, last_login_at",
      )
      .eq("cabin_id", cabinId)
      .is("deleted_at", null),
  );
  const delegatedAdmins = (groupRows ?? []).filter(
    (m) => m.is_brief_admin && m.role !== "principal_charterer",
  );
  const optedOut = (groupRows ?? []).filter(
    (m) => m.brief_participation_opt_out_at,
  );

  // 2026-05-22 — Crew-list readiness — HARD gate.
  // The brief now requires every cabin member (principal + every
  // non-opted-out guest) to have completed the five port-authority
  // essentials (date of birth, gender, nationality, ID or passport
  // number, mobile). personal_details_completed_at is set by the
  // /api/cabin/me PUT only when isCrewListComplete passes, so we
  // can read it as the canonical "crew-list ready" signal.
  const guestRows = (groupRows ?? []).filter(
    (m) => m.role !== "principal_charterer",
  );
  const allMembersForReadiness = (groupRows ?? []).filter(
    (m) => !m.brief_participation_opt_out_at,
  );
  const pendingMembers = allMembersForReadiness
    .filter((m) => !m.personal_details_completed_at)
    .map((m) => ({
      name: m.display_name || m.email,
      role: m.role,
      hasLoggedIn: Boolean(m.last_login_at),
    }));
  // Back-compat alias used by ReviewSubmit's existing copy paths.
  const pendingGuests = pendingMembers;

  const isSubmitted = Boolean(cabin.brief_submitted_at);
  const submittedAtPretty = isSubmitted
    ? new Date(cabin.brief_submitted_at).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const submittedByName = cabin.brief_submitted_by_member_id
    ? nameById[cabin.brief_submitted_by_member_id] || ""
    : "";

  const allDone =
    visible.length > 0 &&
    visible.every((s) => sectionsByKey[s.key]?.completed);
  const completionPercent = cabin.brief_completion_percent ?? 0;

  return (
    <article className="cabin-brief-review">
      <header className="cabin-brief-review__head">
        <Link href="/cabin/brief" className="cabin-brief-review__back">
          ← Back to the brief
        </Link>
        <div className="cabin-brief-review__eyebrow">Review &amp; send</div>
        <h1 className="cabin-brief-review__title">
          One last look,{" "}
          <em>before George reads it.</em>
        </h1>
        <p className="cabin-brief-review__lede">
          {isSubmitted
            ? "Your brief has been sent. The captain, chef and George have all started preparing your week."
            : "Every line below was written by your group — your guests, you. George reads every one of them personally. Once you send, only George can re-open the brief for changes — so take a quiet moment to read through and tap into any section that doesn't yet feel like your week."}
        </p>
      </header>

      {isSubmitted ? (
        <section className="cabin-brief-review__locked">
          <div className="cabin-brief-review__locked-eyebrow">
            Your brief is with George
          </div>
          <p className="cabin-brief-review__locked-copy">
            Submitted{submittedByName ? ` by ${submittedByName}` : ""}
            {submittedAtPretty ? ` · ${submittedAtPretty}` : ""}. George will
            read it personally and reply within a day. If you need to make a
            change, write to George — he can reopen the brief for everyone.
          </p>
        </section>
      ) : null}

      {(delegatedAdmins.length > 0 || optedOut.length > 0) && (
        <section className="cabin-brief-review__group">
          <div className="cabin-brief-review__group-eyebrow">
            Your group&apos;s choices
          </div>
          {delegatedAdmins.length > 0 && (
            <p className="cabin-brief-review__group-line">
              <strong>Brief admin{delegatedAdmins.length > 1 ? "s" : ""}:</strong>{" "}
              {delegatedAdmins
                .map((m) => m.display_name || m.email)
                .join(", ")}{" "}
              — can also send the brief to George on your behalf.
            </p>
          )}
          {optedOut.length > 0 && (
            <p className="cabin-brief-review__group-line">
              <strong>Opted out of orders &amp; cellar:</strong>{" "}
              {optedOut
                .map((m) => m.display_name || m.email)
                .join(", ")}{" "}
              — their allergies, dietary, swimming and passport details
              remain with them. They&apos;ve left the group choices to
              the rest of you.
            </p>
          )}
        </section>
      )}

      <ol className="cabin-brief-review__list">
        {visible.map((s, i) => {
          const row = sectionsByKey[s.key];
          const done = row?.completed;
          const editedBy = row?.last_edited_by_member_id
            ? nameById[row.last_edited_by_member_id] || ""
            : "";
          const editedAt = row?.last_edited_at
            ? new Date(row.last_edited_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })
            : "";
          return (
            <li key={s.key} className="cabin-brief-review__item">
              <div className="cabin-brief-review__item-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="cabin-brief-review__item-body">
                <div className="cabin-brief-review__item-title">
                  {s.title}
                </div>
                <div className="cabin-brief-review__item-meta">
                  {done ? (
                    <span className="cabin-brief-review__item-status">
                      ✓ Filled
                    </span>
                  ) : (
                    <span className="cabin-brief-review__item-status cabin-brief-review__item-status--missing">
                      Not yet filled
                    </span>
                  )}
                  {editedBy && (
                    <span className="cabin-brief-review__item-by">
                      · last edited by {editedBy}
                      {editedAt ? ` · ${editedAt}` : ""}
                    </span>
                  )}
                </div>
              </div>
              {!isSubmitted && (
                <Link
                  href={`/cabin/brief/${s.key.replace(/_/g, "-")}`}
                  className="cabin-brief-review__item-edit"
                >
                  Open →
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {!isSubmitted && (
        <ReviewSubmit
          vesselName={cabin.vessel_name}
          completionPercent={completionPercent}
          allDone={allDone}
          guestsTotal={guestRows.length}
          pendingGuests={pendingGuests}
        />
      )}

      <style>{`
        .cabin-brief-review {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-bottom: 60px;
        }
        .cabin-brief-review__back {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          text-decoration: none;
          margin-bottom: 8px;
          align-self: flex-start;
        }
        .cabin-brief-review__back:hover { color: var(--gy-navy); }
        .cabin-brief-review__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-brief-review__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 30px;
          line-height: 1.15;
          margin: 10px 0 14px 0;
          color: var(--gy-navy);
          letter-spacing: -0.3px;
        }
        @media (min-width: 640px) {
          .cabin-brief-review__title { font-size: 38px; }
        }
        .cabin-brief-review__title em {
          font-style: italic;
          color: var(--gy-gold);
        }
        .cabin-brief-review__lede {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(13, 27, 42, 0.7);
          margin: 0;
          max-width: 64ch;
        }

        .cabin-brief-review__locked {
          background: rgba(13, 27, 42, 0.04);
          border: 1px solid rgba(13, 27, 42, 0.15);
          padding: 22px 24px;
        }
        .cabin-brief-review__locked-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-brief-review__locked-copy {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.7);
          margin: 8px 0 0 0;
        }

        .cabin-brief-review__group {
          background: rgba(201, 168, 76, 0.06);
          border-left: 2px solid var(--gy-gold);
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cabin-brief-review__group-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #8a7327;
          font-weight: 600;
        }
        .cabin-brief-review__group-line {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.78);
          margin: 0;
        }
        .cabin-brief-review__group-line strong {
          font-weight: 500;
          color: var(--gy-navy);
        }

        .cabin-brief-review__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          background: rgba(13, 27, 42, 0.08);
          border: 1px solid rgba(13, 27, 42, 0.10);
        }
        .cabin-brief-review__item {
          background: #ffffff;
          display: grid;
          grid-template-columns: 48px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 18px 18px;
          border-bottom: 1px solid rgba(13, 27, 42, 0.06);
        }
        .cabin-brief-review__item:last-child { border-bottom: 0; }
        .cabin-brief-review__item-num {
          font-family: var(--gy-font-editorial);
          font-size: 22px;
          font-weight: 300;
          color: rgba(13, 27, 42, 0.45);
          letter-spacing: -0.5px;
        }
        .cabin-brief-review__item-title {
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          color: var(--gy-navy);
        }
        .cabin-brief-review__item-meta {
          margin-top: 4px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.5);
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .cabin-brief-review__item-status {
          color: rgba(13, 27, 42, 0.7);
          font-weight: 600;
        }
        .cabin-brief-review__item-status--missing {
          color: rgba(180, 100, 100, 0.85);
        }
        .cabin-brief-review__item-edit {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-navy);
          text-decoration: none;
          padding: 8px 14px;
          border: 1px solid rgba(13, 27, 42, 0.2);
          font-weight: 600;
        }
        .cabin-brief-review__item-edit:hover {
          background: var(--gy-navy);
          color: var(--gy-ivory);
        }
      `}</style>
    </article>
  );
}
