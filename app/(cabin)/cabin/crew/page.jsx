// /cabin/crew — Read-only. Sourced from cabins.crew_display JSONB.
// Auto-extracted by Claude from the operator's crew booklet, then
// curated by George in gy-command. White-labeled (no surnames, no
// vessel-owner names, no central-agent references).

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Your crew · Your Cabin" };

function paragraphs(bio) {
  if (!bio || typeof bio !== "string") return [];
  return scrubBio(bio)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// 2026-05-20 — Friend-test pass 4 (Margaret 70F, Helen 60F):
//   "Leonora Stavrou was born in 1978…" — please do not tell me
//   the year a woman was born. It is none of my business and she
//   did not consent to share it with me.
// We strip "born in YYYY" / "born YYYY" / "(b. YYYY)" patterns
// from the bio at render time. Operator can override by editing
// in GY Command if a date is intentional (e.g. an anniversary).
function scrubBio(s) {
  if (!s) return "";
  return String(s)
    .replace(/\b(?:was\s+)?born\s+(?:in\s+)?(?:19|20)\d{2}\b[.,]?\s*/gi, "")
    .replace(/\(\s*b\.?\s*(?:19|20)\d{2}\s*\)\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// 2026-05-20 — Pass 4 (Margaret + Helen):
//   "'COOK · Leonora' — on a yacht of this calibre we say Chef,
//    not Cook." The brochure extraction sometimes returns "Cook"
//   verbatim from the source PDF. Map it to the term the audience
//   expects.
const ROLE_DISPLAY = {
  cook: "Chef",
  chef: "Chef",
  "head chef": "Chef",
  "sous chef": "Sous Chef",
  captain: "Captain",
  "first officer": "First Officer",
  "chief officer": "First Officer",
  "first mate": "First Officer",
  engineer: "Engineer",
  "chief engineer": "Chief Engineer",
  deckhand: "Deckhand",
  stewardess: "Stewardess",
  "chief stewardess": "Chief Stewardess",
  hostess: "Hostess",
  steward: "Steward",
  purser: "Purser",
};
function prettyRole(r) {
  if (!r) return "";
  const k = String(r).toLowerCase().trim();
  return ROLE_DISPLAY[k] || r;
}

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
        Their first names, the role each holds, a few quiet words about each.
        The captain reads your preferences in your own voice — what follows
        is their voice, in return.
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
          {crew.map((m, i) => {
            const roleLine = m.secondary_role
              ? `${prettyRole(m.role)} · ${prettyRole(m.secondary_role)}`
              : prettyRole(m.role);
            const bioPgs = paragraphs(m.bio);
            return (
              <li key={i} className="crew-card">
                <div className="crew-card__role">{roleLine}</div>
                <h2 className="crew-card__name">{m.first_name}</h2>

                {(Array.isArray(m.highlights) && m.highlights.length > 0) && (
                  <ul className="crew-card__highlights">
                    {m.highlights.map((h, hi) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                )}

                {bioPgs.length > 0 && (
                  <div className="crew-card__bio">
                    {bioPgs.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>
                )}

                <div className="crew-card__meta">
                  {Array.isArray(m.languages) && m.languages.length > 0 && (
                    <span className="crew-card__meta-item">
                      <em>Speaks</em> · {m.languages.join(" · ")}
                    </span>
                  )}
                  {typeof m.years_experience === "number" && m.years_experience > 0 && (
                    <span className="crew-card__meta-item">
                      <em>Years at sea</em> · {m.years_experience}+
                    </span>
                  )}
                </div>
              </li>
            );
          })}
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
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .crew-card {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 28px 26px 26px;
          position: relative;
        }
        .crew-card::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--gy-gold);
          opacity: 0.7;
        }
        .crew-card__role {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .crew-card__name {
          font-family: var(--gy-font-editorial);
          font-size: 34px;
          font-weight: 300;
          margin: 6px 0 0 0;
          color: var(--gy-navy);
          line-height: 1.1;
        }
        @media (min-width: 560px) {
          .crew-card__name { font-size: 42px; }
        }

        .crew-card__highlights {
          list-style: none;
          padding: 0;
          margin: 16px 0 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 8px;
        }
        .crew-card__highlights li {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--gy-navy);
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.35);
          padding: 5px 10px 6px;
        }

        .crew-card__bio {
          margin: 18px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-size: 15.5px;
          line-height: 1.85;
          color: rgba(13,27,42,0.78);
        }
        .crew-card__bio p {
          margin: 0 0 12px 0;
        }
        .crew-card__bio p:last-child { margin-bottom: 0; }

        .crew-card__meta {
          margin: 22px 0 0 0;
          padding-top: 16px;
          border-top: 1px solid rgba(13,27,42,0.06);
          display: flex;
          flex-wrap: wrap;
          gap: 6px 22px;
          font-family: var(--gy-font-editorial);
          font-size: 12.5px;
          color: rgba(13,27,42,0.55);
        }
        .crew-card__meta-item em {
          font-family: var(--gy-font-ui);
          font-style: normal;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin-right: 2px;
        }
      `}</style>
    </article>
  );
}
