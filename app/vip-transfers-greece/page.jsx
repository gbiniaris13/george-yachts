import React from "react";
import { sanityClient } from "@/lib/sanity";
import TransferSwiper from "../components/TransferSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";

export const revalidate = 0;

export const metadata = {
  title: "VIP Transfers Athens & Greece | George Yachts",
  description:
    "Arrive in style with George Yachts. We offer seamless VIP transfers with luxury vehicles and professional chauffeurs in Athens, Mykonos, and across Greece.",
  alternates: {
    canonical: "https://georgeyachts.com/vip-transfers-greece",
  },
};

const ALL_TRANSFERS_QUERY = `*[_type == "transfer"] | order(_createdAt asc){
  _id,
  vehicleType,
  capacity,
  availability,
  includes,
  transfersFromTo,
  images[]{
    asset, 
    alt 
  }
}`;

const VipTransfersPage = async () => {
  let transfers = [];
  try {
    transfers = await sanityClient.fetch(ALL_TRANSFERS_QUERY);
  } catch (error) {
    console.error("Failed to fetch transfers from Sanity:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AboutUs
        heading="VIP TRANSFERS"
        subtitle="SEAMLESS & LUXURIOUS"
        paragraph="Your journey, curated from start to finish. Arrive in style with our fleet of luxury vehicles and professional chauffeurs."
        imageUrl="/images/vip-transfers.jpeg"
        altText="A luxury sedan interior"
      />
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <TransferSwiper key={transfer._id} transferData={transfer} />
        ))
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no vehicles listed for transfer. Please check back
            soon!
          </p>
        </section>
      )}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default VipTransfersPage;
