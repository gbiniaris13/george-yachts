"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

// Mock data for the paragraphs
const georgeParagraphs = [
  "Born and raised in Athens, Greece, GK developed an early passion for Mediterranean culture and hospitality. He attended the American Community Schools of Athens before relocating to New York in 2004 to pursue his studies in Hospitality Management at the New York City College of Technology.",
  "Now based in New York, GK brings over two decades of experience in the hospitality and travel industries, bridging the elegance of Greek luxury with the sophistication of the U.S. market. As U.S. Partner and Director of Sales & Communications for George Yachts, GK leads the brand’s expansion across the American luxury travel sector, fostering partnerships with top-tier travel advisors and promoting bespoke yacht experiences throughout Greece.",
];

// Renamed to 'GeorgeKatrantzosClient'
const GeorgeKatrantzosClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="George Katrantzos"
        subtitle="U.S. partner"
        paragraph="U.S. Partner & Sales Director, George Yachts"
        imageUrl="/images/george-katrantzos.jpg"
        altText="Portrait of George Katrantzos"
        instagramUrl="https://instagram.com/helllo.gk"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#7a6200]"
      />
      <MemberAboutSection
        name="GEORGE"
        paragraphs={georgeParagraphs}
        ctaText="George Katrantzos"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/helllo.gk"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-gray-700"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default GeorgeKatrantzosClient;
