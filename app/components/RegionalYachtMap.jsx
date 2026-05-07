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

import { useEffect, useState } from "react";
import Link from "next/link";
import { REGIONS, bucketYachtsByRegion } from "@/lib/regions";
import { sanityCardImg } from "@/lib/sanity-image";

// 2026-05-07 — Boss flagged the R3F yacht meshes as "χριστουγεννιάτικα
// μπαλάκια άσπρες". Replaced the 3D layer with a hand-drawn SVG of
// Greece (mainland + Crete + island clusters) under the region pins.
// Cleaner, geographic, no fake yacht-baubles.

const GOLD = "#DAA520";
const GOLD_SOFT = "rgba(218, 165, 32, 0.35)";

/**
 * Yacht-list row shown inside the region modal.
 */
/**
 * Hand-drawn SVG silhouette of Greece. Five rough shapes (mainland +
 * Crete + Cyclades cluster + Sporades cluster + Ionian cluster +
 * Saronic cluster) over a horizon-line wave pattern. All paths are
 * artistic stylisations, not cartographic — the goal is "this
 * looks like Greek waters" not "this is OS-grade geography".
 *
 * 2026-05-07 — replaces the R3F yacht-mesh layer Boss flagged as
 * "Christmas baubles". Pure SVG, zero JS, zero 3D.
 */
function GreekMapBackdrop() {
  return (
    <svg
      className="gy-region-map-backdrop"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Sea — slow horizontal stripes that simulate a wave grain. */}
        <pattern id="seaWave" x="0" y="0" width="60" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M 0 7 Q 15 0 30 7 T 60 7"
            stroke="rgba(218, 165, 32, 0.06)"
            strokeWidth="0.6"
            fill="none"
          />
        </pattern>
        {/* Land fill — a subtle paper-coloured wash. */}
        <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(245, 235, 210, 0.06)" />
          <stop offset="100%" stopColor="rgba(218, 165, 32, 0.04)" />
        </linearGradient>
      </defs>

      {/* Sea wave texture — full canvas */}
      <rect width="1000" height="600" fill="url(#seaWave)" />

      {/* Greek mainland — Peloponnese + central Greece + Halkidiki. */}
      <path
        d="
          M 460 110
          Q 520 96 600 110
          T 720 145
          Q 760 175 740 220
          L 705 250
          Q 660 260 640 290
          L 620 340
          Q 590 380 555 410
          L 510 440
          Q 480 460 470 490
          L 440 510
          Q 400 510 390 480
          L 380 440
          Q 410 410 400 380
          L 380 360
          Q 360 380 340 365
          L 350 335
          Q 380 315 410 300
          L 405 270
          Q 380 250 380 220
          L 410 195
          Q 440 175 445 145
          Z
        "
        fill="url(#landFill)"
        stroke="rgba(218, 165, 32, 0.32)"
        strokeWidth="0.8"
      />

      {/* Crete — elongated south island */}
      <path
        d="M 540 555 Q 620 540 700 545 T 820 555 Q 850 565 835 580 T 720 590 T 600 585 T 540 575 Z"
        fill="url(#landFill)"
        stroke="rgba(218, 165, 32, 0.32)"
        strokeWidth="0.8"
      />

      {/* Ionian islands cluster (west) — 4 small lobes */}
      <g fill="url(#landFill)" stroke="rgba(218, 165, 32, 0.28)" strokeWidth="0.6">
        <ellipse cx="240" cy="170" rx="22" ry="14" />
        <ellipse cx="225" cy="240" rx="18" ry="28" />
        <ellipse cx="245" cy="310" rx="14" ry="20" />
        <ellipse cx="270" cy="370" rx="11" ry="18" />
      </g>

      {/* Sporades cluster (north Aegean) — 3 small dots */}
      <g fill="url(#landFill)" stroke="rgba(218, 165, 32, 0.28)" strokeWidth="0.6">
        <ellipse cx="700" cy="100" rx="14" ry="9" />
        <ellipse cx="745" cy="115" rx="11" ry="7" />
        <ellipse cx="780" cy="105" rx="9" ry="6" />
      </g>

      {/* Cyclades cluster (centre Aegean) — scattered dots */}
      <g fill="url(#landFill)" stroke="rgba(218, 165, 32, 0.28)" strokeWidth="0.6">
        <circle cx="780" cy="370" r="9" />
        <circle cx="820" cy="395" r="11" />
        <circle cx="800" cy="430" r="8" />
        <circle cx="850" cy="445" r="9" />
        <circle cx="775" cy="465" r="7" />
        <circle cx="830" cy="490" r="10" />
      </g>

      {/* Saronic gulf islands — small, tight to mainland */}
      <g fill="url(#landFill)" stroke="rgba(218, 165, 32, 0.28)" strokeWidth="0.6">
        <ellipse cx="555" cy="475" rx="9" ry="6" />
        <ellipse cx="585" cy="495" rx="8" ry="5" />
        <ellipse cx="615" cy="510" rx="7" ry="5" />
      </g>

      {/* Faint constellation lines — Athens hub → each region */}
      <g
        stroke="rgba(218, 165, 32, 0.20)"
        strokeWidth="0.7"
        fill="none"
        strokeDasharray="2 6"
      >
        <line x1="540" y1="430" x2="245" y2="240" />
        <line x1="540" y1="430" x2="745" y2="115" />
        <line x1="540" y1="430" x2="585" y2="495" />
        <line x1="540" y1="430" x2="820" y2="430" />
      </g>
    </svg>
  );
}

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

  const buckets = bucketYachtsByRegion(yachts);

  // Close modal on Escape
  useEffect(() => {
    if (!activeSlug) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveSlug(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeSlug]);

  const activeRegion = activeSlug
    ? REGIONS.find((r) => r.slug === activeSlug)
    : null;
  const activeYachts = activeSlug ? buckets[activeSlug] : [];

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

      <div className="gy-region-map-canvas">
        {/* Greek silhouette backdrop — hand-drawn SVG, faint gold
            outline against the navy sea. Pure decoration. */}
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
                onClick={() => setActiveSlug(region.slug)}
                aria-label={`${region.name} — ${count} yacht${count === 1 ? "" : "s"}`}
                style={{
                  // Convert -100..+100 grid to viewport % (50% center)
                  left: `${50 + region.position.x * 0.42}%`,
                  top: `${50 - region.position.y * 0.55}%`,
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

      {/* Region detail modal — photo carousel cover + yacht list */}
      {activeRegion && (
        <RegionModal
          region={activeRegion}
          yachts={activeYachts}
          onClose={() => setActiveSlug(null)}
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
function RegionModal({ region, yachts, onClose }) {
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
      <div className="gy-region-modal">
        <button
          type="button"
          className="gy-region-modal-close"
          onClick={onClose}
          aria-label="Close"
          data-cursor="Close"
        >
          ×
        </button>

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
