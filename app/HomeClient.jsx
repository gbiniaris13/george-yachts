"use client";

import React from "react";
import dynamic from "next/dynamic";
import VideoSection from "./components/VideoSection";
import FleetCTAs from "./components/FleetCTAs";
import HomeStats from "./components/HomeStats";
import Footer from "./components/Footer";

// Dynamic imports for below-fold components — reduces initial JS bundle
const YourBroker = dynamic(() => import("./components/YourBroker"), { ssr: false });
const HowItWorks = dynamic(() => import("./components/HowItWorks"), { ssr: false });
const Filotimon = dynamic(() => import("./components/Filotimon"), { ssr: false });
const BrokerTestimonials = dynamic(() => import("./components/BrokerTestimonials"), { ssr: false });
const CredentialsStrip = dynamic(() => import("./components/CredentialsStrip"), { ssr: false });
const BudgetSlider = dynamic(() => import("./components/BudgetSlider"), { ssr: false });
const InteractiveTools = dynamic(() => import("./components/InteractiveTools"), { ssr: false });
// TwoColumnLayout (4 rotating panels) removed — content was redundant with hero + about + how-it-works
const ContactBar = dynamic(() => import("./components/ContactBar"), { ssr: false });
const ContactFormSection = dynamic(() => import("./components/ContactFormSection"), { ssr: false });

const HomeClient = ({ yachtCount, privateRange, explorerRange, budgetYachts }) => {
  return (
    <div className="min-h-screen bg-black font-sans">
      <VideoSection />
      <FleetCTAs privateRange={privateRange} explorerRange={explorerRange} />
      <HomeStats yachtCount={yachtCount} />
      <YourBroker />
      <HowItWorks />
      <Filotimon />
      <BrokerTestimonials />
      <CredentialsStrip />
      <BudgetSlider yachts={budgetYachts} />
      <InteractiveTools />
      {/* Extra breathing room where 4 rotating panels used to be */}
      <div className="py-10 md:py-20" />
      <ContactBar />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default HomeClient;
