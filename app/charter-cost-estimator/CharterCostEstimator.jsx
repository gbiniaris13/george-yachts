"use client";

import { useMemo, useState } from "react";
import {
  YACHT_TYPES,
  SEASONS,
  LENGTH_BANDS,
  estimateCharterCost,
} from "@/lib/charterCostData";

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
      "linear-gradient(45deg, transparent 50%, " + GOLD +
      " 50%), linear-gradient(135deg, " + GOLD + " 50%, transparent 50%)",
    backgroundPosition:
      "calc(100% - 18px) calc(50% + 1px), calc(100% - 12px) calc(50% + 1px)",
    backgroundSize: "6px 6px, 6px 6px",
    backgroundRepeat: "no-repeat",
  };
}

function labelStyle() {
  return {
    fontFamily: "var(--gy-font-ui)",
    fontSize: 9,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: GOLD,
    fontWeight: 600,
    marginBottom: 8,
    display: "block",
  };
}

function fmtEUR(n) {
  return "€" + n.toLocaleString("en-GB");
}

export default function CharterCostEstimator() {
  const [yachtTypeSlug, setYachtTypeSlug] = useState("motor-yacht");
  const [lengthMetres, setLengthMetres] = useState(26);
  const [seasonSlug, setSeasonSlug] = useState("high");
  const [weeks, setWeeks] = useState(1);

  const result = useMemo(
    () => estimateCharterCost({ yachtTypeSlug, lengthMetres, seasonSlug, weeks }),
    [yachtTypeSlug, lengthMetres, seasonSlug, weeks],
  );

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* INPUTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 36,
        }}
      >
        <div>
          <label style={labelStyle()}>Yacht type</label>
          <select
            value={yachtTypeSlug}
            onChange={(e) => setYachtTypeSlug(e.target.value)}
            style={selectStyle()}
          >
            {YACHT_TYPES.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle()}>Length</label>
          <select
            value={lengthMetres}
            onChange={(e) => setLengthMetres(parseInt(e.target.value, 10))}
            style={selectStyle()}
          >
            {LENGTH_BANDS.map((b) => (
              <option key={b.metres} value={b.metres}>
                {b.label} (typ. {b.typicalGuests} guests)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle()}>Season</label>
          <select
            value={seasonSlug}
            onChange={(e) => setSeasonSlug(e.target.value)}
            style={selectStyle()}
          >
            {SEASONS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle()}>Duration (weeks)</label>
          <select
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value, 10))}
            style={selectStyle()}
          >
            <option value={1}>1 week (7 nights)</option>
            <option value={2}>2 weeks (14 nights)</option>
            <option value={3}>3 weeks (21 nights)</option>
          </select>
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div
          style={{
            border: "1px solid rgba(201, 168, 76, 0.3)",
            background: "rgba(201, 168, 76, 0.04)",
            padding: "32px 36px",
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
              margin: "0 0 18px",
            }}
          >
            Estimated all-in cost
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#F8F5F0",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            {fmtEUR(result.total)}
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 13,
              color: "rgba(248, 245, 240, 0.65)",
              margin: "0 0 28px",
            }}
          >
            ≈ {fmtEUR(result.perDayTotal)} per day · {result.weeks * 7} nights
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 18,
              borderTop: "1px solid rgba(248, 245, 240, 0.1)",
              paddingTop: 22,
            }}
          >
            <BreakdownRow label="Charter base" value={fmtEUR(result.base)} />
            <BreakdownRow label="APA (33%)" value={fmtEUR(result.apa)} note="Fuel, food, port fees" />
            <BreakdownRow label="VAT (12%)" value={fmtEUR(result.vat)} note="Greek-waters rate" />
            <BreakdownRow label="Gratuity (17.5%)" value={fmtEUR(result.gratuity)} note="Crew tip" />
          </div>
        </div>
      )}
    </div>
  );
}

function BreakdownRow({ label, value, note }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: 18,
          color: "#F8F5F0",
          margin: "0 0 4px",
        }}
      >
        {value}
      </p>
      {note && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: "rgba(248, 245, 240, 0.55)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
