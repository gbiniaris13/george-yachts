// /cabin/crew — Read-only. Sourced from cabins.crew_display JSONB.
// Auto-extracted by Claude from the operator's crew booklet, then
// curated by George in gy-command. White-labeled (no surnames, no
// vessel-owner names, no central-agent references).

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Your crew" };

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
// 2026-05-20 — Pass 4 round 5 (Margaret, Helen):
//   Leonora's bio shipped as "Leonora Stavrou and raised in Athens"
//   (missing "was born"), with "yachting .For the past" (bad
//   spacing), "reliable a strong asset" (missing comma), and a
//   "Cosmetics and Aesthetics" line irrelevant to a chef intro.
//
// 2026-05-20 — Pass 6 (Margaret, Domingo synthesis):
//   Two additional defects surfaced from the brochure extractor:
//   (a) "She Her" / "He Him" — the slash in "She/Her" disappears
//       in PDF text-layer flattening, leaving a double pronoun.
//   (b) "Leonora Stavrou and raised in Athens" — the "born in
//       <city>," fragment dropped in extraction. We collapse the
//       orphan "<Proper Name> and raised in" → "raised in" which
//       reads grammatically on its own.
//
// We can't reliably auto-fix every grammar failure — that's
// George's job in CRM. But we CAN catch the common spacing /
// punctuation defects the extraction pipeline tends to introduce.
// Plus we strip a few patently-irrelevant phrases that often
// survive the extractor (degrees unrelated to the role).
function scrubBio(s) {
  if (!s) return "";
  let out = String(s);

  // Strip year-of-birth phrases.
  out = out
    .replace(/\b(?:was\s+)?born\s+(?:in\s+)?(?:19|20)\d{2}\b[.,]?\s*/gi, "")
    .replace(/\(\s*b\.?\s*(?:19|20)\d{2}\s*\)\s*/gi, "");

  // Strip degrees unrelated to the role. Cosmetics / aesthetics
  // on a chef bio surfaced in pass 4 — surface area is small
  // enough to maintain by hand.
  out = out
    .replace(/\bholds?\s+a\s+degree\s+in\s+cosmetics(?:\s+and\s+aesthetics)?[^.]*\.?\s*/gi, "")
    .replace(/\bdegree\s+in\s+aircraft\s+engineering[^.]*\.?\s*/gi, "");

  // Pass 6 — "She Her" / "He Him" / "They Them" double pronouns
  // (PDF lost the slash between "She/Her").
  // 2026-05-21 — Pass 7 (Margaret): the Pass 6 fix collapsed
  // "She Her" to "She" — but the source PDFs had these as standalone
  // pronoun annotations next to the crew member's name, not as part
  // of a sentence. After collapse, Margaret saw "Leonora. She
  // passion for the sea..." — a subject "She" stranded without a
  // verb. The right move is to STRIP the annotation entirely (and
  // clean up the space + any leading punctuation that drops with
  // it), so the next sentence starts cleanly.
  out = out
    .replace(/\s*\b(She\s+Her|He\s+Him|They\s+Them)\b\s*/g, " ")
    // If we just stripped the start of a sentence we may have left
    // a leading ". " — collapse any "<sentence-end> <space> <space>"
    // back to a single space.
    .replace(/([.!?])\s{2,}/g, "$1 ");

  // Pass 6 — "<Surname> and raised in" orphan: the "<Name> was
  // born in <city>, and raised in <other-city>" sentence often
  // loses the middle clause. We rescue the orphan into "Raised
  // in <city>" so the sentence still parses. Triggers only on a
  // capitalised single token immediately followed by " and
  // raised in" — narrow enough to avoid false positives.
  out = out.replace(
    /\b([A-Z][a-zà-ÿ'’\-]+)\s+and\s+raised\s+in\b/g,
    "Raised in"
  );

  // Punctuation/whitespace defects we see often in extracted bios:
  //   "yachting .For"  → "yachting. For"
  //   "reliable a strong"  → "reliable, a strong"
  //   double spaces, trailing whitespace.
  out = out
    // Space before punctuation: "yachting ." → "yachting."
    .replace(/\s+([.,;:!?])/g, "$1")
    // Missing space after period (between sentences): ".For" → ". For"
    .replace(/([.!?])([A-Z])/g, "$1 $2")
    // Repeated spaces / tabs → single space
    .replace(/[ \t]{2,}/g, " ")
    // Trim each paragraph
    .split(/\n/)
    .map((l) => l.trim())
    .join("\n");

  return out.trim();
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
        Their first names, the role each holds, a few quiet words about each
        — not a CV, more the kind of thing you&apos;d hear at a welcome
        dinner. The captain reads your preferences in your own voice; what
        follows is their voice, in return.
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
