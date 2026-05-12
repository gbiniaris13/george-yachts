// QuizCtaCard - Phase 7 Round 24 (2026-05-12).
// Technical brief Priority 1E.
//
// Bordered card with antique-gold accent prompting visitors to take
// the 60-second yacht match quiz. Used inline on island root pages
// and comparison pages. Supports `?from=` URL param so the quiz
// pre-fills region from the originating page.

import Link from "next/link";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export default function QuizCtaCard({ fromSlug, fromName }) {
  // fromSlug: optional island slug (e.g. "mykonos") for prefill.
  // fromName: friendly name for the copy ("Mykonos" or "Croatia comparison").
  const href = fromSlug
    ? `/yacht-finder?from=${encodeURIComponent(fromSlug)}`
    : "/yacht-finder";

  const subline = fromName
    ? `60 seconds. 5 quick questions. George matches you with the right yacht for ${fromName}.`
    : "60 seconds. 5 quick questions. George matches you with the right yacht.";

  return (
    <aside
      style={{
        margin: "48px auto",
        maxWidth: 720,
        padding: "32px 36px",
        border: `1px solid ${GOLD}`,
        background: "rgba(201, 168, 76, 0.04)",
        position: "relative",
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 700,
          margin: "0 0 12px",
        }}
      >
        Not sure which yacht is right?
      </p>
      <h3
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: "clamp(22px, 3vw, 28px)",
          fontWeight: 400,
          color: CREAM,
          margin: "0 0 12px",
          lineHeight: 1.25,
        }}
      >
        Take the 60-second yacht match quiz
      </h3>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 15,
          lineHeight: 1.65,
          color: "rgba(248, 245, 240, 0.78)",
          margin: "0 0 22px",
        }}
      >
        {subline}
      </p>
      <Link
        href={href}
        style={{
          display: "inline-block",
          fontFamily: "var(--gy-font-ui)",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          padding: "13px 24px",
          background: GOLD,
          color: NAVY,
          textDecoration: "none",
        }}
      >
        Start the match quiz →
      </Link>
    </aside>
  );
}
