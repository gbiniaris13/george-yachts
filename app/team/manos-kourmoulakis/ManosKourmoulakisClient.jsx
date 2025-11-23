"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

// Mock data for the paragraphs
const georgeParagraphs = [
  "Former Olympic Airways captain with decades of aviation precision.",
  "Captain Kourmoulakis advises on private travel partnerships, jet coordination, and high-profile client logistics - allowing our guests to experience seamless movement from sky to sea.",
];

const ManosKourmoulakisClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Cpt. Emmanouil 'Manos' Kourmoulakis"
        subtitle="Aviation"
        paragraph="Aviation & Private Travel Advisor"
        imageUrl="/images/manos-new.jpg"
        altText="Portrait of Manos Kourmoulakis"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#7a6200]"
      />
      <MemberAboutSection
        name="MANOS"
        paragraphs={georgeParagraphs}
        ctaText="Manos Kourmoulakis"
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

export default ManosKourmoulakisClient;
