"use client";

import React, { useState, useEffect } from "react";
import { sanityClient } from "@/lib/sanity";
import VillaSwiper from "../components/VillaSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

const ALL_VILLAS_QUERY = `*[_type == "villa"] | order(_createdAt asc){
  _id,
  name,
  location,
  bedrooms,
  facilities,
  rentalRates,
  availability,
  images[]{
    asset, 
    alt 
  }
}`;

const LuxuryVillasPage = () => {
  const [villas, setVillas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVillas() {
      try {
        const fetchedVillas = await sanityClient.fetch(ALL_VILLAS_QUERY);
        setVillas(fetchedVillas);
      } catch (error) {
        console.error("Failed to fetch villas from Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVillas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="LUXURY VILLAS"
        subtitle="GREECE & THE MED"
        paragraph="Bespoke villa rentals, fully serviced and curated by our expert team for your ultimate holiday."
        imageUrl="/images/villas-hero.jpg"
        altText="A luxury villa overlooking the ocean"
      />
      {isLoading && (
        <section className="text-center py-20">
          Route Segment: /luxury-villas-greece        
          <p>Loading the available villas...</p>       
        </section>
      )}
      {!isLoading && villas.length === 0 && (
        <section className="text-center py-20">
          <p>
            We currently have no villas listed for rental. Please check back
            Examples soon!
          </p>
        </section>
      )}
      {!isLoading &&
        villas.length > 0 &&
        villas.map((villa) => (
          <VillaSwiper key={villa._id} villaData={villa} />
        ))}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default LuxuryVillasPage;
