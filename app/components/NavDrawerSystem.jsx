"use client";

// Chapter 02 (Boss-spec nav rebuild, 2026-05-08) — full rewrite.
//
// Replaces the prior 4-bucket / 18-link hamburger drawer + 5-icon
// right cluster (search / currency / language / Instagram / LinkedIn
// / favorites) with a Burgess/Aman-tier 4-item top nav:
//
//   CHARTER          (dropdown: Private Fleet · Explorer Fleet · View All)
//   EXPLORE GREECE   (dropdown: Cyclades · Ionian · Saronic · Itineraries)
//   ABOUT            (dropdown: About George · How It Works · FAQ)
//   BRIEF GEORGE →   (no dropdown — primary CTA, gold, direct link to /inquiry)
//
// Plus a tiny 11 px €/$ currency icon in the top-right corner.
//
// Items dropped from the nav surface (Boss directive — they belong
// in the footer where the UHNW visitor will find them when they
// need them):
//   • Buy a Yacht                  (footer)
//   • Fly Private                  (footer)
//   • VIP Transfers                (footer)
//   • Luxury Villas                (footer)
//   • The Journal / Blog           (footer)
//   • Meet the Team                (footer)
//   • For Partners                 (footer)
//   • Credentials                  (footer)
//
// Right-cluster icons (search / language / Instagram / LinkedIn /
// favorites) also dropped from the nav. Search/lang are reachable
// via the browser's own affordances; the rest live in the footer.
//
// Desktop layout:
//   [CHARTER  EXPLORE GREECE]   [LOGO]   [ABOUT  BRIEF GEORGE →]   ↗ [€/$]
//   2-2 split around the centered logo gives the masthead the
//   ceremonial / old-money symmetry Boss flagged in the Aman/Belmond
//   reference set. Currency icon floats top-right corner, kept small
//   so it never competes with the masthead.
//
// Mobile layout:
//   [☰]                           [LOGO]                          [€/$]
//   Tap ☰ → full-screen overlay with the 4 items centered vertically,
//   BRIEF GEORGE pinned at bottom in larger gold per spec.
//
// Typography: every nav text element lands on var(--gy-font-ui)
// (the Phase 28 UI tier — Switzer) at 11 px ALL CAPS,
// letter-spacing 0.15 em, weight 400 per Boss spec.

import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DESTINATIONS } from "@/lib/destinations";

// 2026-05-08 — Boss directive: the €/$/£ switcher is removed from
// the masthead. Reasoning (in his words): MYBA charter contracts
// are signed in EUR; if a visitor sees a converted USD/GBP figure
// and rates move between view and signature, we eat the spread.
// All quoted prices stay denominated in EUR — the EUR-only
// disclaimer lives in the footer. CurrencySwitcher.jsx + the
// CurrencyProvider context stay on disk for any future re-enable.

