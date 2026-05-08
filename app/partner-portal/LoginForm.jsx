"use client";
import { useState } from "react";

const GOLD = "#C9A84C";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/partner-portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {}
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 24px",
          border: "1px solid rgba(201,168,76,0.35)",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            color: "#F8F5F0",
            margin: "0 0 12px",
          }}
        >
          Check your inbox.
        </p>
        <p
          style={{
            fontFamily: "'Lato', 'Montserrat', sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.78)",
            margin: 0,
          }}
        >
          If your address is on the partner list, a magic-link is on its way. It expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        border: "1px solid rgba(201,168,76,0.25)",
        padding: "28px 28px 24px",
      }}
    >
      <input
        type="email"
        placeholder="Your registered email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "11px 13px",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#F8F5F0",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: "14px 0",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#0D1B2A",
          background: submitting
            ? `${GOLD}66`
            : `linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)`,
          border: "none",
          cursor: submitting ? "default" : "pointer",
        }}
      >
        {submitting ? "Sending…" : "Send magic-link →"}
      </button>
    </form>
  );
}
