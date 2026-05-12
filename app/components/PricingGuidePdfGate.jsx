"use client";

// PricingGuidePdfGate - Phase 7 Round 25 (2026-05-12).
// Technical brief Priority 1D.
//
// Email-capture form rendered above the pricing tables on the
// pricing guide page. On submit:
//   - POST to /api/pricing-guide-pdf with firstName, email, timing
//   - Trigger PDF download via blob URL
//   - Show success state with re-download link
//   - Lead is captured server-side and forwarded to lead-gate flow
//     (Telegram + Gmail + CRM sync)

import { useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const TIMING_OPTIONS = [
  { value: "summer-2026", label: "Summer 2026" },
  { value: "autumn-2026", label: "Autumn 2026" },
  { value: "2027", label: "2027" },
  { value: "researching", label: "Just researching" },
];

export default function PricingGuidePdfGate() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [timing, setTiming] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !timing) {
      setErrorMsg("Please complete all fields.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/pricing-guide-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          timing,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "George-Yachts-2026-Greek-Charter-Pricing-Guide.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadUrl(url);
      setStatus("success");

      // GA4 tracking
      try {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "pricing_guide_pdf_downloaded", {
            timing,
          });
        }
      } catch {}
    } catch (err) {
      console.error("PDF download error:", err);
      setErrorMsg(err.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <section
      style={{
        background: "rgba(13, 27, 42, 0.04)",
        borderTop: `1px solid ${GOLD}`,
        borderBottom: `1px solid ${GOLD}`,
        padding: "56px 24px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            margin: "0 0 14px",
            textAlign: "center",
          }}
        >
          Free download
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(24px, 3.4vw, 32px)",
            fontWeight: 400,
            color: NAVY,
            margin: "0 0 12px",
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          The 2026 Greek Charter Pricing Guide (PDF)
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 15,
            lineHeight: 1.6,
            color: NAVY,
            opacity: 0.78,
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          5-page printable reference with the 4 cost buckets, yacht-type
          weekly rates, season multipliers, and international comparisons.
          No spam, no autoresponders. George reviews every download personally.
        </p>

        {status === "success" ? (
          <div
            style={{
              background: "rgba(201,168,76,0.08)",
              border: `1px solid ${GOLD}`,
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 18,
                color: NAVY,
                margin: "0 0 8px",
              }}
            >
              Download started.
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 13,
                color: NAVY,
                opacity: 0.7,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Check your downloads folder. If the file did not appear,{" "}
              <a
                href={downloadUrl}
                download="George-Yachts-2026-Greek-Charter-Pricing-Guide.pdf"
                style={{
                  color: GOLD,
                  textDecoration: "none",
                  borderBottom: `1px solid ${GOLD}`,
                }}
              >
                click here to re-download
              </a>
              . George will be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <label style={{ display: "block" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: NAVY,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  First name
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={80}
                  autoComplete="given-name"
                  style={{
                    width: "100%",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 15,
                    padding: "12px 14px",
                    background: CREAM,
                    border: `1px solid rgba(13, 27, 42, 0.2)`,
                    color: NAVY,
                    boxSizing: "border-box",
                  }}
                  placeholder="e.g. Maria"
                />
              </label>
              <label style={{ display: "block" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: NAVY,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 15,
                    padding: "12px 14px",
                    background: CREAM,
                    border: `1px solid rgba(13, 27, 42, 0.2)`,
                    color: NAVY,
                    boxSizing: "border-box",
                  }}
                  placeholder="your@email.com"
                />
              </label>
            </div>
            <label style={{ display: "block", marginBottom: 18 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: NAVY,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                When are you planning to charter?
              </span>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                required
                style={{
                  width: "100%",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 15,
                  padding: "12px 14px",
                  background: CREAM,
                  border: `1px solid rgba(13, 27, 42, 0.2)`,
                  color: NAVY,
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select timing</option>
                {TIMING_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {errorMsg && status === "error" && (
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 13,
                  color: "#c0392b",
                  margin: "0 0 14px",
                }}
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                width: "100%",
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "15px 22px",
                background: status === "submitting" ? "rgba(201,168,76,0.5)" : GOLD,
                color: NAVY,
                border: "none",
                cursor: status === "submitting" ? "default" : "pointer",
              }}
            >
              {status === "submitting"
                ? "Generating PDF…"
                : "Download the pricing guide PDF"}
            </button>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                color: NAVY,
                opacity: 0.55,
                margin: "12px 0 0",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Your details stay private. We never share or sell. Used only so
              George can answer your charter question if you have one.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
