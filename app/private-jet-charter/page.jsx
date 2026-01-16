import React from "react";
import { sanityClient } from "@/lib/sanity";
import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 1. Metadata for SEO
export const metadata = {
  title: "Private Jet & Helicopter Charter | George Yachts",
  description:
    "Book private jets and helicopters with George Yachts. We offer 24/7 bespoke aviation services for Athens, the Greek islands, and the Mediterranean.",
  alternates: {
    canonical: "https://georgeyachts.com/private-jet-charter",
  },
};

// 2. GROQ query for jets
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

// 3. Page converted to an async Server Component
const AviationCharterPage = async () => {
  // 4. Data fetched on the server
  let jets = [];
  try {
    jets = await sanityClient.fetch(ALL_JETS_QUERY);
  } catch (error) {
    console.error("Failed to fetch jets from Sanity:", error);
  }

  // 5. Render logic
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="FLY PRIVATE"
        subtitle="HELICOPTERS & JETS"
        paragraph="Contact GEORGE YACHTS today to fully customize your charter experience anywhere in the world."
        imageUrl="/images/george-aviation.jpg"
        altText="A luxury private jet on a runway at sunset"
      />

      {/* 6. Simplified render logic (no 'isLoading') */}
      {jets.length > 0 ? (
        jets.map((jet) => <YachtSwiper key={jet._id} yachtData={jet} />)
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no jets listed for charter. Please check back
            soon!
          </p>
        </section>
      )}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default AviationCharterPage;
