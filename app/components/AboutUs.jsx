import React from "react";
import { Instagram } from "lucide-react";

const AboutUs = ({
  heading = "OUR TEAM",
  subtitle = "BESPOKE SERVICES MANAGED WITH PRECISION",
  paragraph = "For effortless execution and absolute peace of mind appoint GEORGE YACHTS as your indispensable partner in your superyacht journey.",
  imageUrl = "/images/about-us.jpg",
  altText = "Luxury yacht background covering full width",
  instagramUrl,
}) => {
  const HEIGHT_CLASSES = "h-[60vh] lg:h-[710px]";
  const FALLBACK_IMAGE =
    "https://placehold.co/1920x710/02132d/ffffff?text=Image+Loading";

  return (
    <section className="relative w-full overflow-hidden">
      <div className={`relative w-full ${HEIGHT_CLASSES} z-0`}>
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl || FALLBACK_IMAGE}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative z-10 h-full max-w-[1530px] mx-auto p-8">
          <div className="relative z-10 flex items-center justify-start h-full text-start lg:pl-[140px] p-8">
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
                {heading}
              </h1>
              <p className="text-3xl font-normal text-white tracking-tight drop-shadow-lg">
                {subtitle}
              </p>
              {paragraph && (
                <p className="max-w-sm mt-8 text-lg text-white/90 drop-shadow-md">
                  {paragraph}
                </p>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start text-white mt-6"
                >
                  <Instagram className="w-7 h-7" />
                  <span className="text-base font-semibold uppercase"></span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
