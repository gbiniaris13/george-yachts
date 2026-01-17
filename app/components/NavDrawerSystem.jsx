"use client";

import React, { useState, useEffect } from "react";
import { Menu, Instagram, X } from "lucide-react";
import Link from "next/link";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

const WhatsappIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z" />
  </svg>
);

// --- 1. MAIN NAVLINKS ---
const navLinks = [
  { name: "ABOUT GEORGE YACHTS", href: "/about-us/" },
  { name: "OUR CORE TEAM", href: "/team/" },
  { name: "CHARTER A YACHT", href: "/charter-yacht-greece/" },
  { name: "BUY A YACHT", href: "/yachts-for-sale/" },
  { name: "FLY PRIVATE", href: "/private-jet-charter/" },
  { name: "VIP TRANSFERS", href: "/vip-transfers-greece/" },
  { name: "FAQ", href: "/faq" },
];

// --- 2. LEGAL LINKS ---
const legalLinks = [
  { name: "Legal", href: "/legal" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

const NavDrawerSystem = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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

  const currentTextColor = "text-white";
  const navBackground = scrolled ? "#000000" : "transparent";

  const iconClasses = `flex items-center space-x-3 z-10 p-2 rounded-full ${
    scrolled ? "bg-white/10" : "bg-white/10 backdrop-blur-sm"
  }`;

  // SHARED CLASS: The gradient hover text
  const hoverGradientText =
    "hover:text-transparent hover:bg-[linear-gradient(90deg,#E6C77A_0%,#C9A24D_45%,#A67C2E_100%)] hover:bg-clip-text transition-all duration-200";
  // SHARED CLASS: Solid gold for icons (since SVG stroke gradients break easily)
  const hoverIconColor = "hover:text-[#C9A24D]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 px-4 sm:px-6 lg:px-8`}
        style={{
          backgroundColor: navBackground,
        }}
      >
        <div className="flex items-center justify-between h-20 relative">
          {/* --- 1. LEFT BLOCK --- */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDrawer}
              // REPLACED: focus:ring-[#CEA681] -> focus:ring-[#C9A24D] (Solid Gold)
              // REPLACED: hover:text-[#CEA681] -> hover:text-[#C9A24D] (Solid Gold for Icon)
              className={`p-2 rounded-full ${currentTextColor} ${hoverIconColor} cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A24D] transition duration-150 active:scale-95 drop-shadow-md`}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* RESTORED: Original Text Logo */}
            <div className="shrink-0">
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

          {/* --- 2. CENTER BLOCK (REMOVED/NUKED) --- */}

          {/* --- 3. RIGHT BLOCK (Social Icons + Text) --- */}
          <div className="flex justify-end">
            <div className={iconClasses}>
              <a
                href="https://www.instagram.com/georgeyachts"
                target="_blank"
                rel="noopener noreferrer"
                // REPLACED: hover:text-[#CEA681] -> hover:text-[#C9A24D]
                className={`${currentTextColor} ${hoverIconColor} p-1 rounded-full transition duration-150 active:scale-95 drop-shadow-md`}
                aria-label="Link to Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://wa.me/17867988798"
                target="_blank"
                rel="noopener noreferrer"
                // REPLACED: hover:text-[#CEA681] -> hover:text-[#C9A24D]
                className={`${currentTextColor} ${hoverIconColor} p-1 rounded-full transition duration-150 active:scale-95 drop-shadow-md flex items-center space-x-2`}
                aria-label="Link to WhatsApp"
              >
                <WhatsappIcon className="w-5 h-5" />
                <span
                  className="hidden lg:inline-block text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ fontFamily: "var(--font-marcellus)" }}
                >
                  {/* Empty span as per your code */}
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* --- FLOATING BUTTON (MOBILE) --- */}
      <FloatingWhatsAppButton />

      {/* --- DRAWER --- */}
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
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        <div className="p-8 h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center pb-6 ">
            {/* RESTORED: Original Text Logo in Drawer */}
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

          <nav className="space-y-4 mt-6">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                <Link
                  href={link.href || "#"}
                  onClick={toggleDrawer}
                  // REPLACED: hover:text-[#CEA681] -> hoverGradientText (Arbitrary Tailwind Value)
                  className={`block w-full py-3 px-1 border-b border-white/20 text-xl font-semibold uppercase text-white ${hoverGradientText}`}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-12 flex space-x-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={toggleDrawer}
                className="text-xs text-gray-500 hover:text-gray-300 transition duration-200"
              >
                {link.name}
              </Link>
            ))}
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()} George Yachts
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDrawerSystem;
