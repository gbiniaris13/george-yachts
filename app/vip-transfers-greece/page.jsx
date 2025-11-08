"use client";

import React, { useState, useEffect } from "react";
// import { sanityClient } from "@/lib/sanity";
// import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const VipTransfers = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="TRANSFERS"
        subtitle="VIP CHAUFFER SERVICES"
        paragraph="Because every arrival tells a story."
        imageUrl="/images/vip-transfers.jpeg"
        altText="A large linfinity pool"
      />

      <section className="text-center py-20">
        <p>Loading the available VIP Transfers...</p>
      </section>

      <section className="text-center py-20">
        <p>
          We currently have no VIP Transfers listed for purchase. Please check
          back soon!
        </p>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default VipTransfers;
