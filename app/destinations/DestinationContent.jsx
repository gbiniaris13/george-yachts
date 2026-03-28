"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

function Reveal({ children, className = "", delay = 0 }) {
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
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

export default function DestinationContent({ data }) {
  // Parallax
  useEffect(() => {
    const img = document.querySelector(".svc-hero__bg");
    if (!img) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { const y = window.scrollY; if (y < window.innerHeight) img.style.transform = `translateY(${y * 0.3}px)`; ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Intro */}
      <section style={{ padding: "100px 24px", background: "#000" }}>
        <Reveal>
          <div style={{ maxWidth: "750px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "24px" }}>
              {data.region}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, color: "#fff", lineHeight: 1.35, margin: "0 0 32px" }}>
              {data.introTitle}
            </h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #E6C77A, #A67C2E)", margin: "0 auto 32px" }} />
            {data.introText.map((p, i) => (
              <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, fontWeight: 300, marginBottom: "20px" }}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Islands */}
      <section style={{ padding: "80px 24px", background: "#000", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 300, color: "#fff" }}>
              {data.islandsTitle}
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1px", maxWidth: "1100px", margin: "0 auto", background: "rgba(218,165,32,0.06)" }}>
          {data.islands.map((island, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div style={{ background: "#000", padding: "36px 28px", textAlign: "center" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", fontWeight: 500, color: "#fff", margin: "0 0 10px" }}>{island.name}</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, fontWeight: 300 }}>{island.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sample Itinerary */}
      <section style={{ padding: "100px 24px", background: "#000", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <Reveal>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "16px" }}>Sample Itinerary</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 300, color: "#fff", margin: "0 0 40px" }}>
              {data.itineraryTitle}
            </h2>
          </div>
        </Reveal>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {data.itinerary.map((day, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ display: "flex", gap: "20px", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", fontWeight: 300, color: "#DAA520", minWidth: "60px" }}>
                  Day {day.day}
                </span>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 500, color: "#fff", marginBottom: "4px" }}>{day.title}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, fontWeight: 300 }}>{day.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#000", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <Reveal>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "16px" }}>Ready to Explore?</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", margin: "0 0 16px" }}>
            Charter in the {data.region}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "500px", margin: "0 auto 40px" }}>
            Let us craft the perfect {data.region} itinerary for your group.
          </p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", color: "#000", padding: "16px 48px", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
            Book a Free Consultation
          </a>
          <div style={{ marginTop: "24px" }}>
            <Link href="/charter-yacht-greece" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
              &larr; View All Charter Yachts
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
