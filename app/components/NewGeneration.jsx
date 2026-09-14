"use client";

// 2026-09-14, George: La Pellegrina and Errant Vagabond leave the homepage
// (not the fleet) and in their place goes a band of the modern yachts, the
// ones a good share of clients ask for by look: new hulls, open decks,
// contemporary interiors. His brief was explicit about the register. It must
// not cheapen the site, so no "Instagram", no trend words; a plain title and
// a hand-picked set.
//
// The set is chosen, not queried: every yacht here was launched or rebuilt
// in 2024 to 2026, and none is already in the awarded band above, so the
// page never shows the same boat twice in a scroll. Everything printed on a
// card (name, size, berths, the low end of the rate card, the year) is read
// live from the fleet record, so a new rate card or a retired hull corrects
// the band without anyone touching this file. A slug that is missing from
// the fleet simply drops out.
//
// It reuses the awarded band's classes on purpose. Two bands, one hand.

import { useRef, useCallback } from "react";
import Link from "next/link";
import { sanityImg, sanityImgSrcSet } from "@/lib/sanity-image";
import { metres, weekFrom, berths } from "./AwardedFleet";
import { FLEET_COUNT } from "@/lib/fleetCount";

// Order: the first card is an exterior, because the band is read by its
// first frame. SERENITY has no exterior of her own on file (the builder's
// photographs are of a sister hull and are not used), so she sits inside.
const PICKS = [
  "seabarit-lx",   // Moon 60, 2024
  "alina",         // Fountaine Pajot Power 80, 2026
  "one",           // Pershing 90, refit 2024
  "serenity",      // Sunreef 60, 2025
  "sol-madinina",  // Fountaine Pajot Thira 80, 2025
  "d2",            // Fountaine Pajot Power 67, 2024
  "lady-m",        // Lagoon 60, 2025
  "why-not",       // Dominator 780 S, refit 2024
];

/** "2025" reads as launched, "2012 / 2024" as the refit. Null if neither parses. */
function yearLine(raw) {
  const years = (String(raw || "").match(/\b20\d{2}\b/g) || []).map(Number);
  if (years.length === 0) return null;
  if (years.length === 1) return `Launched ${years[0]}`;
  return `Refit ${Math.max(...years)}`;
}

/** The model, as the subtitle carries it before any pipe. */
function model(raw) {
  const m = String(raw || "").split("|")[0].trim();
  return m || null;
}

export default function NewGeneration({ fleet = [] }) {
  const bySlug = new Map(fleet.map((y) => [y.slug, y]));
  const railRef = useRef(null);

  const nudge = useCallback((dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".gy-awd__card");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const picks = PICKS.map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((y) => ({
      slug: y.slug,
      name: y.name,
      image: y.image || null,
      year: yearLine(y.yearBuiltRefit),
      meta: [model(y.subtitle), metres(y.length), berths(y.sleeps)].filter(Boolean).join(" · "),
      price: weekFrom(y.weeklyRatePrice),
    }));

  if (picks.length === 0) return null;

  return (
    <section className="gy-awarded" aria-labelledby="gy-newgen-title">
      <div className="gy-awarded__inner">
        <header className="gy-awd__head">
          <div>
            <p className="gy-awd__eyebrow">Launched or rebuilt, 2024 to 2026</p>
            <h2 id="gy-newgen-title" className="gy-awd__title">
              The new generation
            </h2>
            <p className="gy-awd__lede">
              Chosen for their lines as much as their layouts: open decks,
              contemporary interiors, and the newest hulls working Greek waters.
            </p>
          </div>
        </header>

        <div className="gy-awd__railwrap">
          <ul className="gy-awd__rail" ref={railRef} aria-label="The new generation of yachts">
            {picks.map((y) => (
              <li key={y.slug} className="gy-awd__card">
                <Link href={`/yachts/${y.slug}`} className="gy-awd__link">
                  <span className="gy-awd__shot">
                    {y.image ? (
                      <img
                        className="gy-awd__img"
                        src={sanityImg(y.image, { w: 640 })}
                        srcSet={sanityImgSrcSet(y.image, [320, 480, 640])}
                        sizes="(min-width: 1024px) 300px, 74vw"
                        alt={`${y.name}, on charter in Greek waters`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="gy-awd__noimg" aria-hidden="true" />
                    )}
                    {y.year && <span className="gy-awd__crown">{y.year}</span>}
                  </span>
                  <span className="gy-awd__body">
                    <span className="gy-awd__name">{y.name}</span>
                    {y.meta && <span className="gy-awd__meta">{y.meta}</span>}
                    {y.price && <span className="gy-awd__price">{y.price}</span>}
                  </span>
                </Link>
              </li>
            ))}

            <li className="gy-awd__card gy-awd__card--all">
              <Link href="/charter-yacht-greece" className="gy-awd__alllink">
                <span className="gy-awd__allnum">{FLEET_COUNT}</span>
                <span className="gy-awd__alltext">
                  Every yacht on the list, by size, by type and by the week
                </span>
                <span className="gy-awd__allgo" aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          </ul>

          <div className="gy-awd__nav" aria-hidden="false">
            <button type="button" className="gy-awd__arrow" aria-label="Previous yachts" onClick={() => nudge(-1)}>
              &larr;
            </button>
            <button type="button" className="gy-awd__arrow" aria-label="More yachts" onClick={() => nudge(1)}>
              &rarr;
            </button>
          </div>
        </div>

        <footer className="gy-awd__foot">
          <p className="gy-awd__ratenote">
            Base fee for the week at the lowest point of each yacht&rsquo;s
            rate card; VAT, APA and gratuity set out separately, in writing.
          </p>
          <Link href="/charter-yacht-greece" className="gy-awarded__more">
            The full fleet
          </Link>
        </footer>
      </div>
    </section>
  );
}
