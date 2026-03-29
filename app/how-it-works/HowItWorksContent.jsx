"use client";

import { useEffect, useRef, useState } from "react";

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

function Step({ number, icon, title, description, detail, delay = 0 }) {
  const [ref, visible] = useReveal(0.15);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: "40px",
        alignItems: "start",
        paddingBottom: "80px",
        marginBottom: "0",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
      className="how-step"
    >
      {/* Number + Line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          border: "1px solid rgba(218,165,32,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(218,165,32,0.05)",
          marginBottom: "16px",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "24px", fontWeight: 300, color: "#DAA520",
          }}>
            {number}
          </span>
        </div>
        {number < 5 && (
          <div style={{
            width: "1px", flex: 1, minHeight: "60px",
            background: "linear-gradient(to bottom, rgba(218,165,32,0.3), transparent)",
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingTop: "12px" }}>
        <div style={{ color: "#DAA520", marginBottom: "16px" }}>{icon}</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.6rem", fontWeight: 400, color: "#fff",
          marginBottom: "16px",
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "14px", lineHeight: 2, color: "rgba(255,255,255,0.5)",
          marginBottom: "12px",
        }}>
          {description}
        </p>
        {detail && (
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "12px", lineHeight: 1.8, color: "rgba(255,255,255,0.3)",
            fontStyle: "italic",
          }}>
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

export default function HowItWorksContent() {
  const steps = [
    {
      number: 1,
      title: "Share Your Vision",
      description: "Tell us what matters to you — dates, group size, budget, preferred islands, pace, interests. A 15-minute call or a simple form is all it takes. No commitment, no pressure.",
      detail: "George personally handles every inquiry. You'll never speak to a call centre.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      number: 2,
      title: "Receive Your Proposal",
      description: "Within 24–48 hours, you'll receive a curated shortlist of 3–5 yachts — each personally vetted, with photos, crew profiles, pricing breakdown, and George's honest assessment of each option.",
      detail: "We include APA and VAT estimates upfront. No surprises after you commit.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      number: 3,
      title: "Secure Your Yacht",
      description: "Once you've chosen, we handle the MYBA charter contract — the industry standard used worldwide. Clear terms, transparent pricing, professional protection for both parties.",
      detail: "A 50% deposit secures your dates. Balance due 4 weeks before embarkation.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      number: 4,
      title: "Pre-Charter Concierge",
      description: "In the weeks before your charter, we coordinate everything: crew preference sheets (dietary needs, allergies, interests), bespoke itinerary planning, airport transfers, provisioning, and any special requests.",
      detail: "Need a private chef for a birthday dinner on a remote beach? Consider it done.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      number: 5,
      title: "Your Week Begins",
      description: "Step aboard, meet your crew, and forget everything else. Your captain knows the route. Your chef knows your preferences. Your broker is a phone call away if you need anything — but you won't.",
      detail: "This is what you came for. The rest is handled.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="5" r="3"/>
          <line x1="12" y1="8" x2="12" y2="22"/>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
        </svg>
      ),
    },
  ];

  return (
    <section style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px" }}>
      {steps.map((step, i) => (
        <Step key={step.number} {...step} delay={i * 0.1} />
      ))}

      {/* Closing */}
      <div style={{
        textAlign: "center", paddingTop: "40px",
        borderTop: "1px solid rgba(218,165,32,0.1)",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.5rem", fontWeight: 300, color: "rgba(255,255,255,0.7)",
          fontStyle: "italic", lineHeight: 1.8, marginBottom: "32px",
        }}>
          Five steps. One broker. Zero stress.
        </p>
        <a
          href="#contact"
          style={{
            display: "inline-block",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#000",
            background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
            padding: "16px 48px", textDecoration: "none",
          }}
        >
          Start Planning Your Charter
        </a>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .how-step {
            grid-template-columns: 50px 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
