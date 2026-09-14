"use client";

// 2026-09-14, George: La Pellegrina 1 and Errant Vagabond leave the
// homepage, and in their place goes George's own picks: the yachts he
// recommends first. His brief was explicit about the register. It must not
// cheapen the site, so no trend words; a plain title and a hand-picked set.
// (Errant Vagabond later left the list altogether the same evening, with
// the other catamarans whose card starts below EUR 17,000.)
//
// The set is chosen by George, not queried. Everything printed on a card
// (name, size, berths, the low end of the rate card, the year) is read live
// from the fleet record, so a new rate card or a retired hull corrects the
// band without anyone touching this file. A slug that is missing from the
// fleet simply drops out.
//
// It reuses the awarded band's classes on purpose. Two bands, one hand.

import { useRef, useCallback } from "react";
import Link from "next/link";
import { sanityImg, sanityImgSrcSet } from "@/lib/sanity-image";
import { metres, weekFrom, berths } from "./AwardedFleet";
import { FLEET_COUNT } from "@/lib/fleetCount";
import { orderPicks, picksQA } from "@/lib/georgesPicks";

// 2026-09-14, George's third brief: thirteen yachts, his own, set out from
// the cheapest week to the most expensive. The list and the ordering live in
// lib/georgesPicks.js, which also writes the questions and answers under the
// rail and feeds the homepage FAQ and ItemList structured data.

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
  const railRef = useRef(null);

  const nudge = useCallback((dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".gy-awd__card");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const ordered = orderPicks(fleet);
  const qa = picksQA(ordered);
  const picks = ordered
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
            <p className="gy-awd__eyebrow">Chosen personally by George</p>
            <h2 id="gy-newgen-title" className="gy-awd__title">
              George&rsquo;s picks
            </h2>
            <p className="gy-awd__lede">
              My personal picks: the yachts I recommend first when a client
              asks me where to start, set out from the lowest weekly rate to
              the highest.
            </p>
          </div>
        </header>

        <div className="gy-awd__railwrap">
          <ul className="gy-awd__rail" ref={railRef} aria-label="George's picks">
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

        {qa.length > 0 && (
          <div className="gy-picks__qa">
            {qa.map(({ q, a }) => (
              <div key={q} className="gy-picks__item">
                <h3 className="gy-picks__q">{q}</h3>
                <p className="gy-picks__a">{a}</p>
              </div>
            ))}
          </div>
        )}

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
