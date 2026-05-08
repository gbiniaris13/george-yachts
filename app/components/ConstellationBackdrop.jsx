"use client";

// Phase 27i.6 (2026-05-07) — Constellation backdrop.
//
// Pure-SVG decoration for dark sections. Renders ~30 gold points
// connected into four loose constellations (same shapes a navigator
// would use to triangulate position at sea: Polaris-style cross,
// Big Dipper-style ladle, Cassiopeia-style W, Cygnus-style cross).
// Each point twinkles on its own offset; the whole layer drifts
// 0.6°/min on the Y axis as if the night sky is rotating.
//
// Zero JS state, zero R3F overhead — small SVG inside a div, all
// animation is CSS-driven. Reduced-motion: stays static, no twinkle,
// no drift.

const POINTS = [
  // Cassiopeia (W) — top-left
  { x: 8,   y: 12, r: 2.0, del: 0.0 },
  { x: 14,  y: 16, r: 2.4, del: 1.4 },
  { x: 19,  y: 11, r: 2.6, del: 0.7 },
  { x: 24,  y: 17, r: 2.0, del: 2.1 },
  { x: 29,  y: 12, r: 2.2, del: 0.4 },

  // Big Dipper-ish (ladle) — top-right
  { x: 70,  y: 9,  r: 2.4, del: 1.7 },
  { x: 76,  y: 11, r: 2.0, del: 0.3 },
  { x: 82,  y: 13, r: 2.6, del: 2.6 },
  { x: 88,  y: 14, r: 2.2, del: 1.1 },
  { x: 88,  y: 21, r: 2.0, del: 0.6 },
  { x: 82,  y: 22, r: 2.4, del: 1.9 },
  { x: 76,  y: 19, r: 2.2, del: 0.8 },

  // Cygnus (cross) — centre
  { x: 50,  y: 50, r: 2.8, del: 0.0 }, // anchor (Deneb)
  { x: 50,  y: 42, r: 2.0, del: 1.3 },
  { x: 50,  y: 58, r: 2.0, del: 0.7 },
  { x: 50,  y: 64, r: 2.2, del: 2.0 },
  { x: 44,  y: 50, r: 2.0, del: 0.4 },
  { x: 56,  y: 50, r: 2.0, del: 1.6 },

  // Polaris-style cross — bottom-left
  { x: 14,  y: 78, r: 2.6, del: 0.9 },
  { x: 14,  y: 84, r: 2.0, del: 2.2 },
  { x: 10,  y: 81, r: 2.0, del: 1.4 },
  { x: 18,  y: 81, r: 2.0, del: 0.5 },

  // Bottom-right cluster — light Triangulum
  { x: 76,  y: 75, r: 2.4, del: 1.0 },
  { x: 84,  y: 78, r: 2.2, del: 2.4 },
  { x: 80,  y: 84, r: 2.0, del: 0.7 },

  // Stragglers for texture
  { x: 38,  y: 28, r: 1.6, del: 1.1 },
  { x: 62,  y: 35, r: 1.6, del: 0.6 },
  { x: 32,  y: 68, r: 1.6, del: 1.9 },
  { x: 68,  y: 70, r: 1.6, del: 0.2 },
];

// Constellation lines — pairs of POINTS indices (zero-based).
const LINES = [
  // Cassiopeia W
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Big Dipper-ish
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  // Cygnus cross
  [12, 13], [12, 14], [14, 15], [16, 12], [12, 17],
  // Polaris cross
  [18, 19], [20, 21],
  // Triangulum
  [22, 23], [23, 24], [24, 22],
];

export default function ConstellationBackdrop({
  intensity = 1, // 0..1.5 — multiplies opacity for very-dark vs faintly-lit sections
}) {
  return (
    <svg
      className="gy-constellation-backdrop"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity: intensity }}
    >
      <defs>
        <radialGradient id="gyStarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245, 235, 210, 1)" />
          <stop offset="40%" stopColor="rgba(201, 168, 76, 0.85)" />
          <stop offset="100%" stopColor="rgba(201, 168, 76, 0)" />
        </radialGradient>
      </defs>

      {/* Constellation lines — very faint gold */}
      <g
        stroke="rgba(201, 168, 76, 0.16)"
        strokeWidth="0.2"
        fill="none"
        strokeLinecap="round"
      >
        {LINES.map(([a, b], i) => {
          const A = POINTS[a];
          const B = POINTS[b];
          if (!A || !B) return null;
          return (
            <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />
          );
        })}
      </g>

      {/* Stars */}
      <g className="gy-constellation-stars">
        {POINTS.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r * 0.18}
            fill="url(#gyStarGlow)"
            style={{ animationDelay: `${p.del}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
