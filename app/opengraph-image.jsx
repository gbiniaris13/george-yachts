import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "George Yachts - Featured in Forbes · Luxury Yacht Charter Greece";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Phase 20 (luxury rebuild, 2026-05-05) — Forbes launch tomorrow.
// The OG image is what shows the moment Boss's followers share the
// Forbes feature link. It MUST broadcast: brand mark + Forbes
// credential + Greek waters specialty in one frame, in the same
// Cinzel/Trajan visual language as the live site.

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 60%, #0D1B2A 100%)",
          fontFamily: "serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Top thin Forbes-style strip */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: "10%",
            right: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "#F8F5F0",
            fontSize: 16,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              fontFamily: "Times New Roman, serif",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: 22,
              color: "#F8F5F0",
              display: "block",
            }}
          >
            Forbes
          </span>
          <span style={{ color: "#C9A84C", display: "block" }}>·</span>
          <span style={{ display: "block", color: "rgba(248,245,240,0.85)" }}>As Featured · May 2026</span>
        </div>

        {/* Decorative top gold rule */}
        <div
          style={{
            position: "absolute",
            top: 84,
            left: "30%",
            right: "30%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
          }}
        />

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Brand wordmark — Cinzel feel via heavy serif caps */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "#F8F5F0",
            textTransform: "uppercase",
            lineHeight: 1,
            textAlign: "center",
            display: "block",
          }}
        >
          George&nbsp;Yachts
        </div>

        {/* Gold rule + LLC line */}
        <div
          style={{
            width: 120,
            height: 1,
            background: "linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)",
            margin: "26px 0",
          }}
        />

        <div
          style={{
            fontSize: 17,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontFamily: "sans-serif",
            fontWeight: 600,
            display: "block",
          }}
        >
          Brokerage House · Wyoming LLC
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 24,
            fontStyle: "italic",
            color: "rgba(248,245,240,0.78)",
            fontFamily: "Georgia, serif",
            marginTop: 32,
            textAlign: "center",
            display: "block",
          }}
        >
          Boutique luxury yacht charter - exclusively Greek waters.
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Bottom credentials line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "rgba(248,245,240,0.66)",
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 500,
          }}
        >
          <span style={{ display: "block" }}>IYBA Charter Active Member</span>
          <span style={{ color: "rgba(201,168,76,0.5)", display: "block" }}>·</span>
          <span style={{ display: "block" }}>MYBA-standard contracts</span>
          <span style={{ color: "rgba(201,168,76,0.5)", display: "block" }}>·</span>
          <span style={{ display: "block" }}>georgeyachts.com</span>
        </div>

        {/* Bottom gold rule */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "30%",
            right: "30%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />

        {/* Corner accents */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 50, height: 50, borderTop: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 50, height: 50, borderTop: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 50, height: 50, borderBottom: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 50, height: 50, borderBottom: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />
      </div>
    ),
    { ...size }
  );
}
