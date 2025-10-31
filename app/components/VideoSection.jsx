// --- START: Data for Overlay Squares ---
// Utility function to remove opacity from a Tailwind custom color string for solid mobile display
const getSolidColor = (color) => color.replace(/\/\d+|([d79]e)$/g, "");

const overlayItems = [
  // Left Column: BUY A YACHT (440px -> 60%)
  {
    title: "BUY A YACHT",
    href: "#buy",
    height: "h-[60%]",
    color: "bg-black/70", // Desktop Color (with 70% opacity)
    solidColor: getSolidColor("bg-black"),
    textColor: "text-white", // Text will use the CSS gradient
    btnBg: "bg-transparent",
    btnText: "text-white", // Button text uses the dark gold gradient
    btnBorder: "border border-white", // Uses interpolation for custom color border
    btnHoverBg: "group-hover:bg-[#fff]", // Button background changes to solid dark gold on hover
    btnHoverText: "group-hover:text-black", // Hover text color is solid black
  },
  // Left Column: SELL MY YACHT (270px -> 40%)
  {
    title: "FLY PRIVATE",
    href: "/aviation-charter/",
    height: "h-[40%]",
    color: "bg-white/70", // CHANGED: Added /70 opacity
    solidColor: getSolidColor("bg-white"),
    textColor: "text-black",
    btnBg: "bg-transparent",
    btnText: "text-black",
    btnBorder: "border border-black",
    btnHoverBg: "group-hover:bg-[#000]",
    btnHoverText: "group-hover:text-white",
  },

  // Right Column: CHARTER A YACHT (270px -> 40%)
  {
    title: "CHARTER A YACHT",
    href: "/yachts-charter/",
    height: "h-[40%]",
    color: "bg-white/70", // CHANGED: Added /70 opacity
    solidColor: getSolidColor("bg-white"),
    textColor: "text-black",
    btnBg: "bg-transparent",
    btnText: "text-black",
    btnBorder: "border border-black",
    btnHoverBg: "group-hover:bg-[#000]",
    btnHoverText: "group-hover:text-white",
  },
  // Right Column: MANAGE A YACHT (440px -> 60%)
  {
    title: "SIGNATURE ITINERARIES",
    href: "#manage",
    height: "h-[60%]",
    color: "bg-black/70", // Desktop Color (with 70% opacity)
    solidColor: getSolidColor("bg-black"),
    textColor: "text-white", // Text will use the CSS gradient
    btnBg: "bg-transparent",
    btnText: "text-white", // Button text uses the dark gold gradient
    btnBorder: "border border-white", // Uses interpolation for custom color border
    btnHoverBg: "group-hover:bg-[#fff]", // Button background changes to solid dark gold on hover
    btnHoverText: "group-hover:text-black", // Hover text color is solid black
  },
];
// --- END: Data for Overlay Squares ---

// Component for a single interactive square
const OverlaySquare = ({
  title,
  href,
  color,
  textColor,
  btnBg,
  btnText,
  btnBorder,
  btnHoverBg,
  btnHoverText,
}) => {
  const [primaryWord, ...restOfTitle] = title.split(" ");
  const secondaryTitle = restOfTitle.join(" ");

  // For the mobile stack (non-overlapping), we don't want the opacity layer
  const showOpacityOverlay = color.includes("opacity-100"); // Simple check to see if this square is part of the desktop layout

  return (
    // Anchor tag uses the appropriate color class from props
    <a
      href={href}
      className={`relative p-6 group h-full w-full block transition duration-300 ease-in-out cursor-pointer ${color}`}
    >
      {/* 1. Background Overlay (Only visible in desktop/overlapping context) */}
      {/* On mobile (when color is solid), this inner div is effectively ignored */}
      <div
        className={`absolute inset-0 opacity-100 ${
          showOpacityOverlay ? "group-hover:opacity-40" : "hidden"
        } transition duration-300`}
      ></div>

      {/* 2. Text content and Button container. Text color is dynamic. */}
      <div
        className={`relative z-10 ${textColor} h-full flex flex-col justify-between`}
      >
        {/* Top content (Text) */}
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            <span className="inline-block">{primaryWord}</span>
            <br />
            <span className="inline-block font-normal text-2xl mt-1">
              {secondaryTitle}
            </span>
          </h2>
        </div>

        {/* Bottom content (Button) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = href;
          }}
          className={`mt-4 px-6 py-1.5 text-xs font-semibold rounded-full self-start transition duration-200 active:scale-[0.98] 
                      ${btnBg} ${btnText} ${btnBorder} ${btnHoverBg} ${btnHoverText} 
                      focus:ring-0 focus:outline-none focus:border-white`}
          aria-label={`Find out more about ${title}`}
        >
          Explore
        </button>
      </div>
    </a>
  );
};

// Main Video Section Component
const VideoSection = () => {
  const allItems = overlayItems;
  const desktopLeft = [allItems[0], allItems[1]];
  const desktopRight = [allItems[2], allItems[3]];

  // No need for totalHeight calculation, as content flows naturally
  return (
    // Removed fixed height style to allow content to stack on mobile
    <div className="relative w-full overflow-hidden">
      {/* 1. Video Background Container (Fixed height on mobile/tablet, stretches on desktop) */}
      <div className="relative w-full h-[60vh] lg:h-[710px] z-0">
        <div className="absolute inset-0 z-0">
          <video
            src="/videos/yacht-cruising.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            // poster="https://placehold.co/1920x1080/0d1a2f/ffffff?text=Video+Loading"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* 2. DESKTOP Overlay Grid Container (Visible lg: and above) */}
        <div className="absolute right-0 top-0 h-full hidden lg:flex z-10 flex-row shadow-2xl w-[40vw]">
          {/* A. Left Inner Column (1/2 of 40vw width) */}
          <div className="flex flex-col w-1/2 h-full">
            <div className={desktopLeft[0].height}>
              <OverlaySquare {...desktopLeft[0]} color={desktopLeft[0].color} />
            </div>
            <div className={desktopLeft[1].height}>
              <OverlaySquare {...desktopLeft[1]} color={desktopLeft[1].color} />
            </div>
          </div>

          {/* B. Right Inner Column (1/2 of 40vw width) */}
          <div className="flex flex-col w-1/2 h-full">
            <div className={desktopRight[0].height}>
              <OverlaySquare
                {...desktopRight[0]}
                color={desktopRight[0].color}
              />
            </div>
            <div className={desktopRight[1].height}>
              <OverlaySquare
                {...desktopRight[1]}
                color={desktopRight[1].color}
              />
            </div>
          </div>
        </div>

        {/* Content area to the left of the overlay (Desktop only) */}
        <div className="absolute left-0 top-0 h-full w-full lg:w-[calc(100%-40vw)] z-10 hidden lg:block"></div>
      </div>

      {/* 3. MOBILE STACKED Content (Visible below the video on smaller screens) */}
      <div className="lg:hidden w-full flex flex-col">
        {allItems.map((item, index) => (
          // Mobile squares take full width and a fixed height, stacked vertically
          <div key={index} className="w-full h-48 sm:h-64">
            <OverlaySquare
              // Pass the solid color for mobile
              {...item}
              color={item.solidColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
