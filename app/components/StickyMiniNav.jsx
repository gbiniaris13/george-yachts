"use client";

// A2 — Sticky mini-nav.
//
// After the visitor scrolls past the hero (> 600px) a thin gold-
// accented bar slides down under the main nav with quick anchors
// to the home page's key sections. Current section is highlighted
// via IntersectionObserver so it tracks scroll position.
//
// Mounted from HomeClient (home page only). The sibling sections
// just need matching ids — see HomeClient for the anchor wrappers.
//
// Mobile: the bar becomes a horizontally-scrollable chip strip so
// the six anchors fit below 400px without wrapping.

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "fleet", label: "Fleet" },
  { id: "signature", label: "Signature" },
  { id: "how", label: "How it works" },
  { id: "map", label: "Waters" },
  { id: "filotimo", label: "Filotimo" },
  { id: "contact", label: "Contact" },
];

const REVEAL_AFTER = 600;

export default function StickyMiniNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(null);
  const barRef = useRef(null);

  // Reveal / hide on scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track current section
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter(Boolean);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose top is closest to (but not past) the
        // mini-nav bottom edge — that's what's "in focus" right now.
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]) {
          setActive(visibleEntries[0].target.id);
        }
      },
      {
        // Account for main nav (72px) + mini-nav (44px) stacked up top
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const jumpTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // Offset for the stacked nav so the section heading isn't hidden
    const y = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({
      top: y,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
        ?.matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div
      ref={barRef}
      aria-label="Section navigation"
      className="fixed left-0 right-0 z-40"
      style={{
        // Tier 1.1 (Forbes brief): when the Forbes top bar is present,
        // it adds 36px (32px mobile) at the top via --gy-top-offset.
        // We sit 72px below that so the mini-nav stacks correctly
        // under both the main nav and the Forbes ribbon.
        top: "calc(72px + var(--gy-top-offset, 0px))",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "transform 0.45s cubic-bezier(0.2,0.8,0.2,1), opacity 0.35s ease",
        background: "rgba(13, 27, 42, 0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        borderBottom: "1px solid rgba(201,168,76,0.28)",
      }}
    >
      {/* Phase 27 (Forbes-launch eve, 2026-05-05) — Boss flagged the
          mini-nav was rendering with broken hyphenation on iPhone:
          "SIG-NA-TURE", "FILO-TIMO", "WA-TERS". Root cause: flex
          children default to flex-shrink:1, so on a 390px iPhone the
          row's natural width (>700px with letter-spacing 0.28em) was
          being squeezed and Safari iOS hyphens kicked in. Fix: pin
          each item with shrink-0 + min-width:max-content so the row
          stays at its natural width and overflow-x:auto handles the
          horizontal scroll on small screens. */}
      <nav
        className="max-w-[1200px] mx-auto px-4 md:px-8 overflow-x-auto gy-mini-nav-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="flex items-center gap-2 md:gap-2 py-2 md:justify-center">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} style={{ flexShrink: 0 }}>
                <a
                  href={`#${s.id}`}
                  onClick={jumpTo(s.id)}
                  className="inline-block px-3 md:px-4 py-1.5 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: isActive
                      ? "#C9A84C"
                      : "rgba(248, 245, 240,0.55)",
                    borderBottom: `1px solid ${
                      isActive ? "#C9A84C" : "transparent"
                    }`,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    hyphens: "none",
                    WebkitHyphens: "none",
                  }}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <style jsx>{`
        nav::-webkit-scrollbar {
          display: none;
        }
        /* Mobile: tighten letter-spacing further so the row reads as a
           single deliberate horizontal scroll instead of squeezed text. */
        @media (max-width: 480px) {
          .gy-mini-nav-scroll a {
            letter-spacing: 0.18em !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
