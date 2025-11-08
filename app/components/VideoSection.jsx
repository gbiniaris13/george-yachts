import React from "react";
import { Instagram } from "lucide-react"; // Note: This is no longer used but kept in case
import Link from "next/link"; // Import Link for navigation

// --- START: Data for Overlay Squares ---
// Utility function remains the same
const getSolidColor = (color) => color.replace(/\/\d+|([d79]e)$/g, "");

// 🛑 UPDATED DATA: 6 items with new fields
const overlayItems = [
  // --- Left Column ---
  {
    titleLine1: "CHARTER",
    titleLine2: "A YACHT",
    subline: "Tailor-made charters across Greece & the Med.",
    buttonText: "Start your charter",
    href: "/charter-yacht-greece/",
    height: "h-1/3", // 🛑 Changed from % to 1/3
    color: "bg-white/70",
    solidColor: getSolidColor("bg-white"),
    textColor: "text-black",
    btnBg: "bg-transparent",
    btnText: "text-black",
    btnBorder: "border border-black",
    btnHoverBg: "group-hover:bg-[#000]",
    btnHoverText: "group-hover:text-white",
  },
  {
    titleLine1: "BUY",
    titleLine2: "A YACHT",
    subline: "Curated listings • Discreet sourcing • Clear surveys.",
    buttonText: "View yachts for sale",
    href: "/yachts-for-sale/", // Update href as needed
    height: "h-1/3", // 🛑 Changed from % to 1/3
    color: "bg-black/70",
    solidColor: getSolidColor("bg-black"),
    textColor: "text-white",
    btnBg: "bg-transparent",
    btnText: "text-white",
    btnBorder: "border border-white",
    btnHoverBg: "group-hover:bg-[#fff]",
    btnHoverText: "group-hover:text-black",
  },
  {
    titleLine1: "VILLAS & REAL ESTATE",
    titleLine2: "STAY / INVEST",
    subline: "Luxury villa stays, plus discreet buying advisory.",
    buttonText: "Explore villas & homes",
    href: "/luxury-villas-greece/", // Update href as needed
    height: "h-1/3", // 🛑 New item
    color: "bg-white/70",
    solidColor: getSolidColor("bg-white"),
    textColor: "text-black",
    btnBg: "bg-transparent",
    btnText: "text-black",
    btnBorder: "border border-black",
    btnHoverBg: "group-hover:bg-[#000]",
    btnHoverText: "group-hover:text-white",
  },
  // --- Right Column ---
  {
    titleLine1: "FLY",
    titleLine2: "PRIVATE",
    subline: "Helicopters & jets • Athens, islands, Med hops.",
    buttonText: "Request a flight",
    href: "/private-jet-charter/",
    height: "h-1/3", // 🛑 Changed from % to 1/3
    color: "bg-black/70",
    solidColor: getSolidColor("bg-black"),
    textColor: "text-white",
    btnBg: "bg-transparent",
    btnText: "text-white",
    btnBorder: "border border-white",
    btnHoverBg: "group-hover:bg-[#fff]",
    btnHoverText: "group-hover:text-black",
  },
  {
    titleLine1: "VIP",
    titleLine2: "TRANSFERS",
    subline: "Chauffeured sedans, SUVs & sprinters • 24/7.",
    buttonText: "Book a transfer",
    href: "/vip-transfers-greece/", // Update href as needed
    height: "h-1/3", // 🛑 Changed from % to 1/3
    color: "bg-white/70",
    solidColor: getSolidColor("bg-white"),
    textColor: "text-black",
    btnBg: "bg-transparent",
    btnText: "text-black",
    btnBorder: "border border-black",
    btnHoverBg: "group-hover:bg-[#000]",
    btnHoverText: "group-hover:text-white",
  },
  {
    titleLine1: "SIGNATURE",
    titleLine2: "ITINERARIES",
    subline: "Cyclades, Ionian, Saronic — time-true routes.",
    buttonText: "Explore itineraries",
    href: "/yacht-itineraries-greece/", // Update href as needed
    height: "h-1/3", // 🛑 New item
    color: "bg-black/70",
    solidColor: getSolidColor("bg-black"),
    textColor: "text-white",
    btnBg: "bg-transparent",
    btnText: "text-white",
    btnBorder: "border border-white",
    btnHoverBg: "group-hover:bg-[#fff]",
    btnHoverText: "group-hover:text-black",
  },
];
// --- END: Data for Overlay Squares ---

// 🛑 MODIFIED Component for a single interactive square
const OverlaySquare = ({
  titleLine1,
  titleLine2,
  subline,
  buttonText,
  href,
  color,
  textColor,
  btnBg,
  btnText,
  btnBorder,
  btnHoverBg,
  btnHoverText,
}) => {
  // For the mobile stack (non-overlapping), we don't want the opacity layer
  const showOpacityOverlay = color.includes("opacity-100");

  return (
    // Anchor tag uses the appropriate color class from props
    // Use Link for internal navigation, <a> for external
    <Link
      href={href}
      className={`relative p-6 group h-full w-full block transition duration-300 ease-in-out cursor-pointer ${color}`}
    >
      {/* 1. Background Overlay (Only visible in desktop/overlapping context) */}
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
            <span className="inline-block">{titleLine1}</span>
            <br />
            <span className="inline-block font-normal text-2xl mt-1">
              {titleLine2}
            </span>
          </h2>
          {/* 🛑 Added Subline */}
          <p className="text-xs mt-2 opacity-90 font-medium">{subline}</p>
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
          aria-label={`Find out more about ${titleLine1} ${titleLine2}`}
        >
          {buttonText}
        </button>
      </div>
    </Link>
  );
};

const VideoSection = () => {
  const allItems = overlayItems;
  const desktopLeft = [allItems[0], allItems[1], allItems[2]];
  const desktopRight = [allItems[3], allItems[4], allItems[5]];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[60vh] lg:h-[710px] z-0">
        <div className="absolute inset-0 z-0">
          <video
            src="/videos/yacht-cruising.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        <div className="absolute right-0 top-0 h-full hidden lg:flex z-10 flex-row shadow-2xl w-[40vw]">
          <div className="flex flex-col w-1/2 h-full">
            <div className={desktopLeft[0].height}>
              <OverlaySquare {...desktopLeft[0]} color={desktopLeft[0].color} />
            </div>
            <div className={desktopLeft[1].height}>
              <OverlaySquare {...desktopLeft[1]} color={desktopLeft[1].color} />
            </div>
            <div className={desktopLeft[2].height}>
              <OverlaySquare {...desktopLeft[2]} color={desktopLeft[2].color} />
            </div>
          </div>

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
            <div className={desktopRight[2].height}>
              <OverlaySquare
                {...desktopRight[2]}
                color={desktopRight[2].color}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 h-full w-full lg:w-[calc(100%-40vw)] z-10 hidden lg:block"></div>
      </div>

      <div className="lg:hidden w-full flex flex-col">
        {allItems.map((item, index) => (
          <div key={index} className="w-full h-48 sm:h-64">
            <OverlaySquare {...item} color={item.solidColor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
