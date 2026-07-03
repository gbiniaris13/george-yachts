"use client";

// FirstAccessBand — the quiet replacement for the exit-intent modal
// on money pages (ASK B 5.1 + George's explicit requirement that
// email capture survives, 2026-07-02).
//
// Same offer, same /api/newsletter endpoint, same honeypot, same
// localStorage key as ExitIntentModal - so a capture here retires the
// modal everywhere, permanently. The difference is manners: this is
// an inline band low on the page that the visitor scrolls to, never
// an interruption laid over what they were reading.

import { useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";
const SUBSCRIBED_KEY = "gy_exit_intent_subscribed";

export default function FirstAccessBand() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const submit = async (e) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;
    if (website) return; // bot filled the honeypot
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("success");
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      aria-label="First access to the fleet"
      style={{
        background: "rgba(201,168,76,0.03)",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        padding: "64px 24px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
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
          First Access
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 300,
            color: CREAM,
            margin: "0 0 12px",
            lineHeight: 1.25,
          }}
        >
          Offers and openings, before they go public.
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 14,
            lineHeight: 1.65,
            color: "rgba(248,245,240,0.7)",
            margin: "0 0 26px",
          }}
        >
          Leave your email and George tells you first when the right yachts
          and best weeks open across the Greek charter network. No noise,
          only what matters for your charter.
        </p>
        {status === "success" ? (
          <p
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 16,
              fontStyle: "italic",
              color: GOLD,
              margin: 0,
            }}
          >
            Welcome aboard. George writes first when something worth your
            attention opens.
          </p>
        ) : (
          <form
            onSubmit={submit}
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Honeypot - humans never see it */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 14,
                padding: "13px 18px",
                minWidth: 260,
                background: "transparent",
                border: "1px solid rgba(248,245,240,0.3)",
                color: CREAM,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "13px 26px",
                background: "transparent",
                color: GOLD,
                border: `1px solid ${GOLD}`,
                cursor: status === "submitting" ? "wait" : "pointer",
              }}
            >
              {status === "submitting" ? "One moment" : "Keep me posted"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.6)", marginTop: 14 }}>
            Something went wrong. The footer form below works, or simply write
            to george@georgeyachts.com.
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: "rgba(248,245,240,0.45)",
            marginTop: 18,
          }}
        >
          Your email is read by George alone. One line to unsubscribe, any time.
        </p>
      </div>
    </section>
  );
}
