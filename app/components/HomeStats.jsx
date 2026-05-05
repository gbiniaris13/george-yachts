"use client";

// A.1 (Roberto brief, May 2026):
//   • SSR was rendering `<span>0</span>` because Counter used
//     useState(0) and only animated after IntersectionObserver fired —
//     Googlebot + no-JS visitors saw "0+ Curated Yachts / 100% Client
//     Satisfaction", a catastrophic first-impression for UHNW.
//   • Hardcode target values in JSX so SSR HTML literally contains
//     "66+", "4", "360°".
//   • Reduce 4 → 3 stats (drop "100% Client Satisfaction" — we cannot
//     back the claim until real client testimonials land).
//   • Rename "Greek Regions" → "Greek Waters" (more accurate +
//     poetic; we operate in waters, not administrative regions).
//   • Parent fade-in stays as the only animation. Number values are
//     final from first paint — no count-up flash.

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HomeStats({ yachtCount = 66 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Three stats only. No "Client Satisfaction" until real testimonials
  // land (Section 0.4 of the master brief).
  const stats = [
    { value: `${yachtCount}+`, label: "Curated Yachts" },
    { value: "4", label: "Greek Waters" },
    { value: "360°", label: "Full Service" },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full bg-black border-y border-white/[0.04] py-16 md:py-20 overflow-hidden"
    >
      {/* Subtle gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DAA520]/20 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              // A.14 (Roberto brief): start at opacity 0.5, 8px
              // translate, 280ms duration, ≤50ms stagger so counters
              // stay legible during fast scroll.
              opacity: visible ? 1 : 0.5,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
            }}
          >
            <div
              className="text-5xl md:text-6xl lg:text-7xl font-light mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.value}
            </div>
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-white/65 font-medium"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Credentials — merged from the standalone CredentialsStrip
          section 2026-04-21 (Proposal A). Same icons, now flowing
          directly below the stat counters so "Proof" lives on one
          screen instead of two stacked sections.
          A.13 contrast pass: label opacity bumped from /35 → /70 so
          50+ readers can actually parse the labels on dark BG. */}
      <div
        className="max-w-5xl mx-auto px-6 mt-14"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            {
              icon: (
                <Image
                  src="/images/iyba-official-white.png"
                  alt="IYBA — International Yacht Brokers Association"
                  width={120}
                  height={28}
                  className="opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ height: 28, width: "auto" }}
                />
              ),
              label: "IYBA Member Broker",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/75 group-hover:text-[#DAA520] transition-colors duration-500">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              ),
              label: "MYBA-standard Contracts",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/75 group-hover:text-[#DAA520] transition-colors duration-500">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M2 7h20" />
                  <path d="M12 21v-4" />
                  <path d="M8 21h8" />
                </svg>
              ),
              label: "U.S. Registered (Wyoming LLC)",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/75 group-hover:text-[#DAA520] transition-colors duration-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              ),
              label: "Greek Waters Specialist",
            },
          ].map((cred, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="h-12 flex items-center justify-center">{cred.icon}</div>
              <span
                className="text-[10px] tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors duration-500 font-light"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {cred.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
