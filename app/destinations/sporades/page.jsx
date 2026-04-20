import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import DestinationHero from "@/app/components/DestinationHero";
import { imageFor, videoForRegion } from "@/lib/destination-images";
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
  islandsTitle: "Every Sporades Island Worth Your Time",
  // George 2026-04-20: "kane to idio kai se sporades". The main four
  // inhabited islands plus the uninhabited Marine Park gems that
  // define a Sporades charter — visitable only by yacht.
  islands: [
    { name: "Skiathos", desc: "60+ beaches, vibrant nightlife, Koukounaries — consistently ranked among Europe's finest beaches." },
    { name: "Skopelos", desc: "Mamma Mia's island. Stone villages, olive groves, Agios Ioannis chapel on the cliff." },
    { name: "Alonissos", desc: "National Marine Park, monk seal habitat, pristine underwater world. The eco-luxury choice." },
    { name: "Skyros", desc: "The remote Sporades. Wild horses, traditional pottery, Byzantine castle, authentic island life." },
    { name: "Peristera", desc: "Uninhabited Marine Park islet opposite Alonissos. Classical-era shipwreck, a diver's pilgrimage." },
    { name: "Kyra Panagia", desc: "Monastery-topped, goat-grazed Marine Park island. A deserted anchorage by day, silence by night." },
    { name: "Gioura", desc: "Protected islet of wild goats and sea caves — the western Aegean's hidden corner." },
    { name: "Skantzoura", desc: "Southernmost Sporades islet. Cypress forest, perfect beaches, almost never visited." },
  ].map((i) => ({ ...i, image: imageFor(i.name) })),
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
      <DestinationHero
        imageUrl="https://cdn.sanity.io/images/ecqr94ey/production/95a00b4760aedc3cd1f7a8959b026107cd4ca488-813x650.jpg?w=1920&h=900&fit=crop&auto=format"
        imageAlt="Sporades yacht charter Greece - Skiathos Skopelos Alonissos"
        videoUrl={videoForRegion("sporades")}
        title="The Sporades"
        subtitle="Skiathos · Skopelos · Alonissos · Skyros · Marine Park islets"
      />
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
