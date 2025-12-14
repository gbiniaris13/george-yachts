import React from "react";
import { sanityClient } from "@/lib/sanity";
import VillaSwiper from "../components/VillaSwiper";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import ContactFormSection from "../components/ContactFormSection";
import { Check } from "lucide-react"; // Imported for the bullet points

// 1. Metadata added
export const metadata = {
  title: "Luxury Villas in Greece | Available on Request | George Yachts",
  description:
    "Luxury villas in Mykonos, Paros, Antiparos, Santorini & Athens Riviera. Curated privately via our partner network. Share dates & budget—get a shortlist.",
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
    asset, 
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

      {/* --- NEW CONTENT SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header & Intro */}
          <div className="text-center mb-16">
            <h1
              className="text-3xl md:text-5xl font-bold text-[#02132d] mb-4 uppercase"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              Luxury Villas — Available on Request
            </h1>
            <p
              className="text-lg md:text-xl text-[#DAA520] mb-8 font-medium italic"
              style={{ fontFamily: "var(--font-marcellus)" }}
            >
              Curated villas across Greece & the Mediterranean, sourced
              discreetly through our trusted partner network.
            </p>

            <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4 max-w-3xl mx-auto">
              <p>
                We don’t publish a public villa inventory — we curate options
                based on your dates, destination, group size, and preferred
                style. Through our partner network, we source handpicked villas
                in Mykonos, Paros, Antiparos, Santorini, the Athens Riviera and
                beyond.
              </p>
              <p>
                Expect discreet handling, fast turnaround, and clear
                recommendations — not endless links. Whether you need a
                beachfront retreat, a private estate with staff, or a villa
                perfectly paired with your yacht itinerary, we’ll tailor options
                that match your standard.
              </p>
              <p className="font-semibold text-[#02132d]">
                Share your requirements and we’ll return with a shortlist of
                suitable villas and availability.
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
                "Handpicked villas (beachfront, private estates, gated compounds)",
                "Chef, housekeeping, butler service & concierge support",
                "Security, chauffeurs, VIP arrivals & local coordination",
                "Villa + yacht itinerary planning (one point of contact)",
                "Last-minute sourcing & discreet bookings",
                "Family-friendly & event-ready options (upon request)",
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

      {/* --- HIDDEN VILLA LISTING (Commented out as requested) --- */}
      {/* {villas.length > 0 ? (
        villas.map((villa) => <VillaSwiper key={villa._id} villaData={villa} />)
      ) : (
        <section className="text-center py-20">
          <p>
            We currently have no villas listed for rental. Please check back
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

export default LuxuryVillasPage;
