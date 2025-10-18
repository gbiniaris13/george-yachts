import React from "react";

const AboutUs = () => {
  // Defines the consistent heights from the previous complex layout
  const MOBILE_HEIGHT_CLASS = "h-[60vh]";
  const DESKTOP_HEIGHT_STYLE = { height: "710px" };

  return (
    <section className="relative w-full overflow-hidden">
      {/* 1. Main Container with Responsive Height (Covers entire viewport width) */}
      <div
        className={`relative w-full ${MOBILE_HEIGHT_CLASS} z-0`}
        style={DESKTOP_HEIGHT_STYLE} // Apply fixed height for lg: and above
      >
        {/* Background Image Container (Covers entire div) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about-us.jpg"
            alt="Luxury yacht background covering full width"
            className="w-full h-full object-cover"
            // Placeholder/Fallback
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/1920x710/02132d/ffffff?text=Image+Loading")
            }
          />
          {/* Optional: Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Optional: Left-Aligned Content Overlay within max-width container */}
        <div className="relative z-10 h-full max-w-[1530px] mx-auto p-8">
          <div
            // FIX: Added justify-start for desktop, text-start for mobile, and left padding
            className="relative z-10 flex items-center justify-start h-full text-start lg:pl-[140px] p-8"
          >
            <div className="max-w-xl">
              {/* NEW PRIMARY HEADING: OUR TEAM */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">
                OUR TEAM
              </h1>

              {/* NEW SUBTITLE: YOUR WORLD, MANAGED WITH PRECISION */}
              {/* Note the font-normal weight and distinct text color */}
              <p className="text-3xl font-normal text-white tracking-tight drop-shadow-lg">
                BESPOKE SERVICES MANAGED WITH PRECISION
              </p>

              {/* PARAGRAPH MOVED BELOW */}
              <p className="mt-8 text-lg text-white/90 drop-shadow-md">
                For effortless execution and absolute peace of mind appoint
                GEORGE YACHTS as your indispensable partner in your superyacht
                journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
