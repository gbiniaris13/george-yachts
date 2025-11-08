"use client";

import React, { useState, useEffect } from "react";
// import { sanityClient } from "@/lib/sanity";
// import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const YachtItineraries = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="YACHT"
        subtitle="ITINERARIES"
        paragraph="The art of the Greek voyage."
        imageUrl="/images/yacht-itineraries.jpeg"
        altText="A female figure showing her legs and enjoying life on a yacht"
      />

      <section className="text-center py-20">
        <p>Loading the available yacht itineraries...</p>
      </section>

      <section className="text-center py-20">
        <p>
          We currently have no yacht itineraries listed yet. Please check back
          soon!
        </p>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default YachtItineraries;
