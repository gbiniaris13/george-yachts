"use client";

// InlineYachtStrip (Roberto 2026-05-02 — Site UX Batch 4)
//
// A thin horizontal yacht "spotlight" inserted between editorial
// sections (YourBroker, Filotimon, BrokerTestimonials). Per GA4
// the homepage was almost entirely text + brand storytelling below
// the FleetCTAs split-screen — visitors who scrolled past fleet had
// no yacht visuals to pull them back to inventory. This strip
// reintroduces a single yacht card every couple of sections without
// touching the editorial copy itself.
//
// Renders nothing if no yacht is provided (so a Sanity miss doesn't
// blow a hole in the page).

import Link from "next/link";

const GOLD = "#DAA520";

function priceLabel(weeklyRatePrice) {
  if (!weeklyRatePrice) return null;
  const s = String(weeklyRatePrice);
  if (s.includes("€") || s.toLowerCase().includes("week")) return s;
  const n = Number(s.replace(/[^\d]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n >= 1000 ? `From €${Math.round(n / 1000)}K/week` : `From €${n.toLocaleString()}/week`;
}

export default function InlineYachtStrip({ yacht, eyebrow }) {
  if (!yacht || !yacht.slug) return null;
  const href = `/yachts/${yacht.slug}`;
  const price = priceLabel(yacht.weeklyRatePrice);
  const specs = [yacht.length, yacht.sleeps ? `${yacht.sleeps} guests` : null]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <section
      style={{
        background: "#000",
        padding: "44px 24px",
      }}
    >
      <Link
        href={href}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(200px, 1fr) 2fr",
          gap: "24px",
          alignItems: "stretch",
          textDecoration: "none",
          color: "inherit",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(218,165,32,0.18)",
          borderRadius: "10px",
          overflow: "hidden",
          transition: "border-color 0.4s ease, transform 0.4s ease",
        }}
        className="gy-inline-yacht-strip"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(218,165,32,0.45)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(218,165,32,0.18)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div
          aria-hidden={!yacht.image}
          style={{
            minHeight: "180px",
            background: yacht.image
              ? `#0a0a0a url(${yacht.image}) center/cover no-repeat`
              : "#0a0a0a",
          }}
        />
        {/* Body */}
        <div
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {eyebrow ?? "Editor's Pick"}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(22px, 3.3vw, 32px)",
              color: "#fff",
              margin: 0,
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            {yacht.name}
          </p>
          {specs && (
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
              }}
            >
              {specs}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {price && (
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "12px",
                  color: GOLD,
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                {price}
              </p>
            )}
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#fff",
                fontWeight: 600,
                paddingBottom: "2px",
                borderBottom: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              View Yacht →
            </span>
          </div>
        </div>
      </Link>

      {/* Stack on narrow screens */}
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.gy-inline-yacht-strip) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
