"use client";

import React, { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import TransferSwiper from "../components/TransferSwiper"; // 1. Import the new TransferSwiper
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 2. New GROQ query for Transfers
const ALL_TRANSFERS_QUERY = `*[_type == "transfer"] | order(_createdAt asc){
  _id,
  vehicleType,
  capacity,
  availability,
  includes,
  transfersFromTo,
  images[]{
    asset, 
    alt 
  }
}`;

const VipTransfersPage = () => {
  // 3. State updated to 'transfers'
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Fetch logic updated to 'fetchTransfers'
  useEffect(() => {
    async function fetchTransfers() {
      try {
        const fetchedTransfers = await sanityClient.fetch(ALL_TRANSFERS_QUERY);
        setTransfers(fetchedTransfers);
      } catch (error) {
        console.error("Failed to fetch transfers from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransfers();
  }, []);

  // 5. JSX updated with new content
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="VIP TRANSFERS"
        subtitle="SEAMLESS & LUXURIOUS"
        paragraph="Your journey, curated from start to finish. Arrive in style with our fleet of luxury vehicles and professional chauffeurs."
        imageUrl="/images/transfers-hero.jpg" // Make sure this image exists in /public/images/
        altText="A luxury sedan interior"
      />
      {isLoading && (
        <section className="text-center py-20">
          <p>Loading available vehicles...</p>
        </section>
      )}
      {!isLoading && transfers.length === 0 && (
        <section className="text-center py-20">
          <p>
            We currently have no vehicles listed for transfer. Please check back
            soon!
          </p>
        </section>
      )}
      {!isLoading &&
        transfers.length > 0 &&
        // 6. Map logic updated to use TransferSwiper
        transfers.map((transfer) => (
          <TransferSwiper key={transfer._id} transferData={transfer} />
        ))}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default VipTransfersPage;
