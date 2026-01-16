import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import YachtListClient from "../components/YachtListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Luxury Yacht Charter Greece | George Yachts",
  description:
    "Explore bespoke luxury yacht charters in Greece. Curated fleets across the Cyclades, Ionian, and Athens Riviera.",
  alternates: {
    canonical: "https://georgeyachts.com/charter-yacht-greece",
  },
};

// 1. UPDATED QUERY to fetch the PDF URL
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
  "brochure": brochure.asset->url, 
  images[]{
    asset, 
    alt 
  }
}`;

const YachtCharterPage = async () => {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(ALL_YACHTS_QUERY);
  } catch (error) {
    console.error("Failed to fetch yachts:", error);
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      {" "}
      {/* Obsidian Black Base */}
      <AboutUs
        heading="CHARTER"
        subtitle="A YACHT"
        paragraph="Explore bespoke luxury yacht charters in Greece. Curated fleets across the Cyclades, Ionian, and Athens Riviera."
        imageUrl="/images/yachts-charter.jpg"
        altText="Luxury yacht at sunset"
      />
      {/* The Interactive Section */}
      <YachtListClient initialYachts={yachts} />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default YachtCharterPage;
