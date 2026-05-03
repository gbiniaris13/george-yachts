"use client";

// D2 — Exit-intent modal.
//
// When a desktop visitor moves the cursor toward the top of the
// viewport (classic "about to close the tab" gesture) we surface a
// last-chance editorial offer: join The George Yachts Journal for
// a curated yacht + a Greek itinerary each month. Submits through
// the existing /api/newsletter endpoint, so every capture flows
// into the same Telegram + Gmail pipeline already in place.
//
// Mobile fallback: exit-intent gestures are unreliable on phones,
// so we use a time-based trigger (45s on page OR scroll past 70%
// of the document, whichever hits first).
//
// Guardrails:
//   - sessionStorage flag `gy_exit_intent_seen` → one show per visit
//   - localStorage flag `gy_exit_intent_subscribed` → never again if
//     they subscribed in a prior session
//   - Dismiss (×, Esc, backdrop click) all mark "seen"
//   - prefers-reduced-motion → no animation, modal just appears
//
// Mounts from layout.jsx. Runs everywhere; each page gets one shot
// per session to capture the email.

import { useEffect, useState, useRef } from "react";
import {
  canShow,
  markActive,
  markInactive,
  markCaptured,
} from "@/lib/popup-coordinator";

const SESSION_KEY = "gy_exit_intent_seen";
const SUBSCRIBED_KEY = "gy_exit_intent_subscribed";
// Roberto 2026-05-02 (popup orchestration):
//   • Desktop minimum dwell raised 45s → 60s so we don't pounce on
//     fresh visitors who haven't seen the fleet yet.
//   • Mobile time-based trigger DROPPED. Mobile gets one trigger
//     only: 80% scroll. Time-based on mobile was firing for visitors
//     who put the phone down briefly — a frustrated gesture, not
//     genuine exit intent.
//   • Coordinator gate prevents this modal from ever stacking on top
//     of HotLeadIGPopup or LeadCapturePopup.
const MOBILE_SCROLL_THRESHOLD = 0.8;
const DESKTOP_MIN_TIME_MS = 60_000;

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);
  const firedRef = useRef(false);

  // ── Arm the triggers once on mount ─────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already subscribed → never show
    try {
      if (window.localStorage.getItem(SUBSCRIBED_KEY)) return;
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    const mountedAt = Date.now();
    const trigger = () => {
      if (firedRef.current) return;
      // Honour the minimum dwell time — don't surprise someone who
      // bounces off the site in the first 60 s.
      if (Date.now() - mountedAt < DESKTOP_MIN_TIME_MS) return;
      // Coordinator gate: skip if another popup is open or we're
      // still inside the post-popup cooldown window.
      if (!canShow()) return;
      firedRef.current = true;
      markActive();
      setOpen(true);
    };

    // Desktop: cursor exits top of viewport, but only after 45s dwell.
    const onMouseOut = (e) => {
      if (e.clientY <= 2 && !e.relatedTarget) {
        trigger();
      }
    };

    // Mobile/tablet: fallbacks
    const isTouch =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    let scrollHandler = null;

    if (isTouch) {
      // Mobile gets one trigger only: scroll past 80%. Drop the
      // 2-minute timer — it was firing for visitors who briefly put
      // the phone down, which isn't real exit intent.
      scrollHandler = () => {
        const scrolled =
          (window.scrollY + window.innerHeight) /
          Math.max(document.documentElement.scrollHeight, 1);
        if (scrolled >= MOBILE_SCROLL_THRESHOLD) trigger();
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // Mark "seen" + focus input when opened
  useEffect(() => {
    if (!open) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open]);

  // Esc to close + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        markInactive();
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    markInactive();
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (status === "submitting") return;
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong.");
      }
      setStatus("success");
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        /* ignore */
      }
      // Mark coordinator captured so no further popups fire this session.
      markCaptured();
      // Auto-close after a beat so the success note has time to land
      setTimeout(() => {
        setOpen(false);
        markInactive();
      }, 2600);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Please try again in a moment.");
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gy-exit-title"
      className="fixed inset-0 z-[9997] flex items-center justify-center p-5"
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(6px)",
          animation: "gy-ei-backdrop 0.45s ease both",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[540px]"
        style={{
          background:
            "linear-gradient(145deg, #050505 0%, #0a0a0a 55%, #050505 100%)",
          border: "1px solid rgba(218,165,32,0.35)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(218,165,32,0.08)",
          animation: "gy-ei-modal 0.55s cubic-bezier(0.2,0.8,0.2,1) both",
        }}
      >
        {/* Gold corner accents */}
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#DAA520]/45 pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#DAA520]/45 pointer-events-none"
        />

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-white/40 hover:text-[#DAA520] transition-colors duration-300"
          style={{ background: "transparent", border: 0, cursor: "pointer" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <line x1="2" y1="2" x2="12" y2="12" />
            <line x1="12" y1="2" x2="2" y2="12" />
          </svg>
        </button>

        <div className="px-8 md:px-12 py-12 md:py-14">
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "#DAA520",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            Before you go
          </p>

          {/* Headline */}
          <h2
            id="gy-exit-title"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 200,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "0.005em",
              marginBottom: "14px",
            }}
          >
            One curated yacht{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              a month.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(15px, 1.3vw, 17px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 300,
              marginBottom: "28px",
            }}
          >
            The George Yachts Journal — one signature yacht, one Greek
            itinerary, and the quiet stories behind each sailing. No
            noise, no spam. Unsubscribe anytime.
          </p>

          {status === "success" ? (
            <div
              style={{
                padding: "18px 20px",
                border: "1px solid rgba(218,165,32,0.35)",
                background: "rgba(218,165,32,0.05)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 300,
                  color: "#DAA520",
                  marginBottom: "4px",
                }}
              >
                Welcome aboard.
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "15px",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 300,
                }}
              >
                Your first issue will arrive within the week.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={status === "submitting"}
                  className="flex-1 px-4 py-3 outline-none focus:border-[#DAA520]/70 transition-colors duration-300"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(218,165,32,0.25)",
                    color: "#fff",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "16px",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-6 py-3 transition-all duration-400 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A24D 0%, #A67C2E 100%)",
                    color: "#0a0a0a",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    border: 0,
                    cursor: "pointer",
                  }}
                >
                  {status === "submitting" ? "Sending…" : "Subscribe"}
                </button>
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                }}
              />

              {status === "error" && (
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "11px",
                    color: "#ff8a8a",
                    letterSpacing: "0.05em",
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  marginTop: "8px",
                }}
              >
                One email / month · Unsubscribe anytime
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes gy-ei-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gy-ei-modal {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="dialog"] [class*="gy-ei"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
