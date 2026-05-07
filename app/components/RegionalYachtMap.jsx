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
import dynamic from "next/dynamic";
import Link from "next/link";
import { REGIONS, bucketYachtsByRegion } from "@/lib/regions";
import { sanityCardImg } from "@/lib/sanity-image";

// Lazy-load the R3F yacht-mesh layer (desktop-only optimisation,
// keeps the bundle off the mobile critical path).
const RegionalYachtMap3D = dynamic(() => import("./RegionalYachtMap3D"), {
  ssr: false,
});

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
        <RegionalYachtMap3D
          regions={REGIONS}
          buckets={buckets}
          onRegionClick={setActiveSlug}
        />

        {/* Region labels + counts as a 2D HTML overlay so they stay
            readable even when the 3D layer is suspended (mobile,
            reduced-motion). Each one mirrors a region cluster. */}
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

      {/* Region detail modal — photo cover + yacht list */}
      {activeRegion && (
        <div
          className="gy-region-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gy-region-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSlug(null);
          }}
        >
          <div className="gy-region-modal">
            <button
              type="button"
              className="gy-region-modal-close"
              onClick={() => setActiveSlug(null)}
              aria-label="Close"
              data-cursor="Close"
            >
              ×
            </button>

            <div
              className="gy-region-modal-cover"
              style={{ backgroundImage: `url(${activeRegion.photo})` }}
              aria-hidden="true"
            >
              <div className="gy-region-modal-cover-shade" />
              <div className="gy-region-modal-cover-text">
                <p className="gy-region-modal-eyebrow">Greek Waters</p>
                <h3 id="gy-region-modal-title" className="gy-region-modal-name">
                  {activeRegion.name}
                </h3>
                <p className="gy-region-modal-subtitle">
                  {activeRegion.subtitle}
                </p>
              </div>
            </div>

            <div className="gy-region-modal-body">
              <p className="gy-region-modal-blurb">{activeRegion.blurb}</p>

              <p className="gy-region-modal-count">
                {activeYachts.length === 0
                  ? "No yachts currently pinned here."
                  : `${activeYachts.length} yacht${
                      activeYachts.length === 1 ? "" : "s"
                    } pinned here`}
              </p>

              {activeYachts.length > 0 && (
                <div className="gy-region-yacht-list">
                  {activeYachts.slice(0, 12).map((y) => (
                    <YachtRow key={y?.slug?.current ?? y?.slug} yacht={y} />
                  ))}
                  {activeYachts.length > 12 && (
                    <p className="gy-region-yacht-more">
                      + {activeYachts.length - 12} more —{" "}
                      <Link href="/charter-yacht-greece">browse the fleet</Link>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
