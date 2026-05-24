"use client";

// /cabin/brief/beverages — In the Cellar (principal-owned section).
//
// 2026-05-23 — Multi-user Brief (Phase 3): field bodies extracted
// to <BeveragesFields /> so the same fields power both the
// principal route here AND the guest-contribution route at
// /cabin/me/in-the-cellar. No fields changed in the move.
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

import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import BeveragesFields from "../../../../components/cabin/brief/BeveragesFields";
import SharedBriefIndicator from "../../../../components/cabin/brief/SharedBriefIndicator";
import WishlistPanel from "../../../../components/cabin/brief/WishlistPanel";

export default function BeveragesSectionPage() {
  return (
    <article>
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

      <BriefFormShell
        sectionKey="beverages"
        prevSection={{ key: "dining", title: "At the Table" }}
        isLastSection
      >
        {({ register }) => <BeveragesFields register={register} />}
      </BriefFormShell>

      {/* 2026-05-23 — MUB-C: shared specific-items wishlist. */}
      <WishlistPanel sectionKey="beverages" />

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
      `}</style>
    </article>
  );
}
