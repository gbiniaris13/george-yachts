"use client";

import React from "react";
import { Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  // Dynamic year for copyright
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "PRIVACY POLICY", href: "/privacy" },
    { name: "COOKIE POLICY", href: "/cookies" },
  ];

  return (
    <footer className="w-full bg-black text-white py-8 px-4 sm:px-6 lg:px-8 z-40 border-t border-white/10">
      <div className="max-w-[1530px] mx-auto flex flex-col md:flex-row md:justify-between items-center space-y-6 md:space-y-0">
        {/* 1. Social Icons & IYBA (Left/Center on Mobile) */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
          {/* MOBILE ONLY: IYBA Logo above Instagram */}
          <div className="md:hidden mb-4 flex flex-col items-center">
            <img
              src="/images/iyba.png"
              alt="IYBA Member"
              className="h-6 w-auto opacity-90 mb-2"
            />
            <span className="text-[12px] text-gray-400 text-center leading-tight max-w-[250px]">
              Proud member of IYBA – International Yacht Brokers Association
            </span>
          </div>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/georgeyachts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#DAA520] transition duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        {/* 2. Policy Links (Center) */}
        <div className="flex space-x-6 text-xs font-bold">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="hover:text-[#DAA520] transition duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 3. Copyright & Desktop IYBA (Right) */}
        <div className="flex items-center space-x-4">
          <div className="text-xs text-white font-bold">
            &copy; {currentYear} GEORGE YACHTS. ALL RIGHTS RESERVED.
          </div>

          {/* DESKTOP ONLY: IYBA Logo next to copyright */}
          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-white/20">
            <img
              src="/images/iyba.png"
              alt="IYBA Member"
              className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
            <span className="text-[12px] text-gray-400 leading-tight max-w-[150px]">
              Proud member of IYBA – International Yacht Brokers Association
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
