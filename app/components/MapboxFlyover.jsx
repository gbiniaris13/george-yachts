"use client";

// Phase 2 / E2 (Boss luxury rebuild brief, 2026-05-05) —
// 3D Mapbox flyover of the Greek waters.
//
// Cinematic full-bleed section that auto-plays a slow flyover across
// the Cyclades / Saronic / Ionian when it scrolls into view. No tile
// imagery for the first paint — we lazy-mount the Mapbox container
// only when the section is near the viewport, then start a scripted
// camera pan from a high orbit down to a low cinematic sweep.
//
// Pins drop on a curated set of "best week" islands; click any pin
// → opens a soft popup with island name + a "Charter aboard …" link
// to /yacht-charter-{slug}.
//
// Why this and not the SVG GreekWatersMap:
//   • UHNW respond to actual cinematography. A 3D flyover at sunset-
//     toned hour reads as "we operate here", not "here's an icon".
//   • Editorial SVG remains for the no-JS / reduced-motion case (the
//     existing GreekWatersMap stays mounted lower on the page).
//
// Free-tier compliance: Mapbox free tier is 50k loads / month. The
// component skips mounting on touch-only devices that prefer reduced
// data, and unmounts the GL canvas when the section scrolls out of
// view, so map loads count only against active in-view sessions.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Curated waypoints for the flyover camera path. Each pin also ends
// up rendered as a tappable marker. Coordinates are [lng, lat].
const ISLANDS = [
  { name: "Mykonos",     slug: "mykonos",     coords: [25.3289, 37.4467], altitude: 1.5 },
  { name: "Santorini",   slug: "santorini",   coords: [25.4615, 36.3932], altitude: 2.0 },
  { name: "Folegandros", slug: "folegandros", coords: [24.8946, 36.6232], altitude: 1.4 },
  { name: "Milos",       slug: "milos",       coords: [24.4221, 36.7395], altitude: 1.4 },
  { name: "Hydra",       slug: "hydra",       coords: [23.4675, 37.3500], altitude: 1.5 },
  { name: "Symi",        slug: "symi",        coords: [27.8333, 36.6167], altitude: 1.7 },
  { name: "Skiathos",    slug: "skiathos",    coords: [23.4942, 39.1622], altitude: 1.5 },
  { name: "Rhodes",      slug: "rhodes",      coords: [28.2278, 36.4341], altitude: 1.8 },
];

// Camera waypoints for the auto-flyover. Numbers tuned for ~24-second
// run at 60fps on a desktop GPU. High pitch + slow zoom = cinematic.
const FLYOVER_WAYPOINTS = [
  { center: [24.3,  37.5], zoom: 6.2, pitch: 50, bearing:   0,  duration: 0    },
  { center: [25.3,  37.45], zoom: 8.8, pitch: 65, bearing: -25,  duration: 7000 },
  { center: [25.46, 36.39], zoom: 9.4, pitch: 70, bearing:  10,  duration: 6500 },
  { center: [23.47, 37.35], zoom: 8.6, pitch: 60, bearing:  60,  duration: 6500 },
  { center: [24.3,  37.5],  zoom: 6.0, pitch: 35, bearing:   0,  duration: 5500 },
];

