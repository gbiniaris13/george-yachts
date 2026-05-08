"use client";

// Move #4 — Filotimo signature spread (expanded).
//
// George 2026-04-20: "it's our signature, make it richer — fuller,
// more explanatory for foreigners". Expanded from the minimal two-
// paragraph version into a proper editorial spread that carries the
// full cultural weight of the word.
//
// Layout: two-column on desktop (image left 40%, text right 60%).
// Mobile stacks vertically. All content pulled from the existing
// `filotimo` i18n namespace — no invented strings.
//
// Content sequence (top → bottom of the text column):
//   1. Eyebrow: THE PHILOSOPHY
//   2. Signature headline: "A word that does not translate cleanly
//      into English."
//   3. Etymology couplet (φίλο + τιμώ)
//   4. Intro paragraph — full i18n string (Pindar → Ottoman → today)
//   5. "Three strands" section — the pillars rewritten as short
//      editorial vignettes (numbered 01 / 02 / 03, not emoji cards)
//   6. Divider
//   7. Application line: "At George Yachts, filotimo is not a
//      marketing word. It is how we operate."
//   8. Four examples as italic pullquotes with gold left rules
//   9. Divider
//  10. Closing pullquote with attribution
//  11. Signature diamond mark
//
// No CTAs — the section is contemplative by design.

import React from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ConstellationBackdrop from "./ConstellationBackdrop";

// Phase 27i.14 (2026-05-08) — R3F gold-ember layer behind the
// constellation. Lazy-loaded, ssr:false because three.js is a heavy
// client-only payload. Desktop-only inside the component itself.
const GoldEmbers3D = dynamic(() => import("./GoldEmbers3D"), { ssr: false });

