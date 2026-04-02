"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

function useFeatures() {
  const { t } = useI18n();
  return [
    {
      title: t('panels.panel1Title', 'CREWED YACHT CHARTER | IN GREEK WATERS'),
      paragraph: t('panels.panel1Text', 'From the Cyclades to the Ionian, from the Saronic Gulf to the Sporades — George Yachts curates crewed yacht charters across every Greek sailing region. Our fleet of 50+ motor yachts, sailing catamarans, and monohulls is handpicked for quality, crew excellence, and guest experience. Whether you envision Mykonos sunsets or Corfu coastlines, your charter begins with a single conversation.'),
      imageSrc: "/images/yacht-1.jpeg",
      discoverHref: "/charter-yacht-greece",
    },
    {
      title: t('panels.panel2Title', 'WHY CHOOSE | A BOUTIQUE BROKER?'),
      paragraph: t('panels.panel2Text', 'Unlike aggregator platforms with thousands of listings and no personal touch, George Yachts operates as a boutique brokerage — one broker, one relationship, one standard. Every yacht is personally vetted. Every captain is known by name. Every itinerary is crafted from real experience sailing these waters. IYBA member, MYBA contracts, transparent pricing with APA and VAT explained upfront. No surprises, no middlemen.'),
      imageSrc: "/images/yacht-2.jpeg",
      discoverHref: "/about-us",
    },
    {
      title: t('panels.panel3Title', '360° LUXURY | BEYOND THE YACHT'),
      paragraph: t('panels.panel3Text', 'Your experience extends far beyond the deck. Through our network of trusted partners across Greece, we arrange private jet and helicopter transfers, VIP ground transport, luxury villa stays in Mykonos, Santorini, and the Athens Riviera, Michelin-level dining reservations, and bespoke island itineraries. One point of contact for everything — from touchdown at Athens International to your final sunset anchorage.'),
      imageSrc: "/images/yacht-3.jpeg",
      discoverHref: "/private-jet-charter",
    },
    {
      title: t('panels.panel4Title', 'CHARTER WITH | CONFIDENCE'),
      paragraph: t('panels.panel4Text', 'George Yachts brings a new standard to Mediterranean yacht charter — combining international professionalism with deep local expertise in Greek waters. Weekly rates from €5,900 for intimate sailing catamarans to €235,000 for flagship superyachts. Clear contracts, fast proposals, and an IYBA member broker who answers the phone personally. This is yacht charter as it should be — precise, discreet, and genuinely personal.'),
      imageSrc: "/images/yacht-4.jpeg",
      discoverHref: "/faq",
    },
  ];
}

