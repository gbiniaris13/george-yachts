// N.3 — Tiny client-side KPI dashboard at /admin/kpis. Hits the
// JSON endpoint at /api/admin/kpis using the key the visitor pastes
// in (so the URL itself never exposes the key in browser history).
// Renders 7-day totals + a sparkline-style bar list per event.
// Looker Studio remains the canonical place for the Monday review;
// this page is a fast at-a-glance check.

"use client";

import { useState } from "react";

const GOLD = "#C9A84C";

const LABELS = {
  inquiry: "Inquiries",
  proposal_generated: "Smart Proposals (PDF)",
  itinerary_saved: "Itineraries saved",
  privacy_deletion: "GDPR deletion requests",
  ask_george_message: "Ask George messages",
  ask_george_followup: "Ask George follow-up emails",
  newsletter_signup: "Newsletter signups",
};

export default function KpisPage() {
  const [key, setKey] = useState("");
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(e) {
    if (e) e.preventDefault();
    if (!key.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/kpis?days=${days}`, {
        headers: { Authorization: `Bearer ${key.trim()}` },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json?.error || `HTTP ${res.status}`);
        setData(null);
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: "#0D1B2A", color: "#F8F5F0", minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 12px" }}>
          Internal · George Yachts
        </p>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 300, margin: "0 0 8px" }}>
          Conversion-funnel KPIs
        </h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248,245,240,0.72)", margin: "0 0 32px", maxWidth: 640 }}>
          Last {days} days, sourced from our own KV counters. Looker Studio (linked to GA4) remains the canonical
          place for the full Monday review. Paste the KPI admin key to unlock this view - it&rsquo;s never stored.
        </p>

        <form onSubmit={load} style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          <input
            type="password"
            placeholder="KPI admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={inputStyle}
          />
          <select value={days} onChange={(e) => setDays(parseInt(e.target.value, 10))} style={{ ...inputStyle, paddingRight: 14 }}>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <button
            type="submit"
            disabled={!key.trim() || loading}
            style={{
              padding: "10px 18px",
              fontFamily: "var(--gy-font-ui)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#0D1B2A",
              background: loading ? `${GOLD}66` : `linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)`,
              border: "none", cursor: loading || !key.trim() ? "default" : "pointer",
            }}
          >
            {loading ? "Loading…" : "Load KPIs"}
          </button>
        </form>

        {error && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "#ff8a8a" }}>
            {error}
          </p>
        )}

        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {Object.entries(data.totals || {}).map(([event, total]) => {
              const series = data.series?.[event] || [];
              const max = Math.max(1, ...series.map((d) => d.value || 0));
              return (
                <div
                  key={event}
                  style={{
                    border: "1px solid rgba(201,168,76,0.2)",
                    background: "rgba(201,168,76,0.025)",
                    padding: "20px 22px",
                  }}
                >
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 6px" }}>
                    {LABELS[event] || event}
                  </p>
                  <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 36, fontWeight: 400, color: "#F8F5F0", margin: "0 0 14px", lineHeight: 1 }}>
                    {total}
                  </p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
                    {series.map((d, i) => {
                      const h = Math.max(2, Math.round(((d.value || 0) / max) * 40));
                      return (
                        <div
                          key={i}
                          title={`${d.date}: ${d.value}`}
                          style={{
                            flex: 1,
                            height: h,
                            background: GOLD,
                            opacity: 0.4 + 0.6 * ((d.value || 0) / max),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "10px 12px",
  fontFamily: "var(--gy-font-ui)", fontSize: 13,
  background: "rgba(248, 245, 240,0.06)",
  border: "1px solid rgba(248, 245, 240,0.18)",
  color: "#F8F5F0", outline: "none",
  flex: "1 1 220px",
  minWidth: 180,
};
