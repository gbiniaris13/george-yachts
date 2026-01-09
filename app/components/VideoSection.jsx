"use client";

import React, { useEffect, useRef } from "react";
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
  const HEIGHT_CLASSES = "h-[calc(100dvh-292px)]";
  const isVideo = (url) => url && url.toLowerCase().endsWith(".mp4");

  const slideData = [
    {
      id: 1,
      // title: "CHARTER A YACHT",
      imageUrl: "/videos/yacht-cruising.mp4",
      href: "/charter-yacht-greece/",
      buttonText: "View all fleet",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#020617]">
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
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full text-center p-8">
                  <div
                    className={`transition-opacity duration-1000 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h1 className="text-5xl md:text-[110px] font-bold text-white tracking-tight drop-shadow-2xl mb-2 uppercase font-marcellus">
                      {slide.title}
                    </h1>

                    {/* MOBILE ONLY BUTTON: Styled as a Category Monolith */}
                    {/* MOBILE ONLY BUTTON: Styled as a Category Monolith */}
                    <Link
                      href={`${slide.href}#fleet-anchor`} // Appended the anchor ID here
                      className="lg:hidden inline-block mt-8 px-10 py-5 bg-white/10 backdrop-blur-2xl border border-white/20 text-white font-marcellus uppercase text-xs tracking-[0.4em] hover:bg-white/20 transition-all duration-500"
                      style={{ borderRadius: 0 }}
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

      {/* INDUSTRY KILLING ANGULAR CATEGORIES - DESKTOP ONLY */}
      <div className="hidden lg:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[1200px] justify-center">
        <div
          className="flex bg-white/10 backdrop-blur-3xl border-t border-x border-white/20 px-12 py-1"
          style={{
            clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/charter-yacht-greece?type=${cat.value}#fleet-anchor`}
              className="px-8 py-6 text-white font-marcellus text-[10px] tracking-[0.4em] uppercase hover:text-[#DAA520] transition-colors duration-300 whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default VideoSection;
