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

const HomeClient = () => {
  return (
    <div className="min-h-screen bg-black font-sans">
      <VideoSection />
      <HomeStats />
      <Filotimon />
      <TwoColumnLayout />
      <ContactBar />
      <YourBroker />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default HomeClient;
