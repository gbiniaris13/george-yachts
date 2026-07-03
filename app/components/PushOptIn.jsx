"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { VAPID_PUBLIC_KEY } from "@/lib/push/vapidPublicKey";

// PushOptIn — a deliberately RESTRAINED web-push invitation.
//
// Brand-first design (Forbes/Vogue tier): no aggressive auto-popup,
// no instant browser permission nag. It surfaces a single quiet,
// dismissible card — and ONLY:
//   • on high-intent surfaces (yacht detail + fleet pages),
//   • after the visitor has spent ~35s and scrolled (genuine interest),
//   • when the browser supports push and permission isn't already
//     decided, and the visitor isn't already subscribed,
//   • when no other popup is active (respects the gy_popup_active flag),
//   • at most once per 45 days (localStorage dismiss/done locks).
// The actual browser permission prompt only fires on an explicit click
// of "Notify me" — never automatically. Worst case it simply never
// shows; nothing about the page breaks.
//
// The value: a free, owned channel for the most time-sensitive thing in
// charter — last-minute availability — straight to the device, no email.

// 2026-07-02 (ASK B 5.1, George-approved) — yacht DETAIL pages left
// the list: a guest reading a specific yacht's dossier is never
// prompted for anything. The quiet card stays on the fleet LISTING
// pages (browsing context, engagement-gated, once per 45 days),
// because George's standing rule is that capture channels survive.
// The crewed head page joined as a listing surface (built 2026-07-02).
const HIGH_INTENT = (path) =>
  path === "/private-fleet" ||
  path === "/explorer-fleet" ||
  path === "/charter-yacht-greece" ||
  path === "/crewed-yacht-charter-greece";

const DONE_KEY = "gy_push_done";          // subscribed or permission decided
const DISMISS_KEY = "gy_push_dismissed_at";
const DISMISS_LOCK_MS = 45 * 24 * 60 * 60 * 1000; // 45 days
const DELAY_MS = 35_000;
const GOLD = "#C9A84C";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export default function PushOptIn() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // null | "ok" | "error"

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!HIGH_INTENT(pathname)) return;

    // Capability + state gates.
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    if (!supported) return;
    if (Notification.permission !== "default") return; // granted or denied → leave them alone

    try {
      if (window.localStorage.getItem(DONE_KEY)) return;
      const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_LOCK_MS) return;
    } catch {
      /* private mode — continue */
    }

    let scrolled = false;
    const onScroll = () => {
      scrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const t = setTimeout(async () => {
      // Don't compete with another popup (capture modal, exit intent…).
      try {
        if (window.sessionStorage.getItem("gy_popup_active")) return;
      } catch {
        /* ignore */
      }
      if (!scrolled) return; // require a sign of real engagement
      // Don't re-prompt someone who already has a subscription.
      try {
        const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
        if (reg) {
          const existing = await reg.pushManager.getSubscription();
          if (existing) return;
        }
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, DELAY_MS);

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const enable = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const reg = await navigator.serviceWorker.register("/push-sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        try {
          window.localStorage.setItem(DONE_KEY, "1");
        } catch {}
        setBusy(false);
        setOpen(false);
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), page: pathname }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      try {
        window.localStorage.setItem(DONE_KEY, "1");
      } catch {}
      setStatus("ok");
      setBusy(false);
      setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      console.error("[PushOptIn] enable failed:", err);
      setStatus("error");
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Availability alerts"
      className="fixed z-[49] animate-gy-greet-in"
      style={{
        bottom: "24px",
        left: "24px",
        maxWidth: "330px",
        background: "rgba(13,27,42,0.97)",
        border: `1px solid ${GOLD}33`,
        backdropFilter: "blur(8px)",
        padding: "20px 22px",
        boxShadow: "0 18px 48px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: "10px",
        }}
      >
        Availability Alerts
      </div>
      <p
        style={{
          fontFamily: "var(--gy-font-body, Georgia, serif)",
          fontSize: "14px",
          lineHeight: 1.55,
          color: "rgba(248,245,240,0.86)",
          margin: "0 0 16px",
        }}
      >
        {status === "ok"
          ? "You're set. We'll alert you the moment a rare week opens."
          : status === "error"
          ? "Something went wrong. You can try again anytime."
          : "The best yachts free up without notice. Be the first to know when a rare week opens in Greek waters."}
      </p>
      {status !== "ok" && (
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <button
            onClick={enable}
            disabled={busy}
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#0D1B2A",
              background: GOLD,
              border: "none",
              padding: "11px 20px",
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "…" : "Notify me"}
          </button>
          <button
            onClick={dismiss}
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,0.45)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            No thanks
          </button>
        </div>
      )}
    </div>
  );
}
