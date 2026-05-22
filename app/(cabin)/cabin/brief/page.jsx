// app/(cabin)/cabin/brief/page.jsx
// =============================================================
// /cabin/brief — Brief overview. Lists all sections with progress
// dots and gentle copy. From here the client opens any section.
// =============================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { crewRoles, joinNouns, theyAllOrBoth } from "@/lib/cabin/format";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

export const metadata = { title: "The Charter Brief" };

// 2026-05-20 — Friend-test pass 3 (George):
//   - "Around 34 minutes" felt too long. After we stripped Soundtrack
//     / Wellness / docking_preference / "pre-stage" / Little Things /
//     all the label×qty cellar tables, the brief is genuinely faster.
//     Cap totals at 20–30 min by rebalancing per-section.
//   - Section `intro` lines now match the simplified content (no
//     more "music / wellness / docking style" copy that referenced
//     fields we removed).
const SECTION_META = [
  {
    key: "arrival",
    title: "Arrival & Departure",
    intro: "Your flights into Greece, transfers, where you’re staying first.",
    minutes: 3,
  },
  {
    key: "guests",
    title: "Your Group",
    intro: "Who is sailing — and the spirit of the week.",
    minutes: 3,
  },
  {
    key: "health",
    title: "Health & Safety",
    intro: "Allergies, conditions, the emergency contact ashore.",
    minutes: 3,
    importance: "high",
  },
  {
    key: "itinerary",
    title: "Your Itinerary",
    intro: "Pace of the week, marina or anchor, any celebrations.",
    minutes: 3,
  },
  {
    key: "life_aboard",
    title: "Life Aboard",
    intro: "Activities you love, anything else for the captain to know.",
    minutes: 3,
  },
  {
    key: "dining",
    title: "At the Table",
    intro: "Times of day, the food matrix, snacks, kids.",
    minutes: 5,
  },
  {
    key: "beverages",
    title: "In the Cellar",
    intro: "Champagne, wines, spirits, beers, soft drinks — by feel.",
    minutes: 4,
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
    minutes: 2,
    onlyIfMinors: true,
  },
];

