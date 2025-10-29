"use client";

import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import TeamSection from "../components/TeamSection";
import Footer from "../components/Footer";

const AboutUsPage = () => {
  return (
    <main>
      <AboutUs />
      <TeamSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
};

export default AboutUsPage;
