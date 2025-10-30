"use client";

import Footer from "@/components/Footer";
import ProfileSection from "@/components/ProfileSection"; // The split-screen component
import MemberAboutSection from "@/components/MemberAboutSection"; // The new component
import ContactFormSection from "@/components/ContactFormSection"; // Kept ContactForm

// Mock data for the paragraphs
const georgeParagraphs = [
  "Born and raised in Athens, Greece, GK developed an early passion for Mediterranean culture and hospitality. He attended the American Community Schools of Athens before relocating to New York in 2004 to pursue his studies in Hospitality Management at the New York City College of Technology.",
  "Now based in New York, GK brings over two decades of experience in the hospitality and travel industries, bridging the elegance of Greek luxury with the sophistication of the U.S. market. As U.S. Partner and Director of Sales & Communications for George Yachts, GK leads the brand’s expansion across the American luxury travel sector, fostering partnerships with top-tier travel advisors and promoting bespoke yacht experiences throughout Greece.",
];

const GeorgeKatrantzos = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* 1. The Split-Screen Profile Section (from before) */}
      <ProfileSection
        heading="George Katrantzos"
        subtitle="Sales Director"
        paragraph="U.S. Partner & Sales Director, George Yachts"
        imageUrl="/images/george-katrantzos.jpg" // Update with the correct profile image path
        altText="Portrait of George Katrantzos"
        instagramUrl="https://instagram.com/helllo.gk"
        bgColor="bg-black"
        textColor="text-white"
        accentColor="text-[#DAA520]"
      />

      {/* 2. The New Detailed "About" Section */}
      <MemberAboutSection
        name="GEORGE"
        paragraphs={georgeParagraphs}
        ctaText="George Katrantzos"
        ctaUrl="/contact"
        // Socials are passed here again for the bottom section
        instagramUrl="https://instagram.com/helllo.gk"
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

export default GeorgeKatrantzos;
