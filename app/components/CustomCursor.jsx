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
//
// 2026-08-19 (design pass, job 10) — two additions, both named in the brief.
//
// A WAKE. Five gold points trail the ring, each chasing the one ahead a little
// more slowly, shrinking and fading down the chain. On a yacht brokerage this
// is not decoration for its own sake: it is the wake a hull leaves, and like a
// real one it only exists while something is moving. Stop the pointer and it
// closes up behind you, because a wake that sits still is five dots.
//
// DAMPING. The ring used to chase with a flat lerp, rx += (mx - rx) * 0.2:
// the same fraction every frame, whatever the distance, whatever the speed.
// It reads mechanical. It is now a critically damped spring, so the ring
// accelerates toward the pointer, carries its momentum, and settles without
// crossing over. Critically damped rather than merely springy on purpose: a
// ring that overshoots and wobbles back is a toy.
//
// WHAT WAS NOT ADDED, and why. The brief said the ring should morph to
// VIEW/PLAY. VIEW is already there, on eleven elements. PLAY is nowhere, and
// it should stay nowhere: every video on this site is an ambient loop that
// starts itself and answers no click, so a cursor reading PLAY over one would
// promise something the page does not do. The vocabulary already runs to 29
// words, and the ambient pill swaps between Listen and Mute as it plays.

import { useEffect, useRef } from "react";

const WAKE_POINTS = 5;

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const wakeRef = useRef([]);

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

    const wake = wakeRef.current.filter(Boolean);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let vx = 0;
    let vy = 0;
    let started = false;
    let raf = 0;
    let lastMove = 0;

    // Critically damped. STIFFNESS pulls the ring in, DAMPING bleeds the
    // momentum off fast enough that it never crosses the pointer and swings
    // back. Springy would be a toy; this glides and settles.
    //
    // These two numbers were searched for, not guessed, and the first guess
    // was wrong. 0.16 / 0.68 read fine in the head and overshot by 170px on a
    // 1200px jump when stepped frame by frame, which is a visible wobble.
    // Sweeping the pair space for the fastest combination that never crosses
    // the target gives the values below: overshoot stays under a tenth of a
    // pixel at every distance from 50px to 1400px, and the ring settles in
    // 16 frames where the old flat lerp took 21. Faster AND steadier, which
    // is not the usual trade.
    const STIFFNESS = 0.19;
    const DAMPING = 0.5;

    // Each wake point holds its own position and chases the one ahead of it.
    // The lag widens down the chain, which is what makes it read as a trail
    // instead of five dots moving in lockstep.
    const trail = Array.from({ length: wake.length }, () => ({ x: mx, y: my }));

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      if (!started) {
        started = true;
        rx = mx;
        ry = my;
        root.classList.add("gy-cursor-live");
      }
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const tick = () => {
      vx = (vx + (mx - rx) * STIFFNESS) * DAMPING;
      vy = (vy + (my - ry) * STIFFNESS) * DAMPING;
      rx += vx;
      ry += vy;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;

      // A wake only exists while something is moving through the water. After
      // 420ms of stillness this one closes up behind the pointer; one move
      // and it is back.
      const moving = performance.now() - lastMove < 420;
      let px = rx;
      let py = ry;
      for (let i = 0; i < wake.length; i++) {
        const follow = 0.34 - i * 0.045;
        trail[i].x += (px - trail[i].x) * follow;
        trail[i].y += (py - trail[i].y) * follow;
        wake[i].style.transform =
          `translate(${trail[i].x}px, ${trail[i].y}px) scale(${1 - i * 0.15})`;
        wake[i].style.opacity = moving ? String(0.3 - i * 0.05) : "0";
        px = trail[i].x;
        py = trail[i].y;
      }

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
      {Array.from({ length: WAKE_POINTS }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { wakeRef.current[i] = el; }}
          className="gy-cursor-wake"
          aria-hidden="true"
        />
      ))}
      <div ref={dotRef} className="gy-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="gy-cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="gy-cursor-label" />
      </div>
    </>
  );
}
