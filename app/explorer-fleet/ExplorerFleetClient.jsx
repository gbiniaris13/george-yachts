"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function ExplorerFleetClient({ yachts }) {
  const { t } = useI18n();

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      {/* Back Button */}
      <div style={{ position: "fixed", top: 100, left: 24, zIndex: 9999 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "'Montserrat', sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", padding: "12px 20px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 4, border: "1px solid rgba(218,165,32,0.2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK
        </Link>
      </div>
      {/* Hero */}
      <section style={{ position: "relative", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src="/images/explorer-fleet-hero.jpg" alt="Explorer Fleet — group yacht charter Greece" fill style={{ objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(100%) contrast(1.2) brightness(0.4)" }} sizes="100vw" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.5em", color: "#DAA520", textTransform: "uppercase", marginBottom: 24 }}>
            George Yachts Brokerage House
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 300, color: "#fff", margin: "0 0 16px 0", letterSpacing: "0.02em" }}>
            Explorer Fleet
          </h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #DAA520, transparent)", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", fontWeight: 300, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", marginBottom: 40 }}>
            More islands. More adventure. The smart way to see Greece.
          </p>
          <a href="/#contact"
            style={{ display: "inline-block", fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "16px 48px", textDecoration: "none" }}>
            Plan Your Adventure
          </a>
        </div>
      </section>

      {/* Price Anchor */}
      <section style={{ padding: "80px 24px", background: "#000", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 40px", border: "1px solid rgba(218,165,32,0.15)", borderRadius: 4 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#DAA520", margin: "0 0 16px 0" }}>
            From €1,200 per person
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
            The same money as a week in a nice hotel on one island. But you wake up in a different bay every morning.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: "80px 24px", background: "#000" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {[
            { icon: "🏝️", title: "More Islands, Less Hassle", desc: "No ferries. No packing and unpacking. Your floating hotel moves with you." },
            { icon: "⛵", title: "Skippered or Crewed", desc: "Choose your style. Captain only, or add a hostess. Flexible to your group." },
            { icon: "👥", title: "Perfect for Groups", desc: "6-12 friends or family. Split the cost, share the adventure." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 40, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#fff", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perfect For */}
      <section style={{ padding: "80px 24px", background: "#000", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.06)" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#fff", marginBottom: 40 }}>Perfect For</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: 800, margin: "0 auto" }}>
          {["Friend reunions", "Milestone birthdays", "Bachelor & bachelorette trips", "Multi-generational family holidays", "Small corporate retreats"].map((item, i) => (
            <span key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", padding: "12px 24px", border: "1px solid rgba(218,165,32,0.15)", borderRadius: 24, letterSpacing: "0.1em" }}>
              {item}
            </span>
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
              Our Explorer Fleet
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {yachts.map((yacht) => {
              const rawPrice = String(yacht.weeklyRatePrice || '');
              const crewStr = String(yacht.crew || '');
              const rawLower = rawPrice.toLowerCase();
              const crewLower = crewStr.toLowerCase();

              const priceMatch = rawPrice.match(/[\d,.]+/);
              const basePrice = priceMatch ? parseInt(priceMatch[0].replace(/[,.]/g, '')) : 0;
              const guests = parseInt(yacht.sleeps) || 8;

              // Calculate total per-person cost including VAT, APA, and skipper where applicable
              // "plus skipper & expenses" = skipper is NOT in charter rate, paid separately
              // "Optional Skipper" = pure bareboat, no crew
              // Otherwise = fully crewed (crew included in charter rate)
              let total = 0;
              if (basePrice > 0) {
                if (rawLower.includes('plus skipper')) {
                  // Bareboat + mandatory skipper (paid separately): base × 1.32 (20% APA + 12% VAT) + €1,400 skipper
                  total = Math.round(basePrice * 1.32) + 1400;
                } else if (crewLower.includes('optional')) {
                  // Pure bareboat (no crew): base × 1.27 (15% APA + 12% VAT)
                  total = Math.round(basePrice * 1.27);
                } else {
                  // Fully crewed (crew in charter rate): base × 1.42 (30% APA + 12% VAT)
                  total = Math.round(basePrice * 1.42);
                }
              }
              const perPerson = total > 0 ? Math.round(total / guests) : 0;

              return (
                <Link key={yacht._id} href={`/yachts/${yacht.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                    {yacht.imageUrl && (
                      <Image src={yacht.imageUrl} alt={`${yacht.name} — yacht charter Greece`} fill style={{ objectFit: "cover" }} sizes="400px" />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#fff", margin: 0 }}>{yacht.name}</h3>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginTop: 4 }}>
                        {yacht.builder} · {yacht.length} · {yacht.sleeps} guests
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", background: "rgba(10,10,10,0.95)" }}>
                    {perPerson > 0 ? (
                      <>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#DAA520", margin: "0 0 2px 0" }}>
                          From €{perPerson.toLocaleString()} per person
                        </p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.08em" }}>
                          per week · incl. VAT & APA
                        </p>
                      </>
                    ) : (
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#DAA520", margin: 0 }}>
                        Price on request
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
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
              "Same care. Same service. Whatever your budget."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#000", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", marginBottom: 24 }}>
          Plan Your Adventure
        </h2>
        <a href="/#contact"
          style={{ display: "inline-block", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "18px 56px", textDecoration: "none" }}>
          Plan Your Adventure
        </a>
      </section>
    </div>
  );
}
