"use client";

// app/components/cabin/BerthMap.jsx
// =============================================================
// 2026-05-23 — Berth map block. George's request:
//   "Πρέπει να έχει ένα χάρτη, δωρεάν πάντα, ο οποίος θα έχει
//    την ακριβή θέση του σκάφους και θα έχει και μία υποσημείωση
//    από κάτω ότι αυτή είναι η ακριβή θέση του σκάφους αλλά
//    ενδέχεται να αλλάξει σε περίπτωση διαταγής του λιμενικού
//    σώματος του εισεκάστοτε μαρίνας."
//
// Tech: Leaflet (raster) + OpenStreetMap tiles.
//   • Zero API key, zero credit card, free forever
//   • OSM is community-owned (Wikipedia for maps) — won't disappear
//   • Custom gold SVG marker so no Leaflet image-asset wiring needed
//   • Renders nothing if lat/lng aren't set, so any cabin without
//     berth coordinates is unaffected (back-compat for everyone)
//
// All Leaflet work happens client-side after mount; no SSR
// access to `window` / `document` so Next.js stays happy.
// =============================================================

import { useEffect, useRef } from "react";
// Leaflet's stylesheet must load before the map mounts. Top-level
// import here means Next.js bundles it into the /cabin route only
// (not on every cabin sub-route). ~14 KB.
import "leaflet/dist/leaflet.css";

const NAVY = "#0D1B2A";
const GOLD = "#C9A84C";

// Inline SVG marker — gold pin with navy dot. No external image.
const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
  <defs>
    <filter id="s" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#0D1B2A" flood-opacity="0.45"/>
    </filter>
  </defs>
  <path
    d="M17 1C8.16 1 1 8.16 1 17c0 12 16 28 16 28s16-16 16-28C33 8.16 25.84 1 17 1z"
    fill="${GOLD}"
    stroke="${NAVY}"
    stroke-width="1.5"
    filter="url(#s)"
  />
  <circle cx="17" cy="17" r="5.5" fill="${NAVY}"/>
</svg>
`;

export default function BerthMap({
  lat,
  lng,
  label,
  vesselName,
  variant = "preview", // "preview" (home) | "full" (dedicated page)
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (mapRef.current) return; // already mounted

    let cancelled = false;

    // Defer the Leaflet import so the bundle only loads when a
    // cabin actually has berth coordinates. Cabins without one
    // pay zero KB for this feature.
    (async () => {
      const Lmod = await import("leaflet");
      if (cancelled || !containerRef.current) return;
      const L = Lmod.default;

      const zoom = variant === "full" ? 16 : 15;
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: variant === "full",
        scrollWheelZoom: false, // never hijack the scroll on home
        dragging: variant === "full",
        doubleClickZoom: variant === "full",
        attributionControl: true,
      });

      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
      ).addTo(map);

      const icon = L.divIcon({
        className: "berth-pin",
        html: PIN_SVG,
        iconSize: [34, 46],
        iconAnchor: [17, 44],
        popupAnchor: [0, -44],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      if (label || vesselName) {
        const popupHtml = `
          <div style="font-family:Georgia,serif;color:${NAVY};line-height:1.4;">
            ${vesselName ? `<div style="font-style:italic;font-size:14px;margin-bottom:2px;">${escapeHtml(vesselName)}</div>` : ""}
            ${label ? `<div style="font-family:-apple-system,Arial,sans-serif;font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;color:#5a4a1f;">${escapeHtml(label)}</div>` : ""}
          </div>
        `;
        marker.bindPopup(popupHtml, { closeButton: false });
        if (variant === "full") marker.openPopup();
      }

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label, vesselName, variant]);

  // Render nothing if we don't have coordinates — keeps the
  // cabin layout pristine for cabins that haven't set a berth.
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return (
    <section className={`berth-map berth-map--${variant}`}>
      <div className="berth-map__head">
        <div className="berth-map__eyebrow">Where you&apos;ll find her</div>
        {label && <div className="berth-map__label">{label}</div>}
      </div>

      <div
        ref={containerRef}
        className="berth-map__canvas"
        aria-label={`Map showing the berth of ${vesselName || "your yacht"}`}
      />

      <p className="berth-map__note">
        <em>
          This is your vessel&apos;s current berth. The port authority
          may adjust the position at the marina&apos;s discretion —
          should that happen before embarkation, you&apos;ll hear it
          from us first.
        </em>
      </p>

      <style>{`
        .berth-map {
          margin: 28px 0;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
        }
        .berth-map__head {
          padding: 18px 22px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .berth-map__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
        }
        .berth-map__label {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 17px;
          color: var(--gy-navy);
        }
        .berth-map__canvas {
          width: 100%;
          height: 320px;
          background: #e9e4d4;
        }
        .berth-map--full .berth-map__canvas { height: 62vh; min-height: 420px; }
        .berth-map__note {
          margin: 0;
          padding: 12px 22px 18px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.6);
          border-top: 1px solid rgba(13, 27, 42, 0.06);
        }
        /* Leaflet popup look — tighter, branded. */
        :global(.leaflet-popup-content-wrapper) {
          background: #ffffff !important;
          border: 1px solid rgba(201, 168, 76, 0.6) !important;
          border-radius: 2px !important;
          box-shadow: 0 6px 18px rgba(13, 27, 42, 0.18) !important;
        }
        :global(.leaflet-popup-tip) {
          background: #ffffff !important;
        }
        :global(.leaflet-container) {
          font-family: var(--gy-font-editorial), Georgia, serif;
        }
        /* SVG pin shouldn't be filtered/dimmed by Leaflet's marker
           default opacity transitions. */
        :global(.berth-pin svg) { display: block; }
      `}</style>
    </section>
  );
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
