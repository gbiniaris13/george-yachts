// app/components/cabin/VoyageCarousel.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 4 (George):
//   "Εκεί που τελειώνουν τα τετραγωνάκια κάτω από το Add to Phone,
//    θέλω να υπάρχουν σε καρουζέλ είτε κάποιες είτε όλες οι
//    φωτογραφίες των ταξιδιών τους. Είναι πιο όμορφο."
//
// Pulls the LATEST 8 photos from /api/cabin/voyage-album (active
// cabin only — signed URLs, expire in 1h) and renders them as a
// horizontally-scrollable carousel. Quietly renders nothing if
// the cabin has no photos yet (most pre-voyage cases).
//
// Touch + mouse scroll work natively via CSS scroll-snap; no
// drag library, no JS animation. Lightweight on the client.
// =============================================================
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MAX_TILES = 8;

export default function VoyageCarousel() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/voyage-album")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const all = Array.isArray(j?.items) ? j.items : [];
        // Latest first (API already returns desc by created_at).
        // Filter out videos — carousel is for stills.
        const stills = all.filter(
          (it) => !/\.(mp4|mov|webm|m4v)$/i.test(it.storage_path || "")
        );
        setItems(stills.slice(0, MAX_TILES));
      })
      .catch(() => setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) return null;          // first paint, no skeleton
  if (items.length === 0) return null;      // pre-voyage / no photos

  return (
    <section className="voyage-carousel">
      <div className="voyage-carousel__head">
        <div>
          <div className="voyage-carousel__eyebrow">From your voyage</div>
          <h2 className="voyage-carousel__title">A handful of moments.</h2>
        </div>
        <Link href="/cabin/voyage-album" className="voyage-carousel__more">
          See all →
        </Link>
      </div>
      <ul className="voyage-carousel__rail">
        {items.map((it) => (
          <li key={it.id} className="voyage-carousel__tile">
            <a href={it.url} target="_blank" rel="noopener noreferrer">
              {/* No next/image — these are signed temporary URLs, not
                  a known origin from next.config remotePatterns. Plain
                  <img> avoids the rewrite pipeline. */}
              <img
                src={it.url}
                alt={it.caption || "Voyage moment"}
                loading="lazy"
              />
              {it.caption && (
                <figcaption className="voyage-carousel__caption">
                  {it.caption}
                </figcaption>
              )}
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .voyage-carousel {
          margin-top: 8px;
        }
        .voyage-carousel__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 14px;
        }
        .voyage-carousel__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.88);
          font-weight: 600;
        }
        .voyage-carousel__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 22px;
          margin: 4px 0 0 0;
          color: var(--gy-navy);
        }
        .voyage-carousel__more {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gy-gold);
          text-decoration: none;
        }
        .voyage-carousel__more:hover { color: var(--gy-navy); }

        .voyage-carousel__rail {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 6px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
        .voyage-carousel__rail::-webkit-scrollbar { height: 6px; }
        .voyage-carousel__rail::-webkit-scrollbar-thumb {
          background: rgba(13, 27, 42, 0.18);
          border-radius: 3px;
        }
        .voyage-carousel__tile {
          flex: 0 0 auto;
          scroll-snap-align: start;
          width: 220px;
          aspect-ratio: 4 / 3;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          overflow: hidden;
          position: relative;
        }
        @media (min-width: 768px) {
          .voyage-carousel__tile { width: 260px; }
        }
        .voyage-carousel__tile a {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .voyage-carousel__tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 320ms ease;
        }
        .voyage-carousel__tile a:hover img {
          transform: scale(1.03);
        }
        .voyage-carousel__caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12px;
          color: #ffffff;
          background: linear-gradient(
            to top,
            rgba(13, 27, 42, 0.7) 0%,
            rgba(13, 27, 42, 0) 100%
          );
          padding: 16px 10px 8px 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
}
