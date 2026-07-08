"use client";

// DossierRequest — the premium email capture (ASK B 5.2 + George's
// requirement that capture channels survive the popup silencing).
//
// The guest leaves an email and receives the artefact instantly: the
// yacht's private dossier, built to be forwarded to the spouse, the
// PA, the family office. Capture goes to the same /api/newsletter
// endpoint (honeypot included) and sets the same localStorage key as
// the retired exit-intent modal, so one capture retires every popup.

import { useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";
const SUBSCRIBED_KEY = "gy_exit_intent_subscribed";

export default function DossierRequest({ slug, yachtName }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState("idle"); // idle | submitting | ready | error

  const submit = async (e) => {
    e.preventDefault();
    if (status === "submitting" || status === "ready") return;
    if (website) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      if (!res.ok) throw new Error("failed");
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {}
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      aria-label="Request the private dossier"
      style={{ background: NAVY, padding: "8px 24px 56px" }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          border: "1px solid rgba(201,168,76,0.3)",
          padding: "34px 32px",
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
            margin: "0 0 12px",
          }}
        >
          The Private Dossier
        </p>
        <p
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(19px, 2.4vw, 24px)",
            fontWeight: 300,
            color: CREAM,
            margin: "0 0 10px",
            lineHeight: 1.3,
          }}
        >
          {yachtName ? `${yachtName}, on one page made to be forwarded.` : "This yacht, on one page made to be forwarded."}
        </p>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 13.5,
            lineHeight: 1.65,
            color: "rgba(248,245,240,0.78)",
            margin: "0 0 22px",
          }}
        >
          The particulars, the real numbers with the math shown, and
          George&apos;s note. For the people who decide with you.
        </p>

        {status === "ready" ? (
          <div>
            <a
              href={`/yachts/${slug}/dossier`}
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-block",
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 28px",
                background: GOLD,
                color: NAVY,
                textDecoration: "none",
              }}
            >
              Open the Dossier →
            </a>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11.5, color: "rgba(248,245,240,0.6)", marginTop: 14 }}>
              Yours to print or save as PDF. George will also write to you
              personally.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
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
                minWidth: 250,
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
                padding: "13px 24px",
                background: GOLD,
                color: NAVY,
                border: "none",
                cursor: status === "submitting" ? "wait" : "pointer",
              }}
            >
              {status === "submitting" ? "One moment" : "Receive the dossier"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.66)", marginTop: 12 }}>
            Something went wrong. Write to george@georgeyachts.com and the
            dossier comes by reply.
          </p>
        )}
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "rgba(248,245,240,0.45)", marginTop: 16 }}>
          Your enquiry is read by George alone. He replies personally within 24 hours.
        </p>
      </div>
    </section>
  );
}
