"use client";

import React from "react";
import dynamic from "next/dynamic";
import VideoSection from "./components/VideoSection";
import SignatureYacht from "./components/SignatureYacht";
import FleetCTAs from "./components/FleetCTAs";
import HomeStats from "./components/HomeStats";
import Footer from "./components/Footer";
import StickyMiniNav from "./components/StickyMiniNav";

// Dynamic imports for below-fold components — reduces initial JS bundle
const YourBroker = dynamic(() => import("./components/YourBroker"), { ssr: false });
const HowItWorks = dynamic(() => import("./components/HowItWorks"), { ssr: false });
const Filotimon = dynamic(() => import("./components/Filotimon"), { ssr: false });
const GreekWatersMap = dynamic(() => import("./components/GreekWatersMap"), { ssr: false });
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"), { ssr: false });
const CredentialsStrip = dynamic(() => import("./components/CredentialsStrip"), { ssr: false });
const BudgetSlider = dynamic(() => import("./components/BudgetSlider"), { ssr: false });
const InteractiveTools = dynamic(() => import("./components/InteractiveTools"), { ssr: false });
// TwoColumnLayout (4 rotating panels) removed — content was redundant with hero + about + how-it-works
const ContactBar = dynamic(() => import("./components/ContactBar"), { ssr: false });
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"), { ssr: false });

const HomeClient = ({
  yachtCount,
  privateRange,
  explorerRange,
  budgetYachts,
  privateHeroImage,
  explorerHeroImage,
  privateCount,
  explorerCount,
  signatureYacht,
  filotimoImage,
}) => {
  return (
    <div className="min-h-screen bg-black font-sans">
      {/* A2 — Sticky mini-nav surfaces after the hero (>600px) */}
      <StickyMiniNav />

      <VideoSection />
      {/* Move #3 — Signature Yacht slot (weekly auto-rotating feature) */}
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
      <HomeStats yachtCount={yachtCount} />
      <YourBroker />
      <section id="how">
        <HowItWorks />
      </section>
      {/* Move #5 — Interactive Greek waters map (statement piece) */}
      <section id="map">
        <GreekWatersMap />
      </section>
      <section id="filotimo">
        <Filotimon filotimoImage={filotimoImage} />
      </section>
      <BrokerTestimonials />
      <CredentialsStrip />
      <BudgetSlider yachts={budgetYachts} />
      <InteractiveTools />
      {/* Extra breathing room where 4 rotating panels used to be */}
      <div className="py-10 md:py-20" />
      <section id="contact">
        <ContactBar />
        <ContactFormSection />
      </section>
      <Footer />
    </div>
  );
};

export default HomeClient;
