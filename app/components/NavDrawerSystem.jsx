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

const navLinks = [
  {
    name: "ABOUT",
    sublinks: [
      { name: "About Us", href: "/about-us" },
      { name: "Core Team", href: "/team" },
      { name: "Press & Media", href: "#about/media" },
    ],
  },
  {
    name: "CHARTER",
    sublinks: [
      { name: "Charter a Yacht", href: "/yachts-charter/" },
      { name: "Aviation Charter", href: "/aviation-charter/" },
    ],
  },
  {
    name: "SALES",
    sublinks: [
      { name: "Buy a Yacht", href: "#sales/new" },
      { name: "Sell My Yacht", href: "#sales/used" },
    ],
  },
  { name: "CONTACT" },
  { name: "FAQ" },
];

const WHATSAPP_NUMBER = "+17867988788";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "I'm interested in chartering a yacht and would like to chat."
);

const NavDrawerSystem = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isDrawerOpen) {
      setOpenMenu(null);
    }
  };

  const toggleSubMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
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

  const socialIcons = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/georgeyachts",
      name: "Instagram",
    },
    {
      icon: WhatsappIcon,
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(
        "+",
        ""
      )}?text=${WHATSAPP_MESSAGE}`,
      name: "WhatsApp",
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

          <nav className="space-y-4 mt-6 grow overflow-y-auto">
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
