// The awarded fleet, on the homepage.
//
// George's brief, and the reason this exists: the cheapest catamaran in the
// fleet takes most of the clicks the whole fleet earns, because it happens to
// rank for its own name. The six yachts whose crews have actually won
// something take almost none. That is the wrong way round, and a homepage
// section is how the six get read at all.
//
// What it is not: a badge wall. Six gold laurels in a row is what a booking
// platform does with a supplier rating. This is a list, in the same register
// as the rest of the site, and it says exactly what was won and when. The
// restraint is what makes it credible; a client who charters at this level has
// seen enough invented trust marks to discount the whole genre.
//
// Everything comes from lib/yachtAwards.js, so nothing here can claim
// something the guard has not seen a source for.

import Link from "next/link";
import { YACHT_AWARDS, awardsFor, headlineAward } from "@/lib/yachtAwards";

/**
 * @param {Array<{slug:string,name:string,image?:string}>} fleet
 *   the yachts the homepage already has to hand, so this adds no query.
 */
export default function AwardedFleet({ fleet = [] }) {
  const bySlug = new Map(fleet.map((y) => [y.slug, y]));

  const winners = Object.keys(YACHT_AWARDS)
    .map((slug) => {
      const awards = awardsFor(slug);
      if (awards.length === 0) return null;
      const y = bySlug.get(slug);
      return {
        slug,
        name: y?.name || slug,
        count: awards.length,
        headline: headlineAward(slug),
      };
    })
    .filter(Boolean)
    // Most decorated first. Above & Beyond has six and leads on merit rather
    // than on alphabet.
    .sort((a, b) => b.count - a.count);

  if (winners.length === 0) return null;

  const total = winners.reduce((n, w) => n + w.count, 0);

  return (
    <section className="gy-awarded" aria-labelledby="gy-awarded-title">
      <div className="gy-awarded__inner">
        <p className="gy-awarded__eyebrow">Judged against the fleet</p>
        <h2 id="gy-awarded-title" className="gy-awarded__title">
          {winners.length} yachts in this house have won something
        </h2>
        <p className="gy-awarded__lede">
          {total} placings at the EMMYS and MEDYS yacht shows, where crews cook,
          set tables and are judged side by side. Not a rating anybody bought.
        </p>

        <ol className="gy-awarded__list">
          {winners.map((w) => (
            <li key={w.slug} className="gy-awarded__row">
              <Link href={`/yachts/${w.slug}`} className="gy-awarded__link">
                <span className="gy-awarded__name">{w.name}</span>
                <span className="gy-awarded__award">{w.headline}</span>
                <span className="gy-awarded__count">
                  {w.count === 1 ? "1 award" : `${w.count} awards`}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/* The one link out. Without it this band is a dead end and the page
            it feeds has no route in from the homepage, which is where a new
            page earns its first crawl. */}
        <Link href="/award-winning-yacht-charter-greece" className="gy-awarded__more">
          What these awards are, and what we do not call one
        </Link>
      </div>
    </section>
  );
}
