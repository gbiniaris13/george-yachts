// Tier 1.3 (Roberto Forbes integration brief, May 2026) —
// Homepage Forbes pull-quote section.
//
// Sits BETWEEN "This Week's Selection" yacht strip and Filotimo /
// brand storytelling. Full-width band, dark navy background, gold
// accent rules top + bottom. Entire section clickable — opens the
// Forbes article in a new tab.
//
// Constraint from brief: server-rendered. The quote and attribution
// MUST appear in the initial HTML response so AI crawlers and
// Googlebot read the Forbes credential without JS.
//
// Brand-equality rule: the Forbes wordmark sits at 18px on this
// strip, same size as the Cormorant body italic. The full-page
// George Yachts header logo is larger, so the brand stays first.

"use client";

// Phase 27 (Forbes-launch eve, 2026-05-05) — Boss flagged that not
// all sections translate. Converted from server component to client
// component so it can use the i18n t() function. SSR still hits via
// the default English fallback (the t() function returns the second
// arg if no translation exists), so SEO/AI crawlers still see the
// English quote in the initial HTML response.

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const ARTICLE_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function HomeForbesQuote() {
  const { t } = useI18n();
  return (
    <section
      aria-label="George Yachts featured in Forbes, May 2026"
      style={{
        background: "#0D1B2A",
        position: "relative",
        padding: "64px 24px",
        borderTop: "1px solid rgba(201,168,76,0.4)",
        borderBottom: "1px solid rgba(201,168,76,0.4)",
      }}
    >
      <Link
        href={ARTICLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={false}
        data-cursor="Read"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          textDecoration: "none",
          color: "inherit",
          maxWidth: "880px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Forbes wordmark + date row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            aria-label="Forbes"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              lineHeight: 1,
            }}
          >
            Forbes
          </span>
          <span aria-hidden="true" style={{ color: "#C9A84C" }}>
            ·
          </span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
            }}
          >
            {t("forbesQuote.date", "May 2026")}
          </span>
        </div>

        {/* Decorative top rule */}
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 80,
            height: 1,
            background: "rgba(201,168,76,0.5)",
          }}
        />

        {/* The pull quote (server-rendered for SEO/AI) */}
        <blockquote
          cite={ARTICLE_URL}
          style={{
            margin: 0,
            padding: 0,
            border: "none",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.4,
              color: "#F8F5F0",
              margin: 0,
              fontWeight: 300,
              letterSpacing: "0.005em",
            }}
          >
            {t(
              "forbesQuote.quote",
              "“That’s the geopolitical shift playing out in real time on my desk.”"
            )}
          </p>
        </blockquote>

        {/* Attribution block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              color: "rgba(248,245,240,0.7)",
              letterSpacing: "0.04em",
            }}
          >
            {t("forbesQuote.attribution", "— George P. Biniaris, Managing Broker")}
          </span>
          <span
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              color: "rgba(248,245,240,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            {t("forbesQuote.context", "in conversation with Forbes · 1 May 2026")}
          </span>
        </div>

        {/* Decorative bottom rule */}
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 80,
            height: 1,
            background: "rgba(201,168,76,0.5)",
          }}
        />

        {/* CTA */}
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 600,
            paddingBottom: 2,
            borderBottom: "1px solid transparent",
            transition: "border-color 0.3s ease",
          }}
          className="gy-forbes-quote-cta"
        >
          {t("forbesQuote.cta", "Read the full article →")}
        </span>
      </Link>

      <style>{`
        .gy-forbes-quote-cta:hover { border-bottom-color: #C9A84C !important; }
      `}</style>
    </section>
  );
}
