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

function paragraphs(bio, firstName) {
  if (!bio || typeof bio !== "string") return [];
  return dedupeLeadingFirstName(redactSurname(scrubBio(bio), firstName), firstName)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// 2026-05-26 — Brief 04 / T3 (Domingo guest audit): the crew card
// renders <h2>{first_name}</h2> immediately above the bio paragraphs.
// When the bio's first paragraph also opens with "{first_name} was/
// is/has…" the reader's eye scans "Leonora / Leonora was born in 1978"
// as a stutter — exactly Domingo's "Cook/Hostess Leonora Leonora was
// born in 1978…" report. Some bios in the booklet ALSO contain the
// literal duplication ("Leonora Leonora was born…") from a clean-up
// glitch upstream.
//
// Defensive fix: strip every leading "{first_name}\s+" from the bio
// before render. Works whether the bio has 0, 1, or N leading
// first-name tokens. The next word is upper-cased so the paragraph
// still starts with a capital ("was born…" → "Was born…").
//
// Storage stays verbatim; this only affects the display.
function dedupeLeadingFirstName(bio, firstName) {
  if (!bio || !firstName) return bio;
  const fn = escapeRegExp(String(firstName).trim());
  if (!fn) return bio;
  // Match one or more leading "{first_name}\s+" runs at the start
  // of the bio (after any leading whitespace). Case-insensitive so
  // "leonora leonora" gets caught too.
  const re = new RegExp(`^(\\s*)(?:${fn}\\s+)+`, "i");
  const stripped = bio.replace(re, "$1");
  if (stripped === bio) return bio;
  // Re-capitalise the first letter of the remaining text so the
  // paragraph doesn't start mid-sentence with a lowercase verb.
  return stripped.replace(/^(\s*)([a-zà-ÿ])/, (_, ws, ch) => ws + ch.toUpperCase());
}

// 2026-05-21 — Roberto's brief (v1):
//   "White-label is absolute. The client view must NEVER show:
//    crew surnames, the vessel's owning company, the central
//    agent, the owner, or any commercial figures."
//
// The bio text from the owner's crew booklet contains the surname
// in its opening sentence ("Leonora Stavrou was born in 1978…").
// We honour the brief at the DISPLAY layer only — storage stays
// verbatim, so the surname is available to back-office surfaces
// (preference sheet, crew list for port authorities) where it
// belongs.
//
// Logic: infer the surname as the capitalised word that follows
// the first_name on its first appearance in the bio. Then redact
// every occurrence of that surname from the rendered text. This
// catches the canonical "FirstName Surname" opening and any
// later "Mrs/Mr Surname" references.
//
// Defensive notes:
//   • If no "FirstName Surname" pattern is found, return bio
//     unchanged (Thanos's bio in the sample never names him as
//     "Thanos Karagiozis" — it starts "Thanos is an experienced
//     Captain", so no redaction is triggered, which is the right
//     outcome).
//   • The replacement consumes the SPACE before the surname so
//     "Leonora Stavrou was" → "Leonora was" — no double space.
function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function redactSurname(bio, firstName) {
  if (!bio || !firstName) return bio;
  const fn = escapeRegExp(String(firstName).trim());
  if (!fn) return bio;
  // Find the capitalised word that immediately follows the first
  // appearance of first_name. Surname tokens include letters,
  // apostrophes, hyphens, and accented chars.
  const finder = new RegExp(`\\b${fn}\\s+([A-Z][a-zà-ÿ'’\\-]+)\\b`);
  const m = bio.match(finder);
  if (!m) return bio;
  const surname = m[1];
  if (!surname || surname === firstName) return bio;
  // Redact every occurrence of the surname (with the space before
  // it, to avoid double-spacing).
  const redactor = new RegExp(`\\s+${escapeRegExp(surname)}\\b`, "g");
  return bio.replace(redactor, "");
}

// 2026-05-21 — Roberto's brief (v1) restructures the entire
// bio-display philosophy:
//
//   "EXPLICITLY OUT OF SCOPE: No manual crew-bio editing or
//    George-authored crew sentences. Crew content comes from
//    the owner's booklet via extraction (faithfully). We do not
//    add our own lines to crew bios."
//
//   "Light post-extraction cleanup as a SAFETY NET ONLY […]
//    NEVER changes meaning, rewrites sentences, adds, or
//    removes content. NEVER injects George Yachts' own wording."
//
// All five destructive rules from earlier friend-test rounds —
//   • strip "was born in 1978"
//   • strip "degree in Cosmetics and Aesthetics"
//   • strip "degree in Aircraft Engineering"
//   • strip "She Her" / "He Him" / "They Them" pronoun chips
//   • rescue "<Name> and raised in" → "Raised in"
// — were REMOVING content that the owner's crew booklet actually
// contains. Sample inspected: Leonora Stavrou's bio PDF reads
// verbatim "Leonora Stavrou was born in 1978 and raised in Athens,
// Greece. She holds a degree in Cosmetics and Aesthetics from the
// University of Athens. Her passion for the sea…" — every fragment
// we were stripping is in the source.
//
// scrubBio is now a CONSERVATIVE whitespace + punctuation safety
// net only. It corrects the artifacts the extraction pipeline
// commonly introduces (".For" without space, " ." stray space
// before period, double spaces) but never adds, removes, or
// rewrites any word the owner wrote.
function scrubBio(s) {
  if (!s) return "";
  return String(s)
    // Space before punctuation: "yachting ." → "yachting."
    .replace(/\s+([.,;:!?])/g, "$1")
    // Missing space after sentence-end period: ".For" → ". For"
    .replace(/([.!?])([A-Z])/g, "$1 $2")
    // Collapse double spaces / tabs to a single space.
    .replace(/[ \t]{2,}/g, " ")
    // Trim each paragraph (preserves blank lines between paras).
    .split(/\n/)
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

// 2026-05-21 — Roberto's brief (v1):
//   "Crew content comes from the owner's booklet via extraction
//    (faithfully). We do not add our own lines to crew bios."
//
// The earlier ROLE_DISPLAY map mapped "Cook" → "Chef" because a
// friend-test panel preferred the higher-status term. That's a
// George-authored rewrite of the owner's role text — exactly what
// the brief forbids. Removed.
//
// prettyRole now only does a safe title-case pass on the verbatim
// role string. "cook" → "Cook", "chief stewardess" → "Chief
// Stewardess". The role NOUN and any compounds (e.g. "Cook/
// Hostess") survive untouched.
function prettyRole(r) {
  if (!r) return "";
  return String(r)
    .trim()
    .split(/(\s+|[\/\-])/)
    .map((w) =>
      /^[a-z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w
    )
    .join("");
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
            // 2026-05-21 — pass first_name so redactSurname() can
            // strip the surname from the display text. See the
            // helper's comment for the white-label rationale.
            const bioPgs = paragraphs(m.bio, m.first_name);
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
