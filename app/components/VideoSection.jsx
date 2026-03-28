"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";

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
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

const VideoSection = () => {
  const HEIGHT_CLASSES = "h-[100dvh]";
  const isVideo = (url) => url && url.toLowerCase().endsWith(".mp4");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const slideData = [
    {
      id: 1,
      imageUrl: "/videos/yacht-cruising-new.mp4",
      href: "/charter-yacht-greece/",
      buttonText: "Explore Our Fleet",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-black">
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
                    <BackgroundVideo src={slide.imageUrl} />
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
                    className={`transition-all duration-[1500ms] ${
                      isActive && heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    {/* Eyebrow */}
                    <p
                      className="text-[#DAA520] text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-semibold mb-6 md:mb-8"
                      style={{
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1s ease 0.5s",
                      }}
                    >
                      Exclusively Greek Waters
                    </p>

                    {/* Brand Name */}
                    <h1
                      className="font-marcellus text-white leading-[0.85] tracking-tight mb-4"
                      style={{
                        fontSize: "clamp(40px, 10vw, 120px)",
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 1.2s ease 0.8s, transform 1.2s ease 0.8s",
                      }}
                    >
                      GEORGE YACHTS
                    </h1>

                    {/* Gold line */}
                    <div
                      className="h-px mx-auto mb-6 md:mb-8"
                      style={{
                        background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
                        width: heroVisible ? "120px" : "0px",
                        transition: "width 1.2s ease 1.4s",
                      }}
                    />

                    {/* Tagline */}
                    <p
                      className="text-white/50 text-[10px] md:text-xs tracking-[0.35em] uppercase font-light mb-10 md:mb-12"
                      style={{
                        opacity: heroVisible ? 1 : 0,
                        transition: "opacity 1s ease 1.8s",
                      }}
                    >
                      Boutique Yacht Brokerage House
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={`${slide.href}#fleet-anchor`}
                      className="inline-block px-10 md:px-14 py-4 md:py-5 text-white text-[10px] tracking-[0.35em] uppercase font-semibold border border-white/20 hover:border-[#DAA520] hover:text-[#DAA520] transition-all duration-500 backdrop-blur-sm bg-white/[0.03]"
                      style={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.8s ease 2.2s, transform 0.8s ease 2.2s, border-color 0.3s, color 0.3s",
                      }}
                    >
                      {slide.buttonText}
                    </Link>
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
