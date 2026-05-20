// app/(cabin)/cabin/filotimo-circle/page.jsx
// =============================================================
// /cabin/filotimo-circle — The Loyalty page.
// =============================================================

import { redirect } from "next/navigation";
import {
  readSessionFromCookies,
} from "@/lib/cabin/auth";
import {
  getCircleMember,
  nextTierGoal,
  TIERS,
} from "@/lib/cabin/filotimo";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

export const metadata = { title: "The Filotimo Circle" };

const TIER_DESCRIPTIONS = {
  friend: {
    label: "Friend",
    blurb:
      "You sail with us once and you are part of us. A small gift each year, your birthday remembered, priority access to availability before the public sees it.",
    perks: [
      "Birthday & name-day wishes from George personally",
      "An annual Greek artisanal small gift (olive oil, honey, salt)",
      "48-hour priority booking window before public release",
      "Quiet re-engagement, never a salesy email",
    ],
  },
  companion: {
    label: "Companion",
    blurb:
      "After your second voyage with us, the relationship deepens. Same gentle touch, with a few more thresholds opened.",
    perks: [
      "Everything a Friend receives",
      "Insider rates on selected vessels",
      "One complimentary Athens insider tour at the end of any future charter",
      "Anniversary gesture on the date your first voyage began",
    ],
  },
  crewmate: {
    label: "Crewmate",
    blurb:
      "Three voyages, or two friends you brought who themselves sailed. You are part of the heart of the Circle now.",
    perks: [
      "Everything a Companion receives",
      "First call on premium vessels for high-season weeks",
      "Personalized planning call with George at any time",
      "A more substantial annual gesture — chosen with you in mind",
    ],
  },
};

export default async function FilotimoCirclePage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const circle = await getCircleMember(session.email);
  const goal = nextTierGoal(circle);

  const currentTier = circle?.tier ?? "friend";

  return (
    <div className="filotimo">
      <header className="filotimo__head">
        <div className="filotimo__eyebrow">The Filotimo Circle</div>
        <h1 className="filotimo__title">
          A small circle of people who have <em>sailed with us.</em>
        </h1>
        <div className="filotimo__rule" aria-hidden />
        <IntroParagraph>
          You did not apply. There is no card. The moment you sail
          with George Yachts — even as a guest of someone else — you
          are part of the Circle. This is what it means, and what it
          gives you, quietly, over the years.
        </IntroParagraph>
      </header>

      {circle && (
        <section className="filotimo__status">
          <div className="filotimo__status-label">Your standing</div>
          <div className="filotimo__status-card">
            <div className="filotimo__tier">
              <em>You are a</em>
              <strong>{TIER_DESCRIPTIONS[currentTier].label}</strong>
            </div>
            <ul className="filotimo__stats">
              <li>
                <span>Voyages</span>
                <strong>{circle.voyages_count ?? 0}</strong>
              </li>
              <li>
                <span>Friends introduced</span>
                <strong>{circle.referrals_converted ?? 0}</strong>
              </li>
              <li>
                <span>Since</span>
                <strong>{new Date(circle.joined_at).getFullYear()}</strong>
              </li>
            </ul>
            {goal?.kind === "voyages" && goal.voyages_to_go > 0 && (
              <p className="filotimo__next">
                One more voyage and you become a{" "}
                <strong>{TIERS[goal.next_tier].label}</strong>.
              </p>
            )}
            {goal?.kind === "max" && (
              <p className="filotimo__next">
                You are at the heart of the Circle.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="filotimo__tiers">
        <div className="filotimo__section-label">The three tiers</div>
        {Object.entries(TIER_DESCRIPTIONS).map(([key, t]) => (
          <article
            key={key}
            className={
              "filotimo__tier-card" +
              (key === currentTier ? " is-current" : "")
            }
          >
            <header>
              <strong>{t.label}</strong>
              {key === currentTier && <em>your current tier</em>}
            </header>
            <p>{t.blurb}</p>
            <ul>
              {t.perks.map((p, i) => (
                <li key={i}>
                  <span className="filotimo__bullet" aria-hidden>·</span>
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <footer className="filotimo__footer">
        <p>
          <em>Filotimo · Φιλότιμο</em> — doing the right thing because of
          who we are, not because anyone is watching.
        </p>
      </footer>

      <style>{`
        .filotimo { display: flex; flex-direction: column; gap: 44px; }
        .filotimo__eyebrow,
        .filotimo__section-label,
        .filotimo__status-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .filotimo__title {
          font-family: var(--gy-font-editorial);
          font-size: 30px;
          font-weight: 300;
          line-height: 1.2;
          margin: 12px 0 0 0;
        }
        @media (min-width: 768px) {
          .filotimo__title { font-size: 40px; }
        }
        .filotimo__title em {
          color: var(--gy-gold);
          font-style: italic;
        }
        .filotimo__rule {
          width: 64px; height: 1px;
          background: var(--gy-gold);
          opacity: 0.7;
          margin: 20px 0;
        }

        .filotimo__status-card {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 28px 24px;
          margin-top: 14px;
        }
        .filotimo__tier { margin-bottom: 22px; }
        .filotimo__tier em {
          display: block;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(248, 245, 240, 0.55);
          font-size: 13px;
          margin-bottom: 4px;
        }
        .filotimo__tier strong {
          font-family: var(--gy-font-editorial);
          font-size: 30px;
          color: var(--gy-gold);
          font-weight: 400;
        }
        .filotimo__stats {
          list-style: none;
          padding: 0;
          margin: 0 0 18px 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          border-top: 1px solid rgba(201, 168, 76, 0.25);
          padding-top: 18px;
        }
        .filotimo__stats span {
          display: block;
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.45);
        }
        .filotimo__stats strong {
          display: block;
          font-family: var(--gy-font-editorial);
          font-size: 24px;
          color: var(--gy-ivory);
          margin-top: 4px;
          font-weight: 400;
        }
        .filotimo__next {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          color: rgba(248, 245, 240, 0.75);
          margin: 0;
        }
        .filotimo__next strong { color: var(--gy-gold); font-style: normal; }

        .filotimo__tiers {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 14px;
        }
        .filotimo__tier-card {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 22px 22px 24px 22px;
          position: relative;
        }
        .filotimo__tier-card.is-current {
          border-color: var(--gy-gold);
        }
        .filotimo__tier-card header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }
        .filotimo__tier-card header strong {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 22px;
        }
        .filotimo__tier-card header em {
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-style: normal;
        }
        .filotimo__tier-card p {
          margin: 0 0 14px 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          line-height: 1.75;
          color: rgba(13, 27, 42, 0.7);
        }
        .filotimo__tier-card ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filotimo__tier-card li {
          font-family: var(--gy-font-body);
          font-size: 13.5px;
          line-height: 1.7;
          padding-left: 16px;
          position: relative;
          color: var(--gy-navy);
        }
        .filotimo__bullet {
          position: absolute;
          left: 0;
          color: var(--gy-gold);
          font-size: 16px;
          line-height: 1;
        }

        .filotimo__footer {
          margin-top: 12px;
          padding-top: 28px;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
        }
        .filotimo__footer p {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.55);
          margin: 0;
        }
        .filotimo__footer em { font-style: italic; color: var(--gy-gold); }
      `}</style>
    </div>
  );
}
