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
        top: "72px", // sits right under the main nav's collapsed height
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "transform 0.45s cubic-bezier(0.2,0.8,0.2,1), opacity 0.35s ease",
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(218,165,32,0.12)",
        borderBottom: "1px solid rgba(218,165,32,0.28)",
      }}
    >
      <nav
        className="max-w-[1200px] mx-auto px-4 md:px-8 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="flex items-center gap-1 md:gap-2 py-2 md:justify-center whitespace-nowrap">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={jumpTo(s.id)}
                  className="inline-block px-3 md:px-4 py-1.5 transition-colors duration-300"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: isActive
                      ? "#DAA520"
                      : "rgba(255,255,255,0.55)",
                    borderBottom: `1px solid ${
                      isActive ? "#DAA520" : "transparent"
                    }`,
                    cursor: "pointer",
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
      `}</style>
    </div>
  );
}
