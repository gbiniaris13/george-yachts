"use client";

import React from "react";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import TeamSection from "../components/TeamSection";

// This component contains all the interactive client-side logic
const TeamPageClient = () => {
  return (
    <main>
      <AboutUs />
      <TeamSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
};

export default TeamPageClient;
