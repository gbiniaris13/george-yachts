"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function PrivateFleetClient({ yachts }) {
  const { t } = useI18n();

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      {/* Hero */}
      <section style={{ position: "relative", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src="/images/private-fleet-hero.jpg" alt="Private Fleet — luxury yacht charter Greece" fill style={{ objectFit: "cover", objectPosition: "center 40%", filter: "grayscale(100%) contrast(1.2) brightness(0.4)" }} sizes="100vw" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.5em", color: "#DAA520", textTransform: "uppercase", marginBottom: 24 }}>
            George Yachts Brokerage House
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 300, color: "#fff", margin: "0 0 16px 0", letterSpacing: "0.02em" }}>
            Private Fleet
          </h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #DAA520, transparent)", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", fontWeight: 300, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", marginBottom: 40 }}>
            Your own world at sea. Full crew. Total discretion.
          </p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "16px 48px", textDecoration: "none" }}>
            Discuss Your Charter
          </a>
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: "100px 24px", background: "#000" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {[
            { icon: "👨‍✈️", title: "Full Crew", desc: "Captain, chef, stewardess. Your comfort is their profession." },
            { icon: "🗺️", title: "Your Itinerary", desc: "Every day shaped around your wishes. No fixed routes." },
            { icon: "🔒", title: "Absolute Privacy", desc: "Your yacht. Your pace. Complete discretion." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 40, border: "1px solid rgba(218,165,32,0.1)", borderRadius: 4 }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#fff", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yacht Grid */}
      <section style={{ padding: "80px 24px", background: "#000" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: "#DAA520", textTransform: "uppercase", marginBottom: 16 }}>
              {yachts.length} Vessels
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#fff" }}>
              Our Private Fleet
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {yachts.map((yacht) => (
              <Link key={yacht._id} href={`/yachts/${yacht.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(218,165,32,0.08)", borderRadius: 4, overflow: "hidden", transition: "border-color 0.5s ease" }}>
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                  {yacht.imageUrl && (
                    <Image src={yacht.imageUrl} alt={`${yacht.name} — luxury yacht charter Greece`} fill style={{ objectFit: "cover", transition: "transform 0.7s ease" }} sizes="400px" />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#fff", margin: 0 }}>{yacht.name}</h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginTop: 4 }}>
                      {yacht.builder} · {yacht.length} · {yacht.sleeps} guests
                    </p>
                  </div>
                </div>
                <div style={{ padding: "16px", background: "rgba(10,10,10,0.95)" }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#DAA520", margin: 0 }}>
                    {yacht.weeklyRatePrice || "Price on request"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/charter-yacht-greece" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              View All Charter Yachts →
            </Link>
          </div>
        </div>
      </section>

      {/* George Section */}
      <section style={{ padding: "100px 24px", background: "#000", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 180, height: 180, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            <Image src="/images/george.jpg" alt="George P. Biniaris" fill style={{ objectFit: "cover" }} sizes="180px" />
          </div>
          <div style={{ textAlign: "center", flex: 1, minWidth: 250 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#fff", marginBottom: 8 }}>Your Broker: George</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#DAA520", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Managing Broker · IYBA Member</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, fontStyle: "italic" }}>
              "One broker. One relationship. One standard."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#000", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", marginBottom: 24 }}>
          Begin Your Private Charter
        </h2>
        <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "18px 56px", textDecoration: "none" }}>
          Discuss Your Charter
        </a>
      </section>
    </div>
  );
}
