"use client";

// Phase 27i.13 (2026-05-07) — Aegean wave SVG divider.
//
// Drops between two sections to mark a transition without a hard
// horizontal line. Two layered SVG sine waves animate in opposite
// directions at slightly different speeds — together they read as
// the surface of the Aegean catching light.
//
// Usage: <WaveDivider /> between any two homepage sections. Pure
// SVG + CSS animation, ~1 KB, GPU-friendly. Reduced-motion stays
// static.

export default function WaveDivider({ height = 80, intensity = 1 }) {
  return (
    <div
      className="gy-wave-divider"
      aria-hidden="true"
      style={{ height: `${height}px`, opacity: intensity }}
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gyWaveDividerFill1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(201, 168, 76, 0)" />
            <stop offset="50%" stopColor="rgba(201, 168, 76, 0.45)" />
            <stop offset="100%" stopColor="rgba(201, 168, 76, 0)" />
          </linearGradient>
          <linearGradient id="gyWaveDividerFill2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(245, 235, 210, 0)" />
            <stop offset="50%" stopColor="rgba(245, 235, 210, 0.55)" />
            <stop offset="100%" stopColor="rgba(245, 235, 210, 0)" />
          </linearGradient>
        </defs>

        {/* Wave 1 — gold, drifts left */}
        <path
          className="gy-wave-divider-line gy-wave-divider-line--1"
          d="M 0 50 Q 150 30, 300 50 T 600 50 T 900 50 T 1200 50"
          stroke="url(#gyWaveDividerFill1)"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Wave 2 — ivory, drifts right, slightly different period */}
        <path
          className="gy-wave-divider-line gy-wave-divider-line--2"
          d="M 0 46 Q 200 64, 400 46 T 800 46 T 1200 46"
          stroke="url(#gyWaveDividerFill2)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
