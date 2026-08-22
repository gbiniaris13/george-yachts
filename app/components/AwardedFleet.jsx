// The award-winning fleet, on the homepage.
//
// ── Why this band exists ─────────────────────────────────────────────────
//
// The cheapest catamaran in the fleet takes most of the clicks the whole
// fleet earns, because it happens to rank for its own name. The sixteen
// yachts whose crews have actually won something take almost none. That is
// the wrong way round.
//
// ── 2026-08-22, the third build: a rail, not a wall ──────────────────────
//
// The second build was honest and enormous: a lead card, three majors,
// twelve minors, a three-panel explainer, an honours block and a two-column
// analysis. On a phone that was minutes of scrolling, tiny photographs, and
// every yacht's full results sheet printed inline. George's verdict drew the
// line this file now walks: the client must see AT ONCE that these are the
// award-winning yachts, and the band must stop spending the homepage's
// space, because sixteen yachts will one day be twenty.
//
// So the homepage keeps the announcement and loses the archive. One compact
// horizontal rail, every yacht one card, every card one line of proof (its
// strongest placing) and its price. The archive did not die, it moved to
// /award-winning-yacht-charter-greece, which is where a reader who wants
// every placing, the shows explained, the honours and the withheld claims
// was always better served: a page can rank for that, a band cannot.
//
// Still not a badge wall. No laurels, no ribbons. The rail's credibility is
// the same as ever: named placing, named organiser, named year, on every
// card, all generated from lib/yachtAwards.js where every entry carries a
// source and a checked date, and guarded by scripts/checkAwardClaims.mjs.

"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import {
  YACHT_AWARDS,
  awardsFor,
  awardsByYear,
  awardTotals,
  rankLabel,
} from "@/lib/yachtAwards";
import { sanityImg, sanityImgSrcSet } from "@/lib/sanity-image";

/**
 * Sanity holds length as free text and it is not consistent: "20,36 m / 67
 * ft", "23.87 m / 80ft", one with a trailing space. Take the metres, one
 * decimal. Returns null rather than a guess if the string does not parse.
 */
