"use client";

// Chapter 02 (Boss-spec nav rebuild, 2026-05-08) — full rewrite.
//
// Replaces the prior 4-bucket / 18-link hamburger drawer + 5-icon
// right cluster (search / currency / language / Instagram / LinkedIn
// / favorites) with a Burgess/Aman-tier 4-item top nav:
//
//   CHARTER          (dropdown: Private Fleet · Sailing Fleet · View All)
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
      { label: "Sailing Fleet", href: "/explorer-fleet" },
      // 2026-07-03 (Wave 2) — the two head terms George is chasing
      // get the heaviest link on the site: the main nav. Crewed is
      // the flagship guide (built 2026-07-02); Catamarans is the
      // biggest-volume query we track.
      // 2026-08-21 (section 9). This read "Crewed Charter" and sat between two
      // fleet listings, so a visitor clicking it expected boats and arrived at
      // a guide with nine cards on it. The word stays in the anchor because
      // this is the heaviest internal link the head term gets and the anchor
      // text carries; what is added is the part that sets the expectation.
      { label: "Crewed Charter, Explained", href: "/crewed-yacht-charter-greece" },
      { label: "Catamarans", href: "/catamaran-charter-greece" },
      { label: "View All", href: "/charter-yacht-greece" },
    ],
  },
  {
    label: "Explore Greece",
    items: [
      // 2026-05-12 — region pages were moved from /yacht-charter/[region]
      // to /destinations/[region] on 2026-05-08 (Boss screenshot flag
      // re. brand consistency; see next.config.mjs redirects). Old URLs
      // still 301-redirect but pointing the NavDrawer at canonical
      // saves the extra roundtrip on every click.
      { label: "Cyclades", href: "/destinations/cyclades" },
      { label: "Ionian", href: "/destinations/ionian" },
      { label: "Saronic", href: "/destinations/saronic" },
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
function NavItem({ section, color = "rgba(248, 245, 240,0.85)", anchor = "left", isOpen = false, onEnter, onLeave }) {
  const isExplore = section.label === "Explore Greece";
  return (
    <div
      className={`gy-nav-item gy-nav-item--anchor-${anchor} ${isExplore ? "gy-nav-item--rich" : ""} ${isOpen ? "is-open" : ""} relative`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        className="gy-nav-item__trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onFocus={onEnter}
        style={{ ...navLabelStyle, color, cursor: "pointer", background: "transparent", border: 0, padding: "10px 4px" }}
        data-cursor="Menu"
      >
        {section.label}
      </button>
      {/* React-controlled visibility (inline so it is correct at first paint,
          which kills the dropdown-flash FOUC; one open at a time so opening
          another closes this one). */}
      <div
        className="gy-nav-item__panel"
        role="menu"
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
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
  const [openDesktop, setOpenDesktop] = useState(null);
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
      // Close any open desktop dropdown on scroll so it never floats over
      // the page when the cursor hasn't moved off the trigger.
      setOpenDesktop(null);
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
  //
  // 2026-08-20 (design pass, job 13) — unscrolled was 196. Measured on a
  // 1440x900 desktop that put the masthead bottom at 232 px with the Forbes
  // bar, a quarter of the viewport (25.8%) before a visitor saw anything.
  //
  // 100 of those 196 px were air: the tallest thing in the row is the logo
  // at 96, and the menu labels are 39. The old number was sized around the
  // pre-job-12 lockup, which was half blank canvas and needed a taller box
  // to read at all. That reason is gone.
  //
  // 156 is not a round number picked by eye. It leaves 24 px under the logo,
  // which is exactly the clearance the SCROLLED state already has (104 tall,
  // 56 logo, centred). So the logo keeps the same relationship to the bottom
  // edge in both states and appears to shrink in place instead of jumping.
  // The extra 12 px on top (from paddingTop below) holds the masthead off
  // the Forbes bar. 140 was tried and read cramped against that bar.
  //
  // The scrolled height is deliberately untouched: it was never the
  // complaint, and it is what the anchor scroll-margins are tuned to
  // (104 + 36 Forbes = 140, and scroll-margin-top is 176, a 36 px gap).
  const navHeight = scrolled ? 104 : 156;
  // Stage 2 (George): unscrolled logo was up to 220px - TALLER than the
  // 196px nav, so it overflowed downward and the wordmark collided with the
  // hero H1 on desktop. Trimmed so it sits within the masthead. Paired with
  // a small hero content paddingTop (VideoSection) so the H1 clears it.
  // 2026-08-19 (design pass, job 12) — was 72 / clamp(120px, 13vw, 180px).
  //
  // Those numbers were sized around an image that was half empty. The old
  // asset carried 50% blank canvas above the mark, so a 180px box drew an
  // 80px mark and a 36px box on a phone drew a 16px one.
  //
  // The replacement is cropped to the mark, so at 96px it draws 84px: taller
  // than the old 180px box managed, in a box that takes up half the room.
  // That is what makes "left" and "larger" possible at the same time, which
  // they otherwise are not: a logo standing in the nav row beside 11px menu
  // type cannot also be 158px tall.
  const logoHeight = scrolled ? 56 : "clamp(64px, 7vw, 96px)";

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
          {/* MOBILE HAMBURGER, right, only ≤ md. Boss mobile spec
              relocates the hamburger to top-right; logo stays centered.
              Gold #DAA110, 22 px stroke. The 44 × 44 hit area exceeds
              the WCAG touch-target minimum even though the icon itself
              is 22 px. */}
          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden absolute top-3 right-3 transition-colors flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              color: "#DAA110",
              zIndex: 35,
            }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            data-cursor="Menu"
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>

          {/* DESKTOP, left cluster: CHARTER + EXPLORE GREECE */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[0]} anchor="left" isOpen={openDesktop === NAV_SECTIONS[0].label} onEnter={() => setOpenDesktop(NAV_SECTIONS[0].label)} onLeave={() => setOpenDesktop(null)} />
            <NavItem section={NAV_SECTIONS[1]} anchor="left" isOpen={openDesktop === NAV_SECTIONS[1].label} onEnter={() => setOpenDesktop(NAV_SECTIONS[1].label)} onLeave={() => setOpenDesktop(null)} />
            <Link
              href="/blog"
              className="gy-nav-item__trigger"
              style={{ ...navLabelStyle, color: "rgba(248, 245, 240,0.85)", textDecoration: "none", padding: "10px 4px" }}
              data-cursor="Read"
              onMouseEnter={() => setOpenDesktop(null)}
            >
              Journal
            </Link>
          </div>

          {/* LEFT, logo — 2026-08-19 (job 12). It was centred and absolutely
              positioned, floating over a row whose two clusters sat either side
              of it. It is now the first item IN the row, where George asked for
              it to be. */}
          <Link
            href="/"
            className="order-first shrink-0 group gy-logo-reveal"
            data-cursor="Home"
            style={{ zIndex: 25 }}
          >
            {/* 2026-08-19 (job 3) - yacht-icon-only.svg was 702 KB of two stacked
                2026-08-19 (job 12) - and now cropped to the mark. Half of that
                file was blank canvas above the logo, which is why it always
                looked smaller than the space it took up. 98 KB, and the
                mark is twice the size per pixel of height.
                PNGs pretending to be a vector. Same pixels, 96 KB. See Footer.jsx. */}
            {/* 2026-08-21 - WebP with a PNG fallback. Measured on a throttled
              phone this file took 3,759 ms and was competing with the LCP
              image for the same pipe: 99 KB of PNG for a mark that is 39 KB
              as WebP, identical pixels. Every browser that matters has
              supported WebP since 2020; the <source> is skipped by anything
              older and the PNG below still serves it. */}
            <picture>
              <source srcSet="/images/yacht-logo-tight-300.webp" type="image/webp" />
              <img
                src="/images/yacht-logo-tight-300.png"
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
            </picture>
          </Link>

          {/* DESKTOP, right cluster: ABOUT + BRIEF GEORGE CTA */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem section={NAV_SECTIONS[2]} anchor="right" isOpen={openDesktop === NAV_SECTIONS[2].label} onEnter={() => setOpenDesktop(NAV_SECTIONS[2].label)} onLeave={() => setOpenDesktop(null)} />
            <Link
              href={BRIEF_GEORGE.href}
              className="gy-nav-cta"
              style={{
                ...navLabelStyle,
                fontWeight: 500,
                color: "#DAA110",
                textDecoration: "none",
                padding: "10px 4px",
                whiteSpace: "nowrap",
              }}
              data-cursor="Brief"
            >
              {BRIEF_GEORGE.label} →
            </Link>
          </div>

          {/* Currency switcher removed 2026-05-08, Boss directive
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
          {/* Header, close × top-right, logo centered top */}
          <div className="relative flex items-center justify-center pt-6 pb-4">
            <Link href="/" onClick={closeMobile} aria-label="Home">
              {/* 2026-08-19 (job 12) - same cropped asset as the nav and the footer.
                  At 56px the old file drew a 25px mark; this one draws 49px in the
                  same box, which is the whole point of cutting the blank half out. */}
              {/* 2026-08-21 - WebP with a PNG fallback. Measured on a throttled
                phone this file took 3,759 ms and was competing with the LCP
                image for the same pipe: 99 KB of PNG for a mark that is 39 KB
                as WebP, identical pixels. Every browser that matters has
                supported WebP since 2020; the <source> is skipped by anything
                older and the PNG below still serves it. */}
              <picture>
                <source srcSet="/images/yacht-logo-tight-300.webp" type="image/webp" />
                <img
                  src="/images/yacht-logo-tight-300.png"
                  alt="George Yachts"
                  style={{ height: 56, width: "auto" }}
                />
              </picture>
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="absolute top-3 right-3 transition-colors flex items-center justify-center"
              style={{ width: 44, height: 44, color: "#DAA110" }}
              aria-label="Close navigation"
              data-cursor="Close"
            >
              <X style={{ width: 22, height: 22 }} />
            </button>
          </div>

          {/* Centered nav items, Cormorant Light 32 px theatrical */}
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
                      fontFamily: "var(--gy-font-editorial)",
                      fontWeight: 300,
                      fontSize: "32px",
                      letterSpacing: "-0.005em",
                      color: expanded ? "#DAA110" : "#FFFFFF",
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
                            color: "rgba(248,245,240,0.78)",
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
            {/* Journal / blog, top-level link, no dropdown */}
            <div className="w-full max-w-md text-center">
              <Link
                href="/blog"
                onClick={closeMobile}
                className="block w-full transition-colors"
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontWeight: 300,
                  fontSize: "32px",
                  letterSpacing: "-0.005em",
                  color: "#FFFFFF",
                  padding: "14px 0",
                  minHeight: 56,
                }}
              >
                Journal
              </Link>
            </div>
          </div>

          {/* BRIEF GEORGE, gold, 36 px Cormorant per Boss spec */}
          <div className="px-6 pb-6 pt-4">
            <Link
              href={BRIEF_GEORGE.href}
              onClick={closeMobile}
              className="block w-full text-center transition-colors"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontWeight: 300,
                fontSize: "36px",
                letterSpacing: "-0.005em",
                color: "#DAA110",
                padding: "16px",
                textDecoration: "none",
                minHeight: 56,
              }}
              data-cursor="Brief"
            >
              {BRIEF_GEORGE.label} →
            </Link>
          </div>

          {/* Currency row removed 2026-05-08, see masthead note above.
              The mobile overlay closes with a slim ivory rule + bottom
              padding so the BRIEF GEORGE CTA remains the visual close. */}
          <div className="px-6 pb-10 pt-2" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        /* Mobile overlay - slide-in from right per Boss spec. */
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

        /* Chapter 02 - desktop hover dropdown.
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
          border: 1px solid rgba(218, 161, 16, 0.18);
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
          color: rgba(248,245,240,0.85);
          padding: 4px 0;
          white-space: nowrap;
          text-decoration: none;
          transition: color 200ms ease, padding-left 200ms ease;
        }
        .gy-nav-item__link:hover {
          color: #DAA110;
          padding-left: 6px;
        }

        /* Explore Greece dropdown - rich editorial cards using
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
          border-top: 1px solid rgba(218, 161, 16, 0.10);
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
          color: #DAA110;
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
          color: rgba(248,245,240,0.66);
          margin: 0 0 10px;
        }
        .gy-nav-item__rich-cta {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #DAA110;
        }
        .gy-nav-item__rich-link:hover .gy-nav-item__rich-cta {
          color: #F8F5F0;
        }
        .gy-nav-item__trigger:hover,
        .gy-nav-item:hover .gy-nav-item__trigger {
          color: #DAA110 !important;
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
