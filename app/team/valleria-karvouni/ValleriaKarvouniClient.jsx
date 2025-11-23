"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

const georgeParagraphs = [
  "With an accounting background and strong organisational discipline, Valleria supports the administrative core of our operations.",
  "From documentation to guest logistics, she brings precision, calm, and quiet strength - the kind of order luxury requires.",
];

const ValleriaKarvouniClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Valleria Karvouni"
        subtitle="Logistics Coordinator"
        paragraph="Administrative & Charter Logistics Coordinator"
        imageUrl="/images/valeria.jpg"
        altText="Portrait of Valleria Karvouni"
        instagramUrl="https://instagram.com/valeria_karv"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#7a6200]"
      />
      <MemberAboutSection
        name="VALLERIA"
        paragraphs={georgeParagraphs}
        ctaText="Valleria Karvouni"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/valeria_karv"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-gray-700"
      />
            <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ValleriaKarvouniClient;
