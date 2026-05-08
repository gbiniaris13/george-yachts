"use client";

// Chapter 02 (Boss-spec nav rebuild, 2026-05-08) — full rewrite.
//
// Replaces the prior 4-bucket / 18-link hamburger drawer + 5-icon
// right cluster (search / currency / language / Instagram / LinkedIn
// / favorites) with a Burgess/Aman-tier 4-item top nav:
//
//   CHARTER          (dropdown: Private Fleet · Explorer Fleet · View All)
//   EXPLORE GREECE   (dropdown: Cyclades · Ionian · Saronic · Sporades · Itineraries)
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
import CurrencySwitcher from "./CurrencySwitcher";

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
      { label: "Sporades", href: "/yacht-charter/sporades" },
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
function NavItem({ section, color = "rgba(255,255,255,0.85)" }) {
  return (
    <div className="gy-nav-item relative">
      <button
        className="gy-nav-item__trigger"
        aria-haspopup="true"
        style={{ ...navLabelStyle, color, cursor: "pointer", background: "transparent", border: 0, padding: "10px 4px" }}
        data-cursor="Menu"
      >
        {section.label}
      </button>
      <div className="gy-nav-item__panel" role="menu">
        {section.items.map((item) => (
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
        ))}
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

  const navBackground = scrolled ? "#000000" : "transparent";
  const navHeight = scrolled ? 92 : 168;
  const logoHeight = scrolled ? 56 : "clamp(96px, 14vw, 156px)";

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeOpenSection = useCallback(() => setOpenSection(null), []);

  return (
    <>
      <nav
        className="gy-nav fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: navBackground,
          transition: "background-color 0.5s ease, height 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s ease",
          height: `${navHeight}px`,
          paddingTop: scrolled ? "0px" : "12px",
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-between h-full relative">
          {/* MOBILE HAMBURGER — left, only ≤ md */}
          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden p-3 text-white hover:text-[#C9A84C] transition-colors"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            data-cursor="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* DESKTOP — left cluster: CHARTER + EXPLORE GREECE */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[0]} />
            <NavItem section={NAV_SECTIONS[1]} />
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
              className="group-hover:opacity-80"
              style={{
                height: logoHeight,
                width: "auto",
                transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                filter: "drop-shadow(0 4px 18px rgba(218,165,32,0.18))",
              }}
            />
          </Link>

          {/* DESKTOP — right cluster: ABOUT + BRIEF GEORGE CTA */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[2]} />
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

          {/* RIGHT — currency switcher (tiny corner pip) */}
          <div className="absolute right-3 top-3 md:right-4 md:top-3" style={{ zIndex: 30 }}>
            <CurrencySwitcher compact={true} />
          </div>

          {/* MOBILE-only spacer to balance the hamburger on the left
              so the centered logo stays optically centred. */}
          <div className="md:hidden w-11" aria-hidden="true" />
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY ─────────────────────────────────
          Boss spec: dark navy background, 4 items centered vertically,
          BRIEF GEORGE at bottom in larger gold. Inline-expandable
          sub-items per section (tap → reveal sub-items).
      ──────────────────────────────────────────────────────────── */}
      <div
        className={`gy-nav-overlay fixed inset-0 z-[60] transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(180deg, #050a14 0%, #0a1628 100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="h-full w-full flex flex-col">
          {/* Header — close button + tiny logo */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <Link href="/" onClick={closeMobile} aria-label="Home">
              <img
                src="/images/yacht-icon-only.svg"
                alt="George Yachts"
                style={{ height: 40, width: "auto" }}
              />
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="p-3 text-white hover:text-[#C9A84C] transition-colors"
              aria-label="Close navigation"
              data-cursor="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered nav items */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {NAV_SECTIONS.map((section) => {
              const expanded = openSection === section.label;
              return (
                <div key={section.label} className="w-full max-w-md text-center">
                  <button
                    type="button"
                    onClick={() => setOpenSection(expanded ? null : section.label)}
                    className="block w-full text-white hover:text-[#C9A84C] transition-colors"
                    style={{
                      ...navLabelStyle,
                      fontSize: "16px",
                      letterSpacing: "0.22em",
                      padding: "14px 0",
                    }}
                    aria-expanded={expanded}
                  >
                    {section.label}
                  </button>
                  {expanded && (
                    <div className="flex flex-col items-center gap-4 pt-3 pb-4">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="text-white/70 hover:text-[#C9A84C] transition-colors"
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: "12px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            fontWeight: 300,
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

          {/* BRIEF GEORGE — bottom, gold, larger per Boss spec */}
          <div className="px-6 pb-10 pt-6 border-t border-white/[0.06]">
            <Link
              href={BRIEF_GEORGE.href}
              onClick={closeMobile}
              className="block w-full text-center"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: "18px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#C9A84C",
                padding: "18px",
                border: "1px solid #C9A84C",
                textDecoration: "none",
              }}
              data-cursor="Brief"
            >
              {BRIEF_GEORGE.label} →
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Chapter 02 — desktop hover dropdown.
           The trigger has bottom padding so the cursor crosses the
           panel without unhovering. The panel slides in from
           translateY(-4px) over 220 ms when its parent .gy-nav-item
           is hovered or focus-within. */
        .gy-nav-item__panel {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          min-width: 220px;
          padding: 18px 24px;
          background: rgba(8, 14, 24, 0.94);
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
        }
        .gy-nav-item:hover .gy-nav-item__panel,
        .gy-nav-item:focus-within .gy-nav-item__panel {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .gy-nav-item__link {
          color: rgba(255, 255, 255, 0.78);
          padding: 4px 0;
          white-space: nowrap;
          text-decoration: none;
          transition: color 200ms ease, padding-left 200ms ease;
        }
        .gy-nav-item__link:hover {
          color: #C9A84C;
          padding-left: 6px;
        }
        .gy-nav-item__trigger:hover,
        .gy-nav-item:hover .gy-nav-item__trigger {
          color: #C9A84C !important;
        }
        .gy-nav-cta:hover {
          color: #ffffff !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-nav-item__panel { transition: opacity 120ms ease; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
