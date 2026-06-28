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
// 2026-05-23 (pm) — George flagged the v1 frame as "δεν μου φαίνεται
// αυτό τώρα ακριβό... αισθητικά". Reworked into a museum-plate frame:
//   • Cream/ivory inner panel, hairline gold border at 28% opacity
//   • Soft navy shadow for depth (luxury catalogue feel)
//   • Rounded corners (6px frame, map fills it)
//   • Generous 28px padding, capitalised marina name
//   • Gold-bordered "View on Google Maps ↗" CTA chip below the map
//   • Leaflet attribution restyled smaller/greyer (legally required,
//     visually deferred to the Google Maps CTA which is the real
//     click-through users want)
//   • Tiles stay OSM (free forever, no API key, no billing) —
//     premium feel comes from the frame, not the cartography
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

      // 2026-05-23 — Eleanna's iPhone test: berth map had the pin
      // visible but NO TILES. Switched OSM → CartoDB Voyager.
      //
      // 2026-05-23 (pm) — Vasilis on iPhone 13 Pro Max: tiles AGAIN
      // not loading even with CartoDB. Different Greek mobile
      // carrier than Eleanna; some carriers throttle/block specific
      // CDNs (Cosmote vs Vodafone GR vs Wind have different
      // upstream peering). We can't predict which provider works
      // for each customer, so we ship THREE tile providers with
      // automatic failover:
      //
      //   1. CartoDB Voyager (CloudFront, usually fastest)
      //   2. OSM France mirror (different infra, different upstream)
      //   3. Standard OSM (slowest but most reliable globally)
      //
      // Strategy: load primary. Count tileerror events for ~5 sec.
      // If we cross a failure threshold (>= 6 errors) before the
      // map's view has fully tiled, treat the provider as dead,
      // remove it and try the next. Each escalation logs once so
      // we can see in browser telemetry which providers are
      // failing for which carriers.
      const TILE_PROVIDERS = [
        {
          name: "carto-voyager",
          url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          subdomains: "abcd",
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
        {
          name: "osm-france",
          url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
          subdomains: "abc",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap France</a>',
        },
        {
          name: "osm-standard",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          subdomains: "abc",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
      ];

      let tileLayer = null;
      let providerIndex = 0;
      let errorCount = 0;
      let escalationScheduled = false;

      function attachProvider(idx) {
        if (idx >= TILE_PROVIDERS.length) {
          // Out of providers. Map still shows the pin + frame; the
          // tiles will remain blank. Better than infinite retries.
          // eslint-disable-next-line no-console
          console.warn(
            "[BerthMap] all tile providers failed - pin shown without basemap",
          );
          return;
        }
        const p = TILE_PROVIDERS[idx];
        errorCount = 0;
        escalationScheduled = false;
        if (tileLayer) map.removeLayer(tileLayer);
        tileLayer = L.tileLayer(p.url, {
          maxZoom: p.maxZoom,
          subdomains: p.subdomains,
          attribution: p.attribution,
          // Helps OSM servers identify us per their tile-usage policy.
          crossOrigin: true,
        });
        tileLayer.on("tileerror", () => {
          errorCount += 1;
          // 6 failures within the rolling window → escalate. We
          // schedule the escalation on the next tick so we don't
          // race with successful retries that may come in milliseconds
          // later from the same provider.
          if (errorCount >= 6 && !escalationScheduled) {
            escalationScheduled = true;
            // eslint-disable-next-line no-console
            console.warn(
              `[BerthMap] provider ${p.name} failing - escalating to ${
                TILE_PROVIDERS[idx + 1]?.name || "(none)"
              }`,
            );
            setTimeout(() => attachProvider(idx + 1), 100);
          }
        });
        tileLayer.addTo(map);
        providerIndex = idx;
      }

      attachProvider(0);

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

      // 2026-05-25 — Angeliki pass Phase 1 — REAL FIX (verified
      // live in browser at /test-berth-map).
      //
      // ROOT CAUSE (proven, not guessed):
      //   • Network: 200 OK from CartoDB for every tile.
      //   • DOM:    6 img.leaflet-tile elements present.
      //   • Image:  img.complete === true, naturalWidth === 256.
      //   • CSS:    .leaflet-tile { visibility: hidden; }
      //             .leaflet-tile-loaded { visibility: inherit; }
      //   • Bug:    `.leaflet-tile-loaded` is NEVER added.
      //
      // Leaflet's GridLayer._tileReady is the function that adds
      // that class. It does not run here. Manually adding the
      // class via DevTools makes the map render perfectly — so
      // tiles, transforms, blend modes and CSS are all fine.
      // The hole is purely in the class-toggle path.
      //
      // Several causes are possible in different environments
      // (React Strict Mode double-mount races, browser cache
      // serving images before listeners attach, Leaflet 1.9.x
      // GridLayer prune behaviour, turbopack HMR side-effects,
      // some interaction with cabin-tones.css globals). Rather
      // than chase Leaflet internals across every browser/cache
      // permutation Angeliki, Eleanna, Vasilis and Christos can
      // hit, we install a SAFETY NET: whenever a tile img is in
      // the DOM and the image is genuinely loaded (complete +
      // naturalWidth > 0), we ensure the .leaflet-tile-loaded
      // class is present. Idempotent; co-operates with Leaflet
      // when Leaflet's logic does fire, and rescues the page
      // when it doesn't.
      //
      // Three layers in concert:
      //   1. MutationObserver on the container — catches every
      //      tile img inserted by Leaflet, marks it loaded
      //      immediately if cached, and attaches a one-time
      //      load listener for the not-yet-decoded ones.
      //   2. Initial sweep on next macrotask — catches any
      //      tiles Leaflet inserted before our observer wired
      //      up (the very first frame after mount).
      //   3. A short polling pass (every 200ms for ~3s) — a
      //      last-resort safety in case both above missed
      //      anything during HMR remount or React Strict Mode
      //      double-effect-cycles.
      //
      // Plus: the same ResizeObserver as before, suppressed for
      // its priming callback, fires invalidateSize only on real
      // dimension deltas (orientation flip, iOS address-bar
      // collapse). The original preemptive RAF + 600ms invalidate
      // calls are removed — they could orphan in-flight tiles
      // by clearing GridLayer._tiles and were unnecessary now
      // that the safety net handles the orphan case directly.
      const ensureTileVisible = (img) => {
        if (!img || img.tagName !== "IMG") return;
        if (img.classList.contains("leaflet-tile-loaded")) return;
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add("leaflet-tile-loaded");
        }
      };

      const watchTile = (img) => {
        if (!img || img.tagName !== "IMG") return;
        if (!img.classList.contains("leaflet-tile")) return;
        ensureTileVisible(img);
        if (img.classList.contains("leaflet-tile-loaded")) return;
        const onLoad = () => ensureTileVisible(img);
        img.addEventListener("load", onLoad, { once: true });
        // Some browsers fire 'load' for cached images before
        // listener attaches. Re-check on the next microtask.
        queueMicrotask(() => ensureTileVisible(img));
      };

      const sweepContainer = () => {
        if (!containerRef.current) return;
        for (const img of containerRef.current.querySelectorAll(
          "img.leaflet-tile",
        )) {
          watchTile(img);
        }
      };

      // Layer 1: MutationObserver on the container.
      const tileObs = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (
              node.tagName === "IMG" &&
              node.classList?.contains("leaflet-tile")
            ) {
              watchTile(node);
            } else if (node.querySelectorAll) {
              for (const img of node.querySelectorAll("img.leaflet-tile")) {
                watchTile(img);
              }
            }
          }
        }
      });
      tileObs.observe(containerRef.current, {
        subtree: true,
        childList: true,
      });

      // Layer 2: initial sweep on next macrotask.
      const initialSweepTimer = setTimeout(sweepContainer, 0);

      // Layer 3: short polling fallback (5 passes, 200ms apart).
      let pollsLeft = 5;
      const pollTimer = setInterval(() => {
        sweepContainer();
        pollsLeft -= 1;
        if (pollsLeft <= 0) {
          clearInterval(pollTimer);
        }
      }, 200);

      // ResizeObserver for real dimension changes only.
      let ro = null;
      let oneTimeRaf = 0;
      const safeInvalidate = () => {
        if (mapRef.current) {
          try {
            mapRef.current.invalidateSize();
          } catch {
            /* map may already be removed */
          }
        }
      };

      const initW = containerRef.current.offsetWidth;
      const initH = containerRef.current.offsetHeight;
      if (initW === 0 || initH === 0) {
        // 0×0 case: no tiles requested yet, safe to invalidate.
        oneTimeRaf = requestAnimationFrame(safeInvalidate);
      }

      if (typeof ResizeObserver !== "undefined" && containerRef.current) {
        let lastW = initW;
        let lastH = initH;
        let primed = false;
        ro = new ResizeObserver((entries) => {
          if (!mapRef.current) return;
          const r = entries[0]?.contentRect;
          if (!r) return;
          const w = Math.round(r.width);
          const h = Math.round(r.height);
          if (!primed) {
            primed = true;
            lastW = w;
            lastH = h;
            return;
          }
          if (w === lastW && h === lastH) return;
          lastW = w;
          lastH = h;
          safeInvalidate();
          // After resize, Leaflet requests new tiles — sweep again
          // in case the safety net needs to rescue any of them.
          setTimeout(sweepContainer, 50);
          setTimeout(sweepContainer, 300);
        });
        ro.observe(containerRef.current);
      }

      map._gyInvalidateCleanup = () => {
        if (oneTimeRaf) cancelAnimationFrame(oneTimeRaf);
        if (ro) ro.disconnect();
        if (tileObs) tileObs.disconnect();
        clearTimeout(initialSweepTimer);
        clearInterval(pollTimer);
      };
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          mapRef.current._gyInvalidateCleanup?.();
        } catch {
          /* ignore */
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label, vesselName, variant]);

  // Render nothing if we don't have coordinates — keeps the
  // cabin layout pristine for cabins that haven't set a berth.
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Google Maps deep link — opens the real maps.google.com with a
  // pin at our coordinates. On iPhone, Google Maps app intercepts
  // the URL; if not installed, Apple Maps offers via the OS share
  // sheet. Either way the user lands in a "real" maps experience,
  // not on openstreetmap.org. Free, no API key — just a URL.
  const googleMapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <section className={`berth-map berth-map--${variant}`}>
      <div className="berth-map__inner">
        <div className="berth-map__head">
          <div className="berth-map__eyebrow">Where you&apos;ll find her</div>
          {label && <div className="berth-map__label">{label}</div>}
        </div>

        {/* 2026-05-23 — Inline style: belt-and-braces defence against
            any future luxury-layer rule that would put a transform on
            this container. Leaflet's tile positioning breaks if an
            ancestor or this container has a CSS transform. */}
        <div
          ref={containerRef}
          className="berth-map__canvas"
          style={{ transform: "none" }}
          aria-label={`Map showing the berth of ${vesselName || "your yacht"}`}
        />

        <div className="berth-map__actions">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="berth-map__open"
          >
            View on Google Maps
            <span aria-hidden="true" className="berth-map__open-arrow">↗</span>
          </a>
        </div>

        <p className="berth-map__note">
          <em>
            This is your vessel&apos;s current berth. The port authority
            may adjust the position at the marina&apos;s discretion -
            should that happen before embarkation, you&apos;ll hear it
            from us first.
          </em>
        </p>
      </div>

      <style>{`
        .berth-map {
          margin: 36px 0;
        }
        .berth-map__inner {
          background: #FAF7F0;
          border: 1px solid rgba(201, 168, 76, 0.28);
          border-radius: 6px;
          box-shadow:
            0 10px 32px rgba(13, 27, 42, 0.07),
            0 2px 6px rgba(13, 27, 42, 0.04);
          overflow: hidden;
        }
        .berth-map__head {
          padding: 28px 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
          font-size: 21px;
          line-height: 1.25;
          color: var(--gy-navy);
          text-transform: capitalize;
          letter-spacing: 0.2px;
        }
        .berth-map__canvas {
          width: 100%;
          /* 2026-05-23 - Audit pass: was a fixed 320px, which on
             iPhone SE2 (375×667) ate ~48% of viewport AFTER the user
             scrolled to it. clamp() respects small screens (min
             220px so the pin always has room) and grows up to 380px
             on tall screens - never more than 45% of viewport.
             2026-05-24 - Christos pass: explicit min-height + width
             belt-and-braces. If any future luxury rule shrinks the
             container, Leaflet still has a paintable canvas. */
          height: clamp(220px, 45vh, 380px);
          min-height: 220px;
          width: 100%;
          background: #e9e4d4;
          position: relative;
          display: block;
        }
        .berth-map--full .berth-map__canvas {
          height: 62vh;
          min-height: 420px;
        }
        .berth-map__actions {
          padding: 18px 30px;
          display: flex;
          justify-content: center;
          border-top: 1px solid rgba(13, 27, 42, 0.06);
          background: rgba(255, 255, 255, 0.45);
        }
        .berth-map__open {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 22px;
          border: 1px solid var(--gy-gold);
          color: var(--gy-navy);
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          font-weight: 600;
          background: transparent;
          transition: background 180ms ease, color 180ms ease,
                      box-shadow 180ms ease, transform 180ms ease;
        }
        .berth-map__open:hover,
        .berth-map__open:focus-visible {
          background: var(--gy-gold);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.32);
          transform: translateY(-1px);
        }
        .berth-map__open-arrow {
          font-size: 13px;
          line-height: 1;
          transform: translateY(-1px);
        }
        .berth-map__note {
          margin: 0;
          padding: 16px 30px 22px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.62);
          text-align: center;
          border-top: 1px solid rgba(13, 27, 42, 0.04);
        }
        @media (max-width: 560px) {
          .berth-map { margin: 28px 0; }
          .berth-map__head { padding: 22px 20px 16px; }
          .berth-map__label { font-size: 19px; }
          .berth-map__actions { padding: 14px 20px; }
          .berth-map__open { padding: 10px 18px; font-size: 10.5px; letter-spacing: 2px; }
          .berth-map__note { padding: 14px 20px 18px; font-size: 12px; }
        }
        /* Leaflet popup look - tighter, branded. */
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
        /* Leaflet attribution - legally required, visually deferred.
           Tiny, low-opacity, off-white background. The Google Maps
           CTA is the visible primary action; this is fine-print. */
        :global(.berth-map .leaflet-control-attribution) {
          font-size: 9px !important;
          padding: 2px 6px !important;
          background: rgba(255, 255, 255, 0.72) !important;
          color: rgba(13, 27, 42, 0.45) !important;
          font-family: var(--gy-font-ui) !important;
          letter-spacing: 0.3px !important;
        }
        :global(.berth-map .leaflet-control-attribution a) {
          color: rgba(13, 27, 42, 0.55) !important;
          text-decoration: none !important;
        }
        :global(.berth-map .leaflet-control-attribution a:hover) {
          color: rgba(13, 27, 42, 0.8) !important;
          text-decoration: underline !important;
        }
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
