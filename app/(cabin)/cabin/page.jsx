// app/(cabin)/cabin/page.jsx
// =============================================================
// /cabin — home page (Charter At-a-Glance).
//
// First page the client lands on after the magic link verifies.
// Shows the pre-filled summary card, brief progress, links to
// the section pages, and the soft Filotimo Circle membership
// note if applicable.
// =============================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  readSessionFromCookies,
  pickActiveCabinId,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { buildAtAGlance } from "@/lib/cabin/prefill";
import { getCircleMember, nextTierGoal, TIERS } from "@/lib/cabin/filotimo";
import CharterAtAGlance from "../../components/cabin/CharterAtAGlance";
import IntroParagraph from "../../components/cabin/IntroParagraph";

export const metadata = {
  title: "Your Cabin · George Yachts",
};

async function loadCabin(cabinId) {
  const db = getCabinDb();
  return dbQuery(
    db
      .from("cabins")
      .select("*")
      .eq("id", cabinId)
      .maybeSingle()
  );
}

export default async function CabinHomePage() {
  // Middleware only checks cookie presence; KV may have evicted
  // the session even though the cookie persists, so guard here.
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");

  // Soft-onboard newly-invited members: if their Filotimo profile
  // is still missing the basics (name + DOB + hometown), send them
  // through /cabin/welcome once. They can skip it; we won't nag.
  const db2 = getCabinDb();
  const circleCheck = await dbQuery(
    db2.from("filotimo_circle_members")
      .select("display_name, date_of_birth, hometown")
      .ilike("email", session.email)
      .is("deleted_at", null)
      .maybeSingle()
  );
  const profileMissing = !(
    circleCheck?.display_name && circleCheck?.date_of_birth && circleCheck?.hometown
  );
  if (profileMissing) redirect("/cabin/welcome");

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return (
      <div style={{ padding: 24 }}>
        <p>No cabin found for this account.</p>
      </div>
    );
  }

  const cabin = await loadCabin(cabinId);
  if (!cabin) {
    return (
      <div style={{ padding: 24 }}>
        <p>Your Cabin could not be loaded right now. Please refresh, or sign in again.</p>
      </div>
    );
  }
  const summary = buildAtAGlance(cabin);
  const circle = await getCircleMember(session.email);
  const goal = nextTierGoal(circle);

  const firstName =
    cabin?.principal_charterer_name?.split(" ")[0] || "friend";
  const percent = cabin.brief_completion_percent ?? 0;

  return (
    <div className="cabin-home">
      <header className="cabin-home__welcome">
        <div className="cabin-home__eyebrow">Welcome aboard, in spirit</div>
        <h1 className="cabin-home__greeting">
          Welcome, <em>{firstName}.</em>
        </h1>
        <div className="cabin-home__rule" aria-hidden />
        <IntroParagraph>
          This is your private Cabin — your quiet corner of George
          Yachts, open to you for the whole arc of your voyage and
          beyond. Below is everything we have prepared for the week.
          Take the Charter Brief at your pace — an unhurried half hour,
          across as many sittings as you like. Save and come back. We
          will be here, in Greece, looking after the details.
        </IntroParagraph>
      </header>

      <CharterAtAGlance summary={summary} cabin={cabin} />

      <section className="cabin-home__progress">
        <div className="cabin-home__section-label">The Charter Brief</div>
        <div className="cabin-home__progress-bar" aria-hidden>
          <div
            className="cabin-home__progress-fill"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>
        <div className="cabin-home__progress-meta">
          {percent}% complete
        </div>
        <Link href="/cabin/brief" className="cabin-home__cta">
          {percent > 0 ? "Continue your Brief" : "Start your Brief"}
        </Link>
      </section>

      <section className="cabin-home__discoveries">
        <div className="cabin-home__section-label">Other places in your Cabin</div>
        <ul>
          <li>
            <Link href="/cabin/before-you-sail">
              <span className="cabin-home__glyph">⊿</span>
              <span>
                <strong>Before you sail</strong>
                <em>Weather, Greek phrases, and a quiet packing list.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/mood-board">
              <span className="cabin-home__glyph">❖</span>
              <span>
                <strong>Mood Board</strong>
                <em>Pin the vibe you want — sunsets, dishes, music.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/crew">
              <span className="cabin-home__glyph">⚓</span>
              <span>
                <strong>Crew</strong>
                <em>Meet the captain, chef and hostess of your voyage.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/menu">
              <span className="cabin-home__glyph">✿</span>
              <span>
                <strong>Sample Menu</strong>
                <em>A taste of what your chef is preparing.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/time-capsule">
              <span className="cabin-home__glyph">✉</span>
              <span>
                <strong>Voyage Time Capsule</strong>
                <em>Write a note to yourself. We will return it in six months.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/filotimo-circle">
              <span className="cabin-home__glyph">◐</span>
              <span>
                <strong>Filotimo Circle</strong>
                <em>You are a member. Here is what that means.</em>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/cabin/your-data">
              <span className="cabin-home__glyph">▢</span>
              <span>
                <strong>Your Data</strong>
                <em>Everything we hold for you. Edit or delete anytime.</em>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {circle && (
        <aside className="cabin-home__circle">
          <div className="cabin-home__section-label">Filotimo Circle</div>
          <p>
            You are a <strong>{TIERS[circle.tier].label}</strong> of the
            Circle{circle.joined_at ? `, since ${new Date(circle.joined_at).getFullYear()}` : ""}.
            {goal?.kind === "voyages" &&
              goal.voyages_to_go > 0 &&
              ` ${goal.voyages_to_go} more voyage${
                goal.voyages_to_go > 1 ? "s" : ""
              } and you become a ${TIERS[goal.next_tier].label}.`}
            {goal?.kind === "max" && " You are at the heart of the Circle."}
          </p>
        </aside>
      )}

      <style>{`
        .cabin-home { display: flex; flex-direction: column; gap: 48px; }
        .cabin-home__welcome { text-align: left; }
        .cabin-home__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-home__greeting {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 36px;
          line-height: 1.1;
          margin: 12px 0 0 0;
          letter-spacing: -0.4px;
        }
        @media (min-width: 768px) {
          .cabin-home__greeting { font-size: 48px; }
        }
        .cabin-home__greeting em {
          font-style: italic;
          color: var(--gy-gold);
        }
        .cabin-home__rule {
          width: 64px;
          height: 1px;
          background: var(--gy-gold);
          margin: 20px 0;
          opacity: 0.7;
        }

        .cabin-home__section-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .cabin-home__progress {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 24px 22px 22px 22px;
        }
        .cabin-home__progress-bar {
          width: 100%;
          height: 2px;
          background: rgba(13, 27, 42, 0.12);
          overflow: hidden;
        }
        .cabin-home__progress-fill {
          height: 100%;
          background: var(--gy-gold);
          transition: width 240ms ease;
        }
        .cabin-home__progress-meta {
          margin: 8px 0 18px 0;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 1.5px;
          color: rgba(13, 27, 42, 0.55);
          text-transform: uppercase;
        }
        .cabin-home__cta {
          display: inline-block;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 14px 24px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid var(--gy-gold);
          transition: background 180ms ease;
        }
        .cabin-home__cta:hover { background: #142233; }

        .cabin-home__discoveries ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(13, 27, 42, 0.06);
        }
        .cabin-home__discoveries li { background: #ffffff; }
        .cabin-home__discoveries a {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 18px 20px 18px;
          color: var(--gy-navy);
          text-decoration: none;
          transition: background 160ms ease;
        }
        .cabin-home__discoveries a:hover {
          background: rgba(201, 168, 76, 0.06);
        }
        .cabin-home__discoveries strong {
          display: block;
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 17px;
          letter-spacing: -0.1px;
        }
        .cabin-home__discoveries em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          color: rgba(13, 27, 42, 0.6);
          font-size: 13px;
          margin-top: 2px;
        }
        .cabin-home__glyph {
          color: var(--gy-gold);
          font-size: 18px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .cabin-home__circle {
          border-top: 1px solid rgba(13, 27, 42, 0.12);
          padding-top: 28px;
        }
        .cabin-home__circle p {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(13, 27, 42, 0.75);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
