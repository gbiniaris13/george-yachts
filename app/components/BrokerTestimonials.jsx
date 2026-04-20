"use client";

import React, { useRef } from "react";

const testimonials = [
  {
    quote:
      "The collaboration was smooth and highly professional. George was incredibly responsive and efficient in all communications. His professionalism and knowledge of the charter process made the experience both seamless and enjoyable.",
    role: "Superyacht Charter Broker",
    locations: "Dubai, Monaco & London",
  },
  {
    quote:
      "Extremely helpful and very professional through all our communication. I look forward to working with him again in the future.",
    role: "Senior Charter Broker",
    locations: "London",
  },
];

const BrokerTestimonials = () => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      {/* Section Header */}
      <div className="text-center mb-16 md:mb-20">
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            fontWeight: 300,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "#000000",
            opacity: 0.5,
          }}
        >
          W H A T &nbsp; T H E &nbsp; I N D U S T R Y &nbsp; S A Y S
        </p>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {testimonials.map((t, i) => (
          <div key={i}>
            {/* Quote */}
            <blockquote className="text-center mb-6">
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#000000",
                  maxWidth: "720px",
                  margin: "0 auto",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>

            {/* Attribution */}
            <p
              className="text-center"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}
            >
              — {t.role} · {t.locations}
            </p>

            {/* Gold Divider between quotes */}
            {i < testimonials.length - 1 && (
              <div className="flex justify-center my-12 md:my-16">
                <div
                  style={{
                    width: "60px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrokerTestimonials;