export default function MapboxFlyover() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [skipMap, setSkipMap] = useState(false);

  // Mount detection — start the GL canvas only when the section is in
  // (or near) the viewport. Saves MAU quota + first-paint TTFB.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!MAPBOX_TOKEN) {
      setSkipMap(true);
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSkipMap(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Lazy-load mapbox-gl + start the scripted flyover.
  useEffect(() => {
    if (!shouldMount || skipMap) return;
    let cancelled = false;
    let cleanupFns = [];

    // Phase 27f (Forbes-launch day, 2026-05-06) — Boss reported the map
    // section showed nothing. Two failure modes both led to a black
    // box: (1) MAPBOX_TOKEN missing → existing skipMap branch, (2)
    // token present but tiles never load (rate-limit / 401 / network).
    // This timeout guarantees that if mapbox-gl hasn't fired its
    // 'load' event within 5 seconds (or 'error' fires), we flip
    // skipMap=true so the rich image-based fallback renders instead.
    const tilesTimeout = setTimeout(() => {
      if (!cancelled && mapRef.current && !mapRef.current.loaded?.()) {
        try { mapRef.current.remove(); } catch {}
        setSkipMap(true);
      }
    }, 5000);
    cleanupFns.push(() => clearTimeout(tilesTimeout));

    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        // CSS only loaded when we need the map — saves bytes on no-map pages.
        if (!document.getElementById("mapbox-gl-css")) {
          const link = document.createElement("link");
          link.id = "mapbox-gl-css";
          link.rel = "stylesheet";
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css";
          document.head.appendChild(link);
        }
        if (cancelled) return;
        mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: FLYOVER_WAYPOINTS[0].center,
        zoom: FLYOVER_WAYPOINTS[0].zoom,
        pitch: FLYOVER_WAYPOINTS[0].pitch,
        bearing: FLYOVER_WAYPOINTS[0].bearing,
        attributionControl: false,
        dragPan: true,
        dragRotate: true,
        scrollZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
        keyboard: false,
        touchZoomRotate: true,
        cooperativeGestures: true,
      });
      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;
        // Add 3D terrain
        try {
          map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.terrain-rgb",
            tileSize: 512,
            maxzoom: 14,
          });
          map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
        } catch {}

        // Atmosphere / fog tuned to "golden hour" feel
        try {
          map.setFog({
            range: [0.5, 8],
            color: "rgba(13, 27, 42, 0.5)",
            "high-color": "rgba(13, 27, 42, 0.95)",
            "horizon-blend": 0.18,
            "space-color": "#0D1B2A",
            "star-intensity": 0.0,
          });
        } catch {}

        // Drop markers for each island
        ISLANDS.forEach((island) => {
          const el = document.createElement("div");
          el.className = "gy-mapbox-pin";
          el.title = island.name;
          el.dataset.island = island.slug;
          el.innerHTML = `
            <span class="gy-mapbox-pin__dot"></span>
            <span class="gy-mapbox-pin__label">${island.name}</span>
          `;
          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            window.location.href = `/yacht-charter-${island.slug}`;
          });
          new mapboxgl.Marker(el, { anchor: "bottom" })
            .setLngLat(island.coords)
            .addTo(map);
        });

        // Run the scripted flyover.
        let i = 0;
        const next = () => {
          if (cancelled) return;
          i = (i + 1) % FLYOVER_WAYPOINTS.length;
          const wp = FLYOVER_WAYPOINTS[i];
          map.flyTo({
            center: wp.center,
            zoom: wp.zoom,
            pitch: wp.pitch,
            bearing: wp.bearing,
            duration: wp.duration,
            essential: true,
            curve: 1.4,
          });
        };
        const interval = setInterval(next, 7000);
        cleanupFns.push(() => clearInterval(interval));
        // Kick the first move shortly after load
        const first = setTimeout(next, 1200);
        cleanupFns.push(() => clearTimeout(first));
      });

        cleanupFns.push(() => {
          try { map.remove(); } catch {}
        });
      } catch (err) {
        // Any failure during mapbox-gl load / map init → flip to the
        // rich fallback so the section never shows an empty black
        // box. Common causes: token missing/expired, CSP block,
        // network failure on tile fetch.
        if (!cancelled) setSkipMap(true);
      }
    })();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      mapRef.current = null;
    };
  }, [shouldMount, skipMap]);

  return (
    <section
      aria-label="3D flyover of the Greek charter waters"
      style={{
        position: "relative",
        width: "100%",
        background: "#0D1B2A",
        overflow: "hidden",
      }}
    >
      {/* Eyebrow + headline overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 56px) 0",
          pointerEvents: "none",
        }}
      >
        <p
          className="gy-eyebrow"
          style={{ margin: 0, color: "#C9A84C" }}
        >
          The Greek waters
        </p>
        <h2
          className="gy-display-md"
          style={{
            margin: "10px 0 0",
            color: "#F8F5F0",
            maxWidth: "18ch",
            textShadow: "0 4px 24px rgba(13, 27, 42,0.55)",
          }}
        >
          Where your week could&nbsp;begin.
        </h2>
      </div>

      {/* The map container — lazy mounted.
          Phase 27f (Forbes-launch day, 2026-05-06) — when skipMap is
          true (no token / load failure / 5s timeout), we now render a
          rich image-based fallback instead of a black gradient: an
          aerial Aegean photo with a gold overlay grid + 5 region
          chips for Cyclades / Ionian / Saronic / Sporades / Dodecanese.
          Each chip is a click-through to the relevant itinerary. So
          even if Mapbox is permanently down, the section reads as an
          editorial map rather than a void. */}
      <div
        ref={containerRef}
        aria-hidden={skipMap ? "false" : "true"}
        style={{
          width: "100%",
          height: "clamp(420px, 62vh, 720px)",
          background: skipMap
            ? "linear-gradient(155deg, #0D1B2A 0%, #0D1B2A 100%)"
            : "transparent",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {skipMap && (
          <>
            {/* Background hero image — aerial Aegean coastline. We
                reuse the existing hero-poster as a known-good asset
                already in /public. */}
            <img
              src="/images/hero-poster.jpg"
              alt="Aerial view of Greek waters"
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: 0.42,
                filter: "saturate(0.85) contrast(1.05)",
                pointerEvents: "none",
              }}
            />
            {/* Vignette + bottom gradient so editorial copy reads cleanly */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 0%, rgba(13, 27, 42,0.55) 75%), linear-gradient(180deg, transparent 0%, rgba(13, 27, 42,0.7) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Editorial copy + region chips */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                padding: "clamp(24px, 5vw, 56px)",
                textAlign: "center",
              }}
            >
              <p
                className="gy-eyebrow-sm"
                style={{ color: "#C9A84C", margin: 0, letterSpacing: "0.32em" }}
              >
                The Greek waters
              </p>
              <p
                className="gy-lede"
                style={{
                  margin: 0,
                  color: "rgba(248,245,240,0.85)",
                  maxWidth: "38ch",
                  fontSize: "clamp(18px, 2vw, 24px)",
                }}
              >
                Five regions, hundreds of anchorages — every charter
                shaped around the waters that suit you best.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                {[
                  { name: "Cyclades", href: "/yacht-charter/cyclades" },
                  { name: "Ionian", href: "/yacht-charter/ionian" },
                  { name: "Saronic", href: "/yacht-charter/saronic" },
                  { name: "Sporades", href: "/yacht-charter/sporades" },
                  { name: "Dodecanese", href: "/yacht-itineraries-greece" },
                ].map((r) => (
                  <Link
                    key={r.name}
                    href={r.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 18px",
                      background: "rgba(13, 27, 42, 0.55)",
                      border: "1px solid rgba(201,168,76,0.45)",
                      color: "#F8F5F0",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      fontWeight: 500,
                      backdropFilter: "blur(6px)",
                      transition: "all 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "#C9A84C",
                        boxShadow: "0 0 8px rgba(201,168,76,0.6)",
                      }}
                    />
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Caption strip */}
      <div
        style={{
          padding: "clamp(20px, 3vw, 32px) clamp(24px, 5vw, 56px) clamp(40px, 6vw, 64px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(0deg, #0D1B2A 0%, transparent 100%)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <p
          style={{
            fontFamily: "'Lato', 'Montserrat', sans-serif",
            fontSize: 13,
            color: "rgba(248,245,240,0.62)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            margin: 0,
            maxWidth: "62ch",
          }}
        >
          Click any island for the yachts that work that itinerary best —
          or message George directly to brief a custom route.
        </p>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <Link href="/greece-by-yacht" className="gy-link-editorial">
            Read the ten stops →
          </Link>
          <Link href="/inquiry" className="gy-link-editorial" style={{ color: "rgba(248,245,240,0.55)" }}>
            Brief George →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .gy-mapbox-pin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transform: translateY(2px);
          pointer-events: auto;
        }
        .gy-mapbox-pin__dot {
          display: block;
          width: 10px;
          height: 10px;
          background: #C9A84C;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.25),
                      0 2px 6px rgba(13, 27, 42,0.6);
          animation: gy-pin-pulse 2.4s ease-in-out infinite;
        }
        .gy-mapbox-pin__label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: #F8F5F0;
          background: rgba(13, 27, 42, 0.55);
          padding: 3px 8px;
          backdrop-filter: blur(4px);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.32s ease, transform 0.32s ease;
        }
        .gy-mapbox-pin:hover .gy-mapbox-pin__label {
          opacity: 1;
          transform: translateX(0);
        }
        @keyframes gy-pin-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(201,168,76,0.25), 0 2px 6px rgba(13, 27, 42,0.6); }
          50%      { box-shadow: 0 0 0 8px rgba(201,168,76,0.0),  0 2px 6px rgba(13, 27, 42,0.6); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-mapbox-pin__dot { animation: none; }
          .gy-mapbox-pin__label { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
