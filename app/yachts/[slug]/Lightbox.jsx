'use client';

// Yacht gallery — editorial carousel + fullscreen lightbox.
//
// 2026-05-11 (Boss directive: "site addresses ultra-wealthy who've
// seen everything — yacht presentation must IMPRESS, work flawlessly
// on mobile and desktop, this is the central product"). Complete
// rewrite after three prior attempts at <img>-based rendering left
// thumbnails as empty navy boxes. Root cause was almost certainly a
// race condition between Next.js client hydration and the
// `aspect-ratio` grid-cell sizing for lazy-loaded <img> tags. The
// existing cinematic-tour component never had this problem because
// it used `background-image`, so this rebuild standardises the whole
// gallery on the same proven pattern.
//
// Design (Robb Report / Vogue editorial spread):
//   • ONE large hero slide at a time (3:2 desktop, 4:3 mobile)
//   • Slow Ken Burns scale on active slide, 1.1s crossfade
//   • Restrained gold arrows with backdrop-blur, navy translucent
//   • Top-right "01 / 12" counter in Switzer small caps
//   • Bottom-left caption (alt text if meaningful) or "Tap to expand"
//   • Below: horizontal thumbnail strip, gold border on active
//   • Click main slide → fullscreen lightbox modal
//   • Keyboard ← → arrows, ESC to close modal
//   • Touch swipe (60 px threshold) on both carousel and modal
//   • Single-step autoplay (first slide → second after 6s, then
//     manual only — same pattern as Apple product pages, never
//     becomes a slideshow that distracts from the photo)
//   • Preloads next + prev images so navigation feels instant
//   • Respects prefers-reduced-motion (no autoplay, no Ken Burns)

import { useState, useEffect, useRef, useCallback } from 'react';

export default function Lightbox({ images, yachtName }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const touchStartX = useRef(null);
  const count = Array.isArray(images) ? images.length : 0;

  // ── Navigation ────────────────────────────────────────────
  const next = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % count);
    setAutoplay(false);
  }, [count]);

  const prev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + count) % count);
    setAutoplay(false);
  }, [count]);

  const jump = useCallback((idx) => {
    setCurrentIdx(idx);
    setAutoplay(false);
  }, []);

  // ── Single-step autoplay ──────────────────────────────────
  // First slide holds for 6 s then advances ONCE, then manual.
  // Like an Apple product page intro — not a slideshow.
  useEffect(() => {
    if (!autoplay) return;
    if (count < 2) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const t = setTimeout(() => {
      setCurrentIdx(1);
      setAutoplay(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [autoplay, count]);

  // ── Keyboard + body scroll lock ───────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (modalOpen) {
        if (e.key === 'Escape') setModalOpen(false);
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }
    };
    document.addEventListener('keydown', onKey);
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modalOpen, next, prev]);

  // ── Touch swipe ───────────────────────────────────────────
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  // ── Preload prev + next so transitions are instant ────────
  useEffect(() => {
    if (typeof window === 'undefined' || count < 2) return;
    const indices = [
      (currentIdx + 1) % count,
      (currentIdx - 1 + count) % count,
    ];
    const tags = indices.map((idx) => {
      const im = new window.Image();
      im.src = `${images[idx].url}?w=1800&h=1200&fit=crop&auto=format`;
      return im;
    });
    return () => {
      tags.forEach((t) => { t.src = ''; });
    };
  }, [currentIdx, images, count]);

  // ── GA4 event on lightbox open ────────────────────────────
  const openModal = useCallback(() => {
    setModalOpen(true);
    try {
      window.gtag?.('event', 'yacht_gallery_opened', {
        yacht: yachtName,
        image_index: currentIdx,
      });
    } catch {}
  }, [currentIdx, yachtName]);

  if (count === 0) return null;
  const current = images[currentIdx];

  // Caption logic: surface alt text only when it's substantive (not
  // just "Yacht Name" or empty). Falls back to action hint.
  const altText = (current.alt || '').trim();
  const hasMeaningfulCaption =
    altText.length > 12 &&
    !altText.toLowerCase().includes(yachtName.toLowerCase());
  const captionText = hasMeaningfulCaption ? altText : 'Tap photo to expand';

  return (
    <>
      {/* ───────────────────────────────────────────────
          MAIN CAROUSEL
          ─────────────────────────────────────────────── */}
      <div
        className="yacht-carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${yachtName} photo gallery`}
      >
        <div className="yacht-carousel__stage">
          {images.map((img, i) => (
            <div
              key={i}
              className={`yacht-carousel__slide ${i === currentIdx ? 'is-active' : ''}`}
              style={{
                backgroundImage: `url(${img.url}?w=1800&h=1200&fit=crop&auto=format)`,
              }}
              aria-hidden={i !== currentIdx}
              role={i === currentIdx ? 'button' : undefined}
              tabIndex={i === currentIdx ? 0 : -1}
              aria-label={
                i === currentIdx
                  ? `Photo ${i + 1} of ${count} — click to enlarge`
                  : undefined
              }
              onClick={() => {
                if (i === currentIdx) openModal();
              }}
              onKeyDown={(e) => {
                if (i === currentIdx && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  openModal();
                }
              }}
            />
          ))}

          {/* Gradient shade so counter + caption read against any photo */}
          <div className="yacht-carousel__shade" aria-hidden="true" />

          {/* Counter */}
          <div className="yacht-carousel__counter" aria-live="polite">
            <span className="yacht-carousel__counter-current">
              {String(currentIdx + 1).padStart(2, '0')}
            </span>
            <span className="yacht-carousel__counter-sep"> / </span>
            <span className="yacht-carousel__counter-total">
              {String(count).padStart(2, '0')}
            </span>
          </div>

          {/* Caption / hint */}
          <div className="yacht-carousel__caption">
            {captionText}
          </div>

          {/* Arrows — only when more than 1 photo */}
          {count > 1 && (
            <>
              <button
                type="button"
                className="yacht-carousel__arrow yacht-carousel__arrow--prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous photo"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className="yacht-carousel__arrow yacht-carousel__arrow--next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next photo"
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {count > 1 && (
          <div
            className="yacht-carousel__thumbs"
            role="tablist"
            aria-label="Gallery thumbnails"
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIdx}
                aria-controls={`yacht-carousel-slide-${i}`}
                className={`yacht-carousel__thumb ${i === currentIdx ? 'is-active' : ''}`}
                style={{
                  backgroundImage: `url(${img.url}?w=300&h=200&fit=crop&auto=format)`,
                }}
                onClick={() => jump(i)}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────
          FULLSCREEN LIGHTBOX MODAL
          ─────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="yacht-lightbox"
          onClick={() => setModalOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`${yachtName} photo ${currentIdx + 1} of ${count}`}
        >
          <button
            className="yacht-lightbox__close"
            onClick={() => setModalOpen(false)}
            aria-label="Close fullscreen view"
          >
            ✕
          </button>

          {count > 1 && (
            <button
              className="yacht-lightbox__arrow yacht-lightbox__arrow--prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              <span aria-hidden="true">‹</span>
            </button>
          )}

          <div
            className="yacht-lightbox__stage"
            style={{
              backgroundImage: `url(${current.url}?w=2400&h=1600&fit=max&auto=format)`,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {count > 1 && (
            <button
              className="yacht-lightbox__arrow yacht-lightbox__arrow--next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              <span aria-hidden="true">›</span>
            </button>
          )}

          <div className="yacht-lightbox__counter">
            {String(currentIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </div>
        </div>
      )}
    </>
  );
}
