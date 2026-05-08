'use client';

// 2026-05-08 — Boss flagged a "big black empty section after the
// gallery" on yacht pages. Root cause: every section inside the
// yacht template carries `.reveal`, which css/yacht-page.css starts
// at `opacity: 0` until the observer adds `.visible`. With the prior
// rootMargin of `0px 0px -50px 0px` and threshold 0.1, a section
// that hydrated mid-viewport (e.g. after a back navigation, or
// inside a yacht with very few sections so the gallery sat near
// the fold) sometimes never crossed the trigger zone and stayed
// invisible — reading as a navy hole on the dark page.
//
// Fix: (1) widen the trigger so anything peeking 1% counts, (2) on
// mount, immediately mark every .reveal already in (or above) the
// viewport as .visible — the observer then handles the ones below
// the fold, (3) safety timer marks anything still hidden after 2 s
// as .visible so we never leave a black gap regardless of observer
// state.

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const all = [
      ...document.querySelectorAll('.reveal'),
      ...document.querySelectorAll('.gold-line'),
      ...document.querySelectorAll('.yacht-gallery__item'),
    ];

    // Pass 1 — anything already at or above the fold becomes visible
    // synchronously (no fade-in jank for above-the-fold content).
    const viewportH = window.innerHeight || 0;
    all.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH * 0.95) {
        el.classList.add('visible');
      }
    });

    // Pass 2 — observer for everything else.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 100px 0px' },
    );
    all.forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });

    // Pass 3 — safety net. After 2 s, force-reveal anything still
    // hidden so we never leave a navy gap on the page even if the
    // observer never fires for some element (off-screen tabs,
    // reduced-motion in some browsers, etc.).
    const failsafe = setTimeout(() => {
      all.forEach((el) => el.classList.add('visible'));
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return null;
}
