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
      {/* ═══════ PHILOSOPHY ═══════ */}
      <section className="about-philosophy">
        <RevealSection className="about-philosophy__inner">
          <p className="about-philosophy__eyebrow">Our Philosophy</p>
          <h2 className="about-philosophy__quote">
            We don&apos;t sell vacations.<br />
            We craft experiences that stay<br className="hidden md:block" /> with you forever.
          </h2>
          <div className="about-philosophy__line" />
          <p className="about-philosophy__text">
            George Yachts is a boutique brokerage house specializing exclusively in Greek waters.
            We bridge international operational standards with deep local expertise to deliver
            bespoke maritime experiences &mdash; from the Cyclades to the Ionian, from intimate
            sailing catamarans to 64-meter superyachts.
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
        <div className="about-george__inner">
          <RevealSection className="about-george__text-col">
            <p className="about-george__eyebrow">The Founder</p>
            <h2 className="about-george__name">George P. Biniaris</h2>
            <p className="about-george__role">Managing Broker &middot; IYBA Member</p>
            <div className="about-george__line" />
            <p className="about-george__bio">
              With a career built on trust, discretion, and an uncompromising eye for
              quality, George founded George Yachts Brokerage House to offer something
              the industry lacked &mdash; a truly personal brokerage experience.
            </p>
            <p className="about-george__bio">
              Every client works directly with George. No call centers, no junior agents,
              no automated responses. When you reach out, George answers. When you board
              your yacht, George has personally vetted the crew, the itinerary, and every
              detail of your experience.
            </p>
            <blockquote className="about-george__quote">
              &ldquo;My clients don&apos;t just charter a yacht. They gain a trusted advisor
              who knows every captain, every cove, and every sunset worth seeing in Greece.&rdquo;
            </blockquote>
          </RevealSection>
        </div>
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
