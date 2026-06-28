"use client";

// D.4 (Roberto brief, May 2026) — Express Inquiry Modal.
//
// Three-field inquiry form (name + email + dates) used everywhere:
//   • Yacht detail sticky "Request a proposal" CTA (D.2)
//   • Fleet-card inline inquiry (C.8)
//   • Favorites "Send my shortlist to George" (K.2)
//
// On submit POSTs to /api/inquiry — the endpoint fires Telegram +
// optional email + GA4 event. Modal stays open showing a success
// state for 2.5s, then closes.
//
// Channel preference (email | whatsapp | telegram | sms) lets the
// user signal where George should reply — important for international
// clients who don't all use WhatsApp.
//
// reCAPTCHA Enterprise is fetched lazily by the existing layout
// script. The token is captured at submit time; if the token isn't
// ready we block submit with a friendly message (O.1).

import { useEffect, useState } from "react";

const CHANNELS = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "sms", label: "SMS" },
];

export default function ExpressInquiryModal({
  open,
  onClose,
  yachtSlug,
  yachtName,
  shortlist,        // K.2: optional array of yachts
  source = "express_inquiry",
  title = "Request a personal proposal",
  subtitle,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("email");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll while open + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    try {
      // N.1 — yacht_inquiry_started fires once per modal open
      window.gtag?.("event", "yacht_inquiry_started", {});
    } catch {}
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim() || !email.trim()) {
      setError("Please add your name and email so George can reach you.");
      return;
    }
    setSubmitting(true);
    setError("");

    // O.1 (Roberto brief, May 2026) — wait for reCAPTCHA token
    // before submitting. The layout loads `recaptcha/enterprise.js`
    // lazily, so on a fast click we may not yet have
    // `window.grecaptcha`. Poll up to 4s; if still missing, block
    // submit with a friendly error rather than letting through an
    // un-verified payload.
    let recaptchaToken = "";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && typeof window !== "undefined") {
      // Poll grecaptcha availability
      const start = Date.now();
      while (!window.grecaptcha?.enterprise?.execute && Date.now() - start < 4000) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!window.grecaptcha?.enterprise?.execute) {
        setError("Please wait a moment - security check loading.");
        setSubmitting(false);
        return;
      }
      try {
        recaptchaToken = await window.grecaptcha.enterprise.execute(siteKey, {
          action: "express_inquiry",
        });
      } catch {}
      if (!recaptchaToken) {
        setError("Please wait a moment - security check loading.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          dates,
          message,
          yachtSlug,
          yachtName,
          shortlist: Array.isArray(shortlist) ? shortlist : undefined,
          source,
          preferredChannel: channel,
          recaptchaToken,
          website,
        }),
      });
      const ok = res.ok;
      if (!ok) {
        setError("Something went wrong. Please try again or message George on WhatsApp.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      // GA4 event — fires from client so it shows up in DebugView
      try {
        window.gtag?.("event", "yacht_inquiry_submitted", {
          source,
          yacht_slug: yachtSlug || undefined,
          channel,
        });
        // N.1 — favorites-specific aliases
        if (source === "favorites_auto_prompt") {
          window.gtag?.("event", "favorites_email_captured", { channel });
        } else if (source === "favorites_send_to_george" || source === "favorites_shortlist") {
          window.gtag?.("event", "favorites_sent_to_george", {
            channel,
            count: Array.isArray(window.__gyShortlistCount) ? undefined : undefined,
          });
        }
      } catch {}
      setTimeout(() => {
        setDone(false);
        setSubmitting(false);
        onClose?.();
        setName("");
        setEmail("");
        setDates("");
        setMessage("");
      }, 2500);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="express-inquiry-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        // 2026-05-08 — Boss spec: bump backdrop to rgba(13,27,42,0.95)
        // so the modal reads as the page paused, not a translucent
        // dim. Matches the ExitIntentModal treatment.
        background: "rgba(13, 27, 42, 0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#0D1B2A",
          border: "1px solid rgba(201,168,76,0.35)",
          width: "100%",
          maxWidth: "520px",
          padding: "40px 32px 32px",
          position: "relative",
          fontFamily: "var(--gy-font-ui)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => onClose?.()}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            background: "transparent",
            border: "none",
            color: "rgba(248, 245, 240,0.55)",
            fontSize: 22,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {!done ? (
          <>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                margin: "0 0 12px",
              }}
            >
              George Yachts
            </p>
            <h2
              id="express-inquiry-title"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "28px",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
            {(yachtName || subtitle) && (
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontStyle: "italic",
                  fontSize: "15px",
                  color: "rgba(248, 245, 240,0.7)",
                  margin: "0 0 24px",
                }}
              >
                {yachtName ? `For ${yachtName}` : subtitle}
              </p>
            )}

            <form onSubmit={onSubmit} noValidate>
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
              />

              <FormField
                label="Your name"
                value={name}
                onChange={setName}
                required
              />
              <FormField
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
              <FormField
                label="Approximate dates (optional)"
                placeholder="e.g. 5-12 July 2026"
                value={dates}
                onChange={setDates}
              />
              <FormField
                label="Anything else George should know? (optional)"
                value={message}
                onChange={setMessage}
                multiline
              />

              <div style={{ marginTop: 20 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "rgba(248, 245, 240,0.65)",
                    marginBottom: 10,
                  }}
                >
                  Where should George reply?
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CHANNELS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setChannel(c.id);
                        // N.1 — telegram_button_clicked fires when the
                        // user picks Telegram as their preferred channel
                        // (the site's only Telegram-as-CTA surface).
                        if (c.id === "telegram") {
                          try {
                            window.gtag?.("event", "telegram_button_clicked", {
                              click_location: "express_inquiry_channel",
                            });
                          } catch {}
                        }
                      }}
                      style={{
                        padding: "9px 14px",
                        fontSize: "10px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        border: `1px solid ${channel === c.id ? "#C9A84C" : "rgba(248, 245, 240,0.2)"}`,
                        background: channel === c.id ? "rgba(201,168,76,0.12)" : "transparent",
                        color: channel === c.id ? "#C9A84C" : "rgba(248, 245, 240,0.75)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#e57373",
                    fontSize: "12px",
                    marginTop: 14,
                    letterSpacing: "0.04em",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 24,
                  width: "100%",
                  padding: "16px",
                  background:
                    "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                  color: "#0D1B2A",
                  border: "1px solid rgba(201,168,76,0.6)",
                  fontSize: "11px",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  cursor: submitting ? "wait" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {submitting ? "Sending..." : "Send to George"}
              </button>

              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  color: "rgba(248, 245, 240,0.45)",
                  marginTop: 14,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                George will personally review and reply within 24 hours
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 20px",
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 26,
                color: "#F8F5F0",
                fontWeight: 300,
                margin: "0 0 10px",
              }}
            >
              Thank you.
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "rgba(248, 245, 240,0.7)",
                letterSpacing: "0.05em",
                lineHeight: 1.7,
              }}
            >
              George will personally review and reply within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, required, multiline, placeholder }) {
  // Phase 27 (Forbes-launch eve, 2026-05-05) — bumped from 14→16px so
  // iOS Safari doesn't auto-zoom on focus and push the modal off-screen.
  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(248, 245, 240,0.25)",
    color: "#F8F5F0",
    padding: "10px 0",
    fontSize: 16,
    fontFamily: "var(--gy-font-ui)",
    outline: "none",
    transition: "border-color 0.3s ease",
  };
  return (
    <label style={{ display: "block", marginTop: 18 }}>
      <span
        style={{
          display: "block",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(248, 245, 240,0.65)",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#C9A84C" }}> *</span>}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#C9A84C")}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(248, 245, 240,0.25)")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : "off"}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#C9A84C")}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(248, 245, 240,0.25)")}
        />
      )}
    </label>
  );
}
