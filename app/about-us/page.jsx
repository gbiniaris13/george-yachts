"use client";

import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="ABOUT US"
        subtitle="LOOKING AFTER YOUR WORLD"
        paragraph="Appoint GEORGE YACHTS as your Central Agent to successfully charter your yacht."
        imageUrl="/images/yachts-charter.jpg"
        altText="A luxury private jet on a runway at sunset"
      />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default AboutUsPage;
