"use client";

import React from "react";
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
      discoverText: t('common.learnMore', 'Discover'),
    },
    {
      title: t('panels.panel2Title', 'WHY CHOOSE | A BOUTIQUE BROKER?'),
      paragraph: t('panels.panel2Text', 'Unlike aggregator platforms with thousands of listings and no personal touch, George Yachts operates as a boutique brokerage — one broker, one relationship, one standard. Every yacht is personally vetted. Every captain is known by name. Every itinerary is crafted from real experience sailing these waters. IYBA member, MYBA contracts, transparent pricing with APA and VAT explained upfront. No surprises, no middlemen.'),
      imageSrc: "/images/yacht-2.jpeg",
      discoverHref: "/about-us",
      discoverText: t('common.learnMore', 'Discover'),
    },
    {
      title: t('panels.panel3Title', '360° LUXURY | BEYOND THE YACHT'),
      paragraph: t('panels.panel3Text', 'Your experience extends far beyond the deck. Through our network of trusted partners across Greece, we arrange private jet and helicopter transfers, VIP ground transport, luxury villa stays in Mykonos, Santorini, and the Athens Riviera, Michelin-level dining reservations, and bespoke island itineraries. One point of contact for everything — from touchdown at Athens International to your final sunset anchorage.'),
      imageSrc: "/images/yacht-3.jpeg",
      discoverHref: "/private-jet-charter",
      discoverText: t('common.learnMore', 'Discover'),
    },
    {
      title: t('panels.panel4Title', 'CHARTER WITH | CONFIDENCE'),
      paragraph: t('panels.panel4Text', 'George Yachts brings a new standard to Mediterranean yacht charter — combining international professionalism with deep local expertise in Greek waters. Weekly rates from €5,900 for intimate sailing catamarans to €235,000 for flagship superyachts. Clear contracts, fast proposals, and an IYBA member broker who answers the phone personally. This is yacht charter as it should be — precise, discreet, and genuinely personal.'),
      imageSrc: "/images/yacht-4.jpeg",
      discoverHref: "/faq",
      discoverText: t('common.learnMore', 'Discover'),
    },
  ];
}

const MonolithSlide = ({ item, index, total }) => {
  const [titleMain, titleSub] = item.title.split("|").map((s) => s.trim());

  // Logic to alternate the position of the Glass HUD (Left vs Right)
  const isRight = index % 2 !== 0;

  return (
    // THE STICKY CONTAINER
    <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.imageSrc}
          alt={`${item.title.replace('|', '–')} - George Yachts luxury yacht charter Greece`}
          fill
          className="object-cover scale-105"
          sizes="100vw"
          quality={85}
        />
        {/* Expensive "Vignette" Overlay to focus eyes on center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
        {/* Dark tint to ensure text pop */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2. THE GLASS HUD (The Text) */}
      <div
        className={`relative z-20 w-full max-w-[1400px] px-6 md:px-12 flex ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <div className="w-full md:w-[500px] lg:w-[600px] backdrop-blur-3xl bg-black/40 border border-white/10 p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:bg-black/50 transition-colors duration-700">
          {/* Top Decorative Line */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-[#DAA520] to-transparent mb-10 opacity-50"></div>

          {/* Index Counter */}
          <span className="block text-[#DAA520] font-mono text-xs tracking-[0.3em] mb-4">
            0{index + 1} / 0{total}
          </span>

          {/* Typography */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-marcellus text-white leading-[0.9] tracking-tight mb-8">
            <span className="block opacity-90">{titleMain}</span>
            <span
              className="block italic font-light mt-2"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              {titleSub}
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 font-light leading-loose tracking-wide font-sans text-justify opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            {item.paragraph}
          </p>

          {/* Bottom Decorative Element — Clickable */}
          <Link href={item.discoverHref} className="mt-10 flex items-center gap-4 group/discover" data-cursor="View">
            <div className="h-px w-12 bg-white/30 group-hover/discover:bg-[#DAA520] group-hover/discover:w-16 transition-all duration-500"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 group-hover/discover:text-[#DAA520] group-hover/discover:tracking-[0.5em] transition-all duration-500">
              Discover
            </span>
          </Link>
        </div>
      </div>

      {/* 3. PROGRESS BAR (Left Side) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 z-30 hidden md:block">
        <div
          className="w-full bg-[#DAA520]"
          style={{ height: `${((index + 1) / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const TwoColumnLayout = () => {
  const features = useFeatures();
  return (
    <section className="relative w-full bg-[#000]">
      {/* This is the "Deck Container".
        Each child is Sticky. As you scroll, they naturally stack on top of each other.
      */}
      {features.map((item, index) => (
        <MonolithSlide
          key={index}
          item={item}
          index={index}
          total={features.length}
        />
      ))}

      <style jsx global>{`
        /* Force squares everywhere. No rounding allowed in this dojo. */
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default TwoColumnLayout;
