"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// --- START: Data for the Slides ---
const slideData = [
  {
    id: 1,
    title: "CHARTER A YACHT",
    // FIXED: Corrected the double file extension typo here
    imageUrl: "/videos/yacht-cruising.mp4",
    href: "/charter-yacht-greece/",
    buttonText: "Explore charter yachts",
  },
  // {
  //   id: 2,
  //   title: "FLY PRIVATE",
  //   imageUrl: "/images/george-aviation.jpg",
  //   href: "/private-jet-charter/",
  //   buttonText: "Arrange a private flight",
  // },
  // ... other slides
];
// --- END: Data for the Slides ---

const VideoSection = () => {
  const HEIGHT_CLASSES = "h-[calc(100dvh-292px)]";

  // Helper function to check if the URL is a video
  const isVideo = (url) => url && url.endsWith(".mp4");

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
                {/* Background Media (Video or Image) */}
                <div className="absolute inset-0 z-0">
                  {isVideo(slide.imageUrl) ? (
                    <video
                      src={slide.imageUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
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

                {/* Text Content Block */}
                <div className="relative z-10 h-full max-w-[1530px] mx-auto p-8">
                  <div className="relative z-10 flex items-center justify-center h-full text-center p-8">
                    {/* Animation wrapper */}
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
