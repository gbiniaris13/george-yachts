"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";

const GOLD = "#DAA520";
const DARK = "#000";

function parsePrice(priceStr) {
  if (!priceStr) return { low: 0, high: 0 };
  const nums = priceStr.match(/[\d,.]+/g);
  if (!nums) return { low: 0, high: 0 };
  const clean = nums.map((n) => parseInt(n.replace(/[,.]/g, "")));
  return { low: clean[0] || 0, high: clean[1] || clean[0] || 0 };
}

const REGIONS = ["Cyclades", "Saronic Gulf", "Ionian Islands", "Sporades", "Dodecanese"];
const SEASONS = [
  { key: "low", label: "Low Season (Oct–Apr)", factor: 1.0 },
  { key: "mid", label: "Mid Season (May, Sep)", factor: 1.15 },
  { key: "high", label: "High Season (Jun–Aug)", factor: 1.35 },
];

export default function ProposalClient({ yachts }) {
  const { t } = useI18n();
  const [step, setStep] = useState(1); // 1=select, 2=customize, 3=preview
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [formData, setFormData] = useState({
    clientName: "",
    season: "mid",
    region: "Cyclades",
    startDate: "",
    endDate: "",
    guests: 6,
    specialRequests: "",
  });
  const proposalRef = useRef(null);

  const yacht = selectedYacht;
  const prices = yacht ? parsePrice(yacht.weeklyRatePrice) : { low: 0, high: 0 };
  const seasonFactor = SEASONS.find((s) => s.key === formData.season)?.factor || 1;
  const charterRate = Math.round(formData.season === "low" ? prices.low : formData.season === "high" ? prices.high : (prices.low + prices.high) / 2);
  const apa = Math.round(charterRate * 0.3);
  const vat = Math.round((charterRate + apa) * 0.12);
  const total = charterRate + apa + vat;
  const perPerson = formData.guests > 0 ? Math.round(total / formData.guests) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = `Hello George, I generated a charter proposal on your website:\n\nYacht: ${yacht?.name}\nRegion: ${formData.region}\nSeason: ${SEASONS.find(s => s.key === formData.season)?.label}\nGuests: ${formData.guests}\nEstimated Total: €${total.toLocaleString()}\n\nI'd like to discuss this further.`;
    window.open(`https://wa.me/17867988798?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // STEP 1: Select Yacht
  if (step === 1) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, padding: "160px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: `${GOLD}99`, textTransform: "uppercase", marginBottom: 16 }}>
            Instant Charter Proposal
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", fontWeight: 300, margin: "0 0 16px" }}>
            Generate Your Proposal
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 48, lineHeight: 1.7 }}>
            Select a yacht below and we'll create a complete charter proposal in seconds — with pricing, specs, and everything you need.
          </p>

          {/* Yacht Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16, textAlign: "left" }}>
            {yachts.map((y) => {
              const p = parsePrice(y.weeklyRatePrice);
              return (
                <div
                  key={y._id}
                  onClick={() => { setSelectedYacht(y); setStep(2); }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid rgba(218,165,32,${selectedYacht?._id === y._id ? 0.6 : 0.1})`,
                    padding: 0, cursor: "pointer",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `rgba(218,165,32,0.4)`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `rgba(218,165,32,0.1)`}
                >
                  {y.imageUrl && (
                    <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                      <Image src={`${y.imageUrl}?w=500&h=320&fit=crop&auto=format`} alt={y.name} fill style={{ objectFit: "cover" }} sizes="250px" />
                    </div>
                  )}
                  <div style={{ padding: "16px 20px" }}>
                    <p className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#fff", margin: "0 0 4px" }}>{y.name}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
                      {y.length} · {y.sleeps} guests · {y.cabins} cabins
                    </p>
                    {p.low > 0 && (
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: GOLD, marginTop: 8 }}>
                        From €{p.low.toLocaleString()}/week
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Customize
  if (step === 2) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, padding: "160px 24px 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "'Montserrat', sans-serif", fontSize: 12, cursor: "pointer", marginBottom: 32, letterSpacing: "0.1em" }}>
            ← Back to yacht selection
          </button>

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", fontWeight: 300 }}>{yacht?.name}</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: GOLD, letterSpacing: "0.15em", marginTop: 8 }}>Customize Your Proposal</p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={labelStyle}>Your Name (optional)</label>
              <input type="text" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="For a personalized proposal" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Season</label>
              <select value={formData.season} onChange={(e) => setFormData({ ...formData, season: e.target.value })} style={inputStyle}>
                {SEASONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Preferred Region</label>
              <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} style={inputStyle}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Start Date</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Number of Guests</label>
              <input type="number" min={1} max={parseInt(yacht?.sleeps) || 12} value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Special Requests (optional)</label>
              <textarea value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} placeholder="Birthday celebration, dietary requirements, specific islands..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <button onClick={() => setStep(3)} style={{ width: "100%", marginTop: 40, padding: "18px 0", background: `linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)`, color: "#000", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
            Generate Proposal →
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: Proposal Preview (printable)
  return (
    <div style={{ minHeight: "100vh", background: DARK }}>
      {/* Action bar (hidden in print) */}
      <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(0,0,0,0.95)", borderBottom: "1px solid rgba(218,165,32,0.15)", padding: "12px 24px", display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
        <button onClick={() => setStep(2)} style={actionBtnStyle}>← Edit</button>
        <button onClick={handlePrint} style={{ ...actionBtnStyle, background: `linear-gradient(90deg, #E6C77A, #C9A24D)`, color: "#000", fontWeight: 700 }}>
          📄 Save as PDF
        </button>
        <button onClick={handleWhatsApp} style={{ ...actionBtnStyle, background: "none", border: `1px solid ${GOLD}40`, color: GOLD }}>
          💬 Send to George
        </button>
      </div>

      {/* PROPOSAL DOCUMENT */}
      <div ref={proposalRef} id="proposal-document" style={{ maxWidth: 800, margin: "0 auto", padding: "100px 40px 80px", background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, paddingBottom: 32, borderBottom: "2px solid #DAA520" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, letterSpacing: "0.1em", color: "#1a1a1a", margin: "0 0 4px" }} className="notranslate">
            GEORGE YACHTS
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "#888", textTransform: "uppercase" }} className="notranslate">
            BROKERAGE HOUSE LLC
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#aaa", marginTop: 16, letterSpacing: "0.1em" }}>
            CHARTER PROPOSAL
          </p>
        </div>

        {/* Client & Date */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, fontSize: 12, fontFamily: "'Montserrat', sans-serif", color: "#666" }}>
          <div>
            {formData.clientName && <p style={{ margin: 0 }}>Prepared for: <strong style={{ color: "#1a1a1a" }}>{formData.clientName}</strong></p>}
            <p style={{ margin: "4px 0 0" }}>Region: {formData.region}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0 }}>Date: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            {formData.startDate && <p style={{ margin: "4px 0 0" }}>Charter: {formData.startDate} → {formData.endDate}</p>}
          </div>
        </div>

        {/* Yacht Hero */}
        {yacht?.imageUrl && (
          <div style={{ position: "relative", width: "100%", height: 350, marginBottom: 32, overflow: "hidden" }}>
            <img src={`${yacht.imageUrl}?w=1200&h=700&fit=crop&auto=format`} alt={yacht.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Yacht Name */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "#1a1a1a", margin: "0 0 8px" }}>
            {yacht?.name}
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#888", letterSpacing: "0.15em" }}>
            {yacht?.builder} · {yacht?.length} · {yacht?.sleeps} Guests · {yacht?.cabins} Cabins
          </p>
        </div>

        {/* Specs Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#eee", marginBottom: 40 }}>
          {[
            { label: "Length", value: yacht?.length },
            { label: "Builder", value: yacht?.builder },
            { label: "Guests", value: yacht?.sleeps },
            { label: "Cabins", value: yacht?.cabins },
          ].map((spec, i) => (
            <div key={i} style={{ background: "#fff", padding: 20, textAlign: "center" }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: "0.15em", color: "#999", textTransform: "uppercase", margin: "0 0 8px" }}>{spec.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#1a1a1a", margin: 0 }}>{spec.value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Crew */}
        {yacht?.crew && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={sectionTitleStyle}>Crew</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.8 }}>{yacht.crew}</p>
          </div>
        )}

        {/* George's Tip */}
        {yacht?.georgeInsiderTip && (
          <div style={{ marginBottom: 40, padding: 32, background: "#f8f6f1", borderLeft: "4px solid #DAA520" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.2em", color: "#DAA520", textTransform: "uppercase", margin: "0 0 12px" }}>George's Inside Info</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "#444", lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>
              "{yacht.georgeInsiderTip}"
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#999", textAlign: "right", marginTop: 12 }} className="notranslate">
              — George P. Biniaris, Managing Broker
            </p>
          </div>
        )}

        {/* PRICING TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={sectionTitleStyle}>Estimated Pricing — {SEASONS.find((s) => s.key === formData.season)?.label}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Montserrat', sans-serif", fontSize: 13 }}>
            <tbody>
              <tr style={rowStyle}>
                <td style={cellStyle}>Charter Rate (1 week)</td>
                <td style={{ ...cellStyle, textAlign: "right", fontWeight: 600 }}>€{charterRate.toLocaleString()}</td>
              </tr>
              <tr style={rowStyle}>
                <td style={cellStyle}>APA — Advanced Provisioning (est. 30%)</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>€{apa.toLocaleString()}</td>
              </tr>
              <tr style={rowStyle}>
                <td style={cellStyle}>VAT (12%)</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>€{vat.toLocaleString()}</td>
              </tr>
              <tr style={{ ...rowStyle, background: "#f8f6f1" }}>
                <td style={{ ...cellStyle, fontWeight: 700, fontSize: 14 }}>Estimated Total (all-inclusive)</td>
                <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700, fontSize: 16, color: "#DAA520" }}>€{total.toLocaleString()}</td>
              </tr>
              <tr style={rowStyle}>
                <td style={cellStyle}>Per person ({formData.guests} guests)</td>
                <td style={{ ...cellStyle, textAlign: "right", color: "#DAA520" }}>€{perPerson.toLocaleString()} / person / week</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#999", marginTop: 12, lineHeight: 1.6 }}>
            * All prices are estimates. Final pricing confirmed upon booking. Charter rates subject to yacht availability and exact dates. MYBA-standard charter contract applies.
          </p>
        </div>

        {/* Features */}
        {yacht?.features && yacht.features.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={sectionTitleStyle}>Key Features</h3>
            <ul style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#555", lineHeight: 2, paddingLeft: 20 }}>
              {yacht.features.slice(0, 8).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* Water Toys */}
        {yacht?.toys && yacht.toys.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={sectionTitleStyle}>Water Toys & Tenders</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#555", lineHeight: 2 }}>
              {yacht.toys.join(" · ")}
            </p>
          </div>
        )}

        {/* Special Requests */}
        {formData.specialRequests && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={sectionTitleStyle}>Your Special Requests</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.8, fontStyle: "italic" }}>
              "{formData.specialRequests}"
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "2px solid #DAA520", paddingTop: 32, marginTop: 48, textAlign: "center" }}>
          <p className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#1a1a1a", margin: "0 0 8px" }}>
            George Yachts Brokerage House LLC
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#999", margin: "0 0 4px", letterSpacing: "0.1em" }}>
            U.S. Registered · Operating from Athens, Greece · IYBA Member
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#666", margin: "16px 0 0" }}>
            📞 +30 6970 380 999 · 💬 +1 786 798 8798 · ✉ george@georgeyachts.com
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#bbb", marginTop: 16 }}>
            georgeyachts.com
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print, nav, footer, .whatsapp-btn, .mobile-sticky { display: none !important; }
          body { background: white !important; }
          #proposal-document { padding: 40px !important; margin: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  marginBottom: 8,
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(218,165,32,0.15)",
  color: "#fff",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.3s ease",
};

const actionBtnStyle = {
  padding: "10px 20px",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  color: "#fff",
  background: "rgba(255,255,255,0.08)",
};

const sectionTitleStyle = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#DAA520",
  marginBottom: 16,
  paddingBottom: 8,
  borderBottom: "1px solid #eee",
};

const rowStyle = { borderBottom: "1px solid #eee" };
const cellStyle = { padding: "14px 8px", color: "#444" };
