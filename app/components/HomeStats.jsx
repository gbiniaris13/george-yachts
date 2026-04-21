"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

function Counter({ end, suffix = "", duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  const animate = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Guarantee final value
        setDisplay(end);
      }
    }

    requestAnimationFrame(tick);
  }, [end, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function HomeStats({ yachtCount = 66 }) {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  const stats = [
    { end: yachtCount, suffix: "+", label: "Curated Yachts" },
    { end: 4, suffix: "", label: "Greek Regions" },
    { end: 360, suffix: "\u00b0", label: "Full Service" },
    { end: 100, suffix: "%", label: "Client Satisfaction" },
  ];

  return (
    <section
      ref={setRef}
      className="relative w-full bg-black border-y border-white/[0.04] py-16 md:py-20 overflow-hidden"
    >
      {/* Subtle gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DAA520]/20 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
            }}
          >
            <div
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <Counter end={stat.end} suffix={stat.suffix} />
            </div>
            <div
              className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-medium"
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
          screen instead of two stacked sections. */}
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
                  src="/images/iyba.png"
                  alt="IYBA Member — International Yacht Brokers Association"
                  width={44}
                  height={44}
                  className="opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
              ),
              label: "IYBA Member",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              ),
              label: "MYBA Contracts",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M2 7h20" />
                  <path d="M12 21v-4" />
                  <path d="M8 21h8" />
                </svg>
              ),
              label: "U.S. Registered",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#DAA520]/60 group-hover:text-[#DAA520] transition-colors duration-500">
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
                className="text-[10px] tracking-[0.2em] uppercase text-white/35 group-hover:text-white/55 transition-colors duration-500 font-light"
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