export default async function CabinBriefOverviewPage() {
  const session = await readSessionFromCookies();
  const membership = session
    ? resolveMembership(session, pickActiveCabinId(session))
    : null;
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
  // 2026-05-21 — Pass 7 (Helen, David): the intro paragraph used
  // to say "the crew, the chef, the hostess or the captain" but
  // many vessels in our fleet don't carry a hostess. Pull the
  // actual crew_display and let lib/cabin/format build the noun
  // list that matches reality.
  const cabinRecord = await dbQuery(
    db
      .from("cabins")
      .select(
        "crew_display, brief_submitted_at, brief_submitted_by_member_id",
      )
      .eq("id", cabinId)
      .maybeSingle()
  );
  const crewNounList = crewRoles(cabinRecord?.crew_display);
  const crewNouns = joinNouns(crewNounList);
  // 2026-05-21 — Pass 7 polish (Domingo): "They all" reads oversold
  // when the noun list has only two people. theyAllOrBoth() returns
  // "both" for 2-item lists, "all" otherwise.
  const crewQuantifier = theyAllOrBoth(crewNounList);

  const sections = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select(
        "section_key, completed, last_edited_at, last_edited_by_member_id",
      )
      .eq("cabin_id", cabinId)
  );
  const completedKeys = new Set(
    sections?.filter((s) => s.completed).map((s) => s.section_key)
  );

  // 2026-05-22 — Build "Last edited by [Name]" lookup. Pulls
  // display_name for every member referenced by any section's
  // last_edited_by_member_id, plus the submission member id.
  const memberIdsToLookup = new Set();
  for (const s of sections ?? []) {
    if (s.last_edited_by_member_id) {
      memberIdsToLookup.add(s.last_edited_by_member_id);
    }
  }
  if (cabinRecord?.brief_submitted_by_member_id) {
    memberIdsToLookup.add(cabinRecord.brief_submitted_by_member_id);
  }
  let memberNamesById = {};
  if (memberIdsToLookup.size > 0) {
    const memberRows = await dbQuery(
      db
        .from("cabin_members")
        .select("id, display_name")
        .in("id", Array.from(memberIdsToLookup)),
    );
    memberNamesById = Object.fromEntries(
      (memberRows ?? []).map((m) => [m.id, m.display_name || ""]),
    );
  }

  const sectionEditedByName = Object.fromEntries(
    (sections ?? []).map((s) => [
      s.section_key,
      {
        name: s.last_edited_by_member_id
          ? memberNamesById[s.last_edited_by_member_id] || ""
          : "",
        at: s.last_edited_at || null,
      },
    ]),
  );

  const visibleSections = SECTION_META.filter((s) => !s.onlyIfMinors || hasMinors);
  const totalMinutes = visibleSections.reduce((acc, s) => acc + s.minutes, 0);
  const remainingMinutes = visibleSections.filter(
    (s) => !completedKeys.has(s.key)
  ).reduce((acc, s) => acc + s.minutes, 0);

  // 2026-05-22 — Brief submission state. Three render modes:
  //   submitted  — locked banner, no "review & send" CTA
  //   complete   — gold "Ready for your approval" ribbon
  //   draft      — normal section list, no ribbon
  // The ribbon is shown only to the principal_charterer (the
  // role that actually owns the Submit button).
  const isSubmitted = Boolean(cabinRecord?.brief_submitted_at);
  const allDone =
    visibleSections.length > 0 &&
    visibleSections.every((s) => completedKeys.has(s.key));
  const submittedBy = cabinRecord?.brief_submitted_by_member_id
    ? memberNamesById[cabinRecord.brief_submitted_by_member_id] || ""
    : "";
  const submittedAtPretty = cabinRecord?.brief_submitted_at
    ? new Date(cabinRecord.brief_submitted_at).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const isPrincipal = membership?.role === "principal_charterer";

  return (
    <div className="cabin-brief">
      <header className="cabin-brief__head">
        <div className="cabin-brief__eyebrow">The Charter Brief</div>
        {/* 2026-05-20 — Pass 4 round 5 (Margaret, Sarah, David, Tyler):
            "Says 'around twenty minutes' here and 'Around 24 minutes'
             four lines below. Pick one."
            H1 dropped the specific number — the body line does the
            job with the live total. The two no longer disagree. */}
        <h1 className="cabin-brief__title">
          A quiet conversation, <em>at your pace.</em>
        </h1>
        <div className="cabin-brief__rule" aria-hidden />
        <IntroParagraph>
          {/* 2026-05-20 — Pass 6 (Margaret, Helen): "Only your name
              and email are truly required" was stale copy from the
              old onboarding (which now sits behind the Welcome
              flow). In the Brief itself, every field is optional —
              and the principal already filled name + email at sign
              up. Rewritten to say what's true now. */}
          A handful of short sections. Every blank is optional —
          leave what doesn&apos;t apply. Save as you go; come back
          days, weeks, or months later. The more you share, the
          more thoughtfully your week can be designed — and you
          won&apos;t have to repeat yourself to your {crewNouns}.
          They {crewQuantifier} read from here.
        </IntroParagraph>
        <p className="cabin-brief__time">
          Around <strong>{remainingMinutes || totalMinutes} minutes</strong>{" "}
          {remainingMinutes !== totalMinutes
            ? "remaining — pick up from where you left off."
            : "in total, in your own time."}
        </p>
      </header>

      {/* 2026-05-22 — Submission state banners.
          • Submitted → calm navy banner, no Submit CTA.
          • All sections complete (principal only) → gold ribbon
            with REVIEW & SEND.
          • Else → quiet, no banner. */}
      {isSubmitted ? (
        <section className="cabin-brief__submitted">
          <div className="cabin-brief__submitted-eyebrow">
            Your brief is with George
          </div>
          <p className="cabin-brief__submitted-copy">
            Submitted {submittedBy ? `by ${submittedBy}` : ""}
            {submittedAtPretty ? ` · ${submittedAtPretty}` : ""}.
            George will read it personally and reply within a day. If you
            need to make a change, write to George — he can reopen the
            brief for everyone.
          </p>
        </section>
      ) : allDone && isPrincipal ? (
        <section className="cabin-brief__ready">
          <div className="cabin-brief__ready-eyebrow">
            Your brief is ready for your approval
          </div>
          <p className="cabin-brief__ready-copy">
            Every section is filled. Take a quiet read — adjust anything
            that doesn&apos;t match your group, then send it to George.
          </p>
          <Link href="/cabin/brief/review" className="cabin-brief__ready-cta">
            Review &amp; send →
          </Link>
        </section>
      ) : null}

      <ul className="cabin-brief__sections">
        {visibleSections.map((s, i) => {
          const done = completedKeys.has(s.key);
          const edited = sectionEditedByName[s.key];
          return (
            <li
              key={s.key}
              className={
                "cabin-brief__item" +
                (done ? " is-done" : "") +
                (s.importance === "high" ? " is-important" : "") +
                (isSubmitted ? " is-locked" : "")
              }
            >
              <Link href={`/cabin/brief/${s.key.replace(/_/g, "-")}`}>
                <span className="cabin-brief__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cabin-brief__body">
                  <strong>{s.title}</strong>
                  <em>{s.intro}</em>
                  {edited?.name && (
                    <span className="cabin-brief__last-edited">
                      Last edited by {edited.name}
                    </span>
                  )}
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

        /* 2026-05-22 — Submission state styles.
           Gold ribbon for "Ready for approval" (only renders for the
           principal once every section is complete). Navy banner for
           "Brief is with George" once submitted. */
        .cabin-brief__ready {
          background: rgba(201, 168, 76, 0.10);
          border: 1px solid rgba(201, 168, 76, 0.55);
          border-left: 3px solid var(--gy-gold);
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cabin-brief__ready-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-brief__ready-copy {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.75);
          margin: 0;
        }
        .cabin-brief__ready-cta {
          align-self: flex-start;
          margin-top: 6px;
          padding: 12px 22px;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid var(--gy-gold);
        }
        .cabin-brief__ready-cta:hover {
          background: var(--gy-gold);
          color: var(--gy-navy);
        }

        .cabin-brief__submitted {
          background: rgba(13, 27, 42, 0.04);
          border: 1px solid rgba(13, 27, 42, 0.15);
          padding: 22px 24px;
        }
        .cabin-brief__submitted-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-brief__submitted-copy {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.7);
          margin: 8px 0 0 0;
        }

        .cabin-brief__last-edited {
          display: block;
          margin-top: 4px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.45);
          font-style: normal;
          font-weight: 500;
        }
        .cabin-brief__item.is-locked a {
          opacity: 0.7;
          pointer-events: auto;
          cursor: default;
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
