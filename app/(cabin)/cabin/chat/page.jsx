// /cabin/chat — Private chat with George.
"use client";

import { useEffect, useRef, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

// Tighter polling for a more "live" feel. 3s costs roughly one
// 1KB GET every 3 seconds while the tab is visible — negligible.
const POLL_INTERVAL_MS = 3000;

// Soft two-tone chime generated on the fly via WebAudio. No asset
// to host, no autoplay-policy gotchas (always triggered by an
// arriving message after the user has interacted with the page).
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const make = (freq, start, dur) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      o.connect(g).connect(ctx.destination);
      o.start(now + start);
      o.stop(now + start + dur + 0.02);
    };
    make(880, 0, 0.14);
    make(1175, 0.14, 0.18);
    // Auto-close to free up the device's audio context.
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch { /* ignore — chime is decorative */ }
}

function fmtTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleString("en-GB", {
        day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
      });
}

export default function ChatPage() {
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [denied, setDenied] = useState(false);
  const listRef = useRef(null);
  const sinceRef = useRef(null);
  const mountedRef = useRef(true);

  async function pullInitial() {
    try {
      const r = await fetch("/api/cabin/chat/messages");
      if (!mountedRef.current) return;
      if (r.status === 403) { setDenied(true); return; }
      const j = await r.json();
      if (!mountedRef.current) return;
      const m = j.messages ?? [];
      setMessages(m);
      if (m.length) sinceRef.current = m[m.length - 1].created_at;
    } catch {
      if (mountedRef.current) setMessages([]);
    }
  }

  async function pullIncremental() {
    if (!sinceRef.current) return;
    try {
      const r = await fetch(`/api/cabin/chat/messages?since=${encodeURIComponent(sinceRef.current)}`);
      if (!mountedRef.current || !r.ok) return;
      const j = await r.json();
      if (!mountedRef.current) return;
      const newMsgs = j.messages ?? [];
      if (newMsgs.length) {
        setMessages((prev) => [...(prev ?? []), ...newMsgs]);
        sinceRef.current = newMsgs[newMsgs.length - 1].created_at;

        // Ping for any incoming message that isn't the user's own.
        // The admin (George) sending us a note is the case that
        // actually matters here — the charterer never sees their
        // own message arrive via polling because it was already
        // in state when send() succeeded.
        const fromAdmin = newMsgs.some((m) => m.sender_role === "admin");
        if (fromAdmin) {
          playChime();
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted" &&
            document.visibilityState !== "visible"
          ) {
            try {
              const last = newMsgs[newMsgs.length - 1];
              new Notification("New message from George", {
                body: (last.body || "").slice(0, 140),
                tag: "cabin-chat",
              });
            } catch { /* notification spec varies by browser */ }
          }
        }
      }
    } catch { /* ignore */ }
  }

  // Ask once for browser-notification permission. Only nudges
  // when the user is actively reading the chat — we don't want
  // a permission popup the second the cabin loads.
  function enableNotifications() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") return;
    Notification.requestPermission().catch(() => {});
  }

  useEffect(() => {
    mountedRef.current = true;
    void pullInitial();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void pullIncremental();
    }, POLL_INTERVAL_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages?.length]);

  async function send(e) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    // Hitchhike on the explicit user gesture (send button click)
    // to request browser-notification permission. Browsers reject
    // requestPermission() calls outside a real gesture, so doing
    // it on page mount would silently fail.
    enableNotifications();
    setSending(true);
    // Optimistic
    const localId = "local-" + Date.now();
    const optimistic = {
      id: localId, body, sender_role: "charterer",
      sender_email: "you", created_at: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...(prev ?? []), optimistic]);
    setDraft("");
    try {
      const r = await fetch("/api/cabin/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const j = await r.json();
      if (r.ok && j.message) {
        setMessages((prev) =>
          (prev ?? []).map((m) => (m.id === localId ? j.message : m))
        );
        sinceRef.current = j.message.created_at;
      } else {
        // Mark optimistic as failed
        setMessages((prev) =>
          (prev ?? []).map((m) => (m.id === localId ? { ...m, failed: true } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        (prev ?? []).map((m) => (m.id === localId ? { ...m, failed: true } : m))
      );
    } finally {
      setSending(false);
    }
  }

  if (denied) {
    return (
      <article>
        <SectionTitle kicker="Private channel" title="A private chat" italic="with George." />
        <IntroParagraph>
          The chat is between the principal charterer and George. Guests do not
          see this conversation — by design. If you have a question for George,
          please ask the principal charterer to pass it on, or write directly
          to george@georgeyachts.com.
        </IntroParagraph>
      </article>
    );
  }

  return (
    <article>
      <SectionTitle
        kicker="A private channel"
        title="Chat with"
        italic="George."
      />
      <IntroParagraph>
        Anything you need, anything you want to share — text it here. I read
        every message personally. During your voyage, replies will usually be
        within the hour.
      </IntroParagraph>

      {/* WhatsApp escape hatch. If a guest wants an even-more-live
          channel — especially mid-voyage when seconds matter —
          this opens a chat with George on WhatsApp pre-filled with
          context so he knows which cabin it concerns. The wa.me
          format works on iPhone + Android natively. No bridge fee
          because the conversation lives entirely in WhatsApp. */}
      <a
        className="chat-whatsapp"
        href={`https://wa.me/17867988798?text=${encodeURIComponent(
          "Hello George, it's me from The Cabin. ",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="chat-whatsapp__icon" aria-hidden>✆</span>
        <span className="chat-whatsapp__text">
          <strong>Need George right now?</strong>
          <em>Open in WhatsApp · instant, on his phone</em>
        </span>
        <span className="chat-whatsapp__arrow" aria-hidden>→</span>
      </a>

      <div className="chat-card">
        <ul ref={listRef} className="chat-list" role="log" aria-live="polite">
          {messages === null && (
            <li className="chat-skel" aria-hidden>Loading…</li>
          )}
          {messages?.length === 0 && (
            <li className="chat-empty">
              <em>No messages yet. Start the conversation below.</em>
            </li>
          )}
          {messages?.map((m, i) => {
            const isMe = m.sender_role === "charterer";
            const prev = messages[i - 1];
            const groupWithPrev = prev && prev.sender_role === m.sender_role &&
              (new Date(m.created_at) - new Date(prev.created_at)) < 5 * 60 * 1000;
            return (
              <li
                key={m.id || i}
                className={
                  "chat-msg " +
                  (isMe ? "chat-msg--me" : "chat-msg--them") +
                  (groupWithPrev ? " is-grouped" : "")
                }
              >
                {!groupWithPrev && (
                  <span className="chat-msg__who">
                    {isMe ? "You" : "George"}
                    <em>· {fmtTime(m.created_at)}</em>
                  </span>
                )}
                <span className={"chat-msg__bubble" + (m.pending ? " is-pending" : "") + (m.failed ? " is-failed" : "")}>
                  {m.body}
                </span>
              </li>
            );
          })}
        </ul>

        <form className="chat-compose" onSubmit={send}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e);
            }}
            placeholder="A short note, a question, a request…"
            rows={2}
            maxLength={8000}
          />
          <button type="submit" disabled={sending || !draft.trim()}>
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      <style>{`
        .chat-whatsapp {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 18px 0 0;
          padding: 14px 18px;
          background: #25D366;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid #1ea951;
          transition: background 160ms ease, transform 160ms ease;
          font-family: var(--gy-font-editorial);
        }
        .chat-whatsapp:hover,
        .chat-whatsapp:focus-visible {
          background: #1ea951;
          outline: none;
        }
        .chat-whatsapp:active {
          transform: translateY(1px);
        }
        .chat-whatsapp__icon {
          font-size: 22px;
          line-height: 1;
          width: 28px;
          text-align: center;
          color: rgba(255,255,255,0.95);
        }
        .chat-whatsapp__text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          flex: 1;
          min-width: 0;
        }
        .chat-whatsapp__text strong {
          font-weight: 400;
          font-size: 15px;
          color: #ffffff;
          letter-spacing: -0.1px;
        }
        .chat-whatsapp__text em {
          font-style: italic;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          margin-top: 2px;
        }
        .chat-whatsapp__arrow {
          font-size: 18px;
          color: rgba(255,255,255,0.9);
        }

        .chat-card {
          margin-top: 18px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          display: flex;
          flex-direction: column;
          min-height: 60dvh;
        }
        .chat-list {
          flex: 1;
          list-style: none;
          padding: 18px 18px 8px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
          scroll-behavior: smooth;
          min-height: 320px;
        }
        .chat-skel, .chat-empty {
          color: rgba(13,27,42,0.4);
          font-family: var(--gy-font-editorial);
          font-style: italic;
          text-align: center;
          padding: 32px 8px;
        }
        .chat-msg {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        .chat-msg.is-grouped { margin-top: 2px; }
        .chat-msg--me { align-items: flex-end; }
        .chat-msg--them { align-items: flex-start; }
        .chat-msg__who {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.45);
          margin-bottom: 4px;
        }
        .chat-msg__who em {
          font-style: italic;
          font-family: var(--gy-font-editorial);
          color: rgba(13,27,42,0.35);
          letter-spacing: 0;
          margin-left: 4px;
        }
        .chat-msg__bubble {
          max-width: 78%;
          padding: 10px 14px;
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .chat-msg--me .chat-msg__bubble {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-navy);
        }
        .chat-msg--them .chat-msg__bubble {
          background: rgba(201,168,76,0.08);
          color: var(--gy-navy);
          border: 1px solid rgba(201,168,76,0.35);
        }
        .chat-msg__bubble.is-pending { opacity: 0.6; }
        .chat-msg__bubble.is-failed {
          border-color: #b14a3a;
          color: #b14a3a;
          background: rgba(177,74,58,0.06);
        }

        .chat-compose {
          display: flex;
          gap: 10px;
          padding: 12px;
          border-top: 1px solid rgba(13,27,42,0.08);
          background: rgba(13,27,42,0.02);
        }
        .chat-compose textarea {
          flex: 1;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.12);
          padding: 10px 12px;
          font-family: var(--gy-font-body);
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--gy-navy);
          outline: none;
          resize: none;
          min-height: 44px;
          max-height: 200px;
        }
        .chat-compose textarea:focus { border-color: var(--gy-gold); }
        .chat-compose button {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 0 18px;
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          align-self: stretch;
        }
        .chat-compose button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </article>
  );
}
