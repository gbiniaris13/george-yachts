// Tier 1.1 — Forbes Top Bar (Roberto Forbes integration brief, May 2026).
//
// Status: George Yachts featured in Forbes — 1 May 2026.
// Article: How The Wealthy Are Hedging For Instability
// Author: Jacques Ledbetter, Forbes Contributor
// URL: https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/
//
// Constraints from the brief:
//   • Server-rendered (NOT client-only) — Googlebot + ChatGPT +
//     Perplexity + Claude must see the Forbes mention without JS.
//   • Sticky top, 36px desktop / 32px mobile.
//   • Background #0D1B2A, bottom border 1px solid #C9A84C @ 30%.
//   • Forbes wordmark = text-based, Times Bold 14px, ivory.
//   • Click anywhere → opens article in new tab (target="_blank",
//     rel="noopener noreferrer").
//   • Dismissible via × button, sets `gy_forbes_bar_dismissed` cookie
//     for 90 days.
//   • Identity rules unchanged: "As Featured in Forbes" only — never
//     "Forbes Verified / Approved / Recommended".
//   • George Yachts logo always ≥ Forbes mark on same screen.
//
// Architecture:
//   • Server Component (no JS, no client interactivity).
//
// 2026-05-08 (Chapter 01) — Boss directive: the Forbes feature is the
// site's strongest credential, so the bar is no longer dismissible.
// The × button + cookie check were both pulled. The bar always
// renders. Anyone who wants the Forbes context not to occupy the top
// 36 px can scroll — the rest of the page sits below as before.

import Link from "next/link";

const ARTICLE_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function ForbesTopBar() {
  return (
    <div
      role="region"
      aria-label="George Yachts featured in Forbes — May 2026"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        height: 36,
        background: "#0D1B2A",
        borderBottom: "1px solid rgba(201,168,76,0.3)",
        color: "#F8F5F0",
        display: "flex",
        alignItems: "center",
        fontFamily: "'Montserrat', sans-serif",
      }}
      className="gy-forbes-bar"
    >
      <Link
        href={ARTICLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={false}
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          textDecoration: "none",
          color: "inherit",
          padding: "0 56px 0 16px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
        data-cursor="Read"
      >
        {/* Forbes wordmark — text-based, Times Bold, intentionally
            sized smaller than the George Yachts header logo so the
            brand-equality rule from the brief holds. */}
        <span
          aria-label="Forbes"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.02em",
            color: "#F8F5F0",
          }}
        >
          Forbes
        </span>

        <span aria-hidden="true" style={{ color: "#C9A84C" }}>•</span>

        {/* Desktop content */}
        <span
          className="gy-forbes-bar__desktop"
          style={{
            fontSize: 11,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#F8F5F0",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          As Featured · 1 May 2026
        </span>

        <span aria-hidden="true" className="gy-forbes-bar__desktop" style={{ color: "#C9A84C" }}>•</span>

        <span
          className="gy-forbes-bar__desktop"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "#F8F5F0",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          How The Wealthy Are Hedging For Instability
        </span>

        {/* Mobile content (shorter) */}
        <span
          className="gy-forbes-bar__mobile"
          style={{
            fontSize: 10,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#F8F5F0",
          }}
        >
          As Featured · May 2026
        </span>

        <span
          aria-label="Read the feature on Forbes"
          className="gy-forbes-bar__desktop"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 600,
            marginLeft: 6,
            whiteSpace: "nowrap",
          }}
        >
          Read the feature →
        </span>
        <span
          aria-hidden="true"
          className="gy-forbes-bar__mobile"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: "#C9A84C",
            fontWeight: 600,
            marginLeft: 4,
          }}
        >
          →
        </span>
      </Link>

      {/* 2026-05-08 — × dismiss button removed (see Chapter 01 note
          at the top). The Forbes credential always shows. */}

      {/* Inline responsive rules — flips desktop/mobile copy and
          tightens spacing under 600px so the bar never wraps. */}
      <style>{`
        .gy-forbes-bar__mobile { display: none; }
        @media (max-width: 700px) {
          .gy-forbes-bar { height: 32px !important; }
          .gy-forbes-bar__desktop { display: none !important; }
          .gy-forbes-bar__mobile { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
