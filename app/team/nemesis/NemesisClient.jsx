"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

const georgeParagraphs = [
  "She speaks rarely. She judges instantly. Nemesis oversees loyalty within George Yachts, making sure every deal is clean and every client intention… pure.",
  "With the authority of a silent underboss, she guards the team with an ancient code -  respect, discretion, and unspoken power.",
  "No paperwork moves without her approval. No betrayal survives her stare.",
];

const NemesisClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Nemesis"
        subtitle="Internal Justice"
        paragraph="Director of Internal Justice & Loyalty Enforcement"
        imageUrl="/images/nemesis.jpg"
        altText="Portrait of Nemesis"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      <MemberAboutSection
        name="NEMESIS"
        paragraphs={georgeParagraphs}
        ctaText="Nemesis"
        ctaUrl="/contact"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-gray-700"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default NemesisClient;
