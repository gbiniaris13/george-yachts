"use client";

import React, { useEffect, useRef, useState } from "react";
import { FLEET_COUNT } from "@/lib/fleetCount";
import Image from "next/image";
import Link from "next/link";

/* Boss directive 2026-05-08 — restore the "Our Core Team" section
 * on /about-us with the same six people, same photos, same titles,
 * same profile links as the standalone /team page. Only the palette
 * + tier-font tokens differ from the previous site (Cormorant /
 * Montserrat / hardcoded hex → var(--gy-font-*) + canonical 6-colour
 * tokens). Source-of-truth for the data list is the standalone
 * /team/TeamContent.jsx; mirrored here so a routine change there
 * doesn't break this section. Update both when titles change. */
const CORE_TEAM = [
  {
    name: "George P. Biniaris",
    title: "Managing Broker",
    imageUrl: "/images/george.jpg",
    profileUrl: "/team/george-biniaris",
    lead: true,
  },
  {
    name: "George Katrantzos",
    title: "Luxury Travel Liaison & Strategic Associate (U.S.)",
    imageUrl: "/images/george-katrantzos.jpg",
    profileUrl: "/team/george-katrantzos",
  },
  {
    name: "Elleanna Karvouni",
    title: "Head of Business Operations & Finance",
    imageUrl: "/images/elleanna.jpg",
    profileUrl: "/team/elleana-karvouni",
  },
  {
    name: "Chris Daskalopoulos",
    title: "Marine Insurance & ISO Maritime Compliance Advisor",
    imageUrl: "/images/chris.jpg",
    profileUrl: "/team/chris-daskalopoulos",
  },
  {
    name: "Valleria Karvouni",
    title: "Administrative & Charter Logistics Coordinator",
    imageUrl: "/images/valeria.jpg",
    profileUrl: "/team/valleria-karvouni",
  },
  {
    name: 'Captain Emmanouil "Manos" Kourmoulakis',
    title: "Aviation & Private Travel Advisor",
    imageUrl: "/images/manos-new.jpg",
    profileUrl: "/team/manos-kourmoulakis",
  },
];

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
            George Yachts is led by George P. Biniaris, Managing Broker and IYBA member, operating from Athens with a hands-on approach built from years on the water. From crewed sailing charters in the Ionian to complex MYBA-contract superyacht operations in the Cyclades, every recommendation comes from first-hand experience - not a database.
          </p>
          <p className="about-philosophy__text">
            As a boutique brokerage, we do one thing and we do it properly: crewed yacht charters in Greek waters. The Cyclades, the Ionian, the Saronic Gulf - every region, every season, every type of vessel. One broker, one relationship, one standard.
          </p>
          <p className="about-philosophy__text">
            Every yacht in our fleet is personally vetted. Every captain is known by name. Itineraries are crafted from real routes sailed in these waters - not copied from brochures. We work exclusively with MYBA-standard contracts, transparent APA and VAT breakdowns, and fast, detailed proposals.
          </p>
          <p className="about-philosophy__text">
            George Yachts is registered in the United States (Wyoming LLC) and operates from Athens, Greece. We serve an international clientele who expect discretion, precision, and a level of personal attention that larger platforms simply cannot provide.
          </p>
        </RevealSection>
      </section>

      {/* ═══════ TIER 2.1 — FORBES MENTION ═══════
          Roberto Forbes integration brief, May 2026. Small
          typographic addition that sits beneath the existing intro
          philosophy and above the stats section. Brand-equality
          rule respected: "Forbes" rendered as a text wordmark in
          regular weight, never larger than the page-level G/Y mark.
          NOT a rewrite — purely additive.
      */}
      <section
        aria-label="Featured in Forbes - May 2026"
        style={{
          padding: "60px 24px 70px",
          textAlign: "center",
          background: "transparent",
        }}
      >
        <RevealSection style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            aria-hidden="true"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 18,
              color: "rgba(201,168,76,0.55)",
              letterSpacing: "0.18em",
              marginBottom: 22,
            }}
          >
            ────────  ⊹  ────────
          </div>
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontStyle: "italic",
              fontSize: 22,
              fontWeight: 300,
              color: "#F8F5F0",
              margin: "0 0 8px",
              letterSpacing: "0.01em",
              lineHeight: 1.45,
            }}
          >
            Featured in{" "}
            <span
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontStyle: "normal",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Forbes
            </span>{" "}
            - 1 May 2026
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 14,
              color: "rgba(248,245,240,0.72)",
              fontWeight: 300,
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            on the wealth-relocation patterns reshaping Greek waters charters.
          </p>
          <a
            href="https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Read"
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "1px solid rgba(201,168,76,0.5)",
              paddingBottom: 2,
            }}
          >
            Read on Forbes →
          </a>
        </RevealSection>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="about-stats">
        <div className="about-stats__grid">
          {[
            { number: FLEET_COUNT, suffix: "+", label: "Curated Yachts" },
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
                  alt="George P. Biniaris - Managing Broker, George Yachts Brokerage House"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(13, 27, 42,0.6), transparent)" }} />
              </div>
              {/* IYBA Badge under photo — official logo, link to iyba.org
                  per legal directive §3 backlink-required clause. */}
              <a
                href="https://iyba.org"
                target="_blank"
                rel="noopener noreferrer"
                title="International Yacht Brokers Association"
                style={{ textDecoration: "none", marginTop: "20px", display: "flex", alignItems: "center", gap: "12px", padding: "16px", border: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.03)" }}
              >
                <img src="/images/iyba-official-white.png" alt="IYBA - International Yacht Brokers Association" style={{ height: "32px", width: "auto", opacity: 0.85 }} />
                <div>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(248, 245, 240,0.4)", textTransform: "uppercase", margin: 0 }}>Charter Active Member</p>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "11px", letterSpacing: "0.1em", color: "#C9A84C", margin: 0 }}>International Yacht Brokers Association</p>
                </div>
              </a>
            </RevealSection>

            <RevealSection className="about-george__text-col" delay={0.2}>
              <p className="about-george__eyebrow">Managing Broker</p>
              <h2 className="about-george__name">George P. Biniaris</h2>
              <p className="about-george__role">
                Managing Broker &middot; <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>IYBA Member</a>
              </p>
              <div className="about-george__line" />
              <p className="about-george__bio">
                Every client works directly with George. No call centres, no junior agents,
                no automated responses. When you reach out, George answers. When you board
                your yacht, George has personally vetted the crew, the itinerary, and every
                detail of your experience.
              </p>
              <p className="about-george__bio">
                George knows these waters first-hand - every anchorage, every crew,
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

      {/* ═══════ A NOTE FROM GEORGE ═══════ */}
      <section style={{ padding: "100px 24px", background: "#0D1B2A" }}>
        <RevealSection style={{ maxWidth: "740px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", fontWeight: 300, letterSpacing: "0.4em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "32px", textAlign: "center" }}>
            A &nbsp; N O T E &nbsp; F R O M &nbsp; G E O R G E
          </p>

          <div style={{ borderLeft: "4px solid #C9A84C", paddingLeft: "28px" }}>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.85, color: "rgba(248,245,240,0.82)", marginBottom: "20px" }}>
              I grew up on my uncle&apos;s Ferretti, crossing from Athens to Syros, to Mykonos, to wherever the Cyclades took us. My mother is from Syros - the sea was never a hobby. It was home.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "16px", fontWeight: 300, lineHeight: 1.85, color: "rgba(248,245,240,0.6)", marginBottom: "20px" }}>
              I studied shipping. I became a skipper in Corfu. I earned my motor yacht licence. I managed charters across the Ionian and the Cyclades - briefing captains, building itineraries, solving problems at midnight.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "16px", fontWeight: 300, lineHeight: 1.85, color: "rgba(248,245,240,0.6)", marginBottom: "20px" }}>
              I built George Yachts because I wanted to do this properly. Not as another name on a platform. Not as a cold transaction. But as someone who knows these waters first-hand, who has untangled an anchor under pressure in Paxos, and who has watched a family of twelve cry at disembarkation - not because something went wrong, but because they didn&apos;t want it to end.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "16px", fontWeight: 300, lineHeight: 1.85, color: "rgba(248,245,240,0.6)", marginBottom: "20px" }}>
              That moment - when your clients hold you and tell you this was unlike anything they&apos;ve ever experienced - that is why I do this.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "16px", fontWeight: 300, lineHeight: 1.85, color: "rgba(248,245,240,0.6)", marginBottom: "28px" }}>
              Greece is not one destination. It is hundreds. And if you have the right person guiding you, every voyage reveals something new. I am that person.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.15em", color: "#C9A84C" }}>
              - George P. Biniaris, Managing Broker
            </p>
          </div>
        </RevealSection>
      </section>

      {/* ═══════ OUR CORE TEAM ═══════
          Boss directive 2026-05-08 — restore from the prior site,
          same six people / photos / titles. Palette + fonts run
          through the canonical brand tokens (no inline hex, no
          hardcoded font-family beyond what the Phase 28 catcher
          already routes to the tier vars). */}
      <section
        className="about-team"
        style={{
          padding: "100px 24px",
          background: "var(--gy-navy)",
          borderTop: "1px solid rgba(201,168,76,0.10)",
        }}
      >
        <RevealSection style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "var(--gy-gold)",
                marginBottom: "20px",
              }}
            >
              Our Core Team
            </p>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "0.005em",
                color: "var(--gy-ivory)",
                margin: "0 0 24px",
              }}
            >
              The people behind every charter
            </h2>
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: 60,
                height: 1,
                margin: "0 auto 24px",
                background: "rgba(201, 168, 76, 0.55)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.5vw, 18px)",
                lineHeight: 1.7,
                fontWeight: 300,
                color: "rgba(248,245,240,0.78)",
                maxWidth: "60ch",
                margin: "0 auto",
              }}
            >
              Yacht Management &middot; Yacht Sales &middot; Yacht Charter.
              No call centres. No automated responses. Real people, real
              expertise, real relationships.
            </p>
          </div>

          <div
            className="about-team__grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {CORE_TEAM.map((m, i) => (
              <RevealSection key={m.name} delay={i * 0.06}>
                <Link
                  href={m.profileUrl}
                  className="about-team__card"
                  style={{
                    display: "block",
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--gy-card)",
                    border: "1px solid rgba(201, 168, 76, 0.10)",
                    textDecoration: "none",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3 / 4",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={m.imageUrl}
                      alt={`${m.name} - ${m.title} at George Yachts`}
                      fill
                      className="about-team__img"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 240px"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(13, 27, 42, 0) 40%, rgba(13, 27, 42, 0.85) 100%)",
                      }}
                    />
                  </div>
                  <div style={{ padding: "20px 22px 24px" }}>
                    <h3
                      className="notranslate"
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: "20px",
                        fontWeight: 400,
                        lineHeight: 1.2,
                        letterSpacing: "0.005em",
                        color: "var(--gy-ivory)",
                        margin: "0 0 8px",
                      }}
                    >
                      {m.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: "11px",
                        fontWeight: 400,
                        lineHeight: 1.5,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(248,245,240,0.6)",
                        margin: "0 0 14px",
                      }}
                    >
                      {m.title}
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--gy-gold)",
                      }}
                    >
                      View profile &rarr;
                    </span>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "48px",
              fontFamily: "var(--gy-font-ui)",
              fontSize: "11px",
              fontWeight: 300,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(248, 245, 240, 0.45)",
            }}
          >
            <Link
              href="/team"
              style={{
                color: "rgba(248,245,240,0.78)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(201, 168, 76, 0.4)",
                paddingBottom: "2px",
              }}
            >
              Meet the full team &rarr;
            </Link>
          </p>
        </RevealSection>
      </section>

      {/* ═══════ WHY BOUTIQUE ═══════ */}
      <section style={{ padding: "100px 24px", background: "rgba(201,168,76,0.02)", borderTop: "1px solid rgba(201,168,76,0.08)", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
        <RevealSection className="text-center" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.4em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "24px" }}>The Difference</p>
          <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 300, color: "#F8F5F0", marginBottom: "40px", lineHeight: 1.3 }}>
            Why Choose a Boutique Broker?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", textAlign: "left" }}>
            {[
              { label: "Large Aggregator", value: "Thousands of yachts, generic filters, algorithm-matched", vs: "vs" },
              { label: "George Yachts", value: `${FLEET_COUNT} personally vetted yachts, hand-selected for you by someone who has been aboard each one`, highlight: true },
            ].map((item, i) => (
              <div key={i} style={{ padding: "32px", border: item.highlight ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(248, 245, 240,0.08)", background: item.highlight ? "rgba(201,168,76,0.05)" : "transparent" }}>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.3em", color: item.highlight ? "#C9A84C" : "rgba(248, 245, 240,0.3)", textTransform: "uppercase", marginBottom: "16px" }}>{item.label}</p>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "14px", lineHeight: 1.9, color: item.highlight ? "rgba(248,245,240,0.78)" : "rgba(248, 245, 240,0.4)" }}>{item.value}</p>
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
            of lifestyle services - ensuring your journey is effortless from touchdown to sunset.
          </p>
        </RevealSection>

        <div className="about-services__grid">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
              ),
              title: "Yacht Charter",
              desc: `${FLEET_COUNT} curated yachts - Private Fleet (full crew) + Explorer Fleet (skippered) - across all Greek waters.`,
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
              { title: "Greek Expertise", desc: "Cyclades \u00b7 Ionian \u00b7 Saronic" },
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
            Share your vision and we&apos;ll handle every detail - from yacht
            selection to sunset anchorages.
          </p>
          <a
            href="https://calendly.com/george-georgeyachts/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== "undefined" && typeof window.gtag === "function") {
                try { window.gtag("event", "calendly_click", { click_location: "about_us" }); } catch {}
              }
            }}
            className="about-cta__button"
          >
            Book a Free Consultation
          </a>
        </RevealSection>
      </section>
    </>
  );
}
