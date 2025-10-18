"use client";

import VideoSection from "./components/VideoSection";
import Disruptors from "./components/Disruptors";
import TwoColumnLayout from "./components/TwoColumnLayout";
import Footer from "./components/Footer";
import ContactFormSection from "./components/ContactFormSection";
import ScrollPopup from "./components/ScrollPopup";

// Renamed 'App' to 'Home' (or default export name for the page file)
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <VideoSection />
      <Disruptors />
      <TwoColumnLayout />
      <ContactFormSection />
      <Footer />
      <ScrollPopup />
    </div>
  );
};

export default Home;
