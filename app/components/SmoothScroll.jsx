"use client";

// Phase 27i.1 (2026-05-07) — Lenis smooth scroll.
//
// Replaces native scroll with interpolated scrolling so the page
// glides instead of snapping. Single GSAP-grade easing curve
// (cubic ease-out via Lenis defaults) — not "exaggerated parallax"
// or per-section sticky-pin flair. Just a continuous, even hand
// on the wheel.
//
// Mounted once at the root of the layout. Respects prefers-reduced-
// motion (Lenis exposes `smoothTouch`/`smoothWheel` options; we
// disable both for users who opted out).
//
// ── 2026-08-22: the comment that used to sit here said "No interference
// with hash-anchor links". That was wrong, and it cost us the single most
// important click on the site.
//
// Lenis keeps its own virtual scroll position and drives the page from a
// requestAnimationFrame loop. When the browser performs a native anchor
// jump, Lenis does not know the page moved, so on its next frame it writes
// its own stale position straight back. Measured on the live site: clicking
// "Plan Your Week" set location.hash to #contact and left window.scrollY at
// 0. The section it should reach starts at 16.492 px. On a phone the same
// fight resolves differently and dumps the visitor somewhere near the end
// of the page, which is exactly what George reported: the form is there,
// but nowhere near where you land, so it reads as broken.
//
// The fix is to stop letting the two argue. Every in-page anchor is now
// handed to Lenis explicitly, and Lenis is the only thing that scrolls.
// Covers all three ways a visitor can arrive at an anchor:
//
//   1. clicking "#contact" on the page they are already on
//   2. clicking "/#contact" from any other page (Next routes, then the
//      hash is present on the new page with no click to intercept)
//   3. opening or sharing a URL that already ends in #contact
//
// ANCHOR_OFFSET leaves the header clear and lands on the section heading
// rather than mid-form. The CSS scroll-margin-top on these sections still
// exists for browsers that never load Lenis (reduced-motion users get
// native smooth scrolling, which honours it).

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Height of the fixed masthead plus a breath of air, so the heading of the
// target section clears the nav instead of hiding behind it.
const ANCHOR_OFFSET = -96;

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return; // honour the OS preference

    const lenis = new Lenis({
      // Base feel — slightly slower than default for "cinema dolly" reading.
      duration: 1.15,
      // Smooth on wheel + touch. iOS native momentum is already silky;
      // skip there to avoid double-handling.
      smoothWheel: true,
      smoothTouch: false,
      // Ease-out (default Lenis curve is fine — no custom easing).
      lerp: 0.08,
    });

    // Anything else that needs to move the page (a future CTA, a drawer
    // closing onto a section) can now reach the same instance instead of
    // calling window.scrollTo and being overwritten a frame later.
    window.__gyLenis = lenis;

    let raf = 0;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /**
     * Scroll to a #hash through Lenis. Returns false if there is no target.
     *
     * Passing the element straight to lenis.scrollTo() does not work on this
     * page: verified on the built site, the call returns without moving,
     * while the same call with a number moves exactly as asked. Lenis reads
     * an element's position through its offset parent, and these sections sit
     * inside positioned, transformed wrappers, so it measures the wrong box.
     * Computing the absolute Y here removes the guesswork.
     */
    const goToHash = (hash, { immediate = false } = {}) => {
      if (!hash || hash === "#") return false;
      let target = null;
      try {
        target = document.querySelector(hash);
      } catch {
        return false; // malformed selector in the URL, leave it alone
      }
      if (!target) return false;

      const y = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET
      );

      lenis.scrollTo(y, { duration: immediate ? 0 : 1.1, immediate });

      // Belt and braces. The animated path runs on requestAnimationFrame,
      // which the browser suspends whenever the tab is not being painted:
      // backgrounded, screen locked, or an app switch on a phone mid-tap.
      // If a moment later nothing has moved, put the visitor where they
      // asked to be rather than leaving them at the top of the page with a
      // #contact in the address bar and no form in sight.
      if (!immediate) {
        const startedAt = window.scrollY;
        window.setTimeout(() => {
          if (Math.abs(window.scrollY - startedAt) < 8 && Math.abs(y - startedAt) > 8) {
            lenis.scrollTo(y, { immediate: true });
          }
        }, 700);
      }
      return true;
    };

    // 1 + 2. Intercept clicks on in-page anchors, including "/#contact"
    // written from another page, which resolves to this page's own path.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target?.closest?.('a[href*="#"]');
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const href = a.getAttribute("href") || "";
      if (!href.includes("#")) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      // Only handle anchors that stay on this exact page.
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash) return;

      if (goToHash(url.hash)) {
        e.preventDefault();
        // Keep the address bar honest without letting the browser jump.
        window.history.pushState(null, "", url.hash);
      }
    };
    document.addEventListener("click", onClick);

    // 3. Landing on a URL that already carries a hash. The element may not
    // exist for a beat while the route paints, so try again briefly rather
    // than firing once into an empty document.
    let tries = 0;
    let settle = 0;
    const settleOnHash = () => {
      if (!window.location.hash) return;
      if (goToHash(window.location.hash, { immediate: tries === 0 })) return;
      if (++tries < 12) settle = window.setTimeout(settleOnHash, 120);
    };
    settle = window.setTimeout(settleOnHash, 60);

    const onHashChange = () => goToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      if (window.__gyLenis === lenis) delete window.__gyLenis;
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
