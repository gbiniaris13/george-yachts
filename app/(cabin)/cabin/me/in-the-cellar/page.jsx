"use client";

// /cabin/me/in-the-cellar — Guest's personal "In the Cellar"
// contribution.
//
// 2026-05-23 — Multi-user Brief (Phase 3, George friend-test 4).
//
// Sibling to /cabin/me/at-the-table. Same field set as
// /cabin/brief/beverages, same validation, autosave routes to
// /api/cabin/me/contribution/beverages (per-member row).

import Link from "next/link";
import BriefFormShell from "../../../../components/cabin/brief/BriefFormShell";
import IntroParagraph from "../../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../../components/cabin/brief/FormFields";
import BeveragesFields from "../../../../components/cabin/brief/BeveragesFields";
import GroupVoicesPanel from "../../../../components/cabin/brief/GroupVoicesPanel";

export default function InTheCellarContributionPage() {
  return (
    <article>
      <SectionTitle
        kicker="Your contribution · In the Cellar"
        title="In the"
        italic="cellar."
      />
      <IntroParagraph>
        Your group&apos;s wine and cocktail preferences — yours, in your
        words. The principal charterer will see your picks alongside the
        rest of the group&apos;s when they review the brief with George.
        No quantities, no spreadsheets — just what you actually drink.
      </IntroParagraph>

      <GroupVoicesPanel sectionKey="beverages" />

      <BriefFormShell
        sectionKey="beverages"
        endpointBase="/api/cabin/me/contribution"
        backHref="/cabin/me"
        backLabel="Back to your details"
        hideSubmit
      >
        {({ register }) => <BeveragesFields register={register} />}
      </BriefFormShell>

      <p className="contribution-footnote">
        <Link href="/cabin/me">← Back to your details</Link>
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
        .brief-note {
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13, 27, 42, 0.65);
          margin: 0 0 14px 0;
          line-height: 1.6;
        }
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
        .brief-details > summary::before { content: "+ "; color: var(--gy-gold); }
        .brief-details[open] > summary::before { content: "− "; }
        .brief-details[open] { padding: 0 0 14px 0; }
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
