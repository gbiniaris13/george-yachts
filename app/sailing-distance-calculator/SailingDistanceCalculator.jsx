"use client";

import { useMemo, useState } from "react";
import { PORTS, getDistance, YACHT_SPEEDS } from "@/lib/sailingDistances";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

function selectStyle() {
  return {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(248, 245, 240, 0.03)",
    border: "1px solid rgba(248, 245, 240, 0.15)",
    color: "#F8F5F0",
    fontFamily: "var(--gy-font-ui)",
    fontSize: 14,
    letterSpacing: "0.04em",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      "linear-gradient(45deg, transparent 50%, " +
      GOLD +
      " 50%), linear-gradient(135deg, " +
      GOLD +
      " 50%, transparent 50%)",
    backgroundPosition:
      "calc(100% - 18px) calc(50% + 1px), calc(100% - 12px) calc(50% + 1px)",
    backgroundSize: "6px 6px, 6px 6px",
    backgroundRepeat: "no-repeat",
  };
}

function inputLabel() {
  return {
    fontFamily: "var(--gy-font-ui)",
    fontSize: 9,
    letterSpacing: "0.42em",
    textTransform: "uppercase",
    color: GOLD,
    fontWeight: 600,
    marginBottom: 10,
    display: "block",
  };
}

function fmt(n) {
  if (n == null) return "-";
  return Math.round(n).toLocaleString("en-US");
}

function fmtHours(decimalHours) {
  if (decimalHours == null) return "-";
  const total = Math.round(decimalHours * 10) / 10;
  const h = Math.floor(total);
  const m = Math.round((total - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function SailingDistanceCalculator() {
  const [fromPort, setFromPort] = useState("alimos");
  const [toPort, setToPort] = useState("mykonos");
  const [yachtType, setYachtType] = useState("motor");

  // Group ports by region for the dropdowns.
  const portsByRegion = useMemo(() => {
    const groups = {};
    for (const p of PORTS) {
      if (!groups[p.region]) groups[p.region] = [];
      groups[p.region].push(p);
    }
    return groups;
  }, []);

  const distance = useMemo(
    () => getDistance(fromPort, toPort),
    [fromPort, toPort]
  );

  const yacht = YACHT_SPEEDS[yachtType];
  const timeHours = distance && yacht ? distance / yacht.speed : null;

  // Fuel rough estimate for motor yachts only (litres/hour ranges).
  // Conservative figures based on Boss's fleet observations.
  const fuelEstimate = useMemo(() => {
    if (!distance || !yacht) return null;
    if (yachtType === "motor") return { lph: 180, total: 180 * timeHours };
    if (yachtType === "power_cat") return { lph: 90, total: 90 * timeHours };
    if (yachtType === "super") return { lph: 250, total: 250 * timeHours };
    if (yachtType === "gulet") return { lph: 60, total: 60 * timeHours };
    if (yachtType === "catamaran") return { lph: 15, total: 15 * timeHours };
    if (yachtType === "sailing") return { lph: 10, total: 10 * timeHours };
    return null;
  }, [distance, yacht, yachtType, timeHours]);

  // EUR fuel cost rough: ~€1.95/L marine diesel in 2026 Greek ports.
  const fuelEur = fuelEstimate ? fuelEstimate.total * 1.95 : null;

  return (
    <div
      style={{
        background: "rgba(248, 245, 240, 0.02)",
        border: "1px solid rgba(201, 168, 76, 0.25)",
        padding: "40px 36px",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 28px",
          textAlign: "center",
        }}
      >
        Distance + passage time + fuel
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 28,
        }}
      >
        <div>
          <label style={inputLabel()}>From</label>
          <select
            value={fromPort}
            onChange={(e) => setFromPort(e.target.value)}
            style={selectStyle()}
          >
            {Object.entries(portsByRegion).map(([region, ports]) => (
              <optgroup label={region} key={region}>
                {ports.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label style={inputLabel()}>To</label>
          <select
            value={toPort}
            onChange={(e) => setToPort(e.target.value)}
            style={selectStyle()}
          >
            {Object.entries(portsByRegion).map(([region, ports]) => (
              <optgroup label={region} key={region}>
                {ports.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={inputLabel()}>Yacht type</label>
        <select
          value={yachtType}
          onChange={(e) => setYachtType(e.target.value)}
          style={selectStyle()}
        >
          {Object.entries(YACHT_SPEEDS).map(([key, y]) => (
            <option key={key} value={key}>
              {y.name} - {y.speed} kt cruise
            </option>
          ))}
        </select>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: "rgba(248, 245, 240, 0.55)",
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          {yacht.note}
        </p>
      </div>

      {/* Results */}
      <div
        style={{
          background: "rgba(13, 27, 42, 0.4)",
          border: "1px solid rgba(201, 168, 76, 0.25)",
          padding: "32px 28px",
        }}
      >
        {distance == null ? (
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontStyle: "italic",
              color: "rgba(248, 245, 240, 0.6)",
              margin: 0,
              textAlign: "center",
            }}
          >
            We don't have a logged distance for this pair. Try another route, or
            contact us for a captain-led custom estimate.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 24,
              textAlign: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-display)",
                  fontSize: 42,
                  fontWeight: 200,
                  color: "#F8F5F0",
                  margin: "0 0 6px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {fmt(distance)}
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Nautical miles
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--gy-font-display)",
                  fontSize: 42,
                  fontWeight: 200,
                  color: "#F8F5F0",
                  margin: "0 0 6px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {fmtHours(timeHours)}
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Passage time
              </p>
            </div>
            {fuelEstimate && (
              <div>
                <p
                  style={{
                    fontFamily: "var(--gy-font-display)",
                    fontSize: 42,
                    fontWeight: 200,
                    color: "#F8F5F0",
                    margin: "0 0 6px",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  €{fmt(fuelEur)}
                </p>
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Est. fuel cost
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 11,
          color: "rgba(248, 245, 240, 0.55)",
          margin: "20px 0 0",
          textAlign: "center",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        Estimates use sustained cruise speeds in moderate weather. Fuel-cost
        numbers assume €1.95/L marine diesel and use mid-range litres-per-hour
        for each yacht category. The captain delivers a route-specific quote at
        booking.
      </p>
    </div>
  );
}
