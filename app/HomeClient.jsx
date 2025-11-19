"use client";

import React from "react";
import VideoSection from "./components/VideoSection";
import Disruptors from "./components/Disruptors";
import TwoColumnLayout from "./components/TwoColumnLayout";
import Footer from "./components/Footer";
import ContactFormSection from "./components/ContactFormSection";

// Renamed 'Home' to 'HomeClient'
const HomeClient = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <VideoSection />
      <Disruptors />
      <TwoColumnLayout />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default HomeClient;
