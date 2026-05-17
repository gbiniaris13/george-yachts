// /cabin/menu — Read-only sample menu, curated by George in admin.
// Stored as flexible JSONB: { tagline, days: [{ title, courses: [...] }] }
//                      or:  { days: [{ ... }] }
//                      or:  { sample: true } (empty placeholder)

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Sample menu · Your Cabin" };

function normalizeMenu(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw.days)) return raw;
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
  const menu = normalizeMenu(cabin?.sample_menu);

  return (
    <article>
      <SectionTitle
        kicker="A taste of the week"
        title="Sample"
        italic="menu."
      />
      <IntroParagraph>
        Your chef writes a new menu for you, every day, from what the islands
        offer that morning. What follows is a sample of the week as it might
        unfold — a draft for inspiration, never a fixed script.
      </IntroParagraph>

      {!menu && (
        <p className="menu-empty">
          <em>
            Your sample menu will be hand-curated and placed here a few days
            before you sail. If you would like a preview now,{" "}
            <a href="mailto:george@georgeyachts.com">tell me</a> and I will
            ask the chef.
          </em>
        </p>
      )}

      {menu && menu.tagline && (
        <p className="menu-tagline">{menu.tagline}</p>
      )}

      {menu?.days?.length > 0 && (
        <ol className="menu-days">
          {menu.days.map((d, i) => (
            <li key={i}>
              <div className="menu-day__head">
                <span className="menu-day__num">Day {String(i + 1).padStart(2, "0")}</span>
                {d.title && <strong className="menu-day__title">{d.title}</strong>}
              </div>
              {Array.isArray(d.courses) && (
                <ul className="menu-day__courses">
                  {d.courses.map((c, j) => (
                    <li key={j}>
                      {typeof c === "string" ? c : (
                        <>
                          <em>{c.heading}</em>
                          <span>{c.body}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}

      <style>{`
        .menu-empty {
          font-family: var(--gy-font-editorial);
          color: rgba(13,27,42,0.55);
          margin-top: 28px;
          font-size: 14.5px;
          line-height: 1.8;
        }
        .menu-empty a { color: var(--gy-gold); border-bottom: 1px solid currentColor; text-decoration: none; }
        .menu-tagline {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 17px;
          color: var(--gy-navy);
          margin: 24px 0 18px 0;
          max-width: 540px;
        }
        .menu-days {
          list-style: none;
          padding: 0;
          margin: 22px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .menu-days > li {
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 22px 22px 20px;
        }
        .menu-day__head {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(13,27,42,0.08);
        }
        .menu-day__num {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .menu-day__title {
          font-family: var(--gy-font-editorial);
          font-size: 19px;
          font-weight: 400;
          color: var(--gy-navy);
        }
        .menu-day__courses {
          list-style: none;
          padding: 0;
          margin: 14px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .menu-day__courses li {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          line-height: 1.7;
          color: var(--gy-navy);
        }
        .menu-day__courses em {
          display: block;
          font-style: italic;
          font-size: 13px;
          color: rgba(13,27,42,0.55);
          margin-bottom: 2px;
        }
        .menu-day__courses span { display: block; }
      `}</style>
    </article>
  );
}