/* ─── Diagonal Gold Wipe Panel ─── */
const DiagonalWipePanel = ({ item, index, total }) => {
  const [titleMain, titleSub] = item.title.split("|").map((s) => s.trim());
  const panelRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const handleScroll = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: 0 when panel top reaches viewport bottom, 1 when panel top reaches viewport top
    const p = Math.max(0, Math.min(1, (vh - rect.top) / vh));
    setProgress(p);
    if (p > 0.15) setHasEntered(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Wipe angle alternates per panel
  const angles = ['-45deg', '45deg', '-45deg', '45deg'];
  const angle = angles[index % 4];

  // Gold wipe line position — sweeps across during scroll
  const wipeProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.5));

  // Content reveal — appears after wipe passes midpoint
  const contentReveal = Math.max(0, Math.min(1, (progress - 0.25) / 0.4));

  // Shimmer trail position
  const shimmerPos = wipeProgress * 150 - 25;

  const isRight = index % 2 !== 0;

  return (
    <div
      ref={panelRef}
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      {/* Background image — zooms slightly on scroll */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `scale(${1 + (1 - wipeProgress) * 0.15})`,
          transition: 'transform 0.1s linear',
        }}
      >
        <Image
          src={item.imageSrc}
          alt={`${item.title.replace('|', '–')} - George Yachts luxury yacht charter Greece`}
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Diagonal gold wipe overlay — reveals content behind it */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(${angle},
            transparent ${shimmerPos - 4}%,
            rgba(218,165,32,0.0) ${shimmerPos - 2}%,
            rgba(218,165,32,0.6) ${shimmerPos}%,
            rgba(218,165,32,0.9) ${shimmerPos + 0.5}%,
            rgba(218,165,32,0.6) ${shimmerPos + 1}%,
            rgba(218,165,32,0.0) ${shimmerPos + 3}%,
            transparent ${shimmerPos + 5}%)`,
          opacity: wipeProgress > 0.01 && wipeProgress < 0.98 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Subtle gold particle shimmer behind the wipe line */}
      <div
        className="absolute inset-0 z-9 pointer-events-none"
        style={{
          background: `linear-gradient(${angle},
            transparent ${shimmerPos - 15}%,
            rgba(218,165,32,0.04) ${shimmerPos - 5}%,
            rgba(218,165,32,0.08) ${shimmerPos}%,
            transparent ${shimmerPos + 10}%)`,
          opacity: wipeProgress > 0.01 && wipeProgress < 0.98 ? 1 : 0,
        }}
      />

      {/* Content — Glass HUD with reveal animation */}
      <div
        className={`absolute inset-0 z-20 flex items-center ${
          isRight ? 'justify-end' : 'justify-start'
        }`}
        style={{
          opacity: contentReveal,
          transform: `translateY(${(1 - contentReveal) * 40}px)`,
          transition: 'opacity 0.1s linear, transform 0.1s linear',
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <div
            className={`w-full md:w-[500px] lg:w-[600px] backdrop-blur-3xl bg-black/40 border border-white/10 p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:bg-black/50 transition-colors duration-700 ${
              isRight ? 'ml-auto' : ''
            }`}
          >
            {/* Top gold line — animates width on reveal */}
            <div
              className="h-px mb-10 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, #DAA520, transparent)',
                width: `${contentReveal * 100}%`,
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Index Counter */}
            <span
              className="block text-[#DAA520] font-mono text-xs tracking-[0.3em] mb-4"
              style={{
                opacity: hasEntered ? 1 : 0,
                transform: hasEntered ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              0{index + 1} / 0{total}
            </span>

            {/* Typography — staggered entrance */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-marcellus text-white leading-[0.9] tracking-tight mb-8">
              <span
                className="block opacity-90"
                style={{
                  opacity: hasEntered ? 0.9 : 0,
                  transform: hasEntered ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                }}
              >
                {titleMain}
              </span>
              <span
                className="block italic font-light mt-2"
                style={{
                  backgroundImage: "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  opacity: hasEntered ? 1 : 0,
                  transform: hasEntered ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
                }}
              >
                {titleSub}
              </span>
            </h2>

            <p
              className="text-sm md:text-base text-gray-300 font-light leading-loose tracking-wide font-sans text-justify opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                opacity: hasEntered ? 0.8 : 0,
                transform: hasEntered ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease 0.55s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
              }}
            >
              {item.paragraph}
            </p>

            {/* Discover link */}
            <Link
              href={item.discoverHref}
              className="mt-10 flex items-center gap-4 group/discover"
              data-cursor="View"
              style={{
                opacity: hasEntered ? 1 : 0,
                transform: hasEntered ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.6s ease 0.7s',
              }}
            >
              <div className="h-px w-12 bg-white/30 group-hover/discover:bg-[#DAA520] group-hover/discover:w-16 transition-all duration-500" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 group-hover/discover:text-[#DAA520] group-hover/discover:tracking-[0.5em] transition-all duration-500">
                Discover
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress bar (left side) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 z-30 hidden md:block">
        <div
          className="w-full bg-[#DAA520]"
          style={{
            height: `${((index + 1) / total) * 100}%`,
            transition: 'height 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

const TwoColumnLayout = () => {
  const features = useFeatures();
  return (
    <section className="relative w-full bg-[#000]">
      {features.map((item, index) => (
        <DiagonalWipePanel
          key={index}
          item={item}
          index={index}
          total={features.length}
        />
      ))}

      <style jsx global>{`
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default TwoColumnLayout;
