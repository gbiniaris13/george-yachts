"use client";

// Move #2 — split-screen fleet showcase.
//
// Replaces the old 2-card boxy CTA strip with a full-viewport
// editorial diptych:
//   • Left panel:  Private Fleet (cinematic yacht hero image)
//   • Right panel: Explorer Fleet (cinematic yacht hero image)
//   • Hover a panel → the OTHER panel darkens to 40%, the active
//     panel zooms 1.05× and its overlay lifts from 55% to 25%.
//   • Subtle gold diagonal seam between the two panels on desktop.
//   • Mobile stacks vertically with a horizontal gold divider.
//
// Keeps the same URLs (/private-fleet, /explorer-fleet) so the
// behaviour downstream is identical — it's only the entrance
// experience that gets upgraded.

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

const fmtK = (n) => (n >= 1000 ? `€${Math.round(n / 1000)}K` : `€${n.toLocaleString()}`);

// Panel arrow icon, re-used in both panels.
function ArrowLine() {
  return (
    <svg
      width="22"
      height="10"
      viewBox="0 0 22 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="translate-y-[0.5px] transition-transform duration-500 group-hover:translate-x-2"
    >
      <line x1="0" y1="5" x2="20" y2="5" />
      <polyline points="15 1 21 5 15 9" />
    </svg>
  );
}

function FleetPanel({
  href,
  collectionLabel,
  name,
  priceLine,
  descriptor,
  footer,
  image,
  gradientFallback,
  ctaLabel,
}) {
  return (
    <Link
      href={href}
      className="group gy-fleet-panel relative block flex-1 min-h-[50dvh] md:min-h-[100dvh] overflow-hidden"
    >
      {/* Background image (or dark-tinted gradient fallback). Zoom on hover. */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        style={{
          backgroundImage: image
            ? `url(${image})`
            : gradientFallback,
          backgroundColor: "#0D1B2A",
        }}
      />

      {/* Dark overlay — heavier by default, lifts on hover to reveal the image. */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-700" />

      {/* Subtle vertical gold glow from bottom on hover (creates depth). */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(218,165,32,0.10), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[50dvh] md:min-h-[100dvh] flex flex-col items-center justify-center px-8 py-16 text-center">
        {/* Collection label */}
        <p
          className="text-[#DAA520]/80 text-[9px] mb-8"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {collectionLabel}
        </p>

        {/* Name — Cormorant Garamond editorial */}
        <h2
          className="text-white mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 76px)",
            fontWeight: 200,
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          {name}
        </h2>

        {/* Price line */}
        <p
          className="text-[#DAA520] mb-5"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(11px, 1.3vw, 13px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {priceLine}
        </p>

        {/* Descriptor (italic serif, ivory/60) */}
        <p
          className="text-white/60 italic mb-12 max-w-xs"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(14px, 1.5vw, 18px)",
            lineHeight: 1.5,
          }}
        >
          {descriptor}
        </p>

        {/* CTA — inline gold-on-hover with sliding arrow */}
        <span
          className="group inline-flex items-center gap-3 text-white/70 group-hover:text-[#DAA520] transition-colors duration-500 pb-1 border-b border-white/20 group-hover:border-[#DAA520]"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>{ctaLabel}</span>
          <ArrowLine />
        </span>

        {/* Bottom-right footer (yacht count + length range) */}
        {footer && (
          <p
            className="absolute bottom-10 text-white/35"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            {footer}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function FleetCTAs({
  privateRange = { low: 13000, high: 180000 },
  explorerRange = { low: 420, high: 1800 },
  privateHeroImage = null,
  explorerHeroImage = null,
  privateCount = 0,
  explorerCount = 0,
}) {
  // Future i18n strings live in the hook; for now the split-screen copy
  // uses English-first strings + i18n keys from the existing nav tree.
  useI18n();

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[100dvh] md:min-h-[100dvh]">
        <FleetPanel
          href="/private-fleet"
          collectionLabel="Collection I"
          name="Private Fleet"
          priceLine={`From ${fmtK(privateRange.low)} to ${fmtK(privateRange.high)} / week`}
          descriptor="Full crew, total discretion. A private world at sea."
          footer={privateCount > 0 ? `${privateCount} Yachts · Motor, Sailing, Catamaran` : null}
          image={privateHeroImage}
          gradientFallback="linear-gradient(135deg, #0a0f1a 0%, #1a2b3a 100%)"
          ctaLabel="View the Fleet"
        />

        {/* Divider — diagonal gold seam on desktop, horizontal on mobile */}
        <div aria-hidden="true" className="gy-fleet-divider" />

        <FleetPanel
          href="/explorer-fleet"
          collectionLabel="Collection II"
          name="Explorer Fleet"
          priceLine={`From €${explorerRange.low.toLocaleString()} to €${explorerRange.high.toLocaleString()} / person`}
          descriptor="Skippered or lightly crewed. More islands, more adventure."
          footer={explorerCount > 0 ? `${explorerCount} Yachts · Sailing & Power Cats` : null}
          image={explorerHeroImage}
          gradientFallback="linear-gradient(135deg, #1a2b3a 0%, #0a0f1a 100%)"
          ctaLabel="View the Fleet"
        />
      </div>

      <style jsx global>{`
        /* Sibling darkening — hover one panel, the other dims.
           Works both directions thanks to :has(). */
        .gy-fleet-panel:hover ~ .gy-fleet-panel,
        .gy-fleet-panel:has(~ .gy-fleet-panel:hover) {
          opacity: 0.42;
          filter: brightness(0.72) saturate(0.85);
          transition: opacity 700ms ease, filter 700ms ease;
        }

        .gy-fleet-panel {
          transition: opacity 700ms ease, filter 700ms ease;
        }

        /* Divider — a hairline gold seam between the two panels.
           Horizontal on mobile, vertical on desktop. */
        .gy-fleet-divider {
          flex-shrink: 0;
          background: linear-gradient(
            to right,
            transparent,
            rgba(218, 165, 32, 0.35) 20%,
            rgba(218, 165, 32, 0.35) 80%,
            transparent
          );
          width: 100%;
          height: 1px;
        }
        @media (min-width: 768px) {
          .gy-fleet-divider {
            width: 1px;
            height: auto;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(218, 165, 32, 0.35) 15%,
              rgba(218, 165, 32, 0.35) 85%,
              transparent
            );
          }
        }

        /* Respect reduced-motion — no zoom, no overlay fade drama */
        @media (prefers-reduced-motion: reduce) {
          .gy-fleet-panel ~ .gy-fleet-panel,
          .gy-fleet-panel:has(~ .gy-fleet-panel:hover) {
            opacity: 1 !important;
            filter: none !important;
          }
          .gy-fleet-panel .group-hover\\:scale-\\[1\\.05\\]:hover,
          .gy-fleet-panel *:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
