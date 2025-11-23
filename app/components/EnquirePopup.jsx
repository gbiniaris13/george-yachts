"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react"; // Assuming you have lucide-react
import ContactFormSection from "./ContactFormSection"; // Reuse your existing form

const EnquirePopup = ({ isOpen, onClose, yachtName }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-transparent rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors duration-200"
        >
          <X size={24} />
        </button>

        {/* Custom Header inside the popup (Optional) */}
        <div className="absolute top-0 left-0 w-full p-4 z-40 pointer-events-none">
          <p className="text-white/80 text-xs font-bold uppercase tracking-widest text-center mt-2">
            Enquiring about: <span className="text-[#7a6200]">{yachtName}</span>
          </p>
        </div>

        {/* The Contact Form */}
        {/* We wrap it in a div to ensure it fits nicely */}
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl">
          <ContactFormSection />
        </div>
      </div>
    </div>
  );
};

export default EnquirePopup;
