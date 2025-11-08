"use client";

import React, { useState, useEffect } from "react";
// import { sanityClient } from "@/lib/sanity";
// import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const BuyYacht = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="BUY"
        subtitle="A YACHT"
        paragraph="Owning the sea starts with knowing its value."
        imageUrl="/images/buy-a-yacht.jpeg"
        altText="A large luxury yacht sailing on clear blue water at sunset"
      />

      <section className="text-center py-20">
        <p>Loading the available yachts...</p>
      </section>

      <section className="text-center py-20">
        <p>
          We currently have no yachts listed for purchase. Please check back
          soon!
        </p>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default BuyYacht;
