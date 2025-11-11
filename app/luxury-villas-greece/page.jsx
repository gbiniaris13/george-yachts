import React from "react";
import { sanityClient } from "@/lib/sanity";
import VillaSwiper from "../components/VillaSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 1. Metadata added
export const metadata = {
  title: "Luxury Villas Greece & Mediterranean | George Yachts",
  description:
    "Discover bespoke luxury villa rentals, seafront homes, and investment opportunities across Greece and the Med. Curated by George Yachts.",
};

// 2. Query for villas
const ALL_VILLAS_QUERY = `*[_type == "villa"] | order(_createdAt asc){
  _id,
  name,
  location,
  bedrooms,
  facilities,
  rentalRates,
  availability,
  images[]{
  _   asset, 
    alt 
  }
}`;

// 3. Page converted to async Server Component
const LuxuryVillasPage = async () => {
  // 4. Data fetched on server
  let villas = [];
  try {
    villas = await sanityClient.fetch(ALL_VILLAS_QUERY);
  } catch (error) {
    console.error("Failed to fetch villas from Sanity:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="LUXURY VILLAS"
        subtitle="GREECE & THE MED"
        paragraph="Private villas, seafront homes & investment opportunities across Greece."
        imageUrl="/images/villas-real-estate.jpeg"
        altText="A luxury villa overlooking the ocean"
      />

      {/* 5. Simplified render logic (no isLoading) */}
      {villas.length > 0 ? (
        villas.map((villa) => <VillaSwiper key={villa._id} villaData={villa} />)
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no villas listed for rental. Please check back
            soon!
          </p>
        </section>
      )}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default LuxuryVillasPage;
