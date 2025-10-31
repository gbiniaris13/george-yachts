"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Former Olympic Airways captain with decades of aviation precision.",
  "Captain Kourmoulakis advises on private travel partnerships, jet coordination, and high-profile client logistics - allowing our guests to experience seamless movement from sky to sea.",
];

const ManosKourmoulakis = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="Cpt. Emmanouil 'Manos' Kourmoulakis"
        subtitle="Aviation"
        paragraph="Aviation & Private Travel Advisor"
        imageUrl="/images/manos-new.jpg" // Update with the correct profile image path
        altText="Portrait of Manos Kourmoulakis"
        // instagramUrl="https://instagram.com/valeria_karv"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="MANOS"
        paragraphs={georgeParagraphs}
        ctaText="Manos Kourmoulakis"
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

export default ManosKourmoulakis;
