"use client";

// Phase 27i.5 (2026-05-07) — Regional Yacht Map.
//
// Replaces the deferred GreekWatersMap (the editorial illustrated
// "Four Regions / A week in the Aegean..." copy). New behaviour
// (Boss directive):
//
//   • Reads yachts from Sanity (cruisingRegion field, fed via prop)
//   • Buckets each yacht into one of 4 sea regions (Cyclades /
//     Ionian / Saronic / Sporades) based on the regex matchers in
//     lib/regions.js. Yachts that don't match → Athens hub
//   • Renders 5 region clusters on a stylised Aegean canvas
//     (relative to Athens). Each cluster shows a count of yachts
//     pinned there + a 3D bobbing yacht mesh as the visual marker
//   • Click a region → modal with a region-cover photo + the list
//     of yachts pinned there, each linking to /yachts/{slug}
//
// Section header reframed per Boss: "we have yachts for charter",
// not "travel agency showing Greek beauty". Copy starts with the
// fleet count, anchors on charter, ends with a region invitation.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { geoMercator } from "d3-geo";
import GreekMapBackdrop from "./GreekMapBackdrop";
import { REGIONS, bucketYachtsByRegion } from "@/lib/regions";
import { sanityCardImg } from "@/lib/sanity-image";

// 2026-05-07 (Phase 27i.5d) — region pins are projected with the
// SAME geoMercator setup as GreekMapBackdrop so they sit exactly on
// the cartographic coast. Region.position is now [lon, lat] in WGS84.
// MAP_W / MAP_H must mirror the SVG viewBox in GreekMapBackdrop.jsx.
const MAP_W = 1000;
const MAP_H = 600;

const GOLD = "#DAA520";
const GOLD_SOFT = "rgba(218, 165, 32, 0.35)";

/**
 * Yacht-list row shown inside the region modal.
 */