// Top-level nav items + their dropdowns. Order matters — the spec
// puts CHARTER first (revenue), EXPLORE GREECE second (intent
// builder), ABOUT third (trust). BRIEF GEORGE is rendered separately
// because it's a CTA, not a category.
const NAV_SECTIONS = [
  {
    label: "Charter",
    items: [
      { label: "Private Fleet", href: "/private-fleet" },
      { label: "Explorer Fleet", href: "/explorer-fleet" },
      { label: "View All", href: "/charter-yacht-greece" },
    ],
  },
  {
    label: "Explore Greece",
    items: [
      // Region pages live at /yacht-charter/[region] (slash, NOT
      // dash — that's the per-island route, /yacht-charter-mykonos
      // etc.). Boss spec asks for the four cruising regions, all
      // resolve via this dynamic route.
      { label: "Cyclades", href: "/yacht-charter/cyclades" },
      { label: "Ionian", href: "/yacht-charter/ionian" },
      { label: "Saronic", href: "/yacht-charter/saronic" },
      { label: "Itineraries", href: "/yacht-itineraries-greece" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "About George", href: "/about-us" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

const BRIEF_GEORGE = { label: "Brief George", href: "/inquiry" };

// Shared text style for every nav label — Switzer 11 px ALL CAPS
// 0.15em tracking per Boss spec.
const navLabelStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: "11px",
  fontWeight: 400,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
};

// Single nav item with optional hover dropdown. Pure-CSS hover
// reveal via :hover on .gy-nav-item — no React state per hover, so
// the trigger is instant and the dropdown stays open while the
// cursor traverses the gap between trigger and panel.
//
// `anchor` decides which edge of the trigger the dropdown is pinned
// to: "left" for items on the left half of the nav (CHARTER,
// EXPLORE GREECE), "right" for the items on the right half
// (ABOUT). Stops the panel from clipping off the viewport when the
// trigger sits near an edge — Boss flagged the CHARTER dropdown
// going off-screen on the left under the original centered anchor.
function NavItem({ section, color = "rgba(248, 245, 240,0.85)", anchor = "left" }) {
  const isExplore = section.label === "Explore Greece";
  return (
    <div className={`gy-nav-item gy-nav-item--anchor-${anchor} ${isExplore ? "gy-nav-item--rich" : ""} relative`}>
      <button
        className="gy-nav-item__trigger"
        aria-haspopup="true"
        style={{ ...navLabelStyle, color, cursor: "pointer", background: "transparent", border: 0, padding: "10px 4px" }}
        data-cursor="Menu"
      >
        {section.label}
      </button>
      <div className="gy-nav-item__panel" role="menu">
        {section.items.map((item) => {
          // Boss directive (2026-05-08): the Explore Greece dropdown
          // pulls its copy from DESTINATIONS so the nav surfaces the
          // same editorial language as the homepage Three Greek
          // Worlds section. The "Itineraries" item has no destination
          // record — render it as a plain link.
          const dest =
            isExplore && item.href.startsWith("/yacht-charter/")
              ? DESTINATIONS[item.href.split("/").pop()]
              : null;
          if (dest) {
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="gy-nav-item__rich-link"
                data-cursor="Discover"
              >
                <p className="gy-nav-item__rich-eyebrow">{dest.label.toUpperCase()}</p>
                <p className="gy-nav-item__rich-title">{dest.cardTitle}</p>
                <p className="gy-nav-item__rich-subline">{dest.cardSubline}</p>
                <span className="gy-nav-item__rich-cta">Discover the {dest.label} →</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="gy-nav-item__link"
              style={navLabelStyle}
              data-cursor="View"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function NavDrawerSystem() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const pathname = usePathname();

  // Close mobile overlay on route change (otherwise tapping a link
  // would navigate but leave the overlay visible until next paint).
  useEffect(() => {
    setMobileOpen(false);
    setOpenSection(null);
  }, [pathname]);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Scroll-state for the masthead (transparent → solid black on scroll).
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const isScrolled = y > 50;
      setScrolled(isScrolled);
      document.body.classList.toggle("gy-nav-scrolled", isScrolled);
      document.body.classList.toggle(
        "gy-scrolled",
        y > Math.max(window.innerHeight * 0.4, 280),
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("gy-nav-scrolled");
      document.body.classList.remove("gy-scrolled");
    };
  }, []);

  const navBackground = scrolled ? "#0D1B2A" : "transparent";
  // Reverted 2026-05-08 — Boss kept the original yacht-icon-only.svg
  // lockup. Restored the prior masthead heights it was tuned for.
  const navHeight = scrolled ? 104 : 196;
  const logoHeight = scrolled ? 72 : "clamp(140px, 16.5vw, 220px)";

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeOpenSection = useCallback(() => setOpenSection(null), []);

  return (
    <>
      <nav
        className="gy-nav fixed left-0 w-full px-4 sm:px-6 lg:px-8"
        style={{
          // 2026-05-08 follow-up — pin the nav below the Forbes top
          // bar via the existing --gy-top-offset variable
          // (set to 36 px on desktop / 32 px on mobile when
          // body.gy-with-forbes-bar is active, 0 px otherwise).
          // Without this the fixed nav would render at viewport
          // top:0 BEHIND the Forbes bar, and the currency switcher
          // pinned at top:3 of the nav was bleeding into the
          // Forbes bar's right-side padding gap.
          top: "var(--gy-top-offset, 0px)",
          backgroundColor: navBackground,
          transition: "background-color 0.5s ease, height 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s ease",
          height: `${navHeight}px`,
          paddingTop: scrolled ? "0px" : "12px",
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-between h-full relative">
          {/* MOBILE HAMBURGER — right, only ≤ md. Boss mobile spec
              relocates the hamburger to top-right; logo stays centered.
              Gold #C9A84C, 22 px stroke. The 44 × 44 hit area exceeds
              the WCAG touch-target minimum even though the icon itself
              is 22 px. */}
          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden absolute top-3 right-3 transition-colors flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              color: "#C9A84C",
              zIndex: 35,
            }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            data-cursor="Menu"
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>

          {/* DESKTOP — left cluster: CHARTER + EXPLORE GREECE */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[0]} anchor="left" />
            <NavItem section={NAV_SECTIONS[1]} anchor="left" />
          </div>

          {/* CENTER — logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 shrink-0 group gy-logo-reveal"
            data-cursor="Home"
            style={{ zIndex: 25 }}
          >
            <img
              src="/images/yacht-icon-only.svg"
              alt="George Yachts Brokerage House"
              className="gy-nav-logo group-hover:opacity-80"
              style={{
                height: logoHeight,
                width: "auto",
                transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                filter:
                  "drop-shadow(0 1px 2px rgba(13,27,42,0.85)) drop-shadow(0 8px 22px rgba(13,27,42,0.55))",
              }}
            />
          </Link>

          {/* DESKTOP — right cluster: ABOUT + BRIEF GEORGE CTA */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[2]} anchor="right" />
            <Link
              href={BRIEF_GEORGE.href}
              className="gy-nav-cta"
              style={{
                ...navLabelStyle,
                fontWeight: 500,
                color: "#C9A84C",
                textDecoration: "none",
                padding: "10px 4px",
                whiteSpace: "nowrap",
              }}
              data-cursor="Brief"
            >
              {BRIEF_GEORGE.label} →
            </Link>
          </div>

          {/* Currency switcher removed 2026-05-08 — Boss directive
              (rates always quoted + signed in EUR; conversion liability
              risk if the spread moves between view and contract). */}
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY ─────────────────────────────────
          Boss mobile spec: slide in from right, navy background, 4
          theatrical Cormorant items centered, BRIEF GEORGE 36 px gold
          at bottom, currency row (€/$/£) below the items.
      ──────────────────────────────────────────────────────────── */}
      <div
        className={`gy-nav-overlay fixed inset-0 z-[60] md:hidden ${
          mobileOpen ? "gy-nav-overlay--open" : ""
        }`}
        style={{
          background: "#0D1B2A",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="h-full w-full flex flex-col">
          {/* Header — close × top-right, logo centered top */}
          <div className="relative flex items-center justify-center pt-6 pb-4">
            <Link href="/" onClick={closeMobile} aria-label="Home">
              <img
                src="/images/yacht-icon-only.svg"
                alt="George Yachts"
                style={{ height: 56, width: "auto" }}
              />
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="absolute top-3 right-3 transition-colors flex items-center justify-center"
              style={{ width: 44, height: 44, color: "#C9A84C" }}
              aria-label="Close navigation"
              data-cursor="Close"
            >
              <X style={{ width: 22, height: 22 }} />
            </button>
          </div>

          {/* Centered nav items — Cormorant Light 32 px theatrical */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
            {NAV_SECTIONS.map((section) => {
              const expanded = openSection === section.label;
              return (
                <div key={section.label} className="w-full max-w-md text-center">
                  <button
                    type="button"
                    onClick={() => setOpenSection(expanded ? null : section.label)}
                    className="block w-full transition-colors"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300,
                      fontSize: "32px",
                      letterSpacing: "-0.005em",
                      color: expanded ? "#C9A84C" : "#FFFFFF",
                      padding: "14px 0",
                      minHeight: 56,
                    }}
                    aria-expanded={expanded}
                  >
                    {section.label}
                  </button>
                  {expanded && (
                    <div className="flex flex-col items-center gap-4 pt-1 pb-3">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="transition-colors"
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: "12px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            fontWeight: 300,
                            color: "rgba(248,245,240,0.7)",
                            padding: "8px 0",
                            minHeight: 44,
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* BRIEF GEORGE — gold, 36 px Cormorant per Boss spec */}
          <div className="px-6 pb-6 pt-4">
            <Link
              href={BRIEF_GEORGE.href}
              onClick={closeMobile}
              className="block w-full text-center transition-colors"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "36px",
                letterSpacing: "-0.005em",
                color: "#C9A84C",
                padding: "16px",
                textDecoration: "none",
                minHeight: 56,
              }}
              data-cursor="Brief"
            >
              {BRIEF_GEORGE.label} →
            </Link>
          </div>

          {/* Currency row removed 2026-05-08 — see masthead note above.
              The mobile overlay closes with a slim ivory rule + bottom
              padding so the BRIEF GEORGE CTA remains the visual close. */}
          <div className="px-6 pb-10 pt-2" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        /* Mobile overlay — slide-in from right per Boss spec. */
        .gy-nav-overlay {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .gy-nav-overlay--open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-nav-overlay {
            transition: opacity 0.2s ease;
            transform: none;
          }
        }

        /* Chapter 02 — desktop hover dropdown.
           The trigger has bottom padding so the cursor crosses the
           panel without unhovering. Anchor flips to LEFT for items
           on the left half of the masthead (CHARTER, EXPLORE
           GREECE) and RIGHT for items on the right half (ABOUT) so
           panels never clip off the viewport edge. Boss flagged
           the original centered anchor pushing the CHARTER panel
           negative-x at narrow widths. */
        .gy-nav-item__panel {
          position: absolute;
          top: calc(100% + 4px);
          min-width: 220px;
          padding: 18px 24px;
          background: rgba(13, 27, 42, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(201, 168, 76, 0.18);
          opacity: 0;
          pointer-events: none;
          transition: opacity 220ms ease, transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 40;
          transform: translateY(-4px);
        }
        .gy-nav-item--anchor-left  .gy-nav-item__panel { left: 0; right: auto; }
        .gy-nav-item--anchor-right .gy-nav-item__panel { right: 0; left: auto; }
        .gy-nav-item:hover .gy-nav-item__panel,
        .gy-nav-item:focus-within .gy-nav-item__panel {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .gy-nav-item__link {
          color: rgba(248, 245, 240, 0.78);
          padding: 4px 0;
          white-space: nowrap;
          text-decoration: none;
          transition: color 200ms ease, padding-left 200ms ease;
        }
        .gy-nav-item__link:hover {
          color: #C9A84C;
          padding-left: 6px;
        }

        /* Explore Greece dropdown — rich editorial cards using
           DESTINATIONS data so the nav surfaces the same copy as
           the homepage Three Greek Worlds section. Wider panel,
           per-item gap, vertical layout per card. */
        .gy-nav-item--rich .gy-nav-item__panel {
          min-width: 360px;
          padding: 22px 24px;
          gap: 18px;
        }
        .gy-nav-item__rich-link {
          display: block;
          padding: 12px 4px;
          text-decoration: none;
          border-top: 1px solid rgba(201, 168, 76, 0.10);
          transition: padding-left 220ms ease;
        }
        .gy-nav-item__rich-link:first-child {
          border-top: 0;
        }
        .gy-nav-item__rich-link:hover {
          padding-left: 6px;
        }
        .gy-nav-item__rich-eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C9A84C;
          margin: 0 0 6px;
        }
        .gy-nav-item__rich-title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 22px;
          line-height: 1.15;
          color: #F8F5F0;
          margin: 0 0 6px;
          letter-spacing: -0.005em;
        }
        .gy-nav-item__rich-subline {
          font-family: var(--gy-font-ui);
          font-weight: 300;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(248, 245, 240, 0.6);
          margin: 0 0 10px;
        }
        .gy-nav-item__rich-cta {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A84C;
        }
        .gy-nav-item__rich-link:hover .gy-nav-item__rich-cta {
          color: #F8F5F0;
        }
        .gy-nav-item__trigger:hover,
        .gy-nav-item:hover .gy-nav-item__trigger {
          color: #C9A84C !important;
        }
        .gy-nav-cta:hover {
          color: #ffffff !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-nav-item__panel { transition: opacity 120ms ease; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
