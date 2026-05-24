"use client";

// /cabin/me/at-the-table — Guest's personal "At the Table"
// contribution.
//
// 2026-05-23 — Multi-user Brief (Phase 3, George friend-test 4).
//
// Mounts the SAME <DiningFields /> form the principal sees on
// /cabin/brief/dining, but routes save traffic to
// /api/cabin/me/contribution/dining (cabin_brief_contributions
// per-member row) instead of the per-cabin canonical brief.
//
// Why: George wants guests to share their menu/food preferences
// alongside the principal's, so the principal can see "Vasilis
// likes lamb + Greek meze, Eleanna prefers Mediterranean light"
// at review time and the chef arrives with the full picture.
//
// Same fields, same validation, same autosave UX as the principal
// brief — the only differences are:
//   1. Endpoint base → /api/cabin/me/contribution
//   2. Header: "Your contribution" eyebrow, no section number
//   3. Nav: back to /cabin/me (no Submit, that's the principal's)
//   4. Page intro: explains the personal-contribution context

import { useEffect, useState } from "react";
import Link from "next/link";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
import SampleMenuPreview from "../../../../components/cabin/brief/SampleMenuPreview";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import DiningFields from "../../../../components/cabin/brief/DiningFields";
import GroupVoicesPanel from "../../../../components/cabin/brief/GroupVoicesPanel";
import WishlistPanel from "../../../../components/cabin/brief/WishlistPanel";

export default function AtTheTableContributionPage() {
  // Same hasMinors fetch as the principal route — the children
  // block is a fixed slice of the form and respects the manifest
  // either way.
  const [hasMinors, setHasMinors] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/has-minors")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.ok) setHasMinors(Boolean(j.hasMinors));
        else setHasMinors(false);
      })
      .catch(() => {
        if (!cancelled) setHasMinors(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article>
      <SectionTitle
        kicker="Your contribution · At the Table"
        title="At the"
        italic="table."
      />
      <IntroParagraph>
        Your host has invited everyone in the group to share their own
        food preferences. The principal charterer will see your answers
        alongside the rest of the group&apos;s when they review the brief
        with George. Every field is optional — leave what doesn&apos;t
        apply.
      </IntroParagraph>

      {/* 2026-05-23 — source="self" reads the calling guest's
          OWN allergies from /api/cabin/me (personal_details).
          Without this prop the alert would fetch the principal's
          /api/cabin/brief/health — Vasilis would see "none" even
          though he'd written "Nuts" in his own /me page, a real
          safety hazard George caught on the friend test. */}
      <AllergyAlert source="self" />
      <SampleMenuPreview />
      <GroupVoicesPanel sectionKey="dining" />

      <BriefFormShell
        sectionKey="dining"
        endpointBase="/api/cabin/me/contribution"
        backHref="/cabin/me"
        backLabel="Back to your details"
        hideSubmit
      >
        {({ register }) => <DiningFields register={register} hasMinors={hasMinors} />}
      </BriefFormShell>

      {/* 2026-05-23 — MUB-C: shared specific-items wishlist sits at
          the bottom of the form. Collapsed by default — never
          demands interaction. The hostess provisions from the
          frequency picks above; this is the optional escape for
          named items. */}
      <WishlistPanel sectionKey="dining" />

      <p className="contribution-footnote">
        Next: <Link href="/cabin/me/in-the-cellar">In the Cellar →</Link>
      </p>

      <style jsx>{`
        .brief-subhead {
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 36px 0 12px 0;
          font-weight: 500;
        }
        .brief-subhead-sm {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          margin: 18px 0 10px 0;
          font-weight: 500;
        }
        .brief-grid-3 { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 560px) {
          .brief-grid-3 { grid-template-columns: 1fr 1fr 1fr; gap: 0 24px; }
        }
        .brief-grid-2 { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 560px) {
          .brief-grid-2 { grid-template-columns: 1fr 1fr; gap: 0 24px; }
        }
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0 0 14px 0;
        }
        .brief-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          cursor: pointer;
        }
        .brief-toggle input { width: 18px; height: 18px; accent-color: var(--gy-gold); }
        .contribution-footnote {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13, 27, 42, 0.65);
          margin: 28px 0 0 0;
          text-align: center;
        }
        .contribution-footnote a {
          color: var(--gy-navy);
          text-decoration: none;
          background-image: linear-gradient(
            to right, var(--gy-gold), var(--gy-gold)
          );
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
        }
      `}</style>
    </article>
  );
}
