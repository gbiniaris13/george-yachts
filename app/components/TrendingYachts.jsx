"use client";

// TrendingYachts (Roberto 2026-05-02 — Site UX Batch 3)
//
// Horizontal scrollable carousel of 6-8 actual yachts shown right
// below the hero, BEFORE the FleetCTAs split-screen. Per GA4 the
// homepage gets 71% of all traffic but only 1.5% of visitors reach
// a fleet page and 0% reach a yacht detail page. The split-screen
// "pick a category" step is friction for cold-outreach traffic
// who just want to SEE yachts. This carousel surfaces real yacht
// cards immediately — one tap takes them to a yacht detail page.
//
// Data: server-fetched in app/page.jsx and passed as props. Each
// yacht needs at least { name, slug, weeklyRatePrice, image,
// sleeps, length }. Renders nothing if the list is empty (so the
// page still flows when Sanity is empty / errors).
//
// Layout:
//   • Mobile  → snap-scroll horizontal, ~80vw cards
//   • Desktop → 4 cards visible, native horizontal scroll with
//               edge fades to hint there's more to swipe
//   • Each card: hero image, name, length · sleeps · price/wk

import Link from "next/link";
import { useRef } from "react";

const GOLD = "#DAA520";

function formatPrice(weeklyRatePrice) {
  if (!weeklyRatePrice) return null;
  // Sanity stores it as text like "€85,000/week" — pass through if
  // it already has a € sign, otherwise format the number.
  const s = String(weeklyRatePrice);
  if (s.includes("€") || s.toLowerCase().includes("week")) return s;
  const n = Number(s.replace(/[^\d]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1000) return `€${Math.round(n / 1000)}K/wk`;
  return `€${n.toLocaleString()}/wk`;
}

export default function TrendingYachts({ yachts }) {
  const scrollerRef = useRef(null);

  // Carousel shows the first 6. The home page passes up to 8 so
  // entries 6 and 7 are reserved for the InlineYachtStrip spotlights
  // — keeping carousel + spotlight from showing the same yacht twice.
  const list = (Array.isArray(yachts) ? yachts.filter((y) => y && y.slug) : []).slice(0, 6);
  if (list.length < 3) return null;

  return (
    <section
      aria-label="Trending yachts"
      style={{
        position: "relative",
        background: "#000",
        padding: "60px 0 70px",
        borderTop: "1px solid rgba(218,165,32,0.12)",
        borderBottom: "1px solid rgba(218,165,32,0.12)",
      }}
    >
      {/* Heading */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto 28px",
          padding: "0 24px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 8px 0",
            }}
          >
            Trending Now
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              color: "#fff",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            See What&rsquo;s Sailing
          </h2>
        </div>
        <Link
          href="/charter-yacht-greece"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
            textDecoration: "none",
            paddingBottom: "2px",
            borderBottom: `1px solid ${GOLD}`,
          }}
        >
          View All →
        </Link>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="gy-trending-scroller"
        style={{
          display: "flex",
          gap: "16px",
          padding: "0 24px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {list.map((y) => {
          const href = `/yachts/${y.slug}`;
          const price = formatPrice(y.weeklyRatePrice);
          const specs = [y.length, y.sleeps ? `${y.sleeps} guests` : null]
            .filter(Boolean)
            .join("  ·  ");
          return (
            <Link
              key={y.slug}
              href={href}
              className="gy-trending-card"
              style={{
                flex: "0 0 auto",
                width: "min(78vw, 320px)",
                scrollSnapAlign: "start",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "transform 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(218,165,32,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: y.image
                    ? `#0a0a0a url(${y.image}) center/cover no-repeat`
                    : "#0a0a0a",
                }}
                aria-hidden={!y.image}
              />
              {/* Body */}
              <div style={{ padding: "16px 18px 20px" }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "20px",
                    color: "#fff",
                    margin: "0 0 6px",
                    fontWeight: 400,
                    lineHeight: 1.15,
                  }}
                >
                  {y.name}
                </p>
                {specs && (
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.55)",
                      margin: "0 0 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {specs}
                  </p>
                )}
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
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .gy-trending-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
