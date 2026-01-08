import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import YachtListClient from "../components/YachtListClient";

export const metadata = {
  title: "Luxury Yacht Charter Greece | George Yachts",
  description:
    "Explore bespoke luxury yacht charters in Greece. Curated fleets across the Cyclades, Ionian, and Athens Riviera.",
};

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
        paragraph="Contact George Yachts to create a bespoke yacht charter experience in Greece. We specialize exclusively in Greek waters, with curated yachts across the Cyclades, Ionian Islands, Saronic Gulf and the Athens Riviera."
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
