"use client";

// Phase 27i (2026-05-07) — Boss directive: "Forbes section needs a
// different background and a lot of effects, things should catch the
// eye immediately, things should move, like the most expensive thing
// possible." Restraint-first old-money interpretation: deep navy
// gradient with a top-centre champagne spotlight, hand-drawn gold
// rules that draw open on scroll-into-view, FORBES wordmark in
// brand-consistent Times New Roman Bold (matching the small Forbes
// mark in ForbesTopBar — one consistent voice for every Forbes
// reference on the site), and a slow champagne-dust drift.
//
// Phase 27i.4 — added an R3F starfield as the deepest background
// layer. Three.js Points cloud rotating ~0.7°/sec on Y axis. Reads
// as a polished-glass window into a Mediterranean night sky behind
// the editorial copy. Loaded as a separate client component so the
// SSR HTML still carries the full quote+attribution for SEO/AI.
//
// All other animations are CSS-driven so the component stays server-
// render-friendly. Reduced-motion: every animated element falls back
// to a static state via a single @media query in globals.css.

import dynamic from "next/dynamic";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

// Lazy-load the 3D layer — desktop-only, decorative, must not block
// hydration of the editorial copy underneath.
const StarField3D = dynamic(() => import("./StarField3D"), { ssr: false });

const ARTICLE_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function HomeForbesQuote() {
  const { t } = useI18n();
  return (
    <section
      aria-label="George Yachts featured in Forbes, May 2026"
      className="gy-forbes-section"
      data-sound-reveal
    >
      {/* Background layers (deepest → nearest). 3D starfield first,
          then the CSS-only paper-grain noise, top-centre champagne
          spotlight, and 6 drifting gold dust motes. */}
      <StarField3D />
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
