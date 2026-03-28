"use client";

import React, { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote: "George handled every detail with absolute precision. From the yacht selection to the crew, from our helicopter transfer to the villa in Mykonos — flawless. We felt like the only clients in the world.",
    name: "R. & M. Harrington",
    location: "New York, USA",
    yacht: "M/Y La Pellegrina 1",
    type: "Cyclades Charter",
  },
  {
    quote: "We've chartered in the Caribbean, Croatia, and the South of France. Nothing came close to our experience with George Yachts in Greece. The personal attention, the insider knowledge of every cove and taverna — it's a different level entirely.",
    name: "The Ashford Family",
    location: "London, UK",
    yacht: "S/Y Ad Astra",
    type: "Ionian Charter",
  },
  {
    quote: "What impressed us most was George's honesty. He steered us away from a yacht that didn't fit our group and found one that was perfect — at a better price. That kind of integrity is rare in this industry.",
    name: "D. Kowalski",
    location: "Chicago, USA",
    yacht: "S/Y Serenissima",
    type: "Saronic Charter",
  },
  {
    quote: "Third year chartering with George Yachts. At this point he knows our preferences better than we do. The kids ask every January when we're going back to Greece. That says everything.",
    name: "J. & S. Matsuda",
    location: "Tokyo, Japan",
    yacht: "M/Y Brooklyn",
    type: "Sporades Charter",
  },
];

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
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
    <section className="relative w-full bg-black py-28 md:py-36 overflow-hidden">
      {/* Ambient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(218,165,32,0.03) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-20">
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#DAA520", fontWeight: 600, marginBottom: "16px" }}>
              Client Experiences
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", margin: "0 0 16px" }}>
              What Our Clients Say
            </h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", margin: "0 auto" }} />
          </div>
        </Reveal>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(218,165,32,0.06)" }}>
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-black p-10 md:p-12 flex flex-col h-full" style={{ minHeight: "280px" }}>
                {/* Quote */}
                <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 24px", flex: 1 }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div>
                  <div style={{ width: "30px", height: "1px", background: "rgba(218,165,32,0.3)", marginBottom: "16px" }} />
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 600, color: "#fff", letterSpacing: "0.08em", marginBottom: "4px" }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    {t.location}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", color: "#DAA520", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {t.yacht} &middot; {t.type}
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
