"use client";

// Move #4 — Filotimo editorial spread.
//
// Replaces the dense pillar-grid Filotimo block with a Times-magazine
// style two-column spread:
//   Desktop:  Image (left 45%)  |  Text (right 55%)
//   Mobile:   Image on top, text below
//
// The intent is contemplative, not transactional. No buttons, no
// CTAs — the reader sits with the word "filotimo" for thirty
// seconds and leaves with an impression, not a next action.
//
// Content pared back from 3 pillars + 4 examples + quote + label
// down to:
//   - Eyebrow "THE PHILOSOPHY"
//   - Signature line: "A word that does not translate cleanly into English."
//   - Etymology couplet
//   - Two paragraphs of meaning (from existing i18n)
//   - Hairline gold divider
//   - Pullquote from Thales
//   - Signature diamond mark
//
// Falls back gracefully if filotimoImage is null — the image column
// just shows a dark navy panel with the gold ΦΙΛΟΤΙΜΟ watermark.

import React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Filotimon({ filotimoImage = null }) {
  const { t } = useI18n();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#000000" }}
      aria-label="The Philosophy of Filotimo"
    >
      {/* Ambient gold wash — barely perceptible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(218,165,32,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[100dvh]">
        {/* ── LEFT — editorial image ── */}
        <div className="relative overflow-hidden min-h-[60vh] lg:min-h-[100dvh]">
          {filotimoImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${filotimoImage})`,
                filter: "grayscale(0.15) brightness(0.85) contrast(1.05)",
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0D1B2A 0%, #1a2b3a 50%, #0a0f1a 100%)",
              }}
            />
          )}

          {/* Subtle navy→transparent→navy vignette top & bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* Watermark ΦΙΛΟΤΙΜΟ — very faint on top of image */}
          <div className="absolute inset-0 flex items-end justify-start pb-12 pl-8 md:pl-14 pointer-events-none select-none">
            <span
              className="uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(48px, 9vw, 140px)",
                fontWeight: 200,
                color: "rgba(218,165,32,0.22)",
                letterSpacing: "0.08em",
                lineHeight: 0.9,
                mixBlendMode: "overlay",
              }}
            >
              ΦΙΛΟΤΙΜΟ
            </span>
          </div>

          {/* Corner accents */}
          <span
            aria-hidden="true"
            className="absolute top-6 left-6 md:top-10 md:left-10 w-10 h-10 md:w-14 md:h-14 border-t border-l border-[#DAA520]/35 pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-10 h-10 md:w-14 md:h-14 border-b border-l border-[#DAA520]/35 pointer-events-none"
          />
        </div>

        {/* ── RIGHT — editorial text ── */}
        <div className="relative flex items-center justify-center px-8 md:px-16 lg:px-20 py-20 lg:py-32">
          <article className="max-w-[620px] w-full">
            {/* Eyebrow */}
            <p
              className="text-[#DAA520] mb-10"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {t('filotimo.label')}
            </p>

            {/* Signature line — one thought, serif, large */}
            <h2
              className="text-white mb-12"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 3.8vw, 56px)",
                fontWeight: 200,
                lineHeight: 1.1,
                letterSpacing: "0.005em",
              }}
            >
              A word that does not translate cleanly
              <br className="hidden md:block" />
              into{" "}
              <span
                className="italic"
                style={{
                  background:
                    "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                English
              </span>
              .
            </h2>

            {/* Etymology couplet */}
            <p
              className="text-[#DAA520]/70 mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.4vw, 18px)",
                letterSpacing: "0.04em",
              }}
            >
              φίλο <span className="text-[#DAA520]/50">(philo)</span> — love &nbsp;·&nbsp;
              τιμώ <span className="text-[#DAA520]/50">(timo)</span> — honour
            </p>

            {/* Two short paragraphs — pulled from existing i18n intro string,
                split on sentences for readable rhythm. */}
            <div
              className="text-white/65 space-y-6 mb-12"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(15px, 1.3vw, 18px)",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              <p>{t('filotimo.intro')}</p>
              <p className="text-white/55">
                {t('filotimo.application')}{" "}
                <em className="text-white/80 not-italic" style={{ fontWeight: 400 }}>
                  {t('filotimo.applicationBold')}
                </em>
              </p>
            </div>

            {/* Hairline gold rule */}
            <div
              aria-hidden="true"
              className="h-px w-24 mb-10"
              style={{
                background:
                  "linear-gradient(to right, #DAA520, rgba(218,165,32,0.1))",
              }}
            />

            {/* Pullquote from Thales */}
            <blockquote
              className="text-white/75 italic mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(18px, 1.8vw, 24px)",
                lineHeight: 1.5,
                fontWeight: 300,
              }}
            >
              {t('filotimo.quote')}
            </blockquote>

            <p
              className="text-[#DAA520]/50"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              — Thales of Miletus · 624–546 BCE
            </p>

            {/* Signature diamond mark — unchanged from original */}
            <div className="mt-14 opacity-40 hover:opacity-90 transition-opacity duration-500">
              <div className="w-2 h-2 bg-[#DAA520] rotate-45" />
            </div>
          </article>
        </div>
      </div>

      <style jsx global>{`
        * { border-radius: 0 !important; }
      `}</style>
    </section>
  );
}
