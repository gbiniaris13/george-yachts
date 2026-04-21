"use client";

// Move #5 — Interactive Greek Waters Map.
//
// The statement piece. A stylised, editorial map of the four
// cruising regions (Ionian · Saronic · Cyclades · Sporades).
// Each region is a hoverable zone; hovering highlights the region
// in gold and raises a floating card with a short insider line
// and a deep link to its destinations page.
//
// Design register: Condé Nast Traveler illustrated-map aesthetic —
// no OSM/Google Maps tiles, no satellite imagery. Just a sparse
// dotted archipelago over a faint gold-and-navy canvas.
//
// On mobile: the map scales down and hover becomes tap. No
// floating cards — the tapped region shows its info inline below
// the map instead.
//
// 2026-04-21: /destinations/* routes were retired; every region on
// the map now funnels directly into /inquiry for conversion.

import { useState } from "react";
import Link from "next/link";

const REGIONS = [
  {
    id: "ionian",
    name: "Ionian",
    tagline: "Emerald water, sailing monohulls, the softest cruising in Greece.",
    stats: "16 islands  ·  West coast  ·  Calm waters",
    // Destinations pages were removed 2026-04-21; regions on the
    // map now funnel straight into the inquiry flow.
    href: "/inquiry",
    // Cluster of islands down the west coast of Greece.
    // (each region sends visitors to /inquiry since the dedicated
    // destination pages were retired 2026-04-21)
    islands: [
      { cx: 180, cy: 270, r: 14, name: "Corfu" },
      { cx: 200, cy: 330, r: 9, name: "Paxos" },
      { cx: 215, cy: 390, r: 11, name: "Lefkada" },
      { cx: 225, cy: 435, r: 13, name: "Kefalonia" },
      { cx: 250, cy: 450, r: 7, name: "Ithaca" },
      { cx: 230, cy: 495, r: 10, name: "Zakynthos" },
    ],
  },
  {
    id: "saronic",
    name: "Saronic",
    tagline: "One hour from Athens. Hydra at sunrise, Spetses at sunset.",
    stats: "8 islands  ·  Near Athens  ·  Weekend gateway",
    href: "/inquiry",
    islands: [
      { cx: 475, cy: 455, r: 9, name: "Aegina" },
      { cx: 510, cy: 480, r: 7, name: "Poros" },
      { cx: 535, cy: 510, r: 10, name: "Hydra" },
      { cx: 575, cy: 535, r: 8, name: "Spetses" },
    ],
  },
  {
    id: "cyclades",
    name: "Cyclades",
    tagline: "Whitewashed villages, sun-blasted stone, the Greece you imagined.",
    stats: "24 islands  ·  Central Aegean  ·  Flagship destination",
    href: "/inquiry",
    islands: [
      { cx: 620, cy: 425, r: 6, name: "Kea" },
      { cx: 660, cy: 460, r: 6, name: "Kythnos" },
      { cx: 700, cy: 490, r: 7, name: "Serifos" },
      { cx: 725, cy: 520, r: 6, name: "Sifnos" },
      { cx: 680, cy: 540, r: 7, name: "Milos" },
      { cx: 740, cy: 445, r: 9, name: "Syros" },
      { cx: 770, cy: 475, r: 11, name: "Mykonos" },
      { cx: 800, cy: 515, r: 12, name: "Naxos" },
      { cx: 780, cy: 540, r: 9, name: "Paros" },
      { cx: 815, cy: 560, r: 6, name: "Ios" },
      { cx: 805, cy: 600, r: 10, name: "Santorini" },
      { cx: 850, cy: 490, r: 8, name: "Amorgos" },
    ],
  },
  {
    id: "sporades",
    name: "Sporades",
    tagline: "Pine forests to the waterline. Mamma Mia's coast in real life.",
    stats: "4 islands  ·  Northeast Aegean  ·  Untamed coast",
    href: "/inquiry",
    islands: [
      { cx: 565, cy: 245, r: 8, name: "Skiathos" },
      { cx: 600, cy: 230, r: 10, name: "Skopelos" },
      { cx: 640, cy: 225, r: 8, name: "Alonissos" },
      { cx: 680, cy: 215, r: 6, name: "Skyros" },
    ],
  },
];

