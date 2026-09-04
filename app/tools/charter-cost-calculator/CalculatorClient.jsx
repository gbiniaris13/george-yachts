"use client";

// Charter Cost Calculator client.
//
// 2026-09-04 rebuild (plan item 7, George: "cost cluster to #1"). The
// first version asked the visitor to guess a base fee and then taxed it
// at a flat 13%. Three things were wrong with that and all three broke
// house rules: the fee now starts from the Greek Charter Index rate
// cards (lib/charterIndex2026.js, real bands, refreshed quarterly), VAT
// is the yacht's CERTIFIED tier (5.2, 6.5, 7.8 or 12%, with 13% only as
// the statutory ceiling), and APA follows the documented ranges (20 to
// 30% for sailing yachts and catamarans, 30 to 40% for motor yachts).
// Nothing is shown per person: one price, one product, the yacht by the
// week. The "foreign flag skips VAT" switch is gone; it was not true.

import { useMemo, useState } from "react";
import Link from "next/link";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

// Certified Greek VAT tiers on a weekly crewed charter. 13% is the
// statutory ceiling; the yacht's certificate sets the invoiced rate.
// Short charters under 48 hours and bareboat are taxed at 24% and are
// not what this house sells, so they are not options here.
const VAT_TIERS = [
  { value: 0.052, label: "5.2%" },
  { value: 0.065, label: "6.5%" },
  { value: 0.078, label: "7.8%" },
  { value: 0.12, label: "12%" },
  { value: 0.13, label: "13% (statutory ceiling)" },
];

// APA as documented in the Index: sailing yachts and catamarans 20 to
// 30%, motor yachts 30 to 40%, where fuel weighs heaviest.
const APA_OPTIONS = [
  { value: 0.2, label: "20%, sailing yacht or catamaran, light itinerary" },
  { value: 0.25, label: "25%, sailing yacht or catamaran, typical" },
  { value: 0.3, label: "30%, catamaran with long legs, or a motor yacht kept slow" },
  { value: 0.35, label: "35%, motor yacht, typical" },
  { value: 0.4, label: "40%, motor yacht, fast passages or a full week under way" },
];

// Embarkation ports and the delivery days a yacht based in Athens needs
// to reach them. The delivery estimate is 1/7 of the weekly fee per day,
// which is the convention brokers quote from and often negotiate down.
const EMBARK_PORTS = [
  { value: "athens", label: "Athens (Alimos, Olympic Marine)", deliveryDays: 0 },
  { value: "mykonos", label: "Mykonos", deliveryDays: 1 },
  { value: "santorini", label: "Santorini", deliveryDays: 1.5 },
  { value: "corfu", label: "Corfu", deliveryDays: 1 },
  { value: "rhodes", label: "Rhodes (Dodecanese)", deliveryDays: 1.5 },
];

// Parse the Index summary table into selectable bands. A row reads
// ["Sailing catamaran, 12 to 16m", "8 to 10", "10,900-22,000", "5"].
function parseBands() {
  const rows = CHARTER_INDEX_2026?.summaryTable?.rows || [];
  const bands = [];
  for (const r of rows) {
    const [typeSize, guests, rate] = r.cells || [];
    if (!typeSize || !rate) continue;
    const m = String(rate).replace(/,/g, "").match(/(\d+)\s*-\s*(\d+)/);
    if (!m) continue;
    const [type, size] = typeSize.split(",").map((s) => s.trim());
    bands.push({
      key: typeSize,
      type,
      size: size || "",
      guests: guests || "",
      low: Number(m[1]),
      high: Number(m[2]),
    });
  }
  return bands;
}

const BANDS = parseBands();
const TYPES = [...new Set(BANDS.map((b) => b.type))];

function defaultApaFor(type) {
  const t = String(type).toLowerCase();
  if (t.includes("motor") || t.includes("superyacht")) return 0.35;
  return 0.25;
}

function formatEur(n) {
  if (!isFinite(n) || n < 0) return "EUR 0";
  return "EUR " + Math.round(n).toLocaleString("en-GB");
}

function rangeFormat(low, high) {
  return `${formatEur(low)} to ${formatEur(high)}`;
}

