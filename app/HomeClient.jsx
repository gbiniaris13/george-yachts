"use client";

import React from "react";
import dynamic from "next/dynamic";
import VideoSection from "./components/VideoSection";
import SignatureYacht from "./components/SignatureYacht";
import FleetCTAs from "./components/FleetCTAs";
import HomeStats from "./components/HomeStats";
import Footer from "./components/Footer";
import StickyMiniNav from "./components/StickyMiniNav";
import TrendingYachts from "./components/TrendingYachts";
import InlineYachtStrip from "./components/InlineYachtStrip";

// Dynamic imports for below-fold components — reduces initial JS bundle.
// 2026-04-21 declutter: the following were removed from the home tree
// (routes still exist, just no longer surfaced on the landing page):
//   • HowItWorks         — merged into YourBroker "how we work" block
//   • CredentialsStrip   — merged into HomeStats (unified "Proof" block)
//   • BudgetSlider       — low intent on home; tool kept standalone
//   • InteractiveTools   — duplicates the hamburger menu
//   • ContactBar         — one-line banner absorbed into ContactFormSection
const YourBroker = dynamic(() => import("./components/YourBroker"), { ssr: false });
const Filotimon = dynamic(() => import("./components/Filotimon"), { ssr: false });
const GreekWatersMap = dynamic(() => import("./components/GreekWatersMap"), { ssr: false });
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"), { ssr: false });
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"), { ssr: false });

const HomeClient = ({
  yachtCount,
  privateRange,
  explorerRange,
  // budgetYachts prop still accepted for backwards compat — BudgetSlider
  // was cut from the home tree 2026-04-21 but the standalone page may
  // still consume it.
  budgetYachts: _budgetYachts,
  privateHeroImage,
  explorerHeroImage,
  privateCount,
  explorerCount,
  signatureYacht,
  filotimoImage,
  trendingYachts,
}) => {
  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Sticky mini-nav surfaces after the hero (>600px) */}
      <StickyMiniNav />

      {/* Hero now knows about the fleet so its CTA + badge can show
          the live yacht count and price floor instead of a generic
          tagline (Roberto 2026-05-02 conversion fix). */}
      <VideoSection
        yachtCount={yachtCount}
        privateRange={privateRange}
        explorerRange={explorerRange}
      />

      {/* Trending Yachts carousel (Roberto 2026-05-02 — Batch 3).
          Real yacht cards immediately below the hero, before the
          split-screen "pick a category" step. Cold-outreach traffic
          who just wants to SEE yachts gets a one-tap path to a
          yacht detail page without choosing between Private/Explorer
          first. Renders nothing if the pool is empty. */}
      <TrendingYachts yachts={trendingYachts} />

      {/* 2026-05-02 reorder: Fleet split-screen now sits IMMEDIATELY
          below the hero so the Private / Explorer choice is the
          first thing visitors see on scroll. Per GA4 (last 30d) only
          4 / 267 = 1.5% of homepage visitors reached a fleet page;
          moving fleet up + SignatureYacht down should multiply that. */}
      <section id="fleet">
        <FleetCTAs
          privateRange={privateRange}
          explorerRange={explorerRange}
          privateHeroImage={privateHeroImage}
          explorerHeroImage={explorerHeroImage}
          privateCount={privateCount}
          explorerCount={explorerCount}
        />
      </section>

      {/* Signature Yacht slot (weekly auto-rotating feature) */}
      <section id="signature">
        <SignatureYacht yacht={signatureYacht} />
      </section>

      {/* Proof = Stats + Credentials merged (Proposal A) */}
      <HomeStats yachtCount={yachtCount} />

      {/* Meet George + how we work, merged into one section (Proposal B) */}
      <section id="how">
        <YourBroker />
      </section>

      {/* Roberto 2026-05-02 Batch 4 — yacht spotlight #1 between
          editorial sections so visitors who scroll past fleet still
          see yachts every couple of sections. Different yacht than
          the carousel + signature so we're not repeating the same
          card three times. */}
      {trendingYachts && trendingYachts.length > 6 ? (
        <InlineYachtStrip
          yacht={trendingYachts[6]}
          eyebrow="Skipper's Pick"
        />
      ) : trendingYachts && trendingYachts.length > 0 ? (
        <InlineYachtStrip
          yacht={trendingYachts[trendingYachts.length - 1]}
          eyebrow="Skipper's Pick"
        />
      ) : null}

      {/* Interactive Greek waters map (statement piece) */}
      <section id="map">
        <GreekWatersMap />
      </section>

      <section id="filotimo">
        <Filotimon filotimoImage={filotimoImage} />
      </section>

      {/* Roberto 2026-05-02 Batch 4 — yacht spotlight #2 right
          before testimonials. Picks a different yacht so consecutive
          spotlights don't repeat. */}
      {trendingYachts && trendingYachts.length > 7 ? (
        <InlineYachtStrip
          yacht={trendingYachts[7]}
          eyebrow="Editor's Pick"
        />
      ) : null}

      <BrokerTestimonials />

      {/* ContactBar absorbed into ContactFormSection (Proposal D) */}
      <section id="contact">
        <ContactFormSection />
      </section>

      <Footer />
    </div>
  );
};

export default HomeClient;
