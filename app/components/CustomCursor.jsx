"use client";

// The cursor. It is The Bearing, the house seal from the brand book, and it
// is built for speed before it is built for anything else.
//
// ── Four attempts, and what each one cost ──────────────────────────────
//
// 1. A gold ring chasing the pointer on a critically damped spring, with five
//    wake points trailing it. George: no water, no dots in a circle, slow.
//    The slowness was structural: a spring cannot lead the thing driving it.
// 2. A stand-in logo file that turned out to be four placeholder curves.
//    "Cartoon and cheap", and he was right.
// 3. The real logo artwork. Recognisable, but a 5.38:1 ribbon has to be 46px
//    wide to survive, and at that size it is a large object being dragged
//    across the page with a two-layer drop shadow repainting behind it.
// 4. A plain ring. Fast and correct, and it said nothing.
//
// This one is the seal itself: the azimuth ring with the needle holding 037,
// the latitude of Syros. It carries the meaning of attempt 3 at the weight of
// attempt 4.
//
// ── What makes it fast, specifically ────────────────────────────────────
//
// There is no requestAnimationFrame loop. Nothing animates on its own, so
// when the mouse is still the cursor costs exactly zero. The only work per
// pointer event is one transform write.
//
// There is no image. The seal is inline SVG: nothing to fetch, decode or lay
// out, and the compositor rasterises it once into the layer.
//
// It is six shapes, not fifty. The graduations are one stroked circle with a
// dash pattern rather than twenty-four separate lines, so the whole seal is
// four circles and two polygons. The book's seventy-two graduations would
// collide at 1.02px apart at this size; twenty-four sit 3.06px apart and
// stay legible, which is why the cursor is drawn at twenty-four.
//
// There is no filter. drop-shadow on a moving element repaints it every
// frame, which was the real cost of the logo version. Legibility over both
// the navy and the ivory sections comes from a dark stroke drawn underneath
// the gold one, inside the SVG, painted once and carried along.
//
// Size, 2026-08-21: George asked for it larger, matched to the seal in the
// book, without it becoming huge. 34px is where that lands and it is not an
// arbitrary number: the system arrow is 21px, and 21 x phi = 34. They are
// consecutive Fibonacci numbers, which is the whole of the golden section
// argument. At 34 the twenty-four graduations sit 3.5px apart, comfortably
// legible, where at 26 they were 2.7px and closing up.
//
// The artwork is drawn at 44px and scaled DOWN to 34 at rest, so the hover
// state scales up into a raster that already exists at that size instead of
// re-rasterising a magnified one. Sharp at both sizes, no reflow either way.
//
// Position is written straight from the event with no interpolation, so the
// seal is on the pointer rather than behind it. That was the whole complaint
// about the first version and it is the one thing that must never come back.
//
// Kept: the seventy-four data-cursor words. Desktop fine-pointer only; touch
// and prefers-reduced-motion keep the native cursor untouched.

import { useEffect, useRef } from "react";

/* Geometry, computed once at module scope so it never runs per render.

   The graduations are a dash pattern on a circle rather than twenty-four
   separate lines. Its radius puts the outer end of each mark exactly on the
   inner edge of the ring, so the graduations meet it the way they do in the
   book. A quarter turn is always a whole number of periods when there are
   twenty-four of them, so a mark lands on north without nudging; the offset
   is half a dash, to centre that mark on the meridian rather than start it
   there. */
const TICK_R = 39.3;
const CARD_R = TICK_R - 2.4;

/* Each dash pattern must be measured on the circle it is applied to. The
   cardinals sit on a smaller radius than the minor graduations, so they need
   their own circumference: computing both from TICK_CIRC put 3.756 marks on
   the cardinal ring instead of 4, which walked north off the meridian and
   left the last mark clipped. */
const dashes = (r, count, dash) =>
  `${dash} ${(2 * Math.PI * r) / count - dash}`;

const MINOR_DASH = 1.15;
const MINOR = dashes(TICK_R, 24, MINOR_DASH);
const CARD_DASH = 1.9;
const CARD = dashes(CARD_R, 4, CARD_DASH);

