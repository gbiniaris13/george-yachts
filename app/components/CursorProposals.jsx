"use client";

// Cursor proposals, second round. Section 8.
//
// ── What went wrong the first time ──────────────────────────────────────
//
// I used public/images/logo-icon-only.svg, which is four hand-drawn curves
// somebody made as a stand-in. It is not George's logo. His verdict was
// "cartoon and cheap" and he was right; worse, he pointed out I could have
// read the real mark straight off the masthead, which is exactly where it is.
//
// The real mark is public/images/gy-logo-real.svg, a raster inside an SVG and
// byte-identical to the file he sent. It is a motor yacht in profile drawn as
// gold and chrome ribbons, with real gradients and specular highlights.
//
// ── What the artwork actually allows ────────────────────────────────────
//
// The yacht mark measures 473 x 88, an aspect ratio of 5.38 to 1. At a normal
// 30px cursor that is 30 x 6 pixels. That is not a matter of taste, it is
// arithmetic: a five-to-one ribbon cannot carry gold, chrome, a hull and a bow
// inside six pixels of height. Any version of "the whole yacht as the cursor"
// arrives as a smear, which is the other way to produce what he called cheap.
//
// So the geometry below was measured off the artwork rather than drawn from
// memory. The leading gold ribbon was traced column by column, top edge and
// bottom edge, and rebuilt as a vector path: one pixel thick at the stern,
// swelling to thirty-seven in the middle, back to one at the bow. That taper
// is the gesture the whole logo is built on, and unlike the full mark it stays
// crisp at any size because it is one stroke rather than a composition.

import { useEffect, useRef } from "react";

const SHEER_PATH =
  "M 0.42 22.99 C 1.80 22.88, 5.92 22.78, 8.67 22.36 C 11.42 21.94, 14.16 21.28, 16.91 20.47 C 19.66 19.65, 22.41 18.60, 25.16 17.46 C 27.91 16.31, 30.66 14.97, 33.40 13.60 C 36.15 12.22, 38.90 10.64, 41.65 9.21 C 44.40 7.79, 47.15 6.24, 49.89 5.04 C 52.64 3.85, 55.36 2.72, 58.14 2.03 C 60.92 1.33, 65.19 1.07, 66.60 0.88 L 66.60 0.88 C 65.19 1.22, 60.92 1.92, 58.14 2.89 C 55.36 3.85, 52.64 5.25, 49.89 6.68 C 47.15 8.11, 44.40 9.87, 41.65 11.45 C 38.90 13.03, 36.15 14.73, 33.40 16.16 C 30.66 17.58, 27.91 18.93, 25.16 20.00 C 22.41 21.08, 19.66 21.99, 16.91 22.61 C 14.16 23.22, 11.42 23.63, 8.67 23.69 C 5.92 23.76, 1.80 23.11, 0.42 22.99 Z";

function useFine() {
  const ok = useRef(false);
  useEffect(() => {
    ok.current =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return ok;
}

/** Shared behaviour: sit on the point, heel into the direction of travel,
 *  right yourself when still, carry the data-cursor word. Nothing trails. */
function useCursor(wrapRef, markRef, labelRef, heelLimit) {
  const fine = useFine();
  useEffect(() => {
    if (!fine.current || !wrapRef.current) return;
    const wrap = wrapRef.current;
    const mark = markRef.current;
    const label = labelRef.current;
    const root = document.documentElement;
    root.classList.add("gy-custom-cursor", "gy-cursor-on");

    let heel = 0, target = 0, lastX = 0, ready = false, started = false, raf = 0;

    const onMove = (e) => {
      if (ready) {
        const dx = e.clientX - lastX;
        target = Math.max(-heelLimit, Math.min(heelLimit, dx * 0.7));
      }
      lastX = e.clientX;
      ready = true;
      wrap.style.transform =
        "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0)";
      if (!started) {
        started = true;
        root.classList.add("gy-cursor-live");
      }
    };

    const tick = () => {
      target *= 0.86;
      heel += (target - heel) * 0.18;
      if (mark) mark.style.transform = "rotate(" + heel.toFixed(2) + "deg)";
      raf = requestAnimationFrame(tick);
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

    const off = () => root.classList.remove("gy-cursor-live");
    const on = () => { if (started) root.classList.add("gy-cursor-live"); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", off);
    document.addEventListener("mouseenter", on);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", off);
      document.removeEventListener("mouseenter", on);
      root.classList.remove("gy-custom-cursor", "gy-cursor-on", "gy-cursor-live");
    };
  }, [fine, wrapRef, markRef, labelRef, heelLimit]);
}

/**
 * A · Η ΚΑΜΠΥΛΗ, the sheer.
 *
 * The leading gold ribbon of the mark, traced off the artwork and rebuilt as
 * one tapering stroke in the metal ramp from section 7. It is the gesture the
 * logo is built on and the only part of it that survives thirty pixels.
 */
export function CursorSheer() {
  const wrap = useRef(null), mark = useRef(null), label = useRef(null);
  useCursor(wrap, mark, label, 12);
  return (
    <div ref={wrap} className="gy-cur2 gy-cur2--sheer" aria-hidden="true">
      <span ref={mark} className="gy-cur2__mark">
        <svg width="34" height="9" viewBox="0 0 100 26">
          <defs>
            <linearGradient id="gySheer" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#7A5C04" />
              <stop offset="26%" stopColor="#B58A0A" />
              <stop offset="52%" stopColor="#F7DE8A" />
              <stop offset="72%" stopColor="#DAA110" />
              <stop offset="100%" stopColor="#A87E00" />
            </linearGradient>
          </defs>
          <path d={SHEER_PATH} fill="url(#gySheer)" />
        </svg>
      </span>
      <span ref={label} className="gy-cur2__label" />
    </div>
  );
}

/**
 * B · ΤΟ ΣΚΑΦΟΣ, the mark itself.
 *
 * The real artwork, not a redraw, at forty-two pixels: wider than a cursor
 * usually is, because below that the chrome collapses into grey. This is the
 * thing George asked to try, shown at the only size where it has a chance.
 */
export function CursorYacht() {
  const wrap = useRef(null), mark = useRef(null), label = useRef(null);
  useCursor(wrap, mark, label, 10);
  return (
    <div ref={wrap} className="gy-cur2 gy-cur2--yacht" aria-hidden="true">
      <span ref={mark} className="gy-cur2__mark">
        <img src="/images/cursor-yacht.png" width="42" height="8" alt="" draggable="false" />
      </span>
      <span ref={label} className="gy-cur2__label" />
    </div>
  );
}

/**
 * C · Η ΠΛΩΡΗ, the bow.
 *
 * The fragment where the gold ribbons converge to a point, cropped from the
 * artwork. The argument for it is functional rather than decorative: a cursor
 * exists to point, and this mark already ends in a point.
 */
export function CursorBow() {
  const wrap = useRef(null), mark = useRef(null), label = useRef(null);
  useCursor(wrap, mark, label, 14);
  return (
    <div ref={wrap} className="gy-cur2 gy-cur2--bow" aria-hidden="true">
      <span ref={mark} className="gy-cur2__mark">
        <img src="/images/cursor-bow.png" width="30" height="11" alt="" draggable="false" />
      </span>
      <span ref={label} className="gy-cur2__label" />
    </div>
  );
}

export default function CursorProposals({ variant }) {
  if (variant === "sheer") return <CursorSheer />;
  if (variant === "yacht") return <CursorYacht />;
  if (variant === "bow") return <CursorBow />;
  return null;
}
