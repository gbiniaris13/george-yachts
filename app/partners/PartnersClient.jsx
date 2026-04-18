"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ─── HOW IT WORKS ─── */
const columns = [
  {
    label: "YOU DO",
    items: [
      "Forward the enquiry",
      "Approve the proposal",
      "Present to your client",
    ],
  },
  {
    label: "WE DO",
    items: [
      "Source the vessel",
      "Build the proposal",
      "Handle contracts & logistics",
    ],
  },
  {
    label: "YOUR CLIENT RECEIVES",
    items: [
      "Hand-selected yacht",
      "White-glove crew",
      "Bespoke itinerary",
    ],
  },
];

/* ─── WHY PARTNERS CHOOSE US ─── */
const reasons = [
  { title: "Same-Day Proposals", desc: "Your client never waits. We respond within hours, not days." },
  { title: "You Stay the Hero", desc: "We remain invisible. Your brand, your relationship, your client." },
  { title: "MYBA Contracts", desc: "Every charter is protected by industry-standard MYBA contracts." },
  { title: "One Broker. Direct Line.", desc: "Full accountability. No call centres, no hand-offs." },
];

/* ─── FLEET TIERS ─── */
const fleets = [
  { name: "Explorer Fleet", price: "from €375/person/week", count: "14 vessels" },
  { name: "Private Fleet", price: "€13K–€90K/week", count: "30+ vessels" },
  { name: "Superyacht Collection", price: "€90K–€235K+/week", count: "Motor yachts 100–210 ft" },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote:
      "The collaboration was smooth and highly professional. George was incredibly responsive and efficient in all communications. His professionalism and knowledge of the charter process made the experience both seamless and enjoyable.",
    role: "Superyacht Charter Broker · Dubai, Monaco & London",
  },
  {
    quote:
      "Extremely helpful and very professional through all our communication. I look forward to working with him again in the future.",
    role: "Senior Charter Broker · London",
  },
];

/* ─── CREDENTIALS ─── */
const credentials = [
  "US Registered LLC",
  "IYBA Member",
  "MYBA Contracts",
  "Greek Waters Specialist",
];

export default function PartnersClient() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // POST to a serverless function that sends the PDF + notifies George
      await fetch("/api/partner-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      setSubmitted(true);
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:george@georgeyachts.com?subject=Partnership%20Programme%20Request&body=Please%20send%20me%20the%20Partnership%20Programme.%20My%20email%3A%20${encodeURIComponent(email)}`;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans">
      {/* ═══════ HERO ═══════ */}
      <section
        className="relative flex items-center justify-center text-center px-6"
        style={{
          backgroundColor: "#0D1B2A",
          minHeight: "70vh",
          paddingTop: "140px",
          paddingBottom: "80px",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 300,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "28px",
            }}
          >
            P A R T N E R S H I P &nbsp; P R O G R A M M E
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            Partner With George Yachts
          </h1>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 18px)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.6)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            White-label yacht charter for travel professionals. You stay the hero.
          </p>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-16" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 300, letterSpacing: "0.45em", textTransform: "uppercase", color: "#0D1B2A", opacity: 0.5 }}>
            H O W &nbsp; I T &nbsp; W O R K S
          </p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {columns.map((col, i) => (
              <div key={i} className="text-center">
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                    marginBottom: "24px",
                  }}
                >
                  {col.label}
                </h3>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "20px",
                        fontWeight: 400,
                        color: "#0D1B2A",
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY PARTNERS CHOOSE US ═══════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0D1B2A" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center mb-16" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 300, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            W H Y &nbsp; P A R T N E R S &nbsp; C H O O S E &nbsp; U S
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {reasons.map((r, i) => (
              <div key={i} className="border-l-2 pl-6" style={{ borderColor: "#C9A84C" }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#fff",
                    marginBottom: "8px",
                  }}
                >
                  {r.title}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BROKER TESTIMONIALS ═══════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center mb-16" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 300, letterSpacing: "0.45em", textTransform: "uppercase", color: "#0D1B2A", opacity: 0.5 }}>
            W H A T &nbsp; T H E &nbsp; I N D U S T R Y &nbsp; S A Y S
          </p>
          {testimonials.map((t, i) => (
            <div key={i}>
              <blockquote className="text-center mb-6">
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 400, lineHeight: 1.8, color: "#0D1B2A", maxWidth: "680px", margin: "0 auto" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <p className="text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
                — {t.role}
              </p>
              {i < testimonials.length - 1 && (
                <div className="flex justify-center my-14">
                  <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FLEET OVERVIEW ═══════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0D1B2A" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center mb-16" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 300, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            O U R &nbsp; F L E E T
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {fleets.map((f, i) => (
              <div key={i} className="text-center p-8" style={{ border: "1px solid rgba(201, 168, 76, 0.2)", borderRadius: "2px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "26px", fontWeight: 500, color: "#fff", marginBottom: "8px" }}>
                  {f.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 600, color: "#C9A84C", marginBottom: "4px" }}>
                  {f.price}
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>
                  {f.count}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
            66+ curated vessels across all Greek waters
          </p>
        </div>
      </section>

      {/* ═══════ CTA — REQUEST PROGRAMME ═══════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              color: "#0D1B2A",
              marginBottom: "12px",
            }}
          >
            See How Much You Earn
          </h2>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "14px",
              fontWeight: 300,
              color: "#0D1B2A",
              opacity: 0.6,
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            Request our Partnership Programme with full commission details.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              {/* Honeypot — hidden from real users, bots autofill it */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your business email"
                className="flex-1 px-5 py-3.5 text-sm border focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  borderColor: "rgba(13, 27, 42, 0.15)",
                  borderRadius: "2px",
                  color: "#0D1B2A",
                  backgroundColor: "#fff",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  backgroundColor: "#C9A84C",
                  color: "#0D1B2A",
                  borderRadius: "2px",
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending…" : "Send Me the Programme"}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-6" style={{ backgroundColor: "rgba(201, 168, 76, 0.08)", borderRadius: "2px" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", color: "#0D1B2A" }}>
                Thank you! Check your inbox shortly.
              </p>
            </div>
          )}

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 300, color: "#0D1B2A", opacity: 0.5 }}>
            Or{" "}
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#C9A84C] transition-colors"
            >
              book a call
            </a>
          </p>
        </div>
      </section>

      {/* ═══════ CREDENTIALS FOOTER ═══════ */}
      <section className="py-8 px-6" style={{ backgroundColor: "#0D1B2A" }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {credentials.map((c, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
