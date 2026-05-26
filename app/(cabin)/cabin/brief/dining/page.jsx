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
import Link from "next/link";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import AllergyAlert from "../../../../components/cabin/brief/AllergyAlert";
import SampleMenuPreview from "../../../../components/cabin/brief/SampleMenuPreview";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import SectionProgress from "../../../../components/cabin/brief/SectionProgress";
import DiningFields from "../../../../components/cabin/brief/DiningFields";
import SharedBriefIndicator from "../../../../components/cabin/brief/SharedBriefIndicator";
// 2026-05-26 — Brief 02 (A2 + A8): GuestAdditiveBanner + WishlistPanel
// imports kept so the rest of the file structure stays familiar, but
// neither is mounted anymore on this page. See render branches below.
import GuestAdditiveBanner from "../../../../components/cabin/brief/GuestAdditiveBanner";
import WishlistPanel from "../../../../components/cabin/brief/WishlistPanel";
import GuestBriefReadOnly from "../../../../components/cabin/brief/GuestBriefReadOnly";

export default function DiningSectionPage() {
  // 2026-05-21 — Pass 7 prep (Domingo): the Children block below
  // was rendered unconditionally. It's now gated on a server signal
  // sourced from cabin_guests_manifest. Sailing with no minors →
  // no kids subheading, no cot/high-chair toggles, no baby-food
  // prompt. With minors → the block surfaces with a soft intro so
  // it doesn't appear out of nowhere.
  const [hasMinors, setHasMinors] = useState(null); // null = unknown
  // 2026-05-26 — Brief 02 (A2): isPrincipal is now TRI-STATE so the
  // page can render the right tree on first paint without flashing
  // the guest view at the principal.
  //   null  = role not yet resolved → loading skeleton
  //   true  = principal (or delegated brief-admin) → full edit tree
  //   false = guest → read-only view + "Back to your Cabin"
  // The check accepts is_brief_admin = true so delegated admins see
  // the edit tree, mirroring the server-side gate in
  // app/api/cabin/brief/[section]/route.js.
  const [isPrincipal, setIsPrincipal] = useState(null);
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
    fetch("/api/cabin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (!j?.ok) {
          setIsPrincipal(false);
          return;
        }
        const m = j?.member;
        const canEdit =
          m?.role === "principal_charterer" || m?.is_brief_admin === true;
        setIsPrincipal(Boolean(canEdit));
      })
      .catch(() => {
        if (!cancelled) setIsPrincipal(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2026-05-26 — Brief 02 (A2): tri-state loading skeleton. Until
  // we know the viewer's role we render the section title + a calm
  // shimmer card so the SSR/CSR first paint never shows form
  // controls to a guest (and never shows read-only text to the
  // principal). One render branch per resolved state below.
  if (isPrincipal === null) {
    return (
      <article>
        <SectionTitle
          kicker="Section Six · At the Table"
          title="At the"
          italic="table."
        />
        <div
          aria-busy="true"
          aria-label="Loading"
          style={{
            marginTop: 22,
            height: 120,
            borderRadius: 3,
            background:
              "linear-gradient(90deg, rgba(13,27,42,0.05) 25%, rgba(13,27,42,0.1) 37%, rgba(13,27,42,0.05) 63%)",
            backgroundSize: "400% 100%",
            animation: "gbr-shimmer 1.4s infinite",
          }}
        />
        <style jsx>{`
          @keyframes gbr-shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </article>
    );
  }

  // 2026-05-26 — Brief 02 (A2): GUEST READ-ONLY BRANCH. Under the
  // new single-responsibility model, guests do not edit dining —
  // the Main Charterer owns the decision. The server now 403s any
  // guest PUT to /api/cabin/brief/dining (see Task A1). On the
  // UI side we replace the entire field tree with a calm
  // read-only definition list, no SectionProgress (guests don't
  // step through sections), no GuestAdditiveBanner, no
  // WishlistPanel, no SaveStatus, no Save/Next. Just the title,
  // the safety AllergyAlert (member's own data — kept for chef-
  // safety relevance even when read-only), the read-only snapshot
  // of what the principal has chosen, and a calm "Back to your
  // Cabin" link.
  if (isPrincipal === false) {
    return (
      <article>
        <SectionTitle
          kicker="Section Six · At the Table"
          title="At the"
          italic="table."
        />
        <AllergyAlert source="self" />
        <GuestBriefReadOnly sectionKey="dining" kind="dining" />
        <nav className="guest-back-nav">
          <Link href="/cabin" className="guest-back-link">
            ← Back to your Cabin
          </Link>
        </nav>
        <style jsx>{`
          .guest-back-nav {
            margin: 28px 0 0 0;
            padding-top: 22px;
            border-top: 1px solid rgba(13, 27, 42, 0.08);
            display: flex;
            justify-content: flex-start;
          }
          .guest-back-link {
            font-family: var(--gy-font-ui);
            font-size: 11px;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: rgba(13, 27, 42, 0.65);
            text-decoration: none;
            padding: 14px 0;
            min-height: 48px;
            display: inline-flex;
            align-items: center;
          }
          .guest-back-link:hover { color: var(--gy-navy); }
        `}</style>
      </article>
    );
  }

  // isPrincipal === true → fall through to existing principal tree below.

  return (
    <article>
      <SectionProgress stepNumber={6} stepTotal={8} stepLabel="At the Table" />
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
      {/* 2026-05-24 — Christos pass (GDPR): switched aggregate
          → self. Brief/dining is editable by EVERYONE in the
          shared brief model, so an aggregate allergy view would
          leak each member's medical info to every other member.
          Self-only respects privacy. The principal still sees
          the full aggregate on /cabin/brief/review (principal-
          only page) so the chef briefing is complete. */}
      <AllergyAlert source="self" />

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

      {/* 2026-05-26 — Brief 02 (Task A8.1): GuestAdditiveBanner
          mount removed. Under the new single-responsibility model
          guests no longer write to dining at all — they 403 at the
          server (CP1) and see a read-only render upstream (CP2's
          A2 branch above). The "your edits ADD to the group's
          picks" message is no longer accurate for anyone, so the
          banner is unmounted from every page. The component file
          is kept on disk for back-compat / archeology. */}

      <BriefFormShell
        sectionKey="dining"
        prevSection={{ key: "life_aboard", title: "Life Aboard" }}
        nextSection={{ key: "beverages", title: "In the Cellar" }}
      >
        {({ register, initialData }) => (
          <DiningFields
            register={register}
            hasMinors={hasMinors}
            isPrincipal={isPrincipal}
            initialData={initialData}
          />
        )}
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
