import React from "react";

// Use an inline function to avoid defining constants outside of the component scope
// The HeroSection is designed to be a full-width header banner for any page.
const AboutUs = ({
  // Set default values using the previous hardcoded content
  heading = "OUR TEAM",
  subtitle = "BESPOKE SERVICES MANAGED WITH PRECISION",
  paragraph = "For effortless execution and absolute peace of mind appoint GEORGE YACHTS as your indispensable partner in your superyacht journey.",
  imageUrl = "/images/about-us.jpg",
  altText = "Luxury yacht background covering full width",
}) => {
  // Defines the consistent heights using pure Tailwind for better consistency (h-[60vh] on mobile, lg:h-[710px] on desktop)
  const HEIGHT_CLASSES = "h-[60vh] lg:h-[710px]";

  // Fallback image URL
  const FALLBACK_IMAGE =
    "https://placehold.co/1920x710/02132d/ffffff?text=Image+Loading";

  return (
    <section className="relative w-full overflow-hidden">
      {/* 1. Main Container with Responsive Height (Covers entire viewport width) */}
      <div className={`relative w-full ${HEIGHT_CLASSES} z-0`}>
        {/* Background Image Container (Covers entire div) */}
        <div className="absolute inset-0 z-0">
          {/* Using props for source and alt text */}
          <img
            // Use imageUrl prop, which now defaults to "/images/about-us.jpg",
            // falling back to FALLBACK_IMAGE only if the prop evaluates to null/undefined/empty string.
            src={imageUrl || FALLBACK_IMAGE}
            alt={altText}
            className="w-full h-full object-cover"
            // Ensure a consistent fallback in case the URL is bad
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          />
          {/* Optional: Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Optional: Left-Aligned Content Overlay within max-width container */}
        <div className="relative z-10 h-full max-w-[1530px] mx-auto p-8">
          <div className="relative z-10 flex items-center justify-start h-full text-start lg:pl-[140px] p-8">
            <div className="max-w-xl">
              {/* PRIMARY HEADING (from prop) */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">
                {heading}
              </h1>

              {/* SUBTITLE (from prop) */}
              <p className="text-3xl font-normal text-white tracking-tight drop-shadow-lg">
                {subtitle}
              </p>

              {/* PARAGRAPH (from prop) */}
              {paragraph && (
                <p className="mt-8 text-lg text-white/90 drop-shadow-md">
                  {paragraph}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
