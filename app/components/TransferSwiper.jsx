"use client";

import React, { useState, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectFade } from "swiper/modules";

import { urlFor } from "@/lib/sanity";
import EnquirePopup from "./EnquirePopup"; // 1. Import Popup

// --- SVG Components (No changes) ---
const CustomNextArrowSVG = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width="20"
    height="20"
    focusable="false"
    className="fill-current text-white"
  >
    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
  </svg>
);
const CustomPrevArrowSVG = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width="20"
    height="20"
    focusable="false"
    className="fill-current text-white"
    style={{ transform: "scaleX(-1)" }}
  >
    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
  </svg>
);
// --- End SVG Components ---

const TransferSwiper = ({ transferData }) => {
  if (!transferData) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 2. Add State
  const transfer = transferData;

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const navigationConfig = {
    prevEl: prevRef.current,
    nextEl: nextRef.current,
    disabledClass: "opacity-40 cursor-not-allowed",
  };

  return (
    <section className="max-w-[1440px] mx-auto py-10 px-2">
      {/* 3. Render Popup */}
      <EnquirePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        yachtName={transfer.vehicleType} // Passes Vehicle Type as "Re: [Vehicle]"
      />

      <div className="relative">
        <div className="bg-white border-2 border-[#DAA520] overflow-hidden">
          <div className="lg:grid lg:grid-cols-2">
            <div className="relativel">
              <Swiper
                className="yacht-swiper max-h-[245px] lg:max-h-[477px]"
                modules={[Navigation, Pagination, A11y, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={navigationConfig}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                initialSlide={0}
                effect="fade"
                fadeEffect={{ crossFade: true }}
              >
                {transfer.images &&
                  transfer.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={urlFor(image.asset).width(1200).height(800).url()}
                        alt={
                          image.alt ||
                          transfer.vehicleType + " image " + (index + 1)
                        }
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </SwiperSlide>
                  ))}
                <div
                  ref={prevRef}
                  className="absolute top-1/2 left-3 z-10 p-3 rounded-full bg-[rgb(0_0_0_/60%)] transform -translate-y-1/2 flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <CustomPrevArrowSVG />
                </div>
                <div
                  ref={nextRef}
                  className="absolute top-1/2 right-3 z-10 p-3 rounded-full bg-[rgb(0_0_0_/60%)] transform -translate-y-1/2 flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <CustomNextArrowSVG />
                </div>
              </Swiper>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-between h-full">
              <div className="flex flex-col md:justify-start md:items-start">
                <h2 className="text-[35px] text-center md:text-start font-bold text-[#02132d]">
                  {transfer.vehicleType}
                </h2>
                <p className="text-[24px] font-normal uppercase text-[#DAA520] text-center md:text-start leading-none mb-6">
                  {transfer.transfersFromTo}
                </p>
                <div className="py-4 max-w-xl md:w-full border-b border-gray-300">
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <p className="text-gray-500 font-normal text-base">
                      Capacity
                    </p>
                    <p className="text-gray-500 font-normal text-base">
                      {transfer.capacity}
                    </p>
                    <p className="text-gray-500 font-normal text-base">
                      Includes
                    </p>
                    <p className="text-gray-500 font-normal text-base">
                      {transfer.includes?.join(", ")}
                    </p>
                    <p className="text-gray-500 font-normal text-base">
                      Availability
                    </p>
                    <p className="text-gray-500 font-normal text-base">
                      {transfer.availability}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 md:right-[-50px] md:left-auto">
              <button
                // 4. Connect Button
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-3 bg-[#DAA520] text-black font-bold uppercase tracking-wider rounded-full hover:bg-black hover:text-white cursor-pointer"
              >
                ENQUIRE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferSwiper;
