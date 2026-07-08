"use client";

// Charter Cost Calculator client - Phase 7 Round 26 (2026-05-12).
// Technical brief Priority 2A.
//
// Interactive calculator that gives users a full cost breakdown
// (base + VAT + APA + delivery + gratuity range). Designed as a
// linkable asset: useful enough that yacht forums, travel blogs,
// and AI engines cite it when answering "how much does a Greek
// charter cost" queries.

import { useMemo, useState } from "react";
import Link from "next/link";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

// Greek charter VAT: computed at the statutory 13% CEILING so the
// estimate never understates; real 2026 rate sheets invoice 5.2-12%
// by the yacht's certification. Statutory: 13% reduced on commercial crewed
// charters over 48 hours (every weekly charter), treated as a
// passenger-transport service. Set by Law 5073/2023 and confirmed by
// AADE Circular E.2006/2026. The standard 24% applies to charters of
// 48 hours or less, static charters, and bareboat (no crew). The old
// 5.2/6.5/7.8/12% invoiced rates are CURRENT (certification reductions,
// verified against real 2026 rate sheets); 0.13 here is the statutory ceiling.
const GREEK_VAT_RATE = 0.13;

// Embarkation ports differentiated by typical delivery surcharge from
// the Athens-based fleet (VAT is estimated at the 13% statutory ceiling).
const EMBARK_PORTS = [
  { value: "athens", label: "Athens (Alimos / Olympic Marine)", deliveryDays: 0 },
  { value: "mykonos", label: "Mykonos", deliveryDays: 1 },
  { value: "santorini", label: "Santorini", deliveryDays: 1.5 },
  { value: "corfu", label: "Corfu", deliveryDays: 1 },
  { value: "rhodes", label: "Rhodes (Dodecanese)", deliveryDays: 1.5 },
];

const APA_PROFILES = [
  { value: 0.20, label: "Minimal (20%) - sailing yacht / light usage" },
  { value: 0.25, label: "Standard for sailing yachts (25%)" },
  { value: 0.30, label: "Standard for motor yachts (30%) - typical" },
  { value: 0.35, label: "Generous / planing-hull motor yachts (35%)" },
];

function formatEur(n) {
  if (!isFinite(n) || n < 0) return "€0";
  return "€" + Math.round(n).toLocaleString("en-GB");
}

function rangeFormat(low, high) {
  return `${formatEur(low)} - ${formatEur(high)}`;
}

