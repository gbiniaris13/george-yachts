import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import { ServiceParallax, Reveal } from "@/components/ServiceParallax";
import "@/styles/service-page.css";

export const metadata = {
  title: "Yacht Shows & Events 2026 | George Yachts Brokerage House",
  description: "Meet George Yachts at the world's leading yacht shows and maritime events. Monaco Yacht Show, MEDYS Athens, Cannes Yachting Festival, and more.",
  alternates: { canonical: "https://georgeyachts.com/events" },
};

const events = [
  {
    date: "May 2-4, 2026",
    name: "Mediterranean Yacht Show (MEDYS)",
    location: "Athens, Greece",
    desc: "Greece's premier charter yacht show. Meet George Yachts on-site and tour our curated fleet in person.",
    status: "tbd",
  },
  {
    date: "September 2026",
    name: "Cannes Yachting Festival",
    location: "Cannes, France",
    desc: "Europe's leading in-water yacht show. Contact us if you'd like to arrange a meeting.",
    status: "tbd",
  },
  {
    date: "September 2026",
    name: "Monaco Yacht Show",
    location: "Port Hercules, Monaco",
    desc: "The world's most prestigious superyacht event. Reach out to discuss meeting opportunities.",
    status: "tbd",
  },
  {
    date: "October 2026",
    name: "Fort Lauderdale International Boat Show",
    location: "Fort Lauderdale, Florida",
    desc: "The Western Hemisphere's largest boat show. Contact us for U.S. meeting arrangements.",
    status: "tbd",
  },
  {
    date: "December 2026",
    name: "Antigua Charter Yacht Show",
    location: "Antigua, Caribbean",
    desc: "The Caribbean's most important charter yacht event for the winter season.",
    status: "tbd",
  },
];

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Yacht Shows & Events | George Yachts", description: "Major yacht shows and maritime events relevant to George Yachts Brokerage House clients." };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <ServiceParallax />

      <section className="svc-hero">
        <Image src="https://cdn.sanity.io/images/ecqr94ey/production/fcab3e94a58ed3568026599cb9720e6d4d9fe155-940x627.jpg?w=1920&h=900&fit=crop&auto=format" alt="Yacht shows and events - George Yachts Brokerage House" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Industry Presence</p>
          <h1 className="svc-hero__title">Events &amp; Shows</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Meet George Yachts at the world&apos;s leading maritime events.</p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: "100px 24px", background: "#000" }}>
        <Reveal className="text-center" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "24px" }}>2026 Calendar</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, color: "#fff", margin: "0 0 32px" }}>
            Where Can You Meet George Yachts This Year?
          </h2>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #E6C77A, #A67C2E)", margin: "0 auto 32px" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.9, fontWeight: 300 }}>
            We attend the most important yacht shows globally to stay connected with owners, captains, and industry leaders. If you&apos;re attending any of these events, we&apos;d welcome the opportunity to meet in person.
          </p>
        </Reveal>
      </section>

      {/* Events List */}
      <section style={{ padding: "0 24px 100px", background: "#000" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {events.map((event, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ borderBottom: "1px solid rgba(218,165,32,0.06)", padding: "40px 0", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ minWidth: "140px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#DAA520", marginBottom: "4px" }}>{event.date}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{event.location}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", fontWeight: 500, color: "#fff", margin: 0 }}>{event.name}</h3>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "7px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", border: `1px solid ${event.status === "confirmed" ? "rgba(218,165,32,0.4)" : "rgba(255,255,255,0.1)"}`, color: event.status === "confirmed" ? "#DAA520" : "rgba(255,255,255,0.3)" }}>
                      {event.status === "confirmed" ? "Confirmed" : "To Be Confirmed"}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300 }}>{event.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#000", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <Reveal>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "16px" }}>Attending a Show?</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", margin: "0 0 16px" }}>Let&apos;s Meet in Person</h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "500px", margin: "0 auto 40px" }}>
            Schedule a private meeting at any upcoming show. We&apos;ll arrange viewings and discuss your charter plans.
          </p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", color: "#000", padding: "16px 48px", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
            Schedule a Meeting
          </a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
