"use client";

// app/components/cabin/PhotoGallery.jsx
// =============================================================
// 2026-05-23 — George after Olga's first friend-test:
//
//   "Έβαλα φωτογραφίες και τις πήρε, αλλά θα ήταν ωραίο να
//    μπορούν να τις αλλάζουν και να τις βλέπουν μεγάλες."
//
// Reusable lightbox-style gallery: the parent renders the
// thumbnail grid (or a single hero); click any image to open
// a full-screen viewer. Keyboard ← → Esc, on-screen prev/next,
// swipe on touch devices. Closes on backdrop click or X.
//
// Two surfaces:
//   <PhotoGallery photos={[...]} renderTrigger={(open) => ...}>
//     — Caller controls how the thumbnail strip looks; we only
//       own the lightbox modal + interactions.
//
// `photos` is an array of { url, caption?, credit? }.
// =============================================================

import { useCallback, useEffect, useRef, useState } from "react";

export default function PhotoGallery({
  photos,
  vesselName = "your yacht",
  children,
}) {
  const list = Array.isArray(photos) ? photos.filter((p) => p?.url) : [];
  const [openAt, setOpenAt] = useState(null); // index of open photo, or null

  const open = useCallback(
    (i) => {
      if (i < 0 || i >= list.length) return;
      setOpenAt(i);
    },
    [list.length],
  );
  const close = useCallback(() => setOpenAt(null), []);
  const next = useCallback(
    () => setOpenAt((i) => (i == null ? null : (i + 1) % list.length)),
    [list.length],
  );
  const prev = useCallback(
    () =>
      setOpenAt((i) =>
        i == null ? null : (i - 1 + list.length) % list.length,
      ),
    [list.length],
  );

  // Keyboard ← → Esc — only while lightbox is open.
  useEffect(() => {
    if (openAt == null) return;
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openAt, close, next, prev]);

  // Touch swipe for mobile.
  const touchStartX = useRef(null);
  function onTouchStart(e) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // ignore taps
    if (dx < 0) next();
    else prev();
  }

  const current = openAt != null ? list[openAt] : null;

  return (
    <>
      {/* Caller renders the trigger surface (grid, hero, etc.). We
          give them an `open(index)` function via the render-prop
          pattern. */}
      {typeof children === "function" ? children({ open }) : children}

      {current && (
        <div
          className="cabin-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${vesselName} photo viewer`}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            className="cabin-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close photo"
          >
            ×
          </button>

          {list.length > 1 && (
            <>
              <button
                type="button"
                className="cabin-lightbox__nav cabin-lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="cabin-lightbox__nav cabin-lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          <figure
            className="cabin-lightbox__figure"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.caption || `${vesselName} — photo ${openAt + 1}`}
              className="cabin-lightbox__img"
            />
            {(current.caption || current.credit) && (
              <figcaption className="cabin-lightbox__caption">
                {current.caption}
                {current.credit && <em> · {current.credit}</em>}
              </figcaption>
            )}
          </figure>

          {list.length > 1 && (
            <div
              className="cabin-lightbox__counter"
              onClick={(e) => e.stopPropagation()}
            >
              {openAt + 1} / {list.length}
            </div>
          )}
        </div>
      )}

      <style>{`
        .cabin-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(13, 27, 42, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 56px;
          cursor: zoom-out;
          animation: cabin-lightbox-in 180ms ease-out;
        }
        @keyframes cabin-lightbox-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cabin-lightbox__figure {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          margin: 0;
          cursor: default;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cabin-lightbox__img {
          max-width: min(96vw, 1400px);
          max-height: 86vh;
          width: auto;
          height: auto;
          object-fit: contain;
          background: #000;
          box-shadow: 0 18px 48px rgba(0,0,0,0.55);
        }
        .cabin-lightbox__caption {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-style: italic;
          color: rgba(248, 245, 240, 0.8);
          font-size: 14px;
          line-height: 1.55;
          text-align: center;
          max-width: 60ch;
        }
        .cabin-lightbox__caption em { color: rgba(201, 168, 76, 0.85); }

        .cabin-lightbox__close {
          position: absolute;
          top: 18px;
          right: 22px;
          width: 44px;
          height: 44px;
          background: rgba(248, 245, 240, 0.08);
          color: #F8F5F0;
          border: 1px solid rgba(201, 168, 76, 0.55);
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
        }
        .cabin-lightbox__close:hover {
          background: rgba(201, 168, 76, 0.18);
        }

        .cabin-lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          background: rgba(248, 245, 240, 0.08);
          color: #F8F5F0;
          border: 1px solid rgba(201, 168, 76, 0.55);
          font-size: 36px;
          line-height: 1;
          cursor: pointer;
          font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
          padding: 0 0 4px 0;
        }
        .cabin-lightbox__nav:hover { background: rgba(201, 168, 76, 0.18); }
        .cabin-lightbox__nav--prev { left: 18px; }
        .cabin-lightbox__nav--next { right: 18px; }

        .cabin-lightbox__counter {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(248, 245, 240, 0.65);
          background: rgba(13, 27, 42, 0.6);
          padding: 6px 14px;
          border: 1px solid rgba(248, 245, 240, 0.18);
        }

        @media (max-width: 640px) {
          .cabin-lightbox { padding: 16px 8px 56px; }
          .cabin-lightbox__nav {
            width: 44px;
            height: 44px;
            font-size: 28px;
          }
          .cabin-lightbox__nav--prev { left: 6px; }
          .cabin-lightbox__nav--next { right: 6px; }
          .cabin-lightbox__close { top: 8px; right: 8px; }
          .cabin-lightbox__img { max-height: 78vh; }
        }
      `}</style>
    </>
  );
}
