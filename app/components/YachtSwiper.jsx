"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { urlFor } from "@/lib/sanity";
import EnquirePopup from "./EnquirePopup";

const YachtSwiper = ({ yachtData }) => {
  if (!yachtData) return null;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const yacht = yachtData;

  const specs = [
    { label: "LENGTH", value: yacht.length },
    { label: "BUILDER", value: yacht.subtitle },
    { label: "GUESTS", value: yacht.sleeps },
    { label: "REGION", value: yacht.cruisingRegion },
  ];

  return (
    <section className="relative w-full mb-20 lg:mb-32 group flex flex-col">
      <EnquirePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        yachtName={yacht.name}
      />

      {/* 1. THE CINEMATIC BACKGROUND SLIDER */}
      {/* On mobile, we reduce height slightly to 50vh so the scroll to details is faster */}
      <div className="relative h-[50vh] lg:h-[85vh] w-full overflow-hidden border-y border-white/5 order-1">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {yacht.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <img
                  src={urlFor(image.asset).width(1920).height(1080).url()}
                  alt={yacht.name}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-[#020617]/40"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Minimalist Nav - Desktop Only */}
        <div className="hidden lg:flex absolute bottom-10 left-[10%] z-40 items-center gap-12">
          <div className="flex items-center gap-4">
            <span className="h-px w-20 bg-white/20"></span>
            <p className="text-white/40 font-marcellus text-xs tracking-widest">
              SCROLL TO EXPLORE
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE COMMAND PANE */}
      {/* Logic: relative on mobile (follows photo), absolute on desktop (floats on photo) */}
      <div className="relative lg:absolute lg:top-1/2 lg:right-[5%] lg:lg:right-[10%] lg:-translate-y-1/2 z-30 w-full lg:max-w-[500px] px-0 lg:px-6 order-2">
        <div className="bg-[#0a0a0a]/60 lg:bg-[#0a0a0a]/65 backdrop-blur-xl border border-white/10 p-8 lg:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {" "}
          {/* Top Gold Accent Line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-[#DAA520] via-[#8a6d21] to-transparent"></div>
          <div className="mb-10">
            <h2 className="text-4xl lg:text-6xl font-marcellus text-white uppercase tracking-tighter leading-none">
              {yacht.name}
            </h2>
            <p className="text-[#DAA520] font-sans text-[10px] tracking-[0.5em] uppercase mt-4 opacity-80">
              Vessel Specification
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mb-10">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 border-b border-white/5 pb-3 items-start"
              >
                {/* Label: Takes up 4 columns out of 12 */}
                <span className="col-span-4 text-white/40 text-[9px] tracking-[0.3em] font-sans uppercase pt-1">
                  {spec.label}
                </span>

                {/* Value: Takes up 8 columns and wraps naturally */}
                <span className="col-span-8 text-white font-marcellus text-sm uppercase tracking-widest text-right leading-relaxed">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">
                Charter Value
              </span>
              <p className="text-2xl font-marcellus text-white mt-1">
                {yacht.weeklyRatePrice}
              </p>
            </div>

            <button
              onClick={() => setIsPopupOpen(true)}
              className="w-full bg-[#DAA520] hover:bg-white text-black py-5 text-xs font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-[0_0_30px_rgba(218,165,32,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              Secure This Vessel
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          display: none !important;
        }
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default YachtSwiper;
