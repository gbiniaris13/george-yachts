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
// Phase 27i.5 (2026-05-07) — Regional Yacht Map. Replaces
// GreekWatersMap below in the JSX. Pulls every yacht in the fleet
// and clusters them by Sanity cruisingRegion into 5 ports
// (Athens hub + Cyclades / Ionian / Saronic / Sporades). Click a
// region → modal with cover photo + yacht list. Photos are Pexels
// CC0 placeholders pending Boss-curated regional photography.
const RegionalYachtMap = dynamic(() => import("./components/RegionalYachtMap"));
const WaveDivider = dynamic(() => import("./components/WaveDivider"));
// Phase 2 / E2 (luxury rebuild) — 3D Mapbox flyover. Lives ABOVE the
// editorial GreekWatersMap so the cinematic version reads first; the
// SVG illustration stays as the no-JS / reduced-motion fallback story.
const MapboxFlyover = dynamic(() => import("./components/MapboxFlyover"), { ssr: false });
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"));
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"));
const HomeJournalTeaser = dynamic(() => import("./components/HomeJournalTeaser"));
// Phase 26 — AI itinerary preview surfaced on homepage too. The texture
// tool was previously only on /greece-by-yacht; for tomorrow's Forbes
// traffic landing on the home page, show it within the scroll path.
const ItineraryPreview = dynamic(() => import("./components/ItineraryPreview"), { ssr: false });

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
  // 2026-05-07 — full fleet (with cruisingRegion) for the new
  // RegionalYachtMap. Falls back to trendingYachts if not provided.
  fleetForMap,
  // B.6 — three most-recent blog posts for the homepage Journal teaser
  latestPosts,
}) => {
  const fleet = Array.isArray(fleetForMap) && fleetForMap.length > 0
    ? fleetForMap
    : (trendingYachts ?? []);
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

      {/* TrendingYachts ("This Week's Selection") removed 2026-05-07
          per Boss directive — the homepage was reading like a travel-
          agency carousel of bestsellers. Yacht discovery surface lives
          in FleetCTAs + SignatureYacht below; weekly rotation is now
          visible on @georgeyachts (yacht-first IG feed, see gy-command
          PLAYBOOKS §9). */}

      {/* 2026-05-02 reorder: Fleet split-screen now sits IMMEDIATELY
          below the hero so the Private / Explorer choice is the
          first thing visitors see on scroll. Per GA4 (last 30d) only
          4 / 267 = 1.5% of homepage visitors reached a fleet page;
          moving fleet up + SignatureYacht down should multiply that. */}
      <section id="fleet" data-gy-reveal="up" data-sound-reveal>
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

      {/* Skipper's Pick spotlight removed 2026-05-07 per Boss
          directive (along with TrendingYachts + Editor's Pick) —
          eliminates the "shopping carousel" feel from the homepage. */}

      {/* Phase 2 / E2 — Cinematic 3D Mapbox flyover (statement piece). */}
      <section id="flyover" aria-label="3D flyover of the Greek waters" data-gy-reveal="blur">
        <MapboxFlyover />
      </section>

      {/* 2026-05-07 (Phase 27i.5) — Regional Yacht Map. Replaces
          GreekWatersMap. Pulls cruisingRegion from Sanity and
          clusters every yacht into 5 ports (Athens hub + 4 sea
          regions). Click a region → modal with cover photo +
          yachts pinned there. Photos are Pexels placeholders pending
          Boss-curated regional photography (1 hero photo per region,
          to swap in via /public/images/regions/<slug>.jpg). */}
      <section id="map" data-gy-reveal="up">
        <RegionalYachtMap yachts={fleet} />
      </section>

      {/* Aegean wave divider — gold + ivory sine waves drifting in
          opposite directions, bridges the regional map (deep navy)
          into the Forbes section (also deep navy) so the transition
          reads as horizon, not as a hard edit. */}
      <WaveDivider height={64} intensity={0.85} />

      {/* Tier 1.3 (Forbes integration brief, May 2026) — Forbes
          pull-quote section. Server-rendered: quote + attribution
          appear in initial HTML for SEO/AI crawlers. */}
      <div data-gy-reveal="up">
        <HomeForbesQuote />
      </div>

      {/* Phase 26 (luxury rebuild, 2026-05-05) — AI itinerary preview
          on homepage too. Visitors landing from Forbes see the live
          texture-only AI tool without having to navigate to
          /greece-by-yacht. Texture only — never a proposal, the broker
          writes the real one (Boss directive). */}
      <div data-gy-reveal="up">
        <ItineraryPreview />
      </div>

      <section id="filotimo" data-gy-reveal="up">
        <Filotimon filotimoImage={filotimoImage} />
      </section>

      {/* Editor's Pick spotlight removed 2026-05-07 per Boss
          directive — same rationale as the Skipper's Pick removal
          above (yacht-discovery surface lives in FleetCTAs + the IG
          feed, not in inline shopping spots on the homepage). */}

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
