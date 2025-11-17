import React from "react";
import { Instagram, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileSection = ({
  heading = "OUR TEAM",
  subtitle = "BESPOKE SERVICES MANAGED WITH PRECISION",
  paragraph = "For effortless execution and absolute peace of mind appoint GEORGE YACHTS as your indispensable partner in your superyacht journey.",
  imageUrl = "/images/about-us.jpg",
  altText = "Luxury yacht background covering full width",
  instagramUrl,
  bgColor = "bg-black",
  textColor = "text-white",
  accentColor = "text-[#CEA681]",
}) => {
  const router = useRouter();
  const DESKTOP_HEIGHT_CLASSES = "lg:h-[710px]";
  const FALLBACK_IMAGE =
    "https://placehold.co/1920x710/02132d/ffffff?text=Image+Loading";

  const colorMap = {
    "bg-black": "rgba(0, 0, 0)",
    "bg-gray-100": "rgba(243, 244, 246)",
  };
  const gradientColor = colorMap[bgColor] || "rgba(0, 0, 0)";

  return (
    <section className={`relative w-full overflow-hidden ${bgColor}`}>
      {/* Container for Mobile Layout (Image on top) */}
      <div className="block md:hidden">
        {/* Mobile Image container */}
        <div className="relative w-full h-[45vh]">
          <img
            src={imageUrl || FALLBACK_IMAGE}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${gradientColor} 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        {/* Mobile Text Content (Below image) */}
        <div className={`relative z-10 p-8 text-start ${textColor}`}>
          <div className="max-w-xl">
            <h1
              className={`text-4xl font-bold ${textColor} tracking-tight drop-shadow-lg mb-2`}
            >
              {heading}
            </h1>
            <p
              className={`text-3xl font-normal ${accentColor} tracking-tight drop-shadow-lg mb-6`}
            >
              {subtitle}
            </p>
            {paragraph && (
              <p
                className={`mt-4 text-lg ${textColor} opacity-90 drop-shadow-md`}
              >
                {paragraph}
              </p>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-start ${textColor} hover:${accentColor} transition-colors duration-300 mt-6`}
              >
                <Instagram className="w-7 h-7" />
                <span className="text-base font-semibold uppercase"></span>
              </a>
            )}
            {/* 4. "Go Back" Button (Mobile) */}
            <div className="flex flex-col items-start justify-start">
              <button
                onClick={() => router.back()}
                className={`flex items-center justify-center rounded-full border-2 bg-white text-black  mt-6 px-4 py-2 cursor-pointer`}
              >
                <span className="text-sm font-semibold uppercase">Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container for Desktop Layout (Split screen) */}
      <div
        className={`hidden md:flex relative w-full ${DESKTOP_HEIGHT_CLASSES} z-0`}
      >
        {/* Desktop Image Section (Right 1/4) */}
        <div className="absolute top-0 right-0 h-full w-1/4 z-0">
          <img
            src={imageUrl || FALLBACK_IMAGE}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => (e.targe.src = FALLBACK_IMAGE)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${gradientColor} 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Desktop Text Content Block (Left 3/4) */}
        <div className="relative z-10 h-full w-3/4 max-w-[1530px] mx-auto p-8 flex items-center">
          <div className="relative z-10 flex items-center justify-start h-full text-start lg:pl-[140px] p-8">
            {/* 🛑 FIX: Added flex flex-col to stack the links vertically */}
            <div className="max-w-xl flex flex-col items-start">
              <h1
                className={`text-5xl md:text-6xl font-bold ${textColor} tracking-tight drop-shadow-lg mb-2`}
              >
                {heading}
              </h1>
              <p
                className={`text-3xl font-normal ${accentColor} tracking-tight drop-shadow-lg`}
              >
                {subtitle}
              </p>
              {paragraph && (
                <p
                  className={`mt-8 text-lg ${textColor} opacity-90 drop-shadow-md`}
                >
                  {paragraph}
                </p>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-start ${textColor} hover:${accentColor} transition-colors duration-300 mt-6`}
                >
                  <Instagram className="w-7 h-7" />
                  <span className="text-base font-semibold uppercase"></span>
                </a>
              )}
              {/* 4. "Go Back" Button (Desktop) */}
              <div className="flex flex-col items-start justify-start">
                <button
                  onClick={() => router.back()}
                  className={`flex items-center justify-center rounded-full border-2 bg-white text-black hover:bg-[#CEA681] mt-6 px-4 py-2 cursor-pointer`}
                >
                  <span className="text-sm uppercase font-semibold">
                    Go Back
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
