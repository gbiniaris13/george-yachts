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

  // CTA hierarchy — George 2026-04-20:
  // Primary CTA leads directly into the Private Fleet so a first-time
  // visitor sees real yachts inside one click. The quiz (yacht-finder)
  // stays in the hero as a soft secondary link below the primary
  // button — useful for visitors who prefer a guided path, but no
  // longer competing for the primary click.
  const slideData = [
    {
      id: 1,
      imageUrl: "/videos/yacht-cruising-new.mp4",
      primaryHref: "/private-fleet",
      primaryText: t('hero.primaryCta'),
      secondaryHref: "/yacht-finder",
      secondaryText: t('hero.secondaryCta'),
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

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center h-full text-center p-8">
                  <div
                    className={`text-center transition-all duration-[1500ms] ${
                      isActive && heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ textAlign: "center" }}
                  >
                    {/* Eyebrow */}
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "9px",
                        letterSpacing: "0.5em",
                        textTransform: "uppercase",
                        color: "#DAA520",
                        fontWeight: 600,
                        marginBottom: "32px",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1s ease 0.5s",
                      }}
                    >
                      {t('hero.tagline')}
                    </p>

                    {/* Brand Name — H1 with SEO keyword (visually hidden span) */}
                    <h1
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(42px, 9vw, 110px)",
                        fontWeight: 200,
                        letterSpacing: "0.15em",
                        lineHeight: 0.95,
                        color: "#fff",
                        textTransform: "uppercase",
                        margin: "0 0 8px 0",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 1.2s ease 0.7s, transform 1.2s ease 0.7s",
                      }}
                    >
                      GEORGE YACHTS
                      <span className="sr-only"> — Luxury Yacht Charter Greece</span>
                    </h1>

                    {/* Subtitle — BROKERAGE HOUSE LLC */}
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
                        transition: "opacity 1s ease 1.1s, transform 1s ease 1.1s",
                      }}
                    >
                      BROKERAGE HOUSE LLC
                    </p>

                    {/* Gold line */}
                    <div
                      className="h-px mx-auto mb-8"
                      style={{
                        background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
                        width: heroVisible ? "140px" : "0px",
                        transition: "width 1.2s ease 1.5s",
                      }}
                    />

                    {/* Tagline */}
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 300,
                        marginBottom: "40px",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1s ease 1.9s",
                      }}
                    >
                      Boutique Luxury Yacht Charter &middot; Est. U.S.A. &middot; Operating from Athens
                    </p>

                    {/* Seasonal Message */}
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(12px, 2vw, 16px)",
                        fontWeight: 300,
                        fontStyle: "italic",
                        color: "rgba(218,165,32,0.5)",
                        marginBottom: "32px",
                        textAlign: "center",
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1.2s ease 2s",
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

                    {/* CTA stack — primary: Private Fleet, secondary: 60-sec quiz */}
                    <div
                      className="flex flex-col items-center gap-6"
                      style={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.8s ease 2.2s, transform 0.8s ease 2.2s",
                      }}
                    >
                      {/* PRIMARY — Enter the Private Fleet. Solid gold-gradient
                          border + soft gold tint on hover. Bigger padding and
                          weightier typography than the old single CTA so it
                          visually dominates without shouting. */}
                      <MagneticButton
                        href={slide.primaryHref}
                        dataCursor="Enter"
                        className="group inline-flex items-center gap-3 px-12 md:px-16 py-5 md:py-6 text-white text-[11px] md:text-[12px] tracking-[0.4em] uppercase font-semibold border border-[#DAA520]/60 hover:border-[#DAA520] hover:text-[#DAA520] transition-colors duration-500 backdrop-blur-sm bg-[#DAA520]/[0.04] hover:bg-[#DAA520]/[0.08]"
                      >
                        <span>{slide.primaryText}</span>
                        <svg
                          width="16"
                          height="10"
                          viewBox="0 0 22 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="translate-y-[0.5px] transition-transform duration-500 group-hover:translate-x-1"
                        >
                          <line x1="0" y1="5" x2="20" y2="5" />
                          <polyline points="15 1 21 5 15 9" />
                        </svg>
                      </MagneticButton>

                      {/* SECONDARY — soft text link. No button chrome — a single
                          underlined line in the ivory/60 register, gold on
                          hover. Deliberately quieter than the primary so the
                          visual hierarchy is unambiguous. */}
                      <Link
                        href={slide.secondaryHref}
                        className="group inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-light text-white/55 hover:text-[#DAA520] transition-colors duration-500"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <span className="relative">
                          {slide.secondaryText}
                          <span
                            className="pointer-events-none absolute left-0 right-0 -bottom-1 h-px bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                            aria-hidden="true"
                          />
                        </span>
                        <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 1s ease 2.8s",
        }}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: "2s" }}>
          <span className="text-white/30 text-[8px] tracking-[0.3em] uppercase">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(218,165,32,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
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
      `}</style>
    </section>
  );
};

export default VideoSection;
