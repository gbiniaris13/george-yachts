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
// `photos` is an array of { url, caption?, credit? }.
//
// 2026-05-23 (PM) — George reported the close X + nav arrows
// scrolling out of view on tall images. Root cause: the cabin
// luxury Round 2 layer added a `transform` keyframe to every
// .cabin-shell child for the page-mount cascade, which leaves
// `transform: translateY(0)` on those parents — and per CSS
// spec, any non-`none` transform creates a containing block for
// `position: fixed` descendants. The lightbox modal was getting
// trapped inside the VesselBrochureBlock instead of escaping to
// the viewport.
//
// Bulletproof fix: render the lightbox via React Portal into
// document.body. Ancestor transforms can no longer affect it.
// =============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  // 2026-05-23 — portal target. We render the modal into
  // document.body so no ancestor `transform` / `filter` / `perspective`
  // can trap our `position: fixed` lightbox inside a containing block.
  // Mounted client-side only to avoid SSR hydration warnings.
  const [portalTarget, setPortalTarget] = useState(null);
  useEffect(() => {
    setPortalTarget(typeof document !== "undefined" ? document.body : null);
  }, []);

  const modal = current && (
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
        title="Close (Esc)"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M1 1 L17 17 M17 1 L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
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
            title="Previous (←)"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
              <path d="M12 1 L2 11 L12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <button
            type="button"
            className="cabin-lightbox__nav cabin-lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            title="Next (→)"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
              <path d="M2 1 L12 11 L2 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </>
      )}

      <figure
        className="cabin-lightbox__figure"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={openAt} /* re-mount on change so the fade-in plays */
          src={current.url}
          alt={current.caption || `${vesselName} - photo ${openAt + 1}`}
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
          <span className="cabin-lightbox__counter-num">
            {String(openAt + 1).padStart(2, "0")}
          </span>
          <span className="cabin-lightbox__counter-sep"> / </span>
          <span className="cabin-lightbox__counter-total">
            {String(list.length).padStart(2, "0")}
          </span>
        </div>
      )}

      <div
        className="cabin-lightbox__hint"
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true">←</span>
        <span aria-hidden="true">→</span>
        <em>to navigate</em>
        <span className="cabin-lightbox__hint-divider">·</span>
        <em>Esc to close</em>
      </div>
    </div>
  );

  return (
    <>
      {/* Caller renders the trigger surface (grid, hero, etc.). We
          give them an `open(index)` function via the render-prop
          pattern. */}
      {typeof children === "function" ? children({ open }) : children}

      {/* PORTAL the modal into document.body so ancestor transforms
          can't trap it. After hydration only — first render is null
          on the client to match server output. */}
      {modal && portalTarget ? createPortal(modal, portalTarget) : null}

      <style>{`
        /* 2026-05-23 - Lightbox lives at document.body via portal.
           Controls use position:fixed against the viewport - guaranteed
           visible regardless of viewport scroll or image height. */
        .cabin-lightbox {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(8, 16, 26, 0.96);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 88px;
          cursor: zoom-out;
          animation: cabin-lightbox-in 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes cabin-lightbox-in {
          from { opacity: 0; backdrop-filter: blur(0); }
          to   { opacity: 1; backdrop-filter: blur(8px); }
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
          gap: 16px;
        }
        .cabin-lightbox__img {
          display: block;
          max-width: min(94vw, 1500px);
          max-height: 82vh;
          width: auto;
          height: auto;
          object-fit: contain;
          background: #000;
          box-shadow:
            0 4px 12px rgba(0,0,0,0.4),
            0 24px 60px rgba(0,0,0,0.55),
            0 0 0 1px rgba(201, 168, 76, 0.18);
          animation: cabin-lightbox-img-in 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes cabin-lightbox-img-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .cabin-lightbox__caption {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-style: italic;
          color: rgba(248,245,240,0.88);
          font-size: 14.5px;
          line-height: 1.55;
          text-align: center;
          max-width: 64ch;
          letter-spacing: 0.2px;
        }
        .cabin-lightbox__caption em { color: rgba(201, 168, 76, 0.92); font-style: normal; }

        /* CLOSE - fixed to viewport top-right, always visible. */
        .cabin-lightbox__close {
          position: fixed;
          top: 24px;
          right: 28px;
          width: 48px;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 245, 240, 0.08);
          color: #F8F5F0;
          border: 1px solid rgba(201, 168, 76, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10001;
        }
        .cabin-lightbox__close:hover {
          background: rgba(201, 168, 76, 0.22);
          border-color: rgba(201, 168, 76, 0.9);
          transform: scale(1.06);
        }

        /* NAV - fixed to viewport sides, vertically centred. */
        .cabin-lightbox__nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 245, 240, 0.08);
          color: #F8F5F0;
          border: 1px solid rgba(201, 168, 76, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10001;
        }
        .cabin-lightbox__nav:hover {
          background: rgba(201, 168, 76, 0.22);
          border-color: rgba(201, 168, 76, 0.9);
          transform: translateY(-50%) scale(1.06);
        }
        .cabin-lightbox__nav--prev { left: 24px; }
        .cabin-lightbox__nav--next { right: 24px; }

        /* COUNTER - fixed top-centre, editorial. */
        .cabin-lightbox__counter {
          position: fixed;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--gy-font-ui, -apple-system), sans-serif;
          font-size: 12px;
          letter-spacing: 4px;
          color: rgba(248, 245, 240, 0.85);
          padding: 8px 16px;
          border: 1px solid rgba(201, 168, 76, 0.45);
          border-radius: 999px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(8, 16, 26, 0.4);
          font-variant-numeric: tabular-nums;
          z-index: 10001;
        }
        .cabin-lightbox__counter-num {
          color: rgba(201, 168, 76, 0.95);
          font-weight: 600;
        }
        .cabin-lightbox__counter-sep {
          color: rgba(248, 245, 240, 0.4);
          margin: 0 4px;
        }
        .cabin-lightbox__counter-total {
          color: rgba(248,245,240,0.66);
        }

        /* HINT - fixed bottom-centre, small keyboard reminder. */
        .cabin-lightbox__hint {
          position: fixed;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--gy-font-ui, -apple-system), sans-serif;
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(248,245,240,0.66);
          z-index: 10001;
        }
        .cabin-lightbox__hint em {
          font-style: normal;
          letter-spacing: 2.5px;
        }
        .cabin-lightbox__hint-divider { opacity: 0.4; }

        /* 2026-05-23 - Audit pass:
             · close button was 40×40 (under Apple HIG 44px)
             · close + counter sat at top:12-14px which on iPhone
               14/15 Pro/Pro Max collides with Dynamic Island.
           Both now respect env(safe-area-inset-top) and meet 44px. */
        @media (max-width: 599.98px) {
          .cabin-lightbox {
            padding: calc(16px + env(safe-area-inset-top, 0)) 8px
                     calc(80px + env(safe-area-inset-bottom, 0));
          }
          .cabin-lightbox__nav {
            width: 44px;
            height: 44px;
          }
          .cabin-lightbox__nav--prev { left: 8px; }
          .cabin-lightbox__nav--next { right: 8px; }
          .cabin-lightbox__close {
            top: calc(12px + env(safe-area-inset-top, 0));
            right: 12px;
            width: 44px;
            height: 44px;
          }
          .cabin-lightbox__counter {
            top: calc(14px + env(safe-area-inset-top, 0));
            font-size: 11px;
            letter-spacing: 3px;
            padding: 6px 12px;
          }
          .cabin-lightbox__img { max-height: 70vh; }
          .cabin-lightbox__hint {
            display: none; /* no keyboard on phones */
          }
        }
      `}</style>
    </>
  );
}
