// /cabin/crew — Read-only. Sourced from cabins.crew_display JSONB.
// Curated by George in gy-command. White-labeled (no surnames, no
// vessel-owner names, no central-agent references).

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Your crew · Your Cabin" };

export default async function CrewPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins").select("vessel_name, crew_display").eq("id", cabinId).maybeSingle()
  );

  const crew = Array.isArray(cabin?.crew_display) ? cabin.crew_display : [];

  return (
    <article>
      <SectionTitle
        kicker="Meet your crew"
        title="The people"
        italic="caring for you."
      />
      <IntroParagraph>
        A small, hand-picked team will look after you and your guests at sea.
        Their first names, their faces, a few quiet words about each. The
        captain reads your preferences in your own voice — what follows is
        their voice, in return.
      </IntroParagraph>

      {crew.length === 0 ? (
        <p className="crew-empty">
          <em>
            We will introduce your crew here shortly — within a week of your
            embarkation, sometimes sooner. If you would like a name today,
            <a href="mailto:george@georgeyachts.com"> reply to me</a> and I
            will tell you.
          </em>
        </p>
      ) : (
        <ul className="crew-list">
          {crew.map((m, i) => (
            <li key={i} className="crew-card">
              <div className="crew-card__role">{m.role}</div>
              <div className="crew-card__name">{m.first_name}</div>
              {m.bio && <p className="crew-card__bio">{m.bio}</p>}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .crew-empty {
          font-family: var(--gy-font-editorial);
          color: rgba(13,27,42,0.55);
          font-size: 14.5px;
          line-height: 1.8;
          margin-top: 28px;
        }
        .crew-empty a { color: var(--gy-gold); border-bottom: 1px solid currentColor; text-decoration: none; }

        .crew-list {
          list-style: none;
          padding: 0;
          margin: 28px 0 0 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .crew-list { grid-template-columns: 1fr 1fr; }
        }
        .crew-card {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 22px 22px 24px;
        }
        .crew-card__role {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .crew-card__name {
          font-family: var(--gy-font-editorial);
          font-size: 28px;
          font-weight: 400;
          margin: 8px 0 0 0;
          color: var(--gy-navy);
        }
        .crew-card__bio {
          margin: 12px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13,27,42,0.72);
        }
      `}</style>
    </article>
  );
}