export default function CustomCursor() {
  const wrapRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.location.pathname.startsWith("/cursor-lab")) return;

    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    const wrap = wrapRef.current;
    const label = labelRef.current;
    if (!wrap) return;

    const root = document.documentElement;
    root.classList.add("gy-custom-cursor", "gy-cursor-on");

    let started = false;

    const onMove = (e) => {
      // One write. No loop, no easing, no second element to keep in step.
      wrap.style.transform =
        "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0)";
      if (!started) {
        started = true;
        root.classList.add("gy-cursor-live");
      }
    };

    const onOver = (e) => {
      const t = e.target;
      if (!t || typeof t.closest !== "function") return;
      const el = t.closest("[data-cursor], a, button, [role='button']");
      wrap.classList.remove("is-word", "is-link");
      if (label) label.textContent = "";
      if (!el) return;
      const word = el.getAttribute && el.getAttribute("data-cursor");
      if (word) {
        if (label) label.textContent = word;
        wrap.classList.add("is-word");
      } else {
        wrap.classList.add("is-link");
      }
    };

    const onLeaveWindow = () => root.classList.remove("gy-cursor-live");
    const onEnterWindow = () => { if (started) root.classList.add("gy-cursor-live"); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      root.classList.remove("gy-custom-cursor", "gy-cursor-on", "gy-cursor-live");
    };
  }, []);

  return (
    <div ref={wrapRef} className="gy-mark-cursor" aria-hidden="true">
      <svg
        className="gy-mark-cursor__seal"
        viewBox="0 0 100 100"
        width="44"
        height="44"
        focusable="false"
      >
        <defs>
          {/* The Ghost ramp, stop for stop. A flat hex reads as mustard no
              matter which hex it is; what makes pixels read as METAL is the
              dark-bright-dark band running across the shape. It is static, so
              the shine costs nothing: the gradient is rasterised into the
              layer once and travels with it. No animation on a cursor, ever. */}
          <linearGradient id="gyBearingLeaf" x1="0.08" y1="0" x2="0.92" y2="1">
            <stop offset="0" stopColor="#7A5C04" />
            <stop offset="0.22" stopColor="#B58A0A" />
            <stop offset="0.46" stopColor="#F7DE8A" />
            <stop offset="0.60" stopColor="#DAA110" />
            <stop offset="0.80" stopColor="#A87E00" />
            <stop offset="1" stopColor="#7A5C04" />
          </linearGradient>
          {/* The needle takes the light from the opposite side, so the two
              never flatten into each other. */}
          <linearGradient id="gyBearingNeedle" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#F7DE8A" />
            <stop offset="0.5" stopColor="#DAA110" />
            <stop offset="1" stopColor="#8A6704" />
          </linearGradient>
        </defs>

        {/* Everything dark, underneath: the silhouette that holds the seal
            together over ivory sections, where gold alone measures 2.01:1. */}
        <g fill="none" stroke="rgba(7,15,24,.58)">
          <circle cx="50" cy="50" r="44" strokeWidth="4.7" />
          <circle
            cx="50" cy="50" r={TICK_R} strokeWidth="7.9"
            strokeDasharray={MINOR} strokeDashoffset={-MINOR_DASH / 2}
          />
        </g>
        <g transform="rotate(37 50 50)" fill="rgba(7,15,24,.42)">
          <polygon points="50,11 52.9,48 50,54 47.1,48" />
          <polygon points="50,84 51.7,52 50,46 48.3,52" />
        </g>

        {/* The seal itself, struck in leaf rather than filled with a colour. */}
        <g fill="none" stroke="url(#gyBearingLeaf)">
          <circle cx="50" cy="50" r="44" strokeWidth="3.2" />
          <circle
            cx="50" cy="50" r={TICK_R} strokeWidth="6.2"
            strokeDasharray={MINOR} strokeDashoffset={-MINOR_DASH / 2}
            opacity="0.72"
          />
          {/* North, east, south and west, cut longer, the way an azimuth ring
              marks the cardinals. */}
          <circle
            cx="50" cy="50" r={CARD_R} strokeWidth="11.0"
            strokeDasharray={CARD} strokeDashoffset={-CARD_DASH / 2}
          />
        </g>

        <g transform="rotate(37 50 50)">
          <polygon points="50,84 51.7,52 50,46 48.3,52" fill="#A87E00" opacity="0.72" />
          <polygon points="50,11 52.9,48 50,54 47.1,48" fill="url(#gyBearingNeedle)" />
        </g>

        <circle cx="50" cy="50" r="3.2" fill="rgba(7,15,24,.55)" />
        <circle cx="50" cy="50" r="2.0" fill="#F7DE8A" />
      </svg>
      <span ref={labelRef} className="gy-mark-cursor__label" />
    </div>
  );
}
