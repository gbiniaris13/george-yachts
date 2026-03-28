import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "George Yachts Brokerage House — Luxury Yacht Charter in Greek Waters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Top gold line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#DAA520",
            marginBottom: "32px",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          EXCLUSIVELY GREEK WATERS
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "#ffffff",
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          GEORGE YACHTS
        </div>

        {/* Gold line */}
        <div
          style={{
            width: "120px",
            height: "1px",
            background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
            margin: "20px 0",
          }}
        />

        {/* LLC */}
        <div
          style={{
            fontSize: "18px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#DAA520",
            fontFamily: "sans-serif",
            fontWeight: 400,
            marginBottom: "40px",
          }}
        >
          BROKERAGE HOUSE LLC
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "sans-serif",
            fontWeight: 300,
          }}
        >
          Luxury Yacht Charter · Greek Waters
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
          }}
        />

        {/* Corner accents */}
        <div style={{ position: "absolute", top: "24px", left: "24px", width: "40px", height: "40px", borderTop: "1px solid rgba(218,165,32,0.3)", borderLeft: "1px solid rgba(218,165,32,0.3)" }} />
        <div style={{ position: "absolute", top: "24px", right: "24px", width: "40px", height: "40px", borderTop: "1px solid rgba(218,165,32,0.3)", borderRight: "1px solid rgba(218,165,32,0.3)" }} />
        <div style={{ position: "absolute", bottom: "24px", left: "24px", width: "40px", height: "40px", borderBottom: "1px solid rgba(218,165,32,0.3)", borderLeft: "1px solid rgba(218,165,32,0.3)" }} />
        <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "40px", height: "40px", borderBottom: "1px solid rgba(218,165,32,0.3)", borderRight: "1px solid rgba(218,165,32,0.3)" }} />
      </div>
    ),
    { ...size }
  );
}
