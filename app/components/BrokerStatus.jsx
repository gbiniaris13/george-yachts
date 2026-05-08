"use client";

// Phase 9 (luxury rebuild, 2026-05-05) —
// Live broker presence indicator.
//
// UHNW guests value boutique presence over scale. This subtle chip
// surfaces at the top of the viewport and answers a question every
// visitor silently asks: "Is anyone actually there right now?"
//
// Logic:
//   • "On the desk in Athens" — Mon-Fri 09:30–19:30 Athens time
//     (Europe/Athens, GMT+2 / +3 in summer). Soft pulse animation.
//   • "On the water" — Mon-Sat 19:30–23:00 Athens time. Implies George
//     is dockside / aboard, replies are still fast.
//   • "Off the desk — replies within 12 hours" — every other slot.
//
// Boss policy (G3 rejected): no fake "Booked this week" feeds.
// This is real, deterministic, and never lies.
//
// Renders as a small fixed pill top-left, separate from VisitorGreeting
// (which lives top-right), so they coexist without overlap. Hidden on
// /admin and /partner-portal routes.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SUPPRESSED_PREFIXES = [
  "/admin",
  "/partner-portal",
  "/privacy/delete",
  "/api/",
];

function deriveStatus() {
  // We need Athens-local hour-of-day + day-of-week. Use the Intl API
  // so this works regardless of the visitor's timezone.
  const now = new Date();
  let athensHour;
  let athensDay; // 0 = Sunday, 6 = Saturday
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Athens",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const hourPart = parts.find((p) => p.type === "hour")?.value || "00";
    const minutePart = parts.find((p) => p.type === "minute")?.value || "00";
    athensHour = Number(hourPart) + Number(minutePart) / 60;
    const wkday = parts.find((p) => p.type === "weekday")?.value || "Mon";
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    athensDay = map[wkday] ?? 1;
  } catch {
    athensHour = now.getHours();
    athensDay = now.getDay();
  }

  // On the desk: Mon-Fri 09:30 - 19:30
  if (athensDay >= 1 && athensDay <= 5 && athensHour >= 9.5 && athensHour < 19.5) {
    return {
      key: "desk",
      label: "On the desk in Athens",
      tone: "live",
    };
  }

  // On the water: Mon-Sat 19:30 - 23:00
  if (athensDay >= 1 && athensDay <= 6 && athensHour >= 19.5 && athensHour < 23) {
    return {
      key: "water",
      label: "Dockside — replies within the hour",
      tone: "live",
    };
  }

  // Off the desk
  return {
    key: "off",
    label: "Off the desk — replies within 12 hours",
    tone: "rest",
  };
}

export default function BrokerStatus() {
  const pathname = usePathname() || "/";
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (suppressed) return;
    setStatus(deriveStatus());
    // Refresh every 5 minutes — Athens crosses a status boundary at most
    // four times a day; 5-min granularity is plenty.
    const t = setInterval(() => setStatus(deriveStatus()), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [suppressed]);

  if (suppressed || !status) return null;

  const live = status.tone === "live";

  return (
    <div
      role="status"
      aria-live="polite"
      className="gy-broker-status"
      style={{
        position: "fixed",
        // Boss bug fix (third pass, 2026-05-05): top-left was covering
        // the hamburger menu trigger inside NavDrawerSystem (which sits
        // at top: 0, left: ~16, height 72-140px). Move to BOTTOM-LEFT,
        // stacked above the AmbientPlayer pill (which lives at bottom:24).
        bottom: 76,
        left: 24,
        zIndex: 70,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px 6px 10px",
        background: "rgba(13, 27, 42, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${live ? "rgba(76, 175, 80, 0.42)" : "rgba(248,245,240,0.16)"}`,
        color: live ? "#9CA3AF" : "rgba(248,245,240,0.7)",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        animation: "gy-broker-status-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: live ? "#4CAF50" : "rgba(248,245,240,0.45)",
          boxShadow: live
            ? "0 0 0 0 rgba(76, 175, 80, 0.55)"
            : "none",
          animation: live ? "gy-broker-pulse 2.4s ease-out infinite" : "none",
          flexShrink: 0,
        }}
      />
      <span>{status.label}</span>
      <style jsx global>{`
        @keyframes gy-broker-pulse {
          0%   { box-shadow: 0 0 0 0    rgba(76, 175, 80, 0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);    }
          100% { box-shadow: 0 0 0 0    rgba(76, 175, 80, 0);    }
        }
        @keyframes gy-broker-status-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 700px) {
          /* Phase 27 (mobile audit) — hide entirely on mobile. The
             StickyFleetCTA full-width gold bar covers anything below
             ~76px on the bottom edge anyway, so the pill was sitting
             flush against / under it on every iPhone. The "On the
             desk in Athens" line is editorial decoration; on mobile
             the visitor's attention belongs on the WhatsApp / Brief
             George FAB stack, not on a status pill. */
          [role="status"][aria-live="polite"] { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="status"][aria-live="polite"] [aria-hidden="true"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
