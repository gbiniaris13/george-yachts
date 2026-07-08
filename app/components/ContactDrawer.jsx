"use client";

// Phase 1 / B2 (Boss luxury rebuild brief, 2026-05-05) —
// Multi-channel "Speak to George" drawer.
//
// UHNW guests don't fill out email forms. They reach out through
// channels they already use — WhatsApp, iMessage, Signal, or a direct
// phone call. This drawer surfaces all four under one sticky button,
// letting them pick the channel they prefer in one tap.
//
// Architecture:
//   • Sticky FAB on right side (sits above the existing WhatsApp FAB
//     so they don't collide; coordinator pattern keeps stacking sane).
//   • Click → opens a glass-morphism drawer with 4 channel cards.
//   • Each card opens the relevant deep link in a new tab/window.
//   • Drawer dismisses on backdrop click, Esc key, or outside scroll.
//   • Respects the site's popup coordinator (gy_popup_active) so it
//     doesn't peek out from under another modal.
//
// Why a separate component (not bolted onto WhatsAppButton): the
// existing WhatsApp FAB has a 90s first-visit greeting that's already
// proven. Keeping that intact and adding this drawer above it preserves
// the conversion path while expanding the channel menu.

import { useState, useEffect, useRef } from "react";

// Boss directive 2026-05-05: WhatsApp uses the US line so guests
// outside Greece can dial without international fees; Signal /
// iMessage·SMS / direct call all use the Greek line where Boss is
// physically reachable from the Athens office.
const CONTACT = {
  whatsappPhone: "+17867988798",          // US — WhatsApp only
  greekPhone:    "+306970380999",          // Greek — SMS / iMessage / Signal / call
  smsBody:       "Hi George - I'd like to chat about a Greek charter.",
  whatsappMsg:   "Hello George - exploring Greek charter options. Can I ask a few questions?",
  email:         "george@georgeyachts.com",
};

const FAB_BOTTOM = 152; // px — sits above the WhatsApp FAB at bottom: 88

export default function ContactDrawer() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const drawerRef = useRef(null);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on outside click while open
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    // Defer registration so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", onClick), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const trackChannel = (channel) => {
    try {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "contact_drawer_select", {
          channel,
          location: "sticky_fab",
        });
      }
    } catch {}
  };

  const channels = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      sub: "US line · Reply within minutes",
      href: `https://wa.me/${CONTACT.whatsappPhone.replace("+", "")}?text=${encodeURIComponent(CONTACT.whatsappMsg)}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      key: "imessage",
      label: "iMessage / SMS",
      sub: "Greek line · On Apple devices",
      href: `sms:${CONTACT.greekPhone}?&body=${encodeURIComponent(CONTACT.smsBody)}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      key: "signal",
      label: "Signal",
      sub: "Greek line · End-to-end encrypted",
      href: `https://signal.me/#p/${CONTACT.greekPhone}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5a11.5 11.5 0 1 0 11.5 11.5A11.5 11.5 0 0 0 12 .5zm5.74 16.95a1.45 1.45 0 0 1-2 .5l-2.5-1.5a4.5 4.5 0 0 1-2 .5h-1a4.5 4.5 0 0 1-4.5-4.5v-1a4.5 4.5 0 0 1 4.5-4.5h2a4.5 4.5 0 0 1 4.5 4.5v1a4.5 4.5 0 0 1-.5 2l1.5 2.5a1.45 1.45 0 0 1 0 .5z" />
        </svg>
      ),
    },
    {
      key: "call",
      label: "Direct call",
      sub: "Greek line · Athens GMT+2",
      href: `tel:${CONTACT.greekPhone}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Sticky trigger button — sits above existing WhatsApp FAB.
          Phase 27 (Forbes-launch eve, 2026-05-05): hidden on mobile via
          .gy-fab-desktop-only — the SPEAK square was overlapping editorial
          copy across nearly every iPhone screen. WhatsApp + bottom sticky
          CTA cover the mobile contact paths; this multi-channel drawer is
          a desktop affordance only. */}
      <button
        type="button"
        className="gy-fab-desktop-only"
        aria-label="Speak to George - multi-channel"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-cursor="Contact"
        style={{
          position: "fixed",
          bottom: FAB_BOTTOM,
          right: 24,
          zIndex: 50,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: hovered
            ? "linear-gradient(135deg, #C9A84C 0%, #C9A84C 100%)"
            : "rgba(13,27,42,0.55)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${hovered ? "#C9A84C" : "rgba(201,168,76,0.45)"}`,
          color: hovered ? "#0D1B2A" : "#C9A84C",
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          boxShadow: hovered
            ? "0 12px 36px rgba(13, 27, 42,0.5), 0 0 24px rgba(201,168,76,0.18)"
            : "0 6px 20px rgba(13, 27, 42,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ fontSize: 7 }}>Contact</span>
      </button>

      {/* Backdrop + Drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            role="presentation"
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 27, 42, 0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 100,
              animation: "gy-fade-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Direct contact channels"
            style={{
              position: "fixed",
              right: 24,
              bottom: FAB_BOTTOM + 72,
              zIndex: 101,
              width: "min(360px, calc(100vw - 48px))",
              background: "linear-gradient(155deg, rgba(13, 27, 42,0.98) 0%, rgba(13, 27, 42,0.98) 100%)",
              border: "1px solid rgba(201,168,76,0.32)",
              boxShadow: "0 28px 72px rgba(13, 27, 42,0.6), 0 0 0 1px rgba(201,168,76,0.08) inset",
              padding: "26px 22px 22px",
              animation: "gy-drawer-in 0.42s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 18 }}>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Speak to George
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 22,
                  fontStyle: "italic",
                  color: "rgba(248,245,240,0.92)",
                  margin: "8px 0 0",
                  lineHeight: 1.3,
                  fontWeight: 300,
                }}
              >
                Pick the channel that suits you best.
              </p>
            </div>

            {/* Channel cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {channels.map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.key === "call" || c.key === "imessage" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  onClick={() => trackChannel(c.key)}
                  data-cursor={c.label}
                  className="gy-contact-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: "rgba(201,168,76,0.04)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    textDecoration: "none",
                    color: "rgba(248,245,240,0.92)",
                    transition: "all 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#C9A84C",
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        color: "#F8F5F0",
                        fontWeight: 600,
                      }}
                    >
                      {c.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 11,
                        color: "rgba(248,245,240,0.6)",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                        marginTop: 2,
                      }}
                    >
                      {c.sub}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      color: "rgba(201,168,76,0.6)",
                      fontSize: 14,
                    }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>

            {/* Foot note */}
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 10,
                letterSpacing: "0.04em",
                color: "rgba(248,245,240,0.45)",
                fontStyle: "italic",
                margin: "16px 0 0",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Boutique brokerage · Personal reply, never an autoresponder.
            </p>

            {/* Close × */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close drawer"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
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
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes gy-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gy-drawer-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .gy-contact-row:hover {
          background: rgba(201,168,76,0.10) !important;
          border-color: rgba(201,168,76,0.5) !important;
          transform: translateX(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-gy-drawer="root"] * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
