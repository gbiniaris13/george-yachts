"use client";

import React, { useState, useEffect } from "react";
// import { sanityClient } from "@/lib/sanity";
// import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const LuxuryVillas = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="VILLAS"
        subtitle="REAL ESTATE"
        paragraph="Private villas, seafront homes & investment opportunities across Greece."
        imageUrl="/images/villas-real-estate.jpeg"
        altText="A large linfinity pool"
      />

      <section className="text-center py-20">
        <p>Loading the available villas...</p>
      </section>

      <section className="text-center py-20">
        <p>
          We currently have no villas listed for purchase. Please check back
          soon!
        </p>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default LuxuryVillas;
