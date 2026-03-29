"use client";

import React from "react";
import VideoSection from "./components/VideoSection";
import HomeStats from "./components/HomeStats";
import TwoColumnLayout from "./components/TwoColumnLayout";
import Footer from "./components/Footer";
import ContactFormSection from "./components/ContactFormSection";
import Filotimon from "./components/Filotimon";
import ContactBar from "./components/ContactBar";
import YourBroker from "./components/YourBroker";
import HowItWorks from "./components/HowItWorks";
import CredentialsStrip from "./components/CredentialsStrip";
import InteractiveTools from "./components/InteractiveTools";

const HomeClient = () => {
  return (
    <div className="min-h-screen bg-black font-sans">
      <VideoSection />
      <HomeStats />
      <YourBroker />
      <HowItWorks />
      <Filotimon />
      <CredentialsStrip />
      <InteractiveTools />
      <TwoColumnLayout />
      <ContactBar />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default HomeClient;
