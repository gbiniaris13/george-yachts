"use client";

import React, { useEffect, useRef, useState } from "react";

function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomeStats() {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  const stats = [
    { end: 50, suffix: "+", label: "Curated Yachts" },
    { end: 4, suffix: "", label: "Sailing Regions" },
    { end: 360, suffix: "\u00b0", label: "Luxury Services" },
    { end: 100, suffix: "%", label: "Greek Waters" },
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
              transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
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
            <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div
        className="max-w-[900px] mx-auto px-6 mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
        }}
      >
        {["IYBA Member", "MYBA Contracts", "U.S. Registered", "Personal Broker"].map((badge, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#DAA520]/20 text-xs hidden md:inline">&middot;</span>}
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/20 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {badge}
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
