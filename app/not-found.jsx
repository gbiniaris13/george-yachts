// Phase 6 (luxury rebuild, 2026-05-05) — cinematic /404 page.
//
// 404 pages are a brand opportunity. UHNW visitors who hit one usually
// arrived from an old link, an outdated bookmark, or a typo — that's
// the moment a multi-billion site converts the failure into a small
// editorial moment instead of a generic "Page Not Found".
//
// Server component, no JS payload. Uses the F3 typography utilities
// + gy-shimmer-cta + gy-divider-star from Phase 1/2.

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050505 0%, #000000 100%)",
        color: "#F8F5F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(48px, 8vw, 120px) clamp(24px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative film grain */}
      <span
        aria-hidden="true"
        className="gy-film-grain"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 880, position: "relative", zIndex: 2 }}>
        <p
          className="gy-eyebrow"
          style={{ color: "#C9A84C", textAlign: "center", display: "block" }}
        >
          The page you sought has weighed&nbsp;anchor
        </p>

        <h1
          className="gy-display-xl"
          style={{
            fontSize: "clamp(120px, 22vw, 280px)",
            margin: "8px 0 0",
            textAlign: "center",
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            background: "linear-gradient(135deg, #E6C77A 0%, #C9A84C 50%, #8E6F2A 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          404
        </h1>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        <h2
          className="gy-display-md"
          style={{
            margin: "0 auto 18px",
            maxWidth: "20ch",
            textAlign: "center",
            fontStyle: "italic",
            color: "#F8F5F0",
            fontSize: "clamp(28px, 4vw, 44px)",
          }}
        >
          That route doesn&rsquo;t exist on our&nbsp;chart.
        </h2>

        <p
          className="gy-lede"
          style={{
            margin: "0 auto 48px",
            maxWidth: "52ch",
            textAlign: "center",
            color: "rgba(248,245,240,0.75)",
            fontSize: "clamp(16px, 1.7vw, 19px)",
          }}
        >
          Perhaps the link weathered. Perhaps a section retired. Either
          way — we know the waters from here. Pick a heading.
        </p>

        {/* Three quick exits */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            maxWidth: 720,
            margin: "0 auto 48px",
          }}
        >
          <ExitCard
            href="/charter-yacht-greece"
            eyebrow="The fleet"
            title="Browse all yachts"
          />
          <ExitCard
            href="/greece-by-yacht"
            eyebrow="The waters"
            title="Read the ten stops"
          />
          <ExitCard
            href="/inquiry"
            eyebrow="The brief"
            title="Brief George directly"
            primary
          />
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: "'Lato', 'Montserrat', sans-serif",
            fontSize: 13,
            color: "rgba(248,245,240,0.45)",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          Or simply{" "}
          <Link
            href="/"
            style={{ color: "#C9A84C", textDecoration: "underline", textUnderlineOffset: 4 }}
          >
            return to the home port
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function ExitCard({ href, eyebrow, title, primary }) {
  return (
    <Link
      href={href}
      data-cursor={primary ? "Brief" : "View"}
      className={primary ? "gy-shimmer-cta gy-tilt-3d gy-depth-card" : "gy-tilt-3d gy-depth-card"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "22px 24px",
        textDecoration: "none",
        background: primary
          ? "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,27,42,0.6) 100%)"
          : "rgba(0,0,0,0.55)",
        border: `1px solid ${primary ? "rgba(201,168,76,0.55)" : "rgba(248,245,240,0.12)"}`,
        color: "#F8F5F0",
      }}
    >
      <span
        className="gy-eyebrow-sm"
        style={{ color: primary ? "#C9A84C" : "rgba(248,245,240,0.55)", margin: 0 }}
      >
        {eyebrow}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22,
          fontWeight: 400,
          color: "#F8F5F0",
          lineHeight: 1.2,
        }}
      >
        {title} →
      </span>
    </Link>
  );
}
