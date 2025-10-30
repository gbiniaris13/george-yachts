"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "She speaks rarely. She judges instantly. Nemesis oversees loyalty within George Yachts, making sure every deal is clean and every client intention… pure.",
  "With the authority of a silent underboss, she guards the team with an ancient code -  respect, discretion, and unspoken power.",
  "No paperwork moves without her approval. No betrayal survives her stare.",
];

const Nemesis = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="Nemesis"
        subtitle="Internal Justice"
        paragraph="Director of Internal Justice & Loyalty Enforcement"
        imageUrl="/images/nemesis.jpg" // Update with the correct profile image path
        altText="Portrait of Nemesis"
        // instagramUrl="https://instagram.com/valeria_karv"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="NEMESIS"
        paragraphs={georgeParagraphs}
        ctaText="Nemesis"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        // instagramUrl="https://instagram.com/valeria_karv"
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

export default Nemesis;
