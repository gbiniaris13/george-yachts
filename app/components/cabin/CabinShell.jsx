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
import { useEffect, useState } from "react";
import CabinBrandMark from "./CabinBrandMark";

// 2026-05-21 — Admin "Preview as customer" banner.
//
// Sits at the very top of the shell (above the concierge banner
// and the header). Solid teal so it can never be confused with
// the gold concierge banner or the navy header. Shows:
//   • who's previewing (admin email)
//   • a live countdown to session expiry (15 min TTL)
//   • an "Exit preview" button that hits /api/cabin/auth/logout
//     to clear both the session cookie and the preview cookie,
//     then bounces the admin back to the CRM.
//
// Read-only by design — writes are blocked at the edge by the
// middleware (preview cookie → 403 on POST/PUT/PATCH/DELETE).
function PreviewBanner({ adminEmail, expiresAt }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? Math.max(0, expiresAt - Date.now()) : 0,
  );
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const id = setInterval(() => {
      setRemaining(Math.max(0, expiresAt - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  async function onExit() {
    setExiting(true);
    try {
      await fetch("/api/cabin/auth/logout", { method: "POST" });
    } catch {
      // proceed — we'll force-navigate regardless
    }
    // Send the admin back to the CRM cabin list. If they want
    // back into the same preview, the CRM has the button.
    // NEXT_PUBLIC_CRM_URL is unlikely to be set on the public
    // site (no need usually) so we hardcode the production
    // command.georgeyachts.com as the fallback.
    const crm =
      process.env.NEXT_PUBLIC_CRM_URL || "https://command.georgeyachts.com";
    window.location.href = `${crm}/dashboard/cabins`;
  }

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return (
    <div
      className="cabin-shell__preview-banner"
      role="status"
      aria-live="polite"
    >
      <span className="cabin-shell__preview-banner-icon" aria-hidden>
        ◉
      </span>
      <span className="cabin-shell__preview-banner-copy">
        <strong>Admin preview</strong>
        {adminEmail ? <> - viewing as the principal charterer · {adminEmail}</> : null}
        <em className="cabin-shell__preview-banner-timer">
          {" "}· read-only · expires in {mins}:{secs}
        </em>
      </span>
      <button
        type="button"
        onClick={onExit}
        disabled={exiting}
        className="cabin-shell__preview-banner-exit"
      >
        {exiting ? "Exiting…" : "Exit preview ✕"}
      </button>
    </div>
  );
}

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
  return `${fmt(from)} - ${fmt(to)}`;
}

export default function CabinShell({
  session,
  cabin,
  viewerDisplayName,
  previewMode = false,
  previewAdminEmail = null,
  previewExpiresAt = null,
  children,
}) {
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

  // 2026-05-26 — Domingo bug-report (3 confirmations): clicking the
  // back arrow + "The Cabin · Filotimo" left brand on a /cabin/brief/*
  // page did nothing — URL stayed put. Same Next.js 15 router.push
  // silent-drop documented in /cabin/me/page.jsx (App Router prod
  // build coalescing router.push inside some client trees). Replaces
  // the previous <Link href="/cabin"> with a raw <a> + onClick →
  // window.location.assign so navigation is guaranteed. Modifier
  // clicks fall through to the browser default (open in new tab).
  function onCabinHomeClick(e) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.assign("/cabin");
    }
  }

  const showChrome = !pathname.endsWith("/cabin/login");
  // 2026-05-23 — /cabin/welcome is the pre-onboarding gate. Bottom
  // nav has no business covering the "Save and enter the Cabin"
  // CTA — and the principal hasn't entered the cabin yet so there's
  // nowhere to navigate to. Hide bottom nav on welcome explicitly.
  // 2026-05-24 — Christos pass: bottom navigation bar removed
  // entirely. George flagged it as crowding the mobile viewport
  // with secondary chrome ("τη βγάζεις τελείως"). Cabin home
  // already exposes every destination as a tile, and the top-of-
  // page NextStep wizard guides each member to what they need
  // to do next. The bottom nav was redundant.
  const showBottomNav = false;

  return (
    <div className="cabin-shell">
      {previewMode && showChrome && (
        <PreviewBanner
          adminEmail={previewAdminEmail}
          expiresAt={previewExpiresAt}
        />
      )}
      {showChrome && (
        <header className="cabin-shell__header" role="banner">
          {/* 2026-05-22 — Header redesigned, take 3 (George's
              directive after seeing the centred-but-small logo):
                · LEFT     — "THE CABIN · Filotimo" with a
                             quiet brand tagline beneath.
                             The back arrow tucks here too,
                             before the brand block.
                · CENTRE   — CabinBrandMark: the real GY logo,
                             large, the page's visual anchor.
                · RIGHT    — vessel name (italic editorial) over
                             dates + viewer name (spaced caps).
                             The cabin IS the vessel — the
                             customer's "I've walked into the
                             cabin of MY yacht" moment lives
                             here.
              Grid is 1fr auto 1fr so the centre column sizes
              itself to the logo (large) while the two flanks
              balance evenly. */}
          <div className="cabin-shell__left">
            {pathname !== "/cabin" && (
              <a
                href="/cabin"
                onClick={onCabinHomeClick}
                className="cabin-shell__back"
                aria-label="Back to Cabin home"
              >
                <span aria-hidden>←</span>
              </a>
            )}
            <a
              href="/cabin"
              onClick={onCabinHomeClick}
              className="cabin-shell__left-brand"
              aria-label="The Cabin - home"
            >
              <span className="cabin-shell__left-title">The Cabin</span>
              <span className="cabin-shell__left-mark">Filotimo</span>
              <span className="cabin-shell__left-tagline">
                By invitation, in confidence
              </span>
            </a>
          </div>
          <div className="cabin-shell__brand-slot">
            <CabinBrandMark href="/cabin" />
          </div>
          <div className="cabin-shell__charter">
            {cabin?.vessel_name && (
              <span className="cabin-shell__charter-vessel notranslate">
                {cabin.vessel_name}
              </span>
            )}
            <span className="cabin-shell__charter-meta">
              {dates ? dates : null}
              {dates && viewerName ? <span aria-hidden> - </span> : null}
              {viewerName ? <em>{viewerName}</em> : null}
            </span>
          </div>
        </header>
      )}

      {cabin?.concierge_mode_active && (
        <ConciergeBanner />
      )}

      <main className="cabin-shell__main">{children}</main>

      {showBottomNav && (
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
        /* 2026-05-21 - Admin preview banner.
           Teal (#0E7C7B) keeps it unmistakable: gold = concierge,
           navy = header, teal = "you are an admin previewing".
           Sticks above everything else (z-index 30) so it stays
           visible even when nested pages scroll. */
        .cabin-shell__preview-banner {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #0E7C7B;
          color: #ffffff;
          padding: 10px 18px;
          font-family: var(--gy-font-ui, system-ui, sans-serif);
          font-size: 12px;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          border-bottom: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
        }
        .cabin-shell__preview-banner-icon {
          font-size: 14px;
          line-height: 1;
        }
        .cabin-shell__preview-banner-copy {
          flex: 1;
          min-width: 0;
        }
        .cabin-shell__preview-banner-copy strong {
          font-weight: 600;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-size: 10px;
          margin-right: 4px;
        }
        .cabin-shell__preview-banner-timer {
          font-style: normal;
          opacity: 0.9;
          font-variant-numeric: tabular-nums;
        }
        .cabin-shell__preview-banner-exit {
          background: rgba(255,255,255,0.16);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.55);
          padding: 7px 14px;
          font-family: inherit;
          font-size: 9.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .cabin-shell__preview-banner-exit:hover {
          background: rgba(255,255,255,0.26);
        }
        .cabin-shell__preview-banner-exit:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        @media (max-width: 600px) {
          .cabin-shell__preview-banner {
            font-size: 11px;
            padding: 8px 14px;
          }
        }

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
        /* 2026-05-26 - Domingo bug-report: WhatsApp + ContactDrawer
           ("Speak to George") + AskGeorgeWidget (AI concierge) +
           AmbientPlayer (ambient sound) used to be hidden inside
           The Cabin under the "cabin owns the viewport" doctrine.
           Customer-side test surfaced the gap: WhatsApp is HOW the
           client reaches George - hiding it inside the Cabin defeats
           the whole purpose. The four widgets stay visible now.
           We keep nav/wishlist/sticky-CTA/exit-intent hidden because
           those ARE distractions; the four below are contact tools. */
        body:has([data-cabin-mode]) #wishlist-fab,
        body:has([data-cabin-mode]) [data-global-nav],
        body:has([data-cabin-mode]) .smart-welcome,
        body:has([data-cabin-mode]) .sticky-fleet-cta,
        body:has([data-cabin-mode]) .sticky-inquiry-bar {
          display: none !important;
        }

        .cabin-shell {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* 2026-05-21 - Pass 7 redesign (George):
           "Multi-billion εταιρεία, Vogue feel, για πλούσιους
           πελάτες." Header now breathes - bigger vertical
           padding, brand on left (monogram + wordmark +
           strapline), vessel name on right as the right-side
           lead, dates + viewer name in a smaller secondary line.
           The three regions are laid out with grid: back · brand
           · charter, where back is optional and the brand /
           charter share the remaining space evenly. */
        .cabin-shell__header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 22px;
          padding: 22px 28px;
          padding-top: calc(22px + env(safe-area-inset-top, 0));
          background: var(--gy-navy);
          color: var(--gy-ivory);
          border-bottom: 1px solid rgba(201, 168, 76, 0.32);
        }
        /* ─────────────────────────────────────────────────────────
           MOBILE MASTHEAD - Eleanna round 4 (2026-05-23, after a
           paying client saw it).

           CRITICAL CONTEXT for any future maintainer:

           cabin-luxury.css § 14 (line 714) forces the cabin header
           background to a cream/ivory frosted glass - NOT navy. This
           is intentional (Apple-style backdrop blur). EVERY header
           text color must therefore be NAVY-based for legibility on
           cream. Ivory text on cream = invisible. (That bug shipped
           in round 3 - only the gold "Filotimo" wordmark stayed
           readable; "THE CABIN" disappeared into the cream.)

           Also: cabin-tones.css line 264 forces grid-template-columns
           to "auto 1fr" at <560px, which beats unprefixed selectors.
           We use [data-cabin-mode] prefix throughout this @media
           block to match its specificity - and since this <style jsx
           global> injects AFTER the static stylesheets, we win the
           tiebreaker.

           Layout: vertical masthead (Vogue cover, Loro Piana shop
           sign). Logo centred top, "THE CABIN" navy small caps,
           hairline gold rule, "Filotimo" gold italic, vessel chip
           below. Back arrow floats top-left.
           ───────────────────────────────────────────────────────── */
        @media (max-width: 599.98px) {
          [data-cabin-mode] .cabin-shell__header {
            grid-template-columns: 1fr !important;
            grid-template-areas:
              "center"
              "left"
              "charter" !important;
            row-gap: 8px !important;
            justify-items: center !important;
            text-align: center !important;
            padding: 12px 22px 14px !important;
            padding-top: calc(12px + env(safe-area-inset-top, 0)) !important;
          }
          [data-cabin-mode] .cabin-shell__left {
            grid-area: left;
            flex-direction: column !important;
            align-items: center !important;
            gap: 0 !important;
            justify-self: center !important;
          }
          [data-cabin-mode] .cabin-shell__brand-slot {
            grid-area: center;
          }
          [data-cabin-mode] .cabin-shell__charter {
            grid-area: charter !important;
            justify-self: center !important;
            align-items: center !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
          }
          [data-cabin-mode] .cabin-shell__left-brand {
            align-items: center !important;
            text-align: center !important;
            gap: 6px !important;
          }
          /* THE CABIN - navy small-caps on cream */
          [data-cabin-mode] .cabin-shell__left-title {
            font-size: 10.5px !important;
            letter-spacing: 0.36em !important;
            color: rgba(13, 27, 42, 0.82) !important;
            font-weight: 500 !important;
          }
          /* Gold hairline divider between THE CABIN and Filotimo */
          [data-cabin-mode] .cabin-shell__left-mark {
            position: relative;
            display: block;
            font-family: var(--gy-font-editorial, Georgia, serif);
            font-style: italic;
            font-size: 14.5px !important;
            color: var(--gy-gold) !important;
            letter-spacing: 0.04em !important;
            margin-top: 8px !important;
            padding-top: 8px !important;
          }
          [data-cabin-mode] .cabin-shell__left-mark::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 28px;
            height: 1px;
            background: linear-gradient(
              to right,
              transparent,
              rgba(201, 168, 76, 0.75) 50%,
              transparent
            );
          }
          [data-cabin-mode] .cabin-shell__left-tagline {
            display: none !important;
          }
          /* Vessel chip - navy text on cream, centred */
          [data-cabin-mode] .cabin-shell__charter-vessel {
            font-size: 16px !important;
            color: var(--gy-navy) !important;
            max-width: 88vw !important;
          }
          [data-cabin-mode] .cabin-shell__charter-meta {
            font-size: 9px !important;
            letter-spacing: 2px !important;
            margin-top: 4px !important;
            color: rgba(13, 27, 42, 0.6) !important;
          }
          [data-cabin-mode] .cabin-shell__charter-meta em {
            color: var(--gy-gold) !important;
            font-style: normal !important;
            font-weight: 500 !important;
          }
          /* Back arrow: navy outline on cream, floated top-left so
             it never offsets the centred masthead. 44×44 meets
             Apple HIG (was 32×32 → too small to tap reliably). */
          [data-cabin-mode] .cabin-shell__back {
            position: absolute !important;
            top: calc(10px + env(safe-area-inset-top, 0)) !important;
            left: 12px !important;
            width: 44px !important;
            height: 44px !important;
            font-size: 18px !important;
            z-index: 2 !important;
            color: var(--gy-navy) !important;
            border-color: rgba(13, 27, 42, 0.22) !important;
          }
          [data-cabin-mode] .cabin-shell__back:hover,
          [data-cabin-mode] .cabin-shell__back:focus-visible {
            background: rgba(13, 27, 42, 0.05) !important;
            border-color: var(--gy-gold) !important;
          }
        }
        /* On the narrowest phones (Galaxy S base ~360px, iPhone SE
           375px, iPhone Pro mini 375px) tighten everything one
           notch and drop the vessel chip dates line if it would
           wrap onto a third row. */
        @media (max-width: 389.98px) {
          [data-cabin-mode] .cabin-shell__header {
            padding: 14px 16px 16px !important;
            padding-top: calc(14px + env(safe-area-inset-top, 0)) !important;
            row-gap: 8px !important;
          }
          [data-cabin-mode] .cabin-shell__charter-vessel {
            font-size: 15px !important;
          }
          [data-cabin-mode] .cabin-shell__charter-meta {
            font-size: 8.5px !important;
            letter-spacing: 1.8px !important;
          }
        }

        .cabin-shell__left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          justify-self: start;
        }
        .cabin-shell__left-brand {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          min-width: 0;
        }
        /* 2026-05-26 - Brief 04 / T1 (Domingo guest audit): the
           DESKTOP / TABLET base styles below were the last cream-on-
           cream offenders. The mobile-masthead block above (≤599.98px)
           was already navy-corrected - but on every viewport ≥600px,
           "THE CABIN" wordmark + tagline + back arrow + vessel chip +
           dates/meta were rendering in ivory on the cream backdrop-
           blurred header (cabin-luxury.css §14), effectively invisible.
           All five corrected to navy with the same hairline-divider
           treatment the mobile block uses. "Filotimo" stays gold -
           that one always read. */
        .cabin-shell__left-title {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 13.5px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.82);
          font-weight: 500;
          white-space: nowrap;
        }
        .cabin-shell__left-title em {
          font-style: italic;
          color: var(--gy-gold);
          letter-spacing: 0.06em;
          text-transform: none;
          margin-left: 2px;
          font-size: 14.5px;
        }
        .cabin-shell__left-tagline {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-style: italic;
          font-size: 11.5px;
          letter-spacing: 0.04em;
          color: rgba(13, 27, 42, 0.55);
          margin-top: 4px;
          white-space: nowrap;
        }
        @media (max-width: 1023.98px) {
          .cabin-shell__left-title { font-size: 11.5px; letter-spacing: 0.26em; }
          .cabin-shell__left-title em { font-size: 12.5px; }
          .cabin-shell__left-tagline { font-size: 10px; }
        }
        @media (max-width: 767.98px) {
          .cabin-shell__left-title { font-size: 10px; letter-spacing: 0.22em; }
          .cabin-shell__left-title em { font-size: 11px; }
          .cabin-shell__left-tagline { font-size: 9px; }
        }

        .cabin-shell__back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          /* Brief 04 / T1 - navy outline on cream. */
          border: 1px solid rgba(13, 27, 42, 0.22);
          border-radius: 2px;
          color: var(--gy-navy);
          text-decoration: none;
          font-size: 18px;
          line-height: 1;
          transition: background 140ms ease, border-color 140ms ease;
          flex-shrink: 0;
        }
        .cabin-shell__back:hover,
        .cabin-shell__back:focus-visible {
          background: rgba(13, 27, 42, 0.05);
          border-color: var(--gy-gold);
          outline: none;
        }

        .cabin-shell__brand-slot {
          min-width: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cabin-shell__charter {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          min-width: 0;
          justify-self: end;
        }
        .cabin-shell__charter-vessel {
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          font-style: italic;
          font-weight: 300;
          letter-spacing: 0.4px;
          /* Brief 04 / T1 - navy on cream. */
          color: var(--gy-navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .cabin-shell__charter-meta {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2.4px;
          /* Brief 04 / T1 - navy on cream. */
          color: rgba(13, 27, 42, 0.6);
          text-transform: uppercase;
          margin-top: 6px;
        }
        .cabin-shell__charter-meta em {
          font-style: normal;
          color: var(--gy-gold);
          font-weight: 500;
        }
        @media (max-width: 479.98px) {
          .cabin-shell__charter-vessel {
            font-size: 14px;
          }
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
