"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Senior HR and finance executive with deep expertise in corporate coordination, documentation, and client accounting.",
  "Elleanna is an independent advisor to George Yachts on business operations and finance, with an eye for clarity and discretion in every contract and payment schedule.",
];

const ElleanaKarvouniClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Elleana Karvouni"
        subtitle="Advisor"
        paragraph="Advisor, Business Operations & Finance"
        imageUrl="/images/elleanna.jpg" // Update with the correct profile image path
        altText="Portrait of Elleana Karvouni"
        instagramUrl="https://instagram.com/eleanna_karvoun"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA110]"
      />
      <MemberAboutSection
        name="ELLEANA"
        paragraphs={georgeParagraphs}
        ctaText="Contact Elleana"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/eleanna_karvoun"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-[#9CA3AF]"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ElleanaKarvouniClient;
