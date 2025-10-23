"use client";

import React, { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// GROQ query to get all published yachts
const ALL_YACHTS_QUERY = `*[_type == "yacht"] | order(_createdAt asc){
  _id,
  name,
  subtitle,
  length,
  yearBuiltRefit,
  sleeps,
  cruisingRegion,
  weeklyRatePrice,
  images[]{
    asset, 
    alt 
  }
}`;

const YachtCharterPage = () => {
  // 1. STATE MANAGEMENT
  const [yachts, setYachts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. DATA FETCHING (Client-side via useEffect)
  useEffect(() => {
    async function fetchYachts() {
      try {
        const fetchedYachts = await sanityClient.fetch(ALL_YACHTS_QUERY);
        setYachts(fetchedYachts);
      } catch (error) {
        console.error("Failed to fetch yachts from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchYachts();
  }, []);

  // 3. RENDER LOGIC
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="CHARTER"
        subtitle="A YACHT"
        paragraph="Contact GEORGE YACHTS today to fully customize your charter experience anywhere in the world."
        imageUrl="/images/yachts-charter.jpg"
        altText="A large luxury yacht sailing on clear blue water at sunset"
      />

      {/* Conditional Rendering based on fetch state */}
      {isLoading && (
        <section className="text-center py-20">
          <p>Loading the available yachts...</p>
        </section>
      )}

      {!isLoading && yachts.length === 0 && (
        <section className="text-center py-20">
          <p>
            We currently have no yachts listed for charter. Please check back
            soon!
          </p>
        </section>
      )}

      {!isLoading &&
        yachts.length > 0 &&
        yachts.map((yacht) => (
          <YachtSwiper
            key={yacht._id}
            yachtData={yacht} // Pass the individual yacht data to the component
          />
        ))}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default YachtCharterPage;
