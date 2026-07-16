"use client";

// HotLeadConcierge — 2026-07-09 (George's hot-lead directive).
//
// When the tracker flags the visitor as a hot lead, we do NOT throw a
// modal in their face (the 2026-05 "Unlock Exclusive Pricing" popup was
// removed for exactly that reason: interrupting a UHNW mid-decision
// kills the mood). Instead: a quiet concierge card slides into the
// bottom-right corner, personalised to the yacht they are reading,
// dismissible with one tap, shown at most ONCE per session.
//
// Two honest paths, no fake urgency (iron rule: nothing invented):
//   1. WhatsApp George with a prefilled message about THIS yacht
//   2. Leave one field (email) and George reaches out personally
import { useEffect, useRef, useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const SEEN_KEY = "gy-concierge-shown";

function currentYachtName() {
  try {
    const m = window.location.pathname.match(/^\/yachts\/([^/]+)/);
    if (!m) return null;
    // The yacht page H1 carries the display name; fall back to the slug.
    const h1 = document.querySelector("h1");
    const text = (h1?.textContent || "").trim();
    if (text && text.length < 60) return text;
    return m[1].replace(/-/g, " ").toUpperCase();
  } catch {
    return null;
  }
}

export default function HotLeadConcierge({ signal }) {
  const [open, setOpen] = useState(false);
  const [yacht, setYacht] = useState(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!signal) return;
    if (shownRef.current) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {}
    shownRef.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setYacht(currentYachtName());
    // A breath after the signal, never mid-scroll jank.
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [signal]);

  if (!open) return null;

  const waMsg = yacht
    ? `Hi George, I am looking at ${yacht} on your site. Could you tell me about availability and the week it does best?`
    : "Hi George, I am browsing your fleet. Could you help me find the right yacht for my week?";
  const waHref = `https://api.whatsapp.com/send/?phone=17867988798&text=${encodeURIComponent(waMsg)}`;

  const submit = async (e) => {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Concierge card lead",
          email,
          message: `Visitor asked George to reach out${yacht ? ` while viewing ${yacht}` : ""}. (Hot-lead concierge card)`,
          source: "hot_lead_concierge",
          yachtName: yacht || undefined,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // never trap the visitor in an error state
    } finally {
      setSending(false);
    }
  };

  return (
    <aside
      aria-label="Concierge"
      style={{
        position: "fixed",
        right: 20,
        bottom: 84,
        zIndex: 70,
        width: "min(340px, calc(100vw - 40px))",
        background: NAVY,
        border: `1px solid rgba(201,168,76,0.45)`,
        boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        padding: "22px 22px 20px",
        animation: "gy-concierge-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          background: "transparent",
          border: "none",
          color: "rgba(248,245,240,0.5)",
          fontSize: 16,
          cursor: "pointer",
          padding: 6,
        }}
      >
        ×
      </button>

      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 10px",
        }}
      >
        A note from George
      </p>

      {sent ? (
        <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 16, fontStyle: "italic", color: "rgba(248,245,240,0.92)", margin: 0, lineHeight: 1.6 }}>
          Received. I will be in touch personally, usually within hours. Thank you for the trust.
        </p>
      ) : (
        <>
          <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 16, fontStyle: "italic", color: "rgba(248,245,240,0.92)", margin: "0 0 16px", lineHeight: 1.6 }}>
            {yacht
              ? `Questions about ${yacht}? I answer personally, usually within hours.`
              : "Planning a week on the water? I answer personally, usually within hours."}
          </p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="WhatsApp"
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: NAVY,
              background: GOLD,
              padding: "12px 16px",
              textDecoration: "none",
              marginBottom: 10,
            }}
          >
            WhatsApp George
          </a>

          <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
            <label style={{ display: "contents" }}>
              <span className="sr-only">Your email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Or your email, and George writes first"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 12,
                  color: "#F8F5F0",
                  background: "rgba(248,245,240,0.06)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  padding: "10px 12px",
                }}
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: GOLD,
                background: "transparent",
                border: `1px solid ${GOLD}`,
                padding: "10px 14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {sending ? "…" : "Send"}
            </button>
          </form>
        </>
      )}

      <style jsx global>{`
        @keyframes gy-concierge-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          aside[aria-label="Concierge"] { animation: none !important; }
        }
      `}</style>
    </aside>
  );
}
