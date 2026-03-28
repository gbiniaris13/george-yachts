"use client";

import React, { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    quote: "We knew from the moment we stepped on board that our journey was going to be memorable. The crew's complete attentiveness and endless good cheer sustained our group for 12 unforgettable days.",
    attribution: "Charter Guest, Cyclades 2025",
  },
  {
    quote: "Thank you for one of the most memorable weeks of our lives. Your knowledge of the islands, secret locations, and recommendations delivered a unique and unforgettable vacation.",
    attribution: "Charter Guest, Saronic Gulf 2025",
  },
  {
    quote: "The whole trip was amazing. When you can't believe it can get better, it does! The boat and the crew was 5-star!",
    attribution: "Charter Guest, Ionian 2025",
  },
];

const GoldStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#DAA520" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative w-full bg-black py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DAA520]/15 to-transparent" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#DAA520", fontWeight: 600, marginBottom: "16px" }}>
              Guest Experiences
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, color: "#fff", margin: "0 0 16px" }}>
              What Our Guests Say
            </h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", margin: "0 auto" }} />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div style={{ background: "rgba(218,165,32,0.02)", border: "1px solid rgba(218,165,32,0.06)", padding: "36px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {[...Array(5)].map((_, j) => <GoldStar key={j} />)}
                </div>

                {/* Quote */}
                <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 24px", flex: 1 }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div>
                  <div style={{ width: "24px", height: "1px", background: "rgba(218,165,32,0.3)", marginBottom: "12px" }} />
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", color: "#DAA520", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {t.attribution}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
