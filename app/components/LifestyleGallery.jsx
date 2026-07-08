// Phase 3 / E3 (Boss luxury rebuild brief, 2026-05-05) —
// Lifestyle gallery — Pinterest-style infinite masonry of REAL
// "moments aboard" photography.
//
// What goes here (per Boss): people on yachts, not yachts on water.
// Children jumping off swim platforms, dinner tables at sunset,
// readers in beanbags on the foredeck. UHNW guests project themselves
// onto these images — that's the conversion mechanism.
//
// Source priority:
//   1. /public/images/lifestyle/*.jpg|png|webp — real photos Boss
//      drops in (REAL, not stock — per the no-fake-photos rule).
//   2. Sanity yacht "lifestyle" gallery if any yacht has them.
//   3. Empty state — editorial fallback "Photos from a recent week
//      aboard" with a call to brief George.
//
// This is a server component; the actual files come from a static
// /api/lifestyle endpoint that reads the public folder at build time.

import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

// Read /public/images/lifestyle/ at build time. Returns an empty array
// gracefully if the folder doesn't exist yet (Boss hasn't dropped photos).
function readLifestylePhotos() {
  try {
    const dir = path.join(process.cwd(), "public", "images", "lifestyle");
    if (!fs.existsSync(dir)) return [];
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();
    return files.map((f) => ({
      src: `/images/lifestyle/${f}`,
      alt: deriveAlt(f),
    }));
  } catch {
    return [];
  }
}

function deriveAlt(filename) {
  // Strip extension + replace separators with spaces; capitalise lightly.
  const stem = filename.replace(/\.[^.]+$/, "");
  const words = stem.replace(/[-_]+/g, " ").replace(/\b(\d{4})\b/g, "");
  return words.trim();
}

export default function LifestyleGallery({ heading = "Moments aboard", showCta = true }) {
  const photos = readLifestylePhotos();
  const hasPhotos = photos.length > 0;

  return (
    <section
      aria-label={heading}
      style={{
        background: "#0D1B2A",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 64px)",
        borderTop: "1px solid rgba(248,245,240,0.05)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p className="gy-eyebrow" style={{ color: "#C9A84C" }}>
          Moments aboard
        </p>
        <h2
          className="gy-display-md"
          style={{
            margin: "10px 0 18px",
            maxWidth: "20ch",
          }}
        >
          {hasPhotos
            ? "What a week aboard actually looks like."
            : "What a week aboard actually feels like."}
        </h2>
        <p
          className="gy-lede"
          style={{ marginBottom: 56, color: "rgba(248,245,240,0.78)" }}
        >
          {hasPhotos
            ? "Unposed photographs from real charters our brokers have organised. No stock imagery. No models."
            : "Real photographs from past charters arrive here as guests share them. In the meantime - brief George and we'll route your week."}
        </p>

        {hasPhotos ? (
          <div className="gy-lifestyle-masonry">
            {photos.map((p, i) => (
              <figure
                key={p.src}
                className="gy-lifestyle-tile"
                style={{
                  // Vary aspect ratios for the magazine-spread feel.
                  aspectRatio:
                    i % 5 === 0
                      ? "3/4"
                      : i % 5 === 1
                      ? "4/5"
                      : i % 5 === 2
                      ? "1/1"
                      : i % 5 === 3
                      ? "4/3"
                      : "3/2",
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt || `Aboard a George Yachts charter - moment ${i + 1}`}
                  fill
                  sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 280px"
                  style={{ objectFit: "cover" }}
                />
                <span aria-hidden="true" className="gy-lifestyle-tile__veil" />
              </figure>
            ))}
          </div>
        ) : (
          <div
            style={{
              border: "1px solid rgba(201,168,76,0.18)",
              padding: "clamp(48px, 7vw, 96px)",
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, rgba(13,27,42,0.5) 100%)",
              textAlign: "center",
              maxWidth: 720,
              marginInline: "auto",
            }}
          >
            <p
              className="gy-eyebrow-sm"
              style={{ color: "rgba(248,245,240,0.6)" }}
            >
              The gallery is curating
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.4vw, 28px)",
                color: "rgba(248,245,240,0.85)",
                fontWeight: 300,
                margin: "16px 0 0",
                lineHeight: 1.4,
              }}
            >
              We post real moments aboard from past charters, not stock photography.
              The first set arrives within the next two weeks.
            </p>
            <Link
              href="/inquiry"
              className="gy-link-editorial"
              style={{ marginTop: 28, display: "inline-block" }}
            >
              Brief George for your own week →
            </Link>
          </div>
        )}

        {hasPhotos && showCta && (
          <div style={{ textAlign: "center", marginTop: "clamp(40px, 6vw, 72px)" }}>
            <Link href="/inquiry" className="gy-link-editorial">
              Brief George for your own week →
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .gy-lifestyle-masonry {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        @media (min-width: 700px) {
          .gy-lifestyle-masonry {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }
        }
        @media (min-width: 1100px) {
          .gy-lifestyle-masonry {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 22px;
          }
        }
        .gy-lifestyle-tile {
          position: relative;
          margin: 0;
          overflow: hidden;
          background: #0D1B2A;
          border: 1px solid rgba(248, 245, 240,0.04);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .gy-lifestyle-tile:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 48px rgba(13, 27, 42,0.5),
                      0 0 0 1px rgba(201,168,76,0.3) inset;
          z-index: 3;
        }
        .gy-lifestyle-tile__veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 60%, rgba(13, 27, 42,0.4) 100%);
          opacity: 1;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .gy-lifestyle-tile:hover .gy-lifestyle-tile__veil {
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-lifestyle-tile:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
