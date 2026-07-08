// Phase 6 / H3 (Boss luxury rebuild brief, 2026-05-05) —
// Generative editorial cover image.
//
// Server-side rendered via Next.js ImageResponse (OG-image API). Free,
// zero-runtime-cost, edge-rendered. Gives every brief a personalised
// cover in the response page + share card — the "we made this just
// for you" wow moment Boss approved conditionally on quality.
//
// Output: 1200×630 PNG (standard OG / Twitter / iMessage size).
//
// Inputs (querystring):
//   ?name=Jane Doe
//   ?destination=Cyclades
//   ?yacht=Genny           (optional)
//   ?date=Aug 14, 2026     (optional)
//
// All inputs are sanitised and length-capped. Falls back to brand
// defaults when missing — the cover always renders.
//
// Boss directive: "yes if not cheap" — design uses Cormorant Garamond
// at huge size (Vogue cover scale), gold gradient over navy, minimal
// composition. No icons, no clip-art, no clutter.

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Helper — pull and sanitise a string param.
function param(searchParams, key, max = 60) {
  const raw = searchParams.get(key);
  if (!raw) return "";
  return String(raw).replace(/[<>]/g, "").trim().slice(0, max);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const name = param(searchParams, "name", 48);
  const destination = param(searchParams, "destination", 36) || "Greek Waters";
  const yacht = param(searchParams, "yacht", 28);
  const date = param(searchParams, "date", 24);

  // Greeting line tone — first-name-only when given a full name keeps
  // it warm without sounding formal.
  const firstName = name ? name.split(/\s+/)[0] : "";
  const greeting = firstName ? `For ${firstName}` : "Drafted on board";

  // Headline composition. We pick a verb-phrase per destination so the
  // same set of inputs always renders the same headline (deterministic
  // — good for caching / sharing). 4-5 words max for Vogue scale.
  const headline = (() => {
    const d = destination.toLowerCase();
    if (d.includes("cyclades")) return "A week through\nthe Cyclades.";
    if (d.includes("ionian")) return "An Ionian\nwhite-sail summer.";
    if (d.includes("saronic")) return "Saronic mornings.\nAthens never closer.";
    return `A week through\n${destination}.`;
  })();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 60%, #0D1B2A 100%)",
          position: "relative",
          fontFamily: "serif",
          padding: "70px 80px",
          color: "#F8F5F0",
        }}
      >
        {/* Top hairline — gold rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: "#C9A84C",
                borderRadius: 999,
                boxShadow: "0 0 0 6px rgba(201,168,76,0.18)",
                display: "block",
              }}
            />
            <div
              style={{
                color: "#C9A84C",
                fontSize: 18,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
              }}
            >
              George&nbsp;Yachts
            </div>
          </div>
          <div
            style={{
              color: "rgba(248,245,240,0.66)",
              fontSize: 16,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            {greeting}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Vogue-scale serif headline */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 300,
            lineHeight: 1.0,
            color: "#F8F5F0",
            letterSpacing: "-0.035em",
            whiteSpace: "pre-line",
            display: "block",
            maxWidth: 980,
          }}
        >
          {headline}
        </div>

        {/* Italic subline */}
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            fontStyle: "italic",
            color: "rgba(248,245,240,0.85)",
            fontWeight: 300,
            display: "block",
            maxWidth: 880,
            letterSpacing: "0.005em",
          }}
        >
          {yacht && date
            ? `Aboard ${yacht} · ${date}`
            : yacht
            ? `Aboard ${yacht}`
            : date
            ? `For ${date}`
            : "Drafted by George Biniaris, Managing Broker."}
        </div>

        {/* Spacer */}
        <div style={{ flex: 0.7, display: "flex" }} />

        {/* Footer credentials line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 28,
            borderTop: "1px solid rgba(201,168,76,0.32)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: "rgba(248,245,240,0.58)",
              fontSize: 17,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <span style={{ display: "block" }}>Featured in</span>
            <span
              style={{
                fontFamily: "Times New Roman, serif",
                fontWeight: 700,
                color: "#F8F5F0",
                letterSpacing: "-0.02em",
                fontSize: 22,
                display: "block",
              }}
            >
              Forbes
            </span>
            <span style={{ color: "rgba(201,168,76,0.55)", display: "block" }}>·</span>
            <span style={{ display: "block" }}>IYBA Charter Active Member</span>
          </div>
          <div
            style={{
              color: "rgba(248,245,240,0.45)",
              fontSize: 15,
              letterSpacing: "0.18em",
              fontStyle: "italic",
              display: "block",
            }}
          >
            georgeyachts.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
