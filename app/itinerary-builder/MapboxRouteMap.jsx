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

const GOLD = "#DAA520";
const GOLD_BRIGHT = "#E6C77A";

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
            background:${dotColor};border:2px solid #0a0a0a;
            cursor:pointer;padding:0;
            box-shadow:0 0 0 2px ${GOLD}55, 0 2px 6px rgba(0,0,0,0.5);
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
                `<div style="font-family:'Montserrat',sans-serif;font-size:11px;color:#0a1a2f;padding:2px 4px"><strong>${island.name}</strong><br/><span style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#888">${island.region || ""}</span></div>`
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

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 420,
        background: "#0a0a0a",
        borderRadius: 4,
      }}
      role="application"
      aria-label="Interactive Greek-islands route map"
    />
  );
}
