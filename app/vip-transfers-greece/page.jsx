import React from "react";
import { sanityClient } from "@/lib/sanity";
import TransferSwiper from "../components/TransferSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import { Check } from "lucide-react";

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

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header & Intro */}
          <div className="text-center mb-16">
            <h1
              className="text-3xl md:text-5xl font-bold text-[#02132d] mb-4 uppercase"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              VIP TRANSFERS — AVAILABLE ON REQUEST
            </h1>

            <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4 max-w-3xl mx-auto">
              <p>
                Premium chauffeur services in Athens and across the Greek
                islands, coordinated around your itinerary.
              </p>
              <p>
                We arrange discreet transportation with vetted professional
                drivers and high-standard vehicles. Airport arrivals, marina
                transfers, day schedules, multi-stop routing. One point of
                contact, clean execution.
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
                "Chauffeured transfers: airport, hotel, marina, intercity",
                "Driver on standby (full-day or multi-day)",
                "Multi-vehicle coordination for groups and events",
                "Meet & greet and luggage handling (upon request)",
                "Route planning aligned with yacht and flight schedules",
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
      {/* {transfers.length > 0 ? (
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
      )} */}
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default VipTransfersPage;
