"use client";

// The short brief on /instagram. One screen, built for a phone held in one
// hand inside Instagram's own browser: six fields and a send button.
//
// Same rules as every other request form on the site:
//   - name, email and phone are required (lib/requiredContact, George,
//     2026-11-02), and the visitor is told so before typing;
//   - a send that reached no one is never thanked (form sweep, 2026-11-05):
//     the visitor keeps what they typed and gets the two direct lines.
// It posts to /api/lead-gate with source "instagram", so where the brief
// came from is known without asking.

import { useState } from "react";
import {
  REQUIRED_NOTE,
  SEND_FAILED_MESSAGE,
  WHATSAPP_URL,
  PHONE_PATTERN,
  firstContactError,
  phoneValidityHandlers,
} from "@/lib/requiredContact";

const GOLD = "#DAA110";

const BUDGETS = [
  { value: "", label: "Rough budget for the week (optional)" },
  { value: "under-30k", label: "Under €30,000" },
  { value: "30-60k", label: "€30,000 to €60,000" },
  { value: "60-120k", label: "€60,000 to €120,000" },
  { value: "120k-plus", label: "€120,000 and above" },
  { value: "discuss", label: "I would rather discuss it" },
];

const label = {
  display: "block",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: GOLD,
  margin: "0 0 8px",
};
const input = {
  width: "100%",
  padding: "14px 16px",
  background: "#0D1B2A",
  border: "1px solid rgba(218, 161, 16,0.25)",
  borderRadius: 0,
  color: "#F8F5F0",
  fontFamily: "var(--gy-font-ui)",
  // 16px stops iOS from zooming the page when a field is tapped.
  fontSize: 16,
  outline: "none",
};
const cta = {
  display: "block",
  width: "100%",
  padding: "17px 24px",
  background: "linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)",
  color: "#0D1B2A",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
};

export default function InstagramEnquiry() {
  const [f, setF] = useState({ name: "", email: "", phone: "", dates: "", guests: "", budget: "", notes: "", website: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setError("");
  };

  const send = async (e) => {
    e.preventDefault();
    const bad = firstContactError(f);
    if (bad) {
      setError(bad.message);
      return;
    }
    setSending(true);
    setError("");
    // What the visitor arrived with (which post or story sent them), so a
    // brief can be traced to its source. Never anything typed by them.
    let utm = {};
    try {
      const sp = new URLSearchParams(window.location.search);
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
        const v = sp.get(k);
        if (v) utm[k] = v.slice(0, 80);
      }
    } catch {}
    try {
      const res = await fetch("/api/lead-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "instagram",
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          website: f.website,
          meta: {
            dates: f.dates.trim() || null,
            guests: f.guests.trim() || null,
            budget: f.budget || null,
            notes: f.notes.trim() || null,
            found: "Instagram",
            source_page: "/instagram",
            ...utm,
          },
        }),
      });
      if (!res.ok) {
        setError(SEND_FAILED_MESSAGE);
        return;
      }
      setDone(true);
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        try {
          window.gtag("event", "inquiry_submit", { source: "instagram", party_size: f.guests || null, budget_band: f.budget || null });
        } catch {}
      }
    } catch {
      setError(SEND_FAILED_MESSAGE);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div role="status" style={{ border: "1px solid rgba(218, 161, 16,0.3)", padding: "36px 26px", textAlign: "center" }}>
        <p style={{ ...label, margin: "0 0 14px" }}>Received</p>
        <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 28, fontWeight: 300, lineHeight: 1.25, color: "#F8F5F0", margin: "0 0 14px" }}>
          Thank you, {f.name.trim().split(/\s+/)[0]}.
        </p>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.7, color: "rgba(248,245,240,0.75)", margin: 0 }}>
          Your brief is with me. I will come back to you personally within 24 hours, with real yachts and what each costs for the week.
        </p>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "rgba(248,245,240,0.55)", margin: "18px 0 0" }}>George P. Biniaris</p>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.6)", margin: 0, lineHeight: 1.5 }}>{REQUIRED_NOTE}</p>

      <div>
        <label htmlFor="ig-name" style={label}>Your name</label>
        <input id="ig-name" name="name" type="text" autoComplete="name" required value={f.name} onChange={set("name")} placeholder="First and last name" style={input} />
      </div>
      <div>
        <label htmlFor="ig-email" style={label}>Email</label>
        <input id="ig-email" name="email" type="email" inputMode="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="you@example.com" style={input} />
      </div>
      <div>
        <label htmlFor="ig-phone" style={label}>Phone or WhatsApp</label>
        <input id="ig-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern={PHONE_PATTERN} value={f.phone} onChange={set("phone")} placeholder="+1 ..." style={input} {...phoneValidityHandlers()} />
      </div>
      <div>
        <label htmlFor="ig-dates" style={label}>Which week</label>
        <input id="ig-dates" name="dates" type="text" value={f.dates} onChange={set("dates")} placeholder="For example: second week of July, flexible" style={input} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 12 }}>
        <div>
          <label htmlFor="ig-guests" style={label}>Guests</label>
          <input id="ig-guests" name="guests" type="number" inputMode="numeric" min={1} max={40} value={f.guests} onChange={set("guests")} placeholder="8" style={input} />
        </div>
        <div>
          <label htmlFor="ig-budget" style={label}>Budget</label>
          <select id="ig-budget" name="budget" value={f.budget} onChange={set("budget")} style={{ ...input, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="ig-notes" style={label}>Anything I should know</label>
        <textarea id="ig-notes" name="notes" rows={3} value={f.notes} onChange={set("notes")} placeholder="Optional: children on board, an occasion, islands you have in mind" style={{ ...input, resize: "vertical" }} />
      </div>

      {/* Honeypot: people never see it, scripts fill it. */}
      <input type="text" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      {error && (
        <p role="alert" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.6, color: "#F0C756", margin: 0 }}>
          {error}{" "}
          {error === SEND_FAILED_MESSAGE && (
            <a href={WHATSAPP_URL} style={{ color: "#F0C756", textDecoration: "underline" }}>Open WhatsApp</a>
          )}
        </p>
      )}

      <button type="submit" disabled={sending} style={{ ...cta, opacity: sending ? 0.7 : 1 }}>
        {sending ? "Sending…" : "Send it to George"}
      </button>
      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, lineHeight: 1.6, color: "rgba(248,245,240,0.5)", margin: 0, textAlign: "center" }}>
        I read every brief myself and reply within 24 hours.
      </p>
    </form>
  );
}
