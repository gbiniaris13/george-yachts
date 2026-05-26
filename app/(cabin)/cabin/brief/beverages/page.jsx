"use client";

// /cabin/brief/beverages — In the Cellar (principal-owned section).
//
// 2026-05-23 — Multi-user Brief (Phase 3): field bodies extracted
// to <BeveragesFields /> so the same fields power both the
// principal route here AND the guest-contribution route at
// /cabin/me/in-the-cellar. No fields changed in the move.
//
// 2026-05-24 — Angeliki pass: this is Section Seven — the last
// section on the visible flow. The pre-Angeliki version of
// BriefFormShell rendered NOTHING after the back link here (no
// nextSection, no isLastSection), so Angeliki finished the form
// and had no obvious way forward — "πού κάνω save, τι κάνω τώρα?"
// We append a clear role-aware finishing block below the shell:
// guests get a "All done — back to the Cabin" button; the
// principal gets a "Continue to Review →" button leading to the
// /cabin/brief/review submit screen.
//
// 2026-05-20 — Friend-test pass 3 (George):
//   "Δεν είναι F&B managers οι πελάτες μας. Μη βάζεις τον άλλο να
//    γράφει '16 κοκακόλες'. Βάλε τον να μου πει 'Coca-Cola light'
//    και να επιλέξει: το πίνω συχνά / χαλαρά / σπάνια αλλά το
//    χρειάζομαι. Στα κρασιά: θες κρασί; ναι; ελληνικά; ποια
//    χρώματα; premium / standard / classic; συγκεκριμένη
//    ετικέττα; αλλιώς leave it to us."
//
// So the cellar is reframed by category. Each category asks:
//   1. Do you want this stocked?
//   2. (where it matters) Tier — premium / standard / classic /
//      leave-to-us.
//   3. (where it matters) Specific labels you love (free text).
// Plus FrequencyPicker rows for the spirits + soft drinks where
// each item has its own drink-often / sometimes / rarely-but-keep
// chip choice. No numbers, ever.
//
// Old keys (soft_drinks[], wines[], wine_price_range, whiskey[],
// vodka[], gin[], rum[], tequila[], liqueur[], beers[], beers_local[],
// spirits_notes, beers_notes, wine_style, standard_bar_items) stay
// defined in lib/cabin/schemas.js so already-submitted briefs keep
// validating. New submissions populate the *_wanted / *_tier /
// *_frequency / *_specifics keys.

import Link from "next/link";
import { useEffect, useState } from "react";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import SectionProgress from "../../../../components/cabin/brief/SectionProgress";
import BeveragesFields from "../../../../components/cabin/brief/BeveragesFields";
import SharedBriefIndicator from "../../../../components/cabin/brief/SharedBriefIndicator";
// 2026-05-26 — Brief 02 (A2 + A8): GuestAdditiveBanner + WishlistPanel
// imports kept; not mounted on the guest branch and slated for full
// removal in Task A8.
import GuestAdditiveBanner from "../../../../components/cabin/brief/GuestAdditiveBanner";
import WishlistPanel from "../../../../components/cabin/brief/WishlistPanel";
import GuestBriefReadOnly from "../../../../components/cabin/brief/GuestBriefReadOnly";

