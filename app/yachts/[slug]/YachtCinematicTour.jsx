"use client";

// Phase 27i.10 (2026-05-07) — Yacht detail "Diamond Journey" tour.
//
// Sits between the hero and the breadcrumbs / specs strip. Pins
// itself for ~250 vh of scroll; inside that pin, fades through up
// to 5 yacht photos with a soft Ken Burns scale on the active one.
// The result reads as a slow camera tour around the yacht — Apple
// product-page cinematics for a 50-metre Couach.
//
// Implementation:
//   • Outer section is `height: 300vh, position: relative`.
//   • Inner div is `position: sticky, top: 0, height: 100vh`.
//   • All photos stacked absolutely; the active one (chosen by
//     scroll progress 0..1 through the outer section) renders at
//     opacity 1, the rest at 0.
//   • Crossfade is a 600 ms opacity transition.
//   • Active photo also gets a tiny Ken Burns scale tied to local
//     progress so the camera feels alive even while the photo holds.
//
// Renders nothing if fewer than 2 images are passed (single-photo
// yachts get the existing hero only — no need for a tour).

import { useEffect, useRef, useState } from "react";

const SECTION_HEIGHT_VH = 300; // total scroll consumed by the tour

export default function YachtCinematicTour({ images = [], yachtName = "" }) {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [localProgress, setLocalProgress] = useState(0); // 0..1 within active

  // Cap to 5 photos — beyond that the tour gets too long to scroll.
  // Each entry can be either a string (URL) or { url, alt } object;
  // we normalise to { url, alt }. Empty/null entries get filtered.
  const tourImages = (images || [])
    .slice(0, 5)
    .map((img) => {
      if (!img) return null;
      if (typeof img === "string") return { url: img, alt: "" };
      return { url: img.url || img.imageUrl, alt: img.alt || "" };
    })
    .filter((img) => img && img.url);
  const count = tourImages.length;

  // 2026-05-08 (Phase 27i.20) — image preloading. Boss reported a
  // "black screen between photos" bug while scrolling through the
  // tour. Root cause: each photo was using a CSS background-image
  // and the browser only started fetching when the photo became
  // active. On a fast scroll the next photo wasn't decoded yet, so
  // the dark fallback background-color (#050a14) showed through
  // for the duration of the load. Fix: preload every tour photo
  // immediately on mount so they're already in the cache by the
  // time the user scrolls to them.
  useEffect(() => {
    if (count < 1 || typeof window === "undefined") return;
    const preloads = tourImages.map((img) => {
      const i = new window.Image();
      i.src = `${img.url}?w=1800&fit=crop&auto=format`;
      return i;
    });
    return () => {
      // Letting them GC; explicitly drop the src to cancel any
      // in-flight requests if the user unmounts mid-load.
      preloads.forEach((i) => { i.src = ""; });
    };
    // tourImages identity changes per render but its members are stable
    // for a given yacht, so depend on count only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      // Progress is 0 when section just hits the top, 1 when its
      // bottom-minus-viewport-height passes the top.
      const scrolled = -rect.top;
      const t = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      const slot = 1 / count;
      const idx = Math.min(count - 1, Math.floor(t / slot));
      const local = (t - idx * slot) / slot; // 0..1 within current photo
      setActiveIdx(idx);
      setLocalProgress(local);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  if (count < 2) return null;

  return (
    <section
      ref={sectionRef}
      aria-label={`${yachtName} cinematic tour`}
      className="gy-yacht-tour"
      style={{ height: `${SECTION_HEIGHT_VH}vh`, position: "relative" }}
    >
      <div
        className="gy-yacht-tour-pin"
        // Phase 27i.18 (2026-05-08) — 3D parallax tilt on the
        // pinned tour. Setting a perspective on the parent lets
        // the active photo's rotateY (computed below) read as a
        // subtle camera dolly around the yacht instead of a flat
        // rotation. 1400 px is the sweet spot — any closer and
        // the tilt looks gimmicky, any further and it reads as
        // 2D. Closes Session C #10 from the original brief.
        style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
      >
        {tourImages.map((img, i) => {
          const isActive = i === activeIdx;
          // Ken Burns scale: 1.04 → 1.10 across the active slot
          const scale = isActive ? 1.04 + localProgress * 0.06 : 1.04;
          // 3D parallax tilt: -2.4° → +2.4° rotateY across the
          // active slot, plus a tiny rotateX so the camera feels
          // anchored to a horizon line. Inactive photos stay flat
          // so the transitions don't compound rotations.
          const rotY = isActive ? (localProgress - 0.5) * 4.8 : 0;
          const rotX = isActive ? Math.sin(localProgress * Math.PI) * 1.2 : 0;
          return (
            <div
              key={img.url}
              className="gy-yacht-tour-photo"
              style={{
                backgroundImage: `url(${img.url}?w=1800&fit=crop&auto=format)`,
                opacity: isActive ? 1 : 0,
                // 2026-05-08: removed transformStyle:preserve-3d. It was
                // unnecessary (the photo has no 3D children) and was
                // suspected of causing edge-render artefacts in Safari
                // when combined with the parent's perspective + the
                // small rotateY/rotateX. The 3D parallax tilt still
                // works fine without it — perspective lives on the pin.
                transform: `scale(${scale}) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
                zIndex: isActive ? 2 : 1,
              }}
              aria-hidden={!isActive}
            />
          );
        })}

        {/* Bottom shade so any caption / progress bar rendered on
            top reads against the photo. */}
        <div className="gy-yacht-tour-shade" aria-hidden="true" />

        {/* Eyebrow + caption + counter. Caption is the active
            image's `alt` text from Sanity when present, else a
            generic step label. */}
        <div className="gy-yacht-tour-overlay">
          <div className="gy-yacht-tour-overlay-text">
            <p className="gy-yacht-tour-eyebrow">A Closer Look</p>
            {tourImages[activeIdx]?.alt && (
              <p className="gy-yacht-tour-caption">
                {tourImages[activeIdx].alt}
              </p>
            )}
          </div>
          <p className="gy-yacht-tour-counter">
            {String(activeIdx + 1).padStart(2, "0")}
            <span> / {String(count).padStart(2, "0")}</span>
          </p>
        </div>

        {/* Slim gold progress bar bottom — reads as a film reel
            advancing as the tour plays. */}
        <div className="gy-yacht-tour-progress" aria-hidden="true">
          <div
            className="gy-yacht-tour-progress-bar"
            style={{
              transform: `scaleX(${(activeIdx + localProgress) / count})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
