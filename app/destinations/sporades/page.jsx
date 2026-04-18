import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import "@/styles/service-page.css";

export const metadata = {
  title: "Sporades Yacht Charter | Skiathos, Skopelos, Alonissos | George Yachts",
  description: "Charter a luxury yacht in the Sporades islands — Skiathos, Skopelos, Alonissos. Lush green islands, Mamma Mia filming locations, marine park. George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/destinations/sporades" },
};

const data = {
  region: "Sporades",
  introTitle: "Why Charter a Yacht in the Sporades?",
  introText: [
    "The Sporades are Greece's green paradise — pine-forested islands rising from sapphire waters, with some of the most beautiful beaches in the Mediterranean. Skiathos' 60+ beaches, Skopelos' Mamma Mia church, and Alonissos' National Marine Park create a charter experience that feels untouched by mass tourism.",
    "Fewer yachts, more nature, absolute tranquility. The Sporades are for those who want Greece at its most authentic — swimming with monk seals in Europe's largest marine reserve, dining in villages where the fisherman is also the restaurant owner, and anchoring in bays where the only sound is the wind in the pines.",
  ],
  islandsTitle: "Which Sporades Islands Should You Visit?",
  islands: [
    { name: "Skiathos", desc: "60+ beaches, vibrant nightlife, Koukounaries — consistently ranked among Europe's finest beaches." },
    { name: "Skopelos", desc: "Mamma Mia's island. Stone villages, olive groves, Agios Ioannis chapel on the cliff." },
    { name: "Alonissos", desc: "National Marine Park, monk seal habitat, pristine underwater world. The eco-luxury choice." },
    { name: "Skyros", desc: "Most remote Sporades island. Wild horses, traditional pottery, authentic Greek island life." },
  ],
  itineraryTitle: "5-Day Sporades Yacht Charter Itinerary",
  itinerary: [
    { day: 1, title: "Skiathos", desc: "Board in Skiathos marina. Afternoon at Lalaria Beach — accessible only by sea. Old Town dinner." },
    { day: 2, title: "Skiathos \u2192 Skopelos", desc: "Cruise to Skopelos. Visit the Mamma Mia chapel. Lunch in Glossa village. Swim at Kastani Beach." },
    { day: 3, title: "Skopelos \u2192 Alonissos", desc: "Enter the National Marine Park. Snorkeling in crystal waters. Watch for monk seals and dolphins." },
    { day: 4, title: "Alonissos Marine Park", desc: "Full day exploring uninhabited islets — Peristera, Kyra Panagia. Ancient monastery visit. BBQ on a private beach." },
    { day: 5, title: "Alonissos \u2192 Skiathos", desc: "Morning swim at Alonissos old town beach. Return cruise to Skiathos. Disembarkation." },
  ],
};

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "TouristDestination", name: "Sporades Islands Yacht Charter", description: "Luxury yacht charter in the Sporades — Skiathos, Skopelos, Alonissos", touristType: "Luxury Yacht Charter", geo: { "@type": "GeoCoordinates", latitude: 39.1, longitude: 23.7 }, containedInPlace: { "@type": "Country", name: "Greece" } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function SporadesPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Destinations", url: "https://georgeyachts.com/destinations" },
        { name: "Sporades", url: "https://georgeyachts.com/destinations/sporades" },
      ]} />
      <PageSchema />
      <section className="svc-hero">
        <Image src="https://cdn.sanity.io/images/ecqr94ey/production/95a00b4760aedc3cd1f7a8959b026107cd4ca488-813x650.jpg?w=1920&h=900&fit=crop&auto=format" alt="Sporades yacht charter Greece - Skiathos Skopelos Alonissos" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Destination Guide</p>
          <h1 className="svc-hero__title">The Sporades</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Skiathos &middot; Skopelos &middot; Alonissos &middot; Skyros</p>
        </div>
      </section>
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
