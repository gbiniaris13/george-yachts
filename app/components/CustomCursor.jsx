"use client";

// 2026-05-08 (Boss directive — dual cursor) — full rewrite.
//
// Replaces the previous Phase 27i cursor (44 px ring + 6 px ivory dot,
// 0.22 lerp, ring expanded with a champagne radial gradient on hover,
// label floated to the right of the ring on labelled state). Boss
// reference set: Bottega Veneta, Loewe, Six Senses, Aman.
//
// Spec:
//   • Dot — 6 px gold #C9A84C, border-radius 50 %, no border, no
//     shadow, tracks the pointer with zero delay.
//   • Ring — 32 px, border 1 px solid rgba(201,168,76,0.5),
//     transparent fill, lerp factor 0.12 (slower trail than before
//     so the lag is felt as smoothness, not as drag).
//
// States:
//   default      — dot + 32 px ring
//   interactive  — over <a>/<button>/[data-cursor] without an image:
//                  dot fades to opacity 0; ring grows to 48 px with
//                  border rgba(201,168,76,0.9).
//   text         — over <input>/<textarea>: ring collapses to a
//                  vertical I-beam line.
//   magnetic     — over hero video or yacht card images
//                  ([data-cursor-magnetic]): ring grows to 64 px and
//                  displays "VIEW" centred inside it (Montserrat 9 px
//                  ALL CAPS, letter-spacing 0.15em, gold).
//   labelled     — over [data-cursor="…"] with a custom label:
//                  same as magnetic geometry but with the
//                  data-cursor value as the inside text.
//
// requestAnimationFrame drives both layers; React state is never
// mutated during movement so a fast user motion never queues a render.

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Mobile + tablet — Boss spec: disable entirely. Touch devices
    // have no cursor concept, the custom cursor adds nothing.
    if (!window.matchMedia?.("(pointer: fine)").matches) return;

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

    // Selector targets — order of precedence: text inputs, then
    // magnetic surfaces, then everything else interactive. Magnetic
    // wins over labelled when both apply (a Link wrapping a card
    // image gets the magnetic VIEW affordance, not a small label).
    const TEXT_SEL =
      "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";
    const MAGNETIC_SEL =
      "[data-cursor-magnetic], .gy-magnetic, video.gy-magnetic, img.gy-magnetic";
    const INTER_SEL =
      "a, button, [role='button'], [data-cursor], select, label[for], summary";

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot tracks instantly per Boss spec.
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!isVisible) {
        isVisible = true;
        ring.style.opacity = "1";
        if (ring.dataset.state === "default" || ring.dataset.state === "text") {
          dot.style.opacity = "1";
        }
      }
    };

    const animate = () => {
      // Ring lerps behind by 12 % per Boss spec — slow enough that
      // the lag is felt as a smooth trailing companion, not a drag.
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    const setState = (state, labelText = "") => {
      ring.dataset.state = state;
      label.textContent = labelText;
      // Per Boss spec: the dot vanishes on every interactive state
      // (interactive / magnetic / labelled). It returns on default
      // and text (text-input I-beam needs the dot for the click
      // anchor).
      if (state === "default" || state === "text") {
        dot.style.opacity = "1";
      } else {
        dot.style.opacity = "0";
      }
    };

    const onEnter = (e) => {
      const node = e.target;
      if (!node || typeof node.closest !== "function") return;

      const text = node.closest(TEXT_SEL);
      if (text) {
        setState("text");
        return;
      }

      const magnet = node.closest(MAGNETIC_SEL);
      if (magnet) {
        const customLabel = magnet.getAttribute("data-cursor-magnetic");
        setState(
          "magnetic",
          customLabel && customLabel !== "true" ? customLabel : "VIEW",
        );
        return;
      }

      const interactive = node.closest(INTER_SEL);
      if (interactive) {
        const labelText = interactive.getAttribute("data-cursor") || "";
        setState(labelText ? "labelled" : "interactive", labelText);
        return;
      }
    };

    const onLeave = (e) => {
      const node = e.target;
      if (!node || typeof node.closest !== "function") return;
      const left = node.closest(`${MAGNETIC_SEL}, ${INTER_SEL}, ${TEXT_SEL}`);
      if (!left) return;
      // Only reset when leaving an interactive / magnetic element.
      // The relatedTarget check would be cleaner but mouseout fires
      // for every nested element transition; the next mouseover will
      // re-set the state immediately if we're still inside one.
      setState("default");
    };

    const onMouseLeaveDocument = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onMouseEnterDocument = () => {
      isVisible = true;
      ring.style.opacity = "1";
      if (ring.dataset.state === "default" || ring.dataset.state === "text") {
        dot.style.opacity = "1";
      }
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
      {/* Dot — 6 px gold, instant tracking. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="gy-luxe-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#C9A84C",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform, opacity",
          transition: "opacity 200ms ease",
        }}
      />

      {/* Ring — 32 px default, lerps to dot. State styling lives in
          globals.css so the React layer never re-renders on state
          change. */}
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
