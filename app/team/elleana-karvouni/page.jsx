"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Senior HR and finance executive with deep expertise in corporate coordination, documentation, and client accounting.",
  "Elleanna structures the financial backbone of George Yachts, ensuring every transaction, contract, and agreement meets the highest standards of clarity, discretion, and trust.",
];

const ElleanaKarvouni = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="Elleana Karvouni"
        subtitle="Operations & Finance"
        paragraph="Head of Business Operations & Finance"
        imageUrl="/images/elleanna.jpg" // Update with the correct profile image path
        altText="Portrait of Elleana Karvouni"
        instagramUrl="https://instagram.com/eleanna_karvoun"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="ELLEANA"
        paragraphs={georgeParagraphs}
        ctaText="Contact Elleana"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/eleanna_karvoun"
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

export default ElleanaKarvouni;
