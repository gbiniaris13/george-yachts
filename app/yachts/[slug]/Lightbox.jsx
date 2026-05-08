'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Lightbox({ images, yachtName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Chapter 03 (2026-05-08) — touch-swipe nav for mobile users.
  // Track the start X of each touch; on touchend, if the horizontal
  // delta exceeds 60 px, advance / retreat by one image. Vertical
  // pulls fall through to the browser (so users can still close
  // the lightbox by swiping down past the trackable area, although
  // a tap on the backdrop already does that).
  const touchStartX = useRef(null);
  const SWIPE_THRESHOLD = 60;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, images.length]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    try {
      // N.1 — yacht_gallery_opened
      window.gtag?.("event", "yacht_gallery_opened", { yacht: yachtName, image_index: index });
    } catch {}
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="yacht-gallery__grid">
        {images.map((image, index) => (
          <div
            key={index}
            className="yacht-gallery__item cursor-pointer group relative overflow-hidden"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt || `${yachtName} — charter yacht in Greece, image ${index + 2}`}
              width={600}
              height={400}
              className="yacht-gallery__image transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-xs tracking-[0.3em] uppercase transition-opacity duration-300">
                View larger
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-4xl z-10 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
            aria-label="Close gallery"
          >
            ✕
          </button>

          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-6xl z-10 transition-colors duration-300"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="relative w-[90vw] h-[80vh] max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `${yachtName} — charter yacht in Greece, image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-6xl z-10 transition-colors duration-300"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-[0.3em] uppercase">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