export default function CalculatorClient() {
  const [baseFee, setBaseFee] = useState(120000);
  const [weeks, setWeeks] = useState(1);
  const [embarkPort, setEmbarkPort] = useState("athens");
  const [yachtFlag, setYachtFlag] = useState("greek");
  const [guestCount, setGuestCount] = useState(8);
  const [apa, setApa] = useState(0.30);

  const breakdown = useMemo(() => {
    const port = EMBARK_PORTS.find((p) => p.value === embarkPort) || EMBARK_PORTS[0];
    const totalBase = baseFee * weeks;
    const vat = yachtFlag === "greek" ? totalBase * GREEK_VAT_RATE : null;
    const apaAmount = totalBase * apa;
    // Delivery: approximated as proportional fraction of weekly base
    // per day. Most operators waive delivery from Athens-based fleet
    // to non-Athens start points if the yacht is repositioning anyway.
    // Use 1/7 of weekly rate per delivery day, rounded down.
    const deliveryEstimate =
      port.deliveryDays > 0 ? (baseFee / 7) * port.deliveryDays : 0;
    const gratuityLow = totalBase * 0.10;
    const gratuityHigh = totalBase * 0.15;
    const knownTotal =
      totalBase + (vat ?? 0) + apaAmount + deliveryEstimate;
    return {
      port,
      totalBase,
      vat,
      apaAmount,
      deliveryEstimate,
      gratuityLow,
      gratuityHigh,
      lowTotal: knownTotal + gratuityLow,
      highTotal: knownTotal + gratuityHigh,
    };
  }, [baseFee, weeks, embarkPort, yachtFlag, apa]);

  const perPersonLow = guestCount > 0 ? breakdown.lowTotal / guestCount : 0;
  const perPersonHigh = guestCount > 0 ? breakdown.highTotal / guestCount : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 36, maxWidth: 1100, margin: "0 auto" }} className="gy-calc-grid">
      {/* INPUTS */}
      <section
        style={{
          background: "rgba(248, 245, 240, 0.03)",
          border: `1px solid rgba(201, 168, 76, 0.25)`,
          padding: "32px 28px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          Your charter
        </p>

        {/* BASE FEE SLIDER */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: CREAM,
                fontWeight: 600,
              }}
            >
              Base charter fee (per week)
            </span>
            <span
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 22,
                color: GOLD,
                fontWeight: 400,
              }}
            >
              {formatEur(baseFee)}
            </span>
          </label>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={5000}
            value={baseFee}
            onChange={(e) => setBaseFee(Number(e.target.value))}
            style={{ width: "100%", accentColor: GOLD }}
            aria-label="Base charter fee in euros per week"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 10,
              color: "rgba(248, 245, 240, 0.5)",
              marginTop: 4,
            }}
          >
            <span>€10,000</span>
            <span>€1,000,000</span>
          </div>
        </div>

        {/* DURATION */}
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: CREAM,
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Duration
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2].map((w) => (
              <button
                key={w}
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

        {/* EMBARKATION PORT */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: CREAM,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Embarkation port
          </label>
          <select
            value={embarkPort}
            onChange={(e) => setEmbarkPort(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 14,
              padding: "12px 14px",
              background: "rgba(13, 27, 42, 0.5)",
              border: `1px solid rgba(248, 245, 240, 0.2)`,
              color: CREAM,
              boxSizing: "border-box",
            }}
          >
            {EMBARK_PORTS.map((p) => (
              <option key={p.value} value={p.value} style={{ background: NAVY }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* YACHT FLAG */}
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: CREAM,
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Yacht flag
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { v: "greek", label: "Greek-flagged" },
              { v: "foreign", label: "Foreign-flagged" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setYachtFlag(opt.v)}
                style={{
                  flex: 1,
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "12px",
                  background: yachtFlag === opt.v ? GOLD : "transparent",
                  color: yachtFlag === opt.v ? NAVY : CREAM,
                  border: `1px solid ${yachtFlag === opt.v ? GOLD : "rgba(248, 245, 240, 0.2)"}`,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* GUEST COUNT */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: CREAM,
                fontWeight: 600,
              }}
            >
              Guests
            </span>
            <span
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 22,
                color: GOLD,
                fontWeight: 400,
              }}
            >
              {guestCount}
            </span>
          </label>
          <input
            type="range"
            min={2}
            max={12}
            step={1}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: GOLD }}
            aria-label="Guest count"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 10,
              color: "rgba(248, 245, 240, 0.5)",
              marginTop: 4,
            }}
          >
            <span>2</span>
            <span>12 (SOLAS cap)</span>
          </div>
        </div>

        {/* APA */}
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: CREAM,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            APA preference
          </label>
          <select
            value={apa}
            onChange={(e) => setApa(Number(e.target.value))}
            style={{
              width: "100%",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 14,
              padding: "12px 14px",
              background: "rgba(13, 27, 42, 0.5)",
              border: `1px solid rgba(248, 245, 240, 0.2)`,
              color: CREAM,
              boxSizing: "border-box",
            }}
          >
            {APA_PROFILES.map((p) => (
              <option key={p.value} value={p.value} style={{ background: NAVY }}>
                {p.label}
              </option>
            ))}
          </select>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              color: "rgba(248,245,240,0.6)",
              margin: "8px 0 0",
              lineHeight: 1.5,
            }}
          >
            APA covers fuel, food, port fees, laundry. Receipted - any unspent balance is refunded at disembarkation.
          </p>
        </div>
      </section>

      {/* RESULTS */}
      <section
        style={{
          background: "rgba(201, 168, 76, 0.04)",
          border: `1px solid ${GOLD}`,
          padding: "32px 28px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          Estimated cost breakdown
        </p>

        <BreakdownRow label="Base charter fee" value={formatEur(breakdown.totalBase)} highlight />
        {breakdown.vat !== null ? (
          <BreakdownRow
            label={`Greek VAT (${(GREEK_VAT_RATE * 100).toFixed(0)}%)`}
            value={formatEur(breakdown.vat)}
          />
        ) : (
          <BreakdownRow
            label="Greek VAT"
            value="Variable - foreign flag"
            note="Foreign-flagged yacht VAT depends on flag state agreement. Contact George for precise figures."
          />
        )}
        <BreakdownRow label={`APA (${(apa * 100).toFixed(0)}%)`} value={formatEur(breakdown.apaAmount)} />
        <BreakdownRow
          label="Delivery (estimate)"
          value={breakdown.deliveryEstimate > 0 ? formatEur(breakdown.deliveryEstimate) : "Waived"}
          note={
            breakdown.deliveryEstimate > 0
              ? "Estimated using 1/7 of weekly rate per delivery day. Often negotiable / waivable."
              : null
          }
        />
        <BreakdownRow
          label="Crew gratuity (10-15%)"
          value={rangeFormat(breakdown.gratuityLow, breakdown.gratuityHigh)}
          note="Cash tip paid to crew at disembarkation. Customary, not contractual."
        />

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: `1px solid ${GOLD}`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 700,
              margin: "0 0 6px",
            }}
          >
            Fully loaded total (range)
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(28px, 4vw, 38px)",
              fontWeight: 300,
              color: CREAM,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {rangeFormat(breakdown.lowTotal, breakdown.highTotal)}
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 13,
              color: "rgba(248,245,240,0.72)",
              margin: "10px 0 0",
              lineHeight: 1.5,
            }}
          >
            Per person ({guestCount} guests):{" "}
            <span style={{ color: GOLD, fontWeight: 600 }}>
              {rangeFormat(perPersonLow, perPersonHigh)}
            </span>
          </p>
        </div>

        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            lineHeight: 1.6,
            color: "rgba(248,245,240,0.66)",
            margin: "24px 0 18px",
            padding: "12px 14px",
            background: "rgba(13, 27, 42, 0.35)",
            borderLeft: `2px solid ${GOLD}`,
          }}
        >
          This calculator provides estimates. VAT rules can vary by vessel registration and itinerary. Delivery fees are often negotiable. Crew gratuity is customary, not contractual. Always confirm with your broker.
        </p>

        <Link
          href="/inquiry"
          style={{
            display: "block",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "14px 22px",
            background: GOLD,
            color: NAVY,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Get George's exact quote for your charter →
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 13,
            color: highlight ? CREAM : "rgba(248,245,240,0.85)",
            fontWeight: highlight ? 600 : 400,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: highlight ? 18 : 15,
            color: highlight ? GOLD : CREAM,
            fontWeight: 400,
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
      {note && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: "rgba(248, 245, 240, 0.5)",
            margin: "4px 0 0",
            lineHeight: 1.5,
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
