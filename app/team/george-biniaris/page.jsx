"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Founder of George Yachts and member of the International Yacht Brokers Association (IYBA), George specializes in high-end motor yacht charters across Greece and the Mediterranean.",
  "With a background in luxury hospitality, leadership and client relations, he approaches every charter with discretion, precision and a deep understanding of HNW expectations.",
  "Based in Athens, trusted by international families and private brokers from the U.S., U.K. & Middle East.",
  "“Smooth seas & sharp suits.”",
];

const GeorgeBiniaris = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="George Biniaris"
        subtitle="CEO"
        paragraph="Founder and CEO of GEORGE YACHTS"
        imageUrl="/images/george.jpg" // Update with the correct profile image path
        altText="Portrait of George Biniaris"
        instagramUrl="https://instagram.com/george_p.biniaris"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="GEORGE"
        paragraphs={georgeParagraphs}
        ctaText="Contact George"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/george_p.biniaris"
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

export default GeorgeBiniaris;
