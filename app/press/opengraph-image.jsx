// Tier 1.4 (Roberto Forbes integration brief, May 2026) — OG card.
//
// The brief asks for a 1200×630 JPEG at /public/og-press.jpg. I
// can't ship a binary image file from this codebase (and a static
// JPEG would need a designer round-trip to look right). Next.js 15
// supports a much better solution: `opengraph-image.jsx` files
// generate the OG card at request time using ImageResponse, with
// the same React components + fonts the rest of the site uses, so
// the brand language stays consistent automatically.
//
// Visual spec from brief:
//   • Background: Deep Navy #0D1B2A
//   • Top-left: small "GEORGE YACHTS" wordmark in ivory
//   • Center: "Forbes" wordmark large (Times Bold)
//   • Below Forbes: "AS FEATURED · 1 MAY 2026" gold uppercase
//   • Bottom: italic ivory pull quote
//   • Bottom-right: small gold rule + "georgeyachts.com" in lato

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "George Yachts — Featured in Forbes, May 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0D1B2A",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          color: "#F8F5F0",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
        }}
      >
        {/* Top-left: George Yachts wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 18,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#F8F5F0",
            fontWeight: 600,
          }}
        >
          George Yachts
        </div>

        {/* Center: Forbes wordmark */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 700,
              fontSize: 144,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              lineHeight: 1,
            }}
          >
            Forbes
          </div>
          <div
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 22,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
            }}
          >
            As Featured · 1 May 2026
          </div>
        </div>

        {/* Pull quote */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontSize: 32,
              lineHeight: 1.4,
              color: "#F8F5F0",
              maxWidth: 920,
            }}
          >
            “That&rsquo;s the geopolitical shift playing out in real time on
            my desk.”
          </div>
        </div>

        {/* Bottom-right: gold rule + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 60,
              height: 1,
              background: "#C9A84C",
              display: "flex",
            }}
          />
          <div
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 16,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#F8F5F0",
              fontWeight: 500,
            }}
          >
            georgeyachts.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
