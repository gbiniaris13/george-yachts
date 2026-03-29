"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Disruptors = () => {
  return (
    <div className="w-full bg-white py-6 border-y border-black/10 overflow-hidden">
      <Marquee
        speed={50}
        gradient={true}
        gradientColor="#FFFFFF"
        gradientWidth={100}
        autoFill={true} // Ensures smooth looping without gaps
      >
        <div className="flex items-center">
          <span
            className="text-3xl md:text-5xl font-black font-sans text-black uppercase tracking-tighter mx-4 select-none"
            // If you want to force a specific system font stack that looks expensive:
            style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}
          >
            Boutique Yacht Brokerage & 360° Luxury Concierge
          </span>

          {/* The Divider: A sharp, modern slash in Gold */}
          <span className="text-3xl md:text-5xl font-black font-sans text-[#B8860B] mx-8 md:mx-16 opacity-100">
            //
          </span>
        </div>
      </Marquee>
    </div>
  );
};

export default Disruptors;
