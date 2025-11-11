import React from "react";
import { sanityClient } from "@/lib/sanity";
import YachtSwiper from "../components/YachtSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

// 1. Metadata for SEO
export const metadata = {
  title: "Luxury Yacht Charter Greece | George Yachts",
  description:
    "Explore bespoke luxury yacht charters in Greece and the Mediterranean. Contact George Yachts to customize your sailing experience today.",
};

// 2. GROQ query
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

// 3. Page converted to an async Server Component
const YachtCharterPage = async () => {
  // 4. Data is fetched on the server (no more useState/useEffect)
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(ALL_YACHTS_QUERY);
  } catch (error) {
    console.error("Failed to fetch yachts from Sanity:", error);
  }

  // 5. Render logic is now simpler (no 'isLoading' state)
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="CHARTER"
        subtitle="A YACHT"
        paragraph="Contact GEORGE YACHTS today to fully customize your charter experience anywhere in the world."
        imageUrl="/images/yachts-charter.jpg"
        altText="A large luxury yacht sailing on clear blue water at sunset"
      />

      {/* 6. Simplified rendering: Show yachts or show the "empty" message */}
      {yachts.length > 0 ? (
        yachts.map((yacht) => <YachtSwiper key={yacht._id} yachtData={yacht} />)
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no yachts listed for charter. Please check back
            soon!
          </p>
        </section>
      )}

      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default YachtCharterPage;
