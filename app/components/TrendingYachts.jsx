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
import Image from "next/image";
import { useRef } from "react";
import { priceUnitBadge, isPerPerson, sortAllFleet } from "@/lib/pricing";
import { sanityCardImg } from "@/lib/sanity-image";
import { useI18n } from "@/lib/i18n/I18nProvider";

const GOLD = "#C9A84C";

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
  const { t } = useI18n();
  const scrollerRef = useRef(null);

  // Carousel shows the first 6. The home page passes up to 8 so
  // entries 6 and 7 are reserved for the InlineYachtStrip spotlights
  // — keeping carousel + spotlight from showing the same yacht twice.
  //
  // B.3 (Roberto brief): sort the carousel so per-yacht cards group
  // first, then per-person — never alternating. UHNW reads "€235K"
  // adjacent to "€420" as price chaos unless explicit unit context.
  const list = (Array.isArray(yachts) ? yachts.filter((y) => y && y.slug) : [])
    .slice()
    .sort(sortAllFleet)
    .slice(0, 6);
  if (list.length < 3) return null;

  return (
    <section
      aria-label="Trending yachts"
      style={{
        position: "relative",
        background: "#0D1B2A",
        padding: "60px 0 70px",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
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
              fontFamily: "var(--gy-font-ui)",
              fontSize: "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 8px 0",
            }}
          >
            {t("trending.eyebrow", "Curated by George")}
          </p>
          {/* B.3 (Roberto brief): "Trending Now" reads consumer-app to
              UHNW. Replaced with the editorial "This Week's Selection"
              — same content, the right register for the audience. */}
          <h2
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              color: "#F8F5F0",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            {t("trending.title", "This Week’s Selection")}
          </h2>
        </div>
        <Link
          href="/charter-yacht-greece"
          style={{
            fontFamily: "var(--gy-font-ui)",
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
          {t("trending.viewAll", "View All →")}
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
                background: "rgba(248, 245, 240,0.02)",
                border: "1px solid rgba(248, 245, 240,0.08)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "transform 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(248, 245, 240,0.08)";
              }}
            >
              {/* Image — A.11: served through the Sanity image helper
                  so we get WebP at the actual rendered width (640w
                  retina-safe for a 320px card), not the raw 2000+px
                  source. */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: "#0D1B2A",
                  overflow: "hidden",
                }}
              >
                {y.image && (
                  <Image
                    src={sanityCardImg(y.image, 640)}
                    alt={`${y.name} - luxury yacht charter in Greece`}
                    fill
                    sizes="(max-width: 768px) 80vw, 320px"
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              {/* Body */}
              <div style={{ padding: "16px 18px 20px" }}>
                <p
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: "20px",
                    color: "#F8F5F0",
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
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                      color: "rgba(248, 245, 240,0.55)",
                      margin: "0 0 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {specs}
                  </p>
                )}
                {price && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {/* B.3 + 0.7: unit badge above every price. Without
                        this, per-yacht (€235K) and per-person (€420)
                        prices read as inconsistent within the same
                        carousel even when the values are correct. */}
                    <span
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: "8px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: isPerPerson(y) ? "rgba(248, 245, 240,0.65)" : GOLD,
                        fontWeight: 600,
                      }}
                    >
                      {priceUnitBadge(y)}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: "12px",
                        color: GOLD,
                        margin: 0,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {price}
                    </p>
                  </div>
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
        /* Phase 7 (luxury rebuild) — TrendingYachts cards inherit the F5
           3D tilt + gold border lift on hover, so the homepage carousel
           reads as cinematic instead of catalog. Skipped on touch +
           reduced-motion. */
        .gy-trending-card {
          transform-style: preserve-3d;
          perspective: 1200px;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        @media (hover: hover) and (min-width: 700px) {
          .gy-trending-card:hover {
            transform: perspective(1200px) rotateX(2deg) rotateY(-3deg) translateY(-6px);
            box-shadow:
              0 28px 60px rgba(13, 27, 42, 0.55),
              0 0 0 1px rgba(201, 168, 76, 0.32) inset;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-trending-card,
          .gy-trending-card:hover { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
