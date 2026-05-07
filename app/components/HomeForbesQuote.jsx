"use client";

// Phase 27i (2026-05-07) — Boss directive: "Forbes section needs a
// different background and a lot of effects, things should catch the
// eye immediately, things should move, like the most expensive thing
// possible." Restraint-first old-money interpretation: deep navy
// gradient with a top-centre champagne spotlight, hand-drawn gold
// rules that draw open on scroll-into-view, FORBES wordmark in
// brand-consistent Cinzel 700 (matching the @georgeyachts post + the
// homepage hero), and a slow champagne-dust drift that reads as
// "light catching polished metal", not as motion.
//
// All animations are CSS-driven so the component stays server-render-
// friendly (the quote text appears in initial HTML for SEO + AI
// crawlers). Reduced-motion: every animated element falls back to a
// static state via a single @media query in globals.css.

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const ARTICLE_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function HomeForbesQuote() {
  const { t } = useI18n();
  return (
    <section
      aria-label="George Yachts featured in Forbes, May 2026"
      className="gy-forbes-section"
    >
      {/* Background layers — pure decoration, behind the link.
          Three layers: paper-grain noise (CSS data URI), top-centre
          champagne spotlight, and 6 drifting gold dust motes. */}
      <div className="gy-forbes-grain" aria-hidden="true" />
      <div className="gy-forbes-spotlight" aria-hidden="true" />
      <div className="gy-forbes-dust" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>

      <Link
        href={ARTICLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={false}
        data-cursor="Read"
        className="gy-forbes-link"
      >
        {/* Eyebrow */}
        <span className="gy-forbes-eyebrow">
          {t("forbesQuote.eyebrow", "As Featured In")}
        </span>

        {/* FORBES wordmark — Cinzel 700, brand-consistent with the
            @georgeyachts IG post + the homepage hero. */}
        <h2 className="gy-forbes-wordmark" aria-label="Forbes">
          Forbes
        </h2>

        {/* Date line */}
        <span className="gy-forbes-date">
          {t("forbesQuote.date", "1 May · 2026")}
        </span>

        {/* Animated gold rule — draws open on scroll-into-view */}
        <span className="gy-forbes-rule" aria-hidden="true" />

        {/* The pull quote (server-rendered for SEO/AI) */}
        <blockquote cite={ARTICLE_URL} className="gy-forbes-quote">
          {t(
            "forbesQuote.quote",
            "“That’s the geopolitical shift playing out in real time on my desk.”",
          )}
        </blockquote>

        {/* Attribution block */}
        <span className="gy-forbes-attribution">
          {t("forbesQuote.attribution", "George P. Biniaris, Managing Broker")}
        </span>
        <span className="gy-forbes-context">
          {t("forbesQuote.context", "in conversation with Forbes · 1 May 2026")}
        </span>

        {/* Animated gold rule — symmetric with the top one */}
        <span className="gy-forbes-rule" aria-hidden="true" />

        {/* CTA — gold border on hover, subtle right-arrow shift */}
        <span className="gy-forbes-cta">
          {t("forbesQuote.cta", "Read the full article")}
          <span aria-hidden="true" className="gy-forbes-cta-arrow">&rarr;</span>
        </span>
      </Link>
    </section>
  );
}
