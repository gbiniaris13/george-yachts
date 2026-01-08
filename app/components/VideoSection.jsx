"use client";

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// --- START: Data ---
const slideData = [
  {
    id: 1,
    // title: "CHARTER A YACHT",
    imageUrl: "/videos/yacht-cruising.mp4",
    href: "/charter-yacht-greece/",
    buttonText: "View yachts for charter",
  },
  // Add other slides here...
];
// --- END: Data ---

// 1. New Sub-component to handle Safari Autoplay quirks
const BackgroundVideo = ({ src, poster }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted property directly on the DOM element
    video.muted = true;

    // Attempt to play (handling the Promise to avoid console errors)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented by browser:", error);
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster} // Optional: shows image while video loads
      autoPlay
      loop
      muted // Keeps React happy
      playsInline // CRITICAL for iOS Safari
      className="w-full h-full object-cover"
    />
  );
};

const VideoSection = () => {
  const HEIGHT_CLASSES = "h-[calc(100dvh-292px)]";

  // Helper to check for video extension
  const isVideo = (url) => url && url.toLowerCase().endsWith(".mp4");

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        loop={true}
        className={`relative w-full ${HEIGHT_CLASSES} z-0`}
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className={`relative w-full ${HEIGHT_CLASSES} z-0`}>
                {/* Background Media */}
                <div className="absolute inset-0 z-0">
                  {isVideo(slide.imageUrl) ? (
                    // Use the Safari-proof sub-component
                    <BackgroundVideo src={slide.imageUrl} />
                  ) : (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>

                {/* Text Content */}

                {/* Hide slide button temporalily */}

                <div className="relative z-10 h-full max-w-[1530px] mx-auto p-8">
                  <div className="relative z-10 flex items-center justify-center h-full text-center p-8">
                    <div
                      className={`mx-auto transition-opacity duration-1000 ease-in-out ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <h1
                        className="text-5xl md:text-[110px] font-bold text-white tracking-wide drop-shadow-lg mb-2"
                        style={{ fontFamily: "var(--font-marcellus)" }}
                      >
                        {slide.title}
                      </h1>

                      <Link
                        href={slide.href}
                        className="inline-block mt-8 px-8 lg:py-4 py-3 rounded-full bg-white text-black font-semibold uppercase text-sm lg:text-lg hover:bg-black hover:text-white tracking-wide"
                      >
                        {slide.buttonText || "Learn More"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default VideoSection;
