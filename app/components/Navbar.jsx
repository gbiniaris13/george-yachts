"use client";

import React, { useState, useEffect } from "react";
import { Menu, Linkedin, Instagram } from "lucide-react";

const Navbar = ({ toggleDrawer }) => {
  // State to track if the user has scrolled past a certain point
  const [scrolled, setScrolled] = useState(false);

  // useEffect to add and remove the scroll listener
  useEffect(() => {
    const handleScroll = () => {
      // FIX: The scroll effect is now applied on all screen sizes.
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const socialIcons = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/georgeyachts",
      name: "Instagram",
    },
  ];

  // Determine the current text color based on scroll state
  const scrolledTextColor = scrolled ? "text-[#02132d]" : "text-white";
  const currentTextColor = scrolled ? scrolledTextColor : "text-white";

  // Class for desktop icons (centered, blurred)
  const desktopIconClasses =
    "flex items-center space-x-3 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm";
  // Class for mobile icons (far right, no blur)
  const mobileIconClasses = "flex items-center space-x-3 z-10 p-2 rounded-full";

  // Component to render the social icons, reused for both positions
  const SocialIconGroup = ({ className, iconClasses }) => (
    <div className={className}>
      <div className={iconClasses}>
        {socialIcons.map((Social, index) => (
          <a
            key={index}
            href={Social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${currentTextColor} hover:text-[#DAA520] p-1 rounded-full transition duration-150 active:scale-95 drop-shadow-md`}
            aria-label={`Link to ${Social.name}`}
          >
            <Social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    // --- 1. Fixed Navigation Bar ---
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300`}
      // Apply the semi-transparent white background via inline style when scrolled (on all screens)
      style={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.5)" : "transparent",
      }}
    >
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Row: Uses Grid for Left/Right, and Absolute for Center */}
        <div className="grid grid-cols-2 items-center h-20 relative">
          {/* A. Left Section (Menu Button and Logo/Title) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDrawer}
              className={`p-2 rounded-full ${currentTextColor} hover:text-[#DAA520] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DAA520] transition duration-150 active:scale-95 drop-shadow-md`}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-shrink-0">
              <a
                href="/"
                className="text-2xl font-extrabold text-indigo-400 tracking-wider"
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`the text-[10px] drop-shadow-md ${currentTextColor}`}
                  >
                    THE
                  </span>
                  <span
                    className={`george-yachts text-base drop-shadow-md ${currentTextColor}`}
                  >
                    GEORGE YACHTS
                  </span>
                  <span
                    className={`the text-[10px] drop-shadow-md ${currentTextColor}`}
                  >
                    YACHT BROKERAGE
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* C. Right Section: Social Media Icons (FAR RIGHT on Mobile/Tablet) */}
          <SocialIconGroup
            className="flex justify-end lg:hidden"
            iconClasses={mobileIconClasses}
          />

          {/* B. Center Section: Social Media Icons (CENTERED on Desktop ONLY) */}
          {/* Removed from grid flow and centered absolutely using inset-x-0 */}
          <div className="hidden lg:flex absolute inset-x-0 mx-auto w-fit">
            <div className={desktopIconClasses}>
              {socialIcons.map((Social, index) => (
                <a
                  key={index}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${currentTextColor} hover:text-[#DAA520] p-1 rounded-full transition duration-150 active:scale-95 drop-shadow-md`}
                  aria-label={`Link to ${Social.name}`}
                >
                  <Social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
