"use client";

// Phase 27i.5d (2026-05-07) — proper cartographic Greek coastline.
//
// Boss flagged the previous hand-drawn SVG as "σαν να το έχει
// ζωγραφίσει παιδάκι". Replaced with real Natural Earth 1:50m
// coastline data — Greece + 5 neighbours (Turkey, Albania, Bulgaria,
// Italy, Cyprus) so the surrounding sea has geographic context, not
// floating Greece on a void.
//
// Build-time extraction (lib/greek-region-geo.json, 93 KB) — the
// 740 KB world-atlas topology was thrown away after extraction.
// Runtime cost: 93 KB JSON parsed once + d3-geo Mercator projection
// (no React re-render after first paint). Renders as plain SVG
// paths so it scales crisply at any zoom.

import { useMemo } from "react";
import { geoMercator, geoPath } from "d3-geo";
import GREEK_REGION from "@/lib/greek-region-geo.json";

// SVG canvas dimensions — must match the viewBox in the parent map
// canvas so the projected coordinates align with the region pins
// drawn in HTML on top.
const WIDTH = 1000;
const HEIGHT = 600;

export default function GreekMapBackdrop() {
  // Project once (re-running on every render would defeat the point).
  // geoMercator centred on the Aegean (~24°E, 38.5°N), scaled to fit
  // mainland + islands in the canvas with ~10% margin.
  const { greecePath, neighboursPath } = useMemo(() => {
    const projection = geoMercator()
      .center([24, 38.5])
      .scale(2400)
      .translate([WIDTH / 2, HEIGHT / 2]);
    const pathFn = geoPath(projection);

    const greece = GREEK_REGION.features.find((f) => f.name === "Greece");
    const neighbours = GREEK_REGION.features.filter((f) => f.name !== "Greece");

    return {
      greecePath: greece ? pathFn(greece.geometry) : null,
      neighboursPath: neighbours
        .map((f) => pathFn(f.geometry))
        .filter(Boolean)
        .join(" "),
    };
  }, []);

  return (
    <svg
      className="gy-region-map-backdrop"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Sea — slow horizontal stripes that simulate a wave grain. */}
        <pattern id="seaWave" x="0" y="0" width="60" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M 0 7 Q 15 0 30 7 T 60 7"
            stroke="rgba(201, 168, 76, 0.05)"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
        {/* Greece land — subtle ivory/gold gradient */}
        <linearGradient id="greekLand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(248, 245, 240, 0.10)" />
          <stop offset="100%" stopColor="rgba(201, 168, 76, 0.06)" />
        </linearGradient>
        {/* Drop-shadow filter — subtle depth around Greece coastline */}
        <filter id="greekGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="0 0 0 0 0.85
                    0 0 0 0 0.65
                    0 0 0 0 0.20
                    0 0 0 0.5 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sea wave texture — full canvas */}
      <rect width={WIDTH} height={HEIGHT} fill="url(#seaWave)" />

      {/* Neighbour countries — faint outline only, no fill, so the
          eye reads "Greece is here in the Mediterranean" without
          competing with the focus. */}
      {neighboursPath && (
        <path
          d={neighboursPath}
          fill="rgba(248, 245, 240, 0.012)"
          stroke="rgba(201, 168, 76, 0.10)"
          strokeWidth={0.5}
        />
      )}

      {/* Greece — full cartographic detail with the gradient fill +
          gold coastline + soft glow. */}
      {greecePath && (
        <path
          d={greecePath}
          fill="url(#greekLand)"
          stroke="rgba(201, 168, 76, 0.55)"
          strokeWidth={0.85}
          strokeLinejoin="round"
          filter="url(#greekGlow)"
        />
      )}
    </svg>
  );
}
