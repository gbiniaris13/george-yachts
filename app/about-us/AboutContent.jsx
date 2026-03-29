"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─── Scroll Reveal Hook ─── */
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

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Section Wrapper ─── */
function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutContent() {
  // Parallax for hero
  useEffect(() => {
    const heroImg = document.querySelector(".about-hero__bg");
    if (!heroImg) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ═══════ YOUR BROKER IN GREEK WATERS ═══════ */}
      <section className="about-philosophy">
        <RevealSection className="about-philosophy__inner">
          <p className="about-philosophy__eyebrow">Your Broker in Greek Waters</p>
          <h2 className="about-philosophy__quote">
            One point of contact.<br />
            One standard of care.<br className="hidden md:block" />
            No call centres. No middlemen.
          </h2>
          <div className="about-philosophy__line" />
          <p className="about-philosophy__text">
            George Yachts is led by George P. Biniaris, Managing Broker and IYBA member, operating from Athens with a hands-on approach built from years on the water. From crewed sailing charters in the Ionian to complex MYBA-contract superyacht operations in the Cyclades, every recommendation comes from first-hand experience &mdash; not a database.
          </p>
          <p className="about-philosophy__text">
            As a boutique brokerage, we do one thing and we do it properly: crewed yacht charters in Greek waters. The Cyclades, the Ionian, the Saronic Gulf, the Sporades &mdash; every region, every season, every type of vessel. One broker, one relationship, one standard.
          </p>
          <p className="about-philosophy__text">
            Every yacht in our fleet is personally vetted. Every captain is known by name. Itineraries are crafted from real routes sailed in these waters &mdash; not copied from brochures. We work exclusively with MYBA-standard contracts, transparent APA and VAT breakdowns, and fast, detailed proposals.
          </p>
          <p className="about-philosophy__text">
            George Yachts is registered in the United States (Wyoming LLC) and operates from Athens, Greece. We serve an international clientele who expect discretion, precision, and a level of personal attention that larger platforms simply cannot provide.
          </p>
        </RevealSection>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="about-stats">
        <div className="about-stats__grid">
          {[
            { number: 50, suffix: "+", label: "Curated Yachts" },
            { number: 4, suffix: "", label: "Sailing Regions" },
            { number: 360, suffix: "\u00b0", label: "Luxury Services" },
            { number: 100, suffix: "%", label: "Greek Waters" },
          ].map((stat, i) => (
            <RevealSection key={i} className="about-stats__item" delay={i * 0.1}>
              <div className="about-stats__number">
                <Counter end={stat.number} suffix={stat.suffix} />
              </div>
              <div className="about-stats__label">{stat.label}</div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════ GEORGE'S STORY ═══════ */}
      <section className="about-george">
        <div className="about-george__inner" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "60px", maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

          {/* Photo + Bio Side by Side on Desktop */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 380px) 1fr", gap: "60px", alignItems: "start" }} className="about-george-grid">
            <RevealSection>
              <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                <img
                  src="/images/george.jpg"
                  alt="George P. Biniaris — Managing Broker, George Yachts Brokerage House"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
              </div>
              {/* IYBA Badge under photo */}
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px", padding: "16px", border: "1px solid rgba(218,165,32,0.15)", background: "rgba(218,165,32,0.03)" }}>
                <img src="/images/iyba.png" alt="IYBA Member" style={{ height: "36px", width: "auto", opacity: 0.8 }} />
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", margin: 0 }}>Member of</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.1em", color: "#DAA520", margin: 0 }}>International Yacht Brokers Association</p>
                </div>
              </div>
            </RevealSection>

            <RevealSection className="about-george__text-col" delay={0.2}>
              <p className="about-george__eyebrow">Managing Broker</p>
              <h2 className="about-george__name">George P. Biniaris</h2>
              <p className="about-george__role">Managing Broker &middot; IYBA Member</p>
              <div className="about-george__line" />
              <p className="about-george__bio">
                Every client works directly with George. No call centres, no junior agents,
                no automated responses. When you reach out, George answers. When you board
                your yacht, George has personally vetted the crew, the itinerary, and every
                detail of your experience.
              </p>
              <p className="about-george__bio">
                George knows these waters first-hand &mdash; every anchorage, every crew,
                every restaurant worth the taxi ride. His recommendations come from personal
                experience aboard the yachts, not from a brochure or a database.
              </p>
              <blockquote className="about-george__quote">
                &ldquo;My clients don&apos;t just charter a yacht. They gain a trusted advisor
                who knows every captain, every cove, and every sunset worth seeing in Greece.&rdquo;
              </blockquote>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ WHY BOUTIQUE ═══════ */}
      <section style={{ padding: "100px 24px", background: "rgba(218,165,32,0.02)", borderTop: "1px solid rgba(218,165,32,0.08)", borderBottom: "1px solid rgba(218,165,32,0.08)" }}>
        <RevealSection className="text-center" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.4em", color: "#DAA520", textTransform: "uppercase", marginBottom: "24px" }}>The Difference</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 300, color: "#fff", marginBottom: "40px", lineHeight: 1.3 }}>
            Why Choose a Boutique Broker?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", textAlign: "left" }}>
            {[
              { label: "Large Aggregator", value: "Thousands of yachts, generic filters, algorithm-matched", vs: "vs" },
              { label: "George Yachts", value: "53 personally vetted yachts, hand-selected for you by someone who has been aboard each one", highlight: true },
            ].map((item, i) => (
              <div key={i} style={{ padding: "32px", border: item.highlight ? "1px solid rgba(218,165,32,0.3)" : "1px solid rgba(255,255,255,0.08)", background: item.highlight ? "rgba(218,165,32,0.05)" : "transparent" }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: item.highlight ? "#DAA520" : "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "16px" }}>{item.label}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", lineHeight: 1.9, color: item.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ═══════ SERVICES — 360° ═══════ */}
      <section className="about-services">
        <RevealSection className="text-center">
          <p className="about-services__eyebrow">Beyond the Yacht</p>
          <h2 className="about-services__title">360&deg; Luxury Services</h2>
          <p className="about-services__subtitle">
            Yachts are our core. Around them, we deliver a seamless layer
            of lifestyle services &mdash; ensuring your journey is effortless from touchdown to sunset.
          </p>
        </RevealSection>

        <div className="about-services__grid">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
              ),
              title: "Yacht Charter",
              desc: "50+ curated motor yachts, sailing catamarans, and monohulls across all Greek islands.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
              ),
              title: "Private Aviation",
              desc: "Helicopter and jet transfers arranged to any island. Arrive in style, skip the ferry queues.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/><circle cx="5.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/></svg>
              ),
              title: "VIP Transfers",
              desc: "Luxury ground transport with professional chauffeurs. Airport to marina, seamless and discreet.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              ),
              title: "Luxury Villas",
              desc: "Handpicked waterfront properties for pre- or post-charter stays in Athens, Mykonos, Santorini.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ),
              title: "Bespoke Itineraries",
              desc: "Custom routes crafted with insider knowledge. Hidden coves, Michelin tavernas, private beaches.",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ),
              title: "Full Transparency",
              desc: "Clear pricing with APA and VAT explained upfront. No hidden fees, no surprises. MYBA contracts.",
            },
          ].map((service, i) => (
            <RevealSection key={i} className="about-services__card" delay={i * 0.08}>
              <div className="about-services__icon">{service.icon}</div>
              <h3 className="about-services__card-title">{service.title}</h3>
              <p className="about-services__card-desc">{service.desc}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════ CREDENTIALS ═══════ */}
      <section className="about-credentials">
        <RevealSection className="about-credentials__inner">
          <p className="about-credentials__eyebrow">Credentials</p>
          <div className="about-credentials__grid">
            {[
              { title: "IYBA Member", desc: "International Yacht Brokers Association" },
              { title: "MYBA Contracts", desc: "Industry-standard charter agreements" },
              { title: "US Registered", desc: "George Yachts Brokerage House LLC" },
              { title: "Greek Expertise", desc: "Cyclades \u00b7 Ionian \u00b7 Saronic \u00b7 Sporades" },
            ].map((cred, i) => (
              <div key={i} className="about-credentials__item">
                <h4 className="about-credentials__item-title">{cred.title}</h4>
                <p className="about-credentials__item-desc">{cred.desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="about-cta">
        <RevealSection className="text-center">
          <p className="about-cta__eyebrow">Ready?</p>
          <h2 className="about-cta__title">Let&apos;s Plan Your Charter</h2>
          <p className="about-cta__text">
            Share your vision and we&apos;ll handle every detail &mdash; from yacht
            selection to sunset anchorages.
          </p>
          <a
            href="https://calendly.com/george-georgeyachts/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta__button"
          >
            Book a Free Consultation
          </a>
        </RevealSection>
      </section>
    </>
  );
}
