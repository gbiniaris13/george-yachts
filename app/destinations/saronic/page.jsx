import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import DestinationHero from "@/app/components/DestinationHero";
import { fetchYachtImagePool, imageFromPool, videoForRegion } from "@/lib/destination-images";
import "@/styles/service-page.css";

export const metadata = {
  title: "Saronic Gulf Yacht Charter | Hydra, Spetses, Poros, Aegina | George Yachts",
  description: "Charter a luxury yacht in the Saronic Gulf — Hydra, Spetses, Poros, Aegina. Close to Athens, perfect for short charters and weekend getaways. George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/destinations/saronic" },
};

const SARONIC_ISLANDS = [
  { name: "Aegina", desc: "Ancient Temple of Aphaia, famous pistachio groves, charming fishing harbor." },
  { name: "Angistri", desc: "Tiny pine-covered gem. Crystal waters, zero crowds. A local secret." },
  { name: "Poros", desc: "Lush pine forests, volcanic scenery, romantic clock tower overlooking the strait." },
  { name: "Hydra", desc: "No cars, no airports. Stone mansions, donkey trails, Leonard Cohen's island. Pure elegance." },
  { name: "Spetses", desc: "Old-money aristocracy, horse-drawn carriages, pine forests, Poseidonion Grand Hotel." },
  { name: "Dokos", desc: "Uninhabited islet between Hydra and the Peloponnese. World's oldest known shipwreck. Remote anchoring at its best." },
  { name: "Salamis", desc: "Battle-of-Salamis history, Athenian coastline, often skipped — a quiet detour between ports." },
  { name: "Methana", desc: "Saronic's volcanic peninsula. Thermal springs, dramatic lava landscapes, the surprise of the Gulf." },
];

const SARONIC_BASE = {
  region: "Saronic Gulf",
  introTitle: "Why Charter a Yacht in the Saronic Gulf?",
  introText: [
    "The Saronic Gulf is Athens' backyard paradise — a cluster of elegant islands just 1-3 hours from the capital. Hydra's car-free stone mansions, Spetses' old-money charm, Poros' pine-covered hills, and Aegina's pistachio groves offer a refined escape without the long sail.",
    "Perfect for short charters (3-5 days), weekend getaways, or day charters from Athens. The Saronic is also ideal for combining a yacht experience with city exploration — board in the morning, anchor in Hydra for lunch, and return to Athens for dinner at a Michelin-starred restaurant.",
  ],
  islandsTitle: "Every Saronic Island Worth Your Time",
  itineraryTitle: "4-Day Saronic Gulf Yacht Charter Itinerary",
  itinerary: [
    { day: 1, title: "Athens \u2192 Aegina", desc: "Board at Alimos marina. Short cruise to Aegina. Visit the Temple of Aphaia. Fresh fish dinner in the port." },
    { day: 2, title: "Aegina \u2192 Hydra", desc: "Morning cruise to Hydra. Explore the car-free town on foot. Swim at Vlychos beach. Cocktails at sunset." },
    { day: 3, title: "Hydra \u2192 Spetses", desc: "Sail to Spetses. Bike or horse-carriage around the island. Lunch at the Old Harbour. Evening at Poseidonion." },
    { day: 4, title: "Spetses \u2192 Poros \u2192 Athens", desc: "Morning swim in Poros strait. Lunch onboard. Return to Athens marina. Disembarkation." },
  ],
};

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "TouristDestination", name: "Saronic Gulf Yacht Charter", description: "Luxury yacht charter in the Saronic Gulf — Hydra, Spetses, Poros, Aegina", touristType: "Luxury Yacht Charter", geo: { "@type": "GeoCoordinates", latitude: 37.5, longitude: 23.5 }, containedInPlace: { "@type": "Country", name: "Greece" } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export const revalidate = 3600;

export default async function SaronicPage() {
  const pool = await fetchYachtImagePool();
  const data = {
    ...SARONIC_BASE,
    islands: SARONIC_ISLANDS.map((i) => ({
      ...i,
      image: imageFromPool(pool, i.name),
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Destinations", url: "https://georgeyachts.com/destinations" },
        { name: "Saronic", url: "https://georgeyachts.com/destinations/saronic" },
      ]} />
      <PageSchema />
      <DestinationHero
        imageUrl="https://cdn.sanity.io/images/ecqr94ey/production/87ae1ae73a3193daf60aec58384c29f89408c945-813x650.jpg?w=1920&h=900&fit=crop&auto=format"
        imageAlt="Saronic Gulf yacht charter Greece - Hydra Spetses Poros"
        videoUrl={videoForRegion("saronic")}
        title="The Saronic"
        subtitle="Hydra · Spetses · Poros · Aegina · Angistri · Dokos"
      />
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