// Hover zone bounding boxes (rectangles that swallow the mouse over
// each region's island cluster — easier to hit than the tiny dots).
const REGION_BOUNDS = {
  ionian:   { x: 150, y: 240, w: 140, h: 290 },
  saronic:  { x: 450, y: 430, w: 160, h: 130 },
  cyclades: { x: 600, y: 410, w: 290, h: 210 },
  sporades: { x: 540, y: 190, w: 170, h: 80 },
};

// Mainland and Crete — rendered as a very faint backdrop so the
// islands feel like they belong to a country, not a void. No
// interaction on these shapes.
const BACKDROP_PATHS = {
  // Rough mainland (Peloponnese + central Greece) — hand-tuned path.
  mainland:
    "M 260 170 Q 300 150 380 160 T 500 180 T 560 220 Q 570 260 540 300 L 520 340 Q 470 380 440 410 L 420 440 Q 390 470 370 490 L 330 510 Q 300 520 280 500 L 260 470 Q 240 440 250 410 L 265 380 Q 290 360 310 340 L 300 310 Q 270 290 255 265 L 255 220 Z",
  // Crete — elongated oval along the bottom.
  crete:
    "M 620 680 Q 700 665 780 670 T 900 685 Q 930 695 920 710 T 820 720 T 700 715 T 620 700 Z",
};