function metres(raw) {
  if (!raw) return null;
  const m = /([\d]+)[.,]?([\d]*)\s*m\b/i.exec(String(raw));
  if (!m) return null;
  const n = Number(`${m[1]}.${m[2] || "0"}`);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n.toFixed(1).replace(/\.0$/, "")} m`;
}

/**
 * The week, from the lowest figure on the rate card.
 *
 * George's brief: "θέλω σε αυτά τα σκάφη που είναι στα βραβευμένα να υπάρχει
 * και η πληροφορία της τιμής. Διακριτική, όμορφη, μικρή." Always the low
 * end, always prefixed "from": the low end of a range is never an
 * overstatement, a single figure quoted flat would be. Returns null rather
 * than a guess when nothing parses, and the card then carries no price.
 */
function weekFrom(raw) {
  if (!raw) return null;
  // Figures before the pipe; after it is the VAT and APA note, which is
  // handled once at the foot of the section.
  const head = String(raw).split("|")[0];
  const figures = head.match(/€\s?[\d][\d.,]*/g);
  if (!figures || figures.length === 0) return null;
  const value = (f) => Number(String(f).replace(/[^\d]/g, ""));
  const low = figures.map(value).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b)[0];
  if (!low) return null;
  return `From €${low.toLocaleString("en-GB")} a week`;
}

/** sleeps comes back as a string on some records and a number on others. */
function berths(raw) {
  const n = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? `sleeps ${n}` : null;
}

export default function AwardedFleet({ fleet = [] }) {
  const bySlug = new Map(fleet.map((y) => [y.slug, y]));
  const railRef = useRef(null);

  // One card-width per press, direction from the button. Native smooth
  // scrolling, so touch, trackpad, keyboard and these arrows all land on the
  // same scroll-snap stops and there is no script moving anything per frame.
  const nudge = useCallback((dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".gy-awd__card");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const winners = Object.keys(YACHT_AWARDS)
    .map((slug) => {
      const awards = awardsByYear(slug);
      if (awards.length === 0) return null;
      const y = bySlug.get(slug);
      const best = awardsFor(slug)[0]; // strongest, already sorted
      return {
        slug,
        name: y?.name || slug,
        image: y?.image || null,
        meta: [metres(y?.length), berths(y?.sleeps)].filter(Boolean).join(" · "),
        price: weekFrom(y?.weeklyRatePrice),
        count: awards.length,
        firsts: awards.filter((a) => a.rank === 1).length,
        best,
      };
    })
    .filter(Boolean)
    // Firsts first, then weight of record. A single win outranks three third
    // places, which is how anybody reading a results sheet would order it.
    .sort((a, b) => b.firsts - a.firsts || b.count - a.count);

  if (winners.length === 0) return null;

  const t = awardTotals();

  // The strongest result, one line: "1st Place, EMMYS 2026".
  const crown = (w) =>
    `${w.best.rank === 1 && /^Winner/i.test(w.best.award) ? "Winner" : rankLabel(w.best) + " Place"}, ${w.best.organiser} ${w.best.year}`;

  // Google reads this. The homepage is where these sixteen have the best
  // chance of being understood as a set rather than sixteen listings; the
  // full Product nodes with offers and images live on the awards page.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Award-winning charter yachts, George Yachts Brokerage House",
    numberOfItems: winners.length,
    itemListElement: winners.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: w.name,
        url: `https://georgeyachts.com/yachts/${w.slug}`,
        award: awardsFor(w.slug).map(
          (a) => `${a.award}, ${a.organiser} ${a.year}`
        ),
      },
    })),
  };

  return (
    <section className="gy-awarded" aria-labelledby="gy-awarded-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="gy-awarded__inner">
        <header className="gy-awd__head">
          <div>
            <p className="gy-awd__eyebrow">
              EMMYS, Poros · MEDYS, Nafplion · 2022 to 2026
            </p>
            <h2 id="gy-awarded-title" className="gy-awd__title">
              The award&#8209;winning yachts of this house
            </h2>
            {/* One sentence. The judged-by-the-trade point is the only thing
                a reader must take in before the cards; everything else this
                band used to explain now lives on the awards page. */}
            <p className="gy-awd__lede">
              Placed by working charter brokers at the two Greek crewed shows.
              Never a rating anybody bought, never the builder&rsquo;s badge.
            </p>
          </div>

          {/* The record in numbers, one quiet row. All arithmetic over the
              registry: if a placing is ever removed, these move. */}
          <p className="gy-awd__stats" aria-label="The record in numbers">
            <span><strong>{t.placings}</strong> placings</span>
            <span><strong>{t.firsts}</strong> first places</span>
            <span><strong>{t.yachts}</strong> yachts</span>
            <span><strong>{t.years}</strong> seasons</span>
          </p>
        </header>

        <div className="gy-awd__railwrap">
          <ul className="gy-awd__rail" ref={railRef} aria-label="Award-winning yachts">
            {winners.map((w) => (
              <li key={w.slug} className="gy-awd__card">
                <Link href={`/yachts/${w.slug}`} className="gy-awd__link">
                  <span className="gy-awd__shot">
                    {w.image ? (
                      <img
                        className="gy-awd__img"
                        src={sanityImg(w.image, { w: 640 })}
                        srcSet={sanityImgSrcSet(w.image, [320, 480, 640])}
                        sizes="(min-width: 1024px) 300px, 74vw"
                        alt={`${w.name}, on charter in Greek waters`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      // No photograph is better than a stand-in. The frame
                      // keeps its shape and the type carries the card.
                      <span className="gy-awd__noimg" aria-hidden="true" />
                    )}
                    <span className="gy-awd__crown">{crown(w)}</span>
                  </span>
                  <span className="gy-awd__body">
                    <span className="gy-awd__name">{w.name}</span>
                    <span className="gy-awd__meta">
                      {w.count === 1 ? "1 placing" : `${w.count} placings`}
                      {w.meta ? ` · ${w.meta}` : ""}
                    </span>
                    {w.price && <span className="gy-awd__price">{w.price}</span>}
                  </span>
                </Link>
              </li>
            ))}

            {/* The rail's last stop is the archive itself, so running out of
                cards and finding the full record are the same gesture. */}
            <li className="gy-awd__card gy-awd__card--all">
              <Link href="/award-winning-yacht-charter-greece" className="gy-awd__alllink">
                <span className="gy-awd__allnum">{t.placings}</span>
                <span className="gy-awd__alltext">
                  Every placing, every source, and what we do not call an award
                </span>
                <span className="gy-awd__allgo" aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          </ul>

          {/* Desktop affordance only; phones scroll the rail natively. */}
          <div className="gy-awd__nav" aria-hidden="false">
            <button
              type="button"
              className="gy-awd__arrow"
              aria-label="Previous yachts"
              onClick={() => nudge(-1)}
            >
              &larr;
            </button>
            <button
              type="button"
              className="gy-awd__arrow"
              aria-label="More yachts"
              onClick={() => nudge(1)}
            >
              &rarr;
            </button>
          </div>
        </div>

        <footer className="gy-awd__foot">
          <p className="gy-awd__ratenote">
            Base fee for the week at the lowest point of each yacht&rsquo;s
            rate card; VAT, APA and gratuity set out separately, in writing.
          </p>
          <Link href="/award-winning-yacht-charter-greece" className="gy-awarded__more">
            The full record, placing by placing
          </Link>
        </footer>
      </div>
    </section>
  );
}
