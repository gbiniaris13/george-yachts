"use client";

import React from "react";
import { Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  // Dynamic year for copyright
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "TERMS OF SERVICE", href: "/terms-of-service" },
    { name: "PRIVACY POLICY", href: "/privacy-policy" },
    { name: "COOKIE POLICY", href: "/cookie-policy" },
  ];

  return (
    <footer className="w-full bg-black text-white py-12 px-4 sm:px-6 lg:px-8 z-40 border-t border-white/10">
      <div className="max-w-[1530px] mx-auto flex flex-col space-y-10">
        {/* --- TOP SECTION: Social, Company Info, Links --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6 items-center lg:items-start">
          {/* 1. Social Icons & IYBA (Left on Desktop, Center on Mobile) */}
          <div className="flex flex-col items-center lg:items-start space-y-5">
            <a
              href="https://www.instagram.com/georgeyachts"
              target="_blank"
              rel="noopener noreferrer"
              // ADDED: Background, padding, rounded circle, and smooth hover inversion
              className="bg-white/10 p-2.5 rounded-full text-white hover:bg-[#DAA520] hover:text-black transition-all duration-300"
              aria-label="Instagram"
            >
              {/* Scaled the icon down slightly to sit perfectly inside the new background padding */}
              <Instagram className="w-5 h-5" />
            </a>
            <div className="flex items-center space-x-3">
              <img
                src="/images/iyba.png"
                alt="IYBA Member"
                className="h-7 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="text-[11px] text-gray-400 leading-tight max-w-[180px] text-center lg:text-left">
                Proud member of IYBA – International Yacht Brokers Association
              </span>
            </div>
          </div>

          {/* 2. Company Legal Info (Center on Desktop & Mobile) */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <span className="text-sm font-bold tracking-widest text-white">
              GEORGE YACHTS BROKERAGE HOUSE LLC
            </span>
            <span className="text-[11px] tracking-wider text-gray-400 uppercase">
              30 N Gould St, STE R, Sheridan, WY 82801, USA
            </span>
            <span className="text-[11px] tracking-wider text-gray-400">
              EIN: 30-1480422
            </span>
          </div>

          {/* 3. Policy Links (Right on Desktop, Center on Mobile) */}
          {/* UPDATED: Added flex-wrap and gap to gracefully handle 3 links on mobile screens */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-3 text-xs font-bold pt-2 lg:pt-0">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hover:text-[#DAA520] transition duration-200 uppercase tracking-wider text-center"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* --- DIVIDER --- */}
        <div className="w-full h-px bg-white/10"></div>

        {/* --- BOTTOM SECTION: Disclaimer & Copyright --- */}
        <div className="flex flex-col items-center space-y-6 text-center">
          <p className="text-[10px] text-gray-500 leading-relaxed max-w-5xl uppercase tracking-wide">
            All yacht specifications, images, and pricing are provided for
            informational purposes only. George Yachts Brokerage House LLC
            offers the details of these vessels in good faith but cannot
            guarantee the accuracy of this information or the condition of the
            vessels. All information is subject to change without notice and is
            not contractual.
          </p>

          <div className="text-[11px] text-white/80 font-bold tracking-[0.2em] uppercase">
            &copy; {currentYear} GEORGE YACHTS BROKERAGE HOUSE LLC. ALL RIGHTS
            RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
