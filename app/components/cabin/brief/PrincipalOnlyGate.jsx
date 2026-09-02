// app/components/cabin/brief/PrincipalOnlyGate.jsx
// =============================================================
// 2026-05-24 — George friend test 4: Alexandros (guest) could
// change Patricia's (principal) flight number from his account.
// Wrong-number-on-a-flight = charter-day disaster. Two brief
// sections — arrival + itinerary — now lock to principal only.
//
// This server component is mounted at the TOP of a section page
// (above the form). If the calling member is NOT the principal
// charterer (or a delegated brief admin), it renders a calm
// cream banner explaining the section is principal-only and
// wraps its children in a `<fieldset disabled>` so every form
// input inside is uneditable. If the caller IS authorized, it
// renders children straight through (transparent passthrough).
//
// Defence-in-depth: the API also rejects guest PUTs to these
// sections with 403, so even a curl can't write. The UI gate
// is the polite explanation; the API gate is the protection.
// =============================================================

import Link from "next/link";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import GuestBriefReadOnly from "./GuestBriefReadOnly";

export default async function PrincipalOnlyGate({ sectionTitle, sectionKey, children }) {
  const session = await readSessionFromCookies();
  if (!session) return <>{children}</>;

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return <>{children}</>;

  const membership = resolveMembership(session, cabinId);
  if (!membership) return <>{children}</>;

  let isAuthorized = membership.role === "principal_charterer";
  if (!isAuthorized && membership.member_id) {
    const db = getCabinDb();
    const memberRow = await dbQuery(
      db
        .from("cabin_members")
        .select("is_brief_admin")
        .eq("id", membership.member_id)
        .maybeSingle(),
    );
    isAuthorized = Boolean(memberRow?.is_brief_admin);
  }

  if (isAuthorized) {
    // Principal or delegated brief admin — render the form normally.
    return <>{children}</>;
  }

  // Non-principal guest — calm banner + a read-only VIEW of the
  // section's saved data instead of the form.
  //
  // 2026-05-26 (Domingo fresh-guest test) proved the old
  // `<fieldset disabled>` wrap left the RHF form fully interactive
  // on the live build — guests typed away, every autosave 403ed,
  // and the "couldn't save" pill quietly discarded their words.
  // Life Aboard / Dining / Beverages were switched to an
  // early-return read-only then; the five layout-gated sections
  // kept the broken fieldset until 2026-09-02. Now the editable
  // form never reaches the guest's DOM at all — same pattern,
  // applied here. The API 403 remains the actual protection.
  return (
    <>
      <aside className="pog-banner" role="note">
        <span className="pog-banner__chip">Principal only</span>
        <p className="pog-banner__copy">
          Only the principal charterer can edit{" "}
          <strong>{sectionTitle}</strong>. You can read what&apos;s
          here so you know the plan - but changes stay with the
          person who organised the charter. If something needs
          changing (a different flight, a different island), let
          them know directly.
        </p>
      </aside>

      {sectionKey ? (
        <>
          <GuestBriefReadOnly sectionKey={sectionKey} kind="generic" />
          <nav style={{ marginTop: 28 }}>
            <Link href="/cabin" className="pog-back-link">
              ← Back to your Cabin
            </Link>
          </nav>
        </>
      ) : (
        // Legacy fallback for any call site that hasn't passed
        // sectionKey yet — better a locked-looking form than a crash.
        <fieldset
          className="pog-readonly"
          disabled
          aria-label={`${sectionTitle} - read-only`}
        >
          {children}
        </fieldset>
      )}

      <style>{`
        .pog-banner {
          margin: 0 0 22px 0;
          padding: 14px 18px;
          background: #FCFAF4;
          border: 1px solid rgba(218, 161, 16, 0.32);
          border-left: 3px solid var(--gy-gold, #DAA110);
          border-radius: 3px;
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .pog-banner__chip {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold, #DAA110);
          font-weight: 600;
          flex-shrink: 0;
        }
        .pog-banner__copy {
          margin: 0;
          flex: 1;
          min-width: 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 13.5px;
          color: #0D1B2A;
          line-height: 1.6;
        }
        .pog-banner__copy strong {
          color: #0D1B2A;
          font-weight: 600;
        }
        /* Disabled fieldset visually mutes the form to signal
           that it's not for editing. Keeps everything readable
           - just clearly not interactive. */
        .pog-readonly {
          margin: 0;
          padding: 0;
          border: 0;
          opacity: 0.78;
        }
        .pog-readonly :where(input, textarea, select, button) {
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
