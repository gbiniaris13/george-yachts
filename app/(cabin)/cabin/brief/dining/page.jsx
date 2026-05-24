"use client";

// /cabin/brief/dining — At the Table (principal-owned section).
//
// 2026-05-23 — Multi-user Brief (Phase 3): the field bodies moved
// out to <DiningFields /> so the SAME field set powers both the
// principal route here AND the guest-contribution route at
// /cabin/me/at-the-table. No fields changed; this file is now a
// thin wrapper.
//
// Industry-grade preference capture: per-item Like/Dislike/Indifferent
// matrix for proteins + sides, granular breakfast checklist with
// "kind of cereal / cheese / jam" specifics, coffee/tea matrix,
// service preferences per meal (light/cold/hot/family style),
// dessert/snacks/afternoon-tea sections, kids' meal arrangement
// with baby cot + high chair + baby food specifics. This is what
// the chef and provisioning team print and shop from.

import { useEffect, useState } from "react";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
import SampleMenuPreview from "../../../../components/cabin/brief/SampleMenuPreview";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import DiningFields from "../../../../components/cabin/brief/DiningFields";
import SharedBriefIndicator from "../../../../components/cabin/brief/SharedBriefIndicator";
import WishlistPanel from "../../../../components/cabin/brief/WishlistPanel";

export default function DiningSectionPage() {
  // 2026-05-21 — Pass 7 prep (Domingo): the Children block below
  // was rendered unconditionally. It's now gated on a server signal
  // sourced from cabin_guests_manifest. Sailing with no minors →
  // no kids subheading, no cot/high-chair toggles, no baby-food
  // prompt. With minors → the block surfaces with a soft intro so
  // it doesn't appear out of nowhere.
  const [hasMinors, setHasMinors] = useState(null); // null = unknown
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
        kicker="Section Six · At the Table"
        title="At the"
        italic="table."
      />
      <IntroParagraph>
        Your chef builds every menu from scratch — there is no fixed list of
        dishes. The more you share, the more thoughtfully your meals can be
        designed. Don&apos;t worry about being too specific. We would rather know
        too much than too little.
      </IntroParagraph>

      {/* 2026-05-20 — Da$k friend-test asked for an allergy banner
          on every food-related page, prominently.
          2026-05-23 — George friend test 4 (Bill nuts, Olga
          pineapple): the principal-only Health-section data was
          missing every guest's /me allergy. Switched to "aggregate"
          mode so the alert merges:
            • the principal's Health section
            • every guest's personal_details allergies + dietary
          and surfaces them attributed by name. Chef sees the
          full group picture without opening guests one-by-one. */}
      <AllergyAlert source="aggregate" />

      {/* 2026-05-20 — Friend-test pass 3 (George): the sample menu
          uploaded in GY Command shows BEFORE the preference ticks so
          the charterer isn't filling in a vacuum. */}
      <SampleMenuPreview />

      {/* 2026-05-23 — SHARED BRIEF MODEL: the form below IS the
          shared document. A small "Last edited by X · Y ago" line
          tells whoever opened the page what's been added before
          them. Replaces the previous GroupVoicesPanel — now the
          form itself is the live group voice. */}
      <SharedBriefIndicator sectionKey="dining" />

      <BriefFormShell
        sectionKey="dining"
        prevSection={{ key: "life_aboard", title: "Life Aboard" }}
        nextSection={{ key: "beverages", title: "In the Cellar" }}
      >
        {({ register }) => <DiningFields register={register} hasMinors={hasMinors} />}
      </BriefFormShell>

      {/* 2026-05-23 — MUB-C: shared specific-items wishlist. */}
      <WishlistPanel sectionKey="dining" />

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
        .brief-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .brief-grid-3 { grid-template-columns: 1fr 1fr 1fr; gap: 0 24px; }
        }
        .brief-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
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
      `}</style>
    </article>
  );
}
