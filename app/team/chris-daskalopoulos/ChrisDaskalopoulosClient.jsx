"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

const georgeParagraphs = [
  "Licensed skipper and marine insurance consultant with hands-on experience across the Aegean and Ionian seas.",
  "Chris safeguards every charter with expert guidance on marine risk, safety protocols, and ISO maritime standards, ensuring George Yachts maintains full compliance with international yachting best practices.",
];

const ChrisDaskalopoulosClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Chris Daskalopoulos"
        subtitle="Insurance & ISO"
        paragraph="Marine Insurance & ISO Maritime Compliance Advisor"
        imageUrl="/images/chris.jpg"
        altText="Portrait of Chris Daskalopoulos"
        instagramUrl="https://instagram.com/dask15"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#CEA681]"
      />

      <MemberAboutSection
        name="CHRIS"
        paragraphs={georgeParagraphs}
        ctaText="Chris Daskalopoulos"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/dask15"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-gray-700"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ChrisDaskalopoulosClient;
