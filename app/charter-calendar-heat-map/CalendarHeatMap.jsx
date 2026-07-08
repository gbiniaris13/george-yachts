"use client";

import { useState } from "react";
import {
  ISLANDS,
  MONTHS,
  SCORES,
  scoreLabel,
  scoreColor,
} from "@/lib/charterCalendarData";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export default function CalendarHeatMap() {
  const [active, setActive] = useState(null); // { islandSlug, monthSlug }

  const activeData =
    active && SCORES[active.islandSlug] && SCORES[active.islandSlug][active.monthSlug]
      ? {
          island: ISLANDS.find((i) => i.slug === active.islandSlug),
          month: MONTHS.find((m) => m.slug === active.monthSlug),
          ...SCORES[active.islandSlug][active.monthSlug],
        }
      : null;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <table
          style={{
            width: "100%",
            minWidth: 720,
            borderCollapse: "separate",
            borderSpacing: 4,
            fontFamily: "var(--gy-font-ui)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 600,
                  borderBottom: "1px solid rgba(248, 245, 240, 0.15)",
                }}
              >
                Destination
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m.slug}
                  style={{
                    textAlign: "center",
                    padding: "10px 6px",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(248, 245, 240, 0.15)",
                  }}
                >
                  {m.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ISLANDS.map((island) => (
              <tr key={island.slug}>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "#F8F5F0",
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 16,
                    borderBottom: "1px solid rgba(248, 245, 240, 0.05)",
                  }}
                >
                  {island.name}
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 10,
                      color: "rgba(248, 245, 240, 0.5)",
                      letterSpacing: "0.1em",
                      marginTop: 2,
                    }}
                  >
                    {island.region}
                  </span>
                </td>
                {MONTHS.map((m) => {
                  const entry = SCORES[island.slug] ? SCORES[island.slug][m.slug] : null;
                  if (!entry) {
                    return <td key={m.slug} />;
                  }
                  const isActive =
                    active && active.islandSlug === island.slug && active.monthSlug === m.slug;
                  return (
                    <td
                      key={m.slug}
                      onClick={() => setActive({ islandSlug: island.slug, monthSlug: m.slug })}
                      style={{
                        textAlign: "center",
                        padding: "14px 0",
                        background: scoreColor(entry.score),
                        color: entry.score >= 4 ? NAVY : "#F8F5F0",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 13,
                        outline: isActive ? `2px solid ${GOLD}` : "none",
                        outlineOffset: -2,
                        transition: "outline 0.2s ease",
                      }}
                      title={`${island.name} in ${m.label}: ${scoreLabel(entry.score)}`}
                    >
                      {entry.score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEGEND */}
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 28,
        }}
      >
        {[5, 4, 3, 2, 1].map((s) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              color: "rgba(248,245,240,0.78)",
              letterSpacing: "0.06em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                background: scoreColor(s),
                border: "1px solid rgba(248, 245, 240, 0.15)",
              }}
            />
            {s} - {scoreLabel(s)}
          </div>
        ))}
      </div>

      {/* ACTIVE CELL DETAIL */}
      {activeData ? (
        <div
          style={{
            border: "1px solid rgba(201, 168, 76, 0.3)",
            background: "rgba(201, 168, 76, 0.04)",
            padding: "26px 30px",
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
              margin: "0 0 14px",
            }}
          >
            {activeData.island.name} in {activeData.month.label} - {scoreLabel(activeData.score)}
          </p>
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 18,
              fontWeight: 300,
              lineHeight: 1.55,
              color: "#F8F5F0",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {activeData.note}
          </p>
        </div>
      ) : (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 13,
            color: "rgba(248,245,240,0.66)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Tap any cell for George's notes on that destination + month combination.
        </p>
      )}
    </div>
  );
}
