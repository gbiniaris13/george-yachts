"use client";

// FleetQuickFinder — 2026-07-08 (George's UI wave #3).
//
// Three questions, one button: guests, boat type, cabins. Navigates to
// the full fleet grid (/charter-yacht-greece) with its existing
// URL-param prefill (Phase 7 Round 13: ?type= &guests= &cabins=), so
// the visitor with intent lands on a grid already filtered to their
// week instead of scrolling 59 cards. Zero coupling to the grid
// internals - the params contract is the only interface.
import { useState } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#C9A84C";

const selectStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 13,
  letterSpacing: "0.06em",
  color: "#F8F5F0",
  background: "#0D1B2A",
  border: "1px solid rgba(201,168,76,0.35)",
  padding: "12px 14px",
  minWidth: 170,
  cursor: "pointer",
};

export default function FleetQuickFinder({ heading }) {
  const router = useRouter();
  const [guests, setGuests] = useState("");
  const [type, setType] = useState("");
  const [cabins, setCabins] = useState("");

  const go = () => {
    const sp = new URLSearchParams();
    if (type) sp.set("type", type);
    if (guests) sp.set("guests", guests);
    if (cabins) sp.set("cabins", cabins);
    const q = sp.toString();
    router.push(`/charter-yacht-greece${q ? `?${q}` : ""}#fleet-grid`);
  };

  return (
    <section aria-label="Find your yacht" style={{ padding: "0 24px" }}>
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "26px 24px",
          border: "1px solid rgba(201,168,76,0.25)",
          background: "rgba(201,168,76,0.04)",
          textAlign: "center",
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
            margin: "0 0 16px",
          }}
        >
          {heading || "Find your yacht in three answers"}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label style={{ display: "contents" }}>
            <span className="sr-only">Number of guests</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)} style={selectStyle}>
              <option value="">How many guests?</option>
              <option value="6">Up to 6 guests</option>
              <option value="8">Up to 8 guests</option>
              <option value="10">Up to 10 guests</option>
              <option value="12">Up to 12 guests</option>
            </select>
          </label>
          <label style={{ display: "contents" }}>
            <span className="sr-only">Type of yacht</span>
            <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
              <option value="">What kind of boat?</option>
              <option value="motor">Motor yacht</option>
              <option value="catamaran">Sailing catamaran</option>
              <option value="power-cat">Power catamaran</option>
              <option value="sailing">Sailing yacht</option>
            </select>
          </label>
          <label style={{ display: "contents" }}>
            <span className="sr-only">Number of cabins</span>
            <select value={cabins} onChange={(e) => setCabins(e.target.value)} style={selectStyle}>
              <option value="">How many cabins?</option>
              <option value="3">3 cabins</option>
              <option value="4">4 cabins</option>
              <option value="5">5 cabins</option>
              <option value="6">6 cabins</option>
            </select>
          </label>
          <button
            type="button"
            onClick={go}
            data-cursor="Show me"
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#0D1B2A",
              background: GOLD,
              border: `1px solid ${GOLD}`,
              padding: "12px 26px",
              cursor: "pointer",
            }}
          >
            Show my yachts
          </button>
        </div>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.05em",
            color: "rgba(248,245,240,0.6)",
            margin: "14px 0 0",
          }}
        >
          Answer any, all, or none. George reads every enquiry personally either way.
        </p>
      </div>
    </section>
  );
}
