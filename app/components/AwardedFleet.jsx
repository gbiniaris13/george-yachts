// The award-winning fleet, on the homepage.
//
// ── Why this band exists ─────────────────────────────────────────────────
//
// The cheapest catamaran in the fleet takes most of the clicks the whole
// fleet earns, because it happens to rank for its own name. The eleven yachts
// whose crews have actually won something take almost none. That is the wrong
// way round.
//
// ── 2026-08-21, the second rebuild, and what George was right about ──────
//
// He read the first photo version and said three things. The heading, "have
// won something", buried the point: a reader must know on sight that these
// are the award-winning yachts of the house. The count badge said "1 PLACING"
// directly above a line reading "3rd Place", which he read as a contradiction
// and so will everybody else. And a client has no idea how a yacht wins
// anything, so the placings mean nothing until the shows are explained.
//
// He also asked where PI 2 was. She was missing, and so were APHAEA, SAMARA,
// SAHANA and AD ASTRA, because the first registry was built from the agents'
// marketing pages rather than from the shows' own results. See the note at
// the top of lib/yachtAwards.js. Six yachts became eleven, thirteen placings
// became twenty-five.
//
// So this version leads with the count, explains the shows before it asks
// anybody to be impressed, and prints a rank marker on every line: 1st, 2nd,
// 3rd, in its own column, where it cannot be confused with a total.
//
// What it is still not: a badge wall. No laurels, no seals, no ribbons. The
// credibility is carried by naming the placing, the contest, the bracket, the
// organiser and the year on every single line, and by the column that says
// what we hold back.

