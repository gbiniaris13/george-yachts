"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { itineraries } from "@/lib/signatureItineraries";

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// Parallax
function useParallax() {
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
}

// itineraries now live in lib/signatureItineraries.js so the page-level
// TouristTrip JSON-LD (a server component) can share the exact same data.
// Imported at the top of this file.

function ItineraryCard({ itin, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal delay={index * 0.1}>
      <div style={{ background: "#0D1B2A", border: "1px solid rgba(201,168,76,0.06)", marginBottom: "32px" }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ width: "100%", padding: "36px 32px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}
        >
          <div>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "12px" }}>
              {itin.duration} &middot; {itin.days.reduce((sum, d) => sum + parseInt(d.nm) || 0, 0)} NM Total &middot; {itin.season}
            </p>
            <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#F8F5F0", margin: "0 0 6px", lineHeight: 1.2 }}>
              {itin.title}
            </h3>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", color: "rgba(248, 245, 240,0.35)", letterSpacing: "0.05em" }}>
              {itin.subtitle} &middot; From {itin.embarkation}
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", color: "rgba(248, 245, 240,0.25)", marginTop: "8px" }}>
              Ideal for: {itin.idealFor}
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={expanded ? "#C9A84C" : "rgba(248, 245, 240,0.3)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.4s ease, stroke 0.3s ease", flexShrink: 0, marginTop: "8px" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expandable Content */}
        <div style={{ maxHeight: expanded ? "3000px" : "0", overflow: "hidden", transition: "max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ padding: "0 32px 36px", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
            {/* Day by day */}
            <div style={{ paddingTop: "28px" }}>
              {itin.days.map((day) => (
                <div key={day.day} style={{ display: "flex", gap: "20px", padding: "20px 0", borderBottom: "1px solid rgba(248, 245, 240,0.03)" }}>
                  <div style={{ minWidth: "70px" }}>
                    <span style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "22px", fontWeight: 300, color: "#C9A84C" }}>Day {day.day}</span>
                    <span style={{ display: "block", fontFamily: "var(--gy-font-ui)", fontSize: "8px", color: "rgba(248, 245, 240,0.2)", letterSpacing: "0.1em", marginTop: "4px" }}>{day.nm}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "13px", fontWeight: 500, color: "#F8F5F0", marginBottom: "6px" }}>{day.title}</p>
                    <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", color: "rgba(248, 245, 240,0.4)", lineHeight: 1.7, fontWeight: 300 }}>{day.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>Highlights</p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", color: "rgba(248, 245, 240,0.4)", fontWeight: 300 }}>{itin.highlights}</p>
            </div>

            {/* Recommended Yachts */}
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "10px" }}>Recommended Yachts</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {itin.yachts.map((yacht) => (
                  <Link
                    key={yacht.slug}
                    href={`/yachts/${yacht.slug}`}
                    style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", color: "rgba(248, 245, 240,0.4)", padding: "6px 14px", border: "1px solid rgba(201,168,76,0.15)", textDecoration: "none", letterSpacing: "0.05em", transition: "all 0.3s ease" }}
                  >
                    {yacht.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ItinerariesContent() {
  const { t } = useI18n();
  useParallax();

  return (
    <>
      {/* Intro */}
      <section style={{ padding: "100px 24px", background: "#0D1B2A" }}>
        <Reveal>
          <div style={{ maxWidth: "750px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "24px" }}>{t('itin.curatedBy', 'Curated by George')}</p>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, color: "#F8F5F0", lineHeight: 1.35, margin: "0 0 32px" }}>
              {t('itin.whyTrust', 'Why Trust These Itineraries?')}
            </h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #C9A84C, #C9A84C)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "14px", color: "rgba(248, 245, 240,0.45)", lineHeight: 1.9, fontWeight: 300 }}>
              {t('itin.whyTrustDesc', 'Every route below has been personally sailed and refined by George Biniaris — drawing on deep local knowledge of Greek waters. These are not generic suggestions. They are tested, trusted, and designed to deliver the best possible week aboard.')}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Itineraries */}
      <section style={{ padding: "0 24px 80px", background: "#0D1B2A", maxWidth: "900px", margin: "0 auto" }}>
        {itineraries.map((itin, i) => (
          <ItineraryCard key={itin.id} itin={itin} index={i} />
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#0D1B2A", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
        <Reveal>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px" }}>{t('itin.yourWay', 'Your Itinerary, Your Way')}</p>
          <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 16px" }}>
            {t('itin.designWeek', "Let's Design Your Perfect Week")}
          </h2>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "14px", color: "rgba(248, 245, 240,0.4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "550px", margin: "0 auto 40px" }}>
            {t('itin.designDesc', "These routes are starting points. Every charter is personally tailored by George — your preferences, your pace, your islands. Tell us your dream and we'll design your perfect week in Greek waters.")}
          </p>
          <a href="#contact" style={{ display: "inline-block", background: "linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)", color: "#0D1B2A", padding: "16px 48px", fontFamily: "var(--gy-font-ui)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
            {t('itin.startPlanning', 'Start Planning')}
          </a>
        </Reveal>
      </section>
    </>
  );
}
