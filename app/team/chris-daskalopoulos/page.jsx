"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Licensed skipper and marine insurance consultant with hands-on experience across the Aegean and Ionian seas.",
  "Chris safeguards every charter with expert guidance on marine risk, safety protocols, and ISO maritime standards, ensuring George Yachts maintains full compliance with international yachting best practices.",
];

const ChrisDaskalopoulos = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="Chris Daskalopoulos"
        subtitle="Insurance & ISO"
        paragraph="Marine Insurance & ISO Maritime Compliance Advisor"
        imageUrl="/images/chris.jpg" // Update with the correct profile image path
        altText="Portrait of Chris Daskalopoulos"
        instagramUrl="https://instagram.com/dask15"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="CHRIS"
        paragraphs={georgeParagraphs}
        ctaText="Chris Daskalopoulos"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/dask15"
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

export default ChrisDaskalopoulos;
