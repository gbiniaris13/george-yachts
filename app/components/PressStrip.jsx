// A.5 + Tier 2.2 (Roberto Forbes integration brief, May 2026) —
// Footer press strip with Forbes wordmark.
//
// Now that the Forbes article is published (1 May 2026), the strip
// includes the Forbes wordmark alongside IYBA + MYBA-standard. Each
// mark is monochrome ivory at 60% opacity, hovers to 100%. Forbes
// gets a small "AS FEATURED" gold caption above it (Montserrat 9px
// uppercase) per brief 2.2.
//
// Critical rule (brief 2.2): "MYBA-Standard Contracts" — NOT "MYBA
// Member". George is IYBA member. He uses MYBA-standard contracts.
// These are different things; never conflate.
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
      aria-label="Trust signals — independent journalism, professional standards"
      style={{
        background: "rgba(0,0,0,0.92)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
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
            fontFamily: "'Lato', 'Montserrat', sans-serif",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "rgba(248,245,240,0.6)",
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
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "56px",
            flexWrap: "wrap",
          }}
        >
          {/* Forbes — As Featured */}
          <Link
            href="/press"
            data-cursor="Read"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            className="gy-press-strip-link"
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
              }}
            >
              As Featured
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
          </Link>

          {/* IYBA Member */}
          <a
            href="https://www.iyba.pro/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            className="gy-press-strip-link"
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(248,245,240,0.55)",
                fontWeight: 500,
              }}
            >
              Member
            </span>
            <Image
              src="/images/iyba.png"
              alt="IYBA — International Yacht Brokers Association"
              width={70}
              height={26}
              style={{ height: "26px", width: "auto" }}
            />
          </a>

          {/* MYBA-Standard Contracts (NOT "Member" — see brief 2.2) */}
          <Link
            href="/faq"
            data-cursor="Learn"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
            className="gy-press-strip-link"
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(248,245,240,0.55)",
                fontWeight: 500,
              }}
            >
              We use
            </span>
            <span
              aria-label="MYBA-Standard Contracts"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F8F5F0",
                fontWeight: 600,
              }}
            >
              MYBA-Standard Contracts
            </span>
          </Link>
        </div>
      </div>

      <style>{`.gy-press-strip-link:hover { opacity: 1 !important; }`}</style>
    </section>
  );
}
