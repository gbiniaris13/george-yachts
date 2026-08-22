"use client";

import React from "react";
import dynamic from "next/dynamic";
import VideoSection from "./components/VideoSection";
import PageFaq from "./components/PageFaq";
import { HOME_FAQ } from "@/lib/houseFaq";
// Chapter 08 (2026-05-08) — SignatureYacht "Featured This Week"
// retired in favour of the new <GeorgesSelection /> 2-card pair
// (La Pellegrina 1 + Errant Vagabond). The SignatureYacht component
// file stays on disk for any future use.
import GeorgesSelection from "./components/GeorgesSelection";
import ClientReviews from "./components/ClientReviews";
import FleetCTAs from "./components/FleetCTAs";
import HomeStats from "./components/HomeStats";
import Footer from "./components/Footer";
import TrustStrip from "@/app/components/TrustStrip";
import StickyMiniNav from "./components/StickyMiniNav";
import TrendingYachts from "./components/TrendingYachts";
import InlineYachtStrip from "./components/InlineYachtStrip";
import HomeForbesQuote from "./components/HomeForbesQuote";
import AwardedFleet from "./components/AwardedFleet";

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
// Chapter 07 (2026-05-08) — RegionalYachtMap removed from the
// homepage in favour of <ThreeGreekWorlds />. Boss directive: drop
// the interactive port map / yacht counts / disclaimer copy and
// surface a 3-card editorial section pointing at the new
// destination pages instead. The RegionalYachtMap component file
// stays on disk for any future use.
const ThreeGreekWorlds = dynamic(() => import("./components/ThreeGreekWorlds"));
const WaveDivider = dynamic(() => import("./components/WaveDivider"));
// 2026-05-08 (Phase 27i.19) — MapboxFlyover removed from the
// homepage tree. Merged with RegionalYachtMap below — both surfaces
// were showing islands with photos, so consolidating into one.
// Performance bonus: drops Mapbox GL JS off the homepage bundle.
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"));
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"));
const HomeJournalTeaser = dynamic(() => import("./components/HomeJournalTeaser"));
// Phase 26 — AI itinerary preview surfaced on homepage too. The texture
// tool was previously only on /greece-by-yacht; for tomorrow's Forbes
// traffic landing on the home page, show it within the scroll path.
const ItineraryPreview = dynamic(() => import("./components/ItineraryPreview"), { ssr: false });
// Phase 27i.17 (2026-05-08) — custom WebGL water shader. Closes the
// last "statement piece" item from the original cinematic brief.
// Sits as a horizon band between the hero and the fleet split-screen.
// ssr:false because three.js shader compilation is a pure client task.
// 2026-08-19 (job 6) — was import("./components/WaterShaderHorizon").
// dynamic() fetches on render, not on decision, and the "not on mobile"
// check lives inside that module, so a phone downloaded 184 KB of three.js
// purely to read the line telling it not to use three.js. WaterHorizonBand
// paints the same navy gradient at the same height on every device, so
// nothing moves and CLS stays 0, and mounts the real shader only once the
// gate agrees. WaterShaderHorizon itself is unchanged.
const WaterShaderHorizon = dynamic(
  () => import("./components/WaterHorizonBand"),
  { ssr: false }
);

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

      {/* 2026-07-08 (George's UI wave #2), one quiet line of proof in
          the first three seconds: real 5.0 Google rating, Forbes 2026,
          IYBA/MYBA. Every claim links to its evidence page. */}
      <TrustStrip />

      {/* 2026-07-22 (20-charters wave), the 2027 priority-window band.
          The Early-Bird funnel page existed with zero visible doorways;
          GSC showed the July searcher is last-minute while George's real
          buyer (weekly 2027) decides in autumn. One quiet line, one link.
          The first September 2027 charter signing 14 months out is true
          and time-stamped (July 2026). */}
      <section
        aria-label="2027 charter season priority list"
        style={{
          background: "rgba(218, 161, 16,0.06)",
          borderTop: "1px solid rgba(218, 161, 16,0.18)",
          borderBottom: "1px solid rgba(218, 161, 16,0.18)",
          padding: "18px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "clamp(12px, 1.1vw, 14px)",
            letterSpacing: "0.06em",
            color: "rgba(248,245,240,0.85)",
            margin: 0,
          }}
        >
          {/* 2026-08-21 (section 2) — plural, on George's instruction. It was
              "the first September 2027 charter", singular, which reads as one
              booking and one client. The plural says the season has started
              moving, which is both what he meant and what is true. */}
          The 2027 calendars open this autumn. The first September 2027 charters are already at signatures.{" "}
          <a
            href="/yacht-charter-greece-2027"
            style={{
              color: "#DAA110",
              textDecoration: "none",
              borderBottom: "1px solid rgba(218, 161, 16,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            Join the 2027 priority list
          </a>
        </p>
      </section>

      {/* TrendingYachts ("This Week's Selection") removed 2026-05-07
          per Boss directive, the homepage was reading like a travel-
          agency carousel of bestsellers. Yacht discovery surface lives
          in FleetCTAs + SignatureYacht below; weekly rotation is now
          visible on @georgeyachts (yacht-first IG feed, see gy-command
          PLAYBOOKS §9). */}

      {/* Phase 27i.17's WebGL water horizon used to sit here, 220px of it.
          Removed 2026-08-22 on George's instruction: on a phone the shader
          falls back to a plain gradient, so between the 2027 band and the
          awarded fleet he was looking at 220px of empty navy. "Μεγάλο κενό
          να φύγει τελείως, δεν θέλω κενά." The component itself survives
          (WaterHorizonBand still wraps it for any page that wants it); only
          this placement is gone, and the awarded fleet now follows the 2027
          line directly, which reads as one continuous thought: proof, then
          the calendar for it. */}

      {/* 2026-05-02 reorder: Fleet split-screen now sits IMMEDIATELY
          below the hero so the Private / Explorer choice is the
          first thing visitors see on scroll. Per GA4 (last 30d) only
          4 / 267 = 1.5% of homepage visitors reached a fleet page;
          moving fleet up + SignatureYacht down should multiply that. */}
      {/* 2026-08-21 (section 9) — the awarded band moved above the fleet
          split, on George's instruction and for a reason worth writing down.

          At twenty to five hundred thousand a week the visitor's first
          question is not "what have you got", it is "why you". Yachts they
          can find anywhere. Sixteen yachts with thirty-two placings at the
          two Greek shows answer the second question in one screen, and every
          card in the band is a link to a yacht, so the proof and the
          navigation are the same object.

          It does not replace the fleet split, it precedes it. The split is
          still the spine: forty-nine of the sixty-five yachts, and every one
          above EUR 65,000, live outside the awarded band. */}
      {/* 2026-08-20 (design pass, job 16) — the awarded fleet, on George's
          instruction and high on the page for his reason: the cheapest
          catamaran in the fleet takes most of the clicks the whole fleet
          earns, because it happens to rank for its own name, while the six
          yachts whose crews have actually won something take almost none.

          It sits after the fleet and BEFORE the reviews on purpose. Both are
          proof, and these are the harder kind: a review is a client's
          opinion, a placing at the EMMYS is a judge putting this crew above
          the others in the room. Ordering the softer proof first would waste
          the stronger.

          Renders nothing if the registry is ever emptied. */}
      <section id="awarded" data-gy-reveal="up">
        <AwardedFleet fleet={fleet} />
      </section>

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

      {/* 2026-06-28, real five-star Google reviews made visible (stars +
          aggregate), high on the page as social proof right after the fleet. */}
      <section id="reviews-proof" data-gy-reveal="up">
        <ClientReviews />
      </section>

      {/* Chapter 08 (2026-05-08), George's Selection. Replaces the
          prior Signature Yacht "Featured This Week" rotation slot
          with two Boss-curated cards: La Pellegrina 1 (Private
          Fleet flagship) + Errant Vagabond (Sailing Fleet
          flagship). No auto-rotation, no Sanity weekly pull
          this is the broker's hand-picked pair. */}
      <section id="selection" data-gy-reveal="up">
        <GeorgesSelection />
      </section>

      {/* 2026-07-03 (Wave 2), one quiet editorial line from the
          strongest page on the site to the two head-term guides.
          Boss homepage rules respected: no counts, no prices, no
          cards - just type.

          2026-08-21 (section 4). George flagged this line for centring. It was
          116px off centre at 1000px wide, and the global fix in section 2 put
          it right: measured 0px off at 1440, 1000, 768 and 390.

          What that left was the break. At the 720px reading cap the second
          line began "where others cannot", cutting the sentence mid-clause
          and leaving a short orphan under a long line. text-wrap: balance
          asks the browser to even the two lines instead, so the break falls
          near the comma where a reader would pause anyway. */}
      <section aria-label="Charter guides" style={{ background: "#0D1B2A", padding: "0 24px 64px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(15px, 1.8vw, 18px)", fontStyle: "italic", fontWeight: 300, color: "rgba(248,245,240,0.78)", margin: 0, lineHeight: 1.7, textWrap: "balance" }}>
          Two ways to take these waters:{" "}
          <a href="/crewed-yacht-charter-greece" style={{ color: "#DAA110", textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.5)" }}>
            the fully crewed charter
          </a>
          , or{" "}
          <a href="/catamaran-charter-greece" style={{ color: "#DAA110", textDecoration: "none", borderBottom: "1px solid rgba(218, 161, 16,0.5)" }}>
            the catamaran
          </a>
          {" "}that anchors where others cannot.
        </p>
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
          directive (along with TrendingYachts + Editor's Pick)
          eliminates the "shopping carousel" feel from the homepage. */}

      {/* 2026-05-08 (Phase 27i.19), MapboxFlyover removed from the
          homepage tree. Boss directive: it duplicated the work of the
          Regional Yacht Map below (both surfaces show islands with
          photos), so the two are merged into one. The Mapbox section
          also dragged Mapbox GL JS (~250 KB gz) into the homepage
          bundle for no incremental value, removing it is also a
          performance win. The component file stays on disk in case
          a future page wants it, but the homepage no longer mounts
          it. */}

      {/* Chapter 07 (2026-05-08), Three Greek Worlds.
          Replaces the prior <RegionalYachtMap /> per Boss directive:
          drop the interactive port map / yacht counts / disclaimer
          copy and surface a 3-card editorial section pointing at
          the new /destinations/{cyclades,ionian,saronic} pages.
          Boss spec: no yacht counts or prices anywhere on the
          homepage, the brand message is "we know these waters,
          we'll put you on the right yacht". */}
      <section id="destinations" data-gy-reveal="up">
        <ThreeGreekWorlds />
      </section>

      {/* Aegean wave divider, gold + ivory sine waves drifting in
          opposite directions, bridges the regional map (deep navy)
          into the Forbes section (also deep navy) so the transition
          reads as horizon, not as a hard edit. */}
      <WaveDivider height={64} intensity={0.85} />

      {/* Tier 1.3 (Forbes integration brief, May 2026), Forbes
          pull-quote section. Server-rendered: quote + attribution
          appear in initial HTML for SEO/AI crawlers. */}
      <div data-gy-reveal="up">
        <HomeForbesQuote />
      </div>

      {/* Phase 26 (luxury rebuild, 2026-05-05), AI itinerary preview
          on homepage too. Visitors landing from Forbes see the live
          texture-only AI tool without having to navigate to
          /greece-by-yacht. Texture only, never a proposal, the broker
          writes the real one (Boss directive). */}
      <div data-gy-reveal="up">
        <ItineraryPreview />
      </div>

      <section id="filotimo" data-gy-reveal="up">
        <Filotimon filotimoImage={filotimoImage} />
      </section>

      {/* Editor's Pick spotlight removed 2026-05-07 per Boss
          directive, same rationale as the Skipper's Pick removal
          above (yacht-discovery surface lives in FleetCTAs + the IG
          feed, not in inline shopping spots on the homepage). */}

      {/* Second Aegean horizon, bridges Filotimon's manifesto into
          the social-proof block so the cadence reads as continuous
          surf rather than stacked sections. Lower intensity than the
          map→Forbes one to keep the testimonials primary. */}
      <WaveDivider height={56} intensity={0.65} />

      <div data-gy-reveal="up">
        <BrokerTestimonials />
      </div>

      {/* B.6 (Roberto brief, May 2026), Journal teaser surfaces the
          3 most-recent blog posts so visitors see the editorial
          flywheel. Hidden when no posts are available. */}
      <div data-gy-reveal="up">
        <HomeJournalTeaser posts={latestPosts} />
      </div>

      {/* 2026-08-07, the homepage FAQ existed as schema only, with none of the
          answers readable on the page. Google does not credit invisible
          structured data, so the site's richest FAQ was almost certainly being
          discarded for search while AI engines read it happily. Rendering it
          here, closed by default so the page reads the same until someone asks.
          Same array feeds HomepageFaqSchema in app/page.jsx. */}
      <div data-gy-reveal="up">
        <PageFaq
          faq={HOME_FAQ}
          eyebrow="Straight answers"
          heading="What people ask before they charter"
          emitSchema={false}
        />
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
