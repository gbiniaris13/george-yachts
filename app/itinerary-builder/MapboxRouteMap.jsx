"use client";

// L.1 phase 2 (Roberto brief, May 2026) — Mapbox-powered itinerary
// builder map. Activates when NEXT_PUBLIC_MAPBOX_TOKEN is present.
//
// Style: mapbox/dark-v11 base, gold dots for islands, gold-rule
// route line, small marker label on hover. Pure-JS interactions —
// no React-Mapbox wrapper to keep the footprint small. mapbox-gl is
// dynamically imported so the bundle only ships when this map is
// actually rendered.

import { useEffect, useRef, useState } from "react";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#C9A84C";

export default function MapboxRouteMap({
  islands = [],
  selected = [], // array of island ids in order
  onToggleIsland, // (island) => void
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const markersRef = useRef(new Map()); // island.id → marker
  const [ready, setReady] = useState(false);
  // L.2 (Roberto brief, May 2026) — 2D ⇄ 3D toggle. 3D mode pitches
  // the camera to ~55°, enables Mapbox terrain DEM (1.5× exag), and
  // adds a soft sky layer. The toggle persists per-session via
  // sessionStorage so the user's preference survives re-renders but
  // doesn't carry across visits. Brief was cautious about Cesium
  // ("advanced phase") — Mapbox terrain piggy-backs on the existing
  // L.1.2 token and ships zero extra payload weight.
  const [is3D, setIs3D] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return sessionStorage.getItem("gy-itinerary-3d") === "1"; } catch { return false; }
  });

  // Init map once
  useEffect(() => {
    let cancelled = false;
    let mapInstance = null;

    (async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) return;

      const mod = await import("mapbox-gl");
      const mapbox = mod.default || mod;
      if (cancelled || !ref.current) return;

      // Inject Mapbox CSS once
      if (typeof document !== "undefined" && !document.querySelector("link[data-mapbox-css]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css";
        link.dataset.mapboxCss = "1";
        document.head.appendChild(link);
      }

      mapbox.accessToken = token;
      mapInstance = new mapbox.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [24.5, 38.2],
        zoom: 5.4,
        pitch: 0,
        attributionControl: false,
      });
      mapRef.current = mapInstance;

      mapInstance.on("load", () => {
        if (cancelled) return;
        // Route layer
        mapInstance.addSource("gy-route", {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "LineString", coordinates: [] }, properties: {} },
        });
        mapInstance.addLayer({
          id: "gy-route-line",
          type: "line",
          source: "gy-route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": GOLD,
            "line-width": 3,
            "line-opacity": 0.85,
          },
        });
        // L.2 — terrain DEM source (used by the 3D toggle). Always
        // registered so flipping in/out of 3D doesn't re-fetch.
        try {
          if (!mapInstance.getSource("mapbox-dem")) {
            mapInstance.addSource("mapbox-dem", {
              type: "raster-dem",
              url: "mapbox://mapbox.mapbox-terrain-dem-v1",
              tileSize: 512,
              maxzoom: 14,
            });
          }
          // Sky layer for atmospheric 3D look
          if (!mapInstance.getLayer("gy-sky")) {
            mapInstance.addLayer({
              id: "gy-sky",
              type: "sky",
              paint: {
                "sky-type": "atmosphere",
                "sky-atmosphere-sun": [0.0, 90.0],
                "sky-atmosphere-sun-intensity": 5,
              },
            });
          }
        } catch {}
        setReady(true);
      });

      mapInstance.addControl(
        new mapbox.NavigationControl({ visualizePitch: false, showCompass: false }),
        "top-right"
      );
    })();

    return () => {
      cancelled = true;
      if (mapInstance) {
        try { mapInstance.remove(); } catch {}
      }
      mapRef.current = null;
      markersRef.current = new Map();
    };
  }, []);

  // Sync island markers
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const mod = await import("mapbox-gl");
      const mapbox = mod.default || mod;
      if (cancelled) return;

      const map = mapRef.current;
      const existing = markersRef.current;

      // Remove markers that are no longer in islands list
      const ids = new Set(islands.map((i) => i.id));
      for (const [id, marker] of existing.entries()) {
        if (!ids.has(id)) {
          marker.remove();
          existing.delete(id);
        }
      }

      // Add / update markers for current list
      for (const island of islands) {
        if (typeof island.lat !== "number" || typeof island.lng !== "number") continue;
        let marker = existing.get(island.id);
        const isSelected = selected.includes(island.id);
        const dotColor = isSelected ? GOLD_BRIGHT : GOLD;
        const dotSize = isSelected ? 16 : 10;
        if (!marker) {
          const el = document.createElement("button");
          el.type = "button";
          el.setAttribute("aria-label", island.name);
          el.style.cssText = `
            width:${dotSize}px;height:${dotSize}px;border-radius:50%;
            background:${dotColor};border:2px solid #0D1B2A;
            cursor:pointer;padding:0;
            box-shadow:0 0 0 2px ${GOLD}55, 0 2px 6px rgba(13, 27, 42,0.5);
            transition:transform 0.18s ease, background 0.18s ease;
          `;
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.25)";
            if (!popupRef.current) {
              popupRef.current = new mapbox.Popup({
                closeButton: false, closeOnClick: false, offset: 14,
              });
            }
            popupRef.current
              .setLngLat([island.lng, island.lat])
              .setHTML(
                `<div style="font-family:'Montserrat',sans-serif;font-size:11px;color:#0D1B2A;padding:2px 4px"><strong>${island.name}</strong><br/><span style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9CA3AF">${island.region || ""}</span></div>`
              )
              .addTo(map);
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
            if (popupRef.current) popupRef.current.remove();
          });
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (popupRef.current) popupRef.current.remove();
            onToggleIsland?.(island);
          });
          marker = new mapbox.Marker({ element: el, anchor: "center" })
            .setLngLat([island.lng, island.lat])
            .addTo(map);
          existing.set(island.id, marker);
        } else {
          // update size + color
          const el = marker.getElement();
          el.style.width = `${dotSize}px`;
          el.style.height = `${dotSize}px`;
          el.style.background = dotColor;
        }
      }
    })();
    return () => { cancelled = true; };
  }, [ready, islands, selected, onToggleIsland]);

  // Sync route line + auto-fit when route changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource("gy-route");
    if (!source) return;

    const points = selected
      .map((id) => islands.find((i) => i.id === id))
      .filter((p) => p && typeof p.lng === "number" && typeof p.lat === "number")
      .map((p) => [p.lng, p.lat]);

    source.setData({
      type: "Feature",
      geometry: { type: "LineString", coordinates: points },
      properties: {},
    });

    if (points.length >= 2) {
      let minLng = +Infinity, minLat = +Infinity, maxLng = -Infinity, maxLat = -Infinity;
      points.forEach(([lng, lat]) => {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      });
      try {
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 80, duration: 800, maxZoom: 8 }
        );
      } catch {}
    }
  }, [ready, selected, islands]);

  // L.2 — apply 2D ⇄ 3D state to the running map.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    try { sessionStorage.setItem("gy-itinerary-3d", is3D ? "1" : "0"); } catch {}
    if (is3D) {
      try { map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 }); } catch {}
      map.easeTo({ pitch: 55, bearing: -15, duration: 800 });
      try {
        const sky = map.getLayer("gy-sky");
        if (sky) map.setLayoutProperty("gy-sky", "visibility", "visible");
      } catch {}
    } else {
      try { map.setTerrain(null); } catch {}
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      try {
        const sky = map.getLayer("gy-sky");
        if (sky) map.setLayoutProperty("gy-sky", "visibility", "none");
      } catch {}
    }
  }, [is3D, ready]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 420, position: "relative" }}>
      <div
        ref={ref}
        style={{
          position: "absolute",
          inset: 0,
          background: "#0D1B2A",
          borderRadius: 4,
        }}
        role="application"
        aria-label="Interactive Greek-islands route map"
      />
      {/* L.2 — 2D ⇄ 3D toggle. Sits top-left so it doesn't clash with
          the NavigationControl (top-right). Hidden until the map is
          ready so users don't see a non-functional button. */}
      {ready && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 5,
            display: "flex",
            background: "rgba(13, 27, 42,0.85)",
            border: "1px solid rgba(201,168,76,0.35)",
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            overflow: "hidden",
          }}
          role="group"
          aria-label="Map view mode"
        >
          {[
            { key: false, label: "2D" },
            { key: true, label: "3D" },
          ].map((opt) => {
            const active = is3D === opt.key;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setIs3D(opt.key)}
                aria-pressed={active}
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "8px 14px",
                  background: active ? "rgba(201,168,76,0.22)" : "transparent",
                  color: active ? GOLD_BRIGHT : "rgba(248, 245, 240,0.65)",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.18s ease, color 0.18s ease",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
