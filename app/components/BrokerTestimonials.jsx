"use client";

import React, { useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

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
  const { t } = useI18n();
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
            fontFamily: "var(--gy-font-ui)",
            fontSize: "11px",
            fontWeight: 300,
            // Mobile audit 2026-04-20: was 0.45em + manually-spaced
            // letters ("W H A T") which combined for ~40 characters on
            // a 320 px screen → hard wrap with orphan letters. Now one
            // clean run of text with fluid tracking.
            letterSpacing: "clamp(0.2em, 0.8vw, 0.45em)",
            textTransform: "uppercase",
            color: "#0D1B2A",
            opacity: 0.5,
            wordSpacing: "0.15em",
          }}
        >
          {t("testimonials.eyebrow", "What the industry says")}
        </p>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {testimonials.map((quote, i) => (
          <div key={i}>
            {/* Quote */}
            <blockquote className="text-center mb-6">
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#0D1B2A",
                  maxWidth: "720px",
                  margin: "0 auto",
                }}
              >
                &ldquo;{t(`testimonials.q${i + 1}.quote`, quote.quote)}&rdquo;
              </p>
            </blockquote>

            {/* Attribution */}
            <p
              className="text-center"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                // Chapter 05 Pass 2 - gold restraint: section is on
                // ivory bg, attribution moved from gold to navy for
                // better contrast + the restraint rule.
                color: "#0D1B2A",
              }}
            >
              - {t(`testimonials.q${i + 1}.role`, quote.role)} · {t(`testimonials.q${i + 1}.locations`, quote.locations)}
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
