"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

// Mock data for the paragraphs
const georgeParagraphs = [
  "Managing Broker of George Yachts and member of the International Yacht Brokers Association (IYBA), George specializes in high-end motor yacht charters across the Mediterranean.",
  "With an extensive background in luxury hospitality, leadership, and client relations, he approaches every charter with discretion, precision, and a deep understanding of UHNWI expectations.",
  "Strategically focused on the East Med—including the Ionian, Cyclades, and Saronic islands—George is trusted by international families and private brokers from the U.S., U.K., and Middle East. He bridges local expertise with international operational standards to deliver seamless maritime experiences.",
  "“Smooth seas & sharp suits.”",
];

// Renamed to 'GeorgeBiniarisClient'
const GeorgeBiniarisClient = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="George P. Biniaris"
        subtitle="Managing Broker"
        imageUrl="/images/george.jpg"
        altText="Portrait of George Biniaris"
        instagramUrl="https://instagram.com/george_p.biniaris"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#7a6200]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="GEORGE"
        paragraphs={georgeParagraphs}
        ctaText="Contact George"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/george_p.biniaris"
        // linkedinUrl="https://linkedin.com/in/..."
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-gray-700"
      />

      {/* 3. The Contact Form */}
      <ContactFormSection />

      {/* 4. The Footer */}
      <Footer />
    </div>
  );
};

export default GeorgeBiniarisClient;
