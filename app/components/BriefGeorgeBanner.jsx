// Phase 2 / B1 (Boss luxury rebuild brief, 2026-05-05) -
// "Brief George" banner sitting alongside fleet filters.
//
// Boss directive: keep filters AS IS - don't replace with AI quiz -
// but add a parallel path where UHNW guests who don't want to filter
// can brief the broker directly. Boutique brokerage tone: "we'll come
// back to you personally" not "fill out this form".
//
// Click target = the existing /inquiry flow, which already collects
// the 6 Boss fields (When / Who / Where / What excites / Budget /
// Special occasion). NO AI in the response loop - broker writes the
// proposal personally.
//
// Server component - no JS payload.

import Link from "next/link";

export default function BriefGeorgeBanner() {
  return (
    <section
      aria-label="Brief George directly"
      style={{
        position: "relative",
        padding: "clamp(28px, 4vw, 44px) clamp(24px, 5vw, 56px)",
        background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(13,27,42,0.6) 100%)",
        borderTop: "1px solid rgba(201,168,76,0.18)",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        {/* Left - narrative */}
        <div style={{ flex: "1 1 360px", minWidth: 280 }}>
          <p
            className="gy-eyebrow-sm"
            style={{ margin: 0, color: "#C9A84C" }}
          >
            Or skip the filters
          </p>
          <h2
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontWeight: 300,
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#F8F5F0",
              margin: "10px 0 8px",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Tell us about your week - <em style={{ color: "#C9A84C", fontStyle: "italic" }}>George replies personally</em>.
          </h2>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 14,
              color: "rgba(248,245,240,0.72)",
              fontWeight: 300,
              margin: 0,
              maxWidth: "60ch",
              lineHeight: 1.55,
            }}
          >
            A short brief - when, who, where, your style, your budget,
            any special occasion. We'll come back with the three yachts our
            brokers would actually pick for your week. No AI proposals -
            just real human curation from inside the Greek charter network.
          </p>
        </div>

        {/* Right - CTA */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <Link
            href="/inquiry"
            data-cursor="Brief"
            className="gy-shimmer-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 30px",
              minHeight: 56,
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#0D1B2A",
              textDecoration: "none",
              background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 100%)",
              border: "1px solid #C9A84C",
              boxShadow: "0 12px 32px rgba(201,168,76,0.22)",
              transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s ease",
            }}
          >
            <span>Brief George</span>
            <svg width="14" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="0" y1="5" x2="20" y2="5" />
              <polyline points="15 1 21 5 15 9" fill="none" />
            </svg>
          </Link>
          <span
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              color: "rgba(248,245,240,0.5)",
              fontStyle: "italic",
              letterSpacing: "0.04em",
            }}
          >
            ~2 minutes · Reply within 24 hours
          </span>
        </div>
      </div>
    </section>
  );
}
