"use client";

// Email-capture modal (2026-06-28 retiming + copy rewrite).
//
//   Trigger (desktop only): fires on the FIRST of 8s dwell, 40% scroll, or
//     exit-intent (5s floor). Sweet spot per popup research; the old 3-minute
//     gate meant it almost never showed. Mobile stays off to avoid Google's
//     intrusive-interstitial mobile-SEO penalty.
//   Copy: value is first access to the fleet / offers and openings, not a
//     newsletter. No "subscribe", no urgency, no discounts. Email only.
//   Visual: backdrop rgba(13,27,42,0.95), gold corner accents, 1px gold top.
//   Gated once-per-session (sessionStorage gy_exit_intent_seen) + once-captured
//     (localStorage gy_exit_intent_subscribed); coordinated via popup-coordinator.

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { isMoneyPage } from "@/lib/moneyPages";
import {
  canShow,
  markActive,
  markInactive,
  markCaptured,
} from "@/lib/popup-coordinator";

const SESSION_KEY = "gy_exit_intent_seen";
const SUBSCRIBED_KEY = "gy_exit_intent_subscribed";
// 2026-06-28 retiming. The old 3-minute + exit-intent-only gate meant the
// modal almost never appeared. Research (Omnisend 1.24B popups, Popupsmart):
// the 6-10s delay is the conversion sweet spot and a 30-50% scroll trigger
// converts 15-20% better still. So it now fires on the FIRST of: 8s dwell,
// 40% scroll, or exit-intent (with a 5s floor so an instant bounce never pops).
// Desktop only - mobile stays off to avoid Google's intrusive-interstitial
// mobile-SEO penalty.
const DELAY_MS = 8_000;
const SCROLL_PCT = 0.4;
const EXIT_MIN_MS = 5_000;

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);
  const firedRef = useRef(false);
  const pathname = usePathname();
  // 2026-07-02 (ASK B 5.1, George-approved) — silenced on money pages.
  // The visitor evaluating a yacht is never interrupted; email capture
  // on those routes moves to the inline FirstAccessBand + footer.
  const suppressed = isMoneyPage(pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (suppressed) return;

    // Mobile / coarse pointers — modal disabled entirely (Boss spec).
    const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    if (isCoarse) return;

    // Already-captured / already-seen gates.
    try {
      if (window.localStorage.getItem(SUBSCRIBED_KEY)) return;
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    const mountedAt = Date.now();
    const trigger = () => {
      if (firedRef.current) return;
      if (!canShow()) return;
      firedRef.current = true;
      markActive();
      setOpen(true);
    };

    // 1) Time delay (research sweet spot).
    const timer = setTimeout(trigger, DELAY_MS);

    // 2) Scroll depth — engaged visitors convert best.
    const onScroll = () => {
      const sc = window.scrollY || document.documentElement.scrollTop || 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && sc / h >= SCROLL_PCT) trigger();
    };

    // 3) Exit intent — catch the leavers (after a 5s floor).
    const onMouseOut = (e) => {
      if (e.clientY <= 2 && !e.relatedTarget && Date.now() - mountedAt >= EXIT_MIN_MS) {
        trigger();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [suppressed]);

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

  // Esc + body scroll lock
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
      markCaptured();
      setTimeout(() => {
        setOpen(false);
        markInactive();
      }, 2600);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Please try again in a moment.");
    }
  };

  if (suppressed) return null;
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gy-exit-title"
      className="fixed inset-0 z-[9997] flex items-center justify-center p-5"
    >
      {/* Backdrop — Boss spec rgba(13,27,42,0.95). */}
      <div
        onClick={close}
        className="absolute inset-0"
        style={{
          background: "rgba(13, 27, 42, 0.95)",
          backdropFilter: "blur(4px)",
          animation: "gy-ei-backdrop 0.45s ease both",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[540px]"
        style={{
          background: "#0D1B2A",
          borderTop: "1px solid rgba(201,168,76,0.35)",
          boxShadow: "0 30px 80px rgba(13, 27, 42, 0.6)",
          animation: "gy-ei-modal 0.55s cubic-bezier(0.2,0.8,0.2,1) both",
        }}
      >
        {/* Gold corner accents */}
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C9A84C]/45 pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C9A84C]/45 pointer-events-none"
        />

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-white/40 hover:text-[#C9A84C] transition-colors duration-300"
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
          {/* Headline — Boss-spec exact copy */}
          <h2
            id="gy-exit-title"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 300,
              color: "#F8F5F0",
              lineHeight: 1.25,
              letterSpacing: "0.005em",
              marginBottom: "32px",
            }}
          >
            First access to the fleet.
            <br />
            <span
              style={{
                fontStyle: "italic",
                color: "#C9A84C",
              }}
            >
              Offers and openings, before they go public.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "15px",
              lineHeight: 1.65,
              fontWeight: 300,
              color: "rgba(248,245,240,0.72)",
              marginBottom: "28px",
            }}
          >
            Leave your email and George tells you first when the right yachts
            and best weeks open across the Greek charter network, and where the
            real value is. No noise, only what matters for your charter.
          </p>

          {status === "success" ? (
            <div
              style={{
                padding: "18px 20px",
                border: "1px solid rgba(201,168,76,0.35)",
                background: "rgba(201,168,76,0.05)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "18px",
                  fontWeight: 300,
                  color: "#C9A84C",
                  marginBottom: "4px",
                }}
              >
                You are on the list.
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: "15px",
                  lineHeight: 1.55,
                  color: "rgba(248,245,240,0.78)",
                  fontWeight: 300,
                }}
              >
                We will reach out the moment something worth your week comes up.
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
                  className="flex-1 px-4 py-3 outline-none focus:border-[#C9A84C]/70 transition-colors duration-300"
                  style={{
                    background: "rgba(13, 27, 42, 0.5)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    color: "#F8F5F0",
                    fontFamily: "var(--gy-font-editorial)",
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
                    background: "transparent",
                    color: "#C9A84C",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    border: "1px solid #C9A84C",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status === "submitting" ? "Sending…" : "Keep me posted"}
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
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: "11px",
                    color: "#ff8a8a",
                    letterSpacing: "0.05em",
                  }}
                >
                  {errorMsg}
                </p>
              )}
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
