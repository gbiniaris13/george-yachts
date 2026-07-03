"use client";

// StickyInquiryBar - Phase 7 Round 22 (2026-05-12).
// Brief: technical brief Priority 1A.
//
// Bottom-fixed inquiry bar that surfaces after 40% scroll on all
// programmatic pages (islands, comparisons, glossary, reports,
// articles, anchorages). Two CTAs: WhatsApp + Calendly. Dismissible
// for 24 hours via localStorage.
//
// Why: 339 programmatic pages now exist but the visitor on a deep
// page (e.g. /glossary/apa) has no persistent conversion path
// without scrolling all the way to the page CTA. This bar puts a
// one-tap path to George within thumb-reach permanently.
//
// Coexists with WhatsAppButton (bottom-right FAB). The Sticky Bar
// is a full-width strip. WhatsAppButton is hidden when Sticky Bar
// is visible to avoid stacked CTAs in the same eye-line.

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const STORAGE_KEY = "gy_sticky_inquiry_dismissed_at";
const DISMISS_LOCK_MS = 24 * 60 * 60 * 1000; // 24 hours

// Brief-specified Athens number for the new Sticky Bar. The existing
// WhatsAppButton (auto-greeting FAB) keeps its US Miami number for
// continuity of analytics; Boss can consolidate later.
const WA_NUMBER = "17867988798"; // company WhatsApp Business (US)
const CALENDLY_URL = "https://calendly.com/george-georgeyachts/30min";

// Paths where the bar must NEVER show.
// Homepage has its own StickyFleetCTA. Conversion pages (inquiry,
// contact) already have full forms. Admin / API / auth flows.
const EXCLUDED_PATH_PREFIXES = [
  "/inquiry",
  "/contact",
  "/admin",
  "/api",
  "/checkout",
  "/sign-in",
  "/sign-up",
  "/partner-portal",
  "/studio",
];

function isExcludedPath(pathname) {
  if (!pathname) return true;
  if (pathname === "/") return true;
  return EXCLUDED_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

// Context-aware copy based on which programmatic family the visitor
// is on. The brief specified these patterns explicitly.
function getContextualCopy(pathname) {
  // Island pages -> island-specific
  const islandMatch = pathname.match(
    /^\/yacht-charter-([a-z][a-z-]*?)(?:-anchorages|-vs-|-\d|$)/
  );
  if (islandMatch && !pathname.includes("-vs-")) {
    const slug = islandMatch[1];
    const nice = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return `Considering ${nice}? George is online.`;
  }

  if (pathname.startsWith("/greek-yacht-charter-vs-")) {
    return "Still comparing? Get George's honest take.";
  }

  if (pathname.startsWith("/glossary")) {
    return "Questions about a Greek charter? Ask George directly.";
  }

  if (
    pathname.startsWith("/market-reports") ||
    pathname.includes("market-retrospective") ||
    pathname.includes("market-check") ||
    pathname.includes("season-forecast")
  ) {
    return "Want the numbers for your specific charter? Speak with George.";
  }

  if (
    pathname.includes("pricing-guide") ||
    pathname.includes("uhnw-yacht-charter-trends") ||
    pathname.includes("large-groups")
  ) {
    return "Ready to plan your Greek charter? Talk to George.";
  }

  if (pathname.startsWith("/about/george")) {
    return "Want to speak with George directly?";
  }

  if (pathname.startsWith("/blog/")) {
    return "Got a follow-up question? Ask George.";
  }

  return "Planning a Greek charter? Let's talk.";
}

export default function StickyInquiryBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  // Dismissed check on mount + path change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_LOCK_MS) {
        setDismissed(true);
        return;
      }
    } catch {
      // private browsing - continue without guard
    }
    setDismissed(false);
    setVisible(false);
  }, [pathname]);

  // Scroll detection - surface after 40% of page scrolled.
  useEffect(() => {
    if (dismissed) return;
    if (isExcludedPath(pathname)) return;

    function handleScroll() {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const percent = (scrolled / total) * 100;
      if (percent >= 40) {
        setVisible(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, dismissed]);

  // Hide existing WhatsAppButton FAB when bar is visible to avoid
  // duplicate CTAs in the same eye-line. We use a global class on
  // body that the WhatsAppButton respects (see CSS at bottom).
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible && !dismissed) {
      document.body.classList.add("gy-sticky-bar-active");
    } else {
      document.body.classList.remove("gy-sticky-bar-active");
    }
    return () => {
      try {
        document.body.classList.remove("gy-sticky-bar-active");
      } catch {}
    };
  }, [visible, dismissed]);

  const handleDismiss = (e) => {
    e?.stopPropagation?.();
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
    setVisible(false);
    setDismissed(true);
  };

  const trackClick = (channel) => {
    try {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "sticky_inquiry_click", {
          channel,
          page_path: pathname,
        });
      }
    } catch {}
  };

  if (!visible || dismissed || isExcludedPath(pathname)) return null;

  const copy = getContextualCopy(pathname);
  const pageTitle =
    typeof document !== "undefined" && document.title
      ? document.title.replace(/\s*\|\s*George Yachts.*$/, "").trim()
      : "your page";
  const waText = `Hi George, I was reading your "${pageTitle}" page and have a question.`;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <div
        role="region"
        aria-label="Inquiry bar"
        className="gy-sticky-inquiry-bar"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 49,
          background: `linear-gradient(180deg, rgba(13, 27, 42, 0.94) 0%, rgba(13, 27, 42, 0.98) 100%)`,
          borderTop: `1px solid rgba(201, 168, 76, 0.35)`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 -8px 32px rgba(13, 27, 42, 0.4)",
          padding: "14px 20px",
          animation: "gy-sticky-bar-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                margin: "0 0 4px",
              }}
            >
              George Yachts
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 15,
                fontWeight: 300,
                color: CREAM,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {copy}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("whatsapp")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "11px 18px",
                background: GOLD,
                color: NAVY,
                textDecoration: "none",
                border: `1px solid ${GOLD}`,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
              </svg>
              <span>WhatsApp</span>
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("calendly")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "11px 18px",
                background: "transparent",
                color: GOLD,
                border: `1px solid ${GOLD}`,
                textDecoration: "none",
              }}
            >
              <span>30 min call</span>
            </a>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss inquiry bar"
              style={{
                background: "transparent",
                border: "1px solid rgba(248, 245, 240, 0.18)",
                color: "rgba(248, 245, 240, 0.55)",
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gy-sticky-bar-in {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 600px) {
          .gy-sticky-inquiry-bar {
            padding: 12px 14px !important;
          }
          .gy-sticky-inquiry-bar a {
            font-size: 10px !important;
            letter-spacing: 0.22em !important;
            padding: 10px 14px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gy-sticky-inquiry-bar {
            animation: none !important;
          }
        }
        /* Coordination with WhatsAppButton FAB: hide the floating
           WhatsApp button when the sticky bar is visible so we do
           not show duplicate CTAs in the same eye-line. */
        body.gy-sticky-bar-active a[aria-label="Contact us on WhatsApp"] {
          display: none !important;
        }
      `}</style>
    </>
  );
}
