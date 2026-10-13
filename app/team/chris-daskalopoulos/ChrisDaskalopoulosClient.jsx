"use client";

import React from "react";
import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection";
import MemberAboutSection from "@/components/MemberAboutSection";
import ContactFormSection from "@/components/ContactFormSection";

const georgeParagraphs = [
  "Licensed skipper and marine insurance consultant with hands-on experience across the Aegean and Ionian seas.",
  <>Chris is with{" "}<a href="https://wattrate.gr/en/" target="_blank" rel="noopener" className="underline underline-offset-4">Wattrate</a>, an independent ISO, climate law and ESG advisory in Greece. George Yachts calls on him as an outside advisor on marine insurance and standards-based compliance questions.</>,
];

const ChrisDaskalopoulosClient = () => {
  return (
    <div className="min-h-screen font-sans">
      <ProfileSection
        heading="Chris Daskalopoulos"
        subtitle="Independent Advisor"
        paragraph="Independent Advisor, Marine Insurance & ISO"
        imageUrl="/images/chris.jpg"
        altText="Portrait of Chris Daskalopoulos"
        instagramUrl="https://instagram.com/dask15"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA110]"
      />

      <MemberAboutSection
        name="CHRIS"
        paragraphs={georgeParagraphs}
        ctaText="Chris Daskalopoulos"
        ctaUrl="/contact"
        instagramUrl="https://instagram.com/dask15"
        bgColor="bg-white"
        headingColor="text-black"
        textColor="text-[#9CA3AF]"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default ChrisDaskalopoulosClient;