export default function Filotimon({ filotimoImage = null }) {
  const { t } = useI18n();

  const pillars = [
    { title: t("filotimo.pillar1Title"), body: t("filotimo.pillar1Desc") },
    { title: t("filotimo.pillar2Title"), body: t("filotimo.pillar2Desc") },
    { title: t("filotimo.pillar3Title"), body: t("filotimo.pillar3Desc") },
  ];

  const examples = [
    t("filotimo.example1"),
    t("filotimo.example2"),
    t("filotimo.example3"),
    t("filotimo.example4"),
  ];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#000000" }}
      aria-label="Filotimo — the Greek philosophy that shapes George Yachts"
    >
      {/* Ambient gold wash — drifts slowly on scroll (A4 ambient parallax) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(218,165,32,0.05) 0%, transparent 60%)",
          transform:
            "translate3d(0, calc(var(--gy-scroll-vy, 0) * -6px), 0)",
          willChange: "transform",
        }}
      />

      {/* Phase 27i.6 (2026-05-07) — constellation backdrop. Faint
          gold star pattern + connecting lines, drifts very slowly,
          stars twinkle on independent timing. Adds the night-sky
          register the philosophy section was missing. */}
      <ConstellationBackdrop intensity={0.55} />

      {/* Phase 27i.14 (2026-05-08) — R3F gold embers drift upward
          through the constellation. Original cinematic brief asked
          for a 3D R3F particle field behind Filotimo + Forbes; the
          Forbes side has StarField3D (drifting stars), this side
          gets embers (rising motes) so the two sections feel
          related but not identical. Desktop-only via the component's
          own viewport gate. */}
      <GoldEmbers3D />

      <div className="relative grid grid-cols-1 lg:grid-cols-[40%_60%]">
        {/* ── LEFT — editorial image, sticky on desktop so it frames
             the long-form text column without scrolling away ── */}
        <div className="relative min-h-[60vh] lg:min-h-[100dvh] lg:sticky lg:top-0 overflow-hidden">
          {/* Chapter 01 (2026-05-08) — Navagio aerial video replaces
              the static editorial image. Boss-curated 8.4 s loop
              (15522129_3840_2160_30fps.mp4 → encoded 1920×1080
              VP9 3000 kbps WebM 3.0 MB / H.264 4500 kbps MP4 4.3 MB
              2-pass). The same grayscale 0.15 / brightness 0.8 /
              contrast 1.06 filter runs over the video so it reads
              "philosophy / contemplation" rather than "destination
              tourism". The static filotimoImage prop is kept as
              the <video> poster — Sanity-supplied fallback for any
              browser that fails the autoplay heuristic (and as the
              first paint while the video decodes). */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            // 2026-05-08 (Chapter 01 follow-up) — poster now uses a
            // frame extracted from the Navagio video itself, not the
            // Sanity filotimoImage which read as a different scene
            // and flashed visibly before the video started. The
            // editorial filter (grayscale 0.15 / brightness 0.8 /
            // contrast 1.06) is applied via CSS so it covers BOTH
            // poster and live video — no swap visible.
            poster="/images/posters/filotimo-navagio-frame1.jpg"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{
              filter: "grayscale(0.15) brightness(0.8) contrast(1.06)",
            }}
          >
            <source src="/videos/filotimo-navagio.webm" type="video/webm" />
            <source src="/videos/filotimo-navagio.mp4" type="video/mp4" />
          </video>

          {/* Navy→transparent vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Faint ΦΙΛΟΤΙΜΟ watermark — gentle ambient drift */}
          <div
            className="absolute inset-0 flex items-end justify-start pb-12 pl-8 md:pl-14 pointer-events-none select-none"
            style={{
              transform:
                "translate3d(0, calc(var(--gy-scroll-vy, 0) * -3px), 0)",
              willChange: "transform",
            }}
          >
            <span
              className="uppercase hidden sm:inline-block"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                // Watermark hides on ≤ 640 px where it was overlapping
                // copy and adding visual noise on narrow phones.
                fontSize: "clamp(48px, 9vw, 140px)",
                fontWeight: 200,
                color: "rgba(218,165,32,0.25)",
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

        {/* ── RIGHT — editorial long-form text ── */}
        <div className="relative flex items-start justify-center px-8 md:px-16 lg:px-24 py-20 lg:py-32">
          <article className="max-w-[680px] w-full">
            {/* Eyebrow — Phase 24 Cinzel temple-caps */}
            <p
              className="text-[#DAA520] mb-10"
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', 'Trajan Pro', 'Montserrat', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {t("filotimo.label")}
            </p>

            {/* Signature line — Phase 24 polish: bumped scale + tighter
                tracking for editorial presence. The brand-philosophy
                section deserves the same masthead gravitas as the rest
                of the site. */}
            <h2
              className="text-white mb-12"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4.5vw, 72px)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
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

            {/* Etymology */}
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

            {/* Intro paragraph — full i18n string, long-form */}
            <p
              className="text-white/70 mb-16"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(16px, 1.4vw, 19px)",
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              {t("filotimo.intro")}
            </p>

            {/* ── Three strands of filotimo ── */}
            <p
              className="text-[#DAA520]/70 mb-8"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Three strands, one word
            </p>

            <ol className="space-y-10 mb-16 list-none p-0">
              {pillars.map((p, i) => (
                <li key={i} className="flex gap-6">
                  <span
                    className="text-[#DAA520] shrink-0"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(32px, 3.5vw, 48px)",
                      fontWeight: 200,
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className="text-white mb-3"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(20px, 1.8vw, 26px)",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="text-white/60"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(15px, 1.3vw, 17px)",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="h-px w-24 mb-12"
              style={{
                background:
                  "linear-gradient(to right, #DAA520, rgba(218,165,32,0.1))",
              }}
            />

            {/* Application line */}
            <p
              className="text-white/70 mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(18px, 1.6vw, 22px)",
                lineHeight: 1.55,
                fontWeight: 300,
              }}
            >
              {t("filotimo.application")}
            </p>
            <p
              className="text-white mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(22px, 2.2vw, 28px)",
                lineHeight: 1.35,
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              {t("filotimo.applicationBold")}
            </p>

            {/* Four examples — italic one-liners with gold left rule */}
            <ul className="space-y-4 mb-16 list-none p-0">
              {examples.map((ex, i) => (
                <li
                  key={i}
                  className="pl-5 py-1"
                  style={{
                    borderLeft: "1px solid rgba(218,165,32,0.45)",
                  }}
                >
                  <p
                    className="text-white/70 italic"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(15px, 1.3vw, 17px)",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {ex}
                  </p>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="h-px w-16 mb-10"
              style={{
                background:
                  "linear-gradient(to right, #DAA520, rgba(218,165,32,0.1))",
              }}
            />

            {/* Closing quote */}
            <blockquote
              className="text-white/80 italic mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(20px, 2vw, 28px)",
                lineHeight: 1.45,
                fontWeight: 300,
              }}
            >
              {t("filotimo.quote")}
            </blockquote>

            <p
              className="text-[#DAA520]/55"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              — A Greek Saying
            </p>

            {/* Signature diamond */}
            <div className="mt-16 opacity-40 hover:opacity-90 transition-opacity duration-500">
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
