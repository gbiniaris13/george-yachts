"use client";

// Phase 21 (luxury rebuild, 2026-05-05) — Forbes referrer welcome.
//
// When a visitor arrives via the Forbes article (referrer contains
// "forbes.com"), surface a brief, dignified welcome card that
// acknowledges where they came from and offers a direct path to
// brief George. This is the "we recognise you" moment for the
// audience that's already pre-qualified by Forbes.
//
// Behaviour:
//   • Detects document.referrer for forbes.com — also catches the
//     ?utm_source=forbes / ?ref=forbes link patterns Boss may use
//     when sharing the article on his own social.
//   • Shows ONCE per session.
//   • Slides in from the right after a short delay (so visitors
//     orient first), auto-dismisses after 18s if untouched.
//   • Cinzel typography, gold rule, restrained.
//
// No localStorage persistence — every Forbes-arrived session sees
// the welcome. Boss's audience comes from Forbes ONCE; that one time
// must feel personal.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SESSION_KEY = "gy_forbes_welcomed";
const DELAY_MS = 1800;
const VISIBLE_MS = 18000;
const FADE_MS = 600;

const SUPPRESSED = ["/admin", "/partner-portal", "/privacy/delete", "/api/", "/inquiry"];

function isForbesReferrer() {
  if (typeof window === "undefined") return false;
  try {
    const ref = document.referrer || "";
    if (/forbes\.com/i.test(ref)) return true;
    const url = new URL(window.location.href);
    const utm = url.searchParams.get("utm_source") || "";
    const refParam = url.searchParams.get("ref") || "";
    if (/forbes/i.test(utm) || /forbes/i.test(refParam)) return true;
  } catch {}
  return false;
}

export default function ForbesReferrerWelcome() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED.some((p) => pathname.startsWith(p));
  const [phase, setPhase] = useState("hidden");

  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}
    if (!isForbesReferrer()) return;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}

    const t1 = setTimeout(() => setPhase("visible"), DELAY_MS);
    const t2 = setTimeout(() => setPhase("fading"), DELAY_MS + VISIBLE_MS);
    const t3 = setTimeout(() => setPhase("hidden"), DELAY_MS + VISIBLE_MS + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [suppressed]);

  if (suppressed || phase === "hidden") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="gy-forbes-welcome"
      style={{
        position: "fixed",
        bottom: 24,
        right: 92, // sits left of the WhatsApp/ContactDrawer FAB stack
        zIndex: 65,
        maxWidth: "min(380px, calc(100vw - 48px))",
        background: "linear-gradient(135deg, rgba(13,27,42,0.96) 0%, rgba(13, 27, 42,0.96) 100%)",
        border: "1px solid rgba(201,168,76,0.42)",
        boxShadow: "0 24px 60px rgba(13, 27, 42,0.55), 0 0 0 1px rgba(201,168,76,0.10) inset",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "20px 22px 22px",
        opacity: phase === "fading" ? 0 : 1,
        transform: phase === "visible" ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
      }}
    >
      {/* Eyebrow line — Forbes wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          aria-label="Forbes"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.02em",
            color: "#F8F5F0",
          }}
        >
          Forbes
        </span>
        <span style={{ color: "rgba(201,168,76,0.7)" }}>·</span>
        <span
          style={{
            fontFamily: "var(--gy-font-display)",
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 500,
          }}
        >
          Welcome from the article
        </span>
      </div>

      {/* Headline — Boss-spec copy (2026-05-08): warmer, less salesy. */}
      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontStyle: "italic",
          fontSize: "clamp(20px, 2vw, 24px)",
          color: "rgba(248,245,240,0.92)",
          fontWeight: 300,
          margin: "0 0 12px",
          lineHeight: 1.35,
          letterSpacing: "0.005em",
        }}
      >
        Welcome from Forbes — you&apos;ve read the story.
      </p>

      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: 14,
          lineHeight: 1.65,
          color: "rgba(248,245,240,0.72)",
          fontWeight: 300,
          margin: "0 0 18px",
        }}
      >
        George is available for a direct conversation.
      </p>

      {/* Gold rule */}
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: 56,
          height: 1,
          background: "rgba(201,168,76,0.45)",
          marginBottom: 16,
        }}
      />

      {/* CTA */}
      <Link
        href="/inquiry?ref=forbes"
        onClick={() => setPhase("fading")}
        data-cursor="Brief"
        className="gy-shimmer-cta"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 24px",
          background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 100%)",
          border: "1px solid #C9A84C",
          color: "#0D1B2A",
          fontFamily: "var(--gy-font-display)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          textDecoration: "none",
          boxShadow: "0 8px 20px rgba(201,168,76,0.18)",
        }}
      >
        Brief George
        <span aria-hidden="true">→</span>
      </Link>

      {/* Dismiss × */}
      <button
        type="button"
        onClick={() => setPhase("fading")}
        aria-label="Dismiss welcome"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          background: "transparent",
          border: 0,
          color: "rgba(248,245,240,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
          <line x1="2" y1="2" x2="10" y2="10" />
          <line x1="10" y1="2" x2="2" y2="10" />
        </svg>
      </button>
      {/* Phase 27 (mobile audit) — at right:92 + maxWidth(380, 100vw-48)
          the card was clipping ~44px off the LEFT edge of a 390px
          iPhone (it overflowed the viewport because right:92 left
          insufficient room for a 380px-wide card). Drop it to a full-
          bleed bottom card on phones, sitting ABOVE the StickyFleetCTA
          so it never overlaps the gold bar. */}
      <style jsx>{`
        @media (max-width: 700px) {
          :global(.gy-forbes-welcome) {
            right: 16px !important;
            left: 16px !important;
            bottom: 96px !important;
            max-width: none !important;
            padding: 16px 18px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
