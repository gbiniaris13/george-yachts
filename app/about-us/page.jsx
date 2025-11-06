"use client";

import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import TeamSection from "../components/TeamSection";
import AboutSection from "../components/AboutSection";

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
