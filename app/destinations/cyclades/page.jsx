import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import "@/styles/service-page.css";

export const metadata = {
  title: "Cyclades Yacht Charter | Mykonos, Santorini, Paros | George Yachts",
  description: "Charter a luxury yacht in the Cyclades islands — Mykonos, Santorini, Paros, Naxos, Milos, Antiparos. Curated crewed charters with IYBA member broker George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/destinations/cyclades" },
};

const data = {
  region: "Cyclades",
  introTitle: "Why Charter a Yacht in the Cyclades?",
  introText: [
    "The Cyclades are the iconic heart of Greek sailing — whitewashed villages cascading down volcanic cliffs, crystal-clear Aegean waters, and a nightlife scene that draws the global elite. From the cosmopolitan energy of Mykonos to the romantic sunsets of Santorini, from the untouched beauty of Milos to the bohemian charm of Paros.",
    "A crewed yacht charter is the ultimate way to experience the Cyclades. No ferry queues, no hotel check-ins — just island-hopping at your own pace with a dedicated crew, private chef, and your broker's insider knowledge of every anchorage, beach club, and hidden taverna.",
  ],
  islandsTitle: "Which Cyclades Islands Should You Visit?",
  islands: [
    { name: "Mykonos", desc: "Cosmopolitan nightlife, beach clubs, luxury dining. The St. Tropez of Greece." },
    { name: "Santorini", desc: "Volcanic caldera, world-famous sunsets, fine dining in Oia and Fira." },
    { name: "Paros", desc: "Traditional villages, golden beaches, excellent windsurfing. The family favorite." },
    { name: "Naxos", desc: "Largest Cycladic island. Mountain villages, ancient temples, long sandy beaches." },
    { name: "Milos", desc: "70+ beaches, volcanic rock formations, Kleftiko sea caves. Instagram's best-kept secret." },
    { name: "Antiparos", desc: "Bohemian tranquility, crystal caves, Tom Hanks' favorite Greek island." },
    { name: "Koufonisia", desc: "Turquoise lagoons, car-free island life. The Caribbean of Greece." },
    { name: "Folegandros", desc: "Dramatic cliffs, zero crowds, one of the most authentic Cycladic experiences." },
  ],
  itineraryTitle: "7-Day Cyclades Yacht Charter Itinerary",
  itinerary: [
    { day: 1, title: "Athens \u2192 Kea", desc: "Board in Athens marina. Cruise to Kea for a quiet first evening in Vourkari bay." },
    { day: 2, title: "Kea \u2192 Mykonos", desc: "Morning sail to Mykonos. Afternoon at Psarou beach club. Evening in Little Venice." },
    { day: 3, title: "Mykonos \u2192 Paros", desc: "Explore Naoussa village. Lunch at a waterfront taverna. Swim at Kolymbithres beach." },
    { day: 4, title: "Paros \u2192 Antiparos \u2192 Koufonisia", desc: "Morning cave visit in Antiparos. Afternoon sail to Koufonisia's turquoise lagoons." },
    { day: 5, title: "Koufonisia \u2192 Naxos", desc: "Beach morning in Koufonisia. Afternoon in Naxos town, visit the Portara temple." },
    { day: 6, title: "Naxos \u2192 Santorini", desc: "Early cruise to Santorini. Anchor in the caldera. Sunset dinner in Oia." },
    { day: 7, title: "Santorini \u2192 Athens", desc: "Morning swim at Red Beach. Return cruise to Athens marina. Disembarkation." },
  ],
};

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "TouristDestination", name: "Cyclades Islands Yacht Charter", description: "Luxury yacht charter in the Cyclades — Mykonos, Santorini, Paros, Naxos, Milos", touristType: "Luxury Yacht Charter", geo: { "@type": "GeoCoordinates", latitude: 37.4, longitude: 25.4 }, containedInPlace: { "@type": "Country", name: "Greece" } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function CycladesPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <section className="svc-hero">
        <Image src="https://cdn.sanity.io/images/ecqr94ey/production/72a5bc25ad09c9b4d0a872fdd36469d3d231ad0a-5472x3648.jpg?w=1920&h=900&fit=crop&auto=format" alt="Cyclades yacht charter Greece - Mykonos Santorini sailing" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Destination Guide</p>
          <h1 className="svc-hero__title">The Cyclades</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Mykonos &middot; Santorini &middot; Paros &middot; Naxos &middot; Milos &middot; Koufonisia</p>
        </div>
      </section>
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
