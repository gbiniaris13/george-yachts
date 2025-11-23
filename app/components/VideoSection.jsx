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
    imageUrl: "/images/yachts-charter.jpg",
    href: "/charter-yacht-greece/",
    buttonText: "Explore charter yachts",
  },
  {
    id: 2,
    title: "FLY PRIVATE",
    imageUrl: "/images/george-aviation.jpg",
    href: "/private-jet-charter/",
    buttonText: "Arrange a private flight",
  },
  {
    id: 3,
    title: "LUXURY VILLAS",
    imageUrl: "/images/villas-real-estate.jpeg",
    href: "/luxury-villas-greece/",
    buttonText: "View select villas",
  },
  {
    id: 4,
    title: "VIP TRANSFERS",
    imageUrl: "/images/vip-transfers.jpeg",
    href: "/vip-transfers-greece/",
    buttonText: "Arrange VIP transfers",
  },
  {
    id: 5,
    title: "BUY A YACHT",
    imageUrl: "/images/buy-a-yacht.jpeg",
    href: "/yachts-for-sale/",
    buttonText: "Explore yachts for sale",
  },
];

// const slideData = [
//   {
//     id: 1,
//     title: "CHARTER A YACHT",
//     subtitle: "Bespoke journeys across the Greek islands.",
//     imageUrl: "/images/yachts-charter.jpg",
//     href: "/charter-yacht-greece/",
//     buttonText: "View Charter Yachts", // 🛑 1. Custom Button Text
//   },
//   {
//     id: 2,
//     title: "FLY PRIVATE",
//     subtitle: "Seamless helicopter & jet transfers.",
//     imageUrl: "/images/george-aviation.jpg",
//     href: "/private-jet-charter/",
//     buttonText: "Book Private Jet", // 🛑 1. Custom Button Text
//   },
//   {
//     id: 3,
//     title: "LUXURY VILLAS",
//     subtitle: "Curated stays in exclusive properties.",
//     imageUrl: "/images/villas-real-estate.jpeg",
//     href: "/luxury-villas-greece/",
//     buttonText: "Explore Villas", // 🛑 1. Custom Button Text
//   },
//   {
//     id: 4,
//     title: "VIP TRANSFERS",
//     subtitle: "Chauffeured sedans, SUVs & sprinters • 24/7.",
//     imageUrl: "/images/vip-transfers.jpeg",
//     href: "/vip-transfers-greece/",
//     buttonText: "Arrange Transfer", // 🛑 1. Custom Button Text
//   },
//   {
//     id: 5,
//     title: "BUY A YACHT",
//     subtitle: "Discreet acquisition & advisory.",
//     imageUrl: "/images/buy-a-yacht.jpeg",
//     href: "/yachts-for-sale/",
//     buttonText: "View Yachts for Sale", // 🛑 1. Custom Button Text
//   },
// ];
// --- END: Data for the Slides ---
// --- END: Data for the Slides ---

const VideoSection = () => {
  const HEIGHT_CLASSES = "h-[calc(100dvh-292px)]";
  const FALLBACK_IMAGE =
    "https://placehold.co/1920x710/02132d/ffffff?text=Image+Loading";

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
                {/* Background Image for this slide */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.imageUrl || FALLBACK_IMAGE}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
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

                      {/* 🛑 2. Use the specific buttonText from data */}
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
