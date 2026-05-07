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
  const tourImages = (images || []).slice(0, 5).filter(Boolean);
  const count = tourImages.length;

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
      <div className="gy-yacht-tour-pin">
        {tourImages.map((src, i) => {
          const isActive = i === activeIdx;
          // Ken Burns scale: 1.04 → 1.10 across the active slot
          const scale = isActive ? 1.04 + localProgress * 0.06 : 1.04;
          return (
            <div
              key={src}
              className="gy-yacht-tour-photo"
              style={{
                backgroundImage: `url(${src}?w=1800&fit=crop&auto=format)`,
                opacity: isActive ? 1 : 0,
                transform: `scale(${scale})`,
                zIndex: isActive ? 2 : 1,
              }}
              aria-hidden={!isActive}
            />
          );
        })}

        {/* Bottom shade so any caption / progress bar rendered on
            top reads against the photo. */}
        <div className="gy-yacht-tour-shade" aria-hidden="true" />

        {/* Eyebrow + counter + caption (caption is just the index;
            yachts can later carry real captions per image via
            Sanity if Boss wants). */}
        <div className="gy-yacht-tour-overlay">
          <p className="gy-yacht-tour-eyebrow">A Closer Look</p>
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
