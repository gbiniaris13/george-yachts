import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const SCROLL_THRESHOLD = 100; // Pixels to scroll down before the popup appears

// Reusable component for the site logo structure
const SiteLogo = () => (
  <div className="shrink-0 mb-4">
    <a href="#" className="text-2xl font-extrabold tracking-wider">
      <div className="flex flex-col items-center text-center">
        <span className="the text-black text-[10px]">THE</span>
        <span className="george-yachts text-black text-lg font-bold">
          GEORGE YACHTS
        </span>
        <span className="the text-black text-[10px]">YACHT BROKERAGE</span>
      </div>
    </a>
  </div>
);

const ScrollPopup = () => {
  // Controls visibility: true after scrolling, false after user closes it
  const [isVisible, setIsVisible] = useState(false);
  // Prevents the popup from reopening once closed by the user
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past the threshold AND the popup hasn't been closed manually
      if (window.scrollY > SCROLL_THRESHOLD && !hasBeenClosed) {
        setIsVisible(true);
      }
      // Note: We don't hide it automatically once it appears; the user must click 'X'
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasBeenClosed]);

  const handleClose = () => {
    setIsVisible(false);
    setHasBeenClosed(true); // Ensure it doesn't pop up again
  };

  if (!isVisible) {
    return null;
  }

  return (
    // Fixed positioning in the center of the viewport
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm bg-black/5">
      {/* Modal Content */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm relative transform transition-all duration-300 ease-out scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-800 transition duration-150 rounded-full bg-gray-100/70 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-4">
          <SiteLogo />

          <h2
            id="popup-title"
            className="text-xl font-bold text-[#02132d] mb-3"
          >
            Site Update in Progress
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            At George Yachts, excellence is a continuous journey. Our website is
            currently undergoing a curated update to enhance your experience and
            reflect the standard of service we provide across the Mediterranean.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            During this time, some pages - including yacht listings and contact
            forms - may be temporarily limited. Our team remains fully available
            to assist you personally for charter inquiries and collaborations.
          </p>

          {/* Consolidated the complex linking structure within one <p> tag */}
          <p className="text-gray-600 text-sm mb-4">
            Please feel free to reach us directly at:
            <br />
            Mail: {/* ADDED PREFIX */}
            {/* Email Link */}
            <a
              className="text-[#7a6200] underline"
              href="mailto:george@georgeyachts.com"
            >
              george@georgeyachts.com
            </a>
            <br />
            Tel: {/* ADDED PREFIX */}
            {/* Phone Link */}
            <a className="text-[#7a6200] underline" href="tel:+306970380999">
              +30 6970 380 999
            </a>
            <br />
            Whatsapp: {/* WhatsApp Link */}
            <a
              className="text-[#7a6200] underline"
              href="https://wa.me/17867988798"
            >
              +1 (786) 798-8798
            </a>
          </p>

          <p className="text-gray-600 text-sm mb-6">
            Thank you for your understanding and for sharing this journey of
            refinement with us. Smooth seas & sharp suits - The
            George&nbsp;Yachts&nbsp;Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollPopup;
