"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Linkedin,
  Instagram,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const navLinks = [
  {
    name: "ABOUT",
    sublinks: [
      { name: "About Us", href: "//our-team" },
      { name: "Our Team", href: "/our-team" },
      { name: "Locations", href: "#about/media" },
      { name: "Press & Media", href: "#about/media" },
    ],
  },
  {
    name: "CHARTER",
    sublinks: [
      { name: "Charter a Yacht", href: "#charter/fleet" },
      { name: "Charter Management", href: "#charter/destinations" },
    ],
  },
  {
    name: "SALES",
    sublinks: [
      { name: "Buy a Yacht", href: "#sales/new" },
      { name: "Sell My Yacht", href: "#sales/used" },
    ],
  },
  { name: "BUILD" },
  { name: "MANAGE" },
  { name: "CONTACT" },
  { name: "FAQ" },
];

const NavDrawerSystem = () => {
  // --- STATE (Moved from Home Page) ---
  const [scrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // --- HANDLERS (Moved from Home Page) ---

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isDrawerOpen) {
      setOpenMenu(null);
    }
  };

  const toggleSubMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // --- SCROLL EFFECT (From your original Navbar) ---
  useEffect(() => {
    const handleScroll = () => {
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

  // --- STYLING LOGIC (From your original Navbar) ---
  const socialIcons = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/georgeyachts",
      name: "Instagram",
    },
  ];

  const currentTextColor = scrolled ? "text-[#02132d]" : "text-white";
  const desktopIconClasses =
    "flex items-center space-x-3 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm";
  const mobileIconClasses =
    "flex items-center space-x-3 z-10 p-2 rounded-full ";

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
    <>
      {/* --- 1. NAVBAR UI (Your original Navbar.jsx JSX) --- */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 `}
        style={{
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.5)"
            : "transparent",
        }}
      >
        <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-2 items-center h-20 relative">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDrawer}
                className={`p-2 rounded-full ${currentTextColor} hover:text-[#DAA520] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DAA520] transition duration-150 active:scale-95 drop-shadow-md`}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* ... (Logo/Title JSX goes here) ... */}
              <div className="flex-shrink-0">
                <a
                  href="/"
                  className="text-2xl font-extrabold text-indigo-400 tracking-wider "
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

            <SocialIconGroup
              className="flex justify-end lg:hidden"
              iconClasses={mobileIconClasses}
            />

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

      {/* --- 2. DRAWER UI (Moved from Home Page) --- */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isDrawerOpen
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
        aria-hidden={!isDrawerOpen}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full min-w-[370px] xl:min-w-[700px] bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isDrawerOpen ? "translate-x-0" : "translate-x-[-100%]"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center pb-6 ">
            <div className="flex flex-col items-center">
              <span className="the text-white text-[10px]">THE</span>
              <span className="george-yachts text-white text-lg font-bold">
                GEORGE YACHTS
              </span>
              <span className="the text-white text-[10px]">
                YACHT BROKERAGE
              </span>
            </div>
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 active:scale-95 "
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4 mt-6 flex-grow overflow-y-auto">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.name;
              const hasSublinks = link.sublinks && link.sublinks.length > 0;

              return (
                <div key={link.name} className="flex flex-col">
                  <button
                    onClick={() =>
                      hasSublinks ? toggleSubMenu(link.name) : toggleDrawer()
                    }
                    className={`flex justify-between items-center w-full py-3 px-1 border-b border-white transition duration-200 group focus:outline-none cursor-pointer`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xl font-semibold uppercase text-white group-hover:text-white transition duration-200">
                        {link.name}
                      </span>
                      <span className="text-sm text-gray-400 mt-0.5">
                        {link.subtitle}
                      </span>
                    </div>
                    {hasSublinks && (
                      <div className="ml-4 p-1 rounded-full text-gray-400 group-hover:text-white transition duration-200">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    {link.sublinks?.map((sublink) => (
                      <a
                        key={sublink.name}
                        href={sublink.href}
                        onClick={toggleDrawer}
                        className="block py-2 pl-6 pr-1 text-sm text-gray-300 hover:text-[#DAA520] transition duration-150"
                      >
                        {sublink.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavDrawerSystem;
