"use client";

// Phase 1 / G2 (Boss luxury rebuild brief, 2026-05-05) —
// First-visit subtle greeting.
//
// "Good evening from Athens — 21:14 local time."
//
// UHNW guests value the small touch — proves there's a real human
// (the broker, in Athens) at the other end, alive and aware. Not a
// catalog. Not a chatbot. Boutique presence.
//
// Cost & free-tier compliance:
//   • Vercel automatically attaches geo headers (`x-vercel-ip-city`,
//     `x-vercel-ip-country`) on every request — free, zero round-trip
//     to a 3rd-party IP API. We just expose them via /api/geo.
//   • Local time computed in-browser from the visitor's locale.
//   • Sessionstorage flag prevents re-showing within the same visit.
//
// UX:
//   • Mounts in layout, runs once after hydration.
//   • Waits 1.2s so it doesn't compete with the GoldCurtain reveal.
//   • Small flush-right pill, top-right of viewport.
//   • Auto-fades after 4 seconds (or on click).
//   • Skips entirely on /admin, /partner-portal, /privacy/delete, etc.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "gy_greeted_visit";
const SHOW_DELAY_MS = 1200;
const VISIBLE_MS = 4000;
const FADE_MS = 600;

// Routes where we don't want the greeting to peek out.
const SUPPRESSED_PREFIXES = [
  "/admin",
  "/partner-portal",
  "/privacy/delete",
  "/api/",
];

function timeOfDayLabel(date) {
  const h = date.getHours();
  if (h < 5)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

function formatLocalTime(date) {
  // 24h compact — UHNW often international, 24h reads cleaner.
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function VisitorGreeting() {
  const pathname = usePathname() || "/";
  const [city, setCity] = useState(null);
  const [phase, setPhase] = useState("hidden"); // hidden → visible → fading

  // Skip suppressed routes
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (suppressed) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    let cancelled = false;
    let visibleTimer;
    let fadeTimer;
    let mountTimer;

    // Resolve the city via the cheap /api/geo endpoint (Vercel header
    // passthrough). Fall back gracefully if the call fails — we'd
    // rather skip the greeting than show a generic one.
    fetch("/api/geo", { method: "GET", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const resolvedCity = data?.city && typeof data.city === "string" && data.city.trim();
        if (!resolvedCity) return; // no city → no greeting
        setCity(resolvedCity);

        mountTimer = setTimeout(() => {
          setPhase("visible");
          try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
          visibleTimer = setTimeout(() => {
            setPhase("fading");
            fadeTimer = setTimeout(() => setPhase("hidden"), FADE_MS);
          }, VISIBLE_MS);
        }, SHOW_DELAY_MS);
      })
      .catch(() => { /* silent failure — no greeting, no log spam */ });

    return () => {
      cancelled = true;
      clearTimeout(mountTimer);
      clearTimeout(visibleTimer);
      clearTimeout(fadeTimer);
    };
  }, [suppressed]);

  if (suppressed || phase === "hidden" || !city) return null;

  const now = new Date();
  const greeting = `${timeOfDayLabel(now)} from ${city}`;
  const localTime = `${formatLocalTime(now)} local`;

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={() => setPhase("hidden")}
      style={{
        position: "fixed",
        top: 84,
        right: 24,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
        padding: "12px 18px",
        background: "linear-gradient(135deg, rgba(13,13,26,0.9) 0%, rgba(0,0,0,0.9) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(218,165,32,0.28)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
        opacity: phase === "fading" ? 0 : 1,
        transform: phase === "fading"
          ? "translateY(-8px)"
          : "translateY(0)",
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        cursor: "pointer",
        maxWidth: "min(280px, calc(100vw - 48px))",
        animation: "gy-greet-slide-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: "auto",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "rgba(248,245,240,0.95)",
          fontWeight: 300,
          lineHeight: 1.2,
          textAlign: "right",
          letterSpacing: "0.005em",
        }}
      >
        {greeting}
      </span>
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#C9A84C",
          fontWeight: 600,
        }}
      >
        {localTime}
      </span>
      <style jsx global>{`
        @keyframes gy-greet-slide-in {
          0%   { opacity: 0; transform: translateY(-12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
