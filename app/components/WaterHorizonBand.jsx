"use client";

// 2026-08-19 (design pass, job 6) — a light wrapper so the water horizon can
// keep its mobile appearance without every phone downloading three.js first.
//
// WaterShaderHorizon is untouched and still does exactly what it did. The
// problem was never that component; it was where it sat. HomeClient pulled it
// in with dynamic(() => import(...)), and dynamic() fetches as soon as the
// component renders, not when it decides to draw. The decision to skip WebGL
// lives INSIDE the module, so a phone had to download 184 KB of three.js in
// order to read the line that tells it not to use three.js.
//
// The part that made this awkward, and the reason for a wrapper rather than a
// plain gate: when WaterShaderHorizon disables itself it does not render
// nothing. It returns a navy gradient band of exactly the same height, so the
// layout is identical whatever the device can do. Gating the component away
// would have taken 220 px out of the page on mobile and introduced the layout
// shift that this site currently does not have (CLS is 0, and it stays 0).
//
// So the fallback moves out here, where it costs one div, and the real shader
// is mounted only once the gate agrees: a pointer device, a window at least
// 1024 px wide, no reduced-motion preference, and the band within one screen
// of the viewport. The gradient underneath is what mobile keeps and what
// desktop sees for the moment before the shader takes over, which is what it
// saw before anyway while the module was still arriving.

import dynamic from "next/dynamic";
import useHeavyVisualGate from "./useHeavyVisualGate";

const WaterShaderHorizon = dynamic(() => import("./WaterShaderHorizon"), {
  ssr: false,
});

// Kept identical to the fallback inside WaterShaderHorizon. If one changes,
// change both: they are meant to be indistinguishable.
const FALLBACK_BACKGROUND =
  "linear-gradient(to bottom, #0D1B2A 0%, #0D1B2A 35%, #1a2845 65%, #0D1B2A 100%)";

export default function WaterHorizonBand({ height = 220 }) {
  const [ref, show] = useHeavyVisualGate();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ width: "100%", height, background: FALLBACK_BACKGROUND }}
    >
      {show && <WaterShaderHorizon height={height} />}
    </div>
  );
}
