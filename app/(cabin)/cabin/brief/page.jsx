// app/(cabin)/cabin/brief/page.jsx
// =============================================================
// /cabin/brief — Brief overview. Lists all sections with progress
// dots and gentle copy. From here the client opens any section.
// =============================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

export const metadata = { title: "The Charter Brief · Your Cabin" };

const SECTION_META = [
  {
    key: "arrival",
    title: "Arrival & Departure",
    intro: "Flights, hotels, transfers — and a word on your sailing experience.",
    minutes: 4,
  },
  {
    key: "guests",
    title: "Your Group",
    intro: "Who is sailing, the kind of week this is, the spirit of it all.",
    minutes: 5,
  },
  {
    key: "health",
    title: "Health & Safety",
    intro: "Allergies, conditions, the emergency contact ashore.",
    minutes: 4,
    importance: "high",
  },
  {
    key: "itinerary",
    title: "Your Itinerary",
    intro: "Pace, docking style, activities, anything to celebrate.",
    minutes: 4,
  },
  {
    key: "life_aboard",
    title: "Life Aboard",
    intro: "Activities, music, wellness, the texture of the days.",
    minutes: 5,
  },
  {
    key: "dining",
    title: "At the Table",
    intro: "How you eat — breakfast detail, food matrix, snacks, kids.",
    minutes: 8,
  },
  {
    key: "beverages",
    title: "In the Cellar",
    intro: "Water, soft drinks, wines, spirits, beers, cocktails.",
    minutes: 8,
  },
  // 2026-05-20 — Friend-test pass 3: "The Little Things" removed
  // from the section list. George: "βγάλετε τελείως, μόνο χρόνο
  // μας τρώει". Schema (littleThingsSchema) stays registered in
  // lib/cabin/schemas.js so already-submitted briefs continue to
  // validate; the URL /cabin/brief/little-things now redirects to
  // the brief overview rather than a dead page.
  {
    key: "children",
    title: "If You're Sailing with Children",
    intro: "Ages, naps, the snacks that travel well.",
    minutes: 3,
    onlyIfMinors: true,
  },
];

export default async function CabinBriefOverviewPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return <div style={{ padding: 24 }}>No cabin found.</div>;
  }

  const db = getCabinDb();
  // Pull the guest manifest TABLE so we can conditionally render the
  // "Children" section — it only applies when minors are aboard.
  const manifest = await dbQuery(
    db.from("cabin_guests_manifest")
      .select("is_minor, date_of_birth")
      .eq("cabin_id", cabinId)
  );
  const hasMinors = (manifest ?? []).some((g) => {
    if (g.is_minor === true) return true;
    if (!g.date_of_birth) return false;
    const years = (Date.now() - new Date(g.date_of_birth).getTime())
      / (365.25 * 24 * 3600 * 1000);
    return Number.isFinite(years) && years < 18;
  });
  const sections = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("section_key, completed")
      .eq("cabin_id", cabinId)
  );
  const completedKeys = new Set(
    sections?.filter((s) => s.completed).map((s) => s.section_key)
  );

  const visibleSections = SECTION_META.filter((s) => !s.onlyIfMinors || hasMinors);
  const totalMinutes = visibleSections.reduce((acc, s) => acc + s.minutes, 0);
  const remainingMinutes = visibleSections.filter(
    (s) => !completedKeys.has(s.key)
  ).reduce((acc, s) => acc + s.minutes, 0);

  return (
    <div className="cabin-brief">
      <header className="cabin-brief__head">
        <div className="cabin-brief__eyebrow">The Charter Brief</div>
        <h1 className="cabin-brief__title">
          A quiet conversation, <em>an unhurried half hour.</em>
        </h1>
        <div className="cabin-brief__rule" aria-hidden />
        <IntroParagraph>
          Eight gentle sections. Every blank is optional — leave what
          does not apply. Only your name and email are truly required.
          Save as you go; come back days, weeks, or months later. The
          more you share, the more thoughtfully your week can be
          designed. You won&apos;t have to repeat yourself to the crew,
          the chef, the hostess or the captain — they all read from
          here.
        </IntroParagraph>
        <p className="cabin-brief__time">
          Around <strong>{remainingMinutes || totalMinutes} minutes</strong>{" "}
          remaining
          {remainingMinutes !== totalMinutes
            ? " — pick up from where you left off."
            : ", in your own time."}
        </p>
      </header>

      <ul className="cabin-brief__sections">
        {visibleSections.map((s, i) => {
          const done = completedKeys.has(s.key);
          return (
            <li
              key={s.key}
              className={
                "cabin-brief__item" +
                (done ? " is-done" : "") +
                (s.importance === "high" ? " is-important" : "")
              }
            >
              <Link href={`/cabin/brief/${s.key.replace(/_/g, "-")}`}>
                <span className="cabin-brief__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cabin-brief__body">
                  <strong>{s.title}</strong>
                  <em>{s.intro}</em>
                </span>
                <span className="cabin-brief__minutes">
                  {done ? "✓" : `${s.minutes} min`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`
        .cabin-brief { display: flex; flex-direction: column; gap: 36px; }
        .cabin-brief__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-brief__title {
          font-family: var(--gy-font-editorial);
          font-size: 32px;
          font-weight: 300;
          line-height: 1.15;
          margin: 12px 0 0 0;
        }
        @media (min-width: 768px) {
          .cabin-brief__title { font-size: 40px; }
        }
        .cabin-brief__title em {
          color: var(--gy-gold);
          font-style: italic;
        }
        .cabin-brief__rule {
          width: 64px;
          height: 1px;
          background: var(--gy-gold);
          margin: 20px 0;
          opacity: 0.7;
        }
        .cabin-brief__time {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: rgba(13, 27, 42, 0.55);
          margin: 16px 0 0 0;
          font-size: 13.5px;
        }

        .cabin-brief__sections {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(13, 27, 42, 0.08);
          border: 1px solid rgba(13, 27, 42, 0.08);
        }
        .cabin-brief__item { background: #ffffff; }
        .cabin-brief__item a {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 12px;
          padding: 18px 16px;
          align-items: center;
          color: var(--gy-navy);
          text-decoration: none;
          transition: background 160ms ease;
        }
        .cabin-brief__item a:hover {
          background: rgba(201, 168, 76, 0.05);
        }
        .cabin-brief__num {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          color: var(--gy-gold);
          font-size: 22px;
        }
        .cabin-brief__body strong {
          display: block;
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 17px;
        }
        .cabin-brief__body em {
          display: block;
          font-style: italic;
          font-size: 13px;
          font-family: var(--gy-font-editorial);
          color: rgba(13, 27, 42, 0.6);
          margin-top: 2px;
        }
        .cabin-brief__minutes {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 1.5px;
          color: rgba(13, 27, 42, 0.5);
          text-transform: uppercase;
        }
        .cabin-brief__item.is-done .cabin-brief__minutes {
          color: var(--gy-gold);
          font-size: 14px;
        }
        .cabin-brief__item.is-important .cabin-brief__num::after {
          content: "·";
          color: var(--gy-gold);
          margin-left: 4px;
          font-size: 28px;
          vertical-align: super;
          line-height: 0.5;
        }
      `}</style>
    </div>
  );
}
