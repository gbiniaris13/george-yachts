"use client";

import React from "react";

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#DAA520">
    <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z"/>
  </svg>
);

export default function ContactBar() {
  return (
    <section className="relative w-full bg-black py-12 border-t border-b border-white/[0.04]">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 px-6">
        <a
          href="tel:+306970380999"
          className="group flex items-center gap-3 transition-all duration-300"
          data-cursor="Call"
        >
          <PhoneIcon />
          <div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", display: "block" }}>
              Athens Office
            </span>
            <span className="group-hover:text-white transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
              +30 697 038 0999
            </span>
          </div>
        </a>

        <div style={{ width: "1px", height: "32px", background: "rgba(218,165,32,0.1)" }} className="hidden sm:block" />

        <a
          href="https://wa.me/17867988798"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 transition-all duration-300"
          data-cursor="Chat"
        >
          <WhatsAppIcon />
          <div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", display: "block" }}>
              WhatsApp
            </span>
            <span className="group-hover:text-white transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
              +1 786 798 8798
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
