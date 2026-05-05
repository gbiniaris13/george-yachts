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
import HomeForbesQuote from "./components/HomeForbesQuote";

// Dynamic imports for below-fold components — reduces initial JS bundle.
// 2026-04-21 declutter: the following were removed from the home tree
// (routes still exist, just no longer surfaced on the landing page):
//   • HowItWorks         — merged into YourBroker "how we work" block
//   • CredentialsStrip   — merged into HomeStats (unified "Proof" block)
//   • BudgetSlider       — low intent on home; tool kept standalone
//   • InteractiveTools   — duplicates the hamburger menu
//   • ContactBar         — one-line banner absorbed into ContactFormSection
//
// A.10 (Roberto brief, May 2026): we used to pass `{ ssr: false }` on
// every below-fold dynamic import. That made the entire bottom half
// of the homepage invisible to Googlebot + AI crawlers + no-JS first
// paint — the Filotimo manifesto, the regions map, and the contact
// form all shipped as empty placeholders. Removed `ssr: false` so the
// HTML now contains the full editorial copy. Bundle hit is minor —
// these components are still code-split via `dynamic()`, but they
// SSR on the server and hydrate on the client (the standard Next 15
// pattern for non-interactive components).
const YourBroker = dynamic(() => import("./components/YourBroker"));
const Filotimon = dynamic(() => import("./components/Filotimon"));
const GreekWatersMap = dynamic(() => import("./components/GreekWatersMap"));
// Phase 2 / E2 (luxury rebuild) — 3D Mapbox flyover. Lives ABOVE the
// editorial GreekWatersMap so the cinematic version reads first; the
// SVG illustration stays as the no-JS / reduced-motion fallback story.
const MapboxFlyover = dynamic(() => import("./components/MapboxFlyover"), { ssr: false });
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"));
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"));
const HomeJournalTeaser = dynamic(() => import("./components/HomeJournalTeaser"));

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
  // B.6 — three most-recent blog posts for the homepage Journal teaser
  latestPosts,
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
      <section id="signature" data-gy-reveal="up">
        <SignatureYacht yacht={signatureYacht} />
      </section>

      {/* Proof = Stats + Credentials merged (Proposal A) */}
      <div data-gy-reveal="up">
        <HomeStats yachtCount={yachtCount} />
      </div>

      {/* Meet George + how we work, merged into one section (Proposal B) */}
      <section id="how" data-gy-reveal="up">
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

      {/* Phase 2 / E2 — Cinematic 3D Mapbox flyover (statement piece). */}
      <section id="flyover" aria-label="3D flyover of the Greek waters" data-gy-reveal="blur">
        <MapboxFlyover />
      </section>

      {/* Editorial illustrated map (still here as a tactile,
          reduced-motion-friendly counterpart to the cinematic flyover). */}
      <section id="map" data-gy-reveal="up">
        <GreekWatersMap />
      </section>

      {/* Tier 1.3 (Forbes integration brief, May 2026) — Forbes
          pull-quote section. Server-rendered: quote + attribution
          appear in initial HTML for SEO/AI crawlers. */}
      <div data-gy-reveal="up">
        <HomeForbesQuote />
      </div>

      <section id="filotimo" data-gy-reveal="up">
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

      <div data-gy-reveal="up">
        <BrokerTestimonials />
      </div>

      {/* B.6 (Roberto brief, May 2026) — Journal teaser surfaces the
          3 most-recent blog posts so visitors see the editorial
          flywheel. Hidden when no posts are available. */}
      <div data-gy-reveal="up">
        <HomeJournalTeaser posts={latestPosts} />
      </div>

      {/* ContactBar absorbed into ContactFormSection (Proposal D) */}
      <section id="contact" data-gy-reveal="up">
        <ContactFormSection />
      </section>

      <Footer />
    </div>
  );
};

export default HomeClient;