export default function BeveragesSectionPage() {
  // 2026-05-26 — Brief 02 (A2): tri-state isPrincipal — see
  // /cabin/brief/dining/page.jsx for the full rationale.
  //   null  = role not yet resolved → loading skeleton
  //   true  = principal (or delegated brief-admin) → full edit tree
  //   false = guest → read-only view + "Back to your Cabin"
  // The check accepts is_brief_admin = true so delegated admins see
  // the edit tree, mirroring the server gate in
  // app/api/cabin/brief/[section]/route.js.
  const [isPrincipal, setIsPrincipal] = useState(null);
  useEffect(() => {
    let cancelled = false;
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

  // Loading skeleton — until the role resolves we render the title
  // + a shimmer card so first paint never shows form controls to a
  // guest (and never shows read-only text to the principal).
  if (isPrincipal === null) {
    return (
      <article>
        <SectionTitle
          kicker="Section Seven · In the Cellar"
          title="In the"
          italic="cellar."
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

  // 2026-05-26 — Brief 02 (A2): GUEST READ-ONLY BRANCH. The
  // Main Charterer owns the cellar under the new model. The
  // server 403s any guest PUT to /api/cabin/brief/beverages
  // (Task A1). On the UI side we render zero form controls:
  // section title, a read-only snapshot of the principal's
  // beverage choices, and a calm "Back to your Cabin" link.
  // No SectionProgress (guests don't step through), no
  // GuestAdditiveBanner, no WishlistPanel, no Save/Next CTA,
  // no SaveStatus.
  if (isPrincipal === false) {
    return (
      <article>
        <SectionTitle
          kicker="Section Seven · In the Cellar"
          title="In the"
          italic="cellar."
        />
        <GuestBriefReadOnly sectionKey="beverages" kind="beverages" />
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
      <SectionProgress stepNumber={7} stepTotal={8} stepLabel="In the Cellar" />
      <SectionTitle
        kicker="Section Seven · In the Cellar"
        title="In the"
        italic="cellar."
      />
      <IntroParagraph>
        The bar comes already stocked — gin, vodka, whisky, the usual mixers.
        We only need a sense of what your group actually drinks, and any
        labels that matter to you. The hostess buys the rest. No quantities
        to count, ever.
      </IntroParagraph>

      {/* 2026-05-23 — SHARED BRIEF MODEL: form below IS the
          shared document; this indicator shows who edited last. */}
      <SharedBriefIndicator sectionKey="beverages" />

      {/* 2026-05-24 — Angeliki pass: explain to guests that their
          edits ADD to the group's picks; only the principal can
          remove on review. Server-side mergeForGuest enforces. */}
      <GuestAdditiveBanner />

      {/* 2026-05-24 — Christos pass: dropped `isLastSection` so
          the "I'm done — send to George" button no longer renders
          here for ANY caller. Guests saw it and were misled into
          thinking they could submit on the principal's behalf;
          the API rejected, the UI looked broken. Send-to-George
          properly lives on /cabin/brief/review (principal-only),
          which the NextStep wizard + readiness card both point
          the principal to when the brief is ready. */}
      <BriefFormShell
        sectionKey="beverages"
        prevSection={{ key: "dining", title: "At the Table" }}
      >
        {({ register, initialData }) => (
          <BeveragesFields
            register={register}
            isPrincipal={isPrincipal}
            initialData={initialData}
          />
        )}
      </BriefFormShell>

      {/* 2026-05-23 — MUB-C: shared specific-items wishlist. */}
      <WishlistPanel sectionKey="beverages" />

      {/* 2026-05-24 — Angeliki pass: finishing CTA. Reads "you're
          done with this section — here's what comes next" so the
          user never gets stuck wondering whether their work saved
          or where to click next. Autosave still works in the
          background; this is the explicit go-forward path. */}
      <section className="bev-finish">
        <div className="bev-finish__eyebrow">All sections autosaved as you went</div>
        <h3 className="bev-finish__title">You&apos;ve reached the end of the brief.</h3>
        <p className="bev-finish__copy">
          {isPrincipal ? (
            <>
              Open the review page next — you&apos;ll see every section in one
              place, the group&apos;s contributions merged in, and a final
              &ldquo;Send to George&rdquo; button. Nothing reaches George
              until you press it.
            </>
          ) : (
            <>
              Everything you&apos;ve added is saved. The principal charterer
              will see your contributions when they review the full brief
              before sending it to George.
            </>
          )}
        </p>
        <div className="bev-finish__actions">
          {isPrincipal ? (
            <Link href="/cabin/brief/review" className="bev-finish__cta">
              Continue to Review →
            </Link>
          ) : (
            <Link href="/cabin" className="bev-finish__cta">
              All done — back to the Cabin →
            </Link>
          )}
          <Link href="/cabin/brief" className="bev-finish__secondary">
            ← Back to brief overview
          </Link>
        </div>
      </section>

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
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.65);
          margin: 0 0 14px 0;
          line-height: 1.6;
        }
        /* Pass 4: collapse heavy per-item frequency rows behind a
           details/summary so David's "I'll lie and tick Sometimes"
           failure mode doesn't happen. The hostess provisions from
           house defaults if the user doesn't open the panel. */
        .brief-details {
          margin: 0 0 22px 0;
          padding: 0;
          border-top: 1px solid rgba(13,27,42,0.08);
          border-bottom: 1px solid rgba(13,27,42,0.08);
        }
        .brief-details > summary {
          cursor: pointer;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          padding: 14px 0;
          list-style: none;
        }
        .brief-details > summary::before {
          content: "+ ";
          color: var(--gy-gold);
        }
        .brief-details[open] > summary::before { content: "− "; }
        .brief-details[open] {
          padding: 0 0 14px 0;
        }
        .bev-extras-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.65);
          background: rgba(201, 168, 76, 0.06);
          border-left: 1px solid var(--gy-gold);
          padding: 14px 18px;
          margin: 32px 0 0 0;
        }
        .bev-extras-note strong {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
        /* 2026-05-24 — Angeliki pass: finishing panel. Boutique
           card with a quiet eyebrow ("All sections autosaved as
           you went") so the user is reassured nothing was lost,
           a clear next-step copy block, and a real navy/gold CTA
           button so the path forward is unmistakable. */
        .bev-finish {
          margin: 32px 0 0 0;
          padding: 24px 22px;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.1);
          border-left: 3px solid var(--gy-gold);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bev-finish__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .bev-finish__title {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 22px;
          font-weight: 300;
          color: var(--gy-navy);
          letter-spacing: 0.3px;
          line-height: 1.25;
        }
        .bev-finish__copy {
          margin: 4px 0 12px 0;
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.72);
        }
        .bev-finish__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }
        .bev-finish__cta {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 14px 24px;
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 600;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          transition: background 160ms ease;
        }
        .bev-finish__cta:hover { background: #142233; }
        .bev-finish__secondary {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          text-decoration: none;
          padding: 11px 0;
        }
        .bev-finish__secondary:hover { color: var(--gy-navy); }
      `}</style>
    </article>
  );
}
