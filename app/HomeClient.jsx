"use client";

import React from "react";
import VideoSection from "./components/VideoSection";
import HomeStats from "./components/HomeStats";
import TwoColumnLayout from "./components/TwoColumnLayout";
import Footer from "./components/Footer";
import ContactFormSection from "./components/ContactFormSection";
import Filotimon from "./components/Filotimon";
import CustomCursor from "./components/CustomCursor";

const HomeClient = () => {
  return (
    <div className="min-h-screen bg-black font-sans">
      <CustomCursor />
      <VideoSection />
      <HomeStats />
      <Filotimon />
      <TwoColumnLayout />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default HomeClient;
