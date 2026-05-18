// /cabin/menu — Read-only sample menu, auto-extracted from the
// chef's PDF by Claude and curated by George in gy-command.
// Shape: { title, tagline, sections: [{ name, dishes: [...] }] }
// Legacy shape (days[]) still supported.

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Sample menu · Your Cabin" };

function normaliseMenu(raw) {
  if (!raw || typeof raw !== "object") return null;
  // New shape: sections
  if (Array.isArray(raw.sections) && raw.sections.length > 0) {
    return {
      title: raw.title ?? null,
      tagline: raw.tagline ?? null,
      sections: raw.sections.map((s) => ({
        name: s.name ?? "Course",
        dishes: Array.isArray(s.dishes) ? s.dishes.filter(Boolean) : [],
      })),
    };
  }
  // Legacy shape: days
  if (Array.isArray(raw.days) && raw.days.length > 0) {
    return {
      title: raw.title ?? null,
      tagline: raw.tagline ?? null,
      sections: raw.days.map((d) => ({
        name: d.title ?? "Day",
        dishes: Array.isArray(d.courses) ? d.courses.filter(Boolean) : [],
      })),
    };
  }
  return null;
}

export default async function MenuPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins").select("sample_menu").eq("id", cabinId).maybeSingle()
  );
  const menu = normaliseMenu(cabin?.sample_menu);

  return (
    <article>
      <SectionTitle
        kicker="From the galley"
        title="A taste"
        italic="of the week."
      />
      <IntroParagraph>
        A sample of what the chef will bring to the table — not a contract,
        a quiet promise. Your preferences from the Brief shape the actual
        menu; if anything below doesn’t sit right, simply tell George.
      </IntroParagraph>

      {!menu ? (
        <p className="mn-empty">
          <em>
            We will publish the sample menu here a few days before
            embarkation. You can taste the rhythm of the week from the
            brief preferences in the meantime.
          </em>
        </p>
      ) : (
        <section className="mn-wrap">
          {menu.title && <h2 className="mn-title">{menu.title}</h2>}
          {menu.tagline && <p className="mn-tagline">{menu.tagline}</p>}

          <div className="mn-sections">
            {menu.sections.map((s, i) => (
              <div key={i} className="mn-section">
                <h3 className="mn-section__name">{s.name}</h3>
                {s.dishes.length === 0 ? (
                  <p className="mn-section__empty"><em>—</em></p>
                ) : (
                  <ul className="mn-section__dishes">
                    {s.dishes.map((d, di) => (
                      <li key={di}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <p className="mn-footnote">
            <em>
              Dishes adapted to the produce of the islands you visit and to
              your group’s preferences. Anything you’d like to add or
              remove, write a line in the Brief or message George directly.
            </em>
          </p>
        </section>
      )}

      <style>{`
        .mn-empty {
          font-family: var(--gy-font-editorial);
          color: rgba(13,27,42,0.55);
          font-size: 14.5px;
          line-height: 1.8;
          margin-top: 28px;
        }
        .mn-wrap {
          margin-top: 30px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 32px 28px 28px;
        }
        .mn-title {
          font-family: var(--gy-font-editorial);
          font-size: 26px;
          font-weight: 300;
          margin: 0;
          color: var(--gy-navy);
          letter-spacing: 1px;
        }
        .mn-tagline {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13,27,42,0.6);
          margin: 8px 0 0 0;
          font-size: 14px;
        }
        .mn-sections {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        @media (min-width: 720px) {
          .mn-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px 40px;
          }
        }
        .mn-section {
          break-inside: avoid;
        }
        .mn-section__name {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 0 0 14px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(201,168,76,0.4);
          font-weight: 500;
        }
        .mn-section__dishes {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mn-section__dishes li {
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          line-height: 1.55;
          color: var(--gy-navy);
        }
        .mn-section__empty { color: rgba(13,27,42,0.4); }
        .mn-footnote {
          margin: 32px 0 0 0;
          padding-top: 18px;
          border-top: 1px solid rgba(13,27,42,0.06);
          font-family: var(--gy-font-editorial);
          font-size: 13px;
          color: rgba(13,27,42,0.55);
          line-height: 1.7;
        }
      `}</style>
    </article>
  );
}
