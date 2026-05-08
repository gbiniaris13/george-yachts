"use client";

// Phase 27i (2026-05-07) — Boss feedback: previous cursor (CustomCursor
// with 5-particle liquid-gold trail) felt laggy. Trail particles + per-
// frame React state updates were causing renders during mouse-move,
// stuttering on lower-end hardware.
//
// New cursor — minimal DOM (one dot + one ring), pure transforms,
// zero React state mutations during movement. Hover/text/label state
// changes are pushed to the DOM via direct class toggles instead of
// React setState, so a fast user motion never queues a render.
//
// States (toggled by data attribute on the ring element):
//   default        — small ivory dot + thin gold ring (60% opacity)
//   interactive    — ring expands and fills with a gold radial gradient
//   text           — ring collapses to a vertical I-beam line
//   labelled       — adds a small gold label to the right of the ring
//                    (uses data-cursor attribute on the hovered element)
//
// Visual signature: polished platinum + champagne gold, the same Aman
// / Belmond / Bulgari restraint the homepage hero now reads at.

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if ("ontouchstart" in window) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    document.documentElement.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;
    let isVisible = true;

    // Pre-detect text-input vs interactive selectors. Cheaper than
    // re-querying on every move event.
    const TEXT_SEL = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";
    const INTER_SEL = "a, button, [role='button'], [data-cursor], select, label[for], summary";

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot tracks 1:1 with no lag.
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const animate = () => {
      // Ring lerps behind by 22% — fast enough to feel responsive,
      // slow enough to read as a soft companion. Single trailing
      // element (vs 5 in the old impl) keeps the GPU happy.
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      const target = e.target?.closest?.(`${INTER_SEL}, ${TEXT_SEL}`);
      if (!target) return;

      const isText = target.matches(TEXT_SEL);
      const labelText = target.getAttribute("data-cursor") || "";

      if (isText) {
        ring.dataset.state = "text";
      } else if (labelText) {
        ring.dataset.state = "labelled";
        label.textContent = labelText;
      } else {
        ring.dataset.state = "interactive";
      }
    };

    const onLeave = (e) => {
      const target = e.target?.closest?.(`${INTER_SEL}, ${TEXT_SEL}`);
      if (!target) return;
      ring.dataset.state = "default";
      label.textContent = "";
    };

    const onMouseLeaveDocument = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onMouseEnterDocument = () => {
      isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter, true);
    document.addEventListener("mouseout", onLeave, true);
    document.documentElement.addEventListener("mouseleave", onMouseLeaveDocument);
    document.documentElement.addEventListener("mouseenter", onMouseEnterDocument);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter, true);
      document.removeEventListener("mouseout", onLeave, true);
      document.documentElement.removeEventListener("mouseleave", onMouseLeaveDocument);
      document.documentElement.removeEventListener("mouseenter", onMouseEnterDocument);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
      styleEl.remove();
    };
  }, []);

  return (
    <>
      {/* Crisp central dot — tracks the pointer 1:1, no lag. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#F5EFE1",
          boxShadow:
            "0 0 0.5px rgba(0,0,0,0.6), 0 0 6px rgba(201,168,76,0.55)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "opacity 200ms ease",
        }}
      />

      {/* Ring — soft companion, follows with 22% lerp. State switches
          via data attribute so the CSS in globals.css handles the
          look without any React re-render. */}
      <div
        ref={ringRef}
        data-state="default"
        aria-hidden="true"
        className="gy-luxe-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      >
        <span ref={labelRef} className="gy-luxe-cursor-label" />
      </div>
    </>
  );
}