export default function GreekWatersMap() {
  const [activeId, setActiveId] = useState(null);

  const active = REGIONS.find((r) => r.id === activeId) ?? null;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#000000" }}
      aria-label="Greek waters — four cruising regions"
    >
      {/* Soft radial wash — reads as moonlight on water */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(218,165,32,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p
            className="text-[#DAA520]/80 mb-4"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Greek Waters · Four Regions
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(32px, 4.5vw, 64px)",
              fontWeight: 200,
              letterSpacing: "0.03em",
              lineHeight: 1.1,
            }}
          >
            A week in the{" "}
            <span
              className="italic transition-colors duration-500"
              style={{
                background:
                  "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {active ? active.name : "Aegean"}
            </span>
            {" "}
            rearranges what you think a holiday can be.
          </h2>
        </div>

        {/* Map */}
        <div className="relative">
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Map of Greek cruising regions"
          >
            {/* Mainland backdrop — faint */}
            <path
              d={BACKDROP_PATHS.mainland}
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(218,165,32,0.15)"
              strokeWidth="1"
            />
            <path
              d={BACKDROP_PATHS.crete}
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(218,165,32,0.15)"
              strokeWidth="1"
            />

            {/* Athens marker — a small ring + label, editorial anchor */}
            <g>
              <circle cx="430" cy="390" r="3" fill="rgba(218,165,32,0.6)" />
              <circle
                cx="430"
                cy="390"
                r="9"
                fill="none"
                stroke="rgba(218,165,32,0.35)"
                strokeWidth="0.8"
              />
              <text
                x="405"
                y="380"
                textAnchor="end"
                fill="rgba(255,255,255,0.55)"
                fontFamily="'Montserrat', sans-serif"
                fontSize="16"
                letterSpacing="3"
              >
                ATHENS
              </text>
            </g>

            {/* Labels for each region — small caps, ivory, positioned
                above the cluster. Tint gold when active. */}
            {REGIONS.map((r) => {
              const isActive = activeId === r.id;
              const bounds = REGION_BOUNDS[r.id];
              const labelX = bounds.x + bounds.w / 2;
              const labelY = bounds.y - 10;
              return (
                <text
                  key={`label-${r.id}`}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fill={
                    isActive ? "rgba(218,165,32,1)" : "rgba(255,255,255,0.48)"
                  }
                  fontFamily="'Montserrat', sans-serif"
                  fontSize="20"
                  letterSpacing="4"
                  fontWeight="600"
                  style={{ transition: "fill 500ms ease" }}
                >
                  {r.name.toUpperCase()}
                </text>
              );
            })}

            {/* Islands per region */}
            {REGIONS.map((r) => {
              const isActive = activeId === r.id;
              const isDim = activeId !== null && !isActive;
              return (
                <g
                  key={r.id}
                  style={{
                    opacity: isDim ? 0.3 : 1,
                    transition: "opacity 500ms ease",
                  }}
                >
                  {r.islands.map((island, i) => (
                    <circle
                      key={`${r.id}-${i}`}
                      cx={island.cx}
                      cy={island.cy}
                      r={island.r}
                      fill={
                        isActive
                          ? "rgba(218,165,32,0.85)"
                          : "rgba(255,255,255,0.75)"
                      }
                      stroke={
                        isActive
                          ? "rgba(230,199,122,1)"
                          : "rgba(218,165,32,0.4)"
                      }
                      strokeWidth={isActive ? 1.5 : 0.8}
                      style={{ transition: "fill 500ms ease, stroke 500ms ease" }}
                    />
                  ))}
                </g>
              );
            })}

            {/* Hover zones — one invisible rect per region that
                swallows the mouse over its island cluster. Each
                wraps a <a> so click navigates. */}
            {REGIONS.map((r) => {
              const b = REGION_BOUNDS[r.id];
              return (
                <a
                  key={`zone-${r.id}`}
                  href={r.href}
                  aria-label={`Explore the ${r.name}`}
                  onMouseEnter={() => setActiveId(r.id)}
                  onMouseLeave={() =>
                    setActiveId((prev) => (prev === r.id ? null : prev))
                  }
                  onFocus={() => setActiveId(r.id)}
                  onBlur={() =>
                    setActiveId((prev) => (prev === r.id ? null : prev))
                  }
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    fill="transparent"
                    stroke={
                      activeId === r.id ? "rgba(218,165,32,0.3)" : "transparent"
                    }
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    style={{
                      cursor: "pointer",
                      transition: "stroke 400ms ease",
                    }}
                  />
                </a>
              );
            })}
          </svg>

          {/* Floating info card on desktop — only visible when a
              region is hovered. Shown outside the SVG so normal HTML
              interactions work. Mobile: hidden; mobile shows a static
              list below instead. */}
          {active && (
            <div
              aria-live="polite"
              className="hidden md:block absolute top-8 right-8 max-w-sm p-8 pointer-events-none"
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(218,165,32,0.35)",
                color: "#fff",
              }}
            >
              <p
                className="text-[#DAA520] mb-3"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "8px",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Region
              </p>
              <p
                className="text-white mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {active.name}
              </p>
              <p
                className="text-white/70 italic mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "16px",
                  lineHeight: 1.5,
                }}
              >
                {active.tagline}
              </p>
              <p
                className="text-[#DAA520]/70"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {active.stats}
              </p>
              <p
                className="text-white/50 mt-6"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
              >
                Click to explore →
              </p>
            </div>
          )}
        </div>

        {/* Mobile / fallback — compact list of regions below the map.
            Always rendered but visually hidden on desktop via the
            md:hidden class below the map SVG; on mobile serves as
            the primary nav since hover isn't available. */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {REGIONS.map((r) => (
            <Link
              key={`list-${r.id}`}
              href={r.href}
              className="group block border border-[#DAA520]/15 hover:border-[#DAA520]/55 p-6 transition-colors duration-500"
              style={{ background: "rgba(0,0,0,0.55)" }}
              onMouseEnter={() => setActiveId(r.id)}
              onMouseLeave={() =>
                setActiveId((prev) => (prev === r.id ? null : prev))
              }
            >
              <p
                className="text-[#DAA520] mb-2"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {r.name}
              </p>
              <p
                className="text-white/70 italic mb-3 group-hover:text-white transition-colors duration-500"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "15px",
                  lineHeight: 1.4,
                }}
              >
                {r.tagline}
              </p>
              <p
                className="text-white/40 group-hover:text-[#DAA520] transition-colors duration-500"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                {r.stats}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
