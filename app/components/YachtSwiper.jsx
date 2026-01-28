"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import EnquirePopup from "./EnquirePopup";

// --- SVG ICONS ---
const ShareIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);
const CheckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// --- NEW INTERNAL COMPONENT: HANDLES THE LUXURY FADE-IN ---
const LuxuryImage = ({ src, alt, priority, metadata }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      {/* 1. Next.js Image with Fade Logic */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 80vw"
        quality={90}
        // If metadata exists, use blur. If not, use the CSS fade fallback.
        placeholder={metadata?.lqip ? "blur" : "empty"}
        blurDataURL={metadata?.lqip}
        // This function fires when the image is downloaded and ready
        onLoad={() => setIsLoading(false)}
        className={`
          object-cover 
          duration-1200 ease-out transition-all
          ${isLoading ? "scale-110 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"}
        `}
      />

      {/* 2. Deep Gradient Overlay (Always on top) */}
      <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-[#020617]/40 pointer-events-none"></div>
    </div>
  );
};

const YachtSwiper = ({ yachtData }) => {
  if (!yachtData) return null;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const yacht = yachtData;
  const slug =
    yacht.slug?.current ||
    yacht.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Filter valid images
  const validImages = yacht.images?.filter((img) => img?.asset?.url) || [];

  const specs = [
    { label: "LENGTH", value: yacht.length },
    { label: "BUILDER", value: yacht.subtitle },
    { label: "GUESTS", value: yacht.sleeps },
    { label: "REGION", value: yacht.cruisingRegion },
  ];

  const lightboxSlides = validImages.map((image) => ({
    src: image.asset.url,
  }));

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (validImages.length === 0) return null;

  return (
    <section
      id={slug}
      className="relative w-full mb-20 lg:mb-32 group flex flex-col scroll-mt-24"
    >
      <EnquirePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        yachtName={yacht.name}
      />

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Thumbnails]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .95)" } }}
      />

      <div className="relative h-[50vh] lg:h-[85vh] w-full overflow-hidden border-y border-white/5 order-1">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-full w-full cursor-zoom-in"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                {/* USE THE NEW LUXURY IMAGE COMPONENT */}
                <LuxuryImage
                  src={image.asset.url}
                  alt={yacht.name}
                  priority={index === 0}
                  metadata={image.asset.metadata} // Pass metadata if it exists
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hidden lg:flex absolute bottom-10 left-[10%] z-40 items-center gap-12 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="h-px w-20 bg-white/20"></span>
            <p className="text-white/40 font-marcellus text-xs tracking-widest">
              SCROLL TO EXPLORE
            </p>
          </div>
        </div>
      </div>

      <div className="relative lg:absolute lg:top-1/2 lg:right-[5%] lg:lg:right-[10%] lg:-translate-y-1/2 z-30 w-full lg:max-w-[500px] px-0 lg:px-6 order-2">
        <div className="bg-[#0a0a0a]/40 lg:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 p-8 lg:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-[#DAA520] via-[#8a6d21] to-transparent"></div>

          <button
            onClick={handleShare}
            className="absolute top-8 right-8 flex items-center gap-2 group/share focus:outline-none"
          >
            <span
              className={`text-[9px] font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 ${isCopied ? "text-white" : "text-transparent group-hover/share:text-white/70"}`}
            >
              {isCopied ? "LINK COPIED" : "SHARE"}
            </span>
            <div
              className={`p-2 border border-white/10 rounded-full transition-all duration-300 ${isCopied ? "bg-white text-black border-white" : "text-[#DAA520] hover:border-[#DAA520]"}`}
            >
              {isCopied ? (
                <CheckIcon className="w-3 h-3" />
              ) : (
                <ShareIcon className="w-3 h-3" />
              )}
            </div>
          </button>

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
                <span className="col-span-4 text-white/40 text-[9px] tracking-[0.3em] font-sans uppercase pt-1">
                  {spec.label}
                </span>
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
              className="w-full text-black py-5 text-xs font-sans font-bold tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(218,165,32,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:brightness-110 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              }}
            >
              Plan this charter
            </button>

            {yacht.brochure && (
              <a
                href={yacht.brochure}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-transparent border border-white/10 text-white/50 py-4 text-[10px] font-sans font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-white/30 text-center block"
              >
                Download Brochure
              </a>
            )}
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
