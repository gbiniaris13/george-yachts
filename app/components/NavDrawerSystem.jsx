"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, Instagram, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { name: "FIND YOUR YACHT", href: "/yacht-finder/" },
  { name: "BUILD YOUR ITINERARY", href: "/itinerary-builder/" },
  { name: "COST CALCULATOR", href: "/cost-calculator/" },
  { name: "ISLAND QUIZ", href: "/island-quiz/" },
  { name: "YACHT ITINERARIES", href: "/yacht-itineraries-greece/" },
  { name: "HOW IT WORKS", href: "/how-it-works/" },
  { name: "BUY A YACHT", href: "/yachts-for-sale/" },
  { name: "FLY PRIVATE", href: "/private-jet-charter/" },
  { name: "VIP TRANSFERS", href: "/vip-transfers-greece/" },
  { name: "BLOG", href: "/blog" },
  { name: "FAQ", href: "/faq" },
];

// --- 2. LEGAL LINKS ---
const legalLinks = [
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

const NavDrawerSystem = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when route changes (fixes the double-tap bug)
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // UPDATED: Always white text, whether transparent or scrolled (black)
  const currentTextColor = "text-white";

  // UPDATED: Background logic (Transparent -> Black)
  const navBackground = scrolled ? "#000000" : "transparent";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: navBackground,
          transition: "background-color 0.5s ease, height 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s ease",
          height: scrolled ? "72px" : "140px",
          paddingTop: scrolled ? "0px" : "12px",
        }}
      >
        <div className="flex items-center justify-between h-full relative">
          {/* --- 1. LEFT — Menu Button --- */}
          <div className="flex items-center w-20">
            <button
              onClick={toggleDrawer}
              className={`p-2 ${currentTextColor} hover:text-[#DAA520] cursor-pointer focus:outline-none transition duration-300 active:scale-95`}
              aria-label="Toggle menu"
              data-cursor="Menu"
              style={{ touchAction: "manipulation" }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* --- 2. CENTER — Logo (shrinks on scroll) --- */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 shrink-0 group" data-cursor="Home">
            <img
              src="/images/yacht-icon-only.svg"
              alt="George Yachts Brokerage House"
              className="group-hover:opacity-80"
              style={{
                height: scrolled ? "40px" : "clamp(70px, 12vw, 110px)",
                width: "auto",
                transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
              }}
            />
          </Link>

          {/* --- 3. RIGHT — Social Icons --- */}
          <div className="flex items-center gap-1 w-20 justify-end">
            <a
              href="https://www.instagram.com/georgeyachts"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-9 h-9 flex items-center justify-center border border-white/[0.06] hover:border-[#DAA520]/30 transition-all duration-500"
              aria-label="Instagram"
              data-cursor="Instagram"
            >
              <Instagram className="w-[14px] h-[14px] text-white/40 group-hover:text-[#DAA520] transition-colors duration-300" />
            </a>
            {/* WhatsApp moved to floating button — see WhatsAppButton.jsx */}
            {/* Favorites heart link */}
            <a
              href="/favorites"
              className="group relative w-9 h-9 flex items-center justify-center border border-white/[0.06] hover:border-[#DAA520]/30 transition-all duration-500"
              aria-label="My Favorites"
              data-cursor="Favorites"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 group-hover:text-[#DAA520] transition-colors duration-300">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* --- DRAWER --- */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isDrawerOpen
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        onTouchEnd={(e) => { e.preventDefault(); closeDrawer(); }}
        style={{ touchAction: "manipulation" }}
        aria-hidden={!isDrawerOpen}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[370px] xl:w-[700px] bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        <div className="p-8 h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center pb-6 ">
            {/* Logo in drawer — original yacht icon + text */}
            <Link href="/" className="flex items-center gap-4" onClick={closeDrawer}>
              <img
                src="/images/yacht-icon-only.svg"
                alt="George Yachts"
                style={{ height: "36px", width: "auto" }}
              />
              <div className="flex flex-col">
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", fontWeight: 300, letterSpacing: "0.1em", color: "#fff", lineHeight: 1 }}>
                  GEORGE YACHTS
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "6px", letterSpacing: "0.25em", color: "rgba(218,165,32,0.5)", marginTop: "4px" }}>
                  BROKERAGE HOUSE LLC
                </span>
              </div>
            </Link>
            <button
              onClick={closeDrawer}
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
                  onClick={closeDrawer}
                  className="block w-full py-3 px-1 border-b border-white/20 text-xl font-semibold uppercase text-white hover:text-[#CEA681] transition duration-200 active:text-[#DAA520]"
                  style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
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
                onClick={closeDrawer}
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
