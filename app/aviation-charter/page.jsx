"use client";

import React, { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const ALL_JETS_QUERY = `*[_type == "jet"] | order(_createdAt asc){
  _id,
  name,
  subtitle,
  cruisingSpeed, 
  range,          
  capacity,       
  powerplant,     
  price,
  images[]{
    asset, 
    alt 
  }
}`;

const AviationCharterPage = () => {
  const [jets, setJets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJets() {
      try {
        const fetchedJets = await sanityClient.fetch(ALL_JETS_QUERY);
        setJets(fetchedJets);
      } catch (error) {
        console.error("Failed to fetch jets from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="FLY PRIVATE"
        subtitle="HELICOPTERS & JETS"
        paragraph="Contact GEORGE YACHTS today to fully customize your charter experience anywhere in the world."
        imageUrl="/images/george-aviation.jpg"
        altText="A luxury private jet on a runway at sunset"
      />
      {isLoading && (
        <section className="text-center py-20">
          <p>Loading the available jets...</p>
        </section>
      )}
      {!isLoading && jets.length === 0 && (
        <section className="text-center py-20">
          <p>
            We currently have no jets listed for charter. Please check back
            soon!
          </p>
        </section>
      )}
      {!isLoading &&
        jets.length > 0 &&
        jets.map((jet) => <YachtSwiper key={jet._id} yachtData={jet} />)}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default AviationCharterPage;
