"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "With an accounting background and strong organisational discipline, Valleria supports the administrative core of our operations.",
  "From documentation to guest logistics, she brings precision, calm, and quiet strength - the kind of order luxury requires.",
];

const ValleriaKarvouni = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="Valleria Karvouni"
        subtitle="Logistics Coordinator"
        paragraph="Administrative & Charter Logistics Coordinator"
        imageUrl="/images/valeria.jpg" // Update with the correct profile image path
        altText="Portrait of Valleria Karvouni"
        instagramUrl="https://instagram.com/valeria_karv"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="VALLERIA"
        paragraphs={georgeParagraphs}
        ctaText="Valleria Karvouni"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/valeria_karv"
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

export default ValleriaKarvouni;
