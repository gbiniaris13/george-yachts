// What distinguishes this yacht from the other seventy-one.
//
// Six of the fleet have won something. Sixty-six have not, and this section
// does not draw for them: an empty "Awards" heading is worse than no heading,
// because it says we looked and found nothing.
//
// The restraint is the point. A row of gold badges is what a booking platform
// does. This is a line of text, the way a house would mention it: what was
// won, who ran it, what year. No trophies, no ribbons, no counters.
//
// Everything shown comes from lib/yachtAwards.js, where each claim carries
// the page it was read on and the date. Nothing is written here by hand, and
// scripts/checkAwardClaims.mjs fails the build if it ever is.

import Link from "next/link";
import { awardsFor } from "@/lib/yachtAwards";

export default function AwardsSection({ slug, yachtName }) {
  const awards = awardsFor(slug);
  if (awards.length === 0) return null;

  // Crew awards are the chef's, the steward's, the deck team's. Saying so
  // is not a disclaimer, it is the more flattering fact: somebody aboard
  // won this against other crews, and a guest is about to meet them.
  const crew = awards.filter((a) => a.kind === "crew");
  const vessel = awards.filter((a) => a.kind === "vessel");

  return (
    <section className="yacht-awards" aria-labelledby="yacht-awards-title">
      <div className="yacht-awards__inner">
        <h2 id="yacht-awards-title" className="yacht-awards__title">
          {`What distinguishes ${yachtName}?`}
        </h2>

        {vessel.length > 0 && (
          <ol className="yacht-awards__list">
            {vessel.map((a, i) => (
              <li key={`v${i}`} className="yacht-awards__item">
                <span className="yacht-awards__year">{a.year}</span>
                <span className="yacht-awards__award">{a.award}</span>
                <span className="yacht-awards__org">{a.organiser}</span>
              </li>
            ))}
          </ol>
        )}

        {crew.length > 0 && (
          <>
            <p className="yacht-awards__lede">
              {crew.length === 1
                ? "Her crew has been judged against the rest of the fleet, and won."
                : `Her crew has been judged against the rest of the fleet, and won ${crew.length} times.`}
            </p>
            <ol className="yacht-awards__list">
              {crew.map((a, i) => (
                <li key={`c${i}`} className="yacht-awards__item">
                  <span className="yacht-awards__year">{a.year}</span>
                  <span className="yacht-awards__award">{a.award}</span>
                  <span className="yacht-awards__org">{a.organiser}</span>
                  {a.chef && <span className="yacht-awards__who">Chef {a.chef}</span>}
                </li>
              ))}
            </ol>
            <p className="yacht-awards__note">
              Crew awards belong to the people who won them. George confirms
              who is aboard for your dates before you sign anything.{" "}
              <Link href="/award-winning-yacht-charter-greece" className="yacht-awards__more">
                See every awarded yacht in the fleet
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
