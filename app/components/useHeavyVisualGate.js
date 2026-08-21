"use client";

// 2026-08-19 (design pass, job 6) — decides whether a decorative 3D layer is
// worth downloading at all, BEFORE the module is fetched.
//
// The three WebGL layers on this site, GoldEmbers3D, StarField3D and
// WaterShaderHorizon, each already carried an internal gate: they check
// innerWidth and pointer: coarse, return early on phones, and drive their
// frameloop from an IntersectionObserver. That gating is correct and stays.
//
// It just happens too late. All three are pulled in with
// dynamic(() => import(...)), and dynamic() fetches the moment the component
// is RENDERED, not when it decides to draw. So the module has to arrive,
// parse and run before it can conclude it should do nothing. Measured on a
// cold homepage on 19/8: 506 KB of JavaScript, of which 184 KB is three.js
// arriving at 204 ms, right through the paint window, and on a phone every
// byte of it is spent to reach an early return.
//
// This hook moves the same decision one step earlier, to the call site:
//
//   const [ref, show] = useHeavyVisualGate();
//   <div ref={ref}>{show && <GoldEmbers3D />}</div>
//
// Nothing is removed and nothing changes on the machines that see these
// effects. A desktop visitor with a mouse still gets embers, stars and water,
// simply fetched when the section is one screen away instead of during the
// first paint. A phone never fetches them, which is what the components
// themselves already wanted.
//
// The 600 px margin matches useNearViewport's default, which is the value the
// ambient videos have used since the SD-3 pass and the one George has
// approved by seeing it work.

import { useEffect, useRef, useState } from "react";

export default function useHeavyVisualGate(rootMargin = "600px") {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    if (typeof window === "undefined") return;

    // Same two conditions the components apply to themselves. Kept in step
    // with them on purpose: if one of them ever changes its mind about which
    // devices deserve the effect, this is the second place to edit.
    if (window.innerWidth < 1024) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    // Someone who asked their operating system for less motion should not be
    // made to download a particle system either.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    // The observer is the fast path, not the only path.
    //
    // While verifying this on 19/8 the callback never fired, not for the
    // hook's observer and not for a fresh one built by hand in the console
    // on the same element, on a page where the band sat 172 px below a
    // 900 px viewport with a 600 px margin. It was the test browser, which
    // was not compositing frames, and the same environment had already
    // swallowed focusin for the same reason. But an effect that only ever
    // appears if one browser API behaves is a worse deal than the bytes it
    // saves, and this is decoration George chose deliberately.
    //
    // So: whichever comes first. The observer when the band approaches, or
    // an idle moment after the page has finished loading. Either way the
    // three.js chunk is off the paint path, which was the whole point, and
    // either way a desktop visitor gets the effect.
    let done = false;
    const fire = () => { if (!done) { done = true; setShow(true); } };

    let obs = null;
    if (typeof IntersectionObserver !== "undefined") {
      obs = new IntersectionObserver(
        (entries) => { if (entries.some((e) => e.isIntersecting)) fire(); },
        { rootMargin },
      );
      obs.observe(el);
    }

    let idle = null;
    let timer = null;
    // The delay before the fallback arms is deliberate and was measured.
    //
    // A first version armed on load and asked for the next idle callback.
    // On localhost that fired at 185 ms, because a page that loads in 150 ms
    // is idle immediately, and three.js landed in the paint window exactly
    // where it had been before. Idle is relative to how fast the page was,
    // and the pages that need this most are the slow ones.
    //
    // A full second past load is past first paint on any connection, and it
    // is still well inside the time a visitor spends reading the hero before
    // the band is anywhere near them.
    const armFallback = () => {
      timer = setTimeout(() => {
        if (typeof requestIdleCallback === "function") {
          idle = requestIdleCallback(fire, { timeout: 3000 });
        } else {
          fire();
        }
      }, 1000);
    };
    if (document.readyState === "complete") armFallback();
    else window.addEventListener("load", armFallback, { once: true });

    return () => {
      if (obs) obs.disconnect();
      if (idle && typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
      window.removeEventListener("load", armFallback);
    };
  }, [show, rootMargin]);

  return [ref, show];
}
