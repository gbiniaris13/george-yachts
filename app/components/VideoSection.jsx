"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import { useI18n } from "@/lib/i18n/I18nProvider";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const CATEGORIES = [
  { label: "Sailing Monohulls", value: "sailing-monohulls" },
  { label: "Sailing Catamarans", value: "sailing-catamarans" },
  { label: "Power Catamarans", value: "power-catamarans" },
  { label: "Motor Yachts", value: "motor-yachts" },
];

const BackgroundVideo = ({ src, poster }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.log("Autoplay prevented:", error));
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      preload="none"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
      style={{ objectFit: "cover", objectPosition: "center", minHeight: "100%", minWidth: "100%" }}
    />
  );
};

const VideoSection = () => {
  const { t } = useI18n();
  const HEIGHT_CLASSES = "h-[100dvh]";
  const isVideo = (url) => url && url.toLowerCase().endsWith(".mp4");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // CTA hierarchy — George 2026-04-20 post-Move-#2 cleanup:
  // The split-screen fleet showcase (Move #2) sits immediately
  // below the hero, so the Private / Explorer choice is already
  // unmissable on the next scroll. Duplicating the fleet buttons
  // inside the hero became visual noise — reverted to the original
  // single 'Find Your Yacht in 60 Seconds' CTA.
  const slideData = [
    {
      id: 1,
      imageUrl: "/videos/yacht-cruising-new.mp4",
      href: "/yacht-finder",
      buttonText: t('common.findYourYacht'),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ marginTop: 0, paddingTop: 0 }}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        loop={true}
        className={`relative w-full ${HEIGHT_CLASSES} z-0`}
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className={`relative w-full ${HEIGHT_CLASSES} z-0`}>
                <div className="absolute inset-0 z-0">
                  {isVideo(slide.imageUrl) ? (
                    <BackgroundVideo src={slide.imageUrl} poster="/images/hero-poster.jpg" />
                  ) : (
                    <img
                      src={slide.imageUrl}
                      alt="George Yachts - luxury yacht charter Greece"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Cinematic overlay */}
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                </div>

                {/* Hero Content — explicit max-width + mx-auto on the inner
                    stack so every child is centered on the same horizontal
                    axis regardless of its own natural width. Prior build
                    let the inner block size to its widest child (the H1),
                    which made small lines like the eyebrow, season copy,
                    and the sub-tagline read as off-axis on narrow viewports. */}
                <div className="relative z-10 flex items-center justify-center h-full text-center px-6 md:px-8">
                  <div
                    className={`w-full max-w-[1200px] mx-auto ${
                      isActive && heroVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ textAlign: "center", transition: "opacity 800ms ease" }}
                  >
                    {/* ── Move #1: cinematic reveal choreography ──
                        - t=0        video is playing, everything invisible
                        - t=400ms    gold curtain line expands from centre
                        - t=900ms    letter-by-letter reveal of "GEORGE YACHTS"
                                     (60ms per glyph, Cormorant Garamond)
                        - t=1700ms   "EXCLUSIVELY GREEK WATERS" eyebrow appears
                                     BELOW the headline (moved from above —
                                     more confident, signature line under the
                                     name, not above it)
                        - t=1900ms   BROKERAGE HOUSE LLC gold gradient
                        - t=2200ms   gold divider + sub-tagline
                        - t=2500ms   seasonal italic
                        - t=2800ms   CTAs
                        - t=3100ms   secondary quiz link                    */}

                    {/* Gold curtain — reveals the headline on load.
                        Draws from centre outward to 800px, then holds. */}
                    <div
                      aria-hidden="true"
                      className="mx-auto mb-6 md:mb-8"
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, #DAA520 20%, #DAA520 80%, transparent)",
                        width: heroVisible ? "min(80vw, 800px)" : "0px",
                        transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                      }}
                    />

                    {/* Brand Name — letter-by-letter reveal. Split into
                        spans so each glyph gets its own staggered delay. */}
                    <h1
                      className="gy-hero-headline"
                      aria-label="George Yachts"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        // Mobile audit 2026-04-20: dropped the min from
                        // 42 → 34 and tightened tracking so "GEORGE
                        // YACHTS" never overlaps itself on 320–360 px
                        // devices. Letters breathe from native kerning
                        // at the smaller size.
                        fontSize: "clamp(34px, 9vw, 110px)",
                        fontWeight: 200,
                        letterSpacing: "clamp(0.06em, 0.15vw, 0.15em)",
                        lineHeight: 0.95,
                        color: "#fff",
                        textTransform: "uppercase",
                        margin: "0 0 24px 0",
                        textAlign: "center",
                      }}
                    >
                      {"GEORGE\u00A0YACHTS".split("").map((ch, i) => (
                        <span
                          key={i}
                          className="gy-hero-letter"
                          aria-hidden="true"
                          style={{
                            display: "inline-block",
                            opacity: heroVisible ? undefined : 0,
                            animationDelay: heroVisible ? `${900 + i * 55}ms` : "0ms",
                          }}
                        >
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      ))}
                      <span className="sr-only"> — Luxury Yacht Charter Greece</span>
                    </h1>

                    {/* Eyebrow — MOVED below the headline (cinematic pattern:
                        the name arrives first, the signature follows). */}
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "10px",
                        // 0.55em would spread 8 words to 80%+ width on
                        // 360 px devices. Responsive clamp keeps the
                        // cinematic wide tracking on desktop.
                        letterSpacing: "clamp(0.22em, 1.2vw, 0.55em)",
                        textTransform: "uppercase",
                        color: "#DAA520",
                        fontWeight: 600,
                        margin: "0 0 28px 0",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 1s ease 1.7s, transform 1s ease 1.7s",
                      }}
                    >
                      {t('hero.tagline')}
                    </p>

                    {/* Subtitle — BROKERAGE HOUSE LLC (retimed for Move #1) */}
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "clamp(10px, 1.8vw, 16px)",
                        fontWeight: 400,
                        letterSpacing: "0.45em",
                        textTransform: "uppercase",
                        margin: "0 0 28px 0",
                        textAlign: "center",
                        background: "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 1s ease 1.9s, transform 1s ease 1.9s",
                      }}
                    >
                      BROKERAGE HOUSE LLC
                    </p>

                    {/* Secondary inline gold dash (between brand block and
                        descriptor block). Narrower than the top curtain so
                        it reads as a separator, not another hero element. */}
                    <div
                      aria-hidden="true"
                      className="h-px mx-auto mb-8"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(218,165,32,0.45), transparent)",
                        width: heroVisible ? "100px" : "0px",
                        transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 2.1s",
                      }}
                    />

                    {/* Sub-tagline — descriptor block */}
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.42)",
                        fontWeight: 300,
                        marginBottom: "40px",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1s ease 2.3s",
                      }}
                    >
                      Boutique Luxury Yacht Charter &middot; Est. U.S.A. &middot; Operating from Athens
                    </p>

                    {/* Seasonal Message (retimed for Move #1) */}
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(12px, 2vw, 16px)",
                        fontWeight: 300,
                        fontStyle: "italic",
                        color: "rgba(218,165,32,0.5)",
                        marginBottom: "40px",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1.2s ease 2.5s",
                      }}
                    >
                      {(() => {
                        const m = new Date().getMonth();
                        if (m >= 0 && m <= 2) return t('seasonal.winter');
                        if (m >= 3 && m <= 4) return t('seasonal.spring');
                        if (m >= 5 && m <= 7) return t('seasonal.summer');
                        if (m === 8) return t('seasonal.september');
                        return t('seasonal.autumn');
                      })()}
                    </p>

                    {/* Single CTA — 'Find Your Yacht in 60 Seconds' (original).
                        The fleet choice lives in Move #2's split-screen
                        immediately below; this button is the guided quiz
                        for visitors who don't yet know which tier fits. */}
                    <div
                      style={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.9s ease 2.8s, transform 0.9s ease 2.8s",
                      }}
                    >
                      <MagneticButton
                        href={slide.href}
                        dataCursor="Explore"
                        className="inline-block px-10 md:px-14 py-4 md:py-5 text-white text-[10px] tracking-[0.35em] uppercase font-semibold border border-white/20 hover:border-[#DAA520] hover:text-[#DAA520] transition-colors duration-500 backdrop-blur-sm bg-white/[0.03]"
                      >
                        {slide.buttonText}
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator — Move #1: breathing vertical line instead of
          bouncing chevron. Gold gradient top→transparent, 1px × 40px,
          pulses opacity every 3.2s. No motion jitter, just a slow
          breath that signals "keep going" without shouting. */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 1s ease 3.4s",
        }}
      >
        <span
          className="text-white/50 text-[10px] tracking-[0.35em] uppercase"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            textShadow: "0 1px 2px rgba(0,0,0,0.45)",
          }}
        >
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="gy-hero-scroll-line"
          style={{
            display: "block",
            width: "1px",
            height: "40px",
            background:
              "linear-gradient(to bottom, rgba(218,165,32,0.7) 0%, rgba(218,165,32,0.1) 100%)",
          }}
        />
      </div>

      {/* Desktop Category Navigation */}
      <div className="hidden lg:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[1200px] justify-center">
        <div
          className="flex bg-black/40 backdrop-blur-2xl border-t border-x border-white/10 px-12 py-1"
          style={{
            clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/charter-yacht-greece?type=${cat.value}#fleet-anchor`}
              className="px-8 py-6 text-white/70 font-marcellus text-[10px] tracking-[0.4em] uppercase hover:text-[#DAA520] transition-colors duration-300 whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        * { border-radius: 0 !important; }

        /* Move #1 — letter-by-letter reveal choreography */
        .gy-hero-letter {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(6px);
          animation: gy-hero-letter-in 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes gy-hero-letter-in {
          0%   { opacity: 0; transform: translateY(18px); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        /* Move #1 — scroll line breathing pulse */
        .gy-hero-scroll-line {
          animation: gy-hero-breathe 3.2s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes gy-hero-breathe {
          0%, 100% { opacity: 0.35; transform: scaleY(1); }
          50%      { opacity: 1;    transform: scaleY(1.08); }
        }

        /* Respect reduced-motion preference — instant reveal, no breath */
        @media (prefers-reduced-motion: reduce) {
          .gy-hero-letter {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            animation: none !important;
          }
          .gy-hero-scroll-line { animation: none !important; opacity: 0.5 !important; }
        }
      `}</style>
    </section>
  );
};

export default VideoSection;
