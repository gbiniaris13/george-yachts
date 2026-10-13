"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

// Mock data for the paragraphs
const georgeParagraphs = [
  "Born and raised in Athens, Greece, GK developed an early passion for Mediterranean culture and hospitality. He attended the American Community Schools of Athens before relocating to New York in 2004 to pursue his studies in Hospitality Management at the New York City College of Technology.",
  "Now based in New York, GK is an independent advisor to George Yachts on the U.S. luxury travel market. With over two decades in hospitality and travel, he connects North American luxury travel advisors with the house and advises on what American clients expect from a week in Greek waters.",
];

// Renamed to 'GeorgeKatrantzosClient'
const GeorgeKatrantzosClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="George Katrantzos"
        subtitle="U.S. Advisor"
        paragraph="Advisor, U.S. Luxury Travel"
        imageUrl="/images/george-katrantzos.jpg"
        altText="Portrait of George Katrantzos"
        instagramUrl="https://instagram.com/helllo.gk"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA110]"
      />
      <MemberAboutSection
        name="GEORGE"
        paragraphs={georgeParagraphs}
        ctaText="George Katrantzos"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/helllo.gk"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-[#9CA3AF]"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default GeorgeKatrantzosClient;
