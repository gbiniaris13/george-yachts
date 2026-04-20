"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function PrivateFleetClient({ yachts, lowestPrice = 30000, highestPrice = 235000 }) {
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
          <a
            href="https://wa.me/17867988798?text=Hello%20George%20%E2%80%94%20I%27m%20interested%20in%20your%20Private%20Fleet%20for%20a%20Greek%20charter.%20Can%20we%20discuss%20options%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "16px 48px", textDecoration: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.52.802.537-.056 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
            Discuss Your Charter on WhatsApp
          </a>
        </div>
      </section>

      {/* Price Range */}
      <section style={{ padding: "80px 24px", background: "#000", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 40px", border: "1px solid rgba(218,165,32,0.15)", borderRadius: 4 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#DAA520", margin: "0 0 16px 0" }}>
            From €{lowestPrice.toLocaleString()} to €{highestPrice.toLocaleString()} / week
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0, letterSpacing: "0.05em" }}>
            Full crew included · APA & expenses extra · curated for Greek waters
          </p>
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
              <Link key={yacht._id} href={`/yachts/${yacht.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(218,165,32,0.08)", borderRadius: 4, overflow: "hidden" }}>
                {/* Image */}
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                  {yacht.imageUrl && (
                    <Image src={yacht.imageUrl} alt={`${yacht.name} — luxury yacht charter Greece`} fill style={{ objectFit: "cover" }} sizes="400px" />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: "#fff", margin: 0, letterSpacing: "0.02em" }}>{yacht.name}</h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 5 }}>
                      {yacht.builder} · {yacht.length} · {yacht.sleeps} guests
                    </p>
                  </div>
                </div>

                {/* Pricing Panel */}
                <div style={{ padding: "24px 28px", background: "rgba(8,8,8,0.98)", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.1)" }}>
                  {/* Gold divider */}
                  <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, #DAA520, transparent)", margin: "0 auto 18px" }} />

                  {yacht.weeklyRatePrice ? (
                    <>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 300, color: "#DAA520", margin: "0 0 8px 0", letterSpacing: "0.03em" }}>
                        {yacht.weeklyRatePrice.split('|')[0].trim()}
                      </p>
                      {yacht.weeklyRatePrice.includes('|') && (
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                          {yacht.weeklyRatePrice.split('|')[1].trim()}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: "#DAA520", margin: "0 0 6px 0" }}>
                        Price on request
                      </p>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                        Contact for rates
                      </p>
                    </>
                  )}

                  {/* Bottom rule */}
                  <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.3), transparent)", margin: "18px auto 0" }} />
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
        <a
          href="https://wa.me/17867988798?text=Hello%20George%20%E2%80%94%20I%27d%20like%20to%20begin%20a%20Private%20Charter%20conversation.%20Which%20yachts%20are%20available%3F"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", padding: "18px 56px", textDecoration: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.52.802.537-.056 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
          Message George on WhatsApp
        </a>
      </section>
    </div>
  );
}