function YachtRow({ yacht }) {
  const slug = yacht?.slug?.current ?? yacht?.slug;
  const img = yacht?.image
    ? sanityCardImg(yacht.image, 320)
    : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'><rect width='320' height='240' fill='%230a1929'/></svg>";
  return (
    <Link
      href={`/yachts/${slug}`}
      data-cursor="View"
      className="gy-region-yacht-row"
    >
      <div
        className="gy-region-yacht-thumb"
        style={{ backgroundImage: `url(${img})` }}
        aria-hidden="true"
      />
      <div className="gy-region-yacht-meta">
        <p className="gy-region-yacht-name">{yacht?.name ?? "Yacht"}</p>
        <p className="gy-region-yacht-spec">
          {[yacht?.length, yacht?.sleeps && `${yacht.sleeps} guests`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <span className="gy-region-yacht-cta" aria-hidden="true">View →</span>
    </Link>
  );
}

export default function RegionalYachtMap({ yachts = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);
  // 2026-05-07 (Phase 27i.5e) — "Diamond Journey" zoom hint. When a
  // pin is clicked the map briefly scales + translates toward that
  // region before the modal opens. 480 ms hold, then modal reveal.
  // CSS-only, no JS animation library.
  const [zoomingTo, setZoomingTo] = useState(null);
  // 2026-05-08 (Phase 27i.15) — region-to-region fly-through. While
  // the modal is open the user can click the prev/next arrows to
  // glide to a neighbouring region. We hold a brief flag that fades
  // the modal cover during the 480 ms camera glide so the photo
  // swap between regions reads as a single cinematic motion rather
  // than a hard cut.
  const [flying, setFlying] = useState(false);

  const buckets = bucketYachtsByRegion(yachts);

  // Pre-compute pin viewport-% positions using the same geoMercator
  // projection GreekMapBackdrop uses internally. Memoised — region
  // coordinates are static, projection is stable across renders.
  const pinPositions = useMemo(() => {
    const projection = geoMercator()
      .center([24, 38.5])
      .scale(2400)
      .translate([MAP_W / 2, MAP_H / 2]);
    const out = {};
    for (const r of REGIONS) {
      const [px, py] = projection(r.position) ?? [MAP_W / 2, MAP_H / 2];
      out[r.slug] = {
        leftPct: (px / MAP_W) * 100,
        topPct: (py / MAP_H) * 100,
      };
    }
    return out;
  }, []);

  // Click handler — sets the "zooming to this region" state, holds
  // for 480 ms while the canvas glides toward the pin, THEN opens
  // the modal. Result: the user feels the map actively focus on
  // their chosen region instead of an instant modal pop.
  const onPinClick = (slug) => {
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setActiveSlug(slug);
      return;
    }
    setZoomingTo(slug);
    setTimeout(() => {
      setActiveSlug(slug);
      setZoomingTo(null);
    }, 480);
  };

  // Region-to-region fly-through. Glides the camera to the
  // neighbouring slug in REGIONS order (cycles). The map's
  // .is-zooming class stays on for the duration so the underlying
  // canvas glides smoothly between zoom origins via the existing
  // 480 ms cubic-bezier transition on transform-origin / transform.
  const flyToNeighbour = (direction) => {
    if (!activeSlug) return;
    const idx = REGIONS.findIndex((r) => r.slug === activeSlug);
    if (idx < 0) return;
    const nextIdx =
      direction === "next"
        ? (idx + 1) % REGIONS.length
        : (idx - 1 + REGIONS.length) % REGIONS.length;
    const nextSlug = REGIONS[nextIdx].slug;
    setFlying(true);
    setZoomingTo(nextSlug);    // canvas glides to new pin centre
    setActiveSlug(nextSlug);    // modal swaps to new region content
    setTimeout(() => {
      setFlying(false);
      setZoomingTo(null);
    }, 520);
  };

  // Close modal on Escape, navigate with ←/→
  useEffect(() => {
    if (!activeSlug) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActiveSlug(null);
        setZoomingTo(null);
      } else if (e.key === "ArrowRight") {
        flyToNeighbour("next");
      } else if (e.key === "ArrowLeft") {
        flyToNeighbour("prev");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug]);

  const activeRegion = activeSlug
    ? REGIONS.find((r) => r.slug === activeSlug)
    : null;
  const activeYachts = activeSlug ? buckets[activeSlug] : [];

  // While the modal is open we keep the canvas focused on the active
  // region — that way the prev/next arrows glide smoothly between
  // regions rather than snapping back through 50% / 50%.
  const focusedSlug = zoomingTo ?? activeSlug;

  return (
    <section
      aria-label="Where the fleet sails — Greek waters"
      className="gy-region-map-section"
      data-sound-reveal
    >
      <div className="gy-region-map-header">
        <p className="gy-region-map-eyebrow">The Fleet · Where We Sail</p>
        <h2 className="gy-region-map-title">
          {yachts?.length ?? 0} yachts. Five ports of departure.
        </h2>
        <p className="gy-region-map-blurb">
          Each port is a different summer. Tap a region to see the yachts
          pinned there.
        </p>
      </div>

      <div
        className={`gy-region-map-canvas ${focusedSlug ? "is-zooming" : ""}`}
        style={
          focusedSlug
            ? {
                "--gy-zoom-x": `${pinPositions[focusedSlug]?.leftPct ?? 50}%`,
                "--gy-zoom-y": `${pinPositions[focusedSlug]?.topPct ?? 50}%`,
              }
            : undefined
        }
      >
        {/* Real Natural Earth Greek coastline (Phase 27i.5d). */}
        <GreekMapBackdrop />

        {/* Region labels + counts as a 2D HTML overlay sitting on
            top of the SVG. Each one mirrors a region cluster. */}
        <div className="gy-region-pins" aria-hidden="false">
          {REGIONS.map((region) => {
            const count = buckets[region.slug]?.length ?? 0;
            return (
              <button
                key={region.slug}
                type="button"
                className="gy-region-pin"
                data-cursor="View"
                onClick={() => onPinClick(region.slug)}
                aria-label={`${region.name} — ${count} yacht${count === 1 ? "" : "s"}`}
                style={{
                  // Projected geographic position so the pin sits on
                  // the visible coast in the SVG backdrop.
                  left: `${pinPositions[region.slug]?.leftPct ?? 50}%`,
                  top: `${pinPositions[region.slug]?.topPct ?? 50}%`,
                }}
              >
                <span className="gy-region-pin-dot" aria-hidden="true" />
                <span className="gy-region-pin-name">{region.name}</span>
                <span className="gy-region-pin-count">
                  {count} yacht{count === 1 ? "" : "s"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase 27i.19 (2026-05-08) — home-base footnote. Boss
          directive: the per-region yacht counts are home bases, not
          static "this is where the yacht lives all summer". Yachts
          relocate on client request and most charters cross regions
          mid-itinerary. The footnote is intentionally small so it
          reads as the editorial fine print under the headline,
          not as a disclaimer panel. */}
      <p className="gy-region-map-footnote">
        These counts show each port's home base. Yachts relocate on
        client request, and most summer charters itinerate across
        regions — a vessel based in Athens may begin your week there
        and end it in the Cyclades.
      </p>

      {/* Region detail modal — photo carousel cover + yacht list.
          key={region.slug} so the modal remounts on fly-through →
          photoIdx resets to 0 → cover photos start their fade fresh
          for the new region. */}
      {activeRegion && (
        <RegionModal
          key={activeRegion.slug}
          region={activeRegion}
          yachts={activeYachts}
          flying={flying}
          onClose={() => {
            setActiveSlug(null);
            setZoomingTo(null);
          }}
          onPrev={() => flyToNeighbour("prev")}
          onNext={() => flyToNeighbour("next")}
        />
      )}
    </section>
  );
}

/**
 * Modal — crossfade carousel (auto-rotates through region.photos)
 * + yacht list. Pulled out of the main component so the carousel
 * state lives in its own React tree and resets when a different
 * region opens.
 */
function RegionModal({ region, yachts, flying = false, onClose, onPrev, onNext }) {
  const photos = Array.isArray(region.photos) && region.photos.length > 0
    ? region.photos
    : [];
  const [photoIdx, setPhotoIdx] = useState(0);

  // Auto-rotate every 5.5s. Reduced-motion users get a static cover.
  useEffect(() => {
    if (photos.length <= 1) return;
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const t = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % photos.length);
    }, 5500);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <div
      className="gy-region-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gy-region-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`gy-region-modal ${flying ? "is-flying" : ""}`}>
        <button
          type="button"
          className="gy-region-modal-close"
          onClick={onClose}
          aria-label="Close"
          data-cursor="Close"
        >
          ×
        </button>

        {/* Phase 27i.15 (2026-05-08) — region-to-region fly-through.
            Prev/next arrows glide the camera (the underlying SVG
            map zoom origin transitions over 480 ms) AND swap the
            modal contents to the neighbouring region. Keyboard:
            ←/→ also navigate. */}
        {onPrev && (
          <button
            type="button"
            className="gy-region-modal-nav gy-region-modal-nav--prev"
            onClick={onPrev}
            aria-label="Previous region"
            data-cursor="Prev"
          >
            ‹
          </button>
        )}
        {onNext && (
          <button
            type="button"
            className="gy-region-modal-nav gy-region-modal-nav--next"
            onClick={onNext}
            aria-label="Next region"
            data-cursor="Next"
          >
            ›
          </button>
        )}

        {/* Carousel cover — all 4 photos stacked, the active one at
            full opacity, others at 0. CSS handles the crossfade. */}
        <div className="gy-region-modal-cover" aria-hidden="true">
          {photos.map((src, i) => (
            <div
              key={src}
              className="gy-region-modal-cover-photo"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === photoIdx ? 1 : 0,
              }}
            />
          ))}
          <div className="gy-region-modal-cover-shade" />
          <div className="gy-region-modal-cover-text">
            <p className="gy-region-modal-eyebrow">Greek Waters</p>
            <h3 id="gy-region-modal-title" className="gy-region-modal-name">
              {region.name}
            </h3>
            <p className="gy-region-modal-subtitle">{region.subtitle}</p>
          </div>

          {/* Dot indicators — clickable, manual nav for users who
              don't want to wait for the auto-rotation. */}
          {photos.length > 1 && (
            <div className="gy-region-modal-dots">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Photo ${i + 1} of ${photos.length}`}
                  className={i === photoIdx ? "is-active" : ""}
                  onClick={() => setPhotoIdx(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="gy-region-modal-body">
          <p className="gy-region-modal-blurb">{region.blurb}</p>

          <p className="gy-region-modal-count">
            {yachts.length === 0
              ? "No yachts currently pinned here."
              : `${yachts.length} yacht${yachts.length === 1 ? "" : "s"} pinned here`}
          </p>

          {yachts.length > 0 && (
            <div className="gy-region-yacht-list">
              {yachts.slice(0, 12).map((y) => (
                <YachtRow key={y?.slug?.current ?? y?.slug} yacht={y} />
              ))}
              {yachts.length > 12 && (
                <p className="gy-region-yacht-more">
                  + {yachts.length - 12} more —{" "}
                  <Link href="/charter-yacht-greece">browse the fleet</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