import Link from "next/link";
import {
  YACHT_AWARDS,
  WITHHELD,
  HONOURS,
  SHOWS,
  TIERS,
  awardsFor,
  awardsByYear,
  awardTotals,
  honoursFor,
  rankLabel,
  awardTitle,
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
 * και η πληροφορία της τιμής. Διακριτική, όμορφη, μικρή". A reader looking at
 * a wall of decorated yachts has one question the photographs cannot answer,
 * and if the page will not answer it either they leave rather than write.
 *
 * Always the low end, always prefixed "from". Sanity holds these as free text
 * in three shapes: a range, a single figure, and one already written "From
 * €17,000". The low end of a range is never an overstatement; a single figure
 * quoted flat would be, because rate cards move with the season.
 *
 * Returns null rather than a guess when nothing parses, and the card then
 * simply carries no price.
 */
function weekFrom(raw) {
  if (!raw) return null;
  // Take the euro figures before the pipe; everything after it is the VAT and
  // APA note, which is handled once at the foot of the section.
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

const words = { 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six",
  7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten", 11: "Eleven", 12: "Twelve" };

export default function AwardedFleet({ fleet = [] }) {
  const bySlug = new Map(fleet.map((y) => [y.slug, y]));

  const winners = Object.keys(YACHT_AWARDS)
    .map((slug) => {
      const awards = awardsByYear(slug);
      if (awards.length === 0) return null;
      const y = bySlug.get(slug);
      const best = awardsFor(slug)[0]; // strongest, already sorted
      const years = awards.map((a) => a.year);
      return {
        slug,
        name: y?.name || slug,
        image: y?.image || null,
        meta: [metres(y?.length), berths(y?.sleeps)].filter(Boolean).join(", "),
        price: weekFrom(y?.weeklyRatePrice),
        awards,
        best,
        firsts: awards.filter((a) => a.rank === 1).length,
        span: Math.min(...years) === Math.max(...years)
          ? `${years[0]}`
          : `${Math.min(...years)} to ${Math.max(...years)}`,
      };
    })
    .filter(Boolean)
    // Firsts first, then weight of record. A single win outranks three third
    // places, which is how anybody reading a results sheet would order it.
    .sort((a, b) => b.firsts - a.firsts || b.awards.length - a.awards.length);

  if (winners.length === 0) return null;

  const t = awardTotals();
  const [lead, ...rest] = winners;

  // Only the medal goes on the homepage. The chef's television title is a
  // real distinction and it lives on ALINA's own page, which is where George
  // put it: a national cooking show sitting under a heading about the Greek
  // charter shows would blur the one thing this band is for.
  const HOMEPAGE_HONOURS = ["just-marie-2"];
  const honourYachts = HOMEPAGE_HONOURS.map((slug) => {
    const list = honoursFor(slug);
    if (list.length === 0) return null;
    return { slug, name: bySlug.get(slug)?.name || slug, list };
  }).filter(Boolean);
  const held = Object.keys(WITHHELD).length;

  // The strongest result, cut to fit over the corner of a photograph.
  const crown = (w) =>
    `${w.best.rank === 1 && /^Winner/i.test(w.best.award) ? "Winner" : rankLabel(w.best) + " Place"}, ${w.best.organiser} ${w.best.year}`;

  const roll = (w) => (
    <ul className="gy-awarded__roll" aria-label={`Awards won by ${w.name}`}>
      {w.awards.map((a, i) => (
        <li key={`${a.year}-${a.competition}-${i}`} className="gy-awarded__rollrow">
          {/* The rank in its own column. This is the fix for the badge that
              used to read "1 PLACING" above a third place. */}
          <span className={`gy-awarded__rank gy-awarded__rank--${a.rank}`}>
            {rankLabel(a)}
          </span>
          <span className="gy-awarded__what">{awardTitle(a)}</span>
          <span className="gy-awarded__who">
            {a.organiser} {a.year}
          </span>
        </li>
      ))}
    </ul>
  );

  const shot = (w, { sizes, widths }) =>
    w.image ? (
      <img
        className="gy-awarded__img"
        src={sanityImg(w.image, { w: widths[widths.length - 1] })}
        srcSet={sanityImgSrcSet(w.image, widths)}
        sizes={sizes}
        alt={`${w.name}, on charter in Greek waters`}
        loading="lazy"
        decoding="async"
      />
    ) : (
      // No photograph is better than a stand-in. The frame keeps its shape
      // and the type carries the card.
      <span className="gy-awarded__noimg" aria-hidden="true" />
    );

  const card = (w, kind) => (
    <li key={w.slug} className={`gy-awarded__card${kind ? " " + kind : ""}`}>
      <Link href={`/yachts/${w.slug}`} className="gy-awarded__link">
        <span className="gy-awarded__shot">
          {shot(w, kind === "gy-awarded__card--major"
            ? { widths: [480, 720, 1000], sizes: "(min-width: 1200px) 46vw, (min-width: 640px) 48vw, 100vw" }
            : { widths: [400, 600, 800], sizes: "(min-width: 1200px) 23vw, (min-width: 640px) 46vw, 100vw" })}
          <span className="gy-awarded__crown">
            <span className="gy-awarded__crownplace">{crown(w)}</span>
            {w.price && <span className="gy-awarded__crownprice">{w.price}</span>}
          </span>
        </span>
        <div className="gy-awarded__body">
          <h3 className="gy-awarded__name">{w.name}</h3>
          <p className="gy-awarded__meta">
            {w.awards.length === 1 ? "1 placing" : `${w.awards.length} placings`}
            {w.meta ? ` · ${w.meta}` : ""}
          </p>
          {/* The compact phone row hides the strip across the photograph, so
              the price needs a second home. CSS shows exactly one of the two. */}
          {w.price && <p className="gy-awarded__priceinline">{w.price}</p>}
          {roll(w)}
          <span className="gy-awarded__go">See this yacht</span>
        </div>
      </Link>
    </li>
  );

  // Google reads this. The homepage is the strongest page on the site and it
  // is where these eleven have the best chance of being understood as a set
  // rather than as eleven unrelated listings.
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
        award: w.awards.map((a) => `${a.award}, ${a.organiser} ${a.year}`),
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
        <header className="gy-awarded__head">
          <p className="gy-awarded__eyebrow">
            EMMYS, Poros · MEDYS, Nafplion · 2022 to 2026
          </p>
          <h2 id="gy-awarded-title" className="gy-awarded__title">
            The award-winning yachts of this house
          </h2>
          {/* "of our yachts" said we own them. This house is a brokerage: it
              owns none of these hulls and holds no mandate on them, and both
              of those are facts a client has no business being handed and an
              owner has every right to object to. "Yachts in this house" says
              exactly what a reader needs, which is that these are the boats
              they can charter here, and claims nothing about who holds what. */}
          <p className="gy-awarded__lede">
            {words[t.yachts] || t.yachts} yachts in this house have been placed
            at the two Greek charter shows the trade actually attends. Not a
            rating anybody bought, and not a badge the builder won. Every
            placing below names the contest, the bracket it was judged in, the
            show and the year.
          </p>
        </header>

        {/* The wow, and it is all arithmetic over the registry rather than
            anything typed by hand. If a placing is ever removed these move. */}
        <ol className="gy-awarded__stats" aria-label="The record in numbers">
          {[
            [t.placings, "placings"],
            [t.firsts, "first places"],
            [t.yachts, "yachts"],
            [t.years, "seasons"],
          ].map(([n, label]) => (
            <li key={label} className="gy-awarded__stat">
              <span className="gy-awarded__statnum">{n}</span>
              <span className="gy-awarded__statlabel">{label}</span>
            </li>
          ))}
        </ol>

        {/* George: "οι πελάτες μας δεν ξέρουν ακριβώς πώς βραβεύονται τα
            σκάφη". Nobody does. Three panels, no invention: the figures and
            the brackets are sourced in lib/yachtAwards.js. */}
        <div className="gy-awarded__explain">
          <h3 className="gy-awarded__explaintitle">How a yacht wins one of these</h3>
          <ol className="gy-awarded__steps">
            <li className="gy-awarded__step">
              <span className="gy-awarded__stepnum">01</span>
              <h4 className="gy-awarded__stephead">The room is closed</h4>
              <p>
                {SHOWS.EMMYS.full} at {SHOWS.EMMYS.place}, and the{" "}
                {SHOWS.MEDYS.full} at {SHOWS.MEDYS.place}. The {SHOWS.EMMYS.edition}{" "}
                edition tied up {SHOWS.EMMYS.yachts} crewed yachts in front of{" "}
                {SHOWS.EMMYS.brokers} brokers from {SHOWS.EMMYS.countries} countries.
                Neither show sells a public ticket. The people scoring are the
                people who place the charters.
              </p>
            </li>
            <li className="gy-awarded__step">
              <span className="gy-awarded__stepnum">02</span>
              <h4 className="gy-awarded__stephead">Crews compete, not hulls</h4>
              <p>
                The chef cooks a themed three-course menu and is marked on
                presentation, technical execution, creativity and balance. The
                interior team dresses a table to the year&rsquo;s theme. A third
                contest is built from local produce. And one award goes to the
                crew that does the whole week well, which is the one every
                charter guest actually feels.
              </p>
            </li>
            <li className="gy-awarded__step">
              <span className="gy-awarded__stepnum">03</span>
              <h4 className="gy-awarded__stephead">Judged against her own kind</h4>
              <p>
                Emerald is {TIERS.Emerald}. Diamond is {TIERS.Diamond}. A 16
                metre catamaran is never marked against a 24 metre one, so a
                first place is a first place inside a real field, and a third
                against forty other galleys is not a consolation.
              </p>
            </li>
          </ol>
        </div>

        {/* The lead. Seven placings across five seasons is the strongest
            single fact on this page and it gets the large frame. */}
        <article className="gy-awarded__lead">
          <Link href={`/yachts/${lead.slug}`} className="gy-awarded__link">
            <span className="gy-awarded__shot gy-awarded__shot--lead">
              {shot(lead, {
                widths: [640, 960, 1280, 1600],
                sizes: "(min-width: 1000px) 56vw, 100vw",
              })}
              <span className="gy-awarded__crown">
                <span className="gy-awarded__crownplace">{crown(lead)}</span>
                {lead.price && <span className="gy-awarded__crownprice">{lead.price}</span>}
              </span>
            </span>
            <div className="gy-awarded__body">
              <span className="gy-awarded__kicker">
                The most decorated yacht in the fleet
              </span>
              <h3 className="gy-awarded__name">{lead.name}</h3>
              <p className="gy-awarded__meta">
                {lead.awards.length} placings, {lead.span}
                {lead.meta ? ` · ${lead.meta}` : ""}
              </p>
              {lead.price && <p className="gy-awarded__priceinline">{lead.price}</p>}
              {roll(lead)}
              <span className="gy-awarded__go">See this yacht</span>
            </div>
          </Link>
        </article>

        <ul className="gy-awarded__grid">
          {/* Three majors and twelve minors. Not a taste decision: the band
              holds sixteen yachts, the lead takes one, and fifteen is the
              only awkward number in the set. Three across then four across
              divides it exactly and leaves no card stranded alone on a last
              row, which is what two majors and thirteen minors did. */}
          {rest.map((w, i) =>
            card(w, i < 3 ? "gy-awarded__card--major" : null)
          )}
        </ul>

        {/* Distinctions that are real and are not yacht show placings, so they
            are shown apart and counted apart. George asked for the Just Marie
            2 medal by name: "βεβαίως να το βάλουμε, είναι πολύ τιμητικό για
            αυτόν". It is, and it is also the only line in this band that has
            nothing to do with cooking. */}
        {honourYachts.length > 0 && (
          <div className="gy-awarded__honours">
            <h3 className="gy-awarded__honourstitle">
              And one distinction that is not a competition
            </h3>
            <ul className="gy-awarded__honourslist">
              {honourYachts.map(({ slug, name, list }) =>
                list.map((h, i) => (
                  <li key={`${slug}-${i}`} className="gy-awarded__honour">
                    <Link href={`/yachts/${slug}`} className="gy-awarded__honourlink">
                      <span className="gy-awarded__honouryear">{h.year}</span>
                      <span className="gy-awarded__honourbody">
                        <span className="gy-awarded__honourname">{name}</span>
                        <span className="gy-awarded__honouraward">{h.award}</span>
                        <span className="gy-awarded__honourorg">{h.organiser}</span>
                        {h.note && (
                          <span className="gy-awarded__honournote">{h.note}</span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* The analysis. Every sentence is checkable against
            lib/yachtAwards.js, which is the point: the paragraph that says
            what we hold back is worth more than the ones that boast. */}
        <div className="gy-awarded__note">
          <div className="gy-awarded__notecol">
            <h3 className="gy-awarded__notetitle">A crew award, not a builder&rsquo;s</h3>
            <p>
              Every placing above was won by a crew. That distinction is the
              whole point of the band. A shipyard&rsquo;s prize belongs to the
              shipyard and tells you nothing about the week you will spend
              aboard. A crew&rsquo;s prize belongs to the people who will cook
              for you, lay your table and read the weather. Elsewhere in this
              market the word is most often reaching for something the
              shipyard won. We do not count that as the yacht&rsquo;s. Nor do
              we hide the year, because a crew that wins can also move.
            </p>
          </div>
          <div className="gy-awarded__notecol">
            <h3 className="gy-awarded__notetitle">And what we hold back</h3>
            <p>
              {held} further claims sit in our own registry unpublished. Some
              name no organiser. Some name no year. One is a first place at the
              2026 show that belongs to a yacht whose name we carry twice, and
              until we know which hull it was, it stays off the page. A record
              is only worth printing if the entries nobody checks are as true
              as the ones they do.
            </p>
          </div>
        </div>

        <p className="gy-awarded__ratenote">
          Prices are the base fee for the week, at the lowest point of each
          yacht&rsquo;s rate card. The certified VAT rate, the advance
          provisioning allowance and the crew gratuity range are set out
          separately, in writing, before anything is signed.
        </p>

        <Link href="/award-winning-yacht-charter-greece" className="gy-awarded__more">
          Every placing, every source, and what we do not call an award
        </Link>
      </div>
    </section>
  );
}
