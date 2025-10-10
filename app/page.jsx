"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./components/Navbar";
import VideoSection from "./components/VideoSection";
import Disruptors from "./components/Disruptors";
import TwoColumnLayout from "./components/TwoColumnLayout";
import Footer from "./components/Footer";
import ContactFormSection from "./components/ContactFormSection";
import ScrollPopup from "./components/ScrollPopup";

const navLinks = [
  {
    name: "ABOUT",
    sublinks: [
      { name: "About Us", href: "#about/team" },
      { name: "Our Team", href: "#about/history" },
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

// Renamed 'App' to 'Home' (or default export name for the page file)
const Home = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar toggleDrawer={toggleDrawer} />

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isDrawerOpen
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
        aria-hidden={!isDrawerOpen}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full min-w-[370px] xl:min-w-[700px] bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isDrawerOpen ? "translate-x-0" : "translate-x-[-100%]"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        <div className="p-8 h-full flex flex-col">
          {/* Drawer Header & Close Button */}
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
              className="p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links with Subitems */}
          <nav className="space-y-4 mt-6 flex-grow overflow-y-auto">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.name;
              const hasSublinks = link.sublinks && link.sublinks.length > 0;

              return (
                <div key={link.name} className="flex flex-col">
                  {/* Main Link/Toggle Button */}
                  <button
                    onClick={() =>
                      hasSublinks ? toggleSubMenu(link.name) : toggleDrawer()
                    }
                    className={`flex justify-between items-center w-full py-3 px-1 border-b border-white transition duration-200 group focus:outline-none`}
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

                  {/* Sublinks Container - Collapsible (Accordion) */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    {link.sublinks?.map((sublink) => (
                      <a
                        key={sublink.name}
                        href={sublink.href}
                        onClick={toggleDrawer} // Sublinks close the entire drawer
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

      <div>
        <VideoSection />
        <Disruptors />
        <TwoColumnLayout />
        <ContactFormSection />
        <Footer />
      </div>
      <ScrollPopup />
    </div>
  );
};

export default Home;
