"use client";

// A.1 (Roberto brief, May 2026):
//   • SSR was rendering `<span>0</span>` because Counter used
//     useState(0) and only animated after IntersectionObserver fired -
//     Googlebot + no-JS visitors saw "0+ Curated Yachts / 100% Client
//     Satisfaction", a catastrophic first-impression for UHNW.
//   • Hardcode target values in JSX so SSR HTML literally contains
//     "63+", "4", "360°".
//   • Reduce 4 → 3 stats (drop "100% Client Satisfaction" - we cannot
//     back the claim until real client testimonials land).
//   • Rename "Greek Regions" → "Greek Waters" (more accurate +
//     poetic; we operate in waters, not administrative regions).
//   • Parent fade-in stays as the only animation. Number values are
//     final from first paint - no count-up flash.

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ConstellationBackdrop from "./ConstellationBackdrop";
import { FLEET_COUNT } from "@/lib/fleetCount";

// Count-up restored 2026-06-29 (George: "the numbers used to run on scroll").
// Done SSR-safe to keep the A.1 fix intact: the FIRST render (and the SSR HTML
// Googlebot sees) is the FINAL value, so no "0+" ever ships. On the client, if
// the stat is below the fold on load (the normal case), we silently reset to 0
// while off-screen - no flash - and ease it up to the target when it scrolls
// into view. If it is already on screen at load, we leave the final value as-is
// (no flash, no reset). Reduced-motion users keep the static final value.
function StatNumber({ value }) {
  const m = String(value).match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : "";
  const [display, setDisplay] = useState(target);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) return; // keep final value, never flash 0

    // 2026-07-14 audit fix: do NOT park the value at 0 while waiting for
    // the IntersectionObserver. In environments where the observer never
    // fires (broken smooth-scroll, programmatic scrolling, some in-app
    // browsers) the stats sat at "0+ Curated Yachts" forever. The number
    // now stays at its FINAL value and the count-up runs only at the
    // moment the observer actually fires (reset to 0 inside the callback,
    // same visual effect, zero risk of a stuck zero).
    let raf = 0;
    let startTs = 0;
    const DURATION = 1300;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setDisplay(0); // zero-start only NOW, with the animation guaranteed to run
        const step = (ts) => {
          if (!startTs) startTs = ts;
          const p = Math.min(1, (ts - startTs) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setDisplay(Math.round(eased * target));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // Depend ONLY on the stable `value` string. Depending on `m` (a fresh
    // regex-match array every render) re-ran this effect on every setDisplay
    // during the count, whose cleanup cancelled the rAF and bailed early once
    // the element was in view - freezing the number at 0. eslint-disable is
    // intentional: target/suffix/m are all derived from `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function HomeStats({ yachtCount = FLEET_COUNT }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Three stats only. No "Client Satisfaction" until real testimonials
  // land (Section 0.4 of the master brief).
  const stats = [
    { value: `${yachtCount}+`, label: "Curated Yachts" },
    { value: "4", label: "Greek Waters" },
    { value: "360°", label: "Full Service" },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full bg-black border-y border-white/[0.04] py-16 md:py-20 overflow-hidden"
    >
      {/* Subtle gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Phase 27i.18 (2026-05-08) - constellation backdrop. Same
          night-sky register as Filotimon, kept very low intensity
          here so it sits behind the stats numbers without competing
          for the eye. Closes the "constellation between sections"
          item from the original cinematic brief. */}
      <ConstellationBackdrop intensity={0.32} />

      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              // A.14 (Roberto brief): start at opacity 0.5, 8px
              // translate, 280ms duration, ≤50ms stagger so counters
              // stay legible during fast scroll.
              opacity: visible ? 1 : 0.5,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
            }}
          >
            <div
              className="text-5xl md:text-6xl lg:text-7xl font-light mb-3"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                background: "linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <StatNumber value={stat.value} />
            </div>
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-white/65 font-medium"
              style={{ fontFamily: "var(--gy-font-ui)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Credentials - merged from the standalone CredentialsStrip
          section 2026-04-21 (Proposal A). Same icons, now flowing
          directly below the stat counters so "Proof" lives on one
          screen instead of two stacked sections.
          A.13 contrast pass: label opacity bumped from /35 → /70 so
          50+ readers can actually parse the labels on dark BG. */}
      <div
        className="max-w-5xl mx-auto px-6 mt-14"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            {
              icon: (
                <Image
                  src="/images/iyba-official-white.png"
                  alt="IYBA - International Yacht Brokers Association"
                  width={120}
                  height={28}
                  className="opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ height: 28, width: "auto" }}
                />
              ),
              label: "IYBA Member Broker",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#C9A84C]/75 group-hover:text-[#C9A84C] transition-colors duration-500">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              ),
              label: "MYBA-standard Contracts",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#C9A84C]/75 group-hover:text-[#C9A84C] transition-colors duration-500">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M2 7h20" />
                  <path d="M12 21v-4" />
                  <path d="M8 21h8" />
                </svg>
              ),
              label: "U.S. Registered (Wyoming LLC)",
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#C9A84C]/75 group-hover:text-[#C9A84C] transition-colors duration-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              ),
              label: "Greek Waters Specialist",
            },
          ].map((cred, i) => {
            const isIyba = cred.label === "IYBA Member Broker";
            const Wrap = isIyba ? "a" : "div";
            const wrapProps = isIyba
              ? { href: "https://iyba.org", target: "_blank", rel: "noopener noreferrer", "aria-label": "Verify on iyba.org - opens in new tab" }
              : {};
            return (
              <Wrap
                key={i}
                {...wrapProps}
                className="group flex flex-col items-center gap-3 text-center no-underline"
                style={isIyba ? { textDecoration: "none" } : undefined}
              >
                <div className="h-12 flex items-center justify-center">{cred.icon}</div>
                <span
                  className="text-[10px] tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors duration-500 font-light"
                  style={{ fontFamily: "var(--gy-font-ui)" }}
                >
                  {cred.label}
                </span>
              </Wrap>
            );
          })}
        </div>
      </div>
    </section>
  );
}
