// Dynamic Open Graph image generator.
// 2026-05-11 (Phase 7 follow-up). Returns a 1200x630 PNG per
// request with the title + eyebrow rendered in the Cinzel/Trajan
// brand voice. Used by the 130+ programmatic pages so each one
// has a distinct social-share image instead of the generic
// homepage fallback.
//
// Usage: <https://georgeyachts.com/api/og?title=Motor+Yacht+Charter+Mykonos&eyebrow=Motor+yacht+in+Mykonos>
// Cached at the edge for 1 hour.

import { ImageResponse } from "next/og";

export const runtime = "edge";

function clampLength(s, max) {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = clampLength(searchParams.get("title") || "George Yachts", 90);
    const eyebrow = clampLength((searchParams.get("eyebrow") || "Luxury Yacht Charter Greece").toUpperCase(), 50);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 60%, #08111c 100%)",
            fontFamily: "serif",
            padding: "60px 72px",
            position: "relative",
            color: "#F8F5F0",
          }}
        >
          {/* Top brand mark + Forbes credential strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 14,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,0.82)",
            }}
          >
            <span
              style={{
                fontFamily: "Times New Roman, serif",
                fontWeight: 700,
                letterSpacing: "0.02em",
                fontSize: 22,
                color: "#F8F5F0",
              }}
            >
              GEORGE YACHTS
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontFamily: "Times New Roman, serif",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  fontSize: 18,
                  color: "#F8F5F0",
                }}
              >
                Forbes
              </span>
              <span style={{ color: "#C9A84C" }}>· Featured</span>
            </span>
          </div>

          {/* Centre block — eyebrow + headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 1000,
            }}
          >
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 700,
                marginBottom: 18,
                display: "flex",
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                fontFamily: "Times New Roman, serif",
                fontSize: title.length > 50 ? 64 : 78,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#F8F5F0",
                fontWeight: 400,
                display: "flex",
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom — domain + gold accent line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(201,168,76,0.4)",
              paddingTop: 22,
            }}
          >
            <span
              style={{
                fontSize: 16,
                letterSpacing: "0.18em",
                color: "rgba(248,245,240,0.66)",
              }}
            >
              georgeyachts.com
            </span>
            <span
              style={{
                fontSize: 14,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 700,
              }}
            >
              IYBA · MYBA
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      },
    );
  } catch (err) {
    return new Response(`OG image generation failed: ${err.message}`, { status: 500 });
  }
}
