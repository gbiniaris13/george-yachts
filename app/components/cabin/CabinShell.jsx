"use client";

// app/components/cabin/CabinShell.jsx
// =============================================================
// The visual shell wrapping every /cabin/* page.
//   • Sticky navy top bar with brand mark + charterer name + dates
//   • Side rail (desktop) / bottom nav (iPhone) for primary nav
//   • Concierge banner with Confirm button if cabin.concierge_mode_active
//   • Filotimo Circle subtle badge if member
//
// Mobile-first: bottom tab bar on small screens, side rail at
// >= 1024px. Uses CSS-only transitions (no JS animation libs)
// for App-Store-quality feel.
// =============================================================

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

function ConciergeBanner() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onConfirm() {
    setBusy(true);
    try {
      const r = await fetch("/api/cabin/concierge/confirm", { method: "POST" });
      if (r.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cabin-shell__concierge-banner" role="status">
      <span>
        This Cabin has been prepared on your behalf by George. Please review,
        edit anything you wish, or confirm.
      </span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="cabin-shell__concierge-confirm"
      >
        {busy ? "Confirming…" : "Everything looks correct"}
      </button>
    </div>
  );
}

const NAV_ITEMS = [
  { href: "/cabin", label: "Cabin", short: "Home", glyph: "○" },
  { href: "/cabin/brief", label: "The Brief", short: "Brief", glyph: "✎" },
  { href: "/cabin/chat", label: "Chat with George", short: "Chat", glyph: "✺" },
  { href: "/cabin/before-you-sail", label: "Before you sail", short: "Before", glyph: "⊿" },
  { href: "/cabin/guests", label: "Guests", short: "Guests", glyph: "◇" },
  { href: "/cabin/mood-board", label: "Mood Board", short: "Mood", glyph: "❖" },
  { href: "/cabin/crew", label: "Crew", short: "Crew", glyph: "⚓" },
  { href: "/cabin/menu", label: "Sample Menu", short: "Menu", glyph: "✿" },
  { href: "/cabin/vessel", label: "Vessel", short: "Vessel", glyph: "⛵" },
  { href: "/cabin/voyage-album", label: "Voyage Album", short: "Album", glyph: "▣" },
  { href: "/cabin/time-capsule", label: "Time Capsule", short: "Capsule", glyph: "✉" },
  { href: "/cabin/filotimo-circle", label: "Filotimo Circle", short: "Circle", glyph: "◐" },
  { href: "/cabin/your-data", label: "Your Data", short: "Data", glyph: "▢" },
];

function formatDateRange(from, to) {
  if (!from || !to) return "";
  const fmt = (iso) => {
    const d = new Date(iso + "T00:00:00Z");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  };
  return `${fmt(from)} – ${fmt(to)}`;
}

export default function CabinShell({ session, cabin, viewerDisplayName, children }) {
  const pathname = usePathname() || "";

  // 2026-05-20 — Friend-test pass 3 (George): the hamburger drawer
  // is gone. George's read: "Κανένας πελάτης δεν θα κάτσει να
  // ανοίξει hamburger για να ασχοληθεί." All 13 nav items now
  // live as icon tiles on /cabin home. The bottom mobile nav
  // stays (5 anchor items: Home, Brief, Chat, Before, Guests).
  // Sign-out moved to a small footer link on /cabin.

  // 2026-05-20 — Pass 6 (Domingo): header chip now shows the
  // VIEWER's name (from their cabin_members.display_name passed
  // through the layout), falling back to the email local-part.
  // It does NOT show the principal_charterer_name when an invited
  // guest is logged in — that misled guests into thinking they
  // were inside someone else's account.
  const viewerName =
    viewerDisplayName ||
    session?.email?.split("@")[0] ||
    "guest";

  const dates = formatDateRange(
    cabin?.charter_period_from,
    cabin?.charter_period_to,
  );

  const showChrome = !pathname.endsWith("/cabin/login");

  return (
    <div className="cabin-shell">
      {showChrome && (
        <header className="cabin-shell__header" role="banner">
          {/* Back arrow on every sub-page. Tapping returns to /cabin
              home — the single source of nav truth. On mobile this
              is the primary affordance because the bottom nav only
              surfaces 5 of 13 sections; the hamburger (right) opens
              the full drawer with every section. */}
          {pathname !== "/cabin" && (
            <Link
              href="/cabin"
              className="cabin-shell__back"
              aria-label="Back to Cabin home"
            >
              <span aria-hidden>←</span>
            </Link>
          )}
          <Link
            href="/cabin"
            className="cabin-shell__brand"
            aria-label="Cabin home"
          >
            <span className="cabin-shell__brand-eyebrow">George Yachts</span>
            <span className="cabin-shell__brand-title">
              The Cabin <em>· Filotimo</em>
            </span>
          </Link>
          <div className="cabin-shell__charter">
            <span className="cabin-shell__charter-name">
              {viewerName}
            </span>
            {cabin?.vessel_name && (
              <span className="cabin-shell__charter-meta">
                {cabin.vessel_name}
                {dates ? ` · ${dates}` : ""}
              </span>
            )}
          </div>
        </header>
      )}

      {cabin?.concierge_mode_active && (
        <ConciergeBanner />
      )}

      <main className="cabin-shell__main">{children}</main>

      {showChrome && (
        <nav className="cabin-shell__bottom-nav" aria-label="Cabin navigation">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/cabin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "cabin-shell__bottom-nav-item" +
                  (active ? " is-active" : "")
                }
                aria-current={active ? "page" : undefined}
              >
                <span className="cabin-shell__bottom-nav-glyph" aria-hidden>
                  {item.glyph}
                </span>
                <span>{item.short}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* 2026-05-20 — drawer + backdrop removed. The Cabin map on
          /cabin replaces this; Sign-out lives in /cabin footer. */}

      <style jsx global>{`
        .cabin-shell__concierge-banner {
          background: rgba(201, 168, 76, 0.12);
          border-bottom: 1px solid rgba(201, 168, 76, 0.4);
          color: var(--gy-navy);
          padding: 12px 18px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cabin-shell__concierge-banner span { flex: 1; }
        .cabin-shell__concierge-confirm {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          padding: 8px 16px;
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-style: normal;
        }
        .cabin-shell__concierge-confirm:disabled { opacity: 0.6; cursor: wait; }

        body:has([data-cabin-mode]) {
          /* hide global site chrome inside the Cabin */
          background: var(--gy-ivory, #f8f5f0);
        }
        body:has([data-cabin-mode]) #wishlist-fab,
        body:has([data-cabin-mode]) [data-global-nav],
        body:has([data-cabin-mode]) .smart-welcome,
        body:has([data-cabin-mode]) .sticky-fleet-cta,
        body:has([data-cabin-mode]) .sticky-inquiry-bar,
        body:has([data-cabin-mode]) [data-component="WhatsAppButton"],
        body:has([data-cabin-mode]) [data-component="ContactDrawer"],
        body:has([data-cabin-mode]) [data-component="ExitIntentModal"] {
          display: none !important;
        }

        .cabin-shell {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .cabin-shell__header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: grid;
          /* 2026-05-20 — Pass 6 (Domingo, Tyler):
             pass-3 removed the hamburger button but the grid kept a
             trailing 'auto' track for it. The charter chip's '1fr'
             column was being squeezed to ~80px on a 375px-wide
             iPhone, and viewerName + vessel + dates ellipsised down
             to literally nothing — the chip rendered empty.

             Grid is now three tracks: back (optional, auto) · brand
             (auto) · charter chip (1fr, right-aligned). No dead
             trailing track. On phones < 480px the charter chip's
             vessel-meta line is hidden so the name alone has room
             to breathe; the meta returns at ≥ 480px. */
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          padding-top: calc(14px + env(safe-area-inset-top, 0));
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border-bottom: 1px solid rgba(201, 168, 76, 0.4);
        }
        @media (max-width: 479.98px) {
          .cabin-shell__charter-meta {
            display: none;
          }
          .cabin-shell__brand-eyebrow {
            display: none;
          }
          .cabin-shell__brand-title {
            font-size: 15px;
          }
        }

        .cabin-shell__back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(248, 245, 240, 0.25);
          border-radius: 2px;
          color: var(--gy-ivory);
          text-decoration: none;
          font-size: 18px;
          line-height: 1;
          transition: background 140ms ease, border-color 140ms ease;
        }
        .cabin-shell__back:hover,
        .cabin-shell__back:focus-visible {
          background: rgba(248, 245, 240, 0.08);
          border-color: var(--gy-gold);
          outline: none;
        }

        .cabin-shell__brand {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          text-decoration: none;
          color: inherit;
        }
        .cabin-shell__brand:hover .cabin-shell__brand-title {
          color: var(--gy-gold);
        }
        .cabin-shell__brand-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 9px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-shell__brand-title {
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          font-weight: 400;
          margin-top: 2px;
          letter-spacing: -0.3px;
        }
        .cabin-shell__brand-title em {
          color: var(--gy-gold);
          font-style: italic;
        }

        .cabin-shell__charter {
          display: flex;
          flex-direction: column;
          text-align: right;
          min-width: 0;
        }
        .cabin-shell__charter-name {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          font-style: italic;
          font-weight: 300;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cabin-shell__charter-meta {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.5px;
          color: rgba(248, 245, 240, 0.55);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .cabin-shell__menu {
          /* Visible on every breakpoint now. Previously hidden on
             mobile, which left mobile users with only the 5-item
             bottom nav and no path to Crew/Menu/Vessel/etc. without
             returning home first. */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(248, 245, 240, 0.25);
          color: var(--gy-ivory);
          font-size: 18px;
          line-height: 1;
          width: 36px;
          height: 36px;
          cursor: pointer;
          border-radius: 2px;
        }
        .cabin-shell__menu:hover,
        .cabin-shell__menu:focus-visible {
          background: rgba(248, 245, 240, 0.08);
          border-color: var(--gy-gold);
          outline: none;
        }

        .cabin-shell__main {
          flex: 1;
          padding: 28px 18px 96px 18px;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        @media (min-width: 768px) {
          .cabin-shell__main {
            padding: 48px 32px 48px 32px;
          }
        }

        .cabin-shell__bottom-nav {
          position: sticky;
          bottom: 0;
          z-index: 25;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          background: rgba(20, 34, 51, 0.96);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-top: 1px solid rgba(201, 168, 76, 0.25);
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        @media (min-width: 768px) {
          .cabin-shell__bottom-nav { display: none; }
        }

        .cabin-shell__bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 4px 12px;
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.55);
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .cabin-shell__bottom-nav-item.is-active {
          color: var(--gy-gold);
        }
        .cabin-shell__bottom-nav-glyph {
          font-size: 16px;
          line-height: 1;
        }

        .cabin-shell__drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(13, 27, 42, 0.55);
          z-index: 40;
          display: flex;
          justify-content: flex-end;
        }
        .cabin-shell__drawer {
          width: min(360px, 86vw);
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 24px 24px 32px 24px;
          padding-top: calc(24px + env(safe-area-inset-top, 0));
          height: 100dvh;
          overflow-y: auto;
          box-shadow: -4px 0 32px rgba(0, 0, 0, 0.3);
          animation: cabin-drawer-in 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        @keyframes cabin-drawer-in {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .cabin-shell__drawer-head {
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.25);
        }
        .cabin-shell__drawer-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cabin-shell__drawer-sep {
          height: 1px;
          background: rgba(201, 168, 76, 0.2);
          margin: 12px 0;
        }
        .cabin-shell__drawer-link {
          width: 100%;
          background: transparent;
          border: 0;
          color: rgba(248, 245, 240, 0.85);
          text-align: left;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 8px;
          font-family: var(--gy-font-body);
          font-size: 15px;
          text-decoration: none;
          cursor: pointer;
          letter-spacing: 0.1px;
          border-radius: 2px;
        }
        .cabin-shell__drawer-link:hover {
          background: rgba(248, 245, 240, 0.05);
          color: var(--gy-ivory);
        }
        .cabin-shell__drawer-link.is-active {
          color: var(--gy-gold);
        }
        .cabin-shell__drawer-link--logout {
          color: rgba(248, 245, 240, 0.45);
          font-style: italic;
          font-family: var(--gy-font-editorial);
        }
        .cabin-shell__drawer-glyph {
          color: var(--gy-gold);
          font-size: 14px;
          width: 18px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
