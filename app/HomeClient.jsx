"use client";

import React from "react";
import dynamic from "next/dynamic";
import VideoSection from "./components/VideoSection";
import SignatureYacht from "./components/SignatureYacht";
import FleetCTAs from "./components/FleetCTAs";
import HomeStats from "./components/HomeStats";
import Footer from "./components/Footer";
import StickyMiniNav from "./components/StickyMiniNav";

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
}) => {
  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Sticky mini-nav surfaces after the hero (>600px) */}
      <StickyMiniNav />

      <VideoSection />

      {/* Signature Yacht slot (weekly auto-rotating feature) */}
      <section id="signature">
        <SignatureYacht yacht={signatureYacht} />
      </section>

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

      {/* Proof = Stats + Credentials merged (Proposal A) */}
      <HomeStats yachtCount={yachtCount} />

      {/* Meet George + how we work, merged into one section (Proposal B) */}
      <section id="how">
        <YourBroker />
      </section>

      {/* Interactive Greek waters map (statement piece) */}
      <section id="map">
        <GreekWatersMap />
      </section>

      <section id="filotimo">
        <Filotimon filotimoImage={filotimoImage} />
      </section>

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
