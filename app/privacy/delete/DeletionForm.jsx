"use client";

import { useState } from "react";

const GOLD = "#C9A84C";

export default function DeletionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    if (!name.trim() || !email.includes("@")) {
      setError("Please enter your name and the email whose data you'd like deleted.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/privacy-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), reason: reason.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Something went wrong. Please email george@georgeyachts.com directly.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please email george@georgeyachts.com directly.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "32px 24px", border: "1px solid rgba(201,168,76,0.35)" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: 28, fontWeight: 400, color: "#F8F5F0", margin: "0 0 12px",
          }}
        >
          Request received.
        </p>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 14, lineHeight: 1.6, color: "rgba(248, 245, 240,0.78)", margin: 0,
          }}
        >
          George will personally review and respond within 30 days, in line with GDPR Article 17. If your
          request is straightforward, expect a reply within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex", flexDirection: "column", gap: 12,
        border: "1px solid rgba(201,168,76,0.25)",
        padding: "28px 28px 24px",
      }}
    >
      <input
        type="text" placeholder="Your full name" required
        value={name} onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="email" placeholder="Email address whose data we hold" required
        value={email} onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Anything we should know? (optional — e.g., which channel you contacted us through)"
        value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
        style={{ ...inputStyle, fontFamily: "var(--gy-font-ui)", resize: "vertical" }}
      />
      {error && (
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "#ff8a8a", margin: 0 }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: "14px 0",
          fontFamily: "var(--gy-font-ui)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.24em", textTransform: "uppercase",
          color: "#0D1B2A",
          background: submitting
            ? `${GOLD}66`
            : `linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)`,
          border: "none",
          cursor: submitting ? "default" : "pointer",
        }}
      >
        {submitting ? "Sending…" : "Submit deletion request"}
      </button>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)", fontSize: 9,
          color: "rgba(248, 245, 240,0.45)", margin: "4px 0 0", lineHeight: 1.7,
          letterSpacing: "0.06em",
        }}
      >
        We may need to verify the request comes from you (a confirmation email or a quick call). Some records
        — signed charter agreements, financial transactions — carry a legal-hold obligation we&rsquo;ll
        explain in our reply.
      </p>
    </form>
  );
}

const inputStyle = {
  padding: "11px 13px",
  fontFamily: "var(--gy-font-ui)", fontSize: 13,
  background: "rgba(248, 245, 240,0.06)",
  border: "1px solid rgba(248, 245, 240,0.18)",
  color: "#F8F5F0", outline: "none",
};
