import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import YachtListClient from "../components/YachtListClient";

// Force dynamic rendering to ensure fresh data on every visit
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Luxury Yacht Charter Greece | George Yachts",
  description:
    "Explore bespoke luxury yacht charters in Greece. Curated fleets across the Cyclades, Ionian, and Athens Riviera.",
  alternates: {
    canonical: "https://georgeyachts.com/charter-yacht-greece",
  },
};

// 1. QUERY WITH LQIP METADATA FOR BLUR EFFECT
const ALL_YACHTS_QUERY = `*[_type == "yacht"] | order(_createdAt asc){
  _id,
  name,
  category,
  subtitle,
  length,
  yearBuiltRefit,
  sleeps,
  cruisingRegion,
  weeklyRatePrice,
  slug,
  "brochure": brochure.asset->url, 
  images[]{
    asset->{
      _id,
      url,
      metadata {
        lqip
      }
    },
    alt 
  }
}`;

// --- PRICE PARSER ---
const getPriceValue = (priceStr) => {
  if (!priceStr) return 999999999;

  const str = String(priceStr).trim();
  const lower = str.toLowerCase();

  if (
    lower.includes("request") ||
    lower.includes("application") ||
    lower.includes("contact")
  ) {
    return 999999999;
  }

  // Regex to find the first sequence of numbers (e.g. "20.000")
  const match = str.match(/([0-9]+[.,]?[0-9]*)/);

  if (!match) return 999999999;

  // Remove dots/commas to get raw integer
  const cleanNumString = match[0].replace(/[.,]/g, "");

  return parseInt(cleanNumString, 10);
};

const YachtCharterPage = async () => {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(ALL_YACHTS_QUERY);

    // --- SORT: CHEAPEST FIRST ---
    yachts.sort((a, b) => {
      const priceA = getPriceValue(a.weeklyRatePrice);
      const priceB = getPriceValue(b.weeklyRatePrice);
      return priceA - priceB;
    });
  } catch (error) {
    console.error("Failed to fetch yachts:", error);
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <AboutUs
        heading="CHARTER"
        subtitle="A YACHT"
        paragraph="Explore bespoke luxury yacht charters in Greece. Curated fleets across the Cyclades, Ionian, and Athens Riviera."
        imageUrl="/images/yachts-charter.jpg"
        altText="Luxury yacht at sunset"
      />
      {/* Pass the sorted yachts to the Client Component */}
      <YachtListClient initialYachts={yachts} />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default YachtCharterPage;