export default function CalculatorClient() {
  const initialBand = BANDS.find((b) => b.type === "Sailing catamaran" && b.size.startsWith("20")) || BANDS[0];
  const [type, setType] = useState(initialBand?.type || TYPES[0]);
  const [bandKey, setBandKey] = useState(initialBand?.key || BANDS[0]?.key);
  const [weeks, setWeeks] = useState(1);
  const [embarkPort, setEmbarkPort] = useState("athens");
  const [vat, setVat] = useState(0.12);
  const [apa, setApa] = useState(defaultApaFor(initialBand?.type));

  const bandsForType = BANDS.filter((b) => b.type === type);
  const band = BANDS.find((b) => b.key === bandKey) || bandsForType[0] || BANDS[0];

  function changeType(nextType) {
    setType(nextType);
    const first = BANDS.find((b) => b.type === nextType);
    if (first) setBandKey(first.key);
    setApa(defaultApaFor(nextType));
  }

  const result = useMemo(() => {
    if (!band) return null;
    const port = EMBARK_PORTS.find((p) => p.value === embarkPort) || EMBARK_PORTS[0];
    const calc = (weekly) => {
      const base = weekly * weeks;
      const vatAmt = base * vat;
      const apaAmt = base * apa;
      const delivery = port.deliveryDays > 0 ? (weekly / 7) * port.deliveryDays : 0;
      const tipLow = base * 0.1;
      const tipHigh = base * 0.15;
      const known = base + vatAmt + apaAmt + delivery;
      return { base, vatAmt, apaAmt, delivery, tipLow, tipHigh, totalLow: known + tipLow, totalHigh: known + tipHigh };
    };
    return { port, low: calc(band.low), high: calc(band.high) };
  }, [band, weeks, embarkPort, vat, apa]);

  const labelStyle = {
    display: "block",
    fontFamily: "var(--gy-font-ui)",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: CREAM,
    fontWeight: 600,
    marginBottom: 8,
  };
  const selectStyle = {
    width: "100%",
    fontFamily: "var(--gy-font-ui)",
    fontSize: 14,
    padding: "12px 14px",
    background: "rgba(13, 27, 42, 0.5)",
    border: "1px solid rgba(248, 245, 240, 0.2)",
    color: CREAM,
    boxSizing: "border-box",
  };
  const helpStyle = {
    fontFamily: "var(--gy-font-ui)",
    fontSize: 11,
    color: "rgba(248,245,240,0.6)",
    margin: "8px 0 0",
    lineHeight: 1.5,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 36, maxWidth: 1100, margin: "0 auto" }} className="gy-calc-grid">
      {/* INPUTS */}
      <section style={{ background: "rgba(248, 245, 240, 0.03)", border: "1px solid rgba(218, 161, 16, 0.25)", padding: "32px 28px" }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 18px" }}>
          Your charter
        </p>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle} htmlFor="calc-type">Yacht type</label>
          <select id="calc-type" value={type} onChange={(e) => changeType(e.target.value)} style={selectStyle}>
            {TYPES.map((t) => (
              <option key={t} value={t} style={{ background: NAVY }}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle} htmlFor="calc-band">Size, from the Index rate cards</label>
          <select id="calc-band" value={band?.key} onChange={(e) => setBandKey(e.target.value)} style={selectStyle}>
            {bandsForType.map((b) => (
              <option key={b.key} value={b.key} style={{ background: NAVY }}>
                {b.size} ({b.guests} guests): {formatEur(b.low)} to {formatEur(b.high)} a week
              </option>
            ))}
          </select>
          <p style={helpStyle}>
            Every band is the lowest and highest weekly net base fee on a rate card we hold, per yacht, before VAT and APA. From the{" "}
            <Link href="/greek-charter-index-2026" style={{ color: GOLD }}>Greek Charter Index</Link>, refreshed quarterly.
          </p>
        </div>

        <div style={{ marginBottom: 22 }}>
          <p style={labelStyle}>Duration</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeeks(w)}
                style={{
                  flex: 1,
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "12px",
                  background: weeks === w ? GOLD : "transparent",
                  color: weeks === w ? NAVY : CREAM,
                  border: `1px solid ${weeks === w ? GOLD : "rgba(248, 245, 240, 0.2)"}`,
                  cursor: "pointer",
                }}
              >
                {w} week{w > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle} htmlFor="calc-port">Embarkation port</label>
          <select id="calc-port" value={embarkPort} onChange={(e) => setEmbarkPort(e.target.value)} style={selectStyle}>
            {EMBARK_PORTS.map((p) => (
              <option key={p.value} value={p.value} style={{ background: NAVY }}>{p.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle} htmlFor="calc-vat">Greek VAT, the yacht&rsquo;s certified tier</label>
          <select id="calc-vat" value={vat} onChange={(e) => setVat(Number(e.target.value))} style={selectStyle}>
            {VAT_TIERS.map((t) => (
              <option key={t.value} value={t.value} style={{ background: NAVY }}>{t.label}</option>
            ))}
          </select>
          <p style={helpStyle}>
            A weekly crewed charter is invoiced at 5.2, 6.5, 7.8 or 12% depending on the yacht&rsquo;s certification; 13% is the statutory ceiling. Charters under 48 hours and bareboat pay 24%. Your written quote names the exact rate.
          </p>
        </div>

        <div>
          <label style={labelStyle} htmlFor="calc-apa">APA, the provisioning float</label>
          <select id="calc-apa" value={apa} onChange={(e) => setApa(Number(e.target.value))} style={selectStyle}>
            {APA_OPTIONS.map((p) => (
              <option key={p.value} value={p.value} style={{ background: NAVY }}>{p.label}</option>
            ))}
          </select>
          <p style={helpStyle}>
            Fuel, food, wine, berths and port fees, held by the captain against receipts and returned unspent after the charter.
          </p>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ background: "rgba(218, 161, 16, 0.04)", border: `1px solid ${GOLD}`, padding: "32px 28px" }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 6px" }}>
          What the week costs
        </p>
        {band && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.6)", margin: "0 0 18px", lineHeight: 1.5 }}>
            {band.type}, {band.size}, {band.guests} guests. Low and high end of the band, per yacht, for {weeks === 1 ? "one week" : "two weeks"}.
          </p>
        )}

        {result && (
          <>
            <BreakdownRow label="Base charter fee" value={rangeFormat(result.low.base, result.high.base)} highlight />
            <BreakdownRow label={`Greek VAT at ${(vat * 100).toFixed(1).replace(/\.0$/, "")}%`} value={rangeFormat(result.low.vatAmt, result.high.vatAmt)} note="On the base fee only. Never on APA or gratuity." />
            <BreakdownRow label={`APA at ${(apa * 100).toFixed(0)}%`} value={rangeFormat(result.low.apaAmt, result.high.apaAmt)} note="Paid before boarding, reconciled against receipts, unspent balance returned." />
            <BreakdownRow
              label="Delivery to your port"
              value={result.low.delivery > 0 ? rangeFormat(result.low.delivery, result.high.delivery) : "None from Athens"}
              note={result.low.delivery > 0 ? "Estimated at one seventh of the weekly fee per delivery day. Often negotiated, sometimes waived." : null}
            />
            <BreakdownRow label="Crew gratuity, 10 to 15% of the base" value={rangeFormat(result.low.tipLow, result.high.tipHigh)} note="Customary, not contractual, calculated on the base alone." />

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${GOLD}` }}>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 6px" }}>
                All-in, per yacht
              </p>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(26px, 3.6vw, 36px)", fontWeight: 300, color: CREAM, margin: 0, lineHeight: 1.1 }}>
                {rangeFormat(result.low.totalLow, result.high.totalHigh)}
              </p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "rgba(248,245,240,0.72)", margin: "10px 0 0", lineHeight: 1.5 }}>
                Cheapest yacht in the band with the lower gratuity, to the dearest with the higher. Greece&rsquo;s TEPAI cruising tax is billed separately by length and month.
              </p>
            </div>
          </>
        )}

        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, lineHeight: 1.6, color: "rgba(248,245,240,0.66)", margin: "24px 0 18px", padding: "12px 14px", background: "rgba(13, 27, 42, 0.35)", borderLeft: `2px solid ${GOLD}` }}>
          Estimates from real rate cards, not a market average. The exact yacht, her certified VAT rate and her availability for your dates come in a written quote.
        </p>

        <Link
          href="/#contact"
          style={{ display: "block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 22px", background: GOLD, color: NAVY, textDecoration: "none", textAlign: "center" }}
        >
          Ask George for the exact quote
        </Link>
      </section>

      <style jsx>{`
        @media (max-width: 800px) {
          :global(.gy-calc-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function BreakdownRow({ label, value, note, highlight }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: highlight ? CREAM : "rgba(248,245,240,0.85)", fontWeight: highlight ? 600 : 400, letterSpacing: "0.04em" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--gy-font-editorial)", fontSize: highlight ? 17 : 14, color: highlight ? GOLD : CREAM, fontWeight: 400, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
          {value}
        </span>
      </div>
      {note && (
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "rgba(248, 245, 240, 0.5)", margin: "4px 0 0", lineHeight: 1.5 }}>
          {note}
        </p>
      )}
    </div>
  );
}
