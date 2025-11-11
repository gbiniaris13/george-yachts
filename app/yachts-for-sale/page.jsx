import React from "react";
import { sanityClient } from "@/lib/sanity";
import SaleYachtSwiper from "../components/SaleYachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 1. Metadata (from original page.jsx)
export const metadata = {
  title: "Yachts for Sale | George Yachts | Yacht Acquisition & Advisory",
  description:
    "Explore curated listings of luxury yachts for sale. George Yachts offers discreet sourcing and expert advisory for your next yacht acquisition.",
};

// 2. GROQ query (from BuyYachtClient.jsx)
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

// 3. Page converted to an async Server Component
const BuyYachtPage = async () => {
  // 4. Data fetched on the server
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(ALL_SALE_YACHTS_QUERY);
  } catch (error) {
    console.error("Failed to fetch sale yachts from Sanity:", error);
  }

  // 5. Return statement (from BuyYachtClient.jsx)
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="BUY"
        subtitle="A YACHT"
        paragraph="Owning the sea starts with knowing its value."
        imageUrl="/images/buy-a-yacht.jpeg"
        altText="A large luxury yacht sailing on clear blue water at sunset"
      />

      {/* 6. Simplified render logic (no isLoading) */}
      {yachts.length > 0 ? (
        yachts.map((yacht) => (
          <SaleYachtSwiper key={yacht._id} yachtData={yacht} />
        ))
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no yachts listed for purchase. Please check back
            soon!
          </p>
        </section>
      )}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default BuyYachtPage;
