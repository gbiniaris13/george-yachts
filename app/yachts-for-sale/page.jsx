"use client";

import React, { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import SaleYachtSwiper from "../components/SaleYachtSwiper"; // 1. Import the new SaleYachtSwiper
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 2. New GROQ query for "saleYacht"
const ALL_SALE_YACHTS_QUERY = `*[_type == "saleYacht"] | order(_createdAt asc){
  _id,
  name,
  subtitle,
  length,
  yearBuiltRefit,
  sleeps,
  salePrice,
  images[]{
    asset, 
    alt 
  }
}`;

const BuyAYachtPage = () => {
  const [yachts, setYachts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSaleYachts() {
      try {
        const fetchedYachts = await sanityClient.fetch(ALL_SALE_YACHTS_QUERY);
        setYachts(fetchedYachts);
      } catch (error) {
        console.error("Failed to fetch sale yachts from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSaleYachts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="BUY A YACHT"
        subtitle="ACQUISITION & ADVISORY"
        paragraph="Discreet sourcing and expert advisory for your next yacht acquisition. Explore our curated listings."
        imageUrl="/images/buy-yacht-hero.jpg"
        altText="A large superyacht at anchor"
      />
      {isLoading && (
        <section className="text-center py-20">
          <p>Loading available yachts for sale...</p>
        </section>
      )}
      {!isLoading && yachts.length === 0 && (
        <section className="text-center py-20">
          <p>
            We currently have no yachts listed for sale. Please check back soon!
          </p>
        </section>
      )}
      {!isLoading &&
        yachts.length > 0 &&
        // 3. Map logic updated to use SaleYachtSwiper
        yachts.map((yacht) => (
          <SaleYachtSwiper key={yacht._id} yachtData={yacht} />
        ))}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default BuyAYachtPage;
