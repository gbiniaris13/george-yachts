// Tier 2.2 (Roberto legal directive, 4 May 2026) —
// Footer trust strip with three slots, fully legal-compliant.
//
//   Slot 1: Forbes — text-based wordmark in Times Bold, with caption
//           "AS FEATURED · MAY 2026", linked to the article URL with
//           target="_blank" rel="noopener noreferrer".
//   Slot 2: IYBA — official IYBA member logo (downloaded unmodified
//           from the IYBA member portal CDN). Linked to https://iyba.org
//           per the IYBA backlink-required clause. Until logo arrives,
//           directive requires text-only "IYBA Charter Active Member"
//           — we now have the official file so we render the image.
//   Slot 3: MYBA — PLAIN TEXT ONLY. No logo, no graphic, no badge.
//           Exact phrasing per directive: "Charter contracts based on
//           the MYBA standard". No link.
//
// Rules from directive:
//   • No image file with "myba" in the filename anywhere in deployed
//     assets.
//   • No "MYBA Member" / "MYBA Approved" / any membership-implying
//     phrasing.
//   • No Forbes logo image — text wordmark only.
//
// Server component — no JS payload.

import React from "react";
import Image from "next/image";
import Link from "next/link";

const FORBES_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function PressStrip() {
  return (
    <section
      aria-label="Trust signals - independent journalism, professional standards"
      style={{
        background: "rgba(13, 27, 42, 0.92)",
        borderTop: "1px solid rgba(248, 245, 240,0.04)",
        borderBottom: "1px solid rgba(248, 245, 240,0.04)",
        padding: "36px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "rgba(248,245,240,0.66)",
            fontWeight: 300,
            margin: 0,
            textAlign: "center",
          }}
        >
          Trusted standards · Independent journalism · Boutique brokerage
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "56px",
            flexWrap: "wrap",
          }}
        >
          {/* Slot 1 — Forbes (text wordmark, As Featured caption) */}
          <a
            href={FORBES_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Read"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              opacity: 0.7,
              transition: "opacity 0.3s ease",
            }}
            className="gy-press-strip-link"
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#F8F5F0",
                fontWeight: 600,
              }}
            >
              As Featured · May 2026
            </span>
            <span
              aria-label="Forbes"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.02em",
                color: "#F8F5F0",
                lineHeight: 1,
              }}
            >
              Forbes
            </span>
          </a>

          {/* Slot 2 — IYBA Charter Active Member (official logo, link
              to iyba.org per backlink-required clause) */}
          <a
            href="https://iyba.org"
            target="_blank"
            rel="noopener noreferrer"
            title="International Yacht Brokers Association"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              opacity: 0.7,
              transition: "opacity 0.3s ease",
            }}
            className="gy-press-strip-link"
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(248,245,240,0.6)",
                fontWeight: 500,
              }}
            >
              Charter Active Member
            </span>
            <Image
              src="/images/iyba-official-white.png"
              alt="IYBA - International Yacht Brokers Association"
              width={120}
              height={28}
              style={{ height: "28px", width: "auto" }}
              priority={false}
            />
          </a>

          {/* Slot 3 — MYBA standards (PLAIN TEXT ONLY per legal directive
              §2: no logo, no badge, no link). Exact phrasing required. */}
          <div
            aria-label="Charter contracts based on the MYBA standard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: 0.7,
            }}
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(248,245,240,0.6)",
                fontWeight: 500,
              }}
            >
              Contracts
            </span>
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 12,
                letterSpacing: "0.04em",
                color: "rgba(248,245,240,0.85)",
                fontWeight: 400,
                lineHeight: 1.3,
                textAlign: "center",
                maxWidth: "200px",
              }}
            >
              Based on the MYBA standard
            </span>
          </div>
        </div>
      </div>

      <style>{`.gy-press-strip-link:hover { opacity: 1 !important; }`}</style>
    </section>
  );
}
