"use client";

// 2026-09-17, George: "όταν κάνει back δεν θέλω να τον πηγαίνει στη hero
// page πάνω, θέλω να τον πηγαίνει εκεί που ήταν".
//
// What went wrong. Position on back is normally the browser's job. Here the
// page is scrolled by Lenis (SmoothScroll.jsx), which keeps its own copy of
// the position and is rebuilt on every route change, and the App Router
// repaints the page on the way back. Three parties write the scroll position
// within the same few frames, and whichever writes last wins. In Chromium
// the browser's restore lands last and the visitor returns where they were.
// In Safari the restore can land before the page has its height back, or
// before the new Lenis instance exists, and the visitor lands at the top of
// the hero. That is the "back takes me to the start" George sees on his Mac.
//
// The fix is to stop relying on the race. This component records where the
// visitor is on every page, per URL, in sessionStorage, and on a back or
// forward navigation it drives the page to that position itself, through
// Lenis when Lenis is there, retrying until the page is tall enough to hold
// it. The browser's own restoration is switched off so it cannot fight.
//
// Forward navigations are untouched: a new page still opens at the top.
// A URL with a #hash is left to SmoothScroll, which already handles anchors.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY = "gy-scroll-memory:";
const SETTLE_MS = 2200;

function keyFor() {
  return KEY + window.location.pathname + window.location.search;
}

function readY() {
  try {
    const v = sessionStorage.getItem(keyFor());
    const n = v == null ? NaN : Number(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function jumpTo(y) {
  const lenis = window.__gyLenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(y, { immediate: true, force: true });
  }
  window.scrollTo(0, y);
}

export default function ScrollMemory() {
  const pathname = usePathname();
  const popped = useRef(false);
  const first = useRef(true);

  // 1. The browser stands down; this component owns restoration.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    } catch {}
  }, []);

  // 2. Remember the position for the page the visitor is on: while they
  //    scroll, at the instant they click a link (the last honest reading,
  //    since the router may already have moved the page to the top by the
  //    time this effect is torn down), and when the tab is left.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = keyFor();
    const save = () => {
      // Measured in WebKit: the router moves the new page to the top and the
      // scroll event reaches this listener before React has torn it down,
      // with the address bar already on the new page. Without this check the
      // page just left is recorded at 0, which is exactly the "back takes me
      // to the top" George reported.
      if (keyFor() !== key) return;
      try {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      } catch {
        // private mode or quota: the visitor simply gets the top on back
      }
    };
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        save();
      });
    };
    const onClick = (e) => {
      if (e.target?.closest?.("a[href]")) save();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", save);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", save);
    };
  }, [pathname]);

  // 3. Know when a route change came from back or forward.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 4. After the route has painted, put the visitor back where they were.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return; // SmoothScroll owns anchors

    let restore = false;
    if (first.current) {
      first.current = false;
      // A reload, or a back/forward that reloaded the document (Safari
      // does this when the page fell out of its cache).
      const nav = performance.getEntriesByType?.("navigation")?.[0];
      restore = nav?.type === "back_forward" || nav?.type === "reload";
    } else if (popped.current) {
      restore = true;
    }
    popped.current = false;
    if (!restore) return;

    const y = readY();
    if (!y) return;

    // The page below the fold is still laying out, images are still
    // arriving, Lenis may be a frame from existing. Keep asking until the
    // document is tall enough and the position holds, then stop.
    const started = performance.now();
    let timer = 0;
    const attempt = () => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.min(y, maxY);
      if (target > 0) jumpTo(target);
      const holding = Math.abs(window.scrollY - target) < 2 && maxY >= y - 2;
      if (!holding && performance.now() - started < SETTLE_MS) {
        timer = window.setTimeout(attempt, 80);
      }
    };
    timer = window.setTimeout(attempt, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
