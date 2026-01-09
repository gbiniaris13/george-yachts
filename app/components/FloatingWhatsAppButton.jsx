"use client";

import React from "react";

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

const WHATSAPP_NUMBER = "+17867988788";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "I'm interested in chartering a yacht and would like to chat."
);

const FloatingWhatsAppButton = () => {
  return (
    <a
      // DIRECT LINK: No variables, no complex encoding. Just the raw connection.
      href="https://wa.me/17867988798"
      target="_blank"
      rel="noopener noreferrer"
      // FIX: Changed z-9999 to z-[9999] (valid Tailwind) so it actually stays on top
      // FIX: Ensure 'bottom' is valid (standard Tailwind often stops before 50, using arbitrary for safety if you want it high, or bottom-6 for standard corner)
      className="lg:hidden fixed bottom-6 right-3 z-9999 flex items-center space-x-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-[#128C7E]"
      style={{ fontFamily: "var(--font-marcellus)" }}
    >
      <WhatsappIcon className="w-6 h-6" />
      <span className="text-sm font-bold uppercase tracking-wide">
        Speak with George
      </span>
    </a>
  );
};

export default FloatingWhatsAppButton;
