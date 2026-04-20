"use client";

import { useState, useEffect } from "react";

// WhatsApp button with a first-visit auto-greeting bubble.
//
// After 10 seconds on site, a small speech bubble surfaces above
// the circular WhatsApp button with a warm invitation to say hi.
// The visitor can either click "Say hi" (which opens WhatsApp with
// a pre-filled message) or dismiss the bubble (× icon). In either
// case we set a sessionStorage flag so the bubble doesn't re-show
// during the same browser session — one greeting per visit, never
// annoying.
//
// No network calls, no tracking. Zero-cost UX upgrade that raises
// conversation-start rate with real visitors.

const WA_NUMBER = "17867988798";
const WA_DEFAULT_MSG =
  "Hello George, I'm interested in chartering a yacht in Greece.";
const WA_QUICK_MSG =
  "Hi George — exploring Greek charter options. Can I ask a few questions?";
const STORAGE_KEY = "gy_wa_greeted";
const GREETING_DELAY_MS = 10_000;

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [greetOpen, setGreetOpen] = useState(false);

  // Surface the greeting after a short delay on first visit only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const already = window.sessionStorage.getItem(STORAGE_KEY);
      if (already) return;
    } catch {
      /* private browsing — just continue without the guard */
    }
    const t = setTimeout(() => setGreetOpen(true), GREETING_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const markGreeted = () => {
    setGreetOpen(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const buildHref = (msg) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <>
      {/* Auto-greeting bubble — appears 10s into the visit, dismissable */}
      {greetOpen && (
        <div
          role="dialog"
          aria-label="A quick message from George"
          className="fixed z-[51] max-w-[300px] animate-gy-greet-in"
          style={{
            bottom: "168px",
            right: "24px",
          }}
        >
          <div
            className="relative p-5 pr-10"
            style={{
              background: "linear-gradient(135deg, #0d0d1a 0%, #000 100%)",
              border: "1px solid rgba(218,165,32,0.35)",
              boxShadow:
                "0 12px 48px rgba(0,0,0,0.5), 0 0 24px rgba(218,165,32,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "#DAA520",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              George Yachts
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "17px",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.88)",
                fontWeight: 300,
                marginBottom: "16px",
              }}
            >
              Hello <span style={{ color: "#DAA520" }}>&#128075;</span> —
              questions about a Greek charter? Ask us straight on WhatsApp,
              we reply within minutes.
            </p>

            <a
              href={buildHref(WA_QUICK_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={markGreeted}
              className="inline-flex items-center gap-2 hover:opacity-100 transition-opacity duration-300"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#DAA520",
                borderBottom: "1px solid rgba(218,165,32,0.55)",
                paddingBottom: "2px",
              }}
            >
              <span>Say hi on WhatsApp</span>
              <svg
                width="16"
                height="10"
                viewBox="0 0 22 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="0" y1="5" x2="20" y2="5" />
                <polyline points="15 1 21 5 15 9" />
              </svg>
            </a>

            {/* Dismiss × */}
            <button
              onClick={markGreeted}
              aria-label="Dismiss greeting"
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#DAA520] transition-colors duration-300"
              style={{ background: "transparent", border: 0, cursor: "pointer" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>

            {/* Pointer triangle toward the button */}
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                bottom: "-8px",
                right: "40px",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(218,165,32,0.35)",
              }}
            />
          </div>
        </div>
      )}

      <a
        href={buildHref(WA_DEFAULT_MSG)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={markGreeted}
        className="fixed z-50 group"
        style={{
          bottom: "88px",
          right: "24px",
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{
            background: hovered
              ? "radial-gradient(circle, rgba(218,165,32,0.15) 0%, transparent 70%)"
              : "transparent",
            transform: hovered ? "scale(1.8)" : "scale(1)",
          }}
        />

        {/* Main button */}
        <div
          className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 overflow-hidden"
          style={{
            background: hovered
              ? "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)"
              : "linear-gradient(135deg, #0d0d1a 0%, #000 100%)",
            border: `1px solid ${hovered ? "rgba(218,165,32,0.6)" : "rgba(218,165,32,0.2)"}`,
            boxShadow: hovered
              ? "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(218,165,32,0.1), inset 0 1px 0 rgba(218,165,32,0.1)"
              : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
            transform: hovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
          }}
        >
          {/* Gentle attention pulse when the greeting bubble is open */}
          {greetOpen && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 0 0 rgba(218,165,32,0.45)",
                animation: "gy-wa-pulse 2.4s ease-out infinite",
              }}
            />
          )}

          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(218,165,32,0.08) 50%, transparent 60%)",
              opacity: hovered ? 1 : 0,
              animation: hovered ? "whatsappShimmer 2s ease infinite" : "none",
            }}
          />

          {/* WhatsApp icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="relative z-10 transition-all duration-500"
            style={{
              fill: hovered ? "#DAA520" : "rgba(218,165,32,0.6)",
            }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        {/* Tooltip on hover */}
        <div
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-500 pointer-events-none"
          style={{
            opacity: hovered && !greetOpen ? 1 : 0,
            transform: hovered ? "translateX(0) translateY(-50%)" : "translateX(8px) translateY(-50%)",
          }}
        >
          <span
            className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase"
            style={{
              background: "rgba(13,13,26,0.95)",
              border: "1px solid rgba(218,165,32,0.15)",
              color: "rgba(218,165,32,0.7)",
              fontFamily: "'Montserrat', sans-serif",
              backdropFilter: "blur(8px)",
            }}
          >
            Message George
          </span>
        </div>

        <style jsx global>{`
          @keyframes whatsappShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes gy-wa-pulse {
            0%   { box-shadow: 0 0 0 0 rgba(218,165,32,0.45); }
            70%  { box-shadow: 0 0 0 18px rgba(218,165,32,0); }
            100% { box-shadow: 0 0 0 0 rgba(218,165,32,0); }
          }
          @keyframes gy-greet-in {
            0%   { opacity: 0; transform: translateY(12px) scale(0.96); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-gy-greet-in { animation: gy-greet-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
          @media (prefers-reduced-motion: reduce) {
            .animate-gy-greet-in { animation: none !important; }
          }
        `}</style>
      </a>
    </>
  );
}
