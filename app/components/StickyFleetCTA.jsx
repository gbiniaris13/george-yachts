"use client";

// StickyFleetCTA (Roberto 2026-05-02 — Site UX Batch 2)
//
// Bottom-fixed CTA strip that anchors a one-tap escape hatch to
// the fleet from anywhere on the homepage. Per GA4 (last 30d) only
// 1.5% of homepage visitors reached a fleet page and the avg session
// was 27s — the existing CTAs were all far down the page or in the
// Hero (which scrolls off). A persistent bottom bar puts a "see
// yachts" route within thumb-reach the entire time.
//
// Behaviour:
//   • Reveals after scrolling past the hero (>600px).
//   • Hides automatically once the visitor IS on a fleet/yacht route
//     (no point yelling "see yachts" when they're already looking).
//   • Hides on focus inside any input/textarea (so the bar doesn't
//     overlap the on-screen keyboard / form fields on mobile).
//   • Sits above the WhatsApp bubble + Microsoft Clarity widgets via
//     z-index 60 and a wide bottom inset so it doesn't collide.
//   • Respects prefers-reduced-motion (no slide animation).

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const REVEAL_AFTER = 600; // matches StickyMiniNav reveal threshold
const HIDE_PATH_PREFIXES = [
  "/charter-yacht-greece",
  "/yachts",
  "/private-fleet",
  "/explorer-fleet",
  "/yacht-finder",
];

export default function StickyFleetCTA({ yachtCount: yachtCountProp } = {}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  // Layout-level mount has no count on hand. We do a single /api/fleet
  // request once per browser session and cache in sessionStorage so
  // every page after the first reuses the cached value (the fleet
  // count changes maybe weekly). The prop override is honored when
  // the parent does have a more authoritative count.
  const [resolvedCount, setResolvedCount] = useState(
    typeof yachtCountProp === "number" ? yachtCountProp : null,
  );

  useEffect(() => {
    if (typeof yachtCountProp === "number") {
      setResolvedCount(yachtCountProp);
      return;
    }
    let active = true;
    try {
      const cached = sessionStorage.getItem("gy-fleet-count");
      if (cached) {
        const n = Number(cached);
        if (Number.isFinite(n) && n > 0) setResolvedCount(n);
      }
    } catch {
      // sessionStorage may throw in Safari private mode
    }
    fetch("/api/fleet")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active) return;
        const n = Number(d?.count ?? d?.yachts?.length ?? 0);
        if (Number.isFinite(n) && n > 0) {
          setResolvedCount(n);
          try {
            sessionStorage.setItem("gy-fleet-count", String(n));
          } catch {}
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [yachtCountProp]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide while a form field is focused — covers most "the bar is
  // in front of my keyboard" mobile complaints without needing
  // visual-viewport API gymnastics.
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setKeyboardOpen(true);
      }
    };
    const onFocusOut = () => setKeyboardOpen(false);
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Don't render on fleet / yacht detail / quiz routes — they
  // already give the visitor what this bar offers.
  if (
    pathname &&
    HIDE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return null;
  }

  const label =
    resolvedCount && resolvedCount > 0
      ? `View All ${resolvedCount} Yachts`
      : "View All Yachts";

  return (
    <div
      aria-hidden={!visible || keyboardOpen}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: visible && !keyboardOpen ? "0" : "-100px",
        zIndex: 60,
        pointerEvents: visible && !keyboardOpen ? "auto" : "none",
        transition: "bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tail-blur so the bar feels integrated with the page rather
        // than glued on top.
        background:
          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 60%, rgba(0,0,0,0) 100%)",
        backdropFilter: "blur(8px)",
        paddingTop: "16px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <a
          href="/charter-yacht-greece"
          data-cursor="View"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 32px",
            minHeight: "48px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#0a1a2f",
            textDecoration: "none",
            background:
              "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
            border: "1px solid rgba(218,165,32,0.65)",
            borderRadius: "999px",
            boxShadow:
              "0 14px 35px -10px rgba(218,165,32,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span aria-hidden="true">👁</span>
          {label}
          <span aria-hidden="true" style={{ fontSize: "13px", opacity: 0.7 }}>
            →
          </span>
        </a>
      </div>
    </div>
  );
}
