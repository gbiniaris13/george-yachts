// Email monogram seal.
//
// A small circular badge with the "GY" company cipher entwined inside,
// "GEORGE YACHTS" running around the perimeter, gold-on-cream. Designed
// to drop in next to the existing signature without competing with it.
//
// Bonus detail: George P. Biniaris's founder cipher (G·P·B) sits as a
// 9pt mark below the GY monogram — the kind of small mark a Pictet
// partner or a Rothschild partner stamps under the firm cipher to
// indicate which partner the letter is from. UHNW peers spot it; the
// firm crest does the heavy lifting for everyone else.
//
// Usage: https://georgeyachts.com/api/og/email-monogram
// Returns: 400x400 PNG. Cache: 30 days.

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const GOLD = "#C9A84C";
  const NAVY = "#0D1B2A";
  const CREAM = "#FAF8F3";

  return new ImageResponse(
    (
      <div
        style={{
          width: 400,
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
        }}
      >
        {/* Outer gold ring */}
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner thin ring */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              bottom: 16,
              border: `1px solid ${GOLD}`,
              borderRadius: "50%",
              opacity: 0.4,
              display: "flex",
            }}
          />

          {/* Top text: GEORGE */}
          <div
            style={{
              position: "absolute",
              top: 34,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              fontFamily: "Times New Roman, serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.45em",
              color: NAVY,
            }}
          >
            <span>GEORGE</span>
          </div>

          {/* Bottom text: YACHTS */}
          <div
            style={{
              position: "absolute",
              bottom: 34,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              fontFamily: "Times New Roman, serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.45em",
              color: NAVY,
            }}
          >
            <span>YACHTS</span>
          </div>

          {/* Left ornament */}
          <div
            style={{
              position: "absolute",
              left: 56,
              top: "50%",
              transform: "translateY(-50%)",
              color: GOLD,
              fontSize: 18,
              display: "flex",
            }}
          >
            <span>✦</span>
          </div>
          {/* Right ornament */}
          <div
            style={{
              position: "absolute",
              right: 56,
              top: "50%",
              transform: "translateY(-50%)",
              color: GOLD,
              fontSize: 18,
              display: "flex",
            }}
          >
            <span>✦</span>
          </div>

          {/* Center monogram: GY entwined */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Times New Roman, serif",
                fontWeight: 700,
                fontSize: 134,
                color: NAVY,
                letterSpacing: "-0.06em",
                lineHeight: 1,
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <span style={{ color: NAVY }}>G</span>
              <span style={{ color: GOLD, marginLeft: -22, marginTop: 14 }}>Y</span>
            </div>
            {/* Founder cipher (GPB) under the monogram */}
            <div
              style={{
                marginTop: 6,
                fontFamily: "Times New Roman, serif",
                fontSize: 12,
                letterSpacing: "0.4em",
                color: GOLD,
                opacity: 0.85,
                display: "flex",
              }}
            >
              <span>G · P · B</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 400,
      headers: {
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, immutable",
      },
    },
  );
}
