"use client";

// Custom cursor - 2026-06-29 (George reinstated; chose "ring with words").
//
// A thin gold ring follows the pointer with a touch of lag; a small dot sits at
// the true pointer position. Over any element with a `data-cursor` attribute
// (Menu, View, Discover, WhatsApp, Call, Read...) the ring grows and shows that
// word. Desktop fine-pointer only; on touch / reduced-motion the native cursor
// stays and these nodes are hidden by CSS.
//
// The dot/ring are ALWAYS rendered (so their refs exist when the effect runs);
// CSS keeps them hidden until the effect adds `gy-cursor-on`, which avoids a
// top-left flash before JS positions them.

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot) return;

    const root = document.documentElement;
    root.classList.add("gy-custom-cursor", "gy-cursor-on");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let started = false;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        started = true;
        rx = mx;
        ry = my;
        root.classList.add("gy-cursor-live");
      }
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e) => {
      const t = e.target;
      if (!t || typeof t.closest !== "function") return;
      const el = t.closest("[data-cursor], a, button, [role='button']");
      ring.classList.remove("is-active", "is-link");
      label.textContent = "";
      if (!el) return;
      const word = el.getAttribute && el.getAttribute("data-cursor");
      if (word) {
        label.textContent = word;
        ring.classList.add("is-active");
      } else {
        ring.classList.add("is-link");
      }
    };
    const onLeaveWindow = () => root.classList.remove("gy-cursor-live");
    const onEnterWindow = () => { if (started) root.classList.add("gy-cursor-live"); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      root.classList.remove("gy-custom-cursor", "gy-cursor-on", "gy-cursor-live");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="gy-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="gy-cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="gy-cursor-label" />
      </div>
    </>
  );
}
