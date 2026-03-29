"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function YourBroker() {
  const [ref, visible] = useReveal(0.15);

  return (
    <section
      ref={ref}
      style={{
        padding: "120px 24px",
        background: "#000",
        borderTop: "1px solid rgba(218,165,32,0.08)",
        borderBottom: "1px solid rgba(218,165,32,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "60px",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
        className="your-broker-grid"
      >
        {/* Photo */}
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", minHeight: "300px" }}>
          <Image
            src="/images/george.jpg"
            alt="George P. Biniaris — Managing Broker, George Yachts"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 250px, 280px"
            priority
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }} />
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "#DAA520",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            Your Broker
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}>
            George P. Biniaris
          </h2>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}>
            Managing Broker &middot; IYBA Member
          </p>

          <div style={{
            width: "40px", height: "1px", marginBottom: "32px",
            background: "linear-gradient(90deg, #DAA520, transparent)",
          }} />

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "15px",
            lineHeight: 2,
            color: "rgba(255,255,255,0.55)",
            marginBottom: "16px",
          }}>
            Every client works directly with me. No call centres. No junior agents. No automated responses.
          </p>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "15px",
            lineHeight: 2,
            color: "rgba(255,255,255,0.55)",
            marginBottom: "40px",
          }}>
            One conversation is all it takes to understand exactly what you need — and to deliver it.
          </p>

          <a
            href="https://calendly.com/george-georgeyachts/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#000",
              background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
              padding: "16px 40px",
              textDecoration: "none",
              transition: "all 0.4s ease",
            }}
          >
            Book a Call with George
          </a>

          <a
            href="/about-us"
            style={{
              display: "inline-block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              marginLeft: "24px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = "#DAA520"}
            onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
          >
            Learn more about George →
          </a>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .your-broker-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .your-broker-grid > div:first-child {
            max-width: 250px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
