import React from "react";
import { sanityClient } from "@/lib/sanity";
import SaleYachtSwiper from "../components/SaleYachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import { Check } from "lucide-react"; // Import Check icon

// 1. Metadata
export const metadata = {
  title: "Buy a Yacht | Off-Market & Partner Listings | George Yachts",
  description:
    "Buying a yacht in Greece or the Med? We source off-market & partner listings based on your exact specs. Share budget & timeline—get options.",
  alternates: {
    canonical: "https://georgeyachts.com/yachts-for-sale",
  },
};

// 2. GROQ query (Kept for future use if needed, currently unused in render)
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

// 3. Page Component
const BuyYachtPage = async () => {
  // 4. Data fetched on the server (Kept for potential future use)
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(ALL_SALE_YACHTS_QUERY);
  } catch (error) {
    console.error("Failed to fetch sale yachts from Sanity:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="BUY A YACHT"
        subtitle="ACQUISITION & ADVISORY"
        paragraph="Owning the sea starts with knowing its value."
        imageUrl="/images/buy-a-yacht.jpeg"
        altText="A large luxury yacht sailing on clear blue water at sunset"
      />

      {/* --- NEW CONTENT SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header & Intro */}
          <div className="text-center mb-16">
            <h1
              className="text-3xl md:text-5xl font-bold text-[#02132d] mb-4 uppercase"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              Buy a Yacht — Available on Request
            </h1>
            <p
              className="text-lg md:text-xl text-[#DAA520] mb-8 font-medium italic"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              Off-market opportunities & partner listings — tell us your specs
              and we will source options.
            </p>

            <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4 max-w-3xl mx-auto">
              <p>
                We keep yacht sourcing discreet — many of the best opportunities
                are off-market or shared privately through trusted broker
                networks.
              </p>
              <p>
                If you’re exploring a purchase, we can present curated options
                based on your length range, preferred brands, usage profile, and
                timeline. From the first shortlist to negotiation support,
                surveys, and closing coordination, we help you move with clarity
                and confidence.
              </p>
              <p className="font-semibold text-[#02132d]">
                Share your target specifications and we’ll return with relevant
                options and market guidance, without noise or wasted time.
              </p>
            </div>
          </div>

          {/* Bullet Points Section */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100">
            <h2
              className="text-2xl md:text-3xl font-bold text-[#02132d] mb-8 text-center"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              What We Can Arrange
            </h2>

            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
              {[
                "Curated shortlist based on your exact specifications",
                "Access to partner networks & off-market opportunities",
                "Pricing guidance, negotiation support & offer strategy",
                "Surveys, sea trials & technical due diligence coordination",
                "Ownership structure, flag & VAT guidance via trusted partners",
                "Crew, management & operational setup (if required)",
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-[#DAA520] mt-1 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- HIDDEN YACHT LISTING (Commented out as requested) --- */}
      {/* {yachts.length > 0 ? (
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
      */}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default BuyYachtPage;
