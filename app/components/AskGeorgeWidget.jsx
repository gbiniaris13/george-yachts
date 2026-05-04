"use client";

// H.1 (Roberto brief, May 2026) — "Ask George" AI Concierge widget.
//
// Floating button at bottom-right, sits ABOVE the existing WhatsApp
// button (vertically stacked). Click toggles a 380px-wide chat panel.
// Streams Gemini responses via /api/ask-george using the SSE shape
// (data: {delta:"..."} per chunk, terminates with {done:true}).
//
// After 3 user messages, the panel surfaces a "Save this for George
// to follow up" CTA — clicking it opens a name + email mini-form
// that posts to the same endpoint with { saveForFollowUp: true } so
// the existing Telegram bot fires immediately.

import { useEffect, useRef, useState } from "react";

const QUICK_REPLIES = [
  "Recommend a yacht for a family of 8",
  "How much does a Cyclades charter cost?",
  "When should I go — August or September?",
];

function gtagEvent(name, payload) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, payload || {});
    }
  } catch {}
}

export default function AskGeorgeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', content:string}
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followName, setFollowName] = useState("");
  const [followEmail, setFollowEmail] = useState("");
  const [followSent, setFollowSent] = useState(false);
  const scrollRef = useRef(null);

  const userMsgCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || sending) return;
    const next = [...messages, { role: "user", content: trimmed }, { role: "assistant", content: "" }];
    setMessages(next);
    setInput("");
    setSending(true);
    gtagEvent("ai_concierge_message_sent", { length: trimmed.length });

    try {
      const res = await fetch("/api/ask-george", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(0, -1) }),
      });
      if (!res.ok || !res.body) throw new Error("upstream-failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (!payload) continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed?.delta) {
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  last.content = (last.content || "") + parsed.delta;
                }
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          last.content =
            "I had trouble reaching the model. Please write to George at /inquiry — he'll respond personally, usually within the day.";
        }
        return copy;
      });
    } finally {
      setSending(false);
    }
  }

  async function submitFollowUp(e) {
    e.preventDefault();
    if (!followName.trim() || !followEmail.trim()) return;
    try {
      await fetch("/api/ask-george", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saveForFollowUp: true,
          name: followName.trim(),
          email: followEmail.trim(),
          messages,
          path: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      gtagEvent("ai_concierge_email_captured", {});
      setFollowSent(true);
    } catch {
      setFollowSent(true);
    }
  }

  return (
    <>
      {/* Floating button — bottom-right, sits above the existing WhatsApp btn */}
      <button
        type="button"
        aria-label={open ? "Close Ask George" : "Open Ask George AI concierge"}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) gtagEvent("ai_concierge_opened", {});
        }}
        style={{
          position: "fixed",
          right: 24,
          bottom: 96, // sits above the WhatsApp button (which is at ~24)
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
          color: "#0a1a2f",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.04em",
          zIndex: 9998,
        }}
      >
        {open ? "✕" : "G"}
        {!open && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid #C9A24D",
              animation: "askGeorgePulse 2s ease-in-out infinite",
            }}
          />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Ask George AI concierge"
          style={{
            position: "fixed",
            right: 24,
            bottom: 160,
            width: "min(380px, calc(100vw - 48px))",
            maxHeight: "min(640px, calc(100vh - 200px))",
            background: "#0a0a0a",
            border: "1px solid rgba(218,165,32,0.4)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          <header
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(218,165,32,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Ask George
              </p>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#DAA520",
                  margin: "2px 0 0",
                  fontWeight: 600,
                }}
              >
                AI Concierge · Beta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                padding: 4,
              }}
            >
              ✕
            </button>
          </header>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minHeight: 240,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                <p style={{ margin: "0 0 14px" }}>
                  Hi — I&apos;m an AI concierge trained on the George Yachts fleet, regions, and itineraries. Ask me anything about chartering in Greek waters, and I&apos;ll point you toward yachts that actually fit.
                </p>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    margin: "0 0 8px",
                  }}
                >
                  Try one of these
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      style={{
                        textAlign: "left",
                        padding: "9px 12px",
                        background: "rgba(218,165,32,0.08)",
                        color: "rgba(255,255,255,0.85)",
                        border: "1px solid rgba(218,165,32,0.3)",
                        cursor: "pointer",
                        fontFamily: "'Lato', 'Montserrat', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.4,
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "10px 13px",
                  background:
                    m.role === "user" ? "rgba(218,165,32,0.16)" : "rgba(255,255,255,0.05)",
                  border:
                    m.role === "user"
                      ? "1px solid rgba(218,165,32,0.4)"
                      : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.88)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content || (m.role === "assistant" ? "…" : "")}
              </div>
            ))}
          </div>

          {/* Save-for-follow-up surfaces after 3 user messages */}
          {userMsgCount >= 3 && !followUp && !followSent && (
            <div
              style={{
                padding: "10px 18px",
                borderTop: "1px solid rgba(218,165,32,0.25)",
                background: "rgba(218,165,32,0.06)",
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 12.5,
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span>Want George to follow up personally?</span>
              <button
                type="button"
                onClick={() => setFollowUp(true)}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "6px 10px",
                  background: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                  color: "#0a1a2f",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          )}
          {followUp && !followSent && (
            <form
              onSubmit={submitFollowUp}
              style={{
                padding: "12px 18px",
                borderTop: "1px solid rgba(218,165,32,0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={followName}
                onChange={(e) => setFollowName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Your email"
                value={followEmail}
                onChange={(e) => setFollowEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "9px 12px",
                  background: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                  color: "#0a1a2f",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Send to George
              </button>
            </form>
          )}
          {followSent && (
            <p
              style={{
                margin: 0,
                padding: "12px 18px",
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 12.5,
                color: "rgba(255,255,255,0.85)",
                textAlign: "center",
                background: "rgba(218,165,32,0.08)",
                borderTop: "1px solid rgba(218,165,32,0.25)",
              }}
            >
              Saved. George will reach out within 24 hours.
            </p>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              padding: 12,
              borderTop: "1px solid rgba(218,165,32,0.25)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about chartering Greece…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              aria-label="Your message"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "10px 12px",
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 13.5,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "0 16px",
                background:
                  sending || !input.trim()
                    ? "rgba(218,165,32,0.3)"
                    : "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                color: "#0a1a2f",
                border: "none",
                cursor: sending || !input.trim() ? "default" : "pointer",
              }}
            >
              {sending ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  padding: "9px 12px",
  fontFamily: "'Lato', 'Montserrat', sans-serif",
  fontSize: 13,
  outline: "none",
};
