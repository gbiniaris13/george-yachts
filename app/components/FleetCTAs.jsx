"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function FleetCTAs({ privateRange = { low: 13000, high: 180000 }, explorerRange = { low: 420, high: 1800 } }) {
  const { t } = useI18n();

  const fmtK = (n) => n >= 1000 ? `€${Math.round(n / 1000)}K` : `€${n.toLocaleString()}`;

  return (
    <section style={{ padding: "60px 24px", background: "#000" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Link href="/private-fleet" style={{
          display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px",
          border: "1px solid rgba(218,165,32,0.2)", borderRadius: 4, textDecoration: "none",
          background: "rgba(218,165,32,0.03)", transition: "all 0.5s ease",
        }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#fff", marginBottom: 8 }}>
            Private Fleet
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#DAA520", letterSpacing: "0.1em" }}>
            From {fmtK(privateRange.low)} to {fmtK(privateRange.high)}/week
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
            Full crew · Total discretion
          </span>
        </Link>
        <Link href="/explorer-fleet" style={{
          display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, textDecoration: "none",
          background: "rgba(255,255,255,0.02)", transition: "all 0.5s ease",
        }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#fff", marginBottom: 8 }}>
            Explorer Fleet
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#DAA520", letterSpacing: "0.1em" }}>
            From €{explorerRange.low.toLocaleString()} to €{explorerRange.high.toLocaleString()}/person
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
            More islands · More adventure
          </span>
        </Link>
      </div>
    </section>
  );
}
