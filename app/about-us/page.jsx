import React from "react";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import AboutSection from "../components/AboutSection";

export const metadata = {
  title: "About Us | George Yachts | Boutique Yacht Brokerage Athens",
  description:
    "Learn about George Yachts, a boutique yacht brokerage based in Athens, Greece. We specialize in luxury yacht charters, sales, and management with transparent processes and personal communication.",
};

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="ABOUT US"
        subtitle="BOUTIQUE YACHT BROKERAGE FROM ATHENS"
        paragraph="360° luxury, one trusted team."
        imageUrl="/images/about-us-section.jpg"
        altText="A luxury private jet on a runway at sunset"
      />
      <AboutSection />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default AboutUsPage;
